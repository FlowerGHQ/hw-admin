<template>
    <div id="RepairDetail" class="edit-container">
        <!-- 工单详情 -->
        <div class="title-container">
            <div class="title-area fl-js">{{ $t('r.repair_detail') }}</div>
            <div class="repair-order-sn">
                {{ $t(/*工单编号*/'r.repair_sn') }}：{{ detail.uid || '-' }}
            </div>
        </div>
        <!-- 步骤条 -->
        <div class="step-container">
            <div class="steps">
                <a-steps :current="currStep">
                    <a-step>
                        <template #title>{{ $t(/*提交工单*/'r.submit_work_order') }}</template>
                        <template #description>
                            <div class="step-time">
                                {{ $Util.timeFilter(detail?.create_time || '') }}
                            </div>
                        </template>
                    </a-step>
                    <a-step>
                        <template #title>{{ $t(/*审核*/'p.audit') }}</template>
                        <template #description>
                            <div class="step-tab-wrap" v-if="currStep !== 0">
                                <div class="step-tab green" :style="$Util.repairStatusFilter(detail?.status, 'color')">
                                    {{ $Util.repairStatusFilter(detail?.status) }}
                                </div>
                            </div>
                            <div class="step-time">
                                2023-04-24 10:19:27
                            </div>
                        </template>
                    </a-step>
                    <a-step>
                        <template #title>{{ $t(/*处理结果*/'r.process_result') }}</template>
                        <template #description>
                            <div class="step-tab-wrap" v-if="currStep !== 0">
                                <div class="step-tab yellow">
                                    {{ $t(/*赔付至账户*/'r.Allocated_account') }}
                                </div>
                                <a-button type="link" style="font-size: 14px;">账户钱包</a-button>
                            </div>
                            <div class="step-time" v-if="currStep !== 0">
                                可用余额：€100
                            </div>
                        </template>
                    </a-step>
                    <a-step>
                        <template #title>{{ $t(/*完成*/'in.finish') }}</template>
                        <template #description>
                            <div class="step-time" v-if="currStep !== 0">
                                2023-04-24 10:19:27
                            </div>
                        </template>
                    </a-step>
                </a-steps>
            </div>
        </div>
        <!-- 车辆信息 -->
        <div class="title-container">
            <div class="title-area">{{ $t('r.vehicle_information') }}</div>
        </div>
        <div class="table-container">
            <a-table :columns="vehicleTableColumns" :data-source="vehicleTableData" :scroll="{ x: true }"
                :row-key="record => record.id" :pagination='false'>
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.key === 'item'">
                        {{ text || '-' }}
                    </template>
                    <template v-if="column.key === 'detail'">
                        <a-button type="link" v-if="record.item_name" @click="routerChange('itemDetail', record)">
                            {{ record.item_name }}
                        </a-button>
                        <span v-else>-</span>
                    </template>
                    <template v-if="column.key === 'mileage'">
                        {{ text || '-' }}{{ $t(/*公里*/'r.km') }}
                    </template>
                    <template v-if="column.dataIndex === 'warranty_status'">
                        <a-tooltip v-if="text === 3" placement="top" :title="$t('r.tooltip_text')">
                            <div class="status status-bg status-box" :class="$Util.threePagFilter(text, 'color')">
                                {{ $Util.threePagFilter(text, $i18n.locale) }}
                            </div>
                        </a-tooltip>
                        <div class="status status-bg status-box" v-else :class="$Util.threePagFilter(text, 'color')">
                            {{ $Util.threePagFilter(text, $i18n.locale) }}
                        </div>
                    </template>
                </template>
            </a-table>
        </div>
        <!-- 工单信息 -->
        <div class="title-container">
            <div class="title-area">{{ $t('r.repair_info') }}</div>
        </div>
        <div class="repair-info-container">
            <div class="info-form-item">
                <div class="info-key">
                    {{ $t(/*工单类型*/'r.device_classify') }}：
                </div>
                <div class="info-value">
                    {{ $Util.repairNewTypeFilter(detail?.category)[$i18n.locale] }}
                </div>
            </div>
            <div class="info-form-item">
                <div class="info-key">
                    {{ $t(/*备注*/'r.remark_a') }}：
                </div>
                <div class="info-value">
                    {{ detail?.remark || '-' }}
                </div>
            </div>
            <div class="info-form-item">
                <div class="info-key">
                    {{ $t(/*创建时间*/'r.create_time') }}：
                </div>
                <div class="info-value">
                    {{ $Util.timeFilter(detail?.create_time || '') }}
                </div>
            </div>
        </div>
        <div class="table-container">
            <div class="border-wrap" v-for="(item, index) in vehicle_frame_list" :key="index">
                <div class="vehicle-item-head-wrap">
                    <div class="vehicle-item-head">
                        {{ $t(/*车架号*/'search.vehicle_no') }}：{{ item.frame_uid }}
                    </div>
                </div>
                <div class="vehicle-item-table">
                    <a-table :columns="itemVehicleTableColumns" :data-source="item.item_list" :scroll="{ x: true }"
                        :row-key="record => record.id" :pagination='false'>
                        <template #headerCell="{ column }">
                            <div v-html="column.title"></div>
                        </template>
                        <template #bodyCell="{ column, text, record }">
                            <template v-if="column.dataIndex === 'warranty_status'">
                                <a-tooltip v-if="text === 3" placement="top" :title="$t('r.tooltip_text')">
                                    <div class="status status-bg status-box" :class="$Util.threePagFilter(text, 'color')">
                                        {{ $Util.threePagFilter(text, $i18n.locale) }}
                                    </div>
                                </a-tooltip>
                                <div class="status status-bg status-box" v-else
                                    :class="$Util.threePagFilter(text, 'color')">
                                    {{ $Util.threePagFilter(text, $i18n.locale) }}
                                </div>
                            </template>
                            <!-- 通用展示 -->
                            <template v-if="column.key === 'item'">
                                {{ text || '-' }}
                            </template>
                            <template v-if="column.key === 'detail'">
                                <a-button type="link" v-if="record.item_name" @click="routerChange('itemDetail', record)">
                                    {{ record.item_name }}
                                </a-button>
                                <span v-else>-</span>
                            </template>
                            <template v-if="column.key === 'price'">
                                {{ $Util.countFilter(record?.price) || '-' }}€
                            </template>
                            <template v-if="column.key === 'total_price'">
                                {{ Number($Util.countFilter(record.price)) * record.amount || '-' }}€
                            </template>
                            <template v-if="column.key === 'upload'">
                                <div class="table-upload">
                                    <div class="table-img" v-if="record.attachment_list.length">
                                        <a-image :width="24" :height="24"
                                            :src="$Util.imageFilter(record.attachment_list[0]?.path.includes('img') ? record.attachment_list[0]?.path : '', 4)"
                                            :fallback="$t('def.none')" />
                                        <a-tooltip placement="top" :title='record.attachment_list[0]?.name'>
                                            <p class="ell" style="max-width:120px;margin-left:12px;">{{
                                                record.attachment_list[0]?.name || '-' }}</p>
                                        </a-tooltip>
                                    </div>
                                    <div v-else>-</div>
                                </div>
                            </template>
                        </template>
                    </a-table>
                    <div class="vehicle-item-footer">
                        <div class="total">
                            {{ $t(/*合计*/'p.total') }}
                        </div>
                        <div class="total-amount">
                            {{ $t(/*总数量*/'i.total_quantity') }}: {{ item?.total_count || '-' }}
                        </div>
                        <div class="total-amount">
                            {{ $t(/*总金额*/'r.total_amount') }}: €{{ $Util.countFilter(item?.total_price) || 0 }}
                        </div>
                        <div class="total-amount">
                            {{ $t(/*实付金额*/'r.amount_paid') }}: €{{ item?.total_charge || 0 }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 操作记录 -->
        <div class="title-container">
            <div class="title-area">{{ $t(/*操作记录*/'p.record') }}</div>
        </div>
        <div class="table-container">
            <a-table :columns="recordTableColumns" :data-source="recordTableData" :scroll="{ x: true }"
                :row-key="record => record.id" :pagination='false'>
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.key === 'item'">
                        {{ text || '-' }}
                    </template>
                    <template v-if="column.key === 'type'">
                        {{ $Util.repairLogTypeFilter(record.type)[$i18n.locale] || '-' }}
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                </template>
            </a-table>
        </div>
        <div class="block"></div>
        <div class="fix-container">
            <div class="pay-method-key">
                <div class="submit-btn-group">
                    <a-button @click="handleCancel">{{ $t(/*取消*/'def.cancel') }}</a-button>
                    <!-- <a-button @click="handleConfirm" type="primary">{{ $t(/*提交工单*/'r.submit_work_order') }}</a-button> -->
                </div>
            </div>
        </div>
    </div>
</template>
    
<script>
import Core from '../../core';
const STATUS = Core.Const.REPAIR.STATUS

export default {
    name: 'RepairDetail',
    components: {},
    props: {},
    data() {
        return {
            Core,
            detail: {},
            vehicleTableData: [],
            vehicle_frame_list: [],
            recordTableData: [
                {
                    type: '创建',
                    info: '提交车架号：R45BB2B68P3000787、R45BB2B68P3000787；共 5 条记录，已过滤重复 2 条，特殊 2 条',
                    user: '222',
                    create_time: 1690889450
                },
                {
                    type: '创建',
                    info: '提交车架号：R45BB2B68P3000787、R45BB2B68P3000787；共 5 条记录，已过滤重复 2 条，特殊 2 条',
                    user: '222',
                    create_time: 1690889450
                },
                {
                    type: '创建',
                    info: '提交车架号：R45BB2B68P3000787、R45BB2B68P3000787；共 5 条记录，已过滤重复 2 条，特殊 2 条',
                    user: '222',
                    create_time: 1690889450
                },
            ],
            currStep: 0, // 步骤索引
        };
    },
    watch: {},
    computed: {
        vehicleTableColumns() {
            let vehicleTableColumns = [
                { title: this.$t('search.vehicle_no'), dataIndex: 'frame_uid', key: 'item' }, // 车架号
                { title: this.$t('v.vehicle_code'), dataIndex: 'uid', key: 'item' }, // 整车码
                { title: this.$t('v.motor_coding'), dataIndex: 'motor_uid', key: 'item' }, // 电机码
                { title: this.$t('v.control_code'), dataIndex: 'vcu_uid', key: 'item' }, // 中控码
                { title: this.$t('r.item_name'), dataIndex: 'item_name', key: 'detail' }, // 商品名称
                { title: this.$t('r.car_type'), dataIndex: 'model', key: 'item' }, // 车型
                { title: this.$t('i.commercial_specification'), dataIndex: 'item_spec', key: 'item' }, // 商品规格
                { title: this.$t('r.km_travelled'), dataIndex: 'warranty_period_mileage', key: 'mileage' },
                { title: this.$t('r.three_pack_aging'), dataIndex: 'warranty_status' }, // 三包时效
            ]
            return vehicleTableColumns
        },
        lang() {
            return this.$store.state.lang
        },
        itemVehicleTableColumns() {
            let columns = [
                { title: this.$t('r.item_name'), dataIndex: 'item_name', key: 'detail' }, // 商品名称
                { title: this.$t('i.code'), dataIndex: 'item_code', key: 'item' }, // 商品编码
                { title: this.$t('i.spec'), dataIndex: 'item_spec', key: 'item' }, // 规格
                { title: this.$t('i.unit_price'), dataIndex: 'price', key: 'price' }, // 单价
                { title: this.$t('i.total_price'), dataIndex: 'price', key: 'total_price' }, // 总价
                { title: this.$t('i.amount'), dataIndex: 'amount', key: 'item' }, // 数量
                { title: this.$t('r.fault_types'), dataIndex: 'fault_category_name', key: 'item' }, // 故障类型
                { title: this.$t('r.three_pack_aging'), dataIndex: 'warranty_status' }, // 三包时效
                {   // 上传附件
                    title: this.$t('p.attachment'),
                    dataIndex: 'attachment_list',
                    key: 'upload'
                },
                {   // 问题描述
                    title: this.$t('r.description'),
                    dataIndex: 'description',
                    key: 'item'
                },
            ]
            return columns
        },
        recordTableColumns() {
            let columns = [
                { title: this.$t('n.operation'), dataIndex: 'type', key: 'type' }, // 操作类型
                { title: this.$t('r.operation_content'), dataIndex: 'content', key: 'item' }, // 操作内容
                { title: this.$t('n.operator'), dataIndex: ['user','name'], key: 'item' }, // 操作人
                { title: this.$t('r.operating_time'), dataIndex: 'create_time', key: 'time' }, // 操作时间
            ]
            return columns
        },
    },
    created() {
        this.id = Number(this.$route.query.id) || 0
        this.getRepairDetail();
        this.getLogList();
    },
    methods: {
        // 页面跳转
        routerChange(type, item = {}) {
            let routeUrl
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
                case 'edit':  // 编辑工单
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-edit",
                        query: { id: this.id },
                    })
                    break;
                case 'list':  // 工单列表
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-list",
                    })
                    break;
                case 'invoice':  // 工单列表
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-invoice",
                        query: { id: this.id },
                    })
                    break;
                case 'itemDetail':  // 维修单详情
                    routeUrl = this.$router.resolve({
                        path: "/purchase/item-list",
                        query: {
                            id: item.item_id
                        }
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
            window.open(routeUrl.href, '_self')
        },
        // 获取工单详情
        getRepairDetail() {
            this.loading = true;
            Core.Api.Repair.detail({
                id: this.id,
            }).then(res => {
                console.log('getRepairDetail res', res)
                this.detail = res
                this.vehicleTableData = this.detail.vehicle_list
                this.vehicle_frame_list = this.detail.vehicle_frame_list
                // 计算总价
                let total_price = 0;
                this.vehicle_frame_list.forEach(frame => {
                    frame.item_list.forEach(item => {
                        total_price += item.price;
                    });
                });
                this.vehicle_frame_list.forEach(frame => {
                    frame.total_price = total_price;
                });
                // 计算实付金额
                let total_charge = 0;
                this.vehicle_frame_list.forEach(frame => {
                    frame.item_list.forEach(item => {
                        total_charge += item.charge;
                    });
                });
                this.vehicle_frame_list.forEach(frame => {
                    frame.total_charge = total_charge;
                });
                // 计算总数量
                let total_count = 0;
                this.vehicle_frame_list.forEach(frame => {
                    frame.item_list.forEach(item => {
                        total_count += item.amount;
                    });
                });
                this.vehicle_frame_list.forEach(frame => {
                    frame.total_count = total_count;
                });
                this.getCurrStep(this.detail.status)
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 获取当前工单进度
        getCurrStep(status) {
            switch (status) {
                case STATUS.WAIT_DETECTION: // 订单创建，等待检测
                    this.currStep = 0;
                    break;
                case STATUS.WAIT_REPAIR: // 维修中
                    this.currStep = 1;
                    break;
                case STATUS.REPAIR_END: // 维修完成
                    this.currStep = 1;
                    break;
                case STATUS.SETTLEMENT: // 已结算，待审核(零售商创建)
                    this.currStep = 1;
                    break;
                case STATUS.SETTLEMENT_DISTRIBUTOR: // 已结算，待审核(分销商创建)
                    this.currStep = 1;
                    break;
                case STATUS.AUDIT_SUCCESS: // 平台方审核通过
                    this.currStep = 3;
                    break;
                case STATUS.FINISH: // 保外结算直接完成，不需要审核
                    this.currStep = 3;
                    break;
                case STATUS.AUDIT_FAIL: // 审核未通过
                    this.currStep = 1;
                    break;
                case STATUS.FAULT_ENTITY_AUDIT_FAIL: // 故障件审核未通过
                    this.currStep = 1;
                    break;
                case STATUS.CLOSE: // 订单取消
                    this.currStep = 1;
                    break;
            }
        },
        getLogList() {
            Core.Api.ActionLog.list({
                source_type: 20,
                source_id: this.id   
            }).then(res => {
                this.recordTableData = res.list   
            }).catch(err => {
                console.log('getLogList err', err);
            })   
        }
    }
};
</script>
    
<style lang="less" scoped>
#RepairDetail {
    position: relative;

    .title-container {
        .repair-order-sn {
            color: #86909C;
            font-size: 14px;
            font-weight: 400;
        }
    }

    .step-container {
        background: #FFFFFF;
        border-radius: 6px;
        box-sizing: border-box;
        padding: 0 200px;

        .steps {
            .step-tab-wrap {
                // position: relative;
                display: flex;

                .step-tab {
                    min-width: 76px;
                    height: 22px;
                    padding: 0 8px;
                    box-sizing: border-box;
                    border-radius: 2px;
                    background: rgba(68, 203, 124, 0.10);
                    font-size: 12px;
                    font-weight: 400;
                    text-align: center;
                    line-height: 22px;
                    margin-top: 6px;

                    &.yellow {
                        background: rgba(255, 188, 72, 0.10);
                        color: #FFBC48;
                        margin-right: 10px;
                    }

                    &.green {
                        color: #44CB7C;
                        width: 44px;
                        height: 22px;
                    }
                }
            }


            .step-time {
                color: #86909C;
                font-size: 12px;
                font-weight: 400;
                margin-top: 5px;
            }
        }
    }

    .repair-info-container {
        width: 100%;
        background-color: #FFFFFF;
        padding: 17px 100px 25px 100px;
        display: flex;
        box-sizing: border-box;
        justify-content: space-between;
        align-items: center;

        .info-form-item {
            display: flex;
            align-items: center;


            .info-key {
                color: #86909C;
                font-size: 14px;
                font-weight: 400;
                margin-right: 10px;
            }

            .info-value {
                color: #1D2129;
                font-size: 14px;
                font-weight: 400;

                &.green {
                    height: 22px;
                    line-height: 22px;
                    border-radius: 2px;
                    border: 1px solid rgba(68, 203, 124, 0.30);
                    background: rgba(68, 203, 124, 0.10);
                    padding: 0px 12px;
                    box-sizing: border-box;
                    text-align: center;
                    color: #44CB7C;
                }

                &.red {
                    height: 22px;
                    line-height: 22px;
                    border-radius: 2px;
                    border: 1px solid rgba(245, 34, 45, 0.30);
                    background: rgba(245, 34, 45, 0.10);
                    padding: 0px 12px;
                    box-sizing: border-box;
                    text-align: center;
                    color: #F5222D;
                }

                &.yellow {
                    color: #FF7D00;
                    border: 1px solid rgba(255, 125, 0, 0.30);
                    background: rgba(255, 125, 0, 0.10);
                    height: 22px;
                    line-height: 22px;
                    border-radius: 2px;
                    padding: 0px 12px;
                    box-sizing: border-box;
                    text-align: center;
                }
            }
        }
    }

    .border-wrap {
        margin-top: 16px;
        width: 100%;
        padding: 16px 16px 24px 16px;
        box-sizing: border-box;
        border-radius: 4px;
        border: 1px solid #EEF0F3;
        min-height: 200px;

        .vehicle-item-head-wrap {
            display: flex;

            .vehicle-item-head {
                min-width: 214px;
                max-width: 260px;
                height: 24px;
                background: rgba(0, 97, 255, 0.10);
                padding: 0px 6px;
                box-sizing: border-box;
                color: #0061FF;
                font-size: 14px;
                font-weight: 600;
                line-height: 24px;
                text-align: center;
            }

            .spec-tab {
                margin-left: 8px;
                min-width: 52px;
                text-align: center;
                line-height: 24px;
                padding: 0 12px;
                height: 24px;
                border-radius: 2px;
                color: #F5222D;
                font-size: 14px;
                font-weight: 400;
                background: rgba(245, 34, 45, 0.10);
            }
        }


        .vehicle-item-footer {
            position: relative;
            margin-top: 18px;
            margin-bottom: 16px;
            width: 100%;
            display: flex;
            justify-content: flex-end;
            color: #1D2129;
            font-size: 14px;
            font-weight: 400;

            .add-btn {
                position: absolute;
                left: 0;
            }

            .total,
            .total-amount {
                margin-right: 24px;
            }
        }

        .table-upload {
            display: flex;
            align-items: center;

            .divide-line {
                width: 1px;
                height: 16px;
                background: #F0F0F0;
                margin: 0 12px;
            }

            .upload-icon {
                width: 20px;
                height: 20px;
                cursor: pointer;
                margin-left: 10px;
            }

            .upload-text {
                color: #0061FF;
                font-size: 14px;
                font-weight: 400;
                margin-left: 6px;
                cursor: pointer;
            }

            :deep(.file-list) {
                display: flex !important;
                width: 300px;
            }

            :deep(.file-name) {
                width: 1000px;
                margin-right: 20px;
                margin-left: 10px;
            }
        }
    }

    .block {
        width: 100%;
        height: 60px;
        background-color: #FFFFFF;
        border-radius: 4px;
    }

    .fix-container {
        width: 100%;
        height: 60px;
        position: fixed;
        z-index: 999;
        bottom: 0;
        display: flex;
        justify-content: right;
        align-items: center;
        background-color: #FFF;

        .pay-method-key {
            width: 340px;
            display: flex;
            align-items: center;
            color: #1D2129;
            font-size: 14px;
            font-weight: 400;

            .pay-method-radio {
                margin-left: 16px;
            }

            .balance {
                color: #86909C;
                font-size: 14px;
                font-weight: 400;
                margin-left: 24px;
            }

            .submit-btn-group {
                margin-left: 32px;
            }
        }
    }
}
</style>
    