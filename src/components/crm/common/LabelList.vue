<template>
    <div class="customer">
        <div class="tag-area">
            <a-tag
                v-for="(label, index) in tableData"
                color="blue"
                class="customer-tag"
                @close="handleClose(label.id)"
                :closable="true"
            >
                <template #closeIcon><i class="icon i_m_error"></i></template>
                <span class="text-area">{{ lang === 'zh' ? label.label : label.label_en }}</span>
            </a-tag>
        </div>
        <LabelSelect
            class="customer-tag-button"
            :btnText="$t('sl.add')"
            :category="targetType"
            add-customer-btn="true"
            btnType="link"
            @select="handleAddLabelShow"
            :disabled-checked="tableData"
        >
            <i class="icon i_add" />{{ $t('i.addition') }}
        </LabelSelect>
    </div>
</template>

<script>
import Core from '../../../core';
import LabelSelect from '@/components/crm/popup-btn/LabelSelect.vue';

const USER_TYPE = Core.Const.USER.TYPE;

export default {
    name: 'LabelList',
    components: { LabelSelect },
    props: {
        detail: {
            type: Object,
        },
        targetId: {
            type: Number,
            default: 0,
        },
        targetType: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            Core,

            // 表格数据
            tableData: [],
        };
    },
    watch: {
        targetId: {
            deep: true,
            immediate: true,
            handler() {
                this.getLabelList();
            },
        },
    },
    computed: {
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {
        this.getLabelList();
    },
    methods: {
        getLabelList() {
            Core.Api.CRMLabelBind.list({
                target_id: this.targetId,
                target_type: this.targetType,
            }).then(res => {
                this.tableData = res.list;
            });
        },
        handleClose(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该标签吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.CRMLabelBind.delete({ id: id })
                        .then(() => {
                            _this.$message.success('删除成功');
                            _this.getLabelList();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
        handleAddLabelShow(ids, items) {
            Core.Api.CRMLabelBind.saveList({
                target_id: this.targetId,
                target_type: this.targetType,
                label_ids: ids,
            }).then(res => {
                this.getLabelList();
            });
        },
    },
};
</script>

<style lang="less" scoped>
.customer {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    .tag-area {
        max-width: calc(100% - 50px);
        margin-right: 8px;
        display: flex;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .customer-tag {
            display: flex;
            align-items: center;
            max-width: calc((100% - 8px) / 2);
            min-width: 50px;
            .text-area {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
    .customer-tag-button {
        width: 50px;
    }
}
</style>
