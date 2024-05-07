<template>
    <div id="parts-list">
        <div class="menu">
            <Menu
                :menuData="list"
                :openKeys="openKeys"
                :selectedKeys="selectedKeys"
                @openChange="handleOpenChange"
                @handleSelect="handleSelect"
            />
        </div>
        <div class="content">
            <template v-if="breadcrumbList.length > 0">
                <div class="title">
                    <span
                        :class="[item.id === typeParentId ? 'now' : '']"
                        v-for="item in breadcrumbList"
                        @click="handleBreadcrumb(item.id)"
                    >
                        {{ item[name_index] }}
                    </span>
                </div>
            </template>
            <template v-if="isItem && !isDetail">
                <div class="tab">
                    <div
                        class="tab-item"
                        :class="[index === tabIndex ? 'active' : '']"
                        v-for="(item, index) in tabData"
                        @click="handleSelectTab(index)"
                    >
                        {{ `${item.category_name}（${item.count}）` }}
                    </div>
                </div>
            </template>
            <div class="box">
                <template v-if="isDetail">
                    <PartsDetail ref="PartsDetailRef" :id="detailId" />
                </template>
                <template v-else>
                    <div class="list">
                        <div class="item" v-for="item in renderType" :key="item.id" @click="handleCard(item)">
                            <component :is="componentName" :record="item" />
                        </div>
                    </div>
                    <div class="loading">
                        <down-loading class="loading" :show="spinning" />
                    </div>
                </template>
            </div>
            <!-- 解决循环渲染 componentName 不响应bug -->
            <span class="hide">{{ componentName }}</span>
        </div>
    </div>
</template>

<script setup>
import PartsDetail from './components/parts-detail.vue';
import VehicleCard from './components/vehicle-card.vue';
import TypeCard from './components/type-card.vue';
import Menu from '@/components/Menu/index.vue';
import DownLoading from '../../components/DownLoading.vue';
import Core from '@/core';
import { ref, reactive, onMounted, onBeforeUnmount, computed, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const route = useRoute();
const router = useRouter();
const store = useStore();

/* state start */
const deep = ref(1); // 层级
const id = ref('');
const typeParentId = ref(null);
const spinning = ref(false);
const pagination = reactive({
    page_size: 20,
    page: 1,
    total: 0,
    total_page: 0,
});
const breadcrumbList = ref([{ id: null, name: '全部', name_en: 'All' }]);
const tabIndex = ref(0);
const tabData = ref([]);
const openKeys = ref([]);
const list = ref([]);
const itemList = ref([]);
const isDetail = ref(false);
const detailId = ref('');
const PartsDetailRef = ref(null);
const bomListPartsFetch = Core.Api.Distributor.bomListParts;

/* state end */

/* computed start */
// const openKeys = computed({
//     get: () => {
//         // return breadcrumbList.value.slice(1).map(item => item.id);
//     },
//     set: v => {
//         console.log(v);
//     },
// });
const selectedKeys = computed(() => {
    return breadcrumbList.value.length > 1 ? [breadcrumbList.value[breadcrumbList.value.length - 1]?.key] : [];
});
const lang = computed(() => {
    return store.state.lang;
});
const name_index = computed(() => {
    let name = '';
    switch (lang.value) {
        case 'zh':
            name = 'name';
            break;
        case 'en':
            name = 'name_en';
            break;

        default:
            name = 'name';
            break;
    }
    return name;
});
// 是否展示商品
const isItem = computed(() => {
    return deep.value > 2;
});
// 类型列表
const renderType = computed(() => {
    if (isItem.value) return itemList.value;
    if (!typeParentId.value) return list.value;
    let arr = [];
    function findChildren(list) {
        for (let item of list) {
            if (item.id === typeParentId.value) {
                arr = item.children;
                break;
            } else if (item.children && item.children.length > 0) {
                findChildren(item.children);
            }
        }
    }
    findChildren(list.value);
    return arr;
});
const componentName = computed(() => {
    if (isItem.value) {
        return VehicleCard;
    } else {
        return TypeCard;
    }
});
/* computed end */

/* watch start */
watch(breadcrumbList.value, newV => {
    if (newV.length !== deep.value) deep.value = newV.length;
    if (newV.length < 6) isDetail.value = false;
    openKeys.value = newV.slice(1).map(item => item.id);
});
/* watch end */

onMounted(() => {
    getBomTree();
    window.addEventListener('scroll', handleScroll);
});
onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});

/* methods start */
// 获取数据
const getData = async (reset = false, id_ = '') => {
    if (!isItem.value || deep.value < 2 || deep.value > 5) return;
    spinning.value = true;
    id.value = id_ || id.value;
    switch (deep.value) {
        case 3:
            await getListPartsCategory({ bom_item_category_id: id.value });
            getCarList({ bom_item_category_id: id.value }, reset);
            break;
        case 4:
            await getListPartsCategory({ sync_id: id.value });
            getCarList({ sync_id: id.value }, reset);
            break;
        case 5:
            await getListPartsCategory({ id: id.value });
            getCarList({ id: id.value }, reset);
            break;

        default:
            getCarList(reset);
            break;
    }
};
// 路由跳转
const routerChange = (routeUrl, item = {}, type = 1) => {
    if (!routeUrl) return;
    switch (type) {
        case 1:
            router.push({
                path: routeUrl,
                query: item,
            });
            break;
        default:
            break;
    }
};
const resetFn = () => {
    itemList.value = [];
    Object.assign(pagination, {
        page_size: 20,
        page: 1,
        total: 0,
        total_page: 0,
    });
};
/* 初始化面包屑 */
const initBreadcrumb = () => {
    handleBreadcrumb(null);
};
/* 模拟点击卡片 */
const cardClikcMock = () => {
    initBreadcrumb();
    const childrenArr = findChildrenArr(list.value, openKeys.value);
    childrenArr.forEach(child => {
        /* 模拟点击卡片 */
        if (!child) return initBreadcrumb();
        setBreadcrumb(child);
    });
    getData(true, childrenArr[childrenArr.length - 1]?.id);
};
/* 菜单开合变化 */
const handleOpenChange = val => {
    openKeys.value = val;
    cardClikcMock();
};
/* 菜单选中 */
const handleSelect = async v => {
    console.log(v);
    let res = null;
    if (v.keyPath.length === 5) {
        openKeys.value = v.keyPath;
        cardClikcMock();
        detailId.value = v.key;
        isDetail.value = true;
        nextTick(() => {
            PartsDetailRef.value.getData();
        });
        return;
    }
    switch (v.keyPath.length) {
        case 2:
            res = await getBomListName(v.key);
            break;
        case 3:
            res = await getBomlistVersion(v.key);
            break;
        case 4:
            res = await getBomlistCategory(v.key);
            break;

        default:
            break;
    }
    setChildren(list.value, v.keyPath, res.list);
    openKeys.value = v.keyPath;
    cardClikcMock();
};
/* 查找已打开菜单数据 */
const findChildrenArr = (arr, keys) => {
    let list = arr;
    let childrenArr = [];
    let obj = {};
    keys.forEach((item, index) => {
        obj = list.find(child => child.id === item);
        childrenArr.push(obj);
        list = obj?.children || [];
    });
    return childrenArr;
};
/* 查找已打开菜单最后一个数据 */
const findChildren = (arr, keys) => {
    let childrenArr = arr;
    let obj = {};
    keys.forEach((item, index) => {
        obj = childrenArr.find(child => child.id === item);
        childrenArr = obj.children;
    });
    return obj;
};
/* 给菜单插入子级 */
const setChildren = (arr, keys, children) => {
    let childrenArr = arr;
    const child = findChildren(arr, keys);
    const parentKey = keys[keys.length - 1];
    switch (keys.length) {
        case 2:
            child.children = children.map(item => {
                return {
                    id: item.sync_id,
                    key: item.sync_id,
                    name: item.name,
                    name_en: item.name,
                };
            });
            break;
        case 3:
            child.children = children.map(item => {
                return {
                    id: item.id,
                    key: item.id,
                    name: `${item.version} 版本`,
                    name_en: `${item.version} Version`,
                };
            });
            break;
        case 4:
            child.children = children.map(item => {
                return {
                    id: item.id,
                    key: item.id,
                    name: item.name,
                    name_en: item.name,
                };
            });
            break;

        default:
            break;
    }
};
/* tab栏切换 */
const handleSelectTab = i => {
    tabIndex.value = i;
    getData(true, openKeys.value[openKeys.value.length - 1]);
};
/* 点击卡片 */
const handleCard = item => {
    if (isItem.value) {
        routerChange(`${route.path}/detail`, { id: item.id });
    } else {
        handleItem(item);
    }
};
/* 点击卡片后数据处理 */
const handleItem = item => {
    if (deep.value === 2) {
        handleSelect({ key: item.id, keyPath: [openKeys.value[0], item.id] }); // 模拟触发
    } else {
        setBreadcrumb(item);
        getData(true, item.id);
    }
};
/* 设置面包屑 */
const setBreadcrumb = item => {
    if (!isDetail.value) deep.value += 1;
    typeParentId.value = item.id;
    breadcrumbList.value.push({
        id: item.id,
        key: item.key,
        name: item.name,
        name_en: item.name_en,
    });
};
/* 触发面包屑点击事件 */
const handleBreadcrumb = id => {
    if (typeParentId.value === id) return;
    typeParentId.value = id;
    if (!id) {
        breadcrumbList.value.splice(1);
        deep.value = breadcrumbList.value.length;
        return;
    }
    const index = breadcrumbList.value.findIndex(item => item.id === id);
    breadcrumbList.value.splice(index + 1);
    deep.value = breadcrumbList.value.length;
    getData(true, id);
};
/* 滚动监听事件 */
const handleScroll = () => {
    // 详情获取非商品不执行
    if (isDetail.value || !isItem.value) return;
    // 因为存在子组件路由所以判断只在父路由时执行
    if (route.path !== '/mall/accessories-list') return;
    const footerHeight = document.querySelector('#mall-footer').clientHeight;
    const html = document.documentElement;
    handleScrollFn(html, getData, footerHeight);
};
const handleScrollFn = (e, fn, hitBottomHeightQ = '') => {
    if (!e || !fn) return;
    const hitBottomHeight = 10;
    const element = e;
    if (
        Math.ceil(element.scrollTop + element.clientHeight) >=
        element.scrollHeight - (hitBottomHeightQ || 0 + hitBottomHeight)
    ) {
        // console.log('滑到底部');
        if (pagination.page < pagination.total_page && !spinning.value) {
            pagination.page++;
            fn();
        }
    }
};
/* methods end */

/* fetch start */
const getBomTree = (parent_id = 0) => {
    // 通过父节点获取子级数据
    spinning.value = true;
    Core.Api.Distributor.bomTree()
        .then(res => {
            list.value = res?.list || [];
        })
        .catch(err => {
            console.log('getBomTree err', err);
        })
        .finally(() => {
            spinning.value = false;
        });
};
const getCarList = (q, reset = false) => {
    if (reset) resetFn();
    const params = {
        bom_item_item_category_id: tabData.value ? tabData.value[tabIndex.value].category_id : '',
        page: pagination.page,
        page_size: pagination.page_size,
    };
    Object.assign(params, q);
    bomListPartsFetch({ ...params })
        .then(res => {
            res?.list.forEach(item => {
                item.type = 2;
            });
            itemList.value = itemList.value.concat(res?.list);
            pagination.total = res.count;
            pagination.total_page = Math.ceil(pagination.total / pagination.page_size);
        })
        .finally(() => {
            spinning.value = false;
        });
};
/* 获取bom名称列表 */
const getBomListName = async id => {
    const params = {
        bom_item_category_id: id, //商品分类id
    };
    const res = await Core.Api.Distributor.bomListName({ ...params });
    return res;
};
/* 获取bom商品版本列表 */
const getBomlistVersion = async id => {
    const params = {
        sync_id: id, //商品分类id
    };
    const res = await Core.Api.Distributor.bomlistVersion({ ...params });
    return res;
};
/* 获取bom版本分组列表 */
const getBomlistCategory = async id => {
    const params = {
        bom_id: id, //商品分类id
    };
    const res = await Core.Api.Distributor.bomlistCategory({ ...params });
    return res;
};
const getListPartsCategory = async q => {
    const params = {};
    Object.assign(params, q);
    try {
        const res = await Core.Api.Distributor.listPartsCategory({ ...params });
        tabData.value = res.list;
        let count = 0;
        tabData.value.forEach(item => (count += item.count));
        tabData.value.unshift({
            id: '',
            category_name: 'All',
            count,
        });
    } catch {}
};
/* fetch end */
</script>

<style lang="less" scoped>
#parts-list {
    display: flex;
    .menu {
        margin-right: 40px;
        width: 320px;
    }
    .content {
        width: calc(100% - 360px);
        .title {
            font-size: 32px;
            font-weight: 500;
            line-height: 39.01px;
            color: #999;
            margin-bottom: 32px;
            cursor: pointer;
            > span:not(.now) {
                padding-right: 40px;
                position: relative;
                &:hover {
                    color: #333;
                }
                &::after,
                &::before {
                    content: '';
                    position: absolute;
                    display: inline-block;
                    width: 12px;
                    height: 2px;
                    border-radius: 1px;
                    background: #999;
                }
                &::after {
                    right: 10px;
                    top: 16px;
                    transform: rotate(45deg);
                }
                &::before {
                    right: 10px;
                    top: 24px;
                    transform: rotate(-45deg);
                }
            }
            .now {
                color: #333333;
                cursor: auto;
            }
        }
        .tab {
            width: 100%;
            display: flex;
            margin-bottom: 32px;
            overflow-x: auto;
            overflow-y: hidden;
            padding-bottom: 6px;
            // 滚动条样式
            &::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            &::-webkit-scrollbar-thumb {
                background-color: #d9d9d9;
            }
            .tab-item {
                flex-shrink: 0;
                position: relative;
                font-size: 24px;
                font-weight: 400;
                line-height: 29.26px;
                cursor: pointer;
                &:nth-child(n + 2) {
                    margin-left: 64px;
                }
                &.active {
                    color: @theme-color;
                    &::before {
                        content: '';
                        position: absolute;
                        bottom: 0px;
                        display: inline-block;
                        width: 100%;
                        height: 1px;
                        background: @theme-color;
                    }
                }
            }
        }
        .box {
            .list {
                .flex(initial, initial, row);
                flex-wrap: wrap;

                .item {
                    width: calc((100% - 80px) / 3);
                    margin-right: 40px;

                    &:nth-child(3n) {
                        margin-right: 0;
                    }

                    &:nth-child(n + 4) {
                        margin-top: 40px;
                    }
                }
            }

            .loading {
                margin-top: 20px;
            }
        }
    }
}
.hide {
    display: none;
}
@media (max-width: 1200px) {
}
</style>
