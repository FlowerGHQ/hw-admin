<template>
    <div id="mall-footer">
        <div class="content">
            footer
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
#mall-footer{
    height: var(--footer-h-pc-mall);
    overflow: hidden;
    background-color: #000;
    color: #FFF;
    .content {
        margin: 0 auto;
        width: 75%;
    }
    @media (min-width: 820px) {}
    @media (max-width: 820px) {}
}
</style>