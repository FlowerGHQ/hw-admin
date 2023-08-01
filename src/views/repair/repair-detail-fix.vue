<template>
    <div id="RepairDetail" class="edit-container">
        <!-- 标题 -->
        <div class="title-container">
            <div class="title-area fl-js">{{ $t('r.repair_detail') }}</div>
            <div class="repair-order-sn">
                {{ $t(/*工单编号*/'r.repair_sn') }}：{{ detail.sn || '-' }}
            </div>
        </div>
        <div class="step-container">
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
                        <div class="step-tab">
                            通过
                        </div>
                    </template>
                </a-step>
                <a-step title="Waiting" description="This is a description." />
            </a-steps>
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
            stepList: [
                {
                    title_zh: '提交工单',
                    title_en: 'Submit',
                    create_time: 1681998089,
                    type: 1,
                },
                {
                    title_zh: '审核',
                    title_en: 'Review',
                    create_time: 1681998089,
                    type: 2,
                    status: 100                
                },
                {
                    title_zh: '处理结果',
                    title_en: 'Processing Result',
                    target_type: 1,
                    type: 3,
                },
                {
                    title_zh: '完成',
                    title_en: 'Finish',
                    create_time: 1681998089,
                    type: 4,
                },
            ],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: 'r.fault_name', dataIndex: 'item_fault_id' },
                { title: 'r.material', dataIndex: ['item', 'name'], key: 'item' },
                { title: 'i.amount', dataIndex: 'amount' },
                { title: 'i.unit_price', dataIndex: 'price' },
                { title: 'i.total_price', dataIndex: 'sum_price' },
            ]
            return tableColumns
        },
        lang() {
            return this.$store.state.lang
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
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding: 0 300px;
    }
    .step-tab {
        display: flex;
        width: 64px;
        height: 22px;
        padding: 1px 8px;
        justify-content: center;
        align-items: center;
        border-radius: 2px;
        background: rgba(68, 203, 124, 0.10);
    }
}
</style>
    