<template name="Login">
	<view class="UCenter-bg" style="{backgroundImage:'url(https://7072-prod-9goq82ctb17bd75f-1306535128.tcb.qcloud.la/s002/home_hj6c.png)'}">
		<!--  #ifdef H5 -->
		<view class="cu-modal show" >
			<view class="cu-dialog" >
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
					<button class="cu-btn bg-blue lg" @tap="loginAccount">登录</button>
				</view>
			</view>
		</view>
		<!-- #endif -->
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
                modalName: 'LoginModal',//模态框名称
                card:{phone:'',auth_code:'',error_msg:''},//用户名片
            };
        },

		onLoad() {
			this.anonymousAuth();
		},

        computed:{
            ...mapState(['httpPath']),
        },

        methods: {
            ...mapMutations(['updateUser']),

			async anonymousAuth(){
                await cloudbase.auth().anonymousAuthProvider().signIn();
                // 匿名登录成功检测登录状态isAnonymous字段为true
                const loginState = await cloudbase.auth().getLoginState();
                console.log('login',loginState.isAnonymousAuth); // true
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

                let res = await cloudbase.callFunction({
                    name:'web',
                    data:{
                        $url:'webLogin',
                        phone:that.card.phone,
                        authCode:that.card.auth_code,
                    }
                });
                let resultData = JSON.parse(res.result.data);
                let user = resultData.user;
                let card = resultData.card;
                console.log('name',user.userInfo.nickName);
                that.updateUser(user);
                let myAccountApiMap = {};
                for(let i in user.userInfo.accounts){
                    if(user.userInfo.accounts[i].account_key=='7600'){
                        if(user.userInfo.accounts[i].is_forbidden){
                            that.card.error_msg='请知：此账号已被停用！';
                            return;
						}else{
                            myAccountApiMap = user.userInfo.accounts[i].api_map;
						}
						break;
					}
				}
				//
                //查找用户是否存在，不存在创建新用户
                let readApiForm = myAccountApiMap.read || {};
                readApiForm.apicallsetinput[0].email=card.email||card.phone+'@huajisys.com';
                // console.log('readApiForm',JSON.stringify(readApiForm));

                let createApiForm = myAccountApiMap.create || {};
                createApiForm.apicallsetinput[0].firstname=user.userInfo.nickName;
                createApiForm.apicallsetinput[0].lastname=user.userInfo.gender==1?'先生':'女士';
                createApiForm.apicallsetinput[0].password=user._openid;
                createApiForm.apicallsetinput[0].email=card.email||'';
                createApiForm.apicallsetinput[0].title='主管';
                createApiForm.apicallsetinput[0].profile_image=user.userInfo.avatarUrl;
                createApiForm.apicallsetinput[0].language=user.userInfo.language;
                // console.log('createApiForm',JSON.stringify(createApiForm));

                res = await cloudbase.callFunction({
                    name:'web',
                    data:{
                        $url:'huajiSsoUrl',
                        readApiForm:readApiForm,
                        createApiForm:createApiForm,
                    }
                });

                console.log('ssoUrl',res.result.data);
                window.location.href = res.result.data;
            },

            inputPhone(e){
                this.card.phone = e.detail.value
            },

            inputAuthCode(e){
                this.card.auth_code = e.detail.value
            },
        },
    }
</script>

<style>
	.UCenter-bg {
		background-size: cover;
		height: 2048rpx;
		display: flex;
		justify-content: center;
		padding-top: 40rpx;
		overflow: hidden;
		position: relative;
		flex-direction: column;
		align-items: center;
		color: #fff;
		font-weight: 300;
		text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
	}

	.UCenter-bg text {
		opacity: 0.8;
	}

	.UCenter-bg image {
		width: 200rpx;
		height: 200rpx;
	}

	.UCenter-bg .gif-wave{
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	map,.mapBox{
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	map,.mapBox{
		width: 750rpx;
		height: 300rpx;
	}
</style>
