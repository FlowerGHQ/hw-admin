<template>
    <div id="MaterialsList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('m.material_list') }}</div>
                <div class="btns-area">
                    <a-button class="export-btn" type="primary" @click="handleExportConfirm"
                        ><i class="icon i_download" />{{ $t('def.export') }}</a-button
                    >
                    <a-upload
                        name="file"
                        class="file-uploader"
                        :file-list="upload.fileList"
                        :action="upload.action"
                        :show-upload-list="false"
                        :headers="upload.headers"
                        :data="upload.data"
                        accept=".xlsx,.xls"
                        @change="handleMatterChange"
                    >
                        <a-button type="primary" ghost class="file-upload-btn" v-if="$auth('material.import-export')">
                            <i class="icon i_add" /> {{ $t('m.import') }}
                        </a-button>
                    </a-upload>
                    <a-button type="primary" @click="routerChange('edit')" v-if="$auth('material.save')"
                        ><i class="icon i_add" />{{ $t('m.new_material') }}</a-button
                    >
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('m.material_name') }}:</div>
                        <div class="value">
                            <a-input
                                v-model:value="searchForm.name"
                                :placeholder="$t('n.enter') + $t('m.material_name')"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('m.material_category') }}:</div>
                        <div class="value">
                            <CategoryTreeSelect
                                @change="handleCategorySelect"
                                :category="item_category"
                                :category-id="searchForm.category_id"
                                :placeholder="$t('n.choose') + $t('m.material_category')"
                                type="material"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('m.material_code') }}:</div>
                        <div class="value">
                            <a-input
                                v-model:value="searchForm.code"
                                :placeholder="$t('n.enter') + $t('m.material_code')"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="8" class="search-item">
                        <div class="key">{{ $t('def.create_time') }}:</div>
                        <div class="value"><TimeSearch @search="handleOtherSearch" ref="TimeSearch" /></div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                    :loading="loading"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail' && $auth('material.detail')">
                            <!--<a-tooltip placement="top" :title='text'>
                                    <a-button type="link" @click="routerChange('detail', record)">{{ text || '-' }}
                                </a-button>
                            </a-tooltip>-->
                            <div class="table-img">
                                <a-image
                                    class="image"
                                    :width="30"
                                    :height="30"
                                    :src="$Util.imageFilter(record.image)"
                                    :fallback="$t('def.none')"
                                />
                                <a-tooltip placement="top" :title="text">
                                    <a-button
                                        type="link"
                                        @click="routerChange('detail', record)"
                                        style="margin-left: 6px"
                                        >{{ lang == 'zh' ? record.name : record.name_en }}</a-button
                                    >
                                </a-tooltip>
                            </div>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'category'">
                            {{
                                $i18n.locale === 'zh'
                                    ? record?.category?.name
                                    : record?.category?.name_en
                                      ? record?.category?.name_en
                                      : record?.category?.name
                            }}
                        </template>
                        <template v-if="column.key === 'gross_weight'">
                            {{ $Util.countFilter(text) }}
                        </template>
                        <template v-if="column.key === 'spec'">
                            <a-tooltip placement="top" :title="text">
                                <div class="ell" style="max-width: 120px">
                                    {{ text || '-' }}
                                </div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button
                                type="link"
                                @click="routerChange('detail', record)"
                                v-if="$auth('material.detail')"
                                ><i class="icon i_detail" />{{ $t('def.detail') }}</a-button
                            >
                            <a-button type="link" @click="routerChange('edit', record)" v-if="$auth('material.save')"
                                ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                            >
                            <a-button
                                type="link"
                                @click="handleDelete(record.id)"
                                class="danger"
                                v-if="$auth('material.delete')"
                                ><i class="icon i_delete" />{{ $t('def.delete') }}</a-button
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
    </div>
</template>

<script>
import Core from '../../core';
import CategoryTreeSelect from '../../components/popup-btn/CategoryTreeSelect.vue';
import TimeSearch from '@/components/common/TimeSearch.vue';
export default {
    components: {
        CategoryTreeSelect,
        TimeSearch,
    },
    props: {},
    data() {
        return {
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            searchForm: {
                category_id: undefined,
                name: undefined,
                code: undefined,
            },
            item_category: {},

            tableData: [],
            // 上传
            upload: {
                action: Core.Const.NET.URL_POINT + '/admin/1/material/import',
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'xlsx',
                },
            },
            // 导出
            exportDisabled: false,
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang;
        },
        tableColumns() {
            let columns = [
                { title: this.$t('m.material_name'), dataIndex: 'name', key: 'detail' },
                { title: this.$t('m.material_category'), dataIndex: ['category', 'name'], key: 'category' },
                { title: this.$t('m.material_code'), dataIndex: 'code', key: 'item' },
                { title: this.$t('m.spec'), dataIndex: 'spec', key: 'spec' },
                { title: this.$t('m.unit'), dataIndex: 'unit', key: 'item' },
                { title: this.$t('m.package'), dataIndex: 'encapsulation', key: 'item' },
                { title: this.$t('m.size'), dataIndex: 'encapsulation_size', key: 'item' },
                { title: this.$t('m.weight'), dataIndex: 'gross_weight', key: 'gross_weight' },
                { title: this.$t('m.boxes'), dataIndex: 'pack_count', key: 'pack_count' },
                { title: this.$t('m.color'), dataIndex: 'color', key: 'item' },
                { title: this.$t('def.remark'), dataIndex: 'remark', key: 'spec' },
                { title: this.$t('def.create_time'), dataIndex: 'create_time', key: 'time' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right', width: 180 },
            ];
            return columns;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            switch (type) {
                case 'edit':
                    {
                        let routeUrl = this.$router.resolve({
                            path: '/production/material-edit',
                            query: { id: item.id },
                        });
                        window.open(routeUrl.href, '_self');
                    }
                    break;
                case 'detail':
                    {
                        let routeUrl = this.$router.resolve({
                            path: '/production/material-detail',
                            query: { id: item.id },
                        });
                        window.open(routeUrl.href, '_self');
                    }
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
        handleCategorySelect(val) {
            this.searchForm.category_id = val;
            this.pageChange(1);
        },
        handleSearchReset() {
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            this.$refs.TimeSearch.handleReset();
            this.pageChange(1);
        },
        getTableData() {
            this.loading = true;
            Core.Api.Material.list({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('ProductionOrderlist res', res);
                    this.tableData = res.list;
                    this.total = res.count;
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('m.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.Material.delete({ id })
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
        handleMatterChange({ file, fileList }) {
            console.log('handleMatterChange status:', file.status, 'file:', file);
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message);
                    this.getTableData();
                } else {
                    return this.$message.success(this.$t('pop_up.uploaded'));
                    this.getTableData();
                }
            }
            this.upload.fileList = fileList;
        },
        handleExportConfirm() {
            // 确认物料是否导出
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure') + _this.$t('n.export') + '?',
                okText: _this.$t('def.sure'),
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    _this.handleMaterialExport();
                },
            });
        },
        handleMaterialExport() {
            // 物料导出
            this.exportDisabled = true;
            let form = Core.Util.deepCopy(this.searchForm);
            for (const key in form) {
                form[key] = form[key] || '';
            }
            let exportUrl = Core.Api.Export.materialExport({
                ...form,
                language: this.$i18n.locale === 'en' ? 1 : 0,
            });
            console.log('handleMaterialExport exportUrl', exportUrl);
            window.open(exportUrl, '_blank');
            this.exportDisabled = false;
        },
    },
};
</script>

<style lang="less" scoped>
#MaterialsList {
    .list-container {
        .title-container {
            .btns-area {
                .export-btn {
                    margin-right: 15px;
                }
                .file-uploader {
                    margin-right: 15px;
                }
            }
        }
    }
}
</style>
