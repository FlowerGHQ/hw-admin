<template>
    <a-tag v-for="(label,index) in tableData" color="blue" class="customer-tag" @close="handleClose(label.id)" :closable="true">
        {{ label.label }}
    </a-tag>
    <LabelSelect :category="targetType" add-customer-btn="true" btnType="link" @select="handleAddLabelShow" :disabled-checked="tableData">
        <i class="icon i_add"/>{{ $t('i.addition') }}
    </LabelSelect>
</template>

<script>
import Core from '../../../core';
import LabelSelect from '@/components/crm/popup-btn/LabelSelect.vue';

const USER_TYPE = Core.Const.USER.TYPE

export default {
    name: 'LabelList',
    components: {LabelSelect},
    props: {
        detail:{
            type: Object,
        },
        targetId: {
            type: Number,
            default: 0
        },
        targetType: {
            type: Number,
            default: 0
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
            }
        }
    },
    computed: {
        lang() {
            return this.$store.state.lang
        },
    },
    mounted() {
        this.getLabelList();
    },
    methods: {
        getLabelList(){
            Core.Api.CRMLabelBind.list({
                target_id: this.targetId,
                target_type: this.targetType
            }).then(res => {
                this.tableData = res.list
            })
        },
        handleClose(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该标签吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.CRMLabelBind.delete({id: id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getLabelList();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        handleAddLabelShow(ids, items) {
            Core.Api.CRMLabelBind.saveList({
                target_id: this.targetId,
                target_type: this.targetType,
                label_ids: ids
            }).then(res => {
                this.getLabelList();
            })
        },

    }
};
</script>

<style lang="less" scoped>
.LabelList {


}

</style>
