<template>
	<div>
		<component :is="isPlatform"></component>
	</div>
</template>

<script setup>
// 引入管理员角色页面和分销商页面
import { computed } from "vue"
import adminRoles from "./admin-list.vue"
import distributorCoc from "./distributor-coc.vue"
import Core from "../../core"
const isPlatform = computed(() => {
	// 10 平台方 15分销商
	if (Core.Data.getLoginType() == 10) {
		return adminRoles
	} else if (Core.Data.getLoginType() == 15) {
		return distributorCoc
	} else {
		return null
	}
})
</script>

<style lang="less" scoped></style>
