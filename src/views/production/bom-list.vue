<template>
    <div id="tableData">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">BOM列表</div>
                <div class="btns-area">
                    <a-button type="primary" @click="handleModalOpen()"><i class="icon i_add"/>新建BOM</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                         :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type='link' @click="routerChange('detail', record)"><i class="icon i_detail"/> 详情</a-button>
                            <a-button type="link" @click="handleModalOpen(record)"><i class="icon i_edit"/> 修改</a-button>
                            <a-button type="link" @click="handleDelete(record.id)"><i class="icon i_edit"/> 删除</a-button>
                        </template>
                    </template>
                </a-table>
            </div>

            <div class="paging-container">
                <a-pagination
                    v-model:current="currPage"
                    :page-size='pageSize'
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => `共${total}条`"
                    :hide-on-single-page='false'
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
        </div>

        <a-modal v-model:visible="modalShow" :title="form.id ? title + '编辑' : '新增' + BOM表" class="vehicle-edit-modal"
                 :after-close='handleModalClose'>
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">BOM名称:</div>
                    <div class="value">
                        <a-input v-model:value="form.name" placeholder="请输入BOM名称"/>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">版本:</div>
                    <div class="value">
                        <a-input v-model:value="form.version" placeholder="请输入版本"/>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">版本号:</div>
                    <div class="value">
                        <a-input v-model:value="form.version_num" placeholder="请输入版本号" type="number"/>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="modalShow = false">取消</a-button>
                <a-button @click="handleBomSave" type="primary">确定</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../core'
export default {
    components: {},
    props: {},
    data() {
        return {
            currPage: 1,
            pageSize: 20,
            total: 0,
            tableData: [],
            tableColumns: [
                { title: '名称', dataIndex: 'name', key: 'item' },
                { title: '版本', dataIndex: 'version', key: 'item' },
                { title: '版本号', dataIndex: 'version_num', key: 'item' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time' },
                { title: '更新时间', dataIndex: 'update_time', key: 'time' },
                {title: '操作', key: 'operation', fixed: 'right'}
            ],

            form: {
                name: '',
                version: '',
                version_num: '',
            },
            modalShow: false,
        }
    },
    mounted() {
        this.getTableData()
    },
    methods: {
        getTableData() {
            Core.Api.Bom.list({page: this.currPage, pageSize: this.pageSize})
                .then(res => {
                    console.log('Bom.list res', res)
                    this.tableData = res.list
                    this.total = res.count
                })
                .catch(err => {
                    console.log('Bom.list err', err)
                })
        },
        pageChange() {},
        pageSizeChange() {},
        handleModalClose() {
            this.form = {}
        },
        handleModalOpen(item = {}) {
            if(JSON.stringify(item) != '{}') {
                this.form = {
                    id: item.id,
                    name: item.name,
                    version: item.version,
                    version_num: item.version_num,
                }
            }
            this.modalShow = true
        },
        handleBomSave() {
            let form = Core.Util.deepCopy(this.form)
            console.log('form:', form)
            if (typeof this.checkFormInput(form) === 'function') { return }
            Core.Api.Bom.save(form)
                .then(res => {
                    console.log('Bom.save res', res)
                    this.$message.success('保存成功')
                    this.getTableData()
                })
                .catch(err => {
                    console.log('Bom.save err', err)
                    this.$message.success('保存失败')
                })
                .finally(() => {
                    this.modalShow = false
                })
        },
        // 保存时检查表单输入
        checkFormInput(form) {
            if (!form.name) {
                return this.$message.warning('请输入BOM表名称')
            }
            return 0
        },
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该BOM表吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Bom.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch(type) {
                case 'detail': {
                    routeUrl = this.$router.resolve({
                        path: "/production/bom-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                } break;
            }
        },
    },
    watch: {},
    computed: {},
}
</script>

<style lang='less' scoped>
</style>
