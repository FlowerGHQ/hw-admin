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
					:pagination="channelPagination"
					@change="handleTableChange"
					:loading="loading"
				>
					<template #headerCell="{ title }">
						{{ $t(title) }}
					</template>
					<template #bodyCell="{ column, text, record }">
						<template v-if="column.key === 'coc_apply_vehicle'">
							<span v-for="item in record.model.split(',')">
								{{ item }}
							</span>
						</template>
						<template v-else-if="column.key === 'delivery_time'">
							{{ timeFormat(record.effective_start_time) }}
							~
							{{ timeFormat(record.effective_end_time) }}
						</template>
						<template v-else-if="column.key === 'create_time'">
							{{ timeFormat(record.create_time) }}
						</template>
						<template v-else-if="column.key === 'operation'">
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
		</div>
		<TemplateMoudal
			v-model:visible="visible"
			:modalType="modalType"
			:recordItem="recordItem"
			:isDisable="isDisable"
		/>
	</div>
</template>

<script setup>
import Core from "@/core"
const { Api, Util } = Core
// 共用的方法
const { timeFormat } = Util
// 引用api
const getCocTemplateList = Api.COC.getCocTemplateList
import TemplateMoudal from "./components/template-modal.vue"
// 引用i18n
import { useI18n } from "vue-i18n"
import { ref, reactive, onMounted, computed } from "vue"

let loading = ref(false)
// 定义tablele数据
const tableData = ref([])
// 定义变量
const tableColumns = ref([
	{
		title: "coc.coc_name",
		dataIndex: "name",
		key: "name",
	},
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
		dataIndex: "delivery_time",
		key: "delivery_time",
	},
	{
		title: "coc.coc_create_date",
		dataIndex: "create_time",
		key: "create_time",
	},
	{
		title: 'coc.coc_modal_status',
		dataIndex: 'status',
		key: 'status',
	},
	{
		title: "coc.coc_operation",
		dataIndex: "operation",
		key: "operation",
	},
])
const $t = useI18n().t
const channelPagination = reactive({
	current: 1,
	page: 1,
	pageSizeOptions: ["20", "40", "60", "80", "100"],
	pageSize: 20,
	showQuickJumper: true, // 是否可以快速跳转至某页
	showSizeChanger: true, // 是否可以改变 pageSize
	total: 0,
	showTotal: (total) => `${$t("n.all_total")} ${total} ${$t("in.total")}`,
})
const visible = ref(false)
const modalType = ref("")
const recordItem = reactive({})
// 是否禁用 true:禁用 false:不禁用
const isDisable = ref(false)

// 获取列表数据
const getTableData = () => {
	loading.value = true
	getCocTemplateList({
		page: channelPagination.page,
		pageSize: channelPagination.pageSize,
	}).then((res) => {
		console.log(res)
		loading.value = false
		tableData.value = res.list
		channelPagination.total = res.count
	})
}
const handleModal = (type = "add", record = {}) => {
	switch (type) {
		case "add":
			modalType.value = "add"
			isDisable.value = false
			break
		case "edit":
			modalType.value = "edit"
			isDisable.value = false
			break
		case "detail":
			modalType.value = "detail"
			isDisable.value = true
			break
	}
	recordItem.value = record
	visible.value = true
}

// table改变的时候触发
const handleTableChange = (pagination) => {
	channelPagination.current = pagination.current
	channelPagination.page = pagination.current
	channelPagination.pageSize = pagination.pageSize
	getCocTemplateList()
}

onMounted(() => {
	getTableData()
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
	}
}
</style>
