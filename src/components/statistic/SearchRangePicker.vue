<template>
<div class="SearchRangePicker">
    <a-radio-group class="org-type" v-model:value="org_type" @change="handleChange()" v-if="org_type_list">
        <a-radio-button class="type-item" v-for="item of org_type_list" :key="item.value" :value="item.value">{{item.text}}</a-radio-button>
    </a-radio-group>

    <a-range-picker v-model:value="time" @change="handleChange()" :allowClear="false"/>
    <!-- <div class="time-type">
        <div v-for="item of time_type_list" :key="item.value" class="type-item"
            @click="handleTimeAreaChange(item.value)">{{item.text}}</div>
    </div> -->
</div>
</template>

<script>
import Core from '../../core'
import moment from 'moment';
import dayjs from 'dayjs';

export default {
    name: 'SearchRangePicker',
    components: {},
    props: {},
    emit: ['search'],
    data() {
        return {
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_E,

            org_type: 0,
            time_type_list: [
                {value: 1, text: '今日'},
                {value: 2, text: '本周'},
                {value: 3, text: '本月'},
            ],

            time: [],
        }
    },
    computed: {
        org_type_list() {
            let list = null
            if (this.$auth('ADMIN')) {
                list = [
                    {value: 0, text: '全部'},
                    {value: 1, text: '经销商'},
                    {value: 2, text: '门店'},
                ]
            } else if (this.$auth('AGENT')) {
                list = [
                    {value: 0, text: '全部'},
                    {value: 2, text: '门店'},
                ]
            }
            return list
        },
    },
    mounted() {
        this.time = [moment().subtract(7, 'days'), moment()]
        this.handleChange();
    },
    methods: {
        // 时间范围快速选择
        handleTimeAreaChange(val) {
            switch (val) {
                case 1: this.time = [moment().startOf('day'), moment().endOf('day')]; break;
                case 2: this.time = [moment().startOf('week'), moment().endOf('week')]; break;
                case 3: this.time = [moment().startOf('month'), moment().endOf('month')]; break;
            }
            this.handleChange();
        },

        handleChange() {
            let begin_time = moment(this.time[0])
            let end_time = moment((this.time[1]))
            let data = {
                org_type: this.org_type,
                begin_time: begin_time.startOf('day').unix(),
                end_time: end_time.endOf('day').unix(),
            }
            let diff = end_time.diff(begin_time, 'days')

            let dateList = [begin_time.format('YYYY-MM-DD')]
            for (let i = 1; i <= diff; i++) {
                dateList.push(moment(begin_time).add(i, 'days').format('YYYY-MM-DD'))
            }

            console.log('handleChange data:', data, dateList)
            this.$emit('search', data, dateList)
        },
    }
}
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
            border-color: #EAECF2;
            box-shadow: 0 0 0 0;
            &::after, &::before {
                background-color: #EAECF2;
            }
            &:hover {
                color: @TC_P;
            }
            &.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
                color: @TC_P;
                background: @BG_N;
                border-color: @BC_P;
                box-shadow: 0;
                &::after, &::before {
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
            + .type-item { margin-left: 24px; }
            color: @TC_link;
            cursor: pointer;
            &:hover, &.active {
                color: @TC_P;
            }
        }
    }
}
</style>
