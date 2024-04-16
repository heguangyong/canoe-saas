<template>
	<view class="" :class="isUps == true ? 'prevent' : ''">
		<cu-custom    :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{title}}</block>
		</cu-custom>
		<scroll-view scroll-y="true" class="DrawerPage" :class="itemModalName=='viewSideModal'?'show':''" @scrolltolower="getYiShow()" lower-threshold="100"
					 refresher-enabled="true" :refresher-triggered="triggered"
					 :refresher-threshold="100" @refresherrefresh="onRefresh" @refresherrestore="onRestore">
			<view v-for="(item,index) in trendList" :key="index">
				<view :id="'tid'+index" >
					<ups-trend ref="refTrend" :trend="item" :idx=index @operate ="operateTrend" >
						<button :data-tid="item._id" @click="togglePopup(item,index,'More')" class="cu-btn text-xxl bg-white" slot="btnMore">
							<text class="cuIcon-more"></text>
						</button>
						<button :data-tid="item._id" @click="togglePopup(item,index,'Comments')"  class="cu-btn card-btn text-df bg-white flex-start align-center margin-left-xs" slot="btnComments">
							<text class="cuIcon-comment"></text>
						</button>
						<!--活动列表入口-->
						<button  @tap="showActivityModal(item,'viewSideModal')" class="cu-btn text-xxl bg-white" slot="btnEnroll">
							<image src="cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/list.png" class="small-image" mode="widthFix" />
						</button>
						<!--产品列表入口-->
						<button @tap="showProductModal(item,'viewSideModal')" class="cu-btn text-xxl bg-white" slot="btnAll">
							<image src="cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/list.png" class="small-image" mode="widthFix" />
						</button>
					</ups-trend>
				</view>
			</view>
			<view class="cu-tabbar-height"></view>
			<view class="cu-tabbar-height"></view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>

		<view v-if="!isUps" class="cu-bar bg-white tabbar border foot">
			<button class="action" @tap="goMy">
				<view class="cuIcon-my"></view>我的
			</button>
			<view class="bg-red submit text-lg" @tap="goAdd">新增动态</view>
		</view>
		
		<!-- 遮罩 -->
		<view class="shade" v-if="isUps"></view>
		
		<!-- 更多功能弹窗 -->
		<uni-popup ref="showMore" type="bottom" @change="change">
			<view class="trend-popup bg-white">
				<view class="trend-popup-content margin-top">
					<view class="trend-popup-content-box">
						<button :data-trend="currentTrend" open-type="share"  class="cu-btn button-content">
							<view class="trend-popup-content-image">
								<image src="cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/share.png" class="content-image" mode="widthFix" />
							</view>
						</button>
						<text class="trend-popup-content-text">分享</text>
					</view>
					<view class="trend-popup-content-box">
						<button :data-trend="currentTrend" class="cu-btn button-content" @click="goQrcode">
							<view class="trend-popup-content-image">
								<image src="cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/poster.png" class="content-image" mode="widthFix" />
							</view>
						</button>
						<text class="trend-popup-content-text">二维码</text>
					</view>
					<view v-if="currentTrend.is_open_comments" class="trend-popup-content-box">
						<button :data-tid="currentTrend._id" @click="switchComments(currentTrend)" class="cu-btn button-content">
							<view class="trend-popup-content-image">
								<image src="cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/close-comments.png" class="content-image" mode="widthFix" />
							</view>
						</button>
						<text class="trend-popup-content-text">关闭评论</text>
					</view>
					<view v-if="!currentTrend.is_open_comments" class="trend-popup-content-box">
						<button :data-tid="currentTrend._id" @click="switchComments(currentTrend)"class="cu-btn button-content">
							<view class="trend-popup-content-image">
								<image src="cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/open-comments.png" class="content-image" mode="widthFix" />
							</view>
						</button>
						<text class="trend-popup-content-text">打开评论</text>
					</view>
					<view class="trend-popup-content-box">
						<button :data-tid="currentTrend._id" @click="removeTrend(currentTrend)"class="cu-btn button-content">
							<view class="trend-popup-content-image">
								<image src="cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/delete.png" class="content-image" mode="widthFix" />
							</view>
						</button>
						<text class="trend-popup-content-text">删除</text>
					</view>
				</view>
				<text class="trend-popup-btn" @click="cancel('More')">取消</text>
			</view>
		</uni-popup>

		<!-- 底部评论弹窗 -->
		<uni-popup ref="showComments" type="bottom" @change="change">
			<view class="trend-popup bg-white">
				<text class="cuIcon-close trend-popup-close" @click="cancel('Comments')">
				</text>
				<text class="trend-popup-title" v-if="currentTrend.comments_num>0">{{currentTrend.comments_num}}条评论</text>
				<text class="trend-popup-title" v-else>评论</text>
				<view class="trend-popup-content">
					<scroll-view class="ups-height" scroll-y="true" @scrolltolower="loadMoreComments">
						<view v-for="(comment,pidx) in commentList" :key="pidx">
							<ups-comment :comment="comment" :idx=pidx @operate="operateComment"></ups-comment>
							<view v-if="comment.replys_num>0">
								<view class="cu-reply"  @click="commentExpend(comment)" >
									<text  v-if="!comment.isSpread" >展开{{comment.replys_num}}条回复</text>
								</view>
								<view class="cu-reply" v-if="comment.isSpread">
									<view v-for="(reply,idx) in comment.replys" :key="idx">
										<ups-comment :comment="reply" :idx=idx :pidx=pidx :isReply="true" :isSubReply="isSubReply" @operate="operateReply" ></ups-comment>
									</view>
								</view>
							</view>
							<view class="card-popup-line"></view>
						</view>
					</scroll-view>

					<view class="cu-bar foot input">
						<input class="solid-bottom" :adjust-position="true" :focus="isFocus" maxlength="140" cursor-spacing="10" v-model="inputContent" @input="contentInput" :placeholder="tips"></input>
						<view class="action">
							<text class="text-gray">{{textCont}}/140</text>
						</view>
						<button class="cu-btn shadow-blur radius bg-grey"   @click="sendComment" >发送</button>
					</view>
				</view>
			</view>
		</uni-popup>

		<!-- 删除弹窗 -->
		<uni-popup ref="showRemove" type="bottom" @change="removeChange">
			<view class="trend-popup bg-white">
				<view class="trend-popup-content">
					<text class="remove-popup-btn" @click="removeComment(currentComment)">删除</text>
				</view>
				<text class="trend-popup-btn" @click="cancel('Remove')">取消</text>
			</view>
		</uni-popup>

		<view class="DrawerClose" :class="itemModalName=='viewSideModal'?'show':''" @tap="hideSideModal">
			<text class="cuIcon-pullright"></text>
		</view>
		
		<!--侧面列表-->
		<scroll-view scroll-y class="DrawerWindow" :class="itemModalName=='viewSideModal'?'show':''">
			<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg" style="margin-left: 0;margin-right: 0;">
				<slot v-if="currentTrend.activityList.length>0">
					<view  class="cu-card article" style="width: 100%" v-for="(activity,aIndex) in currentTrend.activityList" :key="aIndex">
						<view class="cu-item shadow rel" style="margin: 10rpx;padding: 20rpx 0" @tap="goActivityDetail(activity)" >
							<view class="content">
								<image :src="activity.cover" mode="aspectFill"></image>
								<view class="desc">
									<view class="text-content">
										{{activity.title}}
									</view>
									<view class="flex top-30 rel">
										<view class="text-gray">
											{{activity.sign_up}}
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</slot>
				<slot v-if="currentTrend.productList.length>0">
					<view  class="cu-card article" style="width: 100%" v-for="(product,gIndex) in currentTrend.productList" :key="gIndex">
						<view class="cu-item shadow" style="margin: 10rpx;padding: 20rpx 0" @tap="goProductDetail(product)">
							<view class="content">
								<image :src="product.carouse[0]"  mode="aspectFill" ></image>
								<view class="desc">
									<view class="text-content">
										{{product.title}}
									</view>
									<view class="flex top-30 rel">
										<view  class="cu-capsule radius">
											<view class='cu-tag bg-red '>
												¥
											</view>
											<view class="cu-tag line-grey">
												{{product.price}}
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</slot>
			</view>
		</scroll-view>
	</view>
</template>

<script>
    import { mapState } from 'vuex';
    import upsTrend from "@/components/ups-trend/index";
    import upsProduct from '@/components/ups-product/index';
    import upsActivity from '@/components/ups-activity/index';
    import uniPopup from '@/components/uni-popup/uni-popup';
    import upsComment from '@/components/ups-comment/index';
    import dateUtil from '@/utils/cmnUtils.js';
    // #ifdef H5
    import cloudbase from '@cloudbase/js-sdk';
    // #endif

    export default {
        name: "UpsTrendList",
        components:{
            "ups-trend":upsTrend,
            "ups-product":upsProduct,
            "ups-activity":upsActivity,
            "ups-comment":upsComment,
            "uni-popup":uniPopup,
        },
        data() {
            return {
				title:'',
                triggered: false,
                trendList:[],
                page:1,
                //播放列表
                trendPlayingIdxs:[],
                //控制弹窗与遮罩的显示与隐藏
                isUps:false,

                //用于关联选中的展台
                currentTrend:null,
                //展台对应索引
                currentIdx:0,

                tips:'写评论...',
                //被回复者名称
                repliedName:'',
                //二级回复（子回复）
                isSubReply:false,
                //设定输入框焦点
                isFocus:false,
                //以下是评论页面数据定义
                //用于删除评论时传递_id
                currentComment:null,
                commentList:[],


                commentListPage:1,
                replyInfo:{
                    isReply:false,
                    pidx:0,
                    comment_id:''
                },
                lastComment:{
                },
                lastReply:{
                },
                inputContent:'',
                textCont:0,
                //货物列表modal
                itemModalName:null,

            }
        },

        onLoad(options) {
			this.title=options.title;
            this._freshing = false;
            setTimeout(() => {
                this.triggered = true;
            }, 100);
            this.page=1;
        },
        onShow(){
            this.getList();
        },
        onPullDownRefresh() {
            this.page=1;
            this.getList();
			uni.stopPullDownRefresh(); // 停止刷新
        },
        onReachBottom() {
            this.page=this.page+1;
            this.getList()
        },
        onShareAppMessage(res){
            this.$refs['showMore'].close();
            let  trend = res.target.dataset.trend;
            if(res.from=== 'button'){
                return{
                    title:trend.content,
                    imageUrl:trend.cover,
                    path:"/pagesCmn/trend/ShareTrendDetail?id="+trend._id,
                    success:function(r){
                        uni.showToast({
                            'icon':'success',
                            'title':'分享成功'
                        })
                    }
                }
            }
        },
        computed:{
            ...mapState(['user','cloudPath']),
        },
        methods:{
            onRefresh() {
                if (this._freshing) return;
                this._freshing = true;
                setTimeout(() => {
                    this.triggered = false;
                    this._freshing = false;
                }, 600);
                this.page=1;
                this.getList()
            },
            onRestore() {
                this.triggered = 'restore'; // 需要重置
            },
            getRefresh(){
                this.page=1;
                this.getList()
            },
            getYiShow(){
                this.page=this.page+1;
                this.getList()
            },
            //隐藏/弹出更多功能
            async togglePopup(item,idx,open){
               let that = this;
                that.currentTrend = item;
                //商务名片的控制权设定
                if(that.currentTrend.card_id){
                    let managedList =  that.user.managed_card||{};
                    for(let i in managedList){
                        if(managedList[i].card_id==that.currentTrend.card_id){
                            that.currentTrend.isOwner = true;
                            break;
                        }
                    }
                }
                that.currentIdx = idx;
                that.commentListPage = 1;
                that.getCommentList();

                that.$nextTick(() => {
                    that.$refs['show'+open].open()
                })
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
            removeChange(e){
                if(e.show){
                }else{
                }
            },
            onBackPress(){
                this.$refs['showMore'].close();
                this.$refs['showComments'].close()
            },
            async operateTrend(type,trend,idx){
                let that = this;
                if(type=='addLike'){
                    that.trendList[idx].isLike=true;
                    if(!that.trendList[idx].likes_num){
                        that.trendList[idx].likes_num =0;
                    }
                    that.trendList[idx].likes_num +=1;
                    let like={
                        user_id:that.user._id,
                        name:that.user.userInfo.nickName,
                        avatar:that.user.userInfo.avatarUrl,
                        create_at:new Date()
                    };
                    // #ifdef MP-WEIXIN
                    await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'addTrendLike',
                            id:trend._id,
                            like:like,
                        }
                    });
                    // #endif
                    // #ifdef H5
                    await cloudbase.callFunction({
                        name:'cmn',
                        data:{
                            $url:'addTrendLike',
                            id:trend._id,
                            like:like,
                        }
                    });
                    // #endif
                    that.$forceUpdate()
                }else if(type=='removeLike'){
                    that.trendList[idx].isLike=false;
                    that.trendList[idx].likes_num -=1;
                    let like={
                        user_id:that.user._id
                    };
                    // #ifdef MP-WEIXIN
                    await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'removeTrendLike',
                            id:trend._id,
                            like:like,
                        }
                    });
                    // #endif
                    // #ifdef H5
                    await cloudbase.callFunction({
                        name:'cmn',
                        data:{
                            $url:'removeTrendLike',
                            id:trend._id,
                            like:like,
                        }
                    });
                    // #endif
                    that.$forceUpdate()
                }
            },
            
			goMy(){
                uni.reLaunch({
                    url: '/pages/my/home',
                })
            },
         
            goAdd(){
                uni.navigateTo({
                    url: '/pagesMgt/BizTrendInput',
                })
            },
           
            async getList(){
                let that = this;
                if (that.page == 1) {
                    that.trendList=[]
                }
                let pageList =[];
                let res = null;
                // #ifdef MP-WEIXIN
                res=  await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'getTrendListByCardId',
                        cardId:that.user.userInfo.bizCardId,
                        page:that.page,
                    }
                });
                pageList = res.result.data;
                // #endif
                // #ifdef H5
                res=  await wx.cloud.callFunction({
                    name:'web',
                    data:{
                        $url:'getTrendListByCardId',
                        cardId:that.user.userInfo.bizCardId,
                        page:that.page,
                    }
                });
                pageList = JSON.parse(res.result.data);
                // #endif
				pageList.forEach(each=>{
					each.createAt =  dateUtil.formatTime(each.create_at,'yyyy-MM-dd HH:mm')
				});
				Object.assign(that.trendList,res.result.data);
                that.observerTrendsVideo();
                that.$forceUpdate();
            },
            /**
             * 传递观测参数thresholds必须传递this
             * 通过that.$refs调用子类方法
             */
            observerTrendsVideo(){
                let that = this;
                that.trendList.forEach((item,index)=>{
                    let obs=wx.createIntersectionObserver(this,{thresholds:[0.8]});
                    obs.relativeToViewport().observe('#tid'+index,(res)=>{
                        // console.log('appear',res.intersectionRatio > 0.8,'index',index,'res.intersectionRatio',res.intersectionRatio);
						if(res.intersectionRatio > 0.8){
							that.$refs.refTrend[index].playVideo();
						}else if(res.intersectionRatio>0){
							that.$refs.refTrend[index].pauseVideo();
						}
                    })
                })
            },

            //当前评论方法
            async getCommentList(type){
				 let that = this;
                if(!that.currentTrend){
                    return;
                }
                if (that.commentListPage == 1) {
                    that.commentList=[]
                }
                let pageList =[];
                let res = null;
                // #ifdef MP-WEIXIN
                res=await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'getCommentList',
                        trendId:that.currentTrend._id,
                        userId:that.user._id,
                        page:that.commentListPage,
                    }
                });
                pageList =res.result.data;
                // #endif
                // #ifdef H5
                res=await cloudbase.callFunction({
                    name:'web',
                    data:{
                        $url:'getCommentList',
                        trendId:that.currentTrend._id,
                        userId:that.user._id,
                        page:that.commentListPage,
                    }
                });
                pageList =JSON.parse(res.result.data);
                // #endif
				if( pageList.length > 0){
                    pageList.forEach(d => {
						that.commentList.push(d);
					})
				}else{
					that.commentListPage--;
				}
				if (type == "refresh") {
				    uni.stopPullDownRefresh(); // 停止刷新
				}
                that.$forceUpdate();
            },


            async sendComment(e){
                let that = this;
                if(that.inputContent){
                    let res = null;
                    // #ifdef MP-WEIXIN
                    res= await wx.cloud.callFunction({
                        name:'sys',
                        data:{
                            $url:'msgSecCheck',
                            value:that.inputContent
                        }
                    });
                    // #endif
                    // #ifdef H5
                    res= await cloudbase.callFunction({
                        name:'sys',
                        data:{
                            $url:'msgSecCheck',
                            value:that.inputContent
                        }
                    });
                    // #endif
                    if(res.result.code!=0){
                        uni.showToast({
                            icon:'none',
                            title:'内容含有违规内容，请修改后提交'
                        });
                        that.inputContent='';
                        return;
                    }
					that.doSendComment();
                }
                that.tips='写评论...';
                that.$forceUpdate();
            },

            async doSendComment(){
                let that = this;
                if(that.replyInfo.isReply){
                    if(!that.lastReply.user_id){
                        that.lastReply.trend_id = that.currentTrend._id;
                        that.lastReply.user_id = that.user._id;
                        that.lastReply.name = that.user.userInfo.nickName;
                        that.lastReply.avatar = that.user.userInfo.avatarUrl;
                    }
                    that.lastReply.create_at = new Date();
                    that.lastReply.content = that.inputContent;
                    that.lastReply.replied_name = that.repliedName;
                    that.lastReply.is_sub_reply = that.isSubReply;
                    that.lastReply.uid =  that.genCommentReplyUid(10);
                    // #ifdef MP-WEIXIN
					await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'addCommentReply',
                            id:that.replyInfo.comment_id,
                            trendId:that.currentTrend._id,
                            reply:that.lastReply,
                        }
                    });
                    // #endif
                    // #ifdef H5
                    await cloudbase.callFunction({
                        name:'cmn',
                        data:{
                            $url:'addCommentReply',
                            id:that.replyInfo.comment_id,
                            trendId:that.currentTrend._id,
                            reply:that.lastReply,
                        }
                    });
                    // #endif
					if(!that.commentList[that.replyInfo.pidx].replys_num){
						that.commentList[that.replyInfo.pidx].replys_num=0;
						that.commentList[that.replyInfo.pidx].replys=[]
					}
					that.commentList[that.replyInfo.pidx].replys_num +=1;
					let tempReply ={};
					Object.assign(tempReply,that.lastReply);
					that.commentList[that.replyInfo.pidx].replys.push(tempReply);
					that.inputContent='';
					that.replyInfo.isReply=false;
					delete(that.lastReply.uid);
                    // #ifdef MP-WEIXIN
					await wx.cloud.callFunction({
						name:'cmn',
						data:{
							$url:'commentCount',
							type:'inc',
							trendId:that.currentTrend._id
						}
					});
                    // #endif
                    // #ifdef H5
                    await cloudbase.callFunction({
                        name:'cmn',
                        data:{
                            $url:'commentCount',
                            type:'inc',
                            trendId:that.currentTrend._id
                        }
                    });
                    // #endif
                }else{
                    if(!that.lastComment.user_id){
                        that.lastComment.trend_id = that.currentTrend._id;
                        that.lastComment.user_id = that.user._id;
                        that.lastComment.name = that.user.userInfo.nickName;
                        that.lastComment.avatar = that.user.userInfo.avatarUrl;
                    }
                    that.lastComment.create_at = new Date();
                    that.lastComment.content = that.inputContent;
                    that.lastComment.replys =[];//初始化
                    let res = null;
                    // #ifdef MP-WEIXIN
                    res= await wx.cloud.callFunction({
					    name:'cmn',
					    data:{
					        $url:'addComment',
					        comment:that.lastComment
					    }
					});
                    // #endif
                    // #ifdef H5
                    res= await cloudbase.callFunction({
                        name:'cmn',
                        data:{
                            $url:'addComment',
                            comment:that.lastComment
                        }
                    });
                    // #endif
                    that.lastComment._id=res.result._id;
                    let tempComment ={};
                    Object.assign(tempComment,that.lastComment);
                    that.commentList.push(tempComment);
                    that.inputContent='';
                    delete(that.lastComment._id);
					// #ifdef MP-WEIXIN
                    await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'commentCount',
                            type:'inc',
                            trendId:that.currentTrend._id
                        }
                    });
                    // #endif
                    // #ifdef H5
                    await cloudbase.callFunction({
                        name:'cmn',
                        data:{
                            $url:'commentCount',
                            type:'inc',
                            trendId:that.currentTrend._id
                        }
                    });
                    // #endif
                }
                that.currentTrend.comments_num++;
                for(let i in that.trendList){
                    if(that.trendList[i]._id== that.currentTrend._id) {
                        that.trendList[i].comments_num = that.currentTrend.comments_num;
                        break;
                    }
                }
                that.tips='写评论...';
                that.$forceUpdate();
            },
            contentInput(e){
                this.textCont = e.detail.value.length;
                if(this.replyInfo.isReply){
                    let tempComment=e.detail.value;
                    if(tempComment.length==0){
                        this.replyInfo.isReply=false
                    }
                }
                this.$forceUpdate()
            },

            async operateComment(type,comment,idx,pidx){
                let that = this;
                if(type=='addLike'){
                    that.commentList[idx].isLike=true;
                    if(!that.commentList[idx].likes_num){
                        that.commentList[idx].likes_num =0;
                    }
                    that.commentList[idx].likes_num +=1;

                    let like={
                        user_id:that.user._id,
                        name:that.user.userInfo.nickName,
                        avatar:that.user.userInfo.avatarUrl,
                        create_at:new Date()
                    };
                    // #ifdef MP-WEIXIN
                    await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'addTrendLike',
                            id:comment._id,
                            like:like,
                        }
                    });
                    // #endif
                    // #ifdef H5
                    await cloudbase.callFunction({
                        name:'cmn',
                        data:{
                            $url:'addTrendLike',
                            id:comment._id,
                            like:like,
                        }
                    });
                    // #endif
                }else if(type=='removeComment'){
                    that.currentComment = comment;
                    that.$nextTick(() => {
                        that.$refs['showRemove'].open()
                    })
                }else if(type=='removeLike'){
                    that.commentList[idx].isLike=false;
                    that.commentList[idx].likes_num -=1;

                    let like={
                        user_id:that.user._id,
                    };
                    // #ifdef MP-WEIXIN
                    await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'removeTrendLike',
                            id:comment._id,
                            like:like,
                        }
                    });
                    // #endif
                    // #ifdef H5
                    await cloudbase.callFunction({
                        name:'cmn',
                        data:{
                            $url:'removeTrendLike',
                            id:comment._id,
                            like:like,
                        }
                    });
                    // #endif
                }else if(type=='addReply'){
                    that.isFocus =true;
                    that.replyInfo.isReply =true;
                    that.replyInfo.pidx=idx;
                    that.replyInfo.comment_id=that.commentList[idx]._id;
                    that.tips='回复 '+comment.name;
                    that.repliedName = comment.name;
                    that.isSubReply =false;
                    that.inputContent='';
                }else if(type=='removeReply'){

                }
                that.$forceUpdate()
            },
            async operateReply(type,reply,idx,pidx){
                let that = this;
                if(type=='addLike'){
                    that.commentList[pidx].replys[idx].isLike=true;
                    if(!that.commentList[pidx].replys[idx].likes_num){
                        that.commentList[pidx].replys[idx].likes_num =0;
                    }
                    that.commentList[pidx].replys[idx].likes_num +=1;

                    let like={
                        user_id:that.user._id,
                        name:that.user.userInfo.nickName,
                        avatar:that.user.userInfo.avatarUrl,
                        create_at:new Date()
                    };
                    // #ifdef MP-WEIXIN
                    await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'addCommentReplyLike',
                            id:that.commentList[pidx]._id,
                            replyUid:reply.uid,
                            like:like,
                        }
                    });
                    // #endif
                    // #ifdef H5
                    await cloudbase.callFunction({
                        name:'cmn',
                        data:{
                            $url:'addCommentReplyLike',
                            id:that.commentList[pidx]._id,
                            replyUid:reply.uid,
                            like:like,
                        }
                    });
                    // #endif
                }else if(type=='removeLike'){
                    that.commentList[pidx].replys[idx].isLike=false;
                    that.commentList[pidx].replys[idx].likes_num -=1;

                    let like={
                        user_id:that.user._id,
                    };
                    // #ifdef MP-WEIXIN
                    await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'removeCommentReplyLike',
                            id:that.commentList[pidx]._id,
                            replyUid:reply.uid,
                            like:like
                        }
                    });
                    // #endif
                    // #ifdef H5
                    await cloudbase.callFunction({
                        name:'cmn',
                        data:{
                            $url:'removeCommentReplyLike',
                            id:that.commentList[pidx]._id,
                            replyUid:reply.uid,
                            like:like
                        }
                    });
                    // #endif
                }else if(type=='addReply'){
                    that.isFocus =true;
                    that.replyInfo.isReply=true;
                    that.replyInfo.pidx=pidx;
                    that.replyInfo.comment_id=that.commentList[pidx]._id;
                    that.tips='回复 '+reply.name;
                    that.repliedName = reply.name;
                    that.isSubReply = true;
                    that.inputContent='';
                }else if(type=='removeReply'){

                }
                that.$forceUpdate()
            },
            commentExpend(comment){
                if(comment.isSpread){
                    comment.isSpread=false
                }else{
                    comment.isSpread = true
                }
                //强制更新
                this.$forceUpdate()
            },
            genCommentReplyUid(len){
                return Math.random().toString(20).substr(3,len);
            },

            loadMoreComments(){
                this.inputContent='';
                this.commentListPage +=1;
                this.getCommentList()
            },

            async removeTrend(currentTrend){
                let that = this;
               that.$refs['showMore'].close();
                // #ifdef MP-WEIXIN
                await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'removeTrend',
                        content:currentTrend,
                    }
                });
                // #endif
                // #ifdef H5
                await cloudbase.callFunction({
                    name:'cmn',
                    data:{
                        $url:'removeTrend',
                        content:currentTrend,
                    }
                });
                // #endif
                uni.showToast({
                    icon:'success',
                    title:'删除成功'
                });

                for(let i in that.trendList){
                    if(that.trendList[i]._id==currentTrend._id){
                        that.trendList.splice(i,1);
                        break;
					}
				}
                this.$forceUpdate()
            },

            async switchComments(currentTrend){
                let that = this;
               that.$refs['showMore'].close();
                // #ifdef MP-WEIXIN
                await  wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'switchComments',
                        id:currentTrend._id,
                        isOpenComments:!currentTrend.is_open_comments,
                    }
                });
                // #endif
                // #ifdef H5
                await  cloudbase.callFunction({
                    name:'cmn',
                    data:{
                        $url:'switchComments',
                        id:currentTrend._id,
                        isOpenComments:!currentTrend.is_open_comments,
                    }
                });
                // #endif
                this.currentTrend.is_open_comments=!currentTrend.is_open_comments;
                this.$forceUpdate();
            },

            async removeComment(comment){
                this.$refs['showRemove'].close();
                // #ifdef MP-WEIXIN
                await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'removeComment',
                        id:this.currentTrend._id,
                        content:comment,
                    }
                });
                // #endif
                // #ifdef H5
                await cloudbase.callFunction({
                    name:'cmn',
                    data:{
                        $url:'removeComment',
                        id:this.currentTrend._id,
                        content:comment,
                    }
                });
                // #endif
                this.currentTrend.comments_num--;
                this.getCommentList("refresh");
                this.$forceUpdate();
            },

			showActivityModal(item,viewModal) {
                this.isUps = true;
				this.currentTrend = item;
                if(this.currentTrend.activityList.length==1){
                    this.goActivityDetail(this.currentTrend.activityList[0]);
                }else{
                    this.itemModalName = viewModal;
                    this.title = '备选活动'
                }
			},

			showProductModal(item,viewModal) {
                this.isUps = true;
				this.currentTrend = item;
				if(this.currentTrend.productList.length==1){
					this.goProductDetail(this.currentTrend.productList[0]);
				}else{
					this.itemModalName = viewModal;
					this.title = '备选产品'
				}
			},

			goActivityDetail(activity){
				uni.navigateTo({
					url:'/pagesCmn/activity/ShareActivityDetail?id='+activity._id
				})
			},

			//商品详情
			goProductDetail(product){
				uni.navigateTo({
					url:'/pagesCmn/product/ShareProductDetail?id='+product._id
				})
			},

            hideSideModal(e) {
                this.isUps=false;
                this.itemModalName = null;
                this.title = '展台'
            },

            goQrcode(e){
                let that = this;
               that.$refs['showMore'].close();
                let trend = e.currentTarget.dataset.trend;
                uni.navigateTo({
                    url:"/pagesCmn/trend/TrendQrcode?id="+ trend._id
                })
            },
        },
    }
</script>

<style>
	/* 底部分享 */
	.trend-popup {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		border-top-left-radius: 3%;
		border-top-right-radius: 3%;
	}
	.trend-popup-close {
		position:absolute;
		top:30rpx;
		left:30rpx;
		font-size: 39rpx;
		text-align: center;
		font-weight: bold;
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

	.trend-popup-content-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		width: 180rpx;
	}

	.trend-popup-content-image {
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

	.small-image {
		width: 50rpx;
		height: 50rpx;
	}

	.trend-popup-content-text {
		font-size: 26rpx;
		color: #333;
		padding-top: 5px;
		padding-bottom: 10px;
	}

	.trend-popup-btn {
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

	.button-content {
		width: 100rpx;
		height: 100rpx;
		border-radius:15px;
	}

	.cu-btn{
		padding: 0 10rpx;
	}

	.cu-reply {
		margin-left: 90rpx;
	}
	.card-popup-line {
		line-height: 90rpx;
		border-top-color: #DADADA;
		border-top-width: 1px;
		border-top-style: solid;
		margin:25rpx 20rpx 25rpx 70rpx;
	}

	.card-btn{
		width: 60rpx;
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
		z-index: 98;
	}

	.ups-height{
		height: 850rpx;
		padding-bottom:62px;
	}

	.ups-order-height{
		height: 850rpx;
	}

	page {
		background-image: var(--gradualBlue);
		width: 100vw;
		overflow: hidden;
	}

	.DrawerPage {
		position: fixed;
		width: 100vw;
		/*height: 100vh;*/
		height: 100%;
		/*height: 1160rpx;*/
		left: 0vw;
		background-color: #f1f1f1;
		transition: all 0.4s;
	}

	.DrawerPage.show {
		transform: scale(0.9, 0.9);
		left: 85vw;
		box-shadow: 0 0 60upx rgba(0, 0, 0, 0.2);
		transform-origin: 0;
	}

	.DrawerWindow {
		position: absolute;
		width: 85vw;
		height: 100vh;
		left: 0;
		top: 0;
		transform: scale(0.9, 0.9) translateX(-100%);
		opacity: 0;
		pointer-events: none;
		transition: all 0.4s;
		padding: 100upx 0;
	}

	.DrawerWindow.show {
		transform: scale(1, 1) translateX(0%);
		opacity: 1;
		pointer-events: all;
	}

	.DrawerClose {
		position: absolute;
		width: 40vw;
		height: 100vh;
		right: 0;
		top: 0;
		color: transparent;
		padding-bottom: 30upx;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.6));
		letter-spacing: 5px;
		font-size: 50upx;
		opacity: 0;
		pointer-events: none;
		transition: all 0.4s;
	}

	.DrawerClose.show {
		opacity: 1;
		pointer-events: all;
		width: 15vw;
		color: #fff;
	}

	.DrawerPage .cu-bar.tabbar .action button.cuIcon {
		width: 64upx;
		height: 64upx;
		line-height: 64upx;
		margin: 0;
		display: inline-block;
	}

	.DrawerPage .cu-bar.tabbar .action .cu-avatar {
		margin: 0;
	}

	.DrawerPage .nav {
		flex: 1;
	}

	.DrawerPage .nav .cu-item.cur {
		border-bottom: 0;
		position: relative;
	}

	.DrawerPage .nav .cu-item.cur::after {
		content: "";
		width: 10upx;
		height: 10upx;
		background-color: currentColor;
		position: absolute;
		bottom: 10upx;
		border-radius: 10upx;
		left: 0;
		right: 0;
		margin: auto;
	}

	.DrawerPage .cu-bar.tabbar .action {
		flex: initial;
	}
	.cu-form-group{
		/*background-color: #FFFAE8;*/
		min-height: 72rpx;
	}
	.cu-form-group .title{
		font-size: 24rpx;
	}

	.cu-form-group input{
		font-size: 24rpx;
	}

	.bg-summary{
		padding: 20rpx 25rpx 25rpx 40rpx;
		border-radius: 15px;
		margin:0 40rpx 40rpx 40rpx;
		background-color: #FFFAE8;
	}

	.text-summary{
		font-size: 28rpx;
		margin:0 0 10rpx -28rpx;
	}

	button{
		outline:0 none !important;
		blr:expression(this.onFocus-this.blur());
	}
	button::after{
		border:none
	}
</style>