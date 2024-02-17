<template>
    <div class="follow-up follow-contenter">
        <!--  <a-button type="primary" @click="clickModelOk">
            <template #icon><EditOutlined /></template>
            写跟进
        </a-button> -->

        <a-modal
            width="560px"
            height="485px"
            v-model:visible="isShowFollow"
            title="线索转移"
            centered
            @ok="clickModelOk"
        >
            <!--  <a-select
                ref="select"
                v-model:value="value1"
                style="width: 100%"
                @focus="focus"
                @change="handleChange"
            >
                <a-select-option value="jack">Jack</a-select-option>
                <a-select-option value="lucy">Lucy</a-select-option>
                <a-select-option value="disabled" disabled>Disabled</a-select-option>
                <a-select-option value="Yiminghe">yiminghe</a-select-option>
            </a-select> -->

            <!-- 转移目标区域 -->
            <div class="form-item required">
                <div class="key">转移目标区域：</div>
                <div class="value">
                    <a-select
                        v-model:value="followObj.group_id"
                        placeholder="选择转移目标区域"
                        @change="groupChangeClick"
                    >
                        <a-select-option v-for="item of optionsRegion" :key="item.key" :value="item.id">{{
                            item.name
                        }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <!-- 转移目标城市 -->
            <div class="form-item required">
                <div class="key">转移目标城市：</div>
                <div class="value">
                    <a-select
                        v-model:value="followObj.city"
                        placeholder="选择转移目标城市"
                        :disabled="!followObj.group_id"
                        @change="cityChangeClick"
                    >
                        <a-select-option v-for="item of optionsCity" :key="item.id" :value="item.city">{{
                            item.city
                        }}</a-select-option>
                    </a-select>
                </div>
            </div>

            <!-- 转移目标门店 -->
            <div class="form-item required">
                <div class="key">转移目标门店：</div>
                <div class="value">
                    <a-select
                        v-model:value="followObj.store_id"
                        placeholder="选择转移目标门店"
                        :disabled="!followObj.city"
                        @change="storeChangeClick"
                    >
                        <a-select-option v-for="item of optionsStore" :key="item.id" :value="item.id">{{
                            item.name
                        }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <!-- 转移目标体验官 -->
            <div class="form-item required">
                <div class="key">转移目标体验官：</div>
                <div class="value">
                    <a-select
                        v-model:value="followObj.store_user_id"
                        placeholder="选择转移目标体验官"
                        allowClear
                        show-search
                        option-label-prop="label"
                    >
                        <a-select-option
                            :value="item?.id"
                            :label="item.user_name"
                            v-for="(item, index) in peopleList"
                            :key="item.value"
                        >
                            <img :src="item.avatar" class="options-img" alt="" />
                            <div class="option-right">
                                <div class="options-top">
                                    <span class="name-option">{{ item.user_name }}</span
                                    >&nbsp;&nbsp; <span class="phone-option">{{ item.user_phone }}</span
                                    >&nbsp;&nbsp; <span class="work-option">{{ $Util.peoStoreStatus(item.type) }}</span>
                                </div>
                                <div class="area-option">
                                    {{ item.group_name }}-{{ item.city }}&nbsp;&nbsp;{{ item.store_name }}
                                </div>
                            </div>
                        </a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item flex-aline required">
                <div class="key">转移原因：</div>
                <div class="value">
                    <a-textarea v-model:value="followObj.remark" placeholder="请输入转移原因" :rows="4" />
                </div>
            </div>
            <template #footer>
                <a-button key="submit" type="primary" @click="handleOk">确认转移</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script setup>
import Core from '@/core';
import { reactive, ref, getCurrentInstance, onMounted, inject } from 'vue';

const userId = inject('userId');
const getChildData = inject('getChildData');

const { proxy } = getCurrentInstance();
// 弹窗显示变量
const isShowFollow = ref(false);
const followObj = reactive({
    group_id: '',
    city: '',
    store_id: '',
    store_user_id: '',
    remark: '',
    // id: userId.value,
});
// 所属大区
const optionsRegion = ref([]);
// 所属城市
const optionsCity = ref([]);
// 门店列表
const optionsStore = ref([]);
// 获取人员列表
const peopleList = ref([]);

onMounted(() => {
    getRegionsList();
});
// 点击转移按钮
const clickModelOk = () => {
    isShowFollow.value = true;
    optionsCity.value = [];
    optionsStore.value = [];
    peopleList.value = [];
    Object.assign(followObj, {
        group_id: '',
        city: '',
        store_id: '',
        store_user_id: '',
        remark: '',
    });
};
// 获取区域列表
const getRegionsList = () => {
    Core.Api.CustomService.groupList()
        .then(res => {
            Core.Logger.success('getRegionsList', res);
            optionsRegion.value = res.list;
        })
        .catch(err => {
            Core.Logger.error('参数', '数据', err);
        });
};
// 获取城市列表
const getCityList = value => {
    Core.Api.CustomService.getCityList({
        id: value,
    })
        .then(res => {
            Core.Logger.success('getCityList', res);
            optionsCity.value = res;
        })
        .catch(err => {
            Core.Logger.error('参数', '数据', err);
        });
};

// 获取门店列表
const getStoreList = () => {
    Core.Api.CustomService.storeList({
        group_id: followObj.group_id,
        city: followObj.city,
        page_size: 500,
    })
        .then(res => {
            Core.Logger.success('storeList', res);
            optionsStore.value = res.list;
        })
        .catch(err => {
            Core.Logger.error('参数', '数据', err);
        });
};

// 区域更改事件
const groupChangeClick = value => {
    Core.Logger.success('groupChangeClick', value);
    followObj.city = '';
    followObj.store_user_id = '';
    followObj.store_id = '';
    getCityList(value);
};
// 城市更改事件
const cityChangeClick = value => {
    Core.Logger.success('cityChangeClick', value);
    followObj.store_user_id = '';
    followObj.store_id = '';
    getStoreList();
};
// 门店更改事件
const storeChangeClick = value => {
    Core.Logger.success('storeChangeClick', value);
    followObj.store_user_id = '';
    getPeopleList();
};
defineExpose({ clickModelOk });
const handleOk = () => {
    console.log('followObj---', followObj);
    if (!followObj.group_id) {
        return proxy.$message.warning(proxy.$t('def.enter'));
    } else if (!followObj.city) {
        return proxy.$message.warning(proxy.$t('def.enter'));
    } else if (!followObj.store_id) {
        return proxy.$message.warning(proxy.$t('def.enter'));
    } else if (!followObj.store_user_id) {
        return proxy.$message.warning(proxy.$t('def.enter'));
    } else if (!followObj.remark) {
        return proxy.$message.warning(proxy.$t('def.enter'));
    }
    if (followObj.store_user_id) {
        Core.Api.CustomService.upDateTransfer({
            ...followObj,
            id: userId.value,
        })
            .then(res => {
                Core.Logger.success('upDateTransfer数据', res);
                proxy.$message.success('转移成功');
                isShowFollow.value = false;
                getChildData('3');
            })
            .catch(err => {
                Core.Logger.error('参数', '数据', err);
            });
    } else {
        Core.Api.USER_CENTER.distributionStore({
            ...followObj,
            ids: [userId.value],
        })
            .then(res => {
                proxy.$message.success('转移成功');
                isShowFollow.value = false;
                getChildData('3');
            })
            .catch(err => {});
    }
};
// 门店人员-获取
const getPeopleList = () => {
    Core.Api.CustomService.storeUserList({
        store_id: followObj.store_id,
        page_size: 500,
    })
        .then(res => {
            Core.Logger.success('getPeopleList', res);
            peopleList.value = res.list;
        })
        .catch(err => {
            Core.Logger.error('参数', '数据', err);
        });
};
</script>

<style lang="less" scoped>
.flex-aline {
    display: flex;
    align-items: flex-start;
}

.name-option {
    color: #1d2129;
    font-size: 16px;
    font-weight: 600;
}
:deep(.ant-select-selection-item) {
    display: flex;
    align-items: center;
    .options-img {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: none;
    }
    .work-option {
        display: none;
    }
    .area-option {
        display: none;
    }
    .name-option {
        font-weight: 400;
        font-size: 12px;
    }
}
.options-img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin: 10px 0px;
}
.option-right {
    display: inline-flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
    vertical-align: top;
    margin-left: 12px;
    padding: 10px 0px;
}
.area-option {
    color: #86909c;
    font-size: 12px;
    font-weight: 400;
}
.form-item {
    .key {
        width: 135px;
    }
}
</style>
