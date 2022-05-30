<template>
<div id="UserList">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">员工列表</div>
            <div class="btns-area">
                <a-button type="primary" @click="routerChange('edit')" v-if="$auth('account.save', 'MANAGER')"><i class="icon i_add"/>新增员工</a-button>
            </div>
        </div>
        <div class="search-container">
            <a-row class="search-area">
                <a-col :xs='24' :sm='24' :xl="8" :xxl='8' class="search-item">
                    <div class="key">员工名称:</div>
                    <div class="value">
                        <div class="value">
                            <a-input placeholder="请输入员工名称" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
                        </div>
                    </div>
                </a-col>
<!--                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">类型:</div>
                    <div class="value">
                        <a-select v-model:value="searchForm.type" @change="handleSearch" placeholder="请选择员工类型" allow-clear>
                            <a-select-option :value="orgType">普通员工</a-select-option>
                            <a-select-option :value="USER_TYPE.WORKER">维修工</a-select-option>
                        </a-select>
                    </div>
                </a-col>-->
                <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                    <div class="key">创建时间:</div>
                    <div class="value"><TimeSearch @search="handleOtherSearch" ref='TimeSearch'/></div>
                </a-col>
            </a-row>
            <div class="btn-area">
                <a-button @click="handleSearch" type="primary">查询</a-button>
                <a-button @click="handleSearchReset">重置</a-button>
            </div>
        </div>
        <div class="table-container">
            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }" :row-key="record => record.id" :pagination='false'>
                <template #bodyCell="{ column, text , record }">
                    <template v-if="column.dataIndex === 'flag_admin'">
                        {{ text ? '是' : '否' }}
                    </template>
                    <template v-if="column.key === 'item'">
                        {{ text || '-' }}
                    </template>
                    <template v-if="column.key === 'user'">
                        <a-tooltip placement="top" :title='text'>
                            <a-button type="link" @click="routerChange('detail', record)" style="margin-left: 6px;">
                                {{ text || '-' }}
                            </a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'tip_item'">
                        <a-tooltip placement="top" :title='text'>
                            <div class="ell" style="max-width: 160px">{{ text || '-' }}</div>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'operation'">
                        <a-button type='link' @click="routerChange('detail', record)"><i class="icon i_detail"/>详情</a-button>
                        <a-button type='link' @click="routerChange('edit', record)" v-if="$auth('account.save','MANAGER')"><i class="icon i_edit"/>编辑</a-button>
                        <a-button type="link" @click="handleEditShow(record)" v-if="$auth('account.save','MANAGER')"><i class="icon i_lock"/>重置密码</a-button>
                        <a-button type='link' @click="handleDelete(record.id)" class="danger" v-if="$auth('account.delete','MANAGER')"><i class="icon i_delete"/>删除</a-button>
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
    <a-modal v-model:visible="passShow" title="重置密码" class="password-edit-modal" :after-close="handleEditClose">
        <div class="form-title">
            <div class="form-item required">
                <div class="key">新密码:</div>
                <div class="value">
                    <a-input-password v-model:value="form.password" placeholder="请输入新密码" />
                </div>
            </div>
            <div class="form-item required">
                <div class="key">确认密码:</div>
                <div class="value">
                    <a-input-password v-model:value="form.new_password" placeholder="请再次输入密码" />
                </div>
            </div>
        </div>
        <template #footer>
            <a-button @click="handleEditSubmit" type="primary">确定</a-button>
            <a-button @click="passShow=false">取消</a-button>
        </template>
    </a-modal>
</div>
</template>

<script>
import Core from '../../core';

import TimeSearch from '@/components/common/TimeSearch.vue'

export default {
    name: 'UserList',
    components: {
        TimeSearch,
    },
    props: {},
    data() {
        return {
            orgType: Core.Data.getOrgType(),
            USER_TYPE: Core.Const.USER.TYPE,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            searchForm: {
                name: '',
                type: undefined,
                org_id: Core.Data.getOrgId(),
                org_type: Core.Data.getOrgType(),
                begin_time: '',
                end_time: '',
            },

            // 表格
            tableData: [],
            tableColumns: [
                {title: '员工姓名', dataIndex: ['account', 'name'], key: 'user'},
                {title: '账号', dataIndex: ['account', 'username'], key: 'item'},
                {title: '手机号', dataIndex: ['account', 'phone'], key: 'item'},
                {title: '邮箱', dataIndex: ['account', 'email'], key: 'item'},
                {title: '员工角色', dataIndex: 'role_name', key: 'item'},
                {title: '是否为管理员', dataIndex: 'flag_admin', align: 'center'},
                {title: '最近登录', dataIndex: ['account', 'last_login_time'], key: 'time'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '操作', key: 'operation', fixed: 'right', width: 100,},
            ],

            // 弹框
            passShow: false,
            form: {
                id: '',
                password: '',
                new_password: '',
            },
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item)
            let routeUrl = ''
            switch (type) {
                case 'edit':    // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/system/user-edit",
                        query: {
                            id: item.id,
                            org_id: Core.Data.getOrgId(),
                            org_type: this.orgType
                        }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':    // 详情
                    routeUrl = this.$router.resolve({
                        path: "/system/user-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
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
        handleSearch() {    // 搜索
            this.pageChange(1);
        },
        handleOtherSearch(params) { // 时间等组件化的搜索
            for (const key in params) {
                this.searchForm[key] = params[key]
            }
            this.pageChange(1);
        },
        handleSearchReset() {    // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.$refs.TimeSearch.handleReset()
            this.pageChange(1);
        },
        getTableData() {    // 获取 表格 数据
            this.loading = true;
            Core.Api.User.list({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize
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
        // 删除员工
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该员工吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.User.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete -> err", err);
                    })
                },
            });
        },
        // 编辑密码
        handleEditShow(item) {
            this.passShow = true;
            if (item) {
                this.form.id = item.account_id
            }
        },
        handleEditClose() {
            this.passShow = false;
            this.form = {
                id: '',
                password: '',
                new_password: '',
            }
        },
        handleEditSubmit() {
            let form = Core.Util.deepCopy(this.form)
            console.log('handleLogin form:', form)
            if (!form.password) {
                return this.$message.warning('请输入新密码')
            }
            if (!form.new_password) {
                return this.$message.warning('请再次确认密码')
            }
            if (form.new_password !== form.password) {
                return this.$message.warning('两次密码输入不一致')
            }

            this.loading = true;
            Core.Api.Account.resetPwd(form).then(() => {
                this.$message.success('保存成功')
                this.handleEditClose();
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        }
    }
};
</script>

<style lang="less" scoped>
// #UserList {}
</style>
