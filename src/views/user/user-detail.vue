<template>
    <div id="UserDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">员工详情</div>
            <div class="btns-area">
                <a-button type="primary" ghost @click="routerChange('edit', record)" v-if="$auth('account.save', 'MANAGER')"><i class="icon i_edit"/>编辑</a-button>
                <a-button type="danger" ghost @click="handleDelete(id)" v-if="$auth('account.delete', 'MANAGER')"><i class="icon i_delete"/>删除</a-button>
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
                        <span class="key">账号：</span>
                        <span class="value">{{ detail.account.username }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">管理员：</span>
                        <span class="value">{{ detail.flag_admin ? '是' : '否' }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">手机号：</span>
                        <span class="value">{{ detail.account.phone }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">邮箱：</span>
                        <span class="value">{{ detail.account.email }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">员工角色：</span>
                        <span class="value">{{ detail.role_name }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">创建时间：</span>
                        <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                    </a-col>
                </a-row>
            </div>
        </div>
        <div class="tabs-container">
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="UserRole" tab="角色分配">
                    <UserRole type='item' :userId="id" :detail="detail" @submit="getUserDetail"
                               v-if="activeKey === 'UserRole'"/>
                </a-tab-pane>
                <a-tab-pane key="UserAuth" tab="权限管理">
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
import UserRole from "./components/UserRole.vue";

const WAREHOUSE_TYPE = Core.Const.WAREHOUSE.TYPE

export default {
    name: "UserDetail",
    components: { UserAuth ,UserRole },
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
            activeKey: 'UserRole'
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
                title: "确定要删除该员工吗？",
                okText: "确定",
                okType: "danger",
                cancelText: "取消",
                onOk() {
                    Core.Api.User.delete({id}).then(() => {
                        _this.$message.success("删除成功");
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
