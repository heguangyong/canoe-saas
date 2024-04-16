<template>
    <view>
        <cu-custom    :isBack="true">
			<block slot="backText">返回</block>
            <block slot="content">我的活动</block>
        </cu-custom>
        <view class="cu-card case"  v-for="(item,index) in activityList" :key="index">
            <view class="cu-item shadow solid-bottom"  @tap="goDetail(item.id)">
                <view class="image">
                    <image :src="item.cover"  mode="aspectFill" style="width: 100%"></image>
                    <view class="cu-bar bg-shadeBottom">
						<text class="text-cut">{{item.content}}</text>
					</view>
                </view>
				
                <view class="cu-list menu-avatar">
                    <view class="cu-item">
                        <view class="cu-avatar round lg">
                            <image :src="item.seller_avatar" mode="aspectFill" class="cu-avatar round lg"></image>
                        </view>
                        <view class="content flex-sub">
                            <view class="text-grey text-cu">{{item.title}}</view>
							<view class="text-gray text-sm">
								<text class="margin-right">编号：{{item.order_num}}</text>报名日期：{{formatDateTime(item.create_at)}}
							</view>
                        </view>
						
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import { mapState } from 'vuex'
    import cmnUtils from '@/utils/cmnUtils.js'
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    // #endif

    export default {
        data() {
            return {
                activityList: [],
                page: 1,
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
            async getList(){
                let that = this;
                if (that.page == 1) {
                    that.activityList=[]
                }
                let activityOrderList =null;
                let res = null;
                // #ifdef MP-WEIXIN
                res = await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'getActivityOrderListByUserId',
                        userId:that.user._id,
                        orderType:'activity',
                        page:that.page
                    }
                });
                // console.log('getList',res);
                activityOrderList=res.result.data||[];
                // #endif
                // #ifdef H5
                res = await cloudbase.callFunction({
                    name:'web',
                    data:{
                        $url:'getActivityOrderListByUserId',
                        userId:that.user._id,
                        orderType:'activity',
                        page:that.page
                    }
                });
                activityOrderList = JSON.parse(res.result.data)||[];
                // #endif
                activityOrderList.forEach(order=>{
                    order.items.forEach(activity=>{
                        let act = {};
                        act.id=activity.id;
                        act.title=activity.detail.title||'';
                        act.content=activity.detail.content||'';
                        act.cover = activity.detail.cover;
                        act.num=activity.num;
                        act.seller_avatar=order.seller_avatar;
                        act.seller_name=order.seller_name;
                        act.is_finished = order.is_finished||false;
                        act.order_num = order.order_num;
                        act.create_at = order.create_at;
                       that.activityList.push(act);
                    });
                });
            },

            goDetail(id){
                uni.navigateTo({
                    "url":"/pagesCmn/activity/ShareActivityDetail?id="+id
                })
            }
        }
    }
</script>

<style>
</style>
