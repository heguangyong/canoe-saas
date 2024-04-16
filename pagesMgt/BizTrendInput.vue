<template>
	<view>
		<cu-custom    :isBack="true">
			<block slot="content">布置展厅</block>
		</cu-custom>
		<scroll-view scroll-y class="DrawerPage" :class="modalName=='viewModal'?'show':''">
			<form>
				<view class="cu-form-group">
					<view class="title">标题</view>
					<text class='cuIcon-titles text-xs text-orange'></text>
					<input v-model="trend.title" placeholder="添加标题..."></input>
				</view>
				<view class="cu-form-group align-start">
					<textarea maxlength="140" v-model="trend.content" placeholder="添加说明..."></textarea>
				</view>
				<view v-if="!isShowSelectPhotoOrVideo" class="padding flex">
					<button class="flex-subline-grey  margin-xs radius justify-center"     @tap="selectVideo(false)">
							<text class="cuIcon-cameraadd margin-right" style="font-size: 30px;"></text>拍照片
					</button>
					<button class="flex-sub line-grey  margin-xs radius  justify-center"     @tap="selectVideo(true)">
						<text class="cuIcon-record  margin-right" style="font-size: 30px;"></text>拍视频
					</button>
				</view>
				<view v-if="isShowSelectPhotoOrVideo" class="margin-top-lg">
					<view  v-if="!isVideosType" class="padding" >
						<ups-movable
								:imgList = "trend.imgList"
								imgSize= 75
								maxNum = 9
								@moveEndList="moveEndListHandle"
								@upload = "uploadCarousels"
								@remove = "removeCarousels"
						>
						</ups-movable>
					</view>
					<view v-if="isVideosType" class="padding" >
						<ups-uploads
								fileType="video"
								:fileList = "trend.videos"
								maxNum = 1
								@upload = "uploadVideos"
								@remove = "removeVideos"
						>
						</ups-uploads>
					</view>
				</view>
				<view class="cu-tabbar-height"></view>
				<view class="cu-tabbar-height"></view>
				<!--选取展品-->
				<view class="grid col-2 padding bg-gray ">
					<button class="cu-btn  round line-grey"     @tap="showModal" data-target="viewModal">选取关联资源</button>
				</view>
				<slot>
					<!--已选列表-->
					<view scroll-y class="cu-list menu product-menu margin-bottom-xl shadow-lg">
						<slot v-if="isPickProduct">
							<slot v-if="trend.productList.length>0">
								<text class="cu-item text-30"    >关联产品</text>
								<view  class="cu-item flow" v-for="(item,index) in  trend.productList" :key="index">
									<ups-product :product="item"></ups-product>
									<view class="action text-gray"  @tap="removeProduct(item)">
										<text class="cuIcon-backdelete"></text>
									</view>
								</view>
							</slot>
							<slot v-else>
								<view  class="cu-item">
									<view class="content">
										<text class="cuIcon-info text-gray"></text>
										<text class="text-gray">没有放置资源</text>
									</view>
								</view>
							</slot>
						</slot>
						<slot v-if="!isPickProduct">
							<slot v-if=" trend.activityList.length>0">
								<text class="cu-item text-30"    >关联活动</text>
								<view  class="cu-item flow" v-for="(item,index) in  trend.activityList" :key="index">
									<ups-activity :activity="item"></ups-activity>
									<view class="action text-gray"  @tap="removeActivity(item)">
										<text class="cuIcon-backdelete"></text>
									</view>
								</view>
							</slot>
							<slot v-else>
								<view  class="cu-item">
									<view class="content ">
										<text class="cuIcon-info text-gray"></text>
										<text class="text-gray">没有放置资源</text>
									</view>
								</view>
							</slot>
						</slot>
					</view>
				</slot>
			</form>
		</scroll-view>

		<view v-if="!isShowResource" class="cu-bar btn-group  foot bg-white">
			<button class="cu-btn   round line-grey"    @click="navBack"> 取消 </button>
			<button class="cu-btn   round line-grey"   @click="submit"> 发布 </button>
		</view>
		<view class="DrawerClose" :class="modalName=='viewModal'?'show':''" @tap="hideModal">
			<text class="cuIcon-pullright"></text>
		</view>
		<!--备选列表-->
		<scroll-view scroll-y class="DrawerWindow" :class="modalName=='viewModal'?'show':''">
			<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg">
				<scroll-view scroll-x class="bg-white nav">
					<view class="flex text-center">
						<view class="cu-item flex-sub solid-bottom" :class="index==tabCur?'text-green cur':''" v-for="(item,index) in 2" :key="index" @tap="tabSelect" :data-id="index">
							{{tab[index]}}
						</view>
					</view>
				</scroll-view>
				<slot v-if="tabCur==0">
					<slot v-if="productList.length>0">
						<view v-if="categories.length>1" class='padding-sm flex flex-wrap'>
							<view class="padding-xs" v-for="(item,index) in categories" :key="index">
								<view v-if="item.checked" class='cu-tag bg-green radius'  @tap="chooseTag(index)">{{item.label}}</view>
								<view v-else class='cu-tag line-gray radius' @tap="chooseTag(index,item)">{{item.label}}</view>
							</view>
						</view>
						<!--仅显示未被选中的商品-->
						<view v-if="!item.isSelected" class="cu-item flow"     v-for="(item,index) in checkedProductList" :key="index">
							<ups-product :product="item"></ups-product>
							<view class="action text-gray"  @tap="addProduct(item)">
								<text class="cuIcon-add"></text>
							</view>
						</view>
					</slot>
					<slot v-if="productList.length==0">
						<view  class="cu-item arrow"     @click="newProduct">
							<view class="content">
								<text class="cuIcon-cart text-grey"></text>
								<text class="text-grey">新增展品</text>
							</view>
						</view>
					</slot>
				</slot>
				<slot v-if="tabCur==1">
					<slot v-if="activityList.length>0">
						<!--仅显示未被选中的活动-->
						<view v-if="!item.isSelected" class="cu-item flow"     v-for="(item,index) in activityList" :key="index">
							<ups-activity :activity="item"></ups-activity>
							<view class="action text-gray"  @tap="addActivity(item)">
								<text class="cuIcon-add"></text>
							</view>
						</view>
					</slot>
					<slot v-if="activityList.length==0">
						<view  class="cu-item arrow"     @click="newActivity">
							<view class="content ">
								<text class="cuIcon-new text-grey"></text>
								<text class="text-grey">新增活动</text>
							</view>
						</view>
					</slot>
				</slot>
			</view>
		</scroll-view>
	</view>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'
	import upsUploads from '@/components/ups-uploads/index'
    import upsMovable from '@/components/ups-movable/index'
	import upsProduct from '@/components/ups-product/index';
	import upsActivity from '@/components/ups-activity/index';

	export default {
		components:{
			"ups-uploads":upsUploads,
            "ups-movable":upsMovable,
			"ups-product":upsProduct,
			"ups-activity":upsActivity
		},
		data() {
			return {
				trend:{
					carousels:[],
                    imgList:[],
					videos:[],
					cover:'',
					content:"",
					likes_ids:[],
					productList:[],
					activityList:[],
				},
                isPickProduct:false,//是否选择货物
				productList:[],
                checkedProductList:[],//选中的货物
                //产品标签分类
                categories:[{label:'全部',checked:true}],
				activityList:[],
                isShowSelectPhotoOrVideo: false,//用于控制选择拍摄照片还是视频的判断，缺省隐藏
				isShowResource: false,//在选取资源后展示相关设置，缺省隐藏
                isVideosType: false,
                modalName:null,
                tab:['产品','活动'],
                tabCur: 0,
			}
		},	
		onLoad() {
            let that = this;
            that.getProductList();
            that.getActivityList();
		},

		computed:{
			...mapState(['user'])
		},
		methods: {
		    //选择拍照还是拍视频
            selectVideo(isVideo){
                this.isVideosType = isVideo;
                this.isShowSelectPhotoOrVideo = true;
			},


			async submit(e){
				let that = this
				let checkValue = that.trend.title+that.trend.content;
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
					});
					return;
				}

				//内容校验
				if(that.trend.carousels.length==0 && that.trend.videos.length==0){
                    uni.showToast({
                        icon:'none',
                        title:'请先选好照片或视频。'
                    });
                    return;
				}
				//用名片信息
				that.trend.user_id = that.user._id;
				that.trend.user_name = that.user.userInfo.nickName;
				that.trend.card_id = that.user.userInfo.bizCardId;
				let res = await wx.cloud.callFunction({
					name:"sys",
					data:{
					    $url:'getCardDetailById',
						id:that.user.userInfo.bizCardId
					}
				});
				let card = res.result.data;
				that.trend.name = card.name;
				that.trend.avatar = card.avatar;
				that.trend.is_open_comments = true;
                //默认的商品不可下订单
                that.trend.place_order_flag = false;

                //保存cover图片
                let fileUrl = '';
                if(that.trend.carousels.length>0){
                    fileUrl = that.trend.carousels[0];
                }else if(that.trend.videos.length>0){
                    fileUrl = that.trend.videos[0];
                }

                //设定分享封面图
				res = await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'convertFileIdToUrl',
                        fileId:fileUrl,
                    }
                });
                if(that.trend.carousels.length>0){
                    that.trend.cover=res.result.data;
                }else if(that.trend.videos.length>0){
                    that.trend.cover=res.result.data.substring(0,res.result.data.length-3)+'jpg';
                }

				res = await wx.cloud.callFunction({
					name:'cmn',
                    data:{
                        $url:'addTrend',
                        trend:that.trend,
                    }
				});
                console.log("new trendId",res.result._id);
				// 注意二维码需要发布上线后才能调用生成
				await wx.cloud.callFunction({
					name:'cmn',
					data:{
						$url:'genTrendQrcode',
						id:res.result._id,
						page:'pagesCmn/trend/ShareTrendDetail',
						width:430,
					}
				});
                uni.showToast({
                    icon:'success',
                    title:'发布成功'
                })
                setTimeout (() => {
                    uni.navigateTo({
                        "url":"/pagesMgt/BizTrendList"
                    });
                } , 1000 )
			},
			navBack(e){
                uni.navigateBack();
			},
            newProduct(){
			  	uni.navigateTo({url:'/pagesMgt/BizProductInput'})
			},
            newActivity(){
                uni.navigateTo({url:'/pagesMgt/BizActivityInput'})
            },
            moveEndListHandle(imgArr){
                let that = this;
                that.trend.imgList = imgArr;
                that.trend.carousels = [];
                that.trend.imgList.forEach(each=>{
                    that.trend.carousels.push(each.url);
                });
                that.$forceUpdate();
            },
			uploadCarousels(fileId){
                let that =this;
				this.trend.carousels.push(fileId);
                that.trend.imgList.push({'url':fileId});
				this.$forceUpdate()
			},
			removeCarousels(idx){
				this.trend.carousels.splice(idx, 1);
                this.trend.imgList.splice(idx, 1);
				this.$forceUpdate()
			},
			uploadVideos(fileId){
				this.trend.videos.push(fileId)
				this.$forceUpdate()
			},
			removeVideos(idx){
				this.trend.videos.splice(idx, 1)
				if(this.trend.videos.length==0){
				}
				this.$forceUpdate()
			},
            async getProductList(){
				// 选择所有上架商品
				if(this.productList.length==0){
					let  that = this;
                    //获取商品
                    let res = await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'getProductListByCardId',
                            cardId:that.user.userInfo.bizCardId,
                        }
                    });
                    let result=res.result;
                    result.data.forEach(item => {
                            that.productList.push(item);
                        });
                        that.checkedProductList = that.productList;
                        //获取名片中的标签集
                        res = await wx.cloud.callFunction({
                            name:'sys',
                            data:{
                                $url:'getCardDetailById',
                                id:that.user.userInfo.bizCardId,
                            }
                        });
                        let card = res.result.data;
                        let tags = card.tags||{card:'',product:'',activity:'',trend:''};
                        let dbProductTags=tags.product||'';
                        that.categories=[{label:'全部',checked:true}];
                        let checkStr = '';
                        //中文逗号替换成英文逗号
                        dbProductTags = dbProductTags.replace(RegExp('，','g'),',');
                        //英文逗号
                        if(dbProductTags.indexOf(',')>0){
                            dbProductTags.split(',').forEach(each=>{
                                if(each.trim().length>0 && checkStr.indexOf(each)<0){
                                    checkStr += each;
                                    that.categories.push({label:each,checked:false});
                                }
                            })
                        }
                    }
			},

            chooseTag(index){
                let that = this;
                that.isLoad =true;
                //计算当前选中标签
                let checkedLabels=[];
                that.checkedProductList=[];

                //点全部
                if(index==0 ){
                    checkedLabels.push('全部');
                    that.categories[0].checked = true;
                    that.checkedProductList = that.productList;
                    that.categories.forEach(category=>{
                        if(category.label!='全部') {
                            category.checked = false;
                        }
                    });
                }else {
                    //计算当前被选中的标签集合
                    that.categories[index].checked = !that.categories[index].checked;
                    that.categories.forEach(category=>{
                        if(category.checked){
                            if(category.label!='全部'){
                                checkedLabels.push(category.label);
                            }
                        }
                    });

                    //如果没有选中，设定默认全部
                    if(checkedLabels.length==0){
                        checkedLabels.push('全部');
                        that.categories[0].checked = true;
                        that.checkedProductList = that.productList;
                    }else{
                        //去掉全部
                        that.categories[0].checked = false;
                        //刷新选中标签对应产品列表
                        that.productList.forEach(product=>{
                            let productTags = product.tags||'';
                            for(let x in checkedLabels){
                                if(productTags.indexOf(checkedLabels[x])>=0){
                                    that.checkedProductList.push(product);
                                    break;
                                }
                            }
                        })
                    }
                }
                that.$forceUpdate();
            },

			addProduct(item){
                let that = this;
                that.isPickProduct = true;
                that.trend.activityList=[];
                item.isSelected =true;
                that.trend.productList.push(item);
                that.isShowResource = that.trend.productList.length>0;
                that.$forceUpdate()
			},
			removeProduct(item){
			    let removeIndex = -1;
				for(let i=0;i<this.trend.productList.length;i++){
				    if(item._id=== this.trend.productList[i]._id){
                        removeIndex = i;
                        break;
					}
				}
                this.trend.productList.splice(removeIndex,1);
				item.isSelected = false;
				this.$forceUpdate()
			},
            async getActivityList(){
                // 选择所有上架商品
                if(this.activityList.length==0){
                    let  that = this;
					let res = await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'getActivityListByCardId',
                            cardId:that.user.userInfo.bizCardId
                        }
                    });
                    that.activityList = res.result.data;
                    if(that.activityList.length>0){
                        that.activityList.forEach(each=>{
                            each.isSelected = false;
                            let parseSignUp = each.sign_up.date+' '+each.sign_up.time;
                            let parseSignIn = each.sign_in.date+' '+each.sign_in.time;
                            each.sign_up = parseSignUp;
                            each.sign_in = parseSignIn;
                        });
                        that.$forceUpdate()
                    }
                }
            },
            addActivity(item){
                this.isPickProduct = false;
                this.trend.productList=[];
                item.isSelected =true;
                this.trend.activityList.push(item);
                this.isShowResource = this.trend.activityList.length>0;
                this.$forceUpdate()
            },
            removeActivity(item){
                let removeIndex = -1;
                for(let i=0;i<this.trend.activityList.length;i++){
                    if(item._id=== this.trend.activityList[i]._id){
                        removeIndex = i;
                        break;
                    }
                }
                this.trend.activityList.splice(removeIndex,1);
                item.isSelected = false;
                this.$forceUpdate()
            },

            showModal(e) {
                this.isShowResource = true;
                this.modalName = e.currentTarget.dataset.target;
            },

            hideModal(e) {
                this.isShowResource = false;
                this.modalName = null
            },
            tabSelect(e) {
                this.tabCur = e.currentTarget.dataset.id;
                this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
                if(this.tabCur===0){
                }else if(this.tabCur===1){
                }
                else if(this.tabCur===2){
                }
            },
		}
	}
</script>

<style>
    .product-menu{
		border-radius: 20rpx;
	}
	page {
		background-image: var(--gradualBlue);
		width: 100vw;
		overflow: hidden;
	}

	.DrawerPage {
		position: fixed;
		width: 100vw;
		height: 85vh;
		left: 0vw;
		background-color: #f1f1f1;
		transition: all 0.4s;
	}

	.DrawerPage.show {
		transform: scale(0.9, 0.9);
		left: 88vw;
		box-shadow: 0 0 60upx rgba(0, 0, 0, 0.2);
		transform-origin: 0;
	}

	.DrawerWindow {
		position: absolute;
		width: 85vw;
		height: 100vh;
		left: 0;
		top: 0;
		transform: scale(0.9, 0.9) translateX(-100%);
		opacity: 0;
		pointer-events: none;
		transition: all 0.4s;
		padding: 100upx 0;
	}

	.DrawerWindow.show {
		transform: scale(1, 1) translateX(0%);
		opacity: 1;
		pointer-events: all;
	}

	.DrawerClose {
		position: absolute;
		width: 40vw;
		height: 100vh;
		right: 0;
		top: 0;
		color: transparent;
		padding-bottom: 30upx;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.6));
		letter-spacing: 5px;
		font-size: 50upx;
		opacity: 0;
		pointer-events: none;
		transition: all 0.4s;
	}

	.DrawerClose.show {
		opacity: 1;
		pointer-events: all;
		width: 15vw;
		color: #fff;
	}

	.DrawerPage .cu-bar.tabbar .action button.cuIcon {
		width: 64upx;
		height: 64upx;
		line-height: 64upx;
		margin: 0;
		display: inline-block;
	}

	.DrawerPage .cu-bar.tabbar .action .cu-avatar {
		margin: 0;
	}

	.DrawerPage .nav {
		flex: 1;
	}

	.DrawerPage .nav .cu-item.cur {
		border-bottom: 0;
		position: relative;
	}

	.DrawerPage .nav .cu-item.cur::after {
		content: "";
		width: 10upx;
		height: 10upx;
		background-color: currentColor;
		position: absolute;
		bottom: 10upx;
		border-radius: 10upx;
		left: 0;
		right: 0;
		margin: auto;
	}

	.DrawerPage .cu-bar.tabbar .action {
		flex: initial;
	}

	.action{
		padding: 20rpx 20rpx 20rpx 20rpx;
		font-size: 42rpx;
	}

</style>
