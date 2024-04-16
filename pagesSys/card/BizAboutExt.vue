<template>
    <view class="bg-white">
        <cu-custom >
            <block slot="content">关于我们</block>
        </cu-custom>
        <swiper class="screen-swiper  square-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="500" >
            <swiper-item v-for="(item,index) in swiperList" :key="index">
				<!-- aspectFill aspectFit-->
                <image :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
				<!-- cover fill contain-->
                <video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover" v-if="item.type=='video'"></video>
            </swiper-item>
        </swiper>
		<scroll-view scroll-y>
			<view class="padding-xs">
				<view class="solid-bottom text-xl padding">
					<text class="text-grey">{{bizCard.introduce}}</text>
				</view>
			</view>
			<view class="padding-xs">
				<view class="solid-bottom text-df padding">
					<view class="text-grey">联系电话：{{bizCard.phone||''}}</view>
					<view class="text-grey">联系地址：{{bizCard.mailing_address||''}}</view>
				</view>
			</view>
			<view class="content-box solid-bottom margin-bottom-xl">
				<image class="qrcode-image" :src="bizCard.qrcode_info.fileID" mode="aspectFit" ></image>
				<view class="content-text">{{bizCard.name}}</view>
			</view>
			<view class="cu-tabbar-height"></view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
		
		<view class="cu-bar tabbar foot bg-white">
			<view class="action"  @tap="goHome">
				<view class="cuIcon-cu-image">
					<text class="cuIcon-home lg text-bold text-grey"></text>
				</view>
				<view class="text-gray">首页</view>
			</view>
			<view class="action" @tap="goQQMap">
				<view class="cuIcon-cu-image">
					<text class="cuIcon-location lg text-bold text-grey"></text>
				</view>
				<view class="text-gray">去拜访</view>
			</view>
			<view class="action"  @tap="startTalk">
				<view class="cuIcon-cu-image">
					<text class="cuIcon-message lg text-bold text-grey"></text>
				</view>
				<view class="text-gray" >咨询</view>
			</view>
			<view class="action" @tap="dailPhone">
				<view class="cuIcon-cu-image">
					<text class="cuIcon-phone lg text-bold text-grey"></text>
				</view>
				<view class="text-gray">客服电话</view>
			</view>
			<view class="action">
				<!--  #ifdef MP-WEIXIN -->
				<button class="btn-share" hover-class="none" open-type="share" >
					<view class="cuIcon-share text-grey" style="font-size: 38rpx; margin-top:-16rpx;"></view>
					<view class="text-sm text-gray" style="margin-top:-42rpx;">分享</view>
				</button>
				<!--  #endif -->
			</view>
		</view>
    </view>
</template>

<script>
    import { mapState,mapMutations } from 'vuex'
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    // #endif

    export default {
        data() {
            return {
                bizCard:{_id:''},
				swiperList:[],
            }
        },

		onLoad(options){
            this.bizCard._id=options.id;
			this.getDetail();
		},

        onShareAppMessage:function(res){
            if(res.from==='button'){
            }
            return{
                title:'这是'+this.bizCard.name+'的名片，请惠存。',
                imageUrl:this.bizCard.cover||'',
                path:"/pagesSys/card/BizAboutExt?id="+this.bizCard._id,
                success:function(res){
                }
            }
        },
        computed:{
            ...mapState(['needAuthFlag','user']),
        },
        methods: {
            ...mapMutations(['needWxAuth','wxAuth','updateUser','updateUserAuth']),

            async getDetail(){
                let that = this;
                let res = null;
                // #ifdef MP-WEIXIN
                res=  await wx.cloud.callFunction({
                    name: 'sys',
                    data: {
                        $url: 'getCardDetailById',
                        id: that.bizCard._id,
                    }
                });
                that.bizCard = res.result.data;
                // #endif
                // #ifdef H5
                res=  await cloudbase.callFunction({
                    name: 'web',
                    data: {
                        $url: 'getCardDetailById',
                        id: that.bizCard._id,
                    }
                });
                that.bizCard = JSON.parse(res.result.data);
				// #endif
				if(that.bizCard.carousels && that.bizCard.carousels.length>0){
                    that.bizCard.carousels.forEach(each=>{
                        that.swiperList.push({'url':each,'type':'image'});
                    });
				}
				if(that.bizCard.videos && that.bizCard.videos.length>0){
                    that.bizCard.videos.forEach(each=>{
                        that.swiperList.push({'url':each,'type':'video'});
                    });
				}
                if(that.swiperList.length==0){
                    that.swiperList.push({'url':that.bizCard.avatar,'type':'image'});
                }
                that.needWxAuth(that.bizCard);
            },

            shareBizCard(){
                uni.showShareMenu({
                    withShareTicket:true,
                })
            },
			
			async goHome(){
                let that = this;
                if(that.needAuthFlag){
                    that.wxAuth(that.bizCard);
                    setTimeout (() => {
                       that.goHome();
                    } , 2000 );
                    return;
                }
                that.updateUserAuth(that.bizCard);
                setTimeout (() => {
                    uni.reLaunch({
                        "url":"/pages/my/home",
                    })
                } , 1000 )
			},
			dailPhone(){
			    let that = this;
			    uni.makePhoneCall({
			        phoneNumber:that.bizCard.phone
			    })
			},
			goQQMap(){
			    let that =this;
			    wx.openLocation({
			        latitude:that.bizCard.corp_address.latitude,
			        longitude:that.bizCard.corp_address.longitude,
			    })
			},

			//开始聊天
			async startTalk(){
                let that =this;
                if(that.needAuthFlag){
                    that.wxAuth(that.bizCard);
                    setTimeout (() => {
                        that.startTalk();
                    } , 2000 );
                    return;
                }
                that.updateUserAuth(that.bizCard);
                // #ifdef MP-WEIXIN
                setTimeout (() => {
                    uni.navigateTo({
                        "url":"/pagesSys/site/service"
                    })
                } , 1000 )

                // #endif
                // #ifdef H5
                uni.navigateTo({
                    "url":"/pagesSys/site/WebService"
                })
                // #endif
			},
        }
    }
</script>

<style lang="scss" scoped>
    .page{
        z-index: 0;
        /*height: 100vh;*/
    }

    .screen-swiper{
        min-height: 1340rpx;
    }
	

	.btn-share{
	    background-color:transparent;
	    border-style:none;
	}
	button::after {
	    border: 0;
	}

	.content-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		width: 100%;
	}

	.qrcode-image {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 390rpx;
		height: 500rpx;
		overflow: hidden;
		border-radius: 50rpx;
	}

	.content-text {
		font-size: 26rpx;
		color: #333;
		padding-top: 5px;
		padding-bottom: 10px;
	}
</style>