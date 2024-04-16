<template>
	<view>
        <cu-custom    :isBack="true">
            <block slot="content">{{title}}</block>
            <block slot="right">
                <view class="action">
                    <view class="cu-load load-cuIcon" :class="isLoad?'loading':'over'"></view>
                </view>
            </block>
        </cu-custom>
		<view class="page bg-white">
			<scroll-view>
				<form>
					<view class="padding">
						<view class="cu-form-group" v-if="activity.type_name=='兑换券'">
							<view class="title">券名称</view>
							<text class='cuIcon-titles text-xs text-pink-light'></text>
							<input placeholder="如蛋糕抵用券" v-model="activity.name"></input>
						</view>
						<view class="cu-form-group" v-if="activity.type_name=='满减券'">
							<view class="title">优惠额度</view>
							<text class='cuIcon-titles text-xs text-pink-light'></text>
							<input placeholder="满 100 减 10 元" v-model="activity.name"></input>
						</view>
						<view class="cu-form-group" v-if="activity.type_name=='折扣券'">
							<view class="title">券名称</view>
							<text class='cuIcon-titles text-xs text-pink-light'></text>
							<input placeholder="如海鲜产品9折券" v-model="activity.name"></input>
						</view>
						<block v-if="activity.type_name=='代金券'">
							<view class="cu-form-group">
								<view class="title">券名称</view>
								<text class='cuIcon-titles text-xs text-pink-light'></text>
								<input placeholder="如蛋糕抵用券" v-model="activity.name"></input>
							</view>
							<view class="cu-form-group">
								<view class="title">面额</view>
								<text class='cuIcon-titles text-xs text-pink-light'></text>
								<input placeholder="请输入面额" v-model="activity.price"></input>
							</view>
						</block>
						<view class="cu-form-group" v-if="activity.type_name=='裂变券'">
							<view class="title">优惠额度</view>
							<text class='cuIcon-titles text-xs text-pink-light'></text>
							<input placeholder="满 100 减 10 元" v-model="activity.name"></input>
						</view>
						<view class="cu-form-group" v-if="activity.type_name=='裂变券'">
							<view class="title">抵用面值</view>
							<text class='cuIcon-titles text-xs text-pink-light'></text>
							<input placeholder="10" v-model="activity.price"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">券封面</view>
							<view>
								<ups-upload
										fileType="image"
										:uploadFile = "activity.cover"
										@upload ="uploadCover"
										@remove = "removeCover"
								></ups-upload>
							</view>
						</view>
						<view class="cu-form-group">
							<view class="title">使用条件</view>
							<input placeholder="使用条件..." v-model="activity.use_condition"></input>
						</view>

						<view class="cu-form-group">
							<view class="title">发券总量</view>
							<text class='cuIcon-titles text-xs text-pink-light'></text>
							<input placeholder="请输入发券总量" v-model="activity.num_total"></input>
						</view>
						<!--<view class="cu-form-group">-->
							<!--<view class="title">限领张数</view>-->
							<!--<text class='cuIcon-titles text-xs text-pink-light'></text>-->
							<!--<input placeholder="请输入限领张数" v-model="activity.num_limit"></input>-->
						<!--</view>-->
						<view class="cu-form-group">
							<view class="title">有效日期</view>
							<text class='cuIcon-titles text-xs text-pink-light'></text>
							<input placeholder="例如：2021.01.01-2021.01.31" v-model="activity.valid_date"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">可用时段</view>
							<text class='cuIcon-titles text-xs text-pink-light'></text>
							<input placeholder="例如：周一至周五 9:00-18:00" v-model="activity.valid_time"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">使用需知</view>
							<textarea placeholder="使用需知..." class="text-grey" maxlength="140" v-model="activity.remark"></textarea>
						</view>
						<view class="cu-form-group margin-top-xxs ﻿margin-bottom-xxs">
							<view class="title">核销入口关联</view>
							<text class="cuIcon-searchlist"  @click.stop="tapSearch"></text>
						</view>
						<view class="cu-form-group">
							<view class="title">核销入口</view>
							<text class='cuIcon-titles text-xs text-pink-light'></text>
							<input placeholder="请输入核销入口" v-model="activity.entry_name"></input>
						</view>
					</view>
				</form>
				<!--页面底部抬升-->
				<view class="cu-tabbar-height"></view>
			</scroll-view>
		</view>
		<!-- 底部操作菜单 -->
		<view  v-if="!isUps" class="cu-bar btn-group foot bg-white">
			<button class="cu-btn  line-grey round"   :disabled="isLoad" @click="cancel">取消</button>
			<button class="cu-btn  line-grey round"   :disabled="isLoad" @click="submit">提交</button>
		</view>
		<!-- 遮罩 -->
		<view class="shade" v-if="isUps"></view>
		﻿<!-- 底部展现弹窗 -->
		<uni-popup ref="showEntryList" type="bottom" @change="change">
			﻿<!-- 底部商务名片弹窗 -->
			<view class="trend-popup bg-white">
				<text class="cuIcon-close trend-popup-close" @click="cancelPopup('EntryList')"></text>
				<text class="trend-popup-title" >核销入口</text>
				<view class="cu-bar search ">
					<view class="search-form round">
						<text class="cuIcon-search"></text>
						<input @focus="inputFocus" @blur="inputBlur" type="text" placeholder="输入搜索的关键词" confirm-type="search"></input>
					</view>
					<view class="action">
						<button class="cu-btn round shadow-blur bg-grey"     :disabled="isLoad" @tap="getSearchList">搜索</button>
					</view>
				</view>
				<view class="trend-popup-content">
					<scroll-view scroll-y  :style="[{height:'calc(100vh - '+ CustomBar + 'px - 50px)'}]">
						<view class="cu-list menu-avatar no-padding">
							<view class="cu-item  card-radius margin-top-xxs margin-left-xs margin-right-xs margin-bottom-xs shadow rel"  v-for="(item,index) in searchList" :key="index">
								<!--检索时展示区-->
								<view  class="cu-avatar round lg" @tap="goEdit(item._id)">
									<image :src="item.avatar" mode="aspectFill" class="cu-avatar round lg"></image>
								</view>
								<view class="content" @tap="goEdit(item._id)">
									<view class="text-grey">{{item.name}}
										<text class="text-abc"></text>
									</view>
								</view>
								<view>
									<buttom class="cu-btn margin-left radius" @tap="switchEntry(index,item)">关联</buttom>
								</view>
							</view>
						</view>
						<!--页面底部抬升-->
						<view class="cu-bar solid-bottom margin-top-100"></view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { mapState ,mapMutations} from 'vuex';
    import upsUpload from '@/components/ups-upload/index.vue'
    import uniPopup from '@/components/uni-popup/uni-popup.vue';

	export default {
		components:{
            "ups-upload":upsUpload,
            "uni-popup":uniPopup,
		},
		data() {
			return {
                isLoad:false,
                isUps:false,
                title:'',
				activity:{
                    template_id:'',//模版ID
                    name:'',
					cover:'',//分享用图片
                    avatar:'',//企业头像
                    card_id:'',//卡ID
                    card_name:'',
                    type_code:'',
                    type_name:'',
                    entry_id:'',
                    entry_name:'',
                    price:0,
                    use_condition:'',
                    num_total:100,
                    num_limit:1,
					num_used:0,
					rule:{
                        forbidden_region:false,
                        verified_reward:false,
                        forbidden_reward:false,
                        forbidden_share:false
					}
				},
				entryNameChanged:false,//活动入口改变标志
                dbEntryName:'',//缓存加载的入口名称
                CustomBar: this.CustomBar,
                existEntryFlag:false,//存在备选入口
                searchList: [{}],//核销备选入口
                //检索
                page: 1,
                loadingType: 0,//上拉的状态：0-loading前；1-loading中；2-没有更多了
                search_str: '',//检索关键字
			}
		},
		onLoad(options) {
		    let that = this;
            if(options.id){
                that.getDetail(options.id);
            }
            // if(options.cardId){
            //     that.activity.card_id=options.cardId;
            //     that.getCard(options.cardId);
            // }
            // if(options.cardName){
            //     that.activity.card_name = options.cardName;
            // }
            if(options.templateId){
                that.getTemplate(options.templateId);
            }
            that.$forceUpdate();
		},
		computed:{
			...mapState(['user']),
		},
		methods: {
            async getTemplate(templateId){
                let that = this;
                that.isLoad = true;
                if(templateId){
                    let res = await wx.cloud.callFunction({
                        name:'vou',
                        data:{
                            $url:'getTemplateDetail',
                            id:templateId||'0',
                        }
                    });
                    console.log('getTemplateDetail',res);
                    if(res.result.code==0){
                        let template = res.result.data;
                        that.title = template.title;
                        that.activity.template_id= template._id;
                        that.activity.template_name=template.name;
                        that.activity.type_code = template.type_code;
                        that.activity.type_name = template.type_name;
                        that.activity.bg_color = template.bg_color;
                        that.activity.icon = template.icon;
                        that.activity.num_total = template.num_total;
                        that.activity.num_limit = template.num_limit;
                        that.activity.valid_date = template.valid_date;
                        that.activity.valid_time = template.valid_time;
                        that.activity.remark = template.remark;
                        that.activity.use_condition = template.use_condition;
                        that.$forceUpdate();
                        that.getSearchList();
                    }
				}
			},
            
			async getDetail(id){
				let that = this;
                that.isLoad = true;
				if(id){
					let res = await wx.cloud.callFunction({
						name:'vou',
						data:{
						  $url:'getActivityDetail',
						  id:id||'0',
						}
					});
                    console.log('getDetail',res);
                    if(res.result.code==0){
                        that.activity = res.result.data;
                        //缓存入口名称，如果被修改，需要更新入口表数据
                        that.dbEntryName = that.activity.entry_name;
                    }
				}
				//初始化创建券
				else{
					that.activity.user_id = that.user._id||'0';
				}
                that.isLoad = false;
			},

            uploadCover(fileId){
                this.activity.cover = fileId;
                this.$forceUpdate()
            },
            removeCover(){
                this.activity.cover = "";
                this.$forceUpdate()
            },

            // //领券者地区限制
            // forbiddenRegionSwitch(e){
            //     let that = this;
            //     console.log('forbiddenRegionSwitch',e);
            //     that.activity.rule.forbidden_region = !that.activity.rule.forbidden_region;
            // },
            // //核销后赠券
            // verifiedRewardSwitch(e){
            //     let that = this;
            //     console.log('verifiedRewardSwitch',e);
            //     that.activity.rule.verified_reward = !that.activity.rule.verified_reward;
            // },
            // //禁止赠送
            // forbiddenRewardSwitch(e){
            //     let that = this;
            //     console.log('forbiddenRewardSwitch',e);
            //     that.activity.rule.forbidden_reward = !that.activity.rule.forbidden_reward;
            // },
            // //禁止分享
            // forbiddenShareSwitch(e){
            //     let that = this;
            //     console.log('forbiddenShareSwitch',e);
            //     that.activity.rule.forbidden_share = !that.activity.rule.forbidden_share;
            // },
            cancel(){
				if(this.fromCreate){
                    uni.reLaunch({url: '/pages/jm-card-holder/index',});
				}else{
                    uni.navigateBack();
				}
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

            cancelPopup(type){
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
                    this.$refs['showEntryList'].open();
                })
            },

            async getSearchList(type) {
                let that = this;
                that.isLoad = true;
                that.existEntryFlag = false;
                that.loadingType = 1;
                that.searchList = [];
                this.page = 1;
                let res = await wx.cloud.callFunction({
                    name: 'vou',
                    data: {
                        $url: 'getEntryListBySearch',
                        searchStr: that.search_str,
                        cardId: that.activity.card_id,
                        page: that.page,
                    }
                });
                console.log('page',that.page,'searchList.length', res.result.data.data.length);
                if (res.result.code == 0) {
                    that.searchList = res.result.data.data || [];
                    if(that.searchList.length==0){
                        that.activity.entry_name='系统将自动创建默认核销入口';
                    }
                    if(that.activity._id && that.searchList.length==1){
                        that.activity.entry_name=that.searchList[0].name;
                        that.activity.entry_id=that.searchList[0]._id;
					}
                    that.$forceUpdate();
                    if (that.searchList.length == 0 || that.page >= 5) {
                        that.loadingType = 2;
                        that.isLoad = false;
                        return;
                    }
                }
                if (type == "refresh") {
                    uni.stopPullDownRefresh(); // 停止刷新
                }
                that.isLoad = false;

            },

			switchEntry(index,item){
                let that = this;
                console.log('switchEntry',index,item);
				that.activity.entry_id= item._id;
				that.activity.entry_name= item.name;
				that.$forceUpdate();
                this.$refs['showEntryList'].close();
            },

			async submit(){
			    let that = this;
				that.activity.card_id = that.user.userInfo.bizCardId;
				that.activity.card_name = that.user.userInfo.bizCardName;
				that.activity.avatar = that.user.userInfo.bizCardAvatar;
				//首字母为英文或汉字
				let reg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
				console.log('reg',reg.test(that.activity.name));
                if(!that.activity.name || !reg.test(that.activity.name)){
                    uni.showToast({
                        icon:'none',
                        title:'券名称需字母或汉字开头'
                    })
                    return;
                }
                //只能输入数字
                 reg = /^[0-9]*$/;
                let tempNum = that.activity.num_limit+that.activity.num_total;
                if(that.activity.price!=0){
                    tempNum +=that.activity.price;
				}
                console.log('只能输入数字',reg.test(tempNum));
                if(!reg.test(tempNum)){
                    uni.showToast({
                        icon:'none',
                        title:'只能输入数字'
                    })
                    return;
                }
                if(that.activity.price && parseInt(that.activity.price)==0){
                    uni.showToast({
                        icon:'none',
                        title:'面额不能为零'
                    })
                    return;
                }
                if(parseInt(that.activity.num_total)==0){
                    uni.showToast({
                        icon:'none',
                        title:'发券总量不能为零'
                    })
                    return;
                }
                if(parseInt(that.activity.num_limit)==0){
                    uni.showToast({
                        icon:'none',
                        title:'限领张数不能为零'
                    })
                    return;
                }
                if(!that.activity.valid_date){
                    uni.showToast({
                        icon:'none',
                        title:'请输入有效日期'
                    })
                    return;
                }
                if(!that.activity.valid_time){
                    uni.showToast({
                        icon:'none',
                        title:'请输入可用时段'
                    })
                    return;
                }

                that.activity.price = parseInt(that.activity.price);

				//如果没有关联核销入口
				if(!that.activity.entry_id){
                    let res = await wx.cloud.callFunction({
                        name:'vou',
                        data:{
                            $url:'getEntryList',
                            cardId:that.activity.card_id,
							typeCode:that.activity.type_code,
                            status:'USING'
                        }
                    });
                    console.log('vou-entries getEntryList cardId:',that.activity.card_id,'typeCode',that.activity.type_code,res.result);
                    let result=res.result;
                    if (result.code == 0) {
                        if (that.page == 1) {
                            that.isEndPage = false;
                                that.searchList = [];
                        }
                        //加载为备选列表
                        that.searchList = result.data;
                    }
                    //后面没数据了
                    if(result.data.length<10){
                        that.isEndPage = true;
                        that.loadingType = 2;
                    }
                    that.isLoad=false;

                    //如果没有备选核销入口，自动新建一个核销入口
                    if(that.searchList.length==0){
                        //初始化本类型入口信息
						//默认活动名设定为入口名称
                        let entry = {
                            name:that.activity.name+'核销入口',
							avatar:that.activity.avatar,
							card_id:that.activity.card_id,
							card_name:that.activity.card_name,
                            usable:true
                        };
                        let res = await wx.cloud.callFunction({
                            name:'vou',
                            data:{
                                $url:'saveEntry',
                                entry:entry
                            }
                        });
                        console.log('vou-entries getEntryList',res.result);
                        if(res.result.code == 0){
                            entry._id=res.result.data;
                            entry.number= entry._id.substr(1,24);
                            let res2 = await wx.cloud.callFunction({
                                name:'vou',
                                data:{
                                    $url:'genEntryQrCode',
									id:entry._id,
                                    number:entry.number
                                }
                            });
                            console.log('生成二维码',res2);
						}
						//反写入活动中
						that.activity.entry_id=entry._id;
						that.activity.entry_name=entry.name;
                    }
				}

                //检查是否关联核销入口
                if(!that.activity.entry_name){
                    uni.showToast({
                        icon:'none',
                        title:'请先关联核销入口'
                    })
                    return;
                }
                console.log('activity',that.activity);

                that.isLoad = true;
                let checkValue = that.activity.name+that.activity.use_condition+that.activity.valid_date+that.activity.valid_time+that.activity.remark;
				let secRes = await wx.cloud.callFunction({
					name:'sys',
					data:{
						$url:'msgSecCheck',
						value:checkValue
					}
				});
				console.log('msg security Check',secRes);
				if(secRes.result.code!=0){
					uni.showToast({
						icon:'none',
						title:'内容含有违规内容，请修改后提交'
					});
					that.isLoad = false;
					return;
				}

				//初始化活动状态
				that.activity.status='SAVED';
				//编辑提交
				if(that.activity._id){
                    //更新核销入口名称
				    if(that.dbEntryName != that.activity.entry_name){
                        await wx.cloud.callFunction({
                            name:'vou',
                            data:{
                                $url:'updateEntryName',
                                id:that.activity.entry_id,
                                name:that.activity.entry_name
                            }
                        });
					}

                    await wx.cloud.callFunction({
                       name:'vou',
                       data:{
                           $url:'saveActivity',
                           activity:that.activity
                       }
                    })
				}
				//新增
				else{
                    that.activity.user_id = that.user._id;
                    that.activity.user_name = that.user.userInfo.nickName;
                    that.activity.user_avatar = that.user.userInfo.avatarUrl;
                    console.log('add activity',that.activity);
                    let res = await wx.cloud.callFunction({
                        name:'vou',
                        data:{
                            $url:'saveActivity',
                            activity:that.activity
                        }
                    });
                    console.log('add activity',res);
				}
                that.isLoad = false;
                uni.reLaunch({
                    url: '/pagesVoucher/biz-voucher/index?cardId='+that.activity.card_id+'&cardName='+that.activity.card_name,
                })
			},
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

	.comp{
		font-size: 32rpx;
		width: 700rpx;
		margin: 0 auto;
		padding: 20rpx 10rpx;
		border-bottom: 1rpx solid #dddddd;
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

    ﻿/* 底部分享 */
    .trend-popup {
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
    .trend-popup-close {
        position:absolute;
        top:30rpx;
        left:30rpx;
        font-size: 39rpx;
        text-align: center;
        font-weight: bold;
        z-index: 99;
    }

    .trend-popup-title {
        margin-top:15rpx;
        line-height: 60rpx;
        font-size: 28rpx;
        padding: 5rpx 0;
        text-align: center;
        font-weight: bold;
    }

    .trend-popup-content {
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
