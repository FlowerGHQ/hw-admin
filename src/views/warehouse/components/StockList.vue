<template>
    <div class="StockList gray-panel no-margin">
        <div class="panel-content">
            <div class="table-container">
                <div class="search-container">
                    <a-row class="search-area">
                        <a-col :xs="24" :sm="24" :xl="16" :xxl="8" class="search-item">
                            <div class="key">code：</div>
                            <div class="value">
                                <a-select
                                    v-model:value="searchForm.item_id"
                                    show-search
                                    placeholder="code"
                                    :default-active-first-option="false"
                                    :show-arrow="false"
                                    :filter-option="false"
                                    :not-found-content="null"
                                    @search="handleItemSearch"
                                >
                                    <a-select-option v-for="item in itemOptions" :key="item.id" :value="item.id">
                                        {{ item.code }} - {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </div>
                        </a-col>
                    </a-row>

                    <div class="btn-area">
                        <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                        <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                    </div>
                </div>

                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="record.target_type === TARGET_TYPE.MATERIAL">
                            <template v-if="column.key === 'item_detail' && $auth('material.detail')">
                                <a-tooltip placement="top" :title="text">
                                    <div class="ell" style="max-width: 120px">
                                        <a-button type="link" @click="routerChange('material', record.material)"
                                            >{{
                                                $i18n.locale == 'zh'
                                                    ? record.material.name
                                                    : record.material.name_en || '-'
                                            }}
                                        </a-button>
                                    </div>
                                </a-tooltip>
                            </template>
                            <template v-if="column.key === 'code'">
                                {{ record.material.code || '-' }}
                            </template>
                        </template>
                        <template v-if="record.target_type === TARGET_TYPE.ITEM">
                            <template v-if="column.key === 'item_detail' && $auth('item.detail')">
                                <a-tooltip placement="top" :title="text">
                                    <a-button type="link" @click="routerChange('item', record.item)"
                                        >{{ $i18n.locale == 'zh' ? record.item.name : record.item.name_en || '-' }}
                                    </a-button>
                                </a-tooltip>
                            </template>
                            <template v-if="column.key === 'spec'">
                                <a-tooltip placement="top" :title="text">
                                    <div class="ell" style="max-width: 100px">
                                        {{ $Util.itemSpecFilter(text) || '-' }}
                                    </div>
                                </a-tooltip>
                            </template>
                            <template v-if="column.key === 'code'">
                                {{ record.item.code || '-' }}
                            </template>
                        </template>

                        <!--                    <template v-if="column.key === 'item'">-->
                        <!--                        {{ text || '-' }}-->
                        <!--                    </template>-->
                        <!--                    <template v-if="column.key === 'material_spec'">-->
                        <!--                        <a-tooltip placement="top" :title='text'>-->
                        <!--                            <div class="ell" style="max-width: 100px">{{text || '-'}}</div>-->
                        <!--                        </a-tooltip>-->
                        <!--                    </template>-->

                        <template v-if="column.key === 'count'"> {{ text || 0 }} {{ $t('i.pcs2') }} </template>
                        <template v-if="column.key === 'operation'">
                            <a-button
                                type="link"
                                v-if="record.target_type === TARGET_TYPE.ITEM && $auth('item.detail')"
                                @click="routerChange('item', record.item)"
                                ><i class="icon i_detail" />{{ $t('def.detail') }}</a-button
                            >
                            <a-button
                                type="link"
                                v-if="record.target_type === TARGET_TYPE.MATERIAL && $auth('material.detail')"
                                @click="routerChange('material', record.material)"
                                ><i class="icon i_detail" />详情</a-button
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
        <a-modal
            v-model:visible="stockAddShow"
            title="库存增减"
            class="stock-change-modal"
            :after-close="handleStockAddClose"
        >
            <div class="form-item required">
                <div class="key">操作类型：</div>
                <a-radio-group v-model:value="form.type">
                    <a-radio :value="TYPE.IN">入库</a-radio>
                    <a-radio :value="TYPE.OUT">出库</a-radio>
                </a-radio-group>
            </div>
            <div class="form-item required">
                <div class="key">商品编码：</div>
                <div class="value form-item-value">
                    <a-input
                        class="code-input"
                        v-model:value="form.target_code"
                        placeholder="请输入商品编码"
                        @blur="onblur"
                    />
                    <span v-if="isExist === true"><i class="icon i_confirm" /></span>
                    <span v-else-if="isExist === false"><i class="icon i_close_c" /></span>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">商品数量:</div>
                <div class="value form-item-value">
                    <a-input-number v-model:value="form.number" :min="1" :precision="0" />
                    <span class="item-number">件</span>
                </div>
            </div>
            <template #footer>
                <a-button @click="handleStockAddSubmit" type="primary">确定</a-button>
                <a-button @click="stockAddShow = false">取消</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../../core';
const TYPE = Core.Const.STOCK_RECORD.TYPE;
const TARGET_TYPE = Core.Const.STOCK.TARGET_TYPE;
export default {
    name: 'StockList',
    components: {},
    props: {
        warehouseId: {
            type: [Number, String],
        },
        detail: {
            type: Object,
            default: () => {
                return {};
            },
        },
        type: {
            type: String,
        },
    },
    data() {
        return {
            TYPE,
            TARGET_TYPE,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 表格
            tableData: [],
            // 弹框
            stockAddShow: false,
            isExist: '',
            form: {
                type: '',
                id: '',
                target_code: '', //商品编码
                number: '',
                warehouse_id: '',
            },
            searchForm: {
                item_id: '',
            },
            itemOptions: [],
            // 上传
            upload: {
                action: Core.Const.NET.URL_POINT + '/admin/1/item/import',
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'xlsx',
                },
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let type = this.type;
            let tableColumns = [
                { title: this.$t('n.name'), dataIndex: [type, 'name'], key: 'item_detail' },
                { title: this.$t('i.code'), key: 'code' },

                { title: this.$t('wa.quantity'), dataIndex: 'stock', key: 'count' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
            ];
            // if (type === 'material' || type === 'customize') {
            //     tableColumns = [
            //         {title: '名称', dataIndex: [type, 'name'], key: 'material_detail'},
            //         {title: '分类', dataIndex: [type, 'category','name'], key: 'item'},
            //         {title: '编码', dataIndex: [type, 'code'], key: 'item'},
            //         {title: '单位', dataIndex: [type, 'unit'], key: 'item'},
            //         {title: '规格', dataIndex: [type, 'spec'], key: 'material_spec'},
            //         {title: '库存数量', dataIndex: 'stock', key: 'count'},
            //         {title: '包装', dataIndex: [type, 'encapsulation'], key: 'item'},
            //         {title: '包装尺寸', dataIndex: [type, 'encapsulation_size'], key: 'item'},
            //         {title: '毛重', dataIndex: [type, 'gross_weight'], key: 'item'},
            //         { title: '操作', key: 'operation', fixed: 'right'}
            //     ]
            // }
            return tableColumns;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'material':
                    routeUrl = this.$router.resolve({
                        path: '/production/material-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'item':
                    routeUrl = this.$router.resolve({
                        path: '/item/item-detail',
                        query: { id: item.id },
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
            let target_type = this.type === 'item' ? 1 : 2;
            Core.Api.Stock.list({
                warehouse_id: this.warehouseId,
                target_id: this.searchForm.item_id,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res', res);
                    this.total = res.count;
                    res.list.forEach(item => {
                        let element = item.item || {};
                        if (element.attr_list && element.attr_list.length) {
                            let str = element.attr_list.map(i => i.value).join(' ');
                            element.attr_str = str;
                        }
                    });
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        //仓库库存增减
        handleStockAddShow() {
            this.stockAddShow = true;
            this.form.warehouse_id = this.warehouseId;
        },
        handleStockAddClose() {
            this.stockAddShow = false;
            this.isExist = '';
            this.form = {
                type: '',
                id: '',
                target_code: '', //商品编码
                number: '',
                warehouse_id: '',
            };
        },
        handleStockAddSubmit() {
            let form = Core.Util.deepCopy(this.form);
            if (!form.type) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.target_code) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (this.isExist === false) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.number) {
                return this.$message.warning(this.$t('def.enter'));
            }
            let apiName = form.type === TYPE.IN ? 'add' : 'reduce';
            Core.Api.Stock[apiName](form)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.handleStockAddClose();
                    this.getTableData();
                })
                .catch(err => {
                    console.log('handleStockAddSubmit err:', err);
                });
        },
        onblur() {
            // 获取 商品编码 数据
            if (!this.form.target_code) {
                return (this.isExist = '');
            }
            Core.Api.Item.detailByCode({
                code: this.form.target_code,
            })
                .then(res => {
                    this.isExist = res.detail != null;
                    console.log('onblur res', res);
                })
                .catch(err => {
                    console.log('onblur err', err);
                })
                .finally(() => {});
        },
        // 上传文件
        handleMatterChange({ file, fileList }) {
            console.log('handleMatterChange status:', file.status, 'file:', file);
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message);
                } else {
                    return this.$message.success(this.$t('pop_up.packing'));
                }
            }
            this.upload.fileList = fileList;
        },
        handleItemSearch(code) {
            Core.Api.Item.list({ code: code, flag_spread: 1 }).then(res => {
                this.itemOptions = res.list;
            });
        },
        handleSearch() {
            this.pageChange(1);
        },
        handleSearchReset() {
            Object.assign(this.searchForm, this.$options.data().searchForm);
            this.pageChange(1);
        },
    },
};
</script>

<style lang="less" scoped>
.StockList {
    .table-container {
        margin-top: -10px;
    }
}
</style>
<style lang="less">
.stock-change-modal {
    .form-item-value {
        .fac();

        .code-input {
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

        .item-number {
            font-size: 12px;
            line-height: 16px;
            color: #363d42;
        }
    }
}
</style>
