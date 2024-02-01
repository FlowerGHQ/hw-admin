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
						<template v-else-if="column.key === 'model'">
							<!-- 蓝色按钮 -->
							<a-tooltip >
								<template #title v-if="record.model">
									<div v-for="(item,index) in record.model.split(',')" :key="index">
										{{ item }}
									</div>
								</template>
								<a-button
									type="link"
									size="small"
								>
									{{ record.model || '-'}}
								</a-button>
							</a-tooltip>
						</template>
						<template v-else-if="column.key === 'delivery_time'">
							{{ timeFormat(record.effective_start_time) }}
							~
							{{ timeFormat(record.effective_end_time) }}
						</template>
						<template v-else-if="column.key === 'create_time'">
							{{ timeFormat(record.create_time) }}
						</template>
						<template v-else-if="column.key === 'state'">
								<!-- tag -->
								<!-- :color="Core.Const.COC.CER_STATUS[record.state].color" -->
							<a-tag 
							:style="{
								color:Core.Const.COC.CER_STATUS[record.state].color + `!important`, 
								backgroundColor: '#fff',
								border: '1px solid ' + Core.Const.COC.CER_STATUS[record.state].color,
								fontWeight: '600'
							}"
							>
								{{ Core.Const.COC.CER_STATUS[record.state][$i18n.locale] }}
							</a-tag>
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
			ref="modalRef"
			v-model:dialogVisible="visible"
			:modalType="modalType"
			:recordItem="recordItem"
			:isDisable="isDisable"
			@search="getTableData"
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
const viewCocTemplate = Api.COC.viewCocTemplate
const deleteCocTemplate = Api.COC.deleteCocTemplate
import TemplateMoudal from "./components/template-modal.vue"
// 引用i18n
import { useI18n } from "vue-i18n"
import { ref, reactive, onMounted, computed, getCurrentInstance } from "vue"
const {proxy } = getCurrentInstance()
const $t = useI18n().t
const $message = proxy.$message


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
		dataIndex: 'state',
		key: 'state',
	},
	{
		title: "coc.coc_operation",
		dataIndex: "operation",
		key: "operation",
		fixed: "right",
	},
])
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
const recordItem = ref({})
// 是否禁用 true:禁用 false:不禁用
const isDisable = ref(false)
const modalRef = ref(null)

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
const getRowDetails = (type, record) => {
	if (type === 'add') {
		recordItem.value = {}
		isDisable.value = false
	} else { 
		viewCocTemplate({
			id: record.id,
		}).then((res) => {
			recordItem.value = res
			if (type === 'detail') {
				isDisable.value = true
			} else if (type === 'edit') {
				isDisable.value = false
			}
		})
	}
}
const handleModal = (type = "add", record = {}) => {
	visible.value = true
	modalType.value = type
	getRowDetails(type, record)
}
// table改变的时候触发
const handleTableChange = (pagination) => {
	channelPagination.current = pagination.current
	channelPagination.page = pagination.current
	channelPagination.pageSize = pagination.pageSize
	getTableData()
}
const handleDelete = (record) => { 
	Core.Util.confirm({
		title: $t("coc.coc_delete_confirm"),
		content: $t("coc.coc_delete_confirm_content"),
		okText: $t("coc.coc_btn_comfirm"),
		cancelText: $t("coc.coc_btn_cancel"),
		onOk: () => {
			deleteCocTemplate({
				id: record.id,
			}).then((res) => {
				$message.success($t("coc.coc_delete_success"))
				getTableData()
			})
		},
	})
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
