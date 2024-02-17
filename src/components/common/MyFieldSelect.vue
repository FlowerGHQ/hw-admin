<template>
    <div
        class="MyFieldSelect field-select"
        @click="handleFieldSelectShow"
        :class="hasTabsSearch ? 'has-tabs-search' : ''"
    >
        <a-tooltip title="选择要显示的字段"><i class="icon i_eyes" /></a-tooltip>
        <a-modal
            v-model:visible="fieldVisible"
            title="请选择要显示的字段"
            class="field-select-modal"
            :width="630"
            :after-close="handleFieldSelectClose"
        >
            <div class="modal-content">
                <a-checkbox-group v-model:value="fieldKeys" :options="fieldList" />
            </div>
            <template #footer>
                <a-button type="primary" @click="handleFieldSelectConfirm">确定</a-button>
                <a-button @click="fieldVisible = false">取消</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../core';
export default {
    components: {},
    props: {
        tableKey: {
            // 表格关键字 表格ID
            type: String,
        },
        tableColumns: {
            // 表格完整的所有的字段
            type: Array,
            default: () => {
                return [];
            },
        },
        necessaryKey: {
            // 表格不能被隐藏掉字段
            type: Array,
            default: () => {
                return [];
            },
        },
        hasTabsSearch: {
            // 有无tab型搜索
            type: Boolean,
            default: false,
        },
    },
    emits: ['change'],
    data() {
        return {
            columns: [], // 实际展示的列

            fieldVisible: false,
            fieldList: [],
            fieldKeys: [],
        };
    },
    watch: {},
    computed: {},
    created() {
        const fieldKeys = Core.Data.getFieldDisplay(this.tableKey) || [];
        if (fieldKeys.length) {
            this.columns = this.tableColumns.filter(item => fieldKeys.includes(item.dataIndex));
        } else {
            this.columns = Core.Util.deepCopy(this.tableColumns);
        }
        console.log('this.columns:', this.columns);
        this.$emit(
            'change',
            this.columns.map(i => i.dataIndex),
            this.columns,
        );
    },
    mounted() {},
    methods: {
        handleFieldSelectShow() {
            this.tableColumns.forEach(item => {
                let target = {
                    label: item.title,
                    value: item.dataIndex,
                    disabled: this.necessaryKey.includes(item.dataIndex),
                    display: this.columns.find(i => i.dataIndex == item.dataIndex),
                };
                this.fieldList.push(target);
                if (target.display) {
                    this.fieldKeys.push(item.dataIndex);
                }
            });
            this.fieldVisible = true;
        },
        handleFieldSelectClose() {
            this.fieldVisible = false;
            this.fieldList = [];
            this.fieldKeys = [];
        },
        handleFieldSelectConfirm() {
            this.columns = this.tableColumns.filter(item => this.fieldKeys.includes(item.dataIndex));

            Core.Data.setFieldDisplay(this.tableKey, this.fieldKeys);
            this.$emit('change', this.fieldKeys, this.columns);
            this.handleFieldSelectClose();
        },
    },
};
</script>

<style lang="less">
.field-select-modal {
    .modal-content {
        .ant-checkbox-group {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            > label.ant-checkbox-wrapper {
                margin: 7px 0;
                box-sizing: border-box;
                display: inline-block;
                width: calc(~'100% / 3');
                padding-left: 24px;
                > span:last-child {
                    display: inline-block;
                    padding-left: 14px;
                    font-size: 14px;
                    color: @TC_DT;
                    text-align: left;
                }
            }
        }
    }
}
</style>
