<template>
    <div id="BomList" class="list-container">
        <div class="title-container">
            <div class="title-area">BOM列表</div>
            <div class="btns-area">
                <EditBomModel @submit="getTableData"><i class="icon i_add" />新增BOM表</EditBomModel>
            </div>
        </div>
        <div class="search-container">
            <a-row class="search-area">
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                    <div class="key">BOM名称:</div>
                    <div class="value">
                        <a-input
                            placeholder="请输入Bom名称"
                            v-model:value="searchForm.name"
                            @keydown.enter="handleSearch"
                        />
                    </div>
                </a-col>
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                    <div class="key">商品编码:</div>
                    <div class="value">
                        <a-input
                            placeholder="请输入BOM对应商品编码"
                            v-model:value="searchForm.code"
                            @keydown.enter="handleSearch"
                        />
                    </div>
                </a-col>
                <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-item">
                    <div class="key">创建时间:</div>
                    <div class="value"><TimeSearch @search="handleOtherSearch" ref="TimeSearch" /></div>
                </a-col>
            </a-row>
            <div class="btn-area">
                <a-button @click="handleSearch" type="primary">查询</a-button>
                <a-button @click="handleSearchReset">重置</a-button>
            </div>
        </div>
        <div class="table-container">
            <a-table
                :columns="tableColumns"
                :data-source="tableData"
                :scroll="{ x: true }"
                :row-key="record => record.id"
                :pagination="false"
            >
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.key === 'detail'">
                        <a-tooltip placement="top" :title="text">
                            <a-button type="link" @click="routerChange('detail', record)">{{ text || '-' }}</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'item-detail'">
                        <a-tooltip placement="top" :title="text">
                            <a-button type="link" @click="routerChange('item', record.item)">{{
                                text || '-'
                            }}</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'item'">
                        {{ text || '-' }}
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'operation'">
                        <a-button type="link" @click="routerChange('detail', record)"
                            ><i class="icon i_detail" /> 详情</a-button
                        >
                        <EditBomModel @submit="getTableData" btnType="link" :detail="record">
                            <i class="icon i_edit" />编辑
                        </EditBomModel>
                        <a-button type="link" @click="handleDelete(record.id)" class="danger"
                            ><i class="icon i_delete" /> 删除</a-button
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
</template>

<script>
import Core from '../../core';
import TimeSearch from '@/components/common/TimeSearch.vue';
import EditBomModel from './components/EditBomModel.vue';

export default {
    components: {
        TimeSearch,
        EditBomModel,
    },
    props: {},
    data() {
        return {
            currPage: 1,
            pageSize: 20,
            total: 0,
            searchForm: {
                name: '',
                code: '',
                begin_time: '',
                end_time: '',
            },

            tableData: [],
            tableColumns: [
                { title: 'BOM名称', dataIndex: 'name', key: 'detail' },
                { title: '对应商品名', dataIndex: ['item', 'name'], key: 'item-detail' },
                { title: '对应商品编号', dataIndex: ['item', 'code'], key: 'item' },
                // { title: '版本号', dataIndex: 'version_num', key: 'item' },
                { title: '版本号', dataIndex: 'version', key: 'item' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time' },
                { title: '更新时间', dataIndex: 'update_time', key: 'time' },
                { title: '操作', key: 'operation', fixed: 'right' },
            ],

            // 上传
            upload: {
                action: Core.Const.NET.URL_POINT + '/admin/1/bom-item/import',
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'xlsx',
                },
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
            let routeUrl = '';
            switch (type) {
                case 'detail':
                    routeUrl = this.$router.resolve({
                        path: '/manufacture/bom-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'item':
                    routeUrl = this.$router.resolve({
                        path: '/item/item-detail',
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
        handleSearch() {
            // 搜索
            this.pageChange(1);
        },
        handleOtherSearch(params) {
            // 时间等组件化的搜索
            for (const key in params) {
                this.searchForm[key] = params[key];
            }
            this.pageChange(1);
        },
        handleSearchReset() {
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            this.$refs.TimeSearch.handleReset();
            this.pageChange(1);
        },
        getTableData() {
            Core.Api.Bom.list({
                type: 1, // 1.生产，2.售后
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('Bom.list res', res);
                    this.tableData = res.list;
                    this.total = res.count;
                })
                .catch(err => {
                    console.log('Bom.list err', err);
                });
        },

        // 删除bom
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该BOM表吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Bom.delete({ id })
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

        // 上传文件
        handleFileUpload({ file, fileList }) {
            console.log('handleFileUpload status:', file.status, 'file:', file);
            if (file.status == 'done') {
                let res = file.response;
                if (res && res.code === 0) {
                    return this.$message.success(this.$t('pop_up.uploaded'));
                } else {
                    return this.$message.error('上传失败:' + res.message);
                }
            }
            this.upload.fileList = fileList;
        },
    },
};
</script>

<style lang="less"></style>
