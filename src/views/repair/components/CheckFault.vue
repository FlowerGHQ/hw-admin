<template>
<div class="CheckFault">
<a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
    <template #expandIcon ><i class="icon i_expan_l"/> </template>
    <a-collapse-panel key="affirm" header="故障确认" class="gray-collapse-panel">
        <div class="panel-content affirm">
            <div class="title">
                <i class="icon i_warning"/>共{{faultSelect.length}}个故障
            </div>
            <a-checkbox-group class="fault_select" v-model:value="faultSelect" @change="handleFaultSelect">
                <a-checkbox v-for="(value,key) in faultMap" :key='key' :value='key'>
                    {{value}}
                </a-checkbox>
            </a-checkbox-group>
        </div>
    </a-collapse-panel>
    <a-collapse-panel key="change" header="零部件更换" class="gray-collapse-panel">
        <div class="panel-content change" >
            <a-collapse v-model:activeKey="failActive" ghost class="collapse-item">
                <a-collapse-panel v-for="fault of faultSelect" :key="fault" :header="faultMap[fault]">
                    <template #extra>
                        <ItemSelect btnType='link' @change="handleAddFailItem" :fault-name="fault" :disabled-checked='failData[fault].map(i => i.id)'/>
                    </template>
                    <a-table :columns="tableColumns" :data-source="failData[fault]"
                        :row-key="record => record.id"  :pagination='false' size="small">
                        <template #bodyCell="{ column , record ,index}">
                            <template v-if="column.dataIndex === 'amount'">
                                <a-input-number v-model:value="record.amount" :min="0" :precision="0" placeholder="请输入"/> 件
                            </template>
                            <template v-if="column.dataIndex === 'operation'">
                                <a-button type="link" @click="handleFailItemDelete(index, fault)"><i class="icon i_delete"/> 移除</a-button>
                            </template>
                        </template>
                    </a-table>
                </a-collapse-panel>
            </a-collapse>
            <a-collapse v-model:activeKey="exchangeActive" ghost class="collapse-item">
                <a-collapse-panel v-for="fault of faultSelect" :key="fault" :header="faultMap[fault]">
                    <template #extra>
                        <ItemSelect btnType='link' @change="handleAddExchangeItem" :fault-name="fault" :disabled-checked='exchangeData[fault].map(i => i.id)'/>
                    </template>
                    <a-table :columns="tableColumns" :data-source="exchangeData[fault]"
                        :row-key="record => record.id" :pagination='false' size="small">
                        <template #bodyCell="{ column , record ,index}">
                            <a-input-number v-model:value="record.amount"
                                :min="0" :precision="0" placeholder="请输入"
                                :formatter="value => value ? `${value}件` : value"
                                :parser="value => value.replace('件', '')"
                                v-if="column.dataIndex === 'amount'"
                            />
                            <template v-if="column.dataIndex === 'operation'">
                                <a-button type="link" @click="handleExchangeItemDelete(index, fault)"><i class="icon i_delete"/> 移除</a-button>
                            </template>
                        </template>
                    </a-table>
                </a-collapse-panel>
            </a-collapse>
            <div class="submit-btn">
                <a-button type="primary" @click="handleFaultSubmit()"><i class="icon i_check_c"/>提交</a-button>
            </div>
        </div>
    </a-collapse-panel>
</a-collapse>
</div>
</template>

<script>
import Core from '../../../core';
import ItemSelect from '@/components/ItemSelect.vue';

export default {
    name: 'RepairDetail',
    components: {
        ItemSelect
    },
    props: {
        id: {
            type: Number
        },
        detail: {
            type: Object
        }
    },
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            activeKey: ['affirm'],

            faultMap: Core.Const.REPAIR.FAULT_OPTIONS_MAP,

            tableColumns: [
                { title: '商品名称', dataIndex: 'name' },
                { title: '数量', dataIndex: 'amount'  },
                { title: '操作', dataIndex: 'operation' },
            ],

            faultSelect: [],

            failData: {},
            failActive: '',

            exchangeData: {},
            exchangeActive: '',
        };
    },
    watch: {},
    computed: {},
    methods: {
        // 故障选择
        handleFaultSelect(val) {
            console.log('handleFaultSelect val:', val)
            if (val.length) {
                if (!this.activeKey.includes('change')) {
                    this.activeKey.push('change')
                }
            }
            this.faultSelect.forEach(it => {
                this.failData[it] = this.failData[it] || []
                this.exchangeData[it] = this.exchangeData[it] || []
            })
        },

        // 添加商品
        handleAddFailItem(ids, items, name) {
            console.log('handleAddFailItem items:', name)
            this.failData[name].push(...items)
            console.log('handleAddFailItem failData items:', this.failData)
        },
        handleAddExchangeItem(ids, items,name) {
            console.log('handleAddExchangeItem items:', items)
            this.exchangeData[name].push(...items)
            console.log('handleAddExchangeItem exchangeData items:', this.exchangeData)
        },

        // 移除商品
        handleFailItemDelete(index, name) {
            this.failData[name].splice(index, 1)
        },
        handleExchangeItemDelete(index, name) {
            this.exchangeData[name].splice(index, 1)
        },

        // 提交故障
        handleFaultSubmit() {
            let itemList = []
            this.faultSelect.forEach(fault => {
                this.failData[fault].forEach(item => {
                    item.item_fault_type = fault
                    item.type = 1
                    itemList.push(item)
                })
                this.exchangeData[fault].forEach(item => {
                    item.item_fault_type = fault
                    item.type = 2
                    itemList.push(item)
                })
            })
            Core.Api.RepairItem.saveList({
                repair_order_id: this.id,
                item_list: itemList
            }).then(() => {
                this.$message.success('操作成功');
                this.$emit('submit')
            })
        }
    }
};
</script>

<style lang="less">
.CheckFault {
    .panel-content.change {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .collapse-item {
            width: calc(~'50% - 10px');
            .ant-collapse-item {
                margin-bottom: 10px;
                .ant-collapse-content-box {
                    padding: 0;
                    .ant-table-thead {
                        display: none;
                    }
                }
            }
            .ant-collapse-header {
                background-color: #F5F8FA;
                height: 40px;
                .fac();
                width: 100%;
                position: relative;
                .ant-collapse-extra {
                    position: absolute;
                    right: 12px;
                }
            }
        }
        .submit-btn {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        }
    }
}
</style>
