<template>
	<view class="" :class="isUps == true ? 'prevent' : ''">
		<cu-custom  >
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
				<video  :src="activity.video" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover"></video>
			</view>
			<view v-for="(item,index) in activity.carousels" :key="index">
				<image :src="item" mode="aspectFill"></image>
			</view>
			<view class="cu-tabbar-height"></view>
			<view class="cu-tabbar-height"></view>
		</view>
		<view v-if="!isUps" class="cu-bar bg-white tabbar border shop foot">
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
			<view v-if="activity.is_open" class="bg-green submit text-lg"   @tap="tapJoin">立即报名</view>
			<view v-else class="bg-gray submit text-lg">报名已终止</view>
		</view>
		<!-- 遮罩 -->
		<view class="shade" v-if="isUps"></view>
		<!-- 底部展现弹窗 -->
		<uni-popup ref="showPopup" type="bottom" @change="change">
			<!-- 底部活动预定弹窗 -->
			<view class="popup bg-white">
				<text class="cuIcon-close popup-close" @click="cancel('Popup')"></text>
				<text class="popup-title" >报名</text>
				<view class="popup-content">
					<scroll-view class="ups-height" scroll-y="true">
						<view>
							<view class="cu-form-group">
								<view class="title">姓名</view>
								<input class="text-left" placeholder="报名人姓名" @input="inputName" :value="user.userInfo.recipient.name"></input>
							</view>
							<view class="cu-form-group">
								<view class="title">电话</view>
								<input class="text-left" placeholder="联系电话" type="tel" @input="inputPhone" :value="user.userInfo.recipient.phone"></input>
								<!-- #ifdef MP-WEIXIN -->
								<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="cu-btn round  line-grey"> 授权手机号 </button>
								<!-- #endif -->
							</view>
							<view class="cu-form-group">
								<view class="title">备注</view>
								<input class="text-left" placeholder="有啥想说的" @input="inputRemark" :value="user.userInfo.recipient.remark"></input>
							</view>
							<view class="cu-bar solid-bottom margin-top-xxs radius"></view>
							<view class="cu-bar btn-group  foot bg-white">
								<button class="cu-btn   round line-grey"   @click="submitOrder"> 确认报名 </button>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
    import { mapState,mapMutations } from 'vuex'
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    // #endif

    export default {
        components:{
            "uni-popup":uniPopup,
        },
        data() {
            return {
                isUps:false,
                activity:{
                    _id:'',
					qrcode:'',
                    content:''
                },
                recipient:{}
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
                        that.activity.qrcode=paramMap[1];
                    }
                });
                that.getDetailByQrcode();
            }
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
            ...mapState(['needAuthFlag','user','cardAccount']),
        },
        methods: {
            ...mapMutations(['needWxAuth','wxAuth','updateUser','updateUserAuth']),

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
                that.authBizInfo = {_id:that.activity.card_id,name:that.activity.name,avatar:that.activity.avatar};
                that.needWxAuth(that.authBizInfo);
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
                let parseSignUp = that.activity.sign_up.date+' '+that.activity.sign_up.time;
                let parseSignIn = that.activity.sign_in.date+' '+that.activity.sign_in.time;
                that.activity.sign_up = parseSignUp;
                that.activity.sign_in = parseSignIn;
                that.authBizInfo = {_id:that.activity.card_id,name:that.activity.name,avatar:that.activity.avatar};
                that.needWxAuth(that.authBizInfo);
            },
            goWebLogin(){
                uni.navigateTo({
                    "url":"/pages/my/WebLogin"
                })
            },

            //开始聊天
            async startTalk(){ 
				let that = this;
                if(that.needAuthFlag){
                    that.wxAuth(that.authBizInfo);
                    setTimeout (() => {
                        that.startTalk();
                    } , 2000 );
                    return;
                }
                that.updateUserAuth(that.authBizInfo);
                // #ifdef MP-WEIXIN
                setTimeout (() => {
					uni.navigateTo({
						"url":"/pagesSys/site/service"
					});
                } , 1000 );
                // #endif
                // #ifdef H5
                uni.navigateTo({
                    "url":"/pagesSys/site/WebService"
                })
                // #endif
            },

            goHome(){
                let that = this;
                if(that.needAuthFlag){
                    that.wxAuth(that.authBizInfo);
                    setTimeout (() => {
                        that.goHome();
                    } , 2000 );
                    return;
                }
                that.updateUserAuth(that.authBizInfo);
                setTimeout (() => {
                    uni.reLaunch({
                        "url":"/pages/site/trend?id="+that.authBizInfo._id,
                    })
                } , 1000 )
            },
            tapJoin(){
				let that = this;
                if(that.needAuthFlag){
                    that.wxAuth(that.authBizInfo);
                    setTimeout (() => {
                        that.tapJoin();
                    } , 2000 );
                    return;
                }
                that.updateUserAuth(that.authBizInfo);
                that.$nextTick(() => {
                    that.isUps=true;
					that.recipient.name=that.user.userInfo.nickName;
                    that.$refs['showPopup'].open();
                })
            },
			async getPhoneNumber(e) {
				let that = this;
			    const res = await wx.cloud.callFunction({
			        name: 'sys',
			        data: {
			            $url:'getPhone',
			            cloudId:e.detail.cloudID
			        }
			    });
				if(res.result.code == 0){
					wx.showToast({
						title: '授权成功',
					    success: function() {
					    }
					});
					that.recipient.phone = res.result.data.phoneNumber;
					that.$forceUpdate();
				}
			}, 
            cancel(type){
                this.$refs['show' + type].close()
            },
            change(e){
                if(e.show){
                    this.isUps = true;
                }else{
                    this.isUps =false;
                }
            },
            inputName(e){
                this.user.userInfo.recipient.name = e.detail.value
            },
            inputPhone(e){
                this.user.userInfo.recipient.phone = e.detail.value
            },
            inputRemark(e){
                this.user.userInfo.recipient.remark = e.detail.value
            },
            //提交订单//活动跟商品公用该方法
            async submitOrder(){
                let that = this;
                let msg = '活动报名';
                //enrolled 对应活动中的报名状态
                let items =[{id:that.activity._id,num:1,state:'enrolled',detail:that.activity}];
				let order ={};
				order.seller_avatar=that.activity.avatar;
				order.seller_name=that.activity.name;
				order.user_id=that.user._id;
				order.avatar= that.user.userInfo.avatarUrl;
				order.name= that.user.userInfo.nickName;
				order.items=items;
				order.recipient=that.recipient;
				order.activity_id=that.activity._id;
				order.item_num=1;
				order.is_finished=false;
				order.order_type='activity';
                // #ifdef MP-WEIXIN
                await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'processOrder',
                        order:order
                    }
                });
                // #endif
                // #ifdef H5
                await cloudbase.callFunction({
                    name:'cmn',
                    data:{
                        $url:'processOrder',
                        order:order
                    }
                });
                // #endif
                uni.showToast({
                    icon:'success',
                    title:msg+'成功'
                });
                that.$refs['showPopup'].close();
                setTimeout (() => {
                    uni.navigateTo({
                        url:'/pages/my/ActivityOrderList',
                    });
                } , 1000 )
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
