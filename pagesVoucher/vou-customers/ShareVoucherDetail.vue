<template>
    <view>
        <cu-custom    :isBack="false">
            <block slot="content">{{voucher.card_name}}</block>
            <block slot="right">
                <view class="action">
                    <view class="cu-load load-cuIcon" :class="isLoad?'loading':'over'"></view>
                </view>
            </block>
        </cu-custom>
        <scroll-view>
            <view scroll-y class="quan">
                <view class="flex card bg-white">
                    <view class="quan-text">
                        <view class="font50 cuIcon-move font-bold" :class="'text-'+voucher.bg_color"></view>
                        <view class="flex">
                            <view  class="cu-avatar round lg margin-right-sm">
                                <image :src="voucher.card_avatar" mode="aspectFill" class="cu-avatar round lg"></image>
                            </view>
                            <view class="content">
                                <view class="text-grey text-xl">{{voucher.activity_name}}
                                    <text class="text-abc"></text>
                                </view>
                                <view class="text-gray text-sm">操作时间：{{formatCreateAt(voucher.create_at)}}</view>
                            </view>
                        </view>
                    </view>
                    <view class="rel quan-right">
                        <view class="margin-top-xl flex justify-center align-center text-gray" >
                            <text class="text-bold text-lg ﻿margin-right-xs">¥</text>
                            <text class="text-bold text-xxl ">{{activity.price}}</text>
                        </view>
                        <view class="solid-bottom">
                            <view class='cu-tag round ﻿bg-grey light' >{{voucher.num_send}} 张可用</view>
                        </view>
                    </view>
                </view>
            </view>

            <view v-if="voucher.num_send>0" class="cu-bar btn-group bg-white  margin-sm  radius">
                <button class="cu-btn  shadow-blur line-grey"   :disabled="isLoad" @click="getMyVoucher">立即领券</button>
            </view>
            <view v-else class="cu-bar btn-group bg-white  margin-sm  radius">
                <text class="text-orange text-bold text-30 text-center">请知：该券已被领取。</text>
            </view>
            <view class="margin-sm">
                ﻿<view class="cu-bar bg-white solid-bottom margin-top-xs">
                    <view class="action">
                        <text class="cuIcon-title text-orange"></text> 活动规则
                    </view>
                </view>
                ﻿<view class="cu-list menu">
                    <view class="cu-item">
                        <view class="content">
                            <text class="text-grey">使用条件：</text>
                            <text >{{activity.use_condition}}</text>
                        </view>
                    </view>
                </view>
                <view class="cu-bar bg-white solid-bottom margin-top-xs">
                    <view class="action">
                        <text class="cuIcon-title text-orange"></text> 使用规则
                    </view>
                </view>
                ﻿<view class="cu-list menu">
                    <view class="cu-item">
                        <view class="content">
                            <text class="text-grey">有效日期：</text>
                            <text>{{activity.valid_date}}</text>
                        </view>
                    </view>
                    <view class="cu-item">
                        <view class="content">
                            <text class="text-grey">可用时段：</text>
                            <text>{{activity.valid_time}}</text>
                        </view>
                    </view>
                    <view class="cu-item">
                        <view class="content flex">
                            <text class="text-grey">使用须知：</text>
                            <textarea class="flex-wrap" style="width: 76%" maxlength="140" v-model="activity.remark"></textarea>
                        </view>
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
    import { mapState ,mapMutations} from 'vuex'
    import cmnUtils from '@/utils/cmnUtils.js'

    export default {
        components:{
        },
        data() {
            return {
                isLoad:false,
                loading: false,
                isUps:false,
                title:'',
                leftNum:'',
                voucher:{
                    activity_name:'',
                    create_at:'',
                    num_send:'0',
                },
                activity:{

                },
                CustomBar: this.CustomBar,
                loadingType: 0,//上拉的状态：0-loading前；1-loading中；2-没有更多了
                leftNum:'',//剩余张数
            }
        },
        onLoad(options) {
            let that = this;
            console.log('options',options);
            if(options.id){
                that.getDetail(options.id);
            }
        },
        computed:{
            ...mapState(['user']),
            formatCreateAt(){
                return function(time){
                    let currentTime = time;
                    // console.log('time',time);
                    if(currentTime){
                        return cmnUtils.formatTime(currentTime,'yyyy-MM-dd HH:mm:ss')
                    }else{
                        return "";
                    }
                }
            },
        },
        methods: {
            async getDetail(id){
                let that = this;
                that.isLoad = true;
                if(id){
                    let res = await wx.cloud.callFunction({
                        name:'vou',
                        data:{
                            $url:'getVoucherDetail',
                            id:id,
                        }
                    });
                    console.log('getDetail',res);
                    if(res.result.code==0){
                        that.voucher = res.result.data;
                        that.voucher.num_send = that.voucher.num_send||'0';
                        that.leftNum = that.voucher.num_total-that.voucher.num_used;
                            res = await wx.cloud.callFunction({
                            name:'vou',
                            data:{
                                $url:'getActivityDetail',
                                id:that.voucher.activity_id,
                            }
                        });
                        console.log('getActivityDetail',res);
                        if(res.result.code==0){
                            that.activity = res.result.data;
                        }
                    }
                }
                that.isLoad = false;
            },

            //收券
            async getMyVoucher(){
                let that = this;
                that.isLoad = true;
                //构建领券对象
                let newVoucher = {
                    activity_id:that.activity._id,
                    activity_name:that.activity.name,
                    entry_id:that.activity.entry_id,
                    entry_name:that.activity.entry_name,
                    bg_color:that.activity.bg_color,
                    icon:that.activity.icon,
                    valid_date:that.activity.valid_date,
                    card_id:that.activity.card_id,
                    card_name:that.activity.card_name,
                    card_avatar:that.activity.avatar,
                    user_id:that.user._id,
                    user_name:that.user.name,
                    user_avatar:that.user.avatar,
                    managed_user_id:that.activity.user_id,
                    managed_user_name:that.activity.user_name,
                    managed_user_avatar:that.activity.user_avatar,
                    managed_status:'RECEIVED',
                    managed_status_name:'已领取',
                    num_total:parseInt(that.voucher.num_send),//本次领取总数
                    num_used:0,
                    price:parseFloat(that.activity.price),
                    status:'TO_BE_USE',
                    type_code:that.activity.type_code,//券类型
                    type_name:that.activity.type_name,//券类型名称
                    cover:that.activity.cover,
                    remark:that.voucher.remark
                };
                let res = await wx.cloud.callFunction({
                    name:'vou',
                    data:{
                        $url:'saveVoucher',
                        voucher:newVoucher,
                    }
                });
                console.log('getMyVoucher',newVoucher,res);

                //更新分享券的记录
                if(res.result.code==0){
                    that.voucher.receive_success = true;
                    //复位清零
                    that.voucher.num_send = '0';
                    that.voucher.num_send_used = 0;
                    that.voucher.leftNum = parseInt(that.voucher.num_total)-parseInt(that.voucher.num_used);
                    if(that.voucher.leftNum==0){
                        that.voucher.status='EXPIRED'
                    }
                    that.voucher.cover=that.activity.cover;
                    await wx.cloud.callFunction({
                        name:'vou',
                        data:{
                            $url:'saveVoucher',
                            voucher:that.voucher
                        }
                    })
                }
                that.isLoad = false;
                that.$forceUpdate();
                //todo 生成核销码
                // voucher._id=res.result.data;
                // voucher.number= voucher._id.substr(1,24);
                // if(res.result.code == 0){
                //     res = await wx.cloud.callFunction({
                //         name:'vouchers',
                //         data:{
                //             $url:'genQrCode',
                //             id:voucher._id,
                //             wfCode:voucher.number
                //         }
                //     });
                //     console.log('生成二维码',res);
                // }
                uni.showToast({
                    icon:'success',
                    title:'领券成功'
                });
                //延迟跳转
                setTimeout(function(){
                    uni.navigateTo({
                        "url":"/pagesVoucher/vou-customers/CustomerVoucherList"
                    })
                },1000)
            },

            goHome(){
                uni.reLaunch({
                    url: '/pages/my/home',
                })
            },
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
