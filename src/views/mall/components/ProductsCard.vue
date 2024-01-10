<template>
    <!-- 
        activeKey v-model 选中哪个值 示例 v-model:activeKey="activeKey1"
     -->
    <div id="products-card">
        <div class="img">
            <img :src="$Util.imageFilter(record.logo, 2)" alt="">
        </div>
        <div class="mes">
            <div class="mes-left">
                <div class="text">
                    <p class="title">{{ record[$Util.regionalUnitMoney().name_index] }}</p>
                    <p class="code">{{ record.code ? record.code : '-' }}</p>
                </div>
                <p class="favorites">
                    <svg-icon icon-class="favorites-icon" class-name="favorites-icon" />
                    <span class="favorites-text">Favorites</span>
                </p>
            </div>
            <div class="mes-right">
                <div class="text">
                    <p>{{ currency }} {{ currency === '€' ? $Util.countFilter(record.fob_eur) : $Util.countFilter(record.fob_usd) }} </p>
                </div>
                <div class="add">
                    <span class="count-edit">
                        <a-input-number v-model:value="editCount" :min="1" :precision="0" autofocus/>
                    </span>
                    <span class="car" @click="addCar(record)">
                        <svg-icon icon-class="car-icon" class-name="car-icon" />
                        <svg-icon icon-class="car-white-icon" class-name="car-white-icon" />
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import SvgIcon from "@/components/SvgIcon/index.vue";
import Core from '@/core';
import { ref ,onMounted, computed, getCurrentInstance } from 'vue';
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();

const store = useStore();
const props = defineProps({
    record:{
        type: Object,        
    },
})

const editCount = ref(1)
const currency = ref('€')
/* computed start */
const lang = computed(() => {
    return store.state.lang
})
/* computed end */
const emits = defineEmits(['update:activeKey','handlechange'])
onMounted(() => {
    if (Core.Data.getCurrency() === 'EUR'){
        currency.value =  "€"
    } else {
        currency.value =  "$"
    }
})
/* fetch start */
// 添加购物车
const addCar = (item) => {
    const params = {
          item_id: item.id,
          amount: editCount.value,
          price: currency.value === '€' ? item.fob_eur : item.fob_usd,
    }
    Core.Api.ShopCart.save({ ...params }).then(res => {
        proxy.$message.success(proxy.$t("i.add_success"));
        getShopCartList()
    })
}
// 获取购物车商品数量
const getShopCartList = () => {
    Core.Api.ShopCart.list().then(res => {
        proxy.$store.commit('setShopCartNum', res.count)
    })
}
/* fetch end */
</script>

<style lang="less" scoped>
#products-card {
    .flex(initial, initial, row);
    padding: 20px;
    background: #FFF;
    .img {
        width: 180px;
        height: 180px;
        border: 1px solid #D9D9D9;
        > img {
            height: 100%;
            width: 100%;
            object-fit: cover;
        }
    }
    .mes {
        .flex(space-between, initial, row);
        flex: 1;
        padding: 16px 20px 0px 24px;
        .mes-left {
            .flex(space-between, initial);
            .title {
                .ellipsis(1);
                color: #000;
                font-family: Montserrat;
                font-size: 16px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                margin-bottom: 16px;
            }
            .code {
                .ellipsis(2);
                color: #333;
                font-family: Montserrat;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
            }
            .favorites {
                .flex(initial, center, row);
                padding-bottom: 31px;
                .favorites-icon {
                    height: 18px;
                    width: 18px;
                }
                .favorites-text {
                    color: #000;
                    font-family: Montserrat;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 150%; /* 18px */
                    margin-left: 8px;
                }
            }
        }
        .mes-right {
            .flex(space-between, initial);
            .text > p {
                color: #000;
                font-family: Montserrat;
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                margin-bottom: 8px;
                &:last-child {
                    margin-bottom: 0;
                }
            }
            .add {
                .fcc();
                padding-bottom: 25px;
                .count-edit {
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
                                background: #F5F5F5;
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
                                visibility:visible;
                                height: 32px;
                                width: 32px;
                                background: #F5F5F5;
                                border: none;
                                position: absolute;
                                border: 0;
                                box-sizing: border-box;
                                &:hover {
                                    height: 32px !important;
                                    opacity: 0.7;
                                }
                                .anticon { display: none; }
                                &.ant-input-number-handler-down {
                                    left: 0;
                                    &::before {
                                        border-radius: 20px;
                                        display: inline-block;
                                        content: '';
                                        width: 12px;
                                        height: 1px;
                                        background: #1C1B1F;
                                        border-radius: 20px 20px 20px 20px;
                                        opacity: 1;
                                    }
                                }
                                &.ant-input-number-handler-up {
                                    right: 0;
                                    &::before, &::after {
                                        position: absolute;
                                        display: inline-block;
                                        content: '';
                                        background: #1C1B1F;
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
                    border: 1px solid #C6F;
                    cursor: pointer;
                    .car-white-icon {
                        display: none;
                    }
                    &:hover {
                        border: none;
                        background: linear-gradient(100deg, #C6F 0%, #66F 100%);
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
</style>