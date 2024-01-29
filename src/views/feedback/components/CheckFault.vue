<template>
<div class="CheckFault">
    <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right" v-if="detail.source_id <= 0 ">
        <template #expandIcon><i class="icon i_expan_l"/></template>
        <a-collapse-panel key="affirm" :header="$t('r.problem')" class="gray-collapse-panel">
            <div class="panel-content affirm">
                <div class="title"><i class="icon i_warning"/>{{ $t('n.all_total') }}&nbsp;{{ faultSelect.length }}&nbsp;{{ $t('r.faults') }}</div>
                <a-checkbox-group class="fault_select" :value="faultSelect">
                    <a-checkbox v-for="(value,key) of faultMap" :key='key' :value='key' @change="handleFaultSelect">{{ value }}</a-checkbox>
                </a-checkbox-group>
                <div class="title-fault">
                    <FaultEdit :id="id" ref="FaultEdit" @saveFault="getFaultData" btn-type="primary" >{{ $t('r.new_fault') }}</FaultEdit>
                </div>
            </div>
        </a-collapse-panel>
        <a-collapse-panel key="change" :header="$t('r.replacement_items')" class="gray-collapse-panel">
            <div class="panel-content change">
                <div class="fault-item" v-for="fault of faultSelect" :key="fault">
                    <div class="fault-title">
                        <span class="fault-name">{{ $t('r.fault') }}：{{ faultMap[fault] }}</span>
                        <ItemSelect @select="handleAddFailItem" :fault-name="fault"
                            :disabled-checked='failData[fault].map(i => i.id)'
                            btn-type='primary' :btn-text="$t('i.add')" btn-class="fault-btn" v-if="$auth('repair-order.save')"/>
                    </div>
                    <a-table :columns="tableColumns" :data-source="failData[fault]" :scroll="{ x: true }"
                        :row-key="record => record.id" :pagination='false' size="small">
                        <template #headerCell="{title}">
                            {{ $t(title) }}
                        </template>
                        <template #bodyCell="{ column , record ,index, text}">
                            <template v-if="column.dataIndex === 'name'">
                                {{ $i18n.locale === 'zh' ? record.name : record.name_en }}
                            </template>
                            <template v-if="column.key === 'item'">
                                {{ text || '-' }}
                            </template>
                            <template v-if="column.dataIndex === 'price'">
                                € <a-input-number v-model:value="record.price" style="width: 82px;"
                                    :min="0" :precision="2" :placeholder="$t('n.please_input')"/>
                            </template>

                            <template v-if="column.key === 'amount'">
                                <a-input-number v-model:value="record.amount" style="width: 66px;"
                                    :min="1" :precision="0" :placeholder="$t('n.please_input')" @change="handleItemAmountChange(fault, index)"/> {{ $t('in.item') }}
                            </template>

                            <template v-if="column.key === 'total_price'">
                                € {{ $Util.countFilter(record.price * record.amount, 1) }}
                            </template>


                            <template v-if="column.dataIndex === 'operation'">
                                <a-button type="link" class="danger" @click="handleFailItemDelete(index, fault)"><i class="icon i_delete"/>{{ $t('def.remove') }}</a-button>
                            </template>
                        </template>
                    </a-table>
                </div>
                <SimpleImageEmpty :desc="$t('r.type')" v-if='!faultSelect.length'/>
            </div>
        </a-collapse-panel>
    </a-collapse>
    <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
        <template #expandIcon ><i class="icon i_expan_l"/> </template>
        <a-collapse-panel key="Remark" :header="$t('n.elaborate')" class="gray-collapse-panel">
            <div class="panel-content">
                <div class="form-item">
                    <div class="key">{{ $t('fe.feedback_title') }}:</div>
                    <div class="value">
                        <a-input v-model:value="title" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item textarea">
                    <div class="key">{{ $t('fe.feedback_desc') }}:</div>
                    <div class="value">
                        <a-textarea v-model:value="desc" :placeholder="$t('r.fault_description')"
                                    :auto-size="{ minRows: 4, maxRows: 6 }" :maxlength='500'/>
                        <span class="content-length">{{ desc.length }}/500</span>
                    </div>
                </div>
            </div>
        </a-collapse-panel>
    </a-collapse>
</div>
</template>

<script>
import Core from '../../../core';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';
import SimpleImageEmpty from '@/components/common/SimpleImageEmpty.vue';
import FaultEdit from '@/components/popup-btn/FaultEdit.vue';

const REPAIR_TYPE = Core.Const.REPAIR_ITEM.TYPE
const SERVICE_TYPE = Core.Const.REPAIR.SERVICE_TYPE
export default {
    name: 'RepairDetail',
    components: {
        ItemSelect,
        FaultEdit,
        SimpleImageEmpty,
        VNodes: (_, { attrs }) => { return attrs.vnodes; },
    },
    props: {
        id: {
            type: Number,
        },
        detail: {
            type: Object
        },
        orgId: {
            type: Number,
        },
        orgType: {
            type: Number,
        },
    },
    data() {
        return {
            SERVICE_TYPE,
            REPAIR_TYPE, // 维修商品类型
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            activeKey: ['affirm', 'Remark'],
            faultMap: {}, // 存放所有可能的故障
            faultSelect: [], // 存放 被选中的故障
            failData: {}, // 存放 零部件更换 商品信息

            repairTypeMap: Core.Const.REPAIR_ITEM.TYPE_MAP, // 维修商品类型
            title: '',
            desc: '',
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                {title: 'n.name', dataIndex: 'name', key: 'name'},
                {title: 'i.code', dataIndex: 'code', key: 'item'},
                {title: 'i.amount', key: 'amount'},
                {title: 'i.unit_price', dataIndex: 'price'},
                {title: 'i.total_price', key: 'total_price'},
                {title: 'def.operate', dataIndex: 'operation'},
            ]
            return columns
        },
    },
    mounted() {
        this.getFaultData();
        if(this.detail.desc !== undefined && this.detail.desc !== null ){
          this.desc = Core.Util.deepCopy(this.detail.desc)
        }
        if(this.detail.title !== undefined && this.detail.title !== null ){
            this.title = Core.Util.deepCopy(this.detail.title)
        }

    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'warehouse': // 新建仓库
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/warehouse-edit",
                    })
                    break;
                case 'purchase': // 采购
                    routeUrl = this.$router.resolve({
                        path: "/mall/vehicle-list",
                    })
                    break;
                case 'transfer': // 调货
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/transfer-order-list",
                    })
                    break;
                case 'fault': // 故障
                    routeUrl = this.$router.resolve({
                        path: "/repair/item-fault-list",
                    })
                    break;
            }
            window.open(routeUrl.href, '_blank')
        },
        // 获取 故障 数据
        getFaultData() {
            this.loading = true;
            // return
            Core.Api.Fault.list({
                org_id: this.orgId,
                org_type: this.orgType,
            }).then(res => {
                console.log("getFaultData res:", res)
                let list = res.list;
                let map = {};
                for (const item of list) {
                    map[item.id] = item.name
                }
                console.log('getFaultData faultMap:', map)
                this.faultMap = map;
            }).catch(err => {
                console.log('getFaultData err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        // 故障选择
        handleFaultSelect({target}) {
            let faultSelect = []
            if (target.checked) {
                faultSelect.push(target.value)
            }
            this.faultSelect = faultSelect

            console.log('handleFaultSelect faultSelect:', faultSelect)
            if (faultSelect.length) {
                if (!this.activeKey.includes('change')) {
                    this.activeKey.push('change')
                }
            }
            this.faultSelect.forEach(it => {
                this.failData[it] = this.failData[it] || []
            })
        },

        // 添加商品
        async handleAddFailItem(ids, items, name) {
            for (let i = 0; i < items.length; i++) {
                const element = items[i];
                element.amount = 1
                element.price = Core.Util.countFilter(this.$auth('DISTRIBUTOR') ? element.fob_eur : element.price_eur)
                element.type = 2
            }
            console.log('handleAddFailItem items:', items)
            this.failData[name].push(...items)
        },

        // 商品数量变更
        handleItemAmountChange(name, index = -1) {
            if (index !== -1) {
                this.failData[name][index].warehouse_id = this.getFilstWarehouse(this.failData[name][index])
            }
        },

        // 移除商品
        handleFailItemDelete(index, name) {
            this.failData[name].splice(index, 1)
            this.handleItemAmountChange(name)
        },
        handleSubmit() {
          if (this.detail.source_id <= 0){
            if (!this.faultSelect.length) {
              this.$message.warning(this.$t('def.enter'))
              return
            }
            this.handleFaultSubmit()
          }
            this.handleSaveTitle()



        },
        // 提交故障
        handleFaultSubmit() {
            console.log('this.faultSelect: ', this.faultSelect);
            let itemList = []

            for (const fault of this.faultSelect) {
                if (this.failData[fault].length == 0) {
                    return this.$message.warning(this.$t('def.enter'))
                }
                for (const item of this.failData[fault]) {
                    if (!item) {
                        return this.$message.warning(this.$t('def.enter'))
                    }
                    item.item_fault_id = Number(fault)
                    console.log('item.is_stock: ', item.is_stock);
                    item.price = Math.round(item.price * 100)
                    item.charge = item.price
                    itemList.push(item)
                }
            }
            console.log('handleFaultSubmit itemList:', itemList)
            Core.Api.FeedbackItem.saveList({
                quality_feedback_id: this.id,
                item_list: itemList,
            }).then(() => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.$emit('submit')
                Core.Api.Feedback.saveTitle({
                    id: this.id,
                    title: this.title,
                    desc: this.desc
                }).then(() => {
                    this.$emit('submit')
                })
            })
        },
        // 提交故障
        handleSaveTitle() {
            Core.Api.Feedback.saveTitle({
                id: this.id,
                title: this.title,
                desc: this.desc
            }).then(() => {
                this.$emit('submit')
            })
        },
    }
};
</script>

<style lang="less">
.CheckFault {
    .panel-content.change {
        .fault-item {
            margin-bottom: 30px;

            .fault-title {
                .fsb();
                margin-bottom: 13px;

                .fault-name {
                    font-weight: 500;
                    font-size: 12px;
                    line-height: 22px;
                    color: rgba(0, 0, 0, 0.85);
                }

                .fault-btn {
                    border-radius: 2px;
                    height: 32px;
                }
            }
        }
    }
}
</style>
