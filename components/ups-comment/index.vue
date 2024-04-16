<template>
	<view>
		<view class="comment" @longpress="removeComment">
			<view class="header flex">
				<view v-if="comment.avatar" class="cu-avatar round" :style="{'background-image':'url('+comment.avatar+')'}" @tap="goCard"></view>
				<view v-else class="cu-avatar round cuIcon-my"></view>
				<!--一级评论样式-->
				<view v-if="!isReply" class="column-flex" @click="addReply">
					<view class="nick-name flex">
						<view class="text-black ">{{comment.name}}</view>
						<view class="text-gray font-sm justify-between">{{comment.create_at | formatCreateAt}}</view>
					</view>
					<view class="content-view">
						<view class="text-black text-bold text-content text-sm">
							{{ comment.content }}
						</view>
					</view>
				</view>
				<!--子评论样式-->
				<view v-else class="column-flex" @click="addReply">
					<view class="sub-nick-name flex">
						<view class="text-black ">{{comment.name}}</view>
						<view class="text-gray font-sm justify-between">{{comment.create_at | formatCreateAt}}</view>
					</view>
					<view v-if="comment.is_sub_reply" class="sub-content-view flex">
							<view class="text-black text-bold text-content text-sm">
								回复\t<span>{{comment.replied_name}}</span>{{' : ' + comment.content}}
							</view>
					</view>
					<view v-else class="sub-content-view text-black text-bold text-content text-sm">
						{{ comment.content }}
					</view>
				</view>
				<!--一级评论时可点赞/子评论不点赞-->
				<view v-if="!isReply" class="flex  justify-end">
					<text v-if="comment.likes_num>0" class="text-gray text-sm" >{{comment.likes_num}}</text>
					<text v-else class="like-space"></text>

					<button v-if="comment.isLike" class="cu-btn bg-white " @click="removeLike">
						<text class="cuIcon-likefill text-red "></text>
					</button>
					<button v-else class="cu-btn bg-white" @click="addLike">
						<text class="cuIcon-like "></text>
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import cmnUtils from '@/utils/cmnUtils.js'
	export default {
		name:"UpsComment",
		props:{
			comment:{
				type:Object,
				required:true
			},
			idx:{
				type:Number,
				required:true,				
			},
			pidx:{
				type:Number,
				required:false,
				default:-1
			},
			isReply:{
			    type:Boolean,
				required:false,
			    default:false
			},
		},
		data() {
			return {
			};
		},
		filters:{
			formatCreateAt:function(createAt){
				return cmnUtils.formatCreateTime(createAt);
			}
		},
		computed:{
		},
		methods:{
			addReply:function(e){
				this.$emit('operate','addReply',this.comment,this.idx,this.pidx)
			},
			removeComment:function(e){
                this.$emit('operate','removeComment',this.comment,this.idx,this.pidx)
			},
			removeReply:function(e){
				this.$emit('operate','removeReply',this.comment,this.idx,this.pidx)
				
			},
			addLike:function(e){
				this.$emit('operate','addLike',this.comment,this.idx,this.pidx)
			},
			removeLike:function(e){
				this.$emit('operate','removeLike',this.comment,this.idx,this.pidx)
			},
            goCard(){
                uni.navigateTo({
                    url:'/pagesSys/card/ShareCardDetail?userId='+this.comment.user_id
                })
            },
		}
	}
</script>

<style>
	.comment{
		padding: 7rpx;
	}
	.nick-name{
		margin: 10rpx 0 0 20rpx;
		width: 560rpx;
		line-height: 15rpx;
	}
	.sub-nick-name{
		margin: 10rpx 0 0 20rpx;
		width: 520rpx;
		line-height: 15rpx;
	}
	.font-sm{
		font-size: 22rpx;
		line-height: 15rpx;
		margin-left: 10rpx;

	}
	.content-view{
		width: 600rpx;
		margin:24rpx 0 0 6rpx;
	}
	.sub-content-view{
		width: 500rpx;
		margin:24rpx 0 0 6rpx;
	}
	span{
		color: cornflowerblue;
		font-weight: normal;
	}
	.cu-btn{
		padding: 0 5rpx;
		height: 28rpx;
	}

	.cu-item {
		height: fit-content;
	}
	.cu-btn:not([class*="bg-"]) {
		/*background-color: rgba(255,255,255,0);*/
	}
	.cu-list.menu-avatar>.cu-item:after,.cu-list.menu>.cu-item:after{
		border-bottom: none;
	}
	.cu-list.menu-avatar>.cu-item{
		min-height: 120rpx;
		height: 0;
	}
	.cu-list.menu-avatar{
	}
	.text-content {
		margin-left: 15rpx;
	}
	.column-flex{
		flex-direction: column;
	}
	.like-space{
		width: 15rpx;
	}

</style>
