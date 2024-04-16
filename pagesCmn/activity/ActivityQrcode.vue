<template>
	<view class="bg-dark">
		<cu-custom    :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">活动码</block>
		</cu-custom>
		<view class="card bg-dark">
		   <view class="" >
			   <view class="card-name">{{activity.title}}</view>
			   <view class="card-position text-cut">{{activity.content}}</view>
			   <view class="abs radiu bg-white" style="left: 50%; top: 50%; transform: translate(-50%,-50%);">
			   			   <image :src="activity.qrcode_info.tempFileURL" class="card-image "></image>
			   </view>
			   <view class="card-title">扫一扫上方二维码，查看活动</view>
		   </view>
	   </view>
    </view>
</template>

<script>
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    // #endif

    export default {
        data() {
            return {
               activity:{qrcode_info:{tempFileURL:''}},
            }
        },
        onLoad(opts) {
            this.getDetail(opts.id);
        },

        methods: {
            async getDetail(activityId){
                let that = this;
                let res = {};
                // #ifdef MP-WEIXIN
                res= await   wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'getActivityDetail',
                            id:activityId,
                        }
                    });
                that.activity = res.result.data || {}
                // #endif
                // #ifdef H5
                res= await   cloudbase.callFunction({
                    name:'web',
                    data:{
                        $url:'getActivityDetail',
                        id:activityId,
                    }
                });
                that.activity = JSON.parse(res.result.data) || {}
                // #endif
            },
        }
    }
</script>

<style>
	.card{
		width: 100%;
		height: 100%;
		position: absolute;
	}
	.card-name{
		font-size: 66rpx;
		text-align: center;
		margin-top: 200rpx;
	}
	.card-position{
		font-size: 40rpx;
		text-align: center;
		margin-top: 20rpx;
	}
	.radiu{
		border-radius: 50%;
		width: 500rpx;
		height: 500rpx;
	}
	.card-image{
		border-radius: 30%;
		width: 400rpx;
		height: 400rpx;
		display: inline-block;
		margin: 50rpx;
	}
	.card-title{
		text-align: center;
		font-size: 36rpx;
		margin-top: 800rpx;
	}

</style>
