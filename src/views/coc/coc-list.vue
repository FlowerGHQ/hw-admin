<template>
	<div>
		<div>COC管理后台【管理员】</div>
		<div>COC管理后台【业务】</div>
		<div>是否是超级管理员 {{ Core.Data.getManager() }}</div>
		<div>
			是否为平台方（管理员账号下管理员与业务员）{{ Core.Data.getLoginType() }}
		</div>

		<component :is="isAdmin"> </component>
	</div>
</template>

<script setup>
import Core from "../../core"
import adminList from "./admin-list.vue"
import businessList from "./business-list.vue"
import { computed, ref } from "vue"

const currentView = computed(() => {
	if (Core.Data.getManager()) {
		return adminList
	} else {
		return businessList
	}
})
</script>

<style lang="less" scoped></style>
