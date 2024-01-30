<template>
    <el-cascader
        :options="countryOptions"
        v-model="value"
        :props="props"
        clearable
        filterable
        class="cascader-area"
        :placeholder="$t('n.choose')"
        @change="handleChange" />
</template>

<script setup>
import Core from "@/core";
import axios from "axios";
import { ref, computed, getCurrentInstance, watch, onMounted, h } from "vue";
const $emit = defineEmits(["update:value"]);
const $props = defineProps({
    value: {
        type: Array,
        default: () => [],
    },
});

// 前端获取所有大洲及国家的json文件
const countryOptions = ref([]);
const props = { multiple: true };

// 给大洲的所有子元素添加父级code,并且添加一个全选
const addParentCode = (arr, parentCode, parentName) => {
    arr.forEach((item) => {
        item.parentCode = parentCode;
        item.parentName = parentName;
        item.label = item.name;
        item.value = item.name;
        if (item.children && item.children.length) {
            addParentCode(item.children, item.code, item.name);
        }
    });
    return arr;
};
const getCountryOptions = () => {
    axios.get("/ext/continent-country.json").then((response) => {
        console.log(response.data);
        countryOptions.value = addParentCode(response.data, "", "");
        console.log(countryOptions.value);
    });
};
// 触发获取
const handleChange = (value) => {
    $emit("update:value", value);
};

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
            box-shadow: none  !important;
            border: 1px solid #EAECF2;
           
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
    &:hover {
       .el-input{
              .el-input__wrapper{
                border-color: #409EFF !important;
              }
       }
    }
    
}
</style>
