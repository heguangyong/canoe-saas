<template>
	<view class="grid col-2" >
		<view v-for="(product, index) of productList" :key="index">
			<view class="product rel">
				<view  @tap="goProductDetail(product)">
					<image class="product-image" mode="aspectFill" :src="product.cover"></image>
					<text class="product-title">{{product.title}}</text>
					<view v-if="product.price>0"  class="price-line" style="margin-top: -20rpx">
						<text  class="text-bold text-red text-lg">{{'￥'+product.price}}</text>
					</view>
				</view>
				<view class="cu-bar margin-left-sm margin-right-sm round" style="margin-top: -20rpx;" v-if="isShowSwitch">
					<view>
						<text class="" :class="product.on_sale?'text-red':'text-gray'" >{{product.state}}</text>
					</view>
					<switch class='green' @change="switchOnSale(product,index)" :class="product.on_sale?'checked':''" :checked="product.on_sale?true:false"></switch>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
        name: 'ups-products',
		props:{
			productList:{
				type: Array,
				required: true
			},
			isEdit:{
				type:[Boolean,String],
				required: false,
                default:false
			},
            isShowSwitch:{
			    type:[Boolean,String],
				required:false,
				default:false
			}
		},
		data() {
			return {

			};
		},
		computed:{
			priceArray(price) {
				 let pa = String(Number(price).toFixed(2)).split('.');
				 return pa;
			}
		},
		methods:{
			goProductDetail(product){
			    let url='';
			    if(this.isEdit){
                    url = "/pagesCmn/product/ProductDetail?id="+product._id;
				}else {
                    url = "/pagesCmn/product/ProductDetailExt?id="+product._id;
				}
				uni.navigateTo({"url":url})
			},
             switchOnSale(product,idx){
                this.$emit('operateProduct','switchState',product,idx)
            },
		},
		
	}
</script>


<style lang="scss" scoped>
	$uni-bg-color:#ffffff !default;
	$uni-font-size-sm:12rpx !default;
	$uni-font-size-base:14rpx !default;
	$uni-spacing-col-base: 20rpx !default;
	$uni-border-radius-sm: 6rpx !default;
	$uni-border-radius-mid: 18rpx !default;
	$uni-border-radius-lg: 24rpx !default;
	$uni-text-color-red: #ed1c24 !default;
	$uni-text-color-disable:#c0c0c0 !default;
	
	.product {
		// display: flex;
		// flex-direction: column;
		background-color: $uni-bg-color;
		border-radius: $uni-border-radius-mid;
		margin: 10rpx 10rpx;
	}
	
	.product-image {
		background-color: gainsboro;
		width: 350rpx;
		height: 350rpx;
		border-top-left-radius: $uni-border-radius-mid;
		border-top-right-radius: $uni-border-radius-mid;
		margin-bottom: $uni-spacing-row-sm;
	}
	
	.product-title {
		margin-left: $uni-spacing-col-sm;
		margin-right: $uni-spacing-col-sm;
		text-overflow: ellipsis;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		height: 70rpx;
		font-size: 24rpx;
	}
	
	.price-line {
		margin-left: $uni-spacing-col-sm;
		margin-right: $uni-spacing-col-sm;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

</style>