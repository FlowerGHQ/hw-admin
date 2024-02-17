<template>
    <div class="PricingStructure gray-panel no-margin">
        <div class="panel-title">
            <div class="title">{{ $t('a.item_price') }}</div>
        </div>
        <div class="panel-content">
            <div class="table-container">
                <template v-if="canEdit">
                    <template v-if="!addMode">
                        <ItemSelect
                            :disabled-checked="tableData.map(i => i.item_id)"
                            @select="handleAddItemShow"
                            btn-class="panel-btn"
                        >
                            <i class="icon i_add" /> {{ $t('i.add') }}
                        </ItemSelect>
                        <a-button class="panel-btn" @click="handleMutiEditChange()" type="primary" ghost>
                            <template v-if="editShow"><i class="icon i_confirm" />{{ $t('a.sure_set') }}</template>
                            <template v-else>{{ $t('a.set_supply_price') }}</template>
                        </a-button>
                        <a-button class="panel-btn" @click="getTableData" v-if="editShow"
                            ><i class="icon i_close_c" />{{ $t('a.cancel_set') }}</a-button
                        >
                    </template>
                    <template v-else>
                        <a-button class="panel-btn" @click="handleAddItemConfirm()" type="primary" ghost
                            ><i class="icon i_confirm" />{{ $t('a.sure_add') }}</a-button
                        >
                        <a-button class="panel-btn" @click="handleAddItemClose()"
                            ><i class="icon i_close_c" />{{ $t('a.cancel_add') }}</a-button
                        >
                    </template>
                </template>
                <a-table
                    :columns="tableColumns"
                    :data-source="addMode ? addData : tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                    :loading="loading"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail'">
                            <div class="table-img">
                                <a-image :width="30" :height="30" :src="$Util.imageFilter(record.logo)" fallback="无" />
                                <a-tooltip placement="top" :title="text">
                                    <div class="info">
                                        <a-button type="link" @click="routerChange('detail', record)">
                                            <div class="ell" style="max-width: 150px">{{ text || '-' }}</div>
                                        </a-button>
                                    </div>
                                </a-tooltip>
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'price'"> €{{ $Util.countFilter(text) }} </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'spec'">
                            {{ $Util.itemSpecFilter(text) }}
                        </template>
                        <template v-if="column.key === 'supply'">
                            <template v-if="record.edit_show || editShow || addMode">
                                <a-input-number
                                    v-model:value="record.purchase_price_eur"
                                    v-if="column.dataIndex === 'purchase_price_eur'"
                                    style="width: 120px"
                                    :min="0.0"
                                    :precision="2"
                                    :formatter="value => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                    :parser="value => value.replace(/€\s?|(,*)/g, '')"
                                />
                                <a-input-number
                                    v-model:value="record.purchase_price_usd"
                                    v-if="column.dataIndex === 'purchase_price_usd'"
                                    style="width: 120px"
                                    :min="0.0"
                                    :precision="2"
                                    :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                />
                                <a-input-number
                                    v-model:value="record.purchase_price_gbp"
                                    v-if="column.dataIndex === 'purchase_price_gbp'"
                                    style="width: 120px"
                                    :min="0.0"
                                    :precision="2"
                                    :formatter="value => `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                    :parser="value => value.replace(/£\s?|(,*)/g, '')"
                                />
                                <a-input-number
                                    v-model:value="record.purchase_price"
                                    v-if="column.dataIndex === 'purchase_price'"
                                    style="width: 120px"
                                    :min="0.0"
                                    :precision="2"
                                    :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                    :parser="value => value.replace(/￥\s?|(,*)/g, '')"
                                />
                            </template>
                            <template v-else> {{ column.unit }} {{ text }} </template>
                        </template>
                        <template v-if="column.key === 'parent_price'">
                            $ {{ $Util.countFilter(record.parent_price_usd) }} | €
                            {{ $Util.countFilter(record.parent_price_eur) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="handleEditChange(record)" v-if="!editShow">
                                <template v-if="record.edit_show"
                                    ><i class="icon i_confirm" />{{ $t('a.sure_set') }}</template
                                >
                                <template v-else><i class="icon i_edit" />{{ $t('a.set_price') }}</template>
                            </a-button>
                            <a-button type="link" class="danger" @click="handleDelete(record.id)"
                                ><i class="icon i_delete" />{{ $t('a.remove') }}</a-button
                            >
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container" v-if="!addMode">
                <a-pagination
                    v-model:current="currPage"
                    :page-size="pageSize"
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                    :hide-on-single-page="false"
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
const USER_TYPE = Core.Const.USER.TYPE;
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';

export default {
    name: 'PricingStructure',
    components: { ItemSelect },
    props: {
        orgId: {
            type: Number,
        },
        orgType: {
            type: Number,
        },
        title: {
            type: Number,
        },
        canEdit: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            USER_TYPE,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 表格数据
            tableData: [],
            editShow: false,
            addMode: false,
            addData: [],
            purchase_price: '',
            purchase_price_gbp: '',
            purchase_price_eur: '',
            purchase_price_gbp_usd: '',
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('r.item_name'), dataIndex: 'name', key: 'detail' },
                { title: this.$t('i.commercial_specification'), dataIndex: 'attr_list', key: 'spec' },
                { title: this.$t('i.number'), dataIndex: 'model', key: 'item' },
                { title: this.$t('i.code'), dataIndex: 'code', key: 'item' },
                // { title: '供货价(CNY)', key: 'supply', dataIndex: 'purchase_price', unit: '￥', },
                { title: this.$t('i.eur'), key: 'supply', dataIndex: 'purchase_price_eur', unit: '€' },
                { title: this.$t('i.usd'), key: 'supply', dataIndex: 'purchase_price_usd', unit: '$' },
                // { title: '供货价(GBP)', key: 'supply', dataIndex: 'purchase_price_gbp', unit: '£', },
                { title: this.$t('i.purchase_price'), key: 'parent_price' },
                // { title: '建议零售价', dataIndex: 'price' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
            ];
            if (this.addMode || !this.canEdit) {
                columns.pop();
            }
            return columns;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item);
            let routeUrl = '';
            switch (type) {
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: this.$auth('ADMIN') ? '/item/item-detail' : '/purchase/item-display',
                        query: { id: item.item_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            console.log('pageSizeChange size:', size);
            this.pageSize = size;
            this.getTableData();
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            this.editShow = false;
            this.addMode = false;
            Core.Api.ItemPrice.list({
                org_id: this.orgId,
                org_type: this.orgType,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res', res);
                    this.total = res.count;
                    res.list.forEach(item => {
                        item.purchase_price = Core.Util.countFilter(item.purchase_price);
                        item.purchase_price_gbp = Core.Util.countFilter(item.purchase_price_gbp);
                        item.purchase_price_eur = Core.Util.countFilter(item.purchase_price_eur);
                        item.purchase_price_usd = Core.Util.countFilter(item.purchase_price_usd);
                        item.edit_show = false;
                    });
                    console.log('this.tableData:', this.tableData);
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 移出商品
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('i.sure_remove'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.ItemPrice.delete({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.move'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete -> err', err);
                        });
                },
            });
        },
        // 添加商品
        handleAddItemShow(ids, items) {
            console.log('handleAddItemShow items:', items);
            items.forEach(item => {
                item.edit_price = Core.Util.countFilter(item.price);
                item.parent_price_eur = item.fob_eur;
                item.parent_price_usd = item.fob_usd;
            });
            this.addData = items;
            console.log('handleAddItemShow this.addData:', this.addData);
            this.addMode = true;
            this.editShow = false;
        },
        handleAddItemClose() {
            this.addMode = false;
        },
        handleAddItemConfirm() {
            console.log('this.addData:', this.addData);
            let items = this.addData.map(item => ({
                category_id: item.category_id,
                code: item.code,
                id: 0,
                item_id: item.id,
                name: item.name,
                price: item.price,
                purchase_price: Math.round(item.purchase_price * 100) || 0,
                purchase_price_gbp: Math.round(item.purchase_price_gbp * 100) || 0,
                purchase_price_usd: Math.round(item.purchase_price_usd * 100) || 0,
                purchase_price_eur: Math.round(item.purchase_price_eur * 100) || 0,
                org_id: this.orgId,
                org_type: this.orgType,
                parent_id: item.item_price_id || 0,
            }));
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                if (item.purchase_price_eur <= 0) {
                    return this.$message.warning(this.$t('a.enter_eur'));
                }
                if (item.purchase_price_usd <= 0) {
                    return this.$message.warning(this.$t('a.enter_usd'));
                }
                /* if (item.purchase_price_gbp <= 0) {
                    return this.$message.warning('请填写供货价(GBP)')
                }
                if (item.purchase_price <= 0) {
                    return this.$message.warning('请填写供货价(CNY)')
                } */
            }
            console.log('handleAddItemConfirm items:', items);
            Core.Api.ItemPrice.batchSave(items)
                .then(() => {
                    this.$message.success(this.$t('pop_up.add'));
                    this.getTableData();
                })
                .catch(err => {
                    console.log('handleAddItemShow err:', err);
                });
        },
        // 价格编辑
        handleEditChange(item) {
            // 单个 价格编辑
            if (!item.edit_show) {
                // 开启编辑模式
                item.edit_show = true;
            } else {
                // 关闭编辑模式
                if (item.purchase_price_eur <= 0) {
                    return this.$message.warning(this.$t('a.enter_eur'));
                }
                if (item.purchase_price_usd <= 0) {
                    return this.$message.warning(this.$t('a.enter_usd'));
                }
                this.loading = true;
                Core.Api.ItemPrice.save({
                    id: item.id,
                    item_id: item.item_id,
                    purchase_price: Math.round(item.purchase_price * 100),
                    purchase_price_gbp: Math.round(item.purchase_price_gbp * 100),
                    purchase_price_usd: Math.round(item.purchase_price_usd * 100),
                    purchase_price_eur: Math.round(item.purchase_price_eur * 100),
                })
                    .then(() => {
                        this.$message.success(this.$t('pop_up.change'));
                    })
                    .catch(err => {
                        console.log('handleEditChange err:', err);
                    })
                    .finally(() => {
                        this.getTableData();
                    });
            }
        },
        handleMutiEditChange() {
            // 批量 价格编辑
            if (!this.editShow) {
                // 开启编辑模式
                this.editShow = true;
            } else {
                // 关闭编辑模式
                let items = this.tableData.map(item => ({
                    id: item.id,
                    item_id: item.item_id,
                    purchase_price: Math.round(item.purchase_price * 100),
                    purchase_price_gbp: Math.round(item.purchase_price_gbp * 100),
                    purchase_price_usd: Math.round(item.purchase_price_usd * 100),
                    purchase_price_eur: Math.round(item.purchase_price_eur * 100),
                }));
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    if (item.purchase_price_eur <= 0) {
                        return this.$message.warning(this.$t('a.enter_eur'));
                    }
                    if (item.purchase_price_usd <= 0) {
                        return this.$message.warning(this.$t('a.enter_usd'));
                    }
                    /* if (item.purchase_price_gbp <= 0) {
                        return this.$message.warning('请填写供货价(GBP)')
                    }
                    if (item.purchase_price <= 0) {
                        return this.$message.warning('请填写供货价(CNY)')
                    } */
                }
                this.loading = true;
                Core.Api.ItemPrice.batchSave(items)
                    .then(() => {
                        this.$message.success(this.$t('pop_up.change'));
                    })
                    .catch(err => {
                        console.log('handleMutiEditChange err:', err);
                    })
                    .finally(() => {
                        this.loading = false;
                        this.getTableData();
                    });
            }
        },
    },
};
</script>

<style lang="less" scoped>
.PricingStructure {
    .table-container {
        margin-top: -10px;
        .value-price {
            margin-right: 5px;
            width: 60px;
        }
    }
}
</style>
