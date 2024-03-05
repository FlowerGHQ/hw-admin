<template>
    <div id="UserDetailTem" class="list-container">
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
    margin: 12px 20px;
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
