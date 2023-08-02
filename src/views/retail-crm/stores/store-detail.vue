<template>
    <div class="vehicle-detail">
        <div class="d-top">
            <div class="title">
                {{ $t('s.detail') }}
            </div>
            <div class="container">
                <div class="d-img">
                    <img class="img"
                        src="https://ts1.cn.mm.bing.net/th/id/R-C.eec02321ea106169d757f427b98b358d?rik=%2bgK43uKTPrZbCw&riu=http%3a%2f%2f00.minipic.eastday.com%2f20170823%2f20170823152907_d41d8cd98f00b204e9800998ecf8427e_4.jpeg&ehk=FsISayQ5Gjp%2boHXA8OW7nhrZdn2JEzUKk3lfW%2br0P70%3d&risl=&pid=ImgRaw&r=0"
                        alt="">
                </div>
                <div class="d-content">
                    <a-row class="all-msg">
                        <div class="vehicle-msg">
                            <span>上海浦东新区五角场零售中心</span>
                            <!-- 店铺 -->
                            <span class="use tabsty">{{ $t('retail.use') }}零售体验中心</span>
                            <!-- 等级 -->
                            <span class="test-drive tabsty">{{ $t('retail.test_drive') }}A级</span>
                            <!-- 状态 -->
                            <span class="store-type tabsty">{{ $t('retail.test_drive') }}开业</span>
                        </div>
                        <div class="vehicle-id">
                            <span class="key">江苏省常州市天宁区万达购物商场15幢12楼0812号</span>
                            <span class="key">上海大区-上海</span>
                            <span class="key">编码：123456</span>
                        </div>
                    </a-row>
                    <a-row class="row-detail">
                        <!-- 京都 -->
                        <a-col :xs="24" :sm="12" :xl="6" :xxl="6" class="row-item m-t-16">
                            <span class="key">{{ $t('crm_st.longitude') }}：</span>
                            <span class="value">
                                你好
                            </span>
                        </a-col>
                        <!-- 纬度 -->
                        <a-col :xs="24" :sm="12" :xl="18" :xxl="6" class="row-item m-t-16">
                            <span class="key">{{ $t('crm_st.latitude') }}：</span>
                            <span class="value">
                                你好
                            </span>
                        </a-col>
                        <!-- 开业时间 -->
                        <a-col :xs="24" :sm="12" :xl="6" :xxl="6" class="row-item m-t-16">
                            <span class="key">{{ $t('crm_st.open_time') }}：</span>
                            <span class="value">
                                你好
                            </span>
                        </a-col>
                        <!-- 营业时间 -->
                        <a-col :xs="24" :sm="12" :xl="6" :xxl="6" class="row-item m-t-16">
                            <span class="key">{{ $t('crm_st.com_affil') }}：</span>
                            <span class="value">
                                你好
                            </span>
                        </a-col>
                        <!-- 所属门店 -->
                        <a-col :xs="24" :sm="12" :xl="6" :xxl="6" class="row-item m-t-16">
                            <span class="key">{{ $t('dis.business_hours') }}：</span>
                            <span class="value">
                                你好
                            </span>
                        </a-col>
                        <!-- 联系手机 -->
                        <a-col :xs="24" :sm="12" :xl="6" :xxl="6" class="row-item m-t-16">
                            <span class="key">{{ $t('crm_st.con_phone') }}：</span>
                            <span class="value">
                                你好
                            </span>
                        </a-col>
                        <!-- 联系邮箱 -->
                        <a-col :xs="24" :sm="12" :xl="6" :xxl="6" class="row-item m-t-16">
                            <span class="key">{{ $t('crm_st.con_email') }}：</span>
                            <span class="value">
                                你好
                            </span>
                        </a-col>
                        <!-- 门店面积 -->
                        <a-col :xs="24" :sm="12" :xl="6" :xxl="6" class="row-item m-t-16">
                            <span class="key">{{ $t('crm_st.sto_area') }}：</span>
                            <span class="value">
                                你好
                            </span>
                        </a-col>
                        <!-- 车位数 -->
                        <a-col :xs="24" :sm="12" :xl="6" :xxl="6" class="row-item m-t-16">
                            <span class="key">{{ $t('crm_st.park_space') }}：</span>
                            <span class="value">
                                你好
                            </span>
                        </a-col>
                        <!-- 充电桩数 -->
                        <a-col :xs="24" :sm="12" :xl="6" :xxl="6" class="row-item m-t-16">
                            <span class="key">{{ $t('crm_st.charg_station') }}：</span>
                            <span class="value">
                                你好
                            </span>
                        </a-col>
                    </a-row>
                </div>
            </div>
        </div>
        <div class="d-bottom">
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="sto_person" :tab="$t('s.sto_person')">
                    <CrmEditStorePeo />
                </a-tab-pane>
                <a-tab-pane key="sto_car" :tab="$t('s.sto_car')">
                    <ShopCarList />
                </a-tab-pane>
                <a-tab-pane key="store_shift" :tab="$t('s.store_shift')">
                    <ShiftCon />
                </a-tab-pane>
                <a-tab-pane key="contract_info" :tab="$t('s.contract_info')">
                    <ContentInfo />
                </a-tab-pane>
                <a-tab-pane key="licenses" :tab="$t('s.licenses')">
                    <UploadLicenses />
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script setup>

import { ref } from 'vue';
import CrmEditStorePeo from '@/components/crm/panel/CrmEditStorePeo.vue';
import ShopCarList from './components/shop-car-list.vue';
import ContentInfo from './components/content-info.vue';
import UploadLicenses from './components/upload-licenses.vue';
import ShiftCon from './components/ShiftCon.vue';

const activeKey = ref('sto_car')
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
        border: 1px solid #E7E9F0;
        background: #FFF;

        .title {
            color: var(--color-text-5, #1D2129);
            font-size: 18px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            margin-bottom: 16px;
        }

        .container {
            display: flex;

            .d-img {
                .img {
                    margin-right: 20px;
                    width: 240px;
                    height: 160px;
                    object-fit: cover
                }
            }

            .d-content {
                .all-msg {
                    .flex(space-between, flex-start);

                    .vehicle-msg {
                        color: #1D2129;
                        font-size: 16px;
                        font-weight: 600;
                        letter-spacing: 0.167px;

                        .tabsty {
                            height: 19px;
                            line-height: 19px;
                            display: inline-block;
                            padding: 1px 6px;
                            border-radius: 2px;
                            color: #FFFFFF;
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
                        color: var(--color-text-2, #4E5969);
                        font-family: PingFang SC;
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: normal;
                        margin-top: 12px;

                        .key {
                            color: #86909C;
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
        border: 1px solid #E7E9F0;
        background: #FFF;
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
            color: #86909C;
            width: 100px;
            text-align: right;
        }

        .value {
            color: #1D2129;
        }
    }
}

.m-t-16 {
    margin-top: 16px;
}
</style>