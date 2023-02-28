<template>
    <div class="vehicle_dispose">
        <!-- 筛选条件 -->
        <div class="search-container">
            <a-row class="search-area">                    
                <!-- 发送目标 -->
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">{{$t('dis.send_target')}}:</div>
                    <div class="value">
                        <a-select  v-model:value="mailForm.source_type" allowClear>
                            <a-select-option v-for="(val,key) in source_type" :key="key" :value="val.id">{{ val[$i18n.locale]  }}</a-select-option>                              
                        </a-select>
                    </div>
                </a-col>
                <!-- 语言 -->
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">{{$t('dis.language')}}:</div>
                    <div class="value">
                        <a-select  v-model:value="mailForm.source_type" allowClear>
                            <a-select-option v-for="(val,key) in source_type" :key="key" :value="val.id">{{ val[$i18n.locale]  }}</a-select-option>                              
                        </a-select>
                    </div>
                </a-col>
                <!-- 邮箱用途 -->
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">{{$t('dis.mailbox_purpose')}}:</div>
                    <div class="value">
                        <a-select  v-model:value="mailForm.source_type" allowClear>
                            <a-select-option v-for="(val,key) in source_type" :key="key" :value="val.id">{{ val[$i18n.locale]  }}</a-select-option>                              
                        </a-select>
                    </div>
                </a-col>
            </a-row>
            <div class="btn-area">
                <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
            </div>
        </div>
        <!-- 按钮 -->
        <div class="btns">
            <a-button type="primary" v-if="$auth('crm-customer.save')">
                <i class="icon i_add" /> {{$t('dis.add_system_mail')}}
            </a-button>            
        </div>  

        <!-- table -->
        <div class="table-container">                
            <a-table 
                :columns="tableColumns" 
                :data-source="tableData" 
                :scroll="{ x: true }" 
                :row-key="record => record.id"
                :pagination="false"
            >            
                <template #bodyCell="{ column, text , record }">     
                    <!-- 操作 -->
                    <template v-if="column.key === 'operation'">
                        <a-button type="link">
                            {{$t('dis.edit')}}
                        </a-button>
                        <a-button type="link">
                            {{$t('dis.disable')}}
                        </a-button>
                        <a-button type="link">
                            {{$t('dis.delete')}}
                        </a-button>                     
                    </template>                  
                </template>
            </a-table>
        </div>        
    </div>   
</template>

<script setup>
import { ref, computed, getCurrentInstance } from 'vue';

const {proxy} = getCurrentInstance();

const source_type = {
    '0': {id: '0', zh: '全部', en: 'ALL'},
    '50': {id: '50', zh: '工单转入', en: 'Work order transfer'},
    '20': {id: '20', zh: '采购下单', en: 'Purchase order'},
}

const mailForm = ref({}) // 筛选条件

const tableData = ref([{
    dispose_id: 1,
    display_order: 1,
    vehicle_name: 1,
    vehicle_picture: 1,
    view_type: 1,
}])


// 计算属性
const  tableColumns = computed(() => {
    let columns = [
        {title: proxy.$t('dis.system_mail_id'), dataIndex: 'dispose_id',key: 'dispose_id'},  // 系统邮件ID
        {title: proxy.$t('dis.mail_use'), dataIndex: 'display_order', key: 'display_order'}, // 邮件用途
        {title: proxy.$t('dis.mail_send_target'), dataIndex: 'vehicle_name',key: 'vehicle_name'},  // 邮件发送目标
        {title: proxy.$t('dis.mould_language'), dataIndex: 'vehicle_picture', key: 'vehicle_picture'}, // 模板语言
        {title: proxy.$t('dis.mail_title'), dataIndex: 'view_type', key: 'view_type'}, // 邮件标题
        {title: proxy.$t('dis.use_status'), dataIndex: 'view_type', key: 'view_type'}, // 使用状态
        { title: proxy.$t('def.operate'),key: 'operation'},                
    ]
    return columns
})
/* methods */
// 查询
const handleSearch = () => {}
// 重置
const handleSearchReset = () => {}
</script>

<style lang="less" scoped>
.vehicle_dispose{
    width: 100%;
    .btns{
        width: 100%;
        display: flex;
        justify-content: end;
    }
}
</style>