<template>
    <view class="bg-white">
        <cu-custom  :isBack="true">
			<block slot="backText">返回</block>
            <block slot="content">关于我们</block>
        </cu-custom>
        <swiper class="screen-swiper  square-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="500" >
            <swiper-item v-for="(item,index) in swiperList" :key="index">
                <image :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
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
			<view class="cu-tabbar-height"></view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
		<view class="cu-bar bg-white tabbar border shop foot">
			<button class="action" @tap="goMy">
				<view class="cuIcon-my"></view>我的
			</button>
			<!--  #ifdef MP-WEIXIN -->
			<button class="action" open-type="share">
				<view class="cuIcon-share"></view> 分享
			</button>
			<button class="action" @tap="goEdit" >
				<view class="cuIcon-edit"></view> 编辑
			</button>
			<!--  #endif -->
			<view  class="bg-white submit text-lg"  ></view>
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
                bizCard:{},
				swiperList:[]
            }
        },
		onLoad(options){
			this.getDetail(options.id);
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
            ...mapState(['user']),
        },
        methods: {
            async getDetail(cardId){
                let that = this;
                let res = null;
                // #ifdef MP-WEIXIN
                res=  await wx.cloud.callFunction({
                    name: 'sys',
                    data: {
                        $url: 'getCardDetailById',
                        id: cardId,
                    }
                });
                that.bizCard = res.result.data;
                // #endif
                // #ifdef H5
                res=  await cloudbase.callFunction({
                    name: 'web',
                    data: {
                        $url: 'getCardDetailById',
                        id: cardId,
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
            },

            shareBizCard(){
                uni.showShareMenu({
                    withShareTicket:true,
                })
            },
			
            goMy(){
                uni.reLaunch({
                    url: '/pages/my/home',
                })
            },

            goEdit(){
                uni.navigateTo({
                    "url":"/pagesMgt/BizAboutInput?id="+this.bizCard._id,
                })
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
</style>