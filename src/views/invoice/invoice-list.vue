<template>
    <div id="WarehouseList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">出入库货单列表</div>
                <div class="btns-area">
                    <a-button type="primary" @click="handleAddShow" style="margin-bottom: 10px;"
                              class="panel-btn"><i class="icon i_add"/>库存管理
                    </a-button>
                </div>
            </div>
            <div class="tabs-container colorful">
                <a-tabs v-model:activeKey="searchForm.status" @change='handleSearch'>
                    <a-tab-pane :key="item.key" v-for="item of statusList">
                        <template #tab>
                            <div class="tabs-title">{{item.text}}<span :class="item.color">{{item.value}}</span></div>
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">仓库名称:</div>
                        <div class="value">
                            <a-input placeholder="请输入仓库名称" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">货单编号:</div>
                        <div class="value">
                            <a-input placeholder="请输入工单编号" v-model:value="searchForm.uid" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">出入库类型:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.type" @change="handleTypeSelect" placeholder="请选择出入库类型"
                                      allow-clear>
                                <a-select-option key="1" :value="handleTypeList.TYPE_IN">增加</a-select-option>
                                <a-select-option key="20" :value="handleTypeList.TYPE_OUT">减少</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='14' class="search-item">
                        <div class="key">创建时间:</div>
                        <div class="value">
                            <a-range-picker v-model:value="create_time" valueFormat='X' @change="handleSearch" :show-time="defaultTime" :allow-clear='false'>
                                <template #suffixIcon><i class="icon i_calendar"/></template>
                            </a-range-picker>
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">查询</a-button>
                    <a-button @click="handleSearchReset">重置</a-button>
                </div>

            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }" :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text , record}">
                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title='text' >
                                <a-button type="link" @click="routerChange('detail', record)">{{text || '-'}}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link" @click="routerChange('detail', record)">{{text || '-'}}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'type'">
                            {{ $Util.stockTypeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'address'">
                            {{ $Util.addressFilter(record) }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('edit',record)"><i class="icon i_edit"/> 修改</a-button>
                            <a-button type="link" @click="handleDelete(record.id)"><i class="icon i_delete"/> 删除</a-button>
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
                    <a-radio :value="'add'">增加</a-radio>
                    <a-radio :value="'reduce'">减少</a-radio>
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
import Core from '../../core';
const STOCK_RECORD = Core.Const.STOCK_RECORD
export default {
    name: 'WarehouseList',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            create_time: [],
            detail: {},
            codeAddShow: false,
            isExist: '',
            handleTypeList:Core.Const.STOCK_RECORD.TYPE,
            statusList: [
                {text: '全  部', value: '0', color: 'primary', key: '0'},
                {text: '待审核', value: '0', color: 'yellow',     key: STOCK_RECORD.STATUS.AIT_AUDIT },
                {text: '审核通过', value: '0', color: 'green',  key: STOCK_RECORD.STATUS.AUDIT_PASS },
                {text: '审核失败', value: '0', color: 'red',  key: STOCK_RECORD.STATUS.CLOSE },
                {text: '处理完成', value: '0', color: 'green',    key: STOCK_RECORD.STATUS.AUDIT_REFUSE },
            ],
            searchForm: {
                name: '',
                uid: '',
                status: undefined,
                type: undefined,
            },
            form: {
                type: '',
                id: '',
                target_code: '', //商品编码
                number: '',
                warehouse_id: '',
            },

            tableColumns: [
                { title: '出入库单编号', dataIndex: 'uid', key: 'detail' },
                {title: '出入库类型', dataIndex: 'type',key: 'type',},
                {title: '所属仓库', dataIndex: 'name',key: 'detail',},
                {title: '仓库类型', dataIndex: 'type',key: 'type',},
                {title: '仓库地址', key:'address', dataIndex: 'province'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '操作', key: 'operation', fixed: 'right' },
            ],
            tableData: [],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log('routerChange item:', item)
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-edit",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-detail",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
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
        handleTypeSelect(val) {
            this.type = val
        },
        pageChange(curr) {    // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {    // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        handleSearch() {    // 搜索
            this.pageChange(1);
        },
        handleSearchReset() {    // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            console.log('this.searchForm:', this.searchForm)
            this.create_time = []
            this.pageChange(1);
        },
        getTableData() {    // 获取 表格 数据
            this.loading = true;
            this.loading = false;
            // return
            Core.Api.Invoice.list({
                ...this.searchForm,
                begin_time: this.create_time[0] || '',
                end_time: this.create_time[1] || '',
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res:", res)
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该仓库吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Warehouse.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
    }
};
</script>

<style lang="less" scoped>
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
</style>