<template>
    <div id='ManufactureDetail' class='list-container'>
        <div class='title-container'>
            <div class='title-area'>生产订单详情</div>
            <div class="btns-area">
                <a-button type="primary" ghost @click="routerChange('edit', record)"><i class="icon i_edit"/>编辑</a-button>
                <a-button type="primary" ghost @click="handleCancel(id)"><i class="icon i_delete"/>删除</a-button>
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content desc-container">
                <div class="desc-title">
                    <div class="title-area">
                        <span class="title">{{ detail.item.name }}</span>
<!--                        <span class="status-title">{{ detail.status }}</span>-->
                    </div>
                </div>
                <a-row class="desc-detail has-logo">
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">生产订单号：</span>
                        <span class="value">{{ detail.uid }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">创建时间：</span>
                        <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">仓库地址：</span>
                        <span class="value">{{ $Util.addressFilter(detail) }}</span>
                    </a-col>
                </a-row>
            </div>
        </div>
<!--        <div class="tabs-container">
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="StockList" tab="库存数量">
                    <StockList :warehouseId="warehouse_id" :detail="detail" @submit="getWarehouseDetail"/>
                </a-tab-pane>
                <a-tab-pane key="StockRecord" tab="出入库记录">
                    <StockRecord :warehouseId="warehouse_id" :detail="detail" @submit="getWarehouseDetail"
                                 v-if="activeKey === 'StockRecord'"/>
                </a-tab-pane>
                <a-tab-pane key="StockModify" tab="库存变更明细" v-if="detail.type === typeMap.DEFECTIVE">
                    <StockModify :warehouseId="warehouse_id" :detail="detail" @submit="getWarehouseDetail"/>
                </a-tab-pane>
            </a-tabs>
        </div>-->
    </div>
</template>

<script>
import Core from '../../core';


export default {
    name: 'ManufactureDetail',
    components: {},
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            //标签页
            id: '',
            detail: {},
            activeKey: ['affirm'],
        }
    },
    watch: {},
    computed: {},
    created() {
        this.id = Number(this.$route.query.id) || '';
        this.getManufactureDetail();
    },
    methods: {
        routerChange(type) {
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/production/manufacture-order-edit',
                        query: {id: this.id},
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'list': // 列表
                    routeUrl = this.$router.resolve({
                        path: '/production/manufacture-order-list',
                        query: {id: this.id},
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getManufactureDetail() {
            this.loading = true;
            Core.Api.ProductionOrder.detail({
                id: this.id,
            }).then((res) => {
                console.log('getManufactureDetail res', res);
                this.detail = res.detail;
            }).catch((err) => {
                console.log('getManufactureDetail err', err);
            }).finally(() => {
                this.loading = false;
            });
        },
        handleCancel(id) {
            let _this = this;
            this.$confirm({
                title: '确定要取消该生产单吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.ProductionOrder.cancel({id})
                        .then(() => {
                            _this.$message.success('删除成功');
                            _this.routerChange('list');
                        })
                        .catch((err) => {
                            console.log('handleCancel err', err);
                        });
                },
            });
        },
    },
};
</script>

<style lang='less'>
 #ManufactureDetail {
     .desc-title {
         .title-area {
             .title {
                 margin-right: 20px;
             }
             .status-title {
                font-size: 14px;
             }
         }
     }
 }
</style>