<template>
    <div id="ItemSettle" class="list-container">
        <a-spin :spinning="loading" class="loading-incontent" v-if="loading"></a-spin>
        <div class="title-area">{{ $t('i.settle') }}</div>
        <div class="config-list">
            <div class="config-item receive">
                <div class="config-title">1.{{ $t('i.shipping_options') }}</div>
                <div class="config-content select-mode">
                    <div
                        class="select-item"
                        :class="selectIndex === item.id ? 'active' : ''"
                        v-for="item of receiveList"
                        :key="item.id"
                        @click="handleConfigSelect(item)"
                    >
                        <div class="info">
                            <i class="icon i_point" />
                            <div class="desc">
                                <p>{{ item.name }} {{ item.phone }}</p>
                                <p>{{ item.email }}</p>
                                <p v-if="$i18n.locale === 'zh'">
                                    {{ item.country }} {{ item.province }} {{ item.city }} {{ item.county }}
                                    {{ item.address }}
                                </p>
                                <p v-if="$i18n.locale === 'en'">
                                    {{ item.country_en }} {{ item.province_en }} {{ item.city_en }} {{ item.county }}
                                    {{ item.address }}
                                </p>
                            </div>
                        </div>
                        <div class="btn">
                            <ReceiverAddressEdit
                                btnType="link"
                                :detail="item"
                                :orgId="orgId"
                                :orgType="orgType"
                                btnClass="edit-btn"
                                @submit="getReceiveList"
                                >{{ $t('def.edit') }}</ReceiverAddressEdit
                            >
                            <a-button type="link" @click.stop="handleConfigDelete(item)">{{
                                $t('def.delete')
                            }}</a-button>
                        </div>
                    </div>
                    <div class="add">
                        <ReceiverAddressEdit
                            btnType="link"
                            :orgId="orgId"
                            :orgType="orgType"
                            btnClass="edit-btn"
                            @submit="getReceiveList"
                            >{{ $t('i.new_address') }}</ReceiverAddressEdit
                        >
                    </div>
                </div>
            </div>
            <div class="config-item pay" v-if="$auth('DISTRIBUTOR')">
                <div class="config-title">2.{{ $t('i.shipping_settings') }}</div>
                <div class="config-content">
                    <div class="radio-item">
                        <div class="desc">{{ $t('p.partial_shipments') }}：</div>
                        <div class="value">
                            <a-radio-group v-model:value="form.flag_part_shipment">
                                <a-radio v-for="item of flagPartShipmentList" :key="item.key" :value="item.key">{{
                                    item[$i18n.locale]
                                }}</a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                    <div class="radio-item">
                        <div class="desc">{{ $t('p.transshipment') }}：</div>
                        <div class="value">
                            <a-radio-group v-model:value="form.flag_transfer">
                                <a-radio v-for="item of flagTransferList" :key="item.key" :value="item.key">{{
                                    item[$i18n.locale]
                                }}</a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                </div>
            </div>
            <a-button type="primary" class="orange" @click="handleCreateOrder()">{{ $t('p.confirm_order') }}</a-button>
        </div>
        <div class="settel-item">
            <div class="item-title">
                <span>{{ $t('p.cart') }}</span>
                <a-button type="link" @click="routerChange('back')">{{ $t('def.edit') }}</a-button>
            </div>
            <div class="item-content">
                <div class="price-item" v-for="item of shopCartList" :key="item.id">
                    <p class="name">{{ item.item ? (lang == 'zh' ? item.item.name : item.item.name_en) : '-' }}</p>
                    <span class="price"
                        >{{ unit }}
                        {{
                            $Util.Number.numFormat(
                                $Util.countFilter(
                                    item.amount * item?.item[$Util.Number.getStepPriceIndexByNums(item.amount)],
                                ),
                            )
                        }}
                    </span>
                </div>
                <div class="price-item sum">
                    <p class="name">{{ $t('p.total') }}</p>
                    <span class="price">{{ unit }} {{ sum_price }}</span>
                </div>
                <div class="sub-title">{{ $t('p.preview') }}</div>
                <div class="item-item" v-for="item of shopCartList" :key="item.id">
                    <img class="cover" :src="$Util.imageFilter(item.item ? item.item.logo : '', 2)" />
                    <div class="info">
                        <p>{{ item.item ? (lang == 'zh' ? item.item.name : item.item.name_en) : '-' }}</p>
                        <span>{{ $t('p.code') }}：{{ item.item ? item.item.code : '-' }}</span>
                        <span v-if="item.item && item.item.attr_str"
                            >{{ $t('i.spec') }}：{{
                                item.item ? (lang == 'zh' ? item.item.attr_str : item.item.attr_str_en) : '-'
                            }}</span
                        >
                        <span>{{ $t('i.amount') }}：{{ item.amount }}</span>
                        <span
                            >{{ $t('p.unit_price') }}：{{ unit }}
                            {{
                                $Util.Number.numFormat(
                                    $Util.countFilter(item?.item[$Util.Number.getStepPriceIndexByNums(item.amount)]),
                                )
                            }}</span
                        >
                        <span>{{ $t('i.remark') }}：{{ item.remark }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '@/core';

import ReceiverAddressEdit from '@/components/popup-btn/ReceiverAddressEdit.vue';
const PURCHASE = Core.Const.PURCHASE;
export default {
    name: 'ItemSettle',
    components: { ReceiverAddressEdit },
    props: {},
    data() {
        return {
            // 加载
            orgId: Core.Data.getOrgId(),
            orgType: Core.Data.getOrgType(),
            loading: false, // 按钮防重复点击 loading
            PURCHASE,
            receiveList: [],
            flagPartShipmentList: PURCHASE.FLAG_PART_SHIPMENT_LIST, // 分批发货
            flagTransferList: PURCHASE.FLAG_TRANSFER_LIST, // 转运
            flagOrderTypeList: PURCHASE.FLAG_ORDER_TYPE_LIST, // 转运
            selectIndex: '',

            countryList: Core.Const.COUNTRY_LIST,
            editMode: false,
            form: {
                name: '',
                phone: '',
                country: undefined,
                province: '',
                city: '',
                county: '',
                address: '',
                email: '',
                flag_order_type: undefined,
                flag_part_shipment: undefined,
                flag_transfer: undefined,
            },
            defAddr: [],

            shopCartList: [],

            unit: '', // €、$
            currency: '', // EUR、USD
            priceKey: '', // purchase_price_eur
            unitMap: {
                '€': { key: '_eur', text: '€ (EUR)', currency: 'EUR' },
                $: { key: '_usd', text: '$ (USD)', currency: 'USD' },
            },
            selectedId: [],
        };
    },
    watch: {},
    computed: {
        sum_price() {
            let sum = 0;
            for (const item of this.shopCartList) {
                sum += item?.item[this.$Util.Number.getStepPriceIndexByNums(item.amount)] * item.amount;
            }
            return Core.Util.countFilter(sum);
        },
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {
        this.unit = this.$route.params.unit || '€';
        let currency = this.$route.params.currency || '_eur';
        this.selectedId = Core.Data.getCartData();
        this.priceKey = (this.$auth('DISTRIBUTOR') ? 'fob' : 'purchase_price') + currency;
        this.currency = currency ? currency.slice(1).toUpperCase() : 'CNY';
        if (Core.Data.getCurrency() === 'EUR') {
            this.handleUnitChange('€');
        } else {
            this.handleUnitChange('$');
        }
        this.getReceiveList();
        this.getShopCartList();
    },
    methods: {
        routerChange(type, item) {
            let routeUrl;
            switch (type) {
                case 'back':
                    this.$router.go(-1);
                    break;
                case 'order': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/purchase/purchase-order-self',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        // 获取已保存的 地址信息列表
        getReceiveList() {
            Core.Api.Receive.list().then(res => {
                this.receiveList = res.list;
                // this.editMode = res.list.length ? false : true
            });
        },
        // 获取购物车列表
        getShopCartList() {
            Core.Api.ShopCart.list().then(res => {
                res.list.forEach(item => {
                    let element = item.item || {};
                    if (element.attr_list && element.attr_list.length) {
                        let str = element.attr_list.map(i => i.value).join(' ');
                        element.attr_str = str;
                        let str_en = element.attr_list.map(i => i.value_en).join(' ');
                        element.attr_str_en = str_en;
                    }
                });
                this.shopCartList = res.list.filter(item => this.selectedId.indexOf(item.id) !== -1);
            });
        },

        handleUnitChange(val) {
            let item = this.unitMap[val];
            this.priceKey = (this.$auth('DISTRIBUTOR') ? 'fob' : 'purchase_price') + item.key;
            this.currency = item.currency;
        },

        handleAddressSelect(address = []) {
            this.form.province = address[0];
            this.form.city = address[1];
            this.form.county = address[2];
        },

        // 切换到编辑状态
        handleConfigEdit(item) {
            if (item) {
                this.form = Core.Util.deepCopy(item);
                this.defAddr = [item.province, item.city, item.county];
            } else {
                Object.assign(this.form, this.$options.data().form);
                this.defAddr = [];
            }
            this.editMode = true;
        },
        // 取消编辑
        handleConfigCancel() {
            this.editMode = false;
            Object.assign(this.form, this.$options.data().form);
        },
        // 删除配置
        handleConfigDelete(item) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.Receive.delete({ id: item.id })
                        .then(() => {
                            if (item.id === _this.selectIndex) {
                                _this.selectIndex = '';
                            }
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.getReceiveList();
                        })
                        .catch(err => {
                            console.log('handleConfigDelete err', err);
                        });
                },
            });
        },
        // 保存配置
        handleConfigSave() {
            let form = Core.Util.deepCopy(this.form);
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.phone) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.province || !form.city || !form.county || !form.address) {
                return this.$message.warning(this.$t('def.enter'));
            }
            this.loading = true;
            Core.Api.Receive.save(form)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.getReceiveList();
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // 选择配置
        handleConfigSelect(item) {
            this.selectIndex = item.id;
        },

        // 创建订单
        handleCreateOrder() {
            if (!this.selectIndex) {
                return this.$message.warning(this.$t('def.enter'));
            }

            if (this.$auth('DISTRIBUTOR') && !this.form.flag_part_shipment) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (this.$auth('DISTRIBUTOR') && !this.form.flag_transfer) {
                return this.$message.warning(this.$t('def.enter'));
            }
            const parms = {
                price: Math.round(this.sum_price * 100),
                charge: Math.round(this.sum_price * 100),
                remark: '',
                type: this.form.flag_order_type,
                receive_info_id: this.selectIndex,
                currency: this.currency,
                flag_part_shipment: this.form.flag_part_shipment,
                item_list: this.shopCartList.map(item => ({
                    item_code: item.item.item_code,
                    type: item.item.type,
                    amount: item.amount,
                    item_id: item.item_id,
                    charge: item.amount * item?.item[this.$Util.Number.getStepPriceIndexByNums(item.amount)],
                    price: item.amount * item?.item[this.$Util.Number.getStepPriceIndexByNums(item.amount)],
                    unit_price: item?.item[this.$Util.Number.getStepPriceIndexByNums(item.amount)],
                    remark: item.remark,
                })),
            };
            if (this.$auth('DISTRIBUTOR')) {
                parms['flag_part_shipment'] = this.form.flag_part_shipment;
                parms['flag_transfer'] = this.form.flag_transfer;
            }
            if (this.loading) return;
            this.loading = true;
            Core.Api.Purchase.create(parms)
                .then(res => {
                    let _this = this;
                    this.$message.success(_this.$t('i.order_success'));
                    this.routerChange('order');
                    Core.Data.clearCartData();
                    // this.handleClearShopCart()
                })
                .catch(err => {
                    console.log('handleCreateOrder err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleClearShopCart() {
            Core.Api.ShopCart.clear();
        },
    },
};
</script>

<style lang="less">
#ItemSettle {
    padding: 60px 105px 150px;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    .monetary-select {
        position: absolute;
        top: 60px;
        right: 105px;
        min-width: 126px;
        .ant-select-selector {
            border-color: #006ef9;
        }
        .ant-select-selection-item {
            color: #006ef9;
        }
    }
    .ant-btn-link,
    .edit-btn {
        color: #757575;
        border-bottom: 1px solid #757575;
        border-radius: 0;
        height: 22px;
        font-size: 14px;
        margin-bottom: 0;
        &:hover {
            opacity: 0.8;
        }
    }
    .ant-btn.orange {
        width: 112px;
        height: 40px;
        margin-top: 30px;
        background: #f4752e;
        border-radius: 2px;
        border-color: #f4752e;
    }
    .title-area {
        font-size: 24px;
        font-weight: 500;
        color: #111111;
        line-height: 28px;
        text-align: center;
        width: 100%;
        padding-bottom: 30px;
    }
    .config-list {
        width: 70%;
        box-sizing: border-box;
        padding-right: 40px;
        .config-item {
            + .config-item {
                margin-top: 30px;
            }
            .config-title {
                height: 56px;
                line-height: 56px;
                background: #f7f8fa;
                border-radius: 4px 4px 0px 0px;
                font-size: 20px;
                font-weight: 500;
                color: #252526;
                padding-left: 34px;
            }
            .config-content {
                box-sizing: border-box;
                padding: 32px 34px 30px;
                border: 1px solid #e6eaee;
                &.edit-mode {
                    .form-item.btn {
                        margin-top: 30px;
                        .value {
                            display: flex;
                            align-items: center;
                        }
                        .ant-btn-primary {
                            border-radius: 0;
                            height: 34px;
                        }
                    }
                }
                &.select-mode {
                    min-height: 428px;
                    overflow: auto;
                    .select-item {
                        .fsb();
                        cursor: pointer;
                        border-radius: 2px;
                        border: 1px solid #e5e8eb;
                        margin-bottom: 20px;
                        padding: 11px 20px;
                        box-sizing: border-box;
                        transition: border-color 0.3s ease;
                        .info {
                            width: calc(~'100% - 64px');
                            .fac();
                            .icon.i_point {
                                width: 30px;
                                box-sizing: border-box;
                                font-size: 16px;
                                padding-right: 16px;
                            }
                            .desc {
                                width: calc(~'100% - 30px');
                                font-size: 14px;
                                font-weight: 400;
                                p {
                                    .ell();
                                    color: #181818;
                                    line-height: 20px;
                                    + p {
                                        margin-top: 4px;
                                    }
                                }
                            }
                        }
                        .btn {
                            width: 64px;
                            .fac(flex-end);
                        }
                        &.active {
                            border-color: @BC_P;
                            .icon.i_point {
                                color: @TC_P;
                            }
                        }
                    }
                    .add {
                        display: flex;
                        justify-content: flex-end;
                        margin-bottom: 10px;
                    }
                }
                .radio-item {
                    + .radio-item {
                        margin-top: 12px;
                    }
                    .fac();
                    .desc {
                        position: relative;
                        font-size: 14px;
                        font-weight: 400;
                        color: #181818;
                        line-height: 20px;
                        //width: 100px;
                        // &:after {
                        //     content: ':';
                        //     position: absolute;
                        //     top: 0;
                        //     right: 0;
                        // }
                    }
                }
            }
        }
    }
    .settel-item {
        width: 30%;
        .item-title {
            height: 56px;
            line-height: 56px;
            background: #f8fafc;
            font-size: 20px;
            font-weight: 500;
            color: #252526;
            padding: 0 20px;
            .fsb();
        }
        .item-content {
            border: 1px solid #e6eaee;
            padding: 22px 20px 32px;
        }
        .price-item {
            width: 100%;
            .fsb();
            font-size: 14px;
            color: #111111;
            line-height: 20px;
            margin-bottom: 4px;
            &.sum {
                line-height: 22px;
                margin: 10px 0 0;
                padding-bottom: 22px;
                border-bottom: 1px solid #e6eaee;
                p {
                    font-size: 16px;
                    color: #000000;
                    font-weight: 500;
                }
                span {
                    color: #f4752e;
                }
            }
        }
        .sub-title {
            font-size: 16px;
            font-weight: 500;
            color: #111111;
            line-height: 19px;
            padding: 20px 0 24px;
        }
        .item-item {
            display: flex;
            margin-bottom: 40px;
            .cover {
                width: 60px;
                height: 60px;
                background: #f3f3f3;
            }
            .info {
                width: calc(~'100% - 60px');
                padding-left: 20px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                line-height: 20px;
                font-size: 14px;
                p {
                    color: #111111;
                    margin-bottom: 6px;
                }
                span {
                    color: #757575;
                }
            }
        }
    }
}
</style>
