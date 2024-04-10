<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('supply-chain.eliminate_supplier_list') }}</div>
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
import { onMounted, ref, getCurrentInstance, computed, nextTick, reactive } from 'vue';
import Core from '@/core';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import ExportResult from '@/components/common/ExportResult.vue';
import MySvgIcon from '@/components/MySvgIcon/index.vue';
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
        // 采购品类
        {
            title: $t('supply-chain.procurement_category'),
            dataIndex: 'purchase_category',
            key: 'item',
        },
        { title: $t('supply-chain.main_supply'), dataIndex: 'supply_main', key: 'item' },
        { title: $t('supply-chain.secondary_supply'), dataIndex: 'supply_secondary', key: 'item' },
        { title: $t('supply-chain.other_items'), dataIndex: 'supply_other', key: 'item' },
        { title: $t('common.vehicle_model'), dataIndex: 'vehicle_model', key: 'item' },
        { title: $t('supply-chain.introduction_date'), dataIndex: 'register_time', key: 'time' },
        { title: $t('supply-chain.province'), dataIndex: 'province', key: 'item' },
        { title: $t('supply-chain.city'), dataIndex: 'city', key: 'item' },
        { title: $t('supply-chain.detailed_address'), dataIndex: 'address', key: 'item' },
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
]);
onMounted(() => {});

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
                        purchase_category: ['purchase_category1'],
                        supply_main: 'supply_main1',
                        supply_secondary: 'supply_secondary1',
                        supply_other: 'supply_other1',
                        vehicle_model: 'vehicle_model1',
                        manager: 'manager1',
                        register_time: '2021-01-01',
                        register_type: 1,
                        remark: 'remark1',
                        province: 'province1',
                        city: 'city1',
                        address: 'address1',
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
const handleImportClose = () => {
    importVisible.value = false;
};
const handleImportConfirm = () => {
    importVisible.value = false;
};
const handleRemarkClose = () => {
    changeRemarkVisible.value = false;
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
    .editable-cell-input-wrapper {
        display: flex;
        align-items: center;
        .editable-cell-icon-check {
            cursor: pointer;
            color: #006ef9;
            margin-left: 4px;
        }
    }
    .editable-cell-text-wrapper {
        display: flex;
        align-items: center;
        .editable-cell-icon {
            cursor: pointer;
            color: #006ef9;
            margin-left: 8px;
        }
    }
}
</style>
