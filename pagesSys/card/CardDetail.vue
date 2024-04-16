<template>
    <view>
        <cu-custom :isBack="true">
			<block slot="backText">返回</block>
            <block slot="content">我的面板</block>
        </cu-custom>
        <view class="cu-list menu-avatar">
            <view class="cu-item  card-radius margin-sm bg-white.light shadow" style="background-color:#ececec;height:110rpx;">
				<view  class="cu-avatar round"  @tap="goBizCard">
					<image class="cu-avatar round"  :src="user.userInfo.bizCardAvatar"></image>
				</view>
				<view class="content"  @tap="goBizCard">
					<view class="text-df text-bold">{{user.userInfo.bizCardName}}
						<text class="text-abc"></text>
					</view>
				</view>
                <view v-if="user.userInfo.sites && user.userInfo.sites.length>1" class="action">
                    <view class="margin-right text-grey text-bold cuIcon-moreandroid" style="font-size: 20px;" @tap="showModal"></view>
                </view>
            </view>
			<ups-card :card="card">
			</ups-card>
            <view class="cu-item  card-radius margin-sm shadow bg-white.light" style="height:110rpx;"
                  v-for="(account,index) in accounts" v-if='index>=1' :key="index" @tap="go(account)">
                <view  class="cu-avatar bg-white" >
                    <image class="cu-avatar "><text class="text-grey" :class="'cuIcon-' + account.name" style="font-size: 36px;"></text></image>
                </view>
                <view class="content" >
                    <view class="text-grey">{{account.title}}
                        <text class="text-abc"></text>
                    </view>
                    <view class="text-gray text-sm text-cut">{{account.remark}}</view>
                </view>
            </view>
        </view>
        <view class="cu-modal" :class="modalName=='bizCardModal'?'show':''" @tap="hideModal">
            <view class="cu-dialog" @tap.stop="">
                <view class="cu-bar bg-white justify-end">
                    <view class="content">切换</view>
                    <view class="action" @tap="hideModal">
                        <text class="cuIcon-close text-red"></text>
                    </view>
                </view>
                <radio-group class="block" @change="bizCardChange">
                    <view class="cu-list menu text-left">
                        <view class="cu-item" v-for="(site,index) in user.userInfo.sites" :key="index">
                            <label class="flex justify-between align-center flex-sub">
                                <view class="flex-sub">{{site.bizCardName}}</view>
                                <radio class="round" :class="site.bizCardId==user.userInfo.bizCardId?'checked':''"
                                       :checked="site.bizCardId==user.userInfo.bizCardId"
                                       :value="site.bizCardId"></radio>
                            </label>
                        </view>
                    </view>
                </radio-group>
            </view>
        </view>
        <view class="cu-tabbar-height"></view>
        <view class="cu-tabbar-height"></view>
        <view  class="cu-bar bg-white tabbar border shop foot">
            <button class="action" @tap="goMy">
                <view class="cuIcon-my"></view>我的
            </button>
            <button class="action" open-type="share" >
                <view class="cuIcon-share"></view> 分享名片
            </button>
            <view class="action" @tap="showAuthCode">
                <view class="cuIcon-lock"></view>授权码
            </view>
            <view class="bg-red submit text-lg" @tap="editCard">名片编辑</view>
        </view>
    </view>
</template>

<script>

    import { mapState,mapMutations } from 'vuex'
    import upsCard from '@/components/ups-card/index.vue'
    import uniRate from '@/components/uni-rate/uni-rate.vue'

    export default {
        components:{
            'ups-card':upsCard,
            "uni-rate":uniRate
        },
        data() {
            return {
                card:{name:'',remark:''},
                accounts:[],//账号列表
                modalName: null//模态框名称
            }
        },

        onReady() {
            this.getDetail();
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
            ...mapMutations(['updateUser']),
            async getDetail(){
                let that = this;
                if(that.user._id){
                    let res = {};
                    res = await wx.cloud.callFunction({
                        name:'sys',
                        data:{
                            $url:'getCardDetailByUserId',
                            userId:that.user._id
                        }
                    });
                    that.card = res.result.data;
                    that.cardId=that.card._id;
                    that.accounts=[];
                    that.user.userInfo.accounts.forEach(each=>{
                        if(!each.is_forbidden){
                            that.accounts.push(each);
                        }
                    });
                }
            },

            go(account){
                uni.navigateTo({"url":account.url,});
            },

			async editCard(){
				uni.navigateTo({
					url:'/pagesSys/card/CardInput',
				})
			},

            goMy(){
                uni.reLaunch({
                    url: '/pages/my/home',
                })
            },

            //查看跨端授权码
            async showAuthCode(){
                if(!this.card.phone || this.card.phone.length!=11){
                    uni.showToast({
                        icon:'none',
                        title:'请先完善手机号'
                    });
                    setTimeout(()=>{
                        uni.navigateTo({
                            url:'/pagesSys/card/CardInput',
                        })
                    },1000);
                    return;
                }
                uni.showModal({
                    icon:'none',
                    title:'授权码',
                    content:this.card.auth_code,
                    cancelText: '更新',
                    confirmText: '确认',
                    success: res => {
                        if (res.cancel) {
                            this.card.auth_code = '';
                            //设置长度，这里看需求，我这里设置了4
                            let codeLength = 4;
                            //设置随机字符
                            let random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                            //循环codeLength 我设置的4就是循环4次
                            for (let i = 0; i < codeLength; i++) {
                                //设置随机数范围,这设置为0 ~ 36
                                let index = Math.floor(Math.random() * 9);
                                //字符串拼接 将每次随机的字符 进行拼接
                                this.card.auth_code += random[index];
                            }
                            this.$forceUpdate();
                            wx.cloud.callFunction({
                                name:'sys',
                                data:{
                                    $url:'updateCard',
                                    card:this.card
                                }
                            });
                            this.showAuthCode();
                        }
                    }
                })
            },
			async goBizCard(){
				if(this.user.userInfo.bizCardId!=''){
					uni.navigateTo({
						"url": "/pagesSys/card/BizAboutExt?id="+this.user.userInfo.bizCardId,
					})
				}
			},
            showModal() {
                this.modalName = 'bizCardModal'
            },
            hideModal() {
                this.modalName = null
            },
            async bizCardChange(e) {
                let that = this;
                let bizCardId = e.detail.value;
                for(let i in that.user.userInfo.sites){
                    if(bizCardId == that.user.userInfo.sites[i].bizCardId){
                        that.user.userInfo.bizCardId = that.user.userInfo.sites[i].bizCardId;
                        that.user.userInfo.bizCardName = that.user.userInfo.sites[i].bizCardName;
                        that.user.userInfo.bizCardAvatar = that.user.userInfo.sites[i].bizCardAvatar;
                        that.user.userInfo.role = that.user.userInfo.sites[i].role;
                        //相应权限也需要切换
                        that.user.userInfo.accounts = that.user.userInfo.sites[i].accounts;
                        break;
                    }
                }
                that.updateUser(that.user);
                await wx.cloud.callFunction({
                   name:'sys',
                   data:{
                       $url:'updateUserInfo',
                       id:that.user._id,
                       userInfo:that.user.userInfo
                   }
                });
                that.getDetail();
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
