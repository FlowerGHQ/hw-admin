<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">
                {{ $t(/*通知及公告*/'operation.notices_title') }}
            </div>
            <div class="btns-area">
                <a-button type="primary" @click="routerChange('add')">
                    {{ $t(/*新增公告*/'operation.new_notice') }}
                </a-button>
            </div>
        </div>
        <!-- search -->
        <div class="search">
            <SearchAll 
                :options="searchList" 
                :isShowMore="false" 
                @search="onSearch" 
                @reset="onReset"
                ref="searchAllRef"
            >
            </SearchAll>
        </div>
        <!-- table -->
        <div class="table-container">
            <a-table :columns="tableColumns" :data-source="_tableData" :scroll="{ x: true }" :loading="loading"
                :row-key="(record) => record.id" :pagination="false">
                <template #bodyCell="{ column, text, record, index }">
                    <!-- 序号 -->
                    <template v-if="column.key === 'number'">
                        {{ index + 1 }}
                    </template>
                    <!-- 公司名称 -->
                    <template v-if="column.key === 'item'">
                        <a-tooltip placement="topLeft">
                            <template #title>{{ text }}</template>
                            <div class="one-spils cursor" :style="{
                                width: text?.length > 15 ? 7 * 12 + 'px' : '',
                            }">
                                {{ text }}
                            </div>
                        </a-tooltip>
                    </template>
                    <!-- 提交时间 -->
                    <template v-if="column.key === 'create_time'">
                        {{ text ? $Util.timeFormat(text) : '-' }}
                    </template>
                    <!-- 排序 -->
                    <template v-if="column.key === 'input'">
                        <a-input-number 
                            :placeholder="$t('operation.input_pla')" 
                            v-model:value="record.sort"
                            @blur="onBlur(record)"
                        />
                    </template>
                    <!-- 操作 -->
                    <template v-if="column.key === 'effective_state'">
                        <div class="effective-state">
                            <a-switch v-model:checked="record.status" size="small"
                                @change="(event) => onSwitch(event, record)" />
                            <div 
                                :class="record.status ? 'switch-state blue' : 'switch-state grey'"
                            >
                                {{ record.status ? $t(/*已生效*/'operation.took_effect') : $t(/*未生效*/'operation.invalid') }}
                            </div>
                        </div>
                    </template>
                    <!-- 操作 -->
                    <template v-if="column.key === 'operations'">
                        <a-button type="link" @click="routerChange('edit', record)">
                            <MySvgIcon icon-class="supply-edit" />
                            <span class="m-l-10">{{ $t('common.edit') }}</span>
                        </a-button>
                        <a-button type="link" @click="handleDelete(record)">
                            <MySvgIcon icon-class="sales-delete" />
                            <span class="m-l-10">{{ $t('def.delete') }}</span>
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
                :show-total="(total) => $t('n.all_total') + ` ${pagination.total} ` + $t('in.total')"
                :hide-on-single-page="false" 
                :pageSizeOptions="['10', '20', '30', '40']" 
                @change="onPageChange"
                @showSizeChange="onSizeChange" 
            />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import Core from "@/core";
import SearchAll from "@/components/horwin/based-on-ant/SearchAll.vue";
import { useTable } from '@/hooks/useTable'
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import MySvgIcon from "@/components/MySvgIcon/index.vue";
const router = useRouter()
const $t = useI18n().t;
const searchAllRef = ref(null)

const tableColumns = computed(() => {
    let columns = [
        { title: $t(/*序号*/"n.index"), dataIndex: "id", key: "number" },
        { title: $t(/*标题*/"operation.title"), dataIndex: "title", key: "item" },
        { title: $t(/*内容*/"n.content"), dataIndex: "content", key: "item" },
        { title: $t(/*创建时间*/"n.time"), dataIndex: "create_time", key: "create_time" },
        { title: $t(/*生效时间*/"operation.effective_time"), dataIndex: "effect_time", key: "create_time" },
        { title: $t(/*区域*/"operation.area"), dataIndex: "area", key: "item" },
        { title: $t(/*排序*/"n.sort"), dataIndex: "sort", key: "input" },
        { title: $t(/*生效状态*/"operation.effective_state"), key: "effective_state", fixed: "right" },
        { title: $t(/*操作*/"common.operations"), key: "operations", fixed: "right" },
    ];
    return columns;
});

const searchList = ref([
    {
        type: "input",
        value: "",
        searchParmas: "title",
        key: 'operation.title'
    },
    {
        type: "input",
        value: "",
        searchParmas: "area",
        key: 'operation.area',
    },
    {
        type: "select",
        value: undefined,
        searchParmas: "status",
        key: 'operation.status',
        selectMap: Core.Const.OPERATION.OPERATION_TYPE,
    },
])
const _tableData = ref([
    {
        id: 1,
        title: '公告标题公告标题公告标题公告标题公告标题',
        create_time: 1706685629,
        content: '公告内容公告内容公告内容公告内容公告内容',
        effect_time: 1706685629,
        area: '中国',
        sort: 1,
        status: true,
    },
    {
        id: 2,
        title: '公告标题公告标题公告标题公告标题公告标题',
        create_time: 1706685629,
        content: '公告内容公告内容公告内容公告内容公告内容',
        effect_time: 1706685629,
        area: '中国',
        sort: 2,
        status: false,
    },
    {
        id: 3,
        title: '公告标题公告标题公告标题公告标题公告标题',
        create_time: 1706685629,
        content: '公告内容公告内容公告内容公告内容公告内容',
        effect_time: 1706685629,
        area: '中国',
        sort: 3,
        status: false,
    },
])

onMounted(() => {
    searchParam.value.type = Core.Const.OPERATION.OPERATION_TYPE_MAP.REPORT
    search()
});
/* Fetch start*/
const request = Core.Api.Operation.list;
const {
    loading,
    tableData,
    pagination,
    search,
    onSizeChange,
    refreshTable,
    onPageChange,
    searchParam,
} = useTable({ request });

const deleteFetch = (id) => {
    Core.Api.Operation.delete({
        id: id,
    }).then((res) => {
        console.log('deleteFetch res', res);
        $message.success($t("pop_up.delete_success"))
        searchAllRef.value.handleSearch();
    }).catch(err => {
        console.log('deleteFetch err', err);
    })       
}

const updateStatusFetch = (record) => {
    Core.Api.Operation.updateStatus({
        id: record.id,
        status: record.status,
        sort: record.sort
    }).then((res) => {
        console.log('updateStatusFetch res', res);
        $message.success($t("p.modify_success"))
        searchAllRef.value.handleSearch();
    }).catch(err => {
        console.log('updateStatusFetch err', err);
    })
}
/* Fetch end*/

/* methods start*/
const onSearch = (data) => {
    searchParam.value = data
    search()
}
const onReset = () => {
    refreshTable()
}
const routerChange = (type, record) => {
    let routeUrl = null
    switch (type) {
        case 'edit':
            routeUrl = router.resolve({
                path: '/operation/report-edit',
                query: {
                    id: record.id,
                }
            })
            window.open(routeUrl.href, '_blank')
            break;
        case 'add':
            router.push({
                path: "/operation/report-edit",                
            });
            break;
    }
}
const handleDelete = (record) => {
    Core.Util.confirm({
        title: $t('pop_up.sure_delete'),
        okText: $t('def.sure'),
        okType: 'danger',
        cancelText: $t('def.cancel'),
		onOk: () => {
			deleteFetch(record.id)
		},
	})   
}
const onSwitch = (e, record) => {
    updateStatusFetch(record);
}
const onBlur = (record) => {
    updateStatusFetch(record);
}
/* methods end*/
</script>

<style lang="less" scoped>
.list-container {
    .title-container {
        .title-area {
            color: #1D2129;
            font-size: 18px;
            font-weight: 600;
        }
    }

    .effective-state {
        display: flex;
        align-items: center;

        .switch-state {
            color: #8E8E8E;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            margin-left: 4px;

            &.blue {
                color: #0061FF;
            }

            &.grey {
                color: #8E8E8E;
            }
        }
    }
}
</style>

