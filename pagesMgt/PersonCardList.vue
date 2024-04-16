<template>
    <view>
        <cu-custom    :isBack="true">
            <block slot="backText">返回</block>
            <block slot="content">{{title}}</block>
        </cu-custom>
        <view class="cu-bar bg-white search fixed" :style="[{top:(CustomBar) + 'px'}]">
            <view class="search-form round">
                <text class="cuIcon-search"></text>
                <input @focus="inputFocus" @blur="inputBlur" type="text" placeholder="输入搜索的关键词" confirm-type="search"></input>
            </view>
            <view class="action">
                <button class="cu-btn round  text-grey shadow-blur"   @tap="getPersonCardList">搜索</button>
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
                            <view class="text-gray text-sm text-cut" >创建时间：{{formatDateTime(subItem.create_at)}}</view>
                        </view>
                    </view>
                </view>
            </block>
        </scroll-view>
        <view class="cu-tabbar-height"></view>
    </view>
</template>

<script>
    import {mapState,mapMutations} from 'vuex'
    import cmnUtils from '@/utils/cmnUtils.js'
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    // #endif

    export default {
        data() {
            return {
				title:'',
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
		onLoad(options){
			this.title=options.title;
		},

        onShow() {
            this.getPersonCardList();
        },
        onPullDownRefresh() {
            this.list = [];
            this.index = 0;
            this.subList=[];
            this.page = 1;
			this.getPersonCardList();
			uni.stopPullDownRefresh(); // 停止刷新
        },
      
        computed: {
            ...mapState(['user']),
            formatDateTime(){
                return function(time){
                    let currentTime = time;
                    if(currentTime){
                        return cmnUtils.formatTime(currentTime,'yyyy-MM-dd HH:mm')
                    }else{
                        return "";
                    }
                }
            },
        },
        methods: {
            ...mapMutations(['updateUser']),

            async getPersonCardList() {
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
                        $url: 'searchPersonCardList',
                        search_str: that.search_str
                    }
                });
                that.searchList = res.result.data || [];
                // #endif
                // #ifdef H5
                res= await cloudbase.callFunction({
                    name: 'web',
                    data: {
                        $url: 'searchPersonCardList',
                        search_str: that.search_str
                    }
                });
                that.searchList = JSON.parse(res.result.data) || [];
                // #endif
                that.sortPersonCardList();
                that.$forceUpdate()
            },

            async getNextPage(){
                let that = this;
                let res = null;
                // #ifdef MP-WEIXIN
                res= await wx.cloud.callFunction({
                    name: 'sys',
                    data: {
                        $url: 'searchPersonCardList',
                        search_str: that.search_str
                    }
                });
                that.searchList = res.result.data || [];
                // #endif
                // #ifdef H5
                res= await cloudbase.callFunction({
                    name: 'web',
                    data: {
                        $url: 'searchPersonCardList',
                        search_str: that.search_str
                    }
                });
                that.searchList = JSON.parse(res.result.data) || [];
                // #endif
                if (that.searchList.length == 0 || that.page >= 5) {
                    return;
                }
                that.sortPersonCardList();
            },

            sortPersonCardList(){
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
                    "url": "/pagesSys/card/CardDetailExt?id=" + cardId,
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
</style>
