<template>
    <div id="ItemCollect" class="list-container">
        <a-button type="primary" class="monetary-export" @click="handleExport"
            ><i class="icon i_download" />{{ $t('i.download_the_template') }}</a-button
        >
        <a-upload
            name="file"
            class="monetary-upload"
            :file-list="upload.fileList"
            :action="upload.action"
            :show-upload-list="false"
            :headers="upload.headers"
            :data="upload.data"
            accept=".xlsx,.xls"
            @change="handlePurchaseChange"
        >
            <a-button type="primary" ghost class="file-upload-btn">
                <i class="icon i_add" /> {{ $t('i.bulk_import') }}
            </a-button>
        </a-upload>

        <div class="list-container shop-cart-container">
            <div class="title-area">
                <div class="shop-area">{{ $t('i.shopping') }}</div>
                <div class="shop-right">
                    <a-button type="link" @click="handleClearShopCart">{{ $t('i.clear_shop_car') }}</a-button>
                </div>
            </div>
            <div class="list-content">
                <div class="list-item" v-for="item of shopCartList" :key="item.id">
                    <img class="cover" :src="$Util.imageFilter(item.item ? item.item.logo : '', 2)" />
                    <div class="info">
                        <div class="name" v-if="lang == 'zh'" @click="routerChange('detail', item.item)">
                            {{ item.item ? (lang == 'zh' ? item.item.name : item.item.name_en) : '-' }}
                        </div>
                        <div class="name" v-else @click="routerChange('detail', item.item)">
                            {{
                                item.item?.material?.name_en
                                    ? item.item?.material?.name_en
                                    : item.item?.name_en
                                      ? item.item?.name_en
                                      : '-'
                            }}
                        </div>
                        <div class="sub">{{ item.item ? item.item.code : '-' }}</div>
                        <div class="spec" v-if="item.item && item.item.attr_list">
                            <span>{{ $t('i.spec') }}：</span>{{ $Util.itemSpecFilter(item.item.attr_list, lang) }}
                        </div>
                        <span class="count" v-if="!item.editMode" @click="handleCountEditShow(item)"
                            >x{{ item.amount }}</span
                        >
                        <div class="count-edit" v-else>
                            <a-input-number
                                v-model:value="editCount"
                                :min="1"
                                :precision="0"
                                autofocus
                                @blur="handleCountEditBlur(item)"
                            />
                        </div>
                        <div v-if="!item.editRemark" @click="handleRemarkEditShow(item)" class="remark">
                            {{ $t('i.remark') }}：{{ item.remark }}
                        </div>
                        <a-form v-else :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-form-item :label="$t('i.remark')">
                                <a-input v-model:value="editRemark" @blur="handleRemarkEditBlur(item)" />
                            </a-form-item>
                        </a-form>
                        <div class="btns">
                            <a-button type="link" class="disabled" v-if="item.item && item.item.in_favorite">{{
                                $t('i.favorited')
                            }}</a-button>
                            <a-button type="link" @click="handleMoveToFavorite(item)" v-else>{{
                                $t('i.move')
                            }}</a-button>
                            <a-button type="link" @click="handleShopCartRemove(item)">{{ $t('def.delete') }}</a-button>
                        </div>
                    </div>
                    <div class="price">
                        {{ currency }}
                        {{ $Util.countFilter(item.item ? item.item[priceKey + unitMap[currency].key] : item.price) }}
                    </div>
                </div>
                <SimpleImageEmpty v-if="!shopCartList.length" :desc="$t('i.no_item_cart')" />
            </div>
            <div class="settle-content" v-if="shopCartList.length">
                <div class="title-area">{{ $t('i.summary') }}</div>
                <div class="settle-item top">
                    <p class="name">{{ $t('n.name') }}</p>
                    <span class="price">{{ $t('i.amount') }}</span>
                    <span class="price">{{ $t('i.unit_price') }}</span>
                    <span class="price">{{ $t('i.total_price') }}</span>
                </div>
                <div class="settle-item" v-for="item of shopCartList" :key="item.id">
                    <div class="name">
                        {{ item.item ? (lang == 'zh' ? item.item.name : item.item.name_en) : '-' }}
                    </div>
                    <span class="price">{{ item.amount }}{{ $t('i.pcs') }}</span>
                    <span class="price"
                        >{{ currency }}
                        {{ item.item ? $Util.countFilter(item.item[priceKey + unitMap[currency].key]) : '-' }}</span
                    >
                    <span class="price"
                        >{{ currency }}
                        {{
                            item.item
                                ? $Util.countFilter(item?.item[priceKey + unitMap[currency].key] * item.amount)
                                : '-'
                        }}</span
                    >
                </div>

                <div class="settle-item sum">
                    <p class="name">{{ $t('p.total') }}</p>
                    <span class="price">{{ currency }} {{ sum_price }}</span>
                </div>
                <a-button type="primary" ghost @click="settle('settle')">{{ $t('i.settle') }}</a-button>
            </div>
        </div>
        <div class="list-container favorite-container">
            <div class="title-area">{{ $t('i.favorite') }}</div>
            <div class="list-content">
                <div class="list-item" v-for="item of favoriteList" :key="item.id">
                    <img class="cover" :src="$Util.imageFilter(item.item ? item.item?.logo : '', 2)" />
                    <div class="info">
                        <div class="name" v-if="lang == 'zh'" @click="routerChange('detail', item.item)">
                            {{ item.item ? (lang == 'zh' ? item.item.name : item.item.name_en) : '-' }}
                        </div>
                        <div class="name" v-else @click="routerChange('detail', item.item)">
                            {{
                                item.item?.material?.name_en
                                    ? item.item?.material?.name_en
                                    : item.item?.name_en
                                      ? item.item?.name_en
                                      : '-'
                            }}
                        </div>
                        <div class="sub">{{ item.item ? item.item?.code : '-' }}</div>
                        <div class="spec" v-if="item.item && item.item?.attr_list">
                            <span>{{ $t('i.spec') }}：</span>{{ $Util.itemSpecFilter(item.item?.attr_list, lang) }}
                        </div>
                        <div></div>
                        <!-- 调整结构用 不要删 -->
                        <div></div>
                        <div class="btns">
                            <a-button type="link" @click="handleFavoriteRemove(item)">{{ $t('def.delete') }}</a-button>
                            <a-button
                                type="primary"
                                ghost
                                v-if="item?.item?.status !== -1"
                                @click="handleMoveToShopCart(item)"
                                >{{ $t('i.cart') }}</a-button
                            >
                        </div>
                    </div>
                    <div class="price">
                        {{ currency }}
                        {{ $Util.countFilter(item.item ? item.item[priceKey + unitMap[currency].key] : item.price) }}
                    </div>
                </div>
                <SimpleImageEmpty v-if="!favoriteList.length" :desc="$t('i.no_item_favorites')" />
            </div>
        </div>
    </div>
</template>

<script>
import SimpleImageEmpty from '../../components/common/SimpleImageEmpty.vue';
import Core from '../../core';

export default {
    name: 'ItemCollect',
    components: { SimpleImageEmpty },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            editCount: '',
            editRemark: '',
            // 商品详情
            detail: {},
            shopCartList: [],
            favoriteList: [],

            unitMap: {
                // "￥": { key: '', text: '￥ (CNY)'},
                '€': { key: '_eur', text: '€ (EUR)' },
                $: { key: '_usd', text: '$ (USD)' },
                // "£": { key: '_gbp', text: '£ (GBP)'},
            },
            currency: '',
            mark: '',
            // 上传
            upload: {
                action: Core.Const.NET.URL_POINT + '/store/1/shopping-cart/import',
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'xlsx',
                },
            },

            //  备注
            labelCol: { style: { width: '40px' } },
            wrapperCol: { span: 14 },
            paramPrice: false,
        };
    },
    watch: {},
    computed: {
        priceKey() {
            let priceKey = this.$auth('DISTRIBUTOR') ? 'fob' : 'purchase_price';
            return priceKey;
        },
        sum_price() {
            let sum = 0;
            let key = this.priceKey + this.unitMap[this.currency].key;
            for (const item of this.shopCartList) {
                if (item.item) {
                    sum += item.item[key] * item.amount;
                }
            }
            return Core.Util.countFilter(sum);
        },
        lang() {
            return this.$store.state.lang;
        },
    },
    created() {
        this.currency = Core.Data.getCurrency();
    },
    mounted() {
        if (Core.Data.getCurrency() === 'EUR') {
            this.currency = '€';
            this.paramPrice = false;
        } else {
            this.currency = '$';
            this.paramPrice = true;
        }

        this.getList();
    },
    methods: {
        routerChange(type, item) {
            let routeUrl;
            switch (type) {
                case 'settle': // 结算
                    routeUrl = this.$router.resolve({
                        path: '/mall/confirm-order',
                        query: {
                            unit: this.currency,
                            currency: this.unitMap[this.currency].key,
                        },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/purchase/item-display',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        settle() {
            for (const it of this.shopCartList) {
                if (it.item[this.priceKey + this.unitMap[this.currency].key] === 0) {
                    this.$message.error(this.$t('p.item_error'));
                    return;
                }
                this.shopCartList.forEach(val => {
                    if (val.item.status !== 0) {
                        this.getShopCartList();
                        return this.$message.warn(this.$t('p.item_msg_err'));
                    }
                });
            }

            var routeUrl = this.$router.resolve({
                path: '/mall/confirm-order',
                query: {
                    unit: this.currency,
                    currency: this.unitMap[this.currency].key,
                },
            });
            window.open(routeUrl.href, '_self');
        },

        getList() {
            this.getShopCartList();
            this.getFavoriteList();
        },
        getShopCartList() {
            Core.Api.ShopCart.list().then(res => {
                this.shopCartList = res.list;
            });
        },
        getFavoriteList() {
            Core.Api.Favorite.list().then(res => {
                this.favoriteList = res.list;
            });
        },
        handleCountEditShow(item) {
            item.editMode = !item.editMode;
            this.editCount = item.amount;
        },
        handleCountEditBlur(item) {
            if (this.editCount === item.amount) {
                return;
            }
            let _item = Core.Util.deepCopy(item);
            _item.amount = this.editCount;
            Core.Api.ShopCart.save(_item)
                .then(res => {
                    this.getShopCartList();
                })
                .finally(() => {
                    this.editCount = '';
                });
        },

        //修改备注
        handleRemarkEditShow(item) {
            item.editRemark = !item.editRemark;
            this.editRemark = item.remark;
        },
        handleRemarkEditBlur(item) {
            let _item = Core.Util.deepCopy(item);
            _item.remark = this.editRemark;
            Core.Api.ShopCart.remark({
                id: _item.id,
                remark: _item.remark,
            })
                .then(res => {
                    this.getShopCartList();
                })
                .finally(() => {
                    this.editRemark = '';
                });
        },

        // 从购物车移至收藏
        handleMoveToFavorite(item) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.move_favorites'),
                okText: _this.$t('def.sure'),
                cancelText: _this.$t('def.cancel'),
                async onOk() {
                    try {
                        if (!_this.paramPrice) {
                            await Core.Api.Favorite.add({ item_id: item.item_id, price: item?.item?.fob_eur });
                        } else {
                            await Core.Api.Favorite.add({ item_id: item.item_id, price: item?.item?.fob_usd });
                        }
                        // await Core.Api.ShopCart.remove({id: item.id})
                        _this.$message.success(_this.$t('pop_up.operate'));
                    } catch (err) {
                        console.log('handleMoveToFavorite err:', err);
                    } finally {
                        _this.getList();
                    }
                },
            });
        },
        // 从收藏夹添加到购物车
        handleMoveToShopCart(item) {
            Core.Api.ShopCart.save({
                item_id: item.item_id,
                amount: 1,
                price: item.price,
            }).then(res => {
                this.$message.success(this.$t('pop_up.add'));
                this.getList();
            });
        },
        // 从收藏夹移出
        handleFavoriteRemove(item) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.item_favorites'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.Favorite.remove({ id: item.id }).then(() => {
                        _this.$message.success(_this.$t('pop_up.move'));
                        _this.getList();
                    });
                },
            });
        },
        // 从购物车移出
        handleShopCartRemove(item) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.item'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.ShopCart.remove({ id: item.id }).then(() => {
                        _this.$message.success(_this.$t('pop_up.move'));
                        _this.getList();
                        _this.getShopCartList(); // 更新
                    });
                },
            });
        },
        // 上传文件
        handlePurchaseChange({ file, fileList }) {
            let _this = this;
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    _this.getList();
                    return this.$message.error(file.response.message);
                } else {
                    _this.getList();
                    return this.$message.success($t('i.uploaded'));
                }
            }
            this.upload.fileList = fileList;
        },
        handleExport() {
            // 确认购物车模版是否导出
            let _this = this;
            this.$confirm({
                title: _this.$t('i.sure_export'),
                okText: _this.$t('def.sure'),
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    _this.handleCollectExport();
                },
            });
        },
        handleCollectExport() {
            // 订单导出
            this.exportDisabled = true;
            let exportUrl = Core.Api.Export.ItemCollectExport({
                locale: this.$i18n.locale,
            });
            window.open(exportUrl, '_blank');
            this.exportDisabled = false;
        },
        handleClearShopCart() {
            let _this = this;
            Core.Api.ShopCart.clear().then(() => {
                _this.$message.success(_this.$t('i.clear_shop_car'));
                _this.getList();
            });
        },
    },
};
</script>

<style lang="less">
.ant-form {
    width: 100%;
}
.ant-form-item {
    margin: 0;
}
.ant-input {
    border: none;
    border-radius: 0px !important;
    border-bottom: 1px solid #d9d9d9;
}
.ant-input:hover {
    border-color: #fff;
    border-bottom-color: #d9d9d9;
}
.ant-input:focus {
    border-color: #fff;
    border-bottom-color: #d9d9d9;
    box-shadow: none;
    outline: 0;
}
#ItemCollect {
    padding: 60px 56px 150px 48px;
    position: relative;
    .monetary-select {
        position: absolute;
        top: 28px;
        right: 28px;
        min-width: 126px;
        .ant-select-selector {
            border-color: #006ef9;
        }
        .ant-select-selection-item {
            color: #006ef9;
        }
    }
    .monetary-upload {
        position: absolute;
        top: 28px;
        right: 160px;
        min-width: 126px;
        .ant-select-selector {
            border-color: #006ef9;
        }
        .ant-select-selection-item {
            color: #006ef9;
        }
    }
    .monetary-export {
        position: absolute;
        top: 28px;
        right: 330px;
        min-width: 126px;
        .ant-select-selector {
            border-color: #006ef9;
        }
        .ant-select-selection-item {
            color: #006ef9;
        }
    }
    .list-container {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        + .list-container {
            margin-top: 76px;
        }
        .title-area {
            width: 72%;
            font-size: 24px;
            font-weight: 500;
            color: #111111;
            line-height: 28px;
            margin-bottom: 8px;
            box-sizing: border-box;
            padding-right: 10%;
            .shop-right {
                float: right;
            }
        }
        .list-content {
            width: 72%;
            box-sizing: border-box;
            padding-right: 10%;
            .list-item {
                width: 100%;
                padding: 22px 0 44px;
                border-bottom: 1px solid #e6eaee;
                display: flex;
                position: relative;
                .cover {
                    width: 150px;
                    height: 150px;
                    object-fit: cover;
                    margin-right: 30px;
                }
                .info {
                    width: calc(~'100% - 180px');
                    // height: 175px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: flex-start;
                    .name {
                        .ell();
                        max-width: calc(~'100% - 100px');
                        font-size: 16px;
                        font-weight: 500;
                        color: #111111;
                        line-height: 18px;
                        cursor: pointer;
                        transition: color 0.3s ease;
                        &:hover {
                            color: #006ef9;
                        }
                    }
                    .sub {
                        .ell();
                        width: 100%;
                        font-size: 14px;
                        font-weight: 400;
                        color: #757575;
                        line-height: 16px;
                        margin: 4px 0;
                    }
                    .spec {
                        display: inline-block;
                        color: #757575;
                        margin: 4px 0;
                        line-height: 26px;
                        height: auto;
                        font-size: 14px;
                        background: #f9f9f9;
                        border-radius: 2px;
                        padding: 0 10px;
                        span {
                            color: #111111;
                        }
                    }
                    .count {
                        .fcc();
                        cursor: pointer;
                        height: 28px;
                        padding: 0 8px;
                        border-radius: 6px;
                        border: 1px solid #e6eaee;
                        font-size: 14px;
                        font-weight: 400;
                        color: #111111;
                    }
                    .remark {
                        font-size: @fz_bs;
                        height: 31px;
                        line-height: 31px;
                    }
                }
                .price {
                    position: absolute;
                    top: 22px;
                    right: 0;
                    font-size: 16px;
                    font-weight: 400;
                    color: #111111;
                    line-height: 19px;
                }
                .btns {
                    .ant-btn-link {
                        color: #757575;
                        border-bottom: 1px solid #757575;
                        border-radius: 0;
                        height: 24px;
                        &:hover {
                            opacity: 0.8;
                        }
                        &.disabled {
                            border-color: transparent;
                            opacity: 0.8;
                            cursor: default;
                        }
                    }
                    .ant-btn-primary {
                        border-radius: 12px;
                        height: 42px;
                        padding: 4px 23px;
                    }
                }
            }
        }
        .settle-content {
            width: 28%;
            .title-area {
                font-size: 22px;
                color: #000000;
                line-height: 26px;
                margin-bottom: 24px;
                margin-top: 22px;
            }
            .settle-item {
                width: 100%;
                .fsb();
                font-size: 16px;
                color: #000000;
                line-height: 19px;
                margin: 8px 0;
                .name {
                    width: calc(~'100% - 100px');
                    .ell();
                    .fac();
                    .spec {
                        display: inline-block;
                        color: #757575;
                        line-height: 24px;
                        height: auto;
                        font-size: 12px;
                        background: #f9f9f9;
                        border-radius: 2px;
                        padding: 0 10px;
                    }
                }
                .price {
                    width: 100px;
                    text-align: left;
                }
                &.top {
                    font-weight: 500;
                    padding: 16px 0;
                    border-top: 1px solid #e6eaee;
                    border-bottom: 1px solid #e6eaee;
                    margin: 14px 0 0px;
                }
                &.sum {
                    font-weight: 500;
                    padding: 16px 0;
                    border-top: 1px solid #e6eaee;
                    border-bottom: 1px solid #e6eaee;
                    margin: 14px 0 34px;
                }
            }
            .ant-btn-primary {
                width: 100%;
                height: 46px;
                border-radius: 12px;
                font-weight: 500;
            }
        }
        &.favorite-container {
            .btns {
                width: 100%;
                .fsb(flex-end);
            }
        }
    }
    .count-edit {
        .ant-input-number {
            height: 28px;
            box-shadow: 0 0 0 0;
            border: 0;
            position: relative;
            text-align: center;
            .ant-input-number-input-wrap {
                padding: 0 28px;
                .ant-input-number-input {
                    padding: 0;
                    text-align: center;
                }
            }
            .ant-input-number-handler-wrap {
                width: 0;
                height: 0;
                position: static;
                opacity: 1;
                visibility: hidden;
                .ant-input-number-handler {
                    .fcc();
                    visibility: visible;
                    width: 28px;
                    height: 28px;
                    position: absolute;
                    border: 0;
                    box-sizing: border-box;
                    border-radius: 6px;
                    border: 1px solid #006ef9;
                    &:hover {
                        height: 28px !important;
                        opacity: 0.7;
                    }
                    .anticon {
                        display: none;
                    }
                    &.ant-input-number-handler-down {
                        left: 0;
                        &::before {
                            border-radius: 20px;
                            display: inline-block;
                            content: '';
                            width: 15px;
                            height: 2px;
                            background: #c4c4c4;
                            border-radius: 20px 20px 20px 20px;
                            opacity: 1;
                        }
                    }
                    &.ant-input-number-handler-up {
                        right: 0;
                        background-color: #006ef9;
                        &::before,
                        &::after {
                            position: absolute;
                            display: inline-block;
                            content: '';
                            background: #fff;
                            border-radius: 20px;
                        }
                        &::before {
                            width: 16px;
                            height: 2px;
                        }
                        &::after {
                            height: 16px;
                            width: 2px;
                        }
                    }
                }
            }
        }
    }
}
</style>
