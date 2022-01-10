<template>
    <div id="StockEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{'库存增减'}}</div></div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">基本信息</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">库存增减：</div>
                    <a-radio-group v-model:value="form.type">
                        <a-radio  :value="'add'" @click="">增加</a-radio>
                        <a-radio  :value="'reduce'" @click="">减少</a-radio>
                    </a-radio-group>
                </div>
                <div class="form-item required">
                    <div class="key">商品编码：</div>
                    <div class="value">
                        <a-input v-model:value="form.target_code" placeholder="请输入商品编码"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">商品数量:</div>
                    <div class="value">
                        <a-input-number v-model:value="form.number" :min="1"/>
                        <span class="itemNumber">件</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary">确定</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost>取消</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';

export default {
    name: 'StockEdit',
    components: {},
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            detail: {},
            form: {
                type: '',
                id: '',
                target_code: '', //商品编码
                number: '',
                warehouse_id: '',
            }
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.form.warehouse_id = Number(this.$route.query.id) || 0
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
            }
        },

        handleTypeSelect(val) {
            this.type = val
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            if (!form.target_code) {
                return this.$message.warning('请输入商品编码')
            }
            if (!form.number) {
                return this.$message.warning('请输入商品数量')
            }
            Core.Api.Stock[this.form.type](form).then(() => {
                this.$message.success('保存成功')
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
    }
};
</script>

<style lang="less">
#app {
    .ant-layout {
        .ant-input-number {
            margin-right: 10px;
        }

        .itemNumber {
            font-size: 12px;
            line-height: 16px;
            color: #363D42;
        }
    }
}
</style>