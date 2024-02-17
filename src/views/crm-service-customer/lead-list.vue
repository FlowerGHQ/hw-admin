<template>
    <div class="service-customer">
        <div class="list-container service-customer-container">
            <div class="title-container">
                <div class="title-area">客服线索比例分配</div>
                <div class="btns-area">
                    <a-button type="primary" @click="onAllocation">分配</a-button>
                </div>
            </div>
            <div class="table-container">
                <div class="lead">
                    <template v-for="(item, index) in leadList" :key="index">
                        <div class="lead-item m-r-16 m-t-16">
                            <div class="lead-item-left">
                                <div class="left-avatar">
                                    <img
                                        v-if="!item.avatar || item.avatar === ''"
                                        class="avatar-img"
                                        :src="Static.defaultAvatar"
                                        alt=""
                                    />
                                    <img v-else class="avatar-img" :src="item.avatar" alt="" />
                                </div>
                            </div>
                            <div class="lead-item-right m-l-12">
                                <div class="lead-item-r-t">
                                    <div class="lead-name">
                                        {{ item.name || '-' }}
                                    </div>
                                    <div class="lead-switch">
                                        <span class="m-r-6">是否参与分配</span>
                                        <a-switch
                                            v-model:checked="item.isChecked"
                                            size="small"
                                            @change="event => onSwitch(event, item)"
                                        />
                                    </div>
                                </div>
                                <div class="lead-item-r-b">
                                    <div class="lead-percent">
                                        <div class="lead-percent-text">线索分配比例</div>
                                        <div class="lead-percent-p">{{ item.new_customer_assign_rate || 0 }}%</div>
                                    </div>
                                    <a-progress
                                        :percent="item.new_customer_assign_rate || 0"
                                        strokeColor="#0161FF"
                                        :showInfo="false"
                                    />
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>

    <!-- 弹窗口 -->
    <a-modal v-model:visible="leadVisible" title="分配线索比例" width="700px" @ok="onLeadModelOk" @cancel="onCancel">
        <div class="lead-model">
            <template v-for="(item, index) in allocationList" :key="index">
                <!-- m-r-16 -->
                <div v-if="item.isChecked" class="lead-model-item m-t-16">
                    <div class="lead-model-item-left">
                        <div class="left-avatar">
                            <img
                                v-if="!item.avatar || item.avatar === ''"
                                class="avatar-img"
                                :src="Static.defaultAvatar"
                                alt=""
                            />
                            <img v-else class="avatar-img" :src="item.avatar" alt="" />
                        </div>
                    </div>
                    <div class="lead-model-item-right m-l-12">
                        <div class="lead-item-r-t">
                            <div class="lead-name">
                                {{ item.name || '-' }}
                            </div>
                        </div>
                        <div class="lead-item-r-b m-t-10">
                            <div class="icon-wrapper">
                                <a-input-number v-model:value="item.new_customer_assign_rate" :min="0" :max="100" />
                                <span class="percent-symbol m-l-8">%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </a-modal>
</template>

<script setup>
import Static from '../crm-staging/static';
import { ref, onMounted, getCurrentInstance, onUnmounted } from 'vue';
import Core from '@/core';
const { proxy } = getCurrentInstance();

const leadList = ref([
    // {
    //     id: 1,
    //     name: "客服1",
    //     new_customer_assign_rate: 20,
    //     avatar: "",
    // },
    // {
    //     id: 2,
    //     name: "客服2",
    //     new_customer_assign_rate: 20,
    //     avatar: "",
    // },
    // {
    //     id: 3,
    //     name: "客服3",
    //     new_customer_assign_rate: 10,
    //     avatar: "",
    // },
    // {
    //     id: 4,
    //     name: "客服4",
    //     new_customer_assign_rate: 80,
    //     avatar: "",
    // },
]); // 线索比例分配list
const allocationList = ref([]); // 点击分配按钮list
const leadVisible = ref(false);

onMounted(() => {
    getAllocationListFetch();
});
onUnmounted(() => {
    Core.Data.clearCustomerServiceClue();
});
/* fetch start */
// 客服线索分配list
const getAllocationListFetch = (params = {}) => {
    let obj = {
        type: Core.Const.RETAIL.Job_Map.CUSTOMER_SERVICE,
        ...params,
    };
    Core.Api.CustomService.getAllocationList(obj)
        .then(res => {
            Core.Logger.success('参数', obj, '客服线索分配list', res);
            leadList.value = res;
            leadList.value.forEach(el => {
                if (Core.Data.getCustomerServiceClue().includes(el.id)) {
                    el.isChecked = false;
                    return;
                }
                el.isChecked = true;
            });
        })
        .catch(err => {
            Core.Logger.error('参数', obj, '客服线索分配list', err);
        });
};
// 设置系统分配
const setAllocationFetch = (params = {}) => {
    let obj = {
        ...params,
    };
    Core.Api.CustomService.setAllocation(obj)
        .then(res => {
            Core.Logger.success('参数', obj, '设置系统分配', res);
            onCancel();
            getAllocationListFetch();
        })
        .catch(err => {
            Core.Logger.error('参数', obj, '设置系统分配', err);
        });
};
/* fetch end */

/* methods start */
// 分配点击按钮
const onAllocation = () => {
    leadVisible.value = true;
    allocationList.value = Core.Util.deepCopy(leadList.value);
};
// model确认按钮
const onLeadModelOk = () => {
    let sum = 0;
    let user_set_system_assign_list = [];
    allocationList.value.forEach(el => {
        sum += el.new_customer_assign_rate;
        user_set_system_assign_list.push({
            id: el.id,
            new_customer_assign_rate: el.new_customer_assign_rate,
        });
    });

    if (sum > 100) {
        return proxy.$message.warning('参与分配的客服的比例相加要等于100%,请修改后再进行确认');
    }
    Core.Logger.log('分配的客服的数据', user_set_system_assign_list);

    setAllocationFetch({
        user_set_system_assign_list,
    });
};
// model取消按钮
const onCancel = () => {
    leadVisible.value = false;
};
// radioswitch选择
const onSwitch = (e, item) => {
    const result = Core.Data.getCustomerServiceClue() || [];
    if (e) {
        if (result.indexOf(item.id) !== -1) {
            result.splice(result.indexOf(item.id), 1);
        }
    } else {
        result.push(item.id);
    }
    Core.Data.setCustomerServiceClue(result);
};

/* methods end */
</script>

<style lang="less" scoped>
.service-customer {
    height: 100%;
    .service-customer-container {
        height: 100%;
    }
    .lead {
        .fcc(initial, initial);
        flex-wrap: wrap;
        .lead-item {
            width: 315px;
            padding: 16px;
            box-sizing: border-box;
            border-radius: 8px;
            border-radius: 8px;
            border: 1px solid #f2f3f5;
            .fcc(initial, initial);
            &-left {
                .left-avatar {
                    .avatar-img {
                        width: 64px;
                        height: 64px;
                        background-color: red;
                        border-radius: 50%;
                    }
                }
            }
            &-right {
                width: 100%;
                .lead-item-r-t {
                    .fcc(space-between);
                    justify-content: space-between;
                    .lead-name {
                        color: #1d2129;
                        font-size: 16px;
                        font-weight: 600;
                    }
                    .lead-switch {
                        .fcc();
                        color: #86909c;
                        font-size: 12px;
                        font-weight: 400;
                    }
                }
                .lead-item-r-b {
                    .lead-percent {
                        .fcc(space-between);
                        &-text {
                            color: #4e5969;
                            font-size: 14px;
                            font-weight: 400;
                        }
                        &-p {
                            color: #1d2129;
                            font-size: 14px;
                            font-weight: 600;
                        }
                    }
                }
            }
        }
    }
}

.lead-model {
    .fcc(space-between, initial);
    flex-wrap: wrap;
    .lead-model-item {
        width: 315px;
        padding: 16px;
        box-sizing: border-box;
        border-radius: 8px;
        border-radius: 8px;
        border: 1px solid #f2f3f5;
        .fcc(initial, initial);
        &-left {
            .left-avatar {
                .avatar-img {
                    width: 64px;
                    height: 64px;
                    background-color: red;
                    border-radius: 50%;
                }
            }
        }
        &-right {
            width: 100%;
            .lead-item-r-t {
                .fcc(space-between);
                justify-content: space-between;
                .lead-name {
                    color: #1d2129;
                    font-size: 16px;
                    font-weight: 600;
                }
            }
            .lead-item-r-b {
                .icon-wrapper {
                    .percent-symbol {
                        color: #1d2129;
                        font-size: 16px;
                        font-weight: 600;
                    }
                }
            }
        }
    }
}
.m-t-16 {
    margin-top: 16px;
}
.m-t-10 {
    margin-top: 10px;
}
.m-l-12 {
    margin-left: 12px;
}
.m-r-16 {
    margin-right: 16px;
}
.m-r-6 {
    margin-right: 6px;
}
.m-l-8 {
    margin-left: 8px;
}
</style>
