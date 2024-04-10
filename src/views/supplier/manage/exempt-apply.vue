<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('supply-chain.supplier_exempt_application') }}</div>
        </div>
        <div class="table-container">
            <div class="form-area">
                <a-form ref="formRef" :model="formState" layout="vertical" name="form_in_modal">
                    <a-row :gutter="16" justify="start" :wrap="true">
                        <a-col :span="item.span" v-for="item in form" :key="item.value">
                            <a-form-item :label="item.label" :name="item.value">
                                <a-input v-if="item.type === 'input'" :placeholder="item.placeholder"></a-input>
                                <a-textarea
                                    v-else-if="item.type === 'textarea'"
                                    :placeholder="item.placeholder"
                                ></a-textarea>
                                <a-table
                                    v-else-if="item.type === 'table'"
                                    :columns="item.columns"
                                    :data-source="[]"
                                    :row-key="record => record.id"
                                ></a-table>
                                <a-date-picker
                                    v-else-if="item.type === 'date-picker'"
                                    :placeholder="item.placeholder"
                                ></a-date-picker>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-form-item class="btn-area">
                        <a-button type="primary">{{ $t('def.submit') }}</a-button>
                        <a-button>{{ $t('def.cancel') }}</a-button>
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </div>
</template>

<script setup>
/* methods end*/
import { ref, render } from 'vue';

const form = ref([
    {
        label: '公司名称',
        value: 'companyName',
        type: 'input',
        placeholder: '请输入公司名称',
        span: 24,
    },
    // 详细地址
    {
        label: '详细地址',
        value: 'address',
        type: 'input',
        placeholder: '请输入详细地址',
        span: 24,
    },
    // 主要客户
    {
        label: '主要客户',
        value: 'mainCustomer',
        type: 'table',
        placeholder: '请输入主要客户',
        span: 24,
        columns: [
            {
                title: '客户名称',
                dataIndex: 'customerName',
                key: 'customerName',
                width: 200,
                type: 'input',
            },
            {
                title: '销售占比',
                dataIndex: 'proportion',
                key: 'proportion',
                width: 200,
                type: 'input',
            },
            {
                // 主供零件
                title: '主供零件',
                dataIndex: 'mainParts',
                key: 'mainParts',
                width: 200,
                type: 'input',
            },
            // 开始合作时间
            {
                title: '开始合作时间',
                dataIndex: 'startTime',
                key: 'startTime',
                width: 200,
                type: 'date-picker',
            },
        ],
    },
    {
        label: '主营业务',
        value: 'mainBusiness',
        type: 'textarea',
        placeholder: '请输入主营业务',
        span: 24,
    },
    {
        label: '经营业绩',
        value: 'businessPerformance',
        type: 'textarea',
        placeholder: '请输入经营业绩',
        span: 24,
    },
    {
        label: '拟供产品',
        value: 'supplyProduct',
        type: 'textarea',
        placeholder: '请输入拟供产品',
        span: 24,
    },
    {
        label: '免审理由',
        value: 'exemptReason',
        type: 'textarea',
        placeholder: '请输入免审理由',
        span: 24,
    },
]);
const formState = ref({
    companyName: '',
    address: '',
    mainCustomer: [],
    mainBusiness: '',
    businessPerformance: '',
    supplyProduct: '',
    exemptReason: '',
});
</script>

<style lang="less" scoped>
.btn-area {
    text-align: center;
}
</style>
