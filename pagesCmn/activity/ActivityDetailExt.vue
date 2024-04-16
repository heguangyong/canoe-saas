<template>
	<view>
		<cu-custom :isBack="true" >
			<block slot="backText">返回</block>
			<block slot="content">活动详情</block>
		</cu-custom>
		<view class="page bg-white">
			<view class="cu-card case">
				<view class="cu-item shadow solid-bottom">
					<view class="image">
						<image :src="activity.cover"  mode="aspectFill"></image>
						<view class="cu-bar bg-shadeBottom"> <text class="text-cut">{{activity.content}}</text></view>
					</view>
					<view class="cu-list menu-avatar">
						<view class="cu-item" @tap="goQrcode(activity._id)">
							<view class="cu-avatar round lg">
								<image :src="activity.avatar" mode="aspectFill" class="cu-avatar round lg"></image>
							</view>
							<view class="content flex-sub">
								<view class="text-grey">{{activity.title}}</view>
								<view class="text-gray text-sm flex justify-between">
									报名截止日期：{{activity.sign_up}}
								</view>
							</view>
							<view class="action" >
								<text class="cuIcon-qr_code" style="font-size: 36px;"></text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="activity.video.length>0">
				<video  :src="activity.video" objectFit='contain' controls show-mute-btn muted></video>
			</view>
			<view v-for="(item,index) in activity.carousels" :key="index">
				<image :src="item" mode="widthFix" style="vertical-align: middle;"></image>
			</view>
			<view class="cu-tabbar-height"></view>
			<view class="cu-tabbar-height"></view>
		</view>
		<view  class="cu-bar bg-white tabbar border shop foot">
			<button class="action" @tap="goHome">
				<view class="cuIcon-home">
				</view>
				首页
			</button>
			<!-- #ifdef MP-WEIXIN -->
			<button class="action" open-type="share" :data-activity="activity" >
				<view class="cuIcon-share"></view> 分享
			</button>
			<!-- #endif -->
			<view class="action" @tap="startTalk">
				<view class="cuIcon-message">
				</view>
				咨询
			</view>
			<view  class="bg-white submit text-lg"></view>
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
                activity:{
                    _id:'',
                    qrcode:'',
                    content:''
                },
            }
        },
        onLoad(options) {
            let that = this;
            if(options.id) {
                that.activity._id = options.id;
                that.getDetail();
            }
            //扫码加好友
            else if (options.scene) {
                that.paramsStr +='scene='+options.scene;
                let res = {};
                let params = decodeURIComponent(options.scene).split("&");
                params.forEach(item => {
                    let paramMap = item.split("=");
                    res[paramMap[0]] = paramMap[1];
                    if(paramMap[0]=='qrcode'){
                        that.card.qrcode=paramMap[1];
                    }
                });
                that.getDetailByQrcode();
            }

            that.user.userInfo.recipient={};
        },

        onShareAppMessage(res){
            if(res.from=== 'button'){
                let  activity = res.target.dataset.activity;
                return{
                    title:activity.title,
                    imageUrl:activity.cover||'',
                    path:"/pagesCmn/activity/ShareActivityDetail?id="+activity._id,
                    success:function(r){
                        uni.showToast({
                            'icon':'success',
                            'title':'分享成功'
                        });
                    }
                }
            }
        },
        computed:{
            ...mapState(['user']),
        },
        methods: {
            ...mapMutations(['needWxAuth','wxAuth','updateUser']),

            ShareActivityDetail(){
                uni.showShareMenu({
                    withShareTicket:true,
                })
            },

            async getDetail(){
                let that = this;
                let res = null;
                // #ifdef MP-WEIXIN
                res = await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'getActivityDetail',
                        id:that.activity._id
                    }
                });
                that.activity = res.result.data;
                // #endif
                // #ifdef H5
                res = await cloudbase.callFunction({
                    name:'web',
                    data:{
                        $url:'getActivityDetail',
                        id:that.activity._id
                    }
                });
                that.activity = JSON.parse(res.result.data);
                // #endif

                let parseSignUp = that.activity.sign_up.date+' '+that.activity.sign_up.time;
                let parseSignIn = that.activity.sign_in.date+' '+that.activity.sign_in.time;
                that.activity.sign_up = parseSignUp;
                that.activity.sign_in = parseSignIn;
            },

            async getDetailByQrcode(){
                let that = this;
                let res = {};
                // #ifdef MP-WEIXIN
                res =await wx.cloud.callFunction({
                    name: 'cmn',
                    data: {
                        $url: 'getActivityDetailByQrcode',
                        qrcode: that.activity.qrcode,
                    }
                });
                that.activity = res.result.data;
                // #endif
                // #ifdef H5
                res =await cloudbase.callFunction({
                    name: 'web',
                    data: {
                        $url: 'getActivityDetailByQrcode',
                        qrcode: that.activity.qrcode,
                    }
                });
                that.activity = JSON.parse(res.result.data);
                // #endif
            },
            goWebLogin(){
                uni.navigateTo({
                    "url":"/pages/my/WebLogin"
                })
            },
            //开始聊天
            async startTalk(){
                let that = this;
                let bizCard = {_id:that.activity.card_id,name:that.activity.name,avatar:that.activity.avatar};
                if(that.needWxAuth(bizCard)){
                    // #ifdef MP-WEIXIN
                    that.wxAuth(bizCard);
                    // #endif
                    // #ifdef H5
                    that.goWebLogin();
                    // #endif
                    return;
                }
                // #ifdef MP-WEIXIN
                uni.navigateTo({
                    "url":"/pagesSys/site/service"
                });
                // #endif
                // #ifdef H5
                uni.navigateTo({
                    "url":"/pagesSys/site/WebService"
                })
                // #endif
            },

            goHome(){
                uni.reLaunch({
                    url: '/pages/site/trend',
                })
            },


            goQrcode(id){
                uni.navigateTo({
                    url:"/pagesCmn/activity/ActivityQrcode?id="+ id
                })
            },
        }
    }
</script>

<style>
	.page{
		z-index: 0;
		height: 100vh;
	}
	.screen-swiper{
		min-height: 766rpx;
	}
	video {
		width: 750rpx;
	}
	image {
		width: 750rpx;
	}

	/* 底部分享 */
	.popup {
		display: flex;
		flex-direction: column;
		height: 950rpx;
		padding-bottom:62px;
		position: fixed;
		left:0;
		bottom: 0;
		width:100%;
		z-index: 95;
		border-top-left-radius: 3%;
		border-top-right-radius: 3%;
	}

	.popup-close {
		position:absolute;
		top:30rpx;
		left:30rpx;
		font-size: 39rpx;
		text-align: center;
		font-weight: bold;
		z-index: 199;
	}

	.popup-title {
		margin-top:15rpx;
		line-height: 60rpx;
		font-size: 28rpx;
		padding: 5rpx 0;
		text-align: center;
		font-weight: bold;
	}

	.popup-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 5px;
		max-height: 950rpx;
	}

	/* 起到固定的作用 ,从而解决原页面触摸穿透的问题*/
	.prevent {
		width: 100%;
		height: 100%;
		/*自动回到顶部*/
		/*position: fixed;*/
		top: 0;
		left: 0;
		overflow: hidden;
	}

	/* 遮罩样式 */
	.shade{
		width:100%;
		height: 100%;
		position: fixed;
		top:0;
		left:0;
		z-index: 90;
	}

	.ups-height{
		height: 850rpx;
		position: fixed;
		left:0;
		bottom: 0;
		z-index: 99;
	}
</style>
