<template>
    <div class="add-mail edit-container">

        <div class="form-module">
            <div class="module-title">邮件内容</div>            
            <a-row class="horizontal-search-row module-content">
                <a-col class="search-col">
                    <div class="key w-100 t-aligin-r">
                        选择模板
                    </div>
                    <div class="value m-l-8">
                        
                    </div>
                </a-col>
                <a-col class="search-col required">
                    <div class="key w-100 t-aligin-r">
                        收件人
                    </div>
                    <div class="value m-l-8">
                        <a-radio v-model:checked="checked">所有欧洲订阅用户</a-radio>
                    </div>
                </a-col>
                <a-col class="search-col">
                    <div class="key w-100 t-aligin-r">
                        主标题
                    </div>
                    <div class="value m-l-8">
                        <a-input v-model:value="value" placeholder="Basic usage" />
                    </div>
                </a-col>
                <a-col class="search-col">
                    <div class="key w-100 t-aligin-r">
                        开头称呼
                    </div>
                    <div class="value m-l-8">
                        <a-input v-model:value="value" placeholder="Basic usage" />
                    </div>
                </a-col>
                <a-col class="search-col">
                    <div class="key w-100 t-aligin-r">
                        正文内容
                    </div>
                    <div class="value m-l-8">
                        <a-textarea 
                            v-model:value="value2" 
                            placeholder="textarea with clear icon" 
                            allow-clear 
                            />
                    </div>
                </a-col>
            </a-row>
        </div>
        <div class="form-module m-t-20">
            <div class="module-title">邮件链接</div>            
            <a-row class="horizontal-search-row module-content">     
                <a-col class="search-col">
                    <div class="key w-100 t-aligin-r">
                        链接
                    </div>
                    <div class="value m-l-8">
                        <a-input v-model:value="value" placeholder="Basic usage" />
                    </div>
                </a-col>
                <a-col class="search-col">
                    <div class="key w-100 t-aligin-r">
                        链接描述文字
                    </div>
                    <div class="value m-l-8">
                        <a-input v-model:value="value" placeholder="Basic usage" />
                    </div>
                </a-col>           
            </a-row>
        </div>
        <div class="form-module m-t-20">
            <div class="module-title">其他信息</div>            
            <a-row class="horizontal-search-row module-content">
                <a-col class="search-col">
                    <div class="key w-100 t-aligin-r">
                        海报
                    </div>
                    <div class="value m-l-8">
                        
                    </div>
                </a-col>
                <a-col class="search-col">
                    <div class="key w-100 t-aligin-r">
                        二维码
                    </div>
                    <div class="value m-l-8">
                        
                    </div>
                </a-col>          
            </a-row>
        </div>
        <div class="form-module m-t-20">             
            <div class="module-title">定时发送</div>            
            <a-row class="horizontal-search-row module-content">     
                <a-col class="search-col">
                    <div class="key w-100 t-aligin-r">
                        定时发送
                    </div>
                    <div class="value m-l-8">
                        <a-radio-group v-model:value="value">
                            <a-radio :value="1">是</a-radio>
                            <a-radio :value="2">否</a-radio>                            
                        </a-radio-group>
                    </div>
                </a-col>
                <a-col class="search-col">
                    <div class="key w-100 t-aligin-r">
                        定时发送时间
                    </div>
                    <div class="value m-l-8">
                        <a-date-picker 
                            style="width: 100%;"
                            show-time 
                            placeholder="Select Time" 
                            @change="onChange" 
                            @ok="onOk" 
                        />
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
    font-family: PingFang SC;
    padding: 26px 20px;
    box-sizing: border-box;
    .form-module {
        padding: 20px;
        box-sizing: border-box;
        background-color: #F8FAFC;
        .module-title {
            color: #1D2129;
            font-size: 18px;
            font-weight: 600;
        }

        .module-content {
            max-width: 800px;
            margin-left: 225px;
        }
    }
}

.t-aligin-r {
    color: #1D2129;
    text-align: right;
    font-size: 14px;
    font-weight: 400;
}

.m-l-8 {
    margin-left: 8px;
}
.m-t-20 {
    margin-top: 20px;
}

.w-100 {
    width: 100px;
}
</style>
