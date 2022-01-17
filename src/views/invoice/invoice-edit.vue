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
            <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
                <template #expandIcon><i class="icon i_expan_l"/></template>
                <a-collapse-panel key="change" header="商品信息" class="gray-collapse-panel">
                    <ItemSelect :warehouseId="detail.type == typeList.TYPE_OUT ? detail.warehouse_id: 0 "
                                btnType='link'
                                @select="handleAddInvoiceItem" btn-text="添加商品"/>
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
        VNodes: (_, {attrs}) => {
            return attrs.vnodes;
        },
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
            failData: {},
            failActive: [],
            tableData: [],
            tableColumns: [
                {title: '商品名称', dataIndex: 'item', key: 'item-name'},
                {title: '商品编码', dataIndex: 'item', key: 'item-code'},
                {title: '库存数量', dataIndex: 'stock', key: 'item'},
                {title: '数量', dataIndex: 'amount', key: 'amount'},
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
                id: this.id,
            }).then(res => {
                console.log('getInvoiceDet  ail res', res)
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
            for (let item of items) {
                console.log('handleAddInvoiceItem item:', item)
                this.tableData.push({
                    "item": item,
                    "amount": 1,
                    "stock": 0
                })
            }
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
