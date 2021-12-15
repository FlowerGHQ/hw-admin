<template>
    <div id="RepairInvoice" class='list-container'>
        <div class="content">
            <div class="top-dis">
                <div class="title">结算清单 Invoice</div>
                <div><p>结算编号</p></div>
                <div><p>11{{结算编号}}</p></div>
                <div><p>交易日期</p></div>
                <div><p>11{{结算编号}}</p></div>
            </div>
            <div class="middle-dis">
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
            <div class="bottom-tab">
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
        <div class="bottom">
            <a-button type="primary" @click="onSubmit">保存并下载</a-button>
            <a-button style="margin-left: 10px">返回详情</a-button>
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
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            create_time: [],
            searchForm: {
                name: '',
                country: undefined,
            },
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: '维修材料', dataIndex: ['account', 'name'], key: 'item' },
                { title: '单位', dataIndex: ['account', 'username'], key: 'item' },
                { title: '数量', dataIndex: ['account', 'phone'] },
                { title: '单价', dataIndex: ['account', 'email'] },
                { title: '金额（元）', dataIndex: 'type' },
            ]
            return columns
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        handleDelete(id){
            let _this = this;
            // console.log("handleDelete id", id)
            this.$confirm({
                title: '确定要删除该员工吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.User.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete -> err", err);
                    })
                },
            });
        },
        routerChange(type, item = {}) {
            console.log(item)
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/user/user-edit",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/user/user-detail",
                        query: { id: item.id }
                    })
                    // window.open(routeUrl.href, '_blank')
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {  // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            Core.Api.Invoice.list({
            }).then(res => {
                console.log("getTableData res", res)
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
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
        .top-dis {
            // width: 890px;
            height: 209px;
            background: #F8FAFC;
            border-radius: 0px 0px 0px 0px;
            opacity: 0.9;
        }
        .middle-dis {
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
        .bottom-tab {
            // width: 890px;
            // height: 900px;
            border-radius: 1px 1px 1px 1px;
            opacity: 1;
            border: 1px solid #E6EAEE;
        }
        .count{
            margin-top: 20px;
            float: right;
            width: 368px;
            height: 2px;
            background: #000022;
            opacity: 0.9;
            p{
                padding-top: 20px;
                font-size: 12px;
                font-family: PingFang SC-Medium, PingFang SC;
                font-weight: 500;
                color: #000022;
                line-height: 14px;
                i {
                    // padding-left: 200px;
                    font-style:normal;
                    font-size: 12px;
                    font-family: PingFang SC-Medium, PingFang SC;
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
.title{
    padding-top: 20px;
    font-size: 12px;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #000022;
    line-height: 14px;
}
p {
    width: 96px;
    height: 17px;
    font-size: 12px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #8090A6;
    line-height: 14px;
}
</style>
