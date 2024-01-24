<template>
    <div class="account-management">
        <div class="list-container">
            <!-- 头部 -->
            <div class="title-container">
                <div class="title-area">{{ $t("customer-care.account_management_and_distribution") }}</div>
            </div>
            <div class="search">
                <SearchAll :options="searchList" @search="onSearch" @reset="onReset" :isShowMore="false"> </SearchAll>
            </div>
            <div class="table-container">
                <a-button type="primary" class="add-btn" @click="handleEdit('add')">
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
                        <template v-if="column.key === 'setting'">
                            <div class="default-accout" v-if="index === 0">-</div>
                            <div class="other-accout" v-else>
                                <a-button type="link" size="small" @click="handleEdit('edit')">
                                    <!-- 编辑 -->
                                    {{ $t("customer-care.edit") }}
                                </a-button>
                                <a-button type="link" size="small" @click="handleDelete">
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
            title="Basic Modal" 
            :visible="editVisibilty" 
            ok-text="确认" 
            cancel-text="取消"
            @cancel="editVisibilty = false"
            @ok="editVisibilty = false"
        >
            <!-- 表单 -->
            <a-form
                ref="formRef"
                name="custom-validation"
                :model="formState"
                :rules="rules"
            >
                <a-form-item label="客服账号" name="username">
                    <a-select v-model:value="formState.username" placeholder="请选择客服账号">
                        <a-select-option value="china">中国</a-select-option>
                        <a-select-option value="japan">日本</a-select-option>
                        <a-select-option value="korea">韩国</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="分配国家" name="area">
                    <a-select v-model:value="formState.area" placeholder="请选择分配国家">
                        <a-select-option value="china">中国</a-select-option>
                        <a-select-option value="japan">日本</a-select-option>
                        <a-select-option value="korea">韩国</a-select-option>
                    </a-select>
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
const editVisibilty = ref(true);
const formState = ref({
    username: null,
    area: null,
});
const rules = ref({
    username: [
        {
            required: true,
            message: "请输入账号",
            trigger: "blur",
        },
    ],
    area: [
        {
            required: true,
            message: "请选择分配国家",
            trigger: "blur",
        },
    ],
});


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
const handleEdit = (type) => {
    editVisibilty.value = true;
};
// 删除
const handleDelete = () => {
    console.log("删除");
};

</script>

<style lang="less" scoped>
.account-management {
    .table-container {
        .add-btn {
            margin-bottom: 10px;
        }
    }
}
</style>
