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
			:visible="visible"
			:ModalTitle="ModalTitle"
			:openType="openType"
			v-model:visible="visible"
			v-model:form="form"
			:row-id="rowId"
			@getTableData="getTableData"
		/>
	</div>
</template>

<script setup>
import Core from "@/core"
const { Api, Util } = Core
const { deleteCocTemplate, getCocTemplateList } = Api.COC
import { useTable } from "@/hooks/useTable"
import EditModal from "./template-modal.vue"
import { ref, getCurrentInstance ,} from "vue"
const { ctx } = getCurrentInstance()
const { $t, $message } = ctx.$root

// 传递的props
const ModalTitle = ref("")
const visible = ref(false)
const openType = ref("")
const rowId = ref("")
// form表单
const form = ref({})

const { tableData, pageChange, pageSizeChange, getTableData, pagination ,loading} =
	useTable({ request: getCocTemplateList, searchForm: form })



// 将请求promise传给useTable
const handleModal = (open_type, item = {}) => {
	if (open_type === "add") {
		ModalTitle.value = $t("coc.coc_modal_add_title")
	} else if (open_type === "detail") {
		ModalTitle.value = $t("coc.coc_modal_view_title")
	} else if (open_type === "edit") {
		ModalTitle.value = $t("coc.coc_modal_edit_title")
	}
	openType.value = open_type
	rowId.value = item.id || null
	visible.value = true
}
const handleDelete = (item) => {
	deleteCocTemplate({ id: item.id }).then(() => {
		$message.success($t("coc.coc_delete_success"))
		// 刷新列表
		getTableData()
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

<style lang="less" scoped></style>
