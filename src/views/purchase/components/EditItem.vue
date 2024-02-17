<template>
    <div class="EditPurchaseItem">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area2">{{ title }}</div>
                <div class="btns-area">
                    <div class="collapse-title-right">
                        <div class="give-order" v-if="type === 'GIVE_ORDER' && this.$auth('ADMIN')">
                            <ItemSelect
                                @select="handleAddItem"
                                :disabledChecked="disabledChecked"
                                :btn-text="$t('i.add')"
                                >{{ $t('i.add') }}</ItemSelect
                            >
                            <a-button v-if="isShowBtn" type="primary" ghost @click.stop="handleCancel()">{{
                                $t('def.cancel')
                            }}</a-button>
                            <a-button v-if="isShowBtn" type="primary" ghost @click.stop="handleSave()">{{
                                $t('def.sure')
                            }}</a-button>
                        </div>
                        <div class="production-order" v-if="type === 'PURCHASE_ORDER'">
                            <ItemSelect
                                @select="handleAddItem"
                                :disabledChecked="disabledChecked"
                                :btn-text="$t('i.add')"
                                >{{ $t('i.add') }}</ItemSelect
                            >
                            <a-divider type="vertical" />
                            <a-button type="primary" ghost @click.stop="handleSave()">{{ $t('def.changes') }}</a-button>
                            <a-button ghost danger @click.stop="handleCancel()">{{
                                $t('def.cancel_changes')
                            }}</a-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="table-container">
                <div class="panel-content table-container no-mg">
                    <a-table
                        :columns="tableColumns"
                        :data-source="tableData"
                        :scroll="{ x: true }"
                        :row-key="record => record.id"
                        :pagination="false"
                    >
                        <template #bodyCell="{ column, text, record, index }">
                            <template v-if="column.key === 'detail'">
                                <div class="table-img">
                                    <a-image
                                        :width="30"
                                        :height="30"
                                        :src="$Util.imageFilter(record ? record.logo : '', 2)"
                                    />
                                    <a-tooltip
                                        placement="top"
                                        :title="record ? ($i18n.locale == 'zh' ? record.name : record.name_en) : '-'"
                                    >
                                        <a-button
                                            type="link"
                                            @click="routerChange('detail', record)"
                                            style="margin-left: 6px"
                                        >
                                            {{ record ? ($i18n.locale == 'zh' ? record.name : record.name_en) : '-' }}
                                        </a-button>
                                    </a-tooltip>
                                </div>
                            </template>
                            <!-- <span v-if="!$auth('ADMIN') && type === ''">{{ text }}</span> -->
                            <template v-if="column.dataIndex === 'amount' && type !== 'GIVE_ORDER'">
                                <a-input-number
                                    v-model:value="record.amount"
                                    style="width: 120px"
                                    :min="0"
                                    :precision="0"
                                />
                            </template>
                            <!-- <span v-if="!$auth('ADMIN') && type === ''">{{ text }}</span> -->
                            <template v-if="column.dataIndex === 'amount' && type === 'GIVE_ORDER' && $auth('ADMIN')">
                                <a-input-number
                                    @blur="handleUpdate(record)"
                                    v-model:value="record.amount"
                                    style="width: 120px"
                                    :min="0"
                                    :precision="0"
                                />
                            </template>
                            <template v-if="column.key === 'money'">
                                <span v-if="text >= 0">{{ $Util.priceUnitFilter(record.currency) }}</span>
                                {{ $Util.countFilter(text) }}
                            </template>
                            <template v-if="column.key === 'spec'">
                                {{ $Util.itemSpecFilter(text, $i18n.locale) }}
                            </template>
                            <template v-if="column.key === 'operate'">
                                <a-button type="link" danger @click="handleRemoveItem(record, index)"
                                    ><i class="icon i_delete" />{{ $t('def.remove') }}</a-button
                                >
                            </template>
                        </template>
                    </a-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../../core';
const USER_TYPE = Core.Const.USER.TYPE;
const PURCHASE_TYPE = Core.Const.PURCHASE.TYPE;
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';
export default {
    name: 'EditPurchaseItem',
    components: {
        ItemSelect,
    },
    props: {
        orderId: { type: Number },
        detail: {
            type: Object,
        },
        type: {
            type: String,
        },
    },
    data() {
        return {
            title: '',
            loading: false,
            tableData: [],
            isShowBtn: false,
            addData: [],
        };
    },
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('i.item'), key: 'detail' },
                { title: this.$t('i.number'), dataIndex: 'model' },
                { title: this.$t('i.code'), dataIndex: 'code' },
                { title: this.$t('i.spec'), dataIndex: 'attr_list', key: 'spec' },
                { title: this.$t('i.total_quantity'), dataIndex: 'amount' },
                { title: this.$t('i.unit_price'), dataIndex: 'unit_price', key: 'money' },
                { title: this.$t('i.total_price'), dataIndex: 'total_price', key: 'money' },
                { title: this.$t('def.operate'), key: 'operate', fixed: 'right', width: 100 },
            ];
            // 数据操作隔离 不是管理员并且是赠品单
            if (!this.$auth('ADMIN') && this.type === 'GIVE_ORDER') {
                columns = columns.filter(i => i.key !== 'operate');
            }
            return columns;
        },
        disabledChecked() {
            return this.tableData.map(i => i.id);
        },
    },
    mounted() {
        switch (this.type) {
            case 'PURCHASE_ORDER': // 详情
                this.getPurchaseItemList();
                this.title = this.$t('i.product_information');
                break;
            case 'GIVE_ORDER': // 详情
                this.title = this.$t('p.give_order');
                this.getGiveawayList();
                break;
        }
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: this.$auth('ADMIN') ? '/item/item-detail' : '/purchase/item-display',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
        // 获取 采购单 商品列表
        getPurchaseItemList() {
            this.loading = true;
            Core.Api.Purchase.itemList({
                order_id: this.orderId,
            })
                .then(res => {
                    this.tableData = res.list.map(i => {
                        let item = i.item || {};
                        item.amount = i.amount;
                        item.unit_price = i.unit_price;
                        item.total_price = i.price;

                        return item;
                    });
                })
                .catch(err => {
                    console.log('getPurchaseInfo err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 获取 采购单 赠品列表
        getGiveawayList() {
            this.loading = true;
            Core.Api.Purchase.giveawayList({
                order_id: this.orderId,
            })
                .then(res => {
                    this.tableData = res.list.map(i => {
                        console.log(i);
                        let item = i.item || {};
                        item.amount = i.amount;
                        item.unit_price = i.unit_price;
                        item.total_price = i.price;
                        item.item_id = i.item_id;
                        item.order_id = i.order_id;
                        return item;
                    });
                    if (this.tableData.length > 0) {
                        this.isShowBtn = true;
                    }
                })
                .catch(err => {
                    console.log('getGiveawayList err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 修改赠品单
        handleUpdate(record) {
            console.log(record);
            Core.Api.Purchase.updateGiveaway({
                item_list: [
                    {
                        item_id: record.item_id,
                        order_id: record.order_id,
                        amount: record.amount,
                    },
                ],
            })
                .then(() => {
                    this.getGiveawayList();
                })
                .catch(err => {
                    console.log('handleUpdate err:', err);
                });
        },

        // 添加商品
        handleAddItem(ids, items) {
            console.log('handleAddItem ids, items:', ids, items);
            let currency = this.detail.currency.toLocaleLowerCase() || '';
            currency = currency === 'cny' ? '' : '_' + currency;
            console.log('currency:', currency);
            items = items.map(item => {
                item.amount = 1;
                item.unit_price = item['fob' + currency];
                item.total_price = item.unit_price;
                return item;
            });
            this.addData.push(...items);
            this.tableData.push(...items);
            this.isShowBtn = true;
        },
        // 添加商品
        handleRemoveItem(record, index) {
            console.log('handleRemoveItem record:', record);
            if (this.type === 'GIVE_ORDER') {
                this.$confirm({
                    type: 'danger',
                    title: this.$t('def.delete'),
                    content: this.$t('def.delete_content'),
                    okText: this.$t('def.sure'),
                    cancelText: this.$t('def.cancel'),
                    onOk: () => {
                        Core.Api.Purchase.deleteGiveaway({
                            item_id: record.item_id,
                            order_id: record.order_id,
                        })
                            .then(() => {
                                this.$message.success(this.$t('pop_up.delete_success'));
                                this.getGiveawayList();
                            })
                            .catch(err => {
                                console.log('handleRemoveItem err:', err);
                            });
                    },
                    onCancel: () => {
                        console.log('Cancel');
                    },
                });
            } else {
                this.tableData.splice(index, 1);
            }
        },
        handleSave() {
            let item_list = [];
            switch (this.type) {
                case 'PURCHASE_ORDER': // 详情
                    item_list = this.tableData.map(item => ({
                        amount: item.amount,
                        // charge: 0,
                        // deliver_amount: 0,
                        item_code: item.code,
                        item_id: item.id,
                        price: parseInt(item.unit_price * item.amount),
                        // residue_quantity: 0,
                        type: item.type,
                        unit_price: item.unit_price,
                    }));
                    Core.Api.Purchase.revise({
                        id: this.orderId,
                        item_list,
                    })
                        .then(() => {
                            this.$message.success(this.$t('pop_up.save_success'));
                            this.$emit('submit');
                        })
                        .catch(err => {
                            console.log('handleSave err:', err);
                        });
                    break;
                case 'GIVE_ORDER': // 详情
                    item_list = this.addData.map(item => ({
                        amount: item.amount,
                        // charge: 0,
                        // deliver_amount: 0,
                        item_code: item.code,
                        item_id: item.id,
                        price: parseInt(item.unit_price * item.amount),
                        // residue_quantity: 0,
                        type: item.type,
                        unit_price: item.unit_price,
                    }));
                    Core.Api.Purchase.createGiveaway({
                        id: this.orderId,
                        item_list,
                        type: PURCHASE_TYPE.GIVEAWAY,
                        org_id: this.detail.org_id,
                        org_type: this.detail.org_type,
                        currency: this.detail.currency,
                        receive_info_id: this.detail.receive_info_id,
                    })
                        .then(() => {
                            this.$message.success(this.$t('pop_up.save_success'));
                            this.addData = [];
                            // 重新获取数据
                            this.getGiveawayList();
                            this.$emit('submit');
                        })
                        .catch(err => {
                            console.log('handleSave err:', err);
                        });
                    break;
            }
        },
        handleCancel() {
            if (this.type === 'GIVE_ORDER') {
                // 重新获取数据
                this.getGiveawayList();
                return;
            }
            this.$emit('cancel');
        },
    },
};
</script>

<style lang="less">
.EditPurchaseItem {
    .collapse-title-right {
        .i_expan_l {
            margin-left: 12px;
        }
    }
}
</style>
