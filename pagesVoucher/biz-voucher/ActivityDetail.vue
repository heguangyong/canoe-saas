<template>
    <view>
        <cu-custom    :isBack="true">
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
                            <view class='cu-tag round ﻿bg-grey light' >{{activity.num_total-activity.num_used}} 张可用</view>
                        </view>
                    </view>
                </view>
            </view>
            <view v-if="activity.status=='IN_PROCESS'" class="flex ﻿align-center﻿justify-start margin-sm bg-white radius">
                <text class="flex-twice align-center margin-left">发券数量：</text>
                <input class="flex-treble align-center cu-progress radius" placeholder="请输入发券数量" v-model="activity.num_send"></input>
                <button class="flex-twice cu-btn  shadow-blur margin-sm line-grey"  :disabled="isLoad" :data-activity="activity" open-type="share">分享发券</button>
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
    </view>
</template>

<script>
    import { mapState ,mapMutations} from 'vuex'

    export default {
        data() {
            return {
                isLoad:false,
                loading: false,
                isUps:false,
                title:'',
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
			console.log('options',options);
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

        onShareAppMessage(res){
            let that = this;
            console.log('res',res);

            //==============
            //只能输入数字
            let reg = /^[0-9]*$/;
            console.log('只能输入数字',reg.test(that.activity.num_send));
            if(!reg.test(that.activity.num_send)){
                uni.showToast({
                    icon:'none',
                    title:'只能输入数字'
                })
                return;
            }
            if(parseInt(that.activity.num_send)==0){
                uni.showToast({
                    icon:'none',
                    title:'面额不能为零'
                })
                return;
            }

            if(parseInt(that.activity.num_send)+parseInt(that.activity.num_used)>parseInt(that.activity.num_total)){
                uni.showToast({
                    icon:'none',
                    title:'剩余券数额不足'
                })
                return;
            }
            if(res.from=== 'button'){
                let  activity = res.target.dataset.activity;
                console.log('activity share res',activity.name,activity.cover,res);
                that.isLoad = true;
                //更新占用券数
                that.activity.num_used = parseInt(that.activity.num_used)+parseInt(that.activity.num_send);
                //对方未接受标记为false，对方收取后标记为true
                that.activity.num_send_used = 0;
                that.activity.receive_success = false;
                that.activity.leftNum = parseInt(that.activity.num_total)-parseInt(that.activity.num_used);
                if(that.activity.leftNum==0){
                    that.activity.status='CLOSE'
                }
                wx.cloud.callFunction({
                    name:'vou',
                    data:{
                        $url:'saveActivity',
                        activity:that.activity
                    }
                }).then((resAct)=>{
                    that.activity.num_send = '';
                    that.isLoad = false;
                });
                return{
                    title:res.target.dataset.activity.name,
                    imageUrl:res.target.dataset.activity.cover||'',
                    path:"/pagesVoucher/biz-voucher/ShareActivityDetail?id="+res.target.dataset.activity._id,
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
                        that.activity.num_send = '';

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
                        that.activity.num_send= '';
                        that.activity.num_used= that.activity.num_used||'0';
                        that.getTemplate(that.activity.template_id);
                        //计算进度
                        let num = that.activity.num_used/that.activity.num_total*10000;
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
            //发券
            async sendMyVoucher(){
                let that = this;

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
