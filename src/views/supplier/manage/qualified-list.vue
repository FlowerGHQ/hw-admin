<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('supply-chain.qualified_supplier') }}</div>
            <div class="btns-area">
                <div class="btn-group">
                    <a-upload
                        name="file"
                        class="file-uploader"
                        :file-list="upload.fileList"
                        :action="upload.action"
                        :show-upload-list="false"
                        :headers="upload.headers"
                        :data="upload.data"
                        accept=".xlsx,.xls"
                        @change="handleMatterChange"
                    >
                        <div class="radio-btn first">{{ $t('i.import_name') }}</div>
                    </a-upload>
                    <div class="radio-btn last" @click="downTemplate">{{ $t('i.down_template') }}</div>
                </div>
            </div>
        </div>
        <!-- search -->
        <div class="search">
            <SearchAll :options="searchList" :isShowMore="false" @search="onSearch" @reset="onReset"> </SearchAll>
        </div>
        <!-- table -->
        <div class="table-container">
            <a-table
                :columns="tableColumns"
                :data-source="tableData"
                :scroll="{ x: true }"
                :loading="loading"
                :row-key="record => record.id"
                :pagination="{
                    current: pagination.current,
                    pageSize: pagination.size,
                    total: pagination.total,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    showLessItems: true,
                    showTotal: total => $t('n.all_total') + ` ${pagination.total} ` + $t('in.total'),
                    hideOnSinglePage: false,
                    pageSizeOptions: ['10', '20', '30', '40'],
                }"
                @change="({ current, pageSize }) => onPagenationChange({ current, size: pageSize })"
            >
                <template #bodyCell="{ column, text, record, index }">
                    <!-- 品编 -->
                    <template
                        v-if="
                            column.key === 'code' ||
                            column.key === 'short_name' ||
                            column.key === 'supply_main' ||
                            column.key === 'supply_secondary' ||
                            column.key === 'supply_other' ||
                            column.key === 'remark' ||
                            column.key === 'no'
                        "
                    >
                        <EditTableCell
                            type="input"
                            :cellData="{ column, text, record, index }"
                            @handleCellSave="tabCellSave"
                            :maxLength="column.maxLength"
                            :isRequired="column.isRequired"
                            :requiredRules="column.requiredRules"
                        />
                    </template>
                    <template
                        v-else-if="
                            column.key === 'purchase_category' ||
                            column.key === 'register_type' ||
                            column.key === 'manager' ||
                            column.key === 'vehicle_model'
                        "
                    >
                        <EditTableCell
                            type="select"
                            :cellData="{ column, text, record, index }"
                            @handleCellSave="tabCellSave"
                            :selectOptions="column.selectOptions"
                            :mode="column.mode"
                            :isSort="column.isSort"
                        />
                    </template>
                    <!-- name -->
                    <template v-else-if="column.key === 'name'">
                        <a-button type="link">
                            {{ text }}
                        </a-button>
                    </template>
                    <!-- 供方全称 -->
                    <template v-else-if="column.key === 'company_name'">
                        <a-button type="link" @click="handleView(record)">{{ text || '-' }}</a-button>
                    </template>
                    <!-- 操作 -->
                    <template v-else-if="column.key === 'operate'">
                        <a-button type="link" danger @click="handleEliminate(record)">
                            {{ $t('supply-chain.eliminate') }}
                        </a-button>
                    </template>
                </template>
            </a-table>
        </div>
        <!-- 导出结果展示 -->
        <a-modal
            v-model:visible="importVisible"
            :title="$t('i.import_data')"
            :width="540"
            centered
            class="import-modal"
        >
            <div class="modal-content">
                <ExportResult :data="importResultData" :showInvalidNum="false" :showList="false" />
            </div>
            <template #footer>
                <div class="btns">
                    <a-button @click="handleImportClose">{{ $t('def.cancel') }}</a-button>
                    <a-button type="primary" @click="handleImportConfirm">{{ $t('def.sure') }}</a-button>
                </div>
            </template>
        </a-modal>
        <!-- 淘汰弹框 -->
        <EliminateModal
            :modalVisible="eliminateVisible"
            :details="eliminateRecord"
            @handleOk="handleEliminateOk"
            @handleCancel="handleEliminateCancel"
        />
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, computed, nextTick, reactive, provide, watch } from 'vue';
import Core from '@/core';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import ExportResult from '@/components/common/ExportResult.vue';
import MySvgIcon from '@/components/MySvgIcon/index.vue';
import EditTableCell from './components/edit-table-cell.vue';
import EliminateModal from './components/eliminate-modal.vue';
import { useTable } from '@/hooks/useTable';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import _ from 'lodash';

const $store = useStore();
const router = useRouter();
const $t = useI18n().t;
const { proxy } = getCurrentInstance();
const upload = reactive({
    action: Core.Const.NET.URL_POINT + '/admin/1/supplier/import-qualified-supplier',
    fileList: [],
    headers: {
        ContentType: false,
    },
    data: {
        token: Core.Data.getToken(),
        type: 'xlsx',
    },
});
const importVisible = ref(false);
// const changeRemarkVisible = ref(false);
const importResultData = reactive({
    totalCode: 0,
    successCode: 0,
    errorCode: 0,
});
const editId = ref(null);
const eliminateVisible = ref(false);
const eliminateRecord = ref({});

// 采购品类
const PURCHASE_CATEGORY_LIST = Core.Const.QUALIFIED_LIST.PURCHASE_CATEGORY_LIST;
const REGISTRATION_TYPE_LIST = Core.Const.QUALIFIED_LIST.REGISTRATION_TYPE_LIST;
// 供应链角色
const SUPPLY_CHAIN_ROLES_LIST = ref([]);
// 车型
const VEHICLE_MODEL_LIST = ref([]);

const tableColumns = computed(() => {
    let columns = [
        {
            title: $t('supply-chain.serial_number'),
            dataIndex: 'number',
            key: 'number',
            with: 50,
            fixed: 'left',
            customRender: ({ text, record, index, column }) => {
                // 当前页码-1 * 每页条数 + 索引 + 1
                return (pagination.value.current - 1) * pagination.value.size + index + 1;
            },
        },
        // 品编
        {
            title: $t('supply-chain.no'),
            dataIndex: 'no',
            key: 'no',
            maxLength: 5,
            // 校验规则:5位数字
            isRequired: true,
            requiredRules: [
                {
                    // 0-5位数字
                    pattern: /^\d{0,5}$/g,
                    message: $t('supply-chain.no') + $t('supply-chain.format_error'),
                },
            ],
        },
        // 供方代码
        {
            title: $t('supply-chain.supplier_code'),
            dataIndex: 'code',
            key: 'code',
            maxLength: 7,
        },
        { title: $t('supply-chain.supplier_full_name'), dataIndex: 'company_name', key: 'company_name' },
        // 简称
        {
            title: $t('supply-chain.supplier_abbreviation'),
            dataIndex: 'short_name',
            key: 'short_name',
            maxLength: 10,
        },
        // 采购品类
        {
            title: $t('supply-chain.procurement_category'),
            dataIndex: 'purchase_category',
            key: 'purchase_category',
            selectOptions: PURCHASE_CATEGORY_LIST,
            mode: 'multiple',
        },
        { title: $t('supply-chain.main_supply'), dataIndex: 'supply_main', key: 'supply_main', maxLength: 100 },
        {
            title: $t('supply-chain.secondary_supply'),
            dataIndex: 'supply_secondary',
            key: 'supply_secondary',
            maxLength: 100,
        },
        { title: $t('supply-chain.other_items'), dataIndex: 'supply_other', key: 'supply_other', maxLength: 100 },

        // 合作厂商
        {
            title: $t('supply-chain.cooperative_factory'),
            dataIndex: 'cooperative_factory',
            key: 'cooperative_factory',
            customRender: ({ text, record, index }) => {
                return text ? text : '-';
            },
        },

        {
            title: $t('common.vehicle_model'),
            dataIndex: 'vehicle_model',
            key: 'vehicle_model',
            selectOptions: VEHICLE_MODEL_LIST.value,
            mode: 'multiple',
            isSort: true,
        },
        {
            title: $t('common.manager'),
            dataIndex: 'manager',
            key: 'manager',
            selectOptions: SUPPLY_CHAIN_ROLES_LIST.value,
            mode: 'multiple',
        },
        {
            title: $t('supply-chain.introduction_date'),
            dataIndex: 'create_time',
            key: 'create_time',
            customRender: ({ text, record, index }) => {
                return Core.Util.timeFormat(text);
            },
        },
        {
            title: $t('supply-chain.change_class'),
            dataIndex: 'register_type',
            key: 'register_type',
            selectOptions: REGISTRATION_TYPE_LIST,
            // 单选
            mode: 'single',
        },
        {
            title: $t('supply-chain.remark'),
            dataIndex: 'remark',
            key: 'remark',
            maxLength: 50,
        },
        { title: $t('supply-chain.province'), dataIndex: 'province', key: 'province' },
        { title: $t('supply-chain.city'), dataIndex: 'city', key: 'city' },
        { title: $t('supply-chain.detailed_address'), dataIndex: 'address', key: 'address' },
        // 操作
        {
            title: $t('def.operate'),
            dataIndex: 'operate',
            key: 'operate',
            fixed: 'right',
            width: 100,
        },
    ];
    return columns;
});
const searchList = ref([
    {
        type: 'input',
        value: '',
        searchParmas: 'company_name',
        key: 'supply-chain.supplier_full_name',
    },
    {
        type: 'input',
        value: '',
        searchParmas: 'supply_main',
        key: 'supply-chain.main_supply',
    },
    {
        type: 'input',
        value: '',
        searchParmas: 'purchase_category',
        key: 'supply-chain.procurement_category',
    },
    {
        type: 'select',
        value: undefined,
        searchParmas: 'register_type',
        key: 'supply-chain.change_class',
        selectMap: Core.Const.SUPPLAY.CHANGE_CLASS_LIST,
    },
]);

// 主供件

onMounted(() => {
    getSupplyChainList();
    getVehicleModel();
});

const request = Core.Api.SUPPLY.adminList;
const { loading, tableData, pagination, search, onPagenationChange, refreshTable, searchParam } = useTable({
    request,
    initParam: {
        stage: 40,
    },
    dataCallBack: res => {
        // item 和 item.form字段合并
        let list = _.cloneDeep(res.list);
        console.log('list', list);
        list.map(item => {
            item.code = item?.form?.code || '';
            item.no = item?.form?.no || '';
            item.short_name = item?.form?.short_name || '';
            item.purchase_category = item?.form?.purchase_category || undefined;
            item.supply_main = item?.form?.supply_main || '';
            item.supply_secondary = item?.form?.supply_secondary || '';
            item.supply_other = item?.form?.supply_other || '';
            item.vehicle_model = item?.form?.vehicle_model || '';
            item.manager = item?.form?.manager || undefined;
            item.register_type = item?.form?.register_type || '';
            item.province = item?.form?.company_info?.province || '';
            item.city = item?.form?.company_info?.city || '';
            item.address = item?.form?.company_info?.address || '';
            item.cooperative_factory = item?.form?.customer_info.map(item => item.customer_name).join('、') || '';
            item.remark = item?.form?.remark || '';
        });
        return list;
    },
});

/* Fetch end*/

/* methods start*/
const onSearch = data => {
    searchParam.value = data;
    search();
};
const onReset = () => {
    refreshTable();
};
// 上传文件
const handleMatterChange = ({ file, fileList }) => {
    if (file.status == 'done') {
        if (file.response && file.response.code > 0) {
            return proxy.$message.error(proxy.$t(file.response.code + ''));
        } else {
            const resData = file.response.data;
            importResultData.totalCode = resData.total_count;
            importResultData.errorCode = resData.fail_count;
            importResultData.successCode = resData.success_count;
            nextTick(() => {
                importVisible.value = true;
            });
            onSearch();
            return proxy.$message.success(proxy.$t('i.uploaded'));
        }
    }
    upload.fileList = fileList;
};
// 下载模板
const downTemplate = () => {
    const url = Core.Api.Common.downloadImportQualifiedListTemplate({ type: 1, locale: '' });
    window.open(url, '_blank');
};
const handleImportClose = () => {
    importVisible.value = false;
};
const handleImportConfirm = () => {
    importVisible.value = false;
};
const tabCellSave = ({ record, index, column }) => {
    console.log('record', record);
    console.log('index', index);
    console.log('column', column);
    let params = {
        id: 1,
        company_name: '', //供方全称
        supplier_application_form: {
            no: '', //品编
            code: '', //供方代码
            short_name: '', //供方简称
            purchase_category: '', //采购品类
            supply_main: '', //主供件
            supply_secondary: '', //次供件
            supply_other: '', //其他件
            vehicle_model: '', //车型
            manager: '', //主管
            register_type: '', //变化类
            remark: '', //备注
        },
    };
    params.id = record.id;
    params.company_name = record.company_name;
    params.supplier_application_form.no = record.no;
    params.supplier_application_form.code = record.code;
    params.supplier_application_form.short_name = record.short_name;
    params.supplier_application_form.purchase_category = record.purchase_category;
    params.supplier_application_form.supply_main = record.supply_main;
    params.supplier_application_form.supply_secondary = record.supply_secondary;
    params.supplier_application_form.supply_other = record.supply_other;
    params.supplier_application_form.vehicle_model = record.vehicle_model;
    params.supplier_application_form.manager = record.manager;
    params.supplier_application_form.register_type = record.register_type;
    params.supplier_application_form.remark = record.remark;
    console.log('params', params);
    Core.Api.SupplierApplication.update(params).then(res => {
        search();
    });
};
// 获取供应链下的角色
const getSupplyChainList = () => {
    Core.Api.SupplierApplication.getAdminList().then(res => {
        SUPPLY_CHAIN_ROLES_LIST.value = res.list.map((item, index) => {
            return {
                label: item,
                value: item,
                id: index,
            };
        });
    });
};
const handleEliminate = record => {
    eliminateRecord.value = record;
    eliminateVisible.value = true;
};
const handleEliminateOk = () => {
    eliminateVisible.value = false;
    // 重新请求数据
    search();
};
const handleEliminateCancel = () => {
    eliminateVisible.value = false;
};
// 递归生成车型数据
const getVehicleModelFilter = arr => {
    let result = [];
    arr.forEach(item => {
        if (item.children && item.children.length > 0) {
            result.push({
                label: item.name,
                value: item.name,
                id: item.id,
                options: getVehicleModelFilter(item.children),
            });
        } else {
            result.push({
                label: item.name,
                value: item.name,
                id: item.id,
            });
        }
    });
    return result;
};
// 获取车型
const getVehicleModel = () => {
    Core.Api.ItemCategory.tree({ type: 30, parent_id: 0, depth: 2 }).then(res => {
        VEHICLE_MODEL_LIST.value = getVehicleModelFilter(res.list);
        console.log(VEHICLE_MODEL_LIST.value, 'VEHICLE_MODEL_LIST.value');
    });
};
// 查看详情
const handleView = record => {
    router.push({
        path: '/supply-manage/detail',
        query: {
            id: record.id,
            isView: true,
        },
    });
};

/* methods end*/
</script>

<style lang="less" scoped>
.remark {
    .fcc();
    .remark-text {
        display: inline-block;
        max-width: 300px;
        .ell();
    }
    .supply-edit {
        margin-left: 6px;
        cursor: pointer;
    }
}
.title-container {
    .btns-area {
        .file-upload-btn {
            margin-right: 15px;
        }
        .btn-group {
            display: inline-flex;
            .radio-btn {
                padding: 6px 10px;
                border: 1px solid #eaecf1;
                border-right: none;
                cursor: pointer;
                font-size: 14px;
                font-weight: 400;
                text-align: center;
                color: #1d2129;
                line-height: 20px;
                &.first {
                    border-radius: 4px 0 0 4px;
                }
                &.last {
                    border-right: 1px solid #eaecf1;
                    border-radius: 0 4px 4px 0;
                }
                &:hover {
                    color: #1890ff;
                }
            }
        }
    }
}
:deep(.ant-table-cell) {
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
