<template name="WebLogin">
	<view>
		<view v-if="!isLogin" class="cu-modal show">
			<view class="cu-dialog" @tap.stop>
				<view class="cu-bar bg-white justify-end">
				</view>
				<view class="bg-white">
					<image  src="https://7072-prod-9goq82ctb17bd75f-1306535128.tcb.qcloud.la/resource/missing-face.png" class="cu-avatar round lg png" mode="widthFix"></image>
					<view class="content margin-top-sm">用户登录</view>
				</view>
				<view class="padding-sm bg-white">
					<view class="cu-form-group">
						<view class="title">手机号<text class="cuIcon-titles text-xs text-orange"></text></view>
						<input class="text-left" placeholder="请输入手机号..." @input="inputPhone" :value="card.phone"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">授权码<text class="cuIcon-titles text-xs text-orange"></text></view>
						<input class="text-left" placeholder="请输入授权码..." @input="inputAuthCode" :value="card.auth_code"></input>
					</view>
					<view class="text-xs text-orange">{{card.error_msg}}</view>
				</view>
				<view class="flex flex-direction bg-white" style="padding: 0 120upx 50upx 120upx">
					<button class="cu-btn line-green lg" @tap="loginAccount">登录</button>
				</view>
			</view>
		</view>
		<scroll-view scroll-y class="page">
			<image :src="bizCard.site_bg" mode="widthFix" class="response"></image>
			<view class="nav-list">
				<view hover-class="none" @tap="goItem" class="nav-li" navigateTo :class="'bg-'+item.color"
					  :style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]" v-for="(item,index) in bizCard.site" :key="index" :data-item="bizCard.site[index]">
					<view class="nav-title">{{item.title}}</view>
					<view class="nav-name">{{item.name}}</view>
					<text :class="'cuIcon-' + item.cuIcon"></text>
				</view>
			</view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
	</view>
</template>

<script>
    import { mapState, mapMutations} from 'vuex';
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    // #endif

    export default {
        name: "WebLogin",
        data() {
            return {
                isLogin: false,
				title:'',
                card:{phone:'',auth_code:'',error_msg:''},//用户名片
                bizCard:{
                    site_bg:'',
                    site:[
                        {
                            title: '最新产品',
                            name: 'product',
                            color: 'purple',
                            cuIcon: 'shop',
                            isOpen: true,
                            auth:true
                        },
                        {
                            title: '公司展厅',
                            name: 'trend',
                            color: 'mauve',
                            cuIcon: 'pic',
                            isOpen: true,
                            auth:true
                        },
                        {
                            title: '线上活动',
                            name: 'activity',
                            color: 'cyan',
                            cuIcon: 'activity',
                            isOpen: true,
                            auth:true
                        },
                        {
                            title: '客服沟通',
                            name: 'service',
                            color: 'blue',
                            cuIcon: 'service',
                            isOpen: true,
                            auth:true
                        },

                        {
                            title: '园区企业',
                            name: 'company',
                            color: 'red',
                            cuIcon: 'moreandroid',
                            isOpen: true,
                            auth:true
                        },
                        {
                            title: '关于我们',
                            name: 'about',
                            color: 'green',
                            cuIcon: 'info',
                            isOpen: true,
                            auth:true
                        }
                    ]
                },
            };
        },
        onShow(){
            let that =this;
            that.needWxAuth();
            if(that.needAuthFlag){
                return;
            }
            wx.setNavigationBarTitle({
                title: that.title
            });
            that.getSiteElements();
        },

        computed:{
            ...mapState(['needAuthFlag','user']),
        },
        methods: {
            ...mapMutations(['needWxAuth','wxAuth','updateUser']),
            hideLoginModal(e) {
                this.modalName = null
            },
            async loginAccount(){
                let that = this;
                console.log('loginCard phone',that.card.phone,'auth_code',that.card.auth_code);

                let reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
                if(that.card.phone.trim().length!=11 || !reg.test(that.card.phone)){
                    that.card.error_msg='请输入正确手机号';
                    return;
                }

                var patrn = /^[0-9]*$/;
                if (that.card.auth_code.trim().length!=4 || !patrn.test(that.card.auth_code)) {
                    that.card.error_msg='请输入正确授权码';
                    return;
                }
                await cloudbase.auth().anonymousAuthProvider().signIn();
                // 匿名登录成功检测登录状态isAnonymous字段为true
                const loginState = await cloudbase.auth().getLoginState();
                console.log('login',loginState.isAnonymousAuth); // true
                let res = await cloudbase.callFunction({
                    name:'web',
                    data:{
                        $url:'webLogin',
                        phone:that.card.phone,
                        authCode:that.card.auth_code,
                    }
                });
                let user = JSON.parse(res.result.data).user;
                if(user.userInfo){
                    console.log('name',user.userInfo.nickName,'bizCardName',user.userInfo.bizCardName);
                    that.title=user.userInfo.bizCardName;
                    that.updateUser(user);
                    that.isLogin = true;
                    that.getSiteElements();
                }else{
                    that.card.error_msg='请输入正确手机号或授权码';

                }
            },

            inputPhone(e){
                this.card.phone = e.detail.value
            },

            inputAuthCode(e){
                this.card.auth_code = e.detail.value
            },
            async getSiteElements(){
                let that = this;
                let res = null;
                // #ifdef H5
                res = await cloudbase.callFunction({
                    name:'web',
                    data:{
                        $url:'getCardDetailById',
                        id:that.user.userInfo.bizCardId
                    }
                });
                that.bizCard = JSON.parse(res.result.data);
                // #endif
            },

            goItem(e){
                let that = this;
                console.log('item auth', e.currentTarget.dataset.item,'needWxAuth',this.needWxAuth(this.bizCard));
                let item = e.currentTarget.dataset.item;
                if(item.auth){
                    if(that.needAuthFlag){
                        that.wxAuth(that.bizCard);
                        return;
                    }
                }
                if(item.isOpen){
                    uni.navigateTo({'url':'/pagesSys/site/'+item.name})
                }else{
                    uni.showToast({
                        icon:'none',
                        title:'此功能暂未开通'
                    });
                }

            },
        },
    }
</script>

<style>
	.page {
		height: 100vh;
	}
</style>
