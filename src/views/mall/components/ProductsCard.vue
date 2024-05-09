<template>
    <!-- 
        activeKey v-model 选中哪个值 示例 v-model:activeKey="activeKey1"
     -->
    <div id="products-card" :class="[type, selected ? 'active' : '']">
        <div class="img">
            <a-image :src="$Util.imageFilter(record.logo, 5)" />
        </div>
        <div class="mes">
            <div class="mes-left">
                <div class="text">
                    <p class="title">{{ record[$Util.regionalUnitMoney().name_index] }}</p>
                    <p class="code">{{ record.code ? record.code : '-' }}</p>
                </div>
                <template v-if="showOperation">
                    <p class="favorites" @click="addFavorites(record)">
                        <svg-icon icon-class="collected-icon" class-name="favorites-icon" v-if="record.in_favorite" />
                        <svg-icon icon-class="favorites-icon" class-name="favorites-icon" v-else />
                        <span class="favorites-text">{{ $t('mall.favorites') }}</span>
                    </p>
                </template>
            </div>
            <div class="mes-right">
                <div class="text">
                    <template v-if="record.type === Core.Const.ITEM.TYPE.PRODUCT">
                        <p class="price-text">40QH : {{ currency }}{{ stepPrice['40qh'] }}</p>
                        <p class="price-text-t">
                            Samples : {{ currency }}{{ stepPrice['normal'] }} / 20GP : {{ currency
                            }}{{ stepPrice['20gp'] }}
                        </p>
                        <p class="dosage">{{ $t('mall.dosage') }}: {{ record.amount }}</p>
                    </template>
                    <template v-else>
                        <p class="price-text">{{ currency }}{{ price }}</p>
                        <p class="dosage">{{ $t('mall.dosage') }}: {{ record.amount }}</p>
                    </template>
                </div>
                <template v-if="showOperation">
                    <div class="add">
                        <span class="count-edit">
                            <span class="min-count">{{ $t('mall.min_order_quantity') }} {{ stepMinPrice }}</span>
                            <a-input-number
                                v-model:value="editCount"
                                :min="stepMinPrice"
                                :max="99999"
                                :step="stepMinPrice"
                                :precision="0"
                                autofocus
                            />
                        </span>
                        <span class="car" @click="addCar(record)">
                            <svg-icon icon-class="car-icon" class-name="car-icon" />
                            <svg-icon icon-class="car-white-icon" class-name="car-white-icon" />
                        </span>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import SvgIcon from '@/components/SvgIcon/index.vue';
import Core from '@/core';
import { ref, onMounted, computed, getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();

const props = defineProps({
    selected: {
        type: Boolean,
        default: false,
    },
    record: {
        type: [Object, String],
    },
    // 是否可以取消收藏
    canRemoveFavorites: {
        type: Boolean,
        default: false,
    },
    //类型
    type: {
        type: String,
        default: 'default',
    },
    // 是否可以取消收藏
    showOperation: {
        type: Boolean,
        default: true,
    },
});

const editCount = ref(props.record.type === Core.Const.ITEM.TYPE.COMPONENT ? props.record?.min_purchase_amount : 1);
const currency = ref('€');
const paramPrice = ref(false);
/* computed start */
const stepPrice = computed(() => {
    return {
        '40qh': proxy.$Util.countFilter(props.record[proxy.$Util.Number.getStepPriceIndex('40qh')]),
        '20gp': proxy.$Util.countFilter(props.record[proxy.$Util.Number.getStepPriceIndex('20gp')]),
        normal: proxy.$Util.countFilter(props.record[proxy.$Util.Number.getStepPriceIndex()]),
    };
});
const price = computed(() => {
    return proxy.$Util.countFilter(props.record[proxy.$Util.Number.getPriceIndex()]);
});
const stepMinPrice = computed(() => {
    return props.record.type === Core.Const.ITEM.TYPE.COMPONENT ? props.record?.min_purchase_amount : 1;
});
/* computed end */
const emits = defineEmits(['handlechange']);
onMounted(() => {
    if (Core.Data.getCurrency() === 'EUR') {
        currency.value = '€';
        paramPrice.value = false;
    } else {
        currency.value = '$';
        paramPrice.value = true;
    }
});
/* fetch start */
// 添加购物车
const addCar = item => {
    const params = {
        item_id: item.id,
        amount: editCount.value,
        price: currency.value === '€' ? item.fob_eur : item.fob_usd,
    };
    Core.Api.ShopCart.save({ ...params }).then(res => {
        proxy.$message.success(proxy.$t('i.add_success'));
        getShopCartList();
    });
};
// 获取购物车商品数量
const getShopCartList = () => {
    Core.Api.ShopCart.list().then(res => {
        proxy.$store.commit('setShopCartNum', res.count);
    });
};
// 添加收藏
const addFavorites = async item => {
    if (item.in_favorite) {
        if (props.canRemoveFavorites) {
            return removeFavorites(item);
        } else {
            return proxy.$message.warning(proxy.$t('i.item_favorite'));
        }
    }
    try {
        if (paramPrice.value) {
            await Core.Api.Favorite.add({ item_id: item.id, price: item?.fob_eur });
        } else {
            await Core.Api.Favorite.add({ item_id: item.id, price: item?.fob_usd });
        }
        proxy.$message.success(proxy.$t('pop_up.operate'));
    } catch (err) {
        console.log('handleMoveToFavorite err:', err);
    } finally {
        // 重新获取列表数据
        emits('handlechange');
    }
};
// 删除收藏
const removeFavorites = item => {
    Core.Api.Favorite.remove({ id: item?.favorite_id }).then(() => {
        proxy.$message.success(proxy.$t('pop_up.move'));
        // 重新获取列表数据
        emits('handlechange');
    });
};
/* fetch end */
</script>

<style lang="less" scoped>
#products-card {
    .flex(initial, initial, row);
    padding: 20px;
    background: #fff;
    border: 2px solid transparent;

    .img {
        border: 1px solid #d9d9d9;

        :deep(.ant-image) {
            height: 100%;
            width: 100%;

            .ant-image-img {
                height: 100%;
                width: 100%;
                object-fit: cover;
            }
        }
    }

    .mes {
        .flex(space-between, initial, row);
        flex: 1;

        .mes-left {
            .flex(space-between, initial);

            .title {
                .ellipsis(1);
                color: #000;
                font-size: 16px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
            }

            .code {
                .ellipsis(2);
                color: #333;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
            }

            .favorites {
                .flex(initial, center, row);
                cursor: pointer;

                .favorites-icon {
                    height: 18px;
                    width: 18px;
                }

                .favorites-text {
                    color: #000;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 150%;
                    /* 18px */
                    margin-left: 8px;
                }
            }
        }

        .mes-right {
            .flex(space-between, initial);

            .text > p {
                color: #000;
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                text-align: right;

                &:last-child {
                    margin-bottom: 0;
                }

                &:first-child {
                    color: #8f00ff;
                    text-align: right;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: normal;
                }
            }
            .text {
                .price-text-t {
                    color: #8e8e8e;
                    text-align: right;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 150%;
                    /* 18px */
                }
                .dosage {
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 18px;
                    color: #333;
                }
            }
            .add {
                .fcc();
                .count-edit {
                    position: relative;
                    .min-count {
                        position: absolute;
                        font-size: 12px;
                        line-height: 18px;
                        color: #999;
                        left: -12px;
                        bottom: 0;
                        transform: translateX(-100%);
                    }
                    /deep/.ant-input-number {
                        width: 136px;
                        box-shadow: 0 0 0 0;
                        border: 0;
                        position: relative;
                        text-align: center;

                        .ant-input-number-input-wrap {
                            padding: 0 40px;

                            .ant-input-number-input {
                                padding: 0 4px;
                                display: inline-flex;
                                align-items: center;
                                text-align: center;
                                background: #f5f5f5;
                                height: 32px;
                            }
                        }

                        .ant-input-number-handler-wrap {
                            width: 0;
                            height: 0;
                            position: static;
                            opacity: 1;
                            visibility: hidden;

                            .ant-input-number-handler {
                                .fcc();
                                visibility: visible;
                                height: 32px;
                                width: 32px;
                                background: #f5f5f5;
                                border: none;
                                position: absolute;
                                border: 0;
                                box-sizing: border-box;

                                &:hover {
                                    height: 32px !important;
                                    opacity: 0.7;
                                }

                                .anticon {
                                    display: none;
                                }

                                &.ant-input-number-handler-down {
                                    left: 0;

                                    &::before {
                                        border-radius: 20px;
                                        display: inline-block;
                                        content: '';
                                        width: 12px;
                                        height: 1px;
                                        background: #1c1b1f;
                                        border-radius: 20px 20px 20px 20px;
                                        opacity: 1;
                                    }
                                }

                                &.ant-input-number-handler-up {
                                    right: 0;

                                    &::before,
                                    &::after {
                                        position: absolute;
                                        display: inline-block;
                                        content: '';
                                        background: #1c1b1f;
                                        border-radius: 20px;
                                    }

                                    &::before {
                                        width: 12px;
                                        height: 1px;
                                    }

                                    &::after {
                                        height: 12px;
                                        width: 1px;
                                    }
                                }
                            }
                        }
                    }
                }

                .car {
                    .fcc();
                    margin-left: 16px;
                    width: 32px;
                    height: 32px;
                    border: 1px solid #c6f;
                    background: transparent;
                    background: linear-gradient(100deg, #c6f 0%, #66f 100%);
                    border-image: linear-gradient(100deg, #c6f 0%, #66f 100%) 1;
                    background-clip: text;
                    -webkit-background-clip: text;
                    cursor: pointer;

                    .car-icon,
                    .car-white-icon {
                        width: 18px;
                        height: 18px;
                    }

                    .car-white-icon {
                        display: none;
                    }

                    &:hover {
                        border: none;
                        background: linear-gradient(100deg, #c6f 0%, #66f 100%);

                        .car-icon {
                            display: none;
                        }

                        .car-white-icon {
                            display: inline-block;
                        }
                    }
                }
            }
        }
    }
}

.default {
    .img {
        width: 180px;
        height: 180px;
    }

    .mes {
        padding: 16px 20px 0px 24px;

        .mes-left {
            .text {
                .title {
                    margin-bottom: 16px;
                }
            }

            .favorites {
                margin-bottom: 31px;
            }
        }

        .mes-right {
            .text > p {
                margin-bottom: 8px;
            }

            .add {
                padding-bottom: 25px;
            }
        }
    }
}

#products-card.small {
    .img {
        width: 90px;
        height: 90px;
        border-color: #eee;
    }

    .mes {
        padding: 0 0 0 20px;

        .mes-left {
            .text {
                .title {
                    margin-bottom: 4px;
                }
            }

            .favorites {
                margin-bottom: 0px;
            }
        }

        .mes-right {
            .text > p {
                margin-bottom: 4px;
            }

            .add {
                padding-bottom: 0px;

                .count-edit {
                    /deep/.ant-input-number {
                        .ant-input-number-handler-wrap {
                            .ant-input-number-handler {
                                &.ant-input-number-handler-down {
                                    &::before {
                                        width: 10px;
                                    }
                                }

                                &.ant-input-number-handler-up {
                                    &::before {
                                        width: 10px;
                                    }

                                    &::after {
                                        height: 10px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

.active {
    border: 2px solid #9167ff !important;
}
</style>
