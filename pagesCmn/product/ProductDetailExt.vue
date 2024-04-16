<template>
    <view class="" :class="isUps == true ? 'prevent' : ''">
		<!-- #ifdef MP-WEIXIN-->
		<cu-custom    :isBack="true">
			<block slot="backText">返回</block>
            <block slot="content">产品详情</block>
			<block slot="right">
				<view class="action">
					<view class="cu-load load-cuIcon" :class="isLoad?'loading':'over'"></view>
				</view>
			</block>
        </cu-custom>
		<!-- #endif -->
        <view class="page bg-white">
			<view class="carousel">
				<swiper indicator-dots circular=true duration="400">
					<swiper-item class="swiper-item" v-for="(item,index) in product.carouse" :key="index" :data-src="item" @tap="previewImage">
						<view class="image-wrapper">
							<image
									:src="item"
									mode="aspectFill"
							></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
            <view class="cu-list menu-avatar">
            	<view class="cu-item" style="height: 110rpx; background-color:gainsboro" @tap="goQrcode(product._id)">
            		<view class="cu-avatar round ">
            			<image :src="product.avatar" mode="aspectFill" class="cu-avatar round "></image>
            		</view>
            		<view class="content flex-sub">
            			<view class="text-grey">{{product.title}}</view>
						<view  class="text-gray text-sm flex justify-between">
							价格：{{priceAndUnitName}}
						</view>
            		</view>
					<view class="action" >
						<text class="cuIcon-qr_code" style="font-size: 36px;"></text>
					</view>
            	</view>
            </view>
			<textarea v-if="product.detail.content" readonly disabled class="text-box font40 width100 padding-sm solid text-gray text-cut" style=" background-color:gainsboro" scroll-y="true" maxlength="200"  v-model="product.detail.content" >
            </textarea>
			<view v-if="product.detail.videos.length>0">
				<video  :src="product.detail.videos[0]" objectFit='contain' controls show-mute-btn muted></video>
			</view>
			<image v-for="(item,index) in product.detail.images" :key="index" :src="item" :data-src="item" @tap="previewImage" mode="widthFix" style="vertical-align: middle;"></image>
			<view class="cu-tabbar-height"></view>
			<view class="cu-tabbar-height"></view>
			<!-- #ifdef MP-WEIXIN -->
			<view v-if="!isUps" class="cu-bar bg-white tabbar border  foot">
			    <button class="action" @tap="goMy">
			        <view class="cuIcon-home"></view>我的
			    </button>
			    <button class="action" open-type="share" :data-product="product">
			        <view class="cuIcon-share"></view> 分享
			    </button>
			    <view class="action" @tap="startTalk">
			        <view class="cuIcon-message"></view>咨询
			  	</view>
				<view class="action" @tap="goWishOrderList">
					<view class="cuIcon-goods"></view>购物袋
				</view>
				<view class="action" @tap="showWishProduct">
					<view class="cuIcon-roundadd"></view>收藏
				</view>
			    <view v-if="product.on_sale" class="bg-green submit text-lg"   @tap="showBuyProduct">立即购买</view>
			    <view v-else class="bg-gray submit text-lg" >产品已下架</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="cu-bar bg-white tabbar border  foot">
				<view class="cu-bar bg-white tabbar border  foot">
					<view class="bg-grey submit text-lg">购买详询，请点击产品二维码进入小程序</view>
				</view>
			</view>
			<!-- #endif -->
        </view>
        <!-- 遮罩 -->
        <view class="shade" v-if="isUps"></view>
        <!-- 底部展现收藏弹窗 -->
        <uni-popup ref="showPopupWishProduct" type="bottom" @change="change">
        	<view class="popup bg-white">
        		<text class="cuIcon-close popup-close" @click="cancel('PopupWishProduct')"></text>
        		<text class="popup-title" >加入购物袋</text>
        		<view class="popup-content">
        			<scroll-view class="ups-height" scroll-y="true">
						<view  class="cu-card article" style="width: 100%">
							<view class="cu-item shadow" style="margin: 10rpx;padding: 20rpx 0">
								<view class="content">
									<image :src="product.cover" class="bg-gray" mode="aspectFill" ></image>
									<view class="desc">
										<view class="text-content">
											{{product.title}}
											<text class="text-cut text-sm">
											{{product.detail.content}}
											</text>
										</view>
										<view class="flex margin-top-sm justify-between">
											<view  class="cu-capsule radius ">
												<text class="text-red">
													{{priceAndUnitName}}
												</text>
											</view>
											<view>
                                            	<ups-stepper :label='product._id' :max="100" :val="product.num" :step="1" :min="1" @change="stepper"></ups-stepper>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
        				<view>
        					<view class="cu-bar solid-bottom margin-top-xxs radius"></view>
        					<view class="cu-bar btn-group  foot bg-white">
        						<button class="cu-btn   round line-grey" :disabled="isLoad"  @click="submitOrder"> 确定 </button>
        					</view>
        				</view>
        			</scroll-view>
        		</view>
        	</view>
        </uni-popup>
		<!-- 底部展现购买弹窗 -->
		<uni-popup ref="showPopupBuyProduct" type="bottom" @change="change">
			<view class="popup bg-white">
				<text class="cuIcon-close popup-close" @click="cancel('PopupBuyProduct')"></text>
				<text class="popup-title" >购买</text>
				<view class="popup-content">
					<scroll-view class="ups-height" scroll-y="true">
						<view  class="cu-card article" style="width: 100%">
							<view class="cu-item shadow" style="margin: 10rpx;padding: 20rpx 0">
								<view class="content">
									<image :src="product.cover" class="bg-gray" mode="aspectFill" ></image>
									<view class="desc">
										<view class="text-content">
											{{product.title}}
											<text class="text-cut text-sm">
												{{product.detail.content}}
											</text>
										</view>
										<view class="flex margin-top-sm justify-between">
											<view  class="cu-capsule radius ">
												<text class="text-red">
													{{priceAndUnitName}}
												</text>
											</view>
											<view>
													<ups-stepper :label='product._id' :max="100" :val="product.num" :step="1" :min="1" @change="stepper"></ups-stepper>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view>
							<view class="cu-bar solid-bottom margin-top-xxs radius"></view>
							<view class="cu-bar btn-group  foot bg-white">
								<button class="cu-btn   round line-grey" :disabled="isLoad"  @click="placeOrder"> 确定 </button>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
    import { mapState,mapMutations } from 'vuex'
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    import upsStepper from '@/components/ups-stepper/index.vue';
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    import jweixin from 'jweixin-module';
    // #endif
	
	
    export default{
        components: {
            "uni-popup":uniPopup,
            "ups-stepper":upsStepper,
        },
        data() {
            return {
                isLoad:false,
                isUps:false,
                product:{
                    _id:'',
					qrcode:'',
                    detail:{
                        content:'',
                        images:[],
                        imgList:[],
                        videos:[]
                    },
					num:1
                },
                priceAndUnitName:'',
                authBizInfo:{}
            };
        },

        onLoad(options) {
            let that = this;
            if(options.id){
                that.product._id=options.id;
                that.getDetail();
            }
            //扫码加好友
            else if (options.scene) {
                that.paramsStr +='scene='+options.scene;
                let res = {};
                let params = decodeURIComponent(options.scene).split("&");
                params.forEach(item => {
                    let paramMap = item.split("=");
                    res[paramMap[0]] = paramMap[1];
                    if(paramMap[0]=='qrcode'){
                        that.product.qrcode=paramMap[1];
                    }
                });
                that.getDetailByQrcode();
            }
            //根据产品获取企业名片
            that.authBizInfo = {_id:that.product.card_id,name:that.product.name,avatar:that.product.avatar};
            that.needWxAuth(that.authBizInfo);
        },
        onReady(){
            wx.setNavigationBarTitle({
                title: "产品详情"
            })
        },

		onShareAppMessage(res){
		    if(res.from=== 'button'){
		        let  product = res.target.dataset.product;
		        return{
		            title:product.title,
		            imageUrl:product.cover||'',
		            path:"/pagesCmn/product/ShareProductDetail?id="+product._id,
		            // success:function(r){
		            //     uni.showToast({
		            //         'icon':'success',
		            //         'title':'分享成功'
		            //     });
		            // }
		        }
		    }
		},
        //必须要全静态页面，否则数据加载不了
        // onShareTimeline(){
         //    return {
         //        title: this.product.title,
         //        imageUrl: this.product.cover||'',
         //        path:"/pagesCmn/product/ShareProductDetail?id="+this.product._id,
         //    }
		// },

		computed:{
			...mapState(['needAuthFlag','user','cardAccount']),
		},
    methods:{
        ...mapMutations(['needWxAuth','wxAuth','updateUser','updateUserAuth']),

		ShareProductDetail(){
		    uni.showShareMenu({
		        withShareTicket:true,
		    })
		},
		async getDetail(){
		    let that = this;
            let res = null;
            // #ifdef MP-WEIXIN
			res = await wx.cloud.callFunction({
		        name:'cmn',
		        data:{
		            $url:'getProductDetail',
		            id:that.product._id
		        }
		    });
			that.product = res.result.data;
            // #endif
            // #ifdef H5
			res = await cloudbase.callFunction({
                name:'web',
                data:{
                    $url:'getProductDetail',
                    id:that.product._id
                }
            });
			// console.log('product',res.result.data);
            that.product = JSON.parse(res.result.data);
            //-------------------------
            //提供分享公众号能力
            res = await cloudbase.callFunction({
                name:'web',
                data:{
                    $url:'signWeixin',
                    url:"/pagesCmn/product/ShareProductDetail?id="+that.product._id,
                    needRefreshSignature:false
                }
            });
            let signRet =  JSON.parse(res.result.data);
            console.log('sign',res.result.data);
            jweixin.config({
                debug: true, // 调试，发布的时候改为false
                appId: 'wxc42ba3b82548c8b6',
                nonceStr: signRet.nonceStr,
                timestamp: signRet.timestamp,
                signature: signRet.signature,
                jsApiList: [ // 可能需要用到的能力
                    'updateAppMessageShareData',
                    'updateTimelineShareData'
                ],
            });

            jweixin.error ((res)=>{
                console.log('jweixin.error',res);
                //刷新后再分享
                cloudbase.callFunction({
                    name:'web',
                    data:{
                        $url:'signWeixin',
                        url:"/pagesCmn/product/ShareProductDetail?id="+that.product._id,
                        needRefreshSignature:true
                    }
                })
            });

            jweixin.ready(() => {   //需在用户可能点击分享按钮前就先调用
                jweixin.updateAppMessageShareData({
                    title: that.product.title, // 分享标题
                    desc: that.product.detail.content, // 分享描述
                    link: "/pagesCmn/product/ShareProductDetail?id="+that.product._id, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl:  that.product.cover, // 分享图标
                    success: function () {
                        // 设置成功
                        console.log('success');
                    }
                })
            });
            //-------------------------

            // #endif
			that.product.num=1;
            that.priceAndUnitName = '¥ '+ parseFloat(that.product.price).toFixed(2) + that.product.unit_name;
            //根据产品获取企业名片
            that.authBizInfo = {_id:that.product.card_id,name:that.product.name,avatar:that.product.avatar};
            that.needWxAuth(that.authBizInfo);


		},

        async getDetailByQrcode(){
            let that = this;
            let res = {};
            // #ifdef MP-WEIXIN
            res =await wx.cloud.callFunction({
                name: 'cmn',
                data: {
                    $url: 'getProductDetailByQrcode',
                    qrcode: that.product.qrcode,
                }
            });
            that.product = res.result.data;
            // #endif
            // #ifdef H5
            res =await cloudbase.callFunction({
                name: 'web',
                data: {
                    $url: 'getProductDetailByQrcode',
                    qrcode: that.product.qrcode,
                }
            });
            that.product = JSON.parse(res.result.data);
            // #endif
            that.product.num=1;
            that.priceAndUnitName = '¥ '+ parseFloat(that.product.price).toFixed(2) + that.product.unit_name;
            //根据产品获取企业名片
            that.authBizInfo = {_id:that.product.card_id,name:that.product.name,avatar:that.product.avatar};
            that.needWxAuth(that.authBizInfo);
        },

		previewImage(e){
			let that = this;
			console.log(e);
			let image = "";
			let images = [];
			image = e.currentTarget.dataset.src;
			for(let i in that.product.carouse){
				images.push(that.product.carouse[i])
			}
			for(let j=0;j<that.product.detail.images.length;j++){
				images.push(that.product.detail.images[j])
			}
			wx.previewImage({
				current:image,
				urls:images
			})
		},
        goWebLogin(){
            uni.navigateTo({
                "url":"/pages/my/WebLogin"
            })
        },

		//开始聊天
		async startTalk(){ 
			let that = this;
            if(that.needAuthFlag){
                that.wxAuth(that.authBizInfo);
                setTimeout (() => {
                    that.startTalk();
                } , 2000 );
                return;
            }
            that.updateUserAuth(that.authBizInfo);
            // #ifdef MP-WEIXIN
            setTimeout (() => {
            uni.navigateTo({
                "url":"/pagesSys/site/service"
            });
            } , 1000 )
            // #endif
            // #ifdef H5
            uni.navigateTo({
                "url":"/pagesSys/site/WebService"
            })
            // #endif
		},
		
		goMy(){
            let that = this;
            if(that.needAuthFlag){
                that.wxAuth(that.authBizInfo);
                setTimeout (() => {
                    that.goMy();
                } , 2000 );
                return;
            }
            that.updateUserAuth(that.authBizInfo);
            setTimeout (() => {
		    uni.reLaunch({
		        url: '/pages/my/home',
		    })
        	} , 1000 );
		},
		
        goWishOrderList(){
            let that = this;
            if(that.needAuthFlag){
                that.wxAuth(that.authBizInfo);
                setTimeout (() => {
                    that.goWishOrderList();
                } , 2000 );
                return;
            }
            that.updateUserAuth(that.authBizInfo);
            setTimeout (() => {
            uni.navigateTo({
                "url":"/pagesSys/my/WishOrderList"
            });
            } , 1000 );
		},
        showWishProduct(){
        	let that = this;
            if(that.needAuthFlag){
                that.wxAuth(that.authBizInfo);
                setTimeout (() => {
                    that.showWishProduct();
                } , 2000 );
                return;
            }
            that.updateUserAuth(that.authBizInfo);
            that.$nextTick(() => {
                that.isUps=true;
                that.$refs['showPopupWishProduct'].open();
            })
        },
        showBuyProduct(){
            let that = this;
            if(that.needAuthFlag){
                that.wxAuth(that.authBizInfo);
                setTimeout (() => {
                    that.showBuyProduct();
                } , 2000 );
                return;
            }
            that.updateUserAuth(that.authBizInfo);
            that.$nextTick(() => {
                that.isUps=true;
                that.$refs['showPopupBuyProduct'].open();
            })
        },

		 
		 cancel(type){
		     this.$refs['show' + type].close()
		 },
		 
		 change(e){
		     if(e.show){
		         this.isUps = true;
		     }else{
		         this.isUps =false;
		     }
		 },

		//步进器
		stepper(e){
			console.log(e)
			//存购物记录
			if(e.val > 0){
				this.product.num=e.val;
			}
		},

        //提交订单//活动跟商品公用该方法
        async submitOrder(){
            let that = this;
            let items =[{
					id:that.product._id,
					num:that.product.num,
					cover:that.product.carouse[0],
					title:that.product.title,
					content:that.product.detail.content,
					price:that.product.price,
					unit_name:that.product.unit_name,
					new_price:that.product.price,
					discount:10,
				}];
			let order ={};
			order.seller_avatar=that.product.avatar;
			order.seller_name=that.product.name;
			order.user_id=that.user._id;
			order.avatar= that.user.userInfo.avatarUrl;
			order.name= that.user.userInfo.nickName;
			order.items=items;
			order.order_state='wish';//购物车
			that.isLoad =true;
            await wx.cloud.callFunction({
                name:'cmn',
                data:{
                    $url:'addWishOrder',
                    order:order
                }
            });
            that.isLoad =false;
            uni.showToast({
                icon:'success',
                title:'加入购物袋成功'
            });
            that.$refs['showPopupWishProduct'].close();
            setTimeout (() => {
                uni.navigateTo({
                    url:'/pagesSys/my/WishOrderList',
                });
            } , 1000 )
        },

        async placeOrder(){
            let that = this;
            that.isLoad =true;
            let items =[{
                id:that.product._id,
                num:that.product.num,
                cover:that.product.carouse[0],
                title:that.product.title,
                content:that.product.detail.content,
                price:that.product.price,
                unit_name:that.product.unit_name,
                new_price:that.product.price,
                discount:10,
            }];
            let order ={};
            order.seller_avatar=that.product.avatar;
            order.seller_name=that.product.name;
            order.user_id=that.user._id;
            order.avatar= that.user.userInfo.avatarUrl;
            order.name= that.user.userInfo.nickName;
            order.items=items;
            order.order_state='wish';//购物车
            let res = await wx.cloud.callFunction({
                name:'cmn',
                data:{
                    $url:'addWishOrder',
                    order:order
                }
            });
			that.isLoad = false;
            console.log('addWishOrder res',res);
            uni.showToast({
                icon:'success',
                title:'生成订单成功'
            });
            that.$refs['showPopupBuyProduct'].close();
            setTimeout (() => {
                uni.navigateTo({
                    url:'/pagesSys/my/NeedConfirmOrder?orderIds='+res.result._id,
                });
            } , 1000 )
        },

        goQrcode(id){
		    console.log('goQrcode',id);
            uni.navigateTo({
                url:"/pagesCmn/product/ProductQrcode?id="+ id
            })
        },
    },

    }
</script>

<style lang='scss'>
  .page{
  	z-index: 0;
  	height: 100vh;
  }

  video {
  	width: 750rpx;
  }
  image {
  	width: 750rpx;
  }

  .carousel {
	  height: 600rpx;
	  position:relative;
	  swiper{
		  height: 100%;
	  }
	  .image-wrapper{
		  width: 100%;
		  height: 100%;
	  }
	  .swiper-item {
		  display: flex;
		  justify-content: center;
		  align-content: center;
		  overflow: hidden;
		  image {
			  width: 100%;
			  height: 100%;
		  }
	  }
  }
  
  /* 底部分享 */
  .popup {
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
  
  .popup-close {
  	position:absolute;
  	top:30rpx;
  	left:30rpx;
  	font-size: 39rpx;
  	text-align: center;
  	font-weight: bold;
  	z-index: 199;
  }
  
  .popup-title {
  	margin-top:15rpx;
  	line-height: 60rpx;
  	font-size: 28rpx;
  	padding: 5rpx 0;
  	text-align: center;
  	font-weight: bold;
  }
  
  .popup-content {
  	/* #ifndef APP-NVUE */
  	display: flex;
  	/* #endif */
  	flex-direction: row;
  	flex-wrap: wrap;
  	justify-content: center;
  	padding: 5px;
  	max-height: 950rpx;
  }
  
  /* 起到固定的作用 ,从而解决原页面触摸穿透的问题*/
  .prevent {
  	width: 100%;
  	height: 100%;
  	/*自动回到顶部*/
  	/*position: fixed;*/
  	top: 0;
  	left: 0;
  	overflow: hidden;
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
  
  .ups-height{
  	height: 850rpx;
  	position: fixed;
  	left:0;
  	bottom: 0;
  	z-index: 99;
  }
</style>
