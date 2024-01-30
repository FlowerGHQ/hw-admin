<template>
    <div class="account-management">
        <div class="list-container">
            <!-- 头部 -->
            <div class="title-container">
                <div class="title-area">{{ $t("customer-care.inquiry_sheet_distribution") }}</div>
            </div>
            <div class="search">
                <SearchAll :options="searchList" @search="onSearch" @reset="onReset" :isShowMore="false"> </SearchAll>
            </div>
            <div class="table-container">
                <a-button type="primary" class="add-btn" @click="handleEdit('add', {})">
                    <!-- 新增分配 -->
                    {{ $t("customer-care.add_distribution") }}
                    <template #icon>
                        <plus-outlined />
                    </template>
                </a-button>
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :loading="loading"
                    :row-key="(record) => record.id"
                    :pagination="false">
                    <template #bodyCell="{ column, text, record, index }">
                        <template v-if="column.key === 'area'" class="area-content">
                            <!-- 地区字段长度 -->
                            <a-tooltip  placement="top">
                                <template #title>
                                    <div class="area-cell">
                                        {{ text }}
                                    </div>
                                </template>
                                <span class="area-cell">
                                    {{ text }}
                                </span>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'setting'">
                            <div class="default-accout" v-if="record.area === '其他'">-</div>
                            <div class="other-accout" v-else>
                                <a-button type="link" size="small" @click="handleEdit('edit', record)">
                                    <!-- 编辑 -->
                                    {{ $t("customer-care.edit") }}
                                </a-button>
                                <a-button type="link" size="small" @click="handleDelete(record)">
                                    <!-- 删除 -->
                                    {{ $t("customer-care.delete") }}
                                </a-button>
                            </div>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
        <!-- 修改和新增的弹框 -->
        <a-modal
            :title="modalTitle"
            :visible="editVisibilty"
            destroyOnClose
            centered
            :ok-text="t('customer-care.confirm')"
            :cancel-text="t('customer-care.cancel')"
            @cancel="handleCancel"
            @ok="handleSubmit">
            <!-- 表单 -->
            <a-form ref="formRef" name="custom-validation" :model="formState" :rules="rules">
                <a-form-item :label="t('customer-care.customer_service_account')" name="username">
                    <a-select
                        v-model:value="formState.username"
                        placeholder="请选择客服账号"
                        :disabled="openType === 'edit'">
                        <a-select-option v-for="item in otherAccount" :key="id" :value="item.username">
                            {{ item.username }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item :label="t('customer-care.distribution_country')" name="country">
                    <CountryCascaderTabMore v-model:value="formState.country" :reviewData="formState.area" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance, watch, onMounted, h } from "vue";
import Core from "@/core";
import MySvgIcon from "@/components/MySvgIcon/index.vue";
import { useTable } from "@/hooks/useTable";
import { useI18n } from "vue-i18n";
import SearchAll from "@/components/horwin/based-on-ant/SearchAll.vue";
import { PlusOutlined } from "@ant-design/icons-vue";
// import CountryCascaderTabMore from "@/components/common/CountryCascaderTabMore.vue";
import CountryCascaderTabMore from "./components/CountryCascaderTabMore.vue";
import { Modal, message } from "ant-design-vue";
import axios from "axios";
import _ from "lodash";
const $confirm = Modal.confirm;
const $message = message;
const request = Core.Api.inquiry_sheet.cusomerList;
const { t } = useI18n();

const { loading, tableData, search, refreshTable, onPageChange, searchParam } = useTable({
    request,
    isPageAble: false,
    initParam: {
        org_id: 1,
        org_type: 10,
        return_type: 1,
    },
});
const countryOptions = ref([]);
// 给大洲的所有子元素添加父级code,并且添加一个全选
const addParentCode = (arr, parentCode, parentName) => {
    arr.forEach((item) => {
        item.parentCode = parentCode;
        item.parentName = parentName;
        item.label = item.name;
        item.value = item.name;
        if (item.children && item.children.length) {
            addParentCode(item.children, item.code, item.name);
        }
    });
    let country = [];
    arr.forEach((item) => {
        if (item.children && item.children.length) {
            country = country.concat(item.children);
        }
    });
    return country;
};
const getCountryOptions = () => {
    axios.get("/ext/continent-country.json").then((response) => {
        console.log(response.data);
        countryOptions.value = addParentCode(response.data, "", "");
        console.log(countryOptions.value);
    });
};
// 只传递国家名字

// 搜索配置
const searchList = ref([
    {
        // 问询单号
        type: "input",
        value: "",
        searchParmas: "username",
        key: "customer-care.customer_service_account",
    },
]);
// 表格配置
const tableColumns = computed(() => {
    let column = [
        {
            // 序号
            title: t("customer-care.serial_number"),
            dataIndex: "index",
            key: "index",
            align: "center",
            width: 80,
            customRender: ({ text, record, index }) => {
                return index + 1;
            },
        },
        {
            // 账号
            title: t("customer-care.customer_service_account"),
            dataIndex: "username",
            key: "username",
            align: "center",
        },
        {
            // 名称
            title: t("customer-care.name"),
            dataIndex: "name",
            key: "name",
            align: "center",
        },
        {
            // 地区
            title: t("customer-care.area"),
            dataIndex: "area",
            key: "area",
            align: "center",
        },
        // 设置
        {
            title: t("customer-care.setting"),
            dataIndex: "setting",
            key: "setting",
            align: "center",
        },
    ];
    return column;
});
const editVisibilty = ref(false);
const formState = ref({
    username: null,
    country: [],
    area: [],
    org_id: 1,
    org_type: 10,
});
const allAccount = ref([]);
const otherAccount = computed(()=>{
    return allAccount.value.filter((item)=>{
        return item.area !== '其他';
    })
})

const formRef = ref(null);
const activeRecord = ref({});
const openType = ref("");

const rules = ref({
    username: [
        {
            required: true,
            validator: (rule, value, callback) => {
                if (!value) {
                    return Promise.reject(new Error("请选择客服账号"));
                }
                return Promise.resolve();
            },
            trigger: ["blur", "change"],
        },
    ],
    country: [
        {
            required: true,
            validator: (rule, value) => {
                if (!value || !value.length) {
                    return Promise.reject("请选择地区");
                }
                return Promise.resolve();
            },
            trigger: ["blur", "change"],
        },
    ],
});
const modalTitle = ref("");

// 搜索
const onSearch = (params) => {
    searchParam.value = params;
    search();
};
// 重置
const onReset = () => {
    refreshTable();
};
// 编辑
const handleEdit = (type, record) => {
    getCustomerServiceAccount();
    switch (type) {
        case "add":
            modalTitle.value = t("customer-care.add_distribution");
            openType.value = "add";
            activeRecord.value = {};
            break;
        case "edit":
            console.log("编辑", record);
            modalTitle.value = t("customer-care.modify_distribution");
            openType.value = "edit";
            activeRecord.value = record;
            formState.value.username = record.username;
            // 处理国家的回显
            let reviewData = record?.area?.split(",") || [];
            let target = [];
            reviewData.forEach((item) => {
                countryOptions.value.forEach((item2) => {
                    if (item === item2.name) {
                        target.push([item2.parentName, item2.name]);
                    }
                });
            });
            formState.value.country = target;
            formState.value.id = record.id;
            console.log(formState.value);
            break;
        default:
            break;
    }
    editVisibilty.value = true;
};
// 删除
const handleDelete = (record) => {
    $confirm({
        title: `${t("customer-care.confirm_delete")}${record.username}?`,
        okText: t("customer-care.confirm"),
        okType: "danger",
        cancelText: t("customer-care.cancel"),
        onOk() {
            Core.Api.inquiry_sheet.deleteCustomer({ username: record.username }).then((res) => {
                refreshTable();
            });
        },
    });
};
// 获取所有的客服账号
const getCustomerServiceAccount = () => {
    console.log("获取所有的客服账号");
    request({
        org_id: 1,
        org_type: 10,
        return_type: 0,
    }).then((res) => {
        allAccount.value = res.list;
    });
};
// 提交
const handleSubmit = () => {
    console.log("提交", formState);
    formRef.value.validate().then((res) => {
        let arr = [];
        let country = _.cloneDeep(formState.value.country);
        country.forEach((item) => {
            arr.push(item[1]);
        });
        formState.value.country = arr.join(",");
        Core.Api.inquiry_sheet.addCustomer(formState.value).then((res) => {
            editVisibilty.value = false;
            $message.success(t("customer-care.successfully_add"));
            refreshTable();
        });
    });
};
// 取消
const handleCancel = () => {
    editVisibilty.value = false;
    // 清空数据
    formState.value = {
        username: null,
        area: [],
        country: [],
        org_id: 1,
        org_type: 10,
    };
};

onMounted(() => {
    getCountryOptions();
});
</script>

<style lang="less" scoped>
.account-management {
    .table-container {
        .add-btn {
            margin-bottom: 10px;
        }
    }
    :deep(.ant-table-cell) {
        .area-cell {
            display: inline-block;
            width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: center;
            cursor: pointer;
        }
    }
}
</style>
