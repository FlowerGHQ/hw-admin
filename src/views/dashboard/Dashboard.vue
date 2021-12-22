<template>
<!-- 财务结算 -->
<div id="Dashboard">
    <SearchRangePicker @change='handleTimeChange'/>
</div>
</template>

<script>
import Core from '../../core';
import SearchRangePicker from '@/components/statistic/SearchRangePicker.vue'
export default {
    name: 'Dashboard',
    components: {
        SearchRangePicker
    },
    props: {},
    data() {
        return {};
    },
    watch: {},
    computed: {},
    mounted() {},
    methods: {}
};
</script>

<style lang="less" scoped>
// #Dashboard {}
</style>