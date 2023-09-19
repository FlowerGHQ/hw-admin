<template>
    <div id="Staging">
        工作台
        <UserDetail />
    </div>
</template>

<script>
import Core from '../../core';
import UserDetail from './components/UserDetail.vue';
export default {
    name: 'Staging',
    components: {
        UserDetail,
    },
    props: {},

    data() {
        return {
        };
    },
    watch: {},
    computed: {
    },
    mounted() {
    },
    methods: {
    }
};
</script>

<style lang="less" scoped></style>
