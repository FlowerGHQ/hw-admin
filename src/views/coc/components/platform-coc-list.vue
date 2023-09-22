<template>
	<div class="distributor-coc-list">
		<div class="list-container">
			<div class="title-container">
				<div class="title-area">
					{{ $t("coc_business.coc_certificate_list") }}
				</div>
				<div class="btns-area">
					<a-button type="primary" @click="batchDownload">{{
						$t($t("coc_business.coc_batch_download"))
					}}</a-button>
				</div>
			</div>
			<!-- tabs -->
			<div class="tabs-container colorful cancel-m-b">
				<a-tabs v-model:activeKey="activeKey" @change="handleTabs">
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
					<a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
						<div class="key">{{ $t("coc_business.coc_order_number") }}：</div>
						<div class="value">
							<a-input
								v-model:value="searchForm.order_number"
								:placeholder="$t('coc_business.coc_placeholder_order_number')"
							></a-input>
						</div>
					</a-col>
					<!-- 下单时间 -->
					<a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
						<div class="key">{{ $t("coc_business.coc_order_time") }}：</div>
						<div class="value">
							<TimeSearch @search="onPlaceOrderTime" />
						</div>
					</a-col>
					<!-- 发货时间 -->
					<a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
						<div class="key">{{ $t("coc_business.coc_delivery_time") }}：</div>
						<div class="value">
							<TimeSearch @search="onDeliveryTime" />
						</div>
					</a-col>
					<!-- 按钮 -->
					<a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item btn-area">
						<a-button @click="handleReset">{{
							$t("coc_business.coc_reset")
						}}</a-button>
						<a-button type="primary" @click="handleSearch">{{
							$t("coc_business.coc_search")
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
						<template v-if="column.key === 'operation'">
							<a-button
								type="link"
								@click="onDownLoad(record)"
								:disabled="record.certificate_status !== 1"
								>{{ $t("coc_business.coc_download") }}</a-button
							>
							<a-button type="link" @click="onView(record)">{{
								$t("coc_business.coc_certificate_inventory")
							}}</a-button>
						</template>
						<!-- 状态 -->
						<template v-else-if="column.key === 'certificate_status'">
							<!-- tag -->
							<a-tag
								:color="
									COC.TAB_TYPE[record.certificate_status]?.color || 'default'
								"
							>
								{{ COC.TAB_TYPE[record.certificate_status][$i18n.locale] }}
							</a-tag>
						</template>
						<template v-else-if="column.key === 'order_time'">
							<span>{{ Util.timeFormat(record.order_time) }}</span>
						</template>
						<template v-else-if="column.key === 'delivery_time'">
							<span>{{ Util.timeFormat(record.delivery_time) }}</span>
						</template>
						<!-- 客户是否可见 -->
						<template v-else-if="column.key === 'visible_flag'">
							<!-- switch -->
							<a-switch
								v-model:checked="record.visible_flag"
								@change="handleSwitch(record)"
							/>
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
import fileSave from "@/core/fileSave"
import { useRouter } from "vue-router"
const router = useRouter()
const COC = Core.Const.COC
const Util = Core.Util
const { $message, $t } = proxy
const {
	getCertificateList,
	downLoadCertificateDetailLis,
	setCertificateVisible,
} = Core.Api.COC

console.log(
	"是不是分销商:",
	Core.Data.getLoginType() === Core.Const.USER.TYPE.DISTRIBUTOR,
	"是不是管理员：",
	Core.Data.getManager()
)
// 定义变量
const palrformTableColumns = ref([
	{
		title: "coc_business.coc_order_number",
		dataIndex: "order_number",
		key: "order_number",
	},
	{
		title: "coc_business.coc_certificate_status",
		dataIndex: "certificate_status",
		key: "certificate_status",
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
		title: "coc_business.coc_customer_visible",
		dataIndex: "visible_flag",
		key: "visible_flag",
	},
	{
		title: "coc_business.coc_operation",
		dataIndex: "operation",
		key: "operation",
	},
])
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
const activeKey = ref(undefined) // tab切换
const searchForm = ref({})
const selectedRowKeyArr = ref([]) // 选中的哪些项
/* fetch start */

// 请求证书列表
const certificateList = () => {
	let pagination = {
		page: channelPagination.page,
		page_size: channelPagination.pageSize,
	}
	let params = Object.assign({}, pagination, searchForm.value)
	getCertificateList(params)
		.then((res) => {
			channelPagination.total = res.count
			palrformTableData.value = res.list
			palrformTableData.value.forEach((item) => {
				return (item.visible_flag = item.visible_flag === 1 ? true : false)
			})
			console.log("palrformTableData", palrformTableData)
			// Core.Logger.success("参数", searchForm, "结果", res)
		})
		.catch((err) => {
			Core.Logger.error("参数", searchForm, "结果", err)
			$message.error(err.message)
		})
}
const handleSearch = () => {
	let params = {
		...searchForm.value,
		certificate_status: activeKey.value,
	}
	certificateList(params)
}
const handleReset = () => {
	searchForm.value = {}
	activeKey.value = 0
	channelPagination.page = 1
	channelPagination.pageSize = 20
	certificateList()
}
// table chang 分页事件
const handleTableChange = (pagination, filters, sorter) => {
	channelPagination.page = pagination.current
	if (pagination.pageSize !== channelPagination.pageSize) {
		channelPagination.page = 1
		channelPagination.pageSize = pagination.pageSize
	}
	certificateList()
}
const handleSwitch = (record) => {
	let isOpen = record.visible_flag
	let params = {
		order_number: record.order_number,
		visible_flag: isOpen ? 1 : 0,
	}
	setCertificateVisible(params)
		.then((res) => {
			Core.Logger.success("参数", params, "结果", res)
			// 重新请求列表
			certificateList()
		})
		.catch((err) => {
			Core.Logger.error("参数", params, "结果", err)
		})
}
const handleTabs = () => {
	searchForm.value.certificate_status = activeKey.value
	certificateList()
}
// 选中项的事件
const onSelectChange = (selectedRowKeys) => {
	// 注意selectedRowKeyArr尽量不要跟上面selectedRowKeys名称一样
	Core.Logger.log("selectedRowKeys changed: ", selectedRowKeys)
	selectedRowKeyArr.value = selectedRowKeys
}

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
		source_type: 1,
	})
		.then((res) => {
			const name = res.headers["file-name"]
				? decodeURIComponent(res.headers["file-name"].split("filename=")[1])
				: "未命名"
			fileSave.getZip(res.data, name)
		})
		.catch((err) => {
			console.log("err", err)
			Core.Logger.error("参数", {}, "结果", JSON.stringify(err))
		})
}

onMounted(() => {
	certificateList()
})

// 查看
const onView = (record) => {
	let isDistributor =
		Core.Data.getLoginType() === Core.Const.USER.TYPE.DISTRIBUTOR
	router.push({
		path: `/coc/certificate-list`,
		query: {
			isDistributor: isDistributor,
			order_number: record.order_number,
		},
	})
}
// 下单时间
const onPlaceOrderTime = (params) => {
	Core.Logger.log("下单时间", params)
	searchForm.value.order_start_time = params.begin_time
	searchForm.value.order_end_time = params.end_time
}
// 发货时间
const onDeliveryTime = (params) => {
	Core.Logger.log("发货时间", params)
	searchForm.value.delivery_start_time = params.begin_time
	searchForm.value.delivery_end_time = params.end_time
}

/* methods end */
</script>

<style lang="less" scoped>
// 获取minxin
.distributor-coc-list {
	.btn-area {
		.fj(flex-end);
	}
}
.cancel-m-b {
	margin-bottom: 0;
}
</style>
