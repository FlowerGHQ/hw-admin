<template>
    <div class="ItemHeader gray-panel">
        <div class="panel-content">
            <img :src="$Util.imageFilter(detail.logo ? detail.logo : '', 2)" />
            <div class="info-block">
                <div class="name">
                    <p>
                        {{ $i18n.locale == 'zh' ? detail.name : detail.name_en }}
                    </p>
                    <!-- <p>{{ $t('i.number') }}：{{detail.model}}</p> -->
                    <!-- <span v-if="SOURCE_STOCK_TYPE[detail?.sync_type]?.value == 'ERP'" class="source-erp">
                    {{ SOURCE_STOCK_TYPE[detail?.sync_type].value }}
                </span> -->
                </div>
                <div class="info">
                    <div class="info-item">
                        <span class="info-key">{{ $t('i.code') }}</span>
                        <span class="info-value">{{ detail.code || '-' }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-key">{{ $t('n.type') }}</span>
                        <span class="info-value">{{ $Util.itemTypeFilter(detail.type, $i18n.locale) }}</span>
                    </div>
                    <div class="info-item">
                        <div class="info-key">{{ $t('i.categories') }}</div>
                        <div class="info-value">
                            <span v-for="(category, index) in detail.category_list">
                                <span v-if="index !== 0">,</span
                                >{{ $i18n.locale == 'zh' ? category.category_name : category.category_name_en }}
                            </span>
                        </div>
                    </div>
                    <!-- <div class="info-item">
                    <span class="info-key">{{ $t('n.flag_entity') }}</span>
                    <span class="info-value">{{ $Util.itemFlagEntityFilter(detail.flag_entity, $i18n.locale) }}</span>
                </div> -->
                </div>
                <!-- <div class="model">
                <span v-if="SOURCE_STOCK_TYPE[detail?.sync_type]?.value == 'ERP'" style="margin-left: 25px;">
                    {{ $t("i.synchronization_time") }}：{{ $Util.timeFilter(detail.sync_time) || "-" }}
                </span>
            </div>
            <div v-if="showSpec" class="spec" ><span>{{ $t('i.spec') }}：</span>{{attr_str}}</div>
            <div class="price">{{ $t('i.cost_price') }}：{{$Util.priceUnitFilter(detail.original_price_currency)}}{{$Util.countFilter(detail.original_price)}}</div> -->
            </div>
            <!-- <div class="status status-bg status-tag" :class="detail.status === 0 ? 'green' : 'red'">
            {{detail.status === 0 ? $t('i.active') : $t('i.inactive') }}
        </div> -->
        </div>
    </div>
</template>

<script>
import Core from '../../../core';
const ITEM = Core.Const.ITEM;

export default {
    components: {},
    props: {
        detail: {
            type: Object,
            default: () => {
                return {};
            },
        },
        showSpec: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            SOURCE_STOCK_TYPE: ITEM.SOURCE_STOCK_TYPE, // 来源类型
        };
    },
    computed: {
        attr_str() {
            let attr_list = this.detail.attr_list || [];
            let attr_str = [];
            for (const item of attr_list) {
                attr_str.push(item.value);
            }
            console.log('attr_str:', attr_str);
            return attr_str.join(' ');
        },
    },
    created() {},
    mounted() {},
    methods: {},
};
</script>

<style lang="less">
.ItemHeader {
    .panel-content {
        padding: 0;
        display: flex;
        position: relative;
        background-color: #f8fafc;
        img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            background: #f3f3f3;
            border-radius: 4px 4px 4px 4px;
            margin-right: 20px;
        }
        > .status {
            position: absolute;
            top: 15px;
            right: 20px;
            padding: 0 6px;
            border-radius: 2px;
        }
        .info-block {
            font-size: 14px;
            .name {
                display: flex;
                align-items: center;
                margin-bottom: 16px;
                > p {
                    &:nth-child(1) {
                        color: #1d2129;
                        font-size: 18px;
                        font-weight: 600;
                        margin-right: 10px;
                    }
                    &:nth-child(2) {
                        border-radius: 4px;
                        padding: 2px 10px;
                        background-color: #efefef;
                        color: #666;
                        font-size: 14px;
                    }
                }
            }
            .model {
                color: #757575;
                margin-top: 6px;
            }
            .spec {
                color: #757575;
                line-height: 26px;
                margin-top: 6px;
                height: 26px;
                background: #f9f9f9;
                border-radius: 2px;
                span {
                    color: #111111;
                }
            }
            .price {
                font-weight: 500;
                color: #f4752e;
                margin-top: 6px;
            }

            .source-erp {
                display: inline-block;
                width: 36px;
                height: 18px;
                line-height: 18px;
                text-align: center;
                background-color: #ffebea;
                color: #f92e25;
                border-radius: 30px;
                font-size: 12px;
                margin-left: 5px;
            }
            .info {
                display: flex;
                flex-wrap: wrap;
                .info-item {
                    display: flex;
                    align-items: center;
                    margin-right: 23px;
                    margin-bottom: 4px;
                    .info-key {
                        color: #666;
                        font-size: 14px;
                        padding-right: 10px;
                        &::after {
                            content: '：';
                        }
                    }
                    .info-value {
                        color: #1d2129;
                        font-size: 14px;
                        min-width: 189px;
                    }
                }
            }
        }
    }
}
.gray-panel {
    padding: 20px;
}
</style>
