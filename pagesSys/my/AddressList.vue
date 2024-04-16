<template>
	<view class="" :class="isUps == true ? 'prevent' : ''">
		<cu-custom    :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">我的地址</block>
		</cu-custom>
		<view class="page">
			<view class="cu-list menu-avatar no-padding">
				<block v-for="(item,index) in user.userInfo.recipients" :key="index">
					<view @tap="setAsDefault(item)" class="cu-item  card-radius margin-top-xxs margin-left-xs margin-right-xs margin-bottom-xs shadow bg-white.light">
						<view  class="cu-avatar round" >
							<view class="text-sm text-cut" >{{item.key}}</view>
						</view>
						<view class="content">
							<view class="text-grey">{{item.name}}
								<text class="margin-left-sm text-abc">{{item.phone}}</text>
							</view>
							<view class="text-gray text-sm text-cut" >{{item.address}}</view>

						</view>
						<view class="action">
							<text v-if="item.as_default" class="cuIcon-check text-green" style="font-size: 38rpx;"></text>
						</view>
					</view>
				</block>
			</view>

			<view class="cu-tabbar-height"></view>
			<view class="cu-tabbar-height"></view>
			<view v-if="!isUps" class="cu-bar bg-white tabbar border  foot">
				<view class="bg-green submit text-lg" @tap="showNewAddress">添加地址</view>
			</view>
		</view>
		<!-- 遮罩 -->
		<view class="shade" v-if="isUps"></view>
		<!-- 底部展现收藏弹窗 -->
		<uni-popup ref="showPopupNewAddress" type="bottom" @change="change">
			<view class="popup bg-white">
				<text class="cuIcon-close popup-close" @click="cancel('PopupNewAddress')"></text>
				<text class="popup-title" >添加新地址</text>
				<view class="popup-content">
					<scroll-view class="ups-height" scroll-y="true">
						<view>
							<view class="cu-form-group">
								<view class="title">标题</view>
								<input class="text-left" placeholder="例如：家、公司" @input="inputKey" :value="recipient.key"></input>
							</view>
							<view class="cu-form-group">
								<view class="title">姓名</view>
								<input class="text-left" placeholder="姓名" @input="inputName" :value="recipient.name"></input>
							</view>
							<view class="cu-form-group">
								<view class="title">电话</view>
								<input class="text-left" placeholder="联系电话" type="tel" @input="inputPhone" :value="recipient.phone"></input>
								<!-- #ifdef MP-WEIXIN -->
								<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="cu-btn round  line-grey"> 授权手机号 </button>
								<!-- #endif -->
							</view>
							<view class="cu-form-group">
								<view class="title">邮寄地址</view>
								<input class="text-left" placeholder="请输入邮寄地址" @input="inputAddress" :value="recipient.address"></input>
							</view>
							<view class="cu-bar solid-bottom margin-top-xxs radius"></view>
							<view class="cu-bar btn-group  foot bg-white">
								<button class="cu-btn   round line-grey"   @click="saveAddress"> 确定 </button>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
    import { mapState,mapMutations } from 'vuex'
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    // #endif

    export default {
        components: {
            "uni-popup":uniPopup,
        },
        data() {
            return {
                isUps:false,
                recipient:{key:'',address:'',name:'',phone:'',remark:'',as_default:false}//邮寄地址
            }
        },
		onShow(){
		},
        computed:{
            ...mapState(['user']),
        },
        methods:{
            ...mapMutations(['updateUser']),
            async setAsDefault(recipient){
                let that = this;
				// console.log('set as default',recipient);
				that.user.userInfo.recipients.forEach(each=>{
                    each.as_default=each.key==recipient.key;
				});
				that.updateUser(that.user);
                await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'updateUserInfo',
                        id:that.user._id,
                        userInfo:that.user.userInfo
                    }
                });
                that.$forceUpdate();
			},
            showNewAddress(){
                let that = this;
                that.$nextTick(() => {
                    that.isUps=true;
                    that.$refs['showPopupNewAddress'].open();
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

            inputKey(e){
                this.recipient.key = e.detail.value
            },
            inputName(e){
               	this.recipient.name = e.detail.value
            },
            inputPhone(e){
                this.recipient.phone = e.detail.value
            },
            inputAddress(e){
               	this.recipient.address = e.detail.value
            },
            inputRemark(e){
                this.recipient.remark = e.detail.value
            },

            async getPhoneNumber(e) {
            	let that = this;
               let res = {};
               let data={};
               // #ifdef MP-WEIXIN
            	res = await wx.cloud.callFunction({
                    name: 'sys',
                    data: {
                        $url:'getPhone',
                        cloudId:e.detail.cloudID
                    }
                });
               data = res.result.data;
               // #endif
               // #ifdef H5
               res = cloudbase.callFunction({
                   name: 'web',
                   data: {
                       $url:'getPhone',
                       cloudId:e.detail.cloudID
                   }
               });
               data = JSON.parse(res.result.data);
               // #endif
            	if(res.result.code == 0){
            		wx.showToast({
            			title: '授权成功',
            		    success: function() {
            		    }
            		});
            		that.recipient.phone = data.phoneNumber;
            		that.$forceUpdate();
            	}
            },

			async saveAddress(){
                let that = this;
                if(!that.user.userInfo.recipients){
                    that.user.userInfo.recipients=[];
				}
                that.user.userInfo.recipients.push(that.recipient);
                that.updateUser(that.user);
                await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'updateUserInfo',
                        id:that.user._id,
                        userInfo:that.user.userInfo
                    }
                });
                that.$forceUpdate();
                uni.showToast({
                    icon:'success',
                    title:'添加成功'
                });
                that.$refs['showPopupNewAddress'].close();
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
		height: 950rpx;
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
		height: 850rpx;
		position: fixed;
		left:0;
		bottom: 0;
		z-index: 99;
	}
</style>
