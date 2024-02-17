<template>
    <div class="edit-container">
        <div class="title-container">
            <div class="title-area">
                {{ $t('crm_c.detail') }}
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content desc-container">
                <div class="desc-title">
                    <div class="title-area">
                        <span class="title">{{ $t('dis.order_detail') }}</span>
                    </div>
                </div>
                <a-row class="desc-detail">
                    <!-- 用户姓名 -->
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('dis.user_name') }}：</span>
                        <span class="value">
                            {{ driveDetail.customer?.name }}
                        </span>
                    </a-col>
                    <!-- 手机号 -->
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.phone') }}：</span>
                        <span class="value">
                            {{ driveDetail.customer?.phone }}
                        </span>
                    </a-col>
                    <!-- 邮箱 -->
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('n.email') }}：</span>
                        <span class="value">
                            {{ driveDetail.customer?.email }}
                        </span>
                    </a-col>
                    <!-- 创建时间 -->
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('def.create_time') }}：</span>
                        <span class="value">
                            {{ $Util.timeFilter(driveDetail.customer?.createTime, 3) }}
                        </span>
                    </a-col>
                    <!-- 试驾车型 -->
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('dis.crm_dict_id') }}：</span>
                        <span class="value">
                            {{ driveDetail.item_name }}
                        </span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item"> </a-col>
                    <!-- 门店邮件是否发送 -->
                    <!-- <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span style="color:#8b9aae">{{ $t('dis.store_is_send_mail') }}：</span>
                        <span>
                            <span style="color: #f31c12;">{{ $t('dis.fail_send') }}</span>
                            <a-button type="link" style="margin-left: 8px;">{{ $t('dis.fagain_send') }}</a-button>
                        </span>
                    </a-col> -->
                    <!-- 用户邮件是否发送 -->
                    <!-- <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span style="color:#8b9aae">{{ $t('dis.user_is_send_mail') }}：</span>
                        <span>
                            {{ $t('dis.been_sent') }}({{ $t('dis.mail') }}:1234)
                        </span>
                    </a-col> -->
                </a-row>
            </div>
            <div class="panel-content desc-container">
                <div class="desc-title">
                    <div class="title-area">
                        <span class="title">{{ $t('dis.subscribe_store') }}</span>
                    </div>
                </div>
                <a-row class="desc-detail">
                    <!-- 门店名称 -->
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('dis.store_name') }}：</span>
                        <span class="value">
                            {{ storeDetail.name }}
                        </span>
                    </a-col>
                    <!-- 门店手机号 -->
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('dis.store_phone') }}：</span>
                        <span class="value">
                            {{ storeDetail.contact_phone }}
                        </span>
                    </a-col>
                    <!-- 门店邮箱 -->
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('dis.store_email') }}：</span>
                        <span class="value">
                            {{ storeDetail.contact_email }}
                        </span>
                    </a-col>
                    <!-- 营业时间 -->
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('dis.business_hours') }}：</span>
                        <span class="value"> {{ storeDetail.business_time }}({{ storeDetail.business_remark }}) </span>
                    </a-col>
                    <!-- 门店地址 -->
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('dis.store_address') }}：</span>
                        <span class="value">
                            {{ storeDetail.address }}
                        </span>
                    </a-col>
                    <!-- 门店官网 -->
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('dis.store_website') }}：</span>
                        <span class="value">
                            <a :href="storeDetail.website_url">{{ storeDetail.website_url }} </a>
                        </span>
                    </a-col>
                </a-row>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Core from '@/core';

const route = useRoute();

const driveDetail = ref({
    customer: null,
}); // 订单车辆详情
const storeDetail = ref({}); // 门店详情

onMounted(() => {
    driveList();
});
/*Fetch*/
// 订单详情
const driveList = (params = {}) => {
    Core.Api.CRMTestDriveOrder.detail({
        id: route.query.id,
        ...params,
    })
        .then(res => {
            console.log('订单详情', res);
            driveDetail.value = res.detail;
            storeFetch({ id: res.detail.store_id });
        })
        .catch(err => {
            console.log('获取详情失败', err);
        });
};
// 门店详情
const storeFetch = (params = {}) => {
    Core.Api.Store.detail({ ...params })
        .then(res => {
            console.log('获取门店详情', res);
            storeDetail.value = res.detail;
        })
        .catch(err => {
            console.log('获取门店列表失败', err);
        });
};
/*methods*/
</script>

<style lang="scss" scoped></style>
