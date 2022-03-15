<template>
<div id="ItemSettle" class="list-container">
    <div class="title-area">结算</div>
    <div class="config-list">
        <div class="config-item receive">
            <div class="config-title">1.配送选项</div>
            <div class="config-content edit-mode" v-if="editMode">
                <div class="form-item required">
                    <div class="key">姓名</div>
                    <div class="value">
                        <a-input v-model:value="form.name" placeholder="请输入收货人姓名"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">手机号码</div>
                    <div class="value">
                        <a-input v-model:value="form.phone" placeholder="请输入收货人手机号码"/>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">国家/地区</div>
                    <div class="value">
                        <a-select placeholder="请选择国家" v-model:value="form.country" show-search option-filter-prop="children" allow-clear>
                            <a-select-option v-for="(item,index) of countryList" :key="index" :value="item.name">{{item.name}}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">收货地址</div>
                    <div class="value">
                        <AddressCascader @change='handleAddressSelect' :default-address='[form.province, form.city, form.county]'/>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key"></div>
                    <div class="value">
                        <a-input v-model:value="form.address" placeholder="请输入详细地址"/>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">邮箱地址</div>
                    <div class="value">
                        <a-input v-model:value="form.email" placeholder="请输入收货人邮箱"/>
                    </div>
                </div>
                <div class="form-item btn">
                    <div class="key"></div>
                    <div class="value">
                        <a-button type="primary" @click="handleConfigSave">保存并继续</a-button>
                        <a-button type="link" @click="handleConfigCancel" v-if="receiveList.length">取消编辑</a-button>
                    </div>
                </div>
            </div>
            <div class="config-content select-mode" v-else>
                <div class="select-item" :class="selectIndex === item.id ? 'active' : ''"
                    v-for="item of receiveList" :key='item.id' @click="handleConfigSelect(item)">
                    <div class="info">
                        <i class="icon i_point"/>
                        <div class="desc">
                            <p>{{item.name}} {{item.phone}}</p>
                            <p>{{item.email}}</p>
                            <p>{{item.province}} {{item.city}} {{item.county}} {{item.address}}</p>
                        </div>
                    </div>
                    <div class="btn">
                        <a-button type="link" @click.stop="handleConfigEdit(item)">编辑</a-button>
                        <a-button type="link" @click.stop="handleConfigDelete(item)">删除</a-button>
                    </div>
                </div>
                <div class="add">
                    <a-button type="link" @click="handleConfigEdit()">添加新地址</a-button>
                </div>
                <a-button type="primary" class="orange" @click="handleCreateOrder()">下单</a-button>
            </div>
        </div>
        <div class="config-item pay">
            <div class="config-title">2.付款</div>
            <!-- <div class="config-content"></div> -->
        </div>
    </div>
    <div class="settel-item">
        <div class="item-title">
            <span>在您的购物车中</span>
            <a-button type="link" @click="routerChange('back')">编辑</a-button>
        </div>
        <div class="item-content">
            <div class="price-item" v-for="item of shopCartList" :key="item.id">
                <p class="name">{{item.item ? item.item.name : '-'}}</p>
                <span class="price">{{unit}} {{$Util.countFilter(item.item[priceKey] * item.amount)}}
                </span>
            </div>
            <div class="price-item sum">
                <p class="name">总计</p>
                <span class="price">{{unit}} {{sum_price}}</span>
            </div>
            <div class="sub-title">预计送达</div>
            <div class="item-item" v-for="item of shopCartList" :key="item.id">
                <img class="cover" :src="$Util.imageFilter(item.item ? item.item.logo : '', 2)" />
                <div class="info">
                    <p>{{item.item ? item.item.name : '-'}}</p>
                    <span>编号：{{item.item ? item.item.code : '-'}}</span>
                    <span v-if="item.item && item.item.attr_str">规格：{{item.item ? item.item.attr_str : '-'}}</span>
                    <span>数量：{{item.amount}}</span>
                    <span>单价：{{unit}} {{$Util.countFilter(item.item[priceKey])}}</span>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Core from '../../core';

import AddressCascader from '../../components/common/AddressCascader.vue'
export default {
    name: 'ItemSettle',
    components: { AddressCascader },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            receiveList: [],
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
            },

            shopCartList: [],

            unit: '', // €、$
            currency: '', // EUR、USD
            priceKey: '', // purchase_price_eur
        };
    },
    watch: {},
    computed: {
        sum_price() {
            let sum = 0
            for (const item of this.shopCartList) {
                sum += item.item[this.priceKey] * item.amount
            }
            return Core.Util.countFilter(sum)
        }
    },
    mounted() {
        this.unit = this.$route.query.unit
        let currency = this.$route.query.currency;
        this.priceKey = 'purchase_price' + currency
        this.currency = currency ? currency.slice(1).toUpperCase() : 'CNY'

        this.getReceiveList()
        this.getShopCartList()
    },
    methods: {
        routerChange(type, item) {
            let routeUrl
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
                case 'order':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/purchase/purchase-order-self",
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        // 获取已保存的 地址信息列表
        getReceiveList() {
            Core.Api.Receive.list().then(res => {
                console.log('res:', res)
                this.receiveList = res.list
                this.editMode = res.list.length ? false : true
            })
        },
        // 获取购物车列表
        getShopCartList() {
            Core.Api.ShopCart.list().then(res => {
                console.log('getShopCartList res:', res)
                res.list.forEach(item => {
                    let element = item.item || {}
                    if (element.attr_list && element.attr_list.length) {
                        let str = element.attr_list.map(i => i.value).join(' ')
                        element.attr_str = str
                    }
                })
                this.shopCartList = res.list
            })
        },

        handleAddressSelect(address = []) {
            this.form.province = address[0]
            this.form.city = address[1]
            this.form.county = address[2]
        },

        // 切换到编辑状态
        handleConfigEdit(item) {
            console.log('handleConfigEdit item:', item)
            if (item) {
                this.form = Core.Util.deepCopy(item)
            } else {
                Object.assign(this.form, this.$options.data().form)
            }
            this.editMode = true
        },
        // 取消编辑
        handleConfigCancel() {
            this.editMode = false
            Object.assign(this.form, this.$options.data().form)
        },
        // 删除配置
        handleConfigDelete(item) {
            let _this = this
            this.$confirm({
                title: '确定要删除该配送选项吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Receive.delete({id: item.id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getReceiveList();
                    }).catch(err => {
                        console.log("handleConfigDelete err", err);
                    })
                },
            });
        },
        // 保存配置
        handleConfigSave() {
            let form = Core.Util.deepCopy(this.form)
            if (!form.name) {
                return this.$message.warning('请输入收货人姓名')
            }
            if (!form.phone) {
                return this.$message.warning('请输入收货人联系方式')
            }
            if (!form.province || !form.city || !form.county || !form.address) {
                return this.$message.warning('请输入收货地址')
            }
            this.loading = true
            Core.Api.Receive.save(form).then(() => {
                this.$message.success('保存成功')
                this.getReceiveList();
            }).finally(() => {
                this.loading = false
            })
        },

        // 选择配置
        handleConfigSelect(item) {
            this.selectIndex = item.id
        },

        // 创建订单
        handleCreateOrder() {
            if (!this.selectIndex) {
                return this.$message.warning('请选择本次下单的配送选项')
            }
            Core.Api.Purchase.create({
                price: Math.round(this.sum_price * 100),
                charge: Math.round(this.sum_price * 100),
                remark: '',
                receive_info_id: this.selectIndex,
                currency: this.currency,
                item_list: this.shopCartList.map(item => ({
                    item_code: item.item.item_code,
                    amount: item.amount,
                    item_id: item.item_id,
                    charge: item.amount * item.item[this.priceKey],
                    price: item.amount * item.item[this.priceKey],
                    unit_price: item.item[this.priceKey],
                }))
            }).then(res => {
                this.$message.success('下单成功');
                this.routerChange('order');
                this.handleClearShopCart()
            })
        },
        handleClearShopCart() {
            Core.Api.ShopCart.clear()
        }
    }
};
</script>

<style lang="less" scoped>
#ItemSettle {
    padding: 60px 105px 150px;
    display: flex;
    flex-wrap: wrap;
    .ant-btn-link {
        color: #757575;
        border-bottom: 1px solid #757575;
        border-radius: 0;
        height: 22px;
        &:hover {
            opacity: 0.8;
        }
    }
    .ant-btn.orange {
        width: 112px;
        height: 40px;
        background: #F4752E;
        border-radius: 2px;
        border-color: #F4752E;
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
                background: #F7F8FA;
                border-radius: 4px 4px 0px 0px;
                font-size: 20px;
                font-weight: 500;
                color: #252526;
                padding-left: 34px;
            }
            .config-content {
                box-sizing: border-box;
                padding: 32px 34px 30px;
                border: 1px solid #E6EAEE;
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
                        border: 1px solid #E5E8EB;
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
            }
        }
    }
    .settel-item {
        width: 30%;
        .item-title {
            height: 56px;
            line-height: 56px;
            background: #F8FAFC;
            font-size: 20px;
            font-weight: 500;
            color: #252526;
            padding: 0 20px;
            .fsb();
        }
        .item-content {
            border: 1px solid #E6EAEE;
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
                border-bottom: 1px solid #E6EAEE;
                p {
                    font-size: 16px;
                    color: #000000;
                    font-weight: 500;
                }
                span {
                    color: #F4752E;
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
                background: #F3F3F3;
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