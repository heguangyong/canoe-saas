<template>
    <view >
        <cu-custom :isBack="true">
            <block slot="backText">返回</block>
            <block slot="content">{{title}}</block>
        </cu-custom>
        <view class="cu-list menu-avatar no-padding">
            <view class="cu-item  card-radius margin-sm shadow bg-white.light" style="height: 110rpx;"
                  v-for="(account,index) in accounts" :key="index" @tap="viewAccount(account)">
                <view  class="cu-avatar bg-white" >
                    <image class="cu-avatar "><text class="text-grey" :class="'cuIcon-' + account.name" style="font-size: 36px;"></text></image>
                </view>
                <view class="content" >
                    <view class="text-grey">{{account.account_key +' : '}}{{account.title}}
                        <text class="text-abc"></text>
                    </view>
                    <view class="text-gray text-sm text-cut"></view>
                </view>
            </view>
        </view>
        <view class="cu-tabbar-height"></view>
        <view class="cu-tabbar-height"></view>
        <view class="cu-bar bg-white tabbar border shop foot">
            <button class="action" @tap="goMy">
                <view class="cuIcon-my"></view>我的
            </button>
            <!--  #ifdef MP-WEIXIN -->
            <view class="bg-red submit text-lg" @tap="addAccount">新增配置</view>
            <!--  #endif -->
            <!--  #ifdef H5 -->
            <view class="bg-white submit text-lg"></view>
            <!--  #endif -->
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
				title:'',
                card:{},
                accounts:[]//所有系统账号
            }
        },
		onLoad(options){
			this.title=options.title;
		},
        onShow () {
            this.getBizCardDetail();
        },

        computed:{
            ...mapState(['user']),
        },
        methods: {
            async getBizCardDetail(){
                let that = this;
                let res = null;
                // #ifdef MP-WEIXIN
                res= await wx.cloud.callFunction({
                        name: 'sys',
                        data: {
                            $url: 'getCardDetailById',
                            id: that.user.userInfo.bizCardId,
                        }
                    })
                that.card = res.result.data;
                // #endif
                // #ifdef H5
                res= await cloudbase.callFunction({
                    name: 'web',
                    data: {
                        $url: 'getCardDetailById',
                        id: that.user.userInfo.bizCardId,
                    }
                })
                that.card = JSON.parse(res.result.data);
                // #endif
                that.accounts = that.card.accounts||[];
                //排序
                that.accounts.sort(function (a,b) {
                    return (a.account_key -b.account_key)
                });
            },

            async viewAccount(account){

                uni.navigateTo({
                    url:'/pagesMgt/BizServiceDetail?account_key='+account.account_key,
                })
            },

            async addAccount(){
                uni.navigateTo({
                    url:'/pagesMgt/BizServiceInput',
                })
            },

            goMy(){
                uni.reLaunch({
                    url: '/pages/my/home',
                })
            },

        }
    }
</script>

<style lang="scss" scoped>
    .page{
        z-index: 0;
        height: 100vh;
    }
</style>
