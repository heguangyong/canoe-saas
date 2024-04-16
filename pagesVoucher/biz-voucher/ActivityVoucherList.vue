<!--
列出活动对应所有的券
-->
<template>
    <view>
        <cu-custom    :isBack="true">
            <block slot="content">{{activityName}}</block>
            <block slot="right">
                <view class="action">
                    <view class="cu-load load-cuIcon" :class="isLoad?'loading':'over'"></view>
                </view>
            </block>
        </cu-custom>
        <scroll-view scroll-x class="bg-white nav">
            <view class="flex text-center">
                <view class="cu-item flex-sub" :class="index==tabCur?'text-green cur':''" v-for="(item,index) in 3" :key="index" @tap="tabSelect" :data-id="index">
                    {{tab[index]}}
                </view>
            </view>
        </scroll-view>
        <slot v-if="tabCur==0">
            <scroll-view scroll-y class="quan">
                <view class="flex card bg-white"  v-for="(item,index) in toBeUsedVouchers" :key="item" @longpress="popupOperateVoucher(item._id)">
                    <view class="quan-text">
                        <view class="font50 cuIcon-move font-bold" :class="'text-'+item.bg_color"></view>
                        <view class="flex">
                            <view  class="cu-avatar round lg margin-right-sm" @tap="goDetail(item)">
                                <image :src="item.corp_user_avatar" mode="aspectFill" class="cu-avatar round lg"></image>
                            </view>
                            <view class="content">
                                <view class="text-grey text-xl">{{item.corp_user_name}}
                                    <text class="text-abc"></text>
                                </view>
                                <view class="text-gray text-sm">操作时间：{{formatCreateAt(item.create_at)}}</view>
                            </view>
                        </view>
                    </view>
                    <view class="rel quan-right">
                        <view class="margin-top-xl flex justify-center align-center text-gray" >
                            <text class="text-bold text-lg ﻿margin-right-xs">¥</text>
                            <text class="text-bold text-xxl ">{{item.price}}</text>
                        </view>
                        <view class="solid-bottom">
                            <view class='cu-tag round ﻿bg-grey light' >{{item.num_total-item.num_used}} 张可用</view>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </slot>

        <slot v-if="tabCur==1">
            <scroll-view scroll-y class="quan">
                <view class="flex card bg-white"  v-for="(item,index) in usedVouchers" :key="item" @longpress="popupOperateVoucher(item._id)">
                    <view class="quan-text">
                        <view class="font50 cuIcon-move font-bold" :class="'text-'+item.bg_color"></view>
                        <view class="flex">
                            <view  class="cu-avatar round lg margin-right-sm" @tap="goDetail(item)">
                                <image :src="item.corp_user_avatar" mode="aspectFill" class="cu-avatar round lg"></image>
                            </view>
                            <view class="content">
                                <view class="text-grey text-xl">{{item.corp_user_name}}
                                    <text class="text-abc"></text>
                                </view>
                                <view class="text-gray text-sm">操作时间：{{formatCreateAt(item.create_at)}}</view>
                            </view>
                        </view>
                    </view>
                    <view class="rel quan-right">
                        <view class="margin-top-xl flex justify-center align-center text-gray" >
                            <text class="text-bold text-lg ﻿margin-right-xs">¥</text>
                            <text class="text-bold text-xxl ">{{item.price}}</text>
                        </view>
                        <view class="solid-bottom">
                            <view class='cu-tag round ﻿bg-grey light' >已使用{{item.num_used}} 张</view>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </slot>

        <slot v-if="tabCur==2">
            <scroll-view scroll-y class="quan">
                <view class="flex card bg-white"  v-for="(item,index) in expiredVouchers" :key="item" @longpress="popupOperateVoucher(item._id)">
                    <view class="quan-text">
                        <view class="font50 cuIcon-move font-bold" :class="'text-'+item.bg_color"></view>
                        <view class="flex">
                            <view  class="cu-avatar round lg margin-right-sm" @tap="goDetail(item)">
                                <image :src="item.corp_user_avatar" mode="aspectFill" class="cu-avatar round lg"></image>
                            </view>
                            <view class="content">
                                <view class="text-grey text-xl">{{item.corp_user_name}}
                                    <text class="text-abc"></text>
                                </view>
                                <view class="text-gray text-sm">操作时间：{{formatCreateAt(item.create_at)}}</view>
                            </view>
                        </view>
                    </view>
                    <view class="rel quan-right">
                        <view class="margin-top-xl flex justify-center align-center text-gray" >
                            <text class="text-bold text-lg ﻿margin-right-xs">¥</text>
                            <text class="text-bold text-xxl ">{{item.price}}</text>
                        </view>
                        <view class="solid-bottom">
                            <view class='cu-tag round ﻿bg-grey light' >{{item.num_total-item.num_used}}/{{item.num_total}} 张可用</view>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </slot>

        <!-- 底部扩展功能弹窗 -->
        <uni-popup ref="showPopupOperate" type="bottom" @change="change">
            <view class="card-popup bg-white">
                <view class="card-popup-content" @click="removeVoucher">
                    <text class="remove-popup-btn" >删除</text>
                </view>
                <text class="card-popup-btn" @click="cancel('PopupOperate')">取消</text>
            </view>
        </uni-popup>
        <slot v-if="!isUps">
            <!--页面底部抬升-->
            ﻿<view class="cu-bar solid-bottom margin-top-xxs radius"></view>
            <!-- 底部操作菜单 -->
            <view class="cu-bar btn-group   foot bg-white">
                <button class="cu-btn   shadow-blur"   :disabled="isLoad" @click="goHome">去首页</button>
            </view>
        </slot>
    </view>
</template>

<script>
    import {mapState,mapMutations} from 'vuex'
    import cmnUtils from '@/utils/cmnUtils.js'

    export default {
        components: {
        },
        data() {
            return {
                isLoad:false,
                activityId:'',
                activityName:'',
                tabCur: 0,
                tab:['待使用','已使用','已无效'],
                toBeUsedVouchers:[],
                usedVouchers:[],
                expiredVouchers:[],
                page: 1,
                isEndPage:false,//最后一页
                loadingType: 1,//上拉的状态：0-loading前；1-loading中；2-没有更多了
                isUps:false,
                selectedVoucherId:'-1'//选中卡券ID
            }
        },

        onLoad(options){
            console.log('options',options);
            if(options.id){
                this.activityId = options.id;
            }
            if(options.name){
                this.activityName = options.name;
            }
            this.tabCur=0;
            this.getList('TO_BE_USE');
        },

        onPullDownRefresh() {
            this.page=1
            if(this.tabCur===0){
                this.getList('TO_BE_USE');
            }else if(this.tabCur===1){
                this.getList('USED');
            }
            else if(this.tabCur===2){
                this.getList('EXPIRED');
            }
            uni.stopPullDownRefresh(); // 停止刷新
        },

        onReachBottom() {
            this.page++;
            if(this.tabCur===0){
                this.getList('TO_BE_USE');
            }else if(this.tabCur===1){
                this.getList('USED');
            }
            else if(this.tabCur===2){
                this.getList('EXPIRED');
            }

        },

        computed: {
            ...mapState(['user']),
            formatCreateAt(){
                return function(time){
                    let currentTime = time;
                    console.log('time',time);
                    if(currentTime){
                        return cmnUtils.formatTime(currentTime,'yyyy-MM-dd HH:mm:ss')
                    }else{
                        return "";
                    }
                }
            },
        },

        methods: {
            tabSelect(e) {
                this.tabCur = e.currentTarget.dataset.id;
                if(this.tabCur===0){
                   this.getList('TO_BE_USE');
                }else if(this.tabCur===1){
                    this.getList('USED');
                }
                else if(this.tabCur===2){
                   this.getList('EXPIRED');
                }
            },

            async getList(status) {
                let that = this;
                this.isLoad=true;
                that.loadingType = 1;
                let res = await wx.cloud.callFunction({
                    name:'vou',
                    data:{
                        $url:'getVoucherList',
                        activityId:that.activityId,
                        page:that.page,
                        pageSize:10,
                        status:status
                    }
                });
                console.log('getList',status,res.result);
                let result=res.result;
                if (result.code == 0) {
                    if (that.page == 1) {
                        that.isEndPage = false;
                        if(that.tabCur===0){
                            that.toBeUsedVouchers = [];
                        }else if(that.tabCur===1){
                            that.usedVouchers = [];
                        }
                        else if(that.tabCur===2){
                            that.expiredVouchers = [];
                        }
                    }
                    result.data.forEach(vou => {
                        if(that.tabCur===0){
                            that.toBeUsedVouchers.push(vou);
                        }else if(that.tabCur===1){
                            that.usedVouchers.push(vou);
                        }
                        else if(that.tabCur===2){
                            that.expiredVouchers.push(vou);
                        }
                    })
                }
                //后面没数据了
                if(result.data.length<10){
                    that.isEndPage = true;
                    that.loadingType = 2;
                }
                that.isLoad=false;
            },

            goDetail(voucher){
                console.log('voucher detail',voucher._id, voucher);
                uni.navigateTo({
                    "url": "/pagesBiz/crm-cards/CrmCardDetail?cid=" + voucher.user_id,
                })
            },

            popupOperateVoucher(voucherId){
                let that = this;
                console.log('popupOperateVoucher',voucherId);
                that.selectedVoucherId = voucherId;
                this.$nextTick(() => {
                    that.$refs['showPopupOperate'].open()
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
            },

            //删除卡券
            async removeVoucher(){
                let that = this;
                console.log('go remove voucher', that.selectedVoucherId);
                await wx.cloud.callFunction({
                    name:'vouchers',
                    data:{
                        $url:'remove',
                        cardId:that.selectedVoucherId
                    }
                });

                uni.showToast({ icon:'success',title:'删除成功'})
                that.getSearchList("refresh");
                that.$refs['showPopupOperate'].close()
                that.$forceUpdate()
            },

            goHome(){
                uni.reLaunch({
                    url: '/pages/sys-account/index',
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
</style>
