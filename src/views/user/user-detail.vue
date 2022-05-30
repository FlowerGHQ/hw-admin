<template>
    <div id="UserDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('u.detail') }}</div>
            <div class="btns-area">
                <a-button type="primary" ghost @click="routerChange('edit', record)" v-if="$auth('user.save')"><i class="icon i_edit"/>{{ $t('def.edit') }}</a-button>
                <a-button type="danger" ghost @click="handleDelete(id)" v-if="$auth('user.delete')"><i class="icon i_delete"/>{{ $t('def.delete') }}</a-button>
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content desc-container">
                <div class="desc-title">
                    <div class="title-area">
                        <span class="title">{{ detail.account.name }}</span>
                    </div>
                </div>
                <a-row class="desc-detail">
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('u.account') }}：</span>
                        <span class="value">{{ detail.account.username }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('e.administrator') }}：</span>
                        <span class="value">&nbsp; {{ detail.flag_admin ? $t('i.yes') : $t('i.no') }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.phone') }}：</span>
                        <span class="value">{{ detail.account.phone }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.email') }}：</span>
                        <span class="value">{{ detail.account.email }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('u.role') }}：</span>
                        <span class="value">{{ detail.role_name }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.time') }}：</span>
                        <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                    </a-col>
                </a-row>
            </div>
        </div>
        <div class="tabs-container">
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="UserAuth" tab="组织权限">
                    <UserAuth type='item' :userId="id" :detail="detail" @submit="getUserDetail"
                               v-if="activeKey === 'UserAuth'"/>
                </a-tab-pane>

            </a-tabs>
        </div>
    </div>
</template>

<script>
import Core from "../../core";
import UserAuth from "./components/UserAuth.vue";

const WAREHOUSE_TYPE = Core.Const.WAREHOUSE.TYPE

export default {
    name: "UserDetail",
    components: { UserAuth },
    props: {},
    data() {
        return {
            orgType: Core.Data.getOrgType(),
            WAREHOUSE_TYPE,
            // 加载
            loading: false,
            // 详情
            detail: {
                account: {}
            },
            id: '',
            //标签页
            activeKey: 'UserAuth'
        }
    },
    watch: {},
    computed: {},
    created() {
        this.id = Number(this.$route.query.id) || "";
        this.getUserDetail();
    },
    methods: {
        routerChange(type) {
            let routeUrl = "";
            switch (type) {
                case 'edit':    // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/system/user-edit",
                        query: {
                            id: this.id,
                            org_id: Core.Data.getOrgId(),
                            org_type: this.orgType
                        }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'list': // 列表
                    routeUrl = this.$router.resolve({
                        path: "/system/user-list",
                    });
                    window.open(routeUrl.href, "_self");
                    break;
            }
        },
        getUserDetail() {
            this.loading = true;
            Core.Api.User.detail({
                id: this.id,
            }).then(res => {
                console.log("getUserDetail res", res);
                this.detail = res.detail;
            }).catch(err => {
                console.log("getUserDetail err", err);
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
                    Core.Api.User.delete({id}).then(() => {
                        _this.$message.success(_this.$t('pop_up.delete_success'));
                        _this.routerChange('list');
                    }).catch((err) => {
                        console.log("handleDelete err", err);
                    });
                },
            });
        },
    },
};
</script>

<style lang="less" scoped>
// #UserDetail {}
</style>