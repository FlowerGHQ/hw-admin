<template>
	<div class="suceess-style">
		<div class="container">
			<div class="icon">
				<img class="icon-img" src="../../../assets//images/supply-chain/suceess.png" alt="">
			</div>
			<div class="title">{{ $t('supply-chain.information_submitted_successfully') }}</div>
			<div class="sub-title">
				{{ $t('supply-chain.tips1') }} 
				<span class="timing">{{ count }}s</span>
				{{ $t('supply-chain.tips2') }}
		</div>
			<div class="btn" @click="onBtn">
				<a-button type="primary">{{ $t('supply-chain.view_materials') }}</a-button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted} from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
var countTime = null
const count = ref(3)

onMounted(() => {
	countTime = setInterval(() => {
		if (count.value === 0 ){
			clearInterval(countTime)
			countTime = null
			onBtn()
		} else {
			count.value--
		}
	}, 1000)	
})

const onBtn = () => {
	console.log("跳转");
	// router.push({
	// 	path: '',
	// 	query: {

	// 	}
	// })
}
</script>

<style lang="less" scoped>
.suceess-style {
	border-radius: 6px;
	background: #FFF;
	font-family: Alibaba PuHuiTi 2.0;
	// position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	.container {
		.icon {
			.icon-img {
				width: 101px;
				height: 77px;
			}
		}
		.title {
			color: #26AB54;
			font-size: 18px;
			font-weight: 500;
			line-height: 22px; /* 122.222% */
		}
		.sub-title {
			margin-top: 5px;
			color: #666;
			font-size: 12px;
			font-weight: 400;
			line-height: 22px; /* 183.333% */
			.timing {
				color: #26AB54;			
			}
		}
		.btn {
			margin-top: 16px;
		}
	}
}

</style>