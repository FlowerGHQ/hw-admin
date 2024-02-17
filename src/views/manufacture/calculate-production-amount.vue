<template>
    <div id="ManufactureEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">成套计算</div>
        </div>
        <div class="form-block">
            <div class="form-title"></div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">BOM表：</div>
                    <div class="value">
                        <a-select v-model:value="form.bom_id" placeholder="请选择BOM表" @change="getBomDetail">
                            <a-select-option v-for="item of bomList" :key="item.id" :value="item.id">{{
                                item.name
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item afs" v-if="!$Util.isEmptyObj(selectItem)">
                    <div class="key">生产产品：</div>
                    <div class="value">
                        <div class="item-select-display">
                            <img :src="$Util.imageFilter(selectItem.logo)" />
                            <a-tooltip :title="selectItem.name" placement="right">
                                <a-button type="link" @click="routerChange('item', selectItem)">{{
                                    selectItem.name
                                }}</a-button>
                            </a-tooltip>
                            <span>编码：{{ selectItem.code || '-' }}</span>
                            <span>品号：{{ selectItem.model || '-' }}</span>
                        </div>
                    </div>
                </div>

                <div class="form-item required">
                    <div class="key">领料仓库：</div>
                    <div class="value">
                        <a-select
                            v-model:value="form.warehouse_ids"
                            placeholder="请选择领料仓库"
                            mode="multiple"
                            @change="handleSubmit"
                        >
                            <a-select-option v-for="item of warehouseList" :key="item.id" :value="item.id">{{
                                item.name
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">可生产数量：</div>
                    <div class="value">
                        <span class="unit">{{ form.amount }}件</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns"></div>
    </div>
</template>

<script>
import Core from '../../core';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';

export default {
    name: 'ManufactureEdit',
    components: {
        ItemSelect,
    },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            detail: {},
            form: {
                item_id: '',
                bom_id: undefined,
                amount: '',
                warehouse_ids: undefined,
            },
            warehouseList: [],
            bomList: [],

            selectBom: {},
            selectItem: {},
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.form.id = Number(this.$route.query.id) || 0;
        if (this.form.id) {
            this.getOrderDetail();
        }
        this.getBomList();
        this.getWarehouseList();
    },
    methods: {
        routerChange(type, item) {
            let routeUrl = '';
            switch (type) {
                case 'back':
                    this.$router.go(-1);
                    break;
                case 'item':
                    routeUrl = this.$router.resolve({
                        path: '/item/item-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
        getOrderDetail() {
            this.loading = true;
            Core.Api.ProductionOrder.detail({
                id: this.form.id,
            })
                .then(res => {
                    console.log('getOrderDetail res', res);
                    this.detail = res.detail;
                    for (const key in this.form) {
                        this.form[key] = res.detail[key];
                    }
                    if (this.form.bom_id) {
                        this.getBomDetail();
                    }
                })
                .catch(err => {
                    console.log('getOrderDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getBomList() {
            Core.Api.Bom.listAll({
                type: 1, // 1.生产，2.售后
            }).then(res => {
                console.log('getBomList res:', res);
                this.bomList = res.list;
            });
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list;
            });
        },
        getBomDetail() {
            Core.Api.Bom.detail({
                id: this.form.bom_id,
            }).then(res => {
                console.log('getBomDetail res:', res);
                let d = res.detail || {};
                this.selectBom = d;
                this.selectItem = d.item;
            });
            this.handleSubmit();
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form);

            if (!form.bom_id) {
                return;
            }

            if (!form.warehouse_ids) {
                return;
            }
            Core.Api.ProductionOrder.calculateAmount(form)
                .then(res => {
                    this.form.amount = res.production_amount;
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
    },
};
</script>

<style lang="less">
#ManufactureEdit {
    .unit {
        font-size: 12px;
        margin-left: 5px;
        color: #8090a6;
    }
    .item-select-display {
        display: flex;
        position: relative;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        box-sizing: border-box;
        padding-left: 72px;
        > img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            position: absolute;
            left: 0;
        }
        .ant-btn {
            font-size: 14px;
            line-height: 16px;
            height: 16px;
            margin-bottom: 12px;
        }
        > span {
            font-size: 12px;
            line-height: 16px;
            color: #8090a6;
        }
    }
}
</style>
