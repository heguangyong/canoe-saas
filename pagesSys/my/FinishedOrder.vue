<template>
	<view>
		<cu-custom    :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">订单详情</block>
		</cu-custom>
		<view class="page">
			<view class="margin-xs flex align-center text-center" >
				<text class="padding-xxl bg-green text-xxl radius" style="width: 100%;">已完成</text>
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
						<view v-if="item.item_state=='applyReturnPay'||item.item_state=='shipped'||item.item_state=='finished'" class="cu-form-group">
							<view class="title"></view>
							<view  class="text-left text-grey" @tap="applyReturnPay(item.id)">申请退款</view>
						</view>
						<view v-if="item.item_state=='waitReturnPay'" class="cu-form-group">
							<view class="title"></view>
							<view class="text-left text-grey" @tap="waitReturnPay(item.id)">待商家处理</view>
						</view>
						<view v-if="item.item_state=='disagreeReturnPay'" class="cu-form-group">
							<view class="title"></view>
							<view  class="text-left text-grey">商家拒绝退款</view>
						</view>
						<view v-if="item.item_state=='finishReturnPay'" class="cu-form-group">
							<view class="title"></view>
							<view class="text-left text-grey" @tap="goFinishReturnPay(item.id)">退款成功</view>
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
					<view class="text-left">共{{order.order_total_item_num}}件，实付款<text class="margin-left-sm text-red text-lg text-bold">{{'¥ '+parseFloat(order.need_price).toFixed(2)}}</text></view>
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
				<view class="cu-form-group">
					<view class="title" style="font-size: 26upx">支付方式</view>
					<view class="text-left">{{order.pay_type}}</view>
				</view>
				<view class="cu-form-group">
					<view class="title" style="font-size: 26upx">支付时间</view>
					<view class="text-left">{{formatDateTime(order.pay_at)}}</view>
				</view>
			</view>

			<view class="cu-tabbar-height"></view>
			<view class="cu-tabbar-height"></view>
			<view  class="cu-bar bg-white tabbar border  foot">
				<view class="bg-green submit text-lg"   @tap="startTalk"><text class="cuIcon-message lg text-bold margin-right-sm"></text>联系商家</view>
			</view>
		</view>
	</view>
</template>

<script>
    import { mapState,mapMutations } from 'vuex'
    import cmnUtils from '@/utils/cmnUtils.js'

    export default {
        data() {
            return {
                order: {
                    _id:'',
					recipient:{key:'',name:'',phone:'',address:'',remark:''},
					items:[],
					order_price:0,
                    need_price:0,
					price_items:0,
					price_shipping:0,
					order_total_item_num:0,
					order_num:'',
					create_at:null,
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
                        $url:'getOrderById',
                        id:that.order._id,
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

            //开始聊天
            startTalk(){
                uni.navigateTo({
                    "url":"/pagesSys/site/service"
                })
            },

            applyReturnPay(itemId){
                uni.navigateTo({
                    "url":"/pagesSys/my/ApplyReturnPay?id="+this.order._id+"&itemId="+itemId
                })
			},

            waitReturnPay(itemId){
                uni.navigateTo({
                    "url":"/pagesSys/my/WaitReturnPay?id="+this.order._id+"&itemId="+itemId
                })
            },
            goFinishReturnPay(itemId){
                uni.navigateTo({
                    "url":"/pagesSys/my/FinishReturnPay?id="+this.order._id+"&itemId="+itemId
                })
			}
        }
    }
</script>

<style>
	.page{
		z-index: 0;
		height: 100vh;
	}
</style>
