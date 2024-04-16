<template style="background-color: #000">
    <view class="page" :class="isUps == true ? 'prevent' : ''" :style="{ height: windowHeight }">
        <cu-custom    :isBack="isReturn" :bgColor="'bg-dark'">
            <block slot="backText">返回</block>
            <block slot="content">{{playList[index].title}}</block>
        </cu-custom>
        <slot v-if="!isUps">
            <swiper class="swiper" :vertical="true"  @change="changeCurrent" @animationfinish="animationFinish"  :current="index">
                <swiper-item v-for="(item, idx) in playList" :key="idx" class="swiper-item" @tap = "videoPlayPause">
                    <div v-if="Math.abs(index-idx)<=1" class="video-box">
						<slot v-if="existVideo(item.src)">
							<ups-play class="video" :src="item.src"  :height="height" :width="width"
										   :play="item.flag" v-if="Math.abs(index-idx)<=1" :gDuration="item.duration"
										   :initialTime="item.initialTime" @pause="pauseVideo" :objectFit="item.objectFit"
										   @playEnd="playEnd" :danmuList="danmuList">
							</ups-play>
						</slot>
						<slot v-else>
							<swiper   :style="'min-height:'+ windowHeight +'px;'" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="500">
								<swiper-item v-for="(image,iidx) in item.carousels" :key="iidx">
									<image :src="image.tempFileURL" mode="aspectFit"></image>
								</swiper-item>
							</swiper>
						</slot>
						<slot v-if="isShowLabels">
							<cover-view  class="cover-view-left padding-left-sm">
								<cover-view class="left-view">
									<cover-view class="left-text">@{{item.at||''}}</cover-view>
								</cover-view>
								<cover-view class="left-view">
									<cover-view class="left-text line-limit-length">{{item.content}}</cover-view>
								</cover-view>
							</cover-view>
							<cover-view class="cover-view-right">
								<cover-image :src="item.avatar" class="avatar img" @click.stop="tapAvatar"></cover-image>
								<cover-view class="right-text"></cover-view>
								<cover-image :src="item.check?'cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/heartRed.png':'cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/heart.png'" class="img" @click.stop="tapLove"></cover-image>
								<cover-view class="right-text">{{item.like}}</cover-view>
								<cover-image src="cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/msg.png" class="img" @click.stop="tapMsg()"></cover-image>
								<cover-view class="right-text">{{item.comments_num}}</cover-view>
								<button :data-videoObj="item" style="background: transparent" open-type="share">
									<cover-image src="cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/share-fill.png" class="img" ></cover-image>
								</button>
								<cover-view class="right-text">分享</cover-view>
								<slot v-if="item.productList.length>0">
									<button :data-videoObj="item" style="background: transparent" @click.stop="tapBuy">
										<cover-image src="cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/product.png" class="img" ></cover-image>
									</button>
									<cover-view class="right-text">产品</cover-view>
								</slot>
								<slot v-if="item.activityList.length>0">
									<button :data-videoObj="item" style="background: transparent" @click.stop="tapJoin">
										<cover-image src="cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/activity.png" class="img" ></cover-image>
									</button>
									<cover-view class="right-text">活动</cover-view>
								</slot>
								<cover-image src="cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/qrcode.png" class="img" @click.stop="goQrcode()"></cover-image>
							</cover-view>
						</slot>
                    </div>
                </swiper-item>
            </swiper>
        </slot>
        <!-- 遮罩 -->
        <view class="shade" v-if="isUps"></view>
        <!-- 底部活动预定展现弹窗 -->
        <uni-popup ref="showActivityList" type="bottom" @change="change">
            <!-- 底部活动预定弹窗 -->
            <view class="trend-popup bg-white">
                <text class="cuIcon-close trend-popup-close" @click="cancel('ActivityList')"></text>
                <text class="trend-popup-title" >活动一览</text>
                <view class="trend-popup-content">
                    <scroll-view class="ups-height" scroll-y="true">
                        <view class="cu-list menu-avatar" >
                            <view class="cu-item" @tap="goActivityDetail(activity)" v-for="(activity,aIndex) in playList[index].activityList" :key="aIndex">
                                <view  class="cu-avatar lg radius">
                                    <image :src="activity.cover" mode="aspectFill"></image>
                                </view>
                                <view class="content">
                                    <view class="text-grey">{{activity.title}}</view>
                                    <view class="text-gray text-sm flex">
                                        <view class="text-cut"> {{activity.sign_up}} </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </view>
        </uni-popup>

        <!-- 底部产品预定展现弹窗 -->
        <uni-popup ref="showProductList" type="bottom" @change="change">
            <!-- 底部活动预定弹窗 -->
            <view class="trend-popup bg-white">
                <text class="cuIcon-close trend-popup-close" @click="cancel('ProductList')"></text>
                <text class="trend-popup-title" >产品一览</text>
                <view class="trend-popup-content">
                    <scroll-view class="ups-height" scroll-y="true">
                        <view class="cu-list menu-avatar " >
                            <view class="cu-item" @tap="goProductDetail(product)" v-for="(product,gIndex) in playList[index].productList" :key="gIndex">
                                <view  class="cu-avatar lg radius">
                                    <image :src="product.carouse[0]" mode="aspectFill"></image>
                                </view>
                                <view class="content">
                                    <view class="text-grey">{{product.title}}</view>
                                    <view class="text-gray text-sm flex">
                                        <view class="text-cut"> ¥{{product.price}} </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </view>
        </uni-popup>

        <!-- 底部评论弹窗 -->
        <uni-popup ref="showComments" type="bottom" @change="change">
            <view class="trend-popup bg-white" :style="{height:height}" >
                    <text class="cuIcon-close trend-popup-close" @click="cancel('Comments')"></text>
                    <text class="trend-popup-title" v-if="playList[index].comments_num>0">{{playList[index].comments_num}}条评论</text>
                    <text class="trend-popup-title" v-else>评论</text>
                <view class="trend-popup-content">
                    <scroll-view class="ups-height-padding bg-white" :style="{height:commentHeight}" scroll-y="true" @scrolltolower="loadMoreComments">
                        <view v-for="(comment,pidx) in commentList" :key="pidx">
                            <ups-comment :comment="comment" :idx=pidx @operateCard="operateComment"></ups-comment>
                            <view v-if="comment.replys_num>0">
                                <view class="cu-reply"  @click="commentExpend(comment)" >
                                    <text  v-if="!comment.isSpread" >展开{{comment.replys_num}}条回复</text>
                                </view>
                                <view class="cu-reply" v-if="comment.isSpread">
                                    <view v-for="(reply,idx) in comment.replys" :key="idx">
                                        <ups-comment :comment="reply" :idx=idx :pidx=pidx :isReply="true" :isSubReply="isSubReply" @operateCard="operateReply" ></ups-comment>
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
                        <button class="cu-btn  shadow-blur radius bg-grey"    @click="sendComment" >发送</button>
                    </view>
                </view>
            </view>
        </uni-popup>

        <!-- 底部扩展功能弹窗 -->
        <uni-popup ref="showRemove" type="bottom" @change="removeChange">
            <view class="trend-popup bg-white">
                <view class="trend-popup-content">
                    <text class="remove-popup-btn" @click="removeComment(currentComment)">删除</text>
                </view>
                <text class="trend-popup-btn" @click="cancel('Remove')">取消</text>
            </view>
        </uni-popup>
    </view>
</template>
<script>
    import { mapState,mapMutations } from 'vuex'
    import upsPlay from '@/components/ups-play/index'
    import upsComment from '@/components/ups-comment/index';
    import upsProduct from '@/components/ups-product/index';
    import upsActivity from "@/components/ups-activity/index";
    import uniPopup from '@/components/uni-popup/uni-popup';


    export default {
        components:{
            "ups-play":upsPlay,
            "ups-comment":upsComment,
            "ups-product":upsProduct,
            "ups-activity":upsActivity,
            "uniPopup":uniPopup,
        },
        data() {
            return {
               isReturn: true,
                isUps:false,
				isShowLabels:true,//显示文字标签
                page:1,
                trend:{_id:'',qrcode:'',card_id:'-1'},
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
                sysHeight:0,
                playCount:2,//剩余多少视频加载视频列表
                playList:[],
                height:'',
                commentHeight:'',
                index:0,
                width:'',
                oldIndex:0,
                windowHeight:-1,
                authBizInfo:{}
            }
        },
        onLoad(options){
            let that = this;
            if(options.isReturn){
              that.isReturn =  options.isReturn;
            }
            if(options.id){
                that.trend._id=options.id;
                that.getTrendById();
            }
            //扫码加好友
            else if (options.scene) {
                that.isReturn = false;
                that.paramsStr +='scene='+options.scene;
                let res = {};
                let params = decodeURIComponent(options.scene).split("&");
                params.forEach(item => {
                    let paramMap = item.split("=");
                    res[paramMap[0]] = paramMap[1];
                    if(paramMap[0]=='qrcode'){
                        that.trend.qrcode=paramMap[1];
                    }
                });
                that.getTrendIdByQrcode();
            }
            let system = that.getSystem();
            that.windowHeight=system.h*0.77;
        },
        created(){
            //#ifdef APP-PLUS
            plus.screen.lockOrientation("portrait-primary");
            //隐藏subnvue
            uni.getSubNVueById('comment').hide();
            uni.getSubNVueById('input-box').hide();
            //#endif
            this.sysHeight = uni.getSystemInfoSync().windowHeight;
            this.height = `${this.sysHeight*0.77}px`;
            this.commentHeight = `${this.sysHeight*0.77-60}px`;
            let width = uni.getSystemInfoSync().windowWidth;
            this.width = `${width}px`;
            this.playList.length = 0;
            this.playList.fill({src:''});
        },
        async mounted() {
            //设置id 通过id轮到相应位置
            let id = "http://img.kaiyanapp.com/255365dbfc2622930eb0cdb33e43abf0.jpeg?imageMogr2/quality/60/format/jpg";
            // console.log('mounted',this.page,this.index);
            await this.pushPlayList();
			
            this.index = this.playList.reduce((total,item)=>{
                if(id==''||id==item.id){
                    id = ''
                }else{
                    total++
                }
                // console.log('id',id,'item.id',item.id,'total',total);
                return total
            },0);
            if(!this.index){
                this.$nextTick(()=>{
                    this.videoPlay(this.index)
                })
            }
        },
		onShow(){
			
		},
        onHide(){
            for (let item of this.playList) {
                item.flag = false
            }
        },
		
        onShareAppMessage(res){
            console.log('res',res);
            if(res.from=== 'button'){
                let dyTrend=res.target.dataset.videoobj;
                return{
                    title:dyTrend.content,
                    imageUrl:dyTrend.cover,
                    path:"/pagesCmn/trend/ShareTrendDetail?isReturn=false&id="+dyTrend.id,
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
            ...mapState(['needAuthFlag','user','cardAccount','cloudPath']),
            existVideo(){
                return function (src) {
                    let url = src||'';
                    return url.length>0;
                }
            }
        },

        methods: {
            ...mapMutations(['needWxAuth','wxAuth','updateUser','updateUserAuth']),
            getSystem(){
                let system = wx.getSystemInfoSync();
                this.scale = 667 / 375; //按照苹果留 375*667比例 其他型号手机等比例缩放 显示
                this.systemScale = system.windowWidth / 375; //按照苹果留 375*667比例 其他型号手机等比例缩放 显示
                return {w:system.windowWidth,h:system.windowHeight}
            },

            async animationFinish(e){
                if(!this.isUps){
					this.isShowLabels= false;
					this.$forceUpdate();
                    this.changeCurrent(e)
					setTimeout (() => {
					    this.isShowLabels= true;
						this.$forceUpdate();
					} , 100 )
                }
            },
			
            async changeCurrent(e){
                this.isUps = true;
                this.index = e.detail.current;
                this.$nextTick(()=>{
                    for (let item of this.playList) {
                        item.flag = false
                    }
                    this.playList[this.index].flag = true

                });
                this.isUps=false;
            },

            async getTrendById(){
                let that = this;
                let res = {};
                res =await wx.cloud.callFunction({
                    name: 'cmn',
                    data: {
                        $url: 'getTrendDetail',
                        id: that.trend._id,
                    }
                });
                that.trend = res.result.data;
                that.authBizInfo = {_id:that.trend.card_id,name:that.trend.name,avatar:that.trend.avatar};
                that.needWxAuth(that.authBizInfo);
				that.pushPlayList();
            },

            async getTrendIdByQrcode(){
                let that = this;
                let res = {};
                res =await wx.cloud.callFunction({
                    name: 'cmn',
                    data: {
                        $url: 'getTrendDetailByQrcode',
                        qrcode: that.trend.qrcode,
                    }
                });
                that.trend = res.result.data;
                that.authBizInfo = {_id:that.trend.card_id,name:that.trend.name,avatar:that.trend.avatar};
                that.needWxAuth(that.authBizInfo);
				that.pushPlayList();
            },


             //展台内容转换成抖音模式
             pushPlayList(){
                let that = this;
                console.log('page:'+that.page+",trendId:"+that.trend.card_id);
                let promise = new Promise((resolve,reject)=>{
                    wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'getTrendListByCardId',
                        cardId:that.trend.card_id,
                        page:that.page,
                    }
                    }).then((res)=>{
                        console.log('getDyTrendList res',res);
                         let result=res.result;
                         if (result.code == 0) {
                           let playGroup = [];
                           if(that.page==1){
                             that.playList=[];
                             //传入的trendId
                             if(that.trend._id != ''){
                               playGroup.push({
                                 src:that.trend.video_temp_url||'',
                                 title:that.trend.title,
                                 content:that.trend.content,
                                 flag:false,
                                 check:that.trend.isLike||false,
                                 like:that.trend.likes_num||0,
                                 comments_num:that.trend.comments_num||0,
                                 at:that.trend.name,
                                 id:that.trend._id,
                                 cardId:that.trend.card_id,
                                 avatar:that.trend.avatar,
                                 initialTime:0,
                                 duration:300,
                                 cover:that.trend.cover,
                                 activityList:that.trend.activityList,
                                 productList:that.trend.productList,
                                 carousels:that.trend.img_urls||[]
                               });
                              }else{
                                that.trend._id = '-1'
                              }
                           }
                           result.data.forEach(item => {
                             if(that.trend._id != item._id ){
                               // console.log('pushPlayList trend',item._id,item.title,item.content);
                               playGroup.push({
                                 src:item.video_temp_url||'',
                                 title:item.title,
                                 content:item.content,
                                 flag:false,
                                 check:item.isLike||false,
                                 like:item.likes_num||0,
                                 comments_num:item.comments_num||0,
                                 at:item.name,
                                 id:item._id,
                                 cardId:item.card_id,
                                 avatar:item.avatar,
                                 initialTime:0,
                                 duration:300,
                                 cover:item.cover,
                                 activityList:item.activityList,
                                 productList:item.productList,
                                 carousels:item.img_urls||[]
                               });
                             }
                           });
                           console.log('playGroup',playGroup);
                           let len = that.playList.filter(item=>item.src).length;
                           for(let i = len;i<len+playGroup.length;i++){
                               that.$set(that.playList,i,playGroup[i-len])
                           }
                         }
                    });

                });
                return promise
            },
            async tapLove(){
                if(this.needAuthFlag){
                    this.wxAuth(this.authBizInfo);
                    setTimeout (() => {
                        this.tapLove();
                    } , 2000 );
                    return;
                }
                this.updateUserAuth(this.authBizInfo);
                this.playList[this.index].check = !this.playList[this.index].check;
                this.playList = [...this.playList];
                //更新统计信息
                if(this.playList[this.index].check ){
                    this.playList[this.index].like +=1;
                    let like={
                        corp_user_id:this.user._id
                    };
                    await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'addTrendLike',
                            id:this.playList[this.index].id,
                            like:like,
                        }
                    });
                }else{
                    this.playList[this.index].like -=1;
                    let like={
                        corp_user_id:this.user._id
                    };
                    await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'removeTrendLike',
                            id:this.playList[this.index].id,
                            like:like,
                        }
                    });
                }
                this.$forceUpdate()
            },
            playEnd(e){
                // this.index++;
                this.$forceUpdate();
            },
            tapAvatar(){
                if(this.needAuthFlag){
                    this.wxAuth(this.authBizInfo);
                    setTimeout (() => {
                        this.tapAvatar();
                    } , 2000 );
                    return;
                }
                this.updateUserAuth(this.authBizInfo);
                setTimeout (() => {
                    uni.reLaunch({
                        url:'/pages/site/trend'
                    })
                } , 1000 )
            },
            tapMsg(){
                if(this.needAuthFlag){
                    this.wxAuth(this.authBizInfo);
                    setTimeout (() => {
                        this.tapMsg();
                    } , 2000 );
                    return;
                }
                this.updateUserAuth(this.authBizInfo);
                this.commentListPage = 1;
                this.getCommentList();
                this.$nextTick(() => {
                    this.isUps=true;
                    this.$refs['showComments'].open();
                })
            },
            tapShare(){

            },

            tapBuy(){
                if(this.needAuthFlag){
                    this.wxAuth(this.authBizInfo);
                    setTimeout (() => {
                        this.tapBuy();
                    } , 2000 );
                    return;
                }
                this.updateUserAuth(this.authBizInfo);
                this.$nextTick(() => {
                    this.isUps=true;
                    this.$refs['showProductList'].open();
                })

            },

            tapJoin(){
                if(this.needAuthFlag){
                    this.wxAuth(this.authBizInfo);
                    setTimeout (() => {
                        this.tapJoin();
                    } , 2000 );
                    return;
                }
                this.updateUserAuth(this.authBizInfo);
                this.$nextTick(() => {
                    this.isUps=true;
                    this.$refs['showActivityList'].open();
                })
            },

            videoPlay(index){
                let promise = new Promise((resolve,reject)=>{
                    resolve()
                });
                promise.then(res=>{
                    if(this.playList[index]){
                        this.$set(this.playList[index],'flag',!this.playList[index].flag)
                    }
                })
            },
            pauseVideo(val){
                if(typeof this.playList[this.oldIndex].initialTime !='undefined') this.playList[this.oldIndex].initialTime = val
            },
            clickVideo(){
                this.playList[this.index].flag = !this.playList[this.index].flag
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
            //当前评论方法
            async getCommentList(type){
                let that = this;
                console.log('getCommentList',that.playList[that.index].id);
                let res =await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'getCommentList',
                        trendId:that.playList[that.index].id,
                        userId:that.user._id,
                        page:that.commentListPage,
                    }
                });
                let result=res.result;
                if (result.code == 0) {
                    if (that.commentListPage == 1) {
                        that.commentList=[]
                    }
                    if( result.data.length > 0){
                        result.data.forEach(d => {
                            that.commentList.push(d)
                        })
                    }else{
                        that.commentListPage--;
                    }
                }
                if (type == "refresh") {
                    uni.stopPullDownRefresh(); // 停止刷新
                }
                that.$forceUpdate();
            },

            async sendComment(e){
                let that = this;
                if(that.inputContent){
                    let secRes = await wx.cloud.callFunction({
                        name:'sys',
                        data:{
                            $url:'msgSecCheck',
                            value:that.inputContent
                        }
                    });
                    if(secRes.result.code!=0){
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
                        that.lastReply.trend_id = that.trend._id;
                        that.lastReply.user_id = that.user._id;
                        that.lastReply.name = that.user.userInfo.nickName;
                        that.lastReply.avatar = that.user.userInfo.avatarUrl;
                    }
                    that.lastReply.create_at = new Date();
                    that.lastReply.content = that.inputContent;
                    that.lastReply.replied_name = that.repliedName;
                    that.lastReply.is_sub_reply = that.isSubReply;
                    that.lastReply.uid =  that.genPopupReplyUid(10);
                    let res = await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'addCommentReply',
                            id:that.replyInfo.comment_id,
                            trendId:that.trend._id,
                            reply:that.lastReply,
                        }
                    });
                    // console.log(res)
                    let result=res.result;
                    if(result.code==0){
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

                        await wx.cloud.callFunction({
                            name:'cmn',
                            data:{
                                $url:'commentOpt',
                                type:'inc',
                                trendId:that.trend._id
                            }
                        });
                    }
                }else{
                    if(!that.lastComment.user_id){
                        that.lastComment.trend_id = that.trend._id;
                        that.lastComment.user_id = that.user._id;
                        that.lastComment.name = that.user.userInfo.nickName;
                        that.lastComment.avatar = that.user.userInfo.avatarUrl;
                    }
                    that.lastComment.create_at = new Date();
                    that.lastComment.content = that.inputContent;
                    that.lastComment.replys =[];//初始化
                    let res = await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'addComment',
                            comment:that.lastComment
                        }
                    });
                    that.lastComment._id=res._id;
                    let tempComment ={};
                    Object.assign(tempComment,that.lastComment);
                    that.commentList.push(tempComment);
                    that.inputContent='';
                    delete(that.lastComment._id);

                    await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'commentOpt',
                            type:'inc',
                            trendId:that.trend._id
                        }
                    });
                }
                that.playList[that.index].comments_num++;
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
            },

            async operateComment(type,comment,idx,pidx){
                let that = this;
                if(type=='addLike'){
                    this.commentList[idx].isLike=true;
                    if(!this.commentList[idx].likes_num){
                        this.commentList[idx].likes_num =0;
                    }
                    this.commentList[idx].likes_num +=1;

                    let like={
                        corp_user_id:this.user._id,
                        name:this.user.name,
                        avatar:this.user.avatar,
                        create_at:new Date()
                    };
                    await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'addTrendLike',
                            id:comment._id,
                            like:like,
                        }
                    });
                    that.$forceUpdate();
                }else if(type=='removeComment'){
                    this.currentComment = comment;
                    this.$nextTick(() => {
                        this.$refs['showRemove'].open()
                    });
                    that.$forceUpdate();
                }else if(type=='removeLike'){
                    this.commentList[idx].isLike=false;
                    this.commentList[idx].likes_num -=1;

                    let like={
                        corp_user_id:this.user._id,
                    };
                    await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'removeTrendLike',
                            id:comment._id,
                            like:like,
                        }
                    });
                    that.$forceUpdate();

                }else if(type=='addReply'){
                    this.isFocus =true;
                    this.replyInfo.isReply =true;
                    this.replyInfo.pidx=idx;
                    this.replyInfo.comment_id=this.commentList[idx]._id;
                    this.tips='回复 '+comment.name;
                    this.repliedName = comment.name;
                    this.isSubReply =false;
                    this.inputContent='';
                    this.$forceUpdate()
                }else if(type=='removeReply'){

                }
            },
            async operateReply(type,reply,idx,pidx){
                let that = this;
                if(type=='addLike'){
                    this.commentList[pidx].replys[idx].isLike=true;
                    if(!this.commentList[pidx].replys[idx].likes_num){
                        this.commentList[pidx].replys[idx].likes_num =0;
                    }
                    this.commentList[pidx].replys[idx].likes_num +=1;

                    let like={
                        corp_user_id:this.user._id,
                        name:this.user.name,
                        avatar:this.user.avatar,
                        create_at:new Date()
                    };
                    await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'addCommentReplyLike',
                            id:that.commentList[pidx]._id,
                            replyUid:reply.uid,
                            like:like,
                        }
                    });
                }else if(type=='removeLike'){
                    this.commentList[pidx].replys[idx].isLike=false;
                    this.commentList[pidx].replys[idx].likes_num -=1;

                    let like={
                        user_id:this.user._id,
                    };
                    await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'removeCommentReplyLike',
                            id:that.commentList[pidx]._id,
                            replyUid:reply.uid,
                            like:like
                        }
                    });
                }else if(type=='addReply'){
                    this.isFocus =true;
                    this.replyInfo.isReply=true;
                    this.replyInfo.pidx=pidx;
                    this.replyInfo.comment_id=this.commentList[pidx]._id;
                    this.tips='回复 '+reply.name;
                    this.repliedName = reply.name;
                    this.isSubReply = true;
                    this.inputContent='';
                }else if(type=='removeReply'){

                }
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
            genPopupReplyUid(len){
                return Math.random().toString(20).substr(3,len);
            },

            loadMoreComments(){
                this.commentListPage +=1;
                this.getCommentList()
            },
            async removeComment(comment){
                await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'removeComment',
                        id:this.currentTrend._id,
                        content:comment,
                    }
                });
                this.playList[this.index].comment--;
                this.getCommentList("refresh");
                this.$refs['showRemove'].close();
                this.$forceUpdate();
            },
			videoPlayPause(){
				this.videoPlay(this.index)
			},


            goProductDetail(product){
                uni.navigateTo({
                    "url":"/pagesCmn/product/ShareProductDetail?id="+product._id
                });
            },

            //跳至活动页
            goActivityDetail(activity){
                //活动页
                uni.navigateTo({
                    "url":"/pagesCmn/activity/ShareActivityDetail?id="+activity._id
                });
            },

            goQrcode(){
                uni.navigateTo({
                    url:"/pagesCmn/trend/TrendQrcode?id="+ this.playList[this.index].id
                })
            },
        },
        watch:{
            index(newVal,oldVal){
                let len = this.playList.filter(item=>item.src).length;
                //加载视频
                if(len - this.index - 1 <= this.playCount){
                    this.page++;
                    // console.log('watch index',this.page,this.index);
                    this.pushPlayList()
                }
                this.oldIndex = oldVal
            }
        }
    }
</script>

<style scoped>
    page{
        background-color:#000000;
    }
    .swiper{
        flex: 1;
        background-color: #000;
        height: 92vh;
    }
    .swiper-item {
        flex: 1;
    }
    .video {
        flex: 1;
    }
    .video-box{
        flex: 1;
        width: 750rpx;
    }

    .cover-view-left{
        position: absolute;
        margin-left: 10upx;
        width: 500upx;
        bottom: 120upx;
        z-index: 1;
        font-size: 16px;
        /*color: #FFFFFF;*/
        /* #ifndef APP-PLUS */
        white-space: pre-wrap;
        text-overflow:ellipsis;
        overflow:hidden;
        /* #endif */
    }

    .left-view{
        margin-bottom: 20upx;
    }
    .left-text{
        font-size: 16px;
        color: #FFFFFF;
    }
    .avatar{
        border-radius: 50upx;
        border-color: #fff;
        border-style: solid;
        border-width: 2px;
    }

    .cover-view-right{
        position: absolute;
        bottom: 160upx;
        right: 20upx;
        /* #ifndef APP-PLUS-NVUE */
        display: flex;
        flex-direction: column;
        /* #endif */
        z-index: 1;
    }

    .right-text{
        text-align: center;
        font-size: 14px;
        color: #FFFFFF;
        margin-bottom: 15upx;
        height: 20px;
    }
    .img{
        height: 64rpx;
        width: 64rpx;
        opacity: 0.9;
    }
    .page{
        /* #ifndef APP-PLUS-NVUE */
        display: flex;
        flex-direction: column;
        /* #endif */
        flex: 1;
    }
    /* 底部分享 */
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
        color: #ed1c24;
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
        z-index: 90;
    }

    .ups-height-padding{
        height: 850rpx;
        padding-bottom:62px;
        position: fixed;
        left:0;
        bottom: 0;
        z-index: 99;
    }

    .ups-height{
        height: 850rpx;
        position: fixed;
        left:0;
        bottom: 0;
        z-index: 99;
    }
</style>