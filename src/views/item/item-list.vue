<template>
<div id="ItemList">
    <div class="item-header-container">
        <a-tabs v-model:activeKey="searchForm.type" @change="handleCategoryChange">
            <a-tab-pane key="1" tab="全部"></a-tab-pane>
            <a-tab-pane key="2" tab="车辆"></a-tab-pane>
            <a-tab-pane key="3" tab="备件"></a-tab-pane>
            <a-tab-pane key="4" tab="配饰"></a-tab-pane>
            <template #rightExtra>
                <a-input class="search" v-model="searchForm.name" placeholder="商品名称">
                    <template #prefix><i class="icon i_search"/></template>
                </a-input>
                <a-popover trigger="click" class="popover">
                    <template #content>
                        <p>收藏</p>
                    </template>
                    <a-button type="link"><i class="icon i_collect"/></a-button>
                </a-popover>
                <a-popover trigger="click" class="popover">
                    <template #content>
                        <p>购物车</p>
                    </template>
                    <a-button type="link"><i class="icon i_cart"/></a-button>
                </a-popover>
                <a-button type="primary" class="add" @click="routerChange('edit')"><i class="icon i_add"/>新增商品</a-button>
            </template>
        </a-tabs>
    </div>
    <div class="item-content-container">
        <div class="category-container">
            <div class="category-title">车辆</div>
            <div class="category-content">
                <CategoryTree :categoryTree='categoryTree' @change='handleCategoryChange'/>
            </div>
        </div>
        <div class="item-content">
            <div class="switch-btn">
                <a-radio-group v-model:value="pageType">
                    <a-radio-button value="agora"><i class="icon i_agora"/></a-radio-button>
                    <a-radio-button value="list"><i class="icon i_list"/></a-radio-button>
                </a-radio-group>
            </div>
            <div class="list-container">
                <div class="list-item" v-for="item of tableData" :key="item.id">
                    <div class="cover">
                        <img :src="$Util.imageFilter(item.logo)" />
                    </div>
                    <p class="sub">{{item.code}}</p>
                    <p class="name">{{item.name}}</p>
                    <p class="desc"></p>
                    <p class="price">{{$Util.countFilter(item.price)}}￥</p>
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
                    :show-total="total => `共${total}条`"
                    :hide-on-single-page='false'
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Core from '../../core';
import CategoryTree from '../../components/CategoryTree.vue'
function dig(path = '0', level = 3) {
    const list = [];

    for (let i = 0; i < 10; i += 1) {
        const key = `${path}-${i}`;
        const treeNode = {
            title: key,
            key,
        };

        if (level > 0) {
            treeNode.children = dig(key, level - 1);
        }

        list.push(treeNode);
    }

    return list;
}

export default {
    name: 'ItemList',
    components: {
        CategoryTree,
    },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,

            // 搜索
            categoryTree: dig(),
            searchForm: {
                name: '',
                category_id: '',
            },
            expandedKeys: [],
            selectedKeys: [],

            tableData: [],

            pageType: 'list',
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/item/item-edit",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/item/item-detail",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_blank')
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
        handleCategoryChange(category, categories) {
            this.searchForm.category_id = category
            this.pageChange(1)
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            Core.Api.Item.list({
                category_id: this.searchForm.category_id,
                name: this.searchForm.name,
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res:", res)
                this.total = res.count;
                this.tableData = [...res.list, ...res.list, ...res.list, ...res.list];
            }).catch(err => {
                console.log('getTableData err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },
    }
};
</script>

<style lang="less">
#ItemList {
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
                margin-top: 32px;
                display: flex;
                flex-wrap: wrap;
                .list-item {
                    margin: 0 40px 60px;
                    width: calc(~'100% / 3 - 80px');
                    height: calc(~'100% / 3 - 80px');
                    .cover {
                        img {
                            width: 100%;
                        }
                    }
                }

            }
            .paging-container {
                padding-right: 44px;
            }

        }
    }
}
</style>