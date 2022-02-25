<template>
    <div id="InvoiceEdit" class="edit-container">
        <div class="title-container"><div class="title-area">{{form.id ? '编辑出入库单' : '新建出入库单'}}</div></div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">基本信息</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">仓库：</div>
                    <div class="value">
                        <a-select v-model:value="form.warehouse_id" placeholder="请选择仓库">
                            <a-select-option v-for="warehouse of warehouseList" :key="warehouse.id"
                                             :value="warehouse.id">
                                {{ warehouse.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">类目：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.targetType">
                            <a-radio v-for="(val, key) in targetMap" :key='key' :value='key'>{{ val }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">类型：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.type">
                            <a-radio v-for="(val, key) in typeMap" :key='key' :value='key'>{{ val }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">来源：</div>
                    <div class="value">
                        <a-select v-model:value="form.source_type" placeholder="请选择来源" @change="handleSearch">
                            <a-select-option v-for="(val, key) of sourceTypeMap" :key='key' :value='key'>{{ val }}</a-select-option>
                        </a-select>
                    </div>
                </div>
<!--                <div class="form-item required">-->
<!--                    <div class="key">原因：</div>-->
<!--                    <div class="value">-->
<!--                        <a-input v-model:value="form.source_id" placeholder="请输入采购单号" @blur="onblur"/>-->
<!--                    </div>-->
<!--                </div>-->
                <div class="form-item required" v-if="form.source_type === 20">
                    <div class="key">采购单号：</div>
                    <div class="value">
                        <a-input v-model:value="form.source_id" placeholder="请输入相关的采购单号" @change='handleSearch' @blur="onblur"/>
                        <span v-if="isExist === true"><i class="icon i_confirm"/></span>
                        <span v-else-if="isExist === false"><i class="icon i_close_c"/></span>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">调货单号：</div>
                    <div class="value">
                        <a-input v-model:value="form.source_id" placeholder="请输入调货单号" @blur="onblur"/>
                        <span v-if="isExist === true"><i class="icon i_confirm"/></span>
                        <span v-else-if="isExist === false"><i class="icon i_close_c"/></span>
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
    name: 'InvoiceEdit',
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
                warehouse_id: undefined,
                source_type: undefined,
                source_id: '',
                targetType: '',
            },
            selectMode: false,
            warehouseList: [],
            typeMap: Core.Const.STOCK_RECORD.TYPE_MAP, //出入库
            sourceTypeMap: Core.Const.STOCK_RECORD.SOURCE_TYPE_MAP, //来源
            sourceType: Core.Const.STOCK_RECORD.SOURCE_TYPE,
            targetMap: Core.Const.STOCK_RECORD.COMMODITY_TYPE_MAP, //类目
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {
        this.getWarehouseList();
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
            }
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list
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
                console.log("onblur res", res)
            }).catch(err => {
                console.log('onblur err', err)
            }).finally(() => {
            });
        },
    }
};
</script>

<style lang="less" scoped>
// #InvoiceEdit {}
</style>
