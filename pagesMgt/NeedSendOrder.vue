<template>
	<view class="" :class="isUps == true ? 'prevent' : ''">
		<cu-custom    :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">订单详情</block>
		</cu-custom>
		<view class="page">
			<view class="margin-xs flex align-center text-center" >
				<text class="padding-xxl bg-green text-xxl radius" style="width: 100%;">待发货</text>
			</view>
			<view class="cu-bar  margin-top-sm solid-bottom">
				<view class="action">
					物流信息
				</view>
			</view>
			<view class="cu-list menu-avatar no-padding">
				<view class="cu-item  card-radius margin-top-xxs margin-left-xs margin-right-xs margin-bottom-xs">
					<view  class="cu-avatar round" >
						<view class="text-sm text-cut" >{{order.recipient.key}}</view>
					</view>
					<view class="content">
						<view class="text-grey">{{order.recipient.name}}
							<text class="margin-left-sm text-abc">{{order.recipient.phone}}</text>
						</view>
						<view class="text-gray text-sm text-cut" >{{order.recipient.address}}</view>

					</view>
				</view>
			</view>
			<view class="cu-bar  margin-top-sm solid-bottom">
				<view class="action">
					商品信息
				</view>
			</view>
			<view  class="cu-card article solid-bottom" style="width: 100%">
				<block v-for="(item,itemIndex) in order.items" :key="itemIndex">
					<view class="cu-item shadow flex solid-bottom" style="margin: 0 10rpx 0 10rpx; padding: 20rpx 0" >
						<view class="content" >
							<image :src="item.cover" class="bg-gray" style="width: 30%"  mode="aspectFill" @tap="goDetail(item.id)"></image>
							<view class="desc" style="width: 70%" >
								<view class="text-content" @tap="goDetail(item.id)">
									<text clas="text-bold">{{item.title}}</text>
									<text class="text-cut text-sm">
										{{item.content}}
									</text>
								</view>
								<view class="flex margin-top-sm  justify-between">
									<view  class="cu-capsule radius ">
										<text class="text-gray">
											{{'¥ '+parseFloat(item.price).toFixed(2)+item.unit_name}}
										</text>
									</view>
									<view class="text-gray">{{'x'+item.num}}</view>
								</view>
							</view>
						</view>
					</view>
				</block>
			</view>
			<view class="margin-xs solid-bottom">
				<view class="cu-form-group">
					<view class="title" style="font-size: 26upx">商品总价</view>
					<view class="text-left">{{'¥ '+parseFloat(order.price_items).toFixed(2)}}</view>
				</view>
				<view class="cu-form-group">
					<view class="title" style="font-size: 26upx">订单运费</view>
					<view class="text-left">{{'¥ '+parseFloat(order.price_shipping).toFixed(2)}}</view>
				</view>
				<view class="cu-form-group">
					<view class="title" ></view>
					<view class="text-left">共{{order.order_total_item_num}}件，实付款<text class="margin-left-sm text-red text-lg text-bold">{{'¥ '+parseFloat(order.order_price).toFixed(2)}}</text></view>
				</view>
			</view>

			<view class="margin-xs solid-bottom">
				<view class="cu-form-group">
					<view class="title" style="font-size: 26upx">订单编号</view>
					<view class="text-left">{{order.order_num}}</view>
				</view>
				<view class="cu-form-group">
					<view class="title" style="font-size: 26upx">用户备注</view>
					<view class="text-left">{{order.recipient.remark}}</view>
				</view>
				<view class="cu-form-group">
					<view class="title" style="font-size: 26upx">下单时间</view>
					<view class="text-left">{{formatDateTime(order.create_at)}}</view>
				</view>
			</view>

			<view class="cu-tabbar-height"></view>
			<view class="cu-tabbar-height"></view>
			<view v-if="!isUps" class="cu-bar bg-white tabbar border  foot">
				<view class="action" @tap="startTalk">
					<view class="cuIcon-cu-image">
						<text class="cuIcon-message lg text-bold text-grey"></text>
					</view>
					<view class="text-gray">联系商家</view>
				</view>
				<view class="action" @tap="cancelOrder">
					<view class="cuIcon-cu-image">
						<text class="cuIcon-delete lg text-bold text-grey"></text>
					</view>
					<view class="text-gray">取消订单</view>
				</view>
				<view class="bg-green submit text-lg"  style="width: 30%" @tap="showPayOrder">付款</view>
			</view>
		</view>
		<!-- 遮罩 -->
		<view class="shade" v-if="isUps"></view>
		<!-- 底部展现收藏弹窗 -->
		<uni-popup ref="showPopupPayOrder" type="bottom" @change="change">
			<view class="popup bg-white">
				<text class="cuIcon-close popup-close" @click="cancel('PopupPayOrder')"></text>
				<text class="popup-title" >扫码付款</text>
				<view class="popup-content">
					<scroll-view class="ups-height" scroll-y="true">
						<view>
							<view class="content-box" v-for="(item,index) in bizCard.pay_info" v-if="item.is_open" :key="index" @tap="goUrl(item.url)">
								<image class="qrcode-image" :src="item.qrcode" mode="aspectFit" ></image>
								<view class="content-text">
									<text class="text-grey margin-right-sm">{{item.title}}</text>
									{{'合计 ¥ '+parseFloat(order.order_price).toFixed(2)+' 订单编号:'}}<text class="text-red">{{order.order_num}}</text>
								</view>
							</view>
							<view class="cu-bar solid-bottom margin-top-xxs radius"></view>
							<view class="cu-bar btn-group  foot bg-white">
								<button class="cu-btn   round bg-green"   @click="payOrder"> 付款完成后，请点击确认按钮 </button>
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
    import cmnUtils from '@/utils/cmnUtils.js'
    import uniPopup from '@/components/uni-popup/uni-popup.vue';


    export default {
        components: {
            "uni-popup":uniPopup,
        },
        data() {
            return {
                isUps:false,
				bizCard:{},
                order: {
                    _id:'',
					recipient:{key:'',name:'',phone:'',address:'',remark:''},
					items:[],
					order_price:0,
					price_items:0,
					price_shipping:0,
					order_total_item_num:0,
					order_num:'',
					create_at:null
				},
                isRecipientRemark:false,//备注信息
            }
        },
		onLoad(options){
            if(options.id){
                this.order._id = options.id;
                console.log('orderId',this.order._id);
			}
		},
        onShow() {
            this.getDetail();
        },

        computed:{
            ...mapState(['user']),
            formatDateTime(){
                return function(time){
                    let currentTime = time;
                    if(currentTime){
                        return cmnUtils.formatTime(currentTime,'yyyy-MM-dd HH:mm')
                    }else{
                        return "";
                    }
                }
            },
        },
        methods:{
            ...mapMutations(['updateUser']),
            async getDetail(){
                let that = this;
                if (that.page == 1) {
                    that.orderList=[]
                }
                let res = null;
                res = await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'getNeedPayOrderById',
                        _id:that.order._id,
                    }
                });
                that.order = res.result.data;
				that.isRecipientRemark = !cmnUtils.isEmpty(that.order.recipient.remark);
            },

            goDetail(id){
                uni.navigateTo({
                    "url":"/pagesCmn/product/ProductDetailExt?id="+id
                })
            },

            async payOrder(){
                let that = this;
                that.order.order_state='needReceive';//准备收货
                await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'payOrder',
                        order:that.order
                    }
                });
                uni.showToast({
                    icon:'success',
                    title:'付款成功'
                });
                that.$refs['showPopupPayOrder'].close();
                setTimeout (() => {
                    uni.navigateTo({
                        url:'/pagesSys/my/NeedReceiveOrder?id='+order._id,
                    });
                } , 1000 )
			},

            //开始聊天
            startTalk(){
                uni.navigateTo({
                    "url":"/pagesSys/site/service"
                })
            },

            async showPayOrder(){
                let that = this;
                let res = await wx.cloud.callFunction({
					name:'sys',
					data:{
					    $url:'getCardDetailById',
						id:that.user.userInfo.bizCardId
					}
				});
                that.bizCard = res.result.data;
                that.$nextTick(() => {
                    that.isUps=true;
                    that.$refs['showPopupPayOrder'].open();
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
        }
    }
</script>

<style>
	.page{
		z-index: 0;
		height: 100vh;
	}
	/* 底部分享 */
	.popup {
		display: flex;
		flex-direction: column;
		height: 920rpx;
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
