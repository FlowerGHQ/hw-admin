<template>
    <div class="sales-strategy-edit">
        <div class="list-container">
            <div class="main-content">
                <div class="title-container">

                    <div class="title-area">
                        <div class="back" @click="handleBack">
                            <MySvgIcon icon-class="sales-back"/>
                        </div>
                        {{
                            type === "add"
                                ? "新建销售策略"
                                : type === "edit"
                                ? "编辑销售策略"
                                : ""
                        }}
                    </div>
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
                                :xs="12"
                                :sm="12"
                                :md="12"
                                :lg="12"
                                :xl="12"
                                :xxl="12"
                                :xxxl="12">
                                <a-form-item label="策略名称" name="name">
                                    <a-input
                                        v-model:value="formState.name"
                                        :disabled="
                                            type === 'details' ? true : false
                                        "
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
                                :xs="12"
                                :sm="12"
                                :md="12"
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
                                        :disabled="
                                            type === 'details' ? true : false
                                        "
                                        v-model:value="showSelectData"
                                        mode="multiple"
                                        style="width: 100%"
                                        :open="false"
                                        :placeholder="$t('def.select')"
                                        @deselect="handleDeleteItem"
                                        @focus.stop="handleOpenModal">
                                        <!-- removeIcon -->
                                        <template #removeIcon>
                                            <MySvgIcon icon-class="sales-circle-delete" />
                                        </template>
                                        
                                    </a-select>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <!-- 策略类型 -->
                        <a-row :gutter="18">
                            <a-col
                                :xs="12"
                                :sm="12"
                                :md="12"
                                :lg="12"
                                :xl="12"
                                :xxl="12"
                                :xxxl="12">
                                <a-form-item label="销售类型" name="type">
                                    <a-select
                                        v-model:value="formState.type"
                                        :disabled="
                                            type === 'details' ? true : false
                                        "
                                        :placeholder="$t('def.select')"
                                        :options="strategyTypeOptions"
                                        @change="handleClearVaild" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <!-- 赠送规则 -->
                        <a-row :gutter="18" v-if="formState.type">
                            <a-col
                                :xs="24"
                                :sm="24"
                                :md="24"
                                :lg="19"
                                :xl="19"
                                :xxl="19"
                                :xxxl="19">
                                <a-form-item
                                    :label="' '"
                                    name="giftRules"
                                    class="gift-rules">
                                    <div
                                        class="gift-rules-first"
                                        v-if="formState.type == 1">
                                        <div class="label-gift">赠送规则</div>
                                        <div class="threshold">
                                            <span>起送门槛</span>
                                            <a-input-number
                                                v-model:value="
                                                    formState.rule.quantity_min
                                                "
                                                :disabled="
                                                    type === 'details'
                                                        ? true
                                                        : false
                                                "
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
                                                v-model:value="
                                                    formState.rule
                                                        .quantity_every
                                                "
                                                :disabled="
                                                    type === 'details'
                                                        ? true
                                                        : false
                                                "
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
                                                v-model:value="
                                                    formState.rule
                                                        .quantity_bonus
                                                "
                                                :disabled="
                                                    type === 'details'
                                                        ? true
                                                        : false
                                                "
                                                :placeholder="$t('def.p_set')"
                                                :min="1" />
                                        </div>
                                    </div>
                                    <div
                                        class="gift-rules-first"
                                        v-else-if="formState.type == 2">
                                        <div class="label-gift">赠送规则</div>
                                        <div class="threshold">
                                            <span>起送门槛</span>
                                            <a-input-number
                                                v-model:value="
                                                    formState.rule.quantity_min
                                                "
                                                :disabled="
                                                    type === 'details'
                                                        ? true
                                                        : false
                                                "
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
                                                v-model:value="
                                                    formState.rule
                                                        .quantity_bonus
                                                "
                                                :disabled="
                                                    type === 'details'
                                                        ? true
                                                        : false
                                                "
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
                    <div
                        class="add-btn"
                        v-if="tableData.length > 0 && type !== 'details'">
                        <a-button type="primary" @click="handleVaild"
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
                            <!-- 适用地区 -->
                            <template
                                v-if="column.dataIndex === 'applicable_area'">
                                {{ record.country }}
                            </template>
                            <!-- 赠品 -->
                            <template v-if="column.dataIndex === 'item_list'">
                                {{ record.item.map((i) => i.name).join("、") }}
                            </template>
                            <!-- 赠送规则 -->
                            <template v-if="column.dataIndex === 'rule'">
                                {{
                                    record.type == 1
                                        ? `【每满送】 起送门槛【${record.rule.quantity_min}】 每满${record.rule.quantity_every}送${record.rule.quantity_bonus}`
                                        : record.type == 2
                                        ? `【整单送】 起送门槛【${record.rule.quantity_min}】 达到起送门槛后,赠送${record.rule.quantity_bonus}`
                                        : "-"
                                }}
                            </template>
                            <!-- 操作 -->
                            <template v-if="column.dataIndex === 'operation'">
                                <div class="operation">
                                    <!-- 修改 -->
                                    <a-button
                                        type="link"
                                        @click="handleEdit(record)">
                                        <MySvgIcon icon-class="sales-edit" />{{
                                            $t("n.amend")
                                        }}</a-button
                                    >
                                    <!-- 删除 -->
                                    <a-button
                                        type="link"
                                        @click="handleDelete(record)">
                                        <MySvgIcon icon-class="sales-delete" />
                                        {{ $t("def.delete") }}</a-button
                                    >
                                </div>
                            </template>
                        </template>
                    </a-table>
                </div>
                <div
                    class="empty-area"
                    v-else-if="tableData.length <= 0 && type !== 'details'">
                    <div class="add-details" @click="handleVaild">
                        <MySvgIcon icon-class="sales-add" />
                        <span>添加明细</span>
                    </div>
                    <span class="tips">
                        为销售策略配置对应的地区与赠送的商品
                    </span>
                </div>
            </div>
            <div class="sales-footer">
                <!-- 取消 -->
                <a-button
                    type="default"
                    @click="handleCancel"
                    v-if="type !== 'details'">
                    {{ $t("def.cancel") }}
                </a-button>
                <!-- 确定 -->
                <a-button
                    type="primary"
                    @click="handleSubmit"
                    v-if="type !== 'details'">
                    {{ $t("def.ok") }}
                </a-button>
                <!-- 编辑资料 -->
                <a-button @click="handleEditData" v-if="type === 'details'">
                    {{ $t("sales-strategy-management.edit_data") }}
                </a-button>
            </div>
        </div>
    </div>
    <ClassifyModal
        v-model:visibility="classifyModalShow"
        @hanldAdd="handleAddStrategyDetail"
        @hanldItemList="hanldItemList">
    </ClassifyModal>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import ItemSelect from "@/components/popup-btn/ItemSelect.vue";
import MySvgIcon from "@/components/MySvgIcon/index.vue";
import ClassifyModal from "./components/ClassifyModal.vue";
import { message, Modal } from "ant-design-vue";
import _ from "lodash";
// 使用useTable
import { useTable } from "@/hooks/useTable";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import Core from "../../core";
const $router = useRouter();
const $route = useRoute();
const $t = useI18n().t;
const $confirm = Modal.confirm;
// data
const formState = reactive({
    type: null,
    rule: {
        quantity_min: null,
        quantity_every: null,
        quantity_bonus: null,
    },
    strategy_detail: [],
    item_list: [],
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
const giftRulesVaild = (rule, value) => {
    if (formState.type == 1) {
        if (
            !formState.rule.quantity_min ||
            !formState.rule.quantity_every ||
            !formState.rule.quantity_bonus
        ) {
            return Promise.reject("请填写完整的赠送规则");
        } else {
            return Promise.resolve();
        }
    } else if (formState.type == 2) {
        if (!formState.rule.quantity_min || !formState.rule.quantity_bonus) {
            return Promise.reject("请填写完整的赠送规则");
        } else {
            return Promise.resolve();
        }
    }
};
const type = computed(() => $route.query.type);
const rules = computed(() => {
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
                        return Promise.reject("请选择适用商品");
                    } else {
                        return Promise.resolve();
                    }
                },
                trigger: ["blur", "change"],
            },
        ],
        type: [
            {
                required: true,
                message: "请选择策略类型",
                trigger: ["blur", "change"],
            },
        ],
        giftRules: [
            {
                required: true,
                validator: giftRulesVaild,
                trigger: ["blur", "change"],
            },
        ],
    };
    if (!formState.type) {
        delete rule.giftRules;
    }
    return rule;
});
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
            dataIndex: "country",
            key: "country",
        },
        {
            title: $t("sales-strategy-management.gift"),
            dataIndex: "item_list",
            key: "item_list",
        },
        {
            title: $t("sales-strategy-management.gift_rule"),
            dataIndex: "rule",
            key: "rule",
        },
        {
            title: $t("sales-strategy-management.operation"),
            dataIndex: "operation",
            key: "operation",
            fixed: "right",
            width: 200,
        },
    ];
    if (type.value == "details") {
        columns = columns.filter((item) => item.dataIndex != "operation");
    }
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
// 适用商品的选项
const selectDataOption = ref([]);
const tableData = ref([]);
// 新增后端返回的策略id
const strategyId = ref(null);
// methods
const handleBack = () => {
    $router.push({
        path: "/sales-strategy-management/sales-strategy-list",
    });
};
// 添加适用商品
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
// 打开弹窗
const handleOpenModal = () => {
    itemSelectRef.value.handleModalShow();
};
// 删除适用商品
const handleDeleteItem = (value) => {
    console.log(value);
    selectData.value = selectData.value.filter((item) => item.item_id != value);
};
// 校验添加
const handleVaild = () => {
    formRef.value && formRef.value.clearValidate();
    // 校验表单
    formRef.value &&
        formRef.value.validate().then((res) => {
            classifyModalShow.value = true;
        });
};
// 添加方案明细
const handleAddStrategyDetail = (data) => {
    formState.strategy_detail = data;
};
// 清除校验
const handleClearVaild = () => {
    formRef.value && formRef.value.clearValidate();
    formState.rule.quantity_min = null;
    formState.rule.quantity_every = null;
    formState.rule.quantity_bonus = null;
    // 重新校验
    formRef.value && formRef.value.validate();
};
// 获取适用商品的选项
const hanldItemList = (data) => {
    formState.item_list = data;
};

// 添加方案明细：只有在type为add的时候才会触发
const addData = (data) => {
    Core.Api.SALES_STRATEGY.add(data).then(async (res) => {
        message.success("添加成功");
        strategyId.value = res?.detail?.id;
        await getDetail();
    });
};
// 修改方案明细：只有在type为edit的时候才会触发
const editData = (data) => {
    Core.Api.SALES_STRATEGY.update(data).then((res) => {
        message.success("修改成功");
        // 重新获取详情
        getDetail();
    });
};
// handleEditData
const handleEditData = () => {
    $router.push({
        path: "/sales-strategy-management/sales-strategy-edit",
        query: {
            id: $route.query.id,
            type: "edit",
        },
    });
};

// 提交上传
const handleSubmit = () => {
    let form = _.cloneDeep(formState);
    form.rule = JSON.stringify(form.rule);
    form.item_list = showSelectData.value.map((item) => {
        return item.value;
    });
    // 获取本地数据
    let arr = JSON.parse(Core.Data.getSalesData());
    let arrDataId = arr.map((item) => item.id);
    let formStateDataId = formState.strategy_detail.map((item) => item.id);
    console.log("formStateDataId", formStateDataId);
    // 比较两个数组是否相同:此刻点击确定是否修改了数据
    let isSame = _.isEqual(arrDataId, formStateDataId);
    console.log("isSame", isSame);
    if (!isSame) {
        let formObjArr = []; //抽取出来的form的数据、
        let arrObjArr = []; //抽取出来的arr的数据
        formObjArr = formState.strategy_detail.map((item) => {
            let obj = {};
            obj.no = item.no;
            obj.country = item.country;
            obj.bonus_item_id = item.bonus_item_id;
            return obj;
        });
        arrObjArr = arr.map((item) => {
            let obj = {};
            obj.no = item.no;
            obj.country = item.country;
            obj.bonus_item_id = item.bonus_item_id;
            return obj;
        });
        // 整合到上传的数据中
        form.strategy_detail = [...arrObjArr, ...formObjArr];
        if (type.value === "add") {
            addData(form);
        } else if (type.value === "edit") {
            form.id = $route.query.id;
            editData(form);
        }
    }
    //   }
};

// 修改
const handleEdit = () => {};

// 重构数据
const viewData = (arr) => {
    console.log("arr", arr);
    // 处理成表格数据
    // 相同no 并且 相同country的数据的 item数据合并
    let newArr = [];
    arr.forEach((item) => {
        let obj = {};
        // 是否有相同的no和country
        let isSame = newArr.some((i) => {
            return i.no == item.no && i.country == item.country;
        });
        // 如果有相同的no和country，就把item合并
        if (isSame) {
            newArr.forEach((i) => {
                if (i.no == item.no && i.country == item.country) {
                    i.item = [...i.item, item.item];
                    i.id = [i.id, item.id].join(",");
                }
            });
        } else {
            obj.type = item.type;
            obj.id = item.id.toString();
            obj.no = item.no;
            obj.country = item.country;
            obj.item = [item.item];
            obj.rule = item.rule;
            newArr.push(obj);
        }
    });
    console.log("newArr", newArr);
    newArr.forEach((item, index) => {
        item.serial_number = index + 1;
    });
    return newArr;
};

// 查询详情
const getDetail = () => {
    Core.Api.SALES_STRATEGY.detail({
        id:
            type.value === "edit"
                ? $route.query.id
                : type.value === "add"
                ? strategyId.value
                : type.value === "details"
                ? $route.query.id
                : "",
    }).then((res) => {
        if (!res.detail) return;
        console.log("res detail ===================", res.detail);
        formState.name = res.detail.name;
        // 转化为字符串
        formState.type = res.detail.type.toString();
        formState.rule = JSON.parse(res.detail.rule);
        formState.strategy_detail = res.detail.strategy_detail;
        formState.item_list = res.detail.item_list;
        selectData.value = res.detail.item_list;
        selectData.value.forEach((item) => {
            item.name = item?.item?.name || "";
            item.code = item?.item?.code || "";
            item.item_id = item?.item?.id || "";
        });
        console.log("formState", formState.strategy_detail);

        let arr = [];
        // 处理成表格数据
        arr = res.detail.strategy_detail.map((item, index) => {
            let obj = {
                ...item,
            };
            obj.serial_number = index + 1;
            obj.no = item.no;
            obj.rule = formState.rule;
            obj.type = formState.type;
            obj.item_list = item.item;
            return obj;
        });
        console.log(viewData(tableData.value));
        // 查询详情的时候，存储数据，讲原来的数据删除，再添加
        tableData.value = viewData(arr);
        Core.Data.setSalesData(JSON.stringify(arr));
    });
};
// 取消
const handleCancel = () => {
    $router.push({
        path: "/sales-strategy-management/sales-strategy-list",
    });
};
// 删除方案
const handleDelete = (item) => {
    let updateObj = _.cloneDeep(formState);
    updateObj.strategy_detail = updateObj.strategy_detail.filter(
        (i) => !item.id.split(",").includes(i.id.toString())
    );
    updateObj.id = type.value === "edit" ? $route.query.id : strategyId.value;
    updateObj.rule = JSON.stringify(updateObj.rule);
    updateObj.item_list = updateObj.item_list.map((i) => {
        return i.item_id;
    });
    console.log("updateObj----------------------------------------", updateObj);
    $confirm({
        title: "确定要删除该方案吗？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
            Core.Api.SALES_STRATEGY.update(updateObj).then((res) => {
                message.success("删除成功");
                getDetail();
            });
        },
    });
};

onMounted(() => {
    Core.Data.setSalesData(JSON.stringify([]));
    if (type.value == "edit" || type.value == "details") {
        getDetail();
    } else if (type.value == "add") {
        tableData.value = [];
    }
});
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
                    margin-left: 3px;
                    cursor: pointer;
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
        .title-container{
            .title-area{
                display: flex;
                .back{
                    font-size: 17px;
                    margin-right: 4px;
                    cursor: pointer;
                }
            }
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
                    flex-wrap: wrap;
                    min-height: 52px;
                    border-radius: 4px;
                    border: 1px solid #eaecf1;
                    background: #fff;
                    padding: 10px 20px;
                    .label-gift {
                        min-width: 86px;
                        display: flex;
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
