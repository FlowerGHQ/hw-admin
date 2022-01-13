<template>
    <div class="WarehouseStockList gray-panel no-margin">
        <div class="panel-content">
            <div class="table-container">
                <a-button type="primary" @click="handleAddShow" style="margin-bottom: 10px;"
                          class="panel-btn"><i class="icon i_add"/>库存增减
                </a-button>
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                         :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text , record}">
                        <template v-if="column.key === 'item-name'">
                            <a-tooltip placement="top" :title='text'>
                                {{ text ? text.name : '-' }}
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'item-code'">
                            {{ text ? text.code : '-' }}
                        </template>
                        <template v-if="column.dataIndex === 'stock'">
                            {{ text || '-' }}
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <a-pagination
                    v-model:current="currPage"
                    :page-size='pageSize'
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => `共${total}条`"
                    :hide-on-single-page='false'
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
        </div>
        <a-modal v-model:visible="codeAddShow" title="库存增减" class="codeAddShow-edit-modal"
                 :after-close="handleAddClose">
            <div class="form-item required">
                <div class="key">操作类型：</div>
                <a-radio-group v-model:value="form.type">
                    <a-radio :value="'add'">入库</a-radio>
                    <a-radio :value="'reduce'">出库</a-radio>
                </a-radio-group>
            </div>
            <div class="form-item required">
                <div class="key">商品编码：</div>
                <div class="value form-item-value">
                    <a-input class="itemCodeInput" v-model:value="form.target_code" placeholder="请输入商品编码"
                             @blur="onblur"/>
                    <span v-if="isExist === true"><i class="icon i_confirm"/></span>
                    <span v-else-if="isExist === false"><i class="icon i_close_c"/></span>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">商品数量:</div>
                <div class="value form-item-value">
                    <a-input-number v-model:value="form.number" :min="1"/>
                    <span class="itemNumber">件</span>
                </div>
            </div>
            <template #footer>
                <a-button @click="handleAddSubmit" type="primary">确定</a-button>
                <a-button @click="codeAddShow=false">取消</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../../core';

export default {
    name: 'WarehouseStockList',
    components: {},
    props: {
        warehouse_id: {
            type: Number,
        },
        detail: {
            type: Object,
            default: () => {
                return {}
            }
        },
        type: {
            type: Number,
        },
    },
    data() {
        return {
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            tableData: [],
            detail: {},
            codeAddShow: false,
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
    computed: {
        tableColumns() {
            let tableColumns = [
                {title: '商品名称', dataIndex: 'item', key: 'item-name'},
                {title: '商品编码', dataIndex: 'item', key: 'item-code'},
                {title: '库存数量', dataIndex: 'stock', key: 'item'},
            ]
            return tableColumns
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
            }
        },
        handleAddShow() {
            this.codeAddShow = true;
            this.form.warehouse_id = this.warehouse_id
        },
        handleAddClose() {
            this.codeAddShow = false;
            this.isExist = '';
            this.form = {
                type: '',
                id: '',
                target_code: '', //商品编码
                number: '',
                warehouse_id: '',
            }
        },
        handleAddSubmit() {
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
                this.handleAddClose();
                this.getTableData();
            }).catch(err => {
                console.log('handleAddSubmit err:', err)
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
        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {  // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            Core.Api.Stock.list({
                warehouse_id: this.warehouse_id,
                page: this.currPage,
                page_size: this.pageSize,
            }).then(res => {
                console.log("getTableData res", res)
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
    }
};
</script>

<style lang="less">
.form-item-value {
    .fac();

    .itemCodeInput {
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

    .ant-input-number {
        margin-right: 10px;
    }

    .itemNumber {
        font-size: 12px;
        line-height: 16px;
        color: #363D42;
    }
}

//#WarehouseStockList {
//    .form-item-value {
//        .fac()
//    }
//}
</style>