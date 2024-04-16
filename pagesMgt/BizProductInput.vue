<template>
    <view>
        <cu-custom    :isBack="true">
			<block slot="backText">返回</block>
            <block slot="content">编辑产品</block>
        </cu-custom>
		<scroll-view>
			<form>
				<view class="padding">
					<view class="cu-form-group">
						<view class="title">标题</view>
						<text class='cuIcon-titles text-xs text-orange'></text>
						<input placeholder="请输入标题" v-model="product.title"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">封面</view>
						<view>
							<ups-upload
									fileType="image"
									:uploadFile = "product.cover"
									@upload ="uploadCover"
									@remove = "removeCover">
							</ups-upload>
						</view>
					</view>
					<view class="cu-form-group solid-top">
						<view class="title">产品主图</view>
						<text class='cuIcon-titles text-xs text-orange'></text>
						<input type="text" disabled></input>
					</view>
					<view class="bg-white padding-sm solid-bottom bg-white">
						<ups-movable
								:imgList = "product.imgList"
								imgSize= 75
								maxNum = 9
								@moveEndList="moveEndListHandle"
								@upload = "uploadImages"
								@remove = "removeImages"
						>
						</ups-movable>
						<view class="cu-tabbar-height"></view>
						<view class="cu-tabbar-height"></view>
						<view class="cu-tabbar-height"></view>
					</view>
					<view class="cu-form-group">
						<view class="title">价格<text class="cuIcon-titles text-xs text-orange"></text></view>
						<input v-model="product.price"  placeholder="10.00"></input>
						<view class="title">单位<text class="cuIcon-titles text-xs text-orange"></text></view>
						<input v-model="product.unit_name"  placeholder="元"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">运费<text class="cuIcon-titles text-xs text-orange"></text></view>
						<input v-model="product.price_shipping"  placeholder="0.00"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">产品排序</view>
						<input v-model="product.sort_index"  placeholder="默认0，数值越大越靠前"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">产品标签（逗号分割）</view>
					</view>
					<textarea class="text-box font40 bg-white width100 padding-sm solid" style="height: 200rpx;" scroll-y="true" maxlength="200" placeholder="请输入产品标签" v-model="product.tags" >
					</textarea>
					<view class="cu-form-group">
						<view class="title">产品详情</view>
					</view>
					<textarea class="text-box font40 bg-white width100 padding-sm solid" style="height: 500rpx;" scroll-y="true" maxlength="1200" placeholder="请输入产品详情" v-model="product.detail.content" >
					</textarea>
					<view class="cu-form-group">
						<view class="title">视频介绍</view>
					</view>
					<view class="bg-white padding-sm">
						<ups-uploads
							fileType="video"
							:fileList = "product.detail.videos"
							maxNum = 1
							@upload="uploadDetailVideos"
							@remove="removeDetailVideos"
							>
						</ups-uploads>
					</view>
					<view class="cu-form-group solid-top">
						<view class="title">详情介绍</view>
					</view>
					<view class="bg-white padding-sm solid-bottom bg-white">
						<ups-movable
								:imgList = "product.detail.imgList"
								imgSize= 75
								maxNum = 9
								@moveEndList="moveEndListDetailHandle"
								@upload = "uploadDetailImages"
								@remove = "removeDetailImages"
						>
						</ups-movable>
						<view class="cu-tabbar-height"></view>
						<view class="cu-tabbar-height"></view>
						<view class="cu-tabbar-height"></view>
					</view>
				</view>
			</form>
			<!--页面底部抬升-->
			<view class="cu-tabbar-height"></view>
		</scroll-view>
		<!-- 底部操作菜单 -->
		<view class="cu-bar btn-group  foot bg-white">
			<button class="cu-btn   line-grey round"   @click="navback"> 取消 </button>
			<button class="cu-btn   line-grey round"   @click="submit"> 提交 </button>
		</view>
    </view>
</template>

<script>
	import upsUploads from '@/components/ups-uploads/index.vue'
    import upsUpload from '@/components/ups-upload/index.vue'
    import upsMovable from '@/components/ups-movable/index.vue'
    import { mapState, mapMutations } from 'vuex'

    export default {
        components:{
            'ups-uploads':upsUploads,
            "ups-upload":upsUpload,
            "ups-movable":upsMovable,
        },
        data() {
            return {
                productId:'',
                product:{
                   	price : 0.00,
                    sort_index:0,
            		unit_name:'元',
					cover:'',
					carouse:[],
                    imgList:[],
					detail:{
						content:'',
						images:[],
                        imgList:[],
						videos:[]
					},
                },
                dbProductTags:'',//暂存数据库读取的产品标签信息，用于数据变更比对
            }
        },
		onLoad(option) {
			let that = this;
		    if(option.id){
		        that.productId = option.id;
				this.getDetail();
		    }
		},
		onShow() {
		},
        computed:{
			...mapState(['user']),
        },
        methods: {
            async getDetail(){
                let that = this;
                let res = await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'getProductDetail',
                        id:that.productId,
                    }
                });
                that.product = res.result.data;
                that.product.imgList=[];
                that.product.carouse.forEach(eachHeader =>{
                    that.product.imgList.push({'url':eachHeader});
                });
                that.product.detail.imgList=[];
                that.product.detail.images.forEach(eachDetail=>{
                    that.product.detail.imgList.push({'url':eachDetail});
                });
                that.dbProductTags = res.result.data.tags||'';
			},

			async submit(e){
				let that = this
				let checkValue = that.product.detail.content+that.product.title;
				let secRes = await wx.cloud.callFunction({
					name:'sys',
					data:{
					  $url:'msgSecCheck',
					  value:checkValue
					}
				});
				if(secRes.result.code!=0){
					uni.showToast({
						icon:'none',
						title:'内容含有违规内容，请修改后提交'
					})
					return;
				}

				if((!that.product.title) || (!that.product.price) || that.product.carouse.length==0){
					uni.showToast({
						icon:'none',
						title:'标题，图片和价格都填写才能发布!'
					})
					return;
				}
				let res = await wx.cloud.callFunction({
				    name:'sys',
				    data:{
				        $url:'getCardDetailById',
				        id:that.user.userInfo.bizCardId,
				    }
				});
				let bizCard = res.result.data;
				that.product.name = bizCard.name;
				that.product.avatar = bizCard.avatar;

				if(that.productId.length>0){
                    //判断产品标签是否修改
                    if(that.dbProductTags.length>0 && that.dbProductTags!=that.product.tags){
						let res = await wx.cloud.callFunction({
							name:'cmn',
							data:{
								$url:'updateProductTags',
								id:that.productId,
								tags:that.product.tags
							}
						});
					 }
                }else{
					that.product.on_sale=false;
					that.product.card_id=that.user.userInfo.bizCardId;
					let res = await wx.cloud.callFunction({
					    name:'cmn',
					    data:{
					        $url:'addProduct',
					        product:that.product,
					    }
					});
                    //补充_id
                    that.product._id=res.result._id;
                    // 注意二维码需要发布上线后才能调用生成
                    await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'genProductQrcode',
                            id:that.product._id,
                            page:'pagesCmn/product/ShareProductDetail',
                            width:430,
                        }
                    });
                }
				
                let tags = bizCard.tags||{card:'',products:'',activity:'',trends:''};
                let dbProductTags=tags.products||'';
                //查找并更新名片中商品标签
				if(that.product.tags){
					if(that.product.tags.length>0 && dbProductTags.indexOf(that.product.tags)<0){
						if(tags.products.length>0){
							tags.products += ',';
						}
						tags.products += that.product.tags;
						bizCard.tags= tags;
						await wx.cloud.callFunction({
							name:'sys',
							data:{
								$url:'updateCard',
								card:bizCard
							}
						});
					}
                }
                uni.showToast({
                    icon:'success',
                    title:'发布成功'
                })
                setTimeout (() => {
                    uni.navigateTo({
                        url:'/pagesMgt/BizProductList',
                    });
                } , 1000 )
			},
            uploadCover(fileId){
                this.product.cover = fileId;
                this.$forceUpdate()
            },
            removeCover(){
                this.product.cover = "";
                this.$forceUpdate()
            },
            moveEndListHandle(imgArr){
                let that = this;
                that.product.imgList = imgArr;
                that.product.carouse = [];
                that.product.imgList.forEach(each=>{
                    that.product.carouse.push(each.url);
                });
                that.$forceUpdate();
            },

            uploadImages(fileId){
                this.product.carouse.push(fileId);
				this.product.imgList.push({'url':fileId});
				this.$forceUpdate()
            },
			removeImages(idx){
				this.product.carouse.splice(idx, 1);
                this.product.imgList.splice(idx, 1);
				this.$forceUpdate()
			},
            moveEndListDetailHandle(imgArr){
                console.log('moveEndListDetailHandle',imgArr);
                let that = this;
                that.product.detail.imgList = imgArr;
                that.product.detail.images = [];
                that.product.detail.imgList.forEach(each=>{
                    that.product.detail.images.push(each.url);
                });
                that.$forceUpdate();
            },
			uploadDetailImages(fileId){
			    this.product.detail.images.push(fileId);
                this.product.detail.imgList.push({'url':fileId});
				this.$forceUpdate()
			},
			removeDetailImages(idx){
				this.product.detail.images.splice(idx, 1);
                this.product.detail.imgList.splice(idx, 1);
				this.$forceUpdate()
			},
			uploadDetailVideos(fileId){
				if(!this.product.detail.videos){
					this.product.detail.videos=[]
				}
			    this.product.detail.videos.push(fileId)
				this.$forceUpdate()
			},
			removeDetailVideos(idx){
				this.product.detail.videos.splice(idx, 1)
				this.$forceUpdate()
			},
			navback(e){
				uni.navigateBack();
			},
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
</style>
