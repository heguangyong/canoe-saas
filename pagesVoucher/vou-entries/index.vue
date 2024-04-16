<!--
用于管理所有线下入口生成的二维码
-->
<template>
    <view>
        <cu-custom    :isBack="true">
            <block slot="content">核销管理</block>
            <block slot="right">
                <view class="action">
                    <view class="cu-load load-cuIcon" :class="isLoad?'loading':'over'"></view>
                </view>
            </block>
        </cu-custom>

        <scroll-view scroll-y class="quan">
            <view class="flex card bg-white"  v-for="(item,index) in list" :key="item" @tap="goDetail(item)"  @longpress="popupOperate(item)">
                <view class="quan-text">
                    <view class="font50 cuIcon-move font-bold" ></view>
                    <view class="content">
                        <view class="text-grey text-xl">{{item.name}}
                            <text class="text-abc"></text>
                        </view>
                        <view class="text-gray text-sm">当前入口{{item.usable?'开放':'关闭'}}</view>
                    </view>
                </view>
                <view class="rel quan-right">
                    <view class="grid text-center col-1">
                        <view class="abs quan-icon-icon text-grey">
                            <text class="text-abc " :class="item.usable?' cuIcon-pullright':' cuIcon-roundclose'"></text>
                        </view>

                    </view>
                </view>
            </view>
            <!--页面底部抬升-->
            ﻿<view class="cu-tabbar-height"></view>
        </scroll-view>

        <view v-if="!isUps" class="cu-bar bg-white tabbar border shop foot">
            <button class="action" @tap="goHome">
                <view class="cuIcon-home"></view>首页
            </button>
            <button class="action" @tap="goBizCard" >
                <view class="cuIcon-global"></view>站点
            </button>
            <view class="action" @tap="goBizPortal">
                <view class="cuIcon-apps"></view>后台
            </view>
            <view v-if="checkCardAdminRole(corpUser.role)" class="bg-red submit text-lg" @tap="goAdd">创建入口</view>
            <view v-else class=" submit text-lg"></view>
        </view>

        <!-- 底部扩展功能弹窗 -->
        <uni-popup ref="showPopupOperate" type="bottom" @change="change">
            <view class="card-popup bg-white">
                <view v-if="checkCardAdminRole(corpUser.role)" class="card-popup-content"  @click="doSwitch">
                    <text class="remove-popup-btn" >{{checkUsable(currentEntry.usable)}}</text>
                </view>
                <view v-if="checkCardAdminRole(corpUser.role)" class="card-popup-content" style="border-top: 1rpx solid #ddd;"  @click="goEdit">
                    <text class="remove-popup-btn" >编辑</text>
                </view>
                <view v-if="checkCardAdminRole(corpUser.role)" class="card-popup-content" style="border-top: 1rpx solid #ddd;" @click="doRemove">
                    <text class="remove-popup-btn" >删除</text>
                </view>
                <text class="card-popup-btn" @click="cancel('PopupOperate')">取消</text>
            </view>
        </uni-popup>


        <!-- 底部新增或编辑弹窗 -->
        <uni-popup ref="showPopupForm" type="bottom" @change="change">
            <view class="card-popup bg-white">
                <view class="card-popup-content">
                    <view class="cu-form-group">
                        <view class="title">入口名称</view>
                        <text class='cuIcon-titles text-xs text-pink-light'></text>
                        <input placeholder="如一号门出口核销" v-model="currentEntry.name"></input>
                        <view>
                            <buttom class="cu-btn margin-left round line-grey" @tap="doSave">保存</buttom>
                        </view>
                    </view>
                </view>
                <text class="card-popup-btn" @click="cancel('PopupOperate')">取消</text>
            </view>
        </uni-popup>
    </view>
</template>

<script>
    import {mapState,mapMutations} from 'vuex';

    export default {
        components: {
        },
        data() {
            return {
                isLoad:false,
                cardId:'',
                cardName:'',
                list:[],
                page: 1,
                isEndPage:false,//最后一页
                loadingType: 1,//上拉的状态：0-loading前；1-loading中；2-没有更多了
                isUps:false,
                selectedId:'-1',//选中卡券ID
                currentEntry:{name:'',usable:false}//选中的入口（或者新增的入口）
            }
        },

        onLoad(options){
           if(options.cardId && options.cardName) {
               this.cardId = options.cardId;
               this.cardName = options.cardName;
               this.getList();
           }
        },

        onPullDownRefresh() {
            this.page=1
            this.getList();
            uni.stopPullDownRefresh(); // 停止刷新
        },

        onReachBottom() {
            this.page++;
            this.getList();
        },

        computed: {
            ...mapState(['corpUser']),
            checkUsable(){
                return function(isUsable){
                    return isUsable?'暂停':'启用';
                }
            },
            checkCardAdminRole(){
                return function (role) {
                    let currentRole = role||'';
                    console.log('currentRole',currentRole);
                    return currentRole.indexOf('cardAdmin')>-1;
                }
            }
        },

        methods: {
            async getList() {
                let that = this;
                this.isLoad=true;
                that.loadingType = 1;
                let res = await wx.cloud.callFunction({
                    name:'vou-entries',
                    data:{
                        $url:'getList',
                        cardId: that.cardId,
                        page:that.page,
                        pageSize:10,
                    }
                });
                console.log('getList',res.result);
                let result=res.result;
                if (result.code == 0) {
                    if (that.page == 1) {
                        that.isEndPage = false;
                        that.list = [];
                    }
                    that.list = result.data;
                }
                //后面没数据了
                if(result.data.length<10){
                    that.isEndPage = true;
                    that.loadingType = 2;
                }
                that.isLoad=false;
            },

            goDetail(item){
                let that = this;
                console.log('goDetail',item);
                uni.navigateTo({
                    "url": "/pagesVoucher/vou-entries/WriteOffList?entryId=" + item._id+"&entryName="+item.name,
                })
            },

            goAdd(){
                let that = this;
                console.log('goAdd');
                that.$nextTick(() => {
                    that.$refs['showPopupForm'].open()
                });
            },

            goEdit() {
                let that = this;
                console.log('goEdit', that.currentEntry);
                that.$refs['showPopupOperate'].close();
                that.$nextTick(() => {
                    that.$refs['showPopupForm'].open();
                });
            },

            async doSwitch(){
                let that = this;
                that.currentEntry.usable=!that.currentEntry.usable;
                console.log('doSwitch',that.currentEntry);
                let res = await wx.cloud.callFunction({
                    name:'vou-entries',
                    data:{
                        $url:'save',
                        entry:that.currentEntry
                    }
                });
                uni.showToast({ icon:'success',title:'保存成功'});
                that.$refs['showPopupOperate'].close();
                that.getList();
            },

            async getCardAvatar(cardId){
                let that = this;
                that.isLoad = true;
                if(cardId){
                    let res = await wx.cloud.callFunction({
                        name:'crm-cards',
                        data:{
                            $url:'getDetailById',
                            id:cardId||'0',
                        }
                    });
                    console.log('getCardAvatar',res);
                    if(res.result.code==0){
                        let card = res.result.data;
                        that.currentEntry.avatar= card.avatar;
                        that.$forceUpdate();
                    }
                }
            },

            async doSave(){
                let that = this;
                that.getCardAvatar(that.cardId);
                that.currentEntry.card_id=that.cardId;
                that.currentEntry.card_name=that.cardName;
                console.log('save currentEntry',that.currentEntry);
                let res = await wx.cloud.callFunction({
                    name:'vou-entries',
                    data:{
                        $url:'save',
                        entry:that.currentEntry
                    }
                });

                uni.showToast({ icon:'success',title:'保存成功'});
                console.log('vou-entries save',res.result);
                if(res.result.code == 0){
                    //新建时返回_id
                    if(!that.currentEntry._id){
                        that.currentEntry._id=res.result.data;
                    }
                    that.currentEntry.number= that.currentEntry._id.substr(1,24);
                    let res2 = await wx.cloud.callFunction({
                        name:'vou-entries',
                        data:{
                            $url:'genQrCode',
                            id:that.currentEntry._id,
                            number:that.currentEntry.number
                        }
                    });
                    console.log('生成二维码',res2);
                    //二维码中合入公司logo

                }
                that.$refs['showPopupForm'].close();
                that.getList();
            },

            popupOperate(item){
                let that = this;
                if(that.corpUser.role.indexOf('cardAdmin')<0){return}
                console.log('popupOperate',item);
                that.selectedId = item._id;
                that.currentEntry = item;
                that.$nextTick(() => {
                    that.$refs['showPopupOperate'].open()
                });
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
            },

            //删除
            async doRemove(){
                let that = this;
                console.log('go remove entry', that.selectedId);
                await wx.cloud.callFunction({
                    name:'vou-entries',
                    data:{
                        $url:'remove',
                        id:that.selectedId
                    }
                });

                uni.showToast({ icon:'success',title:'删除成功'});
                that.getList();
                that.$refs['showPopupOperate'].close();
            },
            goHome(){
                uni.reLaunch({
                    url: '/pages/sys-account/index',
                })
            },
            goBizCard(){
                uni.navigateTo({
                    "url":"/pagesBiz/biz-card/index"
                })
            },
            goBizPortal(){
                uni.navigateTo({
                    "url": "/pagesBiz/biz-card/BizPortal?id=" + this.cardId+'&name='+this.cardName,
                })
            },

        }
    }
</script>

<style>
    .card-radius {
        border-radius: 10upx;
    }

    ﻿/* 底部分享 */
    .card-popup {
        /* #ifndef APP-NVUE */
        display: flex;
        flex-direction: column;
        /* #endif */
        border-top-left-radius: 3%;
        border-top-right-radius: 3%;
    }

    .card-popup-content {
        /* #ifndef APP-NVUE */
        display: flex;
        /* #endif */
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        padding: 5px;
        max-height: 850rpx;
    }

    .card-popup-btn {
        height: 90rpx;
        line-height: 90rpx;
        font-size: 14px;
        border-top-color: #DADADA;
        border-top-width: 1px;
        border-top-style: solid;
        text-align: center;
        color: #666;
    }

    .remove-popup-btn {
        height: 90rpx;
        line-height: 90rpx;
        font-size: 14px;
        text-align: center;
        color: #666;
    }

    .quan{
        padding: 0 20rpx;
        z-index: 0;
    }
    .font50{
        font-size: 50rpx;
    }
    .card{
        margin-top: 20rpx;
        width: 100%;
        border-radius: 20rpx;
        padding: 5rpx 30rpx;
        height: 170rpx;
    }
    .font32{
        font-size: 32rpx;
    }
    .line35{
        line-height: 50rpx;
    }
    .font-bold{
        font-weight: bolder;
    }
    .quan-text{
        width: 640rpx;
    }
    .quan-right{
        width: 200rpx;
    }
    .quan-icon{
        width: 100rpx;
        height: 100rpx;
        background-color: #ffffff;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    .quan-icon-icon{
        font-size: 60rpx;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
</style>
