
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
                扩展例子  id="search-item"必填(用于获取dom结构) 里面的随意样式可自定义或者按照这个类来定义
                <a-col
                    :xs="24" :sm="24" :xl="8" :xxl="6" 
                    id="search-item"
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
     -->
    <div class="search-all search-container-new">
        <a-row :gutter="[24,16]" class="search-area" ref="searchRow">
                <slot name="default">
                    <template v-for="(item, index) in options" :key="index">
                        <a-col 
                            v-if="item.type === 'input'" 
                            :xs="24" :sm="24" :xl="8" :xxl="6" 
                            id="search-item"
                        >
                            <!-- 输入框 -->
                            <div class="item-box">
                                <div class="key-box">
                                    {{ $t(item.key) }}
                                </div>
                                <div class="value-box">
                                    <a-input
                                        :placeholder="$t(item.placeholder)"
                                        v-model:value="item.value"
                                        @keydown.enter="handleSearch" />
                                </div>
                            </div>
                        </a-col>
                        <a-col 
                            v-else-if="item.type === 'select'" 
                            :xs="24" :sm="24" :xl="8" :xxl="6" 
                            id="search-item"
                        >
                            <!-- 下拉选择 -->
                            <div class="item-box">
                                <div class="key-box">
                                    {{ $t(item.key) }}
                                </div>
                                <div class="value-box">
                                    <a-select
                                        v-model:value="item.value"
                                        :placeholder="$t(item.placeholder)">
                                        <a-select-option
                                            v-for="(item, index) in item.selectMap"
                                            :key="index"
                                            :value="item.value"
                                            >
                                            {{ item[$i18n.locale] }}
                                        </a-select-option>
                                    </a-select>
                                </div>
                            </div>
                        </a-col>
                    </template>
                </slot>
                <slot name="extend"></slot>
        </a-row>
        <div class="btn-area">
            <a-button @click="handleSearch" type="primary">
                {{  $t("def.search") }}
            </a-button>
            <a-button @click="handleSearchReset">
                {{ $t("def.reset") }}
            </a-button>

            <!-- 缩起和展开 -->
            <a-button type="link" @click="moreSearch">
                {{ isShow ? $t("def.stow") : $t("def.unfold") }}
                <i
                    class="icon i_xialajiantouxiao m-l-5"
                    v-if="!isShow"
                ></i>
                <i
                    class="icon i_shouqijiantouxiao m-l-5"
                    v-else
                ></i>
            </a-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SearchAll',
    props: {
        options: {
            type: Array,
            default: () => [
                // { 
                //     id: 1,
                //     type: "input", 
                //     key: 'n.name',                
                //     value: undefined,
                //     searchParmas: "name",
                //     placeholder: "def.input",
                // },
                // { 
                //     id: 2,
                //     type: "select",
                //     key: 'n.type',
                //     value: undefined,
                //     searchParmas: "type",
                //     selectMap: ITEM.TYPE_MAP,
                //     placeholder: "def.select",
                // },
                // { 
                //     id: 3,
                //     type: "select", 
                //     key: 'i.source_type', 
                //     value: undefined,
                //     searchParmas: "source_type",
                //     selectMap: (() => {
                //         const result = Core.Util.deepCopy(ITEM.SOURCE_TYPE)
                //         for (const i in result) {
                //             result[i].zh = result[i].value
                //             result[i].en = result[i].value
                //             result[i].value = result[i].id
                //         }
                //         console.log("过滤的结果", result);
                //         return result
                //     })(),
                //     placeholder: "def.select",
                // },
                // { 
                //     id: 4,
                //     type: "input", 
                //     key: 'i.code', 
                //     value: undefined,
                //     searchParmas: "code",
                //     placeholder: "def.input",
                // },
                // { 
                //     id: 5,
                //     type: "select", 
                //     key: 'i.status',
                //     value: undefined,
                //     searchParmas: "status",
                //     selectMap: ITEM.STATUS_LIST,
                //     placeholder: "def.select",
                // }
            ]
        },
        // 搜索框展示个数
        preSentationNumber: {
            type: Number,
            default: 2
        }
    },
    data() {
        return {
            isShow: false, // 是否缩起 默认缩起
            searchDom: undefined, // DOM结构
        }
    },
    watch: {},
    mounted() {
        // 获取DOM结构个数
        this.searchDom = document.querySelectorAll('#search-item')
        for (const i in this.searchDom) {
            if (i > this.preSentationNumber) {
                this.searchDom[i].style.display = 'none'
            }
        }
    },
    beforeDestroy() {},
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

        // 缩起和展开
        moreSearch() {
            this.isShow = !this.isShow;
            if (this.isShow) {
                this.searchDom.forEach((el, index) => {
                    if (index > this.preSentationNumber) {
                        el.style.display = 'block'
                    }
                })
            } else {
                this.searchDom.forEach((el, index) => {
                    if (index > this.preSentationNumber) {
                        el.style.display = 'none'
                    }
                })
            }
        },
    },
}
</script>
<style lang="less">
.search-all {
    width: 100%;
    background-color: #F7F8FA;
    padding: 20px;
    box-sizing: border-box;

    .search-area {}
    .btn-area {        
    }
}
.m-l-5 {
    margin-left: 5px;
}
</style>