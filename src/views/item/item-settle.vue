<template>
<div id="ItemSettle" class="list-container">
</div>
</template>

<script>
import Core from '../../core';
export default {
    name: 'ItemSettle',
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
// #ItemSettle {}
</style>