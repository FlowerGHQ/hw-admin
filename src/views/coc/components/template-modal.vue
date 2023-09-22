<!--
 * @Author: douzhiyuan
 * @Date: 2023-09-20 09:10:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-09-22 10:25:54
 * @Description: 请填写简介
-->
<template>
	<div class="tamplate-modal">
		<a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel">
			<template #title>
				<span>{{ ModalTitle }}</span>
			</template>
			<!-- 动态插槽 -->
			<template #footer>
				<a-button @click="handleCancel" v-if="!formdisabled">
					{{ $t("coc.coc_btn_cancel") }}
				</a-button>
				<a-button type="primary" @click="handleOk">
					{{ $t("coc.coc_btn_comfirm") }}
				</a-button>
			</template>
			<slot></slot>
		</a-modal>
	</div>
</template>
<script setup>
import {  getCurrentInstance ,useAttrs,defineEmits } from "vue"
const { ctx } = getCurrentInstance()
const { $t } = ctx.$root
const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
	ModalTitle: {
		type: String,
		default: "",
	},
	formdisabled: {
		type: Boolean,
		default: false,
	},
})
const $emit = defineEmits(["update:visible", "handleOk"])
// modal
const handleOk = () => {
	console.log("handleOk",props.formdisabled)
	if (!props.formdisabled) {
		$emit('handleOk','edit') //编辑
	} else { 
		// 传递修改的字段标识
		$emit('handleOk','view') //查看
	}

}
const handleCancel = () => {
	$emit("update:visible", false)
}
</script>

<style lang="less" scoped>

</style>
