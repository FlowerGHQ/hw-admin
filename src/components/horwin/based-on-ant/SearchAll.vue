<template>
    <!-- 
        使用例子
        * 代表必填字段
        options: [
            { 
                id: 1, // 输入框
                type: "input", 
                value: "", 
                searchParmas: "name",  
                allowClear: true, // 是否需要清除按钮
                key: 'supply-chain.company_name' 
            },
            {
                id: 2, // 下拉框
              * type: "select", // 类型
              * key: 'n.type', // 名称
              * value: undefined, // 绑定值
              * searchParmas: "type", // 返回的搜索名称
                selectMap: ITEM.TYPE_MAP,
                    select中的数据(里面字段必须这样)
                    数组 
                    [{
                        * (zh: '整车', * en: 'Vehicle', || t: 'xxxx')
                        * value: 1  // a-select-option 中的 :value="item.value"  // 固定的
                    }]
                    对象
                    {
                        '1': { 
                            (zh: '整车', * en: 'Vehicle', || t: 'xxxx')
                            vlaue: 1, 
                        }, 
                    }            
              * placeholder: "def.select",
            }
        ]
        isShowMore  // 是否需要-展开收起(默认true)
        isShowButton  // 是否需要-搜索重置按钮(默认true)
        @search=fn(data)  // 搜索事件  返回了数据
        @reset  // 重置事件


        <SearchAll 
            :options="options" 
            :isShowMore="true"
            :isShowButton="true"
            @search="getSearchFrom" 
            @reset="handleSearchReset"
        >
            <template v-slot:extend>
                扩展例子  class="search-box" 必填(用于获取dom结构) 里面的随意样式可自定义或者按照这个类来定义
                <a-col
                    :xs="24" :sm="24" :xl="8" :xxl="6" 
                    class="search-box"
                >
                    <div class="item-box">
                        <div class="key-box">
                            ...
                        </div>
                        <div class="value-box">
                            ...
                        </div>
                    </div>
                </a-col>
            </template>

            按钮扩展例子前后
            <template #pre_btn></template>
            <template #after_btn></template>
        </SearchAll>
     -->
    <div class="search-all search-container-new">
        <a-row :gutter="[20, 20]" class="search-area">
            <slot name="deafult">
                <template v-for="(item, index) in options" :key="index">
                    <a-col v-if="item.type === 'input'" :xs="24" :sm="24" :xl="11" :xxl="8" class="search-box">
                        <div class="item-box">
                            <div class="key-box">
                                {{ $t(item.key) }}
                            </div>
                            <div class="value-box">
                                <a-input
                                    :allowClear="item.allowClear || false"
                                    :placeholder="$t(`${item.placeholder || 'def.input'}`)"
                                    v-model:value="item.value"
                                    @keydown.enter="handleSearch"
                                />
                            </div>
                        </div>
                    </a-col>
                    <a-col v-else-if="item.type === 'select'" :xs="24" :sm="24" :xl="11" :xxl="8" class="search-box">
                        <div class="item-box">
                            <div class="key-box">
                                {{ $t(item.key) }}
                            </div>
                            <div class="value-box">
                                <a-select
                                    v-model:value="item.value"
                                    :placeholder="$t(`${item.placeholder || 'def.input'}`)"
                                >
                                    <a-select-option v-for="(val, key) in item.selectMap" :key="key" :value="val.value">
                                        {{ val[$i18n.locale] || $t(val.t) }}
                                    </a-select-option>
                                </a-select>
                            </div>
                        </div>
                    </a-col>
                    <a-col
                        v-else-if="item.type === 'select-search-multiple'"
                        :xs="24"
                        :sm="24"
                        :xl="11"
                        :xxl="8"
                        class="search-box"
                    >
                        <div class="item-box">
                            <div class="key-box">
                                {{ $t(item.key) }}
                            </div>
                            <div class="value-box">
                                <a-select
                                    v-model:value="item.value"
                                    :options="item.selectMap"
                                    :mode="item.multiple ? 'multiple' : ''"
                                    show-search
                                    :filter-option="filterOption"
                                    :placeholder="$t(`${item.placeholder || 'def.input'}`)"
                                >
                                </a-select>
                            </div>
                        </div>
                    </a-col>
                    <!-- 时间选择器 -->
                    <a-col v-if="item.type === 'time-range'" :xs="24" :sm="24" :xl="11" :xxl="8" class="search-box">
                        <div class="item-box">
                            <div class="key-box">
                                {{ $t(item.key) }}
                            </div>
                            <div class="value-box">
                                <a-range-picker
                                    v-model:value="item.value"
                                    valueFormat="X"
                                    @keydown.enter="handleSearch"
                                    :format="item.format || 'YYYY-MM-DD'"
                                    :show-time="item.defaultTime"
                                    :valueFormat="item.valueFormat || 'X'"
                                    :allow-clear="false"
                                    :placeholder="[$t('crm_def.start_time'), $t('crm_def.end_time')]"
                                >
                                    <template #suffixIcon><i class="icon i_calendar" /></template>
                                </a-range-picker>
                            </div>
                        </div>
                    </a-col>
                </template>
            </slot>
            <slot name="time"></slot>
            <slot name="extend"></slot>
        </a-row>
        <div class="btn-area-box">
            <slot name="pre_btn"></slot>
            <a-button @click="handleSearchReset" :disabled="disabled" v-if="isShowButton">{{
                $t('def.reset')
            }}</a-button>
            <a-button @click="handleSearch" :disabled="disabled" type="primary" v-if="isShowButton">
                {{ $t('def.search') }}
            </a-button>

            <!-- 缩起和展开 -->
            <a-button type="link" @click="moreSearch" v-if="isShowMore">
                {{ isShow ? $t('def.stow') : $t('def.unfold') }}
                <i class="icon i_xialajiantouxiao m-l-5" v-if="!isShow"></i>
                <i class="icon i_shouqijiantouxiao m-l-5" v-else></i>
            </a-button>
            <slot name="after_btn"></slot>
        </div>
    </div>
</template>

<script>
import Core from '@/core';
export default {
    name: 'SearchAll',
    props: {
        options: {
            type: Array,
            default: function () {
                return [];
            },
        },
        // 搜索框展示个数 ，default: 1--默认两个
        preSentationNumber: {
            type: Number,
            default: 1,
        },
        // 是否需要-展开收起
        isShowMore: {
            type: Boolean,
            default: true,
        },
        // 是否需要-搜索重置按钮
        isShowButton: {
            type: Boolean,
            default: true,
        },
        // 按钮禁用
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            // 搜索对象
            searchForm: {},
            isShow: false,
            searchDom: undefined, // DOM结构
        };
    },
    mounted() {
        // 如果需要展开收起
        if (this.isShowMore) {
            // 获取DOM结构个数
            this.searchDom = document.querySelectorAll('.search-box');
            this.getSearchItem();
        }
    },
    beforeDestroy() {},
    methods: {
        filterOption(input, option) {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
        // 查询
        handleSearch() {
            const resultParams = {};
            this.options.forEach(el => {
                resultParams[el.searchParmas] = el.value;
                // 时间的处理
                if (el.type === 'time-range') {
                    resultParams[el.searchParmas[0]] = el?.value[0] ?? undefined;
                    resultParams[el.searchParmas[1]] = el?.value[1] ?? undefined;
                    delete resultParams[el.searchParmas];
                }
            });
            this.$emit('search', resultParams);
        },
        // 获取数据
        getSearchFrom() {
            const resultParams = {};
            this.options.forEach(el => {
                resultParams[el.searchParmas] = el.value;
                // 时间的处理
                if (el.type === 'time-range') {
                    resultParams[el.searchParmas[0]] = el?.value[0] ?? undefined;
                    resultParams[el.searchParmas[1]] = el?.value[1] ?? undefined;
                    delete resultParams[el.searchParmas];
                }
            });
            return resultParams;
        },
        // 重置
        handleSearchReset() {
            this.options.forEach(el => {
                el.value = undefined;
                if (el.type === 'time-range') {
                    el.value = [];
                }
            });
            console.log('重置', this.options);

            this.$emit('reset');
        },
        // 展开更多
        moreSearch() {
            this.isShow = !this.isShow;
            this.$emit('freshPageHeight');

            /* 展开-设置显示 */
            if (this.isShow) {
                this.getSearchItem('block');
                return;
            }
            /* 非展开-设置隐藏 */
            this.getSearchItem();
        },
        // 更改dom显隐
        getSearchItem(type = 'none') {
            this.searchDom.forEach((el, index) => {
                if (index > this.preSentationNumber) {
                    el.style.display = type;
                }
            });
        },
    },
};
</script>
<style lang="less" scoped>
.search-all {
    width: 100%;
    background-color: #f7f8fa;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .search-area {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
    }
    .btn-area-box {
        display: flex;
        justify-content: flex-end;
        margin-left: 10px;
    }
}
:deep(.ant-input-affix-wrapper) {
    border-radius: 0px 4px 4px 0px;
}
.m-l-5 {
    margin-left: 5px;
}
</style>
