<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<cu-custom    :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">活动详情</block>
		</cu-custom>
		<!-- #endif -->
		<view class="margin-left cu-bar tabbar">
			<view>
				<image :src="activity.actions[0].img1" style="width: 400rpx; height: 60rpx;"></image>
			</view>
			<view class="action">
				<view class="cuIcon-cu-image">
				</view>
				<view class="text-gray"></view>
			</view>
			<view class="action">
				<view class="cuIcon-cu-image" @tap="goHome">
					<image :src="activity.home_icon" style="width: 50rpx; height: 50rpx;"></image>
				</view>
				<view class="">首页</view>
			</view>
		</view>
		<view class="margin-left" style="margin-top:-30rpx;">
			<view class="text-bold text-lg">精益求精 睿智精选</view>
			<view class="text-bold">"十分精选"定制产品交流会</view>
		</view>

		<view class="padding-xs text-center margin-top solid-top">
			<view class="text-lg padding-xs">
				<texxt class="margin-top text-bold text-lg ">☆  会务服务  ☆</texxt>
			</view>
		</view>
		<view class="margin-left margin-right padding">
			<text class="text-box  padding-sm text-red" scroll-y="true">
				*会议中遇到任何问题，都可以根据实际需求与我们联系，以获支持。
			</text>
		</view>
		<view class="margin-left margin-right padding">
			<view class="text-bold">【会务联系】</view>
			<view class="margin-top">
				<text class="  padding-sm" space="nbsp" >
					中欧基金： 孙   慧   13718384265
				</text>
			</view>
			<view>
				<text style="margin-left:140rpx;"></text>
				<text class="  padding-sm" space="nbsp" >
					唐艺芮   18221425241
				</text>
			</view>
			<view class="margin-top">
				<text class="text-box  padding-sm" space="nbsp" scroll-y="true">
					会务负责： 黄   波   13816389742
				</text>
			</view>
		</view>
		<view class="margin-left-xxl margin-right-xxl flex align-center" >
			<image :src="activity.logo" mode="aspectFill" class="padding-xxl margin-left-xxl margin-right-xxl" style="width: 100%;"></image>
		</view>
		<view class="cu-tabbar-height"></view>
		<view class="cu-tabbar-height"></view>
	</view>
</template>

<script>
    import { mapState } from 'vuex'
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    // #endif

    export default {
        data() {
            return {
                activity:{
                    _id:'',
                    qrcode:'',
                    content:'',
                    actions:[]

                },
            }
        },
        onLoad(options) {
            let that = this;
            if(options.id) {
                that.activity._id = options.id;
                that.getDetail();
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
            ...mapState(['user']),
        },
        methods: {
            async getDetail(){
                let that = this
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



            goHome(){
                uni.navigateBack();
            },
        }
    }
</script>

<style>
</style>
