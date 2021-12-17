<template>
<div id="ItemCategoryConfig" class="edit-container">
    <div class="title-container">
        <div class="title-area">编辑商品配置</div>
    </div>
    <div class="form-block" v-for="(item, index) of config" :key="index">
        <div class="form-title">
            <div class="title">商品配置项{{index + 1}}</div>
        </div>
        <div class="form-content">
            <div class="form-item required">
                <div class="key">配置项名称</div>
                <div class="value">
                    <a-input v-model:value="item.name" placeholder="请输入配置项名称" />
                </div>
            </div>
            <div class="form-item required">
                <div class="key">配置项键值</div>
                <div class="value">
                    <a-input v-model:value="form.key" placeholder="请输入配置项键值(请使用英文)"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">内容</div>
                <div class="value">
                    
                </div>
            </div>
            <!-- <div class="form-item required">
                <div class="key">品牌</div>
                <div class="value">
                    <a-select v-model:value="form.country" placeholder="请选择品牌">
                        <a-select-option v-for="item of countryList" :key="item.value" :value="item.value">{{ item.text }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item">
                <div class="key">生产商</div>
                <div class="value">
                    <a-select v-model:value="form.country" placeholder="请选择生产厂商">
                        <a-select-option v-for="item of countryList" :key="item.value" :value="item.value">{{ item.text }}</a-select-option>
                    </a-select>
                </div>
            </div> -->
        </div>
    </div>
    <div class="form-btns">
        <a-button type="primary" @click="handleSubmit">确定</a-button>
        <a-button type="primary" ghost @click="routerChange('back')">取消</a-button>
    </div>
</div>
</template>

<script>
import Core from '../../core';
export default {
    name: 'ItemCategoryConfig',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            id: '',
            detail: {},
            config: [],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getCategoryDetail();
    },
    methods: {
        getCategoryDetail() {
        }
    }
};
</script>

<style lang="less" scoped>
// #ItemCategoryConfig {}
</style>