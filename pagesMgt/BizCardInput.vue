<template>
	<view>
        <cu-custom    :isBack="true">
			<block slot="backText">返回</block>
            <block slot="content">{{title}}</block>
        </cu-custom>
		<scroll-view> 
			<form>
				<view class="padding">
					<view class="cu-form-group">
						<view class="title">公司名称</view>
						<text class='cuIcon-titles text-xs text-orange'></text>
						<input placeholder="请输入公司名称" v-model="card.name"></input>
					</view>				
					<view class="cu-form-group">
						<view class="title">联系电话</view>
						<input placeholder="请输入联系电话" v-model="card.phone"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">头像</view>
						<view>
							<ups-upload
								fileType="image"
								:uploadFile = "card.avatar"
								@upload ="uploadAvatar"
								@remove = "removeAvatar"
								></ups-upload>			
						</view>
					</view>
					<view class="cu-form-group">
						<view class="title">封面</view>
						<view>
							<ups-upload
									fileType="image"
									:uploadFile = "card.cover"
									@upload ="uploadCover"
									@remove = "removeCover"
							></ups-upload>
						</view>
					</view>
					<view class="cu-form-group">
						<view class="title">邮箱</view>
						<input v-model="card.email"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">导航地址</view>
						<view class="cuIcon-locationfill" @tap="chooseAddress">{{hasAddress?card.corp_address.address:'请选择地址'}}</view>
					</view>
					<view class="cu-form-group">
						<view class="title">联系地址</view>
						<input  v-model="card.mailing_address"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">文字介绍</view>
					</view>
					<textarea class="text-box font40 bg-white width100 padding-sm solid" style="height: 500rpx;" scroll-y="true" maxlength="1200" placeholder="请输入文字介绍" v-model="card.introduce" >
					</textarea>
					<view class="cu-form-group">
						<view class="title">视频介绍</view>
					</view>
					<view class="bg-white padding-sm">
						<ups-uploads
							fileType="video"
							:fileList = "card.videos"
							maxNum = 1
							@upload = "uploadVideos"
							@remove = "removeVideos"
							>
						</ups-uploads>
					</view>
					<view class="cu-form-group">
						<view class="title">图片介绍</view>
					</view>
					<view class="bg-white padding-sm">
						<ups-movable
								:imgList = "card.imgList"
								imgSize= 75
								maxNum = 9
								@moveEndList="moveEndListHandle"
								@upload = "uploadCarousels"
								@remove = "removeCarousels"
						>
						</ups-movable>
					</view>
					<view class="cu-tabbar-height bg-white"></view>
					<view class="cu-tabbar-height bg-white"></view>
					<view class="cu-tabbar-height bg-white"></view>
				</view>
			</form>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
		<!-- 底部操作菜单 -->
		<view class="cu-bar btn-group foot bg-white" style="z-index: 99;">
			<button class="cu-btn  round line-grey"    @click="cancelSubmit">取消</button>
			<button class="cu-btn  round line-grey"   @click="submit">提交</button>
		</view>
	</view>
</template>

<script>
	import { mapState ,mapMutations} from 'vuex'
	import upsUploads from '@/components/ups-uploads/index.vue'
	import upsUpload from '@/components/ups-upload/index.vue'
    import upsMovable from '@/components/ups-movable/index.vue'

	export default {
		components:{
			"ups-uploads":upsUploads,
			"ups-upload":upsUpload,
            "ups-movable":upsMovable,
		},
		data() {
			return {
				title:'',
				card:{
                    corp_address:{address:'',latitude:0,longitude:0},
                    mailing_address:'',
					carousels:[],
                    imgList:[],
					videos:[]
				},
                hasAddress:false,
                currentUser:{}//当前编辑的用户帐号
			}
		},
		onLoad(options) {
			this.title=options.title;
		    this.getBizCardDetail()
		},
		computed:{
			...mapState(['user']),
		},
		methods: {
            async getBizCardDetail(){
                let that = this;
				let res = await wx.cloud.callFunction({
					name:'sys',
					data:{
						$url:'getCardDetailById',
						id:that.user.userInfo.bizCardId,
					}
				});
				console.log(res);
				that.card = res.result.data;
				if(that.card._id){
                    if(that.card.corp_address){
                        that.hasAddress= true;
                    }else{
                        that.hasAddress= false;
                        that.card.corp_address = {address:'',latitude:0,longitude:0}
                    }
                    that.card.imgList=[];
                    that.card.carousels.forEach(each =>{
                        that.card.imgList.push({'url':each});
                    });
				}else{
                    that.card.videos=[];
                    that.card.carousels =[];
                    that.card.corp_address = {address:'',latitude:0,longitude:0};
                    that.card.mailing_address='';
                    that.hasAddress= false;
				}

            },
            uploadCover(fileId){
                this.card.cover = fileId;
                this.$forceUpdate()
            },
            removeCover(){
                this.card.cover = "";
                this.$forceUpdate()
            },
			uploadAvatar(fileId){
				this.card.avatar = fileId;
				this.$forceUpdate()
			},
			removeAvatar(){
				this.card.avatar = "";
				this.$forceUpdate()
			},

            moveEndListHandle(imgArr){
                // console.log('moveEndListHandle',imgArr);
                let that = this;
                that.card.imgList = imgArr;
                that.card.carousels = [];
                that.card.imgList.forEach(each=>{
                    that.card.carousels.push(each.url);
                });
                that.$forceUpdate();
            },

			uploadCarousels(fileId){
			    if(!this.card.carousels){
                    this.card.carousels=[];
				}
				this.card.carousels.push(fileId);
                this.card.imgList.push({'url':fileId});
				this.$forceUpdate()
			},
			removeCarousels(idx){
				this.card.carousels.splice(idx, 1);
                this.card.imgList.splice(idx, 1);
				this.$forceUpdate()
			},
			uploadVideos(fileId){
			    if(!this.card.videos){
                    this.card.videos=[];
				}
				this.card.videos.push(fileId)
				this.$forceUpdate()
			},
			removeVideos(idx){
				this.card.videos.splice(idx, 1)
				this.$forceUpdate()
			},

            cancelSubmit(){
                uni.navigateBack();
			},

			async submit(){
			    let that = this;
				//首字母为英文或汉字
				// let reg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
				// console.log('reg',reg.test(that.card.name));
                // if(!that.card.name || !reg.test(that.card.name)){
                 //    uni.showToast({
                 //        icon:'none',
                 //        title:'姓名需字母或汉字开头'
                 //    })
                 //    return;
                // }
                // console.log('card',that.card,that.card.phone);
                let checkValue = that.card.name+that.card.introduce;
                let secRes = await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'msgSecCheck',
                        value:checkValue
                    }
                });
                console.log(secRes)
                if(secRes.result.code!=0){
                    uni.showToast({
                        icon:'none',
                        title:'内容含有违规内容，请修改后提交'
                    });
                    return;
                }
				//编辑提交
				if(that.card._id){
                    await wx.cloud.callFunction({
                       name:'sys',
                       data:{
                           $url:'updateCard',
                           card:that.card,
                       }
                    });
				}
				uni.reLaunch({
					url: '/pagesSys/site/about',
				})
			},


			chooseAddress(){
				let that = this;
				wx.getSetting({
				    success(res) {
				        console.log('get-setting', res.authSetting);
				        // 只返回用户请求过的授权
				        let auth = res.authSetting;
				        if (auth['scope.userLocation']) {
				            // 已授权，申请定位地址
				            that.getUserLocation();
				        } else if (auth['scope.userLocation'] === undefined) {
				            // 用户没有请求过的授权，不需要我们主动弹窗，微信会提供弹窗
				            that.getUserLocation();
				        } else if (!auth['scope.userLocation']) {
				            // 没有授权过，需要用户重新授权
				            // 这个弹窗是为了实现点击，不然openSetting会失败
				            wx.showModal({
				                title: '是否授权当前位置？',
				                content: '需要获取您的地理位置，请确认授权，否则定位功能将无法使用',
				                success: res => {
				                    if (res.confirm) {
				                        wx.openSetting({
				                            success(res) {
				                                console.log('open-setting-suc', res.authSetting);
				                                let setting = res.authSetting;
				                                if (!setting['scope.userLocation']) {
				                                    wx.showToast({
				                                        title: '地址授权失败，定位功能无法使用',
				                                        icon: 'none',
				                                    });
				                                } else {
				                                    // 地址授权成功，申请定位地址
				                                    that.getUserLocation();
				                                }
				                            },
				                            fail(err) {
				                                // 需要点击，有时候没有点击，是无法触发openSetting
				                                console.log('open-setting-fail',err);
				                            }
				                        });
				                    }
				                }
				            });
				        } 
				    }
				});
			
			},
			
			getUserLocation () {
				let that = this;
			    wx.chooseLocation({
					success(res){
						if(!that.card.corp_address){
							that.card.corp_address = {address:'',latitude:0,longitude:0};
						}
                        that.card.corp_address.address = res.address;
                        that.card.corp_address.latitude = res.latitude;
                        that.card.corp_address.longitude = res.longitude;
						that.hasAddress= true;
						that.$forceUpdate();
						
					}
				});
			}
		}
	}
</script>

<style>
	.padding {
		padding: 10rpx;
	}

	.text-box {
		height: 100rpx;
		/* background-color: #FFFFFF; */
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		color: #353535;
		line-height: 1.8;
	}
	video {
		width: 750rpx;
	}
	image {
		width: 750rpx;
	}

	.card-radius {
		border-radius: 10upx;
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

	/* 底部分享 */
	.trend-popup {
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
	.trend-remove-popup {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 5px;
		height: 350rpx;
	}
	.trend-popup-close {
		position:absolute;
		top:30rpx;
		left:30rpx;
		font-size: 39rpx;
		text-align: center;
		font-weight: bold;
		z-index: 99;
	}

	.trend-popup-title {
		margin-top:15rpx;
		line-height: 60rpx;
		font-size: 28rpx;
		padding: 5rpx 0;
		text-align: center;
		font-weight: bold;
	}

	.trend-popup-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 5px;
		max-height: 850rpx;
	}

</style>
