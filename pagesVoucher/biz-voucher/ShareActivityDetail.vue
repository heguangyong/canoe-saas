<template>
    <view>
        <cu-custom    :isBack="false">
            <block slot="content">{{activity.card_name}}</block>
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
                        <view class="font50 cuIcon-move font-bold" :class="'text-'+activity.bg_color"></view>
                        <view class="flex">
                            <view  class="cu-avatar round lg margin-right-sm">
                                <image :src="activity.avatar" mode="aspectFill" class="cu-avatar round lg"></image>
                            </view>
                            <view class="content">
                                <view class="text-grey text-xl">{{activity.name}}
                                    <text class="text-abc"></text>
                                </view>
                                <view class="text-gray text-sm">有效期：{{activity.valid_date}}</view>
                            </view>
                        </view>
                    </view>
                    <view class="rel quan-right">
                        <view class="margin-top-xl flex justify-center align-center text-gray" >
                            <text class="text-bold text-lg ﻿margin-right-xs">¥</text>
                            <text class="text-bold text-xxl ">{{activity.price}}</text>
                        </view>
                        <view class="solid-bottom">
                            <view class='cu-tag round ﻿bg-grey light' >{{activity.num_send}} 张可用</view>
                        </view>
                    </view>
                </view>
            </view>
            <view v-if="activity.num_send>0" class="cu-bar btn-group bg-white  margin-sm  radius">
                <button class="cu-btn  shadow-blur line-grey"   :disabled="isLoad" @click="getMyVoucher">立即领券</button>
            </view>
            <view v-else class="cu-bar btn-group bg-white  margin-sm  radius">
                <text class="text-orange text-bold text-30 text-center">请知：该券已被领取。</text>
            </view>
            <view class="margin-sm">
                <view class="cu-bar bg-white solid-bottom margin-top-xs">
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
                            <!--<text >每位限领{{activity.num_limit}}张</text>-->
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

    export default {
        components:{
        },
        data() {
            return {
                isLoad:false,
                loading: false,
                isUps:false,
                title:'',
                voucher:{
                    activity_id:'',
                    activity_name:'',
                    num_send:0,
                    num_send_used:0,
                    num_total:0,
                    num_used:0,
                },
                activity:{
                    name:'',
                    avatar:'',//企业头像
                    card_id:'',//卡ID
                    card_name:'',
                    type_code:'',
                    type_name:'',
                    entry_id:'',
                    entry_name:'',
                    price:0,
                    use_condition:'',
                    num_send:0,//发送数量
                    num_send_used:0,//已领数量
                    num_total:100,
                    num_limit:1,
                    num_used:1,
                    num_progress:'0%',//进度
                    rule:{
                        forbidden_region:false,
                        verified_reward:false,
                        forbidden_reward:false,
                        forbidden_share:false
                    },
                    valid_date:''
                },
                CustomBar: this.CustomBar,
                existEntryFlag:false,//存在备选入口
                searchList: [{}],//核销备选入口
                //检索
                page: 1,
                loadingType: 0,//上拉的状态：0-loading前；1-loading中；2-没有更多了
                search_str: '',//检索关键字
            }
        },
        onLoad(options) {
            let that = this;
            if(options.id){
                that.getDetail(options.id);
            }
            if(options.templateId){
                that.getTemplate(options.templateId);
            }
            that.$forceUpdate();
            //用于延迟加载进度条，不可以去掉
            setTimeout(function() {
                that.loading = true
            }, 500)
        },
        computed:{
            ...mapState(['user']),
        },
        methods: {
            async getTemplate(templateId){
                let that = this;
                that.isLoad = true;
                if(templateId){
                    let res = await wx.cloud.callFunction({
                        name:'vou',
                        data:{
                            $url:'getTemplateDetail',
                            id:templateId||'0',
                        }
                    });
                    console.log('getDetail',res);
                    if(res.result.code==0){
                        let template = res.result.data;
                        that.title = template.title;
                        that.activity.type_code = template.type_code;
                        that.activity.type_name = template.type_name;
                        that.activity.bg_color = template.bg_color;
                        that.activity.icon = template.icon;
                        that.activity.isOwner = that.user._id==that.activity.user_id;
                        that.$forceUpdate();
                    }
                }
            },
            async getDetail(id){
                let that = this;
                that.isLoad = true;
                if(id){
                    let res = await wx.cloud.callFunction({
                        name:'vou',
                        data:{
                            $url:'getActivityDetail',
                            id:id||'0',
                        }
                    });
                    console.log('getDetail',res);
                    if(res.result.code==0){
                        that.activity = res.result.data;
                        that.getTemplate(that.activity.template_id);
                        //计算进度
                        let num = that.activity.num_send_used/that.activity.num_send*10000;
                        that.activity.num_progress = new Number(num).toFixed(4)/100+'%';
                        // console.log('计算进度',num, new Number(num),that.activity.num_progress);
                    }
                }
                //初始化创建券
                else{
                    that.activity.user_id = that.user._id||'0';
                }
                that.isLoad = false;
            },

            //收券
            async getMyVoucher(){
                let that = this;
                that.isLoad = true;
                //构建领券对象
                let voucher = {
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
                    num_total:parseInt(that.activity.num_send),//本次领取总数
                    num_used:0,
                    price:parseFloat(that.activity.price),
                    status:'TO_BE_USE',
                    type_code:that.activity.type_code,//券类型
                    type_name:that.activity.type_name,//券类型名称
                    cover:that.activity.cover
                };
                let res = await wx.cloud.callFunction({
                    name:'vou',
                    data:{
                        $url:'saveVoucher',
                        voucher:voucher,
                    }
                });
                console.log('getMyVoucher',voucher,res);

                //更新活动记录
                if(res.result.code==0){
                    that.activity.receive_success = true;
                    //复位清零
                    that.activity.num_send = '0';
                    that.activity.num_send_used = 0;
                    await wx.cloud.callFunction({
                        name:'vou',
                        data:{
                            $url:'saveActivity',
                            activity:that.activity
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
