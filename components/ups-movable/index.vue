<template>
	<view @touchmove.stop.prevent="moveHandle">
		<movable-area class="movarea" ref="areaBox" id="areaBox">
			<view class="imgBox">
				<view class="imgItem margin-right-sm margin-bottom-sm" v-for="(item, idx) in scopeImgList" :key="idx"  :style="{ width: imgSize + 'px', height: imgSize + 'px' }">
					<image
							:id="'img' + idx"
							:ref="'img' + idx"
							:src="item.url"
							mode="aspectFill"
							@touchstart="tstr(idx, $event)"
							@touchmove="tsmo"
							@touchend="toend"
							:class="(hoverImgIdx==='img'+idx)?'select':''"
					></image>
					<!-- 删除对应图片按钮 -->
					<view class="closeBtn" @tap.stop="deleteFile(idx)" >
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<view v-if="scopeImgList.length<maxNum" class="imgItem solids"  @click="chooseFile"  :style="{ width: imgSize + 'px', height: imgSize + 'px' }">
					<!--<text class='cuIcon-cameraadd'></text>-->
						<image class='abs center' src="cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/addPhoto.png"  mode="aspectFill" :style="{ width: imgSize/2 + 'px', height: imgSize/2 + 'px' }"></image>
				</view>
			</view>
			<movable-view v-if="moveSrc" :animation="false" class="moveV" :x="x" :y="y" direction="all" @change="onChange"  :style="{ width: imgSize + 'px', height: imgSize + 'px' }">
				<image :src="moveSrc" mode="aspectFill" ></image>
			</movable-view>
		</movable-area>
	</view>
</template>

<script>
    import { mapState } from 'vuex';
    import { cloudUploadPath } from '@/utils/cmnUtils.js'

	export default {
		name:"imageUploadMovable",
		props:{
			imgList:{
				type:Array,
				required:true,
				default: function() {
					return [];
				}
			},
			imgSize: {
				type: Number,
				default: function() {
						return 80;
				}
			},
            maxNum:{
                type:Number,
                default:9
            },
		},

		data() {
			return {
			    scopeImgList:this.imgList,
                areaBoxInfo: {},
            	x: 0,
                y: 0,
                idx: 0,
                moveSrc: '',
                areaBoxTop: 0,
                hoverImgIdx:'',
                inBoxXY:{},
			};
		},

        watch: {
            ...mapState(['user','cloudPath']),
            imgList() {
                let _this = this;
                _this.scopeImgList = _this.imgList;
                this.getDomInfo('areaBox', info => {
                    _this.areaBoxInfo = info;
                    // 设置区域内所有图片的左上角坐标
                    _this.scopeImgList.forEach((item, idx) => {
                        _this.getDomInfo('img' + idx, res => {
                            item.x = res.left-info.left;
                        });
                        _this.getDomInfo('img' + idx, res => {
                            item.y = res.top-info.top;
                        });
                    });
                });
            },
        },

		mounted() {
			let _this = this;
			this.getDomInfo('areaBox', info => {
				_this.areaBoxInfo = info;
				// 设置区域内所有图片的左上角坐标
				_this.scopeImgList.forEach((item, idx) => {
					_this.getDomInfo('img' + idx, res => {
						item.x = res.left-info.left;
					});
					_this.getDomInfo('img' + idx, res => {
						item.y = res.top-info.top;
					});
				});
			});
   	 	},

		methods:{
			chooseFile() {
				let that = this;
				let selectNum = this.maxNum-this.scopeImgList.length;
				if(selectNum<0){
					selectNum=0
				}
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
									that.$emit("upload",res.fileID);
									wx.cloud.callFunction({
										name:'sys',
										data:{
										  $url:'cloudImgSecCheck',
										  fileID:res.fileID
										}
									}).then(secRes=>{
										if(secRes.result.code==0){
										}else{
											uni.showToast({
												icon:'none',
												title:"图片含有违规内容，请重新选择!"
											});

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
			},
			viewFile(e) {
				wx.previewImage({
					urls: this.scopeImgList[e.currentTarget.dataset.index],
					current: e.currentTarget.dataset.url
				});	
			},
			deleteFile(idx) {
				let that = this;
				uni.showModal({
					title: '删除',
					content: '确定要删除?',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							that.$emit("remove",idx)
						}
					}
				})
			},

			moveHandle() {

			},
			onChange(e) {
				// console.log('onChange',e.detail)
			},
			tstr(e, s) {
				const _this = this;
				//获取拖拽区域的上边距和下边距
				let areaBoxTop = this.areaBoxInfo.top;
				let areaBoxLeft = this.areaBoxInfo.left;
				// console.log(this.areaBoxInfo)

				// 设置可移动方块的初始位置为当前所选中图片的位置坐标
				this.x = this.scopeImgList[e].x;
				this.y = this.scopeImgList[e].y;
				//显示可移动方块
				this.moveSrc = this.scopeImgList[e].url;
				//保存当前所选择的图片索引
				this.idx = e;
				var x = s.changedTouches[0].clientX-areaBoxLeft;
				var y = s.changedTouches[0].clientY-areaBoxTop;
				// 保存鼠标在图片内的坐标
				this.inBoxXY={
					x:x-this.scopeImgList[e].x,
					y:y-this.scopeImgList[e].y,
				}
			},
			tsmo(e) {
				const _this = this;
				let areaBoxTop = this.areaBoxInfo.top;
				let areaBoxLeft = this.areaBoxInfo.left;
				let  imgSize= this.imgSize;
				//重置为以拖拽盒子左上角为坐标原点
				var x = e.changedTouches[0].clientX-areaBoxLeft;
				var y = e.changedTouches[0].clientY-areaBoxTop;
				this.x = x-this.inBoxXY.x;
				this.y = y-this.inBoxXY.y;

				this.scopeImgList.forEach((item, idx) => {
					if (x>item.x&&x<item.x+imgSize&&y>item.y&&y<item.y+imgSize) {
						_this.hoverImgIdx='img'+idx
					}
				});
			},
			toend(e) {
				const _this = this;
				let areaBoxTop = this.areaBoxInfo.top;
				let areaBoxLeft = this.areaBoxInfo.left;
				let  imgSize= this.imgSize;
				//重置为以拖拽盒子左上角为坐标原点
				var x = e.changedTouches[0].clientX-areaBoxLeft;
				var y = e.changedTouches[0].clientY-areaBoxTop;
				for(let idx in this.scopeImgList){
					let item=this.scopeImgList[idx];
					if (x>item.x&&x<item.x+imgSize&&y>item.y&&y<item.y+imgSize) {
						_this.scopeImgList[_this.idx].url = _this.scopeImgList[idx].url;
						_this.scopeImgList[idx].url = _this.moveSrc;
						break;
					}
				}
				// 移动结束隐藏可移动方块
				this.moveSrc = '';
				this.hoverImgIdx='';
				console.log('change',this.imgList,this.scopeImgList,_this.scopeImgList);
				this.$emit('moveEndList', this.imgList);
			},

			getDomInfo(id, callBack) {
				const query = uni.createSelectorQuery().in(this);
				// console.log(query)
				query.select('#' + id)
					.boundingClientRect()
					.exec(function(res) {
						callBack(res[0]);
					});
			}
		},
	}
</script>

<style lang="less" scoped>
	.movarea {
		width: 100%;
		height: 75px;
		display: flex;
		flex-direction: row;
	}

	.imgBox {
		width: 100%;
		height: 75px;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		.imgItem {
			position: relative;
			image {
				width: 75px;
				height: 75px;
				transition: all 0.5s;
				vertical-align: top;
			}
			.closeBtn {
				background-color: red;
				color: #FFFFFF;
				border-radius: 50%;
				text-align: center;
				position: absolute;
				top: 0;
				right: 0;
				width: 16px;
				height: 16px;
				line-height: 16px;
				z-index: 3;
				transform: translate(50%, -50%);
			}
		}
	}

	.moveV {
		opacity: 0.8;
		z-index: 999;
		image {
			width: 75px;
			height: 75px;
		}
	}

	.select{
		transform: scale(1.3);
	}
</style>
