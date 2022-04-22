<template>
    <div id='EntityDetail' class='list-container'>
        <div class='title-container'>
            <div class='title-area'>整车详情</div>
            <div class="btns-area">
                <!-- <a-button type="primary" ghost @click="routerChange('edit')" v-if="$auth('supplier.save')"><i class="icon i_edit"/>编辑</a-button> -->
                <a-button type="danger" ghost @click="handleDelete(id)" v-if="$auth('supplier.delete')"><i class="icon i_close_c"/>删除</a-button>
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content desc-container">
                <div class="desc-title">
                    <div class="title-area">
                        <span class="title">{{ detail.name }}</span>
                    </div>
                </div>
                <a-row class="desc-detail">
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">整车名称：</span>
                        <span class="value">{{ detail.item.name }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">整车编号：</span>
                        <span class="value">{{ detail.uid }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">维修次数：</span>
                        <span class="value">{{ detail.repair_count }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">客户信息：</span>
                        <span class="value">{{ detail.org_name }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">到港日期：</span>
                        <span class="value">{{ $Util.timeFilter(detail.arrival_time) }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">创建时间：</span>
                        <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                    </a-col>
                </a-row>
            </div>
        </div>
        <div class="tabs-container">
            <a-tabs v-model:activeKey="activeKey">
                 <a-tab-pane key="RepairOrderList" tab="维修单列表">
                    <RepairOrderList :itemId="item_id" v-if="activeKey === 'RepairOrderList'"/>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import RepairOrderList from './components/RepairOrderList.vue'

export default {
    name: 'EntityDetail',
    components: {
        RepairOrderList,
    },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            id: '',
            material_id: '',
            detail: {},
            activeKey: '',
        }
    },
    watch: {},
    computed: {},
    created() {
        this.id = Number(this.$route.query.id) || '';
        this.getEntityDetail();
    },
    methods: {
        routerChange(type) {
            let routeUrl = '';
            switch (type) {
                // case 'edit': // 编辑
                //     routeUrl = this.$router.resolve({
                //         path: '/entity/entity-edit',
                //         query: {id: this.id},
                //     });
                //     window.open(routeUrl.href, '_self');
                //     break;
                case 'list': // 列表
                    routeUrl = this.$router.resolve({
                        path: '/entity/entity-list',
                        query: {id: this.id},
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getEntityDetail() {
            this.loading = true;
            Core.Api.Entity.detail({
                id: this.id,
            }).then((res) => {
                console.log('getEntityDetail res', res);
                this.detail = res.detail
                this.activeKey = 'EntityList'
            }).catch((err) => {
                console.log('getEntityDetail err', err);
            }).finally(() => {
                this.loading = false;
            });
        },
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该整车吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Entity.delete({id})
                        .then(() => {
                            _this.$message.success('删除成功');
                            _this.routerChange('list');
                        }).catch((err) => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
    },
};
</script>

<style lang='less'>
#EntityDetail {
    .desc-title {
        .title-area {
            .title {
                margin-right: 20px;
            }
            .status-title {
                font-size: 14px;
            }
        }
    }
}
</style>