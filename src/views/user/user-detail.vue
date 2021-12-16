<template>
<div id="UserDetail">
</div>
</template>

<script>
import Core from '../../core';
export default {
    name: 'UserDetail',
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
// #UserDetail {}
</style>