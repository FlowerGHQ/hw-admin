<template>
    <div class="CategoryTree">
        <a-table
            :loading="loading"
            :columns="tableColumns"
            :data-source="tableData"
            :scroll="{ x: true }"
            :row-key="record => record.id"
            :pagination="false"
            size="small"
            v-model:expandedRowKeys="expandedRowKeys"
            :expandRowByClick="true"
            :expandIconColumnIndex="0"
            @expand="handleExpandedChange"
            :indentSize="24"
        >
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'name'">
                    <div class="name" :class="record.id === selectKeys ? 'active' : ''" @click="handleSelect(record)">
                        {{ $i18n.locale == 'zh' ? record.name : record.name_en }}
                    </div>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script>
import SimpleImageEmpty from '@/components/common/SimpleImageEmpty.vue';
import Core from '../../../core';

export default {
    components: {
        SimpleImageEmpty,
    },
    props: {
        parentId: {
            type: Number,
            default: 0,
        },
    },
    emit: ['change'],
    data() {
        return {
            tableData: [],
            tableColumns: [{ title: '分类名称', dataIndex: 'name', width: '100%' }],
            expandedRowKeys: [],
            loading: false,
            selectKeys: '',
        };
    },
    watch: {
        parentId(n) {
            console.log('parentId:', n);
            this.getDataByParent(n);
            this.selectKeys = '';
        },
    },
    computed: {},
    mounted() {
        this.getDataByParent(this.parentId);
    },
    methods: {
        getDataByParent(parent_id = 0, parentNode) {
            // 通过父节点获取子级数据
            this.loading = true;
            Core.Api.ItemCategory.tree({
                page: 0,
                parent_id: parent_id,
                is_authority: 1,
                depth: 3,
            })
                .then(res => {
                    res.list.forEach(item => {
                        item.has_children ? (item.children = []) : (item.children = null);
                    });
                    console.log('getDataByParent res.list:', res.list);
                    if (parent_id === this.parentId) {
                        this.tableData = res.list;
                    } else if (parentNode) {
                        parentNode.children = res.list.length ? res.list : null;
                    }
                })
                .catch(err => {
                    console.log('getDataByParent err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleExpandedChange(expanded, record) {
            console.log('expanded, record:', expanded, record);
            if (expanded) {
                this.getDataByParent(record.id, record);
                this.expandedRowKeys.push(record.id);
            } else {
                let index = this.expandedRowKeys.indexOf(record.id);
                this.expandedRowKeys.splice(index, 1);
            }
        },

        handleSelect(record) {
            if (record.id === this.selectKeys) {
                this.$emit('clickCurrent');
                return;
            }
            this.selectKeys = record.id;
            this.$emit('change', record.id);
        },

        handleReset() {
            this.selectKeys = '';
        },
    },
};
</script>

<style lang="less">
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
                .ant-table-row-expand-icon {
                    margin: 0;
                    position: absolute;
                    right: 0;
                    top: 50%;
                    left: calc(~'100% - 22px');
                }
                .name {
                    min-width: 0;
                    width: 100%;
                    &.active {
                        color: @TC_P;
                    }
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
