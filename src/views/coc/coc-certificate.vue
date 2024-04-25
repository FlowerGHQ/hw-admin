<template>
    <div class="coc-certificate">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">
                    {{
                        isChangeTable
                            ? $t('certificate-list.coc_certificateList')
                            : $t('coc_business.coc_certificate_list')
                    }}
                </div>
            </div>
            <!-- tabs -->
            <div class="tabs-container colorful cancel-m-b" v-if="roles['SALESMAN'] || roles['SUPER_ADMIN']">
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
                        <div class="key">{{ $t('coc_business.coc_order_number') }}：</div>
                        <div class="value">
                            <a-input
                                v-model:value="searchForm.order_number"
                                :placeholder="$t('coc_business.coc_placeholder_order_number')"
                            ></a-input>
                        </div>
                    </a-col>
                    <!-- 车架号 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                        <div class="key">{{ $t('coc_business.coc_vin') }}：</div>
                        <div class="value">
                            <a-input
                                v-model:value="searchForm.vehicle_uid"
                                :placeholder="$t('coc_business.coc_placeholder_vin')"
                            ></a-input>
                        </div>
                    </a-col>
                    <!-- 下单时间 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                        <div class="key">{{ $t('coc_business.coc_order_time') }}：</div>
                        <div class="value">
                            <TimeSearch @search="onPlaceOrderTime" ref="oderTimeRef" />
                        </div>
                    </a-col>
                    <!-- 发货时间 -->
                    <!-- <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
						<div class="key">{{ $t("coc_business.coc_delivery_time") }}：</div>
						<div class="value">
							<TimeSearch @search="onDeliveryTime" />
						</div>
					</a-col> -->
                    <!-- 按钮 -->
                    <a-col :xs="24" :sm="24" :xl="24" :xxl="6" class="row-item btn-area">
                        <a-button @click="handleReset">{{ $t('coc_business.coc_reset') }}</a-button>
                        <a-button type="primary" @click="handleSearch">{{ $t('coc_business.coc_search') }}</a-button>
                    </a-col>
                </a-row>
            </div>
            <div class="btns-area title-container">
                <a-button type="primary" @click="batchDownload">{{
                    $t('certificate-list.coc_batchDownload')
                }}</a-button>
                <a-button type="primary" @click="allGenerated" v-if="!isChangeTable && !roles.DISTRIBUTOR">{{
                    $t('certificate-list.coc_allGenerated')
                }}</a-button>
            </div>
            <!-- table -->
            <div class="table-container">
                <a-table
                    :row-key="record => record.id"
                    :columns="!isChangeTable ? fiflterColumns : fiflterColumns_certificate"
                    :data-source="palrformTableData"
                    :pagination="channelPagination"
                    :loading="loading"
                    :scroll="{ x: true }"
                    @change="handleTableChange"
                    :row-selection="{
                        selectedRowKeys: selectedRowKeyArr,
                        onChange: onSelectChange,
                        getCheckboxProps: record => ({
                            disabled: record.certificate_status !== 1,
                        }),
                    }"
                >
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <!-- 订单号 -->
                        <template v-if="column.key === 'order_number'">
                            <a-button
                                type="link"
                                block
                                @click="goToDetail(record)"
                                :style="{
                                    justifyContent: 'flex-start',
                                }"
                                >{{ record.order_number }}</a-button
                            >
                        </template>
                        <template v-if="column.key === 'operation'">
                            <div v-if="record.certificate_status !== 3">
                                <a-button
                                    type="link"
                                    @click="onDownLoad(record)"
                                    :disabled="record.certificate_status !== 1"
                                    >{{ $t('coc_business.coc_download') }}</a-button
                                >
                                <a-button type="link" @click="onView(record)">{{
                                    $t('coc_business.coc_certificate_inventory')
                                }}</a-button>
                                <!-- 重新生成 -->
                                <a-button v-if="!roles.DISTRIBUTOR" type="link" @click="reRenerate(record)" danger>{{
                                    $t('coc_business.coc_re_generate')
                                }}</a-button>
                            </div>
                            <span v-else>--</span>
                        </template>
                        <template v-else-if="column.key === 'coc_operation'">
                            <a-button
                                type="link"
                                @click="onDownLoad(record)"
                                :disabled="record.certificate_status !== 1"
                                >{{ $t('certificate-list.coc_download') }}</a-button
                            >
                            <a-button
                                type="link"
                                @click="onCoCView(record)"
                                :disabled="record.certificate_status !== 1"
                                >{{ $t('certificate-list.coc_view') }}</a-button
                            >
                            <!-- 重新生成 -->
                            <a-button
                                type="link"
                                @click="reRenerate(record)"
                                danger
                                v-if="record.regenerate_flag == '1'"
                                >{{ $t('coc_business.coc_re_generate') }}</a-button
                            >
                        </template>
                        <!-- 状态 -->
                        <template v-else-if="column.key === 'certificate_status'">
                            <!-- tag -->
                            <a-tag
                                :style="{
                                    color: COC.TAB_TYPE[record.certificate_status].color + `!important`,
                                    backgroundColor: '#fff',
                                    border: '1px solid ' + COC.TAB_TYPE[record.certificate_status].color,
                                    fontWeight: '600',
                                }"
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
                        <template v-else-if="column.key === 'flag_show'">
                            <!-- switch -->
                            <a-switch v-model:checked="record.flag_show" @change="handleSwitch(record)" />
                        </template>
                        <template v-else-if="column.key === 'last_generation_time'">
                            <span>{{ Util.timeFormat(record.last_generation_time) }}</span>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, computed } from 'vue';
import Core from '@/core';
import TimeSearch from '@/components/common/TimeSearch.vue';
import { useI18n } from 'vue-i18n';
import fileSave from '@/core/fileSave';
import { useRouter } from 'vue-router';
const { proxy } = getCurrentInstance();
const router = useRouter();
const COC = Core.Const.COC;
const Util = Core.Util;
const { $message } = proxy;
const $t = useI18n().t;
const { getCertificateList, downLoadCertificateDetailLis, setCertificateVisible, regenerateFile } = Core.Api.COC;
const { FILE_URL_PREFIX } = Core.Const.NET;

const roles = reactive({
    DISTRIBUTOR: Core.Data.getLoginType() === Core.Const.USER.TYPE.DISTRIBUTOR,
    SUPER_ADMIN: Core.Data.getManager(),
    // 业务员
    SALESMAN: !Core.Data.getManager() && Core.Data.getLoginType() !== Core.Const.USER.TYPE.DISTRIBUTOR,
});

// 定义变量
const palrformTableColumns = ref([
    {
        title: 'coc_business.coc_order_number',
        dataIndex: 'order_number',
        key: 'order_number',
        roles: ['SUPER_ADMIN', 'SALESMAN', 'DISTRIBUTOR'],
    },
    {
        title: 'coc_business.coc_certificate_status',
        dataIndex: 'certificate_status',
        key: 'certificate_status',
        roles: ['SUPER_ADMIN', 'SALESMAN'],
    },
    {
        title: 'coc_business.coc_order_time',
        dataIndex: 'order_time',
        key: 'order_time',
        roles: ['SUPER_ADMIN', 'SALESMAN', 'DISTRIBUTOR'],
    },
    {
        title: 'coc_business.coc_delivery_time',
        dataIndex: 'delivery_time',
        key: 'delivery_time',
        roles: ['SUPER_ADMIN', 'SALESMAN', 'DISTRIBUTOR'],
    },
    {
        title: 'coc_business.coc_download_times',
        dataIndex: 'download_number',
        key: 'download_number',
        roles: ['SUPER_ADMIN', 'SALESMAN'],
    },
    {
        title: 'coc_business.coc_client_download_times',
        dataIndex: 'download_number',
        key: 'download_number',
        roles: ['DISTRIBUTOR'],
    },
    {
        title: 'coc_business.coc_customer_visible',
        dataIndex: 'flag_show',
        key: 'flag_show',
        roles: ['SALESMAN'],
    },
    {
        title: 'coc_business.coc_newest_generated_time',
        dataIndex: 'last_generation_time',
        key: 'last_generation_time',
        roles: ['SUPER_ADMIN', 'DISTRIBUTOR'],
    },
    {
        title: 'coc_business.coc_operation',
        dataIndex: 'operation',
        key: 'operation',
        roles: ['SUPER_ADMIN', 'SALESMAN', 'DISTRIBUTOR'],
    },
]);
const palrformTableColumns_certificate = ref([
    {
        title: 'certificate-list.coc_orderNumber',
        dataIndex: 'order_number',
        key: 'order_number',
        roles: ['SUPER_ADMIN', 'SALESMAN', 'DISTRIBUTOR'],
    },
    {
        title: 'certificate-list.coc_vehicleName',
        dataIndex: 'model_name',
        key: 'model_name',
        roles: ['SUPER_ADMIN', 'SALESMAN', 'DISTRIBUTOR'],
    },
    {
        title: 'certificate-list.coc_vehicleCode',
        dataIndex: 'model_number',
        key: 'model_number',
        roles: ['SUPER_ADMIN', 'SALESMAN', 'DISTRIBUTOR'],
    },
    {
        title: 'certificate-list.coc_vin',
        dataIndex: 'vehicle_uid',
        key: 'vehicle_uid',
        roles: ['SUPER_ADMIN', 'SALESMAN', 'DISTRIBUTOR'],
    },
    {
        title: 'certificate-list.coc_motor',
        dataIndex: 'motor_uid',
        key: 'motor_uid',
        roles: ['SUPER_ADMIN', 'SALESMAN', 'DISTRIBUTOR'],
    },
    {
        title: 'certificate-list.coc_cocStatus',
        dataIndex: 'certificate_status',
        key: 'certificate_status',
        roles: ['SUPER_ADMIN', 'SALESMAN'],
    },
    {
        title: 'certificate-list.coc_orderTime',
        dataIndex: 'order_time',
        key: 'order_time',
        roles: ['SUPER_ADMIN', 'SALESMAN', 'DISTRIBUTOR'],
    },
    {
        title: 'certificate-list.coc_deliveryTime',
        dataIndex: 'delivery_time',
        key: 'delivery_time',
        roles: ['SUPER_ADMIN', 'SALESMAN', 'DISTRIBUTOR'],
    },
    {
        title: 'certificate-list.coc_downloadTimes',
        dataIndex: 'download_number',
        key: 'download_number',
        roles: ['SUPER_ADMIN', 'SALESMAN', 'DISTRIBUTOR'],
    },
    {
        title: 'certificate-list.coc_operation',
        dataIndex: ' ',
        key: 'coc_operation',
        roles: ['SUPER_ADMIN', 'SALESMAN', 'DISTRIBUTOR'],
    },
]);
const palrformTableData = ref([]);
let channelPagination = reactive({
    current: 1,
    page: 1,
    pageSizeOptions: ['20', '40', '60', '80', '100'],
    pageSize: 20,
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 是否可以改变 pageSize
    total: 0,
    showTotal: total => `${proxy.$t('n.all_total')} ${total} ${proxy.$t('in.total')}`,
});
const activeKey = ref(undefined); // tab切换
const searchForm = ref({});
const selectedRowKeyArr = ref([]); // 选中的哪些项
const loading = ref(false);
const oderTimeRef = ref(null);
// 是否切换table
const isChangeTable = ref(false);
/* computed */
const fiflterColumns = computed(() => {
    // 查看roles谁为真，就返回谁
    let role = Object.keys(roles).filter(item => roles[item])[0];
    console.log('role', role);
    let arr = [];
    arr = palrformTableColumns.value.filter(item => {
        return item.roles.includes(role);
    });
    return arr;
});
const fiflterColumns_certificate = computed(() => {
    // 查看roles谁为真，就返回谁
    let role = Object.keys(roles).filter(item => roles[item])[0];
    console.log('role', role);
    let arr = [];
    arr = palrformTableColumns_certificate.value.filter(item => {
        return item.roles.includes(role);
    });
    return arr;
});

// 请求证书列表
const certificateList = () => {
    loading.value = true;
    let pagination = {
        page: channelPagination.page,
        page_size: channelPagination.pageSize,
    };
    let params = Object.assign({}, pagination, searchForm.value);
    console.log('params', params);
    getCertificateList(params)
        .then(res => {
            channelPagination.total = res.count;
            palrformTableData.value = res.list;
            palrformTableData.value.forEach(item => {
                return (item.flag_show = item.flag_show === 1 ? true : false);
            });
            loading.value = false;
        })
        .catch(err => {
            $message.error(err.message);
        })
        .finally(() => {
            loading.value = false;
        });
};
const handleSearch = () => {
    let params = {
        ...searchForm.value,
    };
    // 判断是否存在状态判断，如果存在就赋值
    if (activeKey.value) {
        console.log('activeKey', activeKey);
        params.certificate_status = activeKey.value;
    }
    console.log('params', params);
    // 查看是否存在
    if (params.vehicle_uid) {
        isChangeTable.value = true;
    }
    certificateList(params);
};
const handleReset = () => {
    searchForm.value = {
        certificate_status: activeKey.value,
    };
    oderTimeRef.value.handleReset();
    channelPagination.page = 1;
    channelPagination.current = 1;
    channelPagination.pageSize = 20;
    isChangeTable.value = false;
    handleSearch();
};
const reRenerate = record => {
    let params = {
        all_generated_flag: 0,
        source_type: !isChangeTable.value ? 1 : 2,
        target_id: record.id,
    };
    regenerateFile(params).then(() => {
        certificateList();
        $message.success($t('coc.coc_generate_success'));
    });
};
const allGenerated = () => {
    let params = {
        all_generated_flag: 1,
        source_type: 1,
        target_id: '',
    };
    regenerateFile(params).then(res => {
        handleReset();
        certificateList();
        $message.success($t('coc.coc_generate_success'));
    });
};
// table chang 分页事件
const handleTableChange = (pagination, filters, sorter) => {
    channelPagination.page = pagination.current;
    channelPagination.current = pagination.current;
    channelPagination.pageSize = pagination.pageSize;
    if (pagination.pageSize !== channelPagination.pageSize) {
        channelPagination.page = 1;
        channelPagination.current = 1;
        channelPagination.pageSize = pagination.pageSize;
    }
    certificateList();
};
const handleSwitch = record => {
    let isOpen = record.flag_show;
    let params = {
        order_number: record.order_number,
        flag_show: isOpen ? 1 : 0,
    };
    setCertificateVisible(params)
        .then(res => {
            // 重新请求列表
            certificateList();
        })
        .catch(err => {
            Core.Logger.error('参数', params, '结果', err);
        });
};
const handleTabs = () => {
    searchForm.value.certificate_status = activeKey.value;
    certificateList();
};
// 选中项的事件
const onSelectChange = selectedRowKeys => {
    // 注意selectedRowKeyArr尽量不要跟上面selectedRowKeys名称一样
    Core.Logger.log('selectedRowKeys changed: ', selectedRowKeys);
    selectedRowKeyArr.value = selectedRowKeys;
};

const batchDownload = () => {
    console.log('selectedRowKeyArr', selectedRowKeyArr);
    onDownLoad({}, selectedRowKeyArr.value);
};
// 下载
const onDownLoad = (record, array) => {
    let list = record?.id ? [record.id] : selectedRowKeyArr.value;
    downLoadCertificateDetailLis({
        download_list: list,
        // source_type: Core.Const.COC.DOWN_LOAD_TYPE[1].key,
        source_type: !isChangeTable.value ? 1 : 2,
    })
        .then(res => {
            // const str = 'xxxxfile-name=example.txt';
            let str = decodeURIComponent(res.headers['file-name']);
            // 正则匹配attachment;filename=证书导出.zip 取出文件名和拓展名
            let fileName = str.match(/filename=(.*)/)[1].split('.')[0] || '未命名';
            let extension = str.match(/filename=(.*)/)[1].split('.')[1] || 'docx';
            fileSave.getFile(res.data, `${fileName}.${extension}`);
        })
        .catch(err => {
            console.log('err', err);
            Core.Logger.error('参数', {}, '结果', JSON.stringify(err));
        });
};

const goToDetail = record => {
    router.push({
        path: `/distributor/purchase-order-detail`,
        query: {
            id: record.id,
        },
    });
};

// 查看
const onView = record => {
    let isDistributor = Core.Data.getLoginType() === Core.Const.USER.TYPE.DISTRIBUTOR;
    router.push({
        path: `/coc/certificate-list`,
        query: {
            isDistributor: isDistributor,
            order_number: record.order_number,
            id: record.id,
        },
    });
};
// 清单列表数据的查看
const onCoCView = record => {
    let url = 'http://view.officeapps.live.com/op/view.aspx?src=' + FILE_URL_PREFIX + record.file_url;
    window.open(url, '_blank');
};
// 下单时间
const onPlaceOrderTime = params => {
    Core.Logger.log('下单时间', params);
    searchForm.value.order_start_time = params.begin_time;
    searchForm.value.order_end_time = params.end_time;
};

onMounted(() => {
    certificateList();
});
</script>

<style lang="less" scoped>
// 获取minxin
.coc-certificate {
    .btn-area {
        .fj(flex-end);
    }
}
.cancel-m-b {
    margin-bottom: 0;
}
</style>
