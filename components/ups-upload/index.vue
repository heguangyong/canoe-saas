<template>
	<view>
		<view v-if="fileType==='image'" class="flex-sub" ><!-- class="grid col-4 grid-square flex-sub"> -->
			<view v-if="uploadFile" class="bg-img" @tap="viewFile" :data-url="uploadFile" >
				<image  class="cu-avatar" :src="uploadFile" mode="aspectFill"></image>
				<view class="cu-avatar bg-red" @tap.stop="deleteFile">
					<text class='cuIcon-close'></text>
				</view>
			</view>
			 <view v-else class="solids" @tap="chooseFile">
				<text class='cuIcon-cameraadd'></text>
			</view>
		</view> 
		<view v-else class="grid col-2 grid-square flex-sub rel">
			<view v-if="uploadFile">
				<video v-if="uploadFile" :src="uploadFile" object-fit="cover" controls muted ></video>	
			</view>
			<view v-else class=" grid col-4 grid-square flex-sub solids" @tap="chooseFile" >
				<text class='iconfont icon-shangchuanshipin text-gray abs center'></text>
			</view>
		</view>
	</view>
</template>

<script>
	import { cloudUploadPath } from '@/utils/cmnUtils.js'
	
	export default {
		name:"UpsUpload",
		props:{
			fileType:{
				type:String,
				required:true
			},
			uploadFile:{
				type:String,
				required:true
			}
		},
		data() {
			return {
			};
		},
		methods:{
			chooseFile() {
				let that = this
				if(this.fileType==="image"){
					uni.chooseImage({
						count: 1, //默认1
						sizeType: ['original','compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album','camera'], //从相机选择或拍摄
						success: (uRes) => {
							for(let tempFilePath of uRes.tempFilePaths){
								const spl = tempFilePath.split(".");
								const ext=spl[spl.length-1];
								const uploadTask = wx.cloud.uploadFile({
								  cloudPath: cloudUploadPath() + `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}.`+ext,
								  filePath: tempFilePath,
								}).then(res => {
									uni.hideLoading();
									if(res.fileID){
										that.$emit("upload",res.fileID)	
										wx.cloud.callFunction({
											name:'sys',
											data:{
											  $url:'cloudImgSecCheck',
											  fileID:res.fileID
											}
										}).then(secRes=>{
											console.log(secRes.result)
											if(secRes.result.code==0){
											
											}else{
												uni.showToast({
													icon:'none',
													title:"图片含有违规内容，请重新选择!"
												})
												return;
											}
										})
									}							
								})		 
							}
						},
					fail:function (e) {
						console.log(e)
					}
				});
				}else if(this.fileType==="video"){
					uni.chooseVideo({
						count:1,
						maxDuration:15,
						sourceType: ['camera', 'album'],
						compressed: false,
						success: function (uRes) {
							console.log(uRes)
							uni.showLoading({title: '加载中',});
							const uploadTask = wx.cloud.uploadFile({
							  cloudPath: cloudUploadPath() +`${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}.png`,
							    filePath: uRes.tempFilePath,
							  }).then(res => {
							      uni.hideLoading();
									if (res.statusCode < 300) {
										that.$emit("upload",res.fileID)
									}
							  })
						},
						fail:function (e) {
							console.log(e)
						}
					});
				}
			},
			viewFile(e) {
				wx.previewImage({
					urls: this.uploadFile,
					current: e.currentTarget.dataset.url
				});	
			},
			deleteFile(e) {
				let that = this
				uni.showModal({
					title: '删除',
					content: '确定要删除?',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							that.$emit("remove")
						}
					}
				})
			},
		}
	}
</script>

<style>
	.solids{
		border: 1rpx dashed #aaaaaa;
	}
	.iconfont{
		font-size: 100rpx;
	}
</style>
