<template>
    <div id="EntityDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('v.detail') }}</div>
            <div class="btns-area">
                <a-button type="danger" ghost @click="handleDelete(id)"
                    ><i class="icon i_delete" />{{ $t('def.delete') }}</a-button
                >
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content desc-container">
                <div class="desc-title">
                    <div class="title-area">
                        <span class="title" v-if="detail.type === Core.Const.ITEM.TYPE.PRODUCT">{{
                            detail.item ? detail.item.name : '-'
                        }}</span>
                        <span class="title" v-if="detail.type === Core.Const.ITEM.TYPE.COMPONENT">{{
                            detail.material ? detail.material.name : '-'
                        }}</span>
                    </div>
                </div>
                <a-row class="desc-detail">
                    <!--                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">整车名称：</span>
                        <span class="value">{{ detail.item ? detail.item.name : '-' }}</span>
                    </a-col>-->
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('v.number_a') }}：</span>
                        <span class="value">{{ detail.uid }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('v.repair') }}：</span>
                        <span class="value">{{ detail.repair_count }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('v.name') }}：</span>
                        <span class="value">{{ detail.customer_detail ? detail.customer_detail.name : '-' }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.phone') }}：</span>
                        <span class="value">{{ detail.customer_detail ? detail.customer_detail.phone : '-' }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('v.address') }}：</span>
                        <span class="value">{{ detail.customer_detail ? detail.customer_detail.address : '-' }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('v.date_a') }}：</span>
                        <span class="value">{{ $Util.timeFilter(detail.arrival_time) }}</span>
                    </a-col>
                    <!--                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">创建时间：</span>
                        <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                    </a-col>-->
                </a-row>
            </div>
        </div>
        <div class="tabs-container">
            <a-tabs>
                <a-tab-pane key="RepairOrderList" :tab="$t('r.repair_list')">
                    <RepairOrderList :itemId="id"></RepairOrderList>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import RepairOrderList from './components/RepairOrderList.vue';

export default {
    name: 'EntityDetail',
    components: {
        RepairOrderList,
    },
    props: {},
    data() {
        return {
            Core,
            // 加载
            loading: false,
            id: '',
            item_id: '',
            detail: {},
            activeKey: '',
        };
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
                case 'list': // 列表
                    routeUrl = this.$router.resolve({
                        path: '/entity/entity-list',
                        query: { id: this.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getEntityDetail() {
            this.loading = true;
            Core.Api.Entity.detail({
                id: this.id,
            })
                .then(res => {
                    console.log('getEntityDetail res', res);
                    this.detail = res.detail;
                })
                .catch(err => {
                    console.log('getEntityDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Entity.delete({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.routerChange('list');
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
    },
};
</script>

<style lang="less">
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
