<template>
	<view>
		<view class="cu-slip bg-gray"></view>
		<view class="shadow-lg">
			<view class="cu-item  bg-white">
				<view class="cu-list menu-avatar">
					<view class="cu-item">
						<image v-if="trend.card_id" class="cu-avatar round " :src="trend.avatar" @tap="goCard"></image>
						<image v-else class="cu-avatar round " :src="trend.avatar" @tap="goCard"></image>
						<view class="content" @tap="goCard">
							<view >{{trend.name}}</view>
							<view class="text-gray text-sm flex justify-between">
							{{trend.createAt}}
						</view>
						</view>
						<view>
							<slot name="btnMore"></slot>
						</view>
					</view>
				</view>
				<view v-if="trend.carousels.length>0">
					<swiper class="screen-swiper" :indicator-dots="trend.carousels.length>1" :circular="true">
						<swiper-item v-for="(img,index) in trend.carousels" :key="index" @tap="previewImage">
							<image :src="img" mode="aspectFill" show-menu-by-longpress></image>
						</swiper-item>
					</swiper>
				</view>
				<view v-if="trend.videos.length>0">
					<swiper class="screen-swiper">
						<swiper-item @tap="goVideoList">
							<video :id="'vid'+idx" :src="trend.videos[0]"  :show-mute-btn="enabled"
								   :show-fullscreen-btn="enabled" :controls="enabled" :show-progress="enabled"
								   :show-play-btn="enabled" :show-center-play-btn="enabled"
								   :enable-play-gesture="enabled" :vslide-gesture-in-fullscreen="enabled"
								   loop objectFit="contain"></video>
						</swiper-item>
					</swiper>
				</view>
				<view class="text-content" v-if="trend.content" @longpress='copy' data-message="trend.content">
					{{trend.content }}
				</view>
				<!--活动项目-->
				<view v-if="trend.activityList.length>0" class="flex">
					<swiper class="product-screen-swiper" :circular="true" :autoplay="true" interval="10000" duration="5000">
						<swiper-item v-for="(item,index) in trend.activityList" :key="index">
							<ups-activity :activity="item"></ups-activity>
						</swiper-item>
					</swiper>
					<view class="icon-right">
						<slot name="btnEnroll"  v-if="trend.activityList.length>1"></slot>
					</view>
				</view>
				<!--产品项目-->
				<view v-if="trend.productList.length>0" class="flex">
					<swiper class="product-screen-swiper" :circular="true" :autoplay="true" interval="10000" duration="5000">
						<swiper-item v-for="(item,index) in trend.productList" :key="index">
							<ups-product :product="item"></ups-product>
						</swiper-item>
					</swiper>
					<view class="icon-right">
						<slot name="btnAll" v-if="trend.productList.length>1"></slot>
					</view>
				</view>
				<view class="margin-tb-xs flex">
					<view v-if="trend.isLike" class="cu-btn text-df bg-white flex-start align-center" @click="removeLike">
						<text class="cuIcon-likefill text-red"></text>
					</view>
					<view v-else class="cu-btn text-df bg-white flex-start align-center" @click="addLike">
						<text class="cuIcon-like"></text>
					</view>
					<text class="font-rl text-df text-gray margin-top-sm" v-if="trend.likes_num>0"> {{trend.likes_num}}</text>
					<view v-else style="width: 20rpx;"></view>
					<slot v-if="trend.is_open_comments" >
						<slot name="btnComments"></slot>
						<view v-if="trend.comments_num>0" class="font-rl text-df text-gray margin-top-sm" > {{trend.comments_num}}</view>
						<view v-else class="font-rl text-df text-gray" >\t</view>
					</slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import cmnUtils from '@/utils/cmnUtils.js'
	import upsProduct from '@/components/ups-product/index';
	import upsActivity from '@/components/ups-activity/index';

		
	export default {
		name:"UpsTrend",
		components:{
            "ups-activity":upsActivity,
			"ups-product":upsProduct,
		},
		props:{
			trend:{
				type:Object,
				required:true
			},
			idx:{
				type:Number,
				required:false,
				default:0
			}
		},
		data() {
			return {
				enabled:true,
				disable:false,
				trendVideo:null,
			};
		},

		mounted() {
			/**
			 * 只有视频才需要控制
			 */
			if(this.trend.videos.length>0){
				this.trendVideo=wx.createVideoContext('vid'+this.idx,this);
			}
		},
		methods:{
			playVideo(){
				if(this.trendVideo!=null){
					this.trendVideo.play();
                    this.$forceUpdate()
				}
			},
			pauseVideo(){
				if(this.trendVideo!=null){
					this.trendVideo.pause();
                    this.$forceUpdate()
				}
			 },
            stopVideo(){
                if(this.trendVideo!=null){
                    this.trendVideo.stop();
                    this.$forceUpdate()
                }
            },
            copy:function(e){
                this.$emit('operate','copy',this.trend,this.idx)
            },
			addFollow:function(e){
				this.$emit('operate','addFollow',this.trend,this.idx)
			},
			removeFollow:function(e){
				this.$emit('operate','removeFollow',this.trend,this.idx)

			},
			addLike:function(e){
				this.$emit('operate','addLike',this.trend,this.idx)
			},
			removeLike:function(e){
				this.$emit('operate','removeLike',this.trend,this.idx)
			},
			showComments:function(e){
				this.$emit('operate','showComments',this.trend,this.idx)
			},
			forward:function(e){
				this.$emit('operate','forward',this.trend,this.idx)
			},
            goDetail(e){
                this.$emit('operate','goDetail',this.trend,this.idx)
            },
            goCard(e){
                uni.reLaunch({url:'/pagesSys/site/about'})
            },
            previewImage(e){
                // 预览图片
                uni.previewImage({
                    urls: this.trend.carousels,
                });
            },
		},
	}
</script>

<style>
	.screen-swiper image,.screen-swiper video,.swiper-item image,.swiper-item video {
		pointer-events: auto;
	}
	.screen-swiper {
		min-height: 750rpx;
	}
	.text-content{
		font-size: 24rpx;
		margin-top: 10rpx;
		margin-left: 10rpx;
	}
	.product-screen-swiper{
		height: 85rpx;
		width: 95%;
		padding: 0 10rpx 0 10rpx;
	}
	.icon-right{
		float:right;
		padding:15rpx 20rpx 15rpx 15rpx;
	}
</style>
