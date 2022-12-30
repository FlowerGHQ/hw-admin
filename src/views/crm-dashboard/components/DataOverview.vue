<template>
    <div class="container">
        <!-- <div class="title">{{ $t('db.data_overview') }}</div> -->
        <!-- <a-row  :gutter="[24, 0]">
            <a-col :xs="24" :sm="12" :xl="8" :xxl="4">
                <div class="list-container">
                    <div class="top">{{ $t('db.new_customer') }}</div>
                    <div class="center">{{ $t('db.previous_days') + day + $t('db.day')  }}
                        <span class="positive" v-if="form.new_customer_seven_day_count >= 0 ">{{ '+' + form.new_customer_seven_day_count}}</span>
                        <span class="minus" v-else>{{form.new_customer_seven_day_count}}</span>
                    </div>
                    <div class="bottom">
                        <div class="num" style="color: #333333;">{{form.new_customer_count}}</div>
                        <img class="img" src="../../../assets/images/dashboard/customer.png" alt="">
                    </div>
                </div>
            </a-col>
            <a-col :xs="24" :sm="12" :xl="8" :xxl="4">
                <div class="list-container">
                    <div class="top">{{ $t('db.new_follow_up_records') }}</div>
                    <div class="center">{{ $t('db.previous_days') + day + $t('db.day')  }}
                        <span class="positive" v-if="form.new_contact_seven_day_count >= 0 ">{{ '+' + form.new_contact_seven_day_count}}</span>
                        <span class="minus" v-else>{{form.new_contact_seven_day_count}}</span>
                    </div>
                    <div class="bottom">
                        <div class="num" style="color: #333333;">{{form.new_contact_count}}</div>
                        <img class="img" src="../../../assets/images/dashboard/follow_up-records.png" alt="">
                    </div>
                </div>
            </a-col>
            <a-col :xs="24" :sm="12" :xl="8" :xxl="4">
                <div class="list-container">
                    <div class="top">{{ $t('db.new_business') }}</div>
                    <div class="center">{{ $t('db.previous_days') + day + $t('db.day')  }}
                        <span class="positive" v-if="form.new_order_seven_day_count >= 0 ">{{ '+' + form.new_order_seven_day_count}}</span>
                        <span class="minus" v-else>{{form.new_order_seven_day_count}}</span>
                    </div>
                    <div class="bottom">
                        <div class="num" style="color: #333333;">{{form.new_order_count}}</div>
                        <img class="img" src="../../../assets/images/dashboard/business.png" alt="">
                    </div>
                </div>
            </a-col>
            <a-col :xs="24" :sm="12" :xl="8" :xxl="4">
                <div class="list-container">
                    <div class="top">{{ $t('db.new_orders') }}</div>
                    <div class="center">{{ $t('db.previous_days') + day + $t('db.day')  }}
                        <span class="positive" v-if="form.new_bo_seven_day_count >= 0 ">{{ '+' + form.new_bo_seven_day_count}}</span>
                        <span class="minus" v-else>{{form.new_bo_seven_day_count}}</span>
                    </div>
                    <div class="bottom">
                        <div class="num" style="color: #333333;">{{form.new_bo_count}}</div>
                        <img class="img" src="../../../assets/images/dashboard/order.png" alt="">
                    </div>
                </div>
            </a-col>
            <a-col :xs="24" :sm="12" :xl="8" :xxl="4">
                <div class="list-container">
                    <div class="top">{{ $t('db.new_drive_order') }}</div>
                    <div class="center">{{ $t('db.previous_days') + day + $t('db.day')  }}
                        <span class="positive" v-if="form.win_bo_seven_day_count >= 0 ">{{ '+' + form.win_bo_seven_day_count}}</span>
                        <span class="minus" v-else>{{form.win_bo_seven_day_count}}</span>
                    </div>
                    <div class="bottom">
                        <div class="num" style="color: #333333;">{{form.win_bo_count}}</div>
                        <img class="img" src="../../../assets/images/dashboard/drive-order.png" alt="">
                    </div>
                </div>
            </a-col>
            <a-col :xs="24" :sm="12" :xl="8" :xxl="4">
                <div class="list-container">
                    <div class="top">{{ $t('db.new_payment_receipt') }}</div>
                    <div class="center">{{ $t('db.previous_days') + day + $t('db.day')  }}
                        <span class="positive" v-if="form.new_test_driver_seven_day_count >= 0 ">{{ '+' + form.new_test_driver_seven_day_count}}</span>
                        <span class="minus" v-else>{{form.new_test_driver_seven_day_count}}</span>
                    </div>
                    <div class="bottom">
                        <div class="num" style="color: #333333;">{{form.new_test_driver_count}}</div>
                        <img class="img" src="../../../assets/images/dashboard/return-order.png" alt="">
                    </div>
                </div>
            </a-col>
        </a-row>  -->
        <div class="list-container">
            <div class="SearchRangePicker range">
                <!-- 数据概览 -->
                <div class="title">{{ $t('db.data_overview') }}</div>
                <a-radio-group v-model:value="day" class="time-type" @change="handleTimeTypeChange">
                    <a-radio-button :class="[day === 1 ? 'type-item active' : 'type-item']"
                        :value="1">{{$t('db.day')}}</a-radio-button>
                    <a-radio-button :class="[day === 2 ? 'type-item active' : 'type-item']"
                        :value="2">{{$t('db.week')}}</a-radio-button>
                    <a-radio-button :class="[day === 3 ? 'type-item active' : 'type-item']"
                        :value="3">{{$t('db.month')}}</a-radio-button>
                </a-radio-group>
                <a-range-picker v-model:value="time" @change="handleChange()" :allowClear="false"
                    :placeholder="[$t('crm_def.start_time'), $t('crm_def.end_time')]" ref="TimeSearch" />
                <a-tree-select class="CategoryTreeSelect" v-model:value="searchForm.group_id"
                    :placeholder="$t('def.select') + $t('crm_c.group')"
                    :dropdown-style="{ maxHeight: '412px', overflow: 'auto' }" :tree-data="groupOptions"
                    tree-default-expand-all >
                    <!--a-cascader级联选择后缀图标 -->
                    <template #suffixIcon><span class="icon i_xialajiantouxiao" /></template>
                </a-tree-select>
                <!-- <div class="time-pick">
                    <a-button type="primary" class="btn search" @click="handleTimeChange">查询</a-button>
                    <a-button class="btn reset" @click="handleSearchReset">重置</a-button>
                </div> -->
            </div>
            <div class="data-container">
                <!-- 新增客户 -->
                <div class="data-card">
                    <div class="card-name">{{ $t('db.new_customer') }}</div>
                    <div class="card-total">
                        <div class="card-total-num">
                            {{ form.new_customer_count }}
                            <div
                                :class="[form.new_customer_seven_day_count >= 0 ? 'increase-fall act' : 'increase-fall']">
                                <img v-if="form.new_customer_seven_day_count >= 0" class="allow"
                                    src="../../../assets/images/dashboard/increase.png" alt="">
                                <img v-if="form.new_customer_seven_day_count < 0" class="allow"
                                    src="../../../assets/images/dashboard/fall.png" alt="">
                                {{ Math.abs(form.new_customer_seven_day_count) }}
                            </div>
                        </div>
                        <img class="img" src="../../../assets/images/dashboard/customer.png" alt="">
                    </div>
                </div>
                <!-- 分隔线 -->
                <div class="dividing-line"></div>
                <!-- 新增跟进记录 -->
                <div class="data-card">
                    <div class="card-name">{{ $t('db.new_follow_up_records') }}</div>
                    <div class="card-total">
                        <div class="card-total-num">
                            {{ form.new_contact_count }}
                            <div
                                :class="[form.new_contact_seven_day_count >= 0 ? 'increase-fall act' : 'increase-fall']">
                                <img v-if="form.new_contact_seven_day_count >= 0" class="allow"
                                    src="../../../assets/images/dashboard/increase.png" alt="">
                                <img v-if="form.new_contact_seven_day_count < 0" class="allow"
                                    src="../../../assets/images/dashboard/fall.png" alt="">
                                {{ Math.abs(form.new_contact_seven_day_count) }}
                            </div>
                        </div>
                        <img class="img" src="../../../assets/images/dashboard/follow_up-records.png" alt="">
                    </div>
                </div>
                <div class="dividing-line"></div>
                <!-- 新增商机 -->
                <div class="data-card">
                    <div class="card-name">{{ $t('db.new_business') }}</div>
                    <div class="card-total">
                        <div class="card-total-num">
                            {{ form.new_order_count }}
                            <div :class="[form.new_order_seven_day_count >= 0 ? 'increase-fall act' : 'increase-fall']">
                                <img v-if="form.new_order_seven_day_count >= 0" class="allow"
                                    src="../../../assets/images/dashboard/increase.png" alt="">
                                <img v-if="form.new_order_seven_day_count < 0" class="allow"
                                    src="../../../assets/images/dashboard/fall.png" alt="">
                                {{ Math.abs(form.new_order_seven_day_count) }}
                            </div>
                        </div>
                        <img class="img" src="../../../assets/images/dashboard/business.png" alt="">
                    </div>
                </div>
                <div class="dividing-line"></div>
                <!-- 新增订单 -->
                <div class="data-card">
                    <div class="card-name">{{ $t('db.new_orders') }}</div>
                    <div class="card-total">
                        <div class="card-total-num">
                            {{ form.new_bo_count }}
                            <div :class="[form.new_bo_seven_day_count >= 0 ? 'increase-fall act' : 'increase-fall']">
                                <img v-if="form.new_bo_seven_day_count >= 0" class="allow"
                                    src="../../../assets/images/dashboard/increase.png" alt="">
                                <img v-if="form.new_bo_seven_day_count < 0" class="allow"
                                    src="../../../assets/images/dashboard/fall.png" alt="">
                                {{ Math.abs(form.new_bo_seven_day_count) }}
                            </div>
                        </div>
                        <img class="img" src="../../../assets/images/dashboard/order.png" alt="">
                    </div>
                </div>
                <div class="dividing-line"></div>
                <!-- 新增试驾单 -->
                <div class="data-card">
                    <div class="card-name">{{ $t('db.new_drive_order') }}</div>
                    <div class="card-total">
                        <div class="card-total-num">
                            {{ form.win_bo_count }}
                            <div :class="[form.win_bo_seven_day_count >= 0 ? 'increase-fall act' : 'increase-fall']">
                                <img v-if="form.win_bo_seven_day_count >= 0" class="allow"
                                    src="../../../assets/images/dashboard/increase.png" alt="">
                                <img v-if="form.win_bo_seven_day_count < 0" class="allow"
                                    src="../../../assets/images/dashboard/fall.png" alt="">
                                {{ Math.abs(form.win_bo_seven_day_count) }}
                            </div>
                        </div>
                        <img class="img" src="../../../assets/images/dashboard/drive-order.png" alt="">
                    </div>
                </div>
                <div class="dividing-line"></div>
                <!-- 新增回款单 -->
                <div class="data-card">
                    <div class="card-name">{{ $t('db.new_payment_receipt') }}</div>
                    <div class="card-total">
                        <div class="card-total-num">
                            {{ form.new_test_driver_count }}
                            <div :class="[form.new_test_driver_seven_day_count >= 0 ? 'increase-fall act' : 'increase-fall']">
                                <img v-if="form.new_test_driver_seven_day_count >= 0" class="allow"
                                    src="../../../assets/images/dashboard/increase.png" alt="">
                                <img v-if="form.new_test_driver_seven_day_count < 0" class="allow"
                                    src="../../../assets/images/dashboard/fall.png" alt="">
                                {{ Math.abs(form.new_test_driver_seven_day_count) }}
                            </div>
                        </div>
                        <img class="img" src="../../../assets/images/dashboard/return-order.png" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../../core';
import dayjs from "dayjs";
import TimeSearch from "@/components/common/TimeSearch.vue";
import '../../../assets/iconfont/iconfont';

export default {
    name: 'Card',
    components: {
        TimeSearch,
    },
    props: {
        searchForm: {
            type: Object,
            default: () => { }
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
            day: 0,
            searchForm: {
                group_id: undefined,
                begin_time: "",
                end_time: "",
                day: 1,
            },
            time: [],
            groupOptions: [],
            day: '',
        };
    },
    watch: {
        searchForm: {
            deep: true,
            immediate: true,
            handler(n) {
                this.salesStatistics()
            }
        },

    },
    computed: {
    },
    created() {
    },
    mounted() {
        this.handleGroupTree();
        this.salesStatistics()
    },
    beforeUnmount() {
    },
    methods: {
        salesStatistics() {
            Core.Api.CRMDashboard.salesStatistics({
                ...this.searchForm
            }).then(res => {
                switch (this.searchForm.day) {
                    case 1:
                        this.day = 7
                        break;
                    case 2:
                        this.day = 15
                        break;
                    case 3:
                        this.day = 30
                        break;
                }
                console.log("dataOverview salesStatistics ~ res", res)
                this.form.new_customer_count = res.new_customer_count
                this.form.new_contact_count = res.new_contact_count
                this.form.new_order_count = res.new_order_count
                this.form.new_bo_count = res.new_bo_count
                this.form.win_bo_count = res.win_bo_count
                this.form.new_test_driver_count = res.new_test_driver_count

                this.form.new_customer_seven_day_count = res.new_customer_count - res.new_customer_seven_day_count
                this.form.new_contact_seven_day_count = res.new_contact_count - res.new_contact_seven_day_count
                this.form.new_order_seven_day_count = res.new_order_count - res.new_order_seven_day_count
                this.form.new_bo_seven_day_count = res.new_bo_count - res.new_bo_seven_day_count
                this.form.win_bo_seven_day_count = res.win_bo_count - res.win_bo_seven_day_count
                this.form.new_test_driver_seven_day_count = res.new_test_driver_count - res.new_test_driver_seven_day_count

            })
        },
        // 时间转换
        handleTimeTypeChange() {
            switch (this.day) {
                case 1:
                    this.searchForm.begin_time = (Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000; break;
                case 2:
                    this.searchForm.begin_time = (Date.now() - 15 * 24 * 60 * 60 * 1000) / 1000; break;
                case 3:
                    this.searchForm.begin_time = (Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000; break;
            }

            this.searchForm.end_time = Date.now() / 1000;
            this.searchForm.day = this.day
        },
        handleChange() {
            let begin_time = dayjs(this.time[0]);
            let end_time = dayjs(this.time[1]);
            let searchForm = this.$Util.deepCopy(this.searchForm);
            searchForm.begin_time = begin_time.startOf("day").unix();
            searchForm.end_time = end_time.endOf("day").unix();
            this.searchForm = searchForm;
        },
        handleGroupTree() {
            Core.Api.CRMGroupMember.structureByUser().then((res) => {
                this.groupOptions = res.list;
                console.log(res);
            });
        },
    }
};
</script>

<style lang="less" scoped>
.container {
    width: 100%;
    box-sizing: border-box;
    // padding-right: 24px;
    .title {
        font-size: 20px;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        .ell();
    }

    .list-container {
        padding: 20px 24px;
        box-sizing: border-box;
        margin-bottom: 24px;
    }

    .SearchRangePicker {
        margin-bottom: 20px;
        width: 100%;
        display: flex;

        .type-item {
            width: 64px;
            opacity: 1;
            text-align: center;
            border-color: #eaecf2;
            box-shadow: 0 0 0 0;
            border-left: 1px solid #E5E5EE;

            &::after,
            &::before {
                display: none;
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

        .time-type {
            margin-left: 24px;
            .fac();

            .type-item {
                height: 30px;
                padding: 10px 24px;
                margin-left: 0 !important;
                margin-right: 24px;
                font-size: 14px;
                font-weight: 500;
                color: #666;
                border-radius: 4px 4px 4px 4px;
                .fcc();

                // border-radius: 4px;
                +.type-item {
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

        .CategoryTreeSelect {
            width: 200px;
            margin-right: 24px;
        }
    }

    .range {
        // padding: 24px;
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
    }

    .data-container {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .data-card {
            width: 259px;
            box-sizing: border-box;
            padding-right: 43px;
        }

        .card-name {
            width: 100%;
            font-size: 18px;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
        }

        .card-total {
            .fsb();
            margin-top: 10px;
        }

        .card-total-num {
            font-size: 40px;
            font-family: Barlow-SemiBold, Barlow;
            font-weight: 600;
            color: #333333;
            line-height: 37px;
            display: flex;
            align-items: flex-end;

        }

        .increase-fall {
            font-size: 18px;
            font-family: PingFang SC-Regular, PingFang SC;
            line-height: 21px;
            font-weight: 400;
            color: #37D1C8;
            margin-left: 7px;
            .fa();

            &.act {
                color: #DD6623;
            }
        }

        .img {
            width: 36px;
            height: 36px;
        }

        .allow {
            width: 12px;
            height: 14px;
            margin-right: 2px;
        }

        .dividing-line {
            width: 2px;
            height: 60px;
            background: #EDEDF3;
            border-radius: 1px 1px 1px 1px;
            opacity: 1;
            margin-right: 30px;
        }
    }
}
</style>
