<template>
    <div id="AuthRoleEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('n.edit_user') : $t('n.create_user') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content">
                <!--                <div class="form-item required">
                    <div class="key">名称</div>
                    <div class="value">
                        <a-input v-model:value="form.name" placeholder="请输入权限名称"/>
                    </div>
                </div>-->
                <div class="form-item required">
                    <div class="key">{{ $t('n.type') }}</div>
                    <div class="value">
                        <a-select v-model:value="form.resource_type" :placeholder="$t('n.select_permission')">
                            <a-select-option v-for="(val, key) in resourceMap" :key="key" :value="key">{{
                                val[$i18n.locale]
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.object') }}</div>
                    <div class="value">
                        <a-select v-model:value="form.resource_id" :placeholder="$t('n.select_permission')">
                            <a-select-option v-for="item of warehouseList" :key="item.id" :value="item.id">{{
                                item.name
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <!--                <div class="form-item required">
                    <div class="key">用户</div>
                    <div class="value">
                        <a-select v-model:value="form.user_ids" mode="tags"  placeholder="请选择权限对象">
                            <a-select-option v-for="item of userList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                        </a-select>
                    </div>
                </div>-->
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary" v-if="$auth('role.save')">{{ $t('def.ok') }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost>{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';

const AUTH_LIST_TEMP = Core.Const.SYSTEM_AUTH.AUTH_LIST_TEMP;
const RESOURCE_TYPE = Core.Const.NOTICE.RESOURCE_TYPE;
export default {
    name: 'AuthRoleEdit',
    components: {},
    props: {},
    data() {
        return {
            RESOURCE_TYPE,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            resourceMap: Core.Const.NOTICE.RESOURCE_TYPE_MAP,
            id: '',
            detail: {},

            authItems: Core.Util.deepCopy(AUTH_LIST_TEMP),
            warehouseList: [],
            userList: [],
            form: {
                id: '',
                // name: '',
                resource_type: undefined,
                resource_id: undefined,
                user_ids: undefined,
            },
        };
    },
    watch: {},
    computed: {},
    created() {
        this.form.id = Number(this.$route.query.id) || 0;
        if (this.form.id) {
            this.getAuthUserDetail();
        }
        this.getWarehouseList();
        this.getUserList();
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1);
                    break;
            }
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list;
            });
        },
        getUserList() {
            Core.Api.User.listAll().then(res => {
                this.userList = res.list;
            });
        },
        getAuthUserDetail() {
            // 获取角色详情
            this.loading = true;
            Core.Api.AuthorityUser.detail({
                id: this.form.id,
            })
                .then(res => {
                    console.log('getAuthUserDetail res', res);
                    this.detail = res;
                    console.log('res', res);
                    for (const key in this.detail) {
                        this.form[key] = this.detail[key];
                        console.log('key', key);
                    }
                })
                .catch(err => {
                    console.log('getAuthUserDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        handleSubmit() {
            let form = Core.Util.deepCopy(this.form);
            console.log('handleSubmit form:', form);
            /*   if (!form.name) {
                return this.$message.warning('请输入权限名称')
            }*/
            if (!form.resource_type) {
                return this.$message.warning(this.$t('e.select_permission'));
            }
            if (!form.resource_id) {
                return this.$message.warning(this.$t('e.select_warehouse'));
            }
            if (!form.user_ids) {
                return this.$message.warning(this.$t('e.select_employees'));
            }
            let list = [];
            for (const item of this.authItems) {
                list.push(...item.select);
            }
            form.user_ids = form.user_ids;
            Core.Api.AuthorityUser.save({
                ...form,
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.routerChange('back');
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
    },
};
</script>

<style lang="less">
#AuthRoleEdit {
    .ant-checkbox + span {
        padding-right: 8px;
        padding-left: 8px;
        width: 100px;
    }
}
</style>
