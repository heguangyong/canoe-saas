<template>
	<view>
		<cu-custom    :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">购物袋</block>
		</cu-custom>
		<checkbox-group class="block" @change="selectedChange">
			<view  class="cu-card article" style="width: 100%"  v-for="(order,index) in orderList" :key="index">
				<block v-for="(item,itemIndex) in order.items" :key="itemIndex">
					<view class="cu-item shadow flex" style="margin: 10rpx; padding: 20rpx 0" >
						<view class="content" >
							<view style="width: 12%; display: flex;align-items: center;">
								<checkbox class="round" :class="item.isSelected?'checked':''" :checked="item.isSelected" :value="item.id"></checkbox>
							</view>
							<image :src="item.cover" class="bg-gray" style="width: 28%;" mode="aspectFill" @tap="goDetail(item.id)"></image>
							<view class="desc" style="width: 60%" >
								<view class="text-content" @tap="goDetail(item.id)">
									<text clas="text-bold">{{item.title}}</text>
									<text class="text-cut text-sm">
										{{item.content}}
									</text>
								</view>
								<view class="flex margin-top-sm  justify-between">
									<view  class="cu-capsule radius ">
										<text class="text-red">
											{{'¥ '+parseFloat(item.price).toFixed(2)+item.unit_name}}
										</text>
									</view>
									<view>
										<ups-stepper :label="item.id" :max="100" :val="item.num" :step="1" :min="1" @change="stepper"></ups-stepper>
									</view>
								</view>
							</view>
						</view>
					</view>
				</block>
			</view>
		</checkbox-group>
		<view class="cu-tabbar-height"></view>
		<view class="cu-tabbar-height"></view>
		<view class="cu-bar bg-white tabbar border  foot">
			<view class="bg-white submit text-lg" style="width: 30%"  @tap="selectedAllChange">
				<checkbox class="round" :class="isSelectedAll?'checked':''" :checked="isSelectedAll" :value="isSelectedAll"></checkbox><text class="margin-left-sm">全选</text>
			</view>
			<view  style="width: 45%">
				<text class="margin-right-sm">合计</text><text class="text-red text-bold text-xl">{{totalPrice}}</text>
			</view>
			<view class="bg-green submit text-lg"  style="width: 25%" @tap="goNeedConfirmOrder">购买</view>
		</view>
	</view>
</template>

<script>
    import { mapState } from 'vuex'
    import cmnUtils from '@/utils/cmnUtils.js';
    import upsStepper from '@/components/ups-stepper/index.vue';

    export default {
        components: {
            "ups-stepper":upsStepper,
        },
        data() {
            return {
                orderList: [],
                page: 1,
                isSelectedAll:false,//是否选中
                totalPrice:'',
                selectedIds:[]//产品ID集合
            }
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
        },
        methods:{
            async selectedAllChange(e){
                let that = this;
                let newTotalAmount = 0;
                that.isSelectedAll = !that.isSelectedAll;
                // console.log('selectedAllChange isSelectedAll',that.isSelectedAll);
                that.orderList.forEach(order=>{
                    order.items.forEach(item=>{
                        item.isSelected = that.isSelectedAll;
                        if(item.isSelected){
                            newTotalAmount += item.price*item.num;
                        }
                    })
                });
                that.totalPrice = '¥ '+ newTotalAmount.toFixed(2);
                that.$forceUpdate();
			},
            async selectedChange(e) {
                let that = this;
                console.log(e);
                let newTotalAmount = 0;
                that.selectedIds = e.detail.value;
                that.selectedIds.forEach(label=>{
                    let isFind =false;
                    for(let i in that.orderList){
                        for(let j in that.orderList[i].items){
                            let item =that.orderList[i].items[j];
                                //唯一key
                            if(item.id==label){
                                item.isSelected=true;
                                newTotalAmount += item.price*item.num;
                                isFind = true;
                                break;
                            }
                        }
                        if(isFind){break;}
                    }
                });
                that.totalPrice = '¥ '+ newTotalAmount.toFixed(2);
                that.$forceUpdate();
            },
            //步进器
            stepper(e){
                let that = this;
                console.log(e)
                let changedItem ={};
                //存购物记录
                if(e.val > 0){
                    let isFind =false;
                    for(let i in that.orderList){
						for(let j in that.orderList[i].items){
						    //唯一key
						    let currentLabel = that.orderList[i].items[j].id;
							if(currentLabel==e.label){
                                changedItem = that.orderList[i].items[j];
                                changedItem.label = currentLabel;
                                isFind = true;
								break;
							}
						}
						if(isFind){break;}
                    }
                }
                that.$forceUpdate();
                let newTotalAmount = 0;
                that.orderList.forEach(order=>{
                    order.items.forEach(item=>{
                        if(item.isSelected){
                            //唯一key
                            if(item.id==changedItem.label){
                                item.num = e.val;
                            }
                            newTotalAmount += item.price*item.num;
						}
                    })
                });
                that.totalPrice = '¥ '+ newTotalAmount.toFixed(2);
                that.$forceUpdate();
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
                        $url:'getWishOrderListByUserId',
                        userId:that.user._id,
                        page:that.page
                    }
                });
                if(!cmnUtils.isEmpty(res.result.data)){
                    that.orderList.push(...res.result.data);
                }
				that.orderList.forEach(order=>{
				    order.items.forEach(item=>{
				        item.isSelected =false;
					})
				});
                that.totalPrice = '¥ '+ Number(0).toFixed(2);

            },

            goDetail(id){
                uni.navigateTo({
                    "url":"/pagesCmn/product/ProductDetailExt?id="+id
                })
            },
            goNeedConfirmOrder(){
                let that = this;
                //需要转化成orderIds
                let orderIds = [];
                if(!cmnUtils.isEmpty(that.selectedIds)){
                    let itemIds = that.selectedIds.join(',');
                    that.orderList.forEach(order=>{
                        order.items.forEach(item=>{
                            if(itemIds.indexOf(item.id)>-1){
                                orderIds.push(order._id);
                            }
                        })
                    });
				}else if(that.isSelectedAll){
                    that.orderList.forEach(order=>{
                        orderIds.push(order._id);
                    })
                }
                console.log('orderIds',orderIds);
				if(!cmnUtils.isEmpty(orderIds)){
                    uni.redirectTo({
                        "url":"/pagesSys/my/NeedConfirmOrder?orderIds="+orderIds.join(','),
                    })
				}
			}
        }
    }
</script>

<style>
</style>
