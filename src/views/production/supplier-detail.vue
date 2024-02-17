<template>
    <div id="SupplierDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">供应商详情</div>
            <div class="btns-area">
                <a-button type="primary" ghost @click="routerChange('edit')" v-if="$auth('supplier.save')"
                    ><i class="icon i_edit" />编辑</a-button
                >
                <a-button type="danger" ghost @click="handleDelete(id)" v-if="$auth('supplier.delete')"
                    ><i class="icon i_close_c" />删除</a-button
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
                        <span class="key">联系人：</span>
                        <span class="value">{{ detail.contact_name }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">联系人电话：</span>
                        <span class="value">{{ detail.contact_phone }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">信用代码：</span>
                        <span class="value">{{ detail.credit_code }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">开户银行：</span>
                        <span class="value">{{ detail.deposit_bank }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">开户行账号：</span>
                        <span class="value">{{ detail.bank_card_no }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">付款方式：</span>
                        <span class="value">{{ $Util.supplierPaymentTypeFilter(detail.payment_term) }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">到货周期：</span>
                        <span class="value">{{ detail.arrival_period }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">供应商地址：</span>
                        <span class="value">{{ $Util.addressFilter(detail, $i18n.locale) }}</span>
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
                <a-tab-pane key="MaterialList" tab="供应物料">
                    <MaterialList :supplierId="id" :materialId="material_id" v-if="activeKey === 'MaterialList'" />
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import MaterialList from './components/MaterialList.vue';

export default {
    name: 'SupplierDetail',
    components: {
        MaterialList,
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
        this.getSupplierDetail();
    },
    methods: {
        routerChange(type) {
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/production/supplier-edit',
                        query: { id: this.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'list': // 列表
                    routeUrl = this.$router.resolve({
                        path: '/production/supplier-list',
                        query: { id: this.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getSupplierDetail() {
            this.loading = true;
            Core.Api.Supplier.detail({
                id: this.id,
            })
                .then(res => {
                    console.log('getSupplierDetail res', res);
                    this.detail = res.detail;
                    this.activeKey = 'MaterialList';
                })
                .catch(err => {
                    console.log('getSupplierDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该供应商吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Supplier.delete({ id })
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
