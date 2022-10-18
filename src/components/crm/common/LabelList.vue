<template>
    <a-tag v-for="(label,index) in tableData" class="customer-tag">
        {{ label.label }}
    </a-tag>
</template>

<script>
import Core from '../../../core';
const USER_TYPE = Core.Const.USER.TYPE

export default {
    name: 'LabelList',
    components: {},
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

    }
};
</script>

<style lang="less" scoped>
.LabelList {


}

</style>
