<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('supply-chain.supplier_exempt_application') }}</div>
        </div>
        <div class="table-container">
            <div class="form-area">
                <a-form ref="formRef" :model="formState" layout="vertical">
                    <a-row :gutter="16" justify="start" :wrap="true">
                        <a-col :span="item.span" v-for="item in form" :key="item.value">
                            <a-form-item :label="item.label" :name="item.value" v-if="item.type !== 'table'">
                                <a-input
                                    v-if="item.type === 'input'"
                                    :placeholder="item.placeholder"
                                    v-model:value="formState[item.value]"
                                    :disabled="item.disabled"
                                ></a-input>
                                <a-textarea
                                    v-else-if="item.type === 'textarea'"
                                    :placeholder="item.placeholder"
                                    v-model:value="formState[item.value]"
                                    :autosize="item.autosize"
                                    :maxlength="item.maxlength"
                                    :show-count="item.showCount"
                                    :disabled="item.disabled"
                                ></a-textarea>
                                <!-- cascader -->
                                <a-cascader
                                    v-else-if="item.type === 'cascader'"
                                    :options="item.options"
                                    :placeholder="item.placeholder"
                                    v-model:value="formState[item.value]"
                                    :fieldNames="item.fieldNames"
                                    :disabled="item.disabled"
                                ></a-cascader>
                            </a-form-item>
                            <div v-else-if="item.type === 'table'">
                                <div class="item-label-button">
                                    <div class="name">
                                        {{ item.label }}
                                    </div>
                                    <a-button type="primary" @click="handleAddRow">
                                        {{ $t('db.new_customer') }}
                                    </a-button>
                                </div>
                                <a-table
                                    :columns="item.columns"
                                    :row-key="record => record.id"
                                    :data-source="formState[item.value]"
                                >
                                    <template #bodyCell="{ column, text, record, index }">
                                        <template v-if="column.type === 'input'">
                                            <a-input
                                                v-model:value="record[column.dataIndex]"
                                                :placeholder="column.placeholder"
                                                :maxlength="column.maxlength"
                                                :show-count="column.showCount"
                                                style="width: 100%"
                                                :disabled="column.disabled"
                                            ></a-input>
                                        </template>
                                        <template v-else-if="column.type === 'input-number'">
                                            <a-input-number
                                                v-model:value="record[column.dataIndex]"
                                                :placeholder="column.placeholder"
                                                :addon-after="column.addonAfter"
                                                :min="column.min"
                                                :max="column.max"
                                                :step="column.step"
                                                :precision="column.precision"
                                                style="width: 100%"
                                                :disabled="column.disabled"
                                            >
                                            </a-input-number>
                                        </template>
                                        <template v-else-if="column.type === 'date-picker'">
                                            <a-date-picker
                                                v-model:value="record[column.dataIndex]"
                                                :placeholder="column.placeholder"
                                                valueFormat="X"
                                                style="width: 100%"
                                                :disabled="column.disabled"
                                            ></a-date-picker>
                                        </template>
                                    </template>
                                </a-table>
                            </div>
                        </a-col>
                    </a-row>
                    <a-form-item class="btn-area">
                        <a-button type="primary" @click="handleSubmit">{{ $t('def.submit') }}</a-button>
                        <a-button @click="handleCancle">{{ $t('def.cancel') }}</a-button>
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </div>
</template>

<script setup>
/* methods end*/
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Core from '@/core';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const $t = useI18n().t;
const route = useRoute();
const router = useRouter();
const form = computed(() => [
    {
        label: $t('supply-chain.company_name'),
        value: 'company_name',
        type: 'input',
        placeholder: $t('common.please_enter'),
        span: 24,
        disabled: true,
    },
    // 省市
    {
        label: $t('supply-chain.province_city'),
        value: 'province_city',
        type: 'cascader',
        placeholder: $t('common.please_enter'),
        span: 12,
        options: chinaOptions.value,
        fieldNames: { label: 'name', value: 'name', children: 'children' },
        disabled: true,
    },
    // 详细地址
    {
        label: $t('supply-chain.detailed_address'),
        value: 'address',
        type: 'input',
        placeholder: $t('common.please_enter'),
        span: 12,
        disabled: true,
    },
    // 主要客户
    {
        label: $t('supply-chain.major_customer'),
        value: 'list',
        type: 'table',
        span: 24,
        columns: [
            {
                title: $t('supply-chain.customer_serial_number'),
                dataIndex: 'customer_order',
                key: 'customer_order',
                customRender: ({ text, record, index }) => {
                    return `${$t('supply-chain.major_customer')} ${index + 1}`;
                },
            },
            {
                title: $t('supply-chain.customer_name'),
                dataIndex: 'customer_name',
                key: 'customer_name',
                type: 'input',
                placeholder: $t('common.please_enter'),
                maxlength: 50,
                showCount: true,
                disabled: true,
            },
            {
                title: $t('supply-chain.Sales_share'),
                dataIndex: 'sales_proportion',
                key: 'sales_proportion',
                type: 'input-number',
                placeholder: $t('common.please_enter'),
                addonAfter: '%',
                min: 0,
                max: 9999999999,
                step: 1,
                precision: 0,
                disabled: true,
            },
            {
                title: $t('supply-chain.Main_supply_part'),
                dataIndex: 'main_supply_parts',
                key: 'main_supply_parts',
                type: 'input',
                placeholder: $t('common.please_enter'),
                maxlength: 100,
                showCount: true,
                disabled: true,
            },
            {
                title: $t('supply-chain.Start_time'),
                dataIndex: 'begin_time',
                key: 'begin_time',
                type: 'date-picker',
                disabled: true,
            },
        ],
    },
    // 主营业务
    {
        label: $t('supply-chain.main_business'),
        value: 'main_business',
        type: 'textarea',
        placeholder: $t('common.please_enter'),
        span: 24,
        maxlength: 2000,
        autosize: { minRows: 4, maxRows: 6 },
        showCount: true,
    },
    // 经营业绩
    {
        label: $t('supply-chain.business_performance'),
        value: 'business_performance',
        type: 'textarea',
        placeholder: $t('common.please_enter'),
        span: 24,
        maxlength: 1000,
        autosize: { minRows: 4, maxRows: 6 },
        showCount: true,
    },
    // 拟供产品
    {
        label: $t('supply-chain.proposed_products'),
        value: 'proposed_products',
        type: 'textarea',
        placeholder: $t('common.please_enter'),
        span: 24,
        maxlength: 500,
        autosize: { minRows: 4, maxRows: 6 },
        showCount: true,
    },
    // 免审理由
    {
        label: $t('supply-chain.exempt_reason'),
        value: 'remark',
        type: 'textarea',
        placeholder: $t('common.please_enter'),
        span: 24,
        maxlength: 500,
        autosize: { minRows: 4, maxRows: 6 },
        showCount: true,
    },
]);
const formState = ref({
    company_name: '', //公司名称
    address: '', //详细地址
    main_business: '', //主营业务
    business_performance: '', //经营业绩
    proposed_products: '', //拟供产品
    remark: '', //免审理由
    list: [
        {
            customer_name: '', //客户名称
            sales_proportion: undefined, //销售占比
            main_supply_parts: '', //主供零件
            begin_time: undefined, //开始合作时间
        },
    ],
});
// 中国的地区数据
const chinaOptions = ref([]);
// 一行的数据
const rowDate = ref({
    customer_name: '', //客户名称
    sales_proportion: undefined, //销售占比
    main_supply_parts: '', //主供零件
    begin_time: undefined, //开始合作时间
});

const getDetail = () => {
    let obj = {
        id: route.query.id,
    };
    Core.Api.SUPPLY.noExamineDetail(obj)
        .then(res => {
            formState.value = res.detail;
            console.log('getDetail', formState.value);
        })
        .catch(err => {
            console.log('getPhoneCodeFetchs err', err);
        });
};
// 获取china的地区数据
const getChinaArea = () => {
    let url = '/ext/China.json';
    axios.get(url).then(res => {
        chinaOptions.value = res.data;
    });
};
const handleAddRow = () => {
    formState.value.list.push({
        customer_name: '', //客户名称
        sales_proportion: undefined, //销售占比
        main_supply_parts: '', //主供零件
        begin_time: undefined, //开始合作时间
    });
};
const handleDelete = index => {
    formState.value.list.splice(index, 1);
};
const handleSubmit = () => {
    console.log('formState', formState.value);
    Core.Api.SUPPLY.noExamine({ supplier_examine: formState.value })
        .then(res => {
            console.log('handleSubmit', res);
            // 获取详情
            getDetail();
        })
        .catch(err => {
            console.log('handleSubmit err', err);
        });
};
const handleCancle = () => {
    router.go(-1);
};

onMounted(() => {
    getDetail();
    getChinaArea();
});
</script>

<style lang="less" scoped>
.btn-area {
    text-align: center;
}
.item-label-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
</style>
