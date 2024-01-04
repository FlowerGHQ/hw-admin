<template>
    <div class="supply-chain">
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
                <MyStep v-model:ActiveCurrent="current" />
                <div class="content-main">
                    <!-- 动态组件 -->
                    <component
                        :is="currentComponent"
                        :isSubmit="isSubmit"
                        :isSaveDraft="isSaveDraft"
                        v-model:value="step2Val"
                        class="current-components" />
                </div>
                <div class="supply-chain-footer" v-if="current != 2">
                    <!-- 保存草稿 -->
                    <a-button @click="handleSave">{{
                        $t("supply-chain.save_draft")
                    }}</a-button>
                    <a-button
                        type="primary"
                        @click="handleNext"
                        v-if="current == 0"
                        >{{ $t("supply-chain.next_step") }}</a-button
                    >
                    <!-- 上一步 -->
                    <a-button @click="handleBack" v-if="current == 1">{{
                        $t("supply-chain.previous_step")
                    }}</a-button>
                    <!-- 提交 -->
                    <a-button
                        type="primary"
                        @click="handleSubmit"
                        v-if="current == 1"
                        >{{ $t("supply-chain.submit_application") }}</a-button
                    >
                </div>
            </a-layout-content>
        </a-layout>
    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from "vue";
import MyStep from "./components/steps.vue";
// 基础信息
import BasicInfo from "./basic-info.vue";
// 材料清单
import MaterialList from "./material-list.vue";
// 提交准入申请
import SubmitAdmissionApplication from "./submit-admission-application.vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import {useStore} from "vuex";
const $message = message;
const $router = useRouter();
import Core from "@/core";
const USER_TYPE = Core.Const.USER.TYPE_MAP;
const loginType = Core.Data.getLoginType();
const $Util = Core.Util;
const user = Core.Data.getUser() || {};
const form = reactive({
    old_password: "",
    password: "",
    new_password: "",
});
// 是否提交申请
const isSubmit = ref(false);
const isSaveDraft = ref(false);
const step2Val = ref(false);
const $i18n = useI18n();
const lang = useI18n().locale;
const $store = useStore();
const $t = $i18n.t;
const currentComponent = computed(() => {
    switch (current.value) {
        case 0:
            return BasicInfo;
        case 1:
            return MaterialList;
        case 2:
            return SubmitAdmissionApplication;
        default:
            return BasicInfo;
    }
});
// 步骤条
const current = ref(1);
const passShow = ref(false);
// 监听第二步的校验是否完成
watch(
    () => step2Val.value,
    (val) => {
        if (val) {
            handleNext();
        }
    },
    {
        immediate: true,
    }
);
// 下一步
const handleNext = () => {
    if (current.value == 2) return;
    current.value++;
};
// 上一步
const handleBack = () => {
    if (current.value == 0) return;
    current.value--;
};
// 提交
const handleSubmit = () => {
    // 为了每次点击都知道变化
    isSubmit.value = !isSubmit.value;
};
// 中英文切换
const handleLangSwitch = () => {
    $store.commit("switchLang");
    $i18n.locale.value = $store.state.lang;
};
const handleEditShow = () => {
    passShow.value = true;
};
const handleLogout = () => {
    $router.replace("/login");
    localStorage.clear();
    Core.Api.Common.logout();
};
const handleEditSubmit = () => {
    let form = Core.Util.deepCopy(form);
    if (!form.old_password) {
        return $message.warning($t("u.old_password"));
    }
    if (!form.password) {
        return $message.warning($t("u.new_password"));
    }
    if (!form.new_password) {
        return $message.warning($t("u.again"));
    }
    if (form.new_password !== form.password) {
        $message.warning($t("u.not"));
        return;
    }

    loading = true;
    Core.Api.Common.updatePwd(form)
        .then(() => {
            $message.success($t("pop_up.save_success"));
            handleEditClose();
        })
        .catch((err) => {
            console.log("handleSubmit err:", err);
        });
};
// 保存草稿
const handleSave = () => {
    isSaveDraft.value = !isSaveDraft.value;
};

onMounted(() => {});
</script>

<style lang="less" scoped>
.supply-chain {
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
            padding: 20px 40px 20px 40px;
            position: relative;
            overflow: auto;
            .content-main {
                height: calc(100% - 80px - 68px - 20px);
                margin-top: 15px;
                overflow: auto;
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
                    background: #f2f3f5;
                }
            }
            .supply-chain-footer {
                display: flex;
                height: 68px;
                padding: 18px 0px;
                justify-content: center;
                align-items: center;
                flex-shrink: 0;
                border-top: 1px solid #f2f3f5;
                background: #fff;
            }
        }
    }
}
</style>
