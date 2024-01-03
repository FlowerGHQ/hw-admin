<template>
	<div class="supply-chain">
		<MyStep 
			v-model:ActiveCurrent="current"
		/>
		<!-- 动态组件 -->
		<component :is="currentComponent" />
	</div>
</template>

<script setup>
	import { ref ,computed } from "vue";
	import MyStep from "./components/steps.vue";
	// 基础信息
	import BasicInfo from "./basic-info.vue";
	// 材料清单
	import MaterialList from "./material-list.vue";
	// 提交准入申请
	import SubmitAdmissionApplication from "./submit-admission-application.vue";
	const currentComponent = computed(() => {
		switch (current.value) {
			case 0:
				return BasicInfo;
			case 1:
				return MaterialList;
			case 2:
				return SubmitAdmissionApplication;
			default:
				return BasicInfo;
		}
	});
	const current = ref(0);
</script>

<style lang="less" scoped>
.supply-chain{
}
</style>