<template>
    <div class="vehicle-detail">
        <div class="d-top">
            <!-- <div class="title" style="background-color: yellow">
        {{ $t("s.detail") }}
      </div> -->
            <div class="title-container">
                <div class="title-area title">
                    {{ $t('s.detail') }}
                </div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')">{{ $t('n.edit') }}</a-button>
                </div>
            </div>
            <div class="container">
                <div class="d-img">
                    <img class="img" :src="$Util.imageFilter(form.logo?.path)" alt="" />
                </div>
                <div class="d-content">
                    <a-row class="all-msg">
                        <div class="vehicle-msg">
                            <span>{{ form.name }}</span>
                            <!-- 店铺 -->
                            <span class="use tabsty">{{ $Util.storeType(form.type) }}</span>
                            <!-- 等级 -->
                            <span class="test-drive tabsty">{{ $Util.storeLevel(form.level, lang) }}</span>
                            <!-- 状态 -->
                            <span class="store-type tabsty">{{ $Util.storeSTATUS(form.status) }}</span>
                        </div>
                        <div class="vehicle-id">
                            <span class="key">{{ form.address }}</span>
                            <span class="key">{{ form.group_name }}-{{ form.city }}</span>
                            <span class="key">编码：{{ form.id }}</span>
                        </div>
                    </a-row>
                    <a-row class="row-detail">
                        <!-- 经度 -->
                        <a-col :xs="24" :sm="12" :xl="6" :xxl="6" class="row-item m-t-16">
                            <span class="key" style="text-align: left">{{ $t('crm_st.longitude') }}：</span>
                            <span class="value">
                                {{ form.localtion.longitude ? form.localtion.longitude : '' }}
                            </span>
                        </a-col>
                        <!-- 纬度 -->
                        <a-col :xs="24" :sm="12" :xl="18" :xxl="6" class="row-item m-t-16">
                            <span class="key" style="width: 80px; text-align: left">{{ $t('crm_st.latitude') }}：</span>
                            <span class="value">
                                {{ form.localtion.latitude ? form.localtion.latitude : '' }}
                            </span>
                        </a-col>
                        <!-- 开业时间 -->
                        <a-col :xs="24" :sm="12" :xl="6" :xxl="6" class="row-item m-t-16">
                            <span class="key">{{ $t('crm_st.open_time') }}：</span>
                            <span class="value">
                                {{ form.open_time }}
                            </span>
                        </a-col>
                        <!-- 营业时间 -->
                        <a-col :xs="24" :sm="12" :xl="6" :xxl="6" class="row-item m-t-16">
                            <span class="key">{{ $t('dis.business_hours') }}：</span>
                            <span class="value">
                                {{
                                    form.business_time?.length && form.business_time[0] && form.business_time[1]
                                        ? form.business_time[0] + '&nbsp;~&nbsp;' + form.business_time[1]
                                        : '-'
                                }}
                            </span>
                        </a-col>
                        <!-- 所属门店 -->
                        <!--  <a-col :xs="24" :sm="12" :xl="6" :xxl="6" class="row-item m-t-16">
                            <span class="key">{{ $t('dis.business_hours') }}：</span>
                            <span class="value">
                                你好
                            </span>
                        </a-col> -->
                        <!-- 联系手机 -->
                        <a-col :xs="24" :sm="12" :xl="6" :xxl="6" class="row-item m-t-16">
                            <span class="key">{{ $t('crm_st.con_phone') }}：</span>
                            <span class="value">
                                {{ form.contact_phone }}
                            </span>
                        </a-col>
                        <!-- 联系邮箱 -->
                        <a-col :xs="24" :sm="12" :xl="6" :xxl="6" class="row-item m-t-16">
                            <span class="key">{{ $t('crm_st.con_email') }}：</span>
                            <span class="value">
                                {{ form.contact_email }}
                            </span>
                        </a-col>
                        <!-- 门店面积 -->
                        <a-col :xs="24" :sm="12" :xl="6" :xxl="6" class="row-item m-t-16">
                            <span class="key">{{ $t('crm_st.sto_area') }}：</span>
                            <span class="value">
                                {{ form.square }}
                            </span>
                        </a-col>
                        <!-- 车位数 -->
                        <a-col :xs="24" :sm="12" :xl="6" :xxl="6" class="row-item m-t-16">
                            <span class="key">{{ $t('crm_st.park_space') }}：</span>
                            <span class="value">
                                {{ form.ground_charge_pile_count + form.underground_charge_pile_count }}
                            </span>
                        </a-col>
                        <!-- 充电桩数 -->
                        <a-col :xs="24" :sm="12" :xl="6" :xxl="6" class="row-item m-t-16">
                            <span class="key">{{ $t('crm_st.charg_station') }}：</span>
                            <span class="value">
                                {{ form.underground_park_count + form.ground_park_count }}
                            </span>
                        </a-col>
                    </a-row>
                </div>
            </div>
        </div>
        <div class="d-bottom">
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="sto_person" :tab="$t('s.sto_person')">
                    <CrmEditStorePeo :id="form.id" />
                </a-tab-pane>
                <a-tab-pane key="sto_car" :tab="$t('s.sto_car')" v-if="false">
                    <ShopCarList />
                </a-tab-pane>
                <a-tab-pane key="store_shift" :tab="$t('s.store_shift')" v-if="false">
                    <ShiftCon />
                </a-tab-pane>
                <a-tab-pane key="contract_info" :tab="$t('s.contract_info')" v-if="false">
                    <ContentInfo />
                </a-tab-pane>
                <a-tab-pane key="licenses" :tab="$t('s.licenses')" v-if="false">
                    <UploadLicenses />
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CrmEditStorePeo from '@/components/crm/panel/CrmEditStorePeo.vue';
import ShopCarList from './components/shop-car-list.vue';
import ContentInfo from './components/content-info.vue';
import UploadLicenses from './components/upload-licenses.vue';
import ShiftCon from './components/ShiftCon.vue';
import Core from '../../../core';
import dayjs from 'dayjs';

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const activeKey = ref('sto_person');
const id = ref('');
const form = ref({
    id: '', //店铺主键id 传递时更新
    name: '',
    logo: '', //logo--img
    type: undefined,
    level: undefined,
    province: '',
    city: undefined,
    address: '',
    status: undefined,
    open_time: '',
    business_time: '',
    contact_email: '',
    contact_phone: '',
    group_id: '',
    group_name: '',
    square: '', // 面积
    ground_park_count: '', // 地上停车位数量
    underground_park_count: '', //地下停车位数量
    ground_charge_pile_count: '', // 地上充电桩数量
    underground_charge_pile_count: '', //地下充电桩数量

    localtion: {
        latitude: '', // 纬度
        longitude: '', // 经度
    },
    user_id: '', //店长用户id
});

const lang = computed(() => {
    return proxy.$store.state.lang;
});
onMounted(() => {
    // getWarehouseDetail()
    form.value.id = Number(route.query.id) || 0;
    if (form.value.id) {
        getStoreDetail();
    }
});

// 获取门店详情
const getStoreDetail = () => {
    // this.loading = true;
    Core.Api.RETAIL.storeDetail({
        id: form.value.id,
    })
        .then(res => {
            console.log('getStoreDetail res:', res);
            let d = res;
            d.open_time = d.open_time ? dayjs.unix(d.open_time).format('YYYY-MM-DD') : undefined;
            d.business_time = d.business_time
                ? [JSON.parse(d.business_time).time.morning.begin, JSON.parse(d.business_time).time.afternoon.end]
                : [];
            d.localtion = d.localtion
                ? JSON.parse(d.localtion)
                : {
                      latitude: '', // 纬度
                      longitude: '', // 经度
                  };
            d.logo = d.logo ? JSON.parse(d.logo) : '';
            for (const key in form.value) {
                form.value[key] = d[key];
            }
            console.log('form.value', form.value, 'd', d);
        })
        .catch(err => {
            console.log('getStoreDetail err:', err);
        })
        .finally(() => {
            // this.loading = false;
        });
};

const routerChange = type => {
    let routeUrl = '';
    let id = form.value.id;
    switch (type) {
        // 创建（编辑）门店
        case 'edit':
            routeUrl = router.resolve({
                path: '/stores-vehicle/store-edit',
                query: { id: id },
            });
            window.open(routeUrl.href, '_blank');
            break;
    }
};
</script>

<style lang="less" scoped>
.vehicle-detail {
    width: 100%;
    height: 100%;
    font-family: PingFang SC;

    .d-top {
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
        border-radius: 6px;
        border: 1px solid #e7e9f0;
        background: #fff;

        .title {
            color: var(--color-text-5, #1d2129);
            font-size: 18px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            //   margin-bottom: 16px;
        }

        .container {
            display: flex;

            .d-img {
                .img {
                    margin-right: 20px;
                    width: 240px;
                    height: 160px;
                    object-fit: cover;
                }
            }

            .d-content {
                .all-msg {
                    .flex(space-between, flex-start);

                    .vehicle-msg {
                        color: #1d2129;
                        font-size: 16px;
                        font-weight: 600;
                        letter-spacing: 0.167px;

                        .tabsty {
                            height: 19px;
                            line-height: 19px;
                            display: inline-block;
                            padding: 1px 6px;
                            border-radius: 2px;
                            color: #ffffff;
                            font-size: 12px;
                            font-weight: 600;
                        }

                        .use {
                            background: rgba(0, 97, 255, 1);
                            margin-left: 12px;
                        }

                        .test-drive {
                            margin-left: 8px;
                            background: rgba(247, 114, 52, 1);
                        }

                        .store-type {
                            margin-left: 8px;
                            background: rgba(0, 180, 42, 1);
                        }
                    }

                    .vehicle-id {
                        color: var(--color-text-2, #4e5969);
                        font-family: PingFang SC;
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: normal;
                        margin-top: 12px;

                        .key {
                            color: #86909c;
                            margin-right: 18px;
                        }
                    }
                }
            }
        }
    }

    .d-bottom {
        min-height: calc(100% - 260px);
        margin-top: 20px;
        padding: 0 20px;
        box-sizing: border-box;
        border-radius: 6px;
        border: 1px solid #e7e9f0;
        background: #fff;
    }
}

.row-detail {
    .row-item {
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        min-width: 200px;

        .key {
            display: inline-block;
            color: #86909c;
            width: 100px;
            text-align: right;
        }

        .value {
            color: #1d2129;
        }
    }
}

.m-t-16 {
    margin-top: 16px;
}
.btns-area {
    .ant-btn {
        width: 80px;
    }
}
</style>
