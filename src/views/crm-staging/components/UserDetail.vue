<template>
    <div id="user-detail">
        <div class="user-panel">
            <img class="avatar" src="../images/avatar.png" alt="">
        </div>
        <div class="user-info-wrap">

        </div>
    </div>
</template>
    
<script>
import Core from '../../../core';
export default {
    name: 'UserDetail',
    components: {},
    props: {},
    data() { 
        return {

        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {

    }
};
</script>
    
<style scoped lang="less">
#user-detail {
    width: 838px;
    height: 258px;
    padding: 20px;
    box-sizing: border-box;
    background:#FFF;
    .user-panel {
        width: 100%;
        display: flex;
        .avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
        }
    }
}
</style>
    