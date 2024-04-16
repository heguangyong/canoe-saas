<template>
	<view>
		<cu-custom :isBack="true">
			<block slot="backText">返回</block>
		    <block slot="content">{{title}}</block>
		</cu-custom>
		<view>
			<view v-if="categories.length>1" class='padding-sm flex flex-wrap'>
				<view class="padding-xs" v-for="(item,index) in categories" :key="index">
					<view v-if="item.checked" class='cu-tag  line-grey round'  @tap="chooseTag(index)">{{item.label}}</view>
					<view v-else class='cu-tag round' @tap="chooseTag(index)">{{item.label}}</view>
				</view>
			</view>
			<view v-if="isManageTags">
				<view class="cu-bar margin-top bg-white solid-bottom">
					<view class="action">
						<text>产品标签（逗号分割）</text>
					</view>
					<view class="action">
						<button class="cu-btn line-grey round" @tap="saveTags">保存</button>
					</view>
				</view>
				<view class="cu-form-group align-start">
					<textarea class="bg-white" scroll-y="true" maxlength="140" placeholder="产品标签" v-model="bizCard.tags.products" >
					</textarea>
				</view>
			</view>
			<ups-products :productList="checkedProducts" :isEdit="true" :isShowSwitch="true" @operateProduct="popupOperateProduct">
			</ups-products>
			<view class="cu-tabbar-height"></view>
			<view class="cu-bar bg-white tabbar border foot">
				<button class="action" @tap="goMy">
					<view class="cuIcon-my"></view>我的
				</button>
				<button class="action" @tap="manageTags">
					<view class="cuIcon-tag"></view>管理标签
				</button>
				<!--  #ifdef MP-WEIXIN -->
				<view class="bg-red submit text-lg" @tap="goAddProduct">新增产品</view>
				<!--  #endif -->
				<!--  #ifdef H5 -->
				<view class="bg-white submit text-lg"></view>
				<!--  #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
    import uniPopup from '@/components/uni-popup/uni-popup.vue'
    import upsProducts from '@/components/ups-products/index.vue'
    import cmnUtils from '@/utils/cmnUtils.js'


	export default {
		components:{
            'ups-products':upsProducts,
            "uni-popup":uniPopup,
		},
		data() {
			return {
				title:'',
				products:[],
                checkedLabels:[],
				checkedProducts:[],//用于支持筛选过滤显示
				page:1,
				cardId:-1,
				bizCard:{},//用于更新产品标签，为检索
                //产品标签分类
                categories:[{label:'全部',checked:true}],
				isManageTags:false
			}
		},
		onLoad(options){
			this.title=options.title;
		},
		onShow(){
			this.getList()
		},
		onPullDownRefresh() {
			this.page=1
			this.getList()
			uni.stopPullDownRefresh(); // 停止刷新
		},
		onReachBottom() {
			this.page++;
			this.getList()
		},
		computed:{
			...mapState(['user']),
		},
		methods: {
			async getList(){
				let that = this;
                if (that.page == 1) {
                    that.products=[];
                }
                let res = null;
                res= await wx.cloud.callFunction({
					name:'cmn',
					data:{
					  $url:'getProductListByCardId',
					  cardId:that.user.userInfo.bizCardId,
					  checkedLabels:that.checkedLabels,
					  page:that.page
					}
				});
                if(!cmnUtils.isEmpty(res.result.data)){
                    that.products.push(...res.result.data);
                }
                that.products.forEach(item => {
					item.state=item.on_sale?'已上架':'未上架';
				});

				that.checkedProducts = that.products;
				res = await wx.cloud.callFunction({
					name:'sys',
					data:{
						$url:'getCardDetailById',
						id:that.user.userInfo.bizCardId
					}
				});
				that.bizCard = res.result.data;

				if(that.checkedLabels.length==0){
                    that.doCategories();
				}
			},

			goMy(){
					uni.reLaunch({
						url:"/pages/my/home"
					})
			},
			
			manageTags(){
                this.isManageTags = true;
            },
			
            async doCategories(){
                let that =this;
                let tags = that.bizCard.tags||{card:'',products:'',activity:'',trends:''};
                let dbProductTags=tags.products||'';
                that.categories=[{label:'全部',checked:true,manage:false}];
                let checkStr = '';
                //中文逗号替换成英文逗号
                dbProductTags = dbProductTags.replace(RegExp('，','g'),',');
                //英文逗号
                if(dbProductTags.indexOf(',')>0){
                    dbProductTags.split(',').forEach(each=>{
                        if(each.trim().length>0 && checkStr.indexOf(each)<0){
                            checkStr += each;
                            that.categories.push({label:each,checked:false,manage:false});
                        }
                    })
                }
            },

			async saveTags(){
                let that = this;
                await wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'updateCard',
                        card:that.bizCard,
                    }
                });
                that.doCategories();
                that.isManageTags =false;
            },
			
			async chooseTag(index){
				let that = this;
                //计算当前选中标签
                that.checkedLabels=[];
                that.checkedProducts=[];

				//点全部
				if(index==0 ){
                    that.checkedLabels=[];
                    that.categories[0].checked = true;
                    that.page=1;
                    that.getList();
                    that.categories.forEach(category=>{
                        if(category.label!='全部') {
                            category.checked = false;
                        }
                    });
				}else {
                    //计算当前被选中的标签集合
                    that.categories[index].checked = !that.categories[index].checked;
                    that.categories.forEach(category=>{
                        if(category.checked){
                            if(category.label!='全部'){
                                that.checkedLabels.push(category.label);
                            }
                        }
                    });

                    //如果没有选中，设定默认全部
                    if(that.checkedLabels.length==0){
                        that.checkedLabels=[];
                        that.categories[0].checked = true;
                        that.page=1;
                        that.getList();
                    }else{
                        //去掉全部
                        that.categories[0].checked = false;
                        that.page=1;
                        that.getList();
                    }
				}
				//数据库中加载
				that.$forceUpdate();
			},
			
			goAddProduct(){
				uni.navigateTo({
			        "url":"/pagesMgt/BizProductInput"
				})
			},
			
			async popupOperateProduct(type,product,idx){
			    let that = this
			    if(type='switchState'){
			        that.products[idx].on_sale = !that.products[idx].on_sale;
					that.products[idx].state=that.products[idx].on_sale?'已上架':'未上架';
			        // console.log('updateProductState',that.products[idx].on_sale,that.products[idx].state);
					await wx.cloud.callFunction({
			            name:'cmn',
			            data:{
			                $url:'updateProductState',
							id:that.products[idx]._id,
			                on_sale:that.products[idx].on_sale,
							state:that.products[idx].state
			            }
			        });
			        that.$forceUpdate();
				}
			},
		}
	}
</script>

<style>
</style>
