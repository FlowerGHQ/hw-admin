<template>
    <div class="sales-strategy-edit">
        <div class="list-container">
            <div class="main-content">
                <div class="title-container">
                    <div class="title-area">新建销售策略</div>
                </div>
                <div class="search-container">
                    <a-form
                        ref="formRef"
                        name="custom-validation"
                        :model="formState"
                        :labelCol="{ style: { width: '86px' } }"
                        :rules="rules">
                        <!-- 策略名称 -->
                        <a-row :gutter="18">
                            <a-col
                                :xs="24"
                                :sm="24"
                                :md="24"
                                :lg="12"
                                :xl="12"
                                :xxl="12"
                                :xxxl="12">
                                <a-form-item label="策略名称" name="name">
                                    <a-input
                                        v-model:value="formState.name"
                                        allowClear
                                        showCount
                                        :placeholder="$t('def.input')"
                                        :maxlength="100" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <!-- 适用商品 -->
                        <a-row :gutter="18">
                            <a-col
                                :xs="24"
                                :sm="24"
                                :md="24"
                                :lg="12"
                                :xl="12"
                                :xxl="12"
                                :xxxl="12">
                                <a-form-item label="适用商品" name="shops">
                                    <ItemSelect
                                        @select="handleAddFailItem"
                                        btnText="选择商品"
                                        :isShowBtn="false"
                                        ref="itemSelectRef"
                                        :disabled-checked="
                                            selectData.map((i) => i.item_id)
                                        "
                                        btn-type="primary"
                                        :btn-text="$t('i.add')"
                                        btn-class="fault-btn" />
                                    <a-select
                                        v-model:value="showSelectData"
                                        mode="multiple"
                                        style="width: 100%"
                                        :open="false"
                                        :placeholder="$t('def.select')"
                                        @deselect="handleDeleteItem"
                                        @focus.stop="handleOpenModal">
                                        <template #clearIcon>
                                            1231231
                                        </template>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <!-- 策略类型 -->
                        <a-row :gutter="18">
                            <a-col
                                :xs="24"
                                :sm="24"
                                :md="24"
                                :lg="12"
                                :xl="12"
                                :xxl="12"
                                :xxxl="12">
                                <a-form-item
                                    label="销售类型"
                                    name="strategyType">
                                    <a-select
                                        v-model:value="formState.strategyType"
                                        :placeholder="$t('def.select')"
                                        :options="strategyTypeOptions" 
                                        @change="handleClearVaild"
                                    />
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <!-- 赠送规则 -->
                        <a-row 
                            :gutter="18" 
                            v-if="formState.strategyType"
                        >
                            <a-col
                                :xs="24"
                                :sm="24"
                                :md="24"
                                :lg="12"
                                :xl="12"
                                :xxl="12"
                                :xxxl="12">
                                <a-form-item
                                    :label="' '"
                                    name="giftRules"
                                    class="gift-rules"
                                >
                                    <div
                                        class="gift-rules-first"
                                        v-if=" formState.strategyType == 1">
                                        <div class="label-gift">赠送规则</div>
                                        <div class="threshold">
                                            <span>起送门槛</span>
                                            <a-input-number
                                                v-model:value="formState.rule.quantity_min"
                                                :placeholder="$t('def.p_set')"
                                                :min="1">
                                                <template #addonAfter>
                                                    <span class="unit">
                                                        辆
                                                    </span>
                                                </template>
                                            </a-input-number>
                                        </div>
                                        <div class="per">
                                            <span> 每满 </span>
                                            <a-input-number
                                                v-model:value="formState.rule.quantity_every"
                                                :placeholder="$t('def.p_set')"
                                                :min="1">
                                                <template #addonAfter>
                                                    <span class="unit">
                                                        辆
                                                    </span>
                                                </template>
                                            </a-input-number>
                                        </div>
                                        <div class="number">
                                            <span> 送 </span>
                                            <a-input-number
                                                v-model:value="formState.rule.quantity_bonus"
                                                :placeholder="$t('def.p_set')"
                                                :min="1" />
                                        </div>
                                    </div>
                                    <div
                                        class="gift-rules-first"
                                        v-else-if=" formState.strategyType == 2">
                                        <div class="label-gift">赠送规则</div>
                                        <div class="threshold">
                                            <span>起送门槛</span>
                                            <a-input-number
                                                v-model:value="formState.rule.quantity_min"
                                                :placeholder="$t('def.p_set')"
                                                :min="1">
                                                <template #addonAfter>
                                                    <span class="unit">
                                                        辆
                                                    </span>
                                                </template>
                                            </a-input-number>
                                        </div>
                                        <div class="per">
                                            <span> 达到起送门槛后 , 赠送</span>
                                            <a-input-number
                                                v-model:value="formState.rule.quantity_bonus"
                                                :placeholder="$t('def.p_set')"
                                                :min="1">
                                            </a-input-number>
                                        </div>
                                    </div>
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-form>
                </div>
                <div class="title-label">
                    <span class="label">方案明细</span>
                    <div class="add-btn" v-if="tableData.length > 0">
                        <a-button type="primary" @click="handleOpenModal"
                            >添加明细</a-button
                        >
                    </div>
                </div>
                <div class="table-container" v-if="tableData.length > 0">
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
                            <template
                                v-if="column.dataIndex === 'serial_number'">
                                {{
                                    (pagination.current - 1) * pagination.size +
                                    index +
                                    1
                                }}
                            </template>
                            <!-- 适用地区 -->
                            <template
                                v-if="column.dataIndex === 'applicable_area'">
                                {{ record.applicable_area.join("、") }}
                            </template>
                            <!-- 操作 -->
                            <template v-if="column.dataIndex === 'operation'">
                                <div class="operation">
                                    <!-- 修改 -->
                                    <a-button type="link">
                                        <MySvgIcon icon-class="sales-edit" />{{
                                            $t("n.amend")
                                        }}</a-button
                                    >
                                    <!-- 删除 -->
                                    <a-button type="link">
                                        <MySvgIcon icon-class="sales-delete" />
                                        {{ $t("def.delete") }}</a-button
                                    >
                                </div>
                            </template>
                        </template>
                    </a-table>
                </div>
                <div class="empty-area" v-else>
                    <div class="add-details" @click="handleVaild">添加明细</div>
                    <span class="tips">
                        为销售策略配置对应的地区与赠送的商品
                    </span>
                </div>
            </div>
            <div class="sales-footer">
                <!-- 取消 -->
                <a-button type="default" @click="handleCancel">
                    {{ $t("def.cancel") }}
                </a-button>
                <!-- 确定 -->
                <a-button type="primary" @click="handleOk">
                    {{ $t("def.ok") }}
                </a-button>
            </div>
        </div>
    </div>
    <ClassifyModal
            v-model:visibility="classifyModalShow"
            @refresh="refresh"
    >
    </ClassifyModal>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import ItemSelect from "@/components/popup-btn/ItemSelect.vue";
import MySvgIcon from "@/components/MySvgIcon/index.vue";
import ClassifyModal from "./components/ClassifyModal.vue";
// 使用useTable
import { useTable } from "@/hooks/useTable";
import { useI18n } from "vue-i18n";
const $t = useI18n().t;
// data
const formState = reactive({
    number: null,
    strategyType: null,
    rule: {
        quantity_min: null,
        quantity_every: null,
        quantity_bonus: null,
    },
});
const strategyTypeOptions = ref([
    {
        label: "每满送",
        value: "1",
    },
    {
        label: "整单送",
        value: "2",
    },
]);
const formRef = ref(null);
const giftRulesVaild = (rule, value) =>{
    if(formState.strategyType == 1){
        if (
            !formState.rule.quantity_min ||
            !formState.rule.quantity_every ||
            !formState.rule.quantity_bonus
        ) {
            return Promise.reject('请填写完整的赠送规则');
        } else {
            return Promise.resolve();
        }
    }else if(formState.strategyType == 2){
        if (
            !formState.rule.quantity_min ||
            !formState.rule.quantity_bonus
        ) {
            return Promise.reject('请填写完整的赠送规则');
        } else {
            return Promise.resolve();
        }
    }
}


const rules = computed(()=>{
    let rule = {
        name: [
            {
                required: true,
                message: "请输入策略名称",
                trigger: ["blur", "change"],
            },
        ],
        shops: [
            {
                required: true,
                // validator: validateShops,
                validator: (rule, value) => {
                    if (selectData.value.length == 0) {
                        // callback(new Error("请选择适用商品"));
                        return Promise.reject('请选择适用商品');
                    } else {
                        return Promise.resolve();
                    }
                },
                trigger: ["blur", "change"],
            },
        ],
        strategyType: [
            {
                required: true,
                message: "请选择策略类型",
                trigger: ["blur", "change"],
            },
        ],
        giftRules: [
            {
                required: true,
                validator:giftRulesVaild,
                trigger: ["blur", "change"],
            },
        ]
    }
    if(!formState.strategyType){
        delete rule.giftRules
    }
    return rule
})
const selectData = ref([]);
const itemSelectRef = ref(null);
const tableColumns = computed(() => {
    let columns = [
        {
            title: $t("sales-strategy-management.serial_number"),
            dataIndex: "serial_number",
            width: 80,
            fixed: "left",
            align: "center",
        },
        {
            title: $t("sales-strategy-management.applicable_area"),
            dataIndex: "applicable_area",
            key: "applicable_area",
        },
        {
            title: $t("sales-strategy-management.gift"),
            dataIndex: "gift",
            key: "gift",
        },
        {
            title: $t("sales-strategy-management.gift_rule"),
            dataIndex: "gift_rule",
            key: "gift_rule",
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
const showSelectData = computed(() => {
    let arr = [];
    if (selectData.value.length > 0) {
        selectData.value.forEach((item) => {
            let showObj = {
                label: `${item.name}(${item.code})`,
                value: item.item_id,
            };
            arr.push(showObj);
        });
    }
    return arr;
});
const classifyModalShow = ref(false);
// hooks
const request = () =>
    new Promise((resolve, reject) => {
        let arr = [];
        // for (let i = 0; i < 10; i++) {
        //     arr.push({
        //         id: i,
        //         serial_number: i,
        //         applicable_area: ["北京", "上海"],
        //         gift: "赠送商品",
        //         gift_rule: "每满1辆送1辆",
        //     });
        // }
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
} = useTable({ request });
// methods
const handleAddFailItem = (ids, items) => {
    for (let i = 0; i < items.length; i++) {
        const element = items[i];
        element.item_id = element.id;
        element.id = 0;
        element.amount = 1;
        element.price = element.fob_usd / 100;
        element.discount = 100;
    }
    selectData.value.push(...items);
};
const handleOpenModal = () => {
    itemSelectRef.value.handleModalShow();
};
const handleDeleteItem = (value) => {
    console.log(value);
    selectData.value = selectData.value.filter((item) => item.item_id != value);
};
// 校验添加
const handleVaild = () => {
    // 校验表单
    formRef.value&&formRef.value.validate().then((res) => {
        classifyModalShow.value = true;
    });
};
// 清除校验
const handleClearVaild = () => {
    formRef.value&&formRef.value.clearValidate();
    formState.rule.quantity_min = null;
    formState.rule.quantity_every = null;
    formState.rule.quantity_bonus = null;
    // 重新校验
    formRef.value&&formRef.value.validate();
};
</script>

<style lang="less" scoped>
.sales-strategy-edit {
    height: 100%;
    .list-container {
        height: 100%;
        position: relative;
        background-color: #fff;
        .main-content {
            height: calc(100% - 68px);
            overflow-y: scroll;
            // 隐藏滚动条
            &::-webkit-scrollbar {
                display: none;
            }
            .search-container {
                .ant-form {
                    flex: 1;
                    .ant-form-item {
                        :deep(.ant-form-item-label) {
                            margin-right: 8px;
                            > label {
                                &::after {
                                    display: none;
                                }
                            }
                        }
                    }
                }
            }
            .title-label {
                padding: 0 20px;
                color: #1d2129;
                font-size: 16px;
                font-weight: 600;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .table-container {
                margin-top: 10px;
            }
            .empty-area {
                margin: 10px 20px 0 20px;
                min-height: 73px;
                border-radius: 4px;
                border: 1px dashed #eaecf1;
                background: rgba(242, 243, 245, 0.4);
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                .add-details {
                    color: #0061ff;
                }
                .tips {
                    color: #8e8e8e;
                    font-size: 12px;
                }
            }
        }
        .sales-footer {
            height: 68px;
            justify-content: center;
            align-items: center;
            display: flex;
            border-radius: 0px 0px 4px 4px;
            border-top: 1px solid #f2f3f5;
            background: #fff;
            position: absolute;
            bottom: 0;
            width: 100%;
        }
    }
}
:deep(.ant-table-cell) {
    color: #1d2129;
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
:deep(.gift-rules) {
    .ant-form-item-control {
        justify-content: center !important;
        align-content: center !important;
        // position: relative;
        .ant-form-item-control-input {
            .ant-form-item-control-input-content {
                .gift-rules-first {
                    display: flex;
                    align-items: center;
                    min-width: 800px;
                    min-height: 52px;
                    border-radius: 4px;
                    border: 1px solid #eaecf1;
                    background: #fff;
                    .label-gift {
                        min-width: 86px;
                        min-height: 52px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-right: 1px solid #eaecf1;
                        margin-right: 10px;
                    }
                    .threshold,
                    .per,
                    .number {
                        display: flex;
                        align-items: center;
                        margin-right: 20px;
                        > span {
                            margin-right: 8px;
                        }
                    }
                }
            }
        }
    }
    > .ant-form-item-label {
        .ant-form-item-required {
            display: none;
        }
    }
}
</style>
