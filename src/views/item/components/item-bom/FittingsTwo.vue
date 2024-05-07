<template>
    <!-- code编码-二级页面 -->
    <div class="fittings-two">
        <!-- 设变 -->
        <div class="change" @click="expandOrSollapse">
            <div class="change-top">
                <div class="left">
                    <img class="left-img" src="@/assets/images/bom/frame.png" alt="" />
                    <span class="change-title">
                        {{ proxy.$t('item-bom.change_the_content') }}
                    </span>
                    <span class="change-text">
                        {{
                            `本期共涉变${objCount.allNum}个配件，新增${objCount.addNum}，删除${objCount.deleteNum}，修改${objCount.updateNum}`
                        }}
                    </span>
                </div>
                <img class="right" src="@/assets/images/bom/up.png" v-if="isShow" />
                <img class="right" src="@/assets/images/bom/down.png" v-else />
            </div>
            <div class="change-table" v-show="isShow">
                <table class="my-table">
                    <thead class="my-th">
                        <tr>
                            <th v-for="th in changeTableColumn">{{ th.title }}</th>
                        </tr>
                    </thead>
                    <tr v-for="(tr, indtr) in tableDataChange" :key="tr.id">
                        <td v-for="td in changeTableColumn">
                            <template v-if="td.key === 'order_number'">
                                {{ indtr + 1 }}
                            </template>
                            <template v-else-if="td.key === 'content'">
                                {{
                                    tr?.[td.dataIndex] ||
                                    (tr?.['type'] === 1 ? '新增' : tr?.['type'] === 2 ? '删除' : '修改')
                                }}
                            </template>
                            <template v-else>
                                {{ tr?.[td.dataIndex] }}
                            </template>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <!-- 配件列表 -->
        <div class="fittings-list">
            <div class="title">
                <span> {{ $t('item-bom.accessories_list') }}</span>
                <div class="btn">
                    <a-button class="download-template" @click="downUploadTemplate">
                        {{ $t('item-bom.download_template') }}
                    </a-button>
                    <!-- <a-button class="bulk-import" @click="importTemplate" >
                        {{ $t('item-bom.bulk_import') }}
                    </a-button> -->

                    <a-upload
                        name="file"
                        class="file-uploader"
                        :file-list="uploadFileObj.fileList"
                        :action="uploadFileObj.action"
                        :show-upload-list="false"
                        :headers="uploadFileObj.headers"
                        :data="{ ...uploadFileObj.data, bom_version_id: bomId }"
                        accept=".xlsx,.xls"
                        @change="importTemplate"
                        ><!-- 
                        <a-button type="primary" ghost class="file-upload-btn">
                        <i class="icon i_add" />{{ $t("i.import") }}
                        </a-button> -->
                        <a-button class="bulk-import">
                            {{ $t('item-bom.bulk_import') }}
                        </a-button>
                    </a-upload>
                </div>
            </div>
            <a-table
                :row-key="record => record.id"
                :data-source="tableData"
                :columns="tableColumns"
                :scroll="{ x: true }"
                :pagination="channelPagination"
                :loading="loading"
                @change="handleTableChange"
            >
                <template #headerCell="{ title, column }">
                    <div class="table-title">{{ title }}</div>
                </template>
                <template #bodyCell="{ column, text, record }">
                    <span v-if="column.key === 'sync_name' /*商品名称*/">
                        <a-tooltip>
                            <template #title>{{ lang === 'zh' ? text : record.item?.name_en || '-' }}</template>
                            <div class="one-spils cursor" :style="{ width: text?.length > 6 ? 7 * 12 + 'px' : '' }">
                                {{ lang === 'zh' ? text : record.item?.name_en || '-' }}
                                <span class="new-version title-right" v-if="record.flag_new === 1 && flagNew === 1">
                                    {{ $t('item-bom.change') }}
                                </span>
                            </div>
                        </a-tooltip>
                    </span>
                    <span v-else-if="column.key === 'sales_area_list' /*销售区域*/">
                        <a-tooltip>
                            <template #title>{{ $Util.getSalesAreaStr(text, lang) || '-' }}</template>
                            <div class="one-spils cursor" :style="{ width: text?.length > 5 ? 6 * 12 + 'px' : '' }">
                                {{ $Util.getSalesAreaStr(text, lang) || '-' }}
                            </div>
                        </a-tooltip>
                    </span>
                    <span v-else-if="column.key === 'bom_category' /*分类*/">
                        <div class="classify-box">
                            <a-tooltip v-if="text" class="left-text">
                                <template #title>{{ lang === 'zh' ? text?.name : text?.name_en || '-' }}</template>
                                <div
                                    class="one-spils cursor"
                                    :style="{ width: text?.name?.length > 6 ? 7 * 12 + 'px' : '' }"
                                >
                                    {{ lang === 'zh' ? text?.name : text?.name_en || '-' }}
                                </div>
                            </a-tooltip>
                            <span class="to-classify" @click="toClassify(record.sync_id)" v-if="record.sync_id">
                                {{ !text ? $t('item-bom.select_grouping') : $t('item-bom.classify_update') }}
                            </span>
                        </div>
                        <!-- <span v-else-if="!text?.name">
                            -
                        </span> -->
                    </span>
                    <span v-else-if="column.key === 'sync_time' /*创建时间*/">
                        {{ $Util.timeFilter(text, 3) }}
                    </span>
                    <span v-else-if="column.key === 'comment' /*备注*/">
                        <a-tooltip>
                            <template #title>{{ text }}</template>
                            <div class="one-spils set-width cursor">
                                {{ text || '-' }}
                            </div>
                        </a-tooltip>
                    </span>
                </template>
            </a-table>
        </div>
        <ExportModal
            v-model:visibility="exportVisibility"
            @setCancleShow="exportVisibility = false"
            :objData="exportObj"
            :versionName="versionName"
            :bom_version_id="bomId"
            @refresh="handleRefresh"
        />
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, getCurrentInstance, computed, reactive, inject, watch } from 'vue';
import Core from '@/core';
import ExportModal from './export-modal.vue';
const classifyShowModal = inject('classifyShowModal');
const emits = defineEmits(['handleRefresh']);
const bomId = ref(0);
const { proxy } = getCurrentInstance();
const loading = ref(false);
const flagNew = ref();
// 解析导入 --  二次弹窗
const exportVisibility = ref(false);
// 导出对象数据--显示在二次弹窗中
const exportObj = ref({});
const versionName = ref('');
const props = defineProps({
    // v-model 绑定值
    activeObj: {
        type: Object,
        default: () => {},
    },

    searchParams: {
        type: Object,
        default: () => {},
    },
});
const uploadFileObj = reactive({
    action: Core.Const.NET.URL_POINT + '/admin/1/aftermarket/bom/parsing-import-file',
    fileList: [],
    headers: {
        ContentType: false,
    },
    data: {
        token: Core.Data.getToken(),
        type: 'xlsx',
    },
});
const isShow = ref(false);
const tableDataChange = ref([]);

const lang = computed(() => {
    return proxy.$store.state.lang;
});
const changeTableColumn = computed(() => {
    let arr = [
        {
            title: proxy.$t('item-bom.ordinal'),
            dataIndex: 'order',
            key: 'order_number',
        },
        {
            title: proxy.$t('item-bom.product_name'),
            dataIndex: 'sync_name',
            key: 'sync_name',
        },
        {
            title: proxy.$t('item-bom.commodity_code'),
            dataIndex: 'sync_id',
            key: 'sync_id',
        },
        {
            title: proxy.$t('item-bom.change_content'),
            dataIndex: 'content',
            key: 'content',
        },
    ];
    return arr;
});
const tableColumns = computed(() => {
    const result = [
        {
            // 商品名称
            title: proxy.$t('item-bom.product_name'),
            dataIndex: 'sync_name',
            key: 'sync_name',
            width: '160px',
        },
        {
            // 商品编码
            title: proxy.$t('item-bom.commodity_code'),
            dataIndex: 'sync_id',
            key: 'sync_id',
        },
        {
            // 分类
            title: proxy.$t('item-bom.select_grouping'),
            dataIndex: 'bom_category',
            key: 'bom_category',
        },
        {
            // 用量
            title: proxy.$t('item-bom.dosage'),
            dataIndex: 'amount',
            key: 'amount',
        },
        // {
        //     // 销售区域
        //     title: proxy.$t('item-bom.sales_area'),
        //     dataIndex: 'sales_area_list',
        //     key: 'sales_area_list',
        // },
        {
            // 创建时间
            title: proxy.$t('item-bom.create_time'),
            dataIndex: 'effective_time',
            key: 'sync_time',
        },
        {
            // 备注
            title: proxy.$t('item-bom.remark'),
            dataIndex: 'comment',
            key: 'comment',
        },
    ];
    return result;
});
const tableData = ref([]);
// 分页
const channelPagination = ref({
    current: 1,
    pageSizeOptions: ['20', '40', '60', '80', '100'],
    pageSize: 20,
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 是否可以改变 pageSize
    total: 0,
    showTotal: total => `${proxy.$t('n.all_total')} ${total} ${proxy.$t('in.total')}`,
});

const expandOrSollapse = () => {
    isShow.value = !isShow.value;
};

// 模态框点击确定的时候
const handleRefresh = () => {
    emits('handleRefresh', props.activeObj);
    refresh();
};

/* const getSalesAreaStr = (arr) => {
    let str = '';
    if(!(arr instanceof Array)) return '-'
    arr?.forEach((item)=>{
        str += (str?',':'')+item[lang.value]
    })
    return str || '-'
} */

// 设变数字对象
const objCount = reactive({
    updateNum: 0,
    addNum: 0,
    deleteNum: 0,
    allNum: 0,
});
onMounted(() => {});

// 下载模板
const downUploadTemplate = () => {
    let exportUrl = Core.Api.Export.downloadTemplate();
    window.open(exportUrl, '_blank');
};

// 导入模板
const importTemplate = ({ file, fileList }) => {
    if (file.status == 'done') {
        if (file.response && file.response.code > 0) {
            return proxy.$message.error(file.response.message);
        } else {
            // Atable.value.handleSearchReset();
            exportVisibility.value = true;
            exportObj.value = {
                correctList: file?.response?.data?.correctList || [],
                statistics: file?.response?.data?.statistics || [],
            };
            // return proxy.$message.success(proxy.$t('pop_up.uploaded'));
        }
    }

    uploadFileObj.fileList = fileList;
};
// 获取设变列表
const getChangeList = () => {
    Core.Api.ITEM_BOM.changeBomList({
        bom_id: bomId.value,
    })
        .then(res => {
            tableDataChange.value = res.list;
        })
        .catch(err => {
            console.log('err', err);
        });
};
const refresh = () => {
    getTableDataFetch();
    getChangeList();
    // if(flagNew.value === 1) isShow.value = true;
    getChangeCount();
};
// 获取设变数值type
const getChangeCount = () => {
    Core.Api.ITEM_BOM.changeCount({
        bom_id: bomId.value,
    })
        .then(res => {
            objCount.allNum = 0;
            if (!res.type_list.length) {
                Object.assign(objCount, { updateNum: 0, addNum: 0, deleteNum: 0, allNum: 0 });
                return;
            }
            res.type_list.forEach(element => {
                if (element.type === 1) {
                    objCount.addNum = element.amount;
                    objCount.allNum += element.amount;
                } else if (element.type === 2) {
                    objCount.deleteNum = element.amount;
                    objCount.allNum += element.amount;
                } else if (element.type === 3) {
                    objCount.updateNum = element.amount;
                    objCount.allNum += element.amount;
                }
            });
        })
        .catch(err => {
            console.log('getChangeCount----err', err);
        });
};

/* Fetch start*/
// 获取表格list
const getTableDataFetch = (parmas = {}) => {
    loading.value = true;
    let obj = {
        // name:'主撑弹簧',
        bom_id: bomId.value,
        page: channelPagination.value.current,
        page_size: channelPagination.value.pageSize,
        ...parmas,
        ...props.searchParams,
    };

    Core.Api.ITEM_BOM.partsList(obj)
        .then(res => {
            channelPagination.value.total = res.count;
            tableData.value = res.list;
        })
        .catch(err => {
            console.log('getTableDataFetch', err);
        })
        .finally(() => {
            loading.value = false;
        });
};
/* Fetch end*/

/* methods start*/
// 分页事件
const handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...channelPagination.value };
    pager.current = pagination.current;
    if (pagination.pageSize !== channelPagination.value.pageSize) {
        pager.current = 1;
        pager.pageSize = pagination.pageSize;
    }
    channelPagination.value = pager;
    getTableDataFetch({
        page_size: channelPagination.value.pageSize,
        page: channelPagination.value.current,
    });
};
/* methods end*/
// 分类弹窗展示
const toClassify = sync_id => {
    classifyShowModal(sync_id);
};
// 监听弹窗关闭-更改父组件prop弹窗显隐值
watch(
    () => props.activeObj,
    (newValue, oldValue) => {
        bomId.value = newValue?.version_id;
        flagNew.value = newValue?.flag_new;
        versionName.value = newValue?.version_name;
        if (newValue && Object.keys(newValue)) {
            refresh();
        }
    },
    { deep: true, immediate: true },
);

watch(
    () => props.searchParams,
    newVal => {
        channelPagination.value.current = 1;
        channelPagination.value.pageSize = 20;
        getTableDataFetch();
    },
    {
        deep: true,
    },
);
defineExpose({
    refresh,
});
</script>

<style lang="less" scoped>
.fittings-two {
    height: 100%;
    .change {
        width: 100%;
        .change-top {
            cursor: pointer;
            background-color: rgba(38, 171, 84, 0.1);
            width: 100%;
            height: 32px;
            display: flex;
            justify-content: space-between;
            padding: 0px 8px 0px 10px;
            box-sizing: border-box;
            align-items: center;
            .left {
                display: flex;
                .left-img {
                    height: 16px;
                    width: 16px;
                    display: inline-block;
                }
                .change-title {
                    color: #26ab54;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 14px;
                    margin-left: 4px;
                }

                .change-text {
                    color: #666;
                    font-size: 14px;
                    font-weight: 400;
                    line-height: 14px; /* 157.143% */
                    margin-left: 10px;
                }
            }

            .right {
                width: 16px;
                height: 16px;
            }
        }
    }

    .fittings-list {
        .title {
            margin: 24px auto 10px;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .btn {
                display: flex;
                .download-template {
                    margin-right: 10px;
                }
            }
        }
    }
    .my-table {
        border: 1px solid #e2e2e2;
        background: #fff;
        width: 100%;
        tr > td,
        th {
            padding: 0px 16px;
            border: 1px solid #e2e2e2;
            text-align: left;
            height: 32px;
            box-sizing: border-box;
        }

        tr > td {
            color: #1d2129;
        }
    }
}
.set-width {
    width: 100px;
}

.to-classify {
    color: #0061ff;
    cursor: pointer;
}
/* 
.back-new {
    background-color: yellow;
    display: inline-block;
    background-image: url(../../../../assets/images/bom/change.png);
} */
.title-right {
    color: #26ab54;
    font-size: 12px;
    font-weight: 400;
    line-height: 12px; /* 100% */
    background-color: rgba(38, 171, 84, 0.1);
    padding: 4px;
    border-radius: 0px 10px 10px 10px;
    display: inline-block;
    position: absolute;
    right: 20px;
}

.table-title {
    color: #1d2129;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 500;
}

.classify-box {
    display: flex;
    .left-text {
        margin-right: 10px;
    }
}
</style>
