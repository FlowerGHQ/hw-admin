<template>
    <div class="sales-strategy-list">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('sales-strategy-management.sales_strategy') }}</div>
            </div>
            <div class="search-container">
                <SearchAll
                    :options="searchList"
                    @search="getSearchFrom"
                    @reset="handleSearchReset"
                    :isShowMore="false"
                />
            </div>
            <div class="operate-container">
                <a-button type="primary" @click="addStrategy">
                    {{ $t('sales-strategy-management.add_strategy') }}
                </a-button>
            </div>
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
                        <template v-if="column.dataIndex === 'serial_number'">
                            {{ (pagination.current - 1) * pagination.size + index + 1 }}
                        </template>
                        <!-- 策略名称 -->
                        <template v-if="column.dataIndex === 'name'">
                            <!-- 超过5个字符 -->
                            <div class="strategy_name-cell" v-if="text && text.length > 5">
                                <a-tooltip placement="topLeft" :title="text">
                                    {{ text }}
                                </a-tooltip>
                            </div>
                            <div class="strategy_name-cell-common" v-else>
                                {{ text }}
                            </div>
                        </template>
                        <!-- 赠送规则 -->
                        <template v-if="column.dataIndex === 'rule'">
                            <!-- {{
                                record.type == 1
                                
                                    ? `【每满送】 起送门槛【${record.rule.quantity_min}】 每满${record.rule.quantity_every}送${record.rule.quantity_bonus}`
                                    : record.type == 2
                                      ? `【整单送】 起送门槛【${record.rule.quantity_min}】 达到起送门槛后,赠送${record.rule.quantity_bonus}`
                                      : '-'
                            }} -->
                            <div class="type_one" v-if="record.type == 1">
                                <span class="area">每满送</span>
                                起送门槛
                                <span class="area">{{ record.rule.quantity_min }}</span
                                >, 每满
                                <span class="area">{{ record.rule.quantity_every }}</span>
                                赠送
                                <span class="area">{{ record.rule.quantity_bonus }} </span>
                            </div>
                            <div class="type_two" v-else>
                                <span class="area">整单送</span>
                                起送门槛
                                <span class="area">{{ record.rule.quantity_min }}</span>
                                达到起送门槛后,赠送
                                <span class="area">{{ record.rule.quantity_bonus }}</span>
                            </div>
                        </template>
                        <!-- 地区赠品 -->
                        <template v-if="column.dataIndex === 'area_and_gift'">
                            <div class="area-gift-content">
                                <a-tooltip placement="topLeft">
                                    <template #title>
                                        <div v-for="(item, index) in record.strategy_detail" :key="item.id">
                                            <span
                                                class="area"
                                                :style="{
                                                    'margin-right': '8px',
                                                }"
                                                >{{ item.country }}</span
                                            >
                                            <span class="gift">
                                                {{ reFormartGift(item.item) }}
                                            </span>
                                        </div>
                                    </template>
                                    <span
                                        class="area-gift-content-item"
                                        v-for="(item, index) in record.strategy_detail"
                                        :key="item.id"
                                    >
                                        <span class="area">{{ item.country }}</span>
                                        <span class="gift">
                                            {{ reFormartGift(item.item) }}
                                        </span>
                                    </span>
                                </a-tooltip>
                            </div>
                        </template>
                        <!-- 创建时间 -->
                        <template v-if="column.dataIndex === 'create_time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <!-- 生效状态 -->
                        <template v-if="column.dataIndex === 'status'">
                            <!--switch  -->
                            <a-switch
                                :checked="text == 1"
                                :loading="switchLoading"
                                @change="onSwitchChange(record)"
                                class="status"
                            />
                            <span :class="text == 1 ? 'active' : 'none'">
                                {{
                                    text == 1
                                        ? $t('sales-strategy-management.already_in_effect')
                                        : $t('sales-strategy-management.not_yet')
                                }}
                            </span>
                        </template>
                        <!-- 操作 -->
                        <template v-if="column.dataIndex === 'operation'">
                            <div class="operation">
                                <!-- 查看 -->
                                <a-button type="link" @click="handleDetails(record)">
                                    <MySvgIcon icon-class="sales-see" />
                                    {{ $t('def.see') }}
                                </a-button>
                                <!-- 编辑 -->
                                <a-button type="link" @click="hanleEdit(record)">
                                    <MySvgIcon icon-class="sales-edit" />
                                    {{ $t('def.edit') }}
                                </a-button>
                                <!-- 删除 -->
                                <a-button type="link" @click="handleDelete(record)">
                                    <MySvgIcon icon-class="sales-delete" />
                                    {{ $t('def.delete') }}
                                </a-button>
                            </div>
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
        </div>
    </div>
</template>

<script setup>
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import MySvgIcon from '@/components/MySvgIcon/index.vue';
import Core from '../../core';
import { ref, computed, onMounted } from 'vue';
// 使用useTable
import { useTable } from '@/hooks/useTable';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { message, Modal } from 'ant-design-vue';
import _ from 'lodash';
const $router = useRouter();
const $t = useI18n().t;
const $i18n = useI18n();
const $message = message;
const $confirm = Modal.confirm;
// VITE 引入json数据
import COUNTYR from '@/assets/js/address/countries.json';

// hooks
const request = Core.Api.SALES_STRATEGY.list;
// 重构数据
const viewData = (arr, type) => {
    // 处理成表格数据
    // 相同no 并且 相同country的数据的 item数据合并
    let newArr = [];
    arr.forEach(item => {
        let obj = {};
        // 是否有相同的no和country
        let isSame = newArr.some(i => {
            return i.no == item.no && i.country == item.country;
        });
        // 如果有相同的no和country，就把item合并
        if (isSame) {
            newArr.forEach(i => {
                if (i.no == item.no && i.country == item.country) {
                    i.item = [...i.item, item.item];
                    i.id = [i.id, item.id].join(',');
                }
            });
        } else {
            obj.type = type;
            obj.id = item.id.toString();
            obj.no = item.no;
            obj.country = item.country;
            obj.item = [item.item];
            obj.rule = item.rule;
            newArr.push(obj);
        }
    });
    newArr.forEach((item, index) => {
        item.serial_number = index + 1;
    });
    return newArr;
};
// 重构展示地区与赠品
const reFormartGift = arr => {
    return $i18n.locale.value == 'zh'
        ? arr.map(i => i.name || '-').join('、')
        : arr.map(i => i.name_en || '-').join('、');
};
const dataCallBack = res => {
    let data = res.list;
    console.log('处理前的数据', data);
    data.forEach(item => {
        item.strategy_detail = viewData(item.strategy_detail, item.type);
        if (item.rule && typeof item.rule == 'string') {
            item.rule = JSON.parse(item.rule);
        }
        return item;
    });
    console.log('处理后的数据', data);
    return data;
};

const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request,
    dataCallBack,
});

// data
const tableColumns = computed(() => {
    let columns = [
        {
            // 序号
            title: $t('sales-strategy-management.serial_number'),
            dataIndex: 'serial_number',
            width: 80,
            fixed: 'left',
        },
        {
            // 策略名称
            title: $t('sales-strategy-management.strategy_name'),
            dataIndex: 'name',
            key: 'name',
        },

        // 赠送规则
        {
            title: $t('sales-strategy-management.gift_rule'),
            dataIndex: 'rule',
            key: 'rule',
        },
        // 地区与赠品
        {
            title: $t('sales-strategy-management.area_and_gift'),
            dataIndex: 'area_and_gift',
            key: 'area_and_gift',
            width: 620,
        },
        // 创建时间
        {
            title: $t('sales-strategy-management.creation_time'),
            dataIndex: 'create_time',
            key: 'create_time',
        },
        // 生效状态
        {
            title: $t('sales-strategy-management.effective_status'),
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: $t('sales-strategy-management.operation'),
            dataIndex: 'operation',
            key: 'operation',
            fixed: 'right',
            width: 200,
        },
    ];
    return columns;
});

const CountryData = computed(() => {
    let arr = [];
    COUNTYR.forEach(item => {
        arr.push({
            label: $i18n.locale.value == 'zh' ? item.name : item.name_en,
            value: item.name,
        });
    });
    return arr;
});

const searchList = ref([
    {
        id: 0,
        type: 'input',
        value: '',
        searchParmas: 'name',
        key: 'sales-strategy-management.strategy_name',
    }, // 名称
    {
        id: 2, // 随意
        type: 'select-search-multiple', // 类型
        key: 'sales-strategy-management.area', // 名称
        value: undefined, // 绑定值
        searchParmas: 'country_list', // 返回的搜索名称
        multiple: true, // 是否多选
        selectMap: CountryData,
        placeholder: 'def.select',
    },
]);
const switchLoading = ref(false);

// methods
const getSearchFrom = data => {
    searchParam.value = data;
    search();
};
const onSwitchChange = record => {
    // 0 停用   1 启用
    let request = record.status == 1 ? Core.Api.SALES_STRATEGY.disable : Core.Api.SALES_STRATEGY.enable;
    console.log(record);
    request({
        id: record.id,
    })
        .then(res => {
            refreshTable();
        })
        .catch(err => {
            console.log(err);
        });
};
const handleSearchReset = () => {
    refreshTable();
};
// 查看
const handleDetails = record => {
    $router.push({
        path: '/sales-strategy-management/sales-strategy-edit',
        query: {
            id: record.id,
            type: 'details',
        },
    });
};
// 编辑
const hanleEdit = record => {
    $router.push({
        path: '/sales-strategy-management/sales-strategy-edit',
        query: {
            id: record.id,
            type: 'edit',
        },
    });
};
// 删除
const handleDelete = record => {
    $confirm({
        title: '确定要删除该策略吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
            Core.Api.SALES_STRATEGY.delete({
                id: record.id,
            })
                .then(res => {
                    refreshTable();
                })
                .catch(err => {
                    console.log(err);
                });
        },
    });
};

const addStrategy = () => {
    $router.push({
        path: '/sales-strategy-management/sales-strategy-edit',
        query: {
            type: 'add',
        },
    });
};

// onMounted
onMounted(() => {
    Core.Data.clearSalesData();
});
</script>

<style lang="less" scoped>
.sales-strategy-list {
    .search-container {
        padding: 0;
    }
}
:deep(.ant-table-cell) {
    color: #1d2129;
    .strategy_name-cell {
        width: 100px;
        // 超出隐藏
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
    }
    .area-gift-content {
        cursor: pointer;
        // 下面的span
        > span {
            display: inline-block;
            width: 600px;
            // 超出隐藏
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .area-gift-content-item {
            display: inline-flex;
            margin-right: 8px;
            .area {
                display: flex;
                height: 24px;
                padding: 2px 4px;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
                background: #f2f3f5;
                margin-right: 8px;
                float: left;
            }
            .gift {
                line-height: 24px;
            }
            &:last-child {
                margin-right: 0;
            }
        }
    }
    .type_one,
    .type_two {
        display: flex;
        align-items: center;
        .area {
            display: flex;
            height: 24px;
            padding: 2px 4px;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            background: #f2f3f5;
            margin: 0 8px;
            float: left;
        }
    }
    .operation {
        display: flex;
        align-items: center;
        .ant-btn {
            display: flex;
            align-items: center;
            font-size: 14px;
            .svg-icon {
                font-size: 16px !important;
                margin-right: 4px;
            }
        }
    }
    .none,
    .active {
        font-size: 14px;
        line-height: 22px; /* 157.143% */
        margin-left: 4px;
    }
    .none {
        color: #8e8e8e;
    }
    .active {
        color: #0061ff;
    }
}
:deep(.ant-switch-checked) {
    background-color: #0061ff;
}
</style>
