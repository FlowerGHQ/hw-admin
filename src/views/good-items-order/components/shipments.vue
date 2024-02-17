<template>
    <a-button type="link" @click="isShowShip('ship')">
        {{ $t(/* 发货 */ 'p.ship') }}
    </a-button>
    <!-- 发货 -->
    <a-modal v-model:visible="isShow" :title="$t(/* 发货 */ 'p.ship')">
        <div class="content">
            <div class="text-warn">
                <svg
                    class="icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.00033 12.3333C9.94584 12.3333 12.3337 9.94548 12.3337 6.99996C12.3337 4.05444 9.94585 1.66663 7.00033 1.66663C4.05481 1.66663 1.66699 4.05444 1.66699 6.99996C1.66699 9.94548 4.05481 12.3333 7.00033 12.3333ZM13.667 6.99996C13.667 10.6819 10.6822 13.6666 7.00033 13.6666C3.31843 13.6666 0.333658 10.6819 0.333659 6.99996C0.333659 3.31806 3.31843 0.333291 7.00033 0.333291C10.6822 0.333292 13.667 3.31806 13.667 6.99996ZM6.33366 10.3333L6.33366 8.99994L7.66699 8.99994L7.66699 10.3333L6.33366 10.3333ZM7.66699 3.66661L7.66699 8.33327L6.33366 8.33327L6.33366 3.66661L7.66699 3.66661Z"
                        fill="#F77234"
                    />
                </svg>
                {{ $t('item_order.tracking_courier_company_warn_text') }}
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('af.courier_number') }}:</div>
                <div class="value">
                    <a-input v-model:value="shipObj.uid" :placeholder="$t('item_order.fill_tracking_number')" />
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('af.courier') }}:</div>
                <div class="value">
                    <a-input
                        v-model:value="shipObj.company"
                        :placeholder="$t('item_order.fill_name_courier_company')"
                    />
                </div>
            </div>
        </div>
        <template #footer>
            <a-button @click="isShowShip('cancle')"> 取消 </a-button>
            <a-button type="primary" @click="shipHandleOk"> 提交 </a-button>
        </template>
    </a-modal>
</template>

<script setup>
import Core from '@/core';
import { computed, getCurrentInstance, onMounted, reactive, ref, toRaw } from 'vue';
/**inject
 *用法:更新订单列表tab-length
 *这里emit('refesh');更新了父组件列表，
 *父组件更新了订单列表tab-length,
 *所以注释掉暂时不用
 */
// const tabNumber = inject('tabNumber');
const { proxy } = getCurrentInstance();
const props = defineProps({
    id: {
        type: [String, Number],
    },
});
const emit = defineEmits(['refesh']);
const isShow = ref(false);
// 发货参数对象
const shipObj = ref({
    uid: '', // 快递单号
    company: '', // 快递公司
});
// 显示发货弹窗
const isShowShip = type => {
    if (type === 'ship') {
        isShow.value = true;
    } else if (type === 'cancle') {
        isShow.value = false;
    }
};
// 提交发货
const shipHandleOk = () => {
    let obj = {};
    obj = { ...shipObj.value, target_id: props.id };
    if (!obj.uid) {
        return proxy.$message.warning(proxy.$t('def.enter'));
    } else if (!obj.company) {
        return proxy.$message.warning(proxy.$t('def.enter'));
    }
    Core.Api.GoodItemsOrder.updateTrackingNumber(obj)
        .then(res => {
            proxy.$message.success(proxy.$t('p.shipped'));
        })
        .catch(err => {
            console.log('getTableData err:', err);
        })
        .finally(() => {
            emit('refesh');
            /* 暂时不用 */
            // if (tabNumber) tabNumber();
        });
};
</script>

<style lang="less" scoped>
.text-warn {
    color: #ff7d00;
    font-size: 14px;
    font-weight: 400;
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    .icon {
        margin-right: 4px;
        line-height: 20px;
        height: 20px;
    }
}
</style>
