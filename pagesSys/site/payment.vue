<template>
    <view class="bg-white">
        <cu-custom  :isBack="true">
			<block slot="backText">返回</block>
            <block slot="content">电子缴费</block>
        </cu-custom>
		<scroll-view scroll-y>
			<view class="content-box" v-for="(item,index) in bizCard.pay_info" v-if="item.is_open" :key="index" @tap="goUrl(item.url)">
			    <image class="qrcode-image" :src="item.qrcode" mode="aspectFit" ></image>
			    <view class="content-text">
			        <text class="text-grey margin-right-sm">{{item.title}}</text>
			        <text>{{item.remark}}</text>
			    </view>
			</view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
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
                bizCard:{pay_info:[]},
            }
        },
		onLoad(){
			this.getDetail();
		},
        computed:{
            ...mapState(['user']),
        },
        methods: {
            async getDetail(){
                let that = this;
                let res = null;
                // #ifdef MP-WEIXIN
                res= await wx.cloud.callFunction({
                    name: 'sys',
                    data: {
                        $url: 'getCardDetailById',
                        id: that.user.userInfo.bizCardId,
                    }
                })
                that.bizCard = res.result.data;
                // #endif
                // #ifdef H5
                res= await cloudbase.callFunction({
                    name: 'web',
                    data: {
                        $url: 'getCardDetailById',
                        id: that.user.userInfo.bizCardId,
                    }
                })
                that.bizCard = JSON.parse(res.result.data);
                // #endif
            },

            sharePayment(){
                uni.showShareMenu({
                    withShareTicket:true,
                })
            },

            onShareAppMessage:function(res){
                if(res.from==='button'){
                }
                return{
                    title:'这是'+this.bizCard.name+'的名片，请惠存。',
                    path:"/pagesSys/site/payment",
                    success:function(res){
                    }
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
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
    
    .meeting-image {
        /* #ifndef APP-NVUE */
        display: flex;
        /* #endif */
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 500rpx;
        height: 390rpx;
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