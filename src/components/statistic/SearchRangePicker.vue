<template>
<div class="SearchRangePicker">
    <a-radio-group class="org-type" v-model:value="org_type" @change="handleChange">
        <a-radio-button v-for="item of org_type_list" :key="item.value"
            class="type-item" :value="item.value">{{item.text}}</a-radio-button>
    </a-radio-group>

    <a-range-picker v-model="time" @change="handleChange" :allowClear="false"/>
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
    components: {
        SimpleImageEmpty: () => import('../SimpleImageEmpty.vue')
    },
    props: {
        storeSelect: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_E,

            org_type: 0,
            org_type_list: [
                {value: 0, text: '全部'},
                {value: 2, text: '经销商'},
                {value: 3, text: '门店'},
            ],
            time_type_list: [
                {value: 1, text: '今日'},
                {value: 2, text: '本周'},
                {value: 3, text: '本月'},
            ],

            time: [],
        }
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
            let data = {
                org_type: this.org_type,
                begin_time: moment(this.time[0]).startOf('day').unix(),
                end_time: moment((this.time[1])).endOf('day').unix(),
            }
            console.log('handleChange data:', data)
            this.$emit('change', data)
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
            padding: 0 16px;
            &:hover {
                color: @TC_P;
            }
            &.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
                color: @TC_P;
                background: @BG_N;
                border-color: @BC_P;
                box-shadow: 0;
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
