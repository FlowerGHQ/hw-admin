<template>
<div id="RepairInvoice" class='list-container'>
    <div class="content">
        <div class="title-content">
            <div class="title">结算清单 Invoice</div>
            <p>结算编号</p>
            <span>{{detrail.uid}}</span>
            <p>交易日期</p>
            <span>{{$Util.timeFormat(detrail.create_time)}}</span>
        </div>
        <div class="info-content">
            <div class="info-block">
                <div class="title">托修方</div>
                <p>车主姓名：{{赵启平}}</p>
                <p>车牌号码：{{赵启平}}</p>
                <p>产品型号：{{赵启平}}</p>
                <p>送修日期：{{赵启平}}</p>
                <p>送修里程：{{赵启平}}</p>
                <div class="title">联系电话</div>
                <p>11{{联系电话}}</p>
            </div>
            <div class="info-block">
                <div class="title">维修门店</div>
                <p>11{{维修门店}}</p>
                <div class="title">联系电话</div>
                <p>11{{联系电话}}</p>
            </div>
            <div class="info-block">
                <div class="title">送修方</div>
                <p>送修人:{{送修人}}</p>
                <p>送修类别:{{送修类别}}</p>
                <div class="title">联系电话</div>
                <p>11{{联系电话}}</p>
            </div>
        </div>
        <div class="item-content">
            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                :row-key="record => record.id"  :pagination='false' @change="handleTableChange">
                <template #bodyCell="{ column, text , record }">
                    <template v-if="column.dataIndex === 'sn'">
                        <a-tooltip placement="top" :title='text'>
                            <a-button type="link" @click="routerChange('detail', record)">{{text}}</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.dataIndex === 'type'">
                        <div class="status status-bg status-tag" :class="$Util.UserTypeFilter(text,'color')">
                            {{$Util.UserTypeFilter(text)}}
                        </div>
                    </template>
                    <template v-if="column.key === 'item'">
                        {{ text || '-'}}
                    </template>
                    <template v-if="column.key === 'tip_item'">
                        <a-tooltip placement="top" :title='text'>
                            <div class="ell" style="max-width: 160px">{{text || '-'}}</div>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                </template>
            </a-table>
            <div class="count">
                <p>总金额<i>¥{{111}}</i></p>
            </div>
        </div>
    </div>
    <div class="btn-area">
        <a-button type="primary" @click="handleExport">保存并下载</a-button>
        <a-button type="primary" @click="routerChange('back')" ghost>返回详情</a-button>
    </div>
</div>
</template>
<script>
import Core from '../../core';
export default {
    name: 'UserList',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            id: '',
            detail: {},

            tableData: [],
            tableColumns: [
                { title: '维修材料', dataIndex: ['account', 'name'], key: 'item' },
                { title: '单位', dataIndex: ['account', 'username'], key: 'item' },
                { title: '数量', dataIndex: ['account', 'phone'] },
                { title: '单价', dataIndex: ['account', 'email'] },
                { title: '金额（元）', dataIndex: 'type' },
            ]
        }
    },
    watch: {},
    computed: {},
    mounted() {
        this.getRepairDetail();
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            switch (type) {
                case 'back':  // 编辑
                    this.$router.go(-1)
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
                console.log("getTableData res", res)
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        // 打印
        handleExport() {
        }
    }
};
</script>

<style lang="less" scoped>
#RepairInvoice {
    padding: 20px 184px 0 126px;
    box-sizing: border-box;
    .content {
        border-radius: 1px;
        border: 1px solid #E6EAEE;
        .title-contents {
            background: #F8FAFC;
        }
        .info-content {
            // text-align: center;
            // width: 890px;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            padding-bottom: 20px;
            // padding-left: 60px;
            .info-block {
                flex: 1;
            }
        }
        .item-content {
            border-radius: 1px;
            opacity: 1;
            border: 1px solid #E6EAEE;
        }
        .count {
            margin-top: 20px;
            float: right;
            width: 368px;
            height: 2px;
            background: #000022;
            opacity: 0.9;
            p {
                padding-top: 20px;
                font-size: 12px;
                font-weight: 500;
                color: #000022;
                line-height: 14px;
                i {
                    font-size: 12px;
                    font-weight: 500;
                    color: #000022;
                    line-height: 14px;
                }
            }
        }
    }
    .bottom {
        margin-top: 60px;
        margin-bottom: 20px;
    }
}
</style>
