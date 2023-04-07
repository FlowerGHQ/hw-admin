<template>
  <a-steps :current="current">
    <a-step v-for="item in stepsList" :key="item.status">
      <template #title>{{item[$i18n.locale]}}</template>
      <template #description>
        <!-- <div class="time">{{ $Util.timeFilter(item.time) || '2023-03-29  25:07:42' }}</div> -->
        <template v-if="item.status === '100'">
            <div class="status status-bg status-tag" :class="$Util.paymentStatusFilter(payment_status,'color')">
                {{$Util.paymentStatusFilter(payment_status, $i18n.locale)}}
            </div>
        </template>
       <template v-if="item.status === '200'">
            <div class="status status-bg status-tag" :class="$Util.purchaseStatusFilter(status,'color')" >
                {{$Util.purchaseStatusFilter(status, $i18n.locale)}}
            </div>
      </template>
      <template v-if="item.status === Core.Const.PURCHASE.STATUS.WAIT_TAKE_DELIVER + ''">
            <span class="time">{{ $t('p.receipt_message') }}</span>
      </template>

      </template>
    </a-step>
  </a-steps>
</template>

<script>
import Core from '../../../core';
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
    mounted() {
          console.log('hhh',this.status);
          console.log('aaa',this.payment_status);
    },
    data(){
      return {
        Core,
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