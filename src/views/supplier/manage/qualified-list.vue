<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('supply-chain.application_Materials') }}</div>
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
                    <!-- 公司名称 -->
                    <template v-if="column.key === 'company_name'">
                        <a-tooltip placement="topLeft">
                            <template #title>{{ text }}</template>
                            <div
                                class="one-spils cursor"
                                :style="{
                                    width: text?.length > 15 ? 7 * 12 + 'px' : '',
                                }"
                            >
                                {{ text }}
                            </div>
                        </a-tooltip>
                    </template>
                    <!-- 供应商类型 -->
                    <template v-if="column.key === 'type'">
                        {{ Core.Const.SUPPLAY.SUPPLAY_TYPE[text] ? $t(Core.Const.SUPPLAY.SUPPLAY_TYPE[text]?.t) : '-' }}
                    </template>
                    <!-- 提交时间 -->
                    <template v-if="column.key === 'create_time'">
                        {{ text ? $Util.timeFormat(text) : '-' }}
                    </template>
                    <!-- 操作 -->
                    <template v-if="column.key === 'operations'">
                        <a-button type="link" @click="onView('add', record)">
                            <MySvgIcon icon-class="supply-view" />
                            <span class="m-l-10">{{ $t('supply-chain.view') }}</span>
                        </a-button>
                        <a-button type="link" @click="onView('edit', record)">
                            <MySvgIcon icon-class="supply-edit" />
                            <span class="m-l-10">{{ $t('common.edit') }}</span>
                        </a-button>
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
                <ExportResult :data="importResultData" />
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
import { onMounted, ref, getCurrentInstance, computed, watch, reactive } from 'vue';
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
    action: Core.Const.NET.URL_POINT + '/admin/1/item/import-fob-price',
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
    errorCodeList: [],
    invalidCodeList: [],
    totalCode: 0,
    successCode: 0,
    errorCode: 0,
    invalidCode: 0,
});
const tableColumns = computed(() => {
    let columns = [
        { title: $t('supply-chain.serial_number'), dataIndex: 'number', key: 'number' },
        { title: $t('supply-chain.company_name'), dataIndex: 'company_name', key: 'company_name' },
        { title: $t('supply-chain.supplier_type'), dataIndex: 'type', key: 'type' },
        { title: $t('supply-chain.submission_time'), dataIndex: 'create_time', key: 'create_time' },
        { title: $t('common.operations'), key: 'operations', fixed: 'right' },
    ];
    return columns;
});

const searchList = ref([
    {
        type: 'input',
        value: '',
        searchParmas: 'company_name',
        key: 'supply-chain.company_name',
    },
]);

onMounted(() => {});
/* Fetch start*/
const request = Core.Api.SUPPLY.adminList;
const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request,
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
// 点击查看
const onView = (type, record) => {
    let routeUrl = null;
    switch (type) {
        case 'add':
            routeUrl = router.resolve({
                path: '/supply-manage/detail',
                query: {
                    id: record.id,
                },
            });
            window.open(routeUrl.href, '_blank');

            break;
        case 'edit':
            routeUrl = router.resolve({
                path: '/supply-manage/detail',
                query: {
                    id: record.id,
                    flag_edit: true,
                },
            });
            window.open(routeUrl.href, '_blank');
            break;
    }
};
const onBtn = () => {
    router.push({
        path: '/supply-manage/add',
    });
    $store.commit('SUPPLY_CHAIN/setSupplyChain', {});
    $store.commit('SUPPLY_CHAIN/setSupplyDraftChain', {});
    $store.commit('SUPPLY_CHAIN/setStep', 0);
    $store.commit('SUPPLY_CHAIN/setSubmitEd', false);
};
// 上传文件
const handleMatterChange = ({ file, fileList }) => {
    if (file.status == 'done') {
        if (file.response && file.response.code > 0) {
            return proxy.$message.error(proxy.$t(file.response.code + ''));
        } else {
            const resData = file.response.data;
            importResultData.errorCodeList = resData.fail_code_list;
            importResultData.invalidCodeList = resData.invalid_code_list;
            importResultData.totalCode = resData.total_count;
            importResultData.errorCode = resData.fail_count;
            importResultData.successCode = resData.success_count;
            importResultData.invalidCode = resData.invalid_code_count;
            importVisible.value = true;
            return proxy.$message.success(proxy.$t('i.uploaded'));
        }
    }
    upload.fileList = fileList;
};
// 下载模板
const downTemplate = () => {
    const url = Core.Api.Export.downloadImportFobPriceTemplate();
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
