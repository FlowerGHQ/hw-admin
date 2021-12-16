<template>
    <a-table
        :columns="columns" :data-source="dataList" :scroll="{ x: true }"
        :row-key="record => record.id" :loading='loading' :pagination='false'
        :row-selection="checkMode ? rowSelection : null">
    </a-table>
</template>

<script>
import Core from '../../core';
export default {
    components: {},
    props: {
        columns: {
            type: Array,
            default: () => { return [] }
        },
        dataSource: {
            type: Array,
            default: () => { return [] }
        },
        loading: {
            type: Boolean,
            default: false
        },
        checkMode: { // 是否开启选择模式
            type: Boolean,
            default: false
        },
        radioMode: { // 是否只能选一个商品
            type: Boolean,
            default: false,
        },
        defaultChecked: { // 默认被选中的
            type: Array,
            default: () => { return [] }
        },
        disabledChecked: { // 不可被选中的
            type: Array,
            default: () => { return [] }
        }
    },
    data() {
        return {
            selectedRowKeys: [],
            selectedRowItems: [],
            selectedRowItemsAll: [],
            dataList:[]
        }
    },
    watch: {
        dataSource: function(n) {
            console.log('defaultChecked n:', n)
            this.dataList = Core.Util.deepCopy(this.dataSource)
        },
        defaultChecked: function(n) {
            console.log('defaultChecked n:', n)
            this.selectedRowKeys = Core.Util.deepCopy(this.defaultChecked)
        }
    },
    created() {
        if (this.defaultChecked.length) {
            this.selectedRowKeys = Core.Util.deepCopy(this.defaultChecked)
        }
    },
    computed: {
        rowSelection() {
            console.log('this.disabledChecked:', this.disabledChecked)
            return {
                type: this.radioMode ? 'radio' : 'checkbox',
                selectedRowKeys: this.selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => { // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys
                    this.selectedRowItemsAll.push(...selectedRows)
                    let selectedRowItems = []
                    selectedRowKeys.forEach(id => {
                        let element = this.selectedRowItemsAll.find(i => i.id == id)
                        selectedRowItems.push(element)
                    });
                    this.selectedRowItems = selectedRowItems
                    console.log('rowSelection this.selectedRowKeys:', this.selectedRowKeys,'selectedRowItems:', selectedRowItems)
                    this.$emit('change', this.selectedRowKeys, this.selectedRowItems)
                },
                getCheckboxProps: record => ({
                    props: {
                        disabled: this.disabledChecked.includes(record.id)
                    },
                }),
            };
        },
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'detail':  // 商品编辑
                    routeUrl = this.$router.resolve({
                        path: "/item/item-detail",
                        query: {
                            id: item.id
                        }
                    })
                    break;
                case 'detail_item':  // 商品编辑
                    routeUrl = this.$router.resolve({
                        path: "/item/item-detail",
                        query: {
                            id: item.item_id
                        }
                    })
                    break;
            }
            window.open(routeUrl.href, '_blank')
        },
        handleRemoveItem(index, item) {
            this.$emit('remove', index, item)
        },
        setSendCount(){
            this.$emit('setTableDate',this.dataList);
        },
        taxMoneyCheck(record) {
            record.totle_charge = record.charge * record.amount
            record.tax_money = record.tax_rate * record.totle_charge / 100
            this.$emit('change', this.selectedRowKeys, this.selectedRowItems)
        },
    }
}
</script>

<style lang='scss' scoped>
</style>
