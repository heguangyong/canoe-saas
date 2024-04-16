<template>
	<view>
		<cu-custom    :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{title}}</block>
		</cu-custom>
		<view class="cu-bar bg-white search fixed" :style="[{top:(CustomBar) + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input @focus="inputFocus" @blur="inputBlur" type="text" placeholder="商品名称/订单编号/手机号搜索" confirm-type="search"></input>
			</view>
			<view class="action">
				<button class="cu-btn round  text-grey shadow-blur"   @tap="getList">搜索</button>
			</view>
		</view>
		<scroll-view scroll-x class="nav" style="margin-top: 100rpx;">
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
							<view  class="text-left text-grey">商家受理中</view>
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
						<button class="line-green" style="font-size: 28upx;" @tap="goModifyOrderPrice(order)">修改价格</button>
					</view>
					<view v-if="order.apply_state=='商家受理中'" class="text-left flex align-center" style="height: 50rpx">
						<button class="line-green" style="font-size: 28upx;" @tap="disagreeReturnPay(order)">拒绝退款</button>
						<button class="margin-left-sm bg-green" style="font-size: 28upx;" @tap="agreeReturnPay(order)">同意退款</button>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
    import { mapState } from 'vuex'
    import cmnUtils from '@/utils/cmnUtils.js';


    export default {
        data() {
            return {
				title:'',
                StatusBar: this.StatusBar,
                CustomBar: this.CustomBar,
                search_str:'',
                orderStates:['needPay','canceled','needSend','shipped','finished'],
                orderList: [],
                page: 1,
				tabCur: 2,
                tabs:['待付款','待发货','全部'],
				currentOrder:{}//当前订单
            }
        },
		onLoad(options){
			this.title=options.title;
		},
        onShow() {
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
                        return "已发货";
                    }else if(currentState=='finished'){
                        return "已完成";
                    }else if(currentState=='canceled'){
                        return "已取消";
                    }
                }
            },
        },
        methods:{
            inputFocus(e) {
                console.log(e)
            },

            inputBlur(e) {
                console.log(e)
                this.orderList = [];
                this.search_str = e.detail.value;
                this.page = 1;
            },
            tabSelect(e) {
                let that = this;
                that.tabCur = e.currentTarget.dataset.id;
                that.page=1;
                that.orderList=[];
				if(that.tabCur===0){
                    that.orderStates=['needPay'];
                    that.getList();

				}else if(that.tabCur===1){
                    that.orderStates=['needSend'];
                    that.getList();
				}
				else if(that.tabCur===2){
                    that.orderStates=['needPay','canceled','needSend','shipped','finished'];
                    that.getList();
				}
			},

            async getList(){
                let that = this;
                if (that.page == 1) {
                    that.orderList=[]
                }
                let res = null;
                res = await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'getSellerOrderListByUserIdAndState',
                        userId:that.user._id,
						bizCardId:that.user.userInfo.bizCardId,
                        orderStates:that.orderStates,
                        search_str: that.search_str,
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
					}else if(order.order_state=='needSend' || order.order_state=='needReceive'){
                        needReceiveNum++;
                    }
				});
				if(needPayNum>0){
                    that.tabs[0] ='待付款 '+needPayNum;
				}
				if(needReceiveNum>0){
                    that.tabs[1] ='待发货 '+needReceiveNum;
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
                        "url":"/pagesMgt/CanceledOrder?id="+id
                    })
                }else if(state=='needSend'){
                    uni.navigateTo({
                        "url":"/pagesMgt/WaitSendOrder?id="+id
                    })
				}else if(state=='shipped'){
                    uni.navigateTo({
                        "url":"/pagesMgt/ShippedOrder?id="+id
                    })
				}else if(state=='finished'){
                    uni.navigateTo({
                        "url":"/pagesMgt/FinishedOrder?id="+id
                    })
                }

            },

            async goModifyOrderPrice(order){
               	uni.navigateTo({url:'/pagesMgt/ModifyOrderPrice?id='+order._id})
            },

			async disagreeReturnPay(order){
                order.items.forEach(item=>{
                   if(item.item_state='waitReturnPay'){
                       item.item_state='disagreeReturnPay';
				   }
				});
                order.apply_state='商家拒绝退款';
                await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'updateOrder',
                        order:order
                    }
                });
			},
            async agreeReturnPay(order){
                order.items.forEach(item=>{
                    if(item.item_state='waitReturnPay'){
                        item.item_state='finishReturnPay';
                    }
                });
                order.apply_state='退款成功';
                await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'updateOrder',
                        order:order
                    }
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
