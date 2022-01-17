<template>
    <div id="StockEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ '库存增减' }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">基本信息</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">操作类型：</div>
                    <a-radio-group v-model:value="form.type">
                        <a-radio :value="'add'" >增加</a-radio>
                        <a-radio :value="'reduce'" >减少</a-radio>
                    </a-radio-group>
                </div>
                <div class="form-item required">
                    <div class="key">商品编码：</div>
                    <div class="value">
                        <a-input  v-model:value="form.target_code" placeholder="请输入商品编码" @blur="onblur"/>
                        <span v-if="isExist === true"><i class="icon i_confirm"/></span>
                        <span v-else-if="isExist === false" ><i class="icon i_close_c"/></span>
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
            isExist: '',
            form: {
                type: '',
                id: '',
                target_code: '', //商品编码
                number: '',
                warehouse_id: '',

            },
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
            if (!form.type) {
                return this.$message.warning('请选择操作类型')
            }
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
        onblur() {  // 获取 商品编码 数据
            if (!this.form.target_code) {
                return this.isExist = ''
            }
            Core.Api.Item.detailByCode({
                code: this.form.target_code,
            }).then(res => {
                this.isExist = res.detail != null
                console.log("getItemCode res", res)
            }).catch(err => {
                console.log('getItemCode err', err)
            }).finally(() => {
            });
        },
        // getIsExist() {
        //
        // }
    }
};
</script>

<style lang="less">
#StockEdit {
        .form-item {
            .value {
                .fac();
                .ant-input {
                    width: calc(~'100% - 24px');
                }
                i.icon {
                    display: inline-block;
                    width: 24px;
                    text-align: right;
                }
                .i_confirm {
                    color: @green;
                    font-size: 18px;
                    margin-top: 10px;
                }
                .i_close_c {
                    color: @red;
                }

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
}
</style>