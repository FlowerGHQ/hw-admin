<template>
    <div>
        <div class="form-item ">
            <div class="value">
                <a-button type="primary" v-if="$auth('customer.detail')" @click="addMan">
                    <slot>{{ $t('crm_st.add_man') }}</slot>
                </a-button>
            </div>
        </div>
        <a-table :columns="tableColumns" :data-source="manList" :scroll="{ x: true }" :row-key="record => record.id"
            :pagination='false' @change="getTableDataSorter" style="margin-bottom: 10px;">
            <template #headerCell="{ title }">
                {{ $t(title) }}
            </template>
            <template #bodyCell="{ column, text, record }">
                <!--                        <template v-if="column.key === 'detail'">
                                                <a-tooltip placement="top" :title='text'>
                                                     <a-button type="link" @click="routerChange('detail', record)">{{text || '-'}}</a-button>
                                                </a-tooltip>
                                            </template>-->
                <template v-if="column.key === 'money'">
                    {{ text / 100 || '-' }}
                </template>
                <template v-if="column.key === 'item'">
                    {{ text || '-' }}
                </template>
                <template v-if="column.key === 'status'">
                    {{ groupStatusTableData[text] !== undefined ? lang === 'zh' ? groupStatusTableData[text].zh :
                        groupStatusTableData[text].en : "" }}
                </template>
                <template v-if="column.key === 'time'">
                    {{ $Util.timeFilter(text) }}
                </template>
                <template v-if="column.key === 'estimated_deal_time'">
                    {{ $Util.timeFilter(text, 3) }}
                </template>

                <template v-if="column.key === 'operation'">
                    <a-button type="link" @click="routerChange('detail', record)" v-if="$auth('customer.detail')">{{
                        $t('def.see') }}</a-button>
                    <a-button type="link" class="danger" @click="routerChange('delete', record)">{{
                        $t('def.remove') }}</a-button>
                    <!--                        <a-button type="link" @click="handleDelete(record.id)" class="danger" v-if="$auth('customer.delete')"><i class="icon i_delete"/> {{ $t('def.delete') }}</a-button>-->
                </template>
            </template>
        </a-table>
        <addStorePeo v-if="isShow" :isShow="isShow" @Cancel="addStorePeoClose" :isMan="true" @save="saveMan" />
    </div>
</template>
<script>
import Core from '../../../core';
import addStorePeo from "./addStorePeo.vue"

export default {

    name: 'CrmEditStorePeo',
    components: {
        addStorePeo
    },
    props: {
        detail: {
            type: Object,
        },
        id: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            isShow: false,
            manList: []
        }
    },
    watch: {
        manList: {

            deep: true,
            immediate: true,
            handler(value) {
                if(value.length){
                    this.$emit('userid',value[0].id)
                }else {
                    this.$emit('userid','')
                }
            }
        }
    },
    computed: {
        tableColumns() {
            let columns = [
                { title: 'n.name', dataIndex: 'name', key: 'name' },
                { title: 'crm_st.Work_status', dataIndex: 'store_user_status', key: 'store_user_status' },
                { title: 'n.phone', dataIndex: 'phone', key: 'phone' },
                { title: 'crm_st.office', dataIndex: 'store_user_type', key: 'store_user_type' },
                { title: 'crm_st.bound_thread', dataIndex: 'estimated_deal_time', key: 'estimated_deal_time' },
                { title: 'crm_st.job_time', dataIndex: 'estimated_deal_time', key: 'estimated_deal_time' },
                { title: 'def.operate', key: 'operation', fixed: 'right' },
            ]
            return columns
        },
        lang() {
            return this.$store.state.lang
        }
    },
    mounted() {

    },
    methods: {

        addMan() {
            if (this.manList.length) {
                this.$message.warning(this.$t('retail.max_man_message'))
            } else {
                this.isShow = true;
            }
        },
        addStorePeoClose(data) {
            this.isShow = false;
            console.log('data', data, this.isShow);
        },
        saveMan(data) {
            console.log('saveMan', data);
            this.manList = data;
        },

        routerChange(type, item = {}) {
            console.log(item)
            let routeUrl = ''
            switch (type) {
                case 'delete':    // 删除店长
                    /* routeUrl = this.$router.resolve({
                        path: "/system/user-edit",
                        query: {
                            id: item.id,
                            org_id: this.orgId,
                            org_type: this.orgType,
                            type: this.type,
                        }
                    })
                    window.open(routeUrl.href, '_self') */
                    if (!this.id) {
                        this.manList = [];
                    } else {
                        // 编辑页面-请求移出店长
                        console.log('请求移出店长');
                    }
                    break;
                case 'detail':    // 详情
                    // routeUrl = this.$router.resolve({
                    //     path: "/system/user-detail",
                    //     query: {id: item.id}
                    // })
                    // window.open(routeUrl.href, '_blank')
                    break;
            }
        },
    }

}

</script>

<style lang="less" scoped></style>

