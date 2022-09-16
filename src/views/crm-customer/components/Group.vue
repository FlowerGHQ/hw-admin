<template>
<div class="InformationInfo gray-panel no-margin">
    <div class="panel-content">
        <div class="title">
            <span>团队成员({{total}})</span>
            <div class="right-btn">
                <div class="button" @click="clickAdd"><i class="icon i_add"/></div>
                <div class="button" @click="clickEdit"><i class="icon i_edit"/></div>
            </div>
        </div>
        <div class="search">
            <a-input-search v-model:value="searchKey" :placeholder="'搜索成员和标签'" @onSearch="clickSearch"/>
        </div>
        <div class="list">
            <div class="list-item" v-for="(item, i) in tableData" :key="i">
                <div class="item-left">
                    <img class="avatar" src="" alt="">
                </div>
                <div class="item-right">
                    <div class="name">名称</div>
                    <div class="type">职位</div>
                </div>
                <div class="item-button">
                    <div class="button" @click="clickDelete(item)"><i class="icon i_delete"/></div>
                    <div class="button" @click="clickEdit(item)"><i class="icon i_edit"/></div>
                </div>
            </div>
        </div>
        <!-- <div>
            <a-list
                class="demo-loadmore-list"
                :loading="initLoading"
                item-layout="horizontal"
                :data-source="tableData"
            >
                <template #loadMore>
                    <div
                        v-if="!initLoading && !loading"
                        :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
                    >
                    </div>
                </template>
                <template #renderItem="{ item }">
                    <a-list-item>
                        <template #actions>
                            <div>{{item.create_time}}</div>
                            <a key="list-loadmore-edit">edit</a>
                            <a key="list-loadmore-more">more</a>
                        </template>
                        <a-skeleton avatar :title="false" :loading="!!item.loading" active>
                            <a-list-item-meta
                                :description="item.name"
                            >
                                <template #title>
                                    {{ item.name }}
                                </template>
                            </a-list-item-meta>
                            <div>{{item.create_time}}</div>
                        </a-skeleton>
                    </a-list-item>
                </template>
            </a-list>
        </div> -->

    </div>
</div>
</template>

<script>
import Core from '../../../core';
const USER_TYPE = Core.Const.USER.TYPE

export default {
    name: 'InformationInfo',
    components: {},
    props: {
        detail:{
            type: Object,
        }

    },
    data() {
        return {
            CRM_TYPE_MAP: Core.Const.CRM_CUSTOMER.TYPE_MAP,
            CRM_LEVEL_MAP: Core.Const.CRM_CUSTOMER.LEVEL_MAP,
            CRM_SOURCE_MAP: Core.Const.CRM_CUSTOMER.SOURCE_MAP,
            CRM_INDUSTRY_MAP: Core.Const.CRM_CUSTOMER.INDUSTRY_MAP,
            CRM_GENDER_MAP: Core.Const.CRM_CUSTOMER.GENDER_MAP,
            CRM_MARITAL_STATUS_MAP: Core.Const.CRM_CUSTOMER.MARITAL_STATUS_MAP,
            CRM_TYPE: Core.Const.CRM_CUSTOMER.TYPE,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            USER_TYPE,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 表格数据
            tableData: [{},{}],
            trackMemberShow: false,

            userId: '',
            userDetail: '',
            initLoading: false,

            searchKey: '',
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                {title: this.$t('e.name'), dataIndex: ['account', 'name'], key: 'item'},
                {title: this.$t('e.account'), dataIndex: ['account', 'username'], key: 'item'},
                {title: this.$t('n.phone'), dataIndex: ['account', 'phone']},
                {title: this.$t('n.email'), dataIndex: ['account', 'email']},
                {title: this.$t('n.type'), dataIndex: 'type'},
                {title: this.$t('e.login_time'), dataIndex: ['account', 'last_login_time'], key: 'time'},
                {title: this.$t('d.create_time'), dataIndex: 'create_time', key: 'time'},
                {title: this.$t('def.operate'), key: 'operation', fixed: 'right'},
            ]
            return columns
        },
        lang() {
            return this.$store.state.lang
        }
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        // 点击添加
        clickAdd() {},
        // 点击编辑
        clickEidt() {},
        // 点击搜索
        clickSearch(key) {
            console.log('click search >>', key);
        },
        handleManagerChange(record){
            this.loading = true;
            Core.Api.User.setAdmin({
                id: record.id,
                flag_admin: record.flag_admin ? 0 : 1
            }).then(() => {
                this.getTableData();
            }).catch(err => {
                console.log('handleManagerChange err', err)
            }).finally(() => {
                this.loading = false;
            });
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
                            org_id: this.orgId,
                            org_type: this.orgType,
                            type: this.type,
                        }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':    // 详情
                    routeUrl = this.$router.resolve({
                        path: "/system/user-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_blank')
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
        getTableData() {    // 获取 表格 数据
            this.loading = true;
            Core.Api.CRMTrackMember.list({
                target_id: this.targetId,
                target_type: this.targetType,
                user_id: this.userId,
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
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMCustomer.delete({id}).then(() => {
                        _this.$message.success(_this.$t('pop_up.delete_success'));
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete -> err", err);
                    })
                },
            });
        },
        handleUserRole(item) {
            console.log(item)
            this.userId = item.id;
            this.userDetail = item;
            this.userRoleShow = true;
        },
        handleRoleClose() {
            this.userId = '';
            this.userDetail = '';
            this.userRoleShow = false;
        },
    }
};
</script>

<style lang="less" scoped>
.InformationInfo {
    .table-container {
        margin-top: -10px;
    }

}
// .ant-descriptions-view{
//     th.ant-descriptions-item-label {
//         width: 25%;
//     }
//     td.ant-descriptions-item-content {
//         width: 25%;
//     }
// }
.panel-content {
    .title {
        // color: @TC_LT;
        position: relative;
        width: 100%;
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 20px;
        .right-btn {
            position: absolute;
            // display: flex;
            .flex(flex-end, center, row);
            top: 0;
            right: 0;
            width: 50%;
            text-align: right;
            .button {
                margin-left: 8px;
                cursor: pointer;
            }
        }
    }
    .list {
        .list-item {
            position: relative;
            padding: 10px 20px;
            border-radius: 5px;
            overflow: hidden;
            transition: all ease 0.2s;
            background-color: #ffffff;
            .flex(flex-start, center, row);
            .item-left {
                // display: inline-block;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                overflow: hidden;
                .avatar {
                    width: 30px;
                    height: 30px;
                }
            }
            .item-right {
                padding-left: 20px;
                width: calc(100% - 30px - 50px);
                .flex(flex-start, flex-start);
                .type {
                    padding: 1px 4px;
                    border: 1px solid @blue;
                    background-color: #e6f5fe;
                    border-radius: 4px;
                    font-size: 12px;
                    color: @blue;
                }
            }
            .item-button {
                position: absolute;
                .flex(flex-end, center, row);
                width: 200px;
                top: 50%;
                right: -200px;
                transform: translateY(-50%);
                .button {
                    cursor: pointer;
                    margin-left: 8px;
                    >.icon {
                        font-size: 16px;
                    }
                }
            }
            &:hover {
                .item-button {
                    right: 20px;
                }
                background-color: #ebf2fd;
            }
        }
    }
}
</style>
