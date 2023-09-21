<template>
    <div class="test-drive">
        <a-table
            :row-key="(record) => record.id"
            :columns="dirveColumns"
            :data-source="dirveData"
            :pagination="channelPagination"
            @change="handleTableChange"
            >
            <template #bodyCell="{ column,text, record }">
                <!-- 试驾状态 -->
                <template v-if="column.key === 'status'">                    
                    {{ Core.Const.WORK_OPERATION.TEST_DRIVE_STATUS[text].zh || "-" }}
                </template>
                <!-- 试驾时长 -->
                <template v-if="column.key === 'duration'">                    
                    {{ getMinutes(record.begin_time, record.end_time) ? getMinutes(record.begin_time, record.end_time) + '分钟': '-' }}                
                </template>
                <!-- 试驾开始时间 -->
                <template v-if="column.key === 'begin_time'">
                    {{ $Util.timeFilter(text) }}
                </template>
                <!-- 试驾结束时间 -->
                <template v-if="column.key === 'end_time'">
                    {{ $Util.timeFilter(text) }}
                </template>
                <!-- 名称 -->
                <template v-if="column.key === 'store_user_name'">                                                        
                    <img v-if="record.store_user_avatar && record.store_user_avatar !== '' " class="avatar-style" :src="record.store_user_avatar" alt="">
                    <span class="user-name">{{ text }}</span>
                    <span>{{ record.store_user_employee_no || '' }}</span>
                </template>
          
            </template>
        </a-table>
    </div>
</template>

<script setup>
import Core from '@/core';
import { reactive, ref, toRefs, onMounted, getCurrentInstance } from 'vue';
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

const { proxy } = getCurrentInstance()
const props = defineProps({
	userId: {
		type: [String, Number],
		default: ""
	}
})

const dirveColumns = ref([
    {
        title: '试驾车辆',
        key: 'test_drive_vehicle_name',
        dataIndex: 'test_drive_vehicle_name'
    },
    {
        title: '试驾状态',
        key: 'status',
        dataIndex: 'status'
    },
    {
        title: '试驾时长',
        key: 'duration',
        dataIndex: 'duration'
    },
    {
        title: '试驾开始时间',
        key: 'begin_time',
        dataIndex: 'begin_time'
    },
    {
        title: '试驾结束时间',
        key: 'end_time',
        dataIndex: 'end_time'
    },
    // {
    //     title: '驾驶证照',
    //     key: '',
    //     dataIndex: ''
    // },
    // {
    //     title: '签署协议',
    //     key: '',
    //     dataIndex: ''
    // },
    {
        title: '体验官',
        key: 'store_user_name',
        dataIndex: 'store_user_name'
    },
]);

const dirveData = ref([
  {
    // key: '1',
    // id: 1,
    // test_drive_vehicle_name: 'SENMENTI 0', // 试驾车辆
    // status: '10',  // 试驾单状态 10 预约 15 签到 20 试驾中 30 试驾结束 40过期未试驾 50 取消试驾
    // begin_time: "1695250080", // 试驾开始时间
    // end_time: "1695278921", // 试驾结束时间
    // 驾驶证照
    // 签署协议
    // store_user_avatar: "", // 头像
    // store_user_name: "体验官", // 体验官
    // store_user_employee_no: 123, // 工号
  },
]);
// 分页
const channelPagination = ref({
    current: 1,
    pageSizeOptions: ['20', '40', '60', '80', '100'],
    pageSize: 20,
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 是否可以改变 pageSize
    total: 0,
    showTotal: (total) => `${proxy.$t('n.all_total')} ${total} ${proxy.$t('in.total')}`
})

onMounted(() => {
    getDriveListFetch()
})

/* Fetch start */
// 获取试驾单列表
const getDriveListFetch = (params = {}) => {
    let obj = {
        page: channelPagination.value.current,
        page_size: channelPagination.value.pageSize,
        customer_id: props.userId, // 客户id
        ...params
    }
    Core.Api.CustomService.getTestDriveList(obj).then(res => {
        Core.Logger.success("参数", obj, "获取试驾单列表", res)
        channelPagination.value.total = res.count
        dirveData.value = res.list
    }).catch(err => {
        Core.Logger.error("参数", obj, "获取试驾单列表", err)
    })
}
/* Fetch end */

/* methods start */
const detail = (id) => {
    console.log(id)
}
// 获取分钟
const getMinutes = (startTimestamp, endTimestamp) => {
    const start = dayjs.unix(startTimestamp);
    const end = dayjs.unix(endTimestamp);
    
    const diffInSeconds = end.diff(start, 'minute');
    return diffInSeconds
}
// 分页事件
const handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...channelPagination.value }
    pager.current = pagination.current
    if (pagination.pageSize !== channelPagination.value.pageSize) {
        pager.current = 1
        pager.pageSize = pagination.pageSize
    }
    channelPagination.value = pager
    getDriveListFetch({
        page_size: channelPagination.value.pageSize,
        page: channelPagination.value.current
    })
}
/* methods end */


</script>

<style lang="less" scoped>
.test-drive {
}


.avatar-style{
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 8px;
}
.user-name{
    margin-right: 8px;
}

</style>
