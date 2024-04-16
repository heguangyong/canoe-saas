<template>
	<view>
		<cu-custom :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">访客二维码</block>
		</cu-custom>
		<view class="page bg-white padding ">
			<view class="grid col-1 grid-square">
				<view class="bg-img"><image :src="faceDevice.qrcode_info.tempFileURL"></image></view>
			</view>
			<view class="content-text text-center">
				<text class="text-grey margin-right-sm">{{faceDevice.name}}</text>
				<text>{{faceDevice.introduce}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState, mapGetters, mapActions} from 'vuex'
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    // #endif

	export default {
		data() {
			return {
				faceDevice:{name:'',introduce:'',qrcode_info:{tempFileURL:''}},
			};
		},
		onShow(){
			this.getFaceDevice()
		},
		methods:{
			async getFaceDevice(){
                let res = null;
                // #ifdef MP-WEIXIN
                res=  await wx.cloud.callFunction({
					name:'sys',
					data:{
						$url:'getCardDetailById',
						id:'79550af260d42e6521953f9d7e07f52b'
					}
				})
				this.faceDevice = res.result.data;
                // #endif
                // #ifdef H5
                res=  await cloudbase.callFunction({
                    name:'web',
                    data:{
                        $url:'getCardDetailById',
                        id:'b00064a760d42887224911590ce88b8c'
                    }
                })
                // console.log('device',res.result.data);
                this.faceDevice = JSON.parse(res.result.data);
                // #endif
			}
		}
	}
</script>

<style lang="scss">
	.page{
		z-index: 0;
		height: 100vh;
	}
	.content-text {
		font-size: 26rpx;
		color: #333;
		padding-top: 5px;
		padding-bottom: 10px;
	}
</style>
