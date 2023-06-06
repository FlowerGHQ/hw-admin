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
import Core from '../../core';
import axios from 'axios';
export default {
    name: 'Index',
    data() {
        return {
            token: ''
        };
    },
    mounted() {
        this.token = Core.Data.getToken()
        console.log('this.token', this.token);
    },
    methods: {
        test() {
            // console.log('测试');
            axios.post('http://horwintest.natapp1.cc/feishu/authorize/jsapi', {}, {
                headers: {
                    'token': this.token
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log('返回数据', data);
                });
        }
    }
};
</script>

<style></style>
