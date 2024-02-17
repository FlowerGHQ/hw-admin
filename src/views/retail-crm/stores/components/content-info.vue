<template>
    <div>
        <a-row class="row-box">
            <a-col :xs="24" :sm="12" :xl="8" :xxl="6" class="col-item" v-for="$1 in msgList" :key="$1.value">
                <span class="title">{{ $t($1.title) }}:</span>
                <div class="value">
                    <a-input style="width: 80%; font-size: 14px" :placeholder="$t($1.placeholder)" />
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
export default {
    name: 'StoreList',
    data() {
        return {};
    },
    props: {},
    watch: {},
    computed: {
        msgList() {
            let list = [
                {
                    title: 'crm_st.owner',
                    value: 'name',
                    type: 1,
                    placeholder: 'crm_st.owner_placeholder',
                    onFocus: undefined,
                },
                {
                    title: 'crm_st.owner_con',
                    value: 'phone',
                    type: 0,
                    placeholder: 'crm_st.owner_placeholder',
                    onFocus: undefined,
                },
                { title: 'crm_st.com_affil', value: 'intention', type: 4, placeholder: '', onFocus: undefined },
                {
                    title: 'crm_st.rental_costs',
                    value: 'gender',
                    type: 2.3,
                    placeholder: 'crm_st.rental_costs_placeholder',
                    onFocus: false,
                },
                { title: 'crm_st.rent_payment_cycle', value: 'industry', type: 3, placeholder: '', onFocus: false },
                { title: 'crm_st.time_rent_payment', value: 'industry', type: 3, placeholder: '', onFocus: false },
                {
                    title: 'crm_st.property_costs',
                    value: 'source_type',
                    type: 0,
                    placeholder: 'crm_st.property_costs_placeholder',
                    onFocus: false,
                },
                {
                    title: 'crm_st.property_payment_cycle',
                    value: 'create_time',
                    placeholder: '',
                    type: 0.1,
                    onFocus: undefined,
                },
                {
                    title: 'crm_st.property_payment_time',
                    value: 'pre_order_car_type',
                    placeholder: '',
                    type: 2,
                    onFocus: false,
                },
                {
                    title: 'crm_st.renovation_costs',
                    value: 'tab_type',
                    type: 0.2,
                    placeholder: 'crm_st.renovation_costs_placeholder',
                    onFocus: undefined,
                },
            ];
            return list;
        },
    },
    mounted() {},
    methods: {},
};
</script>

<style lang="less" scoped>
.row-box {
    padding-top: 8px;
}
.col-item {
    .fac();
    margin-bottom: 20px;
    height: 32px;
    min-width: 150px;

    .title {
        width: 120px;
        text-align: right;
        padding-right: 16px;

        color: var(--color-text-1, #1d2129);
        font-family: PingFang SC;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }

    .value {
        color: #2d2e30;
        width: calc(~'100% - 120px');
        .ell();
    }
}
</style>
