<template>
    <div class="platfrom">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">COC证书列表</div>
                <div class="btns-area">
                    <a-button type="primary">批量下载</a-button>                
                </div>
            </div>
            <!-- tabs -->
            <div class="tabs-container colorful cancel-m-b">
                <a-tabs v-model:activeKey="activeKey">
                    <a-tab-pane v-for="item of COC.TAB_TYPE" :key="item.key" >
                        <template #tab>
                            {{ item[$i18n.locale] }}
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <!-- search -->
            <div class="search">
                <a-row class="row-detail">
                    <!-- 订单号 -->
                    <a-col
                        :xs="24"
                        :sm="24"
                        :xl="8"
                        :xxl="6"
                        class="row-item"
                    >
                        <div class="key">订单号：</div>                        
                        <div class="value">
                            <a-input v-model:value="searchForm.sn"></a-input>
                        </div>
                    </a-col>
                    <!-- 下单时间 -->
                    <a-col
                        :xs="24"
                        :sm="24"
                        :xl="8"
                        :xxl="6"
                        class="row-item"
                    >
                        <div class="key">下单时间：</div>                        
                        <div class="value">
                            <TimeSearch @search="onPlaceOrderTime"/>
                        </div>
                    </a-col>
                    <!-- 发货时间 -->
                    <a-col
                        :xs="24"
                        :sm="24"
                        :xl="8"
                        :xxl="6"
                        class="row-item"
                    >
                        <div class="key">发货时间：</div>                        
                        <div class="value">
                            <TimeSearch @search="onDeliveryTime"/>
                        </div>
                    </a-col>
                    <!-- 按钮 -->
                    <a-col 
                        :xs="24" 
                        :sm="24" 
                        :xl="8" 
                        :xxl="6" 
                        class="row-item"
                    >
                        <a-button>重置</a-button>                   
                        <a-button type="primary">查询</a-button>                   
                    </a-col>  
                </a-row>
            </div>
            <!-- table -->
            <div class="table-container">
                <a-table 
                    :row-key="record => record.id"
                    :columns="palrformTableColumns"
                    :data-source="palrformTableData"
                    :pagination="channelPagination"
                    @change="handleTableChange"            
                    >
                    <template #bodyCell="{ column, text , record }">
                        
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="onDownLoad">下载</a-button>
                            <a-button type="link" @click="onView">查看</a-button>
                            <a-button type="link" @click="onCertificate">证书清单</a-button>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, reactive, getCurrentInstance } from 'vue'
    import Core from '@/core'
    import TimeSearch from '@/components/common/TimeSearch.vue'

    const { proxy } = getCurrentInstance()
    const COC = Core.Const.COC

    const palrformTableColumns = ref([
        { 
            title: '订单号',
            dataIndex: 'sn',
            key: 'sn',
        },
        { 
            title: 'COC证书状态',
            dataIndex: '',
            key: '',
        },
        { 
            title: '下单时间',
            dataIndex: '',
            key: '',
        },
        { 
            title: '发货时间',
            dataIndex: '',
            key: '',
        },
        { 
            title: '客户下载次数',
            dataIndex: '',
            key: '',
        },
        { 
            title: '客户是否可见',
            dataIndex: '',
            key: '',
        },
        { 
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
        },
    ])
    const palrformTableData = ref([{ sn: '12345678' }])
    const channelPagination = reactive({
        page: 1,
        pageSizeOptions: ['20', '40', '60', '80', '100'],
        pageSize: 20,
        showQuickJumper: true, // 是否可以快速跳转至某页
        showSizeChanger: true, // 是否可以改变 pageSize
        total: 0,
        showTotal: (total) => `${proxy.$t('n.all_total')} ${total} ${proxy.$t('in.total')}`
    })

    const activeKey = ref(undefined)  // tab切换
    const searchForm = ref({
        sn: ""
    })
    /* fetch start */
    const fetchs = (params = {}) => {
        let obj = {
            ...params
        }
        Core.Api.XXX(obj).then(res => {
            Core.Logger.success("参数", obj, "结果", res)
        }).catch(err => {
            Core.Logger.error("参数", obj, "结果", err)
        })
    }

    /* fetch end */

    /* methods start */
    // 下载
    const onDownLoad = () => {

    }
    // 查看
    const onView = () => {

    }
    // 证书清单
    const onCertificate = () => {

    }
    // 下单时间
    const onPlaceOrderTime = (params) => {
        Core.Logger.log("下单时间", params)
    }
    // 发货时间
    const onDeliveryTime = (params) => {
        Core.Logger.log("发货时间", params)
    }
    // table chang 分页事件
    const handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...channelPagination }
        pager.current = pagination.current
        if (pagination.pageSize !== channelPagination.pageSize) {
            pager.current = 1
            pager.pageSize = pagination.pageSize
        }
        channelPagination = pager
        fetchs({
            page_size: channelPagination.pageSize,
            page: channelPagination.page
        })
    }
    /* methods end */
</script>

<style lang="less" scoped>
.platfrom {
    
}
.cancel-m-b {
    margin-bottom: 0;
}
</style>