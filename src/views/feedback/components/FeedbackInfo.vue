<template>
<a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
    <template #expandIcon ><i class="icon i_expan_l"/> </template>
    <a-collapse-panel key="RepairInfo" :header="$t('n.detailed_information')" class="gray-collapse-panel">
        <a-row class="panel-content info-container">
            <a-col :xs='24' :sm='24' :lg='12' :xl='6' :xxl='6' class="info-block">
                <div class="info-item">
                    <div class="key">{{ $t('fe.source_uid') }}</div>
                    <div class="value">
                    <template v-if="detail.source_type === Core.Const.FEEDBACK.SOURCE_TYPE.REPAIR_ORDER ">
                        <a-button @click="routerChange('repair_order')" type="link"> {{detail.source_uid || '-'}}</a-button>
                    </template>
                    <template v-else>
                        {{ '-'}}
                    </template>
                    </div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('fe.feedback_title') }}</div>
                    <div class="value">{{detail.title || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('fe.feedback_desc') }}</div>
                    <div class="value">{{detail.desc || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('search.vehicle_no') }}</div>
                    <div class="value">{{detail.entity_uid || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key"></div>
                    <div class="value"></div>
                </div>
            </a-col>
            <a-col :xs='24' :sm='24' :lg='12' :xl='6' :xxl='6' class="info-block">

                <div class="info-item">
                    <div class="key">{{ $t('r.item_name') }}</div>
                    <div class="value">
<!--                        <a-button type="link" @click="routerChange()" style="height: 1em;" v-if="itemDetail.id">-->
<!--                            {{itemDetail.name || '-'}}-->
<!--                        </a-button>-->
                      {{itemDetail.name || '-'}}
<!--                        <template v-else>-</template>-->
                    </div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('r.miles_driven') }}</div>
                    <div class="value">{{detail.travel_distance ? detail.travel_distance + 'km' : '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('r.arrival_time') }}</div>
                    <div class="value">{{$Util.timeFilter(detail.arrival_time)}}</div>
                </div>
                <div class="info-item">
                    <div class="key">购买时间</div>
                    <div class="value">{{$Util.timeFilter(detail.sale_time)}}</div>
                </div>
            </a-col>
            <a-col :xs='24' :sm='24' :lg='12' :xl='6' :xxl='6' class="info-block">
                <div class="info-item">
                    <div class="key">{{ $t('r.associated_customers') }}</div>
                    <div class="value">{{detail.customer_name || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('r.customer_phone') }}</div>
                    <div class="value">{{detail.customer_phone || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('r.email') }}</div>
                    <div class="value">{{detail.customer_email || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('r.address') }}</div>
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
            Core,
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
        routerChange(type) {
            let routeUrl = ''
            switch (type) {
                case 'repair_order':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-detail",
                        query: {id: this.detail.source_id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
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
