<template>
    <div class="home" ref="suppluChain">
        <a-layout>
            <a-layout-content>
                <!-- 已经上传并且没走到成功那一步 -->
                <div class="setp-bar" v-if="setp !== 2">
                    <template v-for="(item, index) in setpObject" :key="index">
                        <div
                            class="setp-base-style setp-text"
                            :style="{
                                backgroundImage: 'url(' + item.bg + ')',
                                color: item.text_color,
                            }"
                        >
                            <SvgIcon class="icon-style" :icon-class="item.icon" />
                            <span>{{ $t(item.t) }}</span>
                        </div>
                    </template>
                </div>
                <div class="content-main">
                    <BasicInfo ref="BasicInfoRef" v-if="setp === 0" />
                    <MaterialList ref="MaterialListRef" v-else-if="setp === 1" />
                    <Successful v-else-if="setp === 2" />
                    <div :style="{ height: setp === 0 ? '70px' : '116px' }"></div>
                </div>
                <div class="supply-chain-footer" v-if="setp !== 2">
                    <!-- 承诺书 -->
                    <div class="promise-book" v-if="setp == 1" @click="handleOpen">
                        <span>{{ $t('supply-chain.please_read_before_submitting_an_application') }}</span>
                        <a class="promise-text">{{ $t('supply-chain.commitment_to_integrity') }}</a>
                        <a class="promise-text">{{
                            $t('supply-chain.confidentiality_and_non_competition_agreement')
                        }}</a>
                    </div>
                    <div class="btn-area">
                        <!-- 保存草稿 -->
                        <a-button @click="handleSave">{{ $t('supply-chain.save_draft') }}</a-button>
                        <a-button type="primary" @click="handleNext" v-if="setp == 0">{{
                            $t('supply-chain.next_step')
                        }}</a-button>
                        <!-- 上一步 -->
                        <a-button @click="handlePrev" v-if="setp == 1">{{ $t('supply-chain.previous_step') }}</a-button>
                        <!-- 提交 -->
                        <a-button type="primary" @click="handleSubmit" v-if="setp == 1">{{
                            $t('supply-chain.submit_application')
                        }}</a-button>
                    </div>
                </div>
            </a-layout-content>
        </a-layout>
        <a-modal
            v-model:visible="visible"
            :keyboard="false"
            :maskClosable="false"
            class="promise-book-modal"
            width="860px"
            :getContainer="
                () => {
                    return suppluChain;
                }
            "
            centered
        >
            <!-- title -->
            <template #title> 请阅读《廉洁承诺书》和《保密和不竞争协议》 </template>
            <!-- body -->
            <template #default>
                <HonestPage />
                <!--保密和不竞争协议 -->
                <SecrecyNotCompete />
            </template>
            <!-- footer -->
            <template #footer>
                <!-- 已阅读，发送申请 -->
                <a-button
                    type="primary"
                    :class="{
                        'btn-disabled': countTime != 0,
                        'read-btn': countTime == 0,
                    }"
                    @click="handleSubmitOk"
                >
                    {{ $t('supply-chain.read_and_send_application') }}
                    <div class="time-area" v-if="countTime != 0">
                        (
                        <span class="timing">{{ countTime }}s</span>
                        )
                    </div>
                </a-button>
            </template>
        </a-modal>
    </div>
</template>

<script setup>
import Core from '@/core';
import { computed, ref, onMounted, watch, onBeforeUnmount } from 'vue';
import SvgIcon from '@/components/MySvgIcon/index.vue';
// import MyStep from "./components/steps.vue";
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
// 基础信息
import BasicInfo from './basic-info.vue';
// 材料清单
import MaterialList from './material-list.vue';
// 成功页
import Successful from './successful.vue';
// 廉洁承诺书
import HonestPage from './components/honest-page.vue';
// 保密和不竞争
import SecrecyNotCompete from './components/secrecy-not-compete.vue';

const $i18n = useI18n();
const $store = useStore();
const $router = useRouter();
const $route = useRoute();
const $message = message;
const $t = $i18n.t;
// ref
const suppluChain = ref(null);
const MaterialListRef = ref(null);
const BasicInfoRef = ref(null);
//步数样式
const setpCount = computed(() => {
    return $store.getters['SUPPLY_CHAIN/SETP'];
});
// 第几步
const setp = computed(() => setpCount.value);
// 步骤条
const setpObject = computed(() => {
    let result = {
        0: {
            setp: 0,
            t: 'supply-chain.basic_info',
            bg: Core.Util.Image.getImageFile('supply-chain', 'setp-base-bg'),
            icon: 'setp-icon-white',
            text_color: '#FFF',
        },
        1: {
            setp: 1,
            t: 'supply-chain.material_list',
            bg: Core.Util.Image.getImageFile('supply-chain', 'setp-material-default-bg'),
            icon: 'setp-icon-black',
            text_color: '#666',
        },
    };

    switch (setpCount.value) {
        case 0:
            result[0].bg = Core.Util.Image.getImageFile('supply-chain', 'setp-base-bg');
            result[0].icon = 'setp-icon-white';
            result[0].text_color = '#FFF';
            result[1].bg = Core.Util.Image.getImageFile('supply-chain', 'setp-material-default-bg');
            break;
        case 1:
            result[0].bg = Core.Util.Image.getImageFile('supply-chain', 'setp-base-bg');
            result[1].bg = Core.Util.Image.getImageFile('supply-chain', 'setp-material-bg');
            result[1].icon = 'setp-icon-white';
            result[1].text_color = '#FFF';
            break;
    }

    return result;
});
// 廉洁承诺书
const visible = ref(false);
// 定时
let countTime = ref(30);
// 定时器
let timer = ref(null);
const form = ref({
    old_password: '',
    password: '',
    new_password: '',
});
const passShow = ref(false);
// 倒计时
const countDown = () => {
    if (timer.value) {
        clearTimeout(timer.value);
        timer.value = null;
    }
    timer.value = setTimeout(() => {
        if (countTime.value > 0) {
            // 如果倒计时还没结束，则继续
            countTime.value--; // 倒计时时间减一
            countDown(); // 没到1秒则继续调用自己
        }
    }, 1000);
};
/* methods start*/
// 上一步
const handlePrev = () => {
    $store.dispatch('SUPPLY_CHAIN/prevStep');
    MaterialListRef.value && MaterialListRef.value.handlePrev();
};
// 下一步
const handleNext = () => {
    BasicInfoRef.value &&
        BasicInfoRef.value
            .step1Vaild()
            .then(res => {
                // 下一步
                $store.dispatch('SUPPLY_CHAIN/nextStep');
            })
            .catch(err => {
                console.log('err-------------------:', err);
            });
};
// 保存草稿
const handleSave = () => {
    // 保存草稿
    MaterialListRef.value && MaterialListRef.value.saveDraft();
    BasicInfoRef.value && BasicInfoRef.value.saveDraft1();
};
// 提交
const handleSubmit = () => {
    // 判断是否已经阅读了
    // 没有阅读
    if (!$store.getters['SUPPLY_CHAIN/ISREAD']) {
        // 打开弹框
        visible.value = true;
    } else {
        MaterialListRef.value.step2Vaild().then(() => {
            handleSubmitData();
        });
    }
};
// 提交申请
const handleSubmitOk = () => {
    // 将阅读状态改为true
    $store.dispatch('SUPPLY_CHAIN/setRead', true);
    // 关闭弹框
    visible.value = false;
    MaterialListRef.value.step2Vaild().then(() => {
        let supplyChain_data = $store.state.SUPPLY_CHAIN.supplyChain; //拿到上传数据
        let supplyDraftChain_data = $store.state.SUPPLY_CHAIN.supplyDraftChain; //拿到草稿数据
        $store.dispatch('SUPPLY_CHAIN/setSupplyDraftChain', Object.assign(supplyDraftChain_data, supplyChain_data));
        // 跳转到注册按钮
        handleSubmitData();
    });
};
// 提交数据
const handleSubmitData = () => {
    // 获取本地上传表单数据
    const data = $store.state.SUPPLY_CHAIN.supplyChain;
    console.log('dataform:', data.form);
    data.form.company_info.province = data.form.company_info.provinceAndCity[0];
    data.form.company_info.city = data.form.company_info.provinceAndCity[1];
    data?.form ? (data.form = JSON.stringify(data.form)) : '{}';
    // 获取类型
    if ($store.state.SUPPLY_CHAIN.supplyType != Core.Const.SUPPLAY.SUPPLAY_TYPE['2'].value) {
        if (data?.confirmatory_material?.proxy_certificate) {
            delete data.confirmatory_material.proxy_certificate;
        }
    }
    Core.Api.SUPPLY.adminAdd(data)
        .then(res => {
            visible.value = false;
            // 获取详情数据
            // getDetail().then(() => {
            //     $store.dispatch("SUPPLY_CHAIN/nextStep");
            // });
            $router.push('/supply-manage/list');
        })
        .catch(err => {
            // console.log("提交数据失败", err.data);
            if (Number(err.data.code) === 41001) {
                // 出现这个问题回归到 第一步骤
                $store.dispatch('SUPPLY_CHAIN/setStep', 0);
            }
            // $message.error(err.message);
        });
};
// 获取详情
const getDetail = () => {
    return new Promise((resolve, reject) => {
        Core.Api.SUPPLY.adminDetail({})
            .then(res => {
                let DETAILS = {};
                DETAILS = res?.detail ?? null;
                if (DETAILS) {
                    if (Object.keys(DETAILS).length > 0) {
                        // 需要显示的是详情数据所以需要合并，用detail数据覆盖草稿数据
                        if (DETAILS?.form) {
                            let type = typeof DETAILS.form;
                            if (type === 'string') {
                                DETAILS.form = JSON.parse(DETAILS.form);
                            }
                            if (type === 'object') {
                                DETAILS.form = DETAILS.form;
                            }
                        } else {
                            DETAILS.form = {};
                        }
                        if (Object.keys($store.state.SUPPLY_CHAIN.supplyDraftChain).length > 0) {
                            DETAILS = Object.assign(DETAILS, $store.state.SUPPLY_CHAIN.supplyDraftChain);
                        }
                        let data = DETAILS;
                        console.log('data:', data);
                        // 存储到草稿数据
                        $store.commit('SUPPLY_CHAIN/setSupplyDraftChain', data);
                        // 如果已经提交了
                        Object.keys(DETAILS.form).length > 0
                            ? $store.commit('SUPPLY_CHAIN/setSubmitEd', true)
                            : $store.commit('SUPPLY_CHAIN/setSubmitEd', false);
                    } else {
                        // 如果没有提交
                        $store.dispatch('SUPPLY_CHAIN/setSubmitEd', false);
                        $store.dispatch('SUPPLY_CHAIN/setSupplyDraftChain', {});
                    }
                } else {
                    // 如果没有提交
                    $store.dispatch('SUPPLY_CHAIN/setSubmitEd', false);
                    $store.dispatch('SUPPLY_CHAIN/setSupplyDraftChain', {});
                }
                resolve();
            })
            .catch(err => {
                $store.dispatch('SUPPLY_CHAIN/setSupplyDraftChain', {});
                reject();
            });
    });
};
// 打开弹框
// 打开
const handleOpen = () => {
    // 如果已经阅读 了
    if ($store.getters['SUPPLY_CHAIN/ISREAD']) {
        // 让倒计时直接为0
        countTime.value = 0;
    } else {
        countTime.value = 30;
    }
    visible.value = true;
};

// 监听 弹框打开，开始倒计时
watch(
    () => visible.value,
    val => {
        // 如果打开了并且倒计时不为0，则开始倒计时
        if (val && countTime.value != 0) {
            countTime.value = 30;
            countDown();
        }
    },
    {
        immediate: true,
    },
);
// 监听是否在第一页
watch(
    () => setp.value,
    val => {
        if (val == 0) {
            // getDetail().then(() => {
            //     BasicInfoRef.value && BasicInfoRef.value.reviewData();
            // });
        }
    },
);

const timer1 = ref(null);
onMounted(() => {
    // getDetail().then(() => {
    //     BasicInfoRef.value && BasicInfoRef.value.reviewData();
    //     // // 如果已经提交了
    //     if (isSubmited.value) {
    //         $store.dispatch("SUPPLY_CHAIN/setStep", 2);
    //     }
    // });
});
// beforeDestroy
onBeforeUnmount(() => {
    clearTimeout(timer1.value);
    timer1.value = null;
    clearTimeout(timer.value);
    timer.value = null;
});

/* methods end*/
</script>

<style lang="less" scoped>
.home {
    position: relative;
    display: flex;
    flex-direction: column;
    :deep(.ant-layout) {
        flex: 1;
        .ant-layout-header {
            height: 80px;
            border-bottom: 1px solid #e5e6eb;
            background: linear-gradient(0deg, #fff 0%, #fff 100%), #f6f7f9;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 64px;
            background: #ffffff;
            border-bottom: 1px solid rgba(82, 91, 103, 0.2);
            padding: 0 20px;
            .fsb();

            .header-left {
                .fcc();

                img.logo {
                    height: 34px;
                    cursor: pointer;
                }
            }
            .header-right {
                .fcc();

                .lang-switch {
                    .icon {
                        font-size: 20px;
                    }
                }

                height: 100%;
                cursor: pointer;
                .fjc();

                i.icon {
                    font-size: 14px;
                }

                i.i_cart {
                    font-size: 25px;
                    color: @TC_header_item;
                }
            }

            .user-info {
                height: 100%;
                .fac();

                &:hover .user-name {
                    color: @TC_P;
                }

                .icon.i_user {
                    margin: 0;
                }
            }

            .user-name {
                margin-left: 10px;
                color: @TC_header_name;
            }
        }
        .ant-layout-content {
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            .setp-bar {
                display: flex;
                height: 52px;
                line-height: 52px;
                width: 100%;
                .setp-base-style {
                    width: 50%;
                    background-size: 100% 100%;
                }

                .setp-text {
                    text-align: center;
                    font-size: 16px;
                    font-weight: 500;
                }

                .icon-style {
                    width: 16px;
                    height: 16px;
                    margin-right: 4px;
                }
            }
            .content-main {
                flex: 1;
                margin-top: 15px;
                overflow-y: scroll;
                background-color: #ffffff;
                border-radius: 6px;
                // 滚动条样式
                &::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                &::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    background: #c0c4cc;
                }
                &::-webkit-scrollbar-track {
                    border-radius: 10px;
                    background: #fff;
                }
            }

            .supply-chain-footer {
                width: calc(100% - 232px);
                position: fixed;
                bottom: 0;
                right: 16px;
                // border-top: 1px solid #EAECF1;
                background: #fff;
                text-align: center;
                box-sizing: border-box;
                .btn-area {
                    display: flex;
                    padding: 18px 0px;
                    justify-content: center;
                    align-items: center;
                    border-top: 1px solid #f2f3f5;
                    background: #fff;
                }
                .promise-book {
                    background-color: #fff;
                    padding: 8px 0;
                    text-align: center;
                    color: #1d2129;
                    .promise-text {
                        color: #0061ff;
                    }
                }
            }
        }
    }
    :deep(.promise-book-modal) {
        //header
        .ant-modal-header {
            color: #1d2129;
            font-size: 16px;
            font-weight: 500;
        }
        .ant-modal-body {
            // ul清除默认样式
            padding: 20px;
            ul {
                padding-left: 0;
                list-style: none;
                color: #666;
            }
            .promise-book {
                .promise-book-title {
                    height: 34px;
                    border-radius: 4px;
                    background: #f2f3f5;
                    display: flex;
                    align-items: center;
                    padding: 9px 10px;
                    margin-bottom: 10px;
                    img {
                        margin-right: 4px;
                    }
                }
            }
        }
        // footer
        .ant-modal-footer {
            text-align: center;
            .btn-disabled,
            .read-btn {
                border-radius: 4px;
                border: 1px solid #0061ff;
                opacity: 0.3;
                background: #0061ff;
                color: #fff;
                cursor: not-allowed;
            }
            .read-btn {
                cursor: pointer;
                opacity: 1;
            }
        }
    }
}
</style>
