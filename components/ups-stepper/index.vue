<template name='feng-stepper'>
	<view style="display: inline-block;">
		<view class="feng-stepper">
			<view v-if="stepperCacheNum > 0" class="step-cr" @tap="less" :style="stepperCacheNum<=min?'color:'+unactive+';':'color:'+active+';'">-</view>
			<input v-if="stepperCacheNum > 0" type="number" :value="stepperCacheNum" @input="iptVal" :disabled="true" />
			<view class="step-cr" @tap="add" :style="stepperCacheNum>=max?'color:'+unactive+';':'color:'+active+';'">+</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				stepperNum: 0,
				stepperCacheNum: 0
			};
		},
		name: 'feng-stepper',
		props: {
			val: {
				type: [String, Number],
				default: 0
			},
			min: {
				type: [String, Number],
				default: 0
			},
			max: {
				type: [String, Number],
				default: 0
			},
			step: {
				type: Number,
				default: 1
			},
			label: {
				type: String,
				default: ''
			},
			disabled: {
				type: Boolean,
				default: false
			},
			active: {
				type: String,
				default: '#FFF'
			},
			unactive: {
				type: String,
				default: '#ddd'
			}
		},
		created() {
			this.stepperNum = this.val;
			this.stepperCacheNum = this.val;
		},
		watch: {
			val: function(val) {
				this.stepperNum = this.val;
			}
		},
		methods: {
			less() {
				this.stepperNum <= this.min ? this.stepperNum = this.min : this.stepperNum -= Math.ceil(this.step * 10) / 10;
				this.stepperCacheNum = Number(this.stepperNum.toFixed(1));
				this.emit(this.stepperCacheNum, this.label,'less');
			},
			add() {
				this.stepperNum >= this.max ? this.stepperNum = this.max : this.stepperNum += Math.ceil(this.step * 10) / 10;
				this.stepperCacheNum = Number(this.stepperNum.toFixed(1));
				this.emit(this.stepperCacheNum, this.label,'add');
			},
			emit( val, label, type) {
				if (Number(val.toFixed(1)) > this.max) {
					val = this.max;
					this.stepperCacheNum = this.max;
				}
				if (Number(val.toFixed(1)) < this.min) {
					val = this.min;
					this.stepperCacheNum = this.min;
				}
				this.$emit('change', {
					val: val,
					label: label,
					type: type
				});
			},
			iptVal(e) {
				// 暂未开发输入框->sunUI1.0.0,预计sunUI1.0.1
				Number(e.detail.value) > this.max ? this.stepperNum = this.max : this.stepperNum;
			}
		}
	}
</script>

<style lang="scss">
	.feng-stepper {
		display: flex;
		align-items: center;
		background-color: #EEEEEE;
		border-radius: 25upx;
		.step-cr {
			display: inline-block;
			font-size: 32upx;
			// 如果需要边框,则打开本样式 --1
			line-height: 44upx; //1
			// padding: 4upx; //1
			border-radius: 50%;
			// border:1px solid #EEEEEE;
			height:50upx;width: 50upx;
			background-color: lightgrey;
			text-align: center;
		}
		
		input {
			width: 50upx;
			// 如果不需要边框,则关闭本样式 --2
			// margin: 0 20upx; //2
			text-align: center;
			height: 50upx;
		}
	}
</style>
