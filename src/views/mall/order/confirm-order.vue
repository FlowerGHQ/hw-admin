<template>
    <div id="ItemSettle">
        <div class="content">
            <!-- 确认订单信息 -->
            <p class="title">{{ $t('mall.confirm_order_information') }}</p>
            <div class="box">
                <OrderInformation :list="shopCartList" :unit="unit" />
            </div>
            <!-- 收货地址 -->
            <p class="title required">
                {{ $t('mall.receiving_address') }}
                <MyButton type="line" padding="8px">
                    <ReceiverAddressEdit
                        :orgId="orgId"
                        :orgType="orgType"
                        btnClass="add-btn"
                        @submit="getReceiveList"
                        >{{ $t('i.new_address') }}</ReceiverAddressEdit
                    >
                </MyButton>
            </p>
            <div class="box select">
                <div
                    class="select-item"
                    :class="selectIndex === item.id ? 'active' : ''"
                    v-for="item of receiveList"
                    :key="item.id"
                    @click="handleConfigSelect(item)"
                >
                    <div class="info">
                        <div class="desc">
                            <p class="name">{{ item.name }}</p>
                            <p class="email"><img src="@images/mall/order/email.png" />{{ item.email || '-' }}</p>
                            <p class="phone"><img src="@images/mall/order/phone.png" />{{ item.phone || '-' }}</p>
                        </div>
                        <p class="address" v-if="$i18n.locale === 'zh'">
                            {{ item.country }} {{ item.province }} {{ item.city }} {{ item.county }}
                            {{ item.address }}
                        </p>
                        <p class="address" v-if="$i18n.locale === 'en'">
                            {{ item.country_en }} {{ item.province_en }} {{ item.city_en }} {{ item.county }}
                            {{ item.address }}
                        </p>
                    </div>
                    <div class="btn">
                        <ReceiverAddressEdit
                            :detail="item"
                            :orgId="orgId"
                            :orgType="orgType"
                            btnClass="edit-btn"
                            @submit="getReceiveList"
                            >{{ $t('def.edit') }}</ReceiverAddressEdit
                        >
                        <a-button type="link" class="delete" @click.stop="handleConfigDelete(item)">{{
                            $t('def.delete')
                        }}</a-button>
                    </div>
                </div>
            </div>
            <!-- 运输信息 -->
            <p class="title">{{ $t('mall.transportation_information') }}</p>
            <div class="box transport">
                <div class="key-value">
                    <div class="key required">{{ $t('mall.allowed_batch') }}:</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.flag_part_shipment">
                            <a-radio v-for="item in flagPartShipmentList" :value="item.value">
                                {{ $t(item.nameLang) }}
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="key-value">
                    <div class="key required">{{ $t('mall.forwarding_allowed') }}:</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.flag_transfer">
                            <a-radio v-for="item in flagTransferList" :value="item.value">
                                {{ $t(item.nameLang) }}
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <!-- <div class="key-value">
                    <div class="key">{{ $t('mall.insured') }}:</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.insured">
                            <a-radio v-for="item in INSURED" :value="item.value">
                                {{ $t(item.nameLang) }}
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div> -->
                <div class="key-value">
                    <div class="key required">{{ $t('mall.flag_pallet') }}:</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.flag_pallet">
                            <a-radio v-for="item in PALLETIZE" :value="item.value">
                                {{ $t(item.nameLang) }}
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="key-value">
                    <div class="key required">
                        {{ $t('mall.expected_delivery') }}:<a-tooltip>
                            <template #title>{{ $t('mall.calculation') }}</template>
                            <img class="tips" src="@images/mall/order/tips.png" />
                        </a-tooltip>
                    </div>
                    <div class="value">
                        <a-date-picker
                            v-model:value="form.deliver_time_expected"
                            :placeholder="$t('mall.select_date')"
                        />
                    </div>
                </div>
            </div>
        </div>
        <!-- 底部支付栏 -->
        <div class="settlement-fixed">
            <div class="settlement-fixed-body">
                <div class="sub-price">
                    <p class="sub-price-item">
                        <span>{{ $t('mall.whole_vehicle_orders') }}：</span>
                        <span>{{ unit }} {{ $Util.Number.numFormat(car_price) }}</span>
                    </p>
                    <p class="sub-price-item">
                        <span>{{ $t('mall.accessory_order') }}：</span>
                        <span>{{ unit }} {{ $Util.Number.numFormat(parts_price) }}</span>
                    </p>
                </div>
                <div class="settlement">
                    <div class="settlement-mes">
                        <div class="settlement-price">
                            <span class="dis"> {{ $t('mall.payable_amount') }}: </span>
                            <span class="price"> {{ unit }} {{ $Util.Number.numFormat(sum_price) }} </span>
                        </div>
                        <!-- 余额 -->
                        <p class="settlement-balance" v-if="org?.pay_type === Core.Const.DISTRIBUTOR.PAY_TIME.OA">
                            {{ $t('mall.credit_balance') }}: {{ unit }} {{ this.$Util.Number.numFormat(balance) }}
                        </p>
                    </div>
                    <my-button
                        showRightIcon
                        type="primary"
                        padding="12px 32px"
                        font="14px"
                        @click.native="handleCreateOrder"
                    >
                        {{ $t('mall.submit_order') }}
                    </my-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '@/core';

import ReceiverAddressEdit from '@/components/popup-btn/ReceiverAddressEdit.vue';
import MyButton from '../../../components/common/MyButton.vue';
import OrderInformation from './components/order-information.vue';
const PURCHASE = Core.Const.PURCHASE;
export default {
    name: 'ItemSettle',
    components: { ReceiverAddressEdit, MyButton, OrderInformation },
    data() {
        return {
            Core,
            // 加载
            orgId: Core.Data.getOrgId(),
            orgType: Core.Data.getOrgType(),
            loading: false, // 按钮防重复点击 loading
            PURCHASE,
            receiveList: [],
            TRANSFER_METHODS: PURCHASE.TRANSFER_METHODS, // 运输方式选项列表
            DESTINATION_PORT: PURCHASE.DESTINATION_PORT, // 目的港
            flagPartShipmentList: PURCHASE.FLAG_PART_SHIPMENT_LIST, // 分批发货
            flagTransferList: PURCHASE.FLAG_TRANSFER_LIST, // 转运
            INSURED: PURCHASE.INSURED, // 是否参保
            PALLETIZE: PURCHASE.PALLETIZE, // 是否打托
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
                flag_part_shipment: undefined, // 分批发货
                flag_transfer: undefined, // 转运
                // insured: undefined, // 是否参保
                flag_pallet: undefined, // 是否打托
                deliver_time_expected: undefined, // 期望交付时间
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
            value1: 'Apple',
            value2: '',
            plainOptions: ['Apple', 'Pear', 'Orange'],
            balance: 0,
            org: Core.Data.getOrgObj(),
        };
    },
    watch: {},
    computed: {
        car_price() {
            let sum = 0;
            for (const item of this.shopCartList) {
                if (item.item?.isGift) continue;
                if (item.item?.type !== 2) continue;
                sum += item?.item[this.$Util.Number.getStepPriceIndexByNums(item.amount)] * item.amount;
            }
            return Core.Util.countFilter(sum);
        },
        parts_price() {
            let sum = 0;
            for (const item of this.shopCartList) {
                if (item.item?.isGift) continue;
                if (item.item?.type === 2) continue;
                sum += item?.item[this.$Util.Number.getStepPriceIndexByNums(item.amount)] * item.amount;
            }
            return Core.Util.countFilter(sum);
        },
        sum_price() {
            let sum = 0;
            for (const item of this.shopCartList) {
                if (item.item?.isGift) continue;
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
        this.getWallet();
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
                // res.list = this.getVehicleListHasGift(res.list);// 获取赠品
                this.shopCartList = res.list.filter(item => this.selectedId.indexOf(item.id) !== -1);
                console.log(this.shopCartList);
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
        checkForm() {
            if (!this.selectIndex) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (this.$auth('DISTRIBUTOR') && !this.form.flag_part_shipment) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (this.$auth('DISTRIBUTOR') && !this.form.flag_transfer) {
                return this.$message.warning(this.$t('def.enter'));
            }
            // if (this.$auth('DISTRIBUTOR') && !this.form.insured) {
            //     return this.$message.warning(this.$t('def.enter'));
            // }
            if (this.$auth('DISTRIBUTOR') && !this.form.flag_pallet) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (this.$auth('DISTRIBUTOR') && !this.form.deliver_time_expected) {
                return this.$message.warning(this.$t('def.enter'));
            }
            return false;
        },
        // 创建订单
        handleCreateOrder() {
            if (this.checkForm()) return;
            const item_list = this.shopCartList.map(item => {
                if (!item.item?.isGift) {
                    return {
                        item_code: item.item.item_code,
                        type: item.item.type,
                        amount: item.amount,
                        item_id: item.item_id,
                        charge: item.amount * item?.item[this.$Util.Number.getStepPriceIndexByNums(item.amount)],
                        price: item.amount * item?.item[this.$Util.Number.getStepPriceIndexByNums(item.amount)],
                        unit_price: item?.item[this.$Util.Number.getStepPriceIndexByNums(item.amount)],
                        remark: item.remark,
                    };
                }
            });
            const parms = {
                price: Math.round(this.sum_price * 100),
                charge: Math.round(this.sum_price * 100),
                remark: '',
                type: this.form.flag_order_type,
                receive_info_id: this.selectIndex,
                currency: this.currency,
                flag_part_shipment: this.form.flag_part_shipment,
                item_list: item_list.filter(item => item),
            };
            if (this.$auth('DISTRIBUTOR')) {
                parms['flag_part_shipment'] = this.form.flag_part_shipment;
                parms['flag_transfer'] = this.form.flag_transfer;
                // parms['insured'] = this.form.insured;
                parms['flag_pallet'] = this.form.flag_pallet;
                parms['deliver_time_expected'] = Date.parse(this.form.deliver_time_expected) / 1000;
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
        // 获取包括礼物的列表
        getVehicleListHasGift(list) {
            const obj = Core.Util.deepCopy(list[2]);
            Object.assign(obj?.item, {
                isGift: true,
            });
            list[2].item.giftList = [obj, obj];
            list.forEach((item, index) => {
                if (item.item?.giftList && item.item?.giftList.length > 0) {
                    item.item?.giftList.forEach(iGift => {
                        Object.assign(iGift?.item, {
                            isGift: true,
                        });
                    });
                    list.splice(index + 1, 0, ...item.item?.giftList);
                }
            });
            return list;
        },
        getWallet() {
            const params = {
                org_id: this.orgId, //组织id
                org_type: this.orgType, //组织类型
                type: 40, //钱包类型：10.售前余额；20.售后余额；30.售后备件账户；40.授信账户
                currency_type: Core.Const.WALLET.TYPE[this.currency], //货币类型：1.人民币；2.欧元；3.美元；4.英镑
            };
            Core.Api.Purchase.getWallet(params)
                .then(res => {
                    this.balance = Core.Util.countFilter((res.detail.balance || 0) + Number(this.org.credit));
                })
                .catch(err => {
                    console.log('handleCreateOrder err', err);
                });
        },
    },
};
</script>

<style lang="scss" scoped src="../css/layout.css"></style>
<style lang="less">
#ItemSettle {
    min-height: calc(100vh - var(--header-h-pc-mall));
    display: flex;
    flex-wrap: wrap;
    position: relative;
    .content {
        padding-top: 48px;
    }
    .required {
        position: relative;
        &::after {
            content: '*';
            display: inline-block;
            color: #ff3636;
            position: absolute;
            top: 50%;
            left: -12px;
            transform: translateY(-30%);
            line-height: 1;
        }
    }
    .title {
        .flex(space-between, center, row);
        font-size: 24px;
        line-height: 24px;
        margin-bottom: 19px;
    }
    .box {
        background: #fff;
        margin-bottom: 43px;
        .ant-radio-group {
            .ant-radio-wrapper {
                font-size: 14px;
            }
            .ant-radio-inner {
                border-color: #e5e6eb;
                border-width: 2px;
            }
            .ant-radio-input:focus + .ant-radio-inner {
                box-shadow: 0 0 0 3px rgba(143, 0, 255, 0.1);
            }
            .ant-radio-checked .ant-radio-inner {
                border-color: #8f00ff;
                border-width: 4px;
                &::after {
                    background: #fff;
                }
            }
        }
    }
    .add-btn {
        color: #7f7f7f;
    }
    .select {
        background: none;
    }
    .select-item {
        padding: 20px;
        background: #fff;
        .flex(space-between, center, row);
        &:nth-child(n + 2) {
            margin-top: 16px;
        }
        &.active {
            outline: 0.5px solid #8f00ff;
        }
        .info {
            .desc {
                .flex(initial, center, row);
                .name {
                    font-size: 18px;
                    font-weight: 600;
                    line-height: 27px;
                    color: #1d2129;
                }
                .email {
                    margin-left: 12px;
                    .flex(initial, center, row);
                    > img {
                        margin-right: 7px;
                        height: 12px;
                    }
                }
                .phone {
                    margin-left: 12px;
                    .flex(initial, center, row);
                    > img {
                        margin-right: 7px;
                        height: 12px;
                    }
                }
            }
            .address {
                margin-top: 4px;
                font-size: 14px;
                font-weight: 400;
                line-height: 20px;
                color: #4e5969;
            }
        }
        .delete {
            color: #f53f3f;
            margin-left: 8px;
        }
    }
    .transport {
        .flex(initial, center, row);
        flex-wrap: wrap;
        padding: 20px 20px 0 20px;
        .key-value {
            .flex(initial, center, row);
            margin-bottom: 20px;
            margin-right: 60px;
            &:last-child {
                margin-right: 0;
            }
            .key {
                margin-right: 16px;
                .tips {
                    margin-left: 4px;
                    width: 13.3px;
                    height: 13.3px;
                }
            }
        }
    }

    .settlement-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #fff;
        border-top: 1px solid #e5e6eb;
        z-index: 999;

        .settlement-fixed-body {
            height: 72px;
            width: 75%;
            margin: 0 auto;
            padding: 12px 0;
            padding-left: 24px;
            .flex(space-between, center, row);

            .sub-price {
                .flex(initial, center, row);
                flex-wrap: wrap;
                .sub-price-item {
                    margin-right: 32px;
                    > span {
                        &:nth-of-type(1) {
                            font-size: 14px;
                            font-weight: 400;
                            line-height: 20px;
                            color: #86909c;
                        }
                        &:nth-of-type(2) {
                            font-size: 14px;
                            font-weight: 400;
                            line-height: 20px;
                            color: #1d2129;
                        }
                    }
                }
            }

            .settlement {
                .flex(initial, center, row);
                .settlement-mes {
                    margin-right: 24px;
                    .settlement-price {
                        .flex(initial, center, row);
                    }
                }
                .settlement-balance {
                    line-height: 21px;
                    color: #666666;
                    text-align: right;
                    &.warn {
                        color: #ff3636;
                    }
                }
                .select-nums {
                    color: #000;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 24px;
                    margin-right: 24px;

                    .nums {
                        background: linear-gradient(100deg, #c6f 0%, #66f 100%);
                        background-clip: text;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                }

                .dis {
                    color: #000;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 24px;
                    white-space: nowrap;
                    margin-right: 8px;
                }

                .price {
                    color: #ff3636;
                    font-size: 24px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 29px;
                    white-space: nowrap;
                }
            }
        }
    }
}
</style>
