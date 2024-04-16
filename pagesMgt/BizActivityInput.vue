<template>
	<view>
		<cu-custom    :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">创建活动</block>
		</cu-custom>
		<view class="page bg-white">
			<form>
				<view class="cu-list grid col-5">
					<view class="cu-item" :class="field.isShow?'solid':'bg-gray'" v-for="(field,index) in fields" :key="index"  @tap="switchShow(field,index)">
						<text class="text-gray " :class="' cuIcon-' + field.name"></text>
						<text >{{field.title}}</text>
					</view>
				</view>

				<view class="bg-white radius">
				<view class="cu-form-group margin-top-xxs  radius">
					<view class="title radius">主题<text class="cuIcon-titles text-xs text-orange"></text></view>
					<input class="line-grey radius" v-model="activity.title" placeholder="请输入主题"></input>
				</view>
				
				<slot v-if="fields[0].isShow">
					<view class="flex  padding justify-start  align-center  radius ">
						<view class="title margin-right-xs">报名截止<text class="cuIcon-titles text-xs text-orange"></text></view>
						<view class="margin-right-xs">
							<picker mode="date" v-model="activity.sign_up.date" start="2020-01-01" end="2030-01-01" @change="signUpDateChange">
								<view class="picker line-grey">
									{{activity.sign_up.date||''}}
								</view>
							</picker>
						</view>
						<view class="margin-right">
							<picker mode="time" v-model="activity.sign_up.time" start="08:00" end="22:00" @change="signUpTimeChange">
								<view class="picker line-grey">
									{{activity.sign_up.time||''}}
								</view>
							</picker>
						</view>
					</view>
				</slot>
				 <slot v-if="fields[1].isShow">
					<view class="flex  padding justify-start  align-center  radius ">
						<view class="title margin-right-xs">开始时间<text class="cuIcon-titles text-xs text-orange"></text></view>
						<view class="margin-right-xs">
							<picker mode="date" v-model="activity.sign_in.date" start="2020-01-01" end="2030-01-01" @change="signInDateChange">
								<view class="picker line-grey">
									{{activity.sign_in.date||''}}
								</view>
							</picker>
						</view>
						<view>
							<picker mode="time" v-model="activity.sign_in.time" start="08:00" end="22:00" @change="signInTimeChange">
								<view class="picker line-grey">
									{{activity.sign_in.time||''}}
								</view>
							</picker>
						</view>
					</view>
				</slot>
				<slot v-if="fields[2].isShow" >
					<view class="flex  padding justify-start  align-center  radius">
						<view class="title margin-right-xs">联系人<text class="cuIcon-titles text-xs text-orange"></text></view>
						<input placeholder="请输入联系人" class="line-grey" v-model="activity.sponsor.contactor"></input>
					</view>
					<view class="flex  padding justify-start  align-center  radius">
						<view class="title margin-right-xs">联系电话<text class="cuIcon-titles text-xs text-orange"></text></view>
						<input placeholder="请输入联系方式"  class="line-grey" v-model="activity.sponsor.phone"></input>
					</view>
				</slot>
				<slot v-if="fields[3].isShow">
					<view class="flex padding justify-start  align-center  radius">
						<view class="title margin-right-xs">地址<text class="cuIcon-titles text-xs text-orange"></text></view>
						<input placeholder="请输入地址" class="line-grey width80" v-model="activity.address.street"></input>
						<text class='cuIcon-locationfill text-orange align-end'></text>
					</view>
				</slot>
					<view class="flex padding align-start radius">
						<view class="title margin-right-xs">详情<text class="cuIcon-titles text-xs text-orange"></text></view>
						<textarea maxlength="1000" class="width88 line-grey" style="height: 300rpx;" v-model="activity.content" placeholder="请输入详情"></textarea>
					</view>
					<view class="flex  padding justify-start  align-center  radius ">
						<slot v-if="fields[4].isShow">
								<view class=" margin-right-xs">人数限制</view>
								<input placeholder="请输入" type="number" class="line-grey width10 margin-right-xl text-center" v-model="activity.people_num"></input>
						</slot>
						<slot v-if="fields[5].isShow">
							<view class="margin-right-xs">报名者是否需要填写手机号？</view>
								<switch @change="onPhoneRequireChange(activity)" v-model="activity.phone_require"  :checked="activity.phone_require"></switch>
						</slot>
					</view>
					<slot v-if="fields[6].isShow">
						<view class="flex padding align-start solid-top radius">
							<view class="title width80">活动封面<text class="cuIcon-titles text-xs text-orange"></text></view>
							<view class="align-end">
								<ups-upload fileType="image" :uploadFile = "activity.cover" @upload = "uploadCover" @remove = "removeCover"></ups-upload>
							</view>
						</view>
					</slot>
					<slot v-if="fields[7].isShow">
						<view class="flex padding align-start solid-top radius">
							<view class="title width88">
								活动图片
							</view>
						</view>
						<view class="align-start padding">
							<ups-uploads
								fileType="image"
								:fileList = "activity.carousels"
								maxNum = 9
								@upload = "uploadCarousels"
								@remove = "removeCarousels"
								 >
							</ups-uploads>
						</view>
					</slot>
					<slot v-if="fields[8].isShow">
						<view class="flex padding align-start solid-top radius ">
							<view class="title ">
								活动视频
							</view>
						</view>
						<view class="padding">
							<ups-uploads
								fileType="video"
								:fileList = "activity.video"
								maxNum = 1
								@upload = "uploadVideo"
								@remove = "removeVideo"
								>
							</ups-uploads>
						</view>
					</slot>
				</view>
			</form>
			<!--页面底部抬升-->
			<view class="cu-tabbar-height"></view>
		</view>
		<!-- 底部操作菜单 -->
		<view class="cu-bar btn-group   foot bg-white">
			<button class="cu-btn   line-grey round"    @click="navback">取消</button>
			<button class="cu-btn   line-grey round"   @click="submit">保存</button>
		</view>
	</view>
</template>

<script>
 	import upsUploads from '@/components/ups-uploads/index.vue'
 	import upsUpload from '@/components/ups-upload/index.vue'
	import { mapState, mapMutations } from 'vuex'
	import cmnUtils from '@/utils/cmnUtils.js'
		
	export default {
		components:{
			"ups-uploads":upsUploads,
			"ups-upload":upsUpload,
		},
		data() {
			return {
                activityId:'',
				activity:{
					address:{},
					carousels:[],
					video:[],
					phone_require:false,
					people_num:0,
					cover:'',
					sponsor:{},
                    sign_up:{date:'',time:''},
                    sign_in:{date:'',time:''},
				},
                fields: [{
                    id:0,
                    title: '开始时间',
                    name: 'time',
                    isShow: true
                },{
                    id:1,
                    title: '截止时间',
                    name: 'countdown',
                    isShow: true
                }, {
                    id:2,
                    title: '联系人',
                    name: 'service',
                    isShow: true
                }, {
                    id:3,
                    title: '地址',
                    name: 'location',
                    isShow: true
                }, {
                    id:4,
                    title: '人数限制',
                    name: 'group',
                    isShow: false
                },{
                    id:5,
                    title: '填写手机',
                    name: 'mobile',
                    isShow: false
                },{
                    id:6,
                    title: '活动封面',
                    name: 'pic',
                    isShow: true
                },{
                    id:7,
                    title: '活动图片',
                    name: 'album',
                    isShow: false
                },{
                    id:8,
                    title: '活动视频',
                    name: 'record',
                    isShow: false
                }],
			}
		},
		onLoad(option) {
			let that = this;
            if(option.id){
                that.activityId = option.id;
            }

			that.activity.sign_up.date = cmnUtils.dateFormat(new Date(),'yyyy-MM-dd');
			that.activity.sign_up.time = cmnUtils.dateFormat(new Date(),'HH:mm');
            that.activity.sign_in.date = cmnUtils.dateFormat(new Date(),'yyyy-MM-dd');
            that.activity.sign_in.time = cmnUtils.dateFormat(new Date(),'HH:mm');
			if(option.id){
                wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'getActivityDetail',
                        id:that.activityId,
                    }
                }).then((res)=>{
                that.activity = res.result.data;
				if(that.activity.sign_up){
					that.fields[0].isShow = true;
				}
				if(that.activity.sign_in){
					that.fields[1].isShow = true;
				}
				if(that.activity.sponsor){
					that.fields[2].isShow = true;
				}
				if(that.activity.address){
					that.fields[3].isShow = true;
				}
                if(that.activity.people_num){
					that.fields[4].isShow = true;
                }
                if(that.activity.phone_require){
                    that.fields[5].isShow = true;
                }
                if(that.activity.cover){
                    that.fields[6].isShow = true;
                }
                if(that.activity.carousels.length>0){
					that.fields[7].isShow = true;
                }
                if(that.activity.video){
					that.fields[8].isShow = true;
                }
                that.activity.hasEnroll = false;
                if (that.activity.enroll_ids && that.user._id){
                    if (that.activity.enroll_ids.indexOf(that.user._id)>-1){
                        that.activity.hasEnroll = true;
                    }
                }
                that.activity.hasSignIn = false;
                if (that.activity.sign_in_ids && that.user._id) {
                    if (that.activity.sign_in_ids.indexOf(that.user._id)>-1) {
                        that.activity.hasSignIn = true;
                    }
                }
                });
			}
		},
		computed:{
			...mapState(['user']),
		},
		methods: {
            async submit(){
				let that = this;
                let checkInputInfo ='';
				if(!that.activity.title){
                    checkInputInfo +=' 主题';
				}
				if(!that.activity.sponsor.contactor || !that.activity.sponsor.phone){
                    checkInputInfo +=' 联系人';
				}
				if(!that.activity.address.street){
                    checkInputInfo +=' 地址';
				}
                if(!that.activity.content){
                    checkInputInfo +=' 详情';
                }
				if(!that.activity.cover){
                    checkInputInfo +=' 活动封面';
				}
				if(checkInputInfo.length>0){
                    uni.showToast({
                        icon:'none',
                        title:'请输入必填信息：'+checkInputInfo,
                    });
                    that.isLoad = false;
                    return;
				}
                let res = await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'getCardDetailById',
                        id:that.user.userInfo.bizCardId,
                    }
                });
                let card = res.result.data;
                that.activity.name = card.name;
                that.activity.avatar = card.avatar;
				//编辑
				if(that.activityId.length>0){
                    await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'updateActivity',
                            activity:that.activity,
                        }
                    });
				}
				//新增
				else{
                    that.activity.card_id = that.user.userInfo.bizCardId;
                    res = await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'addActivity',
                            activity:that.activity,
                        }
                    });
					//补充_id
                    that.activity._id=res.result._id;
                    // 注意二维码需要发布上线后才能调用生成
                    await wx.cloud.callFunction({
                        name:'cmn',
                        data:{
                            $url:'genActivityQrcode',
                            id:that.activity._id,
                            page:'pagesCmn/activity/ShareActivityDetail',
                            width:430,
                        }
                    });
				}
                uni.showToast({
                    icon:'success',
                    title:'提交成功'
                });
                setTimeout (() => {
                    uni.navigateTo({
                        url:'/pagesMgt/BizActivityList'
                    });
                } , 500 );
			},
			navback(e){
				uni.navigateBack();
			},
            switchShow(field,index){
			    let that = this;
				that.fields[index].isShow = !field.isShow;
			},
			uploadCover(cover){
				this.activity.cover = cover
			},
			removeCover(){
				this.activity.cover = "";
			},
			uploadCarousels(fileId){
				this.activity.carousels.push(fileId)
			},
			removeCarousels(idx){
				this.activity.carousels.splice(idx, 1)
			},
			uploadVideo(fileId){
				this.activity.video.push(fileId)
			},
			removeVideo(idx){
				this.activity.video.splice(idx, 1)
			},
			signUpDateChange(e){
				this.activity.sign_up.date = e.detail.value
			},
			signUpTimeChange(e){
                this.activity.sign_up.time = e.detail.value;
			},
			signInDateChange(e){
                this.activity.sign_in.date = e.detail.value
			},
			signInTimeChange(e){
                this.activity.sign_in.time = e.detail.value;
			},
            onPhoneRequireChange(item){
                item.phone_require = !item.phone_require;
			}
		}
		
	}
</script>

<style>
	.page{
		z-index: 0;
		height: 100vh;
	}
</style>
