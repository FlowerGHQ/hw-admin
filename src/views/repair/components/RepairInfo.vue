<template>
    <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
        <template #expandIcon><i class="icon i_expan_l" /> </template>
        <a-collapse-panel key="RepairInfo" :header="$t('n.detailed_information')" class="gray-collapse-panel">
            <a-row class="panel-content info-container">
                <a-col :xs="24" :sm="24" :lg="12" :xl="6" :xxl="6" class="info-block">
                    <div class="info-item">
                        <div class="key">{{ $t('r.warranty') }}</div>
                        <div class="value">
                            {{ $Util.repairServiceFilter(detail.service_type, $i18n.locale || '-') }}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="key">{{ $t('r.repair_name') }}</div>
                        <div class="value">{{ detail.name || '-' }}</div>
                    </div>
                    <!-- 工单类别 -->
                    <div class="info-item">
                        <div class="key">{{ $t('r.device_classify') }}</div>
                        <div class="value">{{ $Util.repairTypeFilter(detail.device_type, $i18n.locale) }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">{{ $t('r.remark') }}</div>
                        <div class="value">{{ detail.remark || '-' }}</div>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="24" :lg="12" :xl="6" :xxl="6" class="info-block">
                    <div class="info-item">
                        <div class="key">{{ $t('r.repair_way') }}</div>
                        <div class="value">{{ $Util.repairChannelFilter(detail.channel, $i18n.locale) }}</div>
                    </div>
                    <!-- 维修类别 -->
                    <div class="info-item">
                        <div class="key">{{ $t('r.repair_category') }}</div>
                        <div class="value">
                            <span v-if="detail?.device_type == DEVICE_MAP.vehicle">
                                {{ $Util.repairMethodFilter(detail?.repair_method, $i18n.locale) || '-' }}
                            </span>
                            <span v-else>
                                {{ '-' }}
                            </span>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="key">{{ $t('r.description') }}</div>
                        <div class="value">{{ detail.desc || '-' }}</div>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="24" :lg="12" :xl="6" :xxl="6" class="info-block">
                    <div class="info-item">
                        <div class="key">{{ $t('search.vehicle_no') }}</div>
                        <div class="value">{{ detail.vehicle_no || '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">{{ $t('r.item_name') }}</div>
                        <div class="value">
                            <a-button
                                type="link"
                                @click="routerChange(itemDetail.id)"
                                style="height: 1em"
                                v-if="itemDetail.id"
                            >
                                {{ itemDetail.name || '-' }}
                            </a-button>
                            <template v-else>-</template>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="key">{{ $t('r.miles_driven') }}</div>
                        <div class="value">{{ detail.mileage ? detail.mileage + 'km' : '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">{{ $t('r.arrival_time') }}</div>
                        <div class="value">
                            {{
                                $Util.timeFilter(
                                    detail?.vehicle?.arrival_time ? detail?.vehicle?.arrival_time : detail.arrival_time,
                                )
                            }}
                        </div>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="24" :lg="12" :xl="6" :xxl="6" class="info-block">
                    <div class="info-item">
                        <div class="key">{{ $t('r.associated_customers') }}</div>
                        <div class="value">{{ detail.customer_name || '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">{{ $t('r.customer_phone') }}</div>
                        <div class="value">{{ detail.customer_phone || '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">{{ $t('r.email') }}</div>
                        <div class="value">{{ detail.customer_email || '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">{{ $t('r.address') }}</div>
                        <div class="value">
                            {{ detail.province + detail.city + detail.county + detail.customer_address || '-' }}
                        </div>
                    </div>
                </a-col>
            </a-row>
        </a-collapse-panel>
    </a-collapse>
</template>

<script>
import Core from '../../../core';

const REPAIR = Core.Const.REPAIR;
export default {
    name: 'RepairInfo',
    components: {},
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
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            activeKey: 'RepairInfo',

            itemDetail: {},

            DEVICE_MAP: REPAIR.DEVICE_MAP, // 整车还是零配件
        };
    },
    watch: {
        'detail.item_code': {
            immediate: true,
            handler(n) {
                console.log('watch detail.item_code n:', n);
                this.getItemDetail(n);
            },
        },
    },
    computed: {},
    mounted() {},
    methods: {
        routerChange() {
            let routeUrl = this.$router.resolve({
                path: this.$auth('ADMIN') ? '/item/item-detail' : '/purchase/item-display',
                query: { id: this.itemDetail.id },
            });
            window.open(routeUrl.href, '_blank');
        },
        getItemDetail(code) {
            Core.Api.Item.detailByCodeForRepair({ code })
                .then(res => {
                    console.log('getItemDetail res', res);
                    this.itemDetail = res.detail || {};
                })
                .catch(err => {
                    console.log('getItemDetail err', err);
                });
        },
    },
};
</script>

<style lang="less" scoped>
// #RepairInfo {}
</style>
