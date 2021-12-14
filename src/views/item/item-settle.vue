<template>
<div id="ItemSettle" class="list-container">
    <div class="title-area">结算</div>
    <div class="config-list">
        <div class="config-item">
            <div class="config-title">1.配送选项</div>
            <div class="config-content edit-mode" v-if="editMode">
                
            </div>
            <div class="config-content select-mode" v-else></div>
        </div>
        <!-- <div class="config-item">
            <div class="config-title">2.付款</div>
            <div class="config-content"></div>
        </div> -->
    </div>
    <div class="item-list"></div>
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

            editMode: false,
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