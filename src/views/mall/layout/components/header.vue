<template>
    <div id="mall-header">
        <div class="content">
            <div id="header-item">
                header
            </div>
            <div id="search">
            </div>
            <div id="menu">
            </div>
        </div>
    </div>
</template>
    
<script>
import Core from '@/core';

export default {
    components: {},
    data() {
        return {
            Core,
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {}
};
</script>
    
<style lang="less">
#mall-header{
    height: var(--header-h-pc-mall);
    overflow: hidden;
    background-color: #FFF;
    .content {
        margin: 0 auto;
        max-width: 1440px;
    }
    @media (min-width: 820px) {}
    @media (max-width: 820px) {}
}
</style>