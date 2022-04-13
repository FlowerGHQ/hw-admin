<template>
<a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
    <template #expandIcon ><i class="icon i_expan_l"/> </template>
    <a-collapse-panel key="RepairInfo" header="详细信息" class="gray-collapse-panel">
        <a-row class="panel-content info-container">
            <a-col :xs='24' :sm='24' :lg='12' :xl='6' :xxl='6' class="info-block">
                <div class="info-item">
                    <div class="key">工单帐类</div>
                    <div class="value">{{$Util.repairServiceFilter(detail.service_type, $i18n.locale || '-') }}</div>
                </div>
                <div class="info-item">
                    <div class="key">工单名称</div>
                    <div class="value">{{detail.name || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">工单分类</div>
                    <div class="value">{{$Util.repairTypeFilter(detail.type)}}</div>
                </div>
                <div class="info-item">
                    <div class="key">工单备注</div>
                    <div class="value">{{detail.remark || '-'}}</div>
                </div>
            </a-col>
            <a-col :xs='24' :sm='24' :lg='12' :xl='6' :xxl='6' class="info-block">
                <div class="info-item">
                    <div class="key">维修方式</div>
                    <div class="value">{{$Util.repairChannelFilter(detail.channel, $i18n.locale)}}</div>
                </div>
                <div class="info-item">
                    <div class="key">维修类别</div>
                    <div class="value">{{$Util.repairMethodFilter(detail.repair_method, $i18n.locale) || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">问题描述</div>
                    <div class="value">{{detail.desc || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">维修信息</div>
                    <div class="value">{{detail.repair_message || '-'}}</div>
                </div>
            </a-col>
            <a-col :xs='24' :sm='24' :lg='12' :xl='6' :xxl='6' class="info-block">
                <div class="info-item">
                    <div class="key">车架号</div>
                    <div class="value">{{detail.vehicle_no || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">对应商品</div>
                    <div class="value">
                        <a-button type="link" @click="routerChange()" style="height: 1em;" v-if="itemDetail.id">
                            {{itemDetail.name || '-'}}
                        </a-button>
                        <template v-else>-</template>
                    </div>
                </div>
                <div class="info-item">
                    <div class="key">行程公里数</div>
                    <div class="value">{{detail.travel_distance ? detail.travel_distance + '公里' : '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">到港时间</div>
                    <div class="value">{{$Util.timeFilter(detail.arrival_time)}}</div>
                </div>
            </a-col>
            <a-col :xs='24' :sm='24' :lg='12' :xl='6' :xxl='6' class="info-block">
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

            activeKey: 'RepairInfo',

            itemDetail: {},
        };
    },
    watch: {
        'detail.item_code': {
            immediate: true,
            handler(n) {
                console.log('watch detail.item_code n:', n)
                this.getItemDetail(n)
            }
        }
    },
    computed: {},
    mounted() {
    },
    methods: {
        routerChange() {
            let routeUrl = routeUrl = this.$router.resolve({
                path: this.$auth('ADMIN') ? "/item/item-detail" : '/purchase/item-display',
                query: { id: this.itemDetail.id }
            })
            window.open(routeUrl.href, '_blank')
        },
        getItemDetail(code) {
            Core.Api.Item.detailByCodeForRepair({code}).then(res => {
                console.log("getItemDetail res", res)
                this.itemDetail = res.detail || {}
            }).catch(err => {
                console.log('getItemDetail err', err)
            })
        }
    }
};
</script>

<style lang="less" scoped>
// #RepairInfo {}
</style>
