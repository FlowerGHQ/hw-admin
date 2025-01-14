<template>
    <div class="EditPurchaseItem">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area2">
                    {{ type === 'GIVE_ORDER' ? $t('p.give_order') : $t('i.product_information') }}
                </div>
                <div class="btns-area">
                    <div class="collapse-title-right">
                        <!-- 赠送商品 && 平台方能看 && 订单状态(等待审核 待支付 待生产)可见 -->
                        <div
                            v-if="
                                type === 'GIVE_ORDER' &&
                                this.$auth('ADMIN') &&
                                $Util.Common.isMember(detail.status, [
                                    STATUS.WAIT_AUDIT,
                                    STATUS.WAIT_PAY,
                                    STATUS.WAIT_PRODUCED,
                                ])
                            "
                            class="give-order"
                        >
                            <ItemSelect
                                :isShowBtn="isGiftOrderBtn"
                                @select="handleAddItem"
                                :disabledChecked="disabledChecked"
                                :btn-text="$t('i.add')"
                            >
                                {{ btnText || $t('i.add') }}
                            </ItemSelect>
                            <template v-if="isGiftOrderBtn">
                                <a-button type="primary" ghost @click="handleCancel()">
                                    {{ $t('def.cancel') }}
                                </a-button>
                                <a-button type="primary" ghost @click="handleSave()">
                                    {{ $t('def.sure') }}
                                </a-button>
                            </template>
                        </div>
                        <!-- 商品信息 -->
                        <div v-if="type === 'PURCHASE_ORDER'" class="production-order">
                            <ItemSelect
                                :isShowBtn="isPurchaseOrderBtn"
                                @select="handleAddItem"
                                :disabledChecked="disabledChecked"
                                :btn-text="$t('i.add')"
                            >
                                {{ $t('i.add') }}
                            </ItemSelect>
                            <a-divider type="vertical" />
                            <template v-if="isPurchaseOrderBtn">
                                <!-- 确认更改 -->
                                <a-button type="primary" ghost @click.stop="handleSave()">
                                    {{ $t('def.changes') }}
                                </a-button>
                                <!-- 取消更改 -->
                                <a-button ghost danger @click.stop="handleCancel()">
                                    {{ $t('def.cancel_changes') }}
                                </a-button>
                            </template>
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

                            <template v-if="column.dataIndex === 'amount'">
                                <!-- 商品订单 -->
                                <a-input-number
                                    v-if="type === 'PURCHASE_ORDER' && isPurchaseOrderBtn"
                                    v-model:value="record.amount"
                                    style="width: 120px"
                                    :min="0"
                                    :precision="0"
                                    @blur="inputChange('purchase_amount', record)"
                                />
                                <!-- 平台方 && 赠送订单 -->
                                <a-input-number
                                    v-else-if="type === 'GIVE_ORDER' && $auth('ADMIN')"
                                    v-model:value="record.amount"
                                    style="width: 120px"
                                    :min="0"
                                    :precision="0"
                                    @blur="inputChange('give_amount', record)"
                                />
                            </template>

                            <!-- 单价 -->
                            <template v-if="column.key === 'unit_price'">
                                <span class="m-r-4" v-if="text >= 0">{{ $Util.priceUnitFilter(detail.currency) }}</span>
                                <a-input-number
                                    v-if="type === 'PURCHASE_ORDER' && isPurchaseOrderBtn"
                                    v-model:value="record.unit_price"
                                    style="width: 120px"
                                    :min="0"
                                    :precision="0"
                                    @blur="inputChange('unit_price', record)"
                                />
                                <template v-else>
                                    {{ text }}
                                </template>
                            </template>

                            <!-- 规格 -->
                            <template v-if="column.key === 'spec'">
                                {{ $Util.itemSpecFilter(text, $i18n.locale) }}
                            </template>

                            <!-- 总价 -->
                            <template v-if="column.key === 'price'">
                                <span v-if="text >= 0">{{ $Util.priceUnitFilter(detail.currency) }}</span>
                                {{ text }}
                            </template>

                            <template v-if="column.key === 'operate'">
                                <a-button type="link" danger @click="handleRemoveItem(record, index)">
                                    <i class="icon i_delete" />{{ $t('def.remove') }}
                                </a-button>
                            </template>
                        </template>
                    </a-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '@/core';
const PURCHASE_TYPE = Core.Const.PURCHASE.TYPE;
const STATUS = Core.Const.PURCHASE.STATUS;

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
        // 按钮的名称
        btnText: {
            type: String,
        },
        // 商品订单 按钮显示
        isPurchaseOrderBtn: {
            type: Boolean,
            default: false,
        },
        // 赠送 按钮显示
        isGiftOrderBtn: {
            type: Boolean,
            default: false,
        },
        //
    },
    data() {
        return {
            STATUS,
            loading: false,
            tableData: [],
            giveList: [], // 赠品单数据
        };
    },
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('i.item'), key: 'detail' },
                // { title: this.$t('i.number'), dataIndex: 'model' },  // 商品品号
                { title: this.$t('i.code'), dataIndex: 'code' },
                { title: this.$t('i.spec'), dataIndex: 'attr_list', key: 'spec' },
                { title: this.$t('i.total_quantity'), dataIndex: 'amount' },
                { title: this.$t('i.unit_price'), dataIndex: 'unit_price', key: 'unit_price' },
                { title: this.$t('i.total_price'), dataIndex: 'price', key: 'price' },
                { title: this.$t('def.operate'), key: 'operate', fixed: 'right', width: 100 },
            ];
            // 商品单操作列
            if (this.type === 'PURCHASE_ORDER' && !this.isPurchaseOrderBtn) {
                columns = columns.filter(i => i.key !== 'operate');
            }
            // 赠品单操作列
            if (this.type === 'GIVE_ORDER' && !this.isGiftOrderBtn) {
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
            case 'PURCHASE_ORDER': // 商品详情
                this.getPurchaseItemListFetch();
                break;
            case 'GIVE_ORDER': // 增单详情
                this.getGiveawayListFetch();
                break;
        }
    },
    methods: {
        /* fetch start */
        // 获取 采购单 商品列表
        getPurchaseItemListFetch() {
            this.loading = true;
            Core.Api.Purchase.itemList({
                order_id: this.orderId,
            })
                .then(res => {
                    this.tableData = res.list.map(i => {
                        let item = i.item || {};
                        item.amount = i.amount;
                        item.unit_price = this.$Util.countFilter(i.unit_price);
                        item.price = this.$Util.countFilter(i.price);
                        item.charge = i.charge;

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
        // 商品列表  保存
        saveReviseFetch(params = {}) {
            let obj = {
                id: this.orderId,
                ...params,
            };

            Core.Api.Purchase.revise(obj)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.$emit('submit');
                })
                .catch(err => {
                    console.log('handleSave err:', err);
                });
        },
        // 获取 采购单 赠品列表
        getGiveawayListFetch() {
            this.loading = true;
            Core.Api.Purchase.giveawayList({
                order_id: this.orderId,
            })
                .then(res => {
                    this.giveList = res.list;
                    this.tableData = res.list.map(i => {
                        let item = i.item || {};
                        item.amount = i.amount;
                        item.unit_price = this.$Util.countFilter(i.unit_price);
                        item.price = this.$Util.countFilter(i.price);
                        item.item_id = i.item_id;
                        item.order_id = i.order_id;
                        return item;
                    });
                })
                .catch(err => {
                    console.log('getGiveawayList err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 更新赠品单
        handleUpdateFetch(params = {}) {
            let obj = {
                ...params,
            };
            Core.Api.Purchase.updateGiveaway(obj)
                .then(() => {
                    this.getGiveawayListFetch();
                })
                .catch(err => {
                    console.log('handleUpdate err:', err);
                });
        },
        // 赠送单保存
        saveCreateGiveawayFetch(params = {}) {
            let obj = {
                id: this.orderId,
                type: PURCHASE_TYPE.GIVEAWAY,
                org_id: this.detail.org_id,
                org_type: this.detail.org_type,
                currency: this.detail.currency,
                receive_info_id: this.detail.receive_info_id,
                ...params,
            };

            Core.Api.Purchase.createGiveaway(obj)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    // 重新获取数据
                    this.getGiveawayListFetch();
                    this.$emit('submit');
                })
                .catch(err => {
                    console.log('handleSave err:', err);
                });
        },
        /* fetch end */

        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: this.$auth('ADMIN') ? '/item/item-detail' : '/mall/vehicle-list/detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
        // 添加商品
        handleAddItem(ids, items) {
            let currency = this.detail.currency.toLocaleLowerCase() || '';
            currency = currency === 'cny' ? '' : '_' + currency;
            items = items.map(item => {
                item.amount = 1;
                item.unit_price = this.$Util.countFilter(item['fob' + currency]);
                item.price = item.unit_price;
                return item;
            });

            items?.forEach(el => {
                let findIndex = this.tableData.findIndex(tableEl => tableEl.id === el.id);

                if (findIndex !== -1) {
                    this.tableData.splice(findIndex, 1, el);
                } else {
                    this.tableData.push(el);
                }
            });
        },
        // 删除商品
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
                        console.log('record', record);
                        if (record.order_id) {
                            Core.Api.Purchase.deleteGiveaway({
                                item_id: record.item_id,
                                order_id: record.order_id,
                            })
                                .then(() => {
                                    this.$message.success(this.$t('pop_up.delete_success'));
                                    this.getGiveawayListFetch();
                                })
                                .catch(err => {
                                    console.log('handleRemoveItem err:', err);
                                });
                        } else {
                            this.tableData = this.tableData.filter(el => el.id !== record.id);
                        }
                    },
                    onCancel: () => {
                        console.log('Cancel');
                    },
                });
            } else {
                this.tableData.splice(index, 1);
            }
        },
        // 保存
        handleSave() {
            let item_list = [];
            switch (this.type) {
                case 'PURCHASE_ORDER': // 详情
                    item_list = this.tableData.map(item => ({
                        item_id: item.id,
                        item_code: item.code,
                        unit_price: this.$Util.countFilter(item.unit_price, 100, 2, true),
                        price: this.$Util.countFilter(parseInt(item.unit_price * item.amount), 100, 2, true),
                        charge: item.charge,
                        amount: item.amount,
                        type: item.type,
                    }));

                    this.saveReviseFetch({ item_list });
                    break;
                case 'GIVE_ORDER': // 详情
                    item_list = this.tableData.map(item => ({
                        amount: item.amount,
                        item_code: item.code,
                        item_id: item.id,
                        unit_price: this.$Util.countFilter(item.unit_price, 100, 2, true),
                        price: this.$Util.countFilter(parseInt(item.unit_price * item.amount), 100, 2, true),
                        type: item.type,
                    }));

                    console.log('GIVE_ORDER', item_list);
                    if (this.giveList.length) {
                        this.handleUpdateFetch({
                            id: this.giveList[0].order_id,
                            item_list,
                        });
                    } else {
                        this.saveCreateGiveawayFetch({ item_list });
                    }

                    break;
            }
        },
        // 取消
        handleCancel() {
            if (this.type === 'GIVE_ORDER') {
                // 重新获取数据
                this.getGiveawayListFetch();
                return;
            } else if (this.type === 'PURCHASE_ORDER') {
                this.getPurchaseItemListFetch();
            }

            this.$emit('cancel');
        },

        // 数量单价改变
        inputChange(type, record) {
            switch (type) {
                case 'purchase_amount':
                    console.log('record', record);
                    record.unit_price = this.$Util.countFilter(
                        record[this.$Util.Number.getStepPriceIndexByNums(record.amount, this.detail.currency)],
                    );
                    record.price = record.amount * record.unit_price;
                    break;
                case 'give_amount':
                    this.handleUpdateFetch({
                        id: this.giveList[0].order_id,
                        item_list: [
                            {
                                item_id: record.item_id,
                                order_id: record.order_id,
                                amount: record.amount,
                            },
                        ],
                    });
                    break;
                case 'unit_price':
                    record.price = record.amount * record.unit_price;
                    break;
            }
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
