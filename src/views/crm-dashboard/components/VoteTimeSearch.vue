<template>
    <div class="container">
        <div class="search-Filter">
            <a-radio-group v-model:value="day" class="time-type" @change="handleTimeTypeChange">
                <a-radio-button :class="[day === 1 ? 'type-item active' : 'type-item']" :value="1">当天</a-radio-button>
                <a-radio-button :class="[day === 2 ? 'type-item active' : 'type-item']" :value="2"
                    >近7日</a-radio-button
                >
                <a-radio-button :class="[day === 3 ? 'type-item active' : 'type-item']" :value="3"
                    >近30日</a-radio-button
                >
            </a-radio-group>
            <a-range-picker
                v-model:value="time"
                @change="handleChange()"
                :allowClear="false"
                :placeholder="[$t('crm_def.start_time'), $t('crm_def.end_time')]"
                ref="TimeSearch"
            />
        </div>
    </div>
</template>

<script>
import Core from '../../../core';
import dayjs from 'dayjs';
import '../../../assets/iconfont/iconfont';
export default {
    name: 'Card',
    components: {},
    props: {
        searchForm: {
            type: Object,
            default: () => {},
        },
        activity_id: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            day: 1,
            searchForm: {
                begin_time: '',
                end_time: '',
            },
            time: [],
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    beforeUnmount() {},
    methods: {
        // 时间转换
        handleTimeTypeChange() {
            const currentTime = dayjs(); // 当前时间
            switch (this.day) {
                case 1:
                    const todayStart = dayjs().startOf('day'); // 今天0点
                    this.time = [todayStart, currentTime];
                    break;
                case 2:
                    const sevenDaysAgo = dayjs().subtract(7, 'day'); // 向前推7天
                    this.time = [sevenDaysAgo, currentTime];
                    break;
                case 3:
                    const thirtyDaysAgo = dayjs().subtract(30, 'day'); // 向前推30天
                    this.time = [thirtyDaysAgo, currentTime];
                    break;
            }
            this.searchForm.begin_time = this.time[0].unix(); // 获取开始时间的时间戳
            this.searchForm.end_time = this.time[1].unix(); // 获取结束时间的时间戳
            console.log('this.searchForm.begin_time', this.searchForm.begin_time);
            console.log('this.searchForm.end_time', this.searchForm.end_time);
            this.searchForm.activity_id = this.activity_id;
            this.$emit('select', this.searchForm);
        },
        handleChange() {
            let begin_time = dayjs(this.time[0]);
            let end_time = dayjs(this.time[1]);
            let searchForm = this.$Util.deepCopy(this.searchForm);
            searchForm.begin_time = begin_time.startOf('day').unix();
            searchForm.end_time = end_time.endOf('day').unix();
            this.searchForm = searchForm;
            searchForm.activity_id = this.activity_id;
            this.$emit('select', searchForm);
        },
    },
};
</script>

<style lang="less" scoped>
.container {
    width: 100%;
    box-sizing: border-box;

    .search-Filter {
        width: 100%;
        padding: 0px 8px 20px 8px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        :deep(.ant-select-selector) {
            height: 30px;
            box-sizing: border-box;
            padding-left: 25px;
            padding-right: 10px !important;
        }

        :deep(.ant-select-selection-placeholder) {
            line-height: 28px;
            font-weight: 500;
            font-size: 14px;
            color: #666;
        }

        :deep(.ant-select-selection-item) {
            height: 30px;
            line-height: 28px;
            font-weight: 500;
            font-size: 14px;
            color: #444444;
        }

        :deep(.ant-picker-range) {
            margin-right: 24px;
            height: 30px;
            box-sizing: border-box;
            padding-left: 0;
        }

        :deep(.ant-picker-input) {
            input::-webkit-input-placeholder {
                /* WebKit browsers，webkit内核浏览器 */
                color: #666;
            }

            input:-moz-placeholder {
                /* Mozilla Firefox 4 to 18 */
                color: #666;
            }

            input::-moz-placeholder {
                /* Mozilla Firefox 19+ */
                color: #666;
            }

            input:-ms-input-placeholder {
                /* Internet Explorer 10+ */
                color: #666;
            }
        }

        :deep(.ant-picker-input input) {
            font-size: 14px;
            font-weight: 500;
        }

        .time-type {
            .fac();
            margin-right: 24px;

            .type-item {
                height: 30px;
                padding: 10px 24px;
                margin-left: 0 !important;
                font-size: 14px;
                font-weight: 500;
                color: #666;
                //   border-radius: 2px 0px 0px 2px;
                border-radius: 4px 4px 4px 4px;
                .fcc();
                color: @TC_link;
                cursor: pointer;

                &:hover,
                &.active {
                    color: #0061ff;
                    box-shadow: none;
                    // border-radius: 0;
                    // border: 1px solid#0061FF;
                }
            }
        }
    }
}
</style>
