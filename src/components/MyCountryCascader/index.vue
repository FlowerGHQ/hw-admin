<template>
    <el-cascader
        :options="targetCountryOptions"
        v-model="value"
        :props="props"
        clearable
        filterable
        class="cascader-area"
        :placeholder="$t('n.choose')"
        @change="handleChange"
        ref="cascader"
        :popper-class="'cascader-area-popper'"
    />
</template>

<script setup>
/**
 * @description:国家选择的级联组件
 * @param {Array} value 选中的值，返回的是一个数组 ps：["中国","日本"] 或者 [["亚洲","中国"],["亚洲","日本"]]
 * @param {Function} handleGetItem 获取选中的数据,返回的是一个数组,ps:[{name: "中国",code: "CN",parentCode: "亚洲",parentName: "中国",parentEnName: "中国"}]
 */
import axios from 'axios';
import { ref, computed, getCurrentInstance, watch, onMounted, h, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import Core from '../../core';
const $locale = useI18n().locale;
const $t = useI18n().t;
const $emit = defineEmits(['update:value', 'handleGetItem']);
const $props = defineProps({
    value: {
        type: Array,
        default: () => [],
    },
    defaultList: {
        type: Array,
        default: () => [],
    },
});
// 前端获取所有大洲及国家的json文件
const countryOptions = ref([]);
const props = { multiple: true };
// 已经绑定的值
const bindArea = ref([]);
const cascader = ref(null);

const targetCountryOptions = computed(() => {
    return addParentCode(countryOptions.value, '', '', '',);
});
// 给大洲的所有子元素添加父级code,并且添加一个全选
const addParentCode = (arr, parentCode, parentName, parentEnName) => {
    arr.forEach(item => {
        item.parentCode = parentCode;
        item.parentName = parentName;
        item.parentEnName = parentEnName;
        // 如果不包含在绑定的值里面并且不在默认值里面
        if (!bindArea.value.includes(item.name) || $props.defaultList.includes(item.name)) {
            item.disabled = false;
        } else {
            item.disabled = true;
        }
        item.label = $locale.value === 'zh' ? item.name : item.name_en;
        item.value = item.name;
        if (item.children && item.children.length) {
            addParentCode(item.children, item.code, item.name, item.name_en);
        }
    });
    return arr;
};
const getCountryOptions = () => {
    axios.get('/ext/continent-country.json').then(response => {
        countryOptions.value = response.data;
    });
};
// 数据扁平化
const flatten = arr => {
    let result = [];
    arr.forEach(item => {
        if (item.children && item.children.length) {
            result = result.concat(flatten(item.children));
        } else {
            result.push(item);
        }
    });
    return result;
};
// 清空搜索框的值
const clearSearch = () => {
    // 级联组件
    let input = document.querySelector('.el-cascader__search-input');
    console.log('input', input);
    if (input) {
        input.value = '';
        // 触发input的change事件
        let event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
    } else {
        console.warn('input不存在');
    }
};
// 触发获取
const handleChange = value => {
    let input = document.querySelector('.el-cascader__search-input');
    // 查看input的值
    console.log('input', input.value);
    if (input.value) {
        clearSearch();
    }
    // 默认传递国家数据
    let arr = [];
    value.forEach(item => {
        arr.push(item[1]);
    });
    // 所有数据扁平化
    let allData = flatten(countryOptions.value);
    // 找到对应arr的name
    let itemData = [];
    arr.forEach(item => {
        allData.forEach(item2 => {
            if (item === item2.name) {
                itemData.push(item2);
            }
        });
    });
    $emit('handleGetItem', itemData);
    $emit('update:value', arr);
};
// 获取已经绑定的值
const getBindValue = () => {
    Core.Api.SalesArea.listAll().then(res => {
        if (res.list && res.list.length > 0) {
            res.list.forEach(item => {
                bindArea.value = bindArea.value.concat(item.country.split(','));
            });
        } else {
            bindArea.value = [];
        }
    });
};
const checkDisableList = (list) => {
    if(list.length) {
        bindArea.value = list   
    } else {
        getBindValue();
    }
}
defineExpose({ checkDisableList });
onMounted(() => {
    getCountryOptions();
});
</script>
<style lang="less">
.cascader-area {
    width: 100%;
    .el-input {
        // 清除所有的样式边框，boxshadow
        .el-input__wrapper {
            box-shadow: none !important;
            border: 1px solid @BC_N;
            padding: 0 11px;
            .el-input__inner {
                // placeholder的颜色
                &::-webkit-input-placeholder {
                    font-size: 12px;
                    color: #bfbfbf;
                }
            }
        }
    }
    .el-cascader__tags {
        max-height: 300px;
        overflow-y: scroll;
        // 滚动条样式
        &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
    }
    // &:hover {
    //     .el-input {
    //         .el-input__wrapper {
    //             border-color: rgb(82, 175, 252) !important;
    //         }
    //     }
    // }
    .is-focus {
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        border-radius: 4px;
        .el-input__wrapper {
            border-color: rgb(82, 175, 252) !important;
        }
    }
}
.cascader-area-popper {
    .el-checkbox.is-disabled {
        .el-checkbox__input.is-disabled {
            .el-checkbox__inner {
                &::after {
                    transform: rotate(45deg) scaleY(1) !important;
                    border-color: var(--el-checkbox-input-border) !important;
                    box-sizing: content-box;
                    content: '';
                    border: 1px solid transparent;
                    border-left: 0;
                    border-top: 0;
                    height: 7px;
                    left: 4px;
                    position: absolute;
                    top: 1px;
                    transform: rotate(45deg) scaleY(0);
                    width: 3px;
                    transition: transform 0.15s ease-in 50ms !important;
                    transform-origin: center;
                }
            }
        }
    }
}
</style>
