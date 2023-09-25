<template>
	<div class="distributor-coc-list">
		<div class="list-container">
			<div class="title-container">
				<div class="title-area">
					{{ $t("certificate-list.coc_certificateList") }}
				</div>
			</div>
			<!-- tabs -->
			<div class="tabs-container colorful cancel-m-b" v-if="!distributor">
				<a-tabs v-model:activeKey="activeKey" @change="handleTabs">
					<a-tab-pane v-for="item of tab_type" :key="item.key">
						<template #tab>
							{{ item[$i18n.locale] }}({{ numberForm[item.key].number }})
						</template>
					</a-tab-pane>
				</a-tabs>
			</div>
			<!-- search -->
			<div class="search">
				<a-row class="row-detail">
					<a-col :xs="24" :sm="24" :xl="8" :xxl="7" class="row-item">
						<div class="key">{{ $t("certificate-list.coc_vin") }}：</div>
						<div class="value">
							<a-input
								v-model:value="searchForm.vehicle_uid"
								:placeholder="$t('certificate-list.coc_inputVin')"
							></a-input>
						</div>
					</a-col>
					<a-col :xs="24" :sm="24" :xl="8" :xxl="7" class="row-item">
						<div class="key">{{ $t("certificate-list.coc_motor") }}：</div>
						<div class="value">
							<a-input
								v-model:value="searchForm.motor_uid"
								:placeholder="$t('certificate-list.coc_inputMotor')"
							></a-input>
						</div>
					</a-col>
					<a-col :xs="24" :sm="24" :xl="8" :xxl="7" class="row-item">
						<div class="key">
							{{ $t("certificate-list.coc_deliveryDate") }}：
						</div>
						<div class="value">
							<TimeSearch @search="onDeliveryTime" />
						</div>
					</a-col>
					<!-- 按钮 -->
					<a-col :xs="24" :sm="24" :xl="8" :xxl="3" class="row-item btn-area">
						<a-button @click="handleReset">{{
							$t("certificate-list.coc_reset")
						}}</a-button>
						<a-button type="primary" @click="handleSearch">{{
							$t("certificate-list.coc_search")
						}}</a-button>
					</a-col>
				</a-row>
			</div>
			<div class="btns-area title-container">
				<a-button type="primary" @click="batchDownload">{{
					$t("certificate-list.coc_batchDownload")
				}}</a-button>
			</div>
			<!-- table -->
			<div class="table-container">
				<a-table
					:row-key="(record) => record.id"
					:columns="palrformTableColumns"
					:data-source="palrformTableData"
					:pagination="channelPagination"
					@change="handleTableChange"
					:row-selection="{
						selectedRowKeys: selectedRowKeyArr,
						onChange: onSelectChange,
						getCheckboxProps: (record) => ({
							disabled: record.certificate_status !== 1,
						}),
					}"
				>
					<template #headerCell="{ title }">
						{{ $t(title) }}
					</template>
					<template #bodyCell="{ column, text, record }">
						<template v-if="column.key === 'coc_operation'">
							<a-button
								type="link"
								@click="onDownLoad(record)"
								:disabled="record.certificate_status !== 1"
								>{{ $t("certificate-list.coc_download") }}</a-button
							>
							<a-button
								type="link"
								@click="onView(record)"
								:disabled="record.certificate_status !== 1"
								>{{ $t("certificate-list.coc_view") }}</a-button
							>
						</template>
						<template v-else-if="column.key === 'order_time'">
							<span>{{ Util.timeFormat(record.order_time) }}</span>
						</template>
						<template v-else-if="column.key === 'delivery_time'">
							<span>{{ Util.timeFormat(record.delivery_time) }}</span>
						</template>
						<!-- 状态 -->
						<template
							v-else-if="column.key === 'certificate_status' && !distributor"
						>
							<!-- tag -->
							<a-tag :color="COC.TAB_TYPE[record.certificate_status].color">
								{{ COC.TAB_TYPE[record.certificate_status][$i18n.locale] }}
							</a-tag>
						</template>
					</template>
				</a-table>
			</div>
		</div>
		<!-- 文档预览'doc-common', 'doc-wrap' -->
		<div :class="{ 'doc-common': !docHidden, 'doc-wrap': docHidden }">
			<close-outlined
				class="close-btn"
				@click="
					() => {
						docHidden = false
					}
				"
			/>
			<!-- 预览文件的地方（用于渲染） -->
			<div ref="refFile"></div>
		</div>
	</div>
</template>

<script setup>
import {
	ref,
	reactive,
	getCurrentInstance,
	computed,
	onMounted,
	toRefs,
} from "vue"
import { useRoute } from "vue-router"
import Core from "@/core"
import TimeSearch from "@/components/common/TimeSearch.vue"
import { CloseOutlined } from "@ant-design/icons-vue"
import { renderAsync } from "docx-preview"
import fileSave from "@/core/fileSave"
const { proxy } = getCurrentInstance()
const COC = Core.Const.COC
const Util = Core.Util
const { $t } = proxy
const { TAB_TYPE } = COC
// 获取路由参数
const route = useRoute()
const { query } = route
const { isDistributor, order_number } = query
const distributor = ref(isDistributor === "true") // 是否是经销商
const {
	getCertificateDetailList,
	getCertificatNumber,
	downLoadCertificateDetailLis,
} = Core.Api.COC
const activeKey = ref(undefined) // tab切换
const selectedRowKeyArr = ref([]) // 选中的哪些项

const searchForm = reactive({
	certificate_status: 0,
	delivery_end_time: "",
	delivery_start_time: "",
	motor_uid: "",
	order_number: "",
	vehicle_uid: "",
})
const palrformTableData = ref([])
const numberForm = reactive({
	0: { number: 0 },
	1: { number: 0 },
	3: { number: 0 },
})
let channelPagination = reactive({
	current: 1,
	page: 1,
	pageSizeOptions: ["20", "40", "60", "80", "100"],
	pageSize: 20,
	showQuickJumper: true, // 是否可以快速跳转至某页
	showSizeChanger: true, // 是否可以改变 pageSize
	total: 0,
	showTotal: (total) =>
		`${proxy.$t("n.all_total")} ${total} ${proxy.$t("in.total")}`,
})
const palrformTableColumns = ref([
	{
		title: "certificate-list.coc_orderNumber",
		dataIndex: "order_number",
		key: "order_number",
	},
	{
		title: "certificate-list.coc_vehicleName",
		dataIndex: "model_name",
		key: "model_name",
	},
	{
		title: "certificate-list.coc_vehicleCode",
		dataIndex: "model_number",
		key: "model_number",
	},
	{
		title: "certificate-list.coc_vin",
		dataIndex: "vehicle_uid",
		key: "vehicle_uid",
	},
	{
		title: "certificate-list.coc_motor",
		dataIndex: "motor_uid",
		key: "motor_uid",
	},
	{
		title: "certificate-list.coc_cocStatus",
		dataIndex: "certificate_status",
		key: "certificate_status",
	},
	{
		title: "certificate-list.coc_orderTime",
		dataIndex: "order_time",
		key: "order_time",
	},
	{
		title: "certificate-list.coc_deliveryTime",
		dataIndex: "delivery_time",
		key: "delivery_time",
	},
	{
		title: "certificate-list.coc_downloadTimes",
		dataIndex: "download_number",
		key: "download_number",
	},
	{
		title: "certificate-list.coc_operation",
		dataIndex: "coc_operation",
		key: "coc_operation",
	},
])
// 获取列表
const getCerList = (from = {}) => {
	let params = {
		...from,
		...searchForm,
		page_size: channelPagination.pageSize,
		page: channelPagination.page,
	}
	getCertificateDetailList(params)
		.then((res) => {
			Core.Logger.success("参数", from, "结果", res)
			channelPagination.total = res.count
			palrformTableData.value = res.list
		})
		.catch((err) => {
			Core.Logger.error("参数", from, "结果", err)
		})
}
// 筛选type
const tab_type = computed(() => {
	// 过滤
	return Object.values(TAB_TYPE).filter((item) => item.key !== 2)
})
// 获取数量信息
const getAllNumer = () => {
	getCertificatNumber()
		.then((res) => {
			numberForm[0].number = res?.total_num || 0
			numberForm[1].number = res?.generated_num || 0
			numberForm[3].number = res?.ungenerated_num || 0
			console.log("numberForm", numberForm)
		})
		.catch((err) => {
			Core.Logger.error("参数", {}, "结果", err)
		})
}
const handleReset = () => {
	console.log("handleReset")
	searchForm.certificate_status = 0
	searchForm.delivery_end_time = ""
	searchForm.delivery_start_time = ""
	searchForm.motor_uid = ""
	searchForm.order_number = route.query.order_number
	searchForm.vehicle_uid = ""
	// 重置分页，数据更新但视图不更新，原因是因为reactive的原因，所以需要重新赋值，可以用toRefs解决

	const { page, pageSize, current } = toRefs(channelPagination)
	page.value = 1
	current.value = 1
	pageSize.value = 20
	getCerList()
}
const handleSearch = () => {
	let params = {
		...searchForm,
		certificate_status: activeKey.value,
	}
	getCerList(params)
}
const handleTableChange = (pagination, filters, sorter) => {
	channelPagination.page = pagination.current
	channelPagination.pageSize = pagination.pageSize
	channelPagination.current = pagination.current
	if (pagination.pageSize !== channelPagination.pageSize) {
		channelPagination.page = 1
		channelPagination.pageSize = pagination.pageSize
	}
	getCerList()
}
const handleTabs = () => {
	searchForm.certificate_status = activeKey.value
	getCerList()
}
// 选中项的事件
// 选中项的事件
const onSelectChange = (selectedRowKeys) => {
	// 注意selectedRowKeyArr尽量不要跟上面selectedRowKeys名称一样
	Core.Logger.log("selectedRowKeys changed: ", selectedRowKeys)
	selectedRowKeyArr.value = selectedRowKeys
}
// 批量下载
const batchDownload = () => {
	console.log("selectedRowKeyArr", selectedRowKeyArr)
	onDownLoad({}, selectedRowKeyArr.value)
}
// 下载
const onDownLoad = (record, array) => {
	let list = record?.id ? [record.id] : selectedRowKeyArr.value
	downLoadCertificateDetailLis({
		download_list: list,
		// source_type: Core.Const.COC.DOWN_LOAD_TYPE[1].key,
		source_type: 2,
	})
		.then((res) => {
			// const str = 'xxxxfile-name=example.txt';
			let str = decodeURIComponent(res.headers["file-name"])
			// 正则匹配attachment;filename=证书导出.zip 取出文件名和拓展名
			let fileName = str.match(/filename=(.*)/)[1].split(".")[0] || "未命名"
			let extension = str.match(/filename=(.*)/)[1].split(".")[1] || "docx"
			fileSave.getFile(res.data, `${fileName}.${extension}`)
		})
		.catch((err) => {
			console.log("err", err)
			Core.Logger.error("参数", {}, "结果", JSON.stringify(err))
		})
}
const refFile = ref(null)
const docHidden = ref(false)
// 查看文档
const onView = (record) => {
	let list = record?.id ? [record.id] : selectedRowKeyArr.value
	downLoadCertificateDetailLis({
		download_list: list,
		source_type: 2,
	}).then((res) => {
		const { data } = res
		renderAsync(data, refFile.value) // 渲染到页面
		docHidden.value = true
	})
}
const onDeliveryTime = (params) => {
	searchForm.delivery_start_time = params.begin_time
	searchForm.delivery_end_time = params.end_time
}
onMounted(() => {
	searchForm.order_number = order_number
	let params = Core.Util.deepCopy(searchForm)
	getCerList(params)
	console.log("distributor", distributor.value)
	if (!distributor.value) {
		getAllNumer()
	}
})
</script>

<style lang="less" scoped>
.distributor-coc-list {
	position: relative;
	.btn-area {
		justify-content: flex-end;
	}
	.doc-wrap {
		width: 100%;
		height: 100vh;
		position: absolute;
		top: 0;
		right: 0;
		z-index: 999;
	}
	.doc-common {
		display: none;
	}
	.close-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		font-size: 20px;
		cursor: pointer;
	}
}
.cancel-m-b {
	margin-bottom: 0;
}
</style>
