<template>
    <div id="RepairDetail">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('r.repair_detail') }}</div>
                <div class="btns-area">
                    <template v-if="sameOrg && $auth('repair-order.save')">
                        <a-button
                            type="primary"
                            ghost
                            @click="routerChange('edit')"
                            v-if="detail.status == STATUS.WAIT_DETECTION"
                        >
                            <i class="icon i_edit" />{{ $t('def.edit') }}
                        </a-button>
                        <a-button
                            type="primary"
                            ghost
                            @click="handleDelete()"
                            v-if="detail.status == STATUS.WAIT_DETECTION || detail.status == STATUS.AUDIT_FAIL"
                        >
                            <i class="icon i_edit" />{{ $t('def.delete') }}
                        </a-button>
                        <a-button
                            type="primary"
                            ghost
                            @click="routerChange('edit')"
                            v-if="detail.status == STATUS.AUDIT_FAIL"
                        >
                            {{ $t('def.re_edit') }}
                        </a-button>
                        <!--                    <a-button type="primary" ghost @click="handleDeliveryShow()" v-if="needDelivery">
                        <i class="icon i_deliver"/>转单物流
                    </a-button>-->
                        <a-button
                            type="primary"
                            @click="handleFaultSubmit()"
                            v-if="detail.status == STATUS.WAIT_DETECTION"
                        >
                            <i class="icon i_submit" />{{ $t('def.submit') }}
                        </a-button>
                        <a-button
                            type="primary"
                            @click="handleRepairEndShow()"
                            v-if="detail.status == STATUS.WAIT_REPAIR"
                        >
                            <i class="icon" />{{ $t('r.repair_a') }}
                        </a-button>
                        <a-button type="primary" @click="handleSettlement()" v-if="detail.status == STATUS.REPAIR_END">
                            <i class="icon i_settle" />{{ $t('r.submit_review') }}
                        </a-button>
                    </template>
                    <a-button
                        type="primary"
                        @click="routerChange('invoice')"
                        v-if="!haveSettle && $auth('repair-order.settlement')"
                    >
                        <i class="icon i_detail_l" />{{ $t('r.bill') }}
                    </a-button>
                    <a-button
                        type="primary"
                        @click="handleAuditShow()"
                        v-if="detail.status == STATUS.SETTLEMENT && $auth('DISTRIBUTOR') && $auth('repair-order.audit')"
                    >
                        <i class="icon i_audit" />{{ $t('n.audit') }}
                    </a-button>
                    <a-button
                        type="primary"
                        @click="handleAuditShow()"
                        v-if="
                            detail.status == STATUS.DISTRIBUTOR_AUDIT_SUCCESS &&
                            $auth('ADMIN') &&
                            $auth('repair-order.audit')
                        "
                    >
                        <i class="icon i_audit" />{{ $t('n.audit') }}
                    </a-button>
                    <a-button
                        type="primary"
                        @click="handleAuditShow()"
                        v-if="
                            detail.status == STATUS.SETTLEMENT_DISTRIBUTOR &&
                            $auth('ADMIN') &&
                            $auth('repair-order.audit')
                        "
                    >
                        <i class="icon i_audit" />{{ $t('n.audit') }}
                    </a-button>
                </div>
            </div>
            <div class="gray-panel info">
                <div class="panel-title">
                    <div class="left">
                        <span>{{ $t('r.serial_number') }}:</span> {{ detail.uid }}
                    </div>
                    <div class="right">
                        <a-tooltip :title="detail.audit_message">
                            <div class="status">
                                <i class="icon i_point" :class="$Util.repairStatusFilter(detail.status, 'color')" />
                                {{ $Util.repairStatusFilter(detail.status, $i18n.locale) }}
                                <i
                                    class="icon i_hint"
                                    style="font-size: 12px; padding-left: 6px"
                                    v-if="detail.status == STATUS.AUDIT_FAIL"
                                />
                            </div>
                        </a-tooltip>
                    </div>
                </div>
                <div class="panel-content">
                    <div class="info-item">
                        <div class="key">{{ $t('r.warranty') }}</div>
                        <div class="value">{{ $Util.repairServiceFilter(detail.service_type, $i18n.locale) }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">{{ $t('search.vehicle_no') }}</div>
                        <div class="value">
                            {{ detail.vehicle_no || '-' }}
                            <a-tag v-if="detail.flag_source" color="blue">{{ $t('search.special') }}</a-tag>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="key">{{ $t('r.creator_name') }}</div>
                        <div class="value">{{ detail.user_name || '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">{{ $t('r.associated_customer') }}</div>
                        <div class="value">{{ detail.customer_name || '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">{{ $t('r.urgency') }}</div>
                        <div class="value">{{ $Util.repairPriorityFilter(detail.priority, $i18n.locale) }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">{{ $t('r.create_time') }}</div>
                        <div class="value">{{ $Util.timeFilter(detail.create_time) || '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">{{ $t('r.description') }}</div>
                        <div class="value">{{ detail.desc }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">{{ $t('r.remark_a') }}</div>
                        <div class="value">{{ detail.remark }}</div>
                    </div>
                </div>
            </div>
            <MySteps :stepsList="stepsList" :current="currStep" v-if="detail.status != STATUS.CLOSE" />
            <div class="form-container">
                <CheckFault
                    :id="id"
                    :detail="detail"
                    :serviceType="detail.service_type"
                    @submit="getRepairDetail"
                    v-if="detail.status == STATUS.WAIT_DETECTION && sameOrg"
                    ref="CheckFault"
                />
                <CheckResult :id="id" :detail="detail" @hasTransfer="hasTransfer = true" v-if="showCheckResult" />
                <RepairInfo :id="id" :detail="detail" />
                <AttachmentFile
                    @attachmentEmpty="getAttachmentEmpty"
                    :detail="detail"
                    :target_id="id"
                    :target_type="ATTACHMENT_TARGET_TYPE.REPAIR_ORDER"
                />
                <WaybillInfo
                    :id="id"
                    :detail="detail"
                    v-if="hasTransfer"
                    @needDelivery="needDelivery = true"
                    ref="WaybillInfo"
                />
                <ActionLog :id="id" :detail="detail" :sourceType="Core.Const.ACTION_LOG.SOURCE_TYPE.REPAIR_ORDER" />
                <!-- <FeedbackLog   :id='id' :detail='detail' :sourceType="Core.Const.FEEDBACK.SOURCE_TYPE.REPAIR_ORDER"/> -->
            </div>
        </div>
        <template class="modal-container">
            <!-- 转单物流 -->
            <a-modal v-model:visible="deliveryShow" :title="$t('n.turn_logistics')" @ok="handleDeliverySubmit">
                <div class="form-item required">
                    <div class="key">{{ $t('n.logistics_company') }}:</div>
                    <div class="value">
                        <a-select v-model:value="deliveryForm.company_uid" :placeholder="$t('r.logistics_company')">
                            <a-select-option v-for="(val, key) in companyMap" :key="key" :value="key">{{
                                val
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.tracking_number') }}:</div>
                    <div class="value">
                        <a-input v-model:value="deliveryForm.waybill_uid" :placeholder="$t('r.logistics_number')" />
                    </div>
                </div>
            </a-modal>
            <a-modal
                v-model:visible="repairEndShow"
                :title="$t('r.repair_a')"
                class="repair-audit-modal"
                :after-close="handleRepairEndClose"
            >
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">{{ $t('r.result') }}:</div>
                        <a-radio-group v-model:value="repairForm.results">
                            <a-radio :value="1">{{ $t('def.sure') }}</a-radio>
                            <a-radio :value="0">{{ $t('def.cancel') }}</a-radio>
                        </a-radio-group>
                    </div>
                    <div class="form-item textarea">
                        <div class="key">{{ $t('r.remark_a') }}:</div>
                        <div class="value">
                            <a-textarea
                                v-model:value="repairForm.repair_message"
                                :placeholder="$t('r.input_remark')"
                                :auto-size="{ minRows: 2, maxRows: 6 }"
                                :maxlength="99"
                            />
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="repairEndShow = false">{{ $t('def.cancel') }}</a-button>
                    <a-button @click="handleRepairEnd()" type="primary">{{ $t('def.sure') }}</a-button>
                </template>
            </a-modal>
            <a-modal
                v-model:visible="repairAuditShow"
                :title="$t('n.audit')"
                style="width: 800px; height: 600px"
                :after-close="handleAuditClose"
            >
                <div class="modal-content">
                    <!-- 结算清单 -->
                    <div>
                        <h3>{{ $t('r.settlement_list') }}</h3>
                        <div style="display: flex; justify-content: space-between">
                            <span
                                >{{ $t('r.warranty') }}：{{
                                    $Util.repairServiceFilter(detail.service_type, $i18n.locale)
                                }}</span
                            >
                            <span>{{ $t('r.serial_number') }}：{{ detail.uid }}</span>
                            <span>{{ $t('r.date') }}：{{ $Util.timeFilter(detail.create_time, 3) || '-' }}</span>
                        </div>
                    </div>
                    <!-- 工单记录 -->
                    <div style="margin-top: 10px">
                        <h3>{{ $t('r.Work_order_record') }}</h3>
                        <a-table
                            :columns="tableColumns"
                            :data-source="tableData"
                            :scroll="{ x: true }"
                            :row-key="record => record.id"
                            :pagination="false"
                        >
                            <template #headerCell="{ title }">
                                {{ $t(title) }}
                            </template>
                            <template #bodyCell="{ column, text, record }">
                                <template v-if="column.key === 'item'">
                                    {{ text || '-' }}
                                </template>
                                <template v-if="column.dataIndex === 'item_fault_id'">
                                    {{ faultMap[text] }}
                                </template>
                                <template v-if="column.dataIndex === 'amount'">
                                    {{ text }} {{ $t('in.item') }}
                                </template>
                                <!-- 单价 -->
                                <template v-if="column.dataIndex === 'price'">
                                    {{ $Util.priceUnitFilter(detail.currency) }} {{ $Util.countFilter(text) }}
                                </template>
                                <!-- 总价 -->
                                <template v-if="column.dataIndex === 'sum_price'">
                                    {{ $Util.priceUnitFilter(detail.currency) }}
                                    {{ $Util.countFilter(record.price * record.amount) }}
                                </template>
                            </template>
                        </a-table>
                        <!-- 总价 实付金额 -->
                        <div
                            style="
                                width: 100%;
                                display: flex;
                                flex-direction: column;
                                align-items: end;
                                line-height: 30px;
                                margin-top: 20px;
                                font-size: 12px;
                            "
                        >
                            <div>
                                <span>{{ $t('r.total_price') }}</span>
                                <span style="margin-left: 100px">
                                    {{ $Util.priceUnitFilter(detail.currency) }}
                                    {{ $Util.countFilter(sum_price) }}
                                </span>
                            </div>
                            <div>
                                <span>{{ $t('r.amount_paid') }}</span>
                                <span style="margin-left: 100px">
                                    {{ $Util.priceUnitFilter(detail.currency) }}
                                    {{ $Util.countFilter(sum_price) }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <!-- 工单处理 -->
                    <div style="margin-top: 10px">
                        <h3>{{ $t('r.Work_order_processing') }}</h3>
                        <!-- 处理方式 -->
                        <div>
                            <div class="form-item">
                                <div class="key" :class="{ en_key: $i18n.locale == 'en' }">
                                    {{ $t('r.Treatment_mode') }}:
                                </div>
                                <a-radio-group v-model:value="auditForm.compensation_method">
                                    <a-radio v-for="($1, index) in TreatmentMode" :key="index" :value="$1.value">
                                        <template v-if="$1.value == 1">{{ $t('r.Compensation_accessories') }}</template>
                                        <template v-if="$1.value == 2">
                                            {{ $t('r.Allocated_account') }}
                                            <a-popover color="#535353">
                                                <template #content>
                                                    <div style="color: #fff; width: 350px">
                                                        <p>
                                                            {{ $t('r.Allocated_account') }}：
                                                            <span>{{ $t('r.Allocated_account_Text') }}</span>
                                                        </p>
                                                        <p>
                                                            {{ $t('r.Compensation_accessories') }}：
                                                            <span>{{ $t('r.Compensation_accessories_text') }}</span>
                                                        </p>
                                                    </div>
                                                </template>
                                                <span class="popovers">i</span>
                                            </a-popover>
                                        </template>
                                    </a-radio>
                                </a-radio-group>
                            </div>
                        </div>
                        <!-- <transition> -->
                        <template v-if="auditForm.compensation_method == 2">
                            <!-- 抵扣方式 -->
                            <!-- <div style="line-height: 50px;">
                                <div class="form-item">
                                <div class="key" :class="{en_key: $i18n.locale == 'en'}">{{ $t('r.Deduction_method') }}:</div>
                                    <a-radio-group v-model:value="auditForm.compensation_type" @change="radioChange">
                                        <a-radio value="1">{{ $t('r.percentage') }}</a-radio>
                                        <a-radio value="2">{{ $t('r.money') }}</a-radio>
                                    </a-radio-group>
                                </div>
                            </div> -->
                            <!-- 抵扣价格 -->
                            <!-- <div style="line-height: 50px;">
                                <div class="form-item">
                                    <div class="key" :class="{en_key: $i18n.locale == 'en'}">{{ $t('r.Deduction_price') }}:</div>
                                    <a-input style="width: 100px;"  placeholder="请输入" @change="typeChange" v-model:value="auditForm.compensation_money"/>
                                    <span style="margin-left:10px;">{{ auditForm.compensation_type == 1?'%': $Util.priceUnitFilter(detail.currency) }}</span>
                                </div>
                            </div> -->
                            <!-- 赔付金额 -->

                            <div>
                                <div class="form-item" style="color: #9495a4">
                                    <div class="key" :class="{ en_key: $i18n.locale == 'en' }" style="color: #9495a4">
                                        {{ $t('r.Compensation_amount') }}:
                                    </div>
                                    <!-- <span>{{this.auditForm.compensation_price}}</span> -->
                                    <!-- 单位 -->
                                    <span>{{ $Util.priceUnitFilter(detail.currency) }}</span>
                                    <span>{{ $Util.countFilter(sum_price) }}</span>
                                </div>
                            </div>
                        </template>
                        <!-- </transition> -->
                    </div>
                    <!-- 审核 -->
                    <div style="margin-top: 10px">
                        <h3>{{ $t('n.audit') }}</h3>
                        <div class="form-item required">
                            <div class="key">{{ $t('n.result') }}:</div>
                            <a-radio-group v-model:value="auditForm.audit_result">
                                <a-radio :value="1">{{ $t('n.pass') }}</a-radio>
                                <a-radio :value="0">{{ $t('n.fail') }}</a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                    <!-- 备注 -->
                    <div style="margin-top: 10px" class="form-item textarea">
                        <div class="key">{{ $t('r.remark_a') }}:</div>
                        <div class="value" style="width: 380px">
                            <a-textarea
                                v-model:value="auditForm.audit_message"
                                :placeholder="$t('input.input_number')"
                                rows="4"
                                :maxlength="99"
                            />
                        </div>
                    </div>
                    <!-- <div class="form-item textarea required" v-if="auditForm.audit_result === 0">
                    <div class="key">{{ $t('n.reason') }}:</div>
                    <div class="value">
                        <a-textarea v-model:value="auditForm.audit_message" :placeholder="$t('r.fail_result')"
                            :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                    </div>
                </div> -->
                </div>
                <template #footer>
                    <a-button @click="repairAuditShow = false">{{ $t('def.cancel') }}</a-button>
                    <a-button @click="handleAuditSubmit()" type="primary">{{ $t('def.sure') }}</a-button>
                </template>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';
import dayjs from 'dayjs';

import CheckFault from './components/CheckFault.vue';
import CheckResult from './components/CheckResult.vue';
import RepairInfo from './components/RepairInfo.vue';
import WaybillInfo from './components/WaybillInfo.vue';
import Distribution from './components/Distribution.vue';
import ActionLog from './components/ActionLog.vue';
import FeedbackLog from './components/FeedbackLog.vue';

import MySteps from '@/components/common/MySteps.vue';
import AttachmentFile from '@/components/panel/AttachmentFile.vue';

const REPAIR = Core.Const.REPAIR;
const STATUS = Core.Const.REPAIR.STATUS;
const REPAIR_ITEM = Core.Const.REPAIR_ITEM;
const AUDIT = Core.Const.REPAIR.AUDIT;

export default {
    name: 'RepairDetail',
    components: {
        AttachmentFile,
        CheckFault,
        CheckResult,
        RepairInfo,
        ActionLog,
        MySteps,
        Distribution,
        WaybillInfo,
        FeedbackLog,
    },
    props: {},
    data() {
        return {
            Core,
            orgType: Core.Data.getOrgType(),
            orgId: Core.Data.getOrgId(),
            STATUS,
            AUDIT,
            REPAIR_RESULTS: REPAIR.RESULTS,
            ATTACHMENT_TARGET_TYPE: Core.Const.ATTACHMENT.TARGET_TYPE,

            // 加载
            loading: false,
            id: 0,
            detail: {}, // 工单详情

            stepsList: [
                // {title: '分配工单'},
                // {title: '后台审核'},
                { zh: '检测', en: 'Check' },
                { zh: '维修', en: 'Service' },
                { zh: '结算', en: 'Settle accounts' },
            ],
            currStep: 0,

            faultMap: {}, // 所有故障类型

            repairAuditShow: false, //审核
            // auditType: '',
            auditForm: {
                audit_result: '',
                audit_message: '',
                compensation_method: 2, // 处理方式 1是赔付配件  2赔付至账户
                // compensation_type: '1', // 抵扣方式 1是百分比 2金额
                // compensation_money:'',//抵扣价格
                // compensation_price:'0'//赔付金额
            },

            repairEndShow: false,
            repairForm: {
                results: '',
                repair_message: '',
            },

            // 二次维修
            secondShow: false,
            secondForm: {
                plan_time: undefined,
            },
            // 转单
            hasTransfer: false,
            needDelivery: false,
            deliveryShow: false,
            companyMap: Core.Const.WAYBILL.COMPANY_MAP,
            deliveryForm: {
                waybill_uid: '',
                company_uid: undefined,
            },
            tableData: [],
            isAttachmentEmpty: true,

            // 工单处理方式
            TreatmentMode: Core.Const.REPAIR.COMPENSATION.COMPENSATION_METHOD,
        };
    },
    watch: {},
    computed: {
        showCheckResult() {
            switch (this.detail.status) {
                case STATUS.WAIT_DETECTION:
                    return false;
                default:
                    return true;
            }
        },
        sameOrg() {
            if (this.detail.org_id === this.orgId && this.detail.org_type === this.orgType) {
                return true;
            }
            return false;
        },
        haveSettle() {
            switch (this.detail.status) {
                case STATUS.WAIT_DETECTION:
                case STATUS.WAIT_REPAIR:
                case STATUS.CLOSE:
                    return true;
                default:
                    return false;
            }
        },
        workColumns() {
            let columns = [
                {
                    title: this.$t('r.fault_name'),
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: this.$t('r.material'),
                    dataIndex: 'age',
                    key: 'age',
                },
                {
                    title: this.$t('r.quantity'),
                    dataIndex: 'quantity',
                    key: 'quantity',
                },
                {
                    title: this.$t('r.unit_price'),
                    dataIndex: 'unit_price',
                    key: 'unit_price',
                },
                {
                    title: this.$t('r.total_price'),
                    dataIndex: 'total_price',
                    key: 'total_price',
                },
            ];
            return columns;
        },
        tableColumns() {
            let tableColumns = [
                { title: 'r.fault_name', dataIndex: 'item_fault_id' },
                { title: 'r.material', dataIndex: ['item', 'name'], key: 'item' },
                { title: 'i.amount', dataIndex: 'amount' },
                { title: 'i.unit_price', dataIndex: 'price' },
                { title: 'i.total_price', dataIndex: 'sum_price' },
            ];
            return tableColumns;
        },
        sum_price() {
            let sum = 0;
            this.tableData.forEach(item => {
                sum += item.amount * item.price;
            });
            return sum;
        },
    },
    created() {
        this.id = Number(this.$route.query.id) || 0;
        this.getRepairDetail();
        this.getTableData();
    },
    methods: {
        getAttachmentEmpty(attachmentEmpty) {
            console.log('attachmentEmpty', attachmentEmpty);
            this.isAttachmentEmpty = attachmentEmpty;
        },
        // 页面跳转
        routerChange(type, item) {
            let routeUrl;
            switch (type) {
                case 'back':
                    this.$router.go(-1);
                    break;
                case 'edit': // 编辑工单
                    routeUrl = this.$router.resolve({
                        path: '/repair/repair-edit',
                        query: { id: this.id },
                    });
                    break;
                case 'list': // 工单列表
                    routeUrl = this.$router.resolve({
                        path: '/repair/repair-list',
                    });
                    break;
                case 'invoice': // 工单列表
                    routeUrl = this.$router.resolve({
                        path: '/repair/repair-invoice',
                        query: { id: this.id },
                    });
                    break;
            }
            window.open(routeUrl.href, '_self');
        },
        // 获取工单详情
        getRepairDetail() {
            this.loading = true;
            Core.Api.Repair.detail({
                id: this.id,
            })
                .then(res => {
                    console.log('getRepairDetail res', res);
                    this.detail = res;
                    this.getCurrStep(this.detail.status);
                    this.getFaultData();
                })
                .catch(err => {
                    console.log('getRepairDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.RepairItem.list({
                repair_order_id: this.id,
            })
                .then(res => {
                    console.log('测试', res);
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getFaultData() {
            this.loading = true;
            Core.Api.Fault.list({
                org_id: this.detail.org_id,
                org_type: this.detail.org_type,
            })
                .then(res => {
                    console.log('getFaultData res:', res);
                    let list = res.list;
                    let map = {};
                    for (const item of list) {
                        map[item.id] = item.name;
                    }
                    console.log('getFaultData faultMap:', map);
                    this.faultMap = map;
                })
                .catch(err => {
                    console.log('getFaultData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // radioChange(){
        //     this.auditForm.compensation_money = ''
        //     this.auditForm.compensation_price = 0
        // },
        // typeChange(e){
        //     if(this.auditForm.compensation_type === '1'){
        //         if(this.auditForm.compensation_money > 100){
        //             this.$message.warning(this.$t('r.Percentage_exceeds'))
        //             this.auditForm.compensation_money = ''
        //             this.auditForm.compensation_price = 0
        //         }else{
        //             this.auditForm.compensation_price = this.auditForm.compensation_money / 100 * this.$Util.countFilter(this.sum_price)
        //         }
        //     }
        //     if(this.auditForm.compensation_type === '2'){
        //         if(this.auditForm.compensation_money > this.$Util.countFilter(this.sum_price)){
        //             this.$message.warning(this.$t('r.Amount_exceeds'))
        //             this.auditForm.compensation_money = ''
        //             this.auditForm.compensation_price = 0
        //         }else{
        //             this.auditForm.compensation_price = this.auditForm.compensation_money
        //         }
        //     }
        // },
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
        // 提交检测结果
        handleFaultSubmit() {
            if (this.isAttachmentEmpty) {
                this.$message.warning(this.$t('r.check_attachment'));
            } else {
                this.$refs.CheckFault.handleFaultSubmit();
            }
        },

        // 工单 结算
        handleRepairEndShow() {
            this.repairEndShow = true;
        },
        handleRepairEnd() {
            let form = Core.Util.deepCopy(this.repairForm);
            if (form.results == 0) {
                _this.handleRepairEndClose();
                return;
            }
            if (!form.results) {
                return this.$message.warning(_this.$t('r.repair_result'));
            }

            let _this = this;
            Core.Api.Repair.repair({ id: this.id, ...form }).then(() => {
                _this.$message.success(_this.$t('pop_up.save_success'));
                _this.handleRepairEndClose();
                _this.getRepairDetail();
            });
        },
        handleRepairEndClose() {
            this.repairEndShow = false;
            Object.assign(this.repairForm, this.$options.data().repairForm);
        },

        handleDelete() {
            let _this = this;
            this.$confirm({
                title: _this.$t('p.determine_cancel'),
                okText: _this.$t('pop_up.yes'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.Repair.delete({ id: _this.id }).then(() => {
                        _this.$message.success(_this.$t('pop_up.delete_success'));
                        _this.$router.replace('/repair/repair-list');
                    });
                },
            });
        },
        // 工单 结算
        handleSettlement() {
            let _this = this;
            this.$confirm({
                title: _this.$t('r.sure_bill'),
                okText: _this.$t('pop_up.yes'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.Repair.settlement({ id: _this.id }).then(() => {
                        _this.$message.success(_this.$t('pop_up.save_success'));
                        _this.getRepairDetail();
                    });
                },
            });
        },
        handleAuditShow() {
            // 显示弹框
            this.repairAuditShow = true;
        },

        handleAuditClose() {
            // 关闭弹框
            this.repairAuditShow = false;
            Object.assign(this.auditForm, this.$options.data().auditForm);
        },
        handleAuditSubmit() {
            // 审核提交
            let form = Core.Util.deepCopy(this.auditForm);
            if (form.audit_result === '') {
                return this.$message.warning(this.$t('r.audit_result'));
            }
            /*if (form.audit_result === 0 && !form.audit_message) {
                return this.$message.warning('请输入审核未通过的原因')
            }*/
            this.loading = true;
            Core.Api.Repair.audit({
                ...form,
                compensation_price: this.sum_price,
                id: this.id,
            })
                .then(res => {
                    console.log('handleAuditSubmit res', res);
                    this.handleAuditClose();
                    this.routerChange('back');
                })
                .catch(err => {
                    console.log('handleAuditSubmit err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // 工单 二次维修
        /*        handleSecondRepairShow() {
            this.secondShow = true
            this.secondForm.plan_time = this.detail.plan_time ? dayjs.unix(this.detail.plan_time).format('YYYY-MM-DD HH:mm:ss') : undefined
        },*/
        /*handleSecondRepairSubmit() {
            let form = Core.Util.deepCopy(this.secondForm)
            if (!form.plan_time) {
                return this.$message.warning('请选择预计二次维修时间')
            }
            form.plan_time = dayjs(form.plan_time).unix()
            Core.Api.Repair.secondDoor({
                id: this.detail.id,
                ...form
            }).then(() => {
                this.$message.success('操作成功')
                this.getRepairDetail()
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
                this.secondShow = false
            });
        },*/

        // 转单物流
        handleDeliveryShow() {
            this.deliveryShow = true;
            Object.assign(this.deliveryForm, this.$options.data().deliveryForm);
        },
        handleDeliverySubmit() {
            this.loading = true;
            let form = Core.Util.deepCopy(this.deliveryForm);
            if (!form.company_uid) {
                return this.$message.warning(this.$t('r.logistics_company'));
            }
            if (!form.waybill_uid) {
                return this.$message.warning(this.$t('r.logistics_number'));
            }
            Core.Api.Repair.post({
                id: this.id,
                ...form,
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.operate'));
                    this.getRepairDetail();
                    this.$refs.WaybillInfo.getWaybillDetail();
                })
                .catch(err => {
                    console.log('getRepairDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                    this.deliveryShow = false;
                });
        },
    },
};
</script>

<style lang="less">
#RepairDetail {
    .gray-panel.info {
        .right {
            .fcc();
            font-size: 12px;

            .staff {
                color: rgba(0, 0, 0, 0.85);
                margin-right: 12px;
                font-weight: 500;
            }

            .status {
                .fcc();

                .i_point {
                    margin-right: 6px;
                }
            }
        }
    }

    .panel-content.affirm {
        .title {
            color: #dd5d5d;
            margin-bottom: 24px;

            i.icon {
                margin-right: 12px;
            }
        }

        .fault_select {
            width: 100%;
            padding-left: 12px;
            text-align: center;
            display: flex;
            align-content: flex-start;
            flex-flow: row wrap;

            .ant-checkbox-wrapper {
                width: 25%;
                margin-left: 0;
                margin-bottom: 18px;
                flex: 0 0 20%;
            }
        }
    }

    .steps-container {
        padding: 0 20px;
        margin-bottom: 20px;
    }
}

// 英文的时候的样式
.en_key {
    width: auto !important;
    margin-right: 10px;
}
.popovers {
    margin-left: 10px;
    display: inline-block;
    width: 15px;
    height: 15px;
    line-height: 15px;
    text-align: center;
    border-radius: 50%;
    border: 1px solid #919191;
    color: #919191;
}

// // 动画效果
// .v-enter-active{
//     animation: slidein 0.2s linear;
// }
// .v-leave-active{
//     animation: slidein 0.2s linear reverse;
// }
// @keyframes slidein {
//     from{
//         transform: translateY(-50%);
//     }
//     to{
//         transform: translateY(0px);
//     }
// }
</style>
