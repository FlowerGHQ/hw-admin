<template>
    <div id="CRMRegionEmployeesList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('crm_region_e.list') }}</div>
                <div class="btns-area">
<!--                    <a-button type="primary" @click="handleModalShow({})" v-if="$auth('material-category.save')"><i class="icon i_add"/>{{ $t('crm_region.new_top') }}</a-button>-->
                </div>
            </div>
            <a-row>
                <a-col :xs='9' :sm='6' :xl="4" :xxl='3' class="search-item">
                    <div class="group-container">
                        <div class="category-container">

<!--                            <div class="category-title" >区域</div>-->
                            <div class="category-content">
                                <!--                        <a-input-search v-model:value="searchValue" style="margin-bottom: 8px" placeholder="Search" />-->
                                <a-tree
                                    v-model:value="checkedKeys"
                                    :disable-checkbox="false"
                                    :expanded-keys="expandedKeys"
                                    :auto-expand-parent="autoExpandParent"
                                    :selected-keys="selectedKeys"
                                    :tree-data="groupOptions"
                                    @expand="onExpand"
                                    @select="onSelect"
                                />
                            </div>
                        </div>
                    </div>
                </a-col>
                <a-col :xs='15' :sm='18' :xl="20" :xxl='21' class="search-item">
                    <div class="search-container">
                        <a-row class="search-area">
                            <a-col :xs='24' :sm='24' :xl="8" :xxl='8' class="search-item">
                                <div class="key">{{ $t('n.name') }}:</div>
                                <div class="value">
                                    <div class="value">
                                        <a-input :placeholder="$t('def.input')" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
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
                                <div class="key">{{ $t('d.create_time') }}:</div>
                                <div class="value"><TimeSearch @search="handleOtherSearch" ref='TimeSearch'/></div>
                            </a-col>
                        </a-row>
                        <div class="btn-area">
                            <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                            <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                        </div>
                    </div>
                    <div class="table-container">
                        <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                            :row-key="record => record.id" :pagination='false'
                            v-model:expandedRowKeys='expandedRowKeys'>
                            <template #bodyCell="{ column, text , record }">
                                <template v-if="column.dataIndex === 'flag_admin'">
                                    {{ text ? $t('i.yes') : $t('i.no') }}
                                </template>
                                <template v-if="column.key === 'item'">
                                    {{ text || '-' }}
                                </template>
                                <template v-if="column.key === 'user'">
                                    {{ text || '-' }}
                                </template>
                                <template v-if="column.key === 'flag_admin_group'">
                                    {{ text === 1? '是': '否' || '-' }}
                                </template>
                                <template v-if="column.key === 'crm_group_member_list'">
                                    <span v-for="it in text">
                                        {{it.group_name}},
                                    </span>
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
                                    <a-button type='link' @click="handleDelete(record.id)" class="danger" v-if="$auth('user.delete','MANAGER')"><i class="icon i_delete"/>{{ $t('def.delete') }}</a-button>
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
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import UserSelect from '@/components/crm/popup-btn/UserSelect.vue'
import TimeSearch from '@/components/common/TimeSearch.vue'
export default {
    name: 'CrmRegion',
    components: {UserSelect,TimeSearch},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            tableData: [],
            expandedRowKeys: [],
            adminUserList: [],
            editNode: null,
            parentNode: null,
            modalVisible: false,
            // 搜索
            searchForm: {
                name: '',
                group_id: "",
                type: undefined,
                org_id: Core.Data.getOrgId(),
                org_type: Core.Data.getOrgType(),
                begin_time: '',
                end_time: '',
            },
            userData: [],
            expandedKeys: ['0-0-0', '0-0-1'],
            autoExpandParent: true,
            checkedKeys: ['0-0-0'],
            selectedKeys: [],
            groupOptions: [],
        };
    },
    watch: {
        checkedKeys(val) {
            console.log('onCheck', val);
        },
    },
    computed: {
        tableColumns() {
            let columns = [
                {title: this.$t('n.name'), dataIndex: ['account', 'name'], key: 'user'},
                {title: this.$t('u.account'), dataIndex: ['account', 'username'], key: 'item'},
                {title: this.$t('n.phone'), dataIndex: ['account', 'phone'], key: 'item'},
                {title: this.$t('n.email'), dataIndex: ['account', 'email'], key: 'item'},
                {title: this.$t('crm_group.name'),  dataIndex: 'crm_group_member_list', key:'crm_group_member_list'},

            ]
            if (this.searchForm.group_id){
                columns.push( {title: this.$t('crm_group.administrator'), dataIndex: 'flag_admin_group', key: 'flag_admin_group', align: 'center'})
            }

            columns.push( {title: this.$t('def.operate'), key: 'operation', fixed: 'right', width: 100,})

            return columns
        },
    },
    mounted() {
        this.handleGroupTree()
        this.getTableData()
    },
    methods: {


        handleGroupTree() {
            Core.Api.CRMGroupMember.structureByUser().then(res => {
                this.groupOptions = res.list
                console.log(res)
            })
        },
        onExpand(expandedKeys) {
            console.log('onExpand', expandedKeys);
            // if not set autoExpandParent to false, if children expanded, parent can not collapse.
            // or, you can remove all expanded children keys.
            this.expandedKeys = expandedKeys;
            this.autoExpandParent = false;
        },
        onCheck(checkedKeys) {
            console.log('onCheck', checkedKeys);
            this.checkedKeys = checkedKeys;
        },
        onSelect(selectedKeys, info) {
            console.log('onSelect', info);
            this.selectedKeys = selectedKeys;
            this.searchForm.group_id = selectedKeys[0];
            this.handleSearch()
        },
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
            this.selectedKeys = []
            this.pageChange(1);
        },
        getTableData() {    // 获取 表格 数据
            this.loading = true;
            Core.Api.User.listGroup({
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
        // 删除团队
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.User.delete({id}).then(() => {
                        _this.$message.success(_this.$t('pop_up.delete_success'));
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

    }
};
</script>

<style lang="less" scoped>


#CRMRegionEmployeesList{
    .group-container{
        margin-left: 20px;
    }
}

</style>
