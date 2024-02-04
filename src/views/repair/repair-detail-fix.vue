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
                            <!-- 创建时间 -->
                            <div class="step-time">
                                {{ $Util.timeFilter(detail?.create_time || '') }}
                            </div>
                        </template>
                    </a-step>
                    <a-step>
                        <template #title>{{ $t(/*审核*/'p.audit') }}</template>
                        <template #description>
                            <div class="step-tab-wrap" v-if="currStep !== 0">
                                <div class="step-tab" :class="$Util.repairStatusFilter(detail?.status, 'color')">
                                    {{ $Util.repairStatusFilter(detail?.status)[$i18n.locale] }}
                                </div>
                            </div>
                            <!-- 审核时间 -->
                            <div class="step-time" v-if="status === Core.Const.REPAIR.STATUS.AUDIT_SUCCESS">
                                {{ $Util.timeFilter(detail?.audit_time || '') }}
                            </div>
                        </template>
                    </a-step>
                    <a-step>
                        <template #title>{{ $t(/*处理结果*/'r.process_result') }}</template>
                        <template #description>
                            <div class="step-tab-wrap" v-if="currStep !== 0">
                                <div class="step-tab yellow" v-if="detail.compensation_method === 1">
                                    {{ $t(/*赔付配件*/'r.Compensation_accessories') }}
                                </div>
                                <div class="step-tab yellow" v-if="detail.compensation_method === 2">
                                    {{ $t(/*赔付至账户*/'r.Allocated_account') }}
                                </div>
                                <a-button v-if="detail.compensation_method === 1 && (status === Core.Const.REPAIR.STATUS.AUDIT_SUCCESS || status === Core.Const.REPAIR.STATUS.FINISH)" @click="routerChange('order')" type="link"
                                    style="font-size: 14px;">{{ $t(/*查看订单*/'r.view_order') }}</a-button>
                                <a-button v-if="detail.compensation_method === 2 && $auth('DISTRIBUTOR')"
                                    @click="routerChange('wallet')" type="link" style="font-size: 14px;">{{
                                        $t(/*账户钱包*/'d.account_wallet') }}</a-button>
                            </div>
                            <div class="step-time" v-if="currStep !== 0 && $auth('DISTRIBUTOR')">
                                <template v-if="currency === 'eur' || currency === 'EUR'">
                                    {{ $t(/*可用余额*/'r.available_balance') }}：€{{ balance || 0 }}
                                </template>
                                <template v-else>
                                    {{ $t(/*可用余额*/'r.available_balance') }}：${{ balance || 0 }}
                                </template>
                            </div>
                        </template>
                    </a-step>
                    <a-step>
                        <template #title>{{ $t(/*完成*/'in.finish') }}</template>
                        <template #description>
                            <div class="step-time" v-if="currStep !== 0 && detail?.finish_time">
                                {{ $Util.timeFilter(detail?.finish_time || '') }}
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
                        <a-button type="link" v-if="record.item_name && $auth('ADMIN')"
                            @click="routerChange('detail', record)">
                            {{ record.item_name || '-' }}
                        </a-button>
                        <a-button type="link" v-if="record.item_name && $auth('DISTRIBUTOR')"
                            @click="routerChange('itemDetail', record)">
                            {{ record.item_name || '-' }}
                        </a-button>
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
                    {{ $Util.repairNewTypeFilter(detail?.category)[$i18n.locale] || '-' }}
                </div>
            </div>
            <div class="info-form-item">
                <div class="info-key">
                    {{ $t(/*备注*/'r.remark_a') }}：
                </div>
                <div class="info-value">
                    {{ detail?.audit_message || '-' }}
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
                                <a-button type="link" v-if="record.item_name && $auth('ADMIN')"
                                    @click="routerChange('detail', record)">
                                    {{ record.item_name || '-' }}
                                </a-button>
                                <a-button type="link" v-if="record.item_name && $auth('DISTRIBUTOR')"
                                    @click="routerChange('itemDetail', record)">
                                    {{ record.item_name || '-' }}
                                </a-button>
                            </template>
                            <template v-if="column.key === 'price'">
                                <div v-if="currency === 'eur' || currency === 'EUR'">
                                    {{ $Util.countFilter(record?.price) || '-' }}€
                                </div>
                                <div v-else>
                                    {{ $Util.countFilter(record?.price) || '-' }}$
                                </div>
                            </template>
                            <template v-if="column.key === 'total_price'">
                                <div v-if="currency === 'eur' || currency === 'EUR'">
                                    {{ Number($Util.countFilter(record.price)) * record.amount || '-' }}€
                                </div>
                                <div v-else>
                                    {{ Number($Util.countFilter(record.price)) * record.amount || '-' }}$
                                </div>
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
                        <div class="total-amount" v-if="currency === 'eur' || currency === 'EUR'">
                            {{ $t(/*总金额*/'r.total_amount') }}: €{{ $Util.countFilter(item?.total_price) || 0 }}
                        </div>
                        <div class="total-amount" v-else>
                            {{ $t(/*总金额*/'r.total_amount') }}: ${{ $Util.countFilter(item?.total_price) || 0 }}
                        </div>
                        <div class="total-amount" v-if="currency === 'eur' || currency === 'EUR'">
                            {{ $t(/*实付金额*/'r.amount_paid') }}: €{{ $Util.countFilter(item?.total_charge) || 0 }}
                        </div>
                        <div class="total-amount" v-else>
                            {{ $t(/*实付金额*/'r.amount_paid') }}: ${{ $Util.countFilter(item?.total_charge) || 0 }}
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
            <div :class="getPayMethodKeyClass()">
                <div class="submit-btn-group">
                    <template v-if="$auth('ADMIN')">
                        <a-button v-if="canPerformAudit()" @click="handleAuditModalShow" type="primary">{{ $t('p.audit')
                        }}</a-button>
                    </template>
                    <template v-else>
                        <a-button v-if="canPerformCancel()" @click="handleCancelModalShow">{{ $t('def.cancel') }}</a-button>
                        <a-button v-if="canPerformEdit()" @click="handleVoidModalShow" type="primary" danger ghost>{{
                            $t('r.void') }}</a-button>
                        <a-button v-if="canPerformEdit()" @click="handleToEdit" type="primary">{{ $t('n.edit') }}</a-button>
                    </template>
                    <a-button
                        v-if="detail.status === Core.Const.REPAIR.STATUS.FINISH || detail.status === Core.Const.REPAIR.STATUS.AUDIT_SUCCESS"
                        @click="routerChange('invoice')" type="primary">{{ $t('r.bill') }}</a-button>
                </div>
            </div>
        </div>
        <!-- 确认取消工单弹框 -->
        <a-modal v-model:visible="cancelModalShow" :title="$t(/*取消工单*/'r.cancel_repair')">
            <div class="form-title">
                <div class="form-item">
                    {{ $t(/*当前工单取消后，可再次编辑并重新提交工单，也可以选择作废该工单*/'r.cancel_content') }}
                </div>
            </div>
            <template #footer>
                <a-button @click="cancelModalShow = false">{{ $t('def.cancel') }}</a-button>
                <a-button @click="handleCancel" type="primary">{{ $t('def.sure')
                }}</a-button>
            </template>
        </a-modal>
        <!-- 确认作废工单弹框 -->
        <a-modal v-model:visible="voidModalShow" :title="$t(/*取消工单*/'r.cancel_repair')">
            <div class="form-title">
                <div class="form-item">
                    {{ $t(/*当前工单作废后，不可再次编辑*/'r.void_text') }}
                </div>
            </div>
            <template #footer>
                <a-button @click="voidModalShow = false">{{ $t('def.cancel') }}</a-button>
                <a-button @click="handleVoid" type="primary">{{ $t('def.sure')
                }}</a-button>
            </template>
        </a-modal>
        <!-- 平台方审核工单弹框 -->
        <a-modal v-model:visible="auditModalShow" :title="$t(/*审核*/'p.audit')" class="audit-modal" width='800px'
            :after-close='auditModalClose'>
            <div class="audit-modal-title">
                {{ $t(/*工单信息*/'r.repair_info') }}
            </div>
            <div class="audit-modal-head-wrap">
                <div class="head-form-item">
                    <div class="head-key">
                        {{ $t(/*工单类型*/'r.device_classify') }}：
                    </div>
                    <div class="head-value">
                        {{ $Util.repairNewTypeFilter(detail?.category)[$i18n.locale] }}
                    </div>
                </div>
                <div class="head-form-item">
                    <div class="head-key">
                        {{ $t(/*赔付方式*/'r.payment_method') }}：
                    </div>
                    <div class="head-value" v-if="detail.compensation_method === 1">
                        {{ $t(/*赔付配件*/'r.Compensation_accessories') }}
                    </div>
                    <div class="head-value" v-if="detail.compensation_method === 2">
                        {{ $t(/*赔付至账户*/'r.Allocated_account') }}
                    </div>
                </div>
                <div class="head-form-item">
                    <div class="head-key">
                        {{ $t(/*创建时间*/'d.create_time') }}：
                    </div>
                    <div class="head-value">
                        {{ $Util.timeFilter(detail?.create_time || '') }}
                    </div>
                </div>
            </div>
            <div class="audit-modal-title">
                {{ $t(/*零部件更换*/'r.replacement_items') }}
            </div>
            <div class="audit-table">
                <a-table :columns="auditTableColumns" :data-source="auditTableData" :scroll="{ x: true }"
                    :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'type'">
                            {{ $Util.repairLogTypeFilter(record.type)[$i18n.locale] || '-' }}
                        </template>
                        <template v-if="column.key === 'price'">
                            <div v-if="currency === 'eur' || currency === 'EUR'">
                                €{{ $Util.countFilter(record?.price) }}
                            </div>
                            <div v-else>
                                ${{ $Util.countFilter(record?.price) }}
                            </div>
                        </template>
                    </template>
                </a-table>
                <div class="audit-table-footer">
                    <div class="total">
                        {{ $t(/*合计*/'p.total') }}
                    </div>
                    <div class="total-amount">
                        {{ $t(/*总数量*/'i.total_quantity') }}: {{ auditDetail?.total_amount || '-' }}
                    </div>
                    <div class="total-amount" v-if="currency === 'eur' || currency === 'EUR'">
                        {{ $t(/*总金额*/'r.total_amount') }}: €{{ $Util.countFilter(auditDetail?.total_price) || 0 }}
                    </div>
                    <div class="total-amount" v-else>
                        {{ $t(/*总金额*/'r.total_amount') }}: ${{ $Util.countFilter(auditDetail?.total_price) || 0 }}
                    </div>
                    <div class="total-amount" v-if="currency === 'eur' || currency === 'EUR'">
                        {{ $t(/*实付金额*/'r.amount_paid') }}: €{{ $Util.countFilter(auditDetail?.total_charge) || 0 }}
                    </div>
                    <div class="total-amount" v-else>
                        {{ $t(/*实付金额*/'r.amount_paid') }}: ${{ $Util.countFilter(auditDetail?.total_charge) || 0 }}
                    </div>
                </div>
            </div>
            <div class="audit-modal-title">
                {{ $t(/*审核*/'p.audit') }}
            </div>
            <div class="form-item required">
                <div class="key">
                    {{ $t(/*审核结果*/'n.result_a') }}:
                </div>
                <div class="value">
                    <a-radio-group v-model:value="audit_result">
                        <a-radio v-for="item in auditTypeList" :value="item.value">
                            {{ lang === 'zh' ? item.zh : item.en }}
                        </a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="form-item required" v-if="audit_result === 0">
                <div class="key">
                    {{ $t(/*备注*/'r.remark_a') }}:
                </div>
                <div class="value">
                    <a-textarea v-model:value="audit_message" :placeholder="$t(/*请输入*/'n.enter')" allow-clear />
                </div>
            </div>
            <template #footer>
                <a-button @click="auditModalShow = false">{{ $t('def.cancel') }}</a-button>
                <a-button @click="handleAudit" type="primary">{{ $t('def.sure')
                }}</a-button>
            </template>
        </a-modal>
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
            auditTableData: [],
            vehicle_frame_list: [],
            recordTableData: [],
            currStep: 0, // 步骤索引
            cancelModalShow: false,
            voidModalShow: false,
            status: undefined,
            auditModalShow: false,
            auditTypeList: [
                {
                    key: 1,
                    zh: '通过',
                    en: 'Passed',
                    value: 1
                },
                {
                    key: 2,
                    zh: '不通过',
                    en: 'Rejected',
                    value: 0
                }
            ],
            audit_result: 1, // 审核结果
            audit_message: undefined, // 审核不通过备注
            auditDetail: {
                total_amount: 0,
                total_price: 0,
                total_charge: 0
            },
            balance: 0, // 账户余额
            currency: '', // 货币
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
                { title: this.$t('r.fault_types'), dataIndex: 'category_name', key: 'item' }, // 故障类型
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
                { title: this.$t('n.operator'), dataIndex: ['user', 'name'], key: 'item' }, // 操作人
                { title: this.$t('r.operating_time'), dataIndex: 'create_time', key: 'time' }, // 操作时间
            ]
            return columns
        },
        auditTableColumns() {
            let auditTableColumns = [
                { title: this.$t('r.item_name'), dataIndex: 'item_name', key: 'detail' }, // 商品名称
                { title: this.$t('i.code'), dataIndex: 'item_code', key: 'item' }, // 商品编码
                { title: this.$t('i.amount'), dataIndex: 'amount', key: 'item' }, // 数量
                { title: this.$t('i.unit_price'), dataIndex: 'price', key: 'price' }, // 单价
                { title: this.$t('r.fault_types'), dataIndex: 'category_name', key: 'item' }, // 故障类型
            ]
            return auditTableColumns
        },
        // 货币单位
        priceKey() {
            let priceKey = this.$auth('DISTRIBUTOR') ? 'fob_' : 'purchase_price_'
            console.log('priceKey:', priceKey)
            return priceKey
        },
    },
    created() {
        this.id = Number(this.$route.query.id) || 0
        if (!this.id) {
            return 0
        }
        this.getRepairDetail();
        this.getLogList();
        if (this.$auth('DISTRIBUTOR')) {
            this.getBalance();
        }
        this.currency = Core.Data.getCurrency();
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
                    this.$router.push({
                        path: "/repair/repair-edit",
                        query: { id: this.id },
                    })
                    break;
                case 'list':  // 工单列表
                    this.$router.push({
                        path: "/repair/repair-list",
                    })
                    break;
                case 'invoice':  // 查看结算单
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-invoice",
                        query: { id: this.id },
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'itemDetail':  // 分销商商品详情
                    routeUrl = this.$router.resolve({
                        path: "/mall/vehicle-list/detail",
                        query: {
                            id: item.item_id
                        }
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'detail':  // 平台方商品详情
                    console.log('item.item_id', item);
                    routeUrl = this.$router.resolve({
                        path: "/item/item-detail",
                        query: {
                            id: item.item_id
                        }
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'wallet':  // 账户钱包
                    routeUrl = this.$router.resolve({
                        path: "/distributor/distributor-detail-sp",
                        // query: {
                        //     activeKey: 'AccountWallet',   
                        // }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'order':  // 查看采购订单
                    routeUrl = this.$router.resolve({
                        path: "/purchase/purchase-order-detail",
                        query: {
                            id: this.detail.purchase_order_id,
                        }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
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
                        if (item.warranty_status === 3) {
                            // total_charge += item.price
                            item.charge = item.price
                        }
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
                console.log('vehicle_frame_list', this.vehicle_frame_list);
                this.getCurrStep(this.detail.status)
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 获取钱包余额
        getBalance() {
            Core.Api.Repair.getBalance().then(res => {
                console.log('getBalance res', res);
                this.balance = res
            }).catch(err => {
                console.log('getBalance err', err);
            })
        },
        // 获取当前工单进度
        getCurrStep(status) {
            switch (status) {
                case STATUS.WAIT_DETECTION: // 订单创建，等待检测
                    this.currStep = 0;
                    this.status = STATUS.WAIT_DETECTION
                    break;
                case STATUS.WAIT_REPAIR: // 维修中
                    this.currStep = 1;
                    this.status = STATUS.WAIT_REPAIR
                    break;
                case STATUS.REPAIR_END: // 维修完成
                    this.currStep = 1;
                    this.status = STATUS.REPAIR_END
                    break;
                case STATUS.SETTLEMENT: // 已结算，待审核(零售商创建)
                    this.currStep = 1;
                    this.status = STATUS.SETTLEMENT
                    break;
                case STATUS.SETTLEMENT_DISTRIBUTOR: // 已结算，待审核(分销商创建)
                    this.currStep = 1;
                    this.status = STATUS.SETTLEMENT_DISTRIBUTOR
                    break;
                case STATUS.DISTRIBUTOR_AUDIT_SUCCESS: // 分销商审核通过，待平台方审核
                    this.currStep = 1;
                    this.status = STATUS.DISTRIBUTOR_AUDIT_SUCCESS
                    break;
                case STATUS.DISTRIBUTOR_WAREHOUSE: // 分销商故障件入库，待平台方审核故障件
                    this.currStep = 1;
                    this.status = STATUS.DISTRIBUTOR_WAREHOUSE
                    break;
                case STATUS.AUDIT_SUCCESS: // 平台方审核通过
                    this.currStep = 3;
                    this.status = STATUS.AUDIT_SUCCESS
                    break;
                case STATUS.FINISH: // 保外结算直接完成，不需要审核
                    this.currStep = 3;
                    this.status = STATUS.FINISH
                    break;
                case STATUS.AUDIT_FAIL: // 审核未通过
                    this.currStep = 1;
                    this.status = STATUS.AUDIT_FAIL
                    break;
                case STATUS.FAULT_ENTITY_AUDIT_FAIL: // 故障件审核未通过
                    this.currStep = 1;
                    this.status = STATUS.FAULT_ENTITY_AUDIT_FAIL
                    break;
                case STATUS.CLOSE: // 订单取消
                    this.currStep = 1;
                    this.status = STATUS.CLOSE
                    break;
                case STATUS.STATUS_VOIDED: // 已作废 不可再次编辑
                    this.currStep = 1;
                    this.status = STATUS.STATUS_VOIDED
                    break;
                case STATUS.STATUS_TIMEOUT_CLOSE: // 已关闭 审核不通过后超时未处理的工单的状态
                    this.currStep = 1;
                    this.status = STATUS.STATUS_TIMEOUT_CLOSE
                    break;
            }
        },
        // 获取日志列表
        getLogList() {
            Core.Api.ActionLog.list({
                source_type: 20,
                source_id: this.id
            }).then(res => {
                this.recordTableData = res.list
            }).catch(err => {
                console.log('getLogList err', err);
            })
        },
        // 展示取消工单弹框
        handleCancelModalShow() {
            this.cancelModalShow = true
        },
        // 展示作废工单弹框
        handleVoidModalShow() {
            this.voidModalShow = true
        },
        // 展示审核工单弹框 
        handleAuditModalShow() {
            this.auditModalShow = true
            for (const vehicle of this.detail.vehicle_frame_list) {
                for (const item of vehicle.item_list) {
                    this.auditTableData.push(item);
                    this.auditDetail.total_amount += item.amount;
                    this.auditDetail.total_price += item.price;
                    this.auditDetail.total_charge += item.charge;
                }
            }
            console.log('this.auditDetail', this.auditDetail);
        },
        // 取消工单
        handleCancel() {
            Core.Api.Repair.cancel({
                id: this.id
            }).then(res => {
                this.cancelModalShow = false
                console.log('handleCancelRepairOrder res', res);
                this.$message.success(this.$t(/*取消成功*/'pop_up.canceled'))
                this.routerChange('list');
            }).catch(err => {
                console.log('handleCancelRepairOrder err', err);
            })
        },
        // 作废工单
        handleVoid() {
            Core.Api.Repair.void({
                id: this.id
            }).then(res => {
                this.voidModalShow = false
                console.log('handleVoidRepairOrder res', res);
                this.$message.success(this.$t(/*作废成功*/'r.successful_cancellation'))
                this.getRepairDetail();
                this.getLogList();
            }).catch(err => {
                console.log('handleVoidRepairOrder err', err);
            })
        },
        // 审核工单
        handleAudit() {
            if (this.audit_result === 0) {
                if (!this.audit_message) {
                    return this.$message.warning(this.$t('audit.reason'))
                }
            }
            Core.Api.Repair.audit({
                id: this.id,
                audit_message: this.audit_message,
                audit_result: this.audit_result,
                compensation_method: this.detail.compensation_method
            }).then(res => {
                console.log('handleVoidRepairOrder res', res);
                this.auditModalShow = false
                this.$message.success(this.$t(/*提交成功*/'r.submit_successfully'))
                this.getRepairDetail();
                this.getLogList();
            }).catch(err => {
                console.log('handleVoidRepairOrder err', err);
            })
        },
        // 审核弹窗关闭回调
        auditModalClose() {
            this.audit_message = undefined
            this.audit_result = 1
            this.auditTableData = [];
            this.auditDetail.total_amount = 0;
            this.auditDetail.total_price = 0;
            this.auditDetail.total_charge = 0;
        },
        // 编辑
        handleToEdit() {
            this.routerChange('edit', {});
        },
        // fix-container样式判断
        getPayMethodKeyClass() {
            const status = this.detail.status;
            const allowedStatuses = [
                Core.Const.REPAIR.STATUS.CLOSE,
                Core.Const.REPAIR.STATUS.AUDIT_FAIL,
                Core.Const.REPAIR.STATUS.WAIT_DETECTION,
                Core.Const.REPAIR.STATUS.WAIT_REPAIR,
                Core.Const.REPAIR.STATUS.REPAIR_END,
                Core.Const.REPAIR.STATUS.SETTLEMENT,
                Core.Const.REPAIR.STATUS.SETTLEMENT_DISTRIBUTOR,
                Core.Const.REPAIR.STATUS.DISTRIBUTOR_AUDIT_SUCCESS,
                Core.Const.REPAIR.STATUS.AUDIT_FAIL,
                Core.Const.REPAIR.STATUS.FAULT_ENTITY_AUDIT_FAIL,
                Core.Const.REPAIR.STATUS.FINISH,
                Core.Const.REPAIR.STATUS.AUDIT_SUCCESS,
            ];

            return allowedStatuses.includes(status) ? 'pay-method-key left' : 'pay-method-key';
        },
        // 是否展示审核按钮
        canPerformAudit() {
            const status = this.detail.status;
            const allowedStatuses = [
                Core.Const.REPAIR.STATUS.WAIT_DETECTION,
                Core.Const.REPAIR.STATUS.WAIT_REPAIR,
                Core.Const.REPAIR.STATUS.REPAIR_END,
                Core.Const.REPAIR.STATUS.SETTLEMENT,
                Core.Const.REPAIR.STATUS.SETTLEMENT_DISTRIBUTOR,
                Core.Const.REPAIR.STATUS.DISTRIBUTOR_WAREHOUSE,
                Core.Const.REPAIR.STATUS.FAULT_ENTITY_AUDIT,
                Core.Const.REPAIR.STATUS.FAULT_ENTITY_AUDIT_FAIL
            ];

            return allowedStatuses.includes(status);
        },
        // 是否展示编辑 作废按钮
        canPerformEdit() {
            const status = this.detail.status;
            const allowedStatuses = [
                Core.Const.REPAIR.STATUS.AUDIT_FAIL, // 审核未通过
                Core.Const.REPAIR.STATUS.FAULT_ENTITY_AUDIT_FAIL, // 故障件审核未通过
                Core.Const.REPAIR.STATUS.CLOSE, // 订单已取消
            ];

            return allowedStatuses.includes(status);
        },
        // 是否展示取消按钮
        canPerformCancel() {
            const status = this.detail.status;
            const allowedStatuses = [
                Core.Const.REPAIR.STATUS.WAIT_DETECTION,
                Core.Const.REPAIR.STATUS.WAIT_REPAIR,
                Core.Const.REPAIR.STATUS.REPAIR_END,
                Core.Const.REPAIR.STATUS.SETTLEMENT,
                Core.Const.REPAIR.STATUS.SETTLEMENT_DISTRIBUTOR,
                Core.Const.REPAIR.STATUS.DISTRIBUTOR_AUDIT_SUCCESS,
            ];

            return allowedStatuses.includes(status);
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
                display: flex;

                .step-tab {
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
                        // margin-right: 10px;
                    }

                    &.green {
                        color: #44CB7C;
                        background: rgba(68, 203, 124, 0.10);
                    }

                    &.red {
                        background: rgba(245, 34, 45, 0.10);
                        color: #F5222D;
                    }

                    &.gray {
                        background: rgba(134, 144, 156, 0.10);
                        color: #86909C;
                    }

                    &.orange {
                        color: #FF6A3F;
                        background-color: #FFF0EC;
                    }

                    &.blue {
                        color: #4DAAFF;
                        background-color: #EDF6FF;
                    }

                    &.purple {
                        color: #A45DFF;
                        background-color: rgba(241, 230, 255, 0.9);
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
            width: 330px;
            display: flex;
            align-items: center;
            color: #1D2129;
            font-size: 14px;
            font-weight: 400;

            &.left {
                width: 390px;
            }

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
    