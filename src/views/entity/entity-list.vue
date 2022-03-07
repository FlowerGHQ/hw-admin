<template>
    <div id="EntityList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">车架列表</div>
                <div class="btns-area">
                    <a-button type="primary" @click="handleVehicleShow"><i class="icon i_add"/>新增车架</a-button>
                    <a-upload name="file" class="file-uploader"
                              :file-list="upload.fileList" :action="upload.action"
                              :show-upload-list='false'
                              :headers="upload.headers" :data='upload.data'
                              accept=".xlsx,.xls"
                              @change="handleMatterChange">
                        <a-button type="primary" class="file-upload-btn">
                            <i class="icon i_add"/> 批量导入
                        </a-button>
                    </a-upload>
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">车架名称:</div>
                        <div class="value">
                            <a-input placeholder="请输入车架名称" v-model:value="searchForm.name"
                                     @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">车架号:</div>
                        <div class="value">
                            <a-input placeholder="请输入车架号" v-model:value="searchForm.code"
                                     @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                        <div class="key">创建时间:</div>
                        <div class="value">
                            <a-range-picker v-model:value="create_time" valueFormat='X' @change="handleSearch"
                                            :show-time="defaultTime" :allow-clear='false'>
                                <template #suffixIcon><i class="icon i_calendar"></i></template>
                            </a-range-picker>
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">查询</a-button>
                    <a-button @click="handleSearchReset">重置</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                         :row-key="record => record.id" :pagination='false' @change="handleTableChange"
                         :expandedRowKeys="expandedRowKeys" :indentSize='0'
                         :expandIconColumnIndex="expandIconColumnIndex">
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.key === 'detail'">
                            <div class="table-img">
                                <a-image class="image" :width="55" :height="55" :src="$Util.imageFilter(record.logo)"
                                         fallback='无'/>
                                <a-tooltip placement="top" :title='text' destroy-tooltip-on-hide>
                                        <a-button type="link" @click="routerChange('detail', record)">
                                            <div class="ell" style="max-width: 150px">{{ text || '-' }}</div>
                                        </a-button>
                                </a-tooltip>
                            </div>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'attr'">
                            {{ record.attr_desc || ' ' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <template v-if="!record.default_item_id">
                                <a-button type='link' @click="handleVehicleShow(record)"><i class="icon i_edit"/> 编辑
                                </a-button>
                                <a-button type='link' @click="routerChange('detail', record)"><i class="icon i_detail"/>
                                    详情
                                </a-button>
                            </template>
                            <a-button type='link' @click="handleDelete(record.id)" class="danger"><i
                                class="icon i_delete"/> 删除
                            </a-button>
                        </template>
                    </template>
                    <!-- <template #expandedRowRender="{ record }">
                    </template> -->
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
        <template class="modal-container">
            <a-modal v-model:visible="vehicleShow" :title="editForm.uid ? '车架编辑' : '新增车架'" class="refund-edit-modal"
                     :after-close='handleVehicleClose'>
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">车架号:</div>
                        <a-input v-model:value="editForm.uid" placeholder="请输入车架号"/>
                    </div>
                    <div class="form-item required">
                        <div class="key">商品编码:</div>
                        <a-input v-model:value="editForm.item_code" placeholder="请输入对应的商品编码" @blur="onblur"/>
                        <span v-if="isExist === true"><i class="icon i_confirm"/></span>
                        <span v-else-if="isExist === false"><i class="icon i_close_c"/></span>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="vehicleShow = false">取消</a-button>
                    <a-button @click="handleVehicleSubmit" type="primary">确定</a-button>
                </template>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';
import CategoryTreeSelect from '@/components/popup-btn/CategoryTreeSelect.vue';

export default {
    name: 'EntityList',
    components: {
        CategoryTreeSelect,
    },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            create_time: [],
            filteredInfo: null,
            searchForm: {
                name: '',
                code: '',
                category_id: undefined,
            },

            // 表格
            tableData: [],
            expandedRowKeys: [],
            expandIconColumnIndex: 0,
            form: {
                name: '',
                path: '',
                type: ''
            },
            upload: {
                action: Core.Const.NET.FILE_UPLOAD_ACTION,
                fileList: [],
                headers: {
                    ContentType: false
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'xlsx',
                },
            },
            isExist: '',
            vehicleShow: false,
            editForm: {
                id: '',
                uid: '',
                item_code: '',
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                {title: '车架名称', dataIndex: ['item', 'name'], key: 'detail'},
                {title: '车架号', dataIndex: 'uid', key: 'item'},
                {title: '规格', key: 'attr'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                // { title: '商品状态', dataIndex: 'status' },
                {title: '操作', key: 'operation', fixed: 'right', width: 180}
            ]
            return columns
        }
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log('routerChange item:', item)
            let routeUrl = ''
            switch (type) {
                case 'detail':  // 车架详情
                    routeUrl = this.$router.resolve({
                        path: "/item/item-detail",
                        query: {id: item.default_item_id || item.id, set_id: item.set_id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
        },
        // 上传文件
        handleMatterChange({file, fileList}) {
            console.log("handleMatterChange status:", file.status, "file:", file)
            if (file.status == 'done') {
                if (file.response && file.response.code < 0) {
                    return this.$message.error(file.response.message)
                } else {
                    return this.$message.success('上传成功');
                }
            }
            this.upload.fileList = fileList
        },
        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {  // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        handleSearch() {  // 搜索
            this.pageChange(1);
        },
        handleSearchReset() {  // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.create_time = []
            this.pageChange(1);
        },
        handleTableChange(page, filters, sorter) {
            console.log('handleTableChange filters:', filters)
            this.filteredInfo = filters;
            for (const key in filters) {
                this.searchForm[key] = filters[key] ? filters[key][0] : 0
            }
            this.pageChange(1);
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            let flag_spread = 0
            if (this.searchForm.name !== '' || this.searchForm.code !== '') {
                flag_spread = 1
            }
            Core.Api.Entity.list({
                ...this.searchForm,
                flag_spread: flag_spread,
                begin_time: this.create_time[0] || '',
                end_time: this.create_time[1] || '',
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res:", res)
                let list = res.list.map(entity => {
                    entity.attr_desc = entity.item.attr_list ? entity.item.attr_list.map(i => i.value).join(',') : ''
                    return entity
                })
                if (flag_spread == 1) {
                    this.expandIconColumnIndex = -1
                } else {
                    this.expandIconColumnIndex = 0
                }
                console.log("res.list", res.list)
                this.total = res.count;
                this.tableData = list;
            }).catch(err => {
                console.log('getTableData err:', err)
            }).finally(() => {
                this.loading = false;
                this.expandedRowKeys = []
            });
        },

        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该商品吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Entity.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },

        handleVehicleShow(record) { // 显示弹框
            this.vehicleShow = true
            this.editForm = {
                id: record.id,
                uid: record.uid,
                item_code: record.item_code,
            }
        },
        handleVehicleClose() { // 关闭弹框
            this.vehicleShow = false
            this.isExist = ''
            this.editForm = {
                id: '',
                uid: '',
                item_code: '',
            }
        },
        onblur() {  // 获取 商品编码
            if (!this.editForm.item_code) {
                return this.isExist = ''
            }
            Core.Api.Item.detailByCode({
                code: this.editForm.item_code,
            }).then(res => {
                this.isExist = res.detail != null
                console.log("onblur res", res)
            }).catch(err => {
                console.log('onblur err', err)
            }).finally(() => {
            });
        },
        handleVehicleSubmit() { // 审核提交
            let form = Core.Util.deepCopy(this.editForm)
            if (!form.uid) {
                return this.$message.warning('请输入车架号')
            }
            if (!form.item_code) {
                return this.$message.warning('请输入对应的商品编码')
            }
            if (this.isExist === false) {
                return this.$message.warning('请输入正确的商品编码')
            }
            Core.Api.Entity.save(form).then(res => {
                console.log('handleRefundSubmit res', res)
                this.handleVehicleClose()
                this.getTableData()
            }).catch(err => {
                console.log('handleRefundSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
    }
};
</script>

<style lang="less">
#EntityList {
    .ant-btn.ant-btn-link {
        line-height: 22px;
        margin-left: 8px;
    }
}

.form-item:last-child {
    .fac();

    .ant-input {
        width: calc(~'100% - 24px');
    }

    i.icon {
        display: inline-block;
        width: 24px;
        text-align: right;
    }

    .i_confirm {
        color: @green;
        font-size: 18px;
    }

    .i_close_c {
        color: @red;
        font-size: 18px;
    }
}
</style>
<style lang="less" scoped>
#EntityList {
    .list-container {
        .title-container {
            .btns-area {
                .file-upload-btn {
                    margin-left: 15px;
                }
            }
        }
    }
}
</style>
