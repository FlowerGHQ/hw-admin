<template>
    <div id="UserDetailTem" class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('u.detail') }}</div>
        </div>
        <div class="gray-panel">
            <div class="panel-content desc-container">
                <div class="desc-title">
                    <div class="title-area">
                        <span v-if="detail.department_list.length > 0">{{ detail.department_list[0].name }}-</span>
                        <span class="title">{{ detail.name }}</span>
                    </div>
                </div>
                <a-row class="desc-detail">
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('u.account') }}：</span>
                        <span class="value">{{ detail.username }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('e.administrator') }}：</span>
                        <span class="value">&nbsp; {{ detail.flag_admin ? $t('i.yes') : $t('i.no') }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.phone') }}：</span>
                        <span class="value">{{ detail.phone }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.email') }}：</span>
                        <span class="value">{{ detail.email }}</span>
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
        <div>
            <p class="title">{{ $t('u.configure_permissions') }}</p>
            <UserAuth
                ref="UserAuth"
                :showExtra="false"
                type="item"
                :userId="detail.id"
                :detail="Object.assign(detail, { org_type: 10 })"
                @submit="submit"
            />
        </div>
    </div>
</template>

<script>
import Core from '@/core';
import UserAuth from './UserAuth.vue';
import UserRole from './UserRole.vue';
import UserScopeList from './UserScopeList.vue';
import CustomerList from './CustomerList.vue';

const WAREHOUSE_TYPE = Core.Const.WAREHOUSE.TYPE;

export default {
    name: 'UserDetail',
    components: { UserAuth, UserRole, UserScopeList, CustomerList },
    props: {
        org_type: {
            type: Number,
        },
        detail: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    data() {
        return {
            WAREHOUSE_TYPE,
            // 加载
            loading: false,
            //标签页
            activeKey: 'UserRole',
        };
    },
    watch: {},
    computed: {},
    created() {},
    methods: {
        routerChange(type) {
            let routeUrl = '';
            switch (type) {
                case 'list': // 列表
                    routeUrl = this.$router.resolve({
                        path: '/system/user-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        save() {
            this.$refs.UserAuth.handleEditSubmit();
        },
        submit(ids) {
            this.$emit('submit', ids);
        },
    },
};
</script>

<style lang="less" scoped>
.desc-title {
    padding-left: 24px;
}
.title {
    margin: 12px 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
}
</style>
<style lang="less">
#UserDetailTem {
    .list-container {
        margin: 0px;
    }
}
</style>
