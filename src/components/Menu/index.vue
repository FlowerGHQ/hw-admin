<template>
    <div class="media-center-menu">
        <a-menu
            v-model:openKeys="openKeys"
            v-model:selectedKeys="selectedKeys"
            mode="inline"
            @select="handleSelect"
            @openChange="handleOpenChange"
            :inlineIndent="12"
        >
            <template v-for="item in menuData" :key="item.key">
                <MenuSub :menuInfo="item" />
            </template>
        </a-menu>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import MenuSub from '@/components/Menu/Sub.vue';
import Core from '@/core';

const emit = defineEmits(['handleSelect', 'openChange']);
const props = defineProps({
    openKeys: {
        type: Array,
        default: [],
    },
    selectedKeys: {
        type: Array,
        default: [],
    },
    menuData: {
        type: Array,
        default: [],
    },
});

// 面包屑数据
const breadcrumbData = ref([]);

const rootSubmenuKeys = computed(() => {
    return props.menuData.map(item => item.id);
});

// 获取图片资源分类树状数据

const getDataByParent = (parent_id = 0) => {
    // 通过父节点获取子级数据
    Core.Api.ItemCategory.tree({
        page: 0,
        parent_id: parent_id,
        is_authority: 1,
        depth: 3,
    })
        .then(res => {
            props.menuData = res?.list ? filterChildren(res.list) : [];
        })
        .catch(err => {
            console.log('getDataByParent err', err);
        });
};

const filterChildren = (arr, level = 0) => {
    return arr;
};
const handleSelect = val => {
    breadcrumbData.value = [];
    emit('handleSelect', val);
};
const handleOpenChange = val => {
    let openKeys = props.openKeys;
    openKeys = filterKeys(props.menuData, openKeys);
    console.log('openChange', openKeys);
    emit('openChange', openKeys);
};
const filterKeys = (arr, openKeys) => {
    if (openKeys.length < 2) return openKeys;
    let newKeys = [];
    findNextKey(arr, openKeys, 0);
    function findNextKey(arr, openKeys, index) {
        const latestOpenKey = openKeys[openKeys.length - 1];
        const rootSubmenuKeys = arr.map(item => item.id);
        const nowKey = openKeys[index];
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            const nextArr = arr.find(item => item.id === nowKey).children;
            newKeys.push(nowKey);
            index += 1;
            return findNextKey(nextArr, openKeys, index);
        } else {
            return newKeys.push(latestOpenKey);
        }
    }
    return newKeys;
};
onMounted(() => {
    getDataByParent();
});
</script>

<style lang="less" scoped>
:deep(.ant-menu-root) {
    > .no-child-item {
        background: #f5f5f5;
        font-size: 16px;
        font-weight: 500;
        color: #333;
        line-height: 18px;
        background-color: #f5f5f5 !important;
        &:hover {
            color: @theme-color;
            font-weight: 600 !important;
        }
    }
    > li {
        background: #f5f5f5;
        font-size: 12px;
        font-weight: 500;
        line-height: 18px;
        background-color: #f5f5f5 !important;
        > .ant-menu-submenu-title {
            color: #333333;
            &:hover {
                color: @theme-color;
            }
            .ant-menu-submenu-arrow {
                color: #333333;
            }
        }
    }
}

// [data-v-b858dc4f] .ant-menu-root > .ant-menu-submenu-selected .ant-menu-item-selected
:deep(.no-child-item) {
    font-weight: 500;
    background-color: #f2f2f2;
    margin: 0;
    border-bottom: 1px solid #f5f5f5;
    &::after {
        display: none;
    }
    // 点击时的字体颜色
    &:hover {
        color: @theme-color;
    }
}

:deep(.ant-menu-item-icon) {
    display: none !important;
}
:deep(.ant-menu-submenu-selected) {
    color: #333333 !important;
}
:deep(.ant-menu-sub.ant-menu-inline) {
    background-color: #f5f5f5;
    font-weight: 500;
    .ant-menu-submenu {
        > .ant-menu-submenu-title {
            font-weight: 500;
            background-color: #f5f5f5;
            &:hover,
            &:focus,
            &:active {
                color: @theme-color !important;
                font-weight: 600 !important;
                background-color: #f5f5f5 !important;
            }
            .ant-menu-submenu-arrow {
                font-weight: 500;
            }
        }
    }
    .ant-menu-submenu-active {
        &:hover,
        &:focus,
        &:active {
            font-weight: 500;
        }
        > .ant-menu-submenu-title {
            font-weight: 500;
            background-color: #f5f5f5;
        }
    }
    > .no-child-item {
        &:hover,
        &:focus,
        &:active {
            color: @theme-color;
            font-weight: 600 !important;
            background-color: #f5f5f5;
        }
    }
}
//  .ant-menu-submenu-title .ant-menu-item-icon + span,
:deep(.ant-menu-submenu-title) {
    background-color: #fff;
    margin: 0;
    border-bottom: 1px solid #f5f5f5;
    .ant-menu-item-icon {
        & + span {
            margin-left: 0 !important;
        }
    }
}
:deep(.ant-menu) {
    &:not(.ant-menu-horizontal) .ant-menu-item-selected {
        background-color: rgba(143, 0, 255, 0.15);
        color: @theme-color;
    }
    .ant-menu-vertical .ant-menu-item,
    .ant-menu-vertical-left .ant-menu-item,
    .ant-menu-vertical-right .ant-menu-item,
    .ant-menu-inline .ant-menu-item,
    .ant-menu-vertical .ant-menu-submenu-title,
    .ant-menu-vertical-left .ant-menu-submenu-title,
    .ant-menu-vertical-right .ant-menu-submenu-title,
    .ant-menu-inline .ant-menu-submenu-title,
    > .ant-menu-submenu > .ant-menu-submenu-title {
        height: 64px;
        line-height: 64px;
        font-size: 16px;
    }
    .ant-menu-submenu-arrow::before,
    .ant-menu-submenu-arrow::after {
        width: 7px;
    }
    .ant-menu-submenu-arrow::before {
        transform: rotate(-45deg) translateX(3.5px);
    }
    .ant-menu-submenu-arrow::after {
        transform: rotate(45deg) translateX(-3.5px);
    }
    .ant-menu-submenu-open.ant-menu-submenu-inline > .ant-menu-submenu-title > .ant-menu-submenu-arrow::before {
        transform: rotate(45deg) translateX(3.3px);
    }
    .ant-menu-submenu-open.ant-menu-submenu-inline > .ant-menu-submenu-title > .ant-menu-submenu-arrow::after {
        transform: rotate(-45deg) translateX(-3.3px);
    }
    .ant-menu-submenu:hover > .ant-menu-submenu-title {
        color: @theme-color;
    }
    .ant-menu-submenu:hover > .ant-menu-submenu-title > .ant-menu-submenu-expand-icon,
    .ant-menu-submenu:hover > .ant-menu-submenu-title > .ant-menu-submenu-arrow {
        color: @theme-color;
    }
}
</style>
