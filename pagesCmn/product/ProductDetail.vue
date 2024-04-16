<template>
    <view>
        <cu-custom    :isBack="true">
			<block slot="backText">返回</block>
            <block slot="content">产品详情</block>
        </cu-custom>
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
			<textarea v-if="product.detail.content" readonly disabled class="text-box font40 width100 padding-sm solid text-gray text-cut" style="height: 110rpx; background-color:gainsboro" scroll-y="true" maxlength="200"  v-model="product.detail.content" >
            </textarea>
            <view v-if="product.detail.videos.length>0">
                <video  :src="product.detail.videos[0]" objectFit='contain' controls show-mute-btn muted></video>
            </view>
            <image v-for="(item,index) in product.detail.images" :key="index" :src="item" :data-src="item" @tap="previewImage" mode="widthFix" style="vertical-align: middle;"></image>
			<view class="cu-tabbar-height"></view>
			<view class="cu-tabbar-height"></view>
			<view  class="cu-bar bg-white tabbar border  foot">
			    <button class="action" @tap="goMy">
			        <view class="cuIcon-home"></view>我的
			    </button>
				<!-- #ifdef MP-WEIXIN -->
			    <button class="action" open-type="share" :data-product="product">
			        <view class="cuIcon-share"></view> 分享
			    </button>
				<!-- #endif -->
				<button class="action" @tap="goEdit" >
					<view class="cuIcon-edit"></view> 编辑
				</button>
				<button class="action" @tap="doRemove" >
					<view class="cuIcon-delete text-red"></view><text class="text-red">删除</text>
				</button>
				<view class="bg-white submit text-lg"></view>
			</view>
        </view>
	</view>
</template>

<script>
    import { mapState,mapMutations } from 'vuex'
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    import upsStepper from '@/components/ups-stepper/index.vue';
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    // #endif


    export default{
        components: {
            "uni-popup":uniPopup,
            "ups-stepper":upsStepper,
        },
        data() {
            return {
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
                priceAndUnitName:''
            };
        },

		onLoad(options) {
			if(options.id){
                this.product._id=options.id;
			}
		},
        onShow() {
            this.getDetail();
        },

        onShareAppMessage(res){
            if(res.from=== 'button'){
                let  product = res.target.dataset.product;
                return{
                    title:product.title,
                    imageUrl:product.cover||'',
                    path:"/pagesCmn/product/ShareProductDetail?id="+product._id,
                    success:function(r){
                        uni.showToast({
                            'icon':'success',
                            'title':'分享成功'
                        });
                    }
                }
            }
        },

		computed:{
			...mapState(['user']),
		},
    methods:{
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
            that.product = JSON.parse(res.result.data);
            // #endif
			that.product.num=1;
            that.priceAndUnitName = '¥ '+ parseFloat(that.product.price).toFixed(2) + that.product.unit_name;
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


        goMy(){
            uni.reLaunch({
                url: '/pages/my/home',
            })
        },

        goEdit(){
            uni.navigateTo({
                "url":"/pagesMgt/BizProductInput?id="+this.product._id,
            })
        },

        async doRemove(){
            let that = this;
            uni.showModal({
                icon:'none',
                title:'提示',
                content:'删除后不可恢复，确认删除？',
                cancelText: '取消',
                confirmText: '确认',
                success: res => {
                    if (res.cancel) {

                    }
                    if(res.confirm){
						wx.cloud.callFunction({
                            name:'cmn',
                            data:{
                                $url:'removeProduct',
                                content:that.product,
                            }
                        });
                        uni.showToast({ icon:'success',title:'删除成功'});
                        setTimeout (() => {
                            uni.navigateTo({
                                url:'/pagesMgt/BizProductList',
                            });
                        } , 1000 )
					}
                }
            });
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
