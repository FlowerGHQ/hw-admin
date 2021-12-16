<template>
    <div id="ItemDetail" class='list-container'>
        <div class="content">
            <!-- <div v-for="(item,i) in comRecords" :key="i" class="comRecords">
                <div style="display:inline-block;width:50px;">
                  <img style="width:50px;margin-bottom:40px;" :src="item.avatar" />
                </div>
                <div style="display:inline-block;width:320px;margin-left:10px;">
                  <h3 align="left">11{{item.employees}}</h3>
                  <p align="left">11{{item.record.slice(0,15)}}</p>
                  <el-popover
                    placement="top-start"
                    width="200"
                    trigger="hover">
                    <p align="left">11{{item.record}}</p>
                  </el-popover>
                  <span>{{item.gmtCreate}}</span>
                </div>
            </div> -->
            <div class="top-dis" >
                <div class="title">商品详情</div>
                <div >
                    <div>
                        <img :src="detail.imgs" />
                    </div>
                    <div>
                        <p>商品名:{{detail.name}}</p>
                        <p>{{detail.price}}</p>
                    </div>
                </div>
            </div>
            <div class="middle-dis">
                <div class="info-block">
                    <div class="title">详情信息</div>
                    <p>商品编码：{{detail.code}}</p>
                    <!-- <p>商品货号：{{detail.config}}</p> -->
                    <p>商品分类：{{detail.category_id}}</p>
                    <!-- <p>商品品牌：{{detail.brand}}</p> -->
                </div>
                <div class="info-block">
                    <!-- <p>商品条码：{{detail.name}}</p> -->
                    <!-- <p>生产商：  {{detail.name}}</p> -->
                    <p>上架日期：{{detail.createTime}}</p>
                    <!-- <p>上架员工：{{detail.name}}</p> -->
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
                       <template v-if="column.key === 'item'">
                            {{ text || '-'}}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <a-pagination
                    v-model:current="currPage"
                    :page-size='pageSize'
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => `共${total}条`"
                    :hide-on-single-page='false'
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
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
    name: 'ItemDetail',
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
            id: 0,
            // 搜索
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            create_time: [],
            searchForm: {
                id: '',
                name: '',
            },
            detail:{},
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: '用户名', dataIndex: 'purchaser', key: 'item' },
                { title: '订单编号', dataIndex: 'item_code', key: 'item' },
                // { title: '联系方式', dataIndex: 'charge' },
                { title: '下单时间', dataIndex: 'create_time', key: 'time' },
                // { title: '备注', dataIndex: 'type' },
            ]
            return columns
        },
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        this.getItemDetail();
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
        getItemDetail() {  // 获取 详情 数据
            this.loading = true;
            Core.Api.Item.detail({
                id: this.id
            }).then(res => {
                console.log("getDetailData res", res)
                this.detail = res;
            }).catch(err => {
                console.log('getDetailData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            // this.loading = false;
            Core.Api.Purchase.itemByIdList({
                item_id: this.id,
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res:", res)
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },
    }
};
</script>

<style lang="less" scoped>
#ItemDetail {
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
