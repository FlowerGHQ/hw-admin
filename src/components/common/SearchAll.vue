
<template>

        <!-- 
        使用例子
        * 代表必填字段
        options: [
            {
                id: 2, // 随意
              * type: "select", // 类型
              * key: 'n.type', // 名称
              * value: undefined, // 绑定值
              * searchParmas: "type", // 返回的搜索名称
                selectMap: ITEM.TYPE_MAP,
                    select中的数据(里面字段必须这样)
                    数组 
                    [{
                        * zh: '整车', 
                        * en: 'Vehicle', 
                        * value: 1  // a-select-option 中的 :value="item.value"  // 固定的
                    }]
                    对象
                    {
                    '1': { key: 1, zh: '整车', en: 'Vehicle', value: 1 }, 
                    }            
              * placeholder: "def.select",
            }
        ]
        @search  // 搜索事件  返回了数据
        @reset  // 重置事件


        <test 
            :options="options" 
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
        </test>

        父组件接收

            //父组件中接收子组件传的data
            getSearchFrom(data) {
                for(let key in data){
                    this.searchForm[key] = data[key];
                }
                this.getSearchFrom();
            },

     -->
    <div class="search-container search-container-new">

        <a-row :gutter="[20,20]" class="search-area">
            <slot name="deafult">
                <template v-for="(item, index) in options" :key="index">
                    <a-col v-if="item.type === 'input'" :xs="24" :sm="24" :xl="8" :xxl="6" class="search-box">
                        <div  class="item-box">
                            <div class="key-box">
                                {{ $t(item.key) }}
                            </div>
                            <div class="value-box">
                                <a-input
                                    :placeholder="$t('def.input')"
                                    v-model:value="item.value"
                                    @keydown.enter="handleSearch" />
                            </div>
                        </div>
                    </a-col>    
                    <a-col v-else-if="(item.type === 'select')" :xs="24" :sm="24" :xl="8" :xxl="6" class="search-box" >

                        <div  class="item-box">
                            <div class="key-box">
                                {{ $t(item.key) }}
                            </div>
                            <div class="value-box">
                                <a-select
                                    v-model:value="item.value"
                                    :placeholder="$t('def.select')">
                                    <a-select-option
                                        v-for="(val, key) in item.selectMap"
                                        :key="key"
                                        :value="val.value"
                                        >{{ val[$i18n.locale] }}</a-select-option
                                    >
                                </a-select>
                            </div>
                        </div>
                    </a-col>
                </template>
            </slot>
            <slot name="time"></slot>
            <slot name="extend"></slot>
        </a-row>
        <div class="btn-area-box" >

            <a-button @click="handleSearchReset" v-if="isShowButton">{{ $t("def.reset") }}</a-button>
            <a-button @click="handleSearch" type="primary" v-if="isShowButton">
                {{  $t("def.search") }}
            </a-button>
            
            <!-- 缩起和展开 -->
            <a-button type="link" @click="moreSearch" v-if="isShowMore">

                {{ isShow ? $t("def.stow") : $t("def.unfold") }}
                <i class="icon i_xialajiantouxiao m-l-5" v-if="!isShow" ></i>
                <i class="icon i_shouqijiantouxiao m-l-5" v-else ></i>

            </a-button>
        </div>
    </div>
</template>

<script>
import Core from "@/core";
export default {
    name: 'SearchAll',
    props: {
        options: {
            type: Array,
            default: function() {
                return [
                    { id: 1, type: "input", value: "name", key: "名称" },
                ];
            }
        },
        // 搜索框展示个数 ，default: 1--默认两个
        preSentationNumber: {
            type: Number,
            default: 1
        },
        // 是否需要-展开收起
        isShowMore: {
            type: Boolean,
            default: true
        },
        // 是否需要-搜索重置按钮
        isShowButton: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            // 搜索对象
            searchForm: {},
            isShow: false,
            searchDom: undefined, // DOM结构
        }
    },
    mounted() {
        // 如果需要展开收起
        if(this.isShowMore){
            // 获取DOM结构个数
            this.searchDom = document.querySelectorAll('.search-box')
            this.getSearchItem();
        }
    },
    beforeDestroy() {
        
    },
    methods:{
        
        // 查询
        handleSearch() {
            
            const resultParams = {}
            this.options.forEach(el => {
                resultParams[el.searchParmas] =  el.value
            })
            this.$emit("search", resultParams)

        },
        // 重置
        handleSearchReset() {

            
            this.options.forEach(el => {
                el.value = undefined
            })

            this.$emit("reset")
        },
        // 展开更多
        moreSearch() {

            this.isShow = !this.isShow;
            this.$emit('freshPageHeight');

            /* 不需要-展开收起 */
            if(!this.isShowMore) return;

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
                    el.style.display = type
                }
            })
        }
    },
}
</script>
<style lang="less" scoped>

.m-l-5 {
    margin-left: 5px;
}
</style>