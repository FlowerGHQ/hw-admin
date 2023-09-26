<!--
 * @Author: douzhiyuan
 * @Date: 2023-09-20 09:10:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-09-26 09:47:48
 * @Description: 请填写简介
-->
<template>
	<div class="tamplate-modal">
		<a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel">
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
				<a-button @click="handleCancel" v-if="!formdisabled">
					{{ $t("coc.coc_btn_cancel") }}
				</a-button>
				<a-button type="primary" @click="handleOk" v-if="!formdisabled">
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
						:disabled="formdisabled"
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
						:disabled="formdisabled"
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
						:disabled="formdisabled"
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
						:disabled="formdisabled"
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
				>
					<!-- 上传组件 正方形带+ -->
					<a-upload
						name="file"
						ref="uploader"
						list-type="picture-card"
						:disabled="formdisabled"
						:file-list="upload.fileList"
						:action="upload.action"
						:multiple="false"
						:headers="upload.headers"
						:data="upload.data"
						:max-count="1"
						:before-upload="handleFileCheck"
						:showUploadList="false"
						@change="handleFileChange"
					>
						<div>
							<plus-outlined></plus-outlined>
							<div class="ant-upload-text">
								{{ $t("coc.coc_placeholder_upload") }}
							</div>
						</div>
					</a-upload>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>
<script setup>
import { defineEmits, reactive, ref, onMounted, watch, computed } from "vue"
import Core from "@/core"
const { FILE_URL_PREFIX } = Core.Const.NET
const { getCateGoryList, viewCocTemplate } = Core.Api.COC
const { momentFilter } = Core.Util
import { useI18n } from "vue-i18n"
const $t = useI18n().t
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue"
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
const searchForm = reactive({
	name: "",
	version_number: "",
	coc_validity_date: [],
	model: [],
})
const formLayout = ref("horizontal")
const labelCol = ref({ style: { width: "100px" } })
const wrapperCol = ref({ span: 18 })
const formdisabled = computed(() => {
	return props.isDisable
})
const option = ref([])
const refForm = ref(null)
const upload = reactive({
	action: FILE_URL_PREFIX,
	fileList: [],
	headers: {
		ContentType: false,
	},
	data: {
		token: Core.Data.getToken(),
		type: "file",
	},
})
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

watch(
	() => props.modalType,
	(val) => {
		if (val == "detail" || val == "edit") {
			getDetail(props.recordItem.value.id)
		} else {
			searchForm.name = ""
			searchForm.version_number = ""
			searchForm.model = []
			searchForm.coc_validity_date = []
			upload.fileList = []
		}
	}
)

// 获取详情
const getDetail = async (id) => {
	const res = await viewCocTemplate({ id })
	searchForm.name = res.name
	searchForm.version_number = res.version_number
	searchForm.model = res.model.split(",")
	searchForm.coc_validity_date = [
		momentFilter(res.effective_start_time),
		momentFilter(res.effective_end_time),
	]
	upload.fileList = [
		{
			uid: "-1",
			name: res.name,
			status: "done",
			url: FILE_URL_PREFIX + res.path,
			response: {
				code: 0,
				data: {
					name: res.name,
					filename: res.path,
				},
			},
		},
	]
}
// 获取下拉框数据
const getCateGory = async () => {
	const res = await getCateGoryList()
	option.value = res
}
// 上传前检查文件
const handleFileCheck = (file) => {
	// 检测文件类型，doc、docx
	const isDoc = file.type === "application/msword"
	const isDocx =
		file.type ===
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
	if (!isDoc && !isDocx) {
		// 将显示的文件列表清空
		upload.fileList = []
		$message.error($t("coc.coc_upload_file_type_error"))
		return false
	}
	return true
}
// 上传文件
const handleFileChange = ({ file, fileList }) => {
	if (file.status == "done") {
		if (file.response && file.response.code > 0) {
			return $message.error(file.response.message)
		}
	}
	upload.fileList = fileList
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
</style>
