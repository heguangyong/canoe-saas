<template>
	<view >
		<cu-custom    :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">退款详情</block>
		</cu-custom>
		<view class="page">
			<view class="margin-xs flex align-center text-center" >
				<text class="padding-xxl bg-green text-xxl radius" style="width: 100%;">待商家处理</text>
			</view>
			<view class="cu-bar  solid-bottom">
				<view class="action">
					退款流程
				</view>
			</view>
			<view class="cu-steps steps-bottom">
				<view class="cu-item" :class="index>nodeCur?'':'text-green'" v-for="(node,index) in nodes" :key="index">
					{{node.name}}<text class="cuIcon-title"></text>
				</view>
			</view>
			<view class="cu-bar  solid-bottom">
				<view class="action">
					售后信息
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
					<view class="cu-form-group" @tap="showReasons">
						<view class="title" >退款原因</view>
						<view class="text-left margin-top-lg">{{order.reason}}</view>
					</view>
					<view class="cu-form-group solid-bottom">
						<view class="title" >具体描述</view>
						<view class="text-left margin-top-lg">{{order.reason_remark}}</view>
					</view>
					<view class="margin-left-sm bg-white padding-sm solid-bottom bg-white">
						<image class="margin-xs" :src="img" style="width: 100px;height: 100px;"
							   v-for="(img,index) in item.reason_carouse " :key="index" :data-src="img" @tap="previewImage"></image>
					</view>
					<view class="cu-form-group">
						<view class="title" >联系电话</view>
						<view class="text-right margin-top-lg">{{order.phone}}</view>
					</view>
					<view class="cu-form-group">
						<view class="title" >退款类型</view>
						<view class="text-right margin-top-lg">{{'退款'}}</view>
					</view>
					<view class="cu-form-group">
						<view class="title" >售后单号</view>
						<view class="text-right margin-top-lg">{{order.order_num}}</view>
					</view>
					<view class="cu-form-group">
						<view class="title" >申请时间</view>
						<view class="text-right margin-top-lg">{{formatDateTime(order.apply_at)}}</view>
					</view>
				</view>
			</view>
			<view class="cu-tabbar-height"></view>
			<view class="cu-tabbar-height"></view>
			<view  class="cu-bar bg-white tabbar border  foot">
				<view class="action" @tap="cancelApply">
					<view class="cuIcon-cu-image">
						<text class="cuIcon-close lg text-bold text-grey"></text>
					</view>
					<view class="text-gray">撤销申请</view>
				</view>
				<view class="bg-green submit text-lg"   @tap="goModifyApply">修改申请</view>
			</view>
		</view>
	</view>
</template>

<script>
    import { mapState,mapMutations } from 'vuex'
    import cmnUtils from '@/utils/cmnUtils.js'
    import upsMovable from '@/components/ups-movable/index.vue'

    export default {
        components: {
            "ups-movable":upsMovable,
        },
        data() {
            return {
                isUps:false,
				nodes:[{name:'商家处理申请'},{name:'退款中'},{name:'退款成功'}],
                nodeCur:0,//当前节点
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
                    reason_carouse:[],
                    reason_imgList:[],
                    phone:''
				},
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
            },

			//撤销申请
			async cancelApply(){
				let that = this;
				//回退为原有状态
				that.item.item_state='applyReturnPay';
                for(let i in that.order.items){
                    if(that.order.items[i].id==that.item.id){
                        that.order.items[i]=that.item;
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
                    title:'撤销申请成功'
                });
                setTimeout (() => {
                    uni.redirectTo({
                        url:'/pagesSys/my/WaitSendOrder?id='+that.order._id,
                    });
                } , 1000 )
			},

            async goModifyApply(){
                let that = this;
				uni.redirectTo({
					url:'/pagesSys/my/ApplyReturnPay?id='+that.order._id+'&itemId='+that.item.id,
				});
			},

            previewImage(e){
                let that = this;
                console.log('img src',e.currentTarget.dataset.src);
                wx.previewImage({
                    current:e.currentTarget.dataset.src,
                    urls:that.item.reason_carouse
                })
            },
        }
    }
</script>

<style>
	.page{
		z-index: 0;
		height: 100vh;
	}
</style>
