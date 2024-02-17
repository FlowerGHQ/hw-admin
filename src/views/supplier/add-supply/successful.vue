<template>
    <div class="submit-success">
        <div class="container">
            <div class="icon">
                <img class="icon-img" src="../../../assets//images/supply-chain/suceess.png" alt="" />
            </div>
            <div class="title">
                {{ $t('supply-chain.information_submitted_successfully') }}
            </div>

            <div class="btn" @click="onBtn">
                <a-button>{{ $t('supply-chain.view_or_edit_data') }}</a-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
const $store = useStore();

// 跳转
const onBtn = async () => {
    $store.dispatch('SUPPLY_CHAIN/setStep', 0);
};
</script>

<style lang="less" scoped>
.submit-success {
    flex: 1;
    background-color: #fff;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: calc(100% - 80px);
    height: calc(100% - 40px);
    .container {
        .icon {
            .icon-img {
                width: 101px;
                height: 77px;
            }
        }
        .title {
            color: #26ab54;
            font-size: 18px;
            font-weight: 500;
            line-height: 22px; /* 122.222% */
        }
        .sub-title {
            margin-top: 5px;
            color: #666;
            font-size: 12px;
            font-weight: 400;
            line-height: 22px; /* 183.333% */
            .timing {
                color: #26ab54;
            }
        }
        .btn {
            margin-top: 16px;
        }
    }
}
</style>
