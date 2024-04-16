<template>
    <view>
        <cu-custom :isBack="true">
			<block slot="backText">返回</block>
            <block slot="content">我的名片</block>
        </cu-custom>
       <ups-card :card="card">
        </ups-card>
        <view class="cu-list menu-avatar no-padding">
            <view class="cu-item  card-radius margin-top-xxs margin-left-xs margin-right-xs margin-bottom-xs shadow bg-white.light"
                  v-for="(account,index) in accounts" :key="index">
                <view  class="cu-avatar bg-white" >
                    <image class="cu-avatar "><text class="text-grey" :class="'cuIcon-' + account.name" style="font-size: 36px;"></text></image>
                </view>

                <view class="content" >
                    <view class="text-grey">{{account.title}}
                        <text class="text-abc"></text>
                    </view>
                    <view class="text-gray text-sm text-cut">{{account.remark}}</view>
                </view>
                <view class="action">
                    <switch class='green' @change="switchState(account,index)" :class="account.is_forbidden?'':'checked'" :checked="!account.is_forbidden"></switch>
                    <view v-if="account.is_forbidden" class="text-gray text-xs" >已禁用</view>
                    <view v-else class="text-green text-xs" >已开通</view>
                </view>
            </view>
        </view>
        <view class="cu-tabbar-height"></view>
        <view class="cu-tabbar-height"></view>
        <view class="cu-bar bg-white tabbar border shop foot">
            <button class="action" @tap="goMy">
                <view class="cuIcon-my"></view>我的
            </button>
            <button class="action" open-type="share" >
                <view class="cuIcon-share"></view> 分享名片
            </button>
            <view class="bg-white submit text-lg"></view>
        </view>
    </view>
</template>

<script>

    import { mapState } from 'vuex'
    import upsCard from '@/components/ups-card/index.vue'
    import uniRate from '@/components/uni-rate/uni-rate.vue'
    export default {
        components:{
            'ups-card':upsCard,
            "uni-rate":uniRate
        },
        data() {
            return {
                card:{_id:'',user_id:'',name:''},
                cardUser:{},//名片对应用户
                accounts:[]//所有系统账号
            }
        },

        onLoad: function (options) {
            let that = this;
            console.log('options',options);
            if (options.id) {
                that.card._id=options.id;
                that.getDetailById(options.id);
            }
        },

		onShareAppMessage(res){
			if(res.from==='button'){
			}
			return{
				title:'这是'+this.card.name+'的名片，请惠存。',
                imageUrl:this.card.cover||'',
				path:"/pagesSys/card/ShareCardDetail?id="+this.card._id,
				success:function(res){
				}
			}
		},
        computed:{
            ...mapState(['user']),
        },
        methods: {
            async getDetailById(id){
                let that = this;
                let res = {};
                let bizCard = null;
                res = await wx.cloud.callFunction({
                    name: 'sys',
                    data: {
                        $url: 'getCardDetailById',
                        id: id,
                    }
                });
                that.card = res.result.data;

                res = await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'getUserDetail',
                        id:that.card.user_id,
                    }
                });
                that.cardUser = res.result.data;

                res= await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'getCardDetailById',
                        id:that.user.userInfo.bizCardId,
                    }
                })
                bizCard = res.result.data;

                //比对系统提供服务列表与用户已有服务列表
                //把系统列表中与用户列表重叠的功能项，按照用户列表中的是否禁止来显示
                for(let i in bizCard.accounts){
                    let baseAccount = bizCard.accounts[i];
                    for(let j in that.cardUser.userInfo.accounts){
                        let userAccount = that.cardUser.userInfo.accounts[j];
                        if(baseAccount.account_key==userAccount.account_key){
                            baseAccount.is_forbidden = userAccount.is_forbidden;
                            baseAccount.view_count = userAccount.view_count;
                            break;
                        }
                    }
                }
                that.accounts = bizCard.accounts;
                that.$forceUpdate();
            },

			async switchState(account,index){
                let that = this;
                that.accounts[index].is_forbidden = !account.is_forbidden;
                that.cardUser.userInfo.accounts = that.accounts;
                //同步更新当前用户权限备用site列表
                let sites = that.cardUser.userInfo.sites;
                for(let i in sites){
                    if(sites[i].bizCardId==that.cardUser.userInfo.bizCardId){
                        sites[i].accounts=that.accounts;
                        break;
                    }
                }
                // that.cardUser.userInfo.sites=sites;
                that.$forceUpdate();
                await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'updateUserInfo',
                        id:that.cardUser._id,
                        userInfo:that.cardUser.userInfo,
                    }
                })
			},

            goMy(){
                uni.reLaunch({
                    url: '/pages/my/home',
                })
            },
           
        }
    }
</script>

<style lang="scss" scoped>
    .page{
        z-index: 0;
        height: 100vh;
    }
</style>
