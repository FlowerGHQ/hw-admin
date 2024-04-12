<template>
    <div id="ManufactureDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">生产订单详情</div>
            <div class="btns-area">
                <a-button type="primary" ghost @click="handleAdd(id)">生产整车码</a-button>
                <a-button type="primary" ghost @click="routerChange('picking')"
                    ><i class="icon i_goods" />领料</a-button
                >
                <a-button type="danger" ghost @click="handleCancel(id)"><i class="icon i_close_c" />取消</a-button>
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content desc-container">
                <div class="desc-title">
                    <div class="title-area">
                        <span class="title">{{ detail.name }}</span>
                        <a-tag :color="$Util.productionStatusFilter(detail.status, 'color')">
                            {{ $Util.productionStatusFilter(detail.status) }}
                        </a-tag>
                    </div>
                </div>
                <a-row class="desc-detail">
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">生产订单号：</span>
                        <span class="value">{{ detail.uid }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">生产产品：</span>
                        <span class="value">
                            <a-button type="link" @click="routerChange('item')">{{ item.name }}</a-button>
                        </span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">生产数量：</span>
                        <span class="value">{{ detail.amount }} 件</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">BOM表：</span>
                        <span class="value">
                            <a-button type="link" @click="routerChange('bom')">{{ detail.bom_name }}</a-button>
                        </span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">领料仓库：</span>
                        <span class="value">
                            <a-button type="link" @click="routerChange('warehouse')">{{
                                detail.warehouse_name
                            }}</a-button>
                        </span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">订单备注：</span>
                        <span class="value">
                            <a-tooltip :title="detail.remark" placement="topLeft">
                                {{ detail.remark || '-' }}
                            </a-tooltip>
                        </span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">创建人：</span>
                        <span class="value">{{ detail.apply_user_name || '-' }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">创建时间：</span>
                        <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                    </a-col>
                </a-row>
            </div>
        </div>
        <div class="tabs-container">
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="ProductionItem" tab="已生产产品">
                    <ProductionItem
                        :id="id"
                        :uid="detail.uid"
                        :detail="detail"
                        @submit="getOrderDetail"
                        v-if="activeKey === 'ProductionItem'"
                    />
                </a-tab-pane>
                <!-- <a-tab-pane key="MaterialList" tab="材料总览">
                    <MaterialList />
                </a-tab-pane> -->
            </a-tabs>
        </div>
        <!--        <template class="modal-container">
            <a-modal v-model:visible="materialShow" title="一键领料" :after-close='handleModalClose'>
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">仓库:</div>
                        <div class="value">
                            <a-select v-model:value="editForm.warehouse_id" placeholder="请选择仓库" show-search option-filter-prop="children">
                                <a-select-option v-for="item of warehouseList" :key="item.id" :value="item.id">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="materialShow = false">取消</a-button>
                    <a-button @click="handleModalSubmit" type="primary" >确定</a-button>
                </template>
            </a-modal>
        </template>-->
        <template class="modal-container">
            <a-modal v-model:visible="addVehicleShow" title="生成整车编码" :after-close="handleVehicleClose">
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">数量:</div>
                        <div class="value">
                            <a-input-number v-model:value="form.amount" :min="0" :precision="0" placeholder="0" />
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="handleVehicleClose">取消</a-button>
                    <a-button @click="handleVehicleSubmit" type="primary">确定</a-button>
                </template>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';
import ProductionItem from './components/ProductionItem.vue';
import MaterialList from './components/MaterialList.vue';

const STOCK_RECORD = Core.Const.STOCK_RECORD;

export default {
    name: 'ManufactureDetail',
    components: {
        ProductionItem,
        MaterialList,
    },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            // 详情
            id: '',
            detail: {}, // 生产单详情
            item: {}, // 商品详情
            bom: {}, // BOM表详情
            warehouse: {}, // 仓库详情
            addVehicleShow: false,
            form: {
                id: 0,
                amount: 0,
            },
            //标签页
            activeKey: '',
            // 上传
            upload: {
                action: Core.Const.NET.URL_POINT + '/admin/1/item/import',
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'xlsx',
                },
            },
            warehouseList: [],
            materialShow: false,
            editForm: {
                production_order_id: '',
                warehouse_id: undefined,
            },
        };
    },
    watch: {},
    computed: {},
    created() {
        this.id = Number(this.$route.query.id) || '';
        this.getOrderDetail();
        this.getWarehouseList();
    },
    methods: {
        routerChange(type) {
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/manufacture/manufacture-order-edit',
                        query: { id: this.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'list': // 列表
                    routeUrl = this.$router.resolve({
                        path: '/manufacture/manufacture-order-list',
                        query: { id: this.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'item': // 商品详情
                    routeUrl = this.$router.resolve({
                        path: '/item/item-detail',
                        query: { id: this.detail.item_id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'bom': // BOM表详情
                    routeUrl = this.$router.resolve({
                        path: '/manufacture/bom-detail',
                        query: { id: this.detail.bom_id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'warehouse': // 仓库详情
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/warehouse-detail',
                        query: { id: this.detail.warehouse_id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'picking': // 仓库详情
                    let source = {
                        sourceUid: this.detail.uid,
                        form: {
                            type: STOCK_RECORD.TYPE.OUT,
                            target_type: STOCK_RECORD.COMMODITY_TYPE.MATERIALS,
                            source_id: this.id,
                            source_type: STOCK_RECORD.SOURCE_TYPE.PRODUCTION,
                            warehouse_id: this.detail.warehouse_id,
                        },
                    };
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/invoice-edit',
                        query: {
                            source: JSON.stringify(source),
                        },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getOrderDetail() {
            this.loading = true;
            Core.Api.ProductionOrder.detail({
                id: this.id,
            })
                .then(res => {
                    console.log('getOrderDetail res', res);
                    let d = res.detail || {};
                    this.detail = d;
                    this.item = d.item || {};
                    this.activeKey = 'ProductionItem';
                })
                .catch(err => {
                    console.log('getOrderDetail err', err);
                })
                .finally(() => {
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
                    Core.Api.ProductionOrder.cancel({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.routerChange('list');
                        })
                        .catch(err => {
                            console.log('handleCancel err', err);
                        });
                },
            });
        },
        handleAdd(id) {
            this.form.id = id;
            this.addVehicleShow = true;
        },
        handleVehicleClose() {
            this.addVehicleShow = false;
        },
        handleVehicleSubmit() {
            Core.Api.ProductionOrder.vehicleAdd({
                id: this.form.id,
                amount: this.form.amount,
            })
                .then(() => {
                    this.$message.success('生成完成');
                    this.getOrderDetail();
                    this.handleVehicleClose();
                })
                .catch(err => {
                    console.log('handleSubmit err', err);
                });
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list;
                console.log('getWarehouseList', this.warehouseList);
            });
        },
        /*  handleModalShow() { // 显示弹框
            this.materialShow = true
        },
        handleModalClose() { // 关闭弹框
            this.materialShow = false;
            Object.assign(this.editForm, this.$options.data().editForm)
        },*/
        handleSubmit() {
            let _this = this;
            this.$confirm({
                title: '确定要一键领料吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Invoice.generateMaterialRequisition({
                        source_id: _this.id,
                    })
                        .then(() => {
                            this.$message.success('领料完成');
                            this.getOrderDetail();
                        })
                        .catch(err => {
                            console.log('handleSubmit err', err);
                        });
                },
            });
        },
    },
};
</script>

<style lang="less">
#ManufactureDetail {
    .file-upload-btn {
        margin-right: 10px;
    }
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
