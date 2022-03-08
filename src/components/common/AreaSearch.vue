<template>
<a-cascader
    placeholder="请选择大洲/国家"
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
    name: 'AreaSearch',
    components: {},
    props: {},
    emits: ['search'],
    data() {
        return {
            fieldNames: {},
            countryOptions: [],

            selectCode: [],
            selectItems: [],
        }
    },
    watch: {
        '$i18n.locale': {
            deep: true,
            immediate: true,
            handler(n) {
                let fieldNames = { label: 'name_en', value: 'code' , children: 'children', }
                switch (n) {
                    case 'zh': fieldNames.label = 'name'; break;
                }
                this.fieldNames = fieldNames
            }
        }
    },
    computed: {},
    created() {},
    mounted() {
        this.getCountryOptions();
    },
    methods: {
        // 获取 地址选择列表
        getCountryOptions(level) {
            axios.get('/ext/continent-country.json').then(response => {
                this.countryOptions = response.data;
            })
        },
        handleChange(value, selectedOptions) {
            this.selectItems = selectedOptions

            this.$emit('search', {continent: value[0], country: value[1]})
            this.$emit('select', ...this.selectedOptions)
        },
        handleReset() {
            this.selectCode = []
            this.selectItems = []
        }
    },
}
</script>