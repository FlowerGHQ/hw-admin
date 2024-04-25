<template>
    <div class="UserRole gray-panel no-margin">
        <div class="panel-content">
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'text'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'name'">
                            {{ $Util.userAuthFilter(record.resource_type, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'content'">
                            {{ $i18n.locale === 'zh' ? record.content : record.content_en }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button
                                type="link"
                                @click="handleScopeTypeShow(record)"
                                v-if="$auth('MANAGER')"
                                >{{ $t('n.amend') }}</a-button
                            >
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <a-pagination
                    v-model:current="currPage"
                    :page-size="pageSize"
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                    :hide-on-single-page="false"
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
        </div>
        <a-modal
            v-model:visible="scopeShow"
            :title="$t('u.resource')"
            class="stock-change-modal"
            :width="800"
            :after-close="handleScopeTypeClose"
        >
            <UserScope :userId="userId" :userType="detail.type" :resourceType="scopeType" v-if="scopeShow" />
            <template #footer>
                <a-button @click="scopeShow = false">{{ $t('pop_up.close') }}</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../../core';
import UserScope from './UserScope.vue';
export default {
    name: 'UserRole',
    components: { UserScope },
    props: {
        userId: {
            type: Number,
        },
        detail: {
            type: Object,
            default: () => {
                return {};
            },
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
            // 弹框
            scopeType: '',
            scopeShow: false,

            tableData: [
                { content: '', content_en: '', resource_type: 10 },
                { content: '', content_en: '', resource_type: 20 },
                { content: '', content_en: '', resource_type: 30 },
            ],

            form: {
                role_id: '',
                user_id: '',
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: this.$t('u.resource_name'), dataIndex: 'name', key: 'name' },
                { title: this.$t('u.resource_content'), dataIndex: 'content', key: 'content' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
            ];
            return tableColumns;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            console.log('pageSizeChange size:', size);
            this.pageSize = size;
            this.getTableData();
        },
        getTableData() {
            // 获取 表格 数据
            Core.Api.AuthorityUser.list({
                user_id: this.userId,
            })
                .then(res => {
                    console.log('getAuthUserDetail res', res);
                    Object.assign(this.tableData, this.$options.data().tableData);
                    this.tableData.forEach(item => {
                        res.list.forEach(it => {
                            if (it.resource_type === item.resource_type) {
                                item.content += it.resource.name + ',';
                                if (it.resource_type === Core.Const.NOTICE.RESOURCE_TYPE.PURCHASE) {
                                    item.content_en += it.resource.nameEn + ',';
                                } else {
                                    item.content_en += it.resource.name + ',';
                                }
                            }
                        });
                    });
                    console.log(this.list);
                    // this.list = res.list

                    console.log('res', res);
                })
                .catch(err => {
                    console.log('getAuthUserDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        handleRoleShow() {
            this.roleShow = true;
            this.getRoleList();
            /*if (item) {
                this.form.resource_type = item.resource_type
                this.form.resource_id = item.resource_id
            }*/
        },
        handleRoleClose() {
            this.roleShow = false;
            Object.assign(this.form, this.$options.data().form);
        },
        handleScopeTypeShow(item) {
            console.log();
            this.scopeType = item.resource_type;
            this.scopeShow = true;
            // let routeUrl = this.$router.resolve({
            //     path: "/system/user-scope",
            //     query: {
            //         user_id: this.userId,
            //         user_type: this.detail.type,
            //         resource_type: scope_type,
            //     }
            // })
            // window.open(routeUrl.href, '_self')
        },
        handleScopeTypeClose() {
            // 取消编辑
            this.scopeShow = false;
        },
    },
};
</script>
<style lang="less"></style>
