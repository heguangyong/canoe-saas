<template>
	<view>
        <cu-custom    :isBack="true">
			<block slot="backText">返回</block>
            <block slot="content">系统配置</block>
        </cu-custom>
		<scroll-view> 
			<form>
				<view class="padding">
					<view class="cu-form-group">
						<view class="title">服务编号<text class='cuIcon-titles text-xs text-orange'></text></view>

						<input placeholder="请输入服务编号" v-model="account.account_key"></input>
					</view>				
					<view class="cu-form-group">
						<view class="title">服务名称<text class='cuIcon-titles text-xs text-orange'></text></view>

						<input placeholder="请输入服务名称" v-model="account.title"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">服务图标<text class='cuIcon-titles text-xs text-orange'></text></view>
						<input placeholder="请输入服务图标" v-model="account.name"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">服务链接</view>
						<input placeholder="请输入服务链接" v-model="account.url"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">是否可见</view>
						<input placeholder="请输入是否可见" v-model="account.is_show"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">是否禁用</view>
						<input placeholder="请输入是否禁用" v-model="account.is_forbidden"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">访问角色</view>
						<input placeholder="请输入访问角色" v-model="account.need_role"></input>
					</view>

					<view class="cu-form-group">
						<view class="title">帐户名称</view>
						<input placeholder="请输入帐户名称" v-model="account.user_name"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">帐户密码</view>
						<input  placeholder="请输入帐户密码" v-model="account.password"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">是否支持H5</view>
						<input placeholder="请输入是否支持H5" v-model="account.support_h5"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">H5服务链接</view>
					</view>
					<textarea class="text-box font40 bg-white width100 padding-sm solid" style="height: 100rpx;" scroll-y="true" maxlength="1200" placeholder="请输入H5链接" v-model="account.h5_link" >
					</textarea>
					<view class="cu-form-group">
						<view class="title">接口列表</view>
					</view>
					<textarea class="text-box font40 bg-white text-grey width100 padding-sm solid" style="height: 500rpx;" scroll-y="true" maxlength="1200" placeholder="备注对应接口列表中的参数信息，内容由技术人员后台维护，此处显示作为参考">
					</textarea>
					<view class="cu-tabbar-height bg-white"></view>
					<view class="cu-form-group">
						<view class="title">备注</view>
					</view>
					<textarea class="text-box font40 bg-white text-grey width100 padding-sm solid" style="height: 500rpx;" scroll-y="true" maxlength="1200" placeholder="请输入备注" v-model="account.remark" >
					</textarea>
					<view class="cu-tabbar-height bg-white"></view>
				</view>
			</form>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
		<!-- 底部操作菜单 -->
		<view class="cu-bar btn-group foot bg-white" style="z-index: 99;">
			<button class="cu-btn  round line-grey"    @click="cancelSubmit">取消</button>
			<button class="cu-btn  round line-grey"   @click="submit">提交</button>
		</view>
	</view>
</template>

<script>
	import { mapState ,mapMutations} from 'vuex'

	export default {

		data() {
			return {
                bizCard:{},
                account:{
                    account_key:'',
                    title:'',
                    name:'',
                    url:'',
                    is_show:true,
                    is_forbidden:true,
                    need_role:'',
                    user_name:'',
                    password:'',
                    support_h5:false,
					h5_link:'',
                    remark:''
                }
			}
		},

		onShow(){
			this.getBizCardDetail();
		},
		computed:{
			...mapState(['user']),
		},
		methods: {
            async getBizCardDetail(){
                let that = this;
				let res = await wx.cloud.callFunction({
					name:'sys',
					data:{
						$url:'getCardDetailById',
						id:that.user.userInfo.bizCardId,
					}
				});
				console.log(res);
				that.bizCard = res.result.data;
            },

            cancelSubmit(){
                uni.navigateBack();
			},

			async submit(){
			    let that = this;
                if(that.account.account_key.trim().length==0){
                    uni.showToast({
                        icon:'none',
                        title:'请填写服务编号'
                    });
                    return;
                }
                if(that.account.title.trim().length==0){
                    uni.showToast({
                        icon:'none',
                        title:'请填写服务名称'
                    });
                    return;
                }
                let checkValue = that.account.account_key+that.account.title+that.account.name+that.account.user_name+that.account.password+ that.account.h5_link+that.account.remark;
                let secRes = await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'msgSecCheck',
                        value:checkValue
                    }
                });

                // console.log(secRes)
                if(secRes.result.code!=0){
                    uni.showToast({
                        icon:'none',
                        title:'内容含有违规内容，请修改后提交'
                    });
                    return;
                }

                if(!that.bizCard.accounts){
                    that.bizCard.accounts=[];
				}
                that.bizCard.accounts.push(that.account);
				//编辑提交
				if(that.bizCard._id){
                    await wx.cloud.callFunction({
                       name:'sys',
                       data:{
                           $url:'updateCard',
                           card:that.bizCard,
                       }
                    });
				}
				uni.navigateTo({
					url: '/pagesMgt/BizServiceList',
				})
			},

		}
	}
</script>

<style>

</style>
