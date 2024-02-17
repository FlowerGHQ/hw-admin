<template>
    <div class="list-container">
        <div class="title">
            <span>{{ $t('crm_dash.sale_presentation') }}</span>
        </div>
        <div class="table-container">
            <a-row :gutter="[20, 0]">
                <a-col :xs="24" :sm="12" :xl="12" :xxl="12">
                    <div class="form-item">
                        <span class="form-label"
                            ><i class="icon i_s_customer" style="margin-right: 16px" />{{
                                $t('crm_dash.new_customer_count')
                            }}</span
                        >
                        <span class="form-value" @click="routerChange">{{ this.form.new_customer_count || '-' }}</span>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="12" :xl="12" :xxl="12">
                    <div class="form-item">
                        <span class="form-label"
                            ><i class="icon i_s_customer" style="margin-right: 16px" />{{
                                $t('crm_dash.new_contact_count')
                            }}</span
                        >
                        <span class="form-value" @click="routerChange">{{ this.form.new_contact_count || '-' }}</span>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="12" :xl="12" :xxl="12">
                    <div class="form-item">
                        <span class="form-label"
                            ><i class="icon i_s_customer" style="margin-right: 16px" />{{
                                $t('crm_dash.new_order_count')
                            }}</span
                        >
                        <span class="form-value" @click="routerChange">{{ this.form.new_order_count || '-' }}</span>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="12" :xl="12" :xxl="12">
                    <div class="form-item">
                        <span class="form-label"
                            ><i class="icon i_s_customer" style="margin-right: 16px" />{{
                                $t('crm_dash.new_bo_count')
                            }}</span
                        >
                        <span class="form-value" @click="routerChange">{{ this.form.new_bo_count || '-' }}</span>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="12" :xl="12" :xxl="12">
                    <div class="form-item">
                        <span class="form-label"
                            ><i class="icon i_s_customer" style="margin-right: 16px" />{{
                                $t('crm_dash.win_bo_count')
                            }}</span
                        >
                        <span class="form-value" @click="routerChange">{{ this.form.win_bo_count || '-' }}</span>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="12" :xl="12" :xxl="12">
                    <div class="form-item">
                        <span class="form-label"
                            ><i class="icon i_s_customer" style="margin-right: 16px" />{{
                                $t('crm_dash.new_test_driver_count')
                            }}</span
                        >
                        <span class="form-value" @click="routerChange">{{
                            this.form.new_test_driver_count || '-'
                        }}</span>
                    </div>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script>
import Core from '../../../core';
import { Chart } from '@antv/g2';

export default {
    name: 'Card',
    components: {},
    props: {
        searchForm: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            form: {
                new_customer_count: '',
                new_contact_count: '',
                new_order_count: '',
                new_bo_count: '',
                win_bo_count: '',
                new_test_driver_count: '',
            },
        };
    },
    watch: {
        searchForm: {
            deep: true,
            immediate: true,
            handler(n) {
                this.salesStatistics();
            },
        },
    },
    computed: {},
    created() {},
    mounted() {
        this.salesStatistics();
    },
    methods: {
        salesStatistics() {
            Core.Api.CRMDashboard.salesStatistics({
                ...this.searchForm,
            }).then(res => {
                this.form.new_customer_count = res.new_customer_count;
                this.form.new_contact_count = res.new_contact_count;
                this.form.new_order_count = res.new_order_count;
                this.form.new_bo_count = res.new_bo_count;
                this.form.win_bo_count = res.win_bo_count;
                this.form.new_test_driver_count = res.new_test_driver_count;
            });
        },
        routerChange() {},
    },
};
</script>

<style lang="less" scoped>
.title {
    padding: 12px 16px;
    border-bottom: 2px solid #f0f2f5;
    font-size: 16px;
    font-weight: bold;
    .flex(space-between, center, row);
    .tab-item {
        display: inline-block;
        padding: 4px 8px;
        border: 1px solid grey;
        margin-right: 2px;
        font-size: 12px;
        user-select: none;
        cursor: pointer;
        &:first-child {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }
        &:last-child {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            margin-right: 0;
        }
    }
    .tab-current {
        border: 1px solid #006ef9;
        color: #006ef9;
    }
}
.contain {
    padding: 16px;
}
.form-item {
    // border: 1px solid red;
    border-bottom: 1px solid #f0f2f5;
    padding: 16px 0;
    .flex(space-between, center, row);
    .form-label {
        font-size: 14px;
    }
    .form-value {
        color: #006ef9;
        font-size: 20px;
    }
}
.chart {
    width: 100%;
    height: auto;
}
.data-body {
    .flex(flex-start, center, row);
    .icon {
        text-align: center;
    }
}
.data-contain {
    flex-grow: 1;
    width: auto;
    .flex(space-between, center, row);
    .info-item {
        .flex(space-between, center);
        .label {
            font-size: 12px;
            color: grey;
        }
        .value {
            font-size: 24px;
            font-weight: bold;
            color: black;
        }
    }
}
</style>
