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
                <!--  <template v-if="column.key === 'detail'">
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

        <div class="paging-container" v-if="!isMan">
            <a-pagination v-model:current="currPage" :page-size="pageSize" :total="total" show-quick-jumper
                show-size-changer show-less-items :show-total="(total) => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                :hide-on-single-page="false" :pageSizeOptions="['10', '20', '30', '40']" @change="pageChange"
                @showSizeChange="pageSizeChange" />
        </div>
        <addStorePeo v-if="isShow" :isShow="isShow" @Cancel="addStorePeoClose" :isMan="isMan" @save="saveMan" />
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
        // 是否是：店长列表展示（添加店长）
        isMan: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isShow: false,
            manList: [],

            currPage: 1,
            pageSize: 20,
            total: 0,
        }
    },
    watch: {
        manList: {

            deep: true,
            immediate: true,
            handler(value) {
                if (value) {
                    this.$emit('userid', value[0]?.id)
                } else {
                    this.$emit('userid', '')
                }
                /* if (oldValue === newValue) {
                    this.currPage = 1;
                    this.pageSize = 20;
                } */
            }
        },
        id(value) {
            if (value) {
                console.log('id', this.id);
                this.getTableData();
            }
        },
        $route: {
            deep: true,
            immediate: true,
            handler() {
                // 这两句刷新页面的时候，页数在之前的页数
                this.currPage = Core.Data.getItem("currPage")
                    ? Core.Data.getItem("currPage")
                    : 1;
                this.pageSize = Core.Data.getItem("pageSize")
                    ? Core.Data.getItem("pageSize")
                    : 20;
                // this.getTableData();
                // this.handleSearchReset(false);
                // this.getUserData();
            },
        },
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
                    /*  if (!this.id) { */
                    this.manList = [];
                    /*  } else {
                         // 编辑页面-请求移出店长
                         console.log('请求移出店长');
                     } */
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

        // 分页
        pageChange(curr) {  // 页码改变
            console.log('pageChange-------', curr);
            this.currPage = curr;
            this.getTableData();
        },
        pageSizeChange(current, size) {  // 页码尺寸改变
            console.log('pageSizeChange size--------:', current, size)
            this.pageSize = size;
            this.getTableData();
        },
        getTableData() {

            let type;
            this.isMan ? type = 4 : type = '';
            Core.Api.RETAIL.storeUserList({
                storeId: this.id,
                type,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then((res) => {
                    console.log("storeUserList res:", res);
                    this.total = res.count;
                    this.manList = res.list;

                })
                .catch((err) => {
                    console.log("storeUserList err:", err);
                })
                .finally(() => {

                });
        }
    }

}

</script>

<style lang="less" scoped></style>

