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
				<a-tabs v-model:activeKey="activeKey">
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
								v-model:value="searchForm.sn"
								:placeholder="$t('certificate-list.coc_inputVin')"
							></a-input>
						</div>
					</a-col>
					<a-col :xs="24" :sm="24" :xl="8" :xxl="7" class="row-item">
						<div class="key">{{ $t("certificate-list.coc_motor") }}：</div>
						<div class="value">
							<a-input
								v-model:value="searchForm.sn"
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
						<a-button>{{ $t("certificate-list.coc_reset") }}</a-button>
						<a-button type="primary">{{
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
							<a-button type="link" @click="onDownLoad">{{
								$t("certificate-list.coc_download")
							}}</a-button>
							<a-button type="link" @click="onView">{{
								$t("certificate-list.coc_view")
							}}</a-button>
						</template>
						<!-- 状态 -->
						<template v-else-if="column.key === 'coc_cocStatus'">
							<!-- tag -->
							<a-tag :color="COC.TAB_TYPE[record.coc_cocStatus].color">
								{{ COC.TAB_TYPE[record.coc_cocStatus][$i18n.locale] }}
							</a-tag>
						</template>
					</template>
				</a-table>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, computed } from "vue"
import Core from "@/core"
import TimeSearch from "@/components/common/TimeSearch.vue"
const { proxy } = getCurrentInstance()
const COC = Core.Const.COC
const $t = proxy.$root.$t
const { TAB_TYPE } = COC

const tab_type = computed(() => {
	// 过滤
	return Object.values(TAB_TYPE).filter((item) => item.key !== 3)
})

const palrformTableColumns = ref([
	{
		title: "certificate-list.coc_orderNumber",
		dataIndex: "coc_orderNumber",
		key: "coc_orderNumber",
	},
	{
		title: "certificate-list.coc_vehicleName",
		dataIndex: "coc_vehicleName",
		key: "coc_vehicleName",
	},
	{
		title: "certificate-list.coc_vehicleCode",
		dataIndex: "coc_vehicleCode",
		key: "coc_vehicleCode",
	},
	{
		title: "certificate-list.coc_vin",
		dataIndex: "coc_vin",
		key: "coc_vin",
	},
	{
		title: "certificate-list.coc_motor",
		dataIndex: "coc_vin",
		key: "coc_vin",
	},
	{
		title: "certificate-list.coc_cocStatus",
		dataIndex: "coc_cocStatus",
		key: "coc_cocStatus",
	},
	{
		title: "certificate-list.coc_orderTime",
		dataIndex: "coc_orderTime",
		key: "coc_orderTime",
	},
	{
		title: "certificate-list.coc_deliveryTime",
		dataIndex: "coc_deliveryTime",
		key: "coc_deliveryTime",
	},
	{
		title: "certificate-list.coc_downloadTimes",
		dataIndex: "coc_downloadTimes",
		key: "coc_downloadTimes",
	},
	{
		title: "certificate-list.coc_operation",
		dataIndex: "coc_operation",
		key: "coc_operation",
	},
])
const palrformTableData = ref([
	{
		id: 1,
		coc_orderNumber: "202107010001",
		coc_vehicleName: "2021款 2.0T 两驱 豪华版",
		coc_vehicleCode: "202107010001",
		coc_vin: "LJ1F3A1M1M000001",
		coc_motor: "LJ1F3A1M1M000001",
		coc_cocStatus: 2,
		coc_orderTime: "2021-07-01 12:00:00",
		coc_deliveryTime: "2021-07-01 12:00:00",
		coc_downloadTimes: 100,
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
const searchForm = ref({
	sn: "",
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
const onView = () => {}
// 下单时间
const onPlaceOrderTime = (params) => {
	Core.Logger.log("下单时间", params)
}
// 发货时间
const onDeliveryTime = (params) => {
	Core.Logger.log("发货时间", params)
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
		justify-content: flex-end;
	}
}
.cancel-m-b {
	margin-bottom: 0;
}
</style>
