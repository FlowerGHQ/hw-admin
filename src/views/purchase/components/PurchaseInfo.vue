<template>
<a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
    <template #expandIcon ><i class="icon i_expan_l"/> </template>
    <a-collapse-panel key="RepairInfo" header="详细信息" class="gray-collapse-panel">
        <a-row class="panel-content info-container">
            <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                <div class="info-item">
                    <div class="key">订单编号</div>
                    <div class="value">{{detail.sn || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">下单人</div>
                    <div class="value">{{detail.user_name|| '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">下单时间</div>
                    <div class="value">{{$Util.timeFilter(detail.create_time) || '-'}}</div>
                </div>

            </a-col>
            <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                <div class="info-item">
                    <div class="key">联系方式</div>
                    <div class="value" v-if="detail.receive_info != null">{{detail.receive_info.phone || '-'}}</div>
                    <div class="value" v-else>-</div>
                </div>
                <div class="info-item">
                    <div class="key">支付方式</div>
                    <div class="value">{{$Util.puechasePayMethodFilter(detail.pay_method) || '-'}}</div>
                </div>
            </a-col>
        </a-row>
    </a-collapse-panel>
    <a-collapse-panel key="WaybillInfo" header="配送信息" class="gray-collapse-panel">
        <a-row class="panel-content info-container">
            <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                <div class="info-item">
                    <div class="key">配送地址</div>
                    <div class="value" v-if="detail.receive_info !=null">{{detail.receive_info.country + detail.receive_info.province + detail.receive_info.city + detail.receive_info.county + detail.receive_info.address || '-'}}</div>
                    <div class="value" v-else>-</div>
                </div>
                <div class="info-item">
                    <div class="key">接受人</div>
                    <div class="value" v-if="detail.receive_info !=null">{{detail.receive_info.name || '-'}}</div>
                    <div class="value" v-else>-</div>
                </div>
            </a-col>
            <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                <div class="info-item">
                    <div class="key">联系方式</div>
                    <div class="value" v-if="detail.receive_info !=null">{{detail.receive_info.phone || '-'}}</div>
                    <div class="value" v-else>-</div>
                </div>
                <div class="info-item">
                    <div class="key">物流信息</div>
                    <div class="value">{{waybill.uid}}</div>
                    <div class="value">{{waybill.companyUid}}</div>
                    <div class="value">{{waybillInfo}}</div>
                </div>
            </a-col>
        </a-row>
    </a-collapse-panel>
</a-collapse>
</template>

<script>
import Core from '../../../core';
export default {
    name: 'RepairInfo',
    components: {},
    props: {
        id: {
            type: Number,
        },
        detail: {
            type: Object,
        }
    },
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            activeKey: ''
        };
    },
    watch: {},
    computed: {},
    mounted() {},
    methods: {
    }
};
</script>

<style lang="less" scoped>
// #RepairInfo {}
</style>
