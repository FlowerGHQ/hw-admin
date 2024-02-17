<template>
    <div id="SupplierDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('ar.detail') }}</div>
            <div class="btns-area">
                <a-button type="primary" ghost @click="routerChange('edit')" v-if="$auth('sales-area.save')"
                    ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                >
                <a-button type="danger" ghost @click="handleDelete(id)" v-if="$auth('sales-area.delete')"
                    ><i class="icon i_delete" />{{ $t('def.delete') }}</a-button
                >
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
                        <span class="key">{{ $t('n.continent') }}：</span>
                        <span class="value">{{
                            $i18n.locale === 'zh' ? detail.continent : detail.continent_en || '-'
                        }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.country') }}：</span>
                        <span class="value">{{
                            $i18n.locale === 'zh' ? detail.country : detail.country_en || '-'
                        }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.time') }}：</span>
                        <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                    </a-col>
                </a-row>
            </div>
        </div>
        <div class="tabs-container">
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="SalesAreaItemList" :tab="$t('i.item_list')">
                    <SalesAreaItemList
                        :salesAreaId="id"
                        :materialId="material_id"
                        v-if="activeKey === 'SalesAreaItemList'"
                    />
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import SalesAreaItemList from './components/SalesAreaItemList.vue';

export default {
    name: 'sales-area-detail',
    components: {
        SalesAreaItemList,
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
        };
    },
    watch: {},
    computed: {},
    created() {
        this.id = Number(this.$route.query.id) || '';
        this.getSalesAreaDetail();
    },
    methods: {
        routerChange(type) {
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/distributor/sales-area-edit',
                        query: { id: this.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'list': // 列表
                    routeUrl = this.$router.resolve({
                        path: '/distributor/sales-area-list',
                        query: { id: this.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getSalesAreaDetail() {
            this.loading = true;
            Core.Api.SalesArea.detail({
                id: this.id,
            })
                .then(res => {
                    console.log('getSalesAreaDetail res', res);
                    this.detail = res.detail;
                    this.activeKey = 'SalesAreaItemList';
                })
                .catch(err => {
                    console.log('getSalesAreaDetail err', err);
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
                    Core.Api.SalesArea.delete({ id })
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
#SupplierDetail {
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
