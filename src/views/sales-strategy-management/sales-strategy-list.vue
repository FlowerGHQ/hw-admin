<template>
    <div class="sales-strategy-list" ref="salesStrategyRef">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">销售策略</div>
            </div>
            <div class="search-container">
                <SearchAll
                    :options="searchList"
                    @search="getSearchFrom"
                    @reset="handleSearchReset"
                    :isShowMore="false" />
            </div>
            <div class="operate-container">
                <a-button type="primary" @click="addStrategy">
                    新增策略
                </a-button>
            </div>
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :loading="loading"
                    :row-key="(record) => record.id"
                    :pagination="false">
                    <template #bodyCell="{ column, text, record, index }">
                        <!-- 
                            序号的计算方式:当前的页数-1*每页的条数+当前的索引+1
                         -->
                        <template v-if="column.dataIndex === 'serial_number'">
                            {{
                                (pagination.current - 1) * pagination.size +
                                index +
                                1
                            }}
                        </template>
                        <!-- 策略名称 -->
                        <template v-if="column.dataIndex === 'name'">
                            <!-- 超过5个字符 -->
                            <div
                                class="strategy_name-cell"
                                v-if="text && text.length > 5">
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
                            {{
                                record.type == 1
                                    ? `起送门槛【${record.rule.quantity_min}】 每满${record.rule.quantity_every}送${record.rule.quantity_bonus}`
                                    : record.type == 1
                                    ? `起送门槛【${record.rule.quantity_min}】 达到起送门槛后,赠送${record.rule.quantity_bonus}`
                                    : "-"
                            }}
                        </template>
                        <!-- 地区赠品 -->
                        <template v-if="column.dataIndex === 'area_and_gift'">
                            <!-- 大于3个 -->
                            <div
                                class="area-gift-content"
                                v-if="
                                    record.strategy_detail &&
                                    record.strategy_detail.length >= 3
                                ">
                                <a-tooltip
                                    placement="topLeft"
                                    :getPopupContainer="
                                        getPopupContainer
                                    ">
                                    <template #title>
                                        <div>
                                            <div
                                                v-for="(
                                                    item, index
                                                ) in record.strategy_detail"
                                                :key="index">
                                                <span class="area">{{
                                                    item.country
                                                }}</span>
                                                &nbsp;&nbsp;
                                                <span class="gift">
                                                    {{
                                                        item?.item
                                                            ? $i18n.locale
                                                                  .value == "zh"
                                                                ? item?.item
                                                                      ?.name
                                                                : item?.item
                                                                      ?.name_en
                                                            : ""
                                                    }}
                                                </span>
                                            </div>
                                        </div>
                                    </template>
                                    <div
                                        class="area-gift-content-item"
                                        v-for="(item, index) in getAreaAndGift(
                                            record.strategy_detail
                                        )"
                                        :key="item">
                                        <span class="area">{{
                                            item.country
                                        }}</span>
                                        <span class="gift">
                                            {{
                                                item?.item
                                                    ? $i18n.locale.value == "zh"
                                                        ? index == 2 ? item?.item?.name +'...': item?.item?.name
                                                        : index === 2 ? item?.item?.name_en+'...': item?.item?.name_en
                                                    : ""
                                                   
                                            }}
                                        </span>
                                    </div>
                                </a-tooltip>
                            </div>
                            <div class="area-gift-content-common" v-else>
                                <div
                                    class="area-gift-content-common-item"
                                    v-for="(
                                        item, index
                                    ) in record.area_and_gift"
                                    :key="index">
                                    <span class="area">{{ item.area }}</span>
                                    <span class="gift">{{
                                        item?.item
                                            ? $i18n.locale.value == "zh"
                                                ? item?.item?.name
                                                : item?.item?.name_en
                                            : ""
                                    }}</span>
                                </div>
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
                                @change="onSwitchChange(record)" />
                        </template>
                        <!-- 操作 -->
                        <template v-if="column.dataIndex === 'operation'">
                            <div class="operation">
                                <!-- 查看 -->
                                <a-button
                                    type="link"
                                    @click="handleDetails(record)">
                                    <MySvgIcon icon-class="sales-see" />
                                    {{ $t("def.see") }}
                                </a-button>
                                <!-- 编辑 -->
                                <a-button
                                    type="link"
                                    @click="hanleEdit(record)">
                                    <MySvgIcon icon-class="sales-edit" />
                                    {{ $t("def.edit") }}
                                </a-button>
                                <!-- 删除 -->
                                <a-button
                                    type="link"
                                    @click="handleDelete(record)">
                                    <MySvgIcon icon-class="sales-delete" />
                                    {{ $t("def.delete") }}
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
                    :show-total="
                        (total) =>
                            $t('n.all_total') +
                            ` ${pagination.total} ` +
                            $t('in.total')
                    "
                    :hide-on-single-page="false"
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="onPageChange"
                    @showSizeChange="onSizeChange" />
            </div>
        </div>
    </div>
</template>

<script setup>
import SearchAll from "@/components/common/SearchAll.vue";
import MySvgIcon from "@/components/MySvgIcon/index.vue";
import Core from "../../core";
import { ref, computed } from "vue";
// 使用useTable
import { useTable } from "@/hooks/useTable";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import _ from "lodash";
const $router = useRouter();
const $t = useI18n().t;
const $i18n = useI18n();
// VITE 引入json数据
import COUNTYR from "@/assets/js/address/countries.json";

const salesStrategyRef = ref(null);

// hooks
const request = Core.Api.SALES_STRATEGY.list;
const dataCallBack = (res) => {
    let data = res.list;
    data.forEach((item) => {
        if (item.rule && typeof item.rule == "string") {
            item.rule = JSON.parse(item.rule);
        }
        return item;
    });
    console.log(data);
    return data;
};

const {
    loading,
    tableData,
    pagination,
    search,
    onSizeChange,
    refreshTable,
    onPageChange,
    searchParam,
} = useTable({ request, dataCallBack });

// data
const tableColumns = computed(() => {
    let columns = [
        {
            // 序号
            title: $t("sales-strategy-management.serial_number"),
            dataIndex: "serial_number",
            width: 80,
            fixed: "left",
        },
        {
            // 策略名称
            title: $t("sales-strategy-management.strategy_name"),
            dataIndex: "name",
            key: "name",
        },
        // 赠送规则
        {
            title: $t("sales-strategy-management.gift_rule"),
            dataIndex: "rule",
            key: "rule",
        },
        // 地区与赠品
        {
            title: $t("sales-strategy-management.area_and_gift"),
            dataIndex: "area_and_gift",
            key: "area_and_gift",
        },
        // 创建时间
        {
            title: $t("sales-strategy-management.creation_time"),
            dataIndex: "create_time",
            key: "create_time",
        },
        // 生效状态
        {
            title: $t("sales-strategy-management.effective_status"),
            dataIndex: "status",
            key: "status",
        },
        {
            title: $t("sales-strategy-management.operation"),
            dataIndex: "operation",
            key: "operation",
            fixed: "right",
            width: 200,
        },
    ];
    return columns;
});
const getPopupContainer = ()=>{
    return salesStrategyRef.value
}
const CountryData = computed(() => {
    let arr = [];
    COUNTYR.forEach((item) => {
        arr.push({
            label: $i18n.locale.value == "zh" ? item.name : item.name_en,
            value: item.code,
        });
    });
    return arr;
});

const searchList = ref([
    {
        id: 0,
        type: "input",
        value: "",
        searchParmas: "name",
        key: "sales-strategy.strategy_name",
    }, // 名称
    {
        id: 2, // 随意
        type: "select-search-multiple", // 类型
        key: "sales-strategy.area", // 名称
        value: undefined, // 绑定值
        searchParmas: "country_list", // 返回的搜索名称
        multiple: true, // 是否多选
        selectMap: CountryData,
        placeholder: "def.select",
    },
]);
const switchLoading = ref(false);

// methods

// 截取前三个
const getAreaAndGift = (data) => {
    let arr = _.cloneDeep(data);
    let returnArr = [];
    if (arr.length >= 3) {
        returnArr = arr.splice(0, 3);
    } else {
        returnArr = arr;
    }
    return returnArr;
};
const getSearchFrom = (data) => {
    searchParam.value = data;
    search();
};
const onSwitchChange = (record) => {
    // 0 停用   1 启用
    let request =
        record.status == 1
            ? Core.Api.SALES_STRATEGY.disable
            : Core.Api.SALES_STRATEGY.enable;
    console.log(record);
    request({
        id: record.id,
    })
        .then((res) => {
            refreshTable();
        })
        .catch((err) => {
            console.log(err);
        });
};
const handleSearchReset = () => {
    refreshTable();
};
// 查看
const handleDetails = (record) => {
    $router.push({
        path: "/sales-strategy-management/sales-strategy-edit",
        query: {
            id: record.id,
            type:'details'
        },
    });
};
// 编辑
const hanleEdit = (record) => {
    $router.push({
        path: "/sales-strategy-management/sales-strategy-edit",
        query: {
            id: record.id,
            type:'edit'
        },
    });
};
// 删除
const handleDelete = (record) => {
    this.$confirm({
        title: "确定要删除该策略吗？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
            Core.Api.SALES_STRATEGY.delete({
                id: record.id,
            })
                .then((res) => {
                    refreshTable();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    });
};

const addStrategy = () => {
    $router.push({
        path:"/sales-strategy-management/sales-strategy-edit",
        query: {
            type:'add'
        },
    });
};
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
    .area-gift-content-common {
        display: flex;
        align-items: center;
        .area-gift-content-common-item {
            margin-right: 8px;
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
                margin-right: 8px;
            }
            &:last-child {
                margin-right: 0;
            }
        }
    }
    .area-gift-content {
        cursor: pointer;
        > span {
            display: flex;
            .area-gift-content-item {
                margin-right: 8px;
                vertical-align: middle;
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
    }
    .operation {
        display: flex;
        align-items: center;
        .ant-btn {
            display: flex;
            align-items: center;
            font-size: 14px;
            .svg-icon {
                font-size: 16px;
                margin-right: 8px;
            }
        }
    }
}
</style>
