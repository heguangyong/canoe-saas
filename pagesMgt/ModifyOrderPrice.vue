<template>
	<view class="" :class="isUps == true ? 'prevent' : ''">
		<cu-custom    :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">订单改价</block>
		</cu-custom>
		<view class="page">
			<view  class="cu-card article solid-bottom" style="width: 100%">
				<block v-for="(item,itemIndex) in order.items" :key="itemIndex">
					<view class="cu-item shadow flex solid-bottom" style="margin: 0 10rpx 0 10rpx; padding: 20rpx 0" >
						<view class="content" >
							<image :src="item.cover" class="bg-gray" style="width: 30%"  mode="aspectFill" ></image>
							<view class="desc" style="width: 70%" >
								<view class="text-content" >
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
									<text class="text-gray">{{'x'+item.num}}</text>
								</view>
							</view>
						</view>
						<view class="cu-form-group">
							<view class="title">改价为:<text class="margin-left-xs text-lg">{{'¥'}}</text></view>
							<input type="number" @blur="inputPriceBlur(item)" class="margin-top-lg text-bold justify-center solid-bottom bg-gray" style="margin-left: -20rpx;" v-model="item.new_price"></input>
							<view class="title">折扣:</view>
							<input type="number" @blur="inputDiscountBlur(item)" class="margin-top-lg text-bold solid-bottom bg-gray" style="margin-left: -20rpx;" v-model="item.discount"></input>
							<view class="margin-left-sm margin-top-lg action text-bold">折</view>
						</view>
					</view>
				</block>
			</view>
			<view class="margin-xs solid-bottom">
				<view class="cu-form-group">
					<view class="radio title" style="font-size: 26upx">运费</view>
					<view class="text-left">{{'¥ '+parseFloat(order.price_shipping).toFixed(2)}}</view>
				</view>
				<view class="cu-form-group">
					<view class="title" ></view>
					<view class="text-left">共减免:{{'¥ '+parseFloat(order.free_price).toFixed(2)}} 需支付<text class="margin-left-sm text-red text-lg text-bold">{{'¥ '+parseFloat(order.need_price).toFixed(2)}}</text></view>
				</view>
			</view>

			<view class="cu-tabbar-height"></view>
			<view class="cu-tabbar-height"></view>
			<view class="cu-bar bg-white tabbar border  foot">
				<view class="bg-green submit text-lg" @tap="submitPrice">确定</view>
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
					price_items:0,
					price_shipping:0,
					order_total_item_num:0,
					order_num:'',
					create_at:null,
					free_price:0.00,//减免费用
                    need_price:0//应付费用
				}
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
            },

            inputPriceBlur(item) {
                let that = this;
                console.log('inputPriceBlur',item);
				let newOrderPrice = 0;
                that.order.items.forEach(_item=>{
                    if(_item.id==item.id){
                        _item.new_price = parseFloat(item.new_price).toFixed(2);
                        _item.discount = ((item.new_price/item.price)*10).toFixed(1);
                    }
                    if(cmnUtils.isEmpty(item.new_price)){
                        newOrderPrice +=_item.price*_item.num;
					}else{
                        newOrderPrice +=_item.new_price*_item.num;
					}
				});
                //减免费用
                that.order.free_price = parseFloat(that.order.order_price - newOrderPrice).toFixed(2);
                //应付费用
                that.order.need_price = parseFloat(newOrderPrice).toFixed(2);
                that.$forceUpdate();
            },

            inputDiscountBlur(item) {
                let that =this;
                console.log('inputDiscountBlur',item);
                let newOrderPrice = 0;
                that.order.items.forEach(_item=>{
                    if(_item.id==item.id){
                        _item.discount = parseFloat(item.discount).toFixed(1);
                        _item.new_price = (parseFloat(item.discount)/10*item.price).toFixed(2);
                    }
                    if(cmnUtils.isEmpty(item.new_price)){
                        newOrderPrice +=_item.price*_item.num;
                    }else{
                        newOrderPrice +=_item.new_price*_item.num;
                    }
                });
                //减免费用
                that.order.free_price = parseFloat(that.order.order_price - newOrderPrice).toFixed(2);
                //应付费用
                that.order.need_price = parseFloat(newOrderPrice).toFixed(2);
                that.$forceUpdate();
            },

            async submitPrice(){
                let that = this;
                await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'updateOrder',
                        order:that.order
                    }
                });
                uni.showToast({
                    icon:'success',
                    title:'价格修改成功'
                });
                setTimeout (() => {
                    uni.redirectTo({
                        url:'/pagesMgt/BizOrderList',
                    });
                } , 1000 )
			},
        }
    }
</script>

<style>

</style>
