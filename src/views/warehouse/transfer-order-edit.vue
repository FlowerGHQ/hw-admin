<template>
    <div id="TransferOrderEdit" class="edit-container">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">调货单编辑</div>
                <a-button type="primary" @click="handleTransferSubmit()"><i class="icon i_submit" />提交</a-button>
            </div>
            <div class="gray-panel info">
                <div class="panel-title">
                    <div class="left"><span>调货单编号</span> {{ detail.uid }}</div>
                </div>
                <div class="panel-content">
                    <div class="info-item">
                        <div class="key">所属仓库</div>
                        <div class="value">{{ detail.to_warehouse.name || '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">仓库类型</div>
                        <div class="value">{{ $Util.warehouseTypeFilter(detail.to_warehouse.type || '-') }}</div>
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
                        <ItemSelect
                            :warehouseId="detail.type == TYPE.OUT ? detail.warehouse_id : 0"
                            :disabledChecked="disabledChecked"
                            btnType="link"
                            @select="handleAddTransferItem"
                            btn-text="添加商品"
                        />
                    </template>
                    <div class="panel-content">
                        <div class="table-container no-mg">
                            <a-table
                                :columns="tableColumns"
                                :data-source="tableData"
                                :scroll="{ x: true }"
                                :row-key="record => record.id"
                                :pagination="false"
                            >
                                <template #bodyCell="{ column, text, index, record }">
                                    <template v-if="column.key === 'item-name'">
                                        <a-tooltip placement="top" :title="text">
                                            {{ text ? text.name : '-' }}
                                        </a-tooltip>
                                    </template>
                                    <template v-if="column.key === 'item-code'">
                                        {{ text ? text.code : '-' }}
                                    </template>
                                    <template v-if="column.key === 'attr_list'">
                                        {{ $Util.itemSpecFilter(text) }}
                                    </template>
                                    <template v-if="column.key === 'amount'">
                                        <a-input-number
                                            v-model:value="record.amount"
                                            :min="1"
                                            :max="detail.type === 1 ? 99999 : record.item.stock"
                                            :precision="0"
                                            placeholder="请输入"
                                        />
                                        件
                                    </template>
                                    <template v-if="column.dataIndex === 'operation'">
                                        <a-button type="link" class="danger" @click="handleTransferItemDelete(index)">
                                            <i class="icon i_delete" /> 移除
                                        </a-button>
                                    </template>
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
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';

export default {
    name: 'TransferOrderEdit',
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
                to_warehouse: {},
            },
            activeKey: ['affirm'],
            TYPE: Core.Const.STOCK_RECORD.TYPE,
            failActive: [],
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: '商品名称', dataIndex: 'item', key: 'item-name' },
                { title: '商品品号', dataIndex: ['item', 'model'], key: 'item-model' },
                { title: '商品编码', dataIndex: 'item', key: 'item-code' },
                { title: '商品规格', dataIndex: ['item', 'attr_list'], key: 'attr_list' },
                { title: '数量', dataIndex: 'amount', key: 'amount' },
                { title: '操作', dataIndex: 'operation' },
            ];
            return columns;
        },

        disabledChecked() {
            let disabledChecked = [];
            this.tableData.forEach(item => {
                disabledChecked.push(item.item.id);
            });
            return disabledChecked;
        },
        // totalCount() {  // 合计 勿删
        //     let totalCount = 0
        //     this.tableData.forEach(item => {
        //         totalCount += item.amount
        //     })
        //     return totalCount
        // },
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0;
        this.getTransferDetail();
        this.getTransferList();
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1);
                    break;
            }
        },
        getTransferDetail() {
            this.loading = true;
            Core.Api.Transfer.detail({
                id: this.id,
            })
                .then(res => {
                    console.log('getTransferDetail res', res);
                    this.detail = res.detail;
                })
                .catch(err => {
                    console.log('getTransferDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getTransferList() {
            this.loading = true;
            Core.Api.Transfer.itemList({
                transfer_order_id: this.id,
            })
                .then(res => {
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTransferList err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 获取商品列表
        handleAddTransferItem(ids, items) {
            console.log('handleAddTransferItem ids:', ids);
            console.log('handleAddTransferItem items:', items);
            this.disabledChecked = [];
            items = items.map(item => ({
                id: 0,
                item: item,
                amount: 1,
                stock: 0,
            }));
            console.log('handleAddTransferItem items:', items);
            this.tableData.push(...items);
        },
        // 移除商品
        handleTransferItemDelete(index) {
            this.tableData.splice(index, 1);
        },
        // 调货单明细提交
        handleTransferSubmit() {
            this.loading = false;
            let list = [];
            for (let item of this.tableData) {
                list.push({
                    id: item.id,
                    transfer_order_id: this.id,
                    item_id: item.item.id,
                    amount: item.amount,
                });
            }
            Core.Api.Transfer.saveList(list)
                .then(res => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.getTransferDetail();
                    this.routerChange('back');
                })
                .catch(err => {
                    console.log('handleFaultSubmit err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>
<style lang="less">
// #TransferOrderEdit {}
</style>
