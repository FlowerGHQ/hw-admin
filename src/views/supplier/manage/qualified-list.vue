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
                :pagination="false"
            >
                <template #bodyCell="{ column, text, record, index }">
                    <!-- 序号 -->
                    <template v-if="column.key === 'number'">
                        {{ index + 1 }}
                    </template>
                    <template v-if="column.key === 'item'">
                        {{ text ? text : '-' }}
                    </template>
                    <!-- 引入日期 -->
                    <template v-if="column.key === 'time'">
                        {{ text ? $Util.timeFormat(text, 'YYYY.MM') : '-' }}
                    </template>
                    <!-- 变化类 -->
                    <template v-if="column.key === 'register_type'">
                        <template v-if="text === 1">
                            {{ text ? $t('supply-chain.new_addition') : '-' }}
                        </template>
                        <template v-if="text === 2">
                            {{ text ? $t('supply-chain.rename') : '-' }}
                        </template>
                        <template v-if="!text">-</template>
                    </template>
                </template>
            </a-table>
        </div>
        <div class="paging-container">
            <a-pagination
                v-model:current="pagination.current"
                :page-size="pagination.size"
                :total="pagination.total"
                show-quick-jumper
                show-size-changer
                show-less-items
                :show-total="total => $t('n.all_total') + ` ${pagination.total} ` + $t('in.total')"
                :hide-on-single-page="false"
                :pageSizeOptions="['10', '20', '30', '40']"
                @change="onPageChange"
                @showSizeChange="onSizeChange"
            />
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
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, computed, nextTick, reactive } from 'vue';
import Core from '@/core';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import ExportResult from '@/components/common/ExportResult.vue';
import { useTable } from '@/hooks/useTable';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import MySvgIcon from '@/components/MySvgIcon/index.vue';
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
const importResultData = reactive({
    totalCode: 0,
    successCode: 0,
    errorCode: 0,
});
const tableColumns = computed(() => {
    let columns = [
        { title: $t('supply-chain.serial_number'), dataIndex: 'number', key: 'number', fixed: 'left' },
        { title: $t('supply-chain.no'), dataIndex: 'no', key: 'item', fixed: 'left' },
        { title: $t('supply-chain.supplier_code'), dataIndex: 'code', key: 'item' },
        { title: $t('supply-chain.supplier_full_name'), dataIndex: 'name', key: 'item' },
        { title: $t('supply-chain.supplier_abbreviation'), dataIndex: 'short_name', key: 'item' },
        { title: $t('supply-chain.procurement_category'), dataIndex: 'purchase_category', key: 'item' },
        { title: $t('supply-chain.main_supply'), dataIndex: 'supply_main', key: 'item' },
        { title: $t('supply-chain.secondary_supply'), dataIndex: 'supply_secondary', key: 'item' },
        { title: $t('supply-chain.other_items'), dataIndex: 'supply_other', key: 'item' },
        { title: $t('supply-chain.introduction_date'), dataIndex: 'register_time', key: 'time' },
        { title: $t('supply-chain.change_class'), dataIndex: 'register_type', key: 'register_type' },
        { title: $t('supply-chain.remark'), dataIndex: 'remark', key: 'item' },
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
/* Fetch start*/
const request = Core.Api.Supplier.list;
const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request,
    initParam: {
        status: 10,
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
/* methods end*/
</script>

<style lang="less" scoped>
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
