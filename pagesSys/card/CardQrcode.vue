<template>
	<view class="bg-dark">
		<cu-custom    :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">名片码</block>
		</cu-custom>
       <view class="card bg-dark">
		   <view class="" >
			   <view class="card-name">{{card.name}}</view>
			   <view class="card-position">{{card.corp_name}}</view>
			   <view class="abs radiu bg-white" style="left: 50%; top: 50%; transform: translate(-50%,-50%);">
				   <!-- #ifdef MP-WEIXIN -->
				   <image :src="card.qrcode_info.fileID" class="card-image"></image>
				   <!-- #endif -->
				   <!-- #ifdef H5 -->
				   <image :src="card.qrcode_info.tempFileURL" class="card-image"></image>
				   <!-- #endif -->
			   </view>
			   <view class="card-title">扫一扫上方二维码，查看名片</view>
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
               card:{qrcode_info:{fileID:'',tempFileURL:''}},
            }
        },
        onLoad(opts) {
			this.getDetail(opts.id);
        },

        methods: {
            async getDetail(cardId){
                let that = this;
                let res = {};
                // #ifdef MP-WEIXIN
                res = await wx.cloud.callFunction({
								name:'sys',
								data:{
									$url:'getCardDetailById',
									id:cardId
								}
							});
				that.card = res.result.data || {};
                // #endif
                // #ifdef H5
                res = await cloudbase.callFunction({
                    name:'web',
                    data:{
                        $url:'getCardDetailById',
                        id:cardId
                    }
                });
                that.card = JSON.parse(res.result.data) || {}
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
