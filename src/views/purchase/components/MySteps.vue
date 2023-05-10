<template>
  <a-steps :current="current">
    <a-step v-for="item in stepsList" :key="item.status">
      <template #title>{{item[$i18n.locale]}}</template>
      <template #description>  
		<!-- 审核 -->
        <template v-if="item.status === '60'">
            <div class="status status-bg status-tag" :class="$Util.purchaseStatusFilter(status,'color')">                
                {{$Util.StatusFilter(status, examine_status, $i18n.locale)}}
            </div>
        </template>
		<!-- 支付 -->
        <template v-if="item.status === '100'">
            <div class="status status-bg status-tag" :class="$Util.paymentStatusFilter(payment_status,'color')">
                {{$Util.paymentStatusFilter(payment_status, $i18n.locale)}}
            </div>
        </template>
		<!-- 发货 -->
       <template v-if="item.status === '200'">
            <!-- <div class="status status-bg status-tag" :class="$Util.purchaseStatusFilter(status,'color')">	                
                {{ $Util.StatusFilter(status, goods_status, $i18n.locale, 'finally') }}
            </div> -->
      </template>
	  <!-- 收货 -->
      <template v-if="item.status === '300'">
            <span class="time">{{ $t('p.receipt_message') }}</span>
      </template>

      </template>
    </a-step>
  </a-steps>
</template>

<script>
import Core from '@/core';

export default {
    props: {
        stepsList: {
            type: Array,
            default: []
        },
        current: {
            type: Number,
            default: 0
        },
        status: {
            type: Number,
            default: 0
        },
        payment_status: {
            type: Number,
            default: 0
        },

    },
    mounted() {},
    data(){
      return {
        Core,
		goods_status:Core.Const.PURCHASE.goods_status,  // 发货状态
		examine_status:Core.Const.PURCHASE.examine_status, // 审核状态
      }
    }
}
</script>

<style scoped>
.time{
    white-space:nowrap
}
.status{
  padding: 2px 5px;
  border-radius: 4px;
}
</style>