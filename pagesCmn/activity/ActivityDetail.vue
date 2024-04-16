<template>
	<view>
		<cu-custom    :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">活动详情</block>
		</cu-custom>
		<view class="page bg-white">
			<view class="cu-card case">
			    <view class="cu-item shadow solid-bottom">
			        <view class="image">
			            <image :src="activity.cover"  mode="aspectFill"></image>
			            <view class="cu-bar bg-shadeBottom"> <text class="text-cut">{{activity.content}}</text></view>
			        </view>
			        <view class="cu-list menu-avatar">
			            <view class="cu-item" @tap="goQrcode(activity._id)">
			                <view class="cu-avatar round lg">
			                    <image :src="activity.avatar" mode="aspectFill" class="cu-avatar round lg"></image>
			                </view>
			                <view class="content flex-sub">
			                    <view class="text-grey">{{activity.title}}</view>
			                    <view class="text-gray text-sm flex justify-between">
			                        报名截止日期：{{activity.sign_up}}
			                    </view>
			                </view>
							<view class="action" >
								<text class="cuIcon-qr_code" style="font-size: 36px;"></text>
							</view>
			            </view>
			        </view>
			    </view>
			</view>
			<view v-if="activity.video.length>0">
				<video  :src="activity.video[0]"  objectFit='contain' controls show-mute-btn muted></video>
			</view>
			<view v-for="(item,index) in activity.carousels" :key="index">
				<image :src="item" mode="widthFix" style="vertical-align: middle;"></image>
			</view>
			<view class="cu-tabbar-height"></view>

			<!--页面底部抬升-->
			<view class="cu-bar bg-white tabbar border shop foot">
				<button class="action" @tap="goMy">
					<view class="cuIcon-my"></view>我的
				</button>
				<!--  #ifdef MP-WEIXIN -->
				<button class="action" open-type="share" :data-activity="activity" >
					<view class="cuIcon-share"></view> 分享
				</button>
				<button class="action" @tap="goEdit" >
					<view class="cuIcon-edit"></view> 编辑
				</button>
				<!--  #endif -->
				<button class="action" @tap="doRemove" >
					<view class="cuIcon-delete"></view> 删除
				</button>
				<view  class="bg-white submit text-lg"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
    import cmnUtils from '@/utils/cmnUtils.js';
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    // #endif

	export default {
		data() {
			return {
				activityId:'',
				activity:{
                    content:'',
                    video:[],
                    carousels:[],
                    sign_up:'',
					is_open:false//是否开始
				},
                tabCur: 0,
                tab:['活动详情','报名列表'],
				swiperList:[],//活动详情图片
			}
		},
		onLoad(options) {
		   if(options.id){
		       this.activityId=options.id
		   }
		},
		onShow() {
			this.getDetail();
		},

        onShareAppMessage(res){
            let that = this;
            if(res.from=== 'button'){
                let  activity = res.target.dataset.activity;
                return{
                    title:activity.title,
                    imageUrl:activity.cover||'',
                    path:"/pagesSys/activity/ShareActivityDetail?id="+activity._id,
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
		methods: {
			ShareActivityDetail(){
			    uni.showShareMenu({
			        withShareTicket:true,
			    })
			},
			async getDetail(){
			    let that = this;
                let res = null;
                // #ifdef MP-WEIXIN
                res= await wx.cloud.callFunction({
			        name:'cmn',
			        data:{
			            $url:'getActivityDetail',
			            id:that.activityId
			        }
			    });
				that.activity = res.result.data;
                // #endif
                // #ifdef H5
                res= await cloudbase.callFunction({
                    name:'web',
                    data:{
                        $url:'getActivityDetail',
                        id:that.activityId
                    }
                });
                that.activity = JSON.parse(res.result.data);
                // #endif
				let parseSignUp = that.activity.sign_up.date+' '+that.activity.sign_up.time;
				let parseSignIn = that.activity.sign_in.date+' '+that.activity.sign_in.time;
				that.activity.sign_up = parseSignUp;
				that.activity.sign_in = parseSignIn;
			},

            goMy(){
                uni.reLaunch({
                    url: '/pages/my/home',
                })
            },
			
			goEdit(){
				uni.navigateTo({
			        "url":"/pagesMgt/BizActivityInput?id="+this.activityId
				})
			},
			
			async doRemove(){
			    let that = this;
                // #ifdef MP-WEIXIN
			    await wx.cloud.callFunction({
			        name:'cmn',
			        data:{
			            $url:'removeActivity',
			            content:that.activity,
			        }
			    });
                // #endif
                // #ifdef H5
                await cloudbase.callFunction({
                    name:'cmn',
                    data:{
                        $url:'removeActivity',
                        content:that.activity,
                    }
                });
                // #endif
			    uni.showToast({ icon:'success',title:'删除成功'})
			    setTimeout (() => {
			        uni.navigateTo({
			            url:'/pagesMgt/BizProductList',
			        });
			    } , 1000 )
			},
			

            goQrcode(id){
                uni.navigateTo({
                    url:"/pagesCmn/activity/ActivityQrcode?id="+ id
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
	video {
		width: 750rpx;
	}
	image {
		width: 750rpx;
	}
	swiper{
		height: 660rpx;
		width: 750rpx;
	}
</style>
