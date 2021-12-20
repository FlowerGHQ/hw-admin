<template>
<a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
    <template #expandIcon ><i class="icon i_expan_l"/> </template>
    <a-collapse-panel key="RepairInfo" header="详细信息" class="gray-collapse-panel">
        <a-row class="panel-content info-container">
            <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                <div class="info-item">
                    <div class="key">工单名称</div>
                    <div class="value">{{detail.name || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">问题描述</div>
                    <div class="value">{{detail.desc || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">工单分类</div>
                    <div class="value">{{$Util.repairTypeFilter(detail.type)}}</div>
                </div>
                <div class="info-item">
                    <div class="key">维修方式</div>
                    <div class="value">{{$Util.repairChannelFilter(detail.channel)}}</div>
                </div>
                <div class="info-item">
                    <div class="key">维修类别</div>
                    <div class="value">{{$Util.repairMethodFilter(detail.repair_method) || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">车辆编号</div>
                    <div class="value">{{detail.item_code || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">创建人</div>
                    <div class="value">{{detail.user_name || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">创建时间</div>
                    <div class="value">{{$Util.timeFilter(detail.create_time) || '-'}}</div>
                </div>
            </a-col>
            <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">



                <div class="info-item">
                    <div class="key">相关客户</div>
                    <div class="value">{{detail.customer_name || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">客户电话</div>
                    <div class="value">{{detail.customer_phone || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">客户邮箱</div>
                    <div class="value">{{detail.customer_email || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">客户地址</div>
                    <div class="value">{{detail.customer_province + detail.customer_city + detail.customer_county + detail.customer_address || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">优先级</div>
                    <div class="value">{{$Util.repairPriorityFilter(detail.priority)}}</div>
                </div>


                <div class="info-item">
                    <div class="key">工单备注</div>
                    <div class="value">{{detail.remark || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">维修信息</div>
                    <div class="value">{{detail.repair_message || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">实施时间</div>
                    <div class="value">{{$Util.timeFilter(detail.finish_time) || '-'}}</div>
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

            activeKey: 'RepairInfo'
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
