<template>
    <div class="list-container">
        <div class="top">
            <div class="title">{{ $t('db.backlog') }}</div>
            <div class="more">{{ $t('db.more') }}<i class="icon i_more"></i></div>
        </div>
        <div class="center">
            <a-tabs v-model:activeKey="activeKey" @change="toDoList">
                <a-tab-pane key="customer" tab="我的客户">
                    <div class="bottom">
                        <div v-if="customerList.length" class="item" v-for="item in customerList" :key="item.id">
                            <div class="left">
                                <div class="name">{{ item.name }}</div>
                                <div class="info">{{ item.info }}</div>
                            </div>
                            <div class="right">
                                <div :class="[item.status === STATUS.TIME_OUT ? 'status-red' : 'status']">
                                    <i class="icon i_point1"></i
                                    >{{ $Util.CRMToDoStatusFilter(item.status, $i18n.locale) }}
                                </div>
                                <div class="time">{{ $Util.timeFilter(item.next_track_time, 3) }}</div>
                            </div>
                        </div>
                        <div v-else class="empty-item">
                            <div class="tip">{{ $t('db.empty_to_do_list') }}</div>
                            <div class="add">
                                <div class="add-btn" @click="routerChange('my')">
                                    {{ $t('db.go_follow') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane key="pool_customer" tab="未分配客户">
                    <div class="bottom">
                        <div v-if="customerList.length" class="item" v-for="item in customerList" :key="item.id">
                            <div class="left">
                                <div class="name">{{ item.name }}</div>
                                <div class="info">{{ item.info }}</div>
                            </div>
                            <div class="right">
                                <div :class="[item.status === STATUS.TIME_OUT ? 'status-red' : 'status']">
                                    <i class="icon i_point1"></i
                                    >{{ $Util.CRMToDoStatusFilter(item.status, $i18n.locale) }}
                                </div>
                                <div class="time">{{ $Util.timeFilter(item.next_track_time, 3) }}</div>
                            </div>
                        </div>
                        <div v-else class="empty-item">
                            <div class="tip">{{ $t('db.empty_to_do_list') }}</div>
                            <div class="add">
                                <div class="add-btn" @click="routerChange('unallocated')">
                                    {{ $t('db.go_follow') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane key="bo" tab="商机">
                    <div class="bottom">
                        <div class="item" v-if="boList.length" v-for="item in boList" :key="item.id">
                            <div class="left">
                                <div class="name">{{ item.name }}</div>
                                <div class="info">{{ item.info }}</div>
                            </div>
                            <div class="right">
                                <div :class="[item.id === 4 ? 'status-red' : 'status']">
                                    <i class="icon i_point1"></i>{{ item.status }}
                                </div>
                                <div class="time">{{ item.time }}</div>
                            </div>
                        </div>
                        <div v-else class="empty-item">
                            <div class="tip">{{ $t('db.empty_to_do_list') }}</div>
                            <div class="add">
                                <div class="add-btn" @click="routerChange('bo')">
                                    {{ $t('db.go_follow') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane key="testDrive" tab="试驾单">
                    <div class="bottom">
                        <div class="item" v-if="testDriveList.length" v-for="item in testDriveList" :key="item.id">
                            <div class="left">
                                <div class="name">{{ item.name }}</div>
                                <div class="info">{{ item.info }}</div>
                            </div>
                            <div class="right">
                                <div :class="[item.id === 4 ? 'status-red' : 'status']">
                                    <i class="icon i_point1"></i>{{ item.status }}
                                </div>
                                <div class="time">{{ item.time }}</div>
                            </div>
                        </div>
                        <div v-else class="empty-item">
                            <div class="tip">{{ $t('db.empty_to_do_list') }}</div>
                            <div class="add">
                                <div class="add-btn" @click="routerChange('test')">
                                    {{ $t('db.go_follow') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import Core from '../../../core';

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
            activeKey: 'customer',
            SEARCH_TYPE: Core.Const.CRM_CUSTOMER.SEARCH_TYPE,
            STATUS: Core.Const.CRM_TODO.STATUS,
            customerList: [],
            boList: [],
            testDriveList: {},
            pageSize: 5,
            followList: [
                {
                    id: 1,
                    name: '【客户】',
                    info: '11.30需要跟进该客户，客户意向较大，促成订单较稳定，11.30需要跟进该客户，客户意向较大，促成订单较稳定',
                    time: '2022-06-13',
                    status: '已跟进',
                },
                {
                    id: 2,
                    name: '【商机】',
                    info: '11.30需要跟进该客户，客户意向较大，促成订单较稳定，11.30需要跟进该客户，客户意向较大，促成订单较稳定',
                    time: '2022-06-13',
                    status: '已跟进',
                },
                {
                    id: 3,
                    name: '【试驾单】',
                    info: '11.30需要跟进该客户，客户意向较大，促成订单较稳定，11.30需要跟进该客户，客户意向较大，促成订单较稳定',
                    time: '2022-06-13',
                    status: '已跟进',
                },
                {
                    id: 4,
                    name: '【回款单】',
                    info: '11.30需要跟进该客户，客户意向较大，促成订单较稳定，11.30需要跟进该客户，客户意向较大，促成订单较稳定',
                    time: '2022-06-13',
                    status: '待跟进',
                },
            ],
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {
        this.toDoList();
    },
    beforeUnmount() {},
    methods: {
        toDoList() {
            switch (this.activeKey) {
                case 'customer':
                    Core.Api.CRMCustomer.toDoList({
                        search_type: this.SEARCH_TYPE.PRIVATE,
                        page_size: this.pageSize,
                    }).then(res => {
                        this.customerList = res.list;
                    });
                    break;
                case 'pool_customer':
                    Core.Api.CRMCustomer.toDoList({
                        search_type: this.SEARCH_TYPE.POOL,
                        page_size: this.pageSize,
                    }).then(res => {
                        this.customerList = res.list;
                    });
                    break;
                case 'bo':
                    Core.Api.CRMBo.toDoList({
                        page_size: this.pageSize,
                    }).then(res => {
                        this.boList = res.list;
                    });
                    break;
                case 'testDrive': // 试驾单
                    // Core.Api.CRMBo.toDoList({
                    //     page_size : this.pageSize
                    // }).then(res => {
                    //     this.boList = res.list
                    // })
                    break;
            }
        },
        routerChange(type, item) {
            let routeUrl = '';
            switch (type) {
                case 'my': // 我的客户
                    routeUrl = this.$router.resolve({
                        path: '/crm-customer/private-customer-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'unallocated': // 未分配客户
                    routeUrl = this.$router.resolve({
                        path: '/crm-customer/customer-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'bo': // 商机
                    routeUrl = this.$router.resolve({
                        path: '/crm-bo/bo-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'test': // 试驾单
                    routeUrl = this.$router.resolve({
                        path: '/crm-test-drive-order/order-income-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
    },
};
</script>

<style lang="less" scoped>
.list-container {
    padding: 0 24px;
    .top {
        .fsb();
        padding: 19px 0;
        .title {
            font-size: 15px;
            font-weight: 600;
            color: #333333;
            flex: 1;
            .ell();
        }
        .more {
            width: 90px;
            text-align: right;
            font-size: 14px;
            font-weight: 500;
            color: #999999;
            cursor: pointer;
            .i_more {
                margin-left: 4px;
            }
        }
    }
    .bottom {
        .item {
            border-top: 1px dashed #dedede;
            .fsb();
            padding: 13px 0 12px;
            &:nth-of-type(1) {
                border-top: none;
                padding-top: 0;
            }

            .left {
                flex: 1;
                .ell();
                .name {
                    font-size: 16px;
                    font-weight: 500;
                    color: #333333;
                    .ell();
                }
                .info {
                    margin-top: 3px;
                    font-size: 14px;
                    font-weight: 400;
                    color: #666666;
                    .ell();
                }
            }

            .right {
                width: 100px;
                text-align: right;
                font-size: 14px;
                .status {
                    font-weight: 500;
                    color: #6bcb76;
                    .i_point1 {
                        margin-right: 5px;
                    }
                }
                .status-red {
                    font-weight: 500;
                    color: #e13c39;
                    .i_point1 {
                        margin-right: 5px;
                    }
                }
                .time {
                    margin-top: 3px;
                    font-weight: 400;
                    color: #666666;
                    position: relative;
                    top: 2px;
                }
            }
        }

        .empty-item {
            width: 100%;
            height: 180px;
            .tip {
                width: 100%;
                .fjc();
                font-size: 14px;
                font-family:
                    PingFang SC-Regular,
                    PingFang SC;
                font-weight: 400;
                color: #666666;
                margin-top: 70px;
            }

            .add {
                width: 100%;
                .fjc();
            }
            .add-btn {
                width: 58px;
                height: 26px;
                background-color: #4977ee;
                border-radius: 4px 4px 4px 4px;
                .fcc();
                font-size: 14px;
                font-family:
                    PingFang SC-Regular,
                    PingFang SC;
                font-weight: 400;
                color: #ffffff;
                margin-top: 13px;
                cursor: pointer;
            }
        }
    }
}
</style>
