<template>
<div class="CategoryTree">
    <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
        :row-key="record => record.id"  :pagination='false' size="small"
        v-model:expandedRowKeys='expandedRowKeys' :expandRowByClick='true' :expandIconColumnIndex='0'
        @expand='handleExpandedChange' :indentSize='24'>
        <template #bodyCell="{ column, text , record }">
            <template v-if="column.dataIndex === 'name'">
                <div class="name">{{text}}</div>
            </template>
        </template>
    </a-table>
</div>
</template>

<script>
import SimpleImageEmpty from './SimpleImageEmpty.vue'
import Core from '../core';

export default {
    components: {
        SimpleImageEmpty,
    },
    props: {
        parentId: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            tableData: [],
            tableColumns: [{ title: '分类名称', dataIndex: 'name', width: '100%' }],
            expandedRowKeys: [],
        }
    },
    watch: {
        parentId(n) {
            this.getDataByParent(n)
        }
    },
    computed: {},
    mounted() {
        this.getDataByParent(this.parentId)
    },
    methods: {
        getDataByParent(parent_id = 0, parentNode) {  // 通过父节点获取子级数据
            console.log('getDataByParent parent_id:', parent_id, 'parentNode', parentNode)
            this.loading = true;
            Core.Api.ItemCategory.tree({
                page: 0,
                parent_id: parent_id,
            }).then(res => {
                res.list.forEach(item => {
                    item.has_children ? item.children = [] : item.children = null
                });
                console.log('getDataByParent res.list:', res.list)
                if (parent_id === this.parentId) {
                    this.tableData = res.list;
                } else if (parentNode) {
                    parentNode.children = res.list.length ? res.list : null
                }
            }).catch(err => {
                console.log('getDataByParent err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleExpandedChange(expanded, record) {
            console.log('handleExpandedChange expanded:', expanded, 'record', record)
            if (expanded) {
                this.getDataByParent(record.id, record)
                this.expandedRowKeys.push(record.id)
            } else {
                let index = this.expandedRowKeys.indexOf(record.id)
                this.expandedRowKeys.splice(index, 1)
                record.children = []
            }
        },
    },
}
</script>

<style lang='less'>
.CategoryTree {
    .ant-table-thead {
        display: none;
    }
    .ant-table .ant-table-container .ant-table-content table tbody.ant-table-tbody {
        tr.ant-table-row {
            td.ant-table-cell {
                cursor: pointer;
                border-bottom: 0;
                padding-top: 4px;
                padding-bottom: 4px;
                padding-right: 0;
                line-height: 22px;
                font-size: 16px;
                font-weight: 400;
                color: #111111;
                position: relative;
                padding-left: 0px;
                &:hover {
                    background-color: transparent;
                    color: @TC_P;
                }
                .ant-table-row-indent {
                }
                .ant-table-row-expand-icon {
                    margin: 0;
                    position: absolute;
                    right: 0;
                    top: 50%;
                    margin-top: -8px;
                }
                .name {
                    min-width: 0;
                    width: 100%;
                }
            }
            &.ant-table-row-level-0 {
                td.ant-table-cell {
                    padding-top: 9px;
                    padding-bottom: 9px;
                    font-weight: 500;
                }
            }
        }
    }
}
</style>