<template>
    <div id="Index">
        <div>这是一个测试页面</div> 
        <button class="btn" @click="test">
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
        // this.drawQrcode()
    },
    methods: {
        test() {
            // console.log('测试');
            // axios.post('http://horwintest.natapp1.cc/feishu/authorize/jsapi', {}, {
            //     headers: {
            //         'token': this.token
            //     }
            // })
            //     .then(response => response.json())
            //     .then(data => {
            //         console.log('返回数据', data);
            //     });
            jsapi.apiAuth();
        },
    }
};
</script>

<style scoped>
#Index {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.btn {
    margin-left: 100px;
    width: 100px;        
    height: 100px;
    border: 1px solid red;
}
</style>
