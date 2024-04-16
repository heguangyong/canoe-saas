<template name="activity">
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<cu-custom    :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">活动详情</block>
		</cu-custom>
		<!-- #endif -->
		<view class="bg-img flex align-center">
			<image :src="activity.cover"  mode="aspectFill" style="width: 750rpx;"></image>
		</view>
		<view class="cu-list grid col-3 margin-bottom-xl   radius" style="background-color: #EFEFEF">
			<view class="cu-item"  v-for="(action,index) in activity.actions" :key="index"  @tap="go(action)">
				<view class="padding radius text-center ">
					<image :src="action.icon" mode="aspectFill" class="cu-avatar round lg"></image>
					<text>{{action.name}}</text>
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
    import { mapState, mapMutations} from 'vuex';
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    import jweixin from 'jweixin-module';
    // #endif


    export default {
        name: "activity",
        data() {
            return {
                isUps:false,
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
            // #ifdef H5
            that.webLogin();
			// #endif
            that.activity._id = options.id;
			that.getDetail();
			//绑定公众号
        },

        onShareAppMessage(res){
            console.log('onShareAppMessage',res);
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
            ...mapMutations(['updateUser']),

			ShareActivityDetail(){
			    uni.showShareMenu({
			        withShareTicket:true,
			    })
			},

			async webLogin(){
			    let that =this;
                // #ifdef H5
                await cloudbase.auth().anonymousAuthProvider().signIn();
                // 匿名登录成功检测登录状态isAnonymous字段为true
                const loginState = await cloudbase.auth().getLoginState();
                console.log('login',loginState.isAnonymousAuth); // true
                // #endif
			},
			async getDetail(){
			    let that = this;
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

                //-------------------------
                //提供分享公众号能力
                res = await cloudbase.callFunction({
                    name:'web',
                    data:{
                        $url:'signWeixin',
						url:'http://f001.u-truck.cn/#/pagesCmn/activity/a001/index',
                        needRefreshSignature:false
                    }
                });
                let signRet =  JSON.parse(res.result.data);
                console.log('sign',res.result.data);
				jweixin.config({
					debug: false, // 调试，发布的时候改为false
					appId: 'wx92afa50abc60d729',
					nonceStr: signRet.nonceStr,
					timestamp: signRet.timestamp,
					signature: signRet.signature,
					jsApiList: [ // 可能需要用到的能力
						'updateAppMessageShareData',
						'updateTimelineShareData'
					]
				});

                jweixin.error ((res)=>{
				    console.log('jweixin.error',res);
                    //刷新后再分享
                    cloudbase.callFunction({
                        name:'web',
                        data:{
                            $url:'signWeixin',
                            url:'http://f001.u-truck.cn/#/pagesCmn/activity/a001/index',
                            needRefreshSignature:true
                        }
                    })
                });

                jweixin.ready(() => {   //需在用户可能点击分享按钮前就先调用
                    jweixin.updateAppMessageShareData({
                        title: '精益求精 睿智精选', // 分享标题
                        desc: '十分精选定制产品交流会', // 分享描述
                        link: 'http://f001.u-truck.cn/#/pagesCmn/activity/a001/index', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl:  this.activity.cover, // 分享图标
                        success: function () {
                            // 设置成功
                            console.log('success');
                        }
                    })
                });
                //-------------------------

                // #endif

            },


            go(action){
                uni.navigateTo({
                    "url": "/pagesCmn/activity/a001/"+action.detail+"?id="+this.activity._id,
                })
            },
        }
    }
</script>

<style>
	.cu-list.grid>.cu-item:after {
		position: absolute;
		top: 0;
		left: 0;
		box-sizing: border-box;
		width: 200%;
		height: 200%;
		border-right: 1px  rgba(0, 0, 0, .1);
		border-bottom: 1px  rgba(0, 0, 0, .1);
		border-radius: inherit;
		content: " ";
		transform: scale(.5);
		transform-origin: 0 0;
		pointer-events: none
	}
</style>
