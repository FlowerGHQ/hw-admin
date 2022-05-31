<template>
<div class="ItemHeader gray-panel">
    <div class="panel-content">
        <img :src="$Util.imageFilter(detail.logo ? detail.logo : '', 2)" />
        <div class="info-block">
            <p class="name">{{detail.name}}</p>
            <p class="model">{{ $t('i.number') }}：{{detail.model}}</p>
            <p class="spec" v-if="showSpec"><span>{{ $t('i.spec') }}：</span>{{attr_str}}</p>
            <p class="price">{{ $t('i.cost_price') }}：{{$Util.priceUnitFilter(detail.original_price_currency)}}{{$Util.countFilter(detail.original_price)}}</p>
        </div>
        <div class="status status-bg status-tag" :class="detail.status === 0 ? 'green' : 'red'">
            {{detail.status === 0 ? $t('i.active') : $t('i.inactive') }}
        </div>
    </div>
</div>
</template>

<script>
import Core from '../../../core';

export default {
    components: {},
    props: {
        detail: {
            type: Object,
            default: () => {return {}}
        },
        showSpec: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {}
    },
    computed: {
        attr_str() {
            let attr_list = this.detail.attr_list || []
            let attr_str = []
            for (const item of attr_list) {
                attr_str.push(item.value)
            }
            console.log('attr_str:', attr_str)
            return attr_str.join(' ')
        }
    },
    created() {},
    mounted() {},
    methods: {},
}
</script>

<style lang="less">
.ItemHeader {
    .panel-content {
        padding-bottom: 0 20px;
        display: flex;
        position: relative;
        img {
            width: 120px;
            height: 120px;
            object-fit: cover;
            background: #F3F3F3;
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
            line-height: 20px;
            .name {
                color: #111111;
                font-weight: 500;
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
                background: #F9F9F9;
                border-radius: 2px;
                padding: 0 10px;
                span {
                    color: #111111;
                }
            }
            .price {
                font-weight: 500;
                color: #F4752E;
                margin-top: 20px;
            }
        }
    }
}
</style>