<template>
    <div id="EntityList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{title + '列表'}}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="handleVehicleShow"><i class="icon i_add"/>{{'新增' + title}}</a-button>
                    <a-upload name="file" class="file-uploader"
                              :file-list="upload.fileList" :action="upload.action"
                              :show-upload-list='false'
                              :headers="upload.headers" :data='upload.data'
                              accept=".xlsx,.xls"
                              @change="handleMatterChange">
<!--                        <a-button type="primary" class="file-upload-btn">
                            <i class="icon i_add"/> 批量导入
                        </a-button>-->
                    </a-upload>
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{title + '名称' + ':'}}</div>
                        <div class="value">
                            <a-input :placeholder="'请输入' +  title  + '名称'" v-model:value="searchForm.name"
                                     @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{title + '编号' + ':'}}</div>
                        <div class="value">
                            <a-input :placeholder="'请输入' +  title  + '编号'" v-model:value="searchForm.code"
                                     @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN')">
                        <div class="key">所属分销商:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.distributor_id" placeholder="请选择所属分销商"
                                      @change="handleSearch">
                                <a-select-option v-for="distributor of distributorList" :key="distributor.id"
                                                 :value="distributor.id">{{ distributor.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="$auth('ADMIN', 'DISTRIBUTOR')">
                        <div class="key">所属零售商:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.agent_id" placeholder="请选择所属零售商" @change='handleSearch'>
                                <a-select-option v-for="agent of agentList" :key="agent.id" :value="agent.id">
                                    {{ agent.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="!$auth('STORE')">
                        <div class="key">所属门店:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.store_id" placeholder="请选择所属门店" @change='handleSearch'>
                                <a-select-option v-for="store of storeList" :key="store.id" :value="store.id">
                                    {{ store.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                        <div class="key">创建时间:</div>
                        <div class="value">
                            <TimeSearch @search="handleTimeSearch" ref='TimeSearch'/>
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">查询</a-button>
                    <a-button @click="handleSearchReset">重置</a-button>
                </div>
            </div>
            <div class="operate-container" v-if="viewType === 'vehicle'">
                <a-button type="primary" @click="handleSetShow" :disabled="!selectedRowKeys.length">批量设置到港时间</a-button>
            </div>
            <div class="table-container">
                <a-table :check-mode='true' :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                    :row-key="record => record.id" :pagination='false' :row-selection="rowSelection"
                    :expandedRowKeys="expandedRowKeys" :indentSize='0'
                    :expandIconColumnIndex="expandIconColumnIndex">
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.key === 'detail'">
                            <a-image class="image" :width="55" :height="55" :src="$Util.imageFilter(record.logo)" fallback='无'/>
                            {{ text || '-' }}
                            <!-- <a-button type="link" @click="routerChange('detail', record)">
                                <div class="ell" style="max-width: 150px">{{ text || '-' }}</div>
                            </a-button> -->
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'attr'">
                            {{ record.attr_desc || ' ' }}
                        </template>
                        <template v-if="column.dataIndex === 'org_name'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.dataIndex === 'org_type'">
                            {{ $Util.userTypeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <template v-if="!record.default_item_id">
                                <a-button type='link' @click="handleVehicleShow(record)"><i class="icon i_edit"/>编辑
                                </a-button>
                                <!-- <a-button type='link' @click="routerChange('detail', record)"><i class="icon i_detail"/>详情
                                </a-button> -->
                            </template>
                            <a-button type='link' @click="handleDelete(record.id)" class="danger"><i
                                class="icon i_delete"/>删除
                            </a-button>
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
        <template class="modal-container">
            <a-modal v-model:visible="vehicleShow" :title="editForm.uid ? title + '编辑' : '新增' + title" class="vehicle-edit-modal"
                     :after-close='handleVehicleClose'>
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">商品编码:</div>
                        <a-input v-model:value="editForm.item_code" placeholder="请输入对应的商品编码"
                                 @blur="handleItemCodeBlur"/>
                        <span v-if="isExist == 1"><i class="icon i_confirm"/></span>
                        <span v-else-if="isExist == 2"><i class="icon i_close_c"/></span>
                    </div>
                    <div class="form-item required">
                        <div class="key">{{ title + '编号'}}</div>
                        <a-input v-model:value="editForm.uid" :placeholder="'请输入' + title + '编号'"/>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="vehicleShow = false">取消</a-button>
                    <a-button @click="handleVehicleSubmit" type="primary">确定</a-button>
                </template>
            </a-modal>
            <a-modal v-model:visible="entityShow" title="批量设置到港时间" class="arrival-time-modal"
                     :after-close='handleEntityClose'>
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">到港时间:</div>
                        <div class="value">
                            <a-date-picker v-model:value="entityForm.arrival_time" valueFormat='YYYY-MM-DD HH:mm:ss'
                                           :show-time="defaultTime" placeholder="请选择到港时间">
                                <template #suffixIcon><i class="icon i_calendar"/></template>
                            </a-date-picker>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="entityShow = false">取消</a-button>
                    <a-button @click="handleEntitySubmit" type="primary">确定</a-button>
                </template>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';
import CategoryTreeSelect from '@/components/popup-btn/CategoryTreeSelect.vue';
import dayjs from "dayjs";

export default {
    name: 'EntityList',
    components: {
        CategoryTreeSelect,
    },
    props: {},
    data() {
        return {
            ITEM_TYPE: Core.Const.ITEM.TYPE,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            distributorList: [],
            agentList: [],
            storeList: [],
            searchForm: {
                name: '',
                code: '',
                category_id: undefined,
                begin_time: '',
                end_time: '',
                distributor_id: undefined,
                agent_id: undefined,
                store_id: undefined,
            },
            // 表格
            tableData: [],
            expandedRowKeys: [],
            expandIconColumnIndex: 0,

            // 上传
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
            // 弹框
            vehicleShow: false,
            isExist: '',
            editForm: {
                id: '',
                uid: '',
                item_code: '',
            },
            selectedRowKeys: [],
            selectedRowItems: [],
            entitySelect: [],
            entityShow: false,
            entityForm: {
                ids: '',
                arrival_time: '',
            },
            viewType: 'vehicle',
            title: '整车'
        };
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(newRoute) {
                let type = newRoute.meta ? newRoute.meta.type : 'vehicle'
                this.viewType = type
                if (type === "part")  {
                    this.title = "零部件"
                } else {
                    this.title = "整车"
                }
                Object.assign(this.searchForm, this.$options.data().searchForm)
                this.pageChange(1)
            }
        },
    },
    computed: {
        tableColumns() {

            let columns = [
                {title: this.title + '名称', dataIndex: ['item', 'name'], key: 'detail'},
                {title: this.title + '编号', dataIndex: 'uid', key: 'item'},
                {title: '规格', dataIndex: 'attr', key: 'attr'},
                {title: '单位类型', dataIndex: 'org_type'},
                {title: '所属单位', dataIndex: 'org_name'},
                {title: '到港日期', dataIndex: 'arrival_time', key: 'time'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '操作', key: 'operation', fixed: 'right', width: 180}
            ]
            return columns
        },
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => { // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys
                    this.selectedRowItems = selectedRows
                    console.log('rowSelection onChange this.selectedRowKeys', this.selectedRowKeys);
                },
            };
        },
    },
    mounted() {
        this.getTableData();
        if (this.$auth('ADMIN')) {
            this.getDistributorListAll();
        }
        if (this.$auth('ADMIN', 'DISTRIBUTOR')) {
            this.getAgentListAll();
        }
        if (!this.$auth('STORE')) {
            this.getStoreListAll();
        }
        // this.getEntityList();
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
        handleTimeSearch(type, begin_time, end_time) { // 时间搜索
            if (begin_time || end_time) {
                this.searchForm.begin_time = begin_time
                this.searchForm.end_time = end_time
            }
            this.pageChange(1);
        },
        handleSearchReset() {  // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.$refs.TimeSearch.handleReset()
            this.pageChange(1);
        },
        getDistributorListAll() {
            Core.Api.Distributor.listAll().then(res => {
                this.distributorList = res.list
            });
        },
        getAgentListAll() {

            Core.Api.Agent.listAll().then(res => {
                this.agentList = res.list
            });
        },
        getStoreListAll() {
            Core.Api.Store.listAll().then(res => {
                this.storeList = res.list
            });
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            let type = this.ITEM_TYPE.COMPONENT;
            if (this.viewType == 'part') {
                type = this.ITEM_TYPE.COMPONENT
            } else {
                type = this.ITEM_TYPE.PRODUCT
            }
            Core.Api.Entity.list({
                ...this.searchForm,
                type: type,
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res:", res)
                let list = res.list.map(entity => {
                    entity.attr_desc = entity.item.attr_list ? entity.item.attr_list.map(i => i.value).join(',') : ''
                    return entity
                })
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

        // 删除
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

        // 弹框 添加、编辑
        handleVehicleShow(record) { // 显示弹框
            this.editForm = {
                id: record.id,
                uid: record.uid,
                item_code: record.item_code,
            }
            this.vehicleShow = true
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
        handleVehicleSubmit() { // 审核提交
            let form = Core.Util.deepCopy(this.editForm)
            if (!form.uid) {
                return this.$message.warning('请输入车架号')
            }
            if (!form.item_code) {
                return this.$message.warning('请输入对应的商品编码')
            }
            if (this.isExist == 2) {
                return this.$message.warning('请输入正确的商品编码')
            }

            let type = this.ITEM_TYPE.COMPONENT;
            if (this.viewType == 'part') {
                type = this.ITEM_TYPE.COMPONENT
            } else {
                type = this.ITEM_TYPE.PRODUCT
            }
            form.type = type
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
        handleItemCodeBlur() {  // 获取 商品编码
            if (!this.editForm.item_code) {
                return this.isExist = ''
            }
            Core.Api.Item.detailByCode({
                code: this.editForm.item_code,
            }).then(res => {
                console.log("handleItemCodeBlur res", res)
                this.isExist = res.detail == null ? 2 : 1
            }).catch(err => {
                console.log('handleItemCodeBlur err', err)
            })
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
        /*getEntityList() {  // 获取 车架列表
            Core.Api.Entity.list({}).then(res => {
                console.log("getEntityList res", res)
                let list = res.list;
                let map = {};
                for (const item of list) {
                    map[item.id] = item.name
                }
                this.entityMap = map;
            }).catch(err => {
                console.log('getEntityList err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },*/
        handleSetShow() {
            this.entityShow = true
        },
        handleEntityClose() {
            this.entityShow = false
            this.entityForm = {
                arrival_time: '',
            }
        },
        handleEntitySubmit() {
            let form = Core.Util.deepCopy(this.entityForm)
            form.arrival_time = form.arrival_time ? dayjs(form.arrival_time).unix() : 0 // 日期转时间戳
            form.ids = this.selectedRowKeys.join(',')
            Core.Api.Entity.batchSave(form).then(res => {
                console.log('handleEntitySubmit res', res)
                this.$message.success('批量设置成功')
                this.handleEntityClose()
                this.getTableData()
                this.selectedRowKeys = []
                this.selectedRowItems = []
            }).catch(err => {
                console.log('handleEntitySubmit err', err)
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

.form-item {
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
                    margin-left: 10px;
                }
            }
        }
    }
}
</style>
