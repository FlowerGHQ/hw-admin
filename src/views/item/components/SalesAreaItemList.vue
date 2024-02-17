<template>
    <div class="MaterialList gray-panel no-margin">
        <div class="panel-title">
            <div class="title">{{ $t('i.item_list') }}</div>
            <div class="btn-area">
                <ItemSelect
                    :btn-text="$t('i.add')"
                    @select="(ids, items) => handleAddShow(TARGET_TYPE.ITEM, ids, items)"
                    btn-class="panel-btn"
                    :disabledChecked="checkedIds"
                    v-if="$auth('sales-area.save')"
                >
                    {{ $t('i.add') }}
                </ItemSelect>
            </div>
        </div>
        <div class="panel-content">
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="addData"
                    :scroll="{ x: true }"
                    :pagination="false"
                    :row-key="record => record.id"
                    @expand="handleTableExpand"
                    :expandedRowKeys="expandedRowKeys"
                    :indentSize="0"
                    :expandIconColumnIndex="expandIconColumnIndex"
                    :loading="loading"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail' && $auth('item.detail')">
                            <a-image
                                class="image"
                                :width="55"
                                :height="55"
                                :src="$Util.imageFilter(record.logo)"
                                :fallback="$t('def.none')"
                            />
                            <a-tooltip
                                placement="top"
                                :title="$i18n.locale === 'zh' ? record.name : record.name_en || '-'"
                                destroy-tooltip-on-hide
                            >
                                <a-button type="link" @click="routerChange('detail', record)">
                                    <div class="ell" style="max-width: 150px">
                                        {{ $i18n.locale === 'zh' ? record.name : record.name_en || '-' }}
                                    </div>
                                </a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'type'">
                            {{ $Util.itemTypeFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'attr_list'">
                            <!--                            <p class="sub-info" v-if="record.attr_list && record.attr_list.length">{{$Util.itemSpecFilter(record.item.attr_list)}}</p>-->
                            <a-tooltip placement="top" :title="$Util.itemSpecFilter(record.item.attr_list)">
                                <div
                                    class="ell"
                                    style="max-width: 120px"
                                    v-if="record.attr_list && record.attr_list.length"
                                >
                                    {{ $Util.itemSpecFilter(record.item.attr_list, $i18n.locale) }}
                                </div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'man_hour'">
                            {{ $Util.countFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="text === 0 ? 'green' : 'red'">
                                {{ text === 0 ? $t('i.active') : $t('i.inactive') }}
                            </div>
                        </template>

                        <template v-if="column.key === 'tip_item'">
                            <a-tooltip placement="top" :title="text">
                                <div class="ell" style="max-width: 160px">{{ text || '-' }}</div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail', record)" v-if="$auth('item.detail')"
                                ><i class="icon i_detail" /> {{ $t('def.detail') }}</a-button
                            >
                            <a-button
                                type="link"
                                @click="handleDelete(record)"
                                class="danger"
                                v-if="$auth('sales-area.delete')"
                                ><i class="icon i_delete" /> {{ $t('def.delete') }}</a-button
                            >
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <a-pagination
                    v-model:current="currPage"
                    :page-size="pageSize"
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                    :hide-on-single-page="false"
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../../core';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';
import MaterialSelect from '@/components/popup-btn/MaterialSelect.vue';

const TARGET_TYPE = Core.Const.BOM.TARGET_TYPE;
const ITEM = Core.Const.ITEM;
export default {
    name: 'SalesAreaBomItems',
    components: {
        ItemSelect,
        MaterialSelect,
    },
    props: {
        salesAreaId: {
            type: Number,
        },
    },
    data() {
        return {
            TARGET_TYPE,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 表格数据
            material_id: '',
            tableData: [],
            addMode: false,
            details: {
                items: [],
                materials: [],
            },
            addData: [],
            expandedRowKeys: [],
            material: {},
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('n.name'), dataIndex: ['item', 'name'], key: 'detail' },
                { title: this.$t('i.status'), dataIndex: 'status' },
                { title: this.$t('i.spec'), dataIndex: 'attr_list', key: 'attr_list' },
                { title: this.$t('n.type'), dataIndex: ['type'], key: 'type' },
                { title: this.$t('i.categories'), dataIndex: ['category', 'name'], key: 'item' },
                { title: this.$t('i.number'), dataIndex: 'model', key: 'item' },
                { title: this.$t('i.code'), dataIndex: 'code', key: 'item' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right', width: 180 },
            ];
            return columns;
        },
        // 已经添加到商品表中的ids
        checkedIds() {
            let checkedIds = this.addData.map(i => i.item_id);
            console.log('checkedIds:', checkedIds);
            console.log('addData', this.addData);
            return checkedIds;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item);
            let routeUrl = '';
            switch (type) {
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/item/item-detail',
                        query: { id: item.item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            console.log('pageSizeChange size:', size);
            this.pageSize = size;
            this.getTableData();
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.SalesAreaItem.list({
                page: this.currPage,
                page_size: this.pageSize,
                sales_area_id: this.salesAreaId,
            })
                .then(res => {
                    this.total = res.count;
                    this.addData = res.list.map(item => {
                        item.shop_id = item.id;
                        return { ...item, ...item.item };
                    });
                    console.log('this.addData:', this.addData);
                })
                .catch(err => {
                    console.log('getTableData err', err);
                })
                .finally(() => {
                    this.loading = false;
                    this.expandedRowKeys = [];
                });
        },
        // 移出商品
        handleDelete(item) {
            let _this = this;
            let name = `[${item.name}]`;
            // console.log('item',item)
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.SalesAreaItem.delete({
                        id: item.shop_id,
                        // sales_area_id: _this.salesAreaId
                    })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete -> err', err);
                        });
                },
            });
        },

        // 添加材料
        handleAddShow(type, ids, items) {
            console.log('handleAddShow items:', items);
            // this.addData = items
            console.log('handleAddShow this.addData:', this.addData);
            this.handleAddConfirm(ids);
        },
        handleAddConfirm(ids) {
            console.log('this.addData:', this.addData);
            Core.Api.SalesAreaItem.bind({
                item_id_list: ids,
                sales_area_id: this.salesAreaId,
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.add'));
                    this.getTableData();
                })
                .catch(err => {
                    console.log('handleAddShow err:', err);
                });
        },
        // 表格行展开-查看同规格商品
        handleTableExpand(expanded, record) {
            if (expanded) {
                if (record.device_ports) {
                    this.expandedRowKeys.push(record.id);
                } else {
                    Core.Api.Item.listBySet({ set_id: record.set_id })
                        .then(res => {
                            console.log('handleTableExpand res:', res);
                            let list = res.list.filter(i => i.flag_default !== 1);
                            record.children = list;
                        })
                        .finally(() => {
                            this.expandedRowKeys.push(record.id);
                        });
                }
            } else {
                let index = this.expandedRowKeys.indexOf(record.id);
                this.expandedRowKeys.splice(index, 1);
            }
        },
    },
};
</script>

<style lang="less">
.MaterialList {
    .table-container {
        margin-top: -10px;

        .value-price {
            margin-right: 5px;
            width: 60px;
        }
    }

    .panel-title .btn-area {
        .panel-btn {
            margin-bottom: 0;
        }
    }
}
</style>
