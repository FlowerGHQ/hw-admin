
    <!-- 
        例子：
            <searchAll :options = "searchList" @search = "getSearchFrom" @reset = "handleSearchReset" >
                // 时间插槽
                <template v-slot:time>
                    <div  class="item-box">
                        <div class="key-box">
                            {{ $t("d.create_time") }}
                        </div>
                        <div class="value-box">
                            <TimeSearch @search="handleOtherSearch" ref="TimeSearch" />
                        </div>
                    </div>
                </template>
            </searchAll>
        
            搜索组件：样式+重置+查询+可slot自定义(slot = extend、slot = time)

            使用方法：slot = deafult
                1.父组件prop: options 例如： 
                        options = [
                            { type: "input", value: "name",  tabname: 'n.name', },                                           // 名称
                            { type: "select", value: "type",  tabname: 'n.type', selectMap: this.itemTypeMap },              // 类型
                            { type: "select-val", value: "source_type",  tabname: 'i.source_type', selectMap: this.SOURCE_TYPE }, // 来源
                            { type: "input", value: "code", tabname: 'i.code', },                                        // 商品编码
                            { type: "select", value: "status", tabname: 'i.status', selectMap: this.itemStatusMap },    // 商品状态  
                        ]

                        属性使用：    
                            type： 填写项类型 input、select、select-val
                            selectMap: 来选择下拉的数组
                            tabname：填写项名称
                            value： 需要请求的属性名

                2.父组件接收

                    //父组件中接收子组件传的data
                    getSearchFrom(data) {
                        for(let key in data){
                            this.searchForm[key] = data[key];
                        }
                        this.handleSearch();
                    },


                    select: 

                            STATUS_LIST: [
                                { zh: '全部', en: 'All', value: '1' },
                                { zh: '上架中', en: 'Active', value: '0' },
                                { zh: '已下架', en: 'Inactive', value: '-1' },
                            ],
                    select-val:

                            SOURCE_TYPE: {
                                '1': { id: 1, value: 'EOS' },
                                '2': { id: 2, value: 'ERP' }
                            },



    -->
<template>
    <div class="search-container search-container-new">

        <a-row class="search-area">
            <slot name="deafult">
                <template v-for="(item, index) in options" :key="index">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-box" v-if="index > 1 ? show : true">
                        <div v-if="item.type === 'input'" class="item-box">
                            <div class="key-box">
                                {{ $t(item.tabname) }}
                            </div>
                            <div class="value-box">
                                <a-input
                                    :placeholder="$t('def.input')"
                                    v-model:value="searchForm[item.value]"
                                    @keydown.enter="handleSearch" />
                            </div>
                        </div>
                        <div v-else-if="item.type === 'select'" class="item-box">
                            <div class="key-box">
                                {{ $t(item.tabname) }}
                            </div>
                            <div class="value-box">
                                <a-select
                                    v-model:value="searchForm[item.value]"
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
                        <div v-else-if="item.type === 'select-val'" class="item-box">
                            <div class="key-box">
                                {{ $t(item.tabname) }}
                            </div>
                            <div class="value-box">
                                    <a-select
                                        v-model:value="searchForm[item.value]"
                                        :placeholder="$t('def.select')">
                                        <a-select-option
                                            v-for="(val, key) in item.selectMap"
                                            :key="key"
                                            :value="val.id"
                                        >
                                            {{ val.value }}
                                        </a-select-option>
                                </a-select>
                            </div>
                        </div>
                    </a-col>
                </template>
            </slot>
            <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-box" v-if="show">
                <slot name="time"></slot>
            </a-col>
            <slot name="extend"></slot>
        </a-row>
        <div class="btn-area-box">
            <a-button @click="handleSearch" type="primary">
                {{  $t("def.search") }}
            </a-button>
            <a-button @click="handleSearchReset">{{ $t("def.reset") }}</a-button>
            
            <a-button type="link" @click="moreSearch">
                {{ show ? $t("def.stow") : $t("def.unfold") }}
                <i
                    class="icon i_xialajiantouxiao"
                    style="margin-left: 5px"
                    v-if="!show"
                ></i>
                <i
                    class="icon i_shouqijiantouxiao"
                    style="margin-left: 5px"
                    v-else
                ></i>
            </a-button>
        </div>
    </div>
</template>

<script>
import Core from "@/core";
export default {
    name: 'searchAll',
    props: {
        options: {
            type: Array,
            default: function() {
                return [
                    { id: 1, type: "input", value: "name", key: "名称" },
                ];
            }
        }
    },
    data() {
        return {
            searchForm: {},
            show: false,
        }
    },
    watch: {
        options: {
            handler (newVal) {
                let obj = {};
                newVal.forEach((item)=>{
                    obj[item.value] = '';
                    if(item.type === 'select') { obj[item.value] = undefined }
                    else if(item.type === 'select-val') obj[item.value] = undefined;
                })
                this.searchForm = Core.Util.deepCopy(obj);
                
            },
                deep: true,
                immediate: true
        }
    },
    mounted() {
    },
    beforeDestroy() {
    },
    methods:{
        
        // 查询
        handleSearch() {
            this.$emit("search", this.searchForm)
        },
        // 重置
        handleSearchReset() {

            this.searchForm = JSON.parse(JSON.stringify(this.$options.data().searchForm));
            this.$emit("reset")
        },
        
        moreSearch() {
            this.show = !this.show;
            this.$emit('freshPageHeight')
        },
    },
}
</script>
<style lang="less" scoped>

</style>