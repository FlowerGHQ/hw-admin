<template>
    <div class="add-mail edit-container">
        <div class="title-container">
            <div class="title-area">你好啊</div>
        </div>

        <div class="container-block">
            <a-row class="horizontal-search-row">
                <a-col class="search-col">
                    <div class="key">
                        选择模板
                    </div>
                    <div class="value">
                        
                    </div>
                </a-col>
                <a-col class="search-col required">
                    <div class="key">
                        收件人
                    </div>
                    <div class="value">
                        <a-radio v-model:checked="checked">Radio</a-radio>
                    </div>
                </a-col>
                <a-col class="search-col">
                    <div class="key">
                        主标题
                    </div>
                    <div class="value">
                        
                    </div>
                </a-col>
                <a-col class="search-col">
                    <div class="key">
                        开头称呼
                    </div>
                    <div class="value">
                        
                    </div>
                </a-col>
                <a-col class="search-col">
                    <div class="key">
                        正文内容
                    </div>
                    <div class="value">
                        
                    </div>
                </a-col>
                <a-col class="search-col">
                    <div class="key">
                        链接
                    </div>
                    <div class="value">
                        
                    </div>
                </a-col>
                <a-col class="search-col">
                    <div class="key">
                        海报
                    </div>
                    <div class="value">
                        
                    </div>
                </a-col>
                <a-col class="search-col">
                    <div class="key">
                        二维码
                    </div>
                    <div class="value">
                        
                    </div>
                </a-col>
                <a-col class="search-col">
                    <div class="key">
                        定时发送
                    </div>
                    <div class="value">
                        
                    </div>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'


const formData = ref({

})

</script>

<style lang="less" scoped>
.add-mail {
    .container-block {
    }
}
</style>
