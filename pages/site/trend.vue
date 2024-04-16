<template>
    <view>
        <cu-custom  :isBack="true">
			<block slot="backText">返回</block>
            <block slot="content">{{title}}</block>
        </cu-custom>
        <scroll-view scroll-y>
			<ups-waterfalls ref="trendWaterfalls" :list="list">
				<view v-for="(item, index) of list" :key="index" slot="slot{{index}}">
					<view class="text-cut" >
						<view class="title padding-sm">{{ item.title }}</view>
					</view>
				</view>
			</ups-waterfalls>
            <view class="cu-tabbar-height"></view>
        </scroll-view>
    </view>
</template>

<script>
    import { mapState } from 'vuex'
	import upsWaterfalls from '@/components/ups-waterfalls/index.vue'
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    // #endif

    export default {
		components:{
		    'ups-waterfalls':upsWaterfalls,
		},
        data() {
            return {
				title:'',
                list: [],
                page: 1,
            }
        },

        onLoad(options) {
			this.title=options.title;
            this.getList()
        },
        onPullDownRefresh() {
            this.page=1
            this.getList()
            uni.stopPullDownRefresh(); // 停止刷新
        },
        onReachBottom() {
			this.page++;
			this.getList()
        },
        computed:{
            ...mapState(['user']),
        },
        methods:{
            async getList(){
                let that = this
                if (that.page == 1) {
                    that.list=[];
                }
                let dataList = [];
                let res = {};
                res = await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'getTrendListByCardId',
                        cardId:that.user.userInfo.bizCardId,
                        page:that.page
                    }
                });
                dataList=res.result.data;
                dataList.forEach(each => {
                    that.list.push({id:each._id,image_url:each.cover,title:each.title||'',carousels:each.carousels||[]});
                })
            },

            goDetail(id){
                uni.navigateTo({
                    "url":"/pagesCmn/trend/ShareTrendDetail?id="+id
                })
            }
        }
    }
</script>

<style>
</style>
