<template>
    <div class="InformationInfo gray-panel no-margin">
        <div class="panel-content">
            <div>
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail'">
                            <div class="table-img">
                                <a-image
                                    :width="24"
                                    :height="24"
                                    :src="$Util.imageFilter(record.path.includes('img') ? record.path : '', 4)"
                                    :fallback="$t('def.none')"
                                />
                                <a-tooltip placement="top" :title="text">
                                    <p class="ell" style="max-width: 120px; margin-left: 12px">{{ text || '-' }}</p>
                                </a-tooltip>
                            </div>
                        </template>
                        <template v-if="column.key === 'org'">
                            {{ $Util.userTypeFilter(text.org_type, $i18n.locale) }}·{{ text.org_name }}
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text, 3) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="handleDownload(record)"
                                ><i class="icon i_download" />{{ $t('n.download') }}</a-button
                            >
                            <a-button type="link" @click="handleDelete(record.id)" class="danger" v-if="can_delete"
                                ><i class="icon i_delete" />{{ $t('def.delete') }}</a-button
                            >
                        </template>
                    </template>
                </a-table>
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
        </div>
    </div>
</template>

<script>
import Core from '../../../core';

export default {
    name: 'CRMAttachmentFile',
    props: {
        target_id: {
            type: Number,
        },
        target_type: {
            type: Number,
        },
        detail: {},
    },
    components: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 表格数据
            tableData: [],
            trackMemberShow: false,

            userId: '',
            userDetail: '',
        };
    },
    watch: {
        target_id: {
            handler(val) {
                console.log('target_id', val);
                this.getTableData();
            },
            immediate: true,
            deep: true,
        },
    },
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('n.name'), dataIndex: 'name', key: 'detail' },
                { title: this.$t('n.type'), dataIndex: 'type', key: 'item' },
                { title: this.$t('n.uploader'), dataIndex: ['user', 'account', 'name'], key: 'item' },
                { title: this.$t('n.uploading_agency'), dataIndex: 'user', key: 'org' },
                { title: this.$t('n.upload_time'), dataIndex: 'create_time', key: 'time' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
            ];
            return columns;
        },

        lang() {
            return this.$store.state.lang;
        },
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item);
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/system/user-edit',
                        query: {
                            id: item.id,
                            org_id: this.orgId,
                            org_type: this.orgType,
                            type: this.type,
                        },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/system/user-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
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
            this.loading = true;
            Core.Api.Attachment.list({
                target_id: this.target_id,
                target_type: this.target_type,
                page: 0,
            })
                .then(res => {
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('AttachmentFile err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 删除附件
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Attachment.delete({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
        // 下载附件
        handleDownload(record) {
            console.log('handleDownload record:', record);
            let url = Core.Const.NET.FILE_URL_PREFIX + record.path;
            window.open(url, '_self');
        },
    },
};
</script>

<style lang="less" scoped>
.InformationInfo {
    .table-container {
        margin-top: -10px;
    }
}
.ant-descriptions-view {
    th.ant-descriptions-item-label {
        width: 25%;
    }
    td.ant-descriptions-item-content {
        width: 25%;
    }
}
:deep(.panel-content) {
    padding: 0 !important;
}
</style>
