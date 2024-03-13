<template>
    <div id="ItemIndex">
        <a-spin :spinning="tabLoading">
            <div class="item-header-container">
                <a-tabs v-model:activeKey="firstLevelId" @change="handleCategoryChange" @tabClick="clickTab">
                    <a-tab-pane :key="0" :tab="$t('n.all')"></a-tab-pane>
                    <a-tab-pane
                        v-for="item of categoryList"
                        :key="item.id"
                        :tab="$i18n.locale == 'zh' ? item.zh : item.en"
                    ></a-tab-pane>
                    <template #rightExtra>
                        <a-input-group compact>
                            <a-select v-model:value="searchType" class="search_select">
                                <a-select-option v-for="(val, key) in SEARCH_TYPE_MAP" :key="key" :value="key">{{
                                    val[$i18n.locale]
                                }}</a-select-option>
                            </a-select>
                            <a-input
                                class="search_input"
                                style="width: 50%"
                                v-model:value="searchForm.name"
                                :placeholder="$t('def.input')"
                                @pressEnter="handleSearch"
                            >
                                <template #prefix><i class="icon i_search" @click="handleSearch" /></template>
                                <template v-if="searchForm.name" #suffix
                                    ><i class="icon i_close_b" @click="handleNameReset"
                                /></template>
                            </a-input>
                        </a-input-group>
                        <a-tooltip :title="$t('i.data_export')" class="popover">
                            <a-button type="text" @click="handleExportConfirm"><i class="icon i_download" /></a-button>
                        </a-tooltip>
                        <a-tooltip :title="$t('i.favorites')" class="popover">
                            <a-button type="link" @click="routerChange('favorite')"
                                ><i class="icon i_collect"
                            /></a-button>
                        </a-tooltip>
                        <a-popover
                            v-model:visible="briefVisible"
                            arrow-point-at-center
                            placement="bottomRight"
                            trigger="click"
                            overlayClassName="shop-cart-brief-content"
                        >
                            <template #content>
                                <div class="shop-cart-brief" :class="briefVisible ? 'show' : 'hidden'">
                                    <div class="icon i_close" @click="briefVisible = false"></div>
                                    <div class="tip"><i class="icon i_check_b" />{{ $t('i.added') }}</div>
                                    <div class="item" v-for="item of briefList" :key="item.id">
                                        <img class="cover" :src="$Util.imageFilter(item.logo, 2)" />
                                        <div class="desc">
                                            <p>
                                                {{ item.name ? (lang == 'zh' ? item.name : item.name_en) : '-' }}
                                            </p>
                                            <span>{{ item.code || '-' }}</span>
                                            <p class="price">
                                                €{{ $Util.countFilter(item[priceKey + 'eur']) }} | ${{
                                                    $Util.countFilter(item[priceKey + 'usd'])
                                                }}
                                            </p>
                                            <!-- <div v-if="!item.editRemark" @click="handleRemarkEditShow(item)" class="remark">{{$t('i.remark')}}：{{ item.remark }}</div> -->
                                            <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
                                                <a-form-item :label="$t('i.remark')">
                                                    <a-input
                                                        v-model:value="item.remark"
                                                        @blur="handleRemarkEditBlur(item)"
                                                    />
                                                </a-form-item>
                                            </a-form>
                                        </div>
                                    </div>
                                    <div class="btns">
                                        <a-button class="btn ghost" @click="routerChange('shop_cart')"
                                            >{{ $t('i.look') }}({{ briefCount }})</a-button
                                        >
                                        <a-button class="btn black" @click="routerChange('settle')">{{
                                            $t('i.settle')
                                        }}</a-button>
                                    </div>
                                </div>
                            </template>
                            <a-tooltip
                                :title="$t('i.look') + `${briefCount ? '(' + briefCount + ')' : ''}`"
                                class="popover"
                            >
                                <a-button type="link" @click="routerChange('shop_cart')"
                                    ><i class="icon i_cart"
                                /></a-button>
                            </a-tooltip>
                        </a-popover>
                    </template>
                </a-tabs>
            </div>
            <div class="item-content-container" :class="firstLevelId ? '' : 'full-content'">
                <div class="category-container" v-if="firstLevelId">
                    <a-button type="link" @click="handleCategoryChange(firstLevelId)">
                        <div class="category-title">
                            {{ $i18n.locale == 'zh' ? firstLevelName.zh : firstLevelName.en }}
                        </div>
                    </a-button>
                    <div class="category-content">
                        <CategoryTree
                            :parentId="searchForm.category_id"
                            @change="handleCategoryChange"
                            @clickCurrent="clickTab"
                            ref="CategoryTree"
                        />
                    </div>
                </div>
                <ItemList
                    v-show="!flag_display"
                    :category_id="searchForm.category_id"
                    :name="searchForm.name"
                    @changeDisplay="changeDisplay"
                    ref="itemList"
                ></ItemList>
                <ItemDisplay v-if="flag_display" :item_id="item_id"></ItemDisplay>
            </div>
        </a-spin>
    </div>
</template>

<script>
import Core from '../../core';

import CategoryTree from './components/CategoryTree.vue';
import SimpleImageEmpty from '../../components/common/SimpleImageEmpty.vue';
import { ExportOutlined } from '@ant-design/icons-vue';
import ExploredContentPay from './components/ExploredContentPay.vue';
import ItemList from './item-list.vue';
import ItemDisplay from './item-display.vue';

const SEARCH_TYPE_MAP = Core.Const.ITEM.SEARCH_TYPE_MAP;
export default {
    name: 'PurchaseItemList',
    components: {
        SimpleImageEmpty,
        CategoryTree,
        ExportOutlined,
        ExploredContentPay,
        ItemList,
        ItemDisplay,
    },
    props: {},
    data() {
        return {
            tabLoading: false,
            Core,
            loginType: Core.Data.getLoginType(),
            pageType: 'list',
            SEARCH_TYPE_MAP,
            // 加载
            loading: false,
            searchType: Core.Const.ITEM.SEARCH_TYPE.NAME,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            tableData: [],

            // 搜索
            categoryList: Core.Const.ITEM.TYPE_MAP,
            firstLevelId: 0,
            firstLevelName: {
                zh: '',
                en: '',
            },
            searchForm: {
                name: '',
                name_en: '',
                category_id: '',
            },

            // 购物车简略面板
            briefVisible: false,
            briefList: [],
            briefCount: 0,

            //  备注
            labelCol: { style: { width: '40px' } },
            wrapperCol: { span: 14 },
            orderId: '',

            // 是否显示爆炸图
            bomShow: false,
            menaKey: 1,
            currency: '',
            flag_display: false,
            item_id: 0,
            key: '',
            firstLevel_key: '',
        };
    },
    watch: {},
    computed: {
        priceKey() {
            return this.$auth('DISTRIBUTOR') ? 'fob_' : 'purchase_price_';
        },
        lang() {
            return this.$store.state.lang;
        },
    },

    mounted() {
        this.searchForm.name = this.$route.query.key || '';
        this.firstLevelId = Number(this.$route.query.tabId) || 0;
        this.currency = Core.Data.getCurrency();
        this.firstLevel_key = this.$route.query.first_level_id;
        // this.getTableData();
        // this.getCategoryList();
        this.getShopCartData();
        this.handleSearch();
    },

    methods: {
        clickTab(e, a) {
            this.flag_display = false;
        },
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/purchase/item-display',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_blank');
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
                        path: '/mall/confirm-order',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            // this.getTableData()
        },
        pageSizeChange(current, size) {
            this.pageSize = size;
            // this.getTableData()
        },
        handleSearch() {
            // 搜索
            this.flag_display = false;
            this.$refs.itemList.pageChangeName(this.searchForm.name, this.searchType);
        },
        handleNameReset() {
            // 重置名称
            this.flag_display = false;
            this.searchForm.name = '';
            this.$refs.itemList.pageChangeName(this.searchForm.name, this.searchType);
        },
        handleCategoryChange(category) {
            this.tableData = [];
            this.searchForm.category_id = category;
            this.flag_display = false;
            this.isBomShow(category);
            this.bomShow = false;
            // 定死数据不需要一下逻辑
            // if (this.firstLevel_key !== "") {
            //   this.firstLevelName = this.categoryList.find(
            //     (i) => i.index_key === this.firstLevel_key
            //   );
            //   if (this.firstLevelName !== undefined) {
            //     this.searchForm.category_id = this.firstLevelName.id;
            //     this.firstLevelId = this.firstLevelName.id;
            //   }

            //   this.firstLevel_key = "";
            // }

            if (this.firstLevelId && category === this.firstLevelId) {
                this.firstLevelName = this.categoryList.find(i => i.id === category);

                this.$nextTick(() => {
                    this.$refs.CategoryTree.handleReset();
                });
            }
        },

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
            // this.bomShow = true
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

        getTableData() {
            // 获取 商品 数据
            let searchForm = Core.Util.deepCopy(this.searchForm);
            if (this.searchType == Core.Const.ITEM.SEARCH_TYPE.CODE) {
                searchForm.code = searchForm.name;
                searchForm.name = '';
            }
            if (this.$i18n.locale === 'en') {
                searchForm.name_en = searchForm.name;
                searchForm.name = '';
            }
            this.loading = true;
            Core.Api.Item.list({
                flag_spread: 0,
                category_id: searchForm.category_id,
                name: searchForm.name,
                name_en: searchForm.name_en,
                code: searchForm.code,
                page: this.currPage,
                is_authority: 1,
                page_size: this.pageSize,
                flag_default: 0,
            })
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

        getShopCartData(flag = false) {
            // 获取 购物车 数据
            Core.Api.ShopCart.list().then(res => {
                this.briefVisible = flag;
                let item = res.list[0] || {};
                this.briefList = [item.item || {}];
                this.briefCount = res.count;
            });
        },

        handleCartAdd(item) {
            // 添加到购物车
            let _this = this;
            if (item.set_id && item.attr_list.length > 1) {
                this.routerChange('detail', item);
                return;
            }
            Core.Api.ShopCart.save({
                item_id: item.id,
                amount: 1,
                price: item.purchase_price,
            }).then(res => {
                this.$message.success(_this.$t('i.add_success'));
                this.getShopCartData(true);
                this.orderId = res.id;
            });
        },

        getCategoryList() {
            this.tabLoading = true;
            Core.Api.ItemCategory.tree({
                id: 0,
                is_authority: 1,
                depth: 3,
            })
                .then(res => {
                    this.tabLoading = false;
                    this.categoryList = res.list;
                    this.handleCategoryChange(this.firstLevelId);
                })
                .catch(err => {
                    this.tabLoading = false;
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
            window.open(exportUrl, '_blank');
            this.exportDisabled = false;
        },

        // 备注
        handleRemarkEditBlur(item) {
            let _item = Core.Util.deepCopy(item);
            Core.Api.ShopCart.remark({
                id: this.orderId,
                remark: _item.remark,
            })
                .then(res => {
                    console.log('handleRemarkEditBlur: res', res);
                })
                .catch(err => {
                    console.log('handleRemarkEditBlur: err', err);
                });
        },
        changeDisplay(flag_display, item_id) {
            this.item_id = item_id;
            this.flag_display = flag_display;
            console.log('item_id', this.item_id);
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
#ItemIndex {
    background-color: #fff;
    border-radius: 6px;
    overflow: hidden;
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
        justify-content: center;
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
                min-width: 150px;
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
            .flex(center);
        }
        &.full-content {
            .item-content,
            .item-content-empty {
                width: 100%;
            }
        }
        .bom-content {
            padding: 48px;
            width: 100%;
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
</style>
