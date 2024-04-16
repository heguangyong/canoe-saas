<template name="main">
	<view>
    <cu-custom :isBack="false">
      <block slot="content">我的名片</block>
    </cu-custom>
    <view style="margin:100rpx 0 100rpx 0; ">
    <ups-card :card="card">
    </ups-card>
    </view>
    <view class="margin-top-xl card-bg">
      <image src="https://7072-prod-9goq82ctb17bd75f-1306535128.tcb.qcloud.la/resource/wave.gif" mode="scaleToFill" class="gif-wave"></image>
    </view>
    <view class="padding flex text-center text-grey bg-white shadow-warp">
      <view class="flex flex-sub flex-direction solid-right" @click="goMsgList">
        <view class="text-xxl text-orange">{{accountSum.newMsgNum}}</view>
        <view class="margin-top-sm">
          <text class="cuIcon-message margin-xs"></text> 新消息</view>
      </view>
      <view class="flex flex-sub flex-direction solid-right"  @click="goWishOrderList">
        <view class="text-xxl text-blue">{{accountSum.wishOrderNum}}</view>
        <view class="margin-top-sm">
          <text class="cuIcon-goods margin-xs"></text> 购物袋</view>
      </view>
      <view class="flex flex-sub flex-direction" @click="goTotalOrderList">
        <view class="text-xxl text-green">{{accountSum.totalOrderNum}}</view>
        <view class="margin-top-sm">
          <text class="cuIcon-ticket margin-xs"></text> 全部订单</view>
      </view>
    </view>

    <view class="margin-top-xl">
      <view class="n-list">
        <view hover-class="none" @tap="goItem" class="nav-li" navigateTo :class="'bg-'+item.color"
              :style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]" v-for="(item,index) in bizCard.site" :key="index" :data-item="bizCard.site[index]">
          <view class="nav-title">{{item.title}}</view>
          <view class="nav-name">{{item.name}}</view>
          <text :class="'cuIcon-' + item.cuIcon"></text>
        </view>
      </view>
    </view>
    <view class="cu-tabbar-height"></view>
	</view>
</template>

<script>
    import { mapState, mapMutations} from 'vuex';
    import upsCard from '@/components/ups-card/index.vue';
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    // #endif

	export default {
		name: "site",
    components:{
      'ups-card':upsCard,
    },
		data() {
			return {
          card:{name:'',remark:''},
          accountSum:{
            newMsgNum:0,
            wishOrderNum:0,
            totalOrderNum:0
          },
			    bizCard:{
			        site_bg:'',
            site:[
                {
                    title: '最新产品',
                    name: 'product',
                    color: 'white',
                    cuIcon: 'shop',
                    isOpen: true,
                    auth:true
                },
                // {
                //     title: '公司展厅',
                //     name: 'trend',
                //     color: 'mauve',
                //     cuIcon: 'pic',
                //     isOpen: true,
                //     auth:true
                // },
                {
                    title: '线上活动',
                    name: 'activity',
                    color: 'white',
                    cuIcon: 'activity',
                    isOpen: true,
                    auth:true
                }
                // {
                //     title: '客服沟通',
                //     name: 'service',
                //     color: 'blue',
                //     cuIcon: 'service',
                //     isOpen: true,
                //     auth:true
                // },
                //
                // {
                //     title: '园区企业',
                //     name: 'company',
                //     color: 'red',
                //     cuIcon: 'moreandroid',
                //     isOpen: true,
                //     auth:true
                // },
                // {
                //     title: '关于我们',
                //     name: 'about',
                //     color: 'green',
                //     cuIcon: 'info',
                //     isOpen: true,
                //     auth:true
                // }
            ]
				},
			};
		},

    onShareAppMessage(res){
      if(res.from==='button'){
      }
      return{
        title:'这是'+this.card.name+'的名片，请惠存。',
        imageUrl:this.card.cover||'',
        path:"/pagesSys/card/ShareCardDetail?id="+this.card._id,
        success:function(res){
        }
      }
    },

      onReady() {
        this.getDetail();
      },

      onShow(){
          let that =this;
          that.needWxAuth();
          if(that.needAuthFlag){
              return;
          }
          that.getAccountSum();
          that.getSiteElements();
      },

      computed:{
          ...mapState(['needAuthFlag','user']),
      },

      methods: {
          ...mapMutations(['needWxAuth','wxAuth','updateUser']),

        async getDetail(){
          let that = this;
          if(that.user._id){
            let res = {};
            res = await wx.cloud.callFunction({
              name:'sys',
              data:{
                $url:'getCardDetailByUserId',
                userId:that.user._id
              }
            });
            that.card = res.result.data;
            that.cardId=that.card._id;
            that.accounts=[];
            that.user.userInfo.accounts.forEach(each=>{
              if(!each.is_forbidden){
                that.accounts.push(each);
              }
            });
          }
        },

        goMsgList(){
          let that = this;
          if(that.needAuthFlag){
            that.wxAuth(that.authBizInfo);
            return;
          }
          uni.navigateTo({
            "url":"/pagesSys/my/MsgList"
          })
        },

        async getAccountSum(){
          let that = this;
          let res = null;
          if(that.needAuthFlag){
            that.wxAuth(that.authBizInfo);
            return;
          }
          // #ifdef MP-WEIXIN
          res = await wx.cloud.callFunction({
            name:'cmn',
            data:{
              $url:'getSum',
              userId:that.user._id,
              sourceId:that.user.userInfo.cardId,
              targetId: that.user.userInfo.bizCardId,
            }
          });
          if(res.result.code==0){
            that.accountSum = res.result.data;
          }
          // #endif
          // #ifdef H5
          res = await cloudbase.callFunction({
            name:'web',
            data:{
              $url:'getSum',
              userId:that.user._id,
              sourceId:that.user.userInfo.cardId,
              targetId: that.user.userInfo.bizCardId,
            }
          });
          that.accountSum = JSON.parse(res.result.data);
          // #endif
        },

        goWishOrderList(){
          let that = this;
          if(that.needAuthFlag){
            that.wxAuth(that.authBizInfo);
            return;
          }
          uni.navigateTo({
            "url":"/pagesSys/my/WishOrderList"
          })
        },

        goTotalOrderList(){
          let that = this;
          if(that.needAuthFlag){
            that.wxAuth(that.authBizInfo);
            return;
          }
          uni.navigateTo({
            "url":"/pagesSys/my/TotalOrderList"
          })
        },

        async getSiteElements(){
            let that = this;
            let res = null;
            // #ifdef MP-WEIXIN
            res = await wx.cloud.callFunction({
                name:'sys',
                data:{
                    $url:'getCardDetailById',
                    id:that.user.userInfo.bizCardId
                }
            });
            that.bizCard = res.result.data;
            // #endif
            // #ifdef H5
            res = await cloudbase.callFunction({
                name:'web',
                data:{
                    $url:'getCardDetailById',
                    id:that.user.userInfo.bizCardId
                }
            });
            that.bizCard = JSON.parse(res.result.data);
            // #endif
        },

        goItem(e){
                  let that = this;
                  console.log('item auth', e.currentTarget.dataset.item,'needWxAuth',this.needWxAuth(this.bizCard));
                  let item = e.currentTarget.dataset.item;
                  if(item.auth){
                      if(that.needAuthFlag){
                          that.wxAuth(that.bizCard);
                          return;
                      }
          }
          if(item.isOpen){
                      uni.navigateTo({'url':'/pagesSys/site/'+item.name})
          }else{
                      uni.showToast({
                          icon:'none',
                          title:'此功能暂未开通'
                      });
          }

        },
        goWebLogin(){
            uni.navigateTo({
                "url":"/pages/my/WebLogin"
            })
        },
		},
	}
</script>
<style>
	.page {
		height: 100vh;
	}
  .n-list{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .card-bg {
    background-size: cover;
    display: flex;
    justify-content: center;
    padding-top: 40rpx;
    overflow: hidden;
    position: relative;
    flex-direction: column;
    align-items: center;
    color: #fff;
    font-weight: 300;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  }
  .card-bg image {
    width: 200rpx;
    height: 200rpx;
  }

  .card-bg .gif-wave{
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 99;
    mix-blend-mode: screen;
    height: 100rpx;
  }
</style>
