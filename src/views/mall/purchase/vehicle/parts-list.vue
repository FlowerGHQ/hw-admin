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
            <div class="tab">
                <div
                    class="tab-item"
                    :class="[index === tabIndex ? 'active' : '']"
                    v-for="(item, index) in tabData"
                    @click="handleSelectTab(index)"
                >
                    {{ `${item[name_index]}（${item.count}）` }}
                </div>
            </div>
            <div class="box">
                <div class="list">
                    <div class="item" v-for="item in renderType" :key="item.id" @click="handleItem(item)">
                        <component :is="componentName" :record="item" />
                    </div>
                </div>
                <div class="loading">
                    <down-loading class="loading" :show="spinning" />
                </div>
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
import { ref, reactive, onMounted, computed, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const route = useRoute();
const router = useRouter();
const store = useStore();

/* state start */
const deep = ref(1); // 层级
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
const tabData = [
    { name: '1', name_en: '1en', count: 1 },
    { name: '2', name_en: '2', count: 2 },
    { name: '3', name_en: '3', count: 3 },
    { name: '3', name_en: '3', count: 3 },
];
const openKeys = ref([]);
const list = ref([]);
const itemList = ref([]);
const itemListFetch = Core.Api.Item.list;
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
        resetFn();
        getData();
        return VehicleCard;
    } else {
        return TypeCard;
    }
});
/* computed end */

/* watch start */
watch(breadcrumbList.value, newV => {
    openKeys.value = newV.slice(1).map(item => item.id);
});
/* watch end */

onMounted(() => {
    if (isItem.value) {
        getData();
    } else {
        getDataByParent();
    }
});

/* methods start */
// 获取数据
const getData = () => {
    getCarList();
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
const initBreadcrumb = () => {
    handleBreadcrumb(null);
};
const handleOpenChange = val => {
    initBreadcrumb();
    openKeys.value = val;
    /* 模拟点击卡片 */
    openKeys.value.forEach(item => {
        const child = renderType.value.find(child => child.id === item);
        if (!child) return initBreadcrumb();
        handleItem(child);
    });
};
const handleSelect = v => {
    // deep.value = v.keyPath.length + 1; // 选中数组的长度赋值给深度
    // typeParentId.value = v.key;
    // let arr = [];
    // if (isItem.value) {
    //     arr = itemList.value;
    // } else {
    //     arr = list.value;
    // }
};
const handleSelectTab = i => {
    tabIndex.value = i;
};
const handleItem = item => {
    if (isItem.value) {
        console.log(deep.value);
        // routerChange(`${route.path}/detail`, { id: item.id });
    } else {
        typeParentId.value = item.id;
        breadcrumbList.value.push({
            id: item.id,
            key: item.key,
            name: item.name,
            name_en: item.name_en,
        });
        deep.value += 1;
    }
};
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
};
/* methods end */

/* fetch start */
const getDataByParent = (parent_id = 0) => {
    // 通过父节点获取子级数据
    spinning.value = true;
    Core.Api.ItemCategory.tree({
        page: 0,
        parent_id: parent_id,
        is_authority: 1,
        depth: 3,
    })
        .then(res => {
            list.value = res?.list || [];
        })
        .catch(err => {
            console.log('getDataByParent err', err);
        })
        .finally(() => {
            spinning.value = false;
        });
};
const getCarList = (q, reset = false) => {
    if (reset) resetFn();
    spinning.value = true;
    const params = {
        type: 2, //1.整车；2.零部件/物料；3.周边；4.广宣品
        page: pagination.page,
        page_size: pagination.page_size,
    };
    Object.assign(params, q);
    itemListFetch({ ...params })
        .then(res => {
            itemList.value = itemList.value.concat(res?.list);
            pagination.total = res.count;
            pagination.total_page = Math.ceil(pagination.total / pagination.page_size);
        })
        .finally(() => {
            spinning.value = false;
        });
};
/* fetch end */
</script>

<style lang="less" scoped>
#parts-list {
    display: flex;
    .menu {
        margin-right: 40px;
        min-width: 320px;
    }
    .content {
        flex: 1;
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
            display: flex;
            margin-bottom: 32px;
            .tab-item {
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
