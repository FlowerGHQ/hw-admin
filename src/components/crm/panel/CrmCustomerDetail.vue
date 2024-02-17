<template>
    <div>
        <div class="gray-panel">
            <div class="panel-content desc-container">
                <div class="desc-title">
                    <div class="title-area">
                        <span class="title">{{ detail.name }}</span>
                    </div>
                </div>
                <a-row class="desc-detail">
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.phone') }}：</span>
                        <span class="value phone-hover">
                            {{ detail.phone_country_code }} {{ detail.phone ? detail.phone : '-' }}
                            <a-button
                                type="link"
                                v-if="!detail.flag_eyes && detail.status !== STATUS.CUSTOMER"
                                class="switch"
                                @click="handleChecking()"
                                ><i class="icon i_eyes"
                            /></a-button>
                        </span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.email') }}：</span>
                        <div class="email-style">
                            <a-tooltip placement="topLeft">
                                <template #title>{{ detail.email }}</template>
                                <span class="spils" style="width: 140px">{{ detail.email }}</span>
                            </a-tooltip>
                            <a-button
                                type="link"
                                v-if="!detail.flag_eyes && detail.status !== STATUS.CUSTOMER"
                                class="switch"
                                @click="handleChecking()"
                                ><i class="icon i_eyes"
                            /></a-button>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('crm_c.level') }}：</span>
                        <span class="value">{{ $Util.CRMCustomerLevelFilter(detail.level, $i18n.locale) || '-' }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('crm_c.type') }}：</span>
                        <span class="value">{{ $Util.CRMCustomerTypeFilter(detail.type, $i18n.locale) || '-' }}</span>
                    </a-col>

                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('crm_c.own_user_name') }}：</span>
                        <span class="value">{{ detail.own_user ? detail.own_user.name : '-' }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('crm_c.pre_own_user') }}：</span>
                        <span class="value">{{ detail.pre_own_user_name }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.time') }}：</span>
                        <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                    </a-col>
                    <!-- 订单来源 -->
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('dis.order_source') }}：</span>
                        <span class="value">
                            {{ $Util.orderTestSourceType(detail.crm_test_drive_order?.channel, $i18n.locale) || '-' }}
                        </span>
                    </a-col>
                    <!-- 试驾车型 -->
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('dis.crm_dict_id') }}：</span>
                        <span class="value">
                            {{ detail.crm_test_drive_order?.item_name || '-' }}
                        </span>
                    </a-col>
                    <!-- 标签展示 -->
                    <a-col :xs="24" :sm="24" :lg="24" class="detail-item">
                        <span class="key">{{ $t('sl.show') }}：</span>
                        <span class="value" style="overflow: initial; white-space: normal">
                            <LabelList :targetId="id" :targetType="Core.Const.CRM_LABEL.CATEGORY.CUSTOMER" />
                        </span>
                    </a-col>
                    <!-- 门店邮件是否发送 -->
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span style="color: #8b9aae">{{ $t('dis.store_is_send_mail') }}：</span>
                        <span>
                            <span v-if="!detail.crm_test_drive_order?.flag_mail_sent_store">-</span>
                            <!-- 1已发 2未发-->
                            <span v-else-if="detail.crm_test_drive_order?.flag_mail_sent_store == 1">
                                {{ $t('dis.been_sent') }}
                                <!-- ({{ $t('dis.mail') }}:1234) -->
                            </span>
                            <span v-else-if="detail.crm_test_drive_order?.flag_mail_sent_store == 2">
                                <span style="color: #f31c12">{{ $t('dis.fail_send') }}</span>
                                <a-button type="link" style="margin-left: 8px" @click="resetEmailEvent('store')">{{
                                    $t('dis.fagain_send')
                                }}</a-button>
                            </span>
                        </span>
                    </a-col>
                    <!-- 用户邮件是否发送 -->
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span style="color: #8b9aae">{{ $t('dis.user_is_send_mail') }}：</span>
                        <span>
                            <span v-if="!detail.crm_test_drive_order?.flag_mail_sent_user">-</span>
                            <!-- 1已发 2未发 -->
                            <span v-else-if="detail.crm_test_drive_order?.flag_mail_sent_user == 1">
                                {{ $t('dis.been_sent') }}
                                <!-- ({{ $t('dis.mail') }}:1234) -->
                            </span>
                            <span v-else-if="detail.crm_test_drive_order?.flag_mail_sent_user == 2">
                                <span style="color: #f31c12">{{ $t('dis.fail_send') }}</span>
                                <a-button type="link" style="margin-left: 8px" @click="resetEmailEvent('user')">{{
                                    $t('dis.fagain_send')
                                }}</a-button>
                            </span>
                        </span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="24" class="detail-item">
                        <span class="key">{{ $t('crm_c.custom_area') }}：</span>
                        <span class="value">{{ detail.address ? detail.address : '-' }}</span>
                    </a-col>
                </a-row>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../../core';
import LabelList from '@/components/crm/common/LabelList.vue';
export default {
    name: 'CustomerDetailInfo',
    components: {
        LabelList,
    },
    props: {
        id: {
            type: Number,
        },
    },
    data() {
        return {
            Core,
            STATUS: Core.Const.CRM_CUSTOMER.STATUS,
            detail: {},
        };
    },
    mounted() {
        this.getCustomerDetail();
    },
    methods: {
        handleChecking() {
            Core.Api.CRMCustomer.checking({
                id: this.id,
            }).then(res => {
                this.detail.phone = res.detail.phone;
                this.detail.email = res.detail.email;
                this.detail.flag_eyes = true;
                console.log(res);
            });
        },
        getCustomerDetail() {
            this.loading = true;
            Core.Api.CRMCustomer.detail({
                id: this.id,
            })
                .then(res => {
                    console.log('getCustomerDetail res', res);
                    let d = res.detail;
                    this.detail = d;
                    this.detail.birthday = this.detail.birthday
                        ? dayjs.unix(this.detail.birthday).format('YYYY-MM-DD')
                        : undefined;
                    for (const key in this.form) {
                        this.form[key] = d[key];
                    }
                    this.defAddr = [d.province, d.city, d.county];
                    if (this.detail.status === Core.Const.CRM_CUSTOMER.STATUS.POOL) {
                        this.tabActiveKey = 'InformationInfo';
                    }
                    // this.handleGroupTree()
                })
                .catch(err => {
                    console.log('getCustomerDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less" scoped>
.gray-panel {
    padding: 0 !important;
}
.desc-container {
    padding-top: 0 !important;
}
:deep(.panel-content) {
    padding: 0 !important;
}
</style>
