<template>
    <div id="Index">
        这是一个测试页面
        <button @click="test">
            测试按钮
        </button>
    </div>
</template>

<script>
import jsapi from '../../core/jsapi';
export default {
    name: 'Index',
    data() {
        return {

        };
    },
    mounted() {

    },
    methods: {
        test() {
            console.log('测试');
        }
    }
};
</script>

<style></style>
