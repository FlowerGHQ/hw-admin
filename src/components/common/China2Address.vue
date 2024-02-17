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
            axios.get('/ext/China.json').then(response => {
                this.countryOptions = response.data;
            });
        },
        handleChange(value, selectedOptions) {
            console.log(
                'handleChange value:',
                value,
                'selectedOptions',
                selectedOptions,
                'this.selectCode',
                this.selectCode,
            );
            this.selectItems = selectedOptions;
            if (value?.length) {
                this.$emit('search', { province: value[0], city: value[1] });
            } else {
                this.$emit('search', { province: '', city: '' });
            }
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
