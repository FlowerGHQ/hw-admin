<template>
    <div id="MaterialsList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">物料列表</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新建物料</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                         :row-key="record => record.id" :pagination='false' @change="handleTableChange">
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type='link' @click="routerChange('detail', record)"><i class="icon i_detail"/> 详情</a-button>
                            <a-button type="link" @click="routerChange('edit',record)"><i class="icon i_edit"/> 修改</a-button>
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


    </div>
</template>

<script>
import Core from '../../core';
export default {
    components: {},
    props: {},
    data() {
        return {
            // 分页
            current: 1,
            pageSize: 20,
            total: 0,
            tableData: []
        }
    },
    watch: {},
    computed: {
        tableColumns() {
            let { filteredInfo } = this;
            filteredInfo = filteredInfo || {};
            let tableColumns = [
                { title: '物料名称', dataIndex: 'name', key: 'detail' },
                { title: '物料分类', dataIndex: ['category','name'], key: 'item' },
                { title: '物料编码', dataIndex: 'code', key: 'item' },
                { title: '物料包装', dataIndex: 'encapsulation', key: 'item' },
                { title: '规格', dataIndex: 'spec', key: 'item' },
                { title: '供应商编码', dataIndex: 'supplier_code', key: 'item' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time'},
                { title: '操作', key: 'operation', fixed: 'right', width: 180 }
            ]
            return tableColumns
        }
    },
    mounted() {
        this.getTableData()
    },
    methods: {
        getTableData() {
            Core.Api.Material.list({
                page: this.current,
                pageSize: this.pageSize,
            }).then(res => {
                console.log('ProductionOrderlist res', res)
                this.tableData = res.list
                this.total = res.count
            })
        },
        handleDelete(id) {
            let _this = this
            this.$confirm({
                title: '确定要删除该物料吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Material.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });


        },
        routerChange(type, item = {}) {
            switch(type) {
                case 'edit': {
                    let routeUrl = this.$router.resolve({
                        path: "/production/material-edit",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                }; break
                case 'detail': {
                    let routeUrl = this.$router.resolve({
                        path: "/production/material-detail",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                }; break
            }
        }
    },
}
</script>

<style lang='less' scoped>
#MaterialsCategory {

}
</style>
