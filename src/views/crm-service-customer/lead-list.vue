<template>
    <div class="service-customer">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">客服线索比例分配</div>
                <div class="btns-area">
                    <a-button type="primary" @click="onAllocation">分配</a-button>
                </div>
            </div>
            <div class="table-container">
                <div class="lead">
                    <template v-for="(item,index) in leadList" :key="index">
                        <div class="lead-item m-r-16 m-t-16">
                            <div class="lead-item-left">
                                <div class="left-avatar">
                                    <img class="avatar-img" :src="Static.defaultAvatar" alt="">                                
                                </div>
                            </div>
                            <div class="lead-item-right m-l-12">
                                <div class="lead-item-r-t">
                                    <div class="lead-name">
                                        客服1
                                    </div>
                                    <div class="lead-switch">
                                        <span class="m-r-6">是否参与分配</span>
                                        <a-switch v-model:checked="checked" size="small"/>
                                    </div>
                                </div>
                                <div class="lead-item-r-b">
                                    <div class="lead-percent">
                                        <div class="lead-percent-text">线索分配比例</div>
                                        <div class="lead-percent-p">20%</div>
                                    </div>
                                    <a-progress :percent="30" strokeColor="#0161FF" :showInfo="false"/>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>

    <!-- 弹窗口 -->
    <a-modal 
        v-model:visible="leadVisible" 
        title="分配线索比例"
        @ok="onLeadModelOk"
        @cancel="onCancel"
    >
        <div class="lead-model">            
            <div class="lead-model-item m-r-16 m-t-16">
                <div class="lead-model-item-left">
                    <div class="left-avatar">
                        <img class="avatar-img" :src="Static.defaultAvatar" alt="">                                
                    </div>
                </div>
                <div class="lead-model-item-right m-l-12">
                    <div class="lead-item-r-t">
                        <div class="lead-name">
                            客服1
                        </div>                      
                    </div>
                    <div class="lead-item-r-b m-t-10">
                        <div class="lead-percent">
                            <div class="lead-percent-text">20%</div>
                            <div class="lead-percent-p">/100%</div>
                        </div>
                        <div class="icon-wrapper">
                            <img class="minus-icon" src="../../assets/images/crm-service-customer/minus-circle.png" alt="" @click="onMinus"> 
                            <a-slider class="slider" v-model:value="sliderValue" :min="0" :max="100" />
                            <img class="add-icon" src="../../assets/images/crm-service-customer/add-circle.png" alt="" @click="onAdd">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </a-modal>

</template>

<script setup>
    import Static from '../crm-staging/static';
    import { ref, onMounted }  from 'vue'

    const leadList = ref([
        {
            id: 1,
            
        },
        {},       
    ])
    const leadVisible = ref(false)
    const sliderValue = ref(30)

    onMounted(() => {})
    /* fetch start */
    const fetch = (params = {}) => {
        let obj = {
            ...params
        }
        Core.Api.XXX(obj).then(res => {
            Core.Logger.success("参数", obj, "结果", res)
        }).catch(err => {
            Core.Logger.error("参数", obj, "结果", err)
        })
    }
    /* fetch end */

    /* methods start */
    // 分配点击按钮
    const onAllocation = () => {
        leadVisible.value = true
    }
    // model确认按钮
    const onLeadModelOk = () => {

    }
    // model取消按钮
    const onCancel = () => {}

    // model slider 减少按钮
    const onMinus = () => {
        if (sliderValue.value === 0) {
            sliderValue.value = 0
            return
        }
        sliderValue.value--
    }

    // slider 添加按钮
    const onAdd = () => {
        if (sliderValue.value === 100) {
            sliderValue.value = 100
            return
        }
        sliderValue.value++
    }
    /* methods end */
</script>

<style lang="less" scoped>
.service-customer {
    .lead {
        .fcc(initial, initial);
        flex-wrap: wrap;        
        .lead-item {
            width: 315px;
            padding: 16px;
            box-sizing: border-box;
            border-radius: 8px;
            border-radius: 8px;
            border: 1px solid #F2F3F5;
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
                        color: #1D2129;
                        font-size: 16px;
                        font-weight: 600;
                    }
                    .lead-switch {
                        .fcc();
                        color: #86909C;
                        font-size: 12px;
                        font-weight: 400;
                    }
                }
                .lead-item-r-b {
                    .lead-percent {
                        .fcc(space-between);
                        &-text {
                            color: #4E5969;
                            font-size: 14px;
                            font-weight: 400;
                        }
                        &-p {
                            color: #1D2129;
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
    .lead-model-item {
        width: 315px;
        padding: 16px;
        box-sizing: border-box;
        border-radius: 8px;
        border-radius: 8px;
        border: 1px solid #F2F3F5;
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
                        color: #1D2129;
                        font-size: 16px;
                        font-weight: 600;
                    }                   
            }
            .lead-item-r-b {
                .lead-percent {
                    .fcc(initial);
                    &-text {
                        color: #0061FF;
                        font-size: 14px;
                        font-weight: 600;
                    }
                    &-p {
                        color: #1D2129;
                        font-size: 14px;
                        font-weight: 600;
                    }
                }
                .icon-wrapper {
                    .fcc(initial);
                    .slider {
                        width: 100%;
                        :deep(.ant-slider-track) {
                            background-color: #0161FF;
                        }
                    }
                    .minus-icon {
                        width: 16px;
                        height: 16px;
                    }
                    .add-icon {
                        width: 16px;
                        height: 16px;
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
</style>