<template>
<div id="DealersDetail">
</div>
</template>

<script>
import Core from '../../core';
export default {
    name: 'DealersDetail',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
        };
    },
    watch: {},
    computed: {},
    mounted() {},
    methods: {
    }
};
</script>

<style lang="less" scoped>
// #DealersDetail {}
</style>