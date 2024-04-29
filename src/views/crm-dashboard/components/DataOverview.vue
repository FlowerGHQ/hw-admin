<template>
    <div class="container">
        <div class="search-Filter">
            <a-radio-group v-model:value="day" class="time-type" @change="handleTimeTypeChange">
                <a-radio-button :class="[day === 1 ? 'type-item active' : 'type-item']" :value="1">{{
                    $t('db.day')
                }}</a-radio-button>
                <a-radio-button :class="[day === 2 ? 'type-item active' : 'type-item']" :value="2">{{
                    $t('db.month')
                }}</a-radio-button>
                <a-radio-button :class="[day === 3 ? 'type-item active' : 'type-item']" :value="3">{{
                    $t('db.year')
                }}</a-radio-button>
            </a-radio-group>
            <a-range-picker
                v-if="day === 1"
                v-model:value="time"
                @change="handleChange()"
                :allowClear="false"
                :placeholder="[$t('crm_def.start_time'), $t('crm_def.end_time')]"
                ref="TimeSearch"
            />
            <a-range-picker
                v-if="day === 2"
                v-model:value="time"
                @change="handleChange()"
                :allowClear="false"
                :placeholder="[$t('crm_def.start_time'), $t('crm_def.end_time')]"
                picker="month"
            />
            <a-range-picker
                v-if="day === 3"
                v-model:value="time"
                @change="handleChange()"
                :allowClear="false"
                :placeholder="[$t('crm_def.start_time'), $t('crm_def.end_time')]"
                picker="year"
            />
            <a-tree-select
                class="CategoryTreeSelect"
                v-model:value="searchForm.group_id"
                @change="handleChange()"
                :placeholder="$t('def.select') + $t('crm_c.group')"
                :dropdown-style="{ maxHeight: '412px', overflow: 'auto' }"
                :tree-data="groupOptions"
                tree-default-expand-all
            >
                <!--a-cascader级联选择后缀图标 -->
                <template #suffixIcon><span class="icon i_xialajiantouxiao" /></template>
            </a-tree-select>
        </div>
        <div class="list-container">
            <!-- 数据概览 -->
            <div class="title">{{ $t('db.data_overview') }}</div>
            <div class="data-container">
                <!-- 新增客户 -->
                <div class="data-card" v-for="item in totalList" :key="item.id">
                    <div class="card-item">
                        <div class="left">
                            <img class="img" :src="getSrcImg(item.title_icon)" alt="" />
                        </div>
                        <div class="right">
                            <div class="right-text">{{ $t(item.title) }}</div>
                            <div class="right-count mr-5">
                                {{ item.count }}
                            </div>

                            <div
                                class="right-percentage-rise mr-5"
                                :class="{ 'right-percentage-des': item.rise_des_count < 0 }"
                            >
                                <img
                                    v-if="item.rise_des_count >= 0"
                                    class="allow"
                                    :src="getSrcImg(item.rise_icon)"
                                    alt=""
                                />
                                <img
                                    v-if="item.rise_des_count < 0"
                                    class="allow"
                                    :src="getSrcImg(item.des_icon)"
                                    alt=""
                                />
                                <span>{{ Math.abs(item.rise_des_count) }}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../../core';
import dayjs from 'dayjs';
import TimeSearch from '@/components/common/TimeSearch.vue';
import '../../../assets/iconfont/iconfont';

const modules = import.meta.globEager('../../../assets/images/dashboard/*', { eager: true });

export default {
    name: 'Card',
    components: {
        TimeSearch,
    },
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

                new_customer_seven_day_count: '',
                new_contact_seven_day_count: '',
                new_order_seven_day_count: '',
                new_bo_seven_day_count: '',
                win_bo_seven_day_count: '',
                new_test_driver_seven_day_count: '',
            },
            day: 1,
            searchForm: {
                group_id: undefined,
                begin_time: Number(((Date.now() - 1 * 24 * 60 * 60 * 1000) / 1000).toFixed(0)),
                end_time: Number((Date.now() / 1000).toFixed(0)),
                day: 1,
            },
            time: [],
            groupOptions: [],
        };
    },
    watch: {
        searchForm: {
            deep: true,
            handler(n) {
                this.salesStatistics();
            },
        },
    },
    computed: {
        // 头部的统计数据arr
        totalList() {
            let data = [
                // 新增客户
                {
                    id: 1,
                    title: 'db.new_customer',
                    count: `${this.form.new_customer_count}`,
                    rise_des_count: `${this.form.new_customer_seven_day_count}`, // 判断其是升还是降的数字
                    percentage: `${this.form?.new_customer_seven_day_count}`, // 百分比
                    title_icon: 'customer',
                    rise_icon: 'increase',
                    des_icon: 'fall',
                },
                //  新增跟进记录
                {
                    id: 2,
                    title: 'db.new_follow_up_records',
                    count: `${this.form.new_contact_count}`,
                    rise_des_count: `${this.form.new_contact_seven_day_count}`, // 判断其是升还是降的数字
                    percentage: `${this.form?.new_contact_seven_day_count}`, // 百分比
                    title_icon: 'follow_up-records',
                    rise_icon: 'increase',
                    des_icon: 'fall',
                },
                //  新增商机
                {
                    id: 3,
                    title: 'db.new_business',
                    count: `${this.form.new_bo_count}`,
                    rise_des_count: `${this.form.new_bo_seven_day_count}`, // 判断其是升还是降的数字
                    percentage: `${this.form?.new_bo_seven_day_count}`,
                    title_icon: 'business',
                    rise_icon: 'increase',
                    des_icon: 'fall',
                },
                //  新增订单
                {
                    id: 4,
                    title: 'db.new_orders',
                    count: `${this.form.new_order_count}`,
                    rise_des_count: `${this.form.new_order_seven_day_count}`, // 判断其是升还是降的数字
                    percentage: `${this.form?.new_order_seven_day_count}`, // 百分比
                    title_icon: 'order',
                    rise_icon: 'increase',
                    des_icon: 'fall',
                },
                //  新增试驾单
                {
                    id: 5,
                    title: 'db.new_drive_order',
                    count: `${this.form.new_test_driver_count}`,
                    rise_des_count: `${this.form.new_test_driver_seven_day_count}`, // 判断其是升还是降的数字
                    percentage: `${this.form?.new_test_driver_seven_day_count}`, // 百分比
                    title_icon: 'drive-order',
                    rise_icon: 'increase',
                    des_icon: 'fall',
                },
                //  新增回款单
                {
                    id: 6,
                    title: 'db.new_payment_receipt',
                    count: `${this.form.win_bo_count}`,
                    rise_des_count: `${this.form.win_bo_seven_day_count}`, // 判断其是升还是降的数字
                    percentage: `${this.form?.win_bo_seven_day_count}`, // 百分比
                    title_icon: 'return-order',
                    rise_icon: 'increase',
                    des_icon: 'fall',
                },
            ];
            return data;
        },
    },
    created() {},
    mounted() {
        this.handleGroupTree();
        this.salesStatistics();
    },
    beforeUnmount() {},
    methods: {
        // 获取照片
        getSrcImg(name, type = 'png') {
            const path = `../../../assets/images/dashboard/${name}.${type}`;
            return modules[path]?.default;
        },
        salesStatistics() {
            Core.Api.CRMDashboard.salesStatistics({
                ...this.searchForm,
            }).then(res => {
                switch (this.searchForm.day) {
                    case 1:
                        this.day = 1;
                        break;
                    case 2:
                        this.day = 2;
                        break;
                    case 3:
                        this.day = 3;
                        break;
                }
                this.form.new_customer_count = res.new_customer_count; // 新增客户(ok)
                this.form.new_customer_seven_day_count = res.new_customer_seven_day_count; // 新增客户（百分比）
                this.form.new_contact_count = res.new_contact_count; // 新增跟进记录
                this.form.new_contact_seven_day_count = res.new_contact_seven_day_count; // 新增跟进记录（百分比）
                this.form.new_bo_count = res.new_bo_count; // 新增商机（ok）
                this.form.new_bo_seven_day_count = res.new_bo_seven_day_count; // 新增商机（百分比）
                this.form.new_order_count = res.new_order_count; // 新增订单(ok)
                this.form.new_order_seven_day_count = res.new_order_seven_day_count; // 新增订单（百分比）
                this.form.new_test_driver_count = res.new_test_driver_count; // 新增试驾单(ok)
                this.form.new_test_driver_seven_day_count = res.new_test_driver_seven_day_count; // 新增试驾单（百分比）
                this.form.win_bo_count = res.win_bo_count; // 新增回款单
                this.form.win_bo_seven_day_count = res.win_bo_seven_day_count; // 新增回款单（百分比）

                // 判断其是增还是降
                // this.form.new_customer_seven_day_count = res.new_customer_count - res.new_customer_seven_day_count;
                // this.form.new_contact_seven_day_count = res.new_contact_count - res.new_contact_seven_day_count;
                // this.form.new_bo_seven_day_count = res.new_bo_count - res.new_bo_seven_day_count;
                // this.form.new_order_seven_day_count = res.new_order_count - res.new_order_seven_day_count;
                // this.form.new_test_driver_seven_day_count = res.new_test_driver_count - res.new_test_driver_seven_day_count;
                // this.form.win_bo_seven_day_count = res.win_bo_count - res.win_bo_seven_day_count;

                // console.log("新增de", res.new_order_count, res.new_order_seven_day_count);
                // 百分比
                // this.form.new_customer_percentage = Core.Util.percentageFilter(res.new_customer_count, res.new_customer_seven_day_count)
                // this.form.new_contact_percentage =  Core.Util.percentageFilter(res.new_contact_count, res.new_contact_seven_day_count)
                // this.form.new_bo_percentage =  Core.Util.percentageFilter(res.new_bo_count, res.new_bo_seven_day_count )
                // this.form.new_order_percentage =  Core.Util.percentageFilter(res.new_order_count, res.new_order_seven_day_count)
                // this.form.new_test_driver_percentage =  Core.Util.percentageFilter(res.new_test_driver_count, res.new_test_driver_seven_day_count)
                // this.form.win_bo_percentage =  Core.Util.percentageFilter(res.win_bo_count, res.win_bo_seven_day_count)

                // console.log("百分比", this.form.new_order_percentage);
            });
        },
        // 时间转换
        handleTimeTypeChange() {
            switch (this.day) {
                case 1:
                    this.searchForm.begin_time = Number(((Date.now() - 1 * 24 * 60 * 60 * 1000) / 1000).toFixed(0));
                    break;
                case 2:
                    this.searchForm.begin_time = Number(((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000).toFixed(0));
                    break;
                case 3:
                    this.searchForm.begin_time = Number(((Date.now() - 365 * 24 * 60 * 60 * 1000) / 1000).toFixed(0));
                    break;
            }

            this.searchForm.end_time = Number((Date.now() / 1000).toFixed(0));
            this.searchForm.day = this.day;
            this.$emit('select', this.searchForm);
        },
        handleChange() {
            let begin_time = dayjs(this.time[0]);
            let end_time = dayjs(this.time[1]);
            let searchForm = this.$Util.deepCopy(this.searchForm);
            searchForm.begin_time = begin_time.startOf('day').unix();
            searchForm.end_time = end_time.endOf('day').unix();
            this.searchForm = searchForm;
            this.$emit('select', searchForm);
        },
        handleGroupTree() {
            Core.Api.CRMGroupMember.structureByUser().then(res => {
                this.groupOptions = res.list;
                console.log(res);
            });
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
                border-radius: 4px 4px 4px 4px;
                .fcc();

                color: @TC_link;
                cursor: pointer;

                &:hover,
                &.active {
                    color: @TC_P;
                }
            }
        }

        .CategoryTreeSelect {
            width: 200px;
            margin-right: 24px;
        }
    }

    .list-container {
        box-sizing: border-box;
        margin-bottom: 24px;

        .title {
            padding: 0px 20px;
            font-size: 16px;
            font-weight: 600;
            color: #333333;
            height: 55px;
            line-height: 55px;
            border-bottom: 1px solid #eef1f5;
        }

        .data-container {
            width: 100%;
            display: flex;

            .data-card {
                width: calc(100% / 3);
                box-sizing: border-box;
                border-right: 1px solid #eef1f5;

                .card-item {
                    width: 100%;
                    padding: 22px 20px;
                    box-sizing: content-box;
                    display: flex;

                    .left {
                        .img {
                            margin-top: 10px;
                            width: 37px;
                            height: 37px;
                        }
                    }

                    .mr-5 {
                        margin-top: 5px;
                    }

                    .right {
                        margin-left: 20px;

                        .right-text {
                            font-family: 'PingFang SC';
                            font-weight: 400;
                            font-size: 14px;
                            color: #8e9aad;
                        }

                        .right-count {
                            font-family: 'PingFang SC';
                            font-weight: 600;
                            font-size: 22px;
                            color: #34383e;
                        }

                        .right-percentage-rise {
                            // width: 52px;
                            padding: 2px 8px;
                            background: rgba(0, 110, 249, 0.1);
                            border-radius: 4px;
                            color: #006ef9;
                            display: flex;
                            justify-content: center;
                            align-items: center;

                            .allow {
                                margin-right: 3px;
                                width: 10px;
                                height: 10px;
                            }

                            &.right-percentage-des {
                                background: rgba(245, 34, 45, 0.1);
                                color: #f5222d;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
