<template>
    <div class="home" ref="suppluChain">
        <a-layout>
            <a-layout-header>
                <div class="header-left">
                    <img
                        src="@images/header-logo2.png"
                        class="logo"
                        alt="浩万" />
                </div>
                <div class="header-right">
                    <!-- 中英文的转换 -->
                    <a-button
                        class="lang-switch"
                        type="link"
                        @click="handleLangSwitch">
                        <i
                            class="icon"
                            :class="lang == 'zh' ? 'i_zh-en' : 'i_en-zh'" />
                    </a-button>
                    <a-divider class="PC" type="vertical" />
                    <a-tag class="PC" color="blue" style="font-size: 12px">{{
                        USER_TYPE[loginType][$i18n.locale]
                    }}</a-tag>
                    <!-- <a-divider type="vertical"/>-->
                    <a-dropdown
                        :trigger="['click']"
                        overlay-class-name="account-action-menu">
                        <a-button class="user-info" type="link">
                            <a-avatar
                                class="user-avatar PC"
                                :src="$Util.imageFilter(user.avatar, 3)"
                                :size="30">
                                <template #icon
                                    ><i class="icon i_user"
                                /></template>
                            </a-avatar>
                            <span class="user-name">{{ user.name }}</span>
                        </a-button>
                        <template #overlay>
                            <a-menu style="text-align: center">
                                <a-menu-item @click="handleEditShow">
                                    <a-button
                                        type="link"
                                        class="menu-item-btn"
                                        >{{ $t("n.password") }}</a-button
                                    >
                                    <a-modal
                                        v-model:visible="passShow"
                                        :title="$t('n.password')"
                                        class="password-edit-modal"
                                        :after-close="handleEditClose">
                                        <div class="form-title">
                                            <div class="form-item required">
                                                <div class="key">
                                                    {{ $t("n.old") }}:
                                                </div>
                                                <div class="value">
                                                    <a-input-password
                                                        :placeholder="
                                                            $t('def.input')
                                                        "
                                                        v-model:value="
                                                            form.old_password
                                                        " />
                                                </div>
                                            </div>
                                            <div class="form-item required">
                                                <div class="key">
                                                    {{ $t("n.new") }}:
                                                </div>
                                                <div class="value">
                                                    <a-input-password
                                                        v-model:value="
                                                            form.password
                                                        "
                                                        :placeholder="
                                                            $t('def.input')
                                                        " />
                                                </div>
                                            </div>
                                            <div class="form-item required">
                                                <div class="key">
                                                    {{ $t("n.double") }}:
                                                </div>
                                                <div class="value">
                                                    <a-input-password
                                                        v-model:value="
                                                            form.new_password
                                                        "
                                                        :placeholder="
                                                            $t('n.double')
                                                        " />
                                                </div>
                                            </div>
                                        </div>
                                        <template #footer>
                                            <a-button
                                                key="back"
                                                @click="handleEditSubmit"
                                                type="primary"
                                                >{{ $t("def.sure") }}</a-button
                                            >
                                            <a-button
                                                @click="passShow = false"
                                                >{{
                                                    $t("def.cancel")
                                                }}</a-button
                                            >
                                        </template>
                                    </a-modal>
                                </a-menu-item>
                                <a-menu-item @click="handleLogout">
                                    <a-button
                                        type="link"
                                        class="menu-item-btn"
                                        >{{ $t("n.exit") }}</a-button
                                    >
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
            </a-layout-header>
            <a-layout-content>
                <div class="setp-bar" v-if="!isSubmited">
                    <template v-for="(item, index) in setpObject" :key="index">
                        <div
                            class="setp-base-style setp-text"
                            :style="{
                                backgroundImage: 'url(' + item.bg + ')',
                                color: item.text_color,
                            }">
                            <SvgIcon
                                class="icon-style"
                                :icon-class="item.icon" />
                            <span>{{ $t(item.t) }}</span>
                        </div>
                    </template>
                </div>
                <div class="submited" v-else>
                    <div class="main-content">
                        <div class="tips">
                            <img
                                src="../../../assets/images/supply-chain/audit.png"
                                alt="" />
                            <span>{{
                                $t(
                                    "supply-chain.data_submitted_please_wait_for_review"
                                )
                            }}</span>
                        </div>
                        <div class="sub_tips">
                            {{
                                $t(
                                    "supply-chain.before_the_audit_is_completed_you_can_always_supplement_the_data"
                                )
                            }}
                        </div>
                    </div>
                </div>
                <div class="content-main">
                    <BasicInfo ref="BasicInfoRef" v-if="setp === 0" />
                    <MaterialList
                        ref="MaterialListRef"
                        v-else-if="setp === 1" />
                </div>
                <div class="supply-chain-footer">
                    <!-- 承诺书 -->
                    <div
                        class="promise-book"
                        v-if="setp == 1"
                        @click="handleOpen">
                        <span>{{
                            $t(
                                "supply-chain.please_read_before_submitting_an_application"
                            )
                        }}</span>
                        <a class="promise-text">{{
                            $t("supply-chain.commitment_to_integrity")
                        }}</a>
                        <a class="promise-text">{{
                            $t(
                                "supply-chain.confidentiality_and_non_competition_agreement"
                            )
                        }}</a>
                    </div>
                    <div class="btn-area">
                        <!-- 保存草稿 -->
                        <a-button @click="handleSave">{{
                            $t("supply-chain.save_draft")
                        }}</a-button>
                        <a-button
                            type="primary"
                            @click="handleNext"
                            v-if="setp == 0"
                            >{{ $t("supply-chain.next_step") }}</a-button
                        >
                        <!-- 上一步 -->
                        <a-button @click="handlePrev" v-if="setp == 1">{{
                            $t("supply-chain.previous_step")
                        }}</a-button>
                        <!-- 提交 -->
                        <a-button
                            type="primary"
                            @click="handleSubmit"
                            v-if="setp == 1"
                            >{{
                                $t("supply-chain.submit_application")
                            }}</a-button
                        >
                    </div>
                </div>
            </a-layout-content>
        </a-layout>
        <a-modal
            v-model:visible="visible"
            class="promise-book-modal"
            width="860px"
            :getContainer="
                () => {
                    return suppluChain;
                }
            "
            centered>
            <!-- title -->
            <template #title>
                请阅读《廉洁承诺书》和《保密和不竞争协议》
            </template>
            <!-- body -->
            <template #default>
                <!--廉洁承诺书 -->
                <div class="promise-book">
                    <div class="promise-book-title">
                        <img
                            src="../../../assets/images/supply-chain/promise_modal.png"
                            alt="" />
                        <span>廉洁承诺书</span>
                    </div>
                    <ul>
                        <li>
                            1.
                            “保密信息”指：披露方或其代表通过任何形式(包括但不限于口头、书面、邮件、传真、QQ、微信、短信、演示等任何方式)、任何载体(包括但不限于文字、数据、电子数据、符号、图形、胶片、图表、图像、视频和音频、计算机媒介和网络等为载体)披露给接收方的有关各自业务、技术和产品等各方面的资料、信息和商业信息等，无论是否记载或标注为保密信息。
                            上述“保密信息”包括但不限于：
                        </li>
                        <li>(1) 双方合作的事实、内容、经过及结果；</li>
                        <li>
                            (2)
                            涉及披露方发展战略及规划、生产经营、业务、人事、资产、财务、客户、技术等相关的任何数据、报表、图幅、报告、信息、资料等；
                        </li>
                        <li>
                            (3)
                            披露方的产品及相关资料或信息，包括但不限于产品工艺、设计研发资料、产品数据、包装技术规格书、生产质量要求、BOM清单、披露方客户信息、披露方及关联公司及客户的技术信息、经营信息、图纸、计划、规格、方法、标准、材料的定价等；
                        </li>
                        <li>
                            (4)
                            披露方现有研发和技术秘密及配方方案、产品原料及供应商、客户、合作方等信息；
                        </li>
                        <li>
                            (5)
                            披露方已经获得或正在申请的知识产权项下的任何信息，或其他未公开的技术诀窍；
                        </li>
                        <li>
                            (6)
                            双方在合作项目中形成的任何配方、技术、数据、知识产权、研发资料、信息等；
                        </li>
                        <li>
                            (7)
                            披露方的市场研究结果、市场渗透资料、市场调研数据、市场销售计划、市场销售策略及其他所有市场及销售信息；
                        </li>
                        <li>
                            (8)
                            披露方专有的任何带有“绝密”、“机密”、“秘密”、“商密”等字样或标示为保密的文件，以及披露方的各项规章制度；
                        </li>
                        <li>
                            (9)
                            协议披露方为进行合作事项而达成的任何合同、协议、约定或在进行合作事项过程中产生的任何笔记、会议纪要、会谈记录等；
                        </li>
                        <li>(10) 其他披露方向接收方披露的信息。</li>
                    </ul>
                </div>
                <!--保密和不竞争协议 -->
                <div class="promise-book">
                    <div class="promise-book-title">
                        <img
                            src="../../../assets/images/supply-chain/promise_modal.png"
                            alt="" />
                        <span>保密和不竞争协议</span>
                    </div>
                    <ul>
                        <li>
                            1.
                            “保密信息”指：披露方或其代表通过任何形式(包括但不限于口头、书面、邮件、传真、QQ、微信、短信、演示等任何方式)、任何载体(包括但不限于文字、数据、电子数据、符号、图形、胶片、图表、图像、视频和音频、计算机媒介和网络等为载体)披露给接收方的有关各自业务、技术和产品等各方面的资料、信息和商业信息等，无论是否记载或标注为保密信息。
                            上述“保密信息”包括但不限于：
                        </li>
                        <li>(1) 双方合作的事实、内容、经过及结果；</li>
                        <li>
                            (2)
                            涉及披露方发展战略及规划、生产经营、业务、人事、资产、财务、客户、技术等相关的任何数据、报表、图幅、报告、信息、资料等；
                        </li>
                        <li>
                            (3)
                            披露方的产品及相关资料或信息，包括但不限于产品工艺、设计研发资料、产品数据、包装技术规格书、生产质量要求、BOM清单、披露方客户信息、披露方及关联公司及客户的技术信息、经营信息、图纸、计划、规格、方法、标准、材料的定价等；
                        </li>
                        <li>
                            (4)
                            披露方现有研发和技术秘密及配方方案、产品原料及供应商、客户、合作方等信息；
                        </li>
                        <li>
                            (5)
                            披露方已经获得或正在申请的知识产权项下的任何信息，或其他未公开的技术诀窍；
                        </li>
                    </ul>
                </div>
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
                    @click="handleSubmitOk">
                    {{ $t("supply-chain.read_and_send_application") }}
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
import Core from "@/core";
import { computed, ref, onMounted ,watch} from "vue";
import SvgIcon from "@/components/MySvgIcon/index.vue";
// import MyStep from "./components/steps.vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
// 基础信息
import BasicInfo from "./basic-info.vue";
// 材料清单
import MaterialList from "./material-list.vue";
const USER_TYPE = Core.Const.USER.TYPE_MAP;
const loginType = Core.Data.getLoginType();
const user = Core.Data.getUser() || {};
const $i18n = useI18n();
const $store = useStore();
const $t = $i18n.t;
// ref
const suppluChain = ref(null);
const MaterialListRef = ref(null);
//步数样式
const setpCount = computed(() => {
    return $store.getters["SUPPLY_CHAIN/SETP"];
});
// 第几步
const setp = computed(() => setpCount.value);
// 步骤条
const setpObject = computed(() => {
    let result = {
        0: {
            setp: 0,
            t: "supply-chain.basic_info",
            bg: Core.Util.Image.getImageFile("supply-chain", "setp-base-bg"),
            icon: "setp-icon-white",
            text_color: "#FFF",
        },
        1: {
            setp: 1,
            t: "supply-chain.material_list",
            bg: Core.Util.Image.getImageFile(
                "supply-chain",
                "setp-material-default-bg"
            ),
            icon: "setp-icon-black",
            text_color: "#666",
        },
    };

    switch (setpCount.value) {
        case 0:
            result[0].bg = Core.Util.Image.getImageFile(
                "supply-chain",
                "setp-base-bg"
            );
            result[0].icon = "setp-icon-white";
            result[0].text_color = "#FFF";
            result[1].bg = Core.Util.Image.getImageFile(
                "supply-chain",
                "setp-material-default-bg"
            );
            break;
        case 1:
            result[0].bg = Core.Util.Image.getImageFile(
                "supply-chain",
                "setp-base-bg"
            );
            result[1].bg = Core.Util.Image.getImageFile(
                "supply-chain",
                "setp-material-bg"
            );
            result[1].icon = "setp-icon-white";
            result[1].text_color = "#FFF";
            break;
    }

    return result;
});
// 是否已经提交
const isSubmited = computed(() => {
    console.log("isSubmitEd", $store.getters["SUPPLY_CHAIN/isSubmitEd"]);
    return $store.getters["SUPPLY_CHAIN/isSubmitEd"];
});

// 廉洁承诺书
const visible = ref(false);
// 定时
let countTime = ref(30);
// 定时器
let timer = null;
// 倒计时
const countDown = () => {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
    timer =  setTimeout(() => {
        if (countTime.value > 0) { // 如果倒计时还没结束，则继续
            countTime.value--; // 倒计时时间减一
            countDown(); // 没到1秒则继续调用自己
        }
    }, 1000);
};

// 监听 弹框打开，开始倒计时
watch(
    () => visible.value,
    (val) => {
        console.log("visible.value", val);
        // 如果打开了并且倒计时不为0，则开始倒计时
        if (val&&countTime.value!=0) {
            countTime.value = 30
            countDown();
        }
    },
    {
        immediate: true,
    }
);

/* methods start*/
// 上一步
const handlePrev = () => {
    $store.dispatch("SUPPLY_CHAIN/prevStep");
};
// 下一步
const handleNext = () => {
    $store.dispatch("SUPPLY_CHAIN/nextStep");
};
// 保存草稿
const handleSave = () => {
    console.log("childrenRef.value111", childrenRef.value);
    // 保存草稿
    childrenRef.value.saveDraft();
};
// 提交
const handleSubmit = () => {
    // 校验
    MaterialListRef.value.step2Vaild();
};
// 获取详情
const getDetail = () => {
    Core.Api.SUPPLY.adminDetail({})
        .then((res) => {
            let DETAILS = {};
            DETAILS = res?.detail ?? null;
            if (DETAILS) {
                $store.dispatch("SUPPLY_CHAIN/setSupplyDetailsChain", DETAILS);
                if(Object.keys(DETAILS).length>0){
                    // 如果已经提交了
                    $store.dispatch("SUPPLY_CHAIN/setSubmitEd", true);
                }else{
                    // 如果没有提交
                    $store.dispatch("SUPPLY_CHAIN/setSubmitEd", false);
                }
            }else{
                // 如果没有提交
                $store.dispatch("SUPPLY_CHAIN/setSubmitEd", false);
            }
        })
        .catch((err) => {
            $store.dispatch("SUPPLY_CHAIN/setSupplyDetailsChain", {});
        });
};
// 打开弹框
// 打开
const handleOpen = () => {
    // 如果已经阅读 了
    if($store.getters["SUPPLY_CHAIN/ISREAD"]){
        // 让倒计时直接为0
        countTime.value = 0
    }
    visible.value = true;
};

onMounted(() => {
    getDetail();
});

/* methods end*/
</script>

<style lang="less" scoped>
.home {
    position: relative;
    height: 100vh;
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

            .header-center {
                .fcc();

                .header-button {
                    height: 40px;
                    border: 0px;
                    padding: 0 10px;
                    text-align: center;
                    align-items: center;

                    .ant-radio-button-wrapper {
                        display: none;
                    }
                }

                .router-type {
                    height: 100%;
                    width: 100%;
                    .fcc();

                    img {
                        width: 30px;
                        height: 30px;
                        margin-right: 10px;
                    }
                }

                .ant-radio-button-wrapper:focus {
                    border: 0px;
                }

                .ant-radio-button-wrapper:not(:first-child)::before {
                    border: 0px solid #d9d9d9;
                    border-radius: 2px 0 0 2px;
                    background: #fff;
                }

                .ant-radio-button-wrapper-checked {
                    background-color: #f3f6f8;
                    border: 0px;
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
            padding: 20px 40px;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            .submited {
                width: 100%;
                height: 121px;
                background-color: #fff;
                margin-top: 20px;
                padding: 20px;
                .main-content {
                    height: 100%;
                    background-color: rgba(0, 97, 255, 0.05);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 16px;
                    .tips {
                        display: flex;
                        align-items: center;
                        color: #165dff;
                        font-size: 18px;
                        font-weight: 500;
                        img {
                            margin-right: 4px;
                        }
                    }
                    .sub_tips {
                        color: #666;
                    }
                }
            }
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
            .content-main{
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
                min-height: 68px;
                width: calc(100%);
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
                    padding: 20px;
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
