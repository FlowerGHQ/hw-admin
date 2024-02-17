<template>
    <a-cascader
        class="ChinaAddressCascader"
        v-model:value="address"
        :options="addressOptions"
        placeholder="请选择省/市/区县"
        :field-names="{ label: 'name', value: 'name', children: 'children' }"
        :show-search="{ filter }"
        @change="handleChange"
        :changeOnSelect="onSelect"
    />
</template>

<script>
import Core from '../../core';
import axios from 'axios';
export default {
    components: {},
    props: {
        defaultAddress: {
            type: Array,
        },
        onSelect: {
            type: Boolean,
            default: false,
        },
    },
    emit: ['select'],
    data() {
        return {
            addressOptions: [], // 地址选择
            addrLevel: '',
            address: [],
        };
    },
    watch: {
        defaultAddress: {
            deep: true,
            immediate: true,
            handler(address) {
                console.log('watch address:', address);
                let len = address.length;
                if (this.addrLevel === len) {
                } else {
                    this.addrLevel = len;
                    this.getRoughlyAddressList(len);
                }
                let _address = Core.Util.deepCopy(address);
                if (_address.every(item => item)) {
                    this.address = _address;
                } else {
                    this.address = [];
                }
            },
        },
    },
    computed: {},
    created() {},
    mounted() {},
    methods: {
        // 获取 地址选择列表
        getRoughlyAddressList(level) {
            let url = '/ext/province-city-county.json';
            switch (level) {
                case 3:
                    url = '/ext/province-city-county.json';
                    break;
                case 4:
                    url = '/ext/province-city-county-street.json';
                    break;
            }
            axios.get(url).then(response => {
                this.addressOptions = response.data;
            });
        },
        // 地址选择搜索
        filter(inputValue, path) {
            return path.some(option => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
        },
        handleChange(value, selectedOptions) {
            console.log('handleChange value:', value);
            this.$emit('select', value);
        },
    },
};
</script>

<style lang="less" scoped>
// .ChinaAddressCascader {}
</style>
