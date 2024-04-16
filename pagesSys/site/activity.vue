<template>
    <view>
        <cu-custom    :isBack="true">
			<block slot="backText">返回</block>
            <block slot="content">线上活动</block>
        </cu-custom>
        <view class="cu-card case"  v-for="(item,index) in activityList" :key="index">
            <view class="cu-item shadow solid-bottom"  @tap="goDetail(item)">
                <view class="image">
                    <image :src="item.cover"  mode="aspectFill" style="width: 100%;"></image>
                    <view class="cu-bar bg-shadeBottom"> <text class="text-cut">{{item.content}}</text></view>
                </view>
                <view class="cu-list menu-avatar">
                    <view class="cu-item">
                        <view class="cu-avatar round lg">
                            <image :src="item.avatar" mode="aspectFill" class="cu-avatar round lg"></image>
                        </view>
                        <view class="content flex-sub">
                            <view class="text-grey">{{item.title}}</view>
                            <view class="text-gray text-sm">
                                报名截止日期：{{item.sign_up}}
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
        },
        methods:{
            async getList(){
                let that = this;
                if (that.page == 1) {
                    that.activityList=[]
                }
                let pageList =[];
                let res = null;
                // #ifdef MP-WEIXIN
                res= await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'getActivityListByCardId',
                        cardId:that.user.userInfo.bizCardId,
                        page:that.page
                    }
                });
                if(res.result.data.length>0){
                    pageList=res.result.data;
                }
                // #endif
                // #ifdef H5
                res= await cloudbase.callFunction({
                    name:'web',
                    data:{
                        $url:'getActivityListByCardId',
                        cardId:that.user.userInfo.bizCardId,
                        page:that.page
                    }
                });
                if(res.result.data.length>0){
                    pageList=JSON.parse(res.result.data);
                }
                // #endif

                pageList.forEach(each=>{
                    let parseSignUp = each.sign_up.date+' '+each.sign_up.time;
                    let parseSignIn = each.sign_in.date+' '+each.sign_in.time;
                    each.sign_up = parseSignUp;
                    each.sign_in = parseSignIn;
                });
                Object.assign(that.activityList, pageList);
                that.$forceUpdate();
            },

            goDetail(item){
                //指定模版路径 数据库活动表中维护a001,a002...
                if(item.template_code){
                    uni.navigateTo({
                        "url":"/pagesCmn/activity/"+item.template_code+"/index?id="+item._id
                    })
                }
                //默认模版
                else{
                    uni.navigateTo({
                        "url":"/pagesCmn/activity/ActivityDetailExt?id="+item._id
                    })
                }
            },
        }
    }
</script>

<style>
</style>
