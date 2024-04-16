<template>
	<view class="" :class="isUps == true ? 'prevent' : ''">
        <cu-custom    :isBack="true">
			<block slot="backText">返回</block>
            <block slot="content">名片</block>
        </cu-custom>
		<scroll-view> 
			<form>
				<view class="padding">
					<view class="cu-form-group">
						<view class="title">姓名</view>
						<text class='cuIcon-titles text-xs text-orange'></text>
						<input placeholder="请输入姓名" v-model="card.name"></input>
					</view>				
					<view class="cu-form-group">
						<view class="title">手机号码</view>
						<input placeholder="请输入手机号" v-model="card.phone"></input>
						<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="cu-btn round  line-grey"> 授权手机号 </button>
					</view>
					<view class="cu-form-group">
						<view class="title">头像</view>
						<view>
							<ups-upload
								fileType="image"
								:uploadFile = "card.avatar"
								@upload ="uploadAvatar"
								@remove = "removeAvatar">
							</ups-upload>
						</view>
					</view>
					<view class="cu-form-group">
						<view class="title">封面</view>
						<view>
							<ups-upload
									fileType="image"
									:uploadFile = "card.cover"
									@upload ="uploadCover"
									@remove = "removeCover"
							></ups-upload>
						</view>
					</view>
					<view class="cu-form-group">
						<view class="title">微信号</view>
						<input  v-model="card.wx_number"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">邮箱</view>
						<input v-model="card.email"></input>
					</view>
					<view class="cu-form-group margin-top-xxs">
						<view class="title">公司名称</view>
						<input  v-model="card.corp_name" :disabled="isBindComp"></input>
						<text class="cuIcon-searchlist"  @click.stop="tapSearch"></text>
					</view>
					<view v-if="isLinked" class="cu-list menu-avatar">
						<view class="cu-item">
							<view  class="cu-avatar round lg" >
								<image :src="currentUser.userInfo.bizCardAvatar" mode="aspectFill" class="cu-avatar round lg"></image>
							</view>
							<view class="content">
								<view class="text-grey">{{currentUser.userInfo.bizCardName}}
									<text class="text-abc"></text>
								</view>
							</view>
							<view>
								<buttom class="cu-btn line-grey round light margin-left" @tap="removeLinked">解除关联</buttom>
							</view>
						</view>
					</view>
					<view class="cu-form-group">
						<view class="title">职位</view>
						<input  v-model="card.corp_position"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">导航地址</view>
						<view class="cuIcon-locationfill" @tap="chooseAddress">{{hasAddress?card.corp_address.address:'请选择地址'}}</view>
					</view>
					<view class="cu-form-group">
						<view class="title">联系地址</view>
						<input  v-model="card.mailing_address"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">介绍</view>
					</view>
					<textarea class="text-box font40 bg-white width100 padding-sm solid" style="height: 500rpx;" scroll-y="true" maxlength="1200" placeholder="请输入文字介绍" v-model="card.introduce" >
					</textarea>
				</view>
			</form>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
		<slot v-if="!isUps">
            <!-- 底部操作菜单 -->
            <view class="cu-bar btn-group foot bg-white" style="z-index: 99;">
                <button class="cu-btn  round line-grey"    @click="cancelSubmit">取消</button>
                <button class="cu-btn  round line-grey"    @click="submit">提交</button>
            </view>
		</slot>
		<!-- 遮罩 -->
		<view class="shade" v-if="isUps"></view>

		<!-- 底部公司列表弹窗 -->
		<uni-popup ref="showBizCard" type="bottom" @change="change">
			<view class="popup bg-white">
				<text class="cuIcon-close popup-close" @click="cancel('BizCard')"></text>
				<text class="popup-title" >公司列表</text>
				<view class="cu-bar search ">
					<view class="search-form round">
						<text class="cuIcon-search"></text>
						<input @focus="inputFocus" @blur="inputBlur" type="text" placeholder="输入搜索的关键词" confirm-type="search"></input>
					</view>
					<view class="action">
						<button class="cu-btn round line-grey"  @tap="getSearchList">搜索</button>
					</view>
				</view>
				<view class="popup-content">
					<scroll-view scroll-y  :style="[{height:'calc(100vh - '+ CustomBar + 'px - 50px)'}]">
						<block v-for="(item,index) in list" :key="index">
							<view class="padding">{{list[index].group}}</view>
							<view class="cu-list menu-avatar no-padding">
								<view class="cu-item  card-radius margin-top-xxs margin-left-xs margin-right-xs margin-bottom-xs shadow rel"  v-for="(subItem,subIndex) in item.subList" :key="subIndex">
									<!--检索时展示区-->
									<view v-if="subItem.card_type=='biz'" class="cu-avatar round lg" @tap="goEdit(subItem.id)">
										<image :src="subItem.avatar" mode="aspectFill" class="cu-avatar round lg"></image>
									</view>
									<view v-else class="cu-avatar round lg" @tap="goEdit(subItem.id)">
										<image :src="subItem.avatar" mode="aspectFill" class="cu-avatar round lg"></image>
									</view>
									<view class="content" @tap="goEdit(subItem.id)">
										<view class="text-grey">{{subItem.name}}
											<text class="text-abc"></text>
										</view>
										<view class="text-gray text-sm">{{subItem.position?subItem.position:''}}</view>
									</view>
									<view >
										<buttom class="cu-btn margin-left line-grey round" @tap="addLink(subItem)">关联</buttom>
									</view>
								</view>
							</view>
						</block>
						 <view class="cu-tabbar-height"></view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { mapState ,mapMutations} from 'vuex'
	import upsUpload from '@/components/ups-upload/index.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'

	export default {
		components:{
			"ups-upload":upsUpload,
			"uni-popup":uniPopup,
		},
		data() {
			return {
				card:{
					corp_address:{address:'',latitude:0,longitude:0},
					mailing_address:''
				},

				isUps:false,
                listGroup: {},//包含字母分组的名片
                CustomBar: this.CustomBar,
                list: [{}],
                index: -1,//list index
                subList:[],//list.subList 字母分类下的名片数组
                listCur: '',
                searchList: [{}],
                //检索
                page: 1,
                search_str: '',//检索关键字
				hasAddress:false,
                currentUser:{},//当前编辑的用户帐号
				isLinked:false//是否关联公司名片
			}
		},
		onReady() {
			this.getDetail();
		},
		computed:{
			...mapState(['user']),
		},
		methods: {
            ...mapMutations(['updateUser']),
			async getDetail(){
				let that = this;
				console.log('getDetail user:',that.user);
				if(that.user._id){
                    that.currentUser = that.user;
					that.isLinked = that.currentUser.userInfo.bizCardId.trim().length>0;
					let res = await wx.cloud.callFunction({
						name:'sys',
						data:{
						  $url:'getCardDetailByUserId',
						  userId:that.user._id||'0',
						}
					});
					console.log('getDetail',res);
                    if(res.result.code==0){
                        that.card = res.result.data;
						if(that.card.corp_address){
                            that.hasAddress= true;
						}else{
                            that.hasAddress= false;
							that.card.corp_address = {address:'',latitude:0,longitude:0}
						}
						if(that.user.userInfo.bizCardName && that.user.userInfo.bizCardName.length>0){
                            that.card.corp_name = that.user.userInfo.bizCardName;
						}
                    }
				}else{
					that.card.user_id = that.user._id||'0';
					that.card.name = that.user.userInfo.nickName;
					that.card.avatar = that.user.userInfo.avatarUrl;
					that.card.videos=[];
					that.card.carousels =[];
					that.card.corp_address = {address:'',latitude:0,longitude:0};
					that.card.mailing_address='';
                    that.hasAddress= false;
				}
			},
			async getPhoneNumber(e) {
				let that = this;
			    const res = await wx.cloud.callFunction({
			        name: 'sys',
			        data: {
			            $url:'getPhone',
			            cloudId:e.detail.cloudID
			        }
			    });
				if(res.result.code == 0){
                    uni.showToast({
						title: '授权成功',
					    success: function() {
					    }
					});
					that.card.phone = res.result.data.phoneNumber;
					that.$forceUpdate();
				}
			}, 
			uploadAvatar(fileId){
				this.card.avatar = fileId;
				this.$forceUpdate()
			},
			removeAvatar(){
				this.card.avatar = "";
				this.$forceUpdate()
			},
            uploadCover(fileId){
                this.card.cover = fileId;
                this.$forceUpdate()
            },
            removeCover(){
                this.card.cover = "";
                this.$forceUpdate()
            },
			bindCompany(){
				this.isUps = true;
				this.$refs.showComments.open();
			},
            cancelSubmit(){
				uni.navigateBack();
			},
			async submit(){
			    let that = this;
				//首字母为英文或汉字
				let reg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
				console.log('reg',reg.test(that.card.name));
                if(!that.card.name || !reg.test(that.card.name)){
                    uni.showToast({
                        icon:'none',
                        title:'姓名需字母或汉字开头'
                    });
                    return;
                }
                console.log('card',that.card,that.card.phone);
                let checkValue = that.card.name+that.card.introduce+that.card.wx_number+that.card.corp_name+that.card.corp_position+that.card.mailing_address;
				let res = await wx.cloud.callFunction({
					name:'sys',
					data:{
						$url:'msgSecCheck',
						value:checkValue
					}
				});
				console.log(res);
				if(res.result.code!=0){
					uni.showToast({
						icon:'none',
						title:'内容含有违规内容，请修改后提交'
					});
					return;
				}
				//编辑提交
				if(that.card._id){
                    await wx.cloud.callFunction({
                        name:'sys',
                        data:{
                            $url:'updateCard',
                            card:that.card,
                        }
                    })
				}
				uni.reLaunch({
					url: '/pagesSys/card/CardDetail?id='+that.card._id,
				})
			},

            async getSearchList() {
                if (!this.user._id) {
                    return;
                }
                let that = this;
                that.list = [];
                that.index = 0;
                that.subList=[];
                this.page = 1;
                //抓取最新的收藏记录（应对在搜索结果中进行交换名片的行为）
                that.updateSearchList();
                let res = await wx.cloud.callFunction({
                    name: 'sys',
                    data: {
                        $url: 'searchBizCardList',
                        search_str: that.search_str,
                        page: that.page,
                    }
                });
                console.log('page',that.page,'searchList.length', res.result.data.length);
                if (res.result.code == 0) {
                    that.searchList = res.result.data || [];
                    if (that.searchList.length == 0 || that.page >= 5) {
                        return;
                    }
                    that.cachedPageList();
                }
            },

            async getNextPage(){
                let that = this;
                let res = await wx.cloud.callFunction({
                    name: 'sys',
                    data: {
                        $url: 'searchBizCardList',
                        search_str: that.search_str,
                        page: that.page,
                    }
                });
                console.log('page',that.page,'searchList.length', res.result.data.length);
                if (res.result.code == 0) {
                    that.searchList = res.result.data || [];
                    if (that.searchList.length == 0 || that.page >= 5) {
                        return;
                    }
                    that.cachedPageList();
                }
            },

            cachedPageList(){
                let that = this;
                //字母索引
                let start_group_index = that.searchList[0].group_index;
                for (let searchIndex in that.searchList) {
                    let match = false;
                    //自己排除在外
                    if (that.user._id == that.searchList[searchIndex].user_id) {
                        match = true;
                        that.searchList[searchIndex].has_holder = true;
                        that.searchList[searchIndex].in_exchange = false;
                    }
                    //初始化
                    if (!match) {
                        that.searchList[searchIndex].has_holder = false;
                        that.searchList[searchIndex].in_exchange = false;
                    }
                    //用于匹配展示字段的一致性
                    that.searchList[searchIndex].id = that.searchList[searchIndex]._id;
                    that.searchList[searchIndex].position = that.searchList[searchIndex].corp_position;
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
                console.log('list',that.list,'index',that.index,'subList',that.subList);
                that.listCur = that.list[20 * (that.page - 1)];
                if (that.searchList.length < 20 ) {
                    return;
                }
                that.$forceUpdate()
            },

            async updateSearchList() {
                let that = this;
                let res = await wx.cloud.callFunction({
                    name: 'sys',
                    data: {
                        $url: 'getCardHolderByUserId',
                        userId: that.user._id
                    }
                });
                let result = res.result;
                that.$forceUpdate();
            },
			onPullDownRefresh() {
				that.list = [];
				that.index = 0;
				that.subList=[];
				this.page = 1;
			    uni.stopPullDownRefresh(); // 停止刷新
			},
            inputFocus(e) {
                console.log(e)
            },
            inputBlur(e) {
                console.log(e);
                this.searchList = [];
                this.search_str = e.detail.value;
                this.page = 1;
            },
            cancel(type){
                this.$refs['show' + type].close()
            },
            change(e){
                if(e.show){
                    this.isUps = true;
                }else{
                    this.isUps =false;
                }
            },
            tapSearch(){
                this.getSearchList();
                this.$nextTick(() => {
                    this.isUps=true;
                    this.$refs['showBizCard'].open();
                })
			},
            async addLink(bizCard){
                let that = this;
				console.log('addLink',bizCard);
				that.currentUser.userInfo.bizCardAvatar=bizCard.avatar;
				that.currentUser.userInfo.bizCardName=bizCard.name;
                that.currentUser.userInfo.bizCardId = bizCard._id;
               
				await wx.cloud.callFunction({
					name:'sys',
					data:{
						$url:'updateUserInfo',
						id:that.currentUser._id,
                        userInfo:that.currentUser.userInfo
					}
				});
                that.isLinked = true;
                this.$refs['showBizCard'].close();
                that.updateUser(that.user);
				that.card.corp_name = bizCard.name;
				that.card.corp_id = bizCard._id;
				await wx.cloud.callFunction({
					name:'sys',
					data:{
						$url:'updateCard',
						card:that.card,
					}
				})
                that.$forceUpdate();
			},
            async removeLinked(){
                let that = this;
                that.isLinked = false;
                that.currentUser.userInfo.bizCardAvatar='';
                that.currentUser.userInfo.bizCardName='';
                that.currentUser.userInfo.bizCardId = '';
				await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'updateUserInfo',
                        id:that.currentUser._id,
                        userInfo:that.currentUser.userInfo
                    }
                });
                that.updateUser(that.user);
				that.card.corp_name = '';
				that.card.corp_id = '';
				await wx.cloud.callFunction({
					name:'sys',
					data:{
						$url:'updateCard',
						card:that.card,
					}
				})
                that.$forceUpdate();
			},
			chooseAddress(){
				let that = this;
				wx.getSetting({
				    success(res) {
				        console.log('get-setting', res.authSetting);
				        // 只返回用户请求过的授权
				        let auth = res.authSetting;
				        if (auth['scope.userLocation']) {
				            // 已授权，申请定位地址
				            that.getUserLocation();
				        } else if (auth['scope.userLocation'] === undefined) {
				            // 用户没有请求过的授权，不需要我们主动弹窗，微信会提供弹窗
				            that.getUserLocation();
				        } else if (!auth['scope.userLocation']) {
				            // 没有授权过，需要用户重新授权
				            // 这个弹窗是为了实现点击，不然openSetting会失败
				            wx.showModal({
				                title: '是否授权当前位置？',
				                content: '需要获取您的地理位置，请确认授权，否则定位功能将无法使用',
				                success: res => {
				                    if (res.confirm) {
				                        wx.openSetting({
				                            success(res) {
				                                console.log('open-setting-suc', res.authSetting);
				                                let setting = res.authSetting;
				                                if (!setting['scope.userLocation']) {
				                                    wx.showToast({
				                                        title: '地址授权失败，定位功能无法使用',
				                                        icon: 'none',
				                                    });
				                                } else {
				                                    // 地址授权成功，申请定位地址
				                                    that.getUserLocation();
				                                }
				                            },
				                            fail(err) {
				                                // 需要点击，有时候没有点击，是无法触发openSetting
				                                console.log('open-setting-fail',err);
				                            }
				                        });
				                    }
				                }
				            });
				        } 
				    }
				});

			},
			getUserLocation () {
				let that = this;
			    wx.chooseLocation({
					success(res){
						console.log(res);
						console.log(that.card);
						if(that.card.corp_address){
							that.card.corp_address.address = res.address;
							that.card.corp_address.latitude = res.latitude;
							that.card.corp_address.longitude = res.longitude;
						}else{
							that.card.corp_address = {address:'',latitude:0,longitude:0};
							that.card.corp_address.address = res.address;
							that.card.corp_address.latitude = res.latitude;
							that.card.corp_address.longitude = res.longitude;
						}
						that.hasAddress= true;
						that.$forceUpdate();
						
					}
				});
			}
		}
	}
</script>

<style>
	.padding {
		padding: 10rpx;
	}

	.text-box {
		height: 100rpx;
		/* background-color: #FFFFFF; */
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		color: #353535;
		line-height: 1.8;
	}
	video {
		width: 750rpx;
	}
	image {
		width: 750rpx;
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
	.popup {
		display: flex;
		flex-direction: column;
		height: 950rpx;
		padding-bottom:62px;
		position: fixed;
		left:0;
		bottom: 0;
		width:100%;
		z-index: 95;
		border-top-left-radius: 3%;
		border-top-right-radius: 3%;
	}
	.trend-remove-popup {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 5px;
		height: 350rpx;
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
</style>
