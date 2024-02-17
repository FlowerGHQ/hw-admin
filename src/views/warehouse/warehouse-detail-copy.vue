<template>
    <div>
        <!-- top -->
        <div id="WarehouseDetail" class="list-container">
            <!-- 标题 -->
            <div class="title-container">
                <div class="title-area">{{ $t('wa.detail') }}</div>
                <div class="btns-area">
                    <!-- <a-button type="primary" ghost  v-if="$auth('warehouse.save')"><i class="icon i_edit"/>编辑</a-button> -->
                    <!-- <a-button type="danger" ghost  v-if="$auth('warehouse.delete')"><i class="icon i_delete"/>删除</a-button> -->
                </div>
            </div>
            <!-- 仓库详情 -->
            <div class="gray-panel">
                <div class="panel-content desc-container">
                    <div class="desc-title">
                        <div class="title-area">
                            <span class="title">仓库名称</span>
                        </div>
                    </div>
                    <a-row class="desc-detail">
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span class="key">{{ $t('n.type') }}：</span>
                            <span class="value">{{
                                $Util.warehouseTypeFilter(warehoseDetail.type, $i18n.locale) || '-'
                            }}</span>
                        </a-col>
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span class="key">{{ $t('n.contact') }}：</span>
                            <span class="value">{{ warehoseDetail.contact_name || '-' }}</span>
                        </a-col>
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span class="key">{{ $t('n.phone') }}：</span>
                            <span class="value">{{ warehoseDetail.contact_phone || '-' }}</span>
                        </a-col>
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span class="key">{{ $t('n.time') }}：</span>
                            <span class="value">{{ $Util.timeFilter(warehoseDetail.create_time) || '-' }}</span>
                        </a-col>
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span class="key">{{ $t('wa.address') }}：</span>
                            <span class="value">{{ $Util.addressFilter(warehoseDetail, $i18n.locale) || '-' }}</span>
                        </a-col>
                    </a-row>
                </div>
            </div>
            <!-- 库存告警，呆滞物料 -->
            <div class="warwhouse-tabs1">
                <eosTabs v-model:activeKey="activeKey1" :tabsList="tabsList1">
                    <div v-if="activeKey1 == 1">1</div>
                    <div v-else="activeKey1 == 2">
                        <a-row>
                            <a-col :xs="12" :sm="12" :lg="12">
                                <!-- 呆滞物料折线图 -->
                                <div class="unit">时长</div>
                                <SluggishMaterialTrend />
                            </a-col>
                            <a-col :xs="12" :sm="12" :lg="12">
                                <div class="unit">数量</div>
                                <SluggishMaterialRank />
                            </a-col>
                        </a-row>
                    </div>
                </eosTabs>
            </div>
        </div>
        <!-- bottom -->
        <div class="list-container" style="margin-top: 10px">
            <div class="title-container" style="border-bottom: 1px solid #eff2f4; border-radius: 0px">
                <div class="title-area" style="font-size: 14px">
                    <eosTabs v-model:activeKey="activeKey2" :tabsList="tabsList2"> </eosTabs>
                </div>
                <div class="btns-area">
                    <div style="display: inline-flex">
                        <a-select>
                            <a-select-option value="jack">Jack</a-select-option>
                            <a-select-option value="lucy">Lucy</a-select-option>
                            <a-select-option value="disabled">Disabled</a-select-option>
                            <a-select-option value="Yiminghe">yiminghe</a-select-option>
                        </a-select>
                        <a-input placeholder="请输入" />
                        <a-input-search style="margin-left: 15px" placeholder="请输入库位号" />
                    </div>
                </div>
            </div>
            <!-- 对应上面组件 eosTabs -->
            <div class="warwhouse-tabs2">
                <!-- 库存产品 -->
                <template v-if="activeKey2 == 'ItemStockList'">1</template>
                <!-- 库存管理 -->
                <template v-else-if="activeKey2 == 'WarehouseLocation'">
                    <inventoryManage />
                </template>
                <!-- 出入库记录 -->
                <template v-else-if="activeKey2 == 'StockRecord'">
                    <StockRecord :warehouseId="route.query.id" :detail="warehoseDetail" />
                </template>

                <template v-else-if="activeKey2 == 'operation_record'">4</template>

                <!-- 库位对应物料 -->
                <template v-else-if="activeKey2 == 'location_stock'">
                    <WarehouseLocationStock :warehouseId="route.query.id" :detail="warehoseDetail" />
                </template>

                <!-- 库存物料 -->
                <template v-else="activeKey2 == 'MaterialStockList'">
                    <StockList type="material" :warehouseId="route.query.id" :detail="warehoseDetail" />
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import Core from '@/core';
import eosTabs from '@/components/common/eos-tabs.vue';
import { inventoryManage, StockRecord, SluggishMaterialTrend, SluggishMaterialRank } from './components/index';
import WarehouseLocationStock from './components/WarehouseLocationStock.vue';
import StockList from './components/StockList.vue';

const route = useRoute();
const { proxy } = getCurrentInstance();

const activeKey1 = ref(1); // top
const tabsList1 = computed(() => [
    { key: 1, value: `${proxy.$t('wa.inventory_alarm')}` }, // 库存告警
    { key: 2, value: `${proxy.$t('wa.inert_material')}` }, // 呆滞物料
]);
const activeKey2 = ref('WarehouseLocation'); // bottom
const tabsList2 = computed(() => {
    let arr = [
        { weight: 1, key: 'ItemStockList', value: `${proxy.$t('wa.stock')}` }, // 库存产品
        { weight: 2, key: 'WarehouseLocation', value: `${proxy.$t('wa.location')}` }, // 库存管理
        { weight: 4, key: 'operation_record', value: `${proxy.$t('wa.operation_record')}` }, // 操作记录
        { weight: 10, key: 'location_stock', value: `${proxy.$t('wa.location_stock')}` }, // 库位对应物料
    ];

    // 出入库记录(残次仓不显示)
    if (warehoseDetail.value.type !== WAREHOUSE_TYPE.DEFECTIVE) {
        arr.push({ weight: 3, key: 'StockRecord', value: `${proxy.$t('wa.records')}` }); // 出入库记录
    }
    // 库存物料(物料仓)
    if (warehoseDetail.value.type == WAREHOUSE_TYPE.MATERIAL || true) {
        arr.push({ weight: 3, key: 'MaterialStockList', value: `${proxy.$t('wa.stock_material')}` });
    }

    return arr.sort((a, b) => a.weight - b.weight);
});

const WAREHOUSE_TYPE = Core.Const.WAREHOUSE.TYPE; //仓库类型  1成品仓 2残次仓 3物料仓 4广宣品仓

const warehoseDetail = ref({}); // 改仓库详情

onMounted(() => {
    getWarehouseDetail();
});

/*fetch*/
const getWarehouseDetail = (params = {}) => {
    Core.Api.Warehouse.detail({
        id: Number(route.query.id),
        ...params,
    })
        .then(res => {
            // console.log("详情", res.detail);
            warehoseDetail.value = res.detail;
        })
        .catch(err => {
            console.log('getWarehouseDetail err', err);
        });
};
</script>

<style lang="less" scoped>
#WarehouseDetail {
    .warwhouse-tabs1 {
        padding: 20px 20px;
    }
}

.warwhouse-tabs2 {
    padding: 0px 20px 0px 20px;
}

.unit {
    color: #999999;
    font-size: 12px;
}
</style>
