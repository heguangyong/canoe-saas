<template>
    <view>
        <cu-custom    :isBack="true">
            <block slot="content">{{entryName}}</block>
            <block slot="right">
                <view class="action">
                    <view class="cu-load load-cuIcon" :class="isLoad?'loading':'over'"></view>
                </view>
            </block>
        </cu-custom>
        <view  class="abs round lg" style="z-index: 9;">
            <image :src="entry.avatar" mode="aspectFill" class=" round" style="" :style="{width:logoWidth +'px; height:'+logoWidth+'px;'+ ' margin:'+logoStartPoint+'px'+' 0 0 '+logoStartPoint+'px;'}"></image>
        </view>
        <view  class="margin padding grid col-1 bg-white radius" style="z-index: 0;">
            <image :src="entry.qrcode_info.fileID" mode="widthFix" style="width:100%;"></image>
            <view class="title margin-top-sm text-center"> {{entry.card_name}} · {{entryName}}</view>
        </view>
        <scroll-view scroll-y class="quan">
            <view class="flex card bg-white"  v-for="(item,index) in list" :key="item"  @longpress="popupOperate(item)">
                <view class="quan-text">
                    <view class="font50 cuIcon-move font-bold" :class="'text-'+item.bg_color"></view>
                    <view class="flex">
                        <view  class="cu-avatar round lg margin-right-sm" @tap="goDetail(item)">
                            <image :src="item.card_avatar" mode="aspectFill" class="cu-avatar round lg"></image>
                        </view>
                        <view class="content">
                            <view v-if="item.remark" class="text-grey text-xl">{{item.remark}}
                                <text class="margin-left-sm text-ABC text-bold text-white cu-tag radius bg-blue">{{formatCarNum(item.write_off_item)}}</text>
                            </view>
                            <view v-else class="text-grey text-xl">{{item.activity_name}}
                                <text class="margin-left-sm text-ABC text-bold text-white cu-tag radius bg-blue">{{formatCarNum(item.write_off_item)}}</text>
                            </view>
                            <view class="text-gray text-sm">核销时间：{{formatCreateAt(item.create_at)}}</view>
                        </view>
                    </view>
                </view>
                <view class="rel quan-right">
                    <view class="margin-top-xl flex justify-center align-center text-gray" >
                        <text class="text-bold text-lg ﻿margin-right-xs">¥</text>
                        <text class="text-bold text-red text-xxl ">{{formatAmount(item)}}</text>
                    </view>
                </view>
            </view>
        </scroll-view>

        <!--页面底部抬升-->
        ﻿<view class="cu-bar solid-bottom margin-top-xxs radius"></view>
        <!-- 底部操作菜单 -->
        <view class="cu-bar btn-group   foot bg-white">
            <button class="cu-btn   shadow-blur"   :disabled="isLoad" @click="goHome">去首页</button>
        </view>
    </view>
</template>

<script>
    import {mapState,mapMutations} from 'vuex';
    import cmnUtils from '@/utils/cmnUtils.js'

    export default {
        components: {
        },
        data() {
            return {
                isLoad:false,
                entryId:'',
                entryName:'',
                logoWidth:0,//图标宽度
                logoStartPoint:0,//图标起始位
                list:[],
                selectedId:'',
                page: 1,
                isEndPage:false,//最后一页
                loadingType: 1,//上拉的状态：0-loading前；1-loading中；2-没有更多了
                entry:{card_name:'',number:''}//入口对象
            }
        },

        onLoad(option){
            let that = this;
            console.log('onLoad option',option);
            if(option.entryId && option.entryName){
                that.entryId = option.entryId;
                that.entryName = option.entryName;
                that.getEntry();
            }
            let system = that.getSystem();
            that.logoWidth= system.w*0.3827;
            that.logoStartPoint=system.w*0.309;
            console.log('logoImage',system.w,that.logoWidth,system.h,that.logoStartPoint);
            //查询指定入口的数据；
            if(option.entryId){
                that.$db.collection('voucher')
                    .orderBy('create_at','desc')
                    .limit(10)
                    .where({
                        entry_id:option.entryId,
                        status:'USED'
                    })
                    .watch({
                        onChange:function(snapshot){
                            console.log('snapshot', snapshot);
                            that.list = snapshot.docs;
                            that.$forceUpdate();
                        },
                        onError: function(err){
                            console.log('the watch closed because of error', err)
                        }

                    })
            }
        },

        onPullDownRefresh() {
            this.page=1;
            this.getList();
            uni.stopPullDownRefresh(); // 停止刷新
        },

        onReachBottom() {
            this.page++;
            this.getList();
        },

        mounted() {
            this.system = this.getSystem();
            console.log(this.system);
            wx.getSystemInfo({
                success(res) {
                    console.log(res)
                }
            })
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
            formatCarNum(){
                return function (carNum) {
                    let currentNum = carNum||'';
                    if(currentNum.indexOf('·')>0){
                        return  currentNum;
                    }
                    else if(currentNum.length>0){
                        return currentNum.substr(0,2)+'·'+currentNum.substr(2);
                    }
                }
            },
            formatAmount(){
                return function (item) {
                    return Math.floor(parseFloat(item.price*item.num_write_off*100))/100
                }
            }
        },

        methods: {
            getSystem(){
                let system = wx.getSystemInfoSync()
                this.scale = 667 / 375 //按照苹果留 375*667比例 其他型号手机等比例缩放 显示
                this.systemScale = system.windowWidth / 375 //按照苹果留 375*667比例 其他型号手机等比例缩放 显示
                return {w:system.windowWidth,h:system.windowHeight}
            },
            async getEntry(){
                let that =this;
                that.isLoad = true;
                let res = await wx.cloud.callFunction({
                    name:'vou',
                    data:{
                        $url:'getEntryDetail',
                        id:that.entryId
                    }
                });
                console.log('getEntry',res.result);
                let result=res.result;
                if (result.code == 0) {
                    that.entry = res.result.data;
                    console.log('entry',that.entry);
                }
            },

            async getList() {
                let that = this;
                that.isLoad=true;
                that.loadingType = 1;
                let res = await wx.cloud.callFunction({
                    name:'vou',
                    data:{
                        $url:'getWriteOffList',
                        entryId:that.entryId,
                        page:that.page,
                        pageSize:10
                    }
                });
                console.log('getList',res.result);
                let result=res.result;
                if (result.code == 0) {
                    if (that.page == 1) {
                        that.isEndPage = false;
                        that.list = [];
                    }
                    result.data.forEach(each => {
                        that.list.push(each);
                    })
                }
                //后面没数据了
                if(result.data.length<10){
                    that.isEndPage = true;
                    that.loadingType = 2;
                }
                that.isLoad=false;
            },

            goDetail(item){
                
            },


            popupOperate(item){
                let that = this;
                console.log('popupOperate',item);
                that.selectedId = item._id;
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

            goHome(){
                uni.reLaunch({
                    url: '/pages/my/home',
                })
            }
        }
    }
</script>

<style>
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
