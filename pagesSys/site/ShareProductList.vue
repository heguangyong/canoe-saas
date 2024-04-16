<template>
	<view>
		<!-- #ifdef MP-WEIXIN-->
		<cu-custom :isBack="false">
		    <block slot="content">最新产品</block>
		</cu-custom>
		<!-- #endif-->
		<view v-if="categories.length>1" class='padding-sm flex flex-wrap'>
			<view class="padding-xs" v-for="(item,index) in categories" :key="index">
				<view v-if="item.checked" class='cu-tag  bg-grey round'  @tap="chooseTag(index)">{{item.label}}</view>
				<view v-else class='cu-tag line-gray round' @tap="chooseTag(index)">{{item.label}}</view>
			</view>
		</view>
		<view>
			<ups-products :productList="products"></ups-products>
		</view>
		<view class="cu-tabbar-height"></view>
	</view>
</template>

<script>
	import { mapState,mapMutations  } from 'vuex'
    import upsProducts from '@/components/ups-products/index.vue'
    import cmnUtils from '@/utils/cmnUtils.js'

	export default {
		components:{
            'ups-products':upsProducts,
		},
		data() {
			return {
				products:[],
                checkedLabels:[],
				page:1,
				bizCard:{},//用于更新产品标签，为检索
                //产品标签分类
                categories:[{label:'全部',checked:true}],
			}
		},

    onLoad(options){
      let that = this;
      if(options.cardId) {
        that.user.userInfo.bizCardId = options.cardId;
        that.getList();
      }
    },

    onShareAppMessage(res){
      if(res.from==='button'){
      }
      return{
        title:'这是'+this.bizCard.name+'的产品，请惠存。',
        imageUrl:this.bizCard.cover||'',
        path:"/pagesSys/site/product?cardId="+this.bizCard._id,
        success:function(res){
        }
      }
    },

    onReady(){
      wx.setNavigationBarTitle({
          title: "最新产品"
      })
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
			...mapState(['user','filePath']),
		},
		methods: {
            ...mapMutations(['convertFilePath']),
			async getList(){
                let that = this;
                if (that.page == 1) {
                    that.products=[];
                }
                let res = null;
                res= await wx.cloud.callFunction({
                    name:'cmn',
                    data:{
                        $url:'getOnSaleProductListByCardId',
                        cardId:that.user.userInfo.bizCardId,
                        checkedLabels:that.checkedLabels,
                        page:that.page
                    }
                });
                if(!cmnUtils.isEmpty(res.result.data)){
                    that.products.push(...res.result.data);
                }
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

            async chooseTag(index){
                let that = this;
                //计算当前选中标签
                that.checkedLabels=[];
                that.products=[];

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
		}
	}
</script>

<style>
</style>
