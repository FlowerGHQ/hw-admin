<template>
    <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
        <template #expandIcon><i class="icon i_expan_l" /> </template>
        <a-collapse-panel key="WaybillInfo" header="转单物流" class="gray-collapse-panel">
            <a-row class="panel-content info-container">
                <a-col :xs="24" :sm="24" :lg="12" :xl="8" :xxl="6" class="info-block">
                    <div class="info-item">
                        <div class="key">收货人</div>
                        <div class="value" v-if="detail.receive_info">{{ detail.receive_info.name || '-' }}</div>
                        <div class="value" v-else>-</div>
                    </div>
                    <div class="info-item">
                        <div class="key">收货地址</div>
                        <div class="value" v-if="detail.receive_info">
                            {{
                                detail.receive_info.country +
                                    detail.receive_info.province +
                                    detail.receive_info.city +
                                    detail.receive_info.county +
                                    detail.receive_info.address || '-'
                            }}
                        </div>
                        <div class="value" v-else>-</div>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="24" :lg="12" :xl="16" :xxl="12" class="info-block">
                    <div class="info-item">
                        <div class="key">联系方式</div>
                        <div class="value" v-if="detail.receive_info">{{ detail.receive_info.phone || '-' }}</div>
                        <div class="value" v-else>-</div>
                    </div>
                    <div class="info-item">
                        <div class="key">物流信息</div>
                        <div class="value">
                            <WaybillShow
                                v-if="detail.status == REPAIR.STATUS.WAIT_REPAIR"
                                @change="getWaybillDetail"
                                :detail="waybill"
                                :list="waybillInfo.list"
                                :id="id"
                            />
                            <template v-else>暂无物流信息</template>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </a-collapse-panel>
    </a-collapse>
</template>

<script>
import Core from '../../../core';
import WaybillShow from '@/components/popup-btn/WaybillShow.vue';
const REPAIR = Core.Const.REPAIR;
export default {
    name: 'WaybillInfo',
    components: {
        WaybillShow,
    },
    props: {
        id: {
            type: Number,
        },
        detail: {
            type: Object,
        },
    },
    data() {
        return {
            REPAIR,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 物流
            waybill: {},
            waybillInfo: {},

            activeKey: '',
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getWaybillDetail(); // 物流
    },
    methods: {
        // 获取物流信息
        getWaybillDetail() {
            Core.Api.Waybill.detailByTarget({
                target_id: this.id,
                target_type: Core.Const.WAYBILL.TARGET_TYPE.REPAIR_ORDER_TRANSFER,
                type: Core.Const.WAYBILL.TYPE.OUT,
            })
                .then(res => {
                    this.waybill = res.detail;
                    console.log('getWaybillDetail this.waybill ', this.waybill);
                    if (!this.waybill.uid || !this.waybill.company_uid) {
                        this.$emit('needDelivery');
                    }
                    this.getWaybillInfo(this.waybill.uid, this.waybill.company_uid);
                })
                .catch(err => {
                    console.log('getWaybillDetail err', err);
                })
                .finally(() => {});
        },
        getWaybillInfo(uid, company_uid) {
            Core.Api.Waybill.queryLogistics({
                uid: uid,
                company_uid: company_uid,
            })
                .then(res => {
                    console.log('getWaybillInfo res', res);
                    this.waybillInfo = JSON.parse(res.waybill).result;
                    console.log('getWaybillInfo waybillInfo', this.waybillInfo);
                })
                .catch(err => {
                    console.log('getWaybillInfo err', err);
                });
        },
    },
};
</script>
