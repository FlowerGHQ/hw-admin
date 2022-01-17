<template>
    <div id="InvoiceEdit" class="edit-container">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">货单编辑</div>
            </div>
            <div class="gray-panel info">
                <div class="panel-title">
                    <div class="left">
                        <span>货单编号</span> {{ detail.uid }}
                    </div>
                </div>
                <div class="panel-content">
                    <div class="info-item">
                        <div class="key">货单类型</div>
                        <div class="value">{{ $Util.stockRecordFilter(detail.type || '-') }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">所属仓库</div>
                        <div class="value">{{ detail.warehouse.name || '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">仓库类型</div>
                        <div class="value">{{ $Util.stockTypeFilter(detail.type || '-') }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">创建时间</div>
                        <div class="value">{{ $Util.timeFilter(detail.create_time) || '-' }}</div>
                    </div>
                </div>
            </div>
            <a-collapse v-model:activeKey="activeKey" ghost>
                <a-collapse-panel key="affirm" header="商品信息" class="gray-collapse-panel">
                    <template #extra>
                    <ItemSelect :warehouseId="detail.type == typeList.TYPE_OUT ? detail.warehouse_id: 0 " :disabledChecked="disabledChecked"
                                btnType='link'
                                @select="handleAddInvoiceItem" btn-text="添加商品"/>
                    </template>
                    <div class="panel-content">
                        <div class="table-container">
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
                                    <template v-if="column.key === 'item-stock'">
                                        {{ text ? text.stock : '-' }}
                                    </template>
                                    <template v-if="column.key === 'amount'">
                                        <a-input-number v-model:value="record.amount" :min="1" :precision="0" placeholder="请输入"/>件
                                    </template>
                                    <template v-if="column.dataIndex === 'operation'">
                                        <a-button type="link" @click="handleFailItemDelete(index, fault)"><i
                                            class="icon i_delete"/> 移除
                                        </a-button>
                                    </template>
                                </template>
                                <template #summary>
                                    <a-table-summary>
                                        <a-table-summary-row>
                                            <a-table-summary-cell :index="0" :col-span="4">合计</a-table-summary-cell>
                                            <a-table-summary-cell :index="1" :col-span="3">
                                            </a-table-summary-cell>
                                        </a-table-summary-row>
                                    </a-table-summary>
                                </template>
                            </a-table>
                        </div>
                    </div>

                </a-collapse-panel>

            </a-collapse>

        </div>
    </div>
</template>

<script>
import Core from '../../core';
import ItemSelect from '@/components/ItemSelect.vue';


export default {
    name: 'InvoiceEdit',
    components: {
        ItemSelect,
    },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            id: '',
            detail: {
                warehouse: {}
            },
            activeKey: ['affirm'],
            typeList: Core.Const.STOCK_RECORD.TYPE,
            failActive: [],
            tableData: [],
            disabledChecked: [],
            tableColumns: [
                {title: '商品名称', dataIndex: 'item', key: 'item-name'},
                {title: '商品编码', dataIndex: 'item', key: 'item-code'},
                {title: '库存数量', dataIndex: 'item', key: 'item-stock'},
                {title: '数量', dataIndex: 'amount', key: 'amount'},
                {title: '操作', dataIndex: 'operation'},
            ],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        this.getInvoiceDetail();
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
            }
        },
        getInvoiceDetail() {
            this.loading = true;
            Core.Api.Invoice.detail({
                id: this.id
            }).then(res => {
                console.log('getInvoiceDetail res', res)
                this.detail = res.detail
            }).catch(err => {
                console.log('getInvoiceDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        handleAddInvoiceItem(ids, items) {
            console.log('handleAddInvoiceItem ids:', ids)
            console.log('handleAddInvoiceItem items:', items)
            this.disabledChecked = []
            for (let item of items) {
                console.log('handleAddInvoiceItem item:', item)
                this.tableData.push({
                    "item": item,
                    "amount": 1,
                    "stock": 0,
                })
            }
            this.tableData.forEach(item =>{
                this.disabledChecked.push(item.id)
            })
        },
        // 移除商品
        handleFailItemDelete(index, name) {
            this.failData[name].splice(index, 1)
            this.handleItemAmountChang(name)
        },
    }
};
</script>
<style lang="less">
#InvoiceEdit {
    .gray-panel.info {
        .left {
            font-size: 12px;
            color: #465670;

            span {
                color: #A5ACB8;
            }
        }

        .panel-content {
            .fsb(flex-start);
            padding-bottom: 15px;
        }

        .info-item {
            flex: 1;
            font-size: 12px;

            .key {
                color: #8090A6;
            }

            .value {
                margin-top: 10px;
                color: #363D42;
            }
        }
    }

    .collapse-item {
        width: calc(~'50% - 10px');

        .ant-collapse-item.gray-collapse-panel {
            line-height: 50px;

            .ant-collapse-header {
                background-color: #F5F8FA;
                height: 40px;
                .fac();
                width: 100%;
                position: relative;

                .ant-collapse-extra {
                    position: absolute;
                    right: 12px;
                }
            }
        }
    }


}
</style>
