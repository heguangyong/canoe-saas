<template>
	<view class="" :class="isUps == true ? 'prevent' : ''">
		<cu-custom    :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">我的订单</block>
			<block slot="right">
				<view class="action">
					<view class="cu-load load-cuIcon" :class="isLoad?'loading':'over'"></view>
				</view>
			</block>
		</cu-custom>
		<scroll-view scroll-x class="nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index==tabCur?'cur':''"  v-for="(item,index) in tabs" :key="index" @tap="tabSelect" :data-id="index">
					{{tabs[index]}}
				</view>
			</view>
		</scroll-view>
		<scroll-view scroll-y v-for="(order,index) in orderList" :key="index">
			<view  class="margin-top-sm cu-card article solid-bottom" style="width: 100%">
				<view class="margin-left-xs margin-right-xs cu-form-group solid-bottom radius" @tap="goDetail(order.order_state,order._id)">
					<view class="title">{{'订单编号：'+order.order_num}}</view>
					<view class="text-left text-red">{{showOrderState(order.order_state)}}</view>
				</view>
				<block v-for="(item,itemIndex) in order.items" :key="itemIndex" >
					<view class="cu-item shadow flex solid-bottom" style="margin: 0 10rpx 0 10rpx; padding: 20rpx 0;"  @tap="goDetail(order.order_state,order._id)">
						<view class="content" >
							<image :src="item.cover" class="bg-gray" style="width: 30%"  mode="aspectFill"></image>
							<view class="desc" style="width: 70%" >
								<view class="text-content">
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
						<view v-if="item.item_state=='waitReturnPay'" class="cu-form-group">
							<view class="title"></view>
							<view  class="text-left text-grey">待商家处理</view>
						</view>
						<view v-if="item.item_state=='disagreeReturnPay'" class="cu-form-group">
							<view class="title"></view>
							<view  class="text-left text-grey">商家拒绝退款</view>
						</view>
						<view v-if="item.item_state=='finishReturnPay'" class="cu-form-group">
							<view class="title"></view>
							<view  class="text-left text-grey">退款成功</view>
						</view>
					</view>
				</block>
				<view class="margin-left-xs margin-right-xs cu-form-group  radius">
					<view class="title" ></view>
					<view class="text-left">共{{order.order_total_item_num}}件商品，合计<text class="margin-left-sm text-lg text-bold">{{'¥ '+parseFloat(order.need_price).toFixed(2)}}</text></view>
				</view>
				<view class="margin-left-xs margin-right-xs cu-form-group solid-bottom radius">
					<view class="title" style="font-size: 28upx;">{{formatDateTime(order.create_at)}}</view>
					<view v-if="order.order_state=='needPay'" class="text-left flex align-center" style="height: 50rpx">
						<button class="line-green" style="font-size: 28upx;" :disabled="isLoad" @tap="doCancel(order)">取消订单</button>
						<button class="margin-left-sm bg-green" style="font-size: 28upx;"  @tap="showPayOrder(order)">付款</button>
					</view>
					<view v-if="order.order_state=='shipped'" class="text-left flex align-center" style="height: 50rpx">
						<button class="line-green" style="font-size: 28upx;" :disabled="isLoad" @tap="confirmReceiveOrder(order)">确认收货</button>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="cu-tabbar-height"></view>
		<!-- 遮罩 -->
		<view class="shade" v-if="isUps"></view>
		<!-- 底部展现收藏弹窗 -->
		<uni-popup ref="showPopupPayOrder" type="bottom" @change="change">
			<view class="popup bg-white">
				<text class="cuIcon-close popup-close" @click="cancel('PopupPayOrder')"></text>
				<text class="popup-title" >付款</text>
				<view class="popup-content">
					<scroll-view class="ups-height" scroll-y="true">
						<view class="content-box solid-bottom margin-bottom-xl" v-for="(item,index) in bizCard.pay_info" v-if="item.is_open" :key="index">
							<image class="qrcode-image" :src="item.qrcode" mode="aspectFit" ></image>
							<view class="content-text">
								{{'合计 ¥ '+parseFloat(currentOrder.need_price).toFixed(2)}}
							</view>
							<view class="content-text" >
								{{'请粘贴支付单据中的'+item.bill_num_name+':'}}
								<input  @blur="inputBillNum" class="margin-top-lg text-bold justify-center solid-bottom bg-gray" style="margin-left: -20rpx;" v-model="currentOrder.bill_num"></input>
							</view>
							<button class="cu-btn  round line-red"  :disabled="isLoad"  @click="payOrder(item.title)"> {{'点此确认已'+item.title}} </button>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
    import { mapState } from 'vuex'
    import cmnUtils from '@/utils/cmnUtils.js';


    export default {
        data() {
            return {
                //订单状态：待付款，已取消，待商家发货
                orderStates:['needPay','canceled','needSend','shipped','finished'],
                orderList: [],
                page: 1,
				tabCur: 0,
                tabs:['全部','待付款','待收货','退款/售后'],
                bizCard:{},//企业名片
				currentOrder:{bill_num:''}//当前订单
            }
        },

        onShow() {
            this.tabCur =0;
			this.page=1;
            this.getList()
        },
        onPullDownRefresh() {
            this.page=1
            this.getList()
            uni.stopPullDownRefresh(); // 停止刷新
        },
        onReachBottom() {
            this.page++;
            this.getList()
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
            showOrderState(){
                return function(state){
                    let currentState = state;
                    if(currentState=='needPay'){
                        return '待付款'
                    }else if(currentState=='needSend'){
                        return "待商家发货";
                    }else if(currentState=='shipped'){
                        return "商家已发货";
                    }else if(currentState=='finished'){
                        return "已完成";
                    }else if(currentState=='canceled'){
                        return "已取消";
                    }
                }
            },
        },
        methods:{
            tabSelect(e) {
                let that = this;
                that.tabCur = e.currentTarget.dataset.id;
                that.page=1;
                that.orderList=[];
				if(that.tabCur===0){
					that.orderStates=['needPay','canceled','needSend','shipped','finished'];
                    that.getList();
				}else if(that.tabCur===1){
                    that.orderStates=['needPay'];
                    that.getList();
				}
				else if(that.tabCur===2){
                    that.orderStates=['needSend','shipped'];
                    that.getList();
				}
                else if(that.tabCur===3){
                    that.orderStates=['finished'];
                    that.getList();
                }
			},

            async getList(){
                let that = this;
                // console.log('call getList tabCur',that.tabCur,'states',that.orderStates);
                if (that.page == 1) {
                    that.orderList=[]
                }
                let res = null;
                res = await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'getOrderListByUserIdAndState',
                        userId:that.user._id,
                        orderStates:that.orderStates,
                        page:that.page
                    }
                });
                if(!cmnUtils.isEmpty(res.result.data)){
                    that.orderList.push(...res.result.data);
				}
               	let needPayNum = 0;//待付款单数
				let needReceiveNum = 0;//待收货单数
				that.orderList.forEach(order=>{
				    if(order.order_state=='needPay'){
						needPayNum++;
					}else if(order.order_state=='needSend'){
                        needReceiveNum++;
                    }
				});
				if(needPayNum>0){
                    that.tabs[1] ='待付款 '+needPayNum;
				}
				if(needReceiveNum>0){
                    that.tabs[2] ='待收货 '+needReceiveNum;
				}
				that.$forceUpdate();
            },

            goDetail(state,id){
                console.log('goDetail',state,id);
                if(state=='needPay'){
                    uni.navigateTo({
                        "url":"/pagesSys/my/NeedPayOrder?id="+id
                    })
				}else if(state=='canceled'){
                    uni.navigateTo({
                        "url":"/pagesSys/my/CanceledOrder?id="+id
                    })
                }else if(state=='needSend'){
                    uni.navigateTo({
                        "url":"/pagesSys/my/WaitSendOrder?id="+id
                    })
				}else if(state=='shipped'){
                    uni.navigateTo({
                        "url":"/pagesSys/my/ShippedOrder?id="+id
                    })
				}else if(state=='finished'){
                    uni.navigateTo({
                        "url":"/pagesSys/my/FinishedOrder?id="+id
                    })
                }
            },

            async doCancel(order){
                let that = this;
                order.order_state='canceled';//已取消
                await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'updateOrder',
                        order:order
                    }
                });
                uni.showToast({
                    icon:'success',
                    title:'订单已取消'
                });
                setTimeout (() => {
                    uni.navigateTo({
                        url:'/pagesSys/my/CanceledOrder?id='+order._id,
                    });
                } , 1000 )
            },

            async showPayOrder(order){
                let that = this;
                that.currentOrder = order;
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

            inputBillNum(e) {
                let that = this;
                console.log('inputBillNum',e);
                //应付费用
                that.currentOrder.bill_num = e.detail.value;
                that.$forceUpdate();
            },

            async payOrder(payType){
                let that = this;
                that.currentOrder.order_state='needSend';//准备收货
                that.currentOrder.pay_type=payType;
                await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'payOrder',
                        order:that.currentOrder
                    }
                });
                uni.showToast({
                    icon:'success',
                    title:'付款成功'
                });
                that.$refs['showPopupPayOrder'].close();
                setTimeout (() => {
                    uni.navigateTo({
                        url:'/pagesSys/my/WaitSendOrder?id='+that.currentOrder._id,
                    });
                } , 1000 )
            },

            async confirmReceiveOrder(order){
                let that = this;
                order.order_state='finished';//确认收货
                await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'updateOrder',
                        order:order
                    }
                });
                uni.showToast({
                    icon:'success',
                    title:'确认已收货'
                });
            },

        }
    }
</script>

<style>
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
