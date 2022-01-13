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
            <div class="gray-panel info">
                <div class="panel-title">
                    <div class="gray-collapse-panel">
                        <span>商品信息</span>
                    </div>
                    <template #extra>
                        <ItemSelect btnType='link' @select="handleAddFailItem" :fault-name="fault"
                                    :disabled-checked='failData[fault].map(i => i.id)' btn-text="添加商品"/>
                    </template>
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
        VNodes: (_, { attrs }) => { return attrs.vnodes; },
    },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            detail: {
                warehouse: {}
            },
            activeKey: ['affirm'],
            typeList: Core.Const.STOCK_RECORD.PRODUCT_TYPE,
            form: {
                id: '',
                name: '',
                province: '',
                city: '',
                county: '',
                address: '',
                type: '',
            },
            failData: {},
        };
    },
    watch: {},
    computed: {},

    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
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
                id: this.form.id,
            }).then(res => {
                console.log('getInvoiceDet  ail res', res)
                this.detail = res.detail
                for (const key in this.form) {
                    this.form[key] = res.detail[key]
                }
            }).catch(err => {
                console.log('getInvoiceDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },


        handleAddressSelect(address = []) {
            this.form.province = address[0]
            this.form.city = address[1]
            this.form.county = address[2]
        },

        // handleAddFailItem(ids, items, name) {
        //     console.log('handleAddFailItem items:', name)
        //     this.failData[name].push(...items)
        //     console.log('handleAddFailItem failData items:', this.failData)
        //
        // },
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

        .right {
            .fcc();
            font-size: 12px;

            .staff {
                color: rgba(0, 0, 0, 0.85);
                margin-right: 12px;
                font-weight: 500;
            }

            .status {
                .fcc();

                .i_point {
                    margin-right: 6px;
                }
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

    .panel-content.affirm {
        .title {
            color: #DD5D5D;
            margin-bottom: 24px;

            i.icon {
                margin-right: 12px;
            }
        }

        .fault_select {
            width: 100%;
            padding-left: 12px;

            .ant-checkbox-wrapper {
                width: 25%;
                margin-left: 0;
                margin-bottom: 18px;
            }
        }
    }

    .steps-container {
        padding: 0 20px;
        margin-bottom: 20px;
    }
}
</style>
