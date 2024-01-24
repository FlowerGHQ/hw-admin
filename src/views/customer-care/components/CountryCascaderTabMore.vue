<template>
      <a-cascader
            :getPopupContainer="getPopupContainer"
            :placeholder="$t('n.choose')"
            v-model:value="selectCode"
            :options="countryOptions"
            :show-search="{ filter }"
            @change="handleChange"
            @focus="handleFocus"
            :field-names="fieldNames"
            :maxTagCount="1000"
            multiple />
</template>

<script setup>
import Core from "@/core";
import axios from "axios";
import { ref, computed, getCurrentInstance, watch, onMounted, h } from "vue";
// 前端获取所有大洲及国家的json文件
const countryOptions = ref([]);
// 地址选择列表配置
const fieldNames = ref({
    label: "name",
    value: "name",
    children: "children",
});
// 给大洲的所有子元素添加父级code,并且添加一个全选
const addParentCode = (arr, parentCode) => {
    arr.forEach((item) => {
        item.parentCode = parentCode;
        if (item.children && item.children.length) {
            addParentCode(item.children, item.code);
        }
    });
    return arr;
};
const getCountryOptions = () => {
    axios.get("/ext/continent-country.json").then((response) => {
        console.log(response.data);
        countryOptions.value = addParentCode(response.data, "");
        console.log(countryOptions.value);
    });
};
const getPopupContainer = (trigger) => {
    return document.querySelector('.account-management')
};
// 查询选择是否为全选或者单选或者全选和单选都有
const checkMore = (value, selectedOptions) => {
    // 全选的大洲集合
    let allContinent = [];
    // 单选的大洲集合
    let singleContinent = [];
    // 所有国家的集合   
    let allCountry = [];

    // 遍历循环查询value有没有只有一个的情况,如果有证明是全选,如果没有证明是单选
    for (let i = 0; i < value.length; i++) {
        if (value[i].length === 1) {
            allContinent.push(value[i][0]);
        } else {
            singleContinent.push(value[i][0]);
        }
    }
    // 整合数据，如果是全选，就把该大洲的所有国家都放进去
    allContinent.forEach((item) => {
        let children = countryOptions.value.find((i) => i.code === item).children;
        children.forEach((i) => {
            allCountry.push(i.code);
        });
    });
    // 如果是单选，就把该大洲的所选择的国家放进去
    


};

// 触发获取
const handleChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    // 遍历循环查询value有没有只有一个的情况,如果有证明是全选,如果没有证明是单选
    // 
    let isAll = false;
    
    for (let i = 0; i < value.length; i++) {
        if (value[i].length === 1) {
            isAll = true;
            break;
        }
    }
};

onMounted(() => {
    getCountryOptions();
});

</script>
<style lang="less">
    :deep(.ant-cascader-menu) {
        ul {
            &:first-child {
                li {
                    .ant-cascader-checkbox {
                        .ant-cascader-checkbox-inner {
                            &::after {
                                display: none;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
