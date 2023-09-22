<template>
	<div class="distributor-coc-list">
		<div class="list-container">
			<div class="title-container">
				<div class="title-area">
					{{ $t("coc_business.coc_certificate_list") }}
				</div>
			</div>
			<!-- tabs -->
			<div class="tabs-container colorful cancel-m-b">
				<a-tabs v-model:activeKey="activeKey">
					<a-tab-pane v-for="item of COC.TAB_TYPE" :key="item.key">
						<template #tab>
							{{ item[$i18n.locale] }}
						</template>
					</a-tab-pane>
				</a-tabs>
			</div>
			<!-- search -->
			<div class="search">
				<a-row class="row-detail">
					<!-- 订单号 -->
					<a-col :xs="24" :sm="24" :xl="8" :xxl="7" class="row-item">
						<div class="key">{{ $t("coc_business.coc_order_number") }}：</div>
						<div class="value">
							<a-input
								v-model:value="searchForm.order_number"
								:placeholder="$t('coc_business.coc_placeholder_order_number')"
							></a-input>
						</div>
					</a-col>
					<a-col :xs="24" :sm="24" :xl="8" :xxl="7" class="row-item">
						<div class="key">{{ $t("certificate-list.coc_vin") }}：</div>
						<div class="value">
							<a-input
								v-model:value="searchForm.order_time"
								:placeholder="$t('certificate-list.coc_inputVin')"
							></a-input>
						</div>
					</a-col>
					<!-- 发货时间 -->
					<a-col :xs="24" :sm="24" :xl="8" :xxl="7" class="row-item">
						<div class="key">{{ $t("coc_business.coc_delivery_time") }}：</div>
						<div class="value">
							<TimeSearch @search="onDeliveryTime" />
						</div>
					</a-col>
					<!-- 按钮 -->
					<a-col :xs="24" :sm="24" :xl="8" :xxl="3" class="row-item btn-area">
						<a-button>{{ $t("coc_business.coc_reset") }}</a-button>
						<a-button type="primary">{{
							$t("coc_business.coc_search")
						}}</a-button>
					</a-col>
				</a-row>
			</div>
			<div class="title-container">
				<a-button type="primary">{{
					$t($t("coc_business.coc_batch_download"))
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
						selectedRowKeys: selectedRowKeys,
						onChange: onSelectChange,
					}"
				>
					<template #headerCell="{ title }">
						{{ $t(title) }}
					</template>
					<template #bodyCell="{ column, text, record }">
						<template v-if="column.key === 'operation'">
							<a-button type="link" @click="onDownLoad">{{
								$t("coc_business.coc_download")
							}}</a-button>
							<a-button type="link" @click="onView">{{
								$t("coc_business.coc_view")
							}}</a-button>
							<a-button type="link" @click="onCertificate">{{
								$t("coc_business.coc_certificate_inventory")
							}}</a-button>
						</template>
					</template>
				</a-table>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from "vue"
import Core from "@/core"
import TimeSearch from "@/components/common/TimeSearch.vue"
const { proxy } = getCurrentInstance()
const { $message } = proxy
import { useRouter } from "vue-router"
const router = useRouter()
const COC = Core.Const.COC
const {
	getCertificateList,
	getCertificateDetailList,
	downLoadCertificateDetailLis,
	setCertificateVisible,
} = Core.Api.COC

const palrformTableColumns = ref([
	{
		title: "coc_business.coc_order_number",
		dataIndex: "order_number",
		key: "order_number",
	},
	{
		title: "coc_business.coc_order_time",
		dataIndex: "order_time",
		key: "order_time",
	},
	{
		title: "coc_business.coc_delivery_time",
		dataIndex: "delivery_time",
		key: "delivery_time",
	},
	{
		title: "coc_business.coc_download_times",
		dataIndex: "download_number",
		key: "download_number",
	},
	{
		title: "coc_business.coc_operation",
		dataIndex: "operation",
		key: "operation",
	},
])
const palrformTableData = ref([
	{
		sn: "1234567890",
		status_type: "2",
		coc_order_time: "2021-08-09 12:00:00",
		coc_delivery_time: "2021-08-09 12:00:00",
		coc_customer_visible: true,
		coc_download_times: "100",
	},
	{
		sn: "1234567890",
		status_type: "3",
		coc_order_time: "2021-08-09 12:00:00",
		coc_delivery_time: "2021-08-09 12:00:00",
		coc_customer_visible: false,
		coc_download_times: "100",
	},
	{
		sn: "1234567890",
		status_type: "4",
		coc_order_time: "2021-08-09 12:00:00",
		coc_delivery_time: "2021-08-09 12:00:00",
		coc_customer_visible: true,
		coc_download_times: "100",
	},
])
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
const activeKey = ref(undefined) // tab切换
const searchForm = ref({})
// selectedRowKeys
const selectedRowKeys = ref([])
const onSelectChange = (selectedRowKeys) => {
	Core.Logger.log("selectedRowKeys changed: ", selectedRowKeys)
	selectedRowKeys = selectedRowKeys
}

const certificateList = (params) => {
	let pagination = {
		page: channelPagination.page,
		page_size: channelPagination.pageSize,
	}
	params = {
		...pagination,
		...params,
	}
	getCertificateList(params)
		.then((res) => {
			Core.Logger.success("参数", params, "结果", res)
		})
		.catch((err) => {
			Core.Logger.error("参数", params, "结果", err)
			$message.error(err.message)
		})
}

onMounted(() => {
	certificateList()
})

/* fetch start */
const fetchs = (params = {}) => {
	let obj = {
		...params,
	}
	Core.Api.XXX(obj)
		.then((res) => {
			Core.Logger.success("参数", obj, "结果", res)
		})
		.catch((err) => {
			Core.Logger.error("参数", obj, "结果", err)
		})
}

/* fetch end */

/* methods start */
// 下载
const onDownLoad = () => {}
// 查看
const onView = () => {
	router.push({
		path: "/coc/certificate-list",
	})
}
// 证书清单
const onCertificate = () => {}
// 下单时间
const onPlaceOrderTime = (params) => {
	Core.Logger.log("下单时间", params)
}
// 发货时间
const onDeliveryTime = (params) => {
	Core.Logger.log("发货时间", params)
	searchForm.value.delivery_start_time = params.begin_time
	searchForm.value.delivery_end_time = params.end_time
}
// table chang 分页事件
const handleTableChange = (pagination, filters, sorter) => {
	const pager = { ...channelPagination }
	pager.current = pagination.current
	if (pagination.pageSize !== channelPagination.pageSize) {
		pager.current = 1
		pager.pageSize = pagination.pageSize
	}
	channelPagination = pager
	fetchs({
		page_size: channelPagination.pageSize,
		page: channelPagination.page,
	})
}
/* methods end */
</script>

<style lang="less" scoped>
.distributor-coc-list {
	.btn-area {
		.fj(flex-end);
	}
}
.cancel-m-b {
	margin-bottom: 0;
}
</style>
