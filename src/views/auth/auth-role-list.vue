<template>
    <div id="AuthRoleList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">角色管理</div>
                <div class="btns-area">
                    <a-button type="primary" @click="handleRoleShow()" class="menu-item-btn"><i
                        class="icon i_add"/>新建角色
                    </a-button>
                </div>
            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                         :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.dataIndex === 'name'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'tip_item'">
                            <a-tooltip placement="top" :title='text'>
                                <div class="ell" style="max-width: 30em">{{text || '-'}}</div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.dataIndex === 'create_time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type='link' @click="handleRoleShow(record)"><i class="icon i_edit"/> 编辑描述
                            </a-button>
                            <a-button type='link' @click="routerChange('edit', record)"><i class="icon i_edit"/> 编辑权限
                            </a-button>
                            <a-button type='link' @click="handleDelete(record.id)"><i class="icon i_delete"/> 删除
                            </a-button>
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
        <a-modal v-model:visible="roleShow" title="新建角色" class="password-edit-modal">
            <div class="form-title">
                <div class="form-item required">
                    <div class="key">角色名称:</div>
                    <div class="value">
                        <a-input v-model:value="form.name" placeholder="请输入角色名称"/>
                    </div>
                </div>
                <div class="form-item textarea">
                    <div class="key">角色描述:</div>
                    <div class="value">
                        <a-textarea v-model:value="form.remark" placeholder="请输入角色描述" :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='300'/>
                        <span class="content-length">{{form.remark.length}}/300</span>
                    </div>
                </div>
            </div>
            <template class="form-btns" #footer>
                <a-button key="back" type="primary" @click="handleRoleSubmit">确定</a-button>
                <a-button @click="roleShow=false" >取消</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../core';

export default {
    name: 'AuthRoleList',
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
            roleShow: false,
            form: {
                id: '',
                name: '',
                remark: '',
            },
            storeList: [],
            // 表格数据
            tableData: [],
            tableColumns: [
                {title: '角色', dataIndex: 'name'},
                {title: '描述', dataIndex: 'remark', key: 'tip_item' },
                {title: '创建时间', dataIndex: 'create_time'},
                {title: '操作', key: 'operation', fixed: 'right', width: 100,},
            ],
            // 账户参数获取
            orgId: 0,
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getTableData();
        this.orgId = Core.Data.getOrgId();
        console.log("orgId" + this.orgId);
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item)
            let routeUrl = ''
            switch (type) {
                case 'detail':    // 详情
                    routeUrl = this.$router.resolve({
                        path: "/auth/auth-role-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        handleRoleShow(item) {
            console.log('handleRoleShow item', item)
            if (item) {
                this.form.id = item.account_id
            }
            this.roleShow = true;
        },
        handleRoleClose() {
            this.roleShow = false;
            this.form = {
                id: '',
                name: '',
                remark: '',
            }
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
        handleRoleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            console.log('handleLogin form:', form)
            if (!form.name) {
                return this.$message.warning('请输入角色名称')
            }
            if (!form.remark) {
                return this.$message.warning('请输入角色描述')
            }

            this.loading = true;
            Core.Api.AuthRole.save(this.form).then(() => {
                this.$message.success('保存成功')
                this.handleRoleClose();
                this.pageChange(1);
            }).catch(err => {
                console.log('handleRoleSubmit err:', err)
            })
        },
        getTableData() {    // 获取 表格 数据
            this.loading = true;
            Core.Api.AuthRole.list({
                ...this.form,
                begin_time: this.create_time[0] || '',
                end_time: this.create_time[1] || '',
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("AuthRole.list res", res)
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('AuthRole.list err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该角色吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.AuthRole.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                        _this.pageChange(1);
                    }).catch(err => {
                        console.log("handleDelete -> err", err);
                    })
                },
            });
        },

    }
};
</script>

<style lang="less" scoped>
//#AuthRoleList {}
</style>
