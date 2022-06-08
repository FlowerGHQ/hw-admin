<template>
<div id="PurchaseItemList">
    <div class="item-header-container">
        <a-tabs v-model:activeKey="firstLevelId" @change="handleCategoryChange">
            <a-tab-pane :key="0" :tab="$t('n.all')"></a-tab-pane>
            <a-tab-pane v-for="item of categoryList" :key="item.id" :tab="item.name"></a-tab-pane>
            <template #rightExtra>
                <a-input class="search" v-model:value="searchForm.name" :placeholder="$t('def.input')" @pressEnter="handleSearch" >
                    <template #prefix><i class="icon i_search" @click="handleSearch"/></template>
                    <template #suffix><i class="icon i_close_b" @click="handleNameReset" v-if="searchForm.name"/></template>
                </a-input>
                <a-tooltip :title="$t('i.favorites')" class="popover">
                    <a-button type="link" @click="routerChange('favorite')"><i class="icon i_collect"/></a-button>
                </a-tooltip>
                <a-popover v-model:visible="briefVisible" arrow-point-at-center placement="bottomRight" trigger='click' overlayClassName='shop-cart-brief-content'>
                    <template #content>
                        <div class="shop-cart-brief" :class="briefVisible ? 'show' : 'hidden'">
                            <div class="icon i_close" @click="briefVisible = false"></div>
                            <div class="tip">
                                <i class="icon i_check_b"/>{{ $t('i.added') }}
                            </div>
                            <div class="item" v-for="item of briefList" :key="item.id">
                                <img class="cover" :src="$Util.imageFilter(item.logo, 2)" />
                                <div class="desc">
                                    <p>{{ item.name ? lang =='zh' ? item.name : item.name_en : '-' }}</p>
                                    <span>{{item.code || '-'}}</span>
                                    <p class="price">€{{$Util.countFilter(item[priceKey + 'eur'])}} | ${{$Util.countFilter(item[priceKey + 'usd'])}}</p>
                                </div>
                            </div>
                            <div class="btns">
                                <a-button class='btn ghost' @click="routerChange('shop_cart')">{{ $t('i.look') }}({{briefCount}})</a-button>
                                <a-button class='btn black' @click="routerChange('settle')">{{ $t('i.settle') }}</a-button>
                            </div>
                        </div>
                    </template>
                    <a-tooltip :title="$t('i.look') + `${briefCount ? '('+briefCount+')' : ''}`" class="popover">
                        <a-button type="link" @click="routerChange('shop_cart')"><i class="icon i_cart"/></a-button>
                    </a-tooltip>
                </a-popover>
            </template>
        </a-tabs>
    </div>
    <div class="item-content-container" :class="firstLevelId ? '' : 'full-content'">
        <div class="category-container" v-if="firstLevelId">
            <div class="category-title">{{firstLevelName}}</div>
            <div class="category-content">
                <CategoryTree :parentId='firstLevelId' @change='handleCategoryChange' ref="CategoryTree"/>
            </div>
        </div>
        <div class="item-content" v-if="tableData.length">
            <!-- <div class="switch-btn">
                <a-radio-group v-model:value="pageType">
                    <a-radio-button value="agora"><i class="icon i_agora"/></a-radio-button>
                    <a-radio-button value="list"><i class="icon i_list"/></a-radio-button>
                </a-radio-group>
            </div> -->
            <div class="list-container">
                <div class="list-item" v-for="item of tableData" :key="item.id" @click="routerChange('detail', item)">
                    <div class="cover">
                        <img :src="$Util.imageFilter(item.logo, 2)" />
                    </div>
                    <p class="sub">{{item.code}}</p>
                    <p class="name">{{ item.name ? lang =='zh' ? item.name : item.name_en : '-' }}</p>
                    <p class="desc">&nbsp;</p>
                    <p class="price">€{{$Util.countFilter(item[priceKey + 'eur'])}} | ${{$Util.countFilter(item[priceKey + 'usd'])}}</p>
                    <a-button class="btn" type="primary" ghost @click.stop="handleCartAdd(item)">{{ $t('i.cart') }}</a-button>
                </div>
            </div>
            <div class="paging-container">
                <a-pagination
                    v-model:current="currPage"
                    :page-size='pageSize'
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                    :hide-on-single-page='false'
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
        </div>
        <SimpleImageEmpty class="item-content-empty" v-else desc="暂无满足搜索条件的商品"/>
    </div>
</div>
</template>

<script>
import Core from '../../core';
import CategoryTree from './components/CategoryTree.vue'
import SimpleImageEmpty from '../../components/common/SimpleImageEmpty.vue'

export default {
    name: 'PurchaseItemList',
    components: {
        SimpleImageEmpty,
        CategoryTree,
    },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            pageType: 'list',
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            tableData: [],

            // 搜索
            categoryList: [],
            firstLevelId: 0,
            firstLevelName: '',
            searchForm: {
                name: '',
                category_id: '',
            },

            // 购物车简略面板
            briefVisible: false,
            briefList: [],
            briefCount: 0,
        };
    },
    watch: {},
    computed: {
        priceKey() {
            return this.$auth('DISTRIBUTOR') ? 'fob_' : 'purchase_price_'
        },
        lang() {
            return this.$store.state.lang
        }
    },
    mounted() {
        this.getTableData();
        this.getCategoryList()
        this.getShopCartData();

        this.timer = window.setInterval(() => {
            setTimeout(() => {
                this.getTableData();
                this.getCategoryList()
            }, 0);
        }, 5*1000);
    },
    beforeUnmount(){
        clearInterval(this.timer)
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: '/purchase/item-display',
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'favorite':  // 收藏夹
                case 'shop_cart':  // 购物车
                    routeUrl = this.$router.resolve({
                        path: "/purchase/item-collect",
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'settle':  // 结算
                    routeUrl = this.$router.resolve({
                        path: "/purchase/item-settle",
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {  // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        handleSearch() {  // 搜索
            this.pageChange(1);
        },
        handleNameReset() {  // 重置名称
            this.searchForm.name = ''
            this.pageChange(1);
        },
        handleCategoryChange(category) {
            console.log('handleCategoryChange category:', category)
            this.searchForm.category_id = category
            if ( this.firstLevelId && category === this.firstLevelId) {
                this.firstLevelName = this.categoryList.find(i => i.id === category).name
                this.$nextTick(() => {
                    this.$refs.CategoryTree.handleReset();
                })
            }
            this.pageChange(1)
        },
        getTableData() { // 获取 商品 数据
            this.loading = true;
            Core.Api.Item.list({
                flag_spread: 1,
                category_id: this.searchForm.category_id,
                name: this.searchForm.name,
                page: this.currPage,
                is_authority: 1,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res:", res)
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        getShopCartData(flag = false) { // 获取 购物车 数据
            Core.Api.ShopCart.list().then(res => {
                console.log('getShopCartData res:', res)
                this.briefVisible = flag
                let item = res.list[0] || {}
                this.briefList = [item.item || {}]
                console.log('this.briefList: ', this.briefList);
                this.briefCount = res.count;
            })
        },

        handleCartAdd(item) { // 添加到购物车
            console.log('handleCartAdd item:', item)
            if (item.set_id && item.attr_list.length > 1) {
                this.routerChange('detail', item)
                return
            }
            Core.Api.ShopCart.save({
                item_id: item.id,
                amount: 1,
                price: item.purchase_price
            }).then(res => {
                console.log('res:', res)
                this.$message.success('添加成功')
                this.getShopCartData(true);
            })
        },

        getCategoryList() {
            Core.Api.ItemCategory.tree({
                id: 0,
                is_authority: 1,
            }).then(res => {
                this.categoryList = res.list
            })
        }
    }
};
</script>

<style lang="less">
#PurchaseItemList {
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
                        color: #1A1A1A;
                        margin-left: 44px;
                        &.ant-tabs-tab-active .ant-tabs-tab-btn {
                            color: #1A1A1A;
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
                        width: 180px;
                        height: 36px;
                        background: #F5F5F5;
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
                    .popover {
                        margin-left: 20px;
                        i.icon {
                            font-size: 20px;
                            color: #2B2B2B;
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
                padding: 44px 0 33px;
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
                        background-color: #F5F5F5;
                        .fcc();
                        overflow: hidden;
                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
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
                        border-top: 1px solid #E6EAEE;
                    }
                    .desc, .price {
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
            .item-content, .item-content-empty {
                width: 100%;
            }
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
            color: #37D347;
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
        margin-top: 52px;
        .btn {
            width: 172px;
            height: 55px;
            border-radius: 12px;
            font-size: 15px;
            &.ghost {
                background: #FFFFFF;
                border: 1px solid #E5E8EB;
                color: #111111;
                &:hover {
                    background: rgba(17, 17, 17, 0.1);
                }
            }
            &.black {
                background: #111111;
                border: 1px solid #111111;
                color: #FFFFFF;
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
