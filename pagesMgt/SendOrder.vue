<template>
	<view class="" :class="isUps == true ? 'prevent' : ''">
		<cu-custom    :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">订单发货</block>
		</cu-custom>
		<view class="page">
			<view class="cu-list menu-avatar no-padding">
				<view class="cu-item  card-radius margin-top-xxs margin-left-xs margin-right-xs margin-bottom-xs">
					<view  class="cu-avatar round bg-green" >
						<view class="text-df text-cut" >收</view>
					</view>
					<view class="content">
						<view class="text-grey">{{order.recipient.name}}
							<text class="margin-left-sm text-abc">{{order.recipient.phone}}</text>
						</view>
						<view class="text-gray text-sm text-cut" >{{order.recipient.address}}</view>

					</view>
				</view>
			</view>
			<view class="margin-xs solid-bottom">
				<view class="cu-form-group" @tap="showSendTypes">
					<view class="title" >发货方式</view>
					<view class="text-right">{{order.send_type}}</view>
					<view class="action cuIcon-right"></view>
				</view>
				<block v-if="order.send_type=='自己联系快递'">
					<view class="cu-form-group" >
						<view class="title" >快递单号</view>
						<input class="text-right" @blur="inputExpressNum" v-model="order.express_num"></input>
					</view>
					<view class="cu-form-group" >
						<view class="title" >快递公司</view>
						<input class="text-right" @blur="inputExpressCorp" v-model="order.express_corp"></input>
					</view>
				</block>
			</view>
			<view class="cu-bar  margin-top-sm solid-bottom">
				<view class="action">
					默认退货地址
				</view>
			</view>
			<view class="cu-list menu-avatar no-padding" @tap="goCardAddress">
				<view class="cu-item  card-radius margin-top-xxs margin-left-xs margin-right-xs margin-bottom-xs">
					<view  class="cu-avatar round" >
						<view class="text-df text-cut" >{{cardRecipient.key}}</view>
					</view>
					<view class="content">
						<view class="text-grey">{{cardRecipient.name}}
							<text class="margin-left-sm text-abc">{{cardRecipient.phone}}</text>
						</view>
						<view class="text-gray text-sm text-cut" >{{cardRecipient.address}}</view>
					</view>
					<view class="action">
						<text class="cuIcon-right text-grey" style="font-size: 38rpx;"></text>
					</view>
				</view>
			</view>

			<view class="cu-tabbar-height"></view>
			<view class="cu-tabbar-height"></view>
			<view v-if="!isUps" class="cu-bar bg-white tabbar border  foot">
				<view class="bg-green submit text-lg"   @tap="sendOrder">立即发货</view>
			</view>
		</view>
		<!-- 遮罩 -->
		<view class="shade" v-if="isUps"></view>
		<!-- 底部展现收藏弹窗 -->
		<uni-popup ref="showPopupSendTypes" type="bottom" @change="change">
			<view class="popup bg-white">
				<text class="cuIcon-close popup-close" @click="cancel('PopupSendTypes')"></text>
				<text class="popup-title" >选择发货方式</text>
				<view class="popup-content">
					<scroll-view class="ups-height" scroll-y="true">
						<view>
							<radio-group class="block" @change="typeChange">
								<view class="cu-list menu text-left">
									<view class="cu-item" v-for="(type,index) in sendTypes" :key="index">
										<label class="flex justify-between align-center flex-sub">
											<view class="flex-sub">{{type}}</view>
											<radio class="round" :class="type==order.send_type?'checked':''"
												   :checked="type==item.send_type"
												   :value="type"></radio>
										</label>
									</view>
								</view>
							</radio-group>
							<view class="cu-bar solid-bottom margin-top-xxs radius"></view>
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
                cardRecipient:{key:'',name:'',phone:'',address:''},
                order: {
                    _id:'',
					recipient:{key:'',name:'',phone:'',address:'',remark:''},
					express_corp:'',
					express_num:'',
				},
                isRecipientRemark:false,//备注信息
				sendTypes:['自己联系快递','无需快递'],//发货方式
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

				res =await wx.cloud.callFunction({
					name:'sys',
					data:{
					    $url:'getCardDetailById',
						id:that.user.userInfo.bizCardId
					}
				});
				that.bizCard = res.result.data;
				for(let i in that.bizCard.recipients){
				    if(that.bizCard.recipients[i].as_default){
				        that.cardRecipient = that.bizCard.recipients[i];
				        break;
					}
				}
            },

            goDetail(id){
                uni.navigateTo({
                    "url":"/pagesCmn/product/ProductDetailExt?id="+id
                })
            },
            showSendTypes(){
                let that = this;
                that.$nextTick(() => {
                    that.isUps=true;
                    that.$refs['showPopupSendTypes'].open();
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

            typeChange(e){
                let that = this;
                that.order.send_type=e.detail.value;
                that.$forceUpdate();
                that.$refs['showPopupSendTypes'].close();
            },

            async inputExpressNum(e){
                let that = this;
                that.order.express_num = e.detail.value;
            },

            async inputExpressCorp(e){
                let that = this;
                that.order.express_corp = e.detail.value;
            },

            goCardAddress(){
                uni.navigateTo({
					url:'/pagesMgt/AddressList'
				})
			},

			async sendOrder(){
                let that = this;
                if(that.order.apply_state=='商家受理中'){
                    await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'updateOrder',
                            order:that.order
                        }
                    });
                    uni.showToast({
                        icon:'none',
                        title:'顾客申请退货，无法发货！'
                    });
				}else{
					if(that.order.send_type=='无需快递'){

					}else if(that.order.send_type=='自己联系快递'){
					    if(cmnUtils.isEmpty(that.order.express_corp)){
                            uni.showToast({
                                icon:'none',
                                title:'需要输入快递公司'
                            });
                            return;
						}
                        if(cmnUtils.isEmpty(that.order.express_num)){
                            uni.showToast({
                                icon:'none',
                                title:'需要输入快递单号'
                            });
                            return;
                        }
					}
                    that.order.order_state='shipped';
                    await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'updateOrder',
                            order:that.order
                        }
                    });
                    uni.showToast({
                        icon:'success',
                        title:'更新为发货成功'
                    });
                    setTimeout (() => {
                        uni.navigateBack({
                            delta: 1
                        });
                    } , 1000 )
                }
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
