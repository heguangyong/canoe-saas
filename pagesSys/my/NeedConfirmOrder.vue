<template>
	<view class="" :class="isUps == true ? 'prevent' : ''">
		<cu-custom    :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">确认订单</block>
			<block slot="right">
				<view class="action">
					<view class="cu-load load-cuIcon" :class="isLoad?'loading':'over'"></view>
				</view>
			</block>
		</cu-custom>
		<view class="page">
			<view class="cu-list menu-avatar no-padding" @tap="goAddAddress">
				<view class="cu-item  card-radius margin-top-xxs margin-left-xs margin-right-xs margin-bottom-xs shadow bg-white.light">
					<view  class="cu-avatar round" >
						<view class="text-sm text-cut" >{{recipient.key}}</view>
					</view>
					<view class="content">
						<view class="text-grey">{{recipient.name}}
							<text class="margin-left-sm text-abc">{{recipient.phone}}</text>
						</view>
						<view class="text-gray text-sm text-cut" >{{recipient.address}}</view>

					</view>
					<view class="action">
						<text class="cuIcon-right text-grey" style="font-size: 38rpx;"></text>
					</view>
				</view>
			</view>
			<view  class="cu-card article" style="width: 100%"  v-for="(order,index) in orderList" :key="index">
				<block v-for="(item,itemIndex) in order.items" :key="itemIndex">
					<view class="cu-item shadow flex solid-bottom" style="margin: 0 10rpx 0 10rpx; padding: 20rpx 0" >
						<view class="content" >
							<image :src="item.cover" class="bg-gray" style="width: 30%"  mode="aspectFill" @tap="goItemDetail(item.id)"></image>
							<view class="desc" style="width: 70%" >
								<view class="text-content" @tap="goItemDetail(item.id)">
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
			<view class="margin-xs">
				<view class="cu-form-group" @tap="showRemark">
					<view class="title">备注</view>
					<input class="text-left" placeholder="选填，建议先和商家沟通后再填写" v-model="recipient.remark"></input>
					<view class="action">
						<text class="cuIcon-comment text-grey" style="font-size: 38rpx;"></text>
					</view>
				</view>
			</view>

			<view class="cu-tabbar-height"></view>
			<view class="cu-tabbar-height"></view>
			<view v-if="!isUps" class="cu-bar bg-white tabbar border  foot">
				<view  style="width: 75%">
					<text class="margin-left-sm margin-right-sm">共{{totalItemNum}}件，合计</text><text class="text-red text-bold text-xl">{{totalPrice}}</text>
				</view>
				<view class="bg-green submit text-lg" :class="isLoad?'bg-gray':''" style="width: 25%" :disabled="isLoad" @tap="placeOrder">下单</view>
			</view>
		</view>
		<!-- 遮罩 -->
		<view class="shade" v-if="isUps"></view>
		<!-- 底部展现收藏弹窗 -->
		<uni-popup ref="showPopupRemark" type="bottom" @change="change">
			<view class="popup bg-white">
				<text class="cuIcon-close popup-close" @click="cancel('PopupRemark')"></text>
				<text class="popup-title" >添加备注</text>
				<view class="popup-content">
					<scroll-view class="ups-height" scroll-y="true">
						<view>
							<view class="cu-form-group">
								<textarea class="text-box font40 bg-white width100 padding-sm solid" style="height: 200rpx;" scroll-y="true" maxlength="1200" placeholder="请输入" v-model="recipient.remark" >
								</textarea>
							</view>
							<view class="cu-bar solid-bottom margin-top-xxs radius"></view>
							<view class="cu-bar btn-group  foot bg-white">
								<button class="cu-btn   round line-grey"   @click="saveRemark"> 确定 </button>
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
    import upsStepper from '@/components/ups-stepper/index.vue';


    export default {
        components: {
            "ups-stepper":upsStepper,
            "uni-popup":uniPopup,
        },
        data() {
            return {
                isLoad:false,
                isUps:false,
                orderIds:[],//传入的待确认愿望订单列表ID集合
                orderList: [],
				totalItemNum:0,
                totalPrice:'',
                //收货地址
                recipient:{name:'',phone:'',address:'',remark:''},
                //生成待确认的订单
				confirmOrder:{recipient:{name:'',phone:'',address:'',remark:''}}
            }
        },
		onLoad(options){
            if(options.orderIds){
                this.orderIds = options.orderIds.split(',');
                console.log('orderIds',this.orderIds);
			}
		},
        onShow() {
            this.getDetail();
        },

        computed:{
            ...mapState(['user']),
        },
        methods:{
            ...mapMutations(['updateUser']),
            async getDetail(){
                let that = this;
                let res = null;
                res = await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'getNeedConfirmOrderListByUserId',
                        userId:that.user._id,
                        orderIds:that.orderIds,
                        page:that.page
                    }
                });
                that.orderList = res.result.data||[];
				let totalAmount = 0;
                that.totalItemNum = 0;
				that.orderList.forEach(order=>{
				    order.items.forEach(item=>{
                        that.totalItemNum += item.num;
                        totalAmount += item.price*item.num;
					})
				});
				//商品总价
				that.confirmOrder.price_items= totalAmount;
                that.totalPrice = '¥ '+ parseFloat(totalAmount).toFixed(2);
                if(that.user.userInfo.recipients){
                    that.recipient = that.user.userInfo.recipients[0];
                    for(let i in that.user.userInfo.recipients){
                        if(that.user.userInfo.recipients[i].as_default){
                            that.recipient = that.user.userInfo.recipients[i];
                            break;
                        }
                    }
				}
            },

            goItemDetail(id){
                uni.navigateTo({
                    "url":"/pagesCmn/product/ProductDetailExt?id="+id
                })
            },
            goAddAddress(){
              uni.navigateTo({
				  url:"/pagesSys/my/AddressList"
			  })
			},
            showRemark(){
                let that = this;
                that.$nextTick(() => {
                    that.isUps=true;
                    that.$refs['showPopupRemark'].open();
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

            async saveRemark(){
                let that = this;
                for(let i in that.user.userInfo.recipients){
                    if(that.user.userInfo.recipients[i].key=that.recipient.key){
                        that.user.userInfo.recipients[i].remark = that.recipient.remark;
                        break;
					}
				}
                that.updateUser(that.user);
                await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'updateUserInfo',
                        id:that.user._id,
                        userInfo:that.user.userInfo
                    }
                });
                that.$forceUpdate();
                that.$refs['showPopupRemark'].close();
            },

            async placeOrder(){
                let that = this;
                let items =[];
                that.isLoad=true;
                that.orderList.forEach(order=>{
                    order.items.forEach(item=>{
                        item.new_price=item.price;
                        item.discount=10;
						items.push(item);
					})
				});
                //不是一个卖家不可以合并下单
                that.confirmOrder.seller_avatar=that.user.userInfo.bizCardAvatar;
                that.confirmOrder.seller_name=that.user.userInfo.bizCardName;
                that.confirmOrder.seller_id=that.user.userInfo.bizCardId;
                that.confirmOrder.user_id=that.user._id;
                that.confirmOrder.avatar= that.user.userInfo.avatarUrl;
                that.confirmOrder.name= that.user.userInfo.nickName;
                that.confirmOrder.items=items;
                that.confirmOrder.recipient=that.recipient;
                that.confirmOrder.order_state='needPay';//下单
				that.confirmOrder.order_total_item_num = that.totalItemNum;
				that.confirmOrder.price_shipping=0;
				that.confirmOrder.order_price=Number(that.confirmOrder.price_items+that.confirmOrder.price_shipping);
				that.confirmOrder.free_price=0;//减免费用
				that.confirmOrder.need_price=that.confirmOrder.order_price;//减免后应付金额
				let res = await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'confirmOrder',
                        order:that.confirmOrder
                    }
                });
                let confirmOrderId = res.result._id;
                if(!cmnUtils.isEmpty(confirmOrderId)){
                    //删除愿望订单
                    await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'removeWishOrder',
                            orderIds:that.orderIds
                        }
                    });
                    uni.showToast({
                        icon:'success',
                        title:'下单成功'
                    });
                    setTimeout (() => {
                        uni.redirectTo({
                            url:'/pagesSys/my/NeedPayOrder?id='+confirmOrderId,
                        });
                    } , 1000 )
				}
                that.isLoad=false;
			}
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
		height: 420rpx;
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
		height: 350rpx;
		position: fixed;
		left:0;
		bottom: 0;
		z-index: 99;
	}
</style>
