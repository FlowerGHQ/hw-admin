<template>
    <div class="CategoryTree">
        <!-- 
			@expand='handleExpandedChange' 
		 -->
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
            :indentSize="24"
            @expand="handleExpandedChange"
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
    emit: ['change'],
    props: {
        syncId: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            tableData: [],
            tableColumns: [{ title: '分类名称', dataIndex: 'name', width: '100%' }],
            expandedRowKeys: [],
            loading: false,
            selectKeys: '',
        };
    },
    mounted() {
        this.getDataByParent();
    },
    methods: {
        getDataByParent(parent_id = 0) {
            // 通过父节点获取子级数据
            this.loading = true;
            Core.Api.ItemCategory.tree({
                page: 0,
                parent_id: parent_id,
                is_authority: 1,
                depth: 3,
            })
                .then(res => {
                    this.tableData = res?.list ? this.filterChildren(res.list) : [];
                    // this.tableData.forEach(item => {
                    //     if (item.id === 1) {
                    //         this.expandedRowKeys.push(item.id);
                    //     }
                    // });
                })
                .catch(err => {
                    console.log('getDataByParent err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        filterChildren(arr) {
            arr.forEach(item => {
                if (item.has_children && item.children.length > 0) {
                    this.filterChildren(item.children);
                } else {
                    item.children = null;
                }
            });
            return arr;
        },
        handleExpandedChange(expanded, record) {
            if (expanded) {
                this.expandedRowKeys.push(record.id);
            } else {
                this.expandedRowKeys = this.expandedRowKeys.filter(item => item !== record.id);
            }
            console.log(this.expandedRowKeys, 'expandedRowKeys');
        },
        handleSelect(record) {
            if (record.id === this.selectKeys) {
                this.$emit('clickCurrent');
                return;
            }
            this.selectKeys = record.id;
            this.$emit('change', record.id, record.parent_id !== 0 ? this.syncId : '');
        },
        handleReset() {
            this.selectKeys = '';
        },
        // 全部收起
        handleCollapseAll() {
            this.expandedRowKeys = [];
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
                font-size: 14px;
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
