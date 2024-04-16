<template>
    <view class="" :class="isUps == true ? 'prevent' : ''">
        <cu-custom    :isBack="true">
			<block slot="backText">返回</block>
            <block slot="content">{{title}}</block>
        </cu-custom>
        <scroll-view scroll-y style="margin-top: -60px;" :style="[{height:'calc(100vh - '+ CustomBar + 'px + 50px)'}]">
            <block v-for="(item,index) in list" :key="index">
                <view class="padding">{{list[index].group}}</view>
                <view class="cu-list menu-avatar no-padding">
                    <view class="cu-item  card-radius margin-top-xxs margin-left-xs margin-right-xs margin-bottom-xs shadow bg-white.light"
                          @longpress="popupOperateCard(index,subIndex,subItem.id)"  v-for="(subItem,subIndex) in item.subList" :key="subIndex">
                        <view  class="cu-avatar round" @tap="goDetail(subItem.id)" >
                            <image :src="subItem.avatar" mode="aspectFill" class="cu-avatar round"></image>
                            <view class="cu-tag badge" v-if="subItem.unread>0">{{subItem.unread}}</view>
                        </view>
                        <view class="content" @tap="startTalk(subItem.id)">
                            <view class="text-grey">{{subItem.name}}
                                <text class="text-abc"></text>
                            </view>
                            <view class="text-gray text-sm text-cut" >{{subItem.last_history}}</view>

                        </view>
                        <view class="action"  @tap="startTalk(subItem.id)">
                            <text class="cuIcon-message text-grey" style="font-size: 38rpx;"></text>
                            <view class="text-gray text-xs" >{{subItem.last_time}}</view>
                        </view>
                    </view>
                </view>
            </block>
        </scroll-view>
        <!--遮罩-->
        <view class="shade" v-if="isUps"></view>
        <!-- 底部扩展功能弹窗 -->
        <uni-popup ref="showPopupOperate" type="bottom" @change="change">
            <view class="card-popup bg-white">
                <!--只能删除消息-->
                <view class="card-popup-content" @click="removeCard">
                    <text class="remove-popup-btn" >删除</text>
                </view>
                <text class="card-popup-btn" @click="cancel('PopupOperate')">取消</text>
            </view>
        </uni-popup>
    </view>
</template>

<script>
    import {mapState,mapMutations} from 'vuex'
    import cmnUtils from '@/utils/cmnUtils.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    // #endif

    export default {
		components: {
		    "uni-popup":uniPopup
		},
        data() {
            return {
				title:'',
				bizCard: {},
                listGroup: {},//包含字母分组的名片
                holderIdList: [],//收藏的名片ID数组
				StatusBar: this.StatusBar,
                CustomBar: this.CustomBar,
                list: [{}],
                index: -1,//list index
                subList:[],//list.subList 字母分类下的名片数组
				page: 1,
                isUps:false,
                selectedIdx:-1,//选中索引
                selectedSubIdx:-1,//选中子索引
                selectedCardId:'-1'//选中名片ID
            }
        },
		onLoad(options) {
			this.title=options.title;
            this.getBizCard();
        },

        onShow() {
            this.getBizHolder();
        },
        onPullDownRefresh() {
			this.getBizCard();
			uni.stopPullDownRefresh(); // 停止刷新
        },
      
        computed: {
            ...mapState(['user']),
        },
        methods: {
            ...mapMutations(['updateUser']),
			async getBizCard() {
			    let that = this;
                let res = null;
                // #ifdef MP-WEIXIN
                res= await wx.cloud.callFunction({
			        name: 'sys',
			        data: {
			            $url: 'getCardDetailById',
			            id: that.user.userInfo.bizCardId,
			        }
			    });
                that.bizCard = res.result.data;
                // #endif
                // #ifdef H5
                res= await cloudbase.callFunction({
                    name: 'web',
                    data: {
                        $url: 'getCardDetailById',
                        id: that.user.userInfo.bizCardId,
                    }
                });
                that.bizCard = JSON.parse(res.result.data);
                // #endif
			},
            async getBizHolder() {
                let that = this;
                that.list =[];
                //根据cardId检索收藏的历史名片
                let res = null;
                let msgList =[];
                // #ifdef MP-WEIXIN
                res = await wx.cloud.callFunction({
                    name: 'sys',
                    data: {
                        $url: 'getCardHolderByCardId',
                        cardId: that.user.userInfo.bizCardId
                    }
                });
                msgList = res.result.data;
                // #endif
                // #ifdef H5
                res = await cloudbase.callFunction({
                    name: 'web',
                    data: {
                        $url: 'getCardHolderByCardId',
                        cardId: that.user.userInfo.bizCardId
                    }
                });
                msgList = JSON.parse(res.result.data);
                // #endif

                //按字母分组的名片
                if(!msgList){
                    return;
                }
                that.listGroup = msgList.cards || {};
                that.holderIdList = msgList.search_data || [];
                let chatIdList = [that.cardId];
                for(let idIdx in that.holderIdList){
                    chatIdList.push(that.holderIdList[idIdx].id);
                }
                //获取聊天室信息
                let chatRooms = [];
                // #ifdef MP-WEIXIN
                res = await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'getChatRoomList',
                        chatIdList:chatIdList
                    }
                });
                chatRooms = res.result.data;
                // #endif
                // #ifdef H5
                res = await cloudbase.callFunction({
                    name:'web',
                    data:{
                        $url:'getChatRoomList',
                        chatIdList:chatIdList
                    }
                });
                chatRooms = JSON.parse(res.result.data);
                // #endif

                let index = 0;
                for (let key in that.listGroup) {
                    let isExist=false;
                    that.listGroup[key].forEach(each=>{
                        isExist = true;
                        for(let idx in chatRooms){
                            let currentRoom = chatRooms[idx];
                            //有聊天，进行匹配解析
                            if(each.room_id && each.room_id==currentRoom._id){
                                let unread = 0
                                if(each.id==currentRoom.source_id && currentRoom.target_unread>0){
                                    unread = currentRoom.target_unread;
                                }else if(each.id==currentRoom.target_id && currentRoom.source_unread>0){
                                    unread = currentRoom.source_unread;
                                }
                                //补充聊天室信息
                                each.last_history = currentRoom.last_history;
                                each.last_time = cmnUtils.getDateDiff(currentRoom.last_time);
                                each.unread = unread;
                                break;
                            }
                        }
                    });
                    if(isExist){
                        that.list[index] = {};
                        that.list[index].group = key;
                        that.list[index].subList = that.listGroup[key];
                        index++;
                    }
                }
                that.$forceUpdate()
            },

			goDetail(cardId) {
                uni.navigateTo({
                    "url": "/pagesSys/card/ShareCardDetail?id=" + cardId,
                })
            },
			
            popupOperateCard(index,subIndex,cardId){
                let that = this;
                that.selectedIdx = index;
                that.selectedSubIdx = subIndex;
                that.selectedCardId = cardId;
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
           

            //删除收藏的名片
            async removeCard(){
                let that = this;
                // #ifdef MP-WEIXIN
                await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'removeCardFromHolder',
                        siteCardId:that.cardId,//公司网站
                        groupKey:that.list[that.selectedIdx].group,//字母key
                        subIndex:that.selectedSubIdx,
                        cardId:that.selectedCardId
                    }
                });
                // #endif
                // #ifdef H5
                await cloudbase.callFunction({
                    name:'sys',
                    data:{
                        $url:'removeCardFromHolder',
                        siteCardId:that.cardId,//公司网站
                        groupKey:that.list[that.selectedIdx].group,//字母key
                        subIndex:that.selectedSubIdx,
                        cardId:that.selectedCardId
                    }
                });
                // #endif

                //更新缓存
                if(that.index>0 && that.selectedSubIdx>0){
                    let existIdx = -1;
                    for(let i in that.holderIdList){
                        if(that.holderIdList[i].id ==that.selectedCardId){
                            existIdx = i;
                            break;
                        }
                    }
                    that.holderIdList.splice(existIdx,1);

                    for(let j in that.list){
                        if(that.list[j].group==that.listGroup[that.selectedIdx]){
                            existIdx = j;
                        }
                    }
                    that.list[existIdx].subList.splice(that.selectedSubIdx,1);
                    that.selectedIdx=-1;
                    that.selectedSubIdx=-1;
                    that.selectedCardId='-1';
                }

                uni.showToast({ icon:'success',title:'删除成功'});
                that.getBizHolder();
                that.$refs['showPopupOperate'].close()
                that.$forceUpdate()
            },

            //创建聊天
            async startTalk(targetCardId){
                // #ifdef MP-WEIXIN
                uni.navigateTo({
                    "url":"/pagesSys/site/service?sourceCardId="+this.user.userInfo.bizCardId+"&targetCardId=" + targetCardId
                })
                // #endif
                // #ifdef H5
                uni.navigateTo({
                    "url":"/pagesSys/site/WebService?sourceCardId="+this.user.userInfo.bizCardId+"&targetCardId=" + targetCardId
                })
                // #endif
            },
        }
    }
</script>

<style>
    page {
        padding-top: 100upx;
    }

    .card-radius {
        border-radius: 10upx;
    }
    /* 起到固定的作用 ,从而解决原页面触摸穿透的问题*/
    .prevent {
        width: 100%;
        height: 100%;
        /*自动回到顶部*/
        /*position: fixed;*/
        top: 0;
        left: 0;
        overflow: hidden;
    }
    /* 遮罩样式 */
    .shade{
        width:100%;
        height: 100%;
        position: fixed;
        top:0;
        left:0;
        z-index: 90;
    }
    /* 底部分享 */
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
</style>
