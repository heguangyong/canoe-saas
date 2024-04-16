<!--
客户来源说明：
所有客户均来自于访问名片，客户列表对应与名片收藏夹中名片列表
客户列表哪里来的？
每次用户打开一张名片，系统将会自动记录该用户成为被打开名片的一个收藏名片即为该名片的客户-->
<template>
    <view>
        <cu-custom    :isBack="true">
            <block slot="content">我的用户</block>
            <block slot="right">
                <view class="action">
                    <view class="cu-load load-cuIcon" :class="isLoad?'loading':'over'"></view>
                </view>
            </block>
        </cu-custom>
        <view class="cu-bar bg-white search fixed" :style="[{top:(CustomBar) + 'px'}]">
            <view class="search-form round">
                <text class="cuIcon-search"></text>
                <input @focus="inputFocus" @blur="inputBlur" type="text" placeholder="输入搜索的关键词" confirm-type="search"></input>
            </view>
            <view class="action">
                <button class="cu-btn round  text-grey shadow-blur"     :disabled="isLoad" @tap="getList">搜索</button>
            </view>
        </view>
        <scroll-view scroll-y>
            <block v-for="(item,index) in list" :key="index">
                <view class="padding">{{list[index].group}}</view>
                <view class="cu-list menu-avatar no-padding">
                    <view class="cu-item  card-radius margin-top-xxs margin-left-xs margin-right-xs margin-bottom-xs shadow bg-white.light"  v-for="(subItem,subIndex) in item.subList" :key="subIndex">
                        <view  class="cu-avatar round lg" @tap="goDetail(subItem.id)" @longpress="popupOperateCard(list[index].group,subIndex,subItem)">
                            <image :src="subItem.avatar" mode="aspectFill" class="cu-avatar round lg"></image>
                        </view>
                        <view class="content" @tap="goCustomerVoucherList(subItem)" @longpress="popupOperateCard(list[index].group,subIndex,subItem)">
                            <view class="text-grey">{{subItem.name}}
                                <text v-if="checkWriteOffRole(subItem)" class="cu-tag round sm line-grey">核销员</text>
                                <text class="text-abc"></text>
                            </view>
                            <view class="text-gray text-sm">{{subItem.position?subItem.position:''}}</view>
                        </view>
                    </view>
                </view>
            </block>
            <view class="cu-tabbar-height"></view>
        </scroll-view>
        <view class="cu-bar bg-white tabbar border shop foot">
            <button class="action" @tap="goProduct">
                <view class="cuIcon-home"></view>产品
            </button>
            <button class="action" @tap="goMyCard" >
                <view class="cuIcon-global"></view>名片
            </button>
            <view class="action" @tap="goMyHome">
                <view class="cuIcon-apps"></view>我的
            </view>
            <view class="submit text-lg"></view>
        </view>
        <!-- 底部扩展功能弹窗 -->
        <uni-popup ref="showPopupOperate" type="bottom" @change="change">
            <view class="card-popup bg-white">
                <view v-if="isWriteOff" class="card-popup-content" @click="setWriteOff(true)">
                    <text class="popup-btn" >取消核销资格</text>
                </view>
                <view v-else class="card-popup-content" @click="setWriteOff(false)">
                    <text class="popup-btn" >设为核销员</text>
                </view>
                <text class="card-popup-btn" @click="cancel('PopupOperate')">取消</text>
            </view>
        </uni-popup>
    </view>
</template>

<script>
    import {mapState,mapMutations} from 'vuex'

    export default {
        components: {
        },
        data() {
            return {
                cardId:'',//传入商务名片的ID
                listGroup: {},//包含字母分组的名片
                CustomBar: this.CustomBar,
                list: [{}],
                index: -1,//list index
                subList:[],//list.subList 字母分类下的名片数组
                search_str: '',//检索关键字
                isLoad: false,
                isUps:false,
                selectedId:'-1',//选中名片ID
                selectedGroupKey:'',
                selectedSubIndex:'',
                selectedItem:'',
                isWriteOff:false//是否核销员
            }
        },

        onLoad(opt) {
            this.cardId = opt.cardId;
            console.log(opt.cardId);
        },

        onReady() {
            let that = this;
            that.showSchoolCard=that.user.showSchoolCard;
        },

        onShow() {
            this.getList();
        },
        onPullDownRefresh() {
            this.getList();
            uni.stopPullDownRefresh(); // 停止刷新
        },
        onReachBottom() {
        },
        computed: {
            ...mapState(['user']),
            checkWriteOffRole(){
                return function(item){
                    let currentRole = item.role||'';
                    // console.log('checkRole',currentRole);
                    return currentRole.indexOf('writeOff')>-1;
                }
            }
        },
        methods: {
            ...mapMutations(['updateUser']),
            async getList() {
                let that = this;
                that.list =[];
                that.isLoad = true;
                //根据cardId检索收藏的历史名片
                let res = await wx.cloud.callFunction({
                    name: 'sys',
                    data: {
                        $url: 'getCardHolderByCardId',
                        cardId: that.cardId
                    }
                });
                let result = res.result;
                if (result.code == 0 && result.data) {
                    //按字母分组的名片
                    that.listGroup = result.data.cards || {};
                    let index = 0;
                    let searchFlag = that.search_str.length>0 ;
                    for (let key in that.listGroup) {
                        that.listGroup[key].forEach(each=>{
                            let search_str = each.search_str||'';
                            //全部会员
                            if(!searchFlag){
                                that.list[index] = {};
                                that.list[index].group = key;
                                that.list[index].subList = that.listGroup[key];
                                index++;
                            }
                            //检索
                            else if(search_str.indexOf(that.search_str)>-1){
                                that.list[index] = {};
                                that.list[index].group = key;
                                that.list[index].subList = that.listGroup[key];
                                index++;
                            }
                        })
                    }
                }
                that.isLoad = false;
                that.$forceUpdate()
            },

            inputFocus(e) {
                console.log(e)
            },
            inputBlur(e) {
                console.log(e);
                this.list = [];
                this.search_str = e.detail.value;
                this.page = 1;
            },


            popupOperateCard(groupKey,subIndex,cardItem){
                let that = this;
                console.log('popupOperateCard',groupKey,subIndex,cardItem);
                that.selectedId = cardItem.id;
                that.selectedGroupKey = groupKey;
                that.selectedSubIndex = subIndex;
                that.selectedItem = cardItem;
                let role=cardItem.role||'';
                that.isWriteOff=role.indexOf('writeOff')>-1;
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

            //设为/取消 核销资格
            async setWriteOff(isCancel){
                let that = this;
                let role = that.selectedItem.role;
                if(isCancel){
                    if(role.indexOf('writeOff')>-1){
                            let startPoint = role.indexOf('writeOff');
                            that.selectedItem.role=role.substr(0,startPoint)+role.substr(startPoint+8);
                    }
                }else{
                    if(that.selectedItem.role){
                        if(that.selectedItem.role.length>0){
                            that.selectedItem.role+=',writeOff';
                        }
                    }else{
                        //核销角色
                        that.selectedItem.role= 'writeOff';
                    }
                }
                await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'updateCardFromBizHolder',
                        cardId:that.cardId,
                        groupKey:that.selectedGroupKey,//字母key
                        subIndex:that.selectedSubIndex,
                        card:that.selectedItem
                    }
                });
                console.log('核销员员更新完成',that.cardId,that.selectedGroupKey,that.selectedSubIndex,that.selectedItem);
                that.getList();
                that.$refs['showPopupOperate'].close();
            },

            goHome(){
                uni.reLaunch({
                    url: '/pages/my/home',
                })
            },
			goMyCard(){
			    uni.navigateTo({
			        "url":"/pagesSys/card/CardDetail"
			    })
			},
			goProduct(){
			    uni.reLaunch({
			        "url": "/pages/site/product",
			    })
			},

            goDetail(cardId) {
                console.log('goDetail', cardId);
                uni.navigateTo({
                    "url": "/pagesSys/card/CardDetail?id=" + cardId,
                })
            },

            goCustomerVoucherList(customer){
                console.log('customer', customer);
                uni.navigateTo({
                    "url": "/pagesVoucher/vou-customers/CustomerVoucherList?id=" + customer.user_id+'&cardId='+this.cardId+'&title='+customer.name,
                })
            },
        }
    }
</script>

<style>
    ﻿page {
        padding-top: 100upx;
    }

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

    .popup-btn {
        height: 90rpx;
        line-height: 90rpx;
        font-size: 14px;
        text-align: center;
        color: #666;
    }
</style>

