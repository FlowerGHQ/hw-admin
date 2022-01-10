<template>
    <div id="WarehouseDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">仓库详情</div>
            <div class="btns-area" v-if="$auth('ADMIN')">
                <a-button type="primary" ghost @click="routerChange('edit',record)"><i class="icon i_edit"/> 编辑</a-button>
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content desc-container">
                <div class="desc-title">
                    <div class="title-area">
                        <span class="title">{{ detail.name }}</span>
                    </div>
                </div>
                <a-row class="desc-detail has-logo">
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">创建时间：</span>
                        <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">仓库地址：</span>
                        <span class="value">{{ $Util.addressFilter(detail) }}</span>                    </a-col>
                </a-row>
            </div>
        </div>
        <div class="tabs-container">
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="UserList" tab="库存数量">
                    <WarehouseStockList/>
                </a-tab-pane>
                <a-tab-pane key="PurchaseList" tab="出入库记录">
                    <WarehouseStockAdd/>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import Core from '../../core';

import UserList from '@/components/UserList.vue';
import PurchaseList from '@/components/PurchaseOrderList.vue';
import WarehouseStockList from './components/WarehouseStockList.vue';
import WarehouseStockAdd from './components/WarehouseStockAdd.vue';



const USER_TYPE = Core.Const.USER.TYPE;
export default {
    name: 'WarehouseDetail',
    components: {UserList, PurchaseList, WarehouseStockList, WarehouseStockAdd },
    props: {},
    data() {
        return {
            USER_TYPE,
            ORG_TYPE: Core.Const.LOGIN.TYPE,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            //标签页
            activeKey: 'UserList',

            store_id: Core.Data.getOrgId(),
            detail: {},
            id: '',
            name: '',
            province: '',
            city: '',
            county: '',
            address: '',
        };
    },
    watch: {},
    computed: {},
    created() {
        this.warehouse_id = Number(this.$route.query.id) || Core.Data.getOrgId()
        this.getWarehouseDetail();
    },
    methods: {
        routerChange(type) {
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/warehouse-edit",
                        query: {id: this.warehouse_id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'list':  // 列表
                    routeUrl = this.$router.resolve({
                        path: "/warehouse/warehouse-list",
                        query: {id: this.warehouse_id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;

            }
        },
        getWarehouseDetail() {
            this.loading = true;
            Core.Api.Warehouse.detail({
                id: this.warehouse_id,
            }).then(res => {
                console.log('getWarehouseDetail res', res)
                this.detail = res.detail
            }).catch(err => {
                console.log('getWarehouseDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
    }
};
</script>

<style lang="less" scoped>
// #WarehouseDetail {}
</style>