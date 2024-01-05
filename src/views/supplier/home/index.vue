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
                <MyStep v-model:ActiveCurrent="current" v-if="!isSubmited"/>
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
                    <!-- 动态组件 -->
                    <component
                        :is="currentComponent"
                        :isSubmit="isSubmit"
                        :isSaveDraft="isSaveDraft"
                        v-model:value="step2Val"
                        :step1Val="step1Val"
                        :detail="detailObj"
                        class="current-components"
                        @handleComeOne="handleBackOne" />
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
import { useStore } from "vuex";
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
const step1Val = ref(false); // 第一步校验变量
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
const current = ref(0);
const passShow = ref(false);
const detailObj = ref({});
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
// 监听第一步的校验是否完成
watch(
    () => step1Val.value,
    (val) => {
        if (val) {
            console.log("step1Val.value ---1", val);
            // handleNext();
        }
    },
    {
        immediate: true,
    }
);
watch(
    ()=>current.value,
    (val)=>{
        if(val == 0){
            getDetail();
        }
    }
)

// 是否已经提交
const isSubmited = computed(() => {
    console.log("isSubmit.value", detailObj.value === null ? false : true);
    return detailObj.value === null ? false : true;
});

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
    // 提交
    const data = {
        type: 1, //类别：1.零件类；2.代理类；3.外协类；4.模具类；5.客指类
        company_name: "1111111", //企业名称
        form: '{"type":"供应类型：1.零件类；2.代理类；3.外协类；4.模具类；5.客指类","position":"职位：1.销售；2.质量；3.技术；4.总经理","contact_info":{"name":"姓名","email":"邮箱","phone":"手机号","flag_wechat":"是否同微信号"},"company_info":{"name":"名称","website_address":"网址","address":"详细地址","established_time":"建筑面积m2","nature":"性质","purchasing_radius":"采购半径Km","floor_area":"占地面积m2","parent_company_name":"母公司名称","parent_company_address":"母公司地址"},"human_resource":{"total_employees":"员工总数","manager_number":"管理人数","mass_number":"质量人数","technician_number":"技术人数","technical_seniority":"技术工龄"},"financial_info":{"flag_legal_dispute":"是否有法律纠纷","average_monthly_wage_of_operating_workers":"操作工人 月平均工资","per_capita_annual_output_value_of_management_staff":"管理职员 人均年产值","account_period_requirement":"账期要求","invoice_type":"发票类型","invoice_range_value":"发票范围值"},"business_info":{"proportion_of_business":"业务比重","list":[{"recent_year":"近几年","taxes_paid":"纳税额","profit_margin":"利润率","asset_liability_ratio ":"资产负债率","cash_flow_ratio":"现金流量比率"}]},"competitor_analysis":[{"company_name":"企业名称","market_share":"市场份额","understand_evaluation":"了解评价"}],"customer_info":[{"customer_name":"客户名称","sales_share":"销售占比","main_supply_part":"主供零件","begin_cooperation_time":"开始合作时间"}],"technical_info":{"patent":"相关专利","RD_center":"研发中心","RD_partners":"研发合作机构","design_guides":"设计规范","product_design":"产品设计: 独立设计,共同设计,转化设计,委外设计","process_design":"过程设计: 模具设计,检具设计,工装设计,辅具设计","process_validation":"过程验证: 模具验收,检具验收,工装维护,产品鉴定","design_software":"设计软件","dev_process":"开发流程"},"quality_info":{"certification":"质量体系认证","partners":"质量合作机构","tool_software":"质控工具软件","PPM":"市场PPM","env_certification":"环境体系认证","accredited_laboratory":"认可实验室","system_certification":"计划体系认证"},"produce_capacity":{"processes":"关键自有工序","automation_line":"智能自动化线","load":"生产产能负荷"},"outsourcing":{"technology":"外购工艺","parts":"外购备件","material":"外购原料","system":"外购制度"},"specify_info":{"reason":"指定理由","parts":"指定零件","protocol":"指定协议","service":"指定服务"},"service_info":{"technical_services":"技术服务","quality_service":"质量服务","supply_services":"供应服务"},"production_equipment":[{"name":"生产设备名称","spec":"规格型号","quantity":"数量","manufacturer":"设备制造商","purchase_period":"购置年限"}],"detection_equipment":[{"name":"检测设备名称","Spec":"规格型号","quantity":"数量","manufacturer":"设备制造商","accuracy_level":"精度等级"}],"confirmatory_material":{"business_license_photo":"营业执照照片","registered_capital":"注册资本(万元)","begin_business_time":"营业开始时间","end_business_time":"营业结束时间","account_name":"开户名","account_with_bank":"开户行","account_with_bank_number":"开户行行号","bank_account":"银行账号","quality_system_certificate":"质量体系证书","proxy_certificate":"代理证书","account_opening_bank_license":"开户行许可证","eia_certificate":"环评证书","environmental_report":"环保报告"},"additional_info":"补充信息"}', //表单
    };

    Core.Api.SUPPLY.add(data)
        .then((res) => {
            console.log("res", res);
            $message.success($t("supply-chain.supply_submit_successfully"));
        })
        .catch((err) => {
            $message.error($t("supply-chain.supply_submit_failed"));
        });
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
// 获取-详情
const getDetail = () => {
    Core.Api.SUPPLY.adminDetail({})
        .then((res) => {
            console.log("res", res);
            detailObj.value = res?.detail ?? null;
            if (detailObj.value) {
                let jsonStr = JSON.parse(detailObj.value.form);
                Core.Data.setSupplyDraftChain(jsonStr);
            }

        })
        .catch((err) => {
        });
};

// 回到第一步
const handleBackOne = () => {
    current.value = 0;
};
onMounted(() => {
    getDetail();
});
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
            padding: 20px 40px 80px 40px;
            position: relative;
            overflow: hidden;
            .submited {
                width: 100%;
                height: 121px;
                background-color: #fff;
                margin-top: 20px;
                padding: 20px;
                .main-content{
                    height: 100%;
                    background-color: rgba(0, 97, 255, 0.05);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 16px;
                    .tips{
                        display: flex;
                        align-items: center;
                        color: #165DFF;
                        font-size: 18px;
                        font-weight: 500;
                        img{
                            margin-right: 4px;
                        }
                    }
                    .sub_tips{
                        color:  #666;
                    }
                }
            }
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
