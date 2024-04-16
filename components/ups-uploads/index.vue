<template>
	<view>
		<view v-if="fileType==='image'" class="grid col-4 grid-square flex-sub">
			<view class="bg-img" v-for="(item,index) in fileList" :key="index" @tap="viewFile" :data-url="fileList[index]" >
				<image :src="fileList[index]" mode="aspectFill"></image>
				<view class="cu-tag bg-red" @tap.stop="deleteFile" :data-index="index">
					<text class='cuIcon-close'></text>
				</view>
			</view>
			 <view class="solids" @tap="chooseFile" v-if="fileList.length<maxNum">
				<text class='cuIcon-cameraadd'></text>
			</view>
		</view>
		<view v-if="fileType==='video' && fileList.length>=maxNum">
			<view class="cu-tag bg-red fr" @tap.stop="deleteFile" data-index="0">
				<text class='cuIcon-close'></text>
			</view>
		</view>
		<view v-if="fileType==='video'" class="grid col-2 grid-square flex-sub rel">
			<video v-if="fileList.length>=maxNum" :src="fileList[0]" object-fit="cover" controls muted ></video>
			<view v-if="fileList.length<maxNum" class=" grid col-4 grid-square flex-sub solids" @tap="chooseFile" >
				<text class='iconfont icon-shangchuanshipin text-gray abs center'></text>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { cloudUploadPath } from '@/utils/cmnUtils.js'
	
	export default {
		name:"Upload",
		props:{
			fileType:{
				type:String,
				required:true
			},
			fileList:{
				type:Array,
				required:true
			},
			maxNum:{
				type:Number,
				default:9
			},
		},
		data() {
			return {
			};
		},
		methods:{
			chooseFile() {
				let that = this
				let selectNum = this.maxNum-this.fileList.length;
				if(selectNum<0){
					selectNum=0
				}
				if(this.fileType==="image"){
					wx.chooseImage({
						count: selectNum, //默认9
						sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
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
					uni.chooseMedia({
						count:1,
						maxDuration:15,
						sourceType: ['camera', 'album'],
						compressed: true,
						success: function (uRes) {
							console.log('uRes',uRes);
							uni.showLoading({title: '加载中',});
							const fileName = cloudUploadPath() + `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}`;
							let cloudPathList = [ fileName+`.jpg`,fileName+`.mp4`]
							let filePathList = [ uRes.tempFiles[0].thumbTempFilePath,uRes.tempFiles[0].tempFilePath]

                            cloudPathList.forEach((item,i)=>{
                                wx.cloud.uploadFile({
                                    cloudPath:cloudPathList[i],
                                    filePath:filePathList[i],
                                }).then(res => {
                                    console.log('res',res)
									//返回视频fileID
									if(i==1){
                                        uni.hideLoading();
                                        if (res.statusCode < 300) {
                                            that.$emit("upload",res.fileID)
                                        }
									}
                                })

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
					urls: this.fileList[e.currentTarget.dataset.index],
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
							that.$emit("remove",e.currentTarget.dataset.index)
						}
					}
				})
			},
		},
	}
</script>

<style lang="scss">
	.solids{
		border: 1rpx dashed #aaaaaa;
	}
	.iconfont{
		font-size: 100rpx;
	}
</style>
