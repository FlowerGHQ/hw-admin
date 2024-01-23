<template>
	<div class="edtior">
		<MyEditor v-model="content" />
	</div>
</template>

<script setup>
	import MyEditor from '@/components/MyEditor/index.vue'
	import { ref } from 'vue'	
	const content = ref('')
</script>

<style lang="less" scoped>
.edtior{
	width: 207px;
	height: 186px;
	color: #BFBFBF;
	margin: 20px auto;
	:deep(.ql-toolbar.ql-snow){
		display: flex;
		justify-content: space-between;
		.ql-formats{
			&:nth-child(2){
				margin-right: 0;
			}
		}
		&::after{
			display: none;
		}
	}
}
</style>