<template>
	<view class="shadow card flex bg-white rel"  style="height: 200px;">
		<view class="rel" style="width: 50%;height: 100%;">
			<image :src="card.avatar" mode="aspectFill" style="z-index: 3;height: 198px;border-bottom-left-radius: 3%;border-top-left-radius:3%;"></image>
			<view class="abs" style="z-index: 30;width: 6px;height: 197.5px;top: 0; right: 22px;transform: skewX(-16deg);background-color: #d5d5d5;"></view>
			<view class="abs" style="z-index: 4; width: 0;height: 0;border-top: 198px solid transparent; border-bottom: 0 solid transparent;top: 0; right: 0; border-right: 100rpx solid; color:white"></view>
		</view>
		<view class="abs" style="z-index: 11; top: 35rpx; right: 10px;">
				<uni-rate :disabled="true" :value="card.view_points||4.5" size="12" @tap="showCont"/>
				<view class="main abs modal" v-if="isShowCont" >
					<view class="content bg-gray shadow modal_cont">
						<text>影响力指数</text>
					</view>
				</view>
		</view>
		<view class="abs" style="z-index: 11;top: 52rpx; right: 10px;">
			<view class="margin-top-sm margin-bottom-sm  text-sm " @tap="goBizCard" >{{card.corp_name||''}}</view>
		</view>
		<view class="abs bg-gray" style="z-index:20; right: 1rpx;top:120rpx;width: 388rpx; height: 108rpx; padding-top: 10rpx;" @tap="changeShow" >
			<view class="flex card-upper card-name">
				<text class="text-bold text-xxl" >{{card.name}}</text>
				<text v-if="card.card_level" class="margin-left-sm cuIcon-vip font40 text-gray"></text>
			</view>
			<view class="flex card-upper card-name">
				<text class="text-sm" >{{card.corp_position}}</text>
			</view>
			<view class="abs trans"></view>
		</view>
		<view  style="z-index: 10;padding: 30rpx; ">
			<view style="height: 180rpx;"></view>
			<view v-if="showType=='STYLE_ICON'">
				<view v-if="!card.corp_address" class="flex text-center margin-top-xl">
					<view class="margin-right-xl"  @tap="showQrCode(card._id)">
						<view class="cuIcon-qrcode font40"></view>
						<view class="font16">名片码</view>
					</view>
					<view class="margin-right-xl"  @tap="dailPhone">
						<view class="cuIcon-dianhua font40"></view>
						<view class="font16">拨打电话</view>
					</view>
					<view>
						<view class="cuIcon-friendadd font40" @tap="saveContact"></view>
						<view class="font16">保存通讯录</view>
					</view>
				</view>
				<view v-else class="flex text-center margin-top-xl" style="margin-left: -45rpx;">
					<view class="margin-right"  @tap="showQrCode(card._id)">
						<view class="cuIcon-qrcode font40"></view>
						<view class="font16">名片码</view>
					</view>
					<view class="margin-right"  @tap="dailPhone">
						<view class="cuIcon-dianhua font40"></view>
						<view class="font16">拨打电话</view>
					</view>
					<view class="margin-right" @tap="saveContact">
						<view class="cuIcon-friendadd font40" ></view>
						<view class="font16">保存通讯录</view>
					</view>
					<view @tap="goQQMap">
						<view class="cuIcon-location font40"></view>
						<view class="font16">去拜访</view>
					</view>
				</view>
			</view>
			<view v-else class="abs" style="z-index: 11;top: 245rpx; right: 10px; width: 50%">
				<view v-if="card.mailing_address" class='font20' @tap="copyInfo(card.mailing_address,'地址')">地址: {{card.mailing_address}}</view>
				<view>
					<text v-if="card.phone" class='font20 margin-right-sm'>电话: {{card.phone}}</text>
					<text v-if="card.wx_number" class='font20'>微信: {{card.wx_number}}</text>
				</view>
				<view v-if="card.email" class='font20'>Email: {{card.email}}</view>
			</view>
		</view>
		
		
	</view>

</template>

<script>
    import { mapState } from 'vuex'
	export default {
		name:"Card",
		props:{
			card:{
				type:Object,
				required:true
			}
		},
		data() {
			return {
				isShowCont:false,
				showType:"STYLE_ICON"
			};
		},
        computed:{
            ...mapState(['user']),
        },

		methods:{
            async goBizCard(){
				if(this.user.userInfo.bizCardId!=''){
					uni.navigateTo({
					    "url": "/pagesSys/card/BizAboutExt?id="+this.card.corp_id,
					})
				}
            },
			showQrCode(id){
				uni.navigateTo({
				    "url":"/pagesSys/card/CardQrcode?id=" + id
				})
			},
            dailPhone(){
                let that = this;
                uni.makePhoneCall({
                    phoneNumber:that.card.phone
                })
            },
			//保存通讯录
            saveContact(){
			    let that = this;
                // #ifdef MP-WEIXIN
                wx.addPhoneContact({
                    firstName: that.card.name, //联系人姓名
                    mobilePhoneNumber: that.card.phone?that.card.phone:null, //联系人手机号
                    weChatNumber:that.card.wx_number?that.card.wx_number:'',//微信号
                    organization: that.card.corp_name?that.card.corp_name:'',//公司
                    title: that.card.corp_position?that.card.corp_position:'',//职位
                    workAddressStreet: that.card.mailing_address?that.card.mailing_address:'',//工作地址
                    email: that.card.email?that.card.email:''
                })
                // #endif
                // #ifdef H5
                uni.showToast({
                    icon:'none',
                    title:'请使用小程序保存'
                });
                // #endif
            },
            goQQMap(){
                let that =this;
                wx.openLocation({
                    latitude:that.card.corp_address.latitude,
                    longitude:that.card.corp_address.longitude,
                })
            },
			showCont(){
				let that = this;
				this.isShowCont = !this.isShowCont;
				setTimeout(function(){
					that.isShowCont = false;
				},1000)
			},
			changeShow(){
				if(this.showType==="STYLE_ICON"){
					this.showType = "STYLE_TEXT"
				}else{
					this.showType = "STYLE_ICON"
				}
			},
			copyInfo(cText,msg){
				const title = msg+'复制成功'
				wx.setClipboardData({
				    data: cText,
				    success: function (res) {
				        wx.showToast({
				            title: title
				        });
				    }
				})
			}
		}
	}
</script>

<style>
	.card-upper{
		justify-content: center;
	}
	.card{
		border: 1rpx solid #d5d5d5;
		border-radius: 3%;
		width: 96%;
		margin: 10rpx 25rpx 10rpx 10rpx;
		min-height: 90rpx;
		height: 200rpx;
        background-repeat: no-repeat;
        background-size: cover;
		box-shadow: 3px 3px 3px #888888;
    }
	.card-name{
		line-height: 48rpx;
		margin-left: 10rpx;
	}
	.font16{
		font-size: 16rpx;
	}
	.font20{
		font-size: 20rpx;
	}
	.font40{
		font-size: 40rpx;
	}
	.trans{
		z-index: 4;
		width: 0;
		height: 88rpx;
		border-bottom: 40rpx solid #f0f0f0; 
		border-right: 15rpx solid #f0f0f0; 
		border-top:40rpx solid transparent;
		border-left:15rpx solid transparent;
		left: -27rpx;
		top:21rpx
	}
	.main .content::before {
	    left: -10rpx;
	    right: auto;
	}
	.main .content::before {
	    content: "";
	    top: 18rpx;
	    -webkit-transform: rotate(45deg);
	    transform: rotate(45deg);
	    position: absolute;
	    z-index: -1;
	    display: inline-block;
	    overflow: hidden;
	    width: 20rpx;
	    height: 20rpx;
	    left: initial;
	    right: -10rpx;
	    background-color: inherit;
	    -webkit-filter: blur(5rpx);
	    filter: blur(5rpx);
	    opacity: 0.3;
	}
	.main .content::after {
	    content: "";
	    top: 18rpx;
	    -webkit-transform: rotate(45deg);
	    transform: rotate(45deg);
	    position: absolute;
	    z-index: 100;
	    display: inline-block;
	    overflow: hidden;
	    width: 15rpx;
	    height: 15rpx;
	    left: initial;
	    right: -10rpx;
	    background-color: inherit;
	}
	.modal{
		left: -150rpx;
		top: -20rpx;
		font-size: 20rpx;
	}
	.modal_cont{
		padding: 10rpx;
	}
</style>
