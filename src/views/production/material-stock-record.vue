<template>
    <div id="MaterialPutStock" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ $t('i.material_put_stock') }}</div>
        </div>
        <div class="form-block">
            <!-- 基本信息 -->
            <div class="form-title">
                <div class="title"></div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">仓库</div>
                    <div class="value">
                        <a-select
                            v-model:value="warehouse_id"
                            show-search
                            placeholder="请输入仓库"
                            :default-active-first-option="false"
                            :show-arrow="false"
                            :filter-option="false"
                            :not-found-content="null"
                            @search="handleWarehouseSearch"
                            @change="handleWarehouseChange"
                        >
                            <a-select-option v-for="item in warehouseOptions" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">出库单</div>
                    <div class="value">
                        <a-input v-model:value="invoice_uid" @blur="handleWarehouseByMaterialChange" />
                    </div>
                </div>

                <!--                <div class="form-item required">
                    <div class="key">编码</div>
                    <div class="value">
                        <a-select
                            v-model:value="form.id"
                            show-search
                            placeholder="请输入物料编码"
                            :default-active-first-option="false"
                            :show-arrow="false"
                            :filter-option="false"
                            :not-found-content="null"
                            @search="handleSearch"
                            @change="handleChange"
                        >
                            <a-select-option v-for=" item in options" :key="item.id" :value="item.id">{{
                                    item.code
                                }}-{{ item.name }}
                            </a-select-option>

                        </a-select>

                    </div>
                </div>-->
                <div class="form-item required">
                    <div class="key">编码</div>
                    <div class="value">
                        <a-input v-model:value="form.code" @blur="handleSearch" />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">库位号</div>
                    <div class="value">
                        <a-input v-model:value="warehouseLocationopTions" disabled />
                    </div>
                </div>

                <div class="form-item">
                    <div class="key">备注</div>
                    <div class="value">
                        <a-input v-model:value="form.remark" disabled />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">当前库存</div>
                    <div class="value">
                        <a-input v-model:value="form.stock.stock" disabled />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">库存变动时间</div>
                    <div class="value">
                        <a-input v-model:value="form.stock.updateTime" disabled />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">共需入库数量</div>
                    <div class="value">
                        <a-input type="number" v-model:value="form.amount" disabled />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">已入库数量</div>
                    <div class="value">
                        <a-input type="number" v-model:value="form.confirm_amount" disabled />
                    </div>
                </div>
                <div>
                    <div class="form-item">
                        <div class="key">入库最小包装</div>
                        <div class="value">
                            <a-input type="number" v-model:value="form.smallest_packaging" disabled />
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">入库包装数</div>
                        <div class="value">
                            <a-input
                                type="number"
                                v-model:value="form.packaging_amount"
                                @blur="handlePackagingAmount"
                                placeholder="请输入入库包装数"
                            />
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">入库数量</div>
                        <div class="value">
                            <a-input type="number" v-model:value="form.inventory_amount" disabled />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button type="primary" @click="handleSubmit">确定</a-button>
            <a-button type="primary" ghost @click="routerChange('back')">取消</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import CategoryTreeSelect from '../../components/popup-btn/CategoryTreeSelect.vue';

const TARGET_TYPE_MAP = Core.Const.ITEM.TARGET_TYPE_MAP;
const STOCK_RECORD = Core.Const.STOCK_RECORD;

export default {
    name: 'MaterialPutStock',
    components: {
        CategoryTreeSelect,
    },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            warehouse_id: '',
            invoice_id: '',
            invoice_uid: '',
            uid: '',
            form: {
                target_id: '',
                target_type: '',
                name: '',
                code: '',
                category_id: undefined,
                amount: '',
                confirm_amount: '',
                remark: '',
                image: '',
                warehouse_location_id: '',
                flag_entity: '',

                smallest_packaging: '',
                packaging_amount: '',
                inventory_amount: '',
                invoice_id: '',
                uid: '',
                stock: {
                    stock: '',
                    updateTime: '',
                },
            },
            gross_weight: '',
            supplierList: [],
            item_category: {},
            configTemp: [],
            options: [],
            warehouseOptions: [],
            warehouseLocationOptions: [],
            invoiceOptions: [],
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        routerChange(type, item) {
            let routeUrl;
            switch (type) {
                case 'back':
                    this.$router.go(-1);
                    break;
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/item/item-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        handleSearch() {
            this.form.target_id = '';
            this.form.target_type = '';
            this.warehouseLocationOptions = [];
            this.form.warehouse_location_id = '';
            this.form.remark = '';
            this.stock.stock = '';
            this.stock.updateTime = '';
            this.form.amount = '';
            this.form.confirm_amount = '';
            this.form.smallest_packaging = '';
            if (!this.form.code) {
                return;
            }
            let codeName = this.form.code;
            let smallest_packaging = 1;
            if (this.form.code.indexOf('*') > 0) {
                let codes = this.form.code.split('*');
                codeName = codes[0];
                smallest_packaging = codes[1];
            }

            this.form.smallest_packaging = smallest_packaging;
            Core.Api.Item.detailByCode({ code: codeName }).then(res => {
                if (res.detail.type != Core.Const.ITEM.TYPE.COMPONENT) {
                    this.form.target_id = res.detail.id;
                    this.form.target_type = Core.Const.WAREHOUSE_TRANSFER.COMMODITY_TYPE.ITEM;
                    this.form.stock_target_type = Core.Const.STOCK.TARGET_TYPE.ITEM;
                } else {
                    this.form.target_id = res.detail.material.id;
                    this.form.target_type = Core.Const.WAREHOUSE_TRANSFER.COMMODITY_TYPE.MATERIALS;
                    this.form.stock_target_type = Core.Const.STOCK.TARGET_TYPE.MATERIAL;
                }
                // this.form.id = res.detail.id;
                this.form.flag_entity = res.detail.flag_entity;
                this.handleWarehouseChange();
            });
        },
        handleWarehouseLocationSearch() {
            console.log('handleWarehouseLocationSearch');
            if (!this.warehouse_id) {
                console.log(1);
                return;
            }
            if (!this.form.target_id) {
                console.log(1);
                return;
            }
            Core.Api.WarehouseLocationStock.list({
                warehouse_id: this.warehouse_id,
                target_id: this.form.target_id,
                target_type: this.form.stock_target_type,
            }).then(res => {
                this.warehouseLocationOptions = res.list;
            });
            Core.Api.Stock.detail({
                warehouse_id: this.warehouse_id,
                target_id: this.form.target_id,
                target_type: this.form.stock_target_type,
            }).then(res => {
                this.form.stock = res.stock;
                this.form.stock.updateTime = this.$Util.timeFormat(
                    res.stock.updateTime != undefined ? res.stock.updateTime : res.stock.createTime,
                );
            });
        },
        handleWarehouseLocationStockSearch() {
            if (!this.form.warehouse_location_id) {
                console.log(1);
                return;
            }
            if (!this.form.target_id) {
                console.log(1);
                return;
            }
            Core.Api.WarehouseLocationStock.detailByWarehouseId({
                warehouse_location_id: this.form.warehouse_location_id,
                target_id: this.form.target_id,
                target_type: this.form.stock_target_type,
            }).then(res => {
                this.form.stock.stock = res.amount;
                // this.form.stock.updateTime = this.$Util.timeFormat(res.stock.updateTime != undefined ? res.stock.updateTime: res.stock.createTime)
            });
        },

        handleWarehouseSearch(name) {
            Core.Api.Warehouse.list({ name: name }).then(res => {
                this.warehouseOptions = res.list;
            });
        },
        handleWarehouseChange() {
            this.handleWarehouseByMaterialChange();
            this.handleWarehouseLocationSearch();
            this.handleWarehouseLocationStockSearch();
        },
        handleWarehouseByMaterialChange() {
            this.uid = '';

            if (!this.form.target_id) {
                console.log(1);
                return;
            }
            if (!this.warehouse_id) {
                console.log(2);
                return;
            }

            if (!this.invoice_uid) {
                console.log(1);
                return;
            }
            Core.Api.Invoice.detailByItemUid({
                uid: this.invoice_uid,
                target_id: this.form.target_id,
                target_type: this.form.target_type,
                warehouse_id: this.warehouse_id,
            }).then(res => {
                this.form.amount = res.amount;
                this.form.confirm_amount = res.confirm_amount;
                this.invoice_id = res.invoice_id;
            });
        },
        handlePackagingAmount() {
            if (!this.form.smallest_packaging) {
                return;
            }
            this.form.inventory_amount = this.form.smallest_packaging * this.form.packaging_amount;
        },
        // handleInvoiceSearch(name) {
        //     Core.Api.Invoice.list({uid: name}).then(res => {
        //         this.invoiceOptions = res.list
        //     })
        // },
        // 获取物料详情
        // getItemDetail() {
        //     this.loading = true;
        //     Core.Api.Item.detail({
        //         id: this.form.id,
        //     }).then(res => {
        //         console.log('Material.detail res', res)
        //         // this.form = res
        //         this.form.code = res.code
        //         this.form.name = res.name
        //         // this.handleWarehouseLocationSearch()
        //         // this.handleWarehouseByMaterialChange()
        //
        //     }).finally(() => {
        //         this.loading = false
        //     })
        // },
        /*  handleSearch(code) {
              let codes = code.split('*')
              console.log(codes[1])
              this.form.smallest_packaging = codes[1]
              Core.Api.Item.list({code: codes[0]}).then(res => {
                  this.options = res.list
              })
          },*/

        // handleChange() {
        //     this.id = this.form.id
        //     this.getItemDetail();
        // },

        handleSubmit() {
            if (!this.form.amount) {
                return this.$message.warning(this.$t('def.enter'));
            }
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_audit'),
                okText: _this.$t('def.sure'),
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.StockRecord.add({
                        warehouse_id: _this.warehouse_id,
                        warehouse_location_id: _this.form.warehouse_location_id,
                        target_id: _this.form.target_id,
                        target_type: _this.form.stock_target_type,
                        type: STOCK_RECORD.TYPE.OUT,
                        count: _this.form.inventory_amount,
                        source_type: STOCK_RECORD.SOURCE_FORM.INVOICE,
                        invoice_id: _this.invoice_id,
                    })
                        .then(res => {
                            _this.$message.success(_this.$t('pop_up.operate'));
                            _this.clear();
                            _this.handleWarehouseChange();
                        })
                        .catch(err => {
                            console.log('handleComplete err', err);
                        });
                },
            });
        },
        clear() {
            Object.assign(this.form, this.$options.data().form);
        },
    },
};
</script>

<style lang="less"></style>
