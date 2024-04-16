<template>
	<view>
		<cu-custom :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{target.targetName}}</block>
		</cu-custom>
		<view class="cu-chat" v-for="item in historyTalk" :key="item._id">
			<view class="cu-item" :class="item.source == sourceCardId?'self':''">
				<image v-if="item.source != sourceCardId" class="cu-avatar round" :src="target.targetAvatar"></image>
				<view class="main">
					<view class="content shadow" :class="item.source == sourceCardId?'bg-grey.light':''">
						<text>{{item.content}}</text>
					</view>
				</view>
				<image v-if="item.source == sourceCardId" class="cu-avatar round" :src="source.sourceAvatar"></image>
				<view class="date">{{getDateDiff(item.create_at)}}</view>
			</view>
		</view>
		<view class="cu-chat" v-for="item in talk" :key="item._id">
			<view class="cu-item" :class="item.source == sourceCardId?'self':''">
				<image v-if="item.source != sourceCardId" class="cu-avatar round" :src="target.targetAvatar"></image>
				<view class="main">
					<view class="content shadow" :class="item.source == sourceCardId?'bg-grey.light':''">
						<text>{{item.content}}</text>
					</view>
				</view>
				<image v-if="item.source == sourceCardId" class="cu-avatar round" :src="source.sourceAvatar"></image>
				<view class="date">{{getDateDiff(item.create_at)}}</view>
			</view>
		</view>
		<view class="cu-tabbar-height"></view>
		<view class="cu-bar foot input">
			<view >
				<image  class="cu-avatar round"   mode="aspectFill" :src="source.sourceAvatar"></image>
			</view>
			<input class="solid-bottom" :value="content" maxlength="300" cursor-spacing="10" @input="inputContent"></input>
			<button class="cu-btn line-grey shadow-blur" @tap="send">发送</button>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
    import cloudbase from '@cloudbase/js-sdk';

	export default {
		data() {
			return {
				sourceCardId:'',
				targetCardId:'',
				talkWatch:null,
				roomId:'',
				chatRoom:{},
				content:"",
				source:{},
				target:{},
				talk:[],
				historyTalk:[],
				hasHistory:true,
				lastHistory:{_id:0,content:'',send_time:''},
				page:1,
                timer:null,
			}
		},
		onLoad(options){
			let that = this;
			// 默认为个人名片
			that.sourceCardId = that.user.userInfo.cardId;
			if(options.sourceCardId){
				that.sourceCardId = options.sourceCardId;
			}
			// 默认为公司名片
			that.targetCardId = that.user.userInfo.bizCardId;
			if(options.targetCardId){
				that.targetCardId = options.targetCardId;
			}
		},

        mounted() {
            this.timer = setInterval(this.loadNewMsgList, 6000);
        },
        beforeDestroy() {
            // console.log('beforeDestroy',this.timer);
            clearInterval(this.timer);
        },

		onShow(){
			this.watchChatRoom();
		},
		onHide(){
			this.talkWatch && this.talkWatch.close().then(()=>{
                this.talkWatch = null;
			})
		},
		onPageScroll(e){
			if(e.scrollTop<5){
				if(this.hasHistory){
					this.page++
					this.loadHistory();
				}
			}
		},
		computed:{
			...mapState(['user']),
		},
		methods: {
			async watchChatRoom(){
				let that = this;
				let askCard ={};
                let answerCard ={};
                let res =null;
				res = await cloudbase.callFunction({
                    name: 'web',
                    data: {
                        $url: 'getCardDetailById',
                        id: that.sourceCardId,
                    }
                });
				askCard = JSON.parse(res.result.data);
				// console.log('askCard',res.result.data);
                res = await cloudbase.callFunction({
                    name: 'web',
                    data: {
                        $url: 'getCardDetailById',
                        id: that.targetCardId,
                    }
                });
                // console.log('answerCard',res);
                answerCard = JSON.parse(res.result.data);
                // 获取聊天室对象
                res = await cloudbase.callFunction({
                    name: 'web',
                    data: {
                        $url: 'getChatRoom',
                        sourceId: that.sourceCardId,
                        targetId: that.targetCardId
                    }
                });
                // console.log('getChatRoom',res);
				// 没有聊天室
				if(res.result.code == -1){
					that.chatRoom = {
					    target_id:answerCard._id,
					    target_name:answerCard.name,
					    target_avatar:answerCard.avatar,
					    source_id:askCard._id,
					    source_name:askCard.name,
					    source_avatar:askCard.avatar,
					    content:[],
					    target_unread:0,
					    source_unread:0,
					    last_history:'',
					};
                    let res2 = null;
                    res2 = await cloudbase.callFunction({
                        name: 'sys',
                        data: {
                            $url: 'addChatRoom',
                            chatRoom:that.chatRoom
                        }
                    });
                    // console.log('addChatRoom roomId',res2.result.data);
					that.roomId = res2.result.data;
					that.chatRoom._id = that.roomId;
				}
				//已有聊天室
				else if(res.result.code == 0){
                    that.chatRoom = JSON.parse(res.result.data);
					that.roomId = that.chatRoom._id;
				}
                res = await cloudbase.callFunction({
                    name: 'sys',
                    data: {
                        $url:'exchangeCards',
                        "roomId":that.roomId,
                        "askCardId": that.sourceCardId,
                        "answerCardId": that.targetCardId
                    }
                });
                // console.log('exchangeCards',res);
                // console.log('交换名片', res);
				// 检测会话发起方源头
				let isSource = that.chatRoom.source_id == that.sourceCardId;
				that.source.sourceId=isSource?that.chatRoom.source_id:that.chatRoom.target_id;
				that.source.sourceName=isSource?that.chatRoom.source_name:that.chatRoom.target_name;
				that.source.sourceAvatar=isSource?that.chatRoom.source_avatar:that.chatRoom.target_avatar;
				that.target.targetId=isSource?that.chatRoom.target_id:that.chatRoom.source_id;
				that.target.targetName=isSource?that.chatRoom.target_name:that.chatRoom.source_name;
				that.target.targetAvatar=isSource?that.chatRoom.target_avatar:that.chatRoom.source_avatar;
				// console.log('加载聊天室：','roomId',that.roomId,'sourceName',that.source.sourceName,'targetName',that.target.targetName,'isSource',isSource);
                await cloudbase.callFunction({
                    name:'sys',
                    data:{
                        $url:'clearUnreadChatTip',
                        id: that.roomId,
                        isSource:isSource
                    }
                });
                // console.log('clearUnreadChatTip');
                //同步历史
                that.loadHistory();
                that.historyTalk = that.historyTalk.reverse();
                // 设置一个超大值，以保证滚动条滚动到底部
                uni.pageScrollTo({ scrollTop: 9999999,	 duration: 0});
			},

			async loadHistory(){
				let that = this;
                let res = await cloudbase.callFunction({
                    name:'web',
                    data:{
                        $url:'getChatMsgHistoryList',
                        id: that.roomId,
                        page:that.page
                    }
                })
				if(res.result.code == 0){
                    let history = null;
                    history = JSON.parse(res.result.data);
                    // console.log('loadHistory',res.result.data);
					for(let i = 0;i<history.length;i++){
						that.historyTalk.unshift(history[i])
					}
				}else{
					that.hasHistory = false;
				}
			},

			async loadNewMsgList(){
			    let that = this;
                that.lastHistory = that.historyTalk[that.historyTalk.length-1]||{_id:0,content:'',send_time:''};
                // console.log('lastHistory',that.lastHistory.content,that.lastHistory.create_at+'');
                let res = await cloudbase.callFunction({
                    name:'web',
                    data:{
                        $url:'getNewChatMsgList',
                        id: that.roomId,
						create_at:that.lastHistory.create_at
                    }
                });
                if(res.result.code == 0){
                    let newMsgList = JSON.parse(res.result.data);
                    Object.assign(that.talk,newMsgList);
                    // 设置一个超大值，以保证滚动条滚动到底部
                    uni.pageScrollTo({ scrollTop: 9999999,	 duration: 0});
                    // console.log('loadNewMsgList length',that.talk.length,newMsgList.length);
                    that.$forceUpdate();
                }
			},

			inputContent(e) {
				this.content = e.detail.value;
			},

			async send(){
				let that = this;
				if(that.content != ""){
					let talk = {};
					talk = {
						content:this.content,
						source:that.source.sourceId,
						target:that.target.targetId,
						type:'text',
						room_id:that.roomId,
					}
					// 发消息
					let res =null;
					res = await cloudbase.callFunction({
                        name:'sys',
                        data:{
                            $url:'addTalk',
                            talk: talk,
                        }
                    })
                    // console.log('addTalk',res.result.code);
					if(res.result.code == 0){
						let lastHistory = '';
						let isSource = false;
						lastHistory = this.content;
						if(that.chatRoom.source_id == that.sourceCardId){
							isSource = true;
						}else{
							isSource = false;
						}
						// 更新主表未读信息
                        let res2 = null;
                        res2 = await cloudbase.callFunction({
                            name:'sys',
                            data:{
                                $url:'updateChatRoomUnreadTip',
                                id: that.roomId,
                                tid: res.result.data,
                                last_history:lastHistory,
                                isSource:isSource
                            }
                        })
                        // console.log('updateChatRoomUnreadTip',res2.result.code);
					}
					that.content = ""
					uni.pageScrollTo({
						scrollTop: 999999,	// 设置一个超大值，以保证滚动条滚动到底部
						duration: 0
					});
					this.$forceUpdate()		
				}
			},
			
			getDateDiff(createAt){
				var date = "";
				// let valueTime= Date.parse(createAt)
				var newData =  Date.parse(new Date());
				var diffTime = Math.abs(newData-createAt);
				if (diffTime > 7 * 24 * 3600 * 1000) {
					  var date = new Date(createAt);
					  var y = date.getFullYear();
					  var m = date.getMonth() + 1;
					  var d = date.getDate();
					  let cy=new Date().getFullYear();
					  cy==y?(date = m + '月' + d +'日'):(date = y+'年'+ m + '月' + d +'日');
				} else if (diffTime < 7 * 24 * 3600 * 1000 && diffTime > 24 * 3600 * 1000) {
				  // //注释("一周之内");
					
				  // var time = newData - diffTime;
				  var dayNum = Math.floor(diffTime / (24 * 60 * 60 * 1000));
				  date = dayNum + "天前";
				} else if (diffTime < 24 * 3600 * 1000 && diffTime > 3600 * 1000) {
				  // //注释("一天之内");
				  // var time = newData - diffTime;
				  var dayNum = Math.floor(diffTime / (60 * 60 * 1000));
				  date = dayNum + "小时前";
					
				} else if (diffTime < 3600 * 1000 && diffTime >= 0) {
				  date = ''
				}
				return date;
			},
		}
	}
</script>

<style>
	.box {
		margin: 20upx 0;
	}

	.box view.cu-bar {
		margin-top: 20upx;
	}
</style>
