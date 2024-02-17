<template>
    <div class="SearchRangePicker">
        <a-radio-group class="org-type" v-model:value="org_type" @change="handleChange()" v-if="org_type_list">
            <a-radio-button class="type-item" v-for="item of org_type_list" :key="item.value" :value="item.value">{{
                item.text
            }}</a-radio-button>
        </a-radio-group>

        <a-range-picker v-model:value="time" @change="handleChange()" :allowClear="false" />
    </div>
</template>

<script>
import Core from '../../core';
import dayjs from 'dayjs';

export default {
    name: 'SearchRangePicker',
    components: {},
    props: {},
    emit: ['search'],
    data() {
        return {
            org_type: 0,

            time: [],
        };
    },
    computed: {
        org_type_list() {
            let list = null;
            if (this.$auth('ADMIN')) {
                list = [
                    { value: 0, text: this.$t('n.all') },
                    { value: 1, text: this.$t('n.distributor') },
                    { value: 2, text: this.$t('n.agent') },
                    { value: 3, text: this.$t('n.store') },
                ];
            } else if (this.$auth('DISTRIBUTOR')) {
                list = [
                    { value: 0, text: this.$t('n.all') },
                    { value: 2, text: this.$t('n.agent') },
                    { value: 3, text: this.$t('n.store') },
                ];
            } else if (this.$auth('AGENT')) {
                list = [
                    { value: 0, text: this.$t('n.all') },
                    { value: 3, text: this.$t('n.store') },
                ];
            }
            return list;
        },
    },
    mounted() {
        this.time = [dayjs().subtract(7, 'days'), dayjs()];
        this.handleChange();
    },
    methods: {
        handleChange() {
            let begin_time = dayjs(this.time[0]);
            let end_time = dayjs(this.time[1]);
            let data = {
                org_type: this.org_type,
                begin_time: begin_time.startOf('day').unix(),
                end_time: end_time.endOf('day').unix(),
            };
            let diff = end_time.diff(begin_time, 'days');

            let dateList = [begin_time.format('YYYY-MM-DD')];
            for (let i = 1; i <= diff; i++) {
                dateList.push(dayjs(begin_time).add(i, 'days').format('YYYY-MM-DD'));
            }
            // console.log('handleChange data:', data, 'dateList', dateList)
            this.$emit('search', data, dateList);
        },
    },
};
</script>

<style lang="less">
.SearchRangePicker {
    margin-bottom: 20px;
    width: 100%;
    display: flex;
    .org-type {
        margin-right: 20px;
        .type-item {
            width: 88px;
            text-align: center;
            border-color: #eaecf2;
            box-shadow: 0 0 0 0;
            &::after,
            &::before {
                background-color: #eaecf2;
            }
            &:hover {
                color: @TC_P;
            }
            &.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
                color: @TC_P;
                background: @BG_N;
                border-color: @BC_P;
                box-shadow: 0;
                &::after,
                &::before {
                    background-color: @BC_P;
                }
            }
        }
    }
    .time-type {
        margin-left: 20px;
        .fac();
        .type-item {
            padding: 0;
            + .type-item {
                margin-left: 24px;
            }
            color: @TC_link;
            cursor: pointer;
            &:hover,
            &.active {
                color: @TC_P;
            }
        }
    }
}
</style>
