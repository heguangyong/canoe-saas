<template>
	<view class="" :class="isUps == true ? 'prevent' : ''">
		<cu-custom    :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">仅退款</block>
		</cu-custom>
		<view class="page">
			<view class="cu-bar  solid-bottom">
				<view class="action">
					退款商品
				</view>
			</view>
			<view  class="cu-card article solid-bottom" style="width: 100%">
				<view class="cu-item shadow flex solid-bottom" style="margin: 0 10rpx 0 10rpx; padding: 20rpx 0" >
					<view class="content" >
						<image :src="item.cover" class="bg-gray" style="width: 30%"  mode="aspectFill"></image>
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
								<view class="text-gray">{{'x'+item.num}}</view>
							</view>
						</view>
					</view>
					<view class="cu-form-group">
						<view class="title" >退款金额</view>
						<view class="text-left margin-top-lg">{{'¥ '+order.return_price}}</view>
					</view>
					<view class="cu-form-group">
						<view class="title" >联系电话</view>
						<input class="text-right margin-top-lg" @blur="inputPhone" v-model="order.phone"></input>
					</view>
					<view class="cu-form-group" @tap="showReasons">
						<view class="title" >退款原因</view>
						<input class="text-right margin-top-lg" placeholder="请选则退款原因" @blur="inputReason" v-model="order.reason"></input>
						<view class="action margin-top-lg">
							<text class="cuIcon-right text-grey" style="font-size: 38rpx;"></text>
						</view>
					</view>
					<view class="cu-form-group solid-bottom">
						<textarea class="text-box font40 bg-white width100 padding-sm solid" style="height: 200rpx;" scroll-y="true" maxlength="1200" placeholder="请输入具体原因" @blur="inputReasonRemark" v-model="order.reason_remark" >
						</textarea>
					</view>
					<view class="cu-bar  solid-bottom">
						<view class="action">
							上传图片
						</view>
					</view>
					<view class="bg-white padding-sm solid-bottom bg-white">
						<ups-movable
								:imgList = "order.reason_imgList"
								imgSize= 75
								maxNum = 9
								@moveEndList="moveEndListHandle"
								@upload = "uploadImages"
								@remove = "removeImages"
						>
						</ups-movable>
						<view class="cu-tabbar-height"></view>
						<view class="cu-tabbar-height"></view>
						<view class="cu-tabbar-height"></view>
					</view>
				</view>
			</view>
			<view class="cu-tabbar-height"></view>
			<view class="cu-tabbar-height"></view>
			<view v-if="!isUps" class="cu-bar bg-white tabbar border  foot">
				<view class="bg-green submit text-lg"   @tap="submitReason">提交</view>
			</view>
		</view>
		<!-- 遮罩 -->
		<view class="shade" v-if="isUps"></view>
		<!-- 底部展现收藏弹窗 -->
		<uni-popup ref="showPopupReasons" type="bottom" @change="change">
			<view class="popup bg-white">
				<text class="cuIcon-close popup-close" @click="cancel('PopupReasons')"></text>
				<text class="popup-title" >选择退款原因</text>
				<view class="popup-content">
					<scroll-view class="ups-height" scroll-y="true">
						<view>
							<radio-group class="block" @change="reasonChange">
								<view class="cu-list menu text-left">
									<view class="cu-item" v-for="(reason,index) in returnReasons" :key="index">
										<label class="flex justify-between align-center flex-sub">
											<view class="flex-sub">{{reason}}</view>
											<radio class="round" :class="reason==item.reason?'checked':''"
												   :checked="reason==item.reason"
												   :value="reason"></radio>
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
    import upsMovable from '@/components/ups-movable/index.vue'

    export default {
        components: {
            "uni-popup":uniPopup,
            "ups-movable":upsMovable,
        },
        data() {
            return {
                isUps:false,
				card:{phone:''},
				item:{
                    id:'',
					title:'',
					content:'',
					price:0,
					unit_name:'',
					num:0,
					new_price:0,
				},
                order: {
                    _id:'',
					items:[],
					return_price:0,
					reason:'',
					reason_remark:'',
                    reason_carouse:[],
                    reason_imgList:[],
                    phone:''
				},
				returnReasons:[
				    '不想要了',
					'无快递信息',
					'包裹为空',
					'已拒签包裹',
					'快递长时间未送达',
					'其他',
				]
            }
        },
		onLoad(options){
            //会传入订单id以及某一商品项Id
            if(options.id){
                this.order._id = options.id;
                if(options.itemId){
                    this.item.id = options.itemId;
				}
                console.log('orderId',this.order._id,'itemId',this.item.id);
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
                for(let i in that.order.items){
                    if(that.order.items[i].id==that.item.id){
                        that.item= that.order.items[i];
                        break;
					}
				}
				that.order.return_price= that.item.new_price;
				if(cmnUtils.isEmpty(that.order.reason_imgList)){
                    that.order.reason_imgList = [];
                    that.order.reason_carouse = [];
				}

				res = await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'getCardDetailById',
                        id:that.user.userInfo.cardId
                    }
                });
                that.card = res.result.data;
                that.order.phone = that.card.phone;
            },
            inputPhone(e){
                this.order.phone = e.detail.value
            },
            async inputReason(e){
                let that = this;
                that.order.reason = e.detail.value;
                await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'updateOrder',
                        order:that.order
                    }
                });
            },
            async inputReasonRemark(e){
                let that = this;
                that.order.reason_remark = e.detail.value;
                await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'updateOrder',
                        order:that.order
                    }
                });
            },
            showReasons(){
                let that = this;
                that.$nextTick(() => {
                    that.isUps=true;
                    that.$refs['showPopupReasons'].open();
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

            async reasonChange(e){
                let that = this;
                that.order.reason=e.detail.value;
                that.$forceUpdate();
                that.$refs['showPopupReasons'].close();
			},

            moveEndListHandle(imgArr){
                let that = this;
                that.order.reason_imgList = imgArr;
                that.order.reason_carouse = [];
                that.order.reason_imgList.forEach(each=>{
                    that.order.reason_carouse.push(each.url);
                });
                that.$forceUpdate();
            },

            async uploadImages(fileId){
                let that = this;
                that.order.reason_carouse.push(fileId);
                that.order.reason_imgList.push({'url':fileId});
                that.$forceUpdate()
            },
            removeImages(idx){
                let that = this;
                that.order.reason_carouse.splice(idx, 1);
                that.order.reason_imgList.splice(idx, 1);
                that.$forceUpdate()
            },
            async submitReason(){
                let that = this;
                that.order.apply_at=new Date();
                that.order.apply_state = '商家受理中';
                //设定项目状态为待商家退款
                that.item.item_state='waitReturnPay';
                that.item.apply_at=new Date();
                for(let i in that.order.items){
                    if(that.order.items[i].id==that.item.id){
                        that.order.items[i] = that.item;
                        break;
					}
				}
				await wx.cloud.callFunction({
					name:'cmn',
					data:{
					    $url:'updateOrder',
						order:that.order
					}
				});
                uni.showToast({
                    icon:'success',
                    title:'已发起退款申请'
                });
                setTimeout (() => {
                    uni.redirectTo({
                        url:'/pagesSys/my/WaitSendOrder?id='+that.order._id,
                    });
                } , 1000 )
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
		height: 820rpx;
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
		height: 750rpx;
		position: fixed;
		left:0;
		bottom: 0;
		z-index: 99;
	}
</style>
