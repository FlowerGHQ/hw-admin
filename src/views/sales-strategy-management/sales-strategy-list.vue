<template>
    <div class="sales-strategy-list">
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
                        <template v-if="column.dataIndex === 'strategy_name'">
                            <!-- 超过5个字符 -->
                            <div
                                class="strategy_name-cell"
                                v-if="text.length > 8">
                                <a-tooltip placement="topLeft" :title="text">
                                    {{ text }}
                                </a-tooltip>
                            </div>
                            <div class="strategy_name-cell-common" v-else>
                                {{ text }}
                            </div>
                        </template>
                        <!-- 地区赠品 -->
                        <template v-if="column.dataIndex === 'area_and_gift'">
                            <div
                                class="area-gift-content"
                                v-if="record.area_and_gift.length >= 3">
                                <a-tooltip 
                                    placement="topLeft" 
                                    :getPopupContainer="trigger => trigger.parentNode"
                                >
                                   <template #title>
                                        <div>
                                            <div v-for="(item, index) in record.area_and_gift" :key="index">
                                                <span class="area">{{ item.area }}</span>
                                                <span class="gift">{{ item.gift }}</span>
                                            </div>
                                        </div>
                                   </template>
                                    <div
                                        class="area-gift-content-item"
                                        v-for="(item, index) in getAreaAndGift(record.area_and_gift)"
                                        :key="item">
                                        <span class="area">{{ item.area }}</span>
                                        <span class="gift">{{ item.gift }}</span>
                                    </div>
                                </a-tooltip>
                            </div>
                            <div class="area-gift-content-common" v-else>
                                <div
                                    class="area-gift-content-common-item"
                                    v-for="(item, index) in record.area_and_gift"
                                    :key="index">
                                    <span  class="area">{{ item.area }}</span>
                                    <span class="gift">{{ item.gift }}</span>
                                </div>
                            </div>
                        </template>
                        <!-- 生效状态 -->
                        <template v-if="column.dataIndex === 'effective_status'">
                             <!--switch  -->
                            <a-switch
                                :checked="text == 1"
                                :loading="switchLoading"
                                @change="onSwitchChange(record)"
                            />
                        </template>
                        <!-- 操作 -->
                        <template v-if="column.dataIndex === 'operation'">
                            <!-- 删除 -->
                            <a-button type="link" >
                                <i class="icon i_delete"/>
                                {{ $t('def.delete') }}
                            </a-button>
                            <!-- 查看 -->
                            <a-button type="link" >
                                <i class="icon i_eyes"/>
                                {{ $t('def.see') }}
                            </a-button>
                            <!-- 编辑 -->
                            <a-button type="link" >
                                <i class="icon i_edit"/>
                                {{ $t('def.edit') }}
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
import Core from "../../core";
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
// 使用useTable
import { useTable } from "@/hooks/useTable";
import { useI18n } from "vue-i18n";
import {useRouter} from "vue-router";
import _ from "lodash";
const $router = useRouter();
const $t = useI18n().t;
const $i18n = useI18n();
// hooks
const request = () =>
    new Promise((resolve, reject) => {
        let arr = [];
        for (let i = 0; i < 10; i++) {
            arr.push({
                id: 1,
                strategy_name:"SK1系列说明书、充电线配置",
                gift_rule: "【每满送】起送门槛10，每满10送1",
                area_and_gift:[
                    {
                        area: "美国",
                        gift: "说明书（45435435454）",
                    },
                    {
                        area: "英国",
                        gift: "说明书（45435435454）",
                    },
                    {
                        area: "中国",
                        gift: "说明书（45435435454）",
                    },
                    {
                        area: "俄罗斯",
                        gift: "说明书（45435435454）",
                    },
                   
                ],
                creation_time: "2023.11.12 15:00:00",
                effective_status: i % 2 == 0 ? 1 : 0,
            });
        }
        setTimeout(() => {
            resolve({
                count: 10,
                list: arr,
            });
        }, 1000);
    });
const {
    loading,
    tableData,
    pagination,
    search,
    onSizeChange,
    refreshTable,
    onPageChange,
    searchParam,
} = useTable({ request ,isPageAble:false});

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
            dataIndex: "strategy_name",
            key: "strategy_name",
        },
        // 赠送规则
        {
            title: $t("sales-strategy-management.gift_rule"),
            dataIndex: "gift_rule",
            key: "gift_rule",
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
            dataIndex: "creation_time",
            key: "creation_time",
        },
        // 生效状态
        {
            title: $t("sales-strategy-management.effective_status"),
            dataIndex: "effective_status",
            key: "effective_status",
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

const searchList = ref([
    {
        id: 0,
        type: "input",
        value: "",
        searchParmas: "strategy_name",
        key: "sales-strategy.strategy_name",
    }, // 名称
    {
        id: 2, // 随意
        type: "select-search-multiple", // 类型
        key: "sales-strategy.area", // 名称
        value: undefined, // 绑定值
        searchParmas: "area", // 返回的搜索名称
        multiple:true, // 是否多选
        selectMap: [
            {
                label: $i18n.locale.value == "zh" ? "美国" : "US",
                value: 1, // a-select-option 中的 :value="item.value"  // 固定的
            },
            {
                label: $i18n.locale.value == "zh" ? "英国" : "UK",
                value: 2, // a-select-option 中的 :value="item.value"  // 固定的
            },
            {
                label: $i18n.locale.value == "zh" ? "中国" : "China",
                value: 3, // a-select-option 中的 :value="item.value"  // 固定的
            },
            {
                label: $i18n.locale.value == "zh" ? "俄罗斯" : "Russia",
                value: 4, // a-select-option 中的 :value="item.value"  // 固定的
            },
        ],
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
    }else{
        returnArr = arr;
    }
    return returnArr;
};

const getSearchFrom = (data) => {
    console.log(data);
};
const onSwitchChange = (record) => {
    console.log(record);
};
const addStrategy = () => {
    $router.push('/sales-strategy-management/sales-strategy-edit')
};
</script>

<style lang="less" scoped>
.sales-strategy-list {
    .search-container {
        padding: 0;
    }
}
:deep(.ant-table-cell) {
    color: #1D2129;

    .strategy_name-cell {
        width: 100px;
        // 超出隐藏
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
    }
    .area-gift-content-common{
        display: flex;
        align-items: center;
        .area-gift-content-common-item{
            margin-right: 8px;
            display: flex;
            align-items: center;
            .area{
                display: flex;
                height: 24px;
                padding: 2px 4px;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
                background: #F2F3F5;
                margin-right: 8px;
            }
            &:last-child{
                margin-right: 0;
            }
           
        }    
    }
    .area-gift-content{
        cursor: pointer;
        > span{
            display: flex;
            .area-gift-content-item{
                margin-right: 8px;
                vertical-align: middle;
                .area{
                    display: flex;
                    height: 24px;
                    padding: 2px 4px;
                    justify-content: center;
                    align-items: center;
                    border-radius: 4px;
                    background: #F2F3F5;
                    margin-right: 8px;
                    float: left;
                }
                .gift{
                    line-height: 24px;
                }
                &:last-child{
                    margin-right: 0;
                    width: 100px;
                    // 超出隐藏
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
}
</style>
