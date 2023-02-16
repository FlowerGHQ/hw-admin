<template>
    <div class="ReceiverAddress gray-panel no-margin">
        <div class="panel-title">
            <div class="title">{{ $t('d.balance_details') }}</div>
        </div>        
        <div class="panel-content">
            <!-- 筛选条件 -->
            <div class="search-container">
                <a-row class="search-area">                    
                    <!-- 来源 -->
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('d.source') }}:</div>
                        <div class="value">
                            <a-select  v-model:value="balanceForm.source" allowClear>
                                <a-select-option v-for="(val,key) in source_type" :key="key" :value="val.id">{{ val[$i18n.locale]  }}</a-select-option>                              
                            </a-select>
                        </div>
                    </a-col>
                    <!-- 工单编号 -->
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('d.repair_sn') }}:</div>
                        <div class="value">
                            <a-input  v-model:value="balanceForm.repair_sn" placeholder="请输入任务名称搜索" allowClear/>
                        </div>
                    </a-col>
                    <!-- 创建时间 -->
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('d.create_time') }}:</div>
                        <div class="value">
                            <TimeSearch @search="handleOtherSearch" ref='TimeSearchs'/>
                        </div>
                    </a-col>
                    <!-- 收/支 -->
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('d.Income_expenditure') }}:</div>
                        <div class="value">
                            <a-select v-model:value="balanceForm.Income_expenditure" allowClear>
                                <a-select-option value="1">全部</a-select-option>
                                <a-select-option value="lucy">收入</a-select-option>                                
                                <a-select-option value="lucy">支出</a-select-option>                                
                            </a-select>
                        </div>
                    </a-col>
                    <!-- 资金类型 -->
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <div class="key">{{ $t('d.capital_type') }}:</div>
                        <div class="value">
                            <a-select v-model:value="balanceForm.capital_type" allowClear>
                                <a-select-option value="1">全部</a-select-option>
                                <a-select-option value="lucy">余额</a-select-option>                                
                                <a-select-option value="lucy">充值</a-select-option>                                
                            </a-select>
                        </div>
                    </a-col>
                    
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-table 
                    :columns="tableColumns" 
                    :data-source="tableData" 
                    :scroll="{ x: true }" 
                    :row-key="record => record.id"
                >
                    <template #bodyCell="{ column, text , record }">                        
                    </template>
                </a-table>
            </div>
            <!-- <div class="paging-container">
                <a-pagination
                    v-model:current="currPage"
                    :page-size='pageSize'
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                    :hide-on-single-page='false'
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div> -->
        </div>
    </div>
</template>

<script setup>
import { computed, getCurrentInstance, ref } from 'vue';
import TimeSearch from '@/components/common/TimeSearch.vue'

const  source_type = {
    '1': {id: '1', zh: '全部', en: 'ALL'},
    '2': {id: '2', zh: '工单转入', en: 'Work order transfer'},
    '3': {id: '3', zh: '采购下单', en: 'Purchase order'},    
}

const {proxy} = getCurrentInstance();

const TimeSearchs = ref(null)  //组件的ref
const balanceForm = ref({
    source: "1",
    repair_sn: null,
    Income_expenditure: "1",
    capital_type: "1",
    begin_time: '',
    end_time: '',
})


// 计算属性
const  tableColumns = computed(() => {
    let columns = [
        {title: proxy.$t('d.source'), dataIndex: 'phone',key: 'item'},
        {title: proxy.$t('d.repair_sn'), dataIndex: 'name', key: 'item'},
        {title: proxy.$t('d.money'), dataIndex: 'country',key: 'item'},
        {title: proxy.$t('d.Income_expenditure'), dataIndex: 'address', key: 'address'},
        {title: proxy.$t('d.capital_type'), dataIndex: 'create_time', key: 'time'},                
        {title: proxy.$t('d.account_balance'), dataIndex: 'create_time', key: 'time'},                
        {title: proxy.$t('d.create_time'), dataIndex: 'create_time', key: 'time'},                
    ]
    return columns
})

// methods
// 时间组件事件
const handleOtherSearch = (item) => {
    console.log(item);
    for (const key in item) {
        balanceForm.value[key] = item[key]
    }
    console.log(balanceForm.value);
}
// 查询
const handleSearch = () => {}

// 重置
const handleSearchReset = () => {}
</script>

<style lang="less" scoped>
//.ReceiverAddress {}
</style>
