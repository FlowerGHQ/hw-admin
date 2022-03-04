<template>
<div id="ItemList">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">商品列表</div>
            <div class="btns-area">
                <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新增商品</a-button>
                <a-upload name="file" class="file-uploader"
                          :file-list="upload.fileList" :action="upload.action"
                          :show-upload-list='false'
                          :headers="upload.headers" :data='upload.data'
                          accept=".xlsx,.xls"
                          @change="handleMatterChange">
                    <a-button type="primary"  class="file-upload-btn">
                        <i class="icon i_add"/> 批量导入
                    </a-button>
                </a-upload>
            </div>
        </div>
        <div class="search-container">
            <a-row class="search-area">
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">商品名称:</div>
                    <div class="value">
                        <a-input placeholder="请输入商品名称" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">商品编码:</div>
                    <div class="value">
                        <a-input placeholder="请输入商品编码" v-model:value="searchForm.code" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">商品分类:</div>
                    <div class="value">
                        <CategoryTreeSelect @change="handleCategorySelect" :category-id='searchForm.category_id' />
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                    <div class="key">创建时间:</div>
                    <div class="value">
                        <a-range-picker v-model:value="create_time" valueFormat='X' @change="handleSearch" :show-time="defaultTime" :allow-clear='false'>
                            <template #suffixIcon><i class="icon i_calendar"></i> </template>
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
                @expand='handleTableExpand' :expandedRowKeys="expandedRowKeys" :indentSize='0' :expandIconColumnIndex="expandIconColumnIndex">
                <template #bodyCell="{ column, text , record }">
                    <template v-if="column.key === 'detail'">
                        <div class="table-img afs">
                            <a-image class="image" :width="55" :height="55" :src="$Util.imageFilter(record.logo)" fallback='无'/>
                            <a-tooltip placement="top" :title='text' destroy-tooltip-on-hide>
                                <div class="info">
                                    <a-button type="link" @click="routerChange('detail', record)">
                                        <div class="ell" style="max-width: 150px">{{ text || '-' }}</div>
                                    </a-button>
                                    <p class="sub-info">{{record.attr_desc || ' '}}</p>
                                </div>
                            </a-tooltip>
                        </div>
                    </template>
                    <template v-if="column.key === 'item'">
                        {{ text || '-'}}
                    </template>
                    <template v-if="column.key === 'money'">
                        €{{$Util.countFilter(text)}}
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <div class="status status-bg status-tag" :class="text ? 'primary' : 'grey'">
                            {{text ? '已上架' : '未上架'}}
                        </div>
                    </template>

                    <template v-if="column.key === 'tip_item'">
                        <a-tooltip placement="top" :title='text'>
                            <div class="ell" style="max-width: 160px">{{text || '-'}}</div>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'operation'">
                        <template v-if="!record.default_item_id">
                            <a-button type='link' @click="routerChange('edit', record)"><i class="icon i_edit"/> 编辑</a-button>
                            <a-button type='link' @click="routerChange('detail', record)"><i class="icon i_detail"/> 详情</a-button>
                        </template>
                        <a-button type='link' @click="handleDelete(record.id)" class="danger"><i class="icon i_delete"/> 删除</a-button>
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
</div>
</template>

<script>
import Core from '../../core';
import CategoryTreeSelect from '@/components/popup-btn/CategoryTreeSelect.vue';

export default {
    name: 'ItemList',
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
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: '商品名称', dataIndex: 'name', key: 'detail' },
                { title: '商品分类', dataIndex: ['category','name'], key: 'item' },
                { title: '商品型号', dataIndex: 'model', key: 'item' },
                { title: '商品编码', dataIndex: 'code', key: 'item' },
                { title: '成本价格', dataIndex: 'original_price', key: 'money' },
                { title: '建议零售价', dataIndex: 'price', key: 'money' },
                { title: '工时费', dataIndex: 'price', key: 'money' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time'},
                // { title: '商品状态', dataIndex: 'status' },
                { title: '操作', key: 'operation', fixed: 'right', width: 180 }
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
                case 'detail':  // 商品详情
                    routeUrl = this.$router.resolve({
                        path: "/item/item-detail",
                        query: { id: item.default_item_id || item.id, set_id: item.set_id }
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'edit':  // 商品编辑
                    routeUrl = this.$router.resolve({
                        path: "/item/item-edit",
                        query: { id: item.default_item_id || item.id, set_id: item.set_id }
                    })
                    window.open(routeUrl.href, '_self')
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
        handleCategorySelect(val) {
            this.searchForm.category_id = val
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
            Core.Api.Item.list({
                ...this.searchForm,
                flag_spread: flag_spread,
                begin_time: this.create_time[0] || '',
                end_time: this.create_time[1] || '',
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res:", res)
                let list = res.list.map(item => {
                    item.attr_desc = item.attr_list ? item.attr_list.map(i => i.value).join(',') : ''
                    return item
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
                    Core.Api.Item.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },

        // 表格行展开-查看同规格商品
        handleTableExpand(expanded, record) {
            if (expanded) {
                if (record.device_ports) {
                    this.expandedRowKeys.push(record.id)
                } else {
                    Core.Api.Item.listBySet({set_id: record.set_id}).then(res => {
                        console.log('handleTableExpand res:', res)
                        let list = res.list.filter(i => i.flag_default !== 1)
                        let mainItem = res.list.find(i => i.flag_default === 1)
                        list.forEach(item => {
                            item.attr_desc = item.attr_list.map(i => i.value).join(',')
                            item.default_item_id = mainItem.id
                        })
                        record.children = list
                        record.attr_desc = mainItem.attr_list.map(i => i.value).join(',')
                    }).finally(() => {
                        this.expandedRowKeys.push(record.id)
                    })
                }
            } else {
                let index = this.expandedRowKeys.indexOf(record.id)
                this.expandedRowKeys.splice(index, 1)
            }
        }
    }
};
</script>

<style lang="less">
#ItemList {
    .ant-table-row-level-1 {
        td.ant-table-cell {
            background: #F7F8FA;
        }
    }
}
</style>
<style lang="less" scoped>
#ItemList {
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
