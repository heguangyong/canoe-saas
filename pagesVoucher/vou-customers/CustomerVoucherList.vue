<template>
    <view>
        <cu-custom    :isBack="true">
            <block slot="content">{{title}}的卡券</block>
            <block slot="right">
                <view class="action">
                    <view class="cu-load load-cuIcon" :class="isLoad?'loading':'over'"></view>
                </view>
            </block>
        </cu-custom>
		<!--<view v-if="isWriteOffRole" class="quan margin-tb">	-->
			<!--<view class="flex card bg-white"  @tap="goEntryDetail(entry)">-->
				<!--<view class="quan-text">-->
					<!--<view class="font50 cuIcon-move font-bold" ></view>-->
					<!--<view class="content">-->
						<!--<view class="text-grey text-xl">{{entry.name}}-->
							<!--<text class="text-abc"></text>-->
						<!--</view>-->
						<!--<view class="text-gray text-sm">当前入口{{entry.usable?'开放':'关闭'}}</view>-->
					<!--</view>-->
				<!--</view>-->
				<!--<view class="rel quan-right">-->
					<!--<view class="grid text-center col-1">-->
						<!--<view class="abs quan-icon-icon text-grey">-->
							<!--<text class="text-abc " :class="entry.usable?' cuIcon-pullright':' cuIcon-roundclose'"></text>-->
						<!--</view>-->
			<!---->
					<!--</view>-->
				<!--</view>-->
			<!--</view>-->
		<!--</view>	-->
		
        <scroll-view scroll-x class="bg-white nav">
            <view class="flex text-center">
                <view class="cu-item flex-sub" :class="index==tabCur?'text-green cur':''" v-for="(item,index) in 3" :key="index" @tap="tabSelect" :data-id="index">
                    {{tab[index]}}
                </view>
            </view>
        </scroll-view>
        <slot v-if="tabCur==0">
            <view v-if="isParkingWriteOff" class="flex">
                <view  class="flex-treble radius margin-top-sm margin-left-sm margin-right-xs margin-bottom-xs shadow bg-grey.light">
                    <view  class="cu-form-group">
                        <view class="title">车牌号：</view>
                        <text class='cuIcon-titles text-xs text-pink-light'></text>
                        <input class="toUp" placeholder="请输入车牌号" v-model="parkingCarNum"></input>
                    </view>
                    <view  class="cu-form-group">
                        <view class="title">停车费：</view>
                        <text class='cuIcon-titles text-xs text-pink-light'></text>
                        <input placeholder="请输入停车费金额" v-model="parkingWriteOffValue"></input>
                    </view>
                </view>
                <view class="flex-sub align-center radius margin-top-sm margin-left-xs margin-right-sm margin-bottom-xs shadow bg-red.light" @click="showWriteOffModal" data-target="WriteOffModal">
                    ﻿<view class="padding-sm margin-top  margin-left-xl margin-right radius  text-bold text-xl">使用</view>
                </view>
                <view class="cu-modal" :class="modalName=='WriteOffModal'?'show':''" @tap="hideWriteOffModal">
                    <view class="cu-dialog" @tap.stop>
                        ﻿<view class="padding-bottom-xs">
                            <view  class="cu-form-group">
                                <view class="title">车牌号：</view>
                                <!-- 区别7：蓝牌 8：绿牌 -->
                                <view class="title text-ABC text-bold text-white cu-tag radius " :class="parkingCarNum.length==7?'bg-blue':'bg-green'">{{formatCarNum(parkingCarNum)}}</view>
                            </view>
                            <view  class="cu-form-group">
                                <view class="title">停车费：</view>
                                <view class="title text-bold text-red">¥ {{parkingWriteOffValue}}</view>
                            </view>
                        </view>
                        <view class="cu-bar bg-white justify-end">
                            <view class="action">
                                <button class="cu-btn line-green text-green" :disabled="isLoad" @tap="hideWriteOffModal">取消</button>
                                <button class="cu-btn bg-green margin-left" :disabled="isLoad" @tap="doWriteOff">确定</button>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <scroll-view scroll-y class="quan">
                <view class="flex card bg-white"  v-for="(item,index) in toBeUsedVouchers" :key="item"  @tap="goDetail(item)" >
                    <view class="quan-text">
                        <view class="font50 cuIcon-move font-bold" :class="'text-'+item.bg_color"></view>
                        <view class="flex">
                            <view  class="cu-avatar round lg margin-right-sm" @tap="goDetail(item)">
                                <image :src="item.card_avatar" mode="aspectFill" class="cu-avatar round lg"></image>
                            </view>
                            <view class="content">
                                <view class="text-grey text-xl">{{item.activity_name}}
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
                <view class="flex card bg-white"  v-for="(item,index) in usedVouchers" :key="item"  >
                    <view class="quan-text">
                        <view class="font50 cuIcon-move font-bold" :class="'text-'+item.bg_color"></view>
                        <view class="flex">
                            <view  class="cu-avatar round lg margin-right-sm" @tap="goDetail(item)">
                                <image :src="item.card_avatar" mode="aspectFill" class="cu-avatar round lg"></image>
                            </view>
                            <view class="content">
                                <view class="text-grey text-xl">{{item.activity_name}}
                                    <text class="margin-left-sm text-ABC text-bold text-white cu-tag radius bg-blue">{{formatCarNum(item.write_off_item)}}</text>
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
                            <view class='cu-tag round ﻿bg-grey light' >用 {{item.num_write_off}} 张</view>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </slot>

        <slot v-if="tabCur==2">
            <scroll-view scroll-y class="quan">
                <view class="flex card bg-white"  v-for="(item,index) in expiredVouchers" :key="item"  >
                    <view class="quan-text">
                        <view class="font50 cuIcon-move font-bold" :class="'text-'+item.bg_color"></view>
                        <view class="flex">
                            <view  class="cu-avatar round lg margin-right-sm" @tap="goDetail(item)">
                                <image :src="item.card_avatar" mode="aspectFill" class="cu-avatar round lg"></image>
                            </view>
                            <view class="content">
                                <view class="text-grey text-xl">{{item.activity_name}}
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
                            <view class='cu-tag round ﻿bg-grey light'>{{item.num_total-item.num_used}}/{{item.num_total}} 张可用</view>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </slot>

        <!-- 底部扩展功能弹窗 -->
        <uni-popup ref="showPopupOperate" type="bottom" @change="change">
            <view class="card-popup bg-white">
                <!--<view class="card-popup-content" @click="goEdit">-->
                    <!--<text class="remove-popup-btn" >编辑</text>-->
                <!--</view>-->
                <!--<view class="card-popup-content" style="border-top: 1rpx solid #ddd;" @click="removeCard">-->
                    <!--<text class="remove-popup-btn" >删除</text>-->
                <!--</view>-->
                <text class="card-popup-btn" @click="cancel('PopupOperate')">取消</text>
            </view>
        </uni-popup>
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
                title:'',
                customerId:'',//对应userId；此页面是否不需要显示企业名片？
                cardId:'',
                tabCur: 0,
                tab:['待使用','已使用','已无效'],
                toBeUsedVouchers:[],
                usedVouchers:[],
                expiredVouchers:[],
                page: 1,
                isEndPage:false,//最后一页
                loadingType: 1,//上拉的状态：0-loading前；1-loading中；2-没有更多了
                isUps:false,
                selectedVoucherId:'-1',//选中卡券ID
                isParkingWriteOff:false, //是否为停车核销
                parkingCarNum:'',//车牌号
                parkingWriteOffValue:0,//停车费
                entryCode:'',//入口码
                leftVouchers:[],//剩余券集合
                writeOffVouchers:[],//核销券集合
                endVouchers:[],//全部抵用完的券集合
                modalName: null,//模态框名称
                entryNumber:''//扫码核销入口
            }
        },

        onLoad(options){
            let that = this;
            console.log('options',options);
            that.title='我';
            //从商务名片进入时需要初始化
            if(options.id){
                that.customerId = options.id;
            }else{
                that.customerId=that.user._id;
            }
            if(options.cardId){
                that.cardId = options.cardId;
            }
            if(options.title){
                that.title = options.title;
            }
            //====核销入口扫码进入===
            else if(options.scene){
                let res = {}
                let params = decodeURIComponent(options.scene).split("&");
                params.forEach(item => {
                    let pram = item.split("=");
                    res[pram[0]] = pram[1]
                });
                if(res.number){
                    //停车券自行核销入口
                    that.entryNumber=res.number;
                    that.isParkingWriteOff=true;

                    wx.cloud.callFunction({
                        name:'vou',
                        data:{
                            $url:'getEntryDetailByNumber',
                            number:that.entryNumber
                        }
                    }).then(res=>{
                        console.log('getDetailByNumber',res.result);
                        let result=res.result;
                        if (result.code == 0) {
                            //扫码核销入口对象
                            let entry = res.result.data;
                            console.log('entry',entry);
                            that.cardId = entry.card_id;
                            wx.cloud.callFunction({
                                name: 'sys',
                                data: {
                                    $url: 'getCardHolderByCardId',
                                    cardId: that.cardId
                                }
                            }).then(res2=>{
                                result = res2.result;
                                if (result.code == 0 && result.data) {
                                    //按字母分组的名片
                                    let listGroup = result.data.cards || {};
                                    for (let key in listGroup) {
                                        for(let subIdx in listGroup[key]){
                                            let role = listGroup[key][subIdx].role||'';
                                            if(role.indexOf('writeOff')>-1 && listGroup[key][subIdx].user_id == that.user._id){
                                                uni.navigateTo({
                                                    "url": "/pagesVoucher/vou-entries/WriteOffList?entryId=" + entry._id+"&entryName="+entry.name,
                                                })
                                            }
                                        }
                                    }
                                }
                            })
                        }
                    });
                }
            }else if(options.isParkingWriteOff){
                that.isParkingWriteOff=options.isParkingWriteOff;
            }

            that.tabCur=0;
            that.parkingCarNum = that.user.car_num||'';
        },

        onShow(){
			if(!this.hasLogin){
				this.setCache({'VOUCHER_ENTRY_NUMBER':this.entryNumber})
				this.setCache({'PARK_WRITE_OFF':true})
				uni.navigateTo({
				    "url": "/pages/my/home",
				})
				return;
			}
		   if(this.cache['PARK_WRITE_OFF']){
			   this.isParkingWriteOff = true;
			   this.entryNumber = this.cache['VOUCHER_ENTRY_NUMBER']
			   this.setCache({'PARK_WRITE_OFF':false})
		   }
           if(this.tabCur==0){
               this.getList('TO_BE_USE');
           }
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
            ...mapState(['isLogin','user','cache']),

            formatCreateAt(){
                return function(time){
                    let currentTime = time;
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
            }

        },

        methods: {
            ...mapMutations(['updateUser','setCache']),
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
                console.log(status,'customerId',that.customerId||that.user._id,'cardId',that.cardId||null);
                let res = await wx.cloud.callFunction({
                    name:'vou',
                    data:{
                        $url:'getVoucherList',
                        userId:that.customerId,
                        cardId:that.cardId||null,
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
                console.log('activity detail',voucher.activity_id, voucher);

                uni.navigateTo({
                    "url": "/pagesVoucher/vou-customers/VoucherDetail?id=" + voucher._id,
                })
            },
            // goEdit() {
            //     console.log('goEdit', this.selectedVoucherId);
            //     uni.navigateTo({
            //         "url": "/pagesBiz/biz-voucher/VoucherInput?id=" + this.selectedCardId,
            //     })
            // },

            // popupOperate(voucherId){
            //     let that = this;
            //     console.log('popupOperate',voucherId);
            //     that.selectedVoucherId = voucherId;
            //     this.$nextTick(() => {
            //         that.$refs['showPopupOperate'].open()
            //     })
            // },
            //
            // change(e){
            //     if(e.show){
            //         this.isUps = true;
            //     }else{
            //         this.isUps =false;
            //     }
            // },
            //
            // cancel(type){
            //     this.$refs['show' + type].close()
            // },

            //删除卡券
            async removeVoucher(){
                let that = this;
                console.log('go remove voucher', that.selectedVoucherId);
                await wx.cloud.callFunction({
                    name:'vou',
                    data:{
                        $url:'removeVoucher',
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
                    url: '/pages/my/home',
                })
            },

            checkCarNum(carNum){
                let xreg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
                let creg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
                if(carNum.length == 7){
                    return creg.test(carNum);
                } else if(carNum.length == 8){
                    return xreg.test(carNum);
                } else{
                    uni.showToast({
                        title: '请输入正确的车牌号码！',
                        icon: 'none'
                    });
                    return false;
                }
            },

            //自助扫码核销
            async doWriteOff(){
                let that = this;
				that.parkingCarNum = that.parkingCarNum.toUpperCase();
				console.log(that.parkingCarNum)
                if(that.parkingCarNum.length==0){
                    uni.showToast({
                        icon:'none',
                        title:'请输入车牌号'
                    })
                    return;
                }
                //自动去掉点
                if(that.parkingCarNum.indexOf('·')>0){
                    let pointIndex = that.parkingCarNum.indexOf('·');
                    that.parkingCarNum=that.parkingCarNum.substr(0,pointIndex)+that.parkingCarNum.substr(pointIndex+1);
                    console.log('carNum',pointIndex,that.parkingCarNum);
                }
                //车牌检测
                if(!that.checkCarNum(that.parkingCarNum)){
                    console.log('车牌检测',that.parkingCarNum);
                    return;
                }

                //只能输入数字
                let reg = /^[0-9]*$/;
                console.log('只能输入数字',reg.test(that.parkingWriteOffValue));
                if(!reg.test(that.parkingWriteOffValue)){
                    uni.showToast({
                        icon:'none',
                        title:'只能输入数字'
                    })
                    return;
                }

                if(that.parkingWriteOffValue==0){
                    uni.showToast({
                        icon:'none',
                        title:'消费金额不能为零'
                    })
                    return;
                }

                //====检查是否可用=====
                if(that.toBeUsedVouchers.length==0){
                    uni.showToast({
                        icon:'none',
                        title:'没有可用券'
                    })
                    return;
                }

                that.isLoad = true;

                //缓存车牌号
                that.user.car_num = that.parkingCarNum;
                that.updateUser(that.user);
				await wx.cloud.callFunction({
				    name:'sys',
				    data:{
				        $url:'updateUserInfo',
				        id:that.user._id,
				        userInfo:that.user.userInfo
				    }
				});


                let isEnoughPay = false;//足够支付标志
                let prePayPrice = that.parkingWriteOffValue;//预扣金额，用于临时核算
                let msgList = [];
                let msg ='';//提示消息
                that.leftVouchers = [];//剩余券集合
                that.writeOffVouchers = [];//核销券集合
                that.endVouchers = []; //全部抵用完的券集合

                //扣减时,按顺序抵扣券；券额不可超额抵扣：10元不能抵扣小于10元的金额；只能对等抵扣
                //case1 : 370:  100*2 50*2 100 20*2 10*100； 100*2 50*2 0 20*2 10*3
                //case2 : 370:  100*5 50*2 100 20*2 10*100;  100*3 50   0 20   0
                //case3 : 370:  10*100 100*5 50*2 100 20*2;  10*37 0    0 0    0
                for(let index in that.toBeUsedVouchers){
                    //如果需付券款大于等于单张抵扣券值
                    if(prePayPrice>=that.toBeUsedVouchers[index].price){
                        //当前券单价金额
                        let unitPrice = that.toBeUsedVouchers[index].price;
                        //折算能够抵扣几张
                        let needTicketNum = parseInt(prePayPrice/unitPrice);
                        //折算剩余几张
                        let num_left = that.toBeUsedVouchers[index].num_total-that.toBeUsedVouchers[index].num_used;
                        if(num_left>needTicketNum){
                            //根据面值抵扣
                            prePayPrice -= needTicketNum * that.toBeUsedVouchers[index].price;
                            //该券剩余量计算
                            let leftVoucher = that.toBeUsedVouchers[index];
                            //用掉抵扣张数
                            leftVoucher.num_used+=needTicketNum;
                            msg = '拟扣'+leftVoucher.price+'元抵用券'+needTicketNum+'张';
                            //该券剩余张数更新
                            that.leftVouchers.push(leftVoucher);

                            //该券核销张数更新（需拆分新纪录保存）
                            let writeOffVoucher = that.toBeUsedVouchers[index];
                            //核销券数
                            writeOffVoucher.num_write_off = needTicketNum;
                            //核销项
                            writeOffVoucher.write_off_item = that.parkingCarNum;
                            writeOffVoucher.status='USED';
                            that.writeOffVouchers.push(writeOffVoucher);
                        }
                        //该券剩余张数不够扣
                        else{
                            //根据面值抵扣
                            prePayPrice -= num_left * that.toBeUsedVouchers[index].price;
                            //该券用完
                            let endVoucher = that.toBeUsedVouchers[index];
                            //用掉抵扣张数
                            endVoucher.num_used+=num_left;
                            msg = '拟扣'+endVoucher.price+'元抵用券'+num_left+'张';
                            //原有可用券全部用光，该记录状态改为已使用
                            endVoucher.status='USED';
                            that.endVouchers.push(endVoucher);
                            //该券核销张数更新（需拆分新纪录保存）
                            let writeOffVoucher = that.toBeUsedVouchers[index];
                            //核销券数
                            writeOffVoucher.num_write_off = num_left;
                            //核销项
                            writeOffVoucher.write_off_item = that.parkingCarNum;
                            writeOffVoucher.status='USED';
                            that.writeOffVouchers.push(writeOffVoucher);
                        }
                        msgList.push(msg);
                        console.log(msg);
                        //刚好抵扣，退出
                        if(prePayPrice==0){
                            isEnoughPay =true;
                            break;
                        }
                    }
                }
                console.log('leftVouchers',that.leftVouchers);
                console.log('writeOffVouchers',that.writeOffVouchers);
                console.log('endVouchers',that.endVouchers);
                if(!isEnoughPay){
                    msg='还需抵扣金额'+prePayPrice+'元';
                    msgList.push(msg);
                    console.log(msg);
                    uni.showToast({
                        icon:'none',
                        title:'消费金额不能完全抵扣'
                    })
                    that.getList('TO_BE_USE');
                    that.isLoad = false;
                    return;
                }

                //更新核销记录
                let res = await wx.cloud.callFunction({
                    name:'vou',
                    data:{
                        $url:'writeOffVoucher',
                        leftVouchers:that.leftVouchers,
                        writeOffVouchers:that.writeOffVouchers,
                        endVouchers:that.endVouchers,
                    }
                });
                // 并跳转到核销完成页面
                that.tabCur=1;
                that.getList('USED');
                uni.showToast({
                    icon:'success',
                    title:'使用成功'
                });
                that.isLoad = false;
                setTimeout(function(){
                    that.modalName = null;
                },1000);
            },

            showWriteOffModal(e) {
                this.modalName = e.currentTarget.dataset.target
            },

            hideWriteOffModal(e) {
                this.modalName = null
            }
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
	.toUp{
		text-transform: uppercase;
	}
</style>
