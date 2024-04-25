<template>
    <div id="WarehouseDetail" class="list-container">
        <div class="title-container">
            <div class="title-area"></div>
            <div class="btns-area">
                <a-button type="primary" ghost @click="routerChange('edit')"
                    ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                >
                <a-button type="danger" ghost @click="handleDelete(warehouse_id)"
                    ><i class="icon i_delete" />{{ $t('def.delete') }}</a-button
                >
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content desc-container">
                <div class="desc-title">
                    <div class="title-area">
                        <span class="title">{{ detail.name }}</span>
                    </div>
                </div>
                <a-row class="desc-detail">
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.type') }}：</span>
                        <span class="value">{{ $Util.warehouseTypeFilter(detail.type, $i18n.locale) }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.contact') }}：</span>
                        <span class="value">{{ detail.contact_name }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.phone') }}：</span>
                        <span class="value">{{ detail.contact_phone }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.time') }}：</span>
                        <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('wa.address') }}：</span>
                        <span class="value">{{ $Util.addressFilter(detail, $i18n.locale) }}</span>
                    </a-col>
                </a-row>
            </div>
        </div>
        <div class="tabs-container">
            <a-tabs v-model:activeKey="activeKey">
                <!-- 库存产品(成品仓) -->
                <a-tab-pane key="ItemStockList" :tab="$t('wa.goods')" v-if="detail.type == WAREHOUSE_TYPE.QUALITY">
                    <StockList
                        v-if="activeKey === 'ItemStockList'"
                        type="item"
                        :warehouseId="warehouse_id"
                        :detail="detail"
                        @submit="getWarehouseDetail"
                    />
                </a-tab-pane>

                <!-- 库存物料 -->
                <a-tab-pane
                    key="MaterialStockList"
                    :tab="$t('wa.stock_material')"
                    v-if="detail.type == WAREHOUSE_TYPE.MATERIAL"
                >
                    <StockList
                        v-if="activeKey === 'MaterialStockList'"
                        type="material"
                        :warehouseId="warehouse_id"
                        :detail="detail"
                        @submit="getWarehouseDetail"
                    />
                </a-tab-pane>

                <!-- 库存广宣品 -->
                <a-tab-pane
                    v-if="$auth('ADMIN') && detail.type == WAREHOUSE_TYPE.CUSTOMIZE"
                    key="CustomizeStockList"
                    :tab="$t('wa.stock_customize')"
                >
                    <StockList
                        v-if="activeKey === 'CustomizeStockList'"
                        type="customize"
                        :warehouseId="warehouse_id"
                        :detail="detail"
                        @submit="getWarehouseDetail"
                    />
                </a-tab-pane>

                <!-- 故障件列表 -->
                <a-tab-pane
                    key="ImperfectList"
                    :tab="$t('wa.faulty_part')"
                    v-if="detail.type == WAREHOUSE_TYPE.DEFECTIVE"
                >
                    <ImperfectList
                        v-if="activeKey === 'ImperfectList'"
                        :warehouseId="warehouse_id"
                        :detail="detail"
                        @submit="getWarehouseDetail"
                    />
                </a-tab-pane>

                <!-- 出入库记录(残次仓不显示) -->
                <a-tab-pane key="StockRecord" :tab="$t('wa.records')" v-if="detail.type !== WAREHOUSE_TYPE.DEFECTIVE">
                    <StockRecord v-if="activeKey === 'StockRecord'" :warehouseId="warehouse_id" :detail="detail" />
                </a-tab-pane>
                <!-- 库位管理(全部仓库都看得见) -->
                <a-tab-pane key="WarehouseLocation" :tab="$t('wa.location')">
                    <WarehouseLocation
                        v-if="activeKey === 'WarehouseLocation'"
                        :warehouseId="warehouse_id"
                        :detail="detail"
                        @submit="getWarehouseDetail"
                    />
                </a-tab-pane>
                <!-- 库位对应物料(全部仓库都看得见) -->
                <a-tab-pane key="WarehouseLocationStock" :tab="$t('wa.location_stock')">
                    <WarehouseLocationStock
                        v-if="activeKey === 'WarehouseLocationStock'"
                        :warehouseId="warehouse_id"
                        :detail="detail"
                        @submit="getWarehouseDetail"
                    />
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import Core from '../../core';

import StockList from './components/StockList.vue';
import StockRecord from './components/StockRecord.vue';
import ImperfectList from './components/ImperfectList.vue';
import WarehouseLocation from './components/WarehouseLocation.vue';
import WarehouseLocationStock from './components/WarehouseLocationStock.vue';

const WAREHOUSE_TYPE = Core.Const.WAREHOUSE.TYPE;

export default {
    name: 'WarehouseDetail',
    components: { StockList, StockRecord, ImperfectList, WarehouseLocation, WarehouseLocationStock },
    props: {},
    data() {
        return {
            WAREHOUSE_TYPE,
            // 加载
            loading: false,
            // 详情
            detail: {},
            warehouse_id: '',
            //标签页
            activeKey: '',

            modalShow: false,
        };
    },
    watch: {},
    computed: {},
    created() {
        this.warehouse_id = Number(this.$route.query.id) || '';
        this.getWarehouseDetail();
    },
    methods: {
        routerChange(type) {
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/warehouse-edit',
                        query: { id: this.warehouse_id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'list': // 列表
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/warehouse-list',
                        query: { id: this.warehouse_id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getWarehouseDetail() {
            this.loading = true;
            Core.Api.Warehouse.detail({
                id: this.warehouse_id,
            })
                .then(res => {
                    console.log('getWarehouseDetail res', res);
                    this.detail = res.detail;
                    let type = this.detail.type;
                    console.log('type', type);
                    switch (type) {
                        case 1:
                            this.activeKey = 'ItemStockList';
                            break;
                        case 2:
                            this.activeKey = 'ImperfectList';
                            break;
                        case 3:
                            this.activeKey = 'MaterialStockList';
                            break;
                        case 4:
                            this.activeKey = 'CustomizeStockList';
                            break;
                    }
                    console.log('this.activeKey', this.activeKey);
                })
                .catch(err => {
                    console.log('getWarehouseDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Warehouse.delete({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.routerChange('list');
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
    },
};
</script>

<style lang="less" scoped>
// #WarehouseDetail {}
</style>
