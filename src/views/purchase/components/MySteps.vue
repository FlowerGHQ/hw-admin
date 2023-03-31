<template>
  <a-steps :current="current">
    <a-step v-for="item in stepsList" :key="item.status">
      <!-- <span slot="title">Finished</span> -->
      <template #title>{{item[$i18n.locale]}}</template>
      <template #description>
       <div class="time">{{ $Util.timeFilter(item.time) || '2023-03-29  25:07:42' }}</div>
       <div>全额付款</div>
      </template>
    </a-step>
  </a-steps>
</template>

<script>
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
    },
}
</script>

<style>
.time{
    white-space:nowrap
}
</style>