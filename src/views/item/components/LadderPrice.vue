<template>
    <div class="ladder-price" ref="LadderPrice"></div>
    <!-- 阶梯价格 -->
    <a-modal
        :maskClosable="false"
        :destroyOnClose="true"
        tableLayout="fixed"
        :getContainer="getContainer"
        :visible="visibiliy"
        :width="860"
        ellipsis
        :title="ladderPriceTitle"
        wrapClassName="ladder-modal"
        @ok="handleComfirmLadderPrice"
        @cancel="handleCancelLadderPrice">
        <!-- footer -->
        <template #footer>
            <div class="confim-footer">
                <div class="tips">
                  <MySvgIcon icon-class="hint"/>  {{ $t("item-edit.batch_price") }}
                </div>
                <div class="btn-area">
                    <!-- 取消按钮 -->
                    <a-button @click="handleCancelLadderPrice">{{ $t("def.cancel") }}</a-button>
                    <!-- 确定按钮 -->
                    <a-button type="primary" @click="handleComfirmLadderPrice">{{ $t("def.sure") }}</a-button>
                </div>
            </div>
        </template>
        <div class="table-content">
            <!-- 选择的商品和设置EUR和USD -->
            <a-table
                :columns="ladderColumns"
                bordered
                :dataSource="ladderData"
                :row-selection="{
                    selectedRowKeys: keyAndItem.selectedRowKeys,
                    onChange: onSelectChange,
                    onSelectAll: onSelectAll,
                    type: 'checkbox',
                }"
                :class="{ 'ladder-table': true, 'slide-down-wrap': !batchSetVisible, 'slide-up-wrap': isDown }"
                :pagination="false"
                :rowKey="(record, index) => index">
                <template #bodyCell="{ column, record, index, text }">
                    <div v-if="column.dataIndex === 'name'">
                        <span>{{ text }}</span>
                    </div>
                    <a-input-number
                        v-if="column.dataIndex === 'fob_eur'"
                        v-model:value="record[column.dataIndex]"
                        :min="0.1"
                        :precision="2"
                        :formatter="(value) => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        :parser="(value) => value.replace(/€\s?|(,*)/g, '')"
                        @change="inputValidateConfig" />
                    <a-input-number
                        v-if="column.dataIndex === 'fob_20gp_eur'"
                        v-model:value="record[column.dataIndex]"
                        :min="0.1"
                        :precision="2"
                        :formatter="(value) => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        :parser="(value) => value.replace(/€\s?|(,*)/g, '')"
                        @change="inputValidateConfig" />
                    <a-input-number
                        v-if="column.dataIndex === 'fob_40qh_eur'"
                        v-model:value="record[column.dataIndex]"
                        :min="0.1"
                        :precision="2"
                        :formatter="(value) => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        :parser="(value) => value.replace(/€\s?|(,*)/g, '')"
                        @change="inputValidateConfig" />
                    <a-input-number
                        v-if="column.dataIndex === 'fob_usd'"
                        v-model:value="record[column.dataIndex]"
                        :min="0.1"
                        :precision="2"
                        :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                        @change="inputValidateConfig" />
                    <a-input-number
                        v-if="column.dataIndex === 'fob_20gp_usd'"
                        v-model:value="record[column.dataIndex]"
                        :min="0.1"
                        :precision="2"
                        :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                        @change="inputValidateConfig" />
                    <a-input-number
                        v-if="column.dataIndex === 'fob_40qh_usd'"
                        v-model:value="record[column.dataIndex]"
                        :min="0.1"
                        :precision="2"
                        :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                        @change="inputValidateConfig" />
                </template>
            </a-table>
            <div :class="{ 'batch-set': true, 'slide-in-down': batchSetVisible, 'slide-in-up': isDown }">
                <div class="title-area">
                    <div class="title">
                        {{ $t("item-edit.batch_price") }}
                    </div>
                    <div class="btn-area">
                        <!-- 取消确定 -->
                        <a-button @click="hanleAllVisible">{{ $t("def.cancel") }}</a-button>
                        <a-button type="primary" ghost  @click="hanleAllSure">{{ $t("def.sure") }}</a-button>
                    </div>
                </div>
                <div class="table-content">
                    <a-table
                        :columns="batchLadderColumns"
                        bordered
                        :dataSource="dataSource"
                        :pagination="false"
                        :rowKey="(record, index) => index">
                        <template #bodyCell="{ column, record, index, text }">
                            <div v-if="column.dataIndex === 'commodity'">
                                <span class="commodity-area">已选{{ text }}个商品</span>
                            </div>
                            <a-input-number
                                v-if="column.dataIndex === 'fob_eur'"
                                v-model:value="record[column.dataIndex]"
                                :min="0.1"
                                :precision="2"
                                :formatter="(value) => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="(value) => value.replace(/€\s?|(,*)/g, '')"
                                @change="inputValidateConfig" />
                            <a-input-number
                                v-if="column.dataIndex === 'fob_20gp_eur'"
                                v-model:value="record[column.dataIndex]"
                                :min="0.1"
                                :precision="2"
                                :formatter="(value) => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="(value) => value.replace(/€\s?|(,*)/g, '')"
                                @change="inputValidateConfig" />
                            <a-input-number
                                v-if="column.dataIndex === 'fob_40qh_eur'"
                                v-model:value="record[column.dataIndex]"
                                :min="0.1"
                                :precision="2"
                                :formatter="(value) => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="(value) => value.replace(/€\s?|(,*)/g, '')"
                                @change="inputValidateConfig" />
                            <a-input-number
                                v-if="column.dataIndex === 'fob_usd'"
                                v-model:value="record[column.dataIndex]"
                                :min="0.1"
                                :precision="2"
                                :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                                @change="inputValidateConfig" />
                            <a-input-number
                                v-if="column.dataIndex === 'fob_20gp_usd'"
                                v-model:value="record[column.dataIndex]"
                                :min="0.1"
                                :precision="2"
                                :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                                @change="inputValidateConfig" />
                            <a-input-number
                                v-if="column.dataIndex === 'fob_40qh_usd'"
                                v-model:value="record[column.dataIndex]"
                                :min="0.1"
                                :precision="2"
                                :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                                @change="inputValidateConfig" />
                        </template>
                    </a-table>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script setup>
import MySvgIcon from "@/components/MySvgIcon/index.vue";
import { ref, reactive, computed, watch, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
const $t = useI18n().t;
const emit = defineEmits(["update:ladderPriceVisible", "handleLastLadderData", "initActiveIndex"]);
const props = defineProps({
    // 阶梯价格
    ladderData: {
        type: Array,
        default: () => [],
    },
    // 是否显示阶梯价格
    ladderPriceVisible: {
        type: Boolean,
        default: false,
    },
    ladderPriceTitle: {
        type: String,
        default: "",
    },
    // 高亮的行
    activeRow: {
        type: Object,
        default: () => {},
    },
    // 高亮的下标
    activeIndex: {
        type: Number,
        default: null,
    },
});
// 弹框的外层实例
const LadderPrice = ref(null);
// 动画框显示
const batchSetVisible = ref(false);
// 显示
const isDown = ref(false);

// 是否显示弹框
const visibiliy = computed(() => {
    return props.ladderPriceVisible;
});
// 批量阶梯价格
const batchLadderColumns = computed(() => {
    return [
        {
            // 商品
            title: $t("item-edit.commodity"),
            dataIndex: "commodity",
            key: "commodity",
        },
        {
            // 26<=订货量（40QH）
            title: $t("item-edit.quantity_26"),
            dataIndex: "fob_40qh_eur",
            key: "fob_40qh_eur",
            width: 108,
        },
        {
            title: $t("item-edit.quantity_11_25"),
            dataIndex: "fob_20gp_eur",
            key: "fob_20gp_eur",
            width: 108,
        },
        {
            title: $t("item-edit.quantity_1_10"),
            dataIndex: "fob_eur",
            key: "fob_eur",
            width: 108,
        },
        {
            title: $t("item-edit.quantity_26"),
            dataIndex: "fob_40qh_usd",
            key: "fob_40qh_usd",
            width: 108,
        },
        {
            title: $t("item-edit.quantity_11_25"),
            dataIndex: "fob_20gp_usd",
            key: "fob_20gp_usd",
            width: 108,
        },
        {
            title: $t("item-edit.quantity_1_10"),
            dataIndex: "fob_usd",
            key: "fob_usd",
            width: 108,
        },
    ];
});
// 阶梯价格
const ladderColumns = computed(() => {
    return [
        {
            // 商品
            title: $t("item-edit.commodity"),
            dataIndex: "name",
            key: "name",
            align: "center",
            width: 110,
        },
        // EUR
        {
            title: "EUR（€）",
            // 下面有子项
            children: [
                {
                    // 26<=订货量（40QH）
                    title: $t("item-edit.quantity_26"),
                    dataIndex: "fob_40qh_eur",
                    key: "fob_40qh_eur",
                    align: "center",
                    width: 110,
                },
                {
                    title: $t("item-edit.quantity_11_25"),
                    dataIndex: "fob_20gp_eur",
                    key: "fob_20gp_eur",
                    align: "center",
                    width: 110,
                },
                {
                    title: $t("item-edit.quantity_1_10"),
                    dataIndex: "fob_eur",
                    key: "fob_eur",
                    align: "center",
                    width: 110,
                },
            ],
        },
        {
            title: "USD（$）",
            children: [
                {
                    title: $t("item-edit.quantity_26"),
                    dataIndex: "fob_40qh_usd",
                    key: "fob_40qh_usd",
                    align: "center",
                    width: 110,
                },
                {
                    title: $t("item-edit.quantity_11_25"),
                    dataIndex: "fob_20gp_usd",
                    key: "fob_20gp_usd",
                    align: "center",
                    width: 110,
                },
                {
                    title: $t("item-edit.quantity_1_10"),
                    dataIndex: "fob_usd",
                    key: "fob_usd",
                    align: "center",
                    width: 110,
                },
            ],
        },
    ];
});

// 阶梯价格数据
const dataSource = ref([
    {
        commodity: 0,
        fob_40qh_eur: null,
        fob_20gp_eur: null,
        fob_eur: null,
        fob_40qh_usd: null,
        fob_20gp_usd: null,
        fob_usd: null,
    },
]);

const keyAndItem = reactive({
    selectedRowKeys: [],
    selectedRowItems: [],
});

// 触发选择
const onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    console.log("selectedRows changed: ", selectedRows);
    keyAndItem.selectedRowKeys = selectedRowKeys;
    keyAndItem.selectedRowItems = selectedRows;
    // 如果长度大于1，显示批量设置
    if (selectedRowKeys.length > 1) {
        batchSetVisible.value = true;
        dataSource.value[0].commodity = selectedRowKeys.length;
        isDown.value = false;
    } else {
        batchSetVisible.value = false;
        isDown.value = true;
    }
};
// 全选
const onSelectAll = (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
    keyAndItem.selectedRowKeys = selectedRows.map((item) => item.key);
    keyAndItem.selectedRowItems = selectedRows;
    if (selected) {
        batchSetVisible.value = true;
        dataSource.value[0].commodity = selectedRows.length;
        isDown.value = false;
    } else {
        batchSetVisible.value = false;
        isDown.value = true;
    }
};
// 获取弹框的外层实例
const getContainer = () => {
    return LadderPrice.value;
};
// 确定按钮
const handleComfirmLadderPrice = () => {
    console.log(props.ladderData);
    // 传递给父组件，让父组件去处理
    emit("handleSaveLadderData", props.ladderData);
    emit("update:ladderPriceVisible", false);
};
// 取消按钮
const handleCancelLadderPrice = () => {
    // 初始化数据
    dataSource.value = [
        {
            commodity: 0,
            fob_40qh_eur: null,
            fob_20gp_eur: null,
            fob_eur: null,
            fob_40qh_usd: null,
            fob_20gp_usd: null,
            fob_usd: null,
        },
    ];
    keyAndItem.selectedRowKeys = [];
    keyAndItem.selectedRowItems = [];
    batchSetVisible.value = false;
    isDown.value = false;
    emit("initActiveIndex", null);
    emit("update:ladderPriceVisible", false);
};
const inputValidateConfig = (value) => {
    console.log(value);
};
// 取消按钮（动画）
const hanleAllVisible = () => {
    batchSetVisible.value = false;
    // 数据初始化
    dataSource.value = [
        {
            commodity: 0,
            fob_40qh_eur: null,
            fob_20gp_eur: null,
            fob_eur: null,
            fob_40qh_usd: null,
            fob_20gp_usd: null,
            fob_usd: null,
        },
    ];
};
// 确定按钮（动画）
const hanleAllSure = () => {
    console.log(dataSource.value);
    keyAndItem.selectedRowItems.forEach((item) => {
        item.fob_40qh_eur = dataSource.value[0].fob_40qh_eur;
        item.fob_20gp_eur = dataSource.value[0].fob_20gp_eur;
        item.fob_eur = dataSource.value[0].fob_eur;
        item.fob_40qh_usd = dataSource.value[0].fob_40qh_usd;
        item.fob_20gp_usd = dataSource.value[0].fob_20gp_usd;
        item.fob_usd = dataSource.value[0].fob_usd;
    });
    // 批量设置隐藏
    batchSetVisible.value = false;
    // 传递给父组件，让父组件去处理
    emit("handleLastLadderData", keyAndItem.selectedRowItems);
};

// 监听
watch(
    () => props.activeIndex,
    (newVal) => {
        if (newVal !== null) {
            if (
                props.ladderData[newVal].fob_eur ||
                props.ladderData[newVal].fob_20gp_eur ||
                props.ladderData[newVal].fob_40qh_eur ||
                props.ladderData[newVal].fob_usd ||
                props.ladderData[newVal].fob_20gp_usd ||
                props.ladderData[newVal].fob_40qh_usd
            ) {
                keyAndItem.selectedRowKeys = [newVal];
            }
        }
        // 设置选中的数据
    },
    {
        deep: true,
        immediate: true,
    }
);
</script>

<style lang="less" scoped>
.ladder-price {
    width: 100%;
    height: 100%;
}
:deep(.ladder-modal) {
    .ant-modal {
        .ant-modal-content {
            border-radius: 4px;
            .ant-modal-header {
                height: auto;
                padding: 16px 24px;
                border-bottom: 1px solid #e2e2e2;
                .ant-modal-title {
                    height: auto;
                    color: #1d2129;
                    font-size: 16px;
                    font-weight: 600;
                }
            }
            .ant-modal-body {
                height: 666px;
                padding: 0;
                overflow-y: hidden;

                .table-content {
                    width: 100%;
                    height: 100%;
                    .ladder-table {
                        width: 100%;
                        height: calc(100% - 180px);
                        padding: 20px 24px;
                        overflow-y: scroll;
                        // 滚动条样式
                        &::-webkit-scrollbar {
                            width: 6px;
                            height: 6px;
                        }
                        &::-webkit-scrollbar-thumb {
                            border-radius: 3px;
                            background-color: rgba(0, 0, 0, 0.2);
                        }
                        &::-webkit-scrollbar-track {
                            border-radius: 3px;
                            background-color: rgba(0, 0, 0, 0.1);
                        }
                    }
                    .slide-down-wrap {
                        height: 646px;
                    }
                    .batch-set {
                        width: 100%;
                        height: 140px;
                        background-color: #fff;
                        z-index: 1;
                        box-shadow: 0px -4px 10px rgba(143, 146, 152, 0.1);
                        padding: 16px 24px 10px 24px;
                        transform: translateY(100%);
                        .title-area {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 14px;
                            .title {
                                font-size: 14px;
                                font-weight: 500;
                                color: #1d2129;
                                display: flex;
                                align-items: center;
                                &::before {
                                    content: "";
                                    display: inline-block;
                                    width: 3px;
                                    height: 12px;
                                    background-color: #0061ff;
                                    margin-right: 4px;
                                }
                            }
                            .btn-area {
                                .ant-btn {
                                    height: auto;
                                    min-width: auto;
                                    padding: 4px 16px;
                                    border-radius: 4px;
                                }
                            }
                        }
                    }
                }
            }
            .ant-modal-footer {
                border-top: 1px solid #e2e2e2;
                height: auto;
                .confim-footer {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    .tips {
                        min-width: 170px;
                        height: 28px;
                        padding: 6px 10px;
                        background-color: #f2f3f5;
                        font-size: 12px;
                        color: #666;
                        text-align: center;
                        border-radius: 4px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        .svg-icon{
                            margin-right: 2px;
                            font-size: 16px;
                        }
                    }
                    .btn-area {
                        margin-left: 174px;
                        .ant-btn {
                            border-radius: 4px;
                            min-width: auto;
                            padding: 0 16px;
                            border-color: #e5e6eb;
                            color: #1d2129;
                            font-size: 14px;
                        }
                        .ant-btn-primary {
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
}

.slide-in-down {
    animation: slideInDown 0.3s ease-in-out forwards;
}

.slide-in-up {
    animation: slideInUp 0.3s ease-in-out forwards; //forwards表示动画结束后保持最后的状态
}
:deep(table) {
    .ant-table-cell {
        // 文字超出换行
        white-space: normal !important;
        // 文字居中
        text-align: center !important;
        color: #1d2129;
        padding: 10px 16px;
        .commodity-area{
            display: inline-block;
            height: 24px;
            line-height: 24px;
            background-color: #F2F3F5;
            padding: 0 30px;
            border-radius: 4px;
        }
    }
    .ant-table-tbody {
        .ant-table-row {
            .ant-table-cell-row-hover {
                // background-color: rgba(0, 97, 255, 0.05);
            }
        }
        .ant-table-row-selected {
            .ant-table-cell {
                background: rgba(0, 97, 255, 0.05);
            }
        }
    }
    .ant-table-thead {
        .ant-table-cell {
            padding: 2px 4px !important;
        }
    }
}
:deep(.ant-input-number) {
    width: auto;
}

@keyframes slideInDown {
    0% {
        transform: translateY(100%);
        opacity: 0;
        visibility: hidden; /* 确保元素在开始动画时是可见的，如果需要的话 */
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}
@keyframes slideInUp {
    0% {
        transform: translateY(0);
        opacity: 1;
        visibility: visible; //visibility的值在动画开始时设置为hidden，确保元素在动画开始时不可见
    }
    100% {
        opacity: 0;
        transform: translateY(100%);
    }
}
</style>
