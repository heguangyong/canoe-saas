<template>
    <view class="" :class="isUps == true ? 'prevent' : ''">
        <cu-custom>
            <block slot="content">名片详情</block>
        </cu-custom>
        <ups-card :card="card">
        </ups-card>
        <view class="margin-sm">
            <scroll-view scroll-y class="radius bg-white">
                <view class="padding-xs text-center">
                    <view class="solid-bottom text-lg padding-xs">
                        <text class="text-grey">最 新 动 态</text>
                    </view>
                </view>
                <view  class="content padding-sm" @click.stop="doAuth()">
                    <ups-waterfalls ref="upsWaterfalls" :list="trendList"  goType="DETAIL">
                        <view v-for="(item, index) of trendList" :key="index" slot="slot{{index}}">
                            <view class="cnt" >
                                <view class="title">{{ item.title }}</view>
                            </view>
                        </view>
                    </ups-waterfalls>
                </view>
            </scroll-view>
            <view class="cu-tabbar-height"></view>
            <view class="cu-tabbar-height"></view>
        </view>
        <view v-if="!isUps" class="cu-bar bg-white tabbar border shop foot">
            <button class="action" @tap="goHome">
                <view class="cuIcon-home"></view>首页
            </button>
            <!--  #ifdef MP-WEIXIN -->
            <button class="action" open-type="share" >
                <view class="cuIcon-share"></view> 分享
            </button>
            <!--  #endif -->
            <view v-if="canTalk()" class="action" @tap="startTalk">
                <view class="cuIcon-message"></view>咨询
            </view>
            <view class="submit" @tap="popupAbout">
                <text class="text-lg text-grey">关于我</text>
            </view>
        </view>

        <!--遮罩-->
        <view class="shade" v-if="isUps"></view>
        <!--底部企业简介弹窗-->
        <uni-popup ref="showPopupAbout" type="bottom" @change="change">
            <view class="popup-base bg-white">
                <text class="cuIcon-close popup-close" @click="cancel('PopupAbout')"></text>
                <text class="popup-title" >关于我</text>
                <view class="popup-content">
                    <text class="text-box padding-sm text-df" scroll-y="true">{{card.introduce}}</text>
                </view>
                <view class="cu-tabbar-height"></view>
            </view>
        </uni-popup>
    </view>
</template>

<script>

    import { mapState,mapMutations } from 'vuex'
    import upsCard from '@/components/ups-card/index.vue'
    import upsWaterfalls from '@/components/ups-waterfalls/index.vue'
    import uniPopup from '@/components/uni-popup/uni-popup.vue'
    import uniRate from '@/components/uni-rate/uni-rate.vue'
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    // #endif

    export default {
        components:{
            'ups-card':upsCard,
            'ups-waterfalls':upsWaterfalls,
            "uni-popup":uniPopup
        },
        data() {
            return {
                card:{_id:'',qrcode:''},
                cardUser:{},
                trendList:[],
                page:1,
                //控制弹窗显示与隐藏
                isUps:false,
                authBizInfo:{}
            }
        },
        onLoad: function (options) {
            let that = this;
            // console.log('options',options);
            //从名片夹进入参数
            if (options.id) {
                that.card._id=options.id;
                that.getDetailById();
            }
            //展台进入 user_id
            else if (options.userId) {
                that.userId=options.userId;
                that.getDetailByUserId();
            }
            //扫码加好友
            else if (options.scene) {
                let res = {};
                let params = decodeURIComponent(options.scene).split("&");
                params.forEach(item => {
                    let paramMap = item.split("=");
                    res[paramMap[0]] = paramMap[1];
                    if(paramMap[0]=='qrcode'){
                        that.card.qrcode=paramMap[1];
                    }
                });
                that.getDetailByQrcode();
            }
        },
		onShareAppMessage(res){
			if(res.from==='button'){
			}
			return{
				title:'这是'+this.card.name+'的名片，请惠存。',
                imageUrl:this.card.cover||'',
				path:"/pagesSys/card/ShareCardDetail?id="+this.card._id,
				success:function(res){
				}
			}
		},
        computed:{
            ...mapState(['needAuthFlag','user','cardAccount']),
		    canTalk(){
		        return function () {
					let userInfo = this.user.userInfo||{cardId:''};
					let cardId = this.card._id;
					//分享时默认用户没有名片，不能交谈|| 是自己不交谈
					return ((cardId.length>0) && (userInfo.cardId!=cardId));
		        }
		    }
		},
		
        methods: {
            ...mapMutations(['needWxAuth','wxAuth','updateUser','updateUserAuth']),


            async getDetailById(){
                let that = this;
                let res = {};
                // #ifdef MP-WEIXIN
                res = await wx.cloud.callFunction({
                    name: 'sys',
                    data: {
                        $url: 'getCardDetailById',
                        id: that.card._id,
                    }
                });
                that.card = res.result.data;
                // #endif
                // #ifdef H5
                res = await cloudbase.callFunction({
                    name: 'web',
                    data: {
                        $url: 'getCardDetailById',
                        id: that.card._id,
                    }
                });
                that.card = JSON.parse(res.result.data);
                // #endif
                that.initTrendList(that.card);
            },

            async getDetailByUserId(){
                let that = this;
                let res = {};
                // #ifdef MP-WEIXIN
                res = await wx.cloud.callFunction({
                    name: 'sys',
                    data: {
                        $url: 'getCardDetailByUserId',
                        userId: that.userId,
                    }
                });
                that.card = res.result.data;
                // #endif
                // #ifdef H5
                res = await cloudbase.callFunction({
                    name: 'web',
                    data: {
                        $url: 'getCardDetailByUserId',
                        userId: that.userId,
                    }
                });
                that.card = JSON.parse(res.result.data);
                // #endif
                that.initTrendList(that.card);
            },
            async getDetailByQrcode(){
                let that = this;
                let res = {};
                // #ifdef MP-WEIXIN
                res =await wx.cloud.callFunction({
                    name: 'sys',
                    data: {
                        $url: 'getCardDetailByQrcode',
                        qrcode: that.card.qrcode,
                    }
                });
                that.card = res.result.data;
                // #endif
                // #ifdef H5
                res =await cloudbase.callFunction({
                    name: 'web',
                    data: {
                        $url: 'getCardDetailByQrcode',
                        qrcode: that.card.qrcode,
                    }
                });
                that.card = JSON.parse(res.result.data);
                // #endif
                that.initTrendList(that.card);
            },

            async initTrendList(card){
                let that = this;
                console.log('card',card);
                let res = await wx.cloud.callFunction({
                    name: 'sys',
                    data: {
                        $url: 'getUserDetail',
                        id: card.user_id,
                    }
                });
                console.log('cardUser',res);
                that.cardUser = res.result.data;
                let dataList = [];
                if (that.page == 1) {
                    that.trendList=[]
                }
                res = await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'getTrendListByCardId',
                        cardId:that.cardUser.userInfo.bizCardId,
                        page:that.page,
                    }
                });
                dataList=res.result.data;
                //根据动态获取企业名片
                let trend = dataList[0];
                that.authBizInfo = {_id:trend.card_id,name:trend.name,avatar:trend.avatar};
                that.needWxAuth(that.authBizInfo);
                dataList.forEach(each => {
                    that.trendList.push(
                        {
                            id:each._id,
                            image_url:each.cover,
                            title:each.title||'',
                            carousels:each.carousels||[],
                            needAuthFlag:that.needAuthFlag
                        });
                })
            },

            async doAuth(){
                let that = this;
                if(that.needAuthFlag){
                    that.wxAuth(that.authBizInfo);
                    setTimeout (() => {
                        that.doAuth();
                    } , 2000 );
                    return;
                }
                that.updateUserAuth(that.authBizInfo);
                //刷新状态
                that.trendList.forEach(trend=>{
                    trend.needAuthFlag=false;
                });
                that.$forceUpdate();
            },

            async getTrendList(){
                let that = this;
                let dataList = [];
                let res = null;
                if (that.page == 1) {
                    that.trendList=[]
                }
                res = await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'getTrendListByCardId',
                        cardId:that.cardUser.userInfo.bizCardId,
                        page:that.page,
                    }
                });
                dataList=res.result.data;
                dataList.forEach(each => {
                    that.trendList.push({id:each._id,image_url:each.cover,title:each.title||'',carousels:each.carousels||[],needAuthFlag:that.needAuthFlag});
                })
            },

            onPullDownRefresh() {
                this.page=1;
                this.getTrendList();
                this.trendList = [];
                this.$refs.upsWaterfalls.refresh();
                uni.stopPullDownRefresh(); // 停止刷新
            },
            onReachBottom() {
                this.page++;
                this.getTrendList()
            },

            shareCardDetail(){
                uni.showShareMenu({
                    withShareTicket:true,
                })
            },

            async goHome(){
                let that = this;
                if(that.needAuthFlag){
                    that.wxAuth(that.authBizInfo);
                    setTimeout (() => {
                        that.goHome();
                    } , 2000 );
                    return;
                }
                that.updateUserAuth(that.authBizInfo);
                setTimeout (() => {
                    uni.reLaunch({
                        "url":"/pages/site/trend?id="+that.authBizInfo._id,
                    })
                } , 1000 )
            },

            goQQMap(){
                let that =this;
                wx.openLocation({
                    latitude:that.card.corp_address.latitude,
                    longitude:that.card.corp_address.longitude,
                })
            },
            goWebLogin(){
                uni.navigateTo({
                    "url":"/pages/my/WebLogin"
                })
            },
            //开始聊天
            async startTalk(){
                let that = this;
                if(that.needAuthFlag){
                    that.wxAuth(that.authBizInfo);
                    setTimeout (() => {
                        that.startTalk();
                    } , 2000 );
                    return;
                }
                that.updateUserAuth(that.authBizInfo);
                // #ifdef MP-WEIXIN
                setTimeout (() => {
                    uni.navigateTo({
                        "url":"/pagesSys/site/service?sourceCardId="+that.user.userInfo.cardId+"&targetCardId=" + that.card._id
                    });
                } , 1000 );
                // #endif
                // #ifdef H5
                uni.navigateTo({
                    "url":"/pagesSys/site/WebService?sourceCardId="+that.user.userInfo.cardId+"&targetCardId=" + that.card._id
                })
                // #endif
            },


            popupOperate(){
                let that = this;
                console.log('popupOperate');
                this.$nextTick(() => {
                    that.$refs['showPopupOperate'].open()
                })
            },

            popupAbout(){
                let that = this;
                console.log('popupAbout');
                that.isUps = true;
                this.$nextTick(() => {
                    that.$refs['showPopupAbout'].open()
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

        }
    }
</script>

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
        height: 950rpx;
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
        height:850rpx;
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
        max-height: 850rpx;
    }

    .popup-content-box {
        /* #ifndef APP-NVUE */
        display: flex;
        /* #endif */
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .popup-qrcode-image {
        /* #ifndef APP-NVUE */
        display: flex;
        /* #endif */
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 390rpx;
        height: 500rpx;
        overflow: hidden;
        border-radius: 50rpx;
    }

    .popup-meeting-image {
        /* #ifndef APP-NVUE */
        display: flex;
        /* #endif */
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 500rpx;
        height: 390rpx;
        overflow: hidden;
        border-radius: 50rpx;
    }

    .popup-content-text {
        font-size: 26rpx;
        color: #333;
        padding-top: 5px;
        padding-bottom: 10px;
    }
</style>