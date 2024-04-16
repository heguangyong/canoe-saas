<template>
	<view class="content flex">
		<slot v-if="!showNum">
			<view  class="cu-avatar radius" >
				<image :src="activity.cover" mode="aspectFill"></image>
			</view>
			<view class="column-flex" @tap="goActivityDetail">
				<view class="text-position text-cut text-sm">{{activity.title}}</view>
				<view class="text-gray text-cut  text-xs flex">{{activity.sign_up}}</view>
			</view>
		</slot>
		<slot v-if="showNum">
			<view  class="cu-avatar round" @tap="goActivityDetail">
				<image :src="activity.detail.cover" mode="aspectFit"></image>
			</view >
			<view v-if="showTotal" class="column-flex" @tap="goActivityDetail">
				<view class="text-position text-cut text-sm text-orange">{{activity.detail.title}}</view>
				<view class="text-cut  text-xs flex text-orange">{{activity.detail.Sign_up}}</view>
			</view>
			<view v-else class="column-flex" @tap="goActivityDetail">
				<view class="text-position text-cut text-sm">{{activity.detail.title}}</view>
				<view class="text-gray text-cut  text-xs flex">{{activity.detail.Sign_up}}</view>
			</view>
			<view v-if="showTotal" class="num-right text-orange abs margin-top" style="right:50rpx;">{{activity.num}}人报名</view>
			<view v-else class="num-right abs flex margin-top"  style="right:50rpx;">
				<slot v-if="checkAudit" >
					<view class="state text-yellow">待审核</view>
				</slot>
				<slot v-else>
					<view v-if="checkPass" class="state text-green">通过</view>
					<view v-else class="state text-red">拒绝</view>
				</slot>
				<slot v-if="isSeller">
					<switch @change="switchActivityState" class="margin-left-sm" :data-id="activity.id" :class="activity.state=='pass'?'checked':''" :checked="activity.state=='pass'"></switch>
				</slot>
			</view>
		</slot>

	</view>
</template>

<script>
    export default {
        name:"UpsActivity",
        props:{
            activity:{
                type:Object,
                required:true
            },
            showNum:{
                type:Boolean,
                required:false,
                default:false
            },
            showTotal:{
                type:Boolean,
                required:false,
                default:false
            },
            isSeller:{
                type:Boolean,
                required:false,
                default:false
            },
            order:{
                type:Object,
                required:false,
            },
        },
        computed:{
            checkAudit(){
                this.isNotAudit =this.activity.state=='enrolled' ;
                return this.isNotAudit;
            },
            checkPass(){
                this.isPass =this.activity.state=='pass' ;
                return this.isPass;
            },

        },
        data() {
            return {
                isNotAudit:true,
                isPass:false
            };
        },
        methods:{
            async switchActivityState(e){
                let that = this;
                that.isNotAudit = false;
                that.isPass =e.detail.value;
                if(e.detail.value){
                    //确认
                    that.activity.state='pass';
                }else{
                    //拒绝
                    that.activity.state='reject';
                }
                let activityId= e.currentTarget.dataset.id;
                for(let i in that.order.items){
                    if(that.order.items[i].id==activityId){
                        that.order.items[i].state = that.activity.state;
                        break;
                    }
                }
                let res = await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'processOrder',
                        order: that.order
                    }
                });
            },
            goActivityDetail(){
                uni.navigateTo({
                    url:'/pagesSys/activity/ShareActivityDetail?id='+this.activity._id
                })
            }
        },

    }
</script>

<style>
	image{
		height:64rpx;
	}
	.cu-avatar{
		margin: 15rpx 15rpx 0 0;
	}
	.column-flex{
		flex-direction: column;
		margin-top: 10rpx;
	}
	.text-position{
		height: 34rpx;
		margin-top:7rpx;
	}
</style>
