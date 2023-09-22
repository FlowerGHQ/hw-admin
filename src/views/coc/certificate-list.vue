<template>
	<div class="distributor-coc-list">
		<div class="list-container">
			<div class="title-container">
				<div class="title-area">
					{{ $t("certificate-list.coc_certificateList") }}
				</div>
				<div class="btns-area">
					<a-button type="primary">{{
						$t("certificate-list.coc_batchDownload")
					}}</a-button>
				</div>
			</div>
			<!-- tabs -->
			<div class="tabs-container colorful cancel-m-b">
				<a-tabs v-model:activeKey="activeKey" @change="handleTabs">
					<a-tab-pane v-for="item of tab_type" :key="item.key">
						<template #tab> {{ item[$i18n.locale] }}(300) </template>
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
			<!-- table -->
			<div class="table-container">
				<a-table
					:row-key="(record) => record.id"
					:columns="palrformTableColumns"
					:data-source="palrformTableData"
					:pagination="channelPagination"
					@change="handleTableChange"
				>
					<template #headerCell="{ title }">
						{{ $t(title) }}
					</template>
					<template #bodyCell="{ column, text, record }">
						<template v-if="column.key === 'coc_operation'">
							<a-button
								type="link"
								@click="onDownLoad"
								:disabled="record.certificate_status !== 1"
								>{{ $t("certificate-list.coc_download") }}</a-button
							>
							<a-button type="link" @click="onView">{{
								$t("certificate-list.coc_view")
							}}</a-button>
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
	</div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import Core from "@/core"
import TimeSearch from "@/components/common/TimeSearch.vue"
const { proxy } = getCurrentInstance()
const COC = Core.Const.COC
const { $t } = proxy
const { TAB_TYPE } = COC
// 获取路由参数
const route = useRoute()
const { query } = route
const { isDistributor, order_number } = query
const distributor = ref(isDistributor === "true") // 是否是经销商
const { getCertificateDetailList } = Core.Api.COC
const activeKey = ref(undefined) // tab切换
const searchForm = reactive({
	certificate_status: 0,
	delivery_end_time: "",
	delivery_start_time: "",
	motor_uid: "",
	order_number: "",
	vehicle_uid: "",
})
const palrformTableData = ref([])
let channelPagination = reactive({
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
	console.log("channelPagination", channelPagination)
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
const tab_type = computed(() => {
	// 过滤
	return Object.values(TAB_TYPE).filter((item) => item.key !== 2)
})
const handleReset = () => {
	searchForm.certificate_status = 0
	searchForm.delivery_end_time = ""
	searchForm.delivery_start_time = ""
	searchForm.motor_uid = ""
	searchForm.order_number = route.query.order_number
	searchForm.vehicle_uid = ""
	channelPagination.page = 1
	channelPagination.pageSize = 20
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

// const fetchs = (params = {}) => {
// 	let obj = {
// 		...params,
// 	}
// 	Core.Api.XXX(obj)
// 		.then((res) => {
// 			Core.Logger.success("参数", obj, "结果", res)
// 		})
// 		.catch((err) => {
// 			Core.Logger.error("参数", obj, "结果", err)
// 		})
// }
const onDownLoad = () => {}
const onView = () => {}
const onDeliveryTime = (params) => {
	searchForm.delivery_start_time = params.begin_time
	searchForm.delivery_end_time = params.end_time
}

onMounted(() => {
	searchForm.order_number = order_number
	let params = Core.Util.deepCopy(searchForm)
	getCerList(params)
})
</script>

<style lang="less" scoped>
.distributor-coc-list {
	.btn-area {
		justify-content: flex-end;
	}
}
.cancel-m-b {
	margin-bottom: 0;
}
</style>
