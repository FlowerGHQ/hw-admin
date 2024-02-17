<template>
    <!-- 标签多选形式 - 同CountryCascader -->
    <a-cascader
        class="CountryCascader"
        :placeholder="$t('n.choose')"
        v-model:value="selectCode"
        :options="countryOptions"
        :show-search="{ filter }"
        @change="handleChange"
        :field-names="fieldNames"
        :maxTagCount="1000"
        multiple
    />
</template>

<script>
import Core from '../../core';
import axios from 'axios';

export default {
    name: 'CountryCascaderTabMore',
    components: {},
    props: {
        defArea: Array,
        value: Array,
        codeList: Array,
    },
    emits: ['select', 'search', 'update:value'],
    data() {
        return {
            fieldNames: {},
            countryOptions: [],

            selectCode: [], // 城市数组
            selectItems: [],
            // selectcountryTwoList: [], // 二层数组-放入父级 【【'亚洲'】，【'欧洲','爱尔兰'】】

            // code代码列表(包含子集父级code,用于回显tab)
            codeListAll: [],
        };
    },
    watch: {
        '$i18n.locale': {
            deep: true,
            immediate: true,
            handler(n) {
                let fieldNames = { label: 'name_en', value: 'name', children: 'children' };
                switch (n) {
                    case 'zh':
                        fieldNames.label = 'name';
                        break;
                }
                this.fieldNames = fieldNames;
            },
        },
        defArea: {
            deep: true,
            immediate: true,
            handler(n) {
                if (n && n.length && n[1]) {
                    this.selectCode = [...n]; // 城市数组
                    // this.selectcountryTwoList = Core.Util.deepCopy(this.selectCode);
                    this.selectCode = this.selectCode.map(item => {
                        return [item];
                    });
                }
            },
        },
        codeList: {
            deep: true,
            immediate: true,
            handler(n) {
                if (n && n.length && n[1]) {
                    this.codeListAll = [...n];

                    // 通过code寻找对应父级名称 或无父级选其本身country值
                    this.findFartherOrSelf();
                }
            },
        },
    },
    computed: {},
    created() {},
    mounted() {
        this.getCountryOptions();
    },
    methods: {
        // 获取 地址选择列表
        getCountryOptions() {
            axios.get('/ext/continent-country.json').then(response => {
                this.countryOptions = response.data;
            });
        },
        handleChange(value, selectedOptions) {
            this.selectItems = selectedOptions;
            let arrAll = [];
            selectedOptions.map(($1, ind1) => {
                let arrObj = [];
                arrObj = $1[$1.length - 1];
                let obj = {
                    code: arrObj?.code,
                    name: arrObj?.name,
                    name_en: arrObj?.name_en,
                };
                arrAll.push(obj);
            });

            this.$emit('update:value', arrAll);
            this.$emit('search', { continent: value[0], country: value[1] });
        },
        handleReset() {
            this.selectCode = [];
            this.selectItems = [];
        },

        // 通过code寻找对应父级名称 或无父级选其本身country值
        findFartherOrSelf() {
            let arr = this.countryOptions;
            for (let $1 of arr) {
                // 被选中的code在codelist中的 index
                for (let $2 of $1.children) {
                    let index_ = this.codeListAll.findIndex(item => item === $2.code);
                    if (index_ !== -1) {
                        this.selectCode[index_] = [$1.name, ...this.selectCode[index_]];
                    }
                }
            }
        },
    },
};
</script>
<style lang="less">
.ant-cascader-input.ant-input {
    width: 100%;
}
</style>
