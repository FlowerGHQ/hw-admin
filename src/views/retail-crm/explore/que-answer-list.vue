<template>
    <div id="answerList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">问题解答</div>
                <div class="btns-area" v-if="$auth('customer.save')">
                    <!--全部导出-->
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
                        <a-button type="primary" ghost class="file-upload-btn"> 全部导出 </a-button>
                    </a-upload>
                    <!--批量导入-->
                    <a-button class="ml-8" type="primary"> 批量导入 </a-button>
                    <!--创建问题解答-->
                    <a-button type="primary" @click="handleCreateQuestion"> 创建问题解答 </a-button>
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="value">
                            <a-input
                                placeholder="搜索区域"
                                v-model:value="searchForm.area"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                        <a-button @click="handleSearch" type="primary">搜索</a-button>
                    </a-col>
                </a-row>
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
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'user'">
                            <img v-if="record.avatar" class="avatar-style" :src="record.avatar" alt="" />
                            <span class="user-name">{{ text || '-' }}</span>
                            <span>{{ record.employee_no }}</span>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="handleEditQuestion(record.id)">
                                <i class="icon i_edit" />
                                编辑
                            </a-button>
                            <a-button type="link" @click="handleDelete(record.id)" class="danger">
                                <i class="icon i_delete" />
                                删除
                            </a-button>
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
            v-model:visible="modalShow"
            :title="current_id ? '问题解答' : '创建问题解答'"
            class="edit-modal"
            :after-close="handleModalClose"
        >
            <div class="modal-form-item">
                <div class="modal-key">问题</div>
                <div class="modal-value">
                    <a-textarea
                        v-model:value="form.question"
                        :auto-size="{ minRows: 6, maxRows: 6 }"
                        placeholder="请输入"
                    />
                </div>
            </div>
            <div class="modal-form-item">
                <div class="modal-key">答案</div>
                <div class="modal-value">
                    <a-textarea
                        v-model:value="form.answer"
                        :auto-size="{ minRows: 6, maxRows: 6 }"
                        placeholder="请输入"
                    />
                </div>
            </div>
            <template #footer>
                <a-button @click="modalShow = false">取消</a-button>
                <a-button @click="handleSubmit" type="primary">确定</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../../core';

export default {
    name: 'answerList',
    components: {},
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            searchForm: {
                area: undefined,
            },
            // 表格
            tableData: [],
            upload: {
                action: Core.Const.NET.URL_POINT + '/admin/1/crm-order/import-shop',
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'xlsx',
                },
            },
            modalShow: false,
            form: {
                question: undefined,
                answer: undefined,
            },
            current_id: undefined,
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            return [
                { title: '序号', dataIndex: 'id', key: 'id' },
                { title: '问题', dataIndex: 'question', key: 'item' },
                { title: '答案', dataIndex: 'answer', key: 'item' },
                { title: '搜索次数', dataIndex: 'search_count', key: 'item' },
                { title: '创建人', dataIndex: 'create_user', key: 'user' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time' },
                { title: '操作', key: 'operation', fixed: 'right' },
            ];
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
        handleSearch() {
            // 搜索
            this.pageChange(1);
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.Customer.list({
                ...this.searchForm,
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
            let _this = this;
            this.$confirm({
                title: this.$t('pop_up.sure_delete'),
                okText: this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {},
            });
        },
        handleCreateQuestion() {
            this.modalShow = true;
        },
        handleEditQuestion(id) {
            this.current_id = id;
            this.modalShow = true;
        },
        // 弹框关闭回调
        handleModalClose() {
            this.form = {
                question: undefined,
                answer: undefined,
            };
            this.current_id = undefined;
        },
        // 提交问题解答
        handleSubmit() {
            this.modalShow = false;
        },
    },
};
</script>

<style lang="less" scoped>
.btns-area {
    .ml-8 {
        margin-left: 8px;
    }
}
.avatar-style {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 8px;
}
.user-name {
    margin-right: 8px;
}
.edit-modal {
    .modal-form-item {
        .modal-key {
            color: #1d2129;
            font-size: 14px;
            margin-bottom: 8px;
        }
    }
}
</style>
