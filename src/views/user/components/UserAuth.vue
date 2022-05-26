<template>
    <div class="UserAuth gray-panel no-margin">
        <div class="panel-content">
            <div class="table-container">
                <a-button type="primary" ghost @click="handleAuthShow" v-if="$auth('user.save')" class="panel-btn">
                    <i class="icon i_add"/>新增权限
                </a-button>
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                         :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text, record}">
                        <template v-if="column.key === 'text'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'type'">
                            {{ $Util.userAuthFilter(text) }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
<!--                            <a-button type='link' @click="handleAuthShow(record)"><i class="icon i_edit"/>编辑</a-button>-->
                            <a-button type='link' @click="handleDelete(record)" class="danger"><i class="icon i_delete"/>删除</a-button>
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
                    :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                    :hide-on-single-page='false'
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
        </div>
        <a-modal v-model:visible="authShow" title="增加权限" class="stock-change-modal" :after-close="handleAuthClose">
            <div class="form-item required">
                <div class="key">类型</div>
                <div class="value">
                    <a-select v-model:value="form.resource_type" placeholder="请选择权限对象">
                        <a-select-option v-for="(val,key) in resourceMap" :key="key" :value="key">{{ val.text }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item required" >
                <div class="key">对象</div>
                <div class="value">
                    <a-select v-model:value="form.resource_id" placeholder="请选择权限对象">
                        <a-select-option v-for="item of warehouseList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <template #footer>
                <a-button @click="handleAuthSubmit" type="primary">确定</a-button>
                <a-button @click="authShow=false">取消</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../../core';
export default {
    name: 'UserAuth',
    components: {},
    props: {
        userId: {
            type: Number,
        },
        detail: {
            type: Object,
            default: () => {
                return {}
            }
        },
        type: {
            type: String,
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
            // 表格
            tableData: [],
            // 弹框
            authShow: false,
            warehouseList: [],
            resourceMap: Core.Const.NOTICE.RESOURCE_TYPE_MAP,
            form: {
                resource_type: undefined,
                user_id: '',
                user_type: '',
                resource_id: undefined,
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                {title: "权限类型", dataIndex: 'resource_type', key: "type"},
                {title: "权限对象", dataIndex: ['resource', 'name'], key: "text"},
                {title: "创建时间", dataIndex: "create_time", key: "time"},
                {title: this.$t('def.operate'), key: 'operation', fixed: 'right'},
            ];
            return tableColumns;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
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
            Core.Api.AuthorityUser.list({
                user_id: this.userId,
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
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list
            })
        },
        handleAuthShow() {
            this.authShow = true;
            this.getWarehouseList()
            /*if (item) {
                this.form.resource_type = item.resource_type
                this.form.resource_id = item.resource_id
            }*/
        },
        handleAuthClose() {
            this.authShow = false;
            Object.assign(this.form, this.$options.data().form)
        },
        handleAuthSubmit() {
            let form = Core.Util.deepCopy(this.form)
            form.user_id = this.detail.id
            form.user_type = this.detail.type
            console.log('user', this.detail.id)
            if (!form.resource_type) {
                return this.$message.warning('请选择权限类型')
            }
            if (!form.resource_id) {
                return this.$message.warning('请选择权限对象')
            }
            Core.Api.AuthorityUser.save(form).then(() => {
                this.$message.success('保存成功')
                this.handleAuthClose();
                this.getTableData();
            }).catch(err => {
                console.log('handleStockAddSubmit err:', err)
            })
        },
        handleDelete(item) {

            let form = {
                user_id: this.detail.id,
                user_type: this.detail.type,
                resource_id: item.resource_id,
                resource_type: item.resource_type
            }
            console.log('form',form)
            let _this = this;
            this.$confirm({
                title: '确定要删除该权限吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.AuthorityUser.delete(form).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete -> err", err);
                    })
                },
            });
        },
    },
};
</script>
<style lang="less">
</style>