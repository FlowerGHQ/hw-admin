<template>
    <div id="PrintTemplateList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('pt.list') }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="modalShow = true" v-if="$auth('ADMIN') && $auth('file.save')"
                        ><i class="icon i_add" />{{ $t('pt.rule') }}</a-button
                    >
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="8" class="search-item">
                        <div class="key">{{ $t('n.name') }}:</div>
                        <div class="value">
                            <a-input v-model:value="searchForm.name" :placeholder="$t('def.input')" />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('n.type') }}：</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.type" :placeholder="$t('def.select')">
                                <a-select-option v-for="item of TYPE_MAP" :key="item.key" :value="item.value">{{
                                    lang === 'zh' ? item.zh : item.en
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="16" :xxl="16" class="search-item">
                        <div class="key">{{ $t('d.create_time') }}:</div>
                        <div class="value">
                            <TimeSearch @search="handleOtherSearch" ref="TimeSearch" />
                        </div>
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
                >
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'text'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'type'">
                            {{ $Util.printTemplateTypeMapFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <template v-if="$auth('ADMIN')">
                                <a-button type="link" @click="handleUpdate(record)" v-if="$auth('file.save')"
                                    ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                                >
                                <a-button
                                    type="link"
                                    @click="handleDelete(record.id)"
                                    class="danger"
                                    v-if="$auth('file.delete')"
                                    ><i class="icon i_delete" />{{ $t('def.delete') }}</a-button
                                >
                            </template>
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
            <a-modal v-model:visible="modalShow" :title="$t('pt.set_script')" :after-close="closeVisible">
                <div class="form-item required">
                    <div class="key">{{ $t('pt.name') }}：</div>
                    <div class="value" style="width: 100%">
                        <a-input v-model:value="dialogForm.name" :placeholder="$t('pt.enter_product_name')"></a-input>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.type') }}：</div>
                    <div class="value" style="width: 100%">
                        <a-select v-model:value="dialogForm.type" :placeholder="$t('def.select')">
                            <a-select-option v-for="item of TYPE_MAP" :key="item.key" :value="item.value">{{
                                lang === 'zh' ? item.zh : item.en
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item textarea required">
                    <div class="key">{{ $t('pt.script') }}:</div>
                    <div class="value">
                        <a-textarea
                            v-model:value="dialogForm.data"
                            :placeholder="$t('def.input')"
                            :auto-size="{ minRows: 2 }"
                        />
                    </div>
                </div>
                <template #footer>
                    <a-button @click="closeVisible">{{ $t('def.cancel') }}</a-button>
                    <a-button @click="handleSave()" type="primary">{{ $t('def.sure') }}</a-button>
                </template>
            </a-modal>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import TimeSearch from '@/components/common/TimeSearch.vue';

const USER_TYPE = Core.Const.USER.TYPE;
export default {
    name: 'SystemFileList',
    components: {
        TimeSearch,
    },
    props: {},
    data() {
        return {
            USER_TYPE,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            create_time: [],
            TYPE_MAP: Core.Const.SYSTEM.PRINT_TEMPLATE.TYPE_MAP,
            modalShow: false,
            searchForm: {
                type: undefined,
                name: '',
            },
            dialogForm: {
                type: undefined,
                name: '',
                data: '',
            },
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: 'n.name', dataIndex: 'name', key: 'item' },
                { title: 'n.type', dataIndex: 'type', key: 'type' },
                { title: 'd.create_time', dataIndex: 'createTime', key: 'time' },
                { title: 'def.operate', key: 'operation', fixed: 'right' },
            ];
            if (!this.$auth('ADMIN')) {
                columns.splice(1, 1);
            }
            return columns;
        },
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/system/system-file-edit',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
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
            // 获取 表格 数据
            this.loading = true;
            Core.Api.PrintTemplate.list({
                ...this.searchForm,
                begin_time: this.create_time[0] || '',
                end_time: this.create_time[1] || '',
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.total = res.count;
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        handleDelete(id) {
            // 删除该文件
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.PrintTemplate.delete({ id })
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
        handleUpdate(item) {
            this.modalShow = true;
            this.dialogForm = Core.Util.deepCopy(item);
        },
        closeVisible() {
            this.modalShow = false;
            this.dialogForm = {
                id: 0,
                name: '',
                data: '',
            };
        },
        handleSave() {
            if (!this.dialogForm.name) {
                return this.$message.warning(this.$t('pt.enter_product_name'));
            }
            if (!this.dialogForm.data) {
                return this.$message.warning(this.$t('pt.enter_script'));
            }
            Core.Api.PrintTemplate.save({
                ...this.dialogForm,
            }).then(res => {
                this.$message.success(this.$t('pop_up.save_success'));
                this.getTableData();
                this.closeVisible();
            });
        },
    },
};
</script>

<style lang="less" scoped>
// #PrintTemplateList {}
</style>
