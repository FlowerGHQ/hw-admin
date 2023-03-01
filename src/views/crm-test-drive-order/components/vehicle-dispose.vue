<template>
    <div class="vehicle_dispose">
        <!-- 按钮 -->
        <div class="btns">
            <a-button type="primary" @click="addVehicleEvent">
                <i class="icon i_add" /> {{$t('dis.add_vehicle')}}
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
                            {{$t('dis.order_top')}}
                        </a-button>
                        <a-button type="link">
                            {{$t('dis.order_bottom')}}
                        </a-button>
                        <a-button type="link">
                            {{$t('dis.hide')}}
                        </a-button>
                        <a-button type="link">
                            {{$t('dis.delete')}}
                        </a-button>
                    </template>                  
                </template>
            </a-table>
        </div>

         <!-- 添加车辆 -->
        <a-modal v-model:visible="addVehicleVisible" :title="$t('dis.add_vehicle')" @ok="addOk">
            <a-table 
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                :columns="vehicleColumns" 
                :data-source="vehicleData"                 
                :row-key="record => record.id"
                :pagination="false"
            >            
                <template #bodyCell="{ column, text , record }">  
                                                                          
                </template>
            </a-table>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance } from 'vue';

const {proxy} = getCurrentInstance();

// 计算属性
const  tableColumns = computed(() => {
    let columns = [
        {title: proxy.$t('dis.dispose_id'), dataIndex: 'dispose_id',key: 'dispose_id'},  // 配置ID
        {title: proxy.$t('dis.display_order'), dataIndex: 'display_order', key: 'display_order'}, // 显示顺序
        {title: proxy.$t('dis.vehicle_name'), dataIndex: 'vehicle_name',key: 'vehicle_name'},  // 车辆名称
        {title: proxy.$t('dis.vehicle_picture'), dataIndex: 'vehicle_picture', key: 'vehicle_picture'}, // 车辆图片
        {title: proxy.$t('dis.view_type'), dataIndex: 'view_type', key: 'view_type'}, // 可见状态             
        { title: proxy.$t('def.operate'),key: 'operation'},            
    ]
    return columns
})
const  tableData= ref([{
    dispose_id: 1,
    display_order: 1,
    vehicle_name: 1,
    vehicle_picture: 1,
    view_type: 1,
}])


const  vehicleColumns = computed(() => {
    let columns = [                
        {title: proxy.$t('dis.vehicle_name'), dataIndex: 'vehicle_name',key: 'vehicle_name'},  // 车辆名称
        {title: proxy.$t('dis.vehicle_picture'), dataIndex: 'vehicle_picture', key: 'vehicle_picture'}, // 车辆图片                
    ]
    return columns
})

const vehicleData = ref([
    {        
        id:1,
        vehicle_name: 1,
        vehicle_picture: 1,    
    },
    {        
        id:2,
        vehicle_name:2 ,
        vehicle_picture: 2,    
    },
])



const addVehicleVisible = ref(false) // 添加车辆model
const selectedRowKeys = ref([])
/*methods*/
// 添加车辆事件
const addVehicleEvent = () => {
    addVehicleVisible.value = true
}
// 确认事件
const addOk = () => {
    addVehicleVisible.value = false
}
// model选择事件
const onSelectChange = (selectedRowKey) => {
  console.log('selectedRowKeys changed: ', selectedRowKey);
  selectedRowKeys.value = selectedRowKey;
};
 
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