<template>
    <a-cascader
        class="AddressCascader"
        :placeholder="$t('def.select')"
        v-model:value="selectCode"
        :options="countryOptions"
        @change="handleChange"
        :show-search="filter"
        :field-names="fieldNames"
    />
</template>

<script>
import Core from '../../core';
import axios from 'axios';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import enUS from 'ant-design-vue/lib/locale-provider/en_US';

export default {
    name: 'AddressCascader',
    components: {},
    props: {
        defArea: Object,
        value: Object,
        areaType: String,
    },
    emits: ['select', 'update:value'],
    data() {
        return {
            fieldNames: {},
            countryOptions: [],

            selectCode: [],
            selectItems: [],
        };
    },
    watch: {
        '$i18n.locale': {
            deep: true,
            immediate: true,
            handler(n) {
                console.log('$i18n.locale', n);
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
                console.log('defArea n:', n);
                if (!Core.Util.isEmptyObj(n)) {
                    let selectCode = [n.country, n.province, n.city, n.county];
                    this.selectCode = selectCode.filter(item => item);
                }
            },
        },
        areaType: {
            deep: true,
            immediate: true,
            handler(n) {
                this.getCountryOptions();
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
            let data = 'address-cascader';
            if (this.areaType === 'us') {
                data = 'AmericaCity';
            }
            if (this.areaType === 'eur') {
                data = 'EuropeCity';
            }
            if (!this.areaType) {
                data = 'address-cascader';
            }
            axios.get(`/ext/${data}.json`).then(response => {
                this.countryOptions = response.data;
                for (let i = 0; i < this.countryOptions.length; i++) {
                    const element = this.countryOptions[i];
                    if (element.children && element.children.length === 1) {
                        if (!element.children[0].name && !element.children[0].name_en) {
                            element.children = element.children[0].children || null;
                        }
                    }
                }
            });
        },
        handleChange(value, selectedOptions) {
            this.selectItems = selectedOptions;
            let update = {};
            if (!selectedOptions) {
                this.$emit('update:value', update);
                this.$emit('select', update);
                return;
            }
            for (const item of selectedOptions) {
                update[item.key] = {
                    code: item.code,
                    name: item.name,
                    name_en: item.name_en,
                };
            }
            this.$emit('update:value', update);
            this.$emit('select', update);
        },
        handleReset() {
            this.selectCode = [];
            this.selectItems = [];
        },
        filter(inputValue, path) {
            return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
        },
    },
};
</script>
