<template>
	<div>
		<!-- 判断是平台方还是分销商 -->
		<component :is="isAdmin"></component>
	</div>
</template>

<script setup>
import { computed } from "vue"
import Core from "../../core"
import adminList from "./admin-list.vue"
import businessList from "./business-list.vue"
const isAdmin = computed(() => {
	if (Core.Data.getManager()) {
		return adminList
	} else {
		return businessList
	}
})
</script>

<style lang="less" scoped></style>
