<template>
<div id="customer-care-edit" class="edit-container">
    <div class="title-container">
        <div class="title-area">
            {{ true ? $t('customer-care.modify_inquiry_form') : $t('customer-care.create_inquiry_form') }}
        </div>
    </div>
    <!-- 问询单类型 -->
    <div class="form-block">
        <div class="form-title">
            <div class="title customer-care-required">{{ $t('customer-care.inquiry_form_type') }}</div>
        </div>
        <div class="form-content">            
            <a-radio-group v-model:value="formParams.type">
                <a-radio v-for="(item, index) in Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE" :value="item.value">
                    {{ $t(item.t) }}
                </a-radio>
            </a-radio-group>
        </div>
    </div>
    <!-- 问题描述 -->
    <div class="form-block">
        <div class="form-title">
            <div class="title">{{ $t('customer-care.problem_description') }}</div>
        </div>
        <div class="form-content">
            <div class="horizontal-search-row">
                <!-- 故障日期 -->
                <div v-if="!$Util.Common.returnTypeBool(formParams.type, [Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.CONSULTATION])" class="search-col required">
                    <div class="key key-default-w c-white-space t-r">{{ $t('customer-care.failure_date') }}:</div>
                    <div class="value">
                        <a-date-picker
                            class="w-370"
                            v-model:value="formParams.time"
                        /> 
                    </div>
                </div>
                <!-- 车型 -->
                <div class="search-col required">
                    <div class="key key-default-w c-white-space t-r">{{ $t('common.vehicle_model') }}:</div>
                    <div class="value">
                        可能是树状结构
                    </div>
                </div>
                <!-- 车架号 -->
                <div 
                    v-if="$Util.Common.returnTypeBool(formParams.type, [Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.MALFUNCTION])" 
                    class="search-col d-f-s required"
                >
                    <div class="key key-default-w c-white-space t-r">{{ $t('common.vehicle_no') }}:</div>
                    <div class="value">
                        <a-table
                            :columns="vehicle_column"
                            :dataSource="formParams.list"
                            :scroll="{ x: true }"
                            :row-key="(record) => record.id"
                            :pagination="false"
                            class="specific-table">
                            <template #headerCell="{ title }">
                                {{ $t(title) }}
                            </template>
                            <template #bodyCell="{ column, record, index }">
                                <!-- 车架号 -->
                                <template v-if="column.key === 'no'">
                                    <a-input 
                                        v-model:value="record.no" 
                                        :placeholder="$t('common.please_enter') + $t('common.vehicle_no')"
                                    />
                                </template>
                                <!-- 公里数 -->
                                <template v-if="column.key === 'mileage'">
                                    <a-input 
                                        v-model:value="record.mileage" 
                                        :placeholder="$t('common.please_enter') + $t('customer-care.mileage')"
                                    />
                                </template>
                                <!-- 操作 -->
                                <template v-if="column.key === 'operations'">
                                    <a-button 
                                        v-if="index !== 0" 
                                        type="link" 
                                        @click="onAddBtn('delete', record, index)"
                                    >
                                        <i class="icon i_delete" />
                                        {{ $t("common.delete") }}
                                    </a-button>
                                </template>
                            </template>
                        </a-table>

                        <a-button
                            class="m-t-16"
                            type="primary"
                            ghost
                            @click="onAddBtn('add-data')"
                        >
                            {{ $t('supply-chain.add_opponents') }}
                        </a-button>
                    </div>
                </div>
                <!-- 公里数 -->
                <div v-if="$Util.Common.returnTypeBool(formParams.type, [Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.CONSULTATION])" class="search-col required">
                    <div class="key key-default-w c-white-space t-r">{{ $t('customer-care.mileage') }}:</div>
                    <div class="value">
                        <a-input 
                            v-model:value="formParams.mileage" 
                            :placeholder="$t('common.please_enter') + $t('customer-care.mileage')"
                        />
                    </div>
                </div>
                <!-- 问题描述 -->
                <div class="search-col d-f-s required">
                    <div class="key key-default-w c-white-space t-r">{{ $t('customer-care.problem_description') }}:</div>
                    <div class="value">
                        <a-textarea 
                            v-model:value="formParams.description" 
                            :placeholder="$t('common.please_enter') + $t('customer-care.problem_description')"
                            allow-clear 
                            :maxlength="20000"
                        />
                    </div>
                </div>
                <!-- 添加附件 -->
                <div class="search-col d-f-s">
                    <div class="key key-default-w c-white-space t-r">{{ $t('customer-care.add_attachment') }}:</div>
                    <div class="value">
                        <!-- <div class="add-attachment-tip">
                            <div>{{ $t('customer-care.tip1') }}</div>
                            <div>{{ $t('customer-care.tip2') }}</div>
                            <div>{{ $t('customer-care.tip3') }}</div>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="form-btns footer-btn">
        <a-button @click="routerChange('back')">{{ $t('def.cancel') }}</a-button>
        <a-button @click="handleSubmit" type="primary" v-if="$auth('repair-order.save')">{{ $t('def.sure') }}</a-button>
    </div>
</div>
</template>

<script setup>
import { ref, watch, computed, getCurrentInstance } from 'vue';
import Core from '../../core';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance()
const router = useRouter();

const isDistributerAdmin = ref(false)  // 根据路由判断其是用在分销商(false) 还是平台方(true)

watch(
    () => router.currentRoute.value,
    (newValue, oldValue) => {
        console.log("newValue", newValue);
        if (newValue.matched[0].path === '/customer-care') {
            // 分销商的客户关怀
            isDistributerAdmin.value = false
        } else if (newValue.matched[0].path === '/inquiry-management') {
            // 平台方
            isDistributerAdmin.value = true
        }
    },
    {
        deep: true,
        immediate: true,
    }
);

const formParams = ref({
    type: 1,
    time: undefined,
    description: undefined,
    file: undefined,
    mileage: undefined, // 公里数
    list: [
        {
            no: "",
            mileage: "",
        }
    ], // 车架号、公里数
})

/* computed start*/
const vehicle_column = computed(() => {
    let result = [
        { title: proxy.$t("common.vehicle_no"), dataIndex: "no", key: "no" }, // 车架号
        { title: proxy.$t("customer-care.mileage"), dataIndex: "mileage", key: "mileage" }, // 公里数
        { title: proxy.$t("common.operations"), dataIndex: "operations", key: "operations", fixed: "right", width: 100, }, // 操作
    ]
    return result
})
/* computed end*/

/* methods start*/
const onAddBtn = (type, record, index) => {
    switch (type) {
        case 'add-data':
            formParams.value.list.push(
                {
                    no: "",
                    mileage: "",
                }
            )
        break;
        case 'delete':
            formParams.value.list.splice(index, 1)
        break;
    
        default:
            break;
    }
}
/* methods end*/


</script>

<style lang="less">
#customer-care-edit {
    height: 100%;
    position: relative;

    .d-f-a {
        display: flex;
        align-items: center;
    }

    .customer-care-required {
        &::before {
            content: "*";
            color: #EB4141;
            margin-right: 4px;
            vertical-align: middle;
        }
    }

    .add-attachment-tip {
        color: #c7bfbf;
        margin-bottom: 12px;
    }

    .footer-btn {
        position: absolute;
        bottom: 0;
        width: calc(100% - 200px);
        text-align: center;
    }
}

.w-370 {
    width: 370px;
}

.d-f-s {
    align-items: flex-start !important;
}

.t-r {
    text-align: right;
    margin-right: 8px;
    color: #c7bfbf;
}
</style>
