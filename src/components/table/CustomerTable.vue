<template>
    <!--    <div style="margin-left: 8px">
          {{ `已选择 ${selectedRowItems.length} items` }}
      </div>-->
    <a-table
        :columns="columns"
        :data-source="dataList"
        :scroll="{ x: true }"
        :row-key="record => record.id"
        :loading="loading"
        :pagination="false"
        :row-selection="checkMode ? rowSelection : null"
    >
        <template #bodyCell="{ record, column, text }">
            <template v-if="column.key === 'detail'">
                <div class="table-img">
                    <a-image
                        :width="30"
                        :height="30"
                        :src="$Util.imageFilter(record.logo)"
                        :fallback="$t('def.none')"
                    />
                    <a-tooltip placement="top" :title="$i18n.locale === 'zh' ? record.name : record.name_en || '-'">
                        <div class="info">
                            <a-button type="link" @click="routerChange('detail', record)">
                                <div class="ell" style="max-width: 100px">
                                    {{ $i18n.locale === 'zh' ? record.name : record.name_en || '-' }}
                                </div>
                            </a-button>
                        </div>
                    </a-tooltip>
                </div>
            </template>
            <template v-if="column.key === 'money'">
                <span v-if="text >= 0">{{ column.unit }}</span>
                {{ $Util.countFilter(text) }}
                <!--                {{column.unit}} {{$Util.countFilter(text)}}-->
            </template>
            <template v-if="column.key === 'type'">
                {{ $Util.CRMCustomerTypeFilter(text, $i18n.locale) }}
            </template>
            <template v-if="column.key === 'item'">
                {{ text || '-' }}
            </template>
            <template v-if="column.key === 'category_list'">
                <span v-for="(category, index) in text">
                    <span v-if="index !== 0">,</span>
                    {{ category.category_name }}
                </span>
            </template>
            <template v-if="column.key === 'count'">
                {{ text ? text + $t('m.pcs') : '-' }}
            </template>
            <template v-if="column.key === 'spec'">
                {{ $Util.itemSpecFilter(text) }}
            </template>
            <template v-if="column.key === 'supplier_list'">
                <template v-for="item of record.supplier_list">
                    <a-tag>{{ item.short_name }}</a-tag>
                </template>
            </template>
            <template v-if="column.key === 'material_spec'">
                <a-tooltip placement="top" :title="text">
                    <div class="ell" style="max-width: 80px">{{ text || '-' }}</div>
                </a-tooltip>
            </template>
            <template v-if="column.key === 'time'">
                {{ $Util.timeFilter(text) }}
            </template>
            <template v-if="column.key === 'operation'">
                <a-button
                    type="link"
                    @click="selectItem(record)"
                    v-if="$auth('crm-customer.detail') && record.permissions && selectBtn"
                    ><i class="icon i_add" />{{ $t('n.select') }}</a-button
                >
                <a-button
                    type="link"
                    @click="routerChange('detail', record)"
                    v-if="$auth('crm-customer.detail') && record.status === CRM_STATUS.POOL"
                    ><i class="icon i_detail" />{{ $t('def.detail') }}</a-button
                >
            </template>
        </template>
    </a-table>
</template>

<script>
import Core from '../../core';
export default {
    components: {},
    props: {
        columns: {
            type: Array,
            default: () => {
                return [];
            },
        },
        dataSource: {
            type: Array,
            default: () => {
                return [];
            },
        },
        loading: {
            type: Boolean,
            default: false,
        },
        checkMode: {
            // 是否开启选择模式
            type: Boolean,
            default: false,
        },
        radioMode: {
            // 是否只能选一个商品
            type: Boolean,
            default: false,
        },
        defaultChecked: {
            // 默认被选中的
            type: Array,
            default: () => {
                return [];
            },
        },
        disabledChecked: {
            // 不可被选中的
            type: Array,
            default: () => {
                return [];
            },
        },
        selectBtn: {
            type: Boolean,
            default: false,
        },
    },
    emit: ['submit'],
    data() {
        return {
            CRM_STATUS: Core.Const.CRM_CUSTOMER.STATUS,
            selectedRowKeys: [],
            selectedRowItems: [],
            selectedRowItemsAll: [],
            dataList: [],
            tableDataAll: {},
        };
    },
    watch: {
        dataSource: function (n) {
            this.dataList = Core.Util.deepCopy(this.dataSource);
        },
        defaultChecked: function (n) {
            console.log('defaultChecked:', n);
            this.selectedRowKeys = Core.Util.deepCopy(this.defaultChecked);
        },
    },
    created() {
        console.log('created this.defaultChecked:', this.defaultChecked);
        if (this.defaultChecked.length) {
            this.selectedRowKeys = Core.Util.deepCopy(this.defaultChecked);
        }
    },
    computed: {
        rowSelection() {
            return {
                type: this.radioMode ? 'radio' : 'checkbox',
                selectedRowKeys: this.selectedRowKeys,
                preserveSelectedRowKeys: true,
                onChange: (selectedRowKeys, selectedRows) => {
                    // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys;
                    this.selectedRowItemsAll.push(...selectedRows);
                    let selectedRowItems = [];
                    selectedRowKeys.forEach(id => {
                        let element = this.selectedRowItemsAll.find(i => i.id == id);
                        selectedRowItems.push(element);
                    });
                    this.selectedRowItems = selectedRowItems;
                    console.log(
                        'rowSelection this.selectedRowKeys:',
                        this.selectedRowKeys,
                        'selectedRowItems:',
                        selectedRowItems,
                    );
                    this.$emit('submit', this.selectedRowKeys, this.selectedRowItems);
                },
                getCheckboxProps: record => ({
                    disabled: this.disabledChecked.includes(record.id),
                }),
            };
        },
    },
    methods: {
        routerChange(type, item = {}) {
            console.log('routerChange item:', item);
            // return
            let routeUrl = '';
            switch (type) {
                case 'detail': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/crm-customer/customer-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
        selectItem(item) {
            console.log('select item:', item);
            this.$emit('select', item.id, item);
        },
    },
};
</script>

<style lang="scss" scoped></style>
