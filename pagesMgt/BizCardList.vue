<template>
    <view>
        <cu-custom    :isBack="true">
            <block slot="backText">返回</block>
            <block slot="content">园区公司</block>
        </cu-custom>
        <view class="cu-bar bg-white search fixed" :style="[{top:(CustomBar) + 'px'}]">
            <view class="search-form round">
                <text class="cuIcon-search"></text>
                <input @focus="inputFocus" @blur="inputBlur" type="text" placeholder="输入搜索的关键词" confirm-type="search"></input>
            </view>
            <view class="action">
                <button class="cu-btn round  text-grey shadow-blur"   @tap="getBizCardList">搜索</button>
            </view>
        </view>
        <scroll-view scroll-y  :style="[{height:'calc(100vh - '+ CustomBar + 'px)'}]">
            <block v-for="(item,index) in list" :key="index">
                <view class="padding">{{list[index].group}}</view>
                <view class="cu-list menu-avatar no-padding">
                    <view class="cu-item  card-radius margin-top-xxs margin-left-xs margin-right-xs margin-bottom-xs shadow bg-white.light"
                          @tap="goDetail(subItem._id)"  v-for="(subItem,subIndex) in item.subList" :key="subIndex">
                        <view  class="cu-avatar round" >
                            <image :src="subItem.avatar" mode="aspectFill" class="cu-avatar round"></image>
                        </view>

                        <view class="content" >
                            <view class="text-grey">{{subItem.name}}
                                <text class="text-abc"></text>
                            </view>
                            <view class="text-gray text-sm text-cut" >{{subItem.mailing_address}}</view>
                        </view>
                    </view>
                </view>
            </block>
        </scroll-view>
        <view class="cu-bar bg-white tabbar border foot">
            <button class="action" @tap="goMy">
                <view class="cuIcon-my"></view>我的
            </button>
            <!--  #ifdef MP-WEIXIN -->
            <view class="bg-red submit text-lg" @tap="goAdd">录入新公司</view>
            <!--  #endif -->
            <!--  #ifdef H5 -->
            <view class="bg-white submit text-lg"></view>
            <!--  #endif -->
        </view>
    </view>
</template>

<script>
    import {mapState,mapMutations} from 'vuex'
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    // #endif

    export default {
        data() {
            return {
                search_str:'',
                searchList: [{}],
                listGroup: {},//包含字母分组的名片
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


        onShow() {
            this.getBizCardList();
        },
        onPullDownRefresh() {
            this.list = [];
            this.index = 0;
            this.subList=[];
            this.page = 1;
			this.getBizCardList();
			uni.stopPullDownRefresh(); // 停止刷新
        },
      
        computed: {
            ...mapState(['user']),
        },
        methods: {
            ...mapMutations(['updateUser']),

            async getBizCardList() {
                let that = this;
                that.list = [];
                that.index = 0;
                that.subList=[];
                this.page = 1;
                //根据cardId检索收藏的历史名片
                let res = null;
                // #ifdef MP-WEIXIN
                res= await wx.cloud.callFunction({
                    name: 'sys',
                    data: {
                        $url: 'searchBizCardList',
                        search_str: that.search_str
                    }
                });
                that.searchList = res.result.data || [];
                // #endif
                // #ifdef H5
                res= await cloudbase.callFunction({
                    name: 'web',
                    data: {
                        $url: 'searchBizCardList',
                        search_str: that.search_str
                    }
                });
                that.searchList = JSON.parse(res.result.data) || [];
                // #endif
                if(that.searchList.length>0){
                    that.sortBizCardList();
                    that.$forceUpdate()
                }
            },

            async getNextPage(){
                let that = this;
                let res = null;
                // #ifdef MP-WEIXIN
                res= await wx.cloud.callFunction({
                    name: 'sys',
                    data: {
                        $url: 'searchBizCardList',
                        search_str: that.search_str
                    }
                });
                that.searchList = res.result.data || [];
                // #endif
                // #ifdef H5
                res= await cloudbase.callFunction({
                    name: 'web',
                    data: {
                        $url: 'searchBizCardList',
                        search_str: that.search_str
                    }
                });
                that.searchList = JSON.parse(res.result.data) || [];
                // #endif
                if (that.searchList.length == 0 || that.page >= 5) {
                    return;
                }
                that.sortBizCardList();
            },

            sortBizCardList(){
                let that = this;
                //字母索引
                let start_group_index = that.searchList[0].group_index;
                for (let searchIndex in that.searchList) {
                    let match = false;
                    //自己排除在外
                    if (that.user._id == that.searchList[searchIndex].user_id) {
                        match = true;
                    }

                    //对检索记录结构化分组，适配收藏夹显示索引
                    if (start_group_index == that.searchList[searchIndex].group_index) {

                        that.subList.push(that.searchList[searchIndex])
                    } else {
                        that.list[that.index] = {};
                        that.list[that.index].group = start_group_index;
                        that.list[that.index].subList = that.subList;
                        that.index++;
                        that.subList = [];
                        start_group_index = that.searchList[searchIndex].group_index;

                        that.subList.push(that.searchList[searchIndex]);
                    }
                    if (searchIndex == that.searchList.length - 1) {
                        that.list[that.index] = {};
                        that.list[that.index].group = start_group_index;
                        that.list[that.index].subList = that.subList;
                    }
                }
                // console.log('list',that.list,'index',that.index,'subList',that.subList);

                that.$forceUpdate()
            },

            inputFocus(e) {
                console.log(e)
            },

            inputBlur(e) {
                console.log(e)
                this.searchList = [];
                this.search_str = e.detail.value;
                this.page = 1;
            },

			goDetail(cardId) {
                uni.navigateTo({
                    "url": "/pagesSys/card/BizAbout?id=" + cardId,
                })
            },
			
            goMy(){
                uni.reLaunch({
                    url:"/pages/my/home"
                })
            },

            goAdd(){
                uni.navigateTo({
                    "url":"/pagesMgt/BizAboutInput"
                })
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
