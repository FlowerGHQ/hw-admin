<template>
<a-cascader
    class="AreaCascader"
    placeholder="请选择大洲/国家"
    v-model:value="selectCode"
    :options="countryOptions"
    @change="handleChange"
    :field-names="fieldNames"
    ref='AreaCascader'
/>
</template>

<script>
import Core from '../../core';
import axios from 'axios';

export default {
    name: 'AreaSearch',
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
        }
    },
    watch: {
        '$i18n.locale': {
            deep: true,
            immediate: true,
            handler(n) {
                console.log('$i18n.locale n:', n)
                let fieldNames = { label: 'name_en', value: 'code' , children: 'children', }
                switch (n) {
                    case 'ch': fieldNames.label = 'name'; break;
                }
                this.fieldNames = fieldNames
            }
        },
        defArea: {
            deep: true,
            immediate: true,
            handler(n) {
                if (n.length && n[1]) {
                    this.selectCode = [...n]
                }
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
        getCountryOptions() {
            axios.get('/ext/continent-country.json').then(response => {
                this.countryOptions = response.data;
            })
        },
        handleChange(value, selectedOptions) {
            this.selectItems = selectedOptions

            this.$emit('search', {continent: value[0], country: value[1]})
            this.$emit('update:value', selectedOptions.map(item => ({
                code: item.code,
                name: item.name,
                name_en: item.name_en
            })))
        },
        handleReset() {
            this.selectCode = []
            this.selectItems = []
        }
    },
}
</script>