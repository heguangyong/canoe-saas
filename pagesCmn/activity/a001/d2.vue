<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<cu-custom    :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">活动详情</block>
		</cu-custom>
		<!-- #endif -->
		<view class="margin-left cu-bar tabbar">
			<view>
				<image :src="activity.actions[0].img1" style="width: 400rpx; height: 60rpx;"></image>
			</view>
			<view class="action">
				<view class="cuIcon-cu-image">
				</view>
				<view class="text-gray"></view>
			</view>
			<view class="action">
				<view class="cuIcon-cu-image" @tap="goHome">
					<image :src="activity.home_icon" style="width: 50rpx; height: 50rpx;"></image>
				</view>
				<view class="">首页</view>
			</view>
		</view>
		<view class="margin-left" style="margin-top:-30rpx;">
			<view class="text-bold text-lg">精益求精 睿智精选</view>
			<view class="text-bold">"十分精选"定制产品交流会</view>
		</view>

		<view class="padding-xs text-center margin-top solid-top">
			<view class="text-lg padding-xs">
				<texxt class="margin-top text-bold text-lg ">☆  日程安排  ☆</texxt>
			</view>
		</view>
		<view class="margin-top cu-timeline">
			<view class="margin-left cu-capsule radius">
				<view class="cu-tag bg-red">日期</view>
				<view class="cu-tag line-red">2021年5月21日</view>
			</view>
			<view class="cu-item">
				<view class="content flex">
					<view class="cu-capsule radius">
						<view class="cu-tag bg-grey">09:00-09:10</view>
						<view class="cu-tag line-grey">参观公司</view>
					</view>
				</view>
			</view>
			<view class="cu-item">
				<view class="content flex">
					<view class="cu-capsule radius">
						<view class="cu-tag bg-grey">09:10-09:15</view>
						<view class="cu-tag line-grey"> 中欧基金致欢迎辞</view>
					</view>
					<view class="margin-top">——中欧基金总经理：刘建平 先生</view>
				</view>
			</view>
			<view class="cu-item">
				<view class="content flex">
					<view class="cu-capsule radius">
						<view class="cu-tag bg-grey">09:15-09:25</view>
						<view class="cu-tag line-grey"> 中信银行领导致辞</view>
					</view>
				</view>
			</view>
			<view class="cu-item">
				<view class="content flex">
					<view class="cu-capsule radius">
						<view class="cu-tag bg-grey">09:30-09:50</view>
						<view class="cu-tag line-grey">中欧基金主动管理战略下的投研</view>
					</view>
					<view class="margin-top">——中欧基金董事长：窦玉明 先生</view>
				</view>
			</view>
			<view class="cu-item">
				<view class="content flex">
					<view class="cu-capsule radius">
						<view class="cu-tag bg-grey">09:50-10:20</view>
						<view class="cu-tag line-grey">财富管理新格局下零售基金业务的观察与思考</view>
					</view>
					<view class="margin-top">——中欧基金副总经理：许欣 先生</view>
				</view>
			</view>
			<view class="cu-item">
				<view class="content flex">
					<view class="cu-capsule radius">
						<view class="cu-tag bg-grey">10:20-10:30</view>
						<view class="cu-tag line-grey">茶歇</view>
					</view>
				</view>
			</view>
			<view class="cu-item">
				<view class="content flex">
					<view class="cu-capsule radius">
						<view class="cu-tag bg-grey">10:30-11:30</view>
						<view class="cu-tag line-grey">中国经济的走势与风险</view>
					</view>
					<view class="margin-top">——中欧商学院经济学与金融学教授、哥伦比亚大学经济学博士：许斌 先生</view>
				</view>
			</view>
			<view class="cu-item">
				<view class="content flex">
					<view class="cu-capsule radius">
						<view class="cu-tag bg-grey">11:30-11:45</view>
						<view class="cu-tag line-grey">优中选优 掘金科创</view>
					</view>
					<view class="margin-top">——中欧基金权益投委会副主席：王培 先生</view>
				</view>
			</view>
			<view class="cu-item">
				<view class="content flex">
					<view class="cu-capsule radius">
						<view class="cu-tag bg-grey">11:45-12:00</view>
						<view class="cu-tag line-grey">大卫.斯文森投资理念在中国运用</view>
					</view>
					<view class="margin-top">——中欧基金资产配置投资总监：黄华 先生</view>
				</view>
			</view>
			<view class="cu-item">
				<view class="content flex">
					<view class="cu-capsule radius">
						<view class="cu-tag bg-grey">12:00-14:00</view>
						<view class="cu-tag line-grey">午餐会</view>
					</view>
				</view>
			</view>
			<view class="cu-item">
				<view class="content flex">
					<view class="cu-capsule radius">
						<view class="cu-tag bg-grey">14:00-16:00</view>
						<view class="cu-tag line-grey">中欧群英会</view>
					</view>
					<view class="margin-top">（明星基金经理交流）</view>
				</view>
			</view>
		</view>
		<view class="margin-left-xxl margin-right-xxl flex align-center" >
			<image :src="activity.logo" mode="aspectFill" class="padding-xxl margin-left-xxl margin-right-xxl" style="width: 100%;"></image>
		</view>
		<view class="cu-tabbar-height"></view>
		<view class="cu-tabbar-height"></view>
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
                activity:{
                    _id:'',
                    qrcode:'',
                    content:'',
                    actions:[]

                },
            }
        },
        onLoad(options) {
            let that = this;
            if(options.id) {
                that.activity._id = options.id;
                that.getDetail();
            }
        },

        onShareAppMessage(res){
            if(res.from=== 'button'){
                let  activity = res.target.dataset.activity;
                return{
                    title:activity.title,
                    imageUrl:activity.cover||'',
                    path:"/pagesCmn/activity/ShareActivityDetail?id="+activity._id,
                    success:function(r){
                        uni.showToast({
                            'icon':'success',
                            'title':'分享成功'
                        });
                    }
                }
            }
        },
        computed:{
            ...mapState(['user']),
        },
        methods: {
            async getDetail(){
                let that = this
                let res = null;
                // #ifdef MP-WEIXIN
                res = await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'getActivityDetail',
                        id:that.activity._id
                    }
                });
                that.activity = res.result.data;
                // #endif
                // #ifdef H5
                res = await cloudbase.callFunction({
                    name:'web',
                    data:{
                        $url:'getActivityDetail',
                        id:that.activity._id
                    }
                });
                that.activity = JSON.parse(res.result.data);
                // #endif

                let parseSignUp = that.activity.sign_up.date+' '+that.activity.sign_up.time;
                let parseSignIn = that.activity.sign_in.date+' '+that.activity.sign_in.time;
                that.activity.sign_up = parseSignUp;
                that.activity.sign_in = parseSignIn;
            },



            goHome(){
                uni.navigateBack();
            },
        }
    }
</script>

<style>
</style>