<template>
    <div class="distributor-coc-list">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">
                    {{ $t('coc_business.coc_order_number') }}
                    <a class="order-link" @click="goToDetail">{{ oderNumer }}</a>
                    {{ $t('certificate-list.coc_certificateList') }}
                </div>
                <div
                    class="all_download title-container"
                    v-if="props.cocProps && Object.keys(props.cocProps).length > 0 && props.cocProps.isOther"
                >
                    <a-button type="primary" @click="onAllDownLoad({})">{{
                        $t('certificate-list.coc_allDownloaded')
                    }}</a-button>
                </div>
            </div>

            <!-- tabs -->
            <div class="tabs-container colorful cancel-m-b" v-if="!distributor">
                <a-tabs v-model:activeKey="activeKey" @change="handleTabs">
                    <a-tab-pane v-for="item of tab_type" :key="item.key">
                        <template #tab> {{ item[$i18n.locale] }}({{ numberForm[item.key].number }}) </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <!-- search -->
            <div class="search">
                <a-row class="row-detail">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                        <div class="key">{{ $t('certificate-list.coc_vin') }}：</div>
                        <div class="value">
                            <a-input
                                v-model:value="searchForm.vehicle_uid"
                                :placeholder="$t('certificate-list.coc_inputVin')"
                            ></a-input>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                        <div class="key">{{ $t('certificate-list.coc_motor') }}：</div>
                        <div class="value">
                            <a-input
                                v-model:value="searchForm.motor_uid"
                                :placeholder="$t('certificate-list.coc_inputMotor')"
                            ></a-input>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                        <div class="key">{{ $t('certificate-list.coc_deliveryDate') }}：</div>
                        <div class="value">
                            <TimeSearch @search="onDeliveryTime" ref="timer" />
                        </div>
                    </a-col>
                    <!-- 按钮 -->
                    <a-col :xs="24" :sm="24" :xl="24" :xxl="6" class="row-item btn-area">
                        <a-button @click="handleReset">{{ $t('certificate-list.coc_reset') }}</a-button>
                        <a-button type="primary" @click="handleSearch">{{
                            $t('certificate-list.coc_search')
                        }}</a-button>
                    </a-col>
                </a-row>
            </div>
            <div class="btns-area title-container">
                <a-button type="primary" @click="batchDownload">{{
                    $t('certificate-list.coc_batchDownload')
                }}</a-button>
                <a-button type="primary" @click="allGenerated" v-if="!roles.DISTRIBUTOR">{{
                    $t('certificate-list.coc_allGenerated')
                }}</a-button>
            </div>
            <!-- table -->
            <div class="table-container">
                <a-table
                    :row-key="record => record.id"
                    :columns="fiflterPalrformTableColumns"
                    :data-source="palrformTableData"
                    :pagination="channelPagination"
                    :loading="loading"
                    @change="handleTableChange"
                    :scroll="{ x: true }"
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
                        <template v-if="column.key === 'coc_operation'">
                            <a-button
                                type="link"
                                @click="onDownLoad(record)"
                                :disabled="record.certificate_status !== 1"
                                >{{ $t('certificate-list.coc_download') }}</a-button
                            >
                            <a-button type="link" @click="onView(record)" :disabled="record.certificate_status !== 1">{{
                                $t('certificate-list.coc_view')
                            }}</a-button>
                            <!-- 重新生成 -->
                            <a-button
                                type="link"
                                @click="reRenerate(record)"
                                danger
                                v-if="record.regenerate_flag === '1' && !roles.DISTRIBUTOR"
                                >{{ $t('coc_business.coc_re_generate') }}</a-button
                            >
                        </template>
                        <template v-else-if="column.key === 'order_time'">
                            <span>{{ Util.timeFormat(record.order_time) }}</span>
                        </template>
                        <template v-else-if="column.key === 'delivery_time'">
                            <span>{{ Util.timeFormat(record.delivery_time) }}</span>
                        </template>
                        <template v-else-if="column.key === 'last_generation_time'">
                            <span>{{ Util.timeFormat(record.last_generation_time) }}</span>
                        </template>
                        <!-- 状态 -->
                        <template v-else-if="column.key === 'certificate_status' && !distributor">
                            <!-- tag -->
                            <!-- :color="COC.TAB_TYPE[record.certificate_status].color" -->
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
                    </template>
                </a-table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, computed, onMounted, toRefs, watch } from 'vue';
import Core from '@/core';
import TimeSearch from '@/components/common/TimeSearch.vue';
import fileSave from '@/core/fileSave';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();

const { proxy } = getCurrentInstance();
const COC = Core.Const.COC;
const Util = Core.Util;

const { $message } = proxy;
const $t = useI18n().t;
const { TAB_TYPE } = COC;
const { getCertificateDetailList, getCertificatNumber, downLoadCertificateDetailLis, regenerateFile } = Core.Api.COC;
// 获取路由参数
const route = useRoute();
const { query } = route;
const { isDistributor, order_number } = query;
const distributor = ref(isDistributor === 'true'); // 是否是经销商
const activeKey = ref(undefined); // tab切换
const selectedRowKeyArr = ref([]); // 选中的哪些项
const oderNumer = ref(order_number); // 订单号
const timer = ref(null);
const searchForm = reactive({
    certificate_status: 0,
    delivery_end_time: '',
    delivery_start_time: '',
    motor_uid: '',
    order_number: '',
    vehicle_uid: '',
});
const palrformTableData = ref([]);
const numberForm = reactive({
    0: { number: 0 },
    1: { number: 0 },
    3: { number: 0 },
});
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
const palrformTableColumns = ref([
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
        roles: ['SUPER_ADMIN', 'SALESMAN'],
    },
    {
        title: 'coc_business.coc_client_download_times',
        dataIndex: 'download_number',
        key: 'download_number',
        roles: ['DISTRIBUTOR'],
    },
    {
        title: 'coc_business.coc_newest_generated_time',
        dataIndex: 'last_generation_time',
        key: 'last_generation_time',
        roles: ['SUPER_ADMIN', 'SALESMAN', 'DISTRIBUTOR'],
    },
    {
        title: 'certificate-list.coc_operation',
        dataIndex: 'coc_operation',
        key: 'coc_operation',
        roles: ['SUPER_ADMIN', 'SALESMAN', 'DISTRIBUTOR'],
    },
]);
const loading = ref(false);
const { FILE_UPLOAD_END_POINT, OSS_POINT } = Core.Const.NET;

const props = defineProps({
    cocProps: {
        type: Object,
        default: () => {},
    },
});
const roles = reactive({
    DISTRIBUTOR: Core.Data.getLoginType() === Core.Const.USER.TYPE.DISTRIBUTOR,
    SUPER_ADMIN: Core.Data.getManager(),
    // 业务员
    SALESMAN: !Core.Data.getManager() && Core.Data.getLoginType() !== Core.Const.USER.TYPE.DISTRIBUTOR,
});

const fiflterPalrformTableColumns = computed(() => {
    // 查看roles谁为真，就返回谁
    let role = Object.keys(roles).filter(item => roles[item])[0];
    let arr = [];
    arr = palrformTableColumns.value.filter(item => {
        return item.roles.includes(role);
    });
    return arr;
});
// 获取列表
const getCerList = (from = {}) => {
    loading.value = true;
    let params = {
        ...from,
        ...searchForm,
        page_size: channelPagination.pageSize,
        page: channelPagination.page,
    };
    getCertificateDetailList(params)
        .then(res => {
            Core.Logger.success('参数', from, '结果', res);
            channelPagination.total = res.count;
            palrformTableData.value = res.list;
            loading.value = false;
        })
        .catch(err => {
            Core.Logger.error('参数', from, '结果', err);
        })
        .finally(() => {
            loading.value = false;
        });
};
// 筛选type
const tab_type = computed(() => {
    // 过滤
    return Object.values(TAB_TYPE).filter(item => item.key !== 2);
});
// 重新生成
const reRenerate = record => {
    let param = {
        all_generated_flag: 0,
        source_type: 2,
        target_id: record.id,
    };
    regenerateFile(param).then(res => {
        getCerList();
        $message.success($t('coc.coc_generate_success'));
    });
};
const allGenerated = () => {
    let param = {
        all_generated_flag: 1,
        source_type: 2,
        target_id: route.query.id,
    };
    regenerateFile(param).then(res => {
        handleReset();
        getCerList();
        $message.success($t('coc.coc_generate_success'));
    });
};
// 获取数量信息
const getAllNumer = () => {
    getCertificatNumber({
        order_number:
            props.cocProps && Object.keys(props.cocProps).length > 0 && props.cocProps.order_number
                ? props.cocProps.order_number
                : query.order_number,
    })
        .then(res => {
            numberForm[0].number = res?.total_num || 0;
            numberForm[1].number = res?.generated_num || 0;
            numberForm[3].number = res?.ungenerated_num || 0;
        })
        .catch(err => {
            Core.Logger.error('参数', {}, '结果', err);
        });
};
const handleReset = () => {
    timer.value.handleReset();
    searchForm.certificate_status = activeKey.value;
    searchForm.delivery_end_time = '';
    searchForm.delivery_start_time = '';
    searchForm.motor_uid = '';
    searchForm.order_number = route.query.order_number;
    searchForm.vehicle_uid = '';
    const { page, pageSize, current } = toRefs(channelPagination);
    page.value = 1;
    current.value = 1;
    pageSize.value = 20;
    if (props.cocProps && Object.keys(props.cocProps).length > 0 && props.cocProps.isOther) {
        searchForm.order_number = props.cocProps.order_number;
        distributor.value = props.cocProps.isDistributor;
        oderNumer.value = props.cocProps.order_number;
    }
    let params = Core.Util.deepCopy(searchForm);
    getCerList(params);
};
const handleSearch = () => {
    let params = {
        ...searchForm,
        certificate_status: activeKey.value,
    };
    getCerList(params);
};
const handleTableChange = (pagination, filters, sorter) => {
    channelPagination.page = pagination.current;
    channelPagination.pageSize = pagination.pageSize;
    channelPagination.current = pagination.current;
    if (pagination.pageSize !== channelPagination.pageSize) {
        channelPagination.page = 1;
        channelPagination.pageSize = pagination.pageSize;
    }
    getCerList();
};
const handleTabs = () => {
    searchForm.certificate_status = activeKey.value;
    getCerList();
};
// 选中项的事件
// 选中项的事件
const onSelectChange = selectedRowKeys => {
    // 注意selectedRowKeyArr尽量不要跟上面selectedRowKeys名称一样
    Core.Logger.log('selectedRowKeys changed: ', selectedRowKeys);
    selectedRowKeyArr.value = selectedRowKeys;
};
// 批量下载
const batchDownload = () => {
    onDownLoad({}, selectedRowKeyArr.value);
};
// 下载
const onDownLoad = (record, array) => {
    let list = record?.id ? [record.id] : selectedRowKeyArr.value;
    downLoadCertificateDetailLis({
        download_list: list,
        // source_type: Core.Const.COC.DOWN_LOAD_TYPE[1].key,
        source_type: 2,
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
            Core.Logger.error('参数', {}, '结果', JSON.stringify(err));
        });
};
const onAllDownLoad = (record, array) => {
    downLoadCertificateDetailLis({
        source_type: 1,
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
            Core.Logger.error('参数', {}, '结果', JSON.stringify(err));
        });
};
// 查看文档
const onView = record => {
    let url = 'http://view.officeapps.live.com/op/view.aspx?src=' + OSS_POINT + '/' + record.file_url;
    window.open(url, '_blank');
};
const onDeliveryTime = params => {
    searchForm.delivery_start_time = params.begin_time;
    searchForm.delivery_end_time = params.end_time;
};

const goToDetail = record => {
    router.push({
        path: `/purchase/purchase-order-detail`,
        query: {
            id: route.query.id,
        },
    });
};

onMounted(() => {
    searchForm.order_number = order_number;
    if (props.cocProps && Object.keys(props.cocProps).length > 0 && props.cocProps.isOther) {
        searchForm.order_number = props.cocProps.order_number;
        distributor.value = props.cocProps.isDistributor;
        oderNumer.value = props.cocProps.order_number;
    }
    let params = Core.Util.deepCopy(searchForm);
    getCerList(params);
    if (!distributor.value) {
        getAllNumer();
    }
});
</script>

<style lang="less" scoped>
.distributor-coc-list {
    position: relative;
    .list-container {
        .title-container {
            .title-area {
                .order-link {
                    text-decoration: underline;
                }
            }
            .all_download {
                display: flex;
                justify-content: flex-end;
                padding: 0 !important;
            }
        }

        .search {
            .row-detail {
                .btn-area {
                    width: 170px;
                    display: flex;
                    justify-content: flex-end;
                }
            }
        }
    }
}
.cancel-m-b {
    margin-bottom: 0;
}
</style>
