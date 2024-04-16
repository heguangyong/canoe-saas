<template>
	<view class="content flex"  @tap="goProductDetail">
		<slot v-if="!showNum">
			<view  class="cu-avatar radius">
				<image :src="product.cover" mode="aspectFill"></image>
			</view>
			<view class="column-flex">
				<view class="text-position text-cut text-sm">{{product.title}}</view>
				<view class="text-gray text-cut  text-xs flex">
					<text  class="margin-right">¥{{product.price}}</text>
				</view>
			</view>
		</slot>
		<slot v-if="showNum">
			<view  class="cu-avatar round">
				<image :src="product.carouse[0]" mode="aspectFill"></image>
			</view >
			<view v-if="showTotal" class="column-flex">
				<view class="text-position text-cut text-sm text-orange">{{product.title}}</view>
				<view v-if="product.price>0" class="text-cut  text-xs flex text-orange">¥{{product.price}}</view>
			</view>
			<view v-else class="column-flex">
				<view class="text-position text-cut text-sm">{{product.title}}</view>
				<view v-if="product.price>0" class="text-gray text-cut  text-xs flex">¥{{product.price}}</view>
			</view>
			<view v-if="showTotal" class="num-right text-orange">数量：{{product.num}}</view>
			<view v-else class="num-right">数量：{{product.num}}</view>
		</slot>
	</view>
</template>

<script>
	export default {
        name: 'ups-product',
		props:{
			product:{
				type:Object,
				required:true
			}
		},
		data() {
			return {
			};
		},
		methods:{
			async goProductDetail(){
				uni.navigateTo({
					url:'/pagesCmn/products/ShareProductDetail?id='+this.product._id
				})
			},
		},
		
	}
</script>

<style>
	image{
		height:64rpx;
	}
	.cu-avatar{
		margin: 15rpx 15rpx 0 0;
	}
	.column-flex{
		flex-direction: column;
		margin-top: 10rpx;
		width: 350rpx;
	}
	.text-position{
		height: 34rpx;
		margin-top:7rpx;
	}
	.num-right{
		position: absolute;
		right: 30px;
		padding:25rpx 20rpx 15rpx 15rpx;
	}
</style>
