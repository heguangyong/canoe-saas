<template name="my">
	<view class="" :class="isUps == true ? 'prevent' : ''">
	<scroll-view scroll-y class="scrollPage">
		<view class="UCenter-bg">
			<!-- #ifdef MP-WEIXIN -->
			<image v-if="user.userInfo"  @tap="goMyCard()" :src="user.userInfo.avatarUrl" class="cu-avatar round lg png" mode="widthFix"></image>
			<view v-if="user.userInfo" class="text  margin-top-sm">{{user.userInfo.nickName||''}}</view>
			<!-- <view v-else @tap="doAuth()" class="bg-green submit text-lg margin-top-sm">获取微信头像昵称</view> -->
			<view v-else>
				<image  @tap="doAuth()" class="align-center round lg png margin-top-xl" src="https://7072-prod-9goq82ctb17bd75f-1306535128.tcb.qcloud.la/resource/missing-face.png"  mode="widthFix"></image>
			</view>
			<!-- #endif -->
			<!--  #ifdef H5 -->
			<image v-if="user.userInfo" :src="user.userInfo.avatarUrl" class="cu-avatar round lg png" mode="widthFix"></image>
			<image v-else  src="https://7072-prod-9goq82ctb17bd75f-1306535128.tcb.qcloud.la/resource/missing-face.png" class="cu-avatar round lg png" mode="widthFix"></image>
			<view v-if="user.userInfo" class="text  margin-top-sm">{{user.userInfo.nickName||''}}</view>
			<view v-else><button  @tap="goWebLogin" class="text margin-top-sm">登录</button></view>
			<!-- #endif -->
<!--			<image src="https://7072-prod-9goq82ctb17bd75f-1306535128.tcb.qcloud.la/resource/wave.gif" mode="scaleToFill" class="gif-wave"></image>-->
		</view>
		<block v-if="user.userInfo">
			<view class="padding flex text-center text-grey bg-white shadow-warp">
				<view class="flex flex-sub flex-direction solid-right" @click="goMsgList">
					<view class="text-xxl text-orange">{{accountSum.newMsgNum}}</view>
					<view class="margin-top-sm">
						<text class="cuIcon-message margin-xs"></text> 新消息</view>
				</view>
				<view class="flex flex-sub flex-direction solid-right"  @click="goWishOrderList">
					<view class="text-xxl text-blue">{{accountSum.wishOrderNum}}</view>
					<view class="margin-top-sm">
						<text class="cuIcon-goods margin-xs"></text> 购物袋</view>
				</view>
				<view class="flex flex-sub flex-direction" @click="goTotalOrderList">
					<view class="text-xxl text-green">{{accountSum.totalOrderNum}}</view>
					<view class="margin-top-sm">
						<text class="cuIcon-ticket margin-xs"></text> 全部订单</view>
				</view>
			</view>
			<view class="cu-bar bg-white search solid-bottom margin-top-sm  shadow-lg radius">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input type="text" placeholder="搜索功能" confirm-type="search" @input="searchAction"></input>
				</view>
			</view>
			<view class="cu-list grid col-3 margin-bottom-xl  shadow-lg radius">
				<!-- <view class="cu-item" :class="checkRole(user,action.need_role)?'':'bg-gray'" v-for="(action,index) in bizCard.accounts" :key="index"  @tap="go(action)" v-if="action.is_show"> -->
				<view class="cu-item"  v-for="(action,index) in bizCard.accounts" :key="index"  @tap="go(action)" v-if="action.is_show">
					<text class="lg text-gray" :class="'cuIcon-' + action.name"></text>
					<text>{{action.title}}</text>
				</view>
			</view>
		</block>
		<block v-else>
			<view  class="cu-form-group margin-top-xl margin-left-lg margin-right-lg">
				<radio-group @change="setAgree">
					<label class="margin-left-sm">
						<radio class="blue radio" value="1"></radio>
						<text class="margin-left-sm"> 同意</text>
					</label>
					<label>
						<text class="submit text-blue"  @tap="popupContract">「用户协议」</text>
					</label>
					<label>
						<text>与</text>
					</label>
					<label>
						<text class="submit text-blue"  @tap="popupContract">「隐私政策」</text>
					</label>
				</radio-group>
			</view>
			<view class="cu-bar tabbar radio margin-top margin-left-lg margin-right-lg">
				<view class="bg-green submit text-lg"   @tap="doAuth()">获取微信头像昵称</view>
			</view>
		</block>
		<view v-if="modalName=='ManagedCodeModal'" class="cu-modal" :class="modalName=='ManagedCodeModal'?'show':''" @tap="hideManagedCodeModal">
			<view class="cu-dialog" @tap.stop>
				<view class="cu-bar bg-white justify-end">
					<view class="content">管理码授权</view>
					<view class="action" @tap="hideManagedCodeModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-sm bg-white">
				<view  class="cu-form-group bg-gray">
					<input placeholder="请输入管理码..." v-model="managedCode"></input>
				</view>
			</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green"  @tap="hideManagedCodeModal">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="confirmManagedCode">确定</button>
					</view>
				</view>
			</view>
		</view>
		<view v-if="modalName=='SysAdminCodeModal'" class="cu-modal" :class="modalName=='SysAdminCodeModal'?'show':''" @tap="hideSysAdminCodeModal">
			<view class="cu-dialog" @tap.stop>
				<view class="cu-bar bg-white justify-end">
					<view class="content">后台授权</view>
					<view class="action" @tap="hideSysAdminCodeModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-sm bg-white">
				<view  class="cu-form-group bg-gray">
					<input placeholder="请输入系统密码..." v-model="sysAdminCode"></input>
				</view>
			</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green"  @tap="hideSysAdminCodeModal">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="confirmSysAdminCode">确定</button>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-tabbar-height"></view>
	</scroll-view>
	
	<!--遮罩-->
	    <view class="shade" v-if="isUps"></view>
	    <!--底部用户协议弹窗-->
	    <uni-popup ref="showPopupContract" type="bottom" @change="change">
	        <view class="popup-base bg-white">
	            <text class="cuIcon-close popup-close" @click="cancel('PopupContract')"></text>
	            <text class="popup-title" >用户协议与隐私政策</text>
	            <scroll-view scroll-y class="popup-content">
	                <text class="text-box padding-sm text-df" scroll-y="true">
					一、总则
					1.1 升阶助手小程序所有权和运营权归升阶信息服务工作室所有。
					1.2 用户使用前应当仔细阅读本协议,并遵守本协议及所有规则后方可成为升阶用户。一旦用户注册成功，用户与工作室自动形成协议关系。未经同意本协议不能在本小程序中发表任何内容。
					1.3 本协议课由工作室随时更新，不承担通知用户义务。
					二、服务内容
					2.1 根据工作室实际情况提供内容，例如动态、产品、活动、消息等。
					2.2 本工作室提供的相关网络服务涉及付费部分，均由用户自行负担。
					三、用户账号
					3.1 用户可以通过微信授权接口得到微信头像、昵称作为小程序使用的账号。
					3.2 如果用户需要制作个人的名片也可通过微信授权接口得到手机号、位置等信息。
					3.3 所有账号及用户名片中手机号、位置等信息
					3.4 账号的所有权归工作室、用户享有使用权。未经许可，不得赠与借用、租用、转让或售卖账号。3隔越未使用的用户账号、工作室保留收回的权利。
					3.5 用户有义务保证密码和账号的安全，本工作室不承担任何责任。
					四、使用规则
					4.1 遵守「中华人民共和国计算机信息系统安全保护条例」等有关计算机互联网规定和知识产权的法律法规实施办法。
					4.2 用户对自行发布的内容负全部责任，所有用户不得在本小程序发布、转载、传送含有下列内容之一的信息，否则本工作室有权自行处理并不通知用户。
					    （1）违反宪法确定的基本原则的；
						（2）危害国家安全的；
						（3）损害国家荣誉和利益的；
						（4）煽动民族仇恨、民族歧视，
						（5）散布谣言，破坏社会稳定的；
						（6）散布淫秽、色情、赌博、暴力、恐怖或者教唆犯罪的；
						（7）以非法民间组织活动；
						（8）含有法律、行政法规禁止的其他内容的。
					4.3 用户对自行发布的内容享有完整的知识产权，如用户违法本协定、涉及第三人索赔的、用户应全额补偿本工作室一切费用（包括但不限于各种赔偿费、诉讼代理费及为此吃出的其它合理费用）
					4.4 第三方认为用户发表或者上传于本小程序的内容侵犯其权利，并根据「信息网络传播保护条例」或者相关法律规定向本工作室发送权利通知书时，用户同意本工作室自行判断决定删除涉嫌侵权信息。
					4.5 如果用户在使用小程序时违反上述任何规定、本工作室有权要求用户改正或直接采取一切必要的措施（删除用户内容，暂停用户使用网络服务）以减轻用户不当行为而造成的影响。
					五、隐私保护
					5.1 本工作室不对外公开或向第三方提供单个用户的注册资料及用户在使用中存储在本小程序内非公开内容，但下列情况除外：
						（1）事先获得用户授权；
						（2）根据有关法律法规要求；
						（3）按照政府主管部门要求；
						（4）为维护社会公众利益。
					5.3 本工作室可能会于第三方合作想用户提供相关的网络服务，在此情况下，如该第三方同意承担与本工作室同等的保护用户隐私的责任，则本工作室有权将用户的注册资料等提供给该第三方。
					5.4 在不透露单个用户隐私资料的前提下，本工作室有权对整个用户数据库进行分析并对用户数据进行商业上的利用。
					六、版权声明
					6.1 用户发表的内容，本工作室在全世界范围内不限形式和窄体的享有永久的、不可撤销的、非独家的使用权和转授权的权利，包括但不限于修改、复制、发型】展览、改变、出版、翻译、信息网络传播、广播、表演和再创作及著作权法等法律法规确定的其它权利。
					6.2 用户从本小程序获得的信息、未经许可不得复制或转载。
					6.3 使用本小程序的任何内容均应注明来源于升阶助手及暑上作者姓名、按法律法规的、需要支付稿酬的，应当通知工作室及作者及支付稿酬并独立承担一切法律责任。
					6.4 本工作室享有所有作品用于其他用途的使用权和优先权，包括但不限于网站、电子杂志、平面出版等，作者在本小程序上发布内容视为同意本条款。
					6.5 小程序内容于本工作室无关，由作者本人承担一切法律责任。
					6.7 恶意转载内容，本工作室保留将其诉诸法律的权利。
					七、责任声明
					7.1 用户发布内容责任由用户承担，与本工作室无关。
					7.2 本小程序不保证网络服务的及时性、安全性、准确性。
					7.3 本小程序不保证外部链接的准确性和完整行。
					7.4 对于不可抗力造成的网络服务中断或其它缺陷，本工作室不承担任何责任，但将尽力减少因此给用户造成的损失和影响。
					7.5 对本工作室提供的产品缺陷及七引发的任何损失，本工作室无需承担任何责任。
						（1）想用户免费提供各项网络服务；
						（2）想用户赠送的任何产品或服务；
						（3）向付费用户附赠的各种产品或者服务。
					7.6 本工作室有权任何时间暂时或永久修改或终止本服务（或其任何部分），而无论其通知与否，本工作室对用户和任何第三人均无需承担任何责任。
					</text>
	            </scroll-view>
	            <view class="cu-tabbar-height"></view>
	        </view>
	    </uni-popup>
	</view>
</template>

<script>
    import { mapState, mapMutations} from 'vuex';
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    // #endif
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	

    export default {
        name: "my",
		components:{
		    "uni-popup":uniPopup
		},
        data() {
            return {
				agree:0,//0：不同意 1: 同意 用户协议、隐私政策
                bizCard:{accounts:[]},//企业名片
                managedCode:'',//管理码
                sysAdminCode:'',//系统管理员密码
                modalName: null,//模态框名称
                accountSum:{
                    newMsgNum:0,
                    wishOrderNum:0,
                    totalOrderNum:0
                },
                currentAction:{},
				//控制弹窗显示与隐藏
				isUps:false,
            };
        },

        onShow(){
            let that =this;
            that.needWxAuth();
            if(!that.user._id){
                return;
            }
            that.getAccountSum();
            that.getServiceList();
        },

        computed:{
            ...mapState(['needAuthFlag','httpPath']),
            user:{
                get(){
                    return this.$store.state.user;
                },
                set(v){
                    this.$store.commit('updateUser',v);
                }
            },
            checkRole(){
                return function (user,needRole) {
                    let userInfo = user.userInfo||{role:'normal'};
                    let currentRole = userInfo.role.trim().toLowerCase();
                    let currentNeedRole = needRole||'';
                    currentNeedRole = currentNeedRole.trim().toLowerCase();
					let flag = currentRole.indexOf(currentNeedRole)>-1;
                    // console.log(flag,'currentRole',currentRole,'currentNeedRole',currentNeedRole);
                    return flag;
                }
            }
        },
        methods: {
            ...mapMutations(['needWxAuth','wxAuth','updateUser']),

			async doAuth(){
                let that = this;
				if(that.agree==0){
					wx.showToast({
					    title: '请先阅读并同意用户协议与隐私政策',
						icon: 'none',
					});
					return;
				}
                if(that.needAuthFlag){
                    that.wxAuth();
                    setTimeout (() => {
                        that.doAuth();
                    } , 2000 );
                    return;
                }
                that.getAccountSum();
                that.getServiceList();
                that.$forceUpdate();
            },

			goMyCard(){
				uni.navigateTo({
				    "url":"/pagesSys/card/CardDetail"
				})
			},
			
			async showAnotations(){
                let that = this;
            },

            goWebLogin(){
                uni.navigateTo({
                    "url":"/pages/my/WebLogin"
                })
            },

            hideLoginModal(e) {
                this.modalName = null
            },

            goMsgList(){
                let that = this;
                if(that.needAuthFlag){
                    that.wxAuth(that.authBizInfo);
                    return;
                }
                uni.navigateTo({
                    "url":"/pagesSys/my/MsgList"
                })
            },

            async getAccountSum(){
                let that = this;
                let res = null;
                        if(that.needAuthFlag){
                            that.wxAuth(that.authBizInfo);
                            return;
                        }
                        // #ifdef MP-WEIXIN
                res = await wx.cloud.callFunction({
                            name:'cmn',
                            data:{
                                $url:'getSum',
                                userId:that.user._id,
                                sourceId:that.user.userInfo.cardId,
                                targetId: that.user.userInfo.bizCardId,
                            }
                        });
                        if(res.result.code==0){
                            that.accountSum = res.result.data;
                        }
                        // #endif
                        // #ifdef H5
                res = await cloudbase.callFunction({
                            name:'web',
                            data:{
                                $url:'getSum',
                                userId:that.user._id,
                                sourceId:that.user.userInfo.cardId,
                                targetId: that.user.userInfo.bizCardId,
                            }
                        });
                that.accountSum = JSON.parse(res.result.data);
                // #endif
            },

            goWishOrderList(){
                let that = this;
                if(that.needAuthFlag){
                    that.wxAuth(that.authBizInfo);
                    return;
                }
                uni.navigateTo({
                    "url":"/pagesSys/my/WishOrderList"
                })
            },

            goTotalOrderList(){
                let that = this;
                if(that.needAuthFlag){
                    that.wxAuth(that.authBizInfo);
                    return;
                }
                uni.navigateTo({
                    "url":"/pagesSys/my/TotalOrderList"
                })
            },

			async getServiceList(){
                let that = this;
                let res = null;
                console.log('getCardDetailById',that.user.userInfo.bizCardId,'that.user._id',that.user._id);
				// #ifdef MP-WEIXIN
                res = await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'getCardDetailById',
                        id:that.user.userInfo.bizCardId
                    }
                });
                that.bizCard = res.result.data;
                res = await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'getUserDetail',
                        id:that.user._id||'0'
                    }
                });
                //更新user的缓存信息
                that.user=res.result.data;
                // #endif
                // #ifdef H5
				res = await cloudbase.callFunction({
                    name:'web',
                    data:{
                        $url:'getCardDetailById',
                        id:that.user.userInfo.bizCardId
                    }
                });
                that.bizCard = JSON.parse(res.result.data);
                res = await cloudbase.callFunction({
                    name:'web',
                    data:{
                        $url:'getUserDetail',
                        id:that.user._id
                    }
                });
                //更新user的缓存信息
                that.user=JSON.parse(res.result.data);
                // #endif
                //更新user的缓存信息
                that.updateUser(that.user);
                let accounts = that.user.userInfo.accounts||[];
                if(accounts.length>0){
                    for(let i in that.bizCard.accounts){
                        let cardAccountKey = that.bizCard.accounts[i].account_key;
                        for(let j in accounts){
                            let userAccountKey = accounts[j].account_key;
                            if(cardAccountKey==userAccountKey){
                                that.bizCard.accounts[i]=accounts[j];
                                break;
                            }
                        }
                    }
                }
			},

            hideManagedCodeModal(e) {
                this.modalName = null
            },

            //确认商务管理码
            async confirmManagedCode(){
                let that = this;
                // console.log('managedCode',that.managedCode);
                if(that.managedCode.length==0){
                    uni.showToast({
                        icon:'none',
                        title:'请输入管理码'
                    });
                    return;
                }
                //只能输入数字
                let reg = /^[0-9]*$/;
                if(!reg.test(that.managedCode)){
                    uni.showToast({
                        icon:'none',
                        title:'只能输入数字'
                    });
                    return;
                }

                //访问公司名片，验证授权码
                let res = await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'getCardDetailById',
                        id:that.user.userInfo.bizCardId,//对应公司名片ID，后台定义死
                    }
                });
                if(that.managedCode!=res.result.data.password.card_admin){
                    uni.showToast({
                        icon:'none',
                        title:'授权码错误'
                    });
                    return;
                }
                if(!that.user.userInfo.password){
                    that.user.userInfo.password={card_admin:''};
                }
                that.user.userInfo.password.card_admin=that.managedCode;
                that.updateUser(that.user);
                await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'updateUserInfo',
                        id:that.user._id,
                        userInfo:that.user.userInfo
                    }
                });
                that.modalName = null;
                // #ifdef MP-WEIXIN
                that.navigateTo(that.currentAction.url,that.currentAction.title);
                // #endif
                // #ifdef H5
                if(action.support_h5){
                    that.navigateTo(that.currentAction.h5_link,that.currentAction.title);
                }else{
                    uni.showToast({
                        icon:'none',
                        title:'请使用小程序打开'
                    })
                }
                // #endif
            },

            hideSysAdminCodeModal(e) {
                this.modalName = null
            },

            //确认系统管理员密码
            async confirmSysAdminCode(){
                let that = this;
                // console.log('sysAdminCode',that.sysAdminCode)
                if(that.sysAdminCode.length==0){
                    uni.showToast({
                        icon:'none',
                        title:'请输入系统密码'
                    });
                    return;
                }
                //只能输入数字
                let reg = /^[0-9]*$/;
                if(!reg.test(that.sysAdminCode)){
                    uni.showToast({
                        icon:'none',
                        title:'只能输入数字'
                    });
                    return;
                }
                //访问公司名片，验证授权码
                let res = await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'getCardDetailById',
                        id:that.user.userInfo.bizCardId,//对应公司名片ID，后台定义死
                    }
                });
                if(that.sysAdminCode!=res.result.data.password.sys_admin){
                    uni.showToast({
                        icon:'none',
                        title:'授权码错误'
                    });
                    return;
                }
                if(!that.user.userInfo.password){
                    that.user.userInfo.password={sys_admin:''};
                }
                that.user.userInfo.password.sys_admin= that.sysAdminCode;
                that.updateUser(that.user);
                await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'updateUserInfo',
                        id:that.user._id,
                        userInfo:that.user.userInfo
                    }
                });
                that.modalName = null;
                // #ifdef MP-WEIXIN
                that.navigateTo(that.currentAction.url,that.currentAction.title);
                // #endif
                // #ifdef H5
                if(action.support_h5){
                    that.navigateTo(that.currentAction.h5_link,that.currentAction.title);
                }else{
                    uni.showToast({
                        icon:'none',
                        title:'请使用小程序打开'
                    })
                }
                // #endif
            },

            searchAction(e) {
                let that = this;
                let key = e.detail.value.toLowerCase();
                for (let i = 0; i < that.bizCard.accounts.length; i++) {
                    let a = key;
                    let b = that.bizCard.accounts[i].title.toLowerCase();
                    that.bizCard.accounts[i].is_show = b.search(a) != -1
                }
            },

            async go(action){
                let that = this;
                if(that.needAuthFlag){
                    that.wxAuth(that.authBizInfo);
                    return;
                }
                if(action.url.length==0){
                    uni.showToast({
                        icon:'none',
                        title:action.title+'暂未开放！'
                    });
                    return;
                }
                that.currentAction = action;
                that.modalName = '';
                console.log('modalName',that.modalName,'action',action,'role',that.user.userInfo.role);

                //用户账号判断
                if(that.user.userInfo.role){
                    if(action.is_forbidden){
                        //====start 角色用于支持微信平台审批需求=====
                        // 企业名片管理权限
                     	if(action.need_role=='cardAdmin'){
                            // 权限不够时
                            if(that.user.userInfo.role.indexOf('cardAdmin')==-1){
                                //取历史密码验证
                                if(that.user.userInfo.password){
                                    let res = {};
                                    let cardAdmin ='';
                                    // #ifdef MP-WEIXIN
                                    //访问公司名片，验证授权码
                                    res = await wx.cloud.callFunction({
                                        name:'sys',
                                        data:{
                                            $url:'getCardDetailById',
                                            id:that.user.userInfo.bizCardId,//对应公司名片ID，后台定义死
                                        }
                                    });
                                    cardAdmin = res.result.data.password.card_admin;
                                    // #endif
                                    // #ifdef H5
                                    res = await cloudbase.callFunction({
                                        name:'web',
                                        data:{
                                            $url:'getCardDetailById',
                                            id:that.user.userInfo.bizCardId,//对应公司名片ID，后台定义死
                                        }
                                    });
                                    cardAdmin = JSON.parse(res.result.data).password.card_admin;
                                    // #endif
                                    let password = that.user.userInfo.password||{card_admin:''};
                                    if(password.card_admin != cardAdmin){
                                        uni.showToast({
                                            icon:'none',
                                            title:'授权码已失效'
                                        })
                                    }
                                    //免密自动进入
                                    else{
                                        // #ifdef MP-WEIXIN
                                        that.navigateTo(action.url,action.title);
                                        // #endif
                                        // #ifdef H5
                                        if(action.support_h5){
                                            that.navigateTo(action.h5_link,action.title);
                                        }else{
                                            uni.showToast({
                                                icon:'none',
                                                title:'请使用小程序打开'
                                            })
                                        }
                                        // #endif
                                        return;
                                    }
                                }
                                //弹出授权对话框
                                that.modalName ='ManagedCodeModal';
                                return;
                            }
                        }
                        // 系统管理权限
                        else if(action.need_role=='sysAdmin'){
                            // 权限不够时
                            if(that.user.userInfo.role.indexOf('sysAdmin')==-1){
                                //取历史密码验证
                                if(that.user.userInfo.password){
                                    let res = {};
                                    let sysAdmin ='';
                                    // #ifdef MP-WEIXIN
                                    //访问公司名片，验证授权码
                                    res = await wx.cloud.callFunction({
                                        name:'sys',
                                        data:{
                                            $url:'getCardDetailById',
                                            id:that.user.userInfo.bizCardId,//对应公司名片ID，后台定义死
                                        }
                                    });
                                    sysAdmin = res.result.data.password.sys_admin;
                                    // #endif
                                    // #ifdef H5
                                    res = await cloudbase.callFunction({
                                        name:'web',
                                        data:{
                                            $url:'getCardDetailById',
                                            id:that.user.userInfo.bizCardId,//对应公司名片ID，后台定义死
                                        }
                                    });
                                    sysAdmin = JSON.parse(res.result.data).password.sys_admin;
                                    // #endif
                                    let password = that.user.userInfo.password||{sys_admin:''};
                                    // console.log('password',password.sys_admin,sysAdmin);
                                    if(password.sys_admin != sysAdmin){
                                        uni.showToast({
                                            icon:'none',
                                            title:'密码已失效'
                                        })
                                    }
                                    //免密自动进入
                                    else{
                                        // #ifdef MP-WEIXIN
                                        that.navigateTo(action.url,action.title);
                                        // #endif
                                        // #ifdef H5
                                        if(action.support_h5){
                                            that.navigateTo(action.h5_link,action.title);
                                        }else{
                                            uni.showToast({
                                                icon:'none',
                                                title:'请使用小程序打开'
                                            })
                                        }
                                        // #endif
                                        return;
                                    }
                                }
                                //弹出授权对话框
                                that.modalName ='SysAdminCodeModal';
                                return;
                            }
                        }
                        //====end  角色用于支持微信平台审批需求=====
                    }
                    let canVisit =false;
                    for(let i in that.user.userInfo.accounts){
                        let account = that.user.userInfo.accounts[i];
                        if(account.account_key==action.account_key){
                            account.view_count +=1;
                            that.updateUser(that.user);
                            // #ifdef MP-WEIXIN
                            await wx.cloud.callFunction({
                                name:'sys',
                                data:{
                                    $url:'updateUserInfo',
                                    id:that.user._id,
                                    userInfo:that.user.userInfo
                                }
                            });
                            // #endif
                            // #ifdef H5
                            await cloudbase.callFunction({
                                name:'sys',
                                data:{
                                    $url:'updateUserInfo',
                                    id:that.user._id,
                                    userInfo:that.user.userInfo
                                }
                            });
                            // #endif
                            canVisit = true;
                            // #ifdef MP-WEIXIN
                            that.navigateTo(action.url,action.title);
                            // #endif
                            // #ifdef H5
                            if(action.support_h5){
                                that.navigateTo(action.h5_link,action.title);
                            }else{
                                uni.showToast({
                                    icon:'none',
                                    title:'请使用小程序打开'
                                })
                            }
                            // #endif
                            break;
                        }
                    }
                    if(canVisit){
                        return;
                    }
                }
				// normal用户没有功能权限
				else{
					console.log('normal用户没有功能权限');
					uni.showToast({
					    icon:'none',
					    title:'请先申请'+action.title+'权限！'
					});
					return;
				}

                // #ifdef MP-WEIXIN
                that.navigateTo(action.url,action.title);
                // #endif
                // #ifdef H5
                if(action.support_h5){
                    that.navigateTo(action.h5_link,action.title);
                }else{
                    uni.showToast({
                        icon:'none',
                        title:'请使用小程序打开'
                    })
                }
                // #endif
            },

            navigateTo(url,title){
                if(url=='navigateToMiniProgram'){
                    wx.navigateToMiniProgram({
                        appId: 'wx57628b80a1d8f511',//创智良仓物业管理
                        path: '/pages/MainLogin',
                        extraData: {
                        },
                        success(res) {
                            console.log("开启成功")
                        }
                    })
                }else{
					uni.navigateTo({ "url": url+'?title='+title,})	
                }
            },
			setAgree(e){
				this.agree = e.detail.value
				console.log('agree:'+this.agree);
			},
			popupContract(){
			    let that = this;
			    console.log('popupContract');
			    that.isUps = true;
			    this.$nextTick(() => {
			        that.$refs['showPopupContract'].open()
			    })
			},
			change(e){
			    if(e.show){
			        this.isUps = true;
			    }else{
			        this.isUps =false;
			    }
			},
			
			cancel(type){
			    this.$refs['show' + type].close()
			}

        },
    }
</script>

<style>
	.UCenter-bg {
		background-color: grey.light;
		background-size: cover;
		height: 450rpx;
		display: flex;
		justify-content: center;
		padding-top: 40rpx;
		overflow: hidden;
		position: relative;
		flex-direction: column;
		align-items: center;
		color: grey;
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

<style lang="scss" scoped>
    .page{
        z-index: 0;
        height: 100vh;
    }
    /* 起到固定的作用 ,从而解决原页面触摸穿透的问题*/
    .prevent {
        width: 100%;
        height: 100%;
        /*自动回到顶部*/
        position: fixed;
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
        z-index: 98;
    }
    /* 底部分享 */
    .popup-base {
        display: flex;
        flex-direction: column;
        height: 1050rpx;
        padding-bottom:62px;
        position: fixed;
        left:0;
        bottom: 0;
        width:100%;
        border-top-left-radius: 3%;
        border-top-right-radius: 3%;
        z-index: 99;
    }

    .popup-base scroll-view{
        height:950rpx;
    }

    .popup-close {
        position:absolute;
        top:30rpx;
        left:30rpx;
        font-size: 39rpx;
        text-align: center;
        font-weight: bold;
        z-index: 99;
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
        padding: 20rpx;
        max-height: 950rpx;
    }
</style>