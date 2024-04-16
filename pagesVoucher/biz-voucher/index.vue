<!--
卡券管理入口；列出所有制券、发券的活动列表
-->
<template>
	<view class="" :class="isUps == true ? 'prevent' : ''">
		<view>
			<cu-custom    :isBack="true">
				<block slot="content">卡券管理</block>
				<block slot="right">
					<view class="action">
						<view class="cu-load load-cuIcon" :class="isLoad?'loading':'over'"></view>
					</view>
				</block>
			</cu-custom>
			<view class="cu-list grid col-5">
				<view class="cu-item" v-for="(action,index) in actions" :key="index" v-if="checkCardAdminRole(user.userInfo.role,action.needRole)" @tap="go(action)">
					<text class="lg text-gray" :class="'cuIcon-' + action.name"></text>
					<text>{{action.title}}</text>
				</view>
			</view>
			<scroll-view scroll-x class="bg-white nav">
				<view class="flex text-center">
					<view class="cu-item flex-sub" :class="index==tabCur?'text-green cur':''" v-for="(item,index) in 3" :key="index" @tap="tabSelect" :data-id="index">
						{{tab[index]}}
					</view>
				</view>
			</scroll-view>
			<slot v-if="tabCur==0">
				<scroll-view scroll-y class="quan">
					<view class="flex card bg-white"  v-for="(item,index) in savedActivities" :key="item"  @longpress="popupOperate(item)">
						<view class="quan-text">
							<view class="font50 cuIcon-move font-bold" :class="'text-'+item.bg_color"></view>
							<view class="flex">
								<view  class="cu-avatar round lg margin-right-sm" @tap="goDetail(item)">
									<image :src="item.avatar" mode="aspectFill" class="cu-avatar round lg"></image>
								</view>
								<view class="content">
									<view class="text-grey text-xl">{{item.name}}
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
					<view class="flex card bg-white"  v-for="(item,index) in InProcessActivities" :key="item"   @longpress="popupOperate(item)">
						<view class="quan-text">
							<view class="font50 cuIcon-move font-bold" :class="'text-'+item.bg_color"></view>
							<view class="flex">
								<view  class="cu-avatar round lg margin-right-sm" @tap="goDetail(item)">
									<image :src="item.avatar" mode="aspectFill" class="cu-avatar round lg"></image>
								</view>
								<view class="content">
									<view class="text-grey text-xl">{{item.name}}
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

			<slot v-if="tabCur==2">
				<scroll-view scroll-y class="quan">
					<view class="flex card bg-white"  v-for="(item,index) in closeActivities" :key="item"   @longpress="popupOperate(item)">
						<view class="quan-text">
							<view class="font50 cuIcon-move font-bold" :class="'text-'+item.bg_color"></view>
							<view class="flex">
								<view  class="cu-avatar round lg margin-right-sm" @tap="goDetail(item)">
									<image :src="item.avatar" mode="aspectFill" class="cu-avatar round lg"></image>
								</view>
								<view class="content">
									<view class="text-grey text-xl">{{item.name}}
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
								<view class='cu-tag round ﻿bg-grey light' >{{item.num_total-item.num_used}}/{{item.num_total}} 张可用</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</slot>
			<view class="cu-tabbar-height"></view>
		</view>

		<view v-if="!isUps" class="cu-bar bg-white tabbar border shop foot">
			<button class="action" @tap="goProduct">
				<view class="cuIcon-goods"></view>产品
			</button>
			<button class="action" @tap="goMyCard" >
				<view class="cuIcon-vipcard"></view>名片
			</button>
			<view class="action" @tap="goMyHome">
				<view class="cuIcon-people"></view>我的
			</view>
			<view class="bg-red submit text-lg" @tap="go(actions[0])">制作抵用券</view>
		</view>
		<!-- 遮罩 -->
		<view class="shade" v-if="isUps"></view>
		<!-- 底部扩展功能弹窗 -->
		<uni-popup ref="showPopupOperate" type="bottom" @change="change">
			<view class="popup-base bg-white">
				<view class="popup-content margin-top">
					<view v-if="currentActivity.status=='SAVED'" class="popup-content-box">
						<button ﻿class="cu-btn button-content" @click="goInProcess">
							<view class="popup-content-image">
								<image src="cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/publish.png" class="content-image" mode="widthFix" />
							</view>
						</button>
						<text class="popup-content-text">发布</text>
					</view>
					<view v-if="currentActivity.status=='IN_PROCESS'" class="popup-content-box">
						<button ﻿class="cu-btn button-content" @click="openSendVoucher">
							<view class="popup-content-image">
								<image src="cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/voucher.png" class="content-image" mode="widthFix" />
							</view>
						</button>
						<text class="popup-content-text">发券</text>
					</view>

					<view class="popup-content-box">
						<button ﻿class="cu-btn button-content" @click="goDetail">
							<view class="popup-content-image">
								<image src="cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/view.png" class="content-image" mode="widthFix" />
							</view>
						</button>
						<text class="popup-content-text">查看</text>
					</view>
					<view v-if="currentActivity.status=='SAVED'" class="popup-content-box">
						<button  @click="goEdit"﻿ class="cu-btn button-content">
							<view class="popup-content-image">
								<image src="cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/edit.png" class="content-image" mode="widthFix" />
							</view>
						</button>
						<text class="popup-content-text">编辑</text>
					</view>
					<view v-if="currentActivity.status=='SAVED'" class="popup-content-box">
						<button  @click="remove"﻿class="cu-btn button-content">
							<view class="popup-content-image">
								<image src="cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/delete.png" class="content-image" mode="widthFix" />
							</view>
						</button>
						<text class="popup-content-text">删除</text>
					</view>
				</view>
				<text class="popup-btn" @click="cancel('PopupOperate')">取消</text>
			</view>
		</uni-popup>
		﻿<!-- 底部展现弹窗 -->
		<uni-popup ref="showPartyCard" type="bottom" @change="change">

			﻿<!-- 底部客户名片弹窗 -->
			<view class="popup-base bg-white">
				<text class="cuIcon-close popup-close" @click="cancel('PartyCard')"></text>
				<text class="popup-title" >用户列表</text>
				<view class="cu-bar search ">
					<view class="search-form radius">
						<text class="cuIcon-search"></text>
						<input @focus="inputFocus" @blur="inputBlur" type="text" placeholder="输入搜索的关键词" confirm-type="search"></input>
					</view>
					<view class="action">
						<button class="cu-btn radius shadow-blur line-grey"  :disabled="isLoad" @tap="getPartyList">搜索</button>
					</view>
				</view>
				<view class="popup-content">
					<scroll-view class="ups-height" scroll-y="true">
						<block v-for="(item,index) in partyList" :key="index">
							<view class="padding">{{partyList[index].group}}</view>
							<view class="cu-list menu-avatar no-padding">
								<view class="cu-item  card-radius margin-top-xxs margin-left-xs margin-right-xs margin-bottom-xs shadow rel"  v-for="(subItem,subIndex) in item.subList" :key="subIndex">
									<view class="cu-avatar round lg" @tap="goEdit(subItem.id)">
										<image :src="subItem.avatar" mode="aspectFill" class="cu-avatar round lg"></image>
									</view>
									<view class="content" @tap="goEdit(subItem.id)">
										<view class="text-grey">{{subItem.name}}
										</view>
										<view class="text-gray text-sm">{{subItem.position?subItem.position:''}}</view>
									</view>
									<view class="flex">
										<view>
											<input placeholder="请输入券数" v-model="subItem.num_total"></input>
											<input v-if="!subItem.send_success" placeholder="请输入备注" v-model="subItem.remark"></input>
											<view v-else class="text-gray text-sm">派发{{subItem.remark}} {{subItem.num_total?subItem.num_total:'0'}} 张成功</view>
										</view>
										<button  class="cu-btn margin-left line-grey radius" :disabled="isLoad" @tap="sendVoucher(index,subIndex,subItem.num_total,subItem.remark)">发券</button>
									</view>
								</view>
							</view>
						</block>
						<!--页面底部抬升-->
						<view class="cu-bar solid-bottom margin-top-100"></view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
    import { mapState,mapMutations } from 'vuex';
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    import cmnUtils from '@/utils/cmnUtils.js';

    export default {
        components:{
            "uni-popup":uniPopup
        },
        data() {
            return {
                CustomBar: this.CustomBar,
                isLoad:false,
                actions: [{
                    title: '制券',
                    name: 'ticket',
                    url:'/pagesVoucher/biz-voucher/VoucherTypeList',
                    isShow: true,
					needRole: 'cardAdmin'
                }, {
                    title: '核销',
                    name: 'qrcode',
                    url:'/pagesVoucher/vou-entries/index',
                    isShow: true,
                    needRole: ''
                }, {
                    title: '用户',
                    name: 'people',
                    url:'/pagesVoucher/vou-customers/index',
                    isShow: true,
                    needRole: 'cardAdmin'
                }, {
                    title: '员工',
                    name: 'profile',
                    url:'/pagesVoucher/vou-members/index',
                    isShow: true,
                    needRole: 'cardAdmin'
                },{
                    title: '统计',
                    name: 'rank',
                    url:'',
                    isShow: true,
                    needRole: 'cardAdmin'
                } ],
                tabCur: 0,
                tab:['未发布','进行中','已结束'],
                currentActivity:{},
                savedActivities:[],
                InProcessActivities:[],
                closeActivities:[],
                page: 1,
                isEndPage:false,//最后一页
                loadingType: 1,//上拉的状态：0-loading前；1-loading中；2-没有更多了
                isUps:false,
                itemSelectedId:'-1',//选中活动ID
                listGroup: {},//包含字母分组的名片
                partyList: [{}],
                index: -1,//list index
                subList:[],//list.subList 字母分类下的名片数组
                search_str: '',//检索关键字
            }
        },

        onLoad(option) {
            let that = this;
            // that.isLoad = true;
            // that.tabCur=0;
            // that.getList('SAVED');
            that.tabCur=1;
            // that.getList('IN_PROCESS');
            // that.isLoad = false;
        },

		onShow(){
            if(this.tabCur==1){
                this.getList('IN_PROCESS');
			}
		},

        onPullDownRefresh() {
            this.page=1
            if(this.tabCur===0){
                this.getList('SAVED');
            }else if(this.tabCur===1){
                this.getList('IN_PROCESS');
            }
            else if(this.tabCur===2){
                this.getList('CLOSE');
            }
            uni.stopPullDownRefresh(); // 停止刷新
        },

        onReachBottom() {
            this.page++;
            if(this.tabCur===0){
                this.getList('SAVED');
            }else if(this.tabCur===1){
                this.getList('IN_PROCESS');
            }
            else if(this.tabCur===2){
                this.getList('CLOSE');
            }

        },

        computed:{
            ...mapState(['user']),
            checkCardAdminRole(){
                return function (role,needRole) {
                    let currentRole = role||'';
                    // console.log('currentRole',currentRole,'needRole',needRole);
                    return currentRole.indexOf(needRole)>-1;
                }
            },
            formatCreateAt(){
                return function(time){
                    let currentTime = time;
                    // console.log('time',time);
                    if(currentTime){
                        return cmnUtils.formatTime(currentTime,'yyyy-MM-dd HH:mm:ss')
                    }else{
                        return "";
                    }
                }
            },
        },
        methods: {
            go(action){
                if(action.url.length==0){
                    uni.showToast({
                        icon:'none',
                        title:action.title+'暂未开放！'
                    });
                }
                console.log('go url',action.url +'?cardId='+ this.user.userInfo.bizCardId+'&cardName='+this.user.userInfo.bizCardName);
                uni.navigateTo({
                    "url": action.url +'?cardId='+ this.user.userInfo.bizCardId+'&cardName='+this.user.userInfo.bizCardName,
                })
            },
            tabSelect(e) {
                this.tabCur = e.currentTarget.dataset.id;
                if(this.tabCur===0){
                    this.getList('SAVED');
                }else if(this.tabCur===1){
                    this.getList('IN_PROCESS');
                }
                else if(this.tabCur===2){
                    this.getList('CLOSE');
                }
            },

            async getList(status) {
                let that = this;
                if(that.user.userInfo.role.indexOf('cardAdmin')<0){return}
                this.isLoad=true;
                that.loadingType = 1;
                let res = await wx.cloud.callFunction({
                    name:'vou',
                    data:{
                        $url:'getActivityList',
                        cardId:that.user.userInfo.bizCardId,
						userId:that.user._id,
                        page:that.page,
                        status:status
                    }
                });
				console.log('getList bizcardId',that.user.userInfo.bizCardId,'userId',that.user._id,status,res.result);
                let result=res.result;
                if (result.code == 0) {
                    if (that.page == 1) {
                        that.isEndPage = false;
                        if(that.tabCur===0){
                            that.savedActivities = [];
                        }else if(that.tabCur===1){
                            that.InProcessActivities = [];
                        }
                        else if(that.tabCur===2){
                            that.closeActivities = [];
                        }
                    }
                    result.data.forEach(vou => {
                        if(that.tabCur===0){
                            that.savedActivities.push(vou);
                        }else if(that.tabCur===1){
                            that.InProcessActivities.push(vou);
                        }
                        else if(that.tabCur===2){
                            that.closeActivities.push(vou);
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

            // goActivityVouchers(activity){
            //     console.log('goActivityVouchers',activity._id,activity.name);
            //     uni.navigateTo({
            //         "url":"/pagesVoucher/biz-voucher/ActivityVoucherList?id="+activity._id+"&name="+activity.name,
            //     })
            // },

            popupOperate(item){
                let that = this;
                console.log('popupOperate',item);
                that.itemSelectedId = item._id;
                that.currentActivity = item;
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

            async goInProcess(){
                let that = this;
                that.currentActivity.status='IN_PROCESS';
                console.log('goInProcess',that.currentActivity);
                let res = await wx.cloud.callFunction({
                    name:'vou',
                    data:{
                        $url:'saveActivity',
                        activity:that.currentActivity,
                    }
                });
                that.tabCur=1;
                that.getList("IN_PROCESS");
                that.$refs['showPopupOperate'].close();
                if(res.result.code == 0){
					uni.showToast({
						icon:'success',
						title:'发布成功'
					});
                }
			},

            goDetail(item){
                console.log('goDetail',item);
				if(this.currentActivity._id){
					this.itemSelectedId=this.currentActivity._id;
				}else{
					this.itemSelectedId=item._id;
				}
				
                uni.navigateTo({
                    "url": "/pagesVoucher/biz-voucher/ActivityDetail?id=" + this.itemSelectedId,
                })
                this.$refs['showPopupOperate'].close()
            },
            goEdit() {
                console.log('goEdit', this.itemSelectedId);
                uni.navigateTo({
                    "url": "/pagesVoucher/biz-voucher/ActivityInput?id=" + this.itemSelectedId,
                })
                this.$refs['showPopupOperate'].close()
            },
			//删除卡券
            async remove(){
                let that = this;
                console.log('go remove activity', that.itemSelectedId);
                await wx.cloud.callFunction({
                    name:'vou-activities',
                    data:{
                        $url:'remove',
                        id:that.itemSelectedId
                    }
                });
                that.$refs['showPopupOperate'].close();

                uni.showToast({ icon:'success',title:'删除成功'})
                that.page=1
                if(that.tabCur===0){
                    that.getList('SAVED');
                }else if(that.tabCur===1){
                    that.getList('IN_PROCESS');
                }
                else if(that.tabCur===2){
                    that.getList('CLOSE');
                }
                uni.stopPullDownRefresh(); // 停止刷新
                that.$forceUpdate()
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

            async getPartyList() {
                let that = this;
                that.partyList =[];
                that.isLoad = true;
                //根据cardId检索收藏的历史名片
                let res = await wx.cloud.callFunction({
                    name: 'sys',
                    data: {
                        $url: 'getCardHolderByCardId',
                        cardId: that.user.userInfo.bizCardId
                    }
                });
                let result = res.result;
                if (result.code == 0 && result.data) {
                    //按字母分组的名片
                    that.listGroup = result.data.cards || {};
                    let index = 0;
                    let searchFlag = that.search_str.length>0 ;
                    for (let key in that.listGroup) {
                        if (that.listGroup[key].length > 0) {
                            that.listGroup[key].forEach(each=>{
                                let search_str = each.search_str||'';
								//全部会员
								if(!searchFlag){
									that.partyList[index] = {};
									that.partyList[index].group = key;
									that.partyList[index].subList = that.listGroup[key];
									index++;
								}
								//检索
								else if(search_str.indexOf(that.search_str)>-1){
									that.partyList[index] = {};
									that.partyList[index].group = key;
									that.partyList[index].subList = that.listGroup[key];
									index++;
								}
							})
                        }
                    }
                }
                that.isLoad = false;
                that.$forceUpdate()
            },

            //打开发券
            openSendVoucher(){
                let that = this;
                that.$refs['showPopupOperate'].close();
                that.getPartyList();
                that.$nextTick(() => {
                    that.$refs['showPartyCard'].open();
                });

            },

            //发券
            async sendVoucher(index,subIndex,num_send,remark){
                let that = this;
                that.isLoad = true;
                if(parseInt(that.currentActivity.num_used)+parseInt(num_send)>parseInt(that.currentActivity.num_total)){
                    uni.showToast({
                        icon:'none',
                        title:'剩余券数不足，无法发券'
                    });
                    return;
				}
				console.log('current hold card',that.partyList[index].subList[subIndex]);
				//构建发券对象
				let voucher = {
				    activity_id:that.currentActivity._id,
					activity_name:that.currentActivity.name,
					entry_id:that.currentActivity.entry_id,
					entry_name:that.currentActivity.entry_name,
					bg_color:that.currentActivity.bg_color,
					icon:that.currentActivity.icon,
					valid_date:that.currentActivity.valid_date,
					card_id:that.currentActivity.card_id,
					card_name:that.currentActivity.card_name,
					card_avatar:that.currentActivity.avatar,
				    user_id:that.partyList[index].subList[subIndex].user_id,
					user_name:that.partyList[index].subList[subIndex].name,
                    user_avatar:that.partyList[index].subList[subIndex].avatar,
                    managed_user_id:that.user.userInfo._id,
                    managed_user_name:that.user.userInfo.name,
                    managed_user_avatar:that.user.userInfo.avatar,
					managed_status:'RECEIVED',
					managed_status_name:'已领取',
					num_total:parseInt(num_send),//本次领取总数
					num_used:0,
					price:parseFloat(that.currentActivity.price),
					status:'TO_BE_USE',
					type_code:that.currentActivity.type_code,//券类型
					type_name:that.currentActivity.type_name,//券类型名称
					cover:that.currentActivity.cover,
					remark:remark//租户备注
				};
                let res = await wx.cloud.callFunction({
                    name:'vou',
                    data:{
                        $url:'saveVoucher',
                        voucher:voucher,
                    }
                });
                console.log('sendVoucher',voucher,res);
                that.currentActivity.num_used =parseInt(that.currentActivity.num_used)+parseInt(num_send);
                //更新活动
                that.leftNum = parseInt(that.currentActivity.num_total)-parseInt(that.currentActivity.num_used);
                console.log('currentActivity',that.currentActivity.num_total,that.currentActivity.num_used,that.leftNum);
				if(that.leftNum==0){
				    that.currentActivity.status='CLOSE'
				}
				res = await wx.cloud.callFunction({
                    name:'vou',
                    data:{
                        $url:'saveActivity',
                        activity:that.currentActivity
                    }
                });
				console.log('save activity', res);
				if(res.result.code==0){
                    that.partyList[index].subList[subIndex].num_total = parseInt(num_send);
                    that.partyList[index].subList[subIndex].send_success = true;
                    that.isLoad = false;
                    that.$forceUpdate();

					//todo 生成核销码
					// voucher._id=res.result.data;
					// voucher.number= voucher._id.substr(1,24);
					// if(res.result.code == 0){
					//     res = await wx.cloud.callFunction({
					//         name:'vou',
					//         data:{
					//             $url:'genEntryQrCode',
					//             id:voucher._id,
					//             wfCode:voucher.number
					//         }
					//     });
					//     console.log('生成二维码',res);
					// }
					uni.showToast({
						icon:'success',
						title:'发券成功'
					});
					//延迟释放
					setTimeout(function(){
						that.tabCur=1;
						that.getList('IN_PROCESS');
					},3000)
                }
			},

            inputFocus(e) {
                console.log(e)
            },
            inputBlur(e) {
                console.log(e)
                this.partyList = [];
                this.search_str = e.detail.value;
                this.page = 1;
            },
        }
    }
</script>

<style>

	/* 起到固定的作用 ,从而解决原页面触摸穿透的问题*/
	.prevent {
		width: 100%;
		height: 100%;
		/*自动回到顶部*/
		position: fixed;
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

	.ups-height{
		height: 850rpx;
		padding-bottom:62px;
	}

	﻿/* 底部分享 */
	.popup-base {
		display: flex;
		flex-direction: column;
		border-top-left-radius: 3%;
		border-top-right-radius: 3%;
		z-index: 95;
	}
	.popup-close {
		position:absolute;
		top:30rpx;
		left:30rpx;
		font-size: 39rpx;
		text-align: center;
		font-weight: bold;
		z-index: 99;
	}

	.popup-title {
		margin-top:15rpx;
		line-height: 60rpx;
		font-size: 28rpx;
		padding: 5rpx 0;
		text-align: center;
		font-weight: bold;
	}

	.popup-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 5px;
		max-height: 850rpx;
	}

	.popup-content-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		width: 180rpx;
	}

	.popup-content-image {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 90rpx;
		height: 130rpx;
		overflow: hidden;
		border-radius: 50rpx;
	}

	.content-image {
		width: 80rpx;
		height: 80rpx;
	}

	.popup-content-text {
		font-size: 26rpx;
		color: #333;
		padding-top: 5px;
		padding-bottom: 10px;
	}

	.popup-btn {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 14px;
		border-top-color: #DADADA;
		border-top-width: 1px;
		border-top-style: solid;
		text-align: center;
		color: #666;
	}

	.button-content {
		width: 100rpx;
		height: 100rpx;
		border-radius:15px;
	}

	.cu-btn{
		padding: 0 10rpx;
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
</style>
