<template>
    <div id="RepairDetail" class="edit-container">
        <!-- 工单详情 -->
        <div class="title-container">
            <div class="title-area fl-js">{{ $t('r.repair_detail') }}</div>
            <div class="repair-order-sn">
                {{ $t(/*工单编号*/'r.repair_sn') }}：{{ detail.sn || '-' }}
            </div>
        </div>
        <!-- 步骤条 -->
        <div class="step-container">
            <div class="steps">
                <a-steps :current="1">
                    <a-step>
                        <template #title>{{ $t(/*提交工单*/'r.submit_work_order') }}</template>
                        <template #description>
                            <span>2023-04-24 10:19:27</span>
                        </template>
                    </a-step>
                    <a-step>
                        <template #title>{{ $t(/*审核*/'p.audit') }}</template>
                        <template #description>
                            <div class="step-tab-wrap">
                                <div class="step-tab green">
                                    通过
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
                            <div class="step-tab-wrap">
                                <div class="step-tab yellow">
                                    {{ $t(/*赔付至账户*/'r.Allocated_account') }}
                                </div>
                                <a-button type="link" style="font-size: 14px;">账户钱包</a-button>
                            </div>
                            <div class="step-time">
                                可用余额：€100
                            </div>
                        </template>
                    </a-step>
                    <a-step>
                        <template #title>{{ $t(/*完成*/'in.finish') }}</template>
                        <template #description>
                            <div class="step-time">
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
                    {{ $t(/*工单帐类*/'r.repair_account_type') }}：
                </div>
                <div class="info-value" :class="$Util.threePagFilter(1, 'color')">
                    {{ $Util.threePagFilter(1, $i18n.locale) }}
                </div>
            </div>
            <div class="info-form-item">
                <div class="info-key">
                    {{ $t(/*工单类型*/'r.device_classify') }}：
                </div>
                <div class="info-value">
                    维修
                </div>
            </div>
            <div class="info-form-item">
                <div class="info-key">
                    {{ $t(/*备注*/'r.remark_a') }}：
                </div>
                <div class="info-value">
                    --
                </div>
            </div>
            <div class="info-form-item">
                <div class="info-key">
                    {{ $t(/*创建时间*/'r.create_time') }}：
                </div>
                <div class="info-value">
                    2023-03-23 11:27:17
                </div>
            </div>
        </div>
        <div class="table-container">
            <div class="border-wrap" v-for="(item, index) in vehicle_list" :key="index">
                <div class="vehicle-item-head-wrap">
                    <div class="vehicle-item-head">
                        {{ $t(/*车架号*/'search.vehicle_no') }}：{{ item.frame_uid }}
                    </div>
                </div>
                <div class="vehicle-item-table">
                    <a-table :columns="itemVehicleTableColumns" :data-source="item.itemVehicleTableData"
                        :scroll="{ x: true }" :row-key="record => record.id" :pagination='false'>
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
                            <template v-if="column.key === 'price'">
                                {{ $Util.countFilter(text) || '-' }}€
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
                                </div>
                            </template>
                        </template>
                    </a-table>
                    <div class="vehicle-item-footer">
                        <div class="total">
                            {{ $t(/*合计*/'p.total') }}
                        </div>
                        <div class="total-amount">
                            {{ $t(/*总数量*/'i.total_quantity') }}: {{ item.amount }}
                        </div>
                        <div class="total-amount">
                            {{ $t(/*总金额*/'r.total_amount') }}: €{{ item.price }}
                        </div>
                        <div class="total-amount">
                            {{ $t(/*实付金额*/'r.amount_paid') }}: €{{ item.pay_price }}
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
            detail: {
                sn: 'CN222202306300002'
            },
            vehicleTableData: [
                {
                    vehicle_no: 'R45LA1C20P2000043',
                    vehicle_code: 'TLA30000BX263U39G',
                    motor_uid: 'TLA30000BX263U39G',
                    vcu_uid: '122122481322',
                    item_name: '液压升降小推车--MAUTO',
                    model: 'SK3',
                    item_spec: '银色；100/80-14’’',
                    mileage: 100,
                    warranty_status: 1,
                },
                {
                    vehicle_no: 'R45LA1C20P2000043',
                    vehicle_code: 'TLA30000BX263U39G',
                    motor_uid: 'TLA30000BX263U39G',
                    vcu_uid: '122122481322',
                    item_name: '液压升降小推车--MAUTO',
                    model: 'SK3',
                    item_spec: '银色；100/80-14’’',
                    mileage: 100,
                    warranty_status: 2,
                },
                {
                    vehicle_no: 'R45LA1C20P2000043',
                    vehicle_code: 'TLA30000BX263U39G',
                    motor_uid: 'TLA30000BX263U39G',
                    vcu_uid: '122122481322',
                    item_name: '液压升降小推车--MAUTO',
                    model: 'SK3',
                    item_spec: '银色；100/80-14’’',
                    mileage: 100,
                    warranty_status: 3,
                },
                {
                    vehicle_no: 'R45LA1C20P2000043',
                    vehicle_code: 'TLA30000BX263U39G',
                    motor_uid: 'TLA30000BX263U39G',
                    vcu_uid: '122122481322',
                    item_name: '液压升降小推车--MAUTO',
                    model: 'SK3',
                    item_spec: '银色；100/80-14’’',
                    mileage: 100,
                    warranty_status: 1,
                }
            ],
            vehicle_list: [
                {
                    frame_uid: "R45BB2B60P3000007",
                    itemVehicleTableData: [
                        {
                            item_name: '电池',
                            item_id: 1,
                            item_code: 'TLA3-B8-0000',
                            item_spec: '珍珠白；100/80-14’’',
                            amount: 1,
                            unit_price: 10000,
                            total_price: 20000,
                            fault_type: '电池故障',
                            warranty_status: 1,
                            attachment_list: [],
                            question_desc: '',
                        },
                        {
                            item_name: '电池',
                            item_id: 2,
                            item_code: 'TLA3-B8-0000',
                            item_spec: '珍珠白；100/80-14’’',
                            amount: 1,
                            unit_price: 10000,
                            total_price: 20000,
                            fault_type: '电池故障',
                            warranty_status: 1,
                            attachment_list: [],
                            question_desc: '',
                        },
                    ],
                    amount: 10,
                    price: 100,
                    pay_price: 1000,
                },
                {
                    frame_uid: "R45BB2B60P3000008",
                    itemVehicleTableData: [
                        {
                            item_name: '电池',
                            item_id: 1,
                            item_code: 'TLA3-B8-0000',
                            item_spec: '珍珠白；100/80-14’’',
                            amount: 1,
                            unit_price: 10000,
                            total_price: 20000,
                            fault_type: '电池故障',
                            warranty_status: 1,
                            attachment_list: [],
                            question_desc: '',
                        }
                    ],
                    amount: 10,
                    price: 100,
                    pay_price: 1000,
                },
            ],
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
        };
    },
    watch: {},
    computed: {
        vehicleTableColumns() {
            let vehicleTableColumns = [
                { title: this.$t('search.vehicle_no'), dataIndex: 'vehicle_no', key: 'item' }, // 车架号
                { title: this.$t('v.vehicle_code'), dataIndex: 'vehicle_code', key: 'item' }, // 整车码
                { title: this.$t('v.motor_coding'), dataIndex: 'motor_uid', key: 'item' }, // 电机码
                { title: this.$t('v.control_code'), dataIndex: 'vcu_uid', key: 'item' }, // 中控码
                { title: this.$t('r.item_name'), dataIndex: 'item_name', key: 'item' }, // 商品名称
                { title: this.$t('r.car_type'), dataIndex: 'model', key: 'item' }, // 车型
                { title: this.$t('i.commercial_specification'), dataIndex: 'item_spec', key: 'item' }, // 商品规格
                { title: this.$t('r.km_travelled'), dataIndex: 'mileage', key: 'mileage' },
                { title: this.$t('r.three_pack_aging'), dataIndex: 'warranty_status' }, // 三包时效
            ]
            return vehicleTableColumns
        },
        lang() {
            return this.$store.state.lang
        },
        itemVehicleTableColumns() {
            let columns = [
                { title: this.$t('r.item_name'), dataIndex: 'item_name', key: 'item' }, // 商品名称
                { title: this.$t('i.code'), dataIndex: 'item_code', key: 'item' }, // 商品编码
                { title: this.$t('i.spec'), dataIndex: 'item_spec', key: 'item' }, // 规格
                { title: this.$t('i.amount'), dataIndex: 'amount', key: 'item' }, // 数量
                { title: this.$t('i.unit_price'), dataIndex: 'unit_price', key: 'price' }, // 单价
                { title: this.$t('i.total_price'), dataIndex: 'total_price', key: 'price' }, // 总价
                { title: this.$t('r.fault_types'), dataIndex: 'fault_type', key: 'fault_type' }, // 故障类型
                { title: this.$t('r.three_pack_aging'), dataIndex: 'warranty_status' }, // 三包时效
                {   // 上传附件
                    title: `<span style="color: red; margin-right: 2px;">*</span> ${this.$t('p.attachment')}`,
                    dataIndex: 'attachment_list',
                    key: 'upload'
                },
                {   // 问题描述
                    title: this.$t('r.description'),
                    dataIndex: 'question_desc',
                    key: 'item'
                },
            ]
            return columns
        },
        recordTableColumns() {
            let columns = [
                { title: this.$t('n.operation'), dataIndex: 'type', key: 'item' }, // 操作类型
                { title: this.$t('r.operation_content'), dataIndex: 'info', key: 'item' }, // 操作内容
                { title: this.$t('n.operator'), dataIndex: 'user', key: 'item' }, // 操作人
                { title: this.$t('r.operating_time'), dataIndex: 'create_time', key: 'time' }, // 操作时间
            ]
            return columns
        },
    },
    created() {
        // this.id = Number(this.$route.query.id) || 0
    },
    methods: {
        // 页面跳转
        routerChange(type, item) {
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
                this.getCurrStep(this.detail.status)
                this.getFaultData()
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            Core.Api.RepairItem.list({
                repair_order_id: this.id
            }).then(res => {
                console.log("测试", res)
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 获取当前工单进度
        getCurrStep(status) {
            switch (status) {
                case STATUS.WAIT_DETECTION:
                    this.currStep = 0;
                    break;
                case STATUS.WAIT_REPAIR:
                    this.currStep = 1;
                    break;
                case STATUS.REPAIR_END:
                    this.currStep = 2;
                    break;
                case STATUS.SETTLEMENT:
                    this.currStep = 3;
                    break;
                case STATUS.SETTLEMENT_DISTRIBUTOR:
                    this.currStep = 3;
                    break;
                case STATUS.AUDIT_SUCCESS:
                    this.currStep = 3;
                    break;
                case STATUS.FINISH:
                    this.currStep = 3;
                    break;
            }
        },
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
        height: 20px;
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
    