<!-- <template>
    <div class="test">
        <div class="number">
            {{number}}
        </div>
        <a-button class="add" @click="addNumber">添加</a-button>
        <a-button class="reset" @click="resetNumber">重置</a-button>
    </div>
</template>

<script setup>
    import useNumber from '@/hooks/useNumber'
    const props = defineProps({
        // ...
        type: {
            type: String,
            default: 'item'
        },
    })
    const {number,addNumber,resetNumber,type} = useNumber(props) //vue2中的minxins
    console.log(type)
</script>

<style lang="less">
    
</style> -->

<template>
    <div>
      <div style="margin-bottom: 16px">
        <a-button type="primary" :disabled="!hasSelected" :loading="loading" @click="start">
          Reload
        </a-button>
        <span style="margin-left: 8px">
          <template v-if="hasSelected">
            {{ `Selected ${selectedRowKeys.length} items` }}
          </template>
        </span>
      </div>
      <a-table
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        :data-source="data"
      />
    </div>
  </template>
  <script>
  import { computed, defineComponent, reactive, toRefs } from 'vue';
  const columns = [{
    title: 'Name',
    dataIndex: 'name',
  }, {
    title: 'Age',
    dataIndex: 'age',
  }, {
    title: 'Address',
    dataIndex: 'address',
  }];
  const data = [];
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      name: `Edward King ${i}`,
      age: 32,
      address: `London, Park Lane no. ${i}`,
    });
  }
  export default defineComponent({
    setup() {
      const state = reactive({
        selectedRowKeys: [],
        // Check here to configure the default column
        loading: false,
      });
      const hasSelected = computed(() => state.selectedRowKeys.length > 0);
      const start = () => {
        state.loading = true;
        // ajax request after empty completing
        setTimeout(() => {
          state.loading = false;
          state.selectedRowKeys = [];
        }, 1000);
      };
      const onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        state.selectedRowKeys = selectedRowKeys;
      };
      return {
        data,
        columns,
        hasSelected,
        ...toRefs(state),
        // func
        start,
        onSelectChange,
      };
    },
  });
  </script>
