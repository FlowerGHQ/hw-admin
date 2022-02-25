<template>
    <div id="InvoiceEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? '编辑出入库单' : '新建出入库单' }}</div>
        </div>
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
                        <a-radio-group v-model:value="form.target_type">
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
                        <a-select v-model:value="form.source_type" placeholder="请选择来源">
                            <a-select-option v-for="(val, key) of sourceTypeMap" :key='key' :value='key'>{{ val }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required" v-if="form.source_type == 20">
                    <div class="key">采购单号：</div>
                    <div class="value">
                        <a-input class="purchase-order-detail" v-model:value="form.source_id" placeholder="请输入相关的采购单号"
                                 @blur="onblur"/>
                        <span v-if="isExist === true"><i class="icon i_confirm"/></span>
                        <span v-else-if="isExist === false"><i class="icon i_close_c"/></span>
                    </div>
                </div>
                <div class="form-item required" v-if="form.source_type == 40">
                    <div class="key">调货单号：</div>
                    <div class="value">
                        <a-input v-model:value="form.source_id" placeholder="请输入调货单号" @blur="onblurTransfer"/>
                        <span v-if="isRight === true"><i class="icon i_confirm"/></span>
                        <span v-else-if="isRight === false"><i class="icon i_close_c"/></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary">确定</a-button>
            <a-button @click="routerChange('list')" type="primary" ghost>取消</a-button>
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
            isRight: '',
            form: {
                type: '',
                id: '',
                warehouse_id: undefined,
                source_type: undefined,
                source_id: '',
                target_type: '',
            },
            warehouseList: [],
            typeMap: Core.Const.STOCK_RECORD.TYPE_MAP, //出入库
            sourceTypeMap: Core.Const.STOCK_RECORD.SOURCE_TYPE_MAP, //来源
            sourceType: Core.Const.STOCK_RECORD.SOURCE_TYPE,
            targetMap: Core.Const.STOCK_RECORD.COMMODITY_TYPE_MAP, //类目
        };
    },
    watch: {},
    computed: {},
    created() {
    },
    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        this.getWarehouseList();
        if (this.form.id) {
            this.getInvoiceDetail();
        }
    },
    methods: {
        routerChange(type, item = {}) {
            console.log('routerChange item:', item)
            let routeUrl = ''
            switch (type) {
                case 'list':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/invoice-list",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/invoice-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list
            })
        },
        onblur() {  // 获取 采购订单号
            if (!this.form.source_id) {
                return this.isExist = ''
            }
            Core.Api.Purchase.detailSn({
                sn: this.form.source_id,
            }).then(res => {
                this.isExist = res != null
                console.log("onblur res", res)
            }).catch(err => {
                console.log('onblur err', err)
            }).finally(() => {
            });
        },
        onblurTransfer() {
            if (!this.form.source_id) {
                return this.isRight = ''
            }
            Core.Api.Transfer.detailByUid({
                uid: this.form.source_id,
            }).then(res => {
                this.isRight = res.detail != null
                console.log("onblur res", res)
            }).catch(err => {
                console.log('onblur err', err)
            }).finally(() => {
            });
        },
        getInvoiceDetail() {
            this.loading = true;
            Core.Api.Invoice.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getInvoiceDetail res', res)
                this.detail = res.detail
            }).catch(err => {
                console.log('getInvoiceDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            if (!form.warehouse_id) {
                return this.$message.warning('请选择仓库')
            }
            if (!form.target_type) {
                return this.$message.warning('请选择类目')
            }
            if (!form.type) {
                return this.$message.warning('请选择类型')
            }
            if (!form.source_type) {
                return this.$message.warning('请选择来源')
            }
            if (!form.source_id && form.source_type == 20) {
                return this.$message.warning('请输入相关的采购单号')
            }
            if (this.isExist === false) {
                return this.$message.warning('请输入正确的采购单号')
            }
            if (!form.source_id && form.source_type == 40) {
                return this.$message.warning('请输入相关的调货单号')
            }
            if (this.isRight === false) {
                return this.$message.warning('请输入正确的调货单号')
            }
            Core.Api.Invoice.save(form).then(() => {
                this.$message.success('保存成功')
                this.routerChange('detail',res.detail)
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
    }
};
</script>

<style lang="less">
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
    }

    .i_close_c {
        color: @red;
        font-size: 18px;
    }
}
</style>
