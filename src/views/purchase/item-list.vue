<template>
    <div id="PurchaseItemList">
        <div class="item-content-container full-content">
            <template v-if="!bomShow">
                <div class="item-content" v-if="tableData.length">
                    <div class="list-container">
                        <div
                            class="list-item"
                            v-for="item of tableData"
                            :key="item.id"
                            @click="routerChange('detail', item)"
                        >
                            <div class="cover">
                                <!-- <img :src="$Util.imageFilter(item.logo, 2)" /> -->
                                <img :src="$Util.imageFilter(item.logo ? item.logo.split(',')[0] : '', 2)" />
                            </div>
                            <p class="sub">{{ item.code || '-' }}</p>
                            <p class="name" v-if="lang == 'zh'">
                                {{ item.name || '-' }}
                            </p>
                            <p class="name" v-else>
                                {{ item.name_en || '-' }}
                            </p>
                            <!-- item.original_price_currency.toUpperCase() === MONETARY_TYPE['€'] // 后期单位可能要变成联动的 -->
                            <div v-if="item.set_id === 0">
                                <p v-if="currency === 'eur' || currency === 'EUR'" class="price m-t-22">
                                    {{ $Util.priceUnitFilter(currency) }}
                                    {{ $Util.countFilter(item[priceKey + 'eur']) }}
                                </p>
                                <p class="price m-t-22" v-else>
                                    {{ $Util.priceUnitFilter(currency) }}
                                    {{ $Util.countFilter(item[priceKey + 'usd']) }}
                                </p>
                            </div>
                            <div v-else class="price m-t-38"></div>

                            <!-- 添加到购物车 -->
                            <a-button class="btn" type="primary" ghost @click.stop="handleCartAdd(item)">
                                {{ $t('i.cart') }}
                            </a-button>
                        </div>
                    </div>
                    <!-- 分页 -->
                    <div class="paging-container">
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
                <!-- 空页面 -->
                <SimpleImageEmpty v-else class="item-content-empty" :desc="$t('i.no_search_list')" />
            </template>
            <div class="bom-content" v-else>
                <ExploredContentPay
                    :key="menaKey"
                    :id="searchForm.category_id"
                    :data="tableData"
                    @change="getData"
                ></ExploredContentPay>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '@/core';

import SimpleImageEmpty from '@/components/common/SimpleImageEmpty.vue';
import { ExportOutlined } from '@ant-design/icons-vue';
import ExploredContentPay from './components/ExploredContentPay.vue';
const MONETARY_TYPE = Core.Const.ITEM.MONETARY_TYPE;

export default {
    name: 'PurchaseItemList',
    components: {
        SimpleImageEmpty,
        ExportOutlined,
        ExploredContentPay,
    },
    props: {
        category_id: { type: Number }, // 搜索的编码id
        name: { name: String }, // 搜索传过来的名称
    },
    watch: {
        category_id: {
            handler(newValue) {
                this.searchForm.category_id = newValue;
                this.tableData = [];
                this.getTableData();
                // tab-切换进行请求操作
                this.isBomShow(this.searchForm.category_id);
            },
        },
        name: {
            handler(newValue) {
                this.searchForm.name = newValue;
            },
        },
    },
    data() {
        return {
            Core,
            MONETARY_TYPE,
            // 加载
            loading: false,
            searchType: Core.Const.ITEM.SEARCH_TYPE.NAME,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            tableData: [],

            // 搜索
            categoryList: [],
            searchForm: {
                name: '',
                name_en: '',
                category_id: '',
            },

            // 是否显示爆炸图
            bomShow: false,
            menaKey: 1,
            currency: '', // 获取本地的单位
        };
    },
    computed: {
        priceKey() {
            return this.$auth('DISTRIBUTOR') ? 'fob_' : 'price_';
        },
        lang() {
            return this.$store.state.lang;
        },
    },

    mounted() {
        this.currency = Core.Data.getCurrency();
        // this.getTableData();
        this.getCategoryList();
    },

    methods: {
        /* Fetch start*/
        getTableData() {
            // 获取 商品 数据
            let searchForm = Core.Util.deepCopy(this.searchForm);
            if (this.searchType == Core.Const.ITEM.SEARCH_TYPE.CODE) {
                searchForm.code = searchForm.name;
                searchForm.name = '';
            }
            this.loading = true;
            const params = {
                flag_spread: 0,
                category_id: searchForm.category_id,
                name: searchForm.name,
                name_en: searchForm.name_en,
                code: searchForm.code,
                page: this.currPage,
                is_authority: 1,
                page_size: this.pageSize,
                has_price: true,
            };

            Core.Api.Item.list(Core.Util.searchFilter(params))
                .then(res => {
                    this.total = res.count;
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleCartAdd(item) {
            // 添加到购物车
            let _this = this;
            if (item.set_id > 0 && item.flag_default === 1) {
                this.routerChange('detail', item);
                return;
            }
            Core.Api.ShopCart.save({
                item_id: item.id,
                amount: 1,
                price: item.purchase_price,
            }).then(res => {
                this.$message.success(_this.$t('i.add_success'));
            });
        },
        getCategoryList() {
            Core.Api.ItemCategory.tree({
                id: 0,
                is_authority: 1,
                depth: 1,
            }).then(res => {
                this.categoryList = res.list;
            });
        },

        handleExportConfirm() {
            // 确认订单是否导出
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure') + _this.$t('n.export') + '?',
                okText: _this.$t('def.sure'),
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    _this.handleRepairExport();
                },
            });
        },
        handleRepairExport() {
            // 订单导出
            this.exportDisabled = true;

            let form = Core.Util.deepCopy(this.searchForm);

            // 编码
            if (this.searchType === Core.Const.ITEM.SEARCH_TYPE.CODE) {
                form.code = form.name;
                form.name = '';
            }

            for (const key in form) {
                form[key] = form[key] || '';
            }
            let exportUrl = Core.Api.Export.exportOrderPrice({
                ...form,
                language: this.$i18n.locale === 'en' ? 1 : 0,
            });
            console.log('handleRepairExport exportUrl', exportUrl);
            window.open(exportUrl, '_blank');
            this.exportDisabled = false;
        },

        // 备注
        handleRemarkEditBlur(item) {
            let _item = Core.Util.deepCopy(item);
            console.log('handleCountEditBlur _item:', _item);
            Core.Api.ShopCart.remark({
                id: this.orderId,
                remark: _item.remark,
            })
                .then(res => {
                    console.log('handleRemarkEditBlur: res', res);
                })
                .then(res => {
                    this.categoryList = res.list;
                })
                .catch(err => {
                    console.log('获取类型: err', err);
                });
        },
        /* Fetch end*/

        /* methods start*/
        // 路由跳转
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'detail': // 详情
                    this.$emit('changeDisplay', true, item.id);
                    break;
                case 'favorite': // 收藏夹
                case 'shop_cart': // 购物车
                    routeUrl = this.$router.resolve({
                        path: '/mall/shopping-bag',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'settle': // 结算
                    routeUrl = this.$router.resolve({
                        path: '/purchase/item-settle',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        // refs操作的
        pageChangeName(name, searchType) {
            this.searchForm.name = name;
            this.searchType = searchType;
            this.pageChange(1);
        },
        handleNameReset() {
            this.searchForm.name = '';
            this.pageChange(1);
        },
        // 页面事件
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            this.pageSize = size;
            this.getTableData();
        },
        // 搜索逻辑
        handleSearch() {
            this.pageChange(1);
        },
        /* methods end*/
        // 是否显示爆炸图
        isBomShow(id) {
            this.bomShow = false;
            for (let i = 0; i < this.categoryList.length; i++) {
                if (this.categoryList[i].id === id) {
                    this.bomShow = this.categoryList[i].display_mode === 2;
                    return;
                }
                if (this.categoryList[i].children != null) {
                    this.isBomChildren(this.categoryList[i], id);
                }
            }
        },
        isBomChildren(element, id) {
            for (let i = 0; i < element.children.length; i++) {
                if (element.children[i].children != null) {
                    this.isBomChildren(element.children[i], id);
                }
                if (element.children[i].id === id) {
                    this.bomShow = element.children[i].display_mode === 2;
                    return;
                }
            }
        },

        //
        getData() {
            this.getTableData();
        },
    },
};
</script>

<style lang="less">
#PurchaseItemList {
    background-color: #fff;
    border-radius: 6px;
    overflow: hidden;
    flex: 1;
    .item-header-container {
        .ant-tabs.ant-tabs-top {
            .ant-tabs-nav {
                margin-bottom: 0;

                .ant-tabs-nav-list {
                    .ant-tabs-tab {
                        padding: 18px 12px;
                        font-size: 16px;
                        line-height: 22px;
                        color: #1a1a1a;
                        margin-left: 44px;

                        &.ant-tabs-tab-active .ant-tabs-tab-btn {
                            color: #1a1a1a;
                        }
                    }

                    .ant-tabs-ink-bar {
                        background: #000;
                    }
                }

                .ant-tabs-extra-content {
                    .fcc();
                    padding-right: 44px;

                    .search {
                        height: 36px;
                        background: #f5f5f5;
                        border-radius: 20px;
                        border: 0;

                        .icon.i_search {
                            font-size: 16px;
                            padding-right: 4px;
                        }

                        .icon.i_close_b {
                            font-size: 14px;
                            color: rgba(0, 0, 0, 0.25);

                            &:hover {
                                color: rgba(0, 0, 0, 0.45);
                            }
                        }

                        .ant-input {
                            background-color: transparent;
                            font-size: 14px;
                        }
                    }

                    .search_select {
                        .ant-select-selector {
                            background: #f5f5f5;
                            padding-top: 2px;
                            height: 36px;
                            width: 80px;
                            border-radius: 20px 0px 0px 20px;
                        }
                    }

                    .search_input {
                        background: #f5f5f5;
                        height: 36px;

                        border-radius: 0px 20px 20px 0px;

                        .ant-input-affix-wrapper {
                            background: #f5f5f5;
                            height: 36px;
                            width: 300px;
                            border-radius: 0px 20px 20px 0px;
                        }

                        .ant-input {
                            width: 300px;
                            background: #f5f5f5;
                        }
                    }

                    .popover {
                        margin-left: 20px;

                        i.icon {
                            font-size: 20px;
                            color: #2b2b2b;
                        }
                    }

                    .add {
                        margin-left: 20px;
                    }
                }
            }
        }
    }
    .item-content-container {
        display: flex;
        width: 100%;
        height: 100%;
        .category-container {
            width: 260px;
            box-sizing: border-box;
            padding-left: 44px;
            padding-bottom: 44px;

            .category-title {
                font-size: 24px;
                font-weight: 500;
                color: #111111;
                line-height: 28px;
                margin: 100px 0 33px;

                &:hover {
                    color: @primary !important;
                }
            }

            .category-content {
                .ant-menu.ant-menu-root {
                    border-right: 0;
                    margin-left: -24px;
                }
            }
        }

        .item-content {
            width: calc(~'100% - 260px');

            .switch-btn {
                padding: 25px 44px 0;
                text-align: right;
            }

            .list-container {
                margin: 32px 22px 0;
                display: flex;
                flex-wrap: wrap;

                .list-item {
                    cursor: pointer;
                    margin: 0 22px 60px;
                    width: 180px;
                    color: #111111;
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 16px;

                    .cover {
                        width: 180px;
                        height: 180px;
                        background-color: #fff;
                        .fcc();
                        overflow: hidden;

                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: scale-down;
                        }
                    }

                    .sub {
                        .ell();
                        margin: 15px 0 5px;
                        font-size: 12px;
                        line-height: 14px;
                    }

                    .name {
                        .ell();
                        padding-top: 5px;
                        border-top: 1px solid #e6eaee;
                    }

                    .desc,
                    .price {
                        margin: 5px 0;
                        color: #757575;
                        font-weight: 400;
                    }

                    .btn {
                        width: 100%;
                        height: 40px;
                        border-radius: 12px;
                        border: 1px solid @primary;
                        margin-top: 22px;
                        font-weight: 500;
                        color: @primary;

                        &:hover {
                            background-color: @primary_l !important;
                        }
                    }
                }
            }

            .paging-container {
                padding-right: 44px;
            }
        }

        .item-content-empty {
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            flex-direction: column;
        }

        &.full-content {
            .item-content,
            .item-content-empty {
                width: 100%;
                height: 100% !important;
            }
        }

        .bom-content {
            padding: 48px;
            width: 100%;
            display: flex;
            justify-content: space-around;
            flex-direction: column;
        }
    }
}
.shop-cart-brief-content {
    visibility: hidden;

    .ant-popover-arrow {
        display: none;
    }
}

.shop-cart-brief {
    box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    visibility: visible;
    background-color: #fff;
    position: fixed;
    right: 56px;
    top: 126px;
    padding: 22px;

    .icon.i_close {
        cursor: pointer;
        position: absolute;
        font-size: 14px;
        color: #111;
        top: 22px;
        right: 22px;
    }

    .tip {
        font-size: 15px;
        color: #272727;
        line-height: 18px;
        margin-bottom: 22px;

        .icon.i_check_b {
            color: #37d347;
            font-size: 12px;
            margin-right: 10px;
        }
    }

    .item {
        display: flex;

        .cover {
            width: 78px;
            height: 78px;
            object-fit: cover;
            margin-right: 20px;
        }

        .desc {
            width: calc(~'100% - 78px - 20px');
            display: flex;
            flex-direction: column;
            font-size: 14px;
            line-height: 16px;

            p {
                font-weight: 500;
                line-height: 16px;
                margin: 0;
            }

            span {
                font-weight: 400;
                color: #757575;
                margin: 10px 0 8px;
            }

            .price {
                font-weight: 400;
                color: #111111;
            }
        }
    }

    .btns {
        // margin-top: 52px;
        margin-top: 30px;

        .btn {
            width: 172px;
            height: 55px;
            border-radius: 12px;
            font-size: 15px;

            &.ghost {
                background: #ffffff;
                border: 1px solid #e5e8eb;
                color: #111111;

                &:hover {
                    background: rgba(17, 17, 17, 0.1);
                }
            }

            &.black {
                background: #111111;
                border: 1px solid #111111;
                color: #ffffff;

                &:hover {
                    background: rgba(17, 17, 17, 0.9);
                }
            }
        }
    }

    &.show {
        opacity: 1;
        display: block;
    }

    &.hidden {
        opacity: 0;
        display: none;
    }
}

.m-t-22 {
    margin-top: 22px !important;
}
.m-t-38 {
    margin-top: 38px !important;
}
</style>
