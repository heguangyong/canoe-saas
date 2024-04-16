<template>
    <view>
        <cu-custom    :isBack="true">
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
                                <view class="text-gray text-sm">领券时间：{{formatCreateAt(voucher.create_at)}}</view>
                            </view>
                        </view>
                    </view>
                    <view class="rel quan-right">
                        <view class="margin-top-xl flex justify-center align-center text-gray" >
                            <text class="text-bold text-lg ﻿margin-right-xs">¥</text>
                            <text class="text-bold text-xxl ">{{activity.price}}</text>
                        </view>
                        <view class="solid-bottom">
                            <view class='cu-tag round ﻿bg-grey light' >{{voucher.leftNum}} 张可用</view>
                        </view>
                    </view>
                </view>
            </view>
            <view  class="flex ﻿align-center﻿justify-start margin-sm bg-white radius">
                <text class="flex-twice align-center margin-left">发券数量：</text>
                <input class="flex-treble align-center cu-progress radius" placeholder="请输入发券数量" v-model="voucher.num_send"></input>
                <button class="flex-twice cu-btn  shadow-blur margin-sm line-grey"  :disabled="isLoad" :data-voucher="voucher" open-type="share">分享发券</button>
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
                    <!--<view class="cu-item">-->
                        <!--<view class="content">-->
                            <!--<text class="text-grey">领取限制：</text>-->
                            <!--<text >每位限领{{voucher.num_limit}}张</text>-->
                        <!--</view>-->
                    <!--</view>-->
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
                id:'',
                isLoad:false,
                loading: false,
                isUps:false,
                title:'',
                voucher:{
                    activity_name:'',
                    create_at:'',
                    num_send:'0',
                    leftNum:0,
                    num_used:'0',
                },
                activity:{

                },
                CustomBar: this.CustomBar,
                loadingType: 0,//上拉的状态：0-loading前；1-loading中；2-没有更多了
            }
        },
        onLoad(options) {
            let that = this;
            console.log('options',options);
            if(options.id ){
                that.id=options.id;
                that.getDetail(options.id);
            }
        },

        onShareAppMessage(res){
            let that = this;
            //只能输入数字
            let reg = /^[0-9]*$/;
            console.log('只能输入数字',reg.test(that.voucher.num_send));
            if(!reg.test(that.voucher.num_send)){
                uni.showToast({
                    icon:'none',
                    title:'只能输入数字'
                })
                return;
            }
            if(parseInt(that.voucher.num_send)==0){
                uni.showToast({
                    icon:'none',
                    title:'面额不能为零'
                })
                return;
            }

            if(parseInt(that.voucher.num_send)+parseInt(that.voucher.num_used)>parseInt(that.voucher.num_total)){
                uni.showToast({
                    icon:'none',
                    title:'剩余券数额不足'
                })
                return;
            }

            if(res.from=== 'button'){
                let  voucher = res.target.dataset.voucher;
                console.log('voucher share res',voucher.activity_name,voucher._id,voucher.cover);
                that.isLoad = true;
                //更新占用券数
                that.voucher.num_used = parseInt(that.voucher.num_used)+parseInt(that.voucher.num_send);
                //对方未接受标记为false，对方收取后标记为true
                that.voucher.num_send_used = 0;
                that.voucher.receive_success = false;
                that.voucher.leftNum = parseInt(that.voucher.num_total)-parseInt(that.voucher.num_used);
                if(that.voucher.leftNum==0){
                    that.voucher.status='EXPIRED'
                }
                that.voucher.cover = that.activity.cover;
                wx.cloud.callFunction({
                    name:'vou',
                    data:{
                        $url:'saveVoucher',
                        voucher:that.voucher
                    }
                }).then((resVou)=>{
                    that.voucher.num_send = '';
                    that.isLoad = false;
                });
                return{
                    title:voucher.activity_name,
                    imageUrl:voucher.cover||'',
                    path:"/pagesVoucher/vou-customers/ShareVoucherDetail?id="+voucher._id,
                    success:function(r){
                        uni.showToast({
                            'icon':'success',
                            'title':'分享成功'
                        });
                    }
                }
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
                        that.voucher.num_send= '';
                        that.voucher.num_used= that.voucher.num_used||'0';
                        that.voucher.leftNum = parseInt(that.voucher.num_total)-parseInt(that.voucher.num_used);
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
