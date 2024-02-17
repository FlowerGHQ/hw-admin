<template>
    <div id="SubscriptionList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">邮箱订阅状态列表</div>
            </div>
            <div class="tabs-container colorful">
                <a-tabs v-model:activeKey="searchForm.status" @change="handleSearch">
                    <a-tab-pane :key="item.key" v-for="item of statusList">
                        <template #tab>
                            <!--                        <div class="tabs-title">{{item.text}}<span :class="item.color">{{item.value}}</span></div>-->
                            <div class="tabs-title">{{ item.text }}</div>
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                    :loading="loading"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title="text">
                                {{ text || '-' }}
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'email'">
                            <div v-if="text !== ''" class="phone-hover">
                                {{ text || '-' }}
                                <a-button
                                    type="link"
                                    v-if="!record.flag_eyes"
                                    class="switch"
                                    @click="handleChecking(record)"
                                    ><i class="icon i_eyes"
                                /></a-button>
                            </div>
                            <div v-else>
                                {{ text || '-' }}
                            </div>
                        </template>
                        <template v-if="column.key === 'phone'">
                            <div v-if="text !== ''" class="phone-hover">
                                {{ text || '-' }}
                                <a-button
                                    type="link"
                                    v-if="!record.flag_eyes"
                                    class="switch"
                                    @click="handleChecking(record)"
                                    ><i class="icon i_eyes"
                                /></a-button>
                            </div>
                            <div v-else>
                                {{ text || '-' }}
                            </div>
                        </template>
                        <template v-if="column.key === 'email_subscription_status'">
                            <div
                                class="status status-bg status-tag"
                                :class="$Util.emailSubscriptionFilter(text, 'color')"
                            >
                                {{ $Util.emailSubscriptionFilter(text) }}
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'label_list'">
                            <template v-if="record.label_list.length">
                                <a-tooltip
                                    placement="top"
                                    :title="
                                        $i18n.locale === 'zh' ? record.target_label_list : record.target_label_en_list
                                    "
                                >
                                    <a-tag
                                        v-for="(item, index) in record.show_label_list"
                                        :key="index"
                                        color="blue"
                                        class="customer-tag"
                                    >
                                        {{ $i18n.locale === 'zh' ? item.label : item.label_en }}
                                    </a-tag>
                                </a-tooltip>
                                <span v-if="record.ell">...</span>
                            </template>
                            <template v-else> - </template>
                        </template>
                        <!-- 客户类型 -->
                        <template v-if="column.key === 'customer_type'">
                            {{ $Util.CRMCustomerTypeFilter(text) || '个人客户' }}
                        </template>
                        <template v-if="column.key === 'source_type'">
                            <span v-if="Landing_Page[text]">
                                {{ Landing_Page[text][$i18n.locale] }}{{ '-'
                                }}{{
                                    $i18n.locale == 'en'
                                        ? Landing_Page[text]['country_en']
                                        : Landing_Page[text]['country']
                                }}{{ Landing_Page[text]['key'] }}
                            </span>
                            <span>
                                {{ $Util.CRMCustomerSourceTypeFilter(text, $i18n.locale) }}
                            </span>
                        </template>
                        <!-- 一般字段 -->
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <!-- 时间 -->
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <a-pagination
                    v-model:current="currPage"
                    :page-size="pageSize"
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                    :hide-on-single-page="false"
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
    name: 'SubscriptionList',
    components: {},
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            Landing_Page: Core.Const.CRM_CUSTOMER.Landing_Page, // 落地页
            // 表格
            tableData: [],
            statusList: [
                { text: '全  部', value: '0', color: 'primary', key: '-1' },
                { text: '已订阅', value: '0', color: 'green', key: '1' },
                { text: '未订阅', value: '0', color: 'yellow', key: '0' },
                { text: '已退订', value: '0', color: 'red', key: '2' },
            ],
            searchForm: {
                status: '1',
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: '名称', dataIndex: 'name', key: 'detail' },
                { title: '手机号', dataIndex: 'phone', key: 'phone' }, // 工单类型
                { title: '邮箱', dataIndex: 'email', key: 'email' },
                { title: '标签', dataIndex: 'label_list', key: 'label_list' },
                { title: '邮箱订阅状态', dataIndex: 'email_subscription_status', key: 'email_subscription_status' },
                { title: '客户类型', dataIndex: 'customer_type', key: 'customer_type' },
                { title: '创建人', dataIndex: 'update_user_name', key: 'item' },
                { title: '区域', dataIndex: 'group_name', key: 'item' },
                { title: '成单数量', dataIndex: 'order_count', key: 'item' },
                { title: '用车城市', dataIndex: 'address', key: 'item' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time' },
                { title: '备注', dataIndex: 'remark', key: 'item' },
                { title: '来源类型', dataIndex: 'source_type', key: 'source_type' },
            ];
            return columns;
        },
    },
    mounted() {
        this.getTableData();
    },
    beforeUnmount() {},
    methods: {
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            console.log('pageSizeChange size:', size);
            this.pageSize = size;
            this.getTableData();
        },
        handleSearch() {
            // 搜索
            this.pageChange(1);
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.EMAIL_SUBSCRIPTION.list({
                email_subscription_status: Number(this.searchForm.status),
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.total = res.count;
                    let targetData = res.list;
                    const updatedTableData = targetData.map(data => {
                        let showLabelList = [];
                        let tooltipLableList = [];
                        tooltipLableList = [...data.label_list];
                        if (data.label_list.length > 2) {
                            showLabelList = data.label_list.slice(0, 2);
                            data.ell = true;
                        } else {
                            showLabelList = [...data.label_list];
                            data.ell = false;
                        }
                        const targetLabelList = tooltipLableList.map(item => item.label).join(',');
                        const targetLabelEnList = tooltipLableList.map(item => item.label_en).join(',');
                        return {
                            ...data,
                            show_label_list: showLabelList,
                            target_label_list: targetLabelList,
                            target_label_en_list: targetLabelEnList,
                        };
                    });
                    this.tableData = updatedTableData;
                    console.log('tableData', this.tableData);
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 查看完整邮箱
        handleChecking(item) {
            Core.Api.CRMCustomer.checking({
                id: item.id,
            }).then(res => {
                item.phone = res.detail.phone;
                item.email = res.detail.email;
                item.flag_eyes = true;
            });
        },
    },
};
</script>

<style lang="less" scoped>
.i_eyes {
    font-size: 12px;
}

.phone-hover {
    .switch {
        opacity: 0;
    }

    &:hover {
        .switch {
            opacity: 1;
        }
    }
}
</style>
