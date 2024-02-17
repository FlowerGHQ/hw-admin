<template>
    <div class="WaybillShow">
        <div class="main">
            <span>{{ $Util.waybillCompanyFilter(detail.company_uid) }}({{ detail.uid }})</span>
            <a-button type="link" @click="handleDetailShow">{{ $t('i.view_logistics_detail') }}</a-button>
            <a-button type="link" v-if="canEdit" @click="handleUpdateShow">{{ $t('i.logistics_info') }}</a-button>
        </div>
        <div class="desc">{{ last.status }}</div>
        <div class="time">{{ last.time }}</div>
        <template class="modal-container">
            <a-modal v-model:visible="detailShow" :title="$t('i.logistics_detail')" class="waybill-show-modal">
                <div class="modal-content">
                    <a-steps progress-dot direction="vertical">
                        <a-step
                            v-for="(item, index) of list"
                            :key="index"
                            :title="item.time"
                            :description="item.status"
                        />
                    </a-steps>
                </div>
                <template #footer>
                    <a-button key="back" @click="detailShow = false">{{ $t('pop_up.close') }}</a-button>
                </template>
            </a-modal>
            <a-modal v-model:visible="updateShow" :title="$t('i.receive_remark')" class="remark-detail-modal">
                <div class="form-item">
                    <div class="key">{{ $t('n.logistics_company') }}:</div>
                    <div class="value">
                        <a-select v-model:value="companyUid" :placeholder="$t('r.logistics_company')">
                            <a-select-option v-for="(val, key) in companyMap" :key="key" :value="key">{{
                                val
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('n.tracking_number') }}:</div>
                    <div class="value">
                        <a-input v-model:value="uid" :placeholder="$t('r.tracking_number')" />
                    </div>
                </div>
                <template #footer>
                    <a-button key="back" @click="updateShow = false">{{ $t('pop_up.close') }}</a-button>
                    <a-button type="primary" @click="updatePurchaseOrRepair">{{ $t('def.submit') }}</a-button>
                </template>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';

const WAYBILL = Core.Const.WAYBILL;
export default {
    name: 'WaybillShow',
    components: {},
    props: {
        id: {
            type: Number,
        },
        detail: {
            type: Object,
            default: () => {
                return {};
            },
        },
        list: {
            type: Array,
            default: () => {
                return [];
            },
        },
        canEdit: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            // id: undefined,
            companyMap: WAYBILL.COMPANY_MAP,
            detailShow: false,
            uid: '',
            companyUid: undefined,
            updateShow: false,
        };
    },
    watch: {},
    computed: {
        last() {
            return this.list[0] || {};
        },
    },
    created() {},
    mounted() {
        this.companyUid = this.detail.company_uid;
        this.uid = this.detail.uid;
        // alert(this.id)
    },
    methods: {
        handleDetailShow() {
            this.detailShow = true;
        },
        handleUpdateShow() {
            this.updateShow = true;
        },
        updatePurchaseOrRepair() {
            if (this.detail.target_type == Core.Const.WAYBILL.TARGET_TYPE.PURCHASE_ORDER) {
                this.updatePurchaseWaybill();
            } else {
                // this.detail.target_type == Core.Const.WAYBILL.TARGET_TYPE.REPAIR_ORDER_TRANSFER
                this.updateRepairWaybill();
            }
        },
        updatePurchaseWaybill() {
            // 采购物流修改
            Core.Api.Waybill.update({
                id: this.detail.id,
                company_uid: this.companyUid,
                uid: this.uid,
            }).then(res => {
                this.$emit('change');
                this.$message.success(this.$t('pop_up.modify'));
                this.updateShow = false;
            });
        },
        updateRepairWaybill() {
            // 维修转单物流修改
            console.log('this.id: ', this.id);
            Core.Api.Repair.post({
                id: this.id,
                company_uid: this.companyUid,
                waybill_uid: this.uid,
            }).then(res => {
                this.$emit('change');
                this.$message.success(this.$t('pop_up.modify'));
                this.updateShow = false;
            });
        },
    },
};
</script>

<style lang="less">
.WaybillShow {
    .main {
        font-size: 12px;
        font-weight: 500;
        color: #3c3c3c;
        line-height: 20px;

        .ant-btn {
            height: 20px;
            font-size: 12px;
            margin-left: 8px;
        }
    }

    .desc,
    .time {
        font-size: 12px;
        font-weight: 500;
        color: #6c6c6c;
        line-height: 20px;
        margin: 6px 0;
    }
}

.waybill-show-modal {
    .ant-steps-item-container {
        .ant-steps-item-content {
            width: calc(~'100% - 30px');
        }
    }
}
</style>
