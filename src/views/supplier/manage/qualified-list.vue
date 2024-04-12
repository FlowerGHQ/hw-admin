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
                            column.key === 'no' ||
                            column.key === 'code' ||
                            column.key === 'short_name' ||
                            column.key === 'supply_main' ||
                            column.key === 'supply_secondary' ||
                            column.key === 'supply_other'
                        "
                    >
                        <EditTableCell
                            type="input"
                            :cellData="{ column, text, record, index }"
                            @handleCellSave="tabCellSave"
                        />
                    </template>
                    <!-- name -->
                    <template v-if="column.key === 'name'">
                        <a-button type="link">
                            {{ text }}
                        </a-button>
                    </template>
                    <template
                        v-if="
                            column.key === 'purchase_category' ||
                            column.key === 'register_type' ||
                            column.key === 'manager'
                        "
                    >
                        <EditTableCell
                            type="select"
                            :cellData="{ column, text, record, index }"
                            @handleCellSave="tabCellSave"
                            :selectOptions="column.selectOptions"
                            :mode="column.mode"
                        />
                    </template>
                    <!-- 操作 -->
                    <template v-if="column.key === 'operate'">
                        <a-button type="link" danger>
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
        <!-- 修改备注 -->
        <a-modal
            v-model:visible="changeRemarkVisible"
            :title="$t('supply-chain.remark')"
            :width="540"
            centered
            class="import-modal"
        >
            <div class="modal-content">
                <a-form ref="formRef" :model="formState" layout="vertical" name="form_in_modal">
                    <a-form-item name="description" label="">
                        <a-textarea
                            v-model:value="formState.remark"
                            show-count
                            :maxlength="50"
                            :autoSize="{ minRows: 3, maxRows: 6 }"
                        />
                    </a-form-item>
                </a-form>
            </div>
            <template #footer>
                <div class="btns">
                    <a-button @click="handleRemarkClose">{{ $t('def.cancel') }}</a-button>
                    <a-button type="primary" @click="updateRemarkFetch">{{ $t('def.sure') }}</a-button>
                </div>
            </template>
        </a-modal>
    </div>
</template>

<script setup lang="jsx">
import { onMounted, ref, getCurrentInstance, computed, nextTick, reactive, provide } from 'vue';
import Core from '@/core';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import ExportResult from '@/components/common/ExportResult.vue';
import MySvgIcon from '@/components/MySvgIcon/index.vue';
import EditTableCell from './components/edit-table-cell.vue';
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
    action: Core.Const.NET.URL_POINT + '/admin/1/supplier/temp-import',
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
const changeRemarkVisible = ref(false);
const importResultData = reactive({
    totalCode: 0,
    successCode: 0,
    errorCode: 0,
});
const editId = ref(null);
const formState = reactive({
    remark: '',
});
// 采购品类
const PURCHASE_CATEGORY_LIST = Core.Const.QUALIFIED_LIST.PURCHASE_CATEGORY_LIST;
const REGISTRATION_TYPE_LIST = Core.Const.QUALIFIED_LIST.REGISTRATION_TYPE_LIST;
// 供应链
const SUPPLY_CHAIN_ROLES_LIST = ref([]);

const tableColumns = computed(() => {
    let columns = [
        {
            title: $t('supply-chain.serial_number'),
            dataIndex: 'number',
            key: 'number',
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
        },
        // 供方代码
        {
            title: $t('supply-chain.supplier_code'),
            dataIndex: 'code',
            key: 'code',
        },
        { title: $t('supply-chain.supplier_full_name'), dataIndex: 'name', key: 'name' },
        // 简称
        {
            title: $t('supply-chain.supplier_abbreviation'),
            dataIndex: 'short_name',
            key: 'short_name',
        },
        // 采购品类
        {
            title: $t('supply-chain.procurement_category'),
            dataIndex: 'purchase_category',
            key: 'purchase_category',
            selectOptions: PURCHASE_CATEGORY_LIST,
            mode: 'multiple',
        },
        { title: $t('supply-chain.main_supply'), dataIndex: 'supply_main', key: 'supply_main' },
        { title: $t('supply-chain.secondary_supply'), dataIndex: 'supply_secondary', key: 'supply_secondary' },
        { title: $t('supply-chain.other_items'), dataIndex: 'supply_other', key: 'supply_other' },
        { title: $t('common.vehicle_model'), dataIndex: 'vehicle_model', key: 'vehicle_model' },
        {
            title: $t('common.manager'),
            dataIndex: 'manager',
            key: 'manager',
            selectOptions: SUPPLY_CHAIN_ROLES_LIST.value,
            mode: 'multiple',
        },
        { title: $t('supply-chain.introduction_date'), dataIndex: 'register_time', key: 'register_time' },
        {
            title: $t('supply-chain.change_class'),
            dataIndex: 'register_type',
            key: 'register_type',
            selectOptions: REGISTRATION_TYPE_LIST,
            // 单选
            mode: 'single',
        },
        { title: $t('supply-chain.remark'), dataIndex: 'remark', key: 'remark' },
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
        searchParmas: 'name',
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
});
/* Fetch start*/
// const request = Core.Api.Supplier.list;

function request() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                list: [
                    {
                        id: 1,
                        no: '1',
                        code: 'code1',
                        name: 'name1',
                        short_name: 'short_name1',
                        purchase_category: 'RP类, 包材类',
                        supply_main: 'supply_main1',
                        supply_secondary: 'supply_secondary1',
                        supply_other: 'supply_other1',
                        vehicle_model: 'vehicle_model1',
                        manager: 'tenann1',
                        register_time: '2021-01-01',
                        register_type: 1,
                        remark: 'remark1',
                        province: 'province1',
                        city: 'city1',
                        address: 'address1',
                    },
                    {
                        id: 2,
                        no: '2',
                        code: 'code2',
                        name: 'name2',
                        short_name: 'short_name2',
                        purchase_category: 'RP类, 包材类',
                        supply_main: 'supply_main2',
                        supply_secondary: 'supply_secondary2',
                        supply_other: 'supply_other2',
                        vehicle_model: 'vehicle_model2',
                        manager: 'tenann1',
                        register_time: '2021-01-02',
                        register_type: 2,
                        remark: 'remark2',
                        province: 'province2',
                        city: 'city2',
                        address: 'address2',
                    },
                ],
                count: 1,
            });
        }, 1000);
    });
}

const updateRemark = Core.Api.Supplier.updateRemark;
const { loading, tableData, pagination, search, onPagenationChange, refreshTable, searchParam } = useTable({
    request,
    initParam: {
        status: 10,
    },
});
const updateRemarkFetch = () => {
    const params = {
        id: editId.value,
        remark: formState.remark,
    };
    updateRemark({ ...params }).then(res => {
        proxy.$message.success(proxy.$t('pop_up.modify'));
        onSearch();
        handleRemarkClose();
    });
};
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
const handleRemarkClose = () => {
    changeRemarkVisible.value = false;
};
const tabCellSave = ({ record, index, column }) => {
    console.log('record', record);
    console.log('index', index);
    console.log('column', column);
};

// 获取供应链下的角色
const getSupplyChainList = () => {
    Core.Api.SupplierApplication.getAdminList().then(res => {
        console.log('res', res.list);
        SUPPLY_CHAIN_ROLES_LIST.value = res.list.map((item, index) => {
            return {
                label: item,
                value: item,
                id: index,
            };
        });
        console.log('SUPPLY_CHAIN_ROLES_LIST', SUPPLY_CHAIN_ROLES_LIST.value);
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
</style>
