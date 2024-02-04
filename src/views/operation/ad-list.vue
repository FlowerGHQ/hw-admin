<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">
                {{ $t(/*广告位管理*/'operation.ad_management') }}
            </div>
            <div class="btns-area">
                <a-button type="primary" @click="routerChange('add')">
                    {{ $t(/*新增广告位*/'operation.add_ad') }}
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
            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }" :loading="loading"
                :row-key="(record) => record.id" :pagination="false">
                <template #headerCell="{ column }">
                    <!-- 排序 -->
                    <template v-if="column.key === 'input'">
                        {{ column.title }}
                        <a-tooltip>
                            <template #title>{{ $t('operation.input_pla') }}</template>
                            <MySvgIcon icon-class="info" class-name="icon-info" />
                        </a-tooltip>
                    </template>
                </template>
                <template #bodyCell="{ column, text, record, index }">
                    <!-- 序号 -->
                    <template v-if="column.key === 'number'">
                        {{ index + 1 }}
                    </template>
                    <template v-if="column.key === 'item'">
                        <a-tooltip placement="topLeft">
                            <template #title>{{ text || '-' }}</template>
                            <div class="one-spils cursor" :style="{
                                width: text?.length > 15 ? 7 * 12 + 'px' : '',
                            }">
                                {{ text || '-' }}
                            </div>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'area'">
                        <span v-if="record.area_type === Core.Const.OPERATION.AREA_TYPE_MAP.ALL">{{ $t('common.all') }}</span>
                        <span v-else>
                            <a-tooltip placement="topLeft">
                                <template #title>{{ text }}</template>
                                <div class="one-spils cursor" :style="{
                                    width: text.length > 20 ? 18 + 'rem' : '',
                                }">
                                    {{ text }}
                                </div>
                            </a-tooltip>
                        </span>
                    </template>
                    <!-- 提交时间 -->
                    <template v-if="column.key === 'create_time'">
                        {{ text ? $Util.timeFormat(text) : '-' }}
                    </template>
                    <!-- 图片 -->
                    <template v-if="column.key === 'img'">
                        <div class="table-img">
                            <a-image 
                                style="border-radius: 4px; cursor: pointer;" 
                                :width="96" 
                                :height="36" 
                                :src="$Util.imageFilter(record ? getImagePath(record) : '')"
                            />
                        </div>
                    </template>
                    <!-- 排序 -->
                    <template v-if="column.key === 'input'">
                        <a-input-number
                            style="width: 110px;"
                            :placeholder="$t('common.please_enter')" 
                            v-model:value="record.sort"
                            @blur="onBlur(record)"
                            :min="1" 
                            :precision="0"
                        />
                    </template>
                    <!-- 操作 -->
                    <template v-if="column.key === 'effective_state'">
                        <div class="effective-state">
                            <a-switch
                                :checkedValue="1"
                                :unCheckedValue="2"
                                v-model:checked="record.status" 
                                size="small"
                                @change="(event) => onSwitch(event, record)" 
                            />
                            <div 
                                :class="record.status === 1 ? 'switch-state blue' : 'switch-state grey'"
                            >
                                {{ record.status === 1 ? $t(/*已生效*/'operation.took_effect') : $t(/*未生效*/'operation.invalid') }}
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
import { onMounted, ref, computed, getCurrentInstance } from "vue";
import Core from "@/core";
import SearchAll from "@/components/horwin/based-on-ant/SearchAll.vue";
import { useTable } from '@/hooks/useTable'
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import MySvgIcon from "@/components/MySvgIcon/index.vue";
const router = useRouter()
const $t = useI18n().t;
const searchAllRef = ref(null)
const { proxy } = getCurrentInstance();

const tableColumns = computed(() => {
    let columns = [
        { title: $t(/*序号*/"n.index"), dataIndex: "id", key: "number" },
        { title: $t(/*说明*/"operation.instructions"), dataIndex: "img_desc", key: "item" },
        { title: $t(/*创建时间*/"n.time"), dataIndex: "create_time", key: "create_time" },
        { title: $t(/*生效时间*/"operation.effective_time"), dataIndex: "effect_time", key: "create_time" },
        { title: $t(/*banner*/"operation.banner_pic"), dataIndex: "img", key: "img" },
        { title: $t(/*区域*/"operation.area"), dataIndex: "area", key: "area" },
        // { title: $t(/*排序*/"n.sort"), dataIndex: "sort", key: "item" },
        { title: $t(/*排序*/"n.sort"), dataIndex: "sort", key: "input" },
        { title: $t(/*链接*/"operation.link"), dataIndex: "url", key: "item" },
        { title: $t(/*生效状态*/"operation.effective_state"), key: "effective_state", fixed: "right" },
        { title: $t(/*操作*/"common.operations"), key: "operations", fixed: "right" },
    ];
    return columns;
});

const searchList = ref([
    {
        type: "input",
        value: "",
        searchParmas: "img_desc",
        key: 'operation.instructions'
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

onMounted(() => {
});
/* Fetch start*/
const request = Core.Api.Operation.list;
const dataCallBack = (res) => {// 处理数据
    return res.list.map(item => {
        item.old_sort = Core.Util.deepCopy(item.sort)
        return item
    })
}
const {
    loading,
    tableData,
    pagination,
    search,
    onSizeChange,
    refreshTable,
    onPageChange,
    searchParam,
} = useTable({ request, initParam: { type: Core.Const.OPERATION.OPERATION_TYPE_MAP.AD }, dataCallBack: dataCallBack });

const deleteFetch = (id) => {
    Core.Api.Operation.delete({
        id: id,
    }).then((res) => {
        searchAllRef.value.handleSearch();
        console.log('deleteFetch res', res);
        proxy.$message.success($t("pop_up.delete_success"))
    }).catch(err => {
        console.log('deleteFetch err', err);
    })       
}

const updateStatusFetch = (record, type) => {
    Core.Api.Operation.updateStatus({
        id: record.id,
        status: record.status,
        sort: record.sort
    }).then((res) => {
        searchAllRef.value.handleSearch();
        console.log('updateStatusFetch res', res);
        if(record.status === 1 && type === 'switch') {
            proxy.$message.success($t("operation.ad_success_tip"))
        }
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
    switch (type) {
        case 'edit':
            router.push({
                path: '/operation/ad-edit',
                query: {
                    id: record.id,
                }
            })
            break;
        case 'add':
            router.push({
                path: "/operation/ad-edit",                
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
    updateStatusFetch(record, 'switch');
}
const onBlur = (record) => {
    if(!record.sort) {
        // 如果输入为空则赋值之前的排序
        record.sort = record.old_sort
    }
    updateStatusFetch(record, 'input');
}
const getImagePath = (record) => {
    if (record && record.img) {
        const images = JSON.parse(record.img);
        if (images.length > 0) {
            return images[0].path;
        }
    }
    return '';
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

