<template>
	<div class="coc-template-list">
		<div class="list-container">
			<div class="title-container">
				<div class="title-area">{{ $t("coc.coc_title") }}</div>
				<div class="btns-area">
					<a-button type="primary" @click="handleModal('add')">
						{{ $t("coc.coc_add_template") }}
					</a-button>
				</div>
			</div>
			<div class="table-container">
				<a-table
					:columns="tableColumns"
					:data-source="tableData"
					:scroll="{ x: true }"
					:row-key="(record) => record.id"
					:pagination="false"
					:loading="loading"
				>
					<template #headerCell="{ title }">
						{{ $t(title) }}
					</template>
					<template #bodyCell="{ column, text, record }">
						<template v-if="column.key === 'coc_validity_date'">
							<span>
								{{ Util.timeFormat(record.effective_start_time) }} ~
								{{ Util.timeFormat(record.effective_end_time) }}
							</span>
						</template>
						<!-- 创建日期 -->
						<template v-else-if="column.key === 'create_time'">
							<span>{{ Util.timeFormat(record.create_time) }}</span>
						</template>
						<template v-else-if="column.key === 'coc_operation'">
							<!-- 查看 -->
							<a-button
								type="link"
								size="small"
								@click="handleModal('detail', record)"
							>
								{{ $t("coc.coc_btn_view") }}
							</a-button>
							<!-- 编辑 -->
							<a-button
								type="link"
								size="small"
								@click="handleModal('edit', record)"
							>
								{{ $t("coc.coc_btn_edit") }}
							</a-button>
							<!-- 删除 -->
							<a-button
								type="link"
								size="small"
								danger
								@click="handleDelete(record)"
							>
								{{ $t("coc.coc_btn_delete") }}
							</a-button>
						</template>
					</template>
				</a-table>
			</div>
			<div class="paging-container">
				<a-pagination
					v-model:current="pagination.page"
					:page-size="pagination.pageSize"
					:total="pagination.total"
					show-quick-jumper
					show-size-changer
					show-less-items
					:show-total="
						(total) =>
							$t('n.all_total') + ` ${pagination.total} ` + $t('in.total')
					"
					:hide-on-single-page="false"
					:pageSizeOptions="['10', '20', '30', '40']"
					@change="pageChange"
					@showSizeChange="pageSizeChange"
				/>
			</div>
		</div>
		<EditModal
			:ModalTitle="ModalTitle"
			:type="openType"
			v-model:visible="visible"
			:formdisabled="formdisabled"
			@handleOk="handleModalOk"
		>
			<!-- 内容form表单 -->
			<a-form
				:form="form"
				:layout="formLayout"
				:label-col="labelCol"
				:wrapper-col="wrapperCol"
			>
				<a-form-item :label="$t('coc.coc_lable_name')" :label-col="labelCol">
					<a-input
						v-model:value="form.name"
						:disabled="formdisabled"
						:placeholder="$t('coc.coc_placeholder_name')"
					/>
				</a-form-item>
				<a-form-item :label="$t('coc.coc_lable_version')" :label-col="labelCol">
					<a-input
						v-model:value="form.version_number"
						:disabled="formdisabled"
						:placeholder="$t('coc.coc_placeholder_version')"
					/>
				</a-form-item>
				<a-form-item
					:label="$t('coc.coc_lable_validity_date')"
					:label-col="labelCol"
				>
					<a-range-picker
						:show-time="{ format: 'HH:mm:ss' }"
						v-model:value="coc_validity_date"
						:disabled="formdisabled"
						format="YYYY-MM-DD HH:mm:ss"
						:placeholder="[$t('coc.coc_start_date'), $t('coc.coc_start_date')]"
					/>
				</a-form-item>
				<a-form-item
					:label="$t('coc.coc_lable_apply_vehicle')"
					:label-col="labelCol"
				>
					<!-- select -->
					<a-select
						v-model:value="form.model"
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
						:show-upload-list="{
							showPreviewIcon: false,
							showRemoveIcon: true,
							showDownloadIcon: true,
						}"
						:before-upload="handleFileCheck"
						@download="handleFileDownload"
						@change="handleFileChange"
					>
						<div>
							<loading-outlined v-if="btnLoading"></loading-outlined>
							<plus-outlined v-else></plus-outlined>
							<div class="ant-upload-text">
								{{ $t("coc.coc_placeholder_upload") }}
							</div>
						</div>
					</a-upload>
				</a-form-item>
			</a-form>
		</EditModal>
	</div>
</template>

<script setup>
import Core from "@/core"
const { Api, Util } = Core
const {
	deleteCocTemplate,
	getCocTemplateList,
	viewCocTemplate,
	getCateGoryList,
	addCocTemplate,
} = Api.COC
import { useTable } from "@/hooks/useTable"
import EditModal from "./template-modal.vue"
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue"
import { ref, getCurrentInstance, onMounted, reactive, toRefs } from "vue"
const { ctx } = getCurrentInstance()
const { $t, $message, $confirm } = ctx.$root

// 定义常量
const rowId = ref(null)
// 传递的props
const ModalTitle = ref("")
const visible = ref(false)
const openType = ref("")
// form表单
const form = ref({
	name: "",
	version_number: "",
	model: [],
})
// 上传字段
const modelForm = reactive({
	// 本次附件填写存值
	name: "",
	path: "",
	type: "",
	user_name: "",
	create_time: "",
})
const upload = reactive({
	action: Core.Const.NET.FILE_URL_PREFIX,
	fileList: [],
	headers: {
		ContentType: false,
	},
	data: {
		token: Core.Data.getToken(),
		type: "file",
	},
})
// form布局
const formLayout = ref("horizontal")
const labelCol = ref({ style: { width: "100px" } })
const wrapperCol = ref({ span: 16 })
const btnLoading = ref(false)
const coc_validity_date = ref([])
const option = ref([])
let formdisabled = ref(false)

const {
	tableData,
	pageChange,
	pageSizeChange,
	getTableData,
	pagination,
	loading,
} = useTable({ request: getCocTemplateList, searchForm: form })

// 获取下拉框数据
const getCateGory = async () => {
	const res = await getCateGoryList()
	option.value = res
}
// 上传前检查文件
const handleFileCheck = (file) => {
	btnLoading.value = true
	// 检测文件类型，doc、docx
	const isDoc = file.type === "application/msword"
	const isDocx =
		file.type ===
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
	if (!isDoc && !isDocx) {
		// 将显示的文件列表清空
		upload.fileList = []
		$message.error($t("coc.coc_upload_file_type_error"))
		// 阻止上传并阻止进入列表
		console.log("阻止上传并阻止进入列表")
		btnLoading.value = false
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
		modelForm.name = file.response.data.name
		modelForm.path = file.response.data.filename
		modelForm.type = upload.data.type
		modelForm.user_name = Core.Data.getUser().name
		modelForm.create_time = new Date().getTime() / 1000
		console.log("modelForm", modelForm)
	}
	btnLoading.value = false
	upload.fileList = fileList
}

onMounted(() => {
	getCateGory()
	getTableData()
})

// 重置数据
const resetData = () => {
	form.value = {
		name: "",
		version_number: "",
		model: [],
	}
	upload.fileList = []
	coc_validity_date.value = []
	pagination.page = 1
	pagination.current = 1
	pagination.pageSize = 20
}
// 获取详情
const getDetail = async (id) => {
	const res = await viewCocTemplate({ id })
	form.value = res
	form.value.model = res.model ? res.model.split(",") : []
	// antdesign的日期组件需要传入moment对象
	// 时间戳转moment对象 案例：1655366541 => 2022-02-15 10:42:21
	// moment对象转时间戳 案例：moment("2022-02-15 10:42:21").valueOf() => 1655366541000
	// moment对象转时间戳 案例：moment("2022-02-15 10:42:21").unix() => 1655366541
	// 时间戳转moment对象 案例：moment.unix(1655366541) => 2022-02-15 10:42:21
	if (res.effective_start_time && res.effective_end_time) {
		coc_validity_date.value = [
			Util.momentFilter(res.effective_start_time),
			Util.momentFilter(res.effective_end_time),
		]
	} else {
		coc_validity_date.value = []
	}
	// 传递回显文件
	upload.fileList = [
		{
			uid: "-1",
			name: res.name,
			status: "done",
			url: res.file_url,
		},
	]
}
const saveCocTemplate = (params, type = "") => {
	addCocTemplate(params).then((res) => {
		$message.success(
			type === "add" ? $t("coc.coc_add_success") : $t("coc.coc_edit_success")
		)
		Core.Logger.success("参数", params, "结果", res)
		// 刷新列表
		getTableData()
	})
}
const handleFileDownload = (file) => {
	let url = Core.Const.NET.FILE_URL_PREFIX + file.url
	console.log("url", url)
	window.open(url, "_self")
}
// 点击不同的按钮
const handleModal = (open_type, item = {}) => {
	if (open_type === "add") {
		ModalTitle.value = $t("coc.coc_modal_add_title")
		resetData()
		formdisabled.value = false
	} else if (open_type === "detail") {
		ModalTitle.value = $t("coc.coc_modal_view_title")
		// 获取详情
		getDetail(item.id)
		formdisabled.value = true
	} else if (open_type === "edit") {
		ModalTitle.value = $t("coc.coc_modal_edit_title")
		getDetail(item.id)
		formdisabled.value = false
	}
	openType.value = open_type
	rowId.value = item.id || null
	visible.value = true
}
// handleModalOk 点击确定按钮
const handleModalOk = (value) => {
	// 处理时间
	if (coc_validity_date.value.length > 0) {
		form.value.effective_start_time = coc_validity_date.value[0].unix()
		form.value.effective_end_time = coc_validity_date.value[1].unix()
	}
	// 深拷贝
	let params = Util.deepCopy(form.value)
	params.model = params.model.length > 0 ? params.model.join(",") : ""
	params.file_url = upload.action + "/" + modelForm.path
	if (params.update_time) {
		delete params.update_time
	}
	switch (value) {
		case "add":
			saveCocTemplate(params, "add")
			break
		case "edit":
			saveCocTemplate(params, "edit")
			break
	}
	visible.value = false
}
// 删除按钮
const handleDelete = (item) => {
	// 询问是否删除
	$confirm({
		title: $t("pop_up.sure_delete"),
		okText: $t("def.sure"),
		okType: "danger",
		cancelText: $t("def.cancel"),
		onOk() {
			deleteCocTemplate({ id: item.id }).then((res) => {
				$message.success($t("coc.coc_delete_success"))
				Core.Logger.success("参数", { id: item.id }, "结果", res)
				// 刷新列表
				getTableData()
			})
		},
	})
}
const tableColumns = [
	{ title: "coc.coc_name", dataIndex: "name", key: "name" },
	{
		title: "coc.coc_version",
		dataIndex: "version_number",
		key: "version_number",
	},
	{
		title: "coc.coc_apply_vehicle",
		dataIndex: "model",
		key: "model",
	},
	{
		title: "coc.coc_validity_date",
		dataIndex: "coc_validity_date",
		key: "coc_validity_date",
	},
	{
		title: "coc.coc_create_date",
		dataIndex: "create_time",
		key: "create_time",
	},
	{
		title: "coc.coc_operation",
		dataIndex: "coc_operation",
		key: "coc_operation",
	},
]
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
	}
}
</style>
