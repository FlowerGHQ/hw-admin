<template>
    <div class="payment-setting gray-panel no-margin">
        <div class="panel-title">
            <div class="title">{{ /*支付设置*/ $t('distributor-detail.payment_settings') }}</div>
        </div>
        <div class="panel-content">
            <div class="content-area-list">
                {{ $t('distributor-detail.payment_tips') }}
                <a-input-number
                    :placeholder="$t('distributor-detail.please_enter_0_100')"
                    :min="0"
                    :max="100"
                    :step="1"
                    :precision="0"
                    v-model:value="value"
                    addon-after="%"
                />
                <a-button type="primary">{{ $t('retail.confirm') }}</a-button>
            </div>
            <!-- 操作记录 按钮-->
            <div class="opreation">
                <!-- 确定按钮 -->
                <div class="line-item">
                    {{ $t('distributor-detail.operation_record') }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const $t = useI18n().t;
const value = ref(undefined);
</script>

<style lang="less" scoped>
.panel-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .content-area-list {
        display: flex;
        align-items: center;
        .ant-input-number-group-wrapper {
            margin-left: 16px;
            margin-right: 16px;
        }
    }
    .opreation {
        .line-item {
            color: #1890ff;
            cursor: pointer;
            text-decoration: underline;
        }
    }
}
</style>
