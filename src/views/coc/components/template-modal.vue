<template>
	<div class="tamplate-modal">
		<a-modal
			v-model:visible="visible"
			destroyOnClose
			@ok="handleOk"
			@cancel="handleCancel"
		>
			<template #title>
				<span v-if="modalType === 'add'">{{
					$t("coc.coc_modal_add_title")
				}}</span>
				<span v-if="modalType === 'edit'">{{
					$t("coc.coc_modal_edit_title")
				}}</span>
				<span v-if="modalType === 'detail'">
					{{ $t("coc.coc_modal_view_title") }}
				</span>
			</template>
			<template #footer>
				<a-button @click="handleCancel" v-if="!isDisable">
					{{ $t("coc.coc_btn_cancel") }}
				</a-button>
				<a-button type="primary" @click="handleOk" v-if="!isDisable">
					{{ $t("coc.coc_btn_comfirm") }}
				</a-button>
			</template>
			<!-- 内容form表单 -->
			<a-form
				ref="refForm"
				:form="searchForm"
				:layout="formLayout"
				:label-col="labelCol"
				:wrapper-col="wrapperCol"
				:model="searchForm"
				:rules="rules"
			>
				<a-form-item
					:label="$t('coc.coc_lable_name')"
					:label-col="labelCol"
					name="name"
				>
					<a-input
						v-model:value="searchForm.name"
						:disabled="isDisable"
						:placeholder="$t('coc.coc_placeholder_name')"
					/>
				</a-form-item>
				<a-form-item
					:label="$t('coc.coc_lable_version')"
					:label-col="labelCol"
					name="version_number"
				>
					<a-input
						v-model:value="searchForm.version_number"
						:disabled="isDisable"
						:placeholder="$t('coc.coc_placeholder_version')"
					/>
				</a-form-item>
				<a-form-item
					:label="$t('coc.coc_lable_validity_date')"
					:label-col="labelCol"
					name="coc_validity_date"
				>
					<a-range-picker
						:show-time="{ format: 'HH:mm:ss' }"
						v-model:value="searchForm.coc_validity_date"
						:disabled="isDisable"
						format="YYYY-MM-DD HH:mm:ss"
						:placeholder="[$t('coc.coc_start_date'), $t('coc.coc_start_date')]"
					/>
				</a-form-item>
				<a-form-item
					:label="$t('coc.coc_lable_apply_vehicle')"
					:label-col="labelCol"
					name="model"
				>
					<!-- select -->
					<a-select
						v-model:value="searchForm.model"
						mode="multiple"
						showArrow
						:disabled="isDisable"
						:placeholder="$t('coc.coc_placeholder_apply_vehicle')"
					>
						<a-select-option
							v-for="(item, index) in option"
							:key="index"
							:value="item"
						>
							{{ item }}
						</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item
					:label="$t('coc.coc_lable_template')"
					:label-col="labelCol"
					name="upload"
					class="upload-item"
				>
					<TemplateUpload
						:isDisable="isDisable"
						:type="['doc', 'docx']"
						:fileUrl="searchForm.fileList"
					/>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>
<script setup>
import Core from "@/core"
import { useI18n } from "vue-i18n"
import { defineEmits, reactive, ref, onMounted, watch, computed } from "vue"
import TemplateUpload from "./template-upload.vue"
import Util from "../../../core/utils"
const FILE_URL_PREFIX = Core.Const.NET.FILE_URL_PREFIX
const { getCateGoryList, viewCocTemplate } = Core.Api.COC
const { momentFilter } = Core.Util
const $t = useI18n().t

const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
	modalType: {
		type: String,
		default: "",
	},
	isDisable: {
		type: Boolean,
		default: false,
	},
	recordItem: {
		type: Object,
		default: () => {},
	},
})
const $emit = defineEmits(["update:visible"])

const formLayout = ref("horizontal")
const labelCol = ref({ style: { width: "100px" } })
const wrapperCol = ref({ span: 18 })
const option = ref([])
const refForm = ref(null)
// validate
const validateDate = async (rule, value) => {
	console.log("value", value)
	if (value && value.length > 0) {
		return Promise.resolve()
	}
	return Promise.reject($t("coc.coc_validity_date_required"))
}
const validateModel = async (rule, value) => {
	console.log("value", value)
	if (value && value.length > 0) {
		return Promise.resolve()
	}
	return Promise.reject($t("coc.coc_apply_vehicle_required"))
}
const validateUpload = async (rule, value) => {
	console.log("value", value)
	console.log("upload.fileList", upload.fileList)
	// upload.fileList若为空数组，说明没有上传文件
	if (upload.fileList.length === 0) {
		return Promise.reject($t("coc.coc_template_required"))
	}
	return Promise.resolve()
}
const rules = reactive({
	name: [
		{
			required: true,
			message: () => $t("coc.coc_name_required"),
			trigger: ["change", "blur"],
		},
	],
	version_number: [
		{
			required: true,
			message: () => $t("coc.coc_version_required"),
			trigger: ["change", "blur"],
		},
	],
	coc_validity_date: [
		{
			required: true,
			trigger: ["change", "blur"],
			validator: validateDate,
		},
	],
	model: [
		{
			required: true,
			trigger: ["change", "blur"],
			validator: validateModel,
		},
	],
	upload: [
		{
			required: true,
			trigger: ["change", "blur"],
			validator: validateUpload,
		},
	],
})
const searchForm = computed(() => {
	let arr = Util.deepCopy(props.recordItem)
	if (arr.model) {
		arr.model = arr.model.split(",")
	}
	if (arr.effective_start_time && arr.effective_end_time) {
		arr.coc_validity_date = [
			momentFilter(arr.effective_start_time),
			momentFilter(arr.effective_end_time),
		]
	}
	if (arr.file_url) {
		console.log("arr.file_url", arr.file_url)
		arr.fileList = [
			{
				uid: "-1",
				name: arr.name,
				status: "done",
				url: FILE_URL_PREFIX + arr.file_url,
				response: {
					code: 0,
					data: {
						name: arr.name,
						filename: arr.file_url,
					},
				},
			},
		]
	}
	return arr
})
// 获取下拉框数据
const getCateGory = async () => {
	const res = await getCateGoryList()
	option.value = res
}

// modal
const handleOk = () => {
	refForm.value
		.validate()
		.then((res) => {
			console.log("校验成功")
		})
		.catch((err) => {
			console.log("校验失败")
		})
}
const handleCancel = () => {
	$emit("update:visible", false)
}

onMounted(() => {
	getCateGory()
})
</script>

<style lang="less" scoped>
:deep(.ant-form-item-label) {
	label {
		display: inline-flex;
		white-space: normal;
		height: 100%;
		margin-right: 8px;
		// 与右侧内容对齐
		align-items: center;
		align-items: flex-start;
	}
}
:deep(.ant-upload) {
	width: 100%;
}
</style>
