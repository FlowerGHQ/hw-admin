<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">
                {{ $t(/*通知及公告*/'operation.notices_title') }}
            </div>
            <div class="btns-area">
                <a-button type="primary">
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
                        {{ record.id }}
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
                        <a-input 
                            :placeholder="$t('operation.input_pla')" 
                            v-model:value="record.sort"
                            @blur="onBlur"
                        />
                    </template>
                    <!-- 操作 -->
                    <template v-if="column.key === 'effective_state'">
                        <div class="effective-state">
                            <a-switch v-model:checked="record.state" size="small"
                                @change="(event) => onSwitch(event, record)" />
                            <div 
                                :class="record.state ? 'switch-state blue' : 'switch-state grey'"
                            >
                                {{ record.state ? $t(/*已生效*/'operation.took_effect') : $t(/*未生效*/'operation.invalid') }}
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
        { title: $t("n.index"), dataIndex: "id", key: "number" },
        { title: $t("operation.title"), dataIndex: "title", key: "item" },
        { title: $t("n.content"), dataIndex: "content", key: "item" },
        { title: $t("n.time"), dataIndex: "create_time", key: "create_time" },
        { title: $t("operation.effective_time"), dataIndex: "effective_time", key: "create_time" },
        { title: $t("operation.area"), dataIndex: "area", key: "item" },
        { title: $t("n.sort"), dataIndex: "sort", key: "input" },
        { title: $t("operation.effective_state"), key: "effective_state", fixed: "right" },
        { title: $t("common.operations"), key: "operations", fixed: "right" },
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
        type: "select",
        value: undefined,
        searchParmas: "area",
        key: 'operation.area',
        selectMap: Core.Const.OPERATION.OPERATION_TYPE,
    },
    {
        type: "select",
        value: undefined,
        searchParmas: "state",
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
        effective_time: 1706685629,
        area: '中国',
        sort: 1,
        state: true,
    },
    {
        id: 2,
        title: '公告标题公告标题公告标题公告标题公告标题',
        create_time: 1706685629,
        content: '公告内容公告内容公告内容公告内容公告内容',
        effective_time: 1706685629,
        area: '中国',
        sort: 2,
        state: false,
    },
    {
        id: 3,
        title: '公告标题公告标题公告标题公告标题公告标题',
        create_time: 1706685629,
        content: '公告内容公告内容公告内容公告内容公告内容',
        effective_time: 1706685629,
        area: '中国',
        sort: 3,
        state: false,
    },
])

onMounted(() => {});
/* Fetch start*/
const request = Core.Api.SUPPLY.adminList;
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
    Core.Api.xxx({
        id: id,
    }).then((res) => {
        console.log('deleteFetch res', res);
        $message.success($t("pop_up.delete_success"))
        searchAllRef.value.handleSearch();
    }).catch(err => {
        console.log('deleteFetch err', err);
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
    searchAllRef.value.handleSearch();
}
const onBlur = () => {
    searchAllRef.value.handleSearch();
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

