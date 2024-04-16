<template>
	<view>
		<cu-custom :isBack="true" :isHeight="true">
			<block slot="content">{{cardName}}</block>
			<block slot="right">
				<view class="action">
					<view class="cu-load load-cuIcon" :class="isLoad?'loading':'over'"></view>
				</view>
			</block>
		</cu-custom>
		<view class="quan">
			<veiw>
				<view class="font50">选择要创建的券类型</view>
				<view class="text-gray ">明确后将为你提供更准确的服务</view>
			</veiw>
			<view class="flex card bg-white"  v-for="(item,index) in list" :key="item"  @tap="go(item)">
				<view class="quan-text">
					<view class="font50 cuIcon-move font-bold" :class="'text-'+item.bg_color"></view>
					<view class="font32 line35">{{item.title}}</view>
					<view class="line35">{{item.sub_title}}</view>
				</view>
				<view class="rel quan-right">
					<view class="abs quan-icon">
						<view class="abs quan-icon-icon text-grey" :class="item.icon"></view>
					</view>
				</view>
			</view>
			<view class="cu-tabbar-height"></view>
		</view>
		<view class="cu-bar bg-white tabbar border shop foot">
			<button class="action" @tap="goProduct">
				<view class="cuIcon-goods"></view>产品
			</button>
			<button class="action" @tap="goMyCard" >
				<view class="cuIcon-vipcard"></view>名片
			</button>
			<view class="action" @tap="goMyHome">
				<view class="cuIcon-people"></view>我的
			</view>
			<view class="submit text-lg" ></view>
		</view>
	</view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex'


	export default {
		components:{
		},
		data() {
			return {
                isLoad:false,
                cardId:'',
                cardName:'',
			    list:[],
                page: 1,
                isEndPage:false,//最后一页
                loadingType: 1,//上拉的状态：0-loading前；1-loading中；2-没有更多了
                isUps:false,
                selectedTemplateId:'-1'//选中卡券模版ID
			}
		},

        onLoad(option) {
		    let that = this;
            that.getList();
        },
		computed:{
			...mapState(['user']),
		},
		methods: {
            go(item){
                console.log('go url','/pagesVoucher/biz-voucher/ActivityInput?cardId='+ this.user.userInfo.bizCardId+'&cardName='+this.user.userInfo.bizCardName+'&templateId='+item._id);
                //代金券
                if(item.type_code=='DJQ'){
                    uni.navigateTo({
                        "url": '/pagesVoucher/biz-voucher/ActivityInput?cardId='+ this.user.userInfo.bizCardId+'&cardName='+this.user.userInfo.bizCardName+'&templateId='+item._id,
                    })
				}else{
                    uni.showToast({
                        icon:'none',
                        title:'暂未开放:'+item.type_name
                    });
				}

            },
            async getList() {
                let that = this;
                this.isLoad=true;
                that.loadingType = 1;
                let res = await wx.cloud.callFunction({
                    name:'vou',
                    data:{
                        $url:'getTemplateList',
                        page:that.page
                    }
                });
                console.log('getTemplateList',res.result);
                let result=res.result;
                if (result.code == 0) {
                    if (that.page == 1) {
                        that.isEndPage = false;
						that.list = [];
                    }
                    result.data.forEach(template => {
						that.list.push(template);
                    })
                }
                //后面没数据了
                if(result.data.length<10){
                    that.isEndPage = true;
                    that.loadingType = 2;
                }
                that.isLoad=false;
            },
            goMyHome(){
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
		}
	}
</script>

<style>
	page {
		padding-top: 45rpx;
	}
	.quan{
		padding: 20rpx 50rpx;
	}
	.font50{
		font-size: 50rpx;
	}
	.card{
		margin-top: 30rpx;
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

</style>
