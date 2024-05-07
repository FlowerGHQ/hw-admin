<template>
    <a-cascader
        class="CountryCascader"
        :placeholder="$t('n.choose')"
        v-model:value="selectCode"
        :options="countryOptions"
        @change="handleChange"
        :field-names="fieldNames"
    />
</template>

<script>
import Core from '../../core';
import axios from 'axios';

export default {
    name: 'CountryCascader',
    components: {},
    props: {
        defArea: Array,
        value: Array,
    },
    emits: ['select', 'search', 'update:value'],
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
                    this.selectCode = [...n];
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
            console.log('handleChange value:', value);
            console.log('handleChange selectedOptions:', selectedOptions);
            this.selectItems = selectedOptions;

            if (selectedOptions) {
                this.$emit(
                    'update:value',
                    selectedOptions.map(item => ({
                        code: item.code,
                        name: item.name,
                        name_en: item.name_en,
                    })),
                );
            } else {
                this.$emit('update:value', []);
            }
            this.$emit('search', { continent: value[0], country: value[1] });
        },
        handleReset() {
            this.selectCode = [];
            this.selectItems = [];
        },
    },
};
</script>
<style lang="less">
.ant-cascader-input.ant-input {
    width: 100%;
}
</style>
