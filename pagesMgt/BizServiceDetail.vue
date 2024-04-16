<template>
    <view>
        <cu-custom  :isBack="true">
			<block slot="backText">返回</block>
            <block slot="content">服务详情</block>
        </cu-custom>
		<scroll-view scroll-y>
			<view class="padding-xs">
				<view class="solid-bottom text-df padding">
					<view class="text-grey">服务编号：{{account.account_key}}</view>
					<view class="text-grey">服务名称：{{account.title}}</view>
					<view class="text-grey">服务图标：{{account.name}}</view>
					<view class="text-grey">服务链接：{{account.url}}</view>
					<view class="text-grey">是否可见：{{account.is_show}}</view>
					<view class="text-grey">是否禁用：{{account.is_forbidden}}</view>
					<view class="text-grey">访问角色：{{account.need_role}}</view>
					<view class="text-grey">用户账号：{{account.user_name}}</view>
					<view class="text-grey">用户密码：{{account.password}}</view>
					<view class="text-grey">是否支持H5：{{account.support_h5}}</view>
					<view class="text-grey">H5链接：{{account.h5_link}}</view>
				</view>
			</view>
			<view class="padding-xs">
				<view class="solid-bottom text-df padding">
					<view class="text-grey">接口列表：</view>
					<textarea class="text-box font40 text-grey bg-gray width100 padding-sm solid" style="height: 500rpx;" scroll-y="true" maxlength="1200">{{JSON.stringify(account.api_map)}}
					</textarea>
				</view>
			</view>
			<view class="padding-xs">
				<view class="solid-bottom text-df padding">
					<view class="text-grey">备注：</view>
					<textarea class="text-box font40 text-grey bg-gray width100 padding-sm solid" style="height: 500rpx;" scroll-y="true" maxlength="1200">{{account.remark}}
					</textarea>
				</view>
			</view>
		</scroll-view>
		<view class="cu-tabbar-height"></view>
		<view class="cu-tabbar-height"></view>
		<view  class="cu-bar bg-white tabbar border shop foot">
			<button class="action" @tap="goMy">
				<view class="cuIcon-my"></view>我的
			</button>
			<button class="action" @tap="goServiceList" >
				<view class="cuIcon-list"></view> 列表
			</button>
			<button class="action" @tap="doRemove" >
				<view class="cuIcon-delete"></view> 删除
			</button>
			<view v-if="account.is_forbidden" class="bg-red submit text-lg"   @tap="setServiceStatus">启用服务</view>
			<view v-else class="bg-yellow submit text-lg"   @tap="setServiceStatus">禁用服务</view>
		</view>
    </view>
</template>

<script>
    import { mapState,mapMutations } from 'vuex'
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    // #endif

    export default {
        data() {
            return {
                bizCard:{},
				account:{
                    account_key:'',
                    title:'',
                    name:'',
                    url:'',
                    is_show:false,
                    is_forbidden:false,
                    need_role:'',
					user_name:'',
					password:'',
					support_h5:false,
					h5_link:'',
                    api_map:{},
					remark:''
				}
            }
        },
		onLoad(options){
            console.log('options',options);
            this.account.account_key=options.account_key;
			this.getDetail();
		},
        computed:{
            ...mapState(['user']),
        },
        methods: {
            async getDetail(){
                let that = this;
                let res = null;
                // #ifdef MP-WEIXIN
                res= await wx.cloud.callFunction({
                    name: 'sys',
                    data: {
                        $url: 'getCardDetailById',
                        id: that.user.userInfo.bizCardId,
                    }
                });
                that.bizCard = res.result.data;
                // #endif
                // #ifdef H5
                res= await wx.cloud.callFunction({
                    name: 'web',
                    data: {
                        $url: 'getCardDetailById',
                        id: that.user.userInfo.bizCardId,
                    }
                });
                that.bizCard = JSON.parse(res.result.data);
                // #endif
                for(let index in that.bizCard.accounts){
                    let account = that.bizCard.accounts[index];
                    if(account.account_key==that.account.account_key){
						that.account = account;
						break;
                    }
                }
            },

            goMy(){
				uni.reLaunch({
				    "url":"/pages/my/home"
				})
			},

			goServiceList(){
                uni.navigateTo({
                    "url":"/pagesMgt/BizServiceList"
                })
			},

            async doRemove(){
                let that = this;
                let accounts = [];
                for(let index in that.bizCard.accounts){
                    let account = that.bizCard.accounts[index];
                    if(account.account_key!=that.account.account_key){
                        accounts.push(account);
					}
                }
                that.bizCard.accounts= accounts;
                that.$forceUpdate();
                // #ifdef MP-WEIXIN
                await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'updateCard',
                        card:that.bizCard,
                    }
                });
                // #endif
                // #ifdef H5
                await cloudbase.callFunction({
                    name:'sys',
                    data:{
                        $url:'updateCard',
                        card:that.bizCard,
                    }
                });
                // #endif
                uni.showToast({ icon:'success',title:'删除成功'})
                setTimeout (() => {
                    uni.navigateTo({
                        url:'/pagesMgt/BizServiceList',
                    });
                } , 1000 )
            },


            async setServiceStatus(){
                let that = this;
                that.account.is_forbidden = !that.account.is_forbidden;
                for(let index in that.bizCard.accounts){
                    let account = that.bizCard.accounts[index];
                    if(account.account_key==that.account.account_key){
						account= that.account;
						break;
                    }
                }
                // #ifdef MP-WEIXIN
                await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'setServiceStatus',
                        id:that.bizCard._id,
                        accounts:that.bizCard.accounts,
                    }
                });
                // #endif
                // #ifdef H5
                await cloudbase.callFunction({
                    name:'sys',
                    data:{
                        $url:'setServiceStatus',
                        id:that.bizCard._id,
                        accounts:that.bizCard.accounts,
                    }
                });
                // #endif
                that.$forceUpdate();
                uni.showToast({
                    icon:'success',
                    title:that.account.is_forbidden?'服务已停止':'服务已开启'
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .page{
        z-index: 0;
        /*height: 100vh;*/
    }

    .screen-swiper{
        min-height: 766rpx;
    }
	

	.btn-share{
	    background-color:transparent;
	    border-style:none;
	}
	button::after {
	    border: 0;
	}
</style>