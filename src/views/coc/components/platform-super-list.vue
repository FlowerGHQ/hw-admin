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
				>
					<template #headerCell="{ title }">
						{{ $t(title) }}
					</template>
					<template #bodyCell="{ column, text, record }">
						<template v-if="column.key === 'coc_validity_date'">
							<span>
								{{ record.coc_validity_date[0] }} ~
								{{ record.coc_validity_date[1] }}
							</span>
						</template>
						<template v-if="column.key === 'coc_operation'">
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
					v-model:current="currPage"
					:page-size="pageSize"
					:total="total"
					show-quick-jumper
					show-size-changer
					show-less-items
					:show-total="
						(total) => $t('n.all_total') + ` ${total} ` + $t('in.total')
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
			v-model:visible="visible"
		/>
	</div>
</template>

<script setup>
import { useTable } from "../hooks/useTable"
import EditModal from "./template-modal.vue"
import { ref, getCurrentInstance } from "vue"
const { ctx } = getCurrentInstance()
const { $t } = ctx.$root
const ModalTitle = ref("")
const visible = ref(false)

const handleModal = (type, item = {}) => {
	if (type === "add") {
		ModalTitle.value = $t("coc.coc_modal_add_title")
	} else if (type === "detail") {
		ModalTitle.value = $t("coc.coc_modal_view_title")
	} else if (type === "edit") {
		ModalTitle.value = $t("coc.coc_modal_edit_title")
	}
	visible.value = true
}
const handleDelete = (item) => {
	console.log(item)
}

const {
	tableData,
	tableColumns,
	pageChange,
	pageSizeChange,
	currPage,
	pageSize,
	total,
} = useTable()
</script>

<style lang="less" scoped></style>
