<template>
	<div>
		<div>COC管理后台【管理员】</div>
		<div>COC管理后台【业务】</div>
		<div>是否是超级管理员 {{ Core.Data.getManager() }}</div>
		<div>
			是否为平台方（管理员账号下管理员与业务员）{{ Core.Data.getLoginType() }}
		</div>

		<div>
			<platForm />
		</div>
	</div>
</template>

<script setup>
import Core from "../../core"
import { computed, ref } from "vue"
import platForm from "./platform-list.vue"
</script>

<style lang="less" scoped></style>
