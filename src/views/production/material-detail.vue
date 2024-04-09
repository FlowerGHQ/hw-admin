<template>
    <div id="MaterialDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('m.material_detail') }}</div>
            <div class="btns-area">
                <a-button type="primary" ghost @click="routerChange('edit')"
                    ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                >
                <a-button type="danger" ghost @click="handleDelete(id)"
                    ><i class="icon i_close_c" />{{ $t('def.delete') }}</a-button
                >
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content desc-container">
                <div class="desc-title">
                    <div class="title-area">
                        <img :src="$Util.imageFilter(detail.image, 3)" />
                        <span class="title">{{ lang === 'zh' ? detail.name : detail.name_en }}</span>
                        <span v-if="SOURCE_STOCK_TYPE[detail?.sync_type]?.value == 'ERP'" class="source-erp">
                            {{ SOURCE_STOCK_TYPE[detail?.sync_type]?.value }}
                        </span>
                    </div>
                </div>
                <a-row class="desc-detail">
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('m.material_category') }}：</span>
                        <span class="value">{{ category_name }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('m.material_code') }}：</span>
                        <span class="value">{{ detail.code }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('m.spec') }}：</span>
                        <span class="value">{{ detail.spec }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('m.package') }}：</span>
                        <span class="value">{{ detail.encapsulation }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('m.size') }}：</span>
                        <span class="value">{{ detail.encapsulation_size }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('m.weight') }}：</span>
                        <span class="value">{{ $Util.countFilter(detail.gross_weight) }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('m.unit') }}：</span>
                        <span class="value">{{ detail.unit }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('m.supplier') }}：</span>
                        <template v-for="item of detail.supplier_list">
                            <a-tag>{{ item.short_name }}</a-tag>
                        </template>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('i.synchronization_time') }}：</span>
                        <span class="value">
                            {{ $Util.timeFilter(detail?.sync_time) || '-' }}
                        </span>
                    </a-col>
                </a-row>
            </div>
        </div>
        <div class="tabs-container">
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="StockWarehouseList" :tab="$t('m.inventory')">
                    <StockWarehouseList :targetId="id" v-if="activeKey === 'StockWarehouseList'" />
                </a-tab-pane>
                <a-tab-pane key="MaterialStockRecord" :tab="$t('m.change_record')">
                    <MaterialStockRecord :supplierId="id" :targetId="id" v-if="activeKey === 'MaterialStockRecord'" />
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import StockWarehouseList from './components/StockWarehouseList.vue';
import MaterialStockRecord from './components/MaterialStockRecord.vue';
const ITEM = Core.Const.ITEM;

export default {
    name: 'MaterialDetail',
    components: {
        MaterialStockRecord,
        StockWarehouseList,
    },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            id: '',
            detail: {}, // 详情
            activeKey: '',
            category_name: '',
            SOURCE_STOCK_TYPE: ITEM.SOURCE_STOCK_TYPE, // 来源类型
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0;
        this.getMaterialDetail();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/production/material-edit',
                        query: { id: this.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'list': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/production/material-list',
                        query: { id: this.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        // 获取 物料详情
        getMaterialDetail() {
            this.loading = true;
            Core.Api.Material.detail({ id: this.id })
                .then(res => {
                    console.log('Material.detail res', res);
                    this.detail = res;
                    if (res.category !== null) {
                        this.category_name = res.category.name;
                    }

                    console.log('category_id', res.category_id);
                    this.activeKey = 'StockWarehouseList';
                })
                .finally(() => {
                    this.loading = false;
                });
            console.log('detail', this.detail);
        },
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('m.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.Material.delete({ id })
                        .then(() => {
                            _this.$message.success(this.$t('pop_up.delete_success'));
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
// #MaterialDetail {}

.source-erp {
    display: inline-block;
    width: 36px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    background-color: #ffebea;
    color: #f92e25;
    border-radius: 30px;
    font-size: 12px;
    margin-left: 5px;
}
</style>
