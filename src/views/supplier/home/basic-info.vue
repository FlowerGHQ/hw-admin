<template>
    <div class="material-list">
        <div class="base-info content-area top-box">
            <div class="title">{{ $t("supply-chain.type_supply") }}</div>
            <div class="base-info-form flex-1">
                <a-row :gutter="24" style="flex: 1">
                    <a-col :span="2" class="title-area align-center">
                        <div class="title-two"></div>
                    </a-col>
                    <a-col :span="22">
                        <div class="top-type-box">
                            <div
                                v-for="(item, index) in Core.Const.SUPPLAY.SUPPLAY_TYPE"
                                @click="formState.type = item.value"
                                class="type-parts m-t-16"
                                :class="{
                                    'click-type': item.value === formState.type,
                                    'type-parts-change': item.value !== formState.type,
                                    'border-type': item.value !== formState.type,
                                }">
                                <MySvgIcon
                                    :icon-class="`white-${item.icon}`"
                                    :class="{
                                        'white-font': item.value === formState.type,
                                        'black-font': item.value !== formState.type,
                                    }" />
                                <span
                                    class="m-l-4 type-font"
                                    :class="{
                                        'color-w': item.value === formState.type,
                                        'black-font': item.value !== formState.type,
                                    }">
                                    {{
                                        Core.Const.SUPPLAY.SUPPLAY_TYPE[item.value]
                                            ? $t(Core.Const.SUPPLAY.SUPPLAY_TYPE[item.value].t)
                                            : "-"
                                    }}
                                </span>
                            </div>
                        </div>
                    </a-col>
                </a-row>
            </div>
        </div>
        <div class="base-info content-area margin-t-20">
            <div class="title">{{ $t("supply-chain.contact") }}</div>
            <div class="base-info-form">
                <a-form ref="formRef1" name="custom-validation" :model="formState" :rules="rules" labelAlign="right">
                    <a-row :gutter="24">
                        <a-col :span="3" class="title-area">
                            <div class="title-two"></div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 职业 -->
                                    <a-form-item :label="$t('supply-chain.Position')" name="positon">
                                        <a-checkbox-group
                                            @change="handleCheckBox"
                                            v-model:value="formState.position"
                                            name="positon"
                                            :options="plainOptions" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <!-- 姓名 联系人邮箱  联系方式 同步微信-->
                            <a-row :gutter="24">
                                <!-- <a-col :span="12">
                                  <a-form-item :label="$t('supply-chain.name')" name="contact_name">
                                      <a-input :maxlength="7" name="contact_name" v-model:value="formState.contact_info.name" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                              <a-col :span="12">
                                  <a-form-item
                                      :label="$t('supply-chain.mailbox')"
                                      name="contact_email">
                                      
                                      <a-input name="contact_email" v-model:value="formState.contact_info.email" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col> -->
                                <a-col :span="24">
                                    <a-form-item :label="' '" name="contact_info" class="form-content-item">
                                        <div class="form-content-item-table" name="contact_info">
                                            <a-table
                                                :columns="contact_info_column"
                                                :dataSource="formState.contact_info"
                                                :row-key="(record) => record.id"
                                                :pagination="false"
                                                class="specific-table-position"
                                                :rowClassName="
                                                    (record, index) =>
                                                        record.position === 4
                                                            ? 'no-require'
                                                            : record.position !== 4 &&
                                                              (!record.name || !record.email || !record.phone)
                                                            ? 'require'
                                                            : ''
                                                ">
                                                <template #bodyCell="{ column, record, index }">
                                                    <template v-if="column.dataIndex === 'position'">
                                                        <div
                                                            :class="{
                                                                'position-label': true,
                                                                'no-require': record.position === 4,
                                                            }">
                                                            {{ $t(Core.Const.SUPPLAY.POSITION_MAP[record.position].t) }}
                                                        </div>
                                                    </template>
                                                    <template v-if="column.dataIndex === 'name'">
                                                        <a-input
                                                            name="name"
                                                            :class="{
                                                                require: record.position !== 4 && !record.name,
                                                            }"
                                                            v-model:value="record.name"
                                                            :placeholder="$t('supply-chain.please_enter')" />
                                                    </template>
                                                    <template v-if="column.dataIndex === 'phone'">
                                                        <div class="phone-and-wechart">
                                                            <a-input
                                                                name="phone"
                                                                class="phone-area"
                                                                :class="{
                                                                    require: record.position !== 4 && !record.phone,
                                                                }"
                                                                v-model:value="record.phone"
                                                                :placeholder="$t('supply-chain.please_enter')" />
                                                            <a-checkbox
                                                                class="flag-wechat-area"
                                                                v-model:checked="record.flag_wechat"
                                                                >{{ $t("supply-chain.wechat_same_number") }}</a-checkbox
                                                            >
                                                        </div>
                                                    </template>
                                                    <template v-if="column.dataIndex === 'email'">
                                                        <a-input
                                                            name="email"
                                                            :class="{
                                                                require: record.position !== 4 && !record.email,
                                                            }"
                                                            v-model:value="record.email"
                                                            :placeholder="$t('supply-chain.please_enter')" />
                                                    </template>
                                                </template>
                                            </a-table>
                                        </div>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <!-- <a-row :gutter="24">
                              <a-col :span="12">
                                  <a-form-item
                                      :label="$t('supply-chain.contact')"
                                      name="contact_flag_phone">
                                      
                                      <a-input name="contact_flag_phone" v-model:value="formState.contact_info.phone" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                              <a-col :span="12">
                                  <a-form-item>
                                      <a-checkbox  v-model:checked="formState.contact_info.flag_wechat">{{ $t('supply-chain.wechat_same_number') }}</a-checkbox>
                                      
                                  </a-form-item>
                              </a-col>
                          </a-row> -->
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </div>
        <div class="base-info content-area margin-t-20">
            <div class="title">{{ $t("supply-chain.basic_info") }}</div>
            <div class="base-info-form">
                <a-form ref="formRef2" name="custom-validation" :model="formState" :rules="rules" labelAlign="right">
                    <!-- 公司概况 -->
                    <a-row :gutter="24">
                        <a-col :span="3" class="title-area">
                            <div class="title-two">
                                <!-- 公司概况 -->
                                {{ $t("supply-chain.company_profile") }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <!-- 公司名称 -->
                                <a-col :span="12">
                                    <a-form-item :label="$t('supply-chain.company_name')" name="company_name_name">
                                        <a-input
                                            name="company_name_name"
                                            v-model:value="formState.company_info.name"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                                <!-- 公司网址 -->
                                <a-col :span="12">
                                    <a-form-item :label="$t('supply-chain.company_website')" name="company_website">
                                        <a-input
                                            name="company_website"
                                            v-model:value="formState.company_info.website_address"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 成立日期 -->
                                    <a-form-item
                                        :label="$t('supply-chain.date_establishment')"
                                        name="date_establishment">
                                        <span name="date_establishment">
                                            <a-date-picker
                                                :placeholder="$t('def.select')"
                                                valueFormat="X"
                                                v-model:value="formState.company_info.established_time" />
                                        </span>
                                    </a-form-item>
                                </a-col>
                                <!-- 法人代表 -->
                                <!-- <a-col :span="12">
                                  <a-form-item
                                      :label="$t('supply-chain.legal_representative')"
                                       name="legal_representative">
                                       <a-input name="legal_representative" v-model:value="formState.company_info.legal_person" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col> -->
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 固定资产 -->

                                    <a-form-item :label="$t('supply-chain.fixed_assets')">
                                        <a-input
                                            v-model:value="formState.company_info.fixed_assets"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                                <!-- 法人代表 -->
                                <a-col :span="12">
                                    <a-form-item
                                        :label="$t('supply-chain.legal_representative')"
                                        name="legal_representative">
                                        <a-input
                                            name="legal_representative"
                                            v-model:value="formState.company_info.legal_person"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 详细地址 -->
                                    <a-form-item :label="$t('supply-chain.detailed_address')" name="company_address">
                                        <a-input
                                            name="company_address"
                                            v-model:value="formState.company_info.address"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 公司性质 -->
                                    <a-form-item :label="$t('supply-chain.nature_of_company')">
                                        <a-select
                                            v-model:value="formState.company_info.nature"
                                            :placeholder="$t('supply-chain.please_select')">
                                            <a-select-option
                                                :value="item.value"
                                                v-for="item in Core.Const.SUPPLAY.NATURE">
                                                {{ $t(item.t) }}</a-select-option
                                            >
                                        </a-select>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <!-- 采购半径 -->
                                    <a-form-item :label="$t('supply-chain.purchasing_radius')">
                                        <a-input-number
                                            v-model:value="formState.company_info.purchasing_radius"
                                            :placeholder="$t('def.input')"
                                            :min="0">
                                            <template #addonAfter>
                                                <span class="l-w-h-style">KM</span>
                                            </template>
                                        </a-input-number>
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        returnTypeBool(formState.type, [
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers,
                                        ])
                                            ? 12
                                            : 0
                                    ">
                                    <!-- 占地面积 -->
                                    <a-form-item :label="$t('supply-chain.floor_space')">
                                        <a-input-number
                                            v-model:value="formState.company_info.floor_area"
                                            :placeholder="$t('def.input')"
                                            :min="0">
                                            <template #addonAfter>
                                                <span class="l-w-h-style">m²</span>
                                            </template>
                                        </a-input-number>
                                    </a-form-item>
                                </a-col>
                                <a-col
                                    :span="
                                        returnTypeBool(formState.type, [
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers,
                                        ])
                                            ? 12
                                            : 0
                                    ">
                                    <!-- 建筑面积 -->
                                    <a-form-item :label="$t('supply-chain.floor_area')">
                                        <a-input-number
                                            v-model:value="formState.company_info.building_area"
                                            :placeholder="$t('def.input')"
                                            :min="0">
                                            <template #addonAfter>
                                                <span class="l-w-h-style">m²</span>
                                            </template>
                                        </a-input-number>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        !returnTypeBool(formState.type, [
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold,
                                        ])
                                            ? 12
                                            : 0
                                    ">
                                    <!-- 经营场所 -->
                                    <a-form-item :label="$t('supply-chain.establishments')">
                                        <a-input
                                            v-model:value="formState.company_info.premises"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        returnTypeBool(formState.type, [
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers,
                                        ])
                                            ? 12
                                            : 0
                                    ">
                                    <!-- 母公司名称 -->
                                    <a-form-item :label="$t('supply-chain.parent_company_name')">
                                        <a-input
                                            v-model:value="formState.company_info.parent_company_name"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                                <a-col
                                    :span="
                                        returnTypeBool(formState.type, [
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers,
                                        ])
                                            ? 12
                                            : 0
                                    ">
                                    <!-- 母公司地址 -->
                                    <a-form-item :label="$t('supply-chain.Parent_company_address')">
                                        <a-input
                                            v-model:value="formState.company_info.parent_company_address"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>

                    <!-- 代理公司概况 -->
                    <a-row :gutter="24">
                        <a-col
                            :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker]) ? 3 : 0"
                            class="title-area">
                            <div class="title-two">
                                <!-- 代理信息 -->
                                {{ $t("supply-chain.agent_information") }}
                            </div>
                        </a-col>
                        <a-col
                            :span="
                                returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker]) ? 21 : 0
                            ">
                            <a-row :gutter="24">
                                <!-- 被代理公司 -->
                                <a-col :span="12">
                                    <a-form-item :label="$t('supply-chain.agent_company')">
                                        <a-input
                                            v-model:value="formState.agent_info.agent_company"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                                <!-- 被代理地址 -->
                                <a-col :span="12">
                                    <a-form-item :label="$t('supply-chain.proxy_address')" name="company_website">
                                        <a-input
                                            name="company_website"
                                            v-model:value="formState.agent_info.agent_address"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 被代理关系 -->
                                    <a-form-item :label="$t('supply-chain.agency_relationship')">
                                        <a-date-picker
                                            :placeholder="$t('def.select')"
                                            valueFormat="X"
                                            v-model:value="formState.agent_info.agent_relationship" />
                                    </a-form-item>
                                </a-col>

                                <a-col :span="12">
                                    <!-- 代理有效期间 -->
                                    <a-form-item
                                        :label="$t('supply-chain.duration_of_agency')"
                                        name="duration_of_agency">
                                        <span name="duration_of_agency">
                                            <TimeSearch
                                                ref="TimeSearchRef"
                                                @search="handleTimeSearch"
                                                :defaultTime="false" />
                                        </span>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <!-- 是否有代理权证 代理权证 -->
                                <a-col :span="24">
                                    <a-form-item :label="$t('supply-chain.proxy_warrant')" name="proxy_warrant">
                                        <a-radio-group
                                            name="proxy_warrant"
                                            v-model:value="formState.agent_info.flag_agent_warrant">
                                            <a-radio
                                                :value="radio.value"
                                                v-for="radio in Core.Const.SUPPLAY.Legal_Dispute"
                                                :key="radio.value">
                                                {{ $t(radio.t) }}
                                            </a-radio>
                                        </a-radio-group>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 代理产品 -->
                                    <a-form-item :label="$t('supply-chain.agent_product')">
                                        <a-input
                                            v-model:value="formState.agent_info.agent_product"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                    <!-- 人力资源 -->
                    <a-row :gutter="24">
                        <a-col
                            :span="
                                !returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker]) ? 3 : 0
                            "
                            class="title-area">
                            <div class="title-two">
                                {{ $t("supply-chain.human_resources") }}
                            </div>
                        </a-col>
                        <a-col
                            :span="
                                !returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker]) ? 21 : 0
                            ">
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 员工总数 -->
                                    <a-form-item :label="$t('supply-chain.total_number_of_employees')">
                                        <a-input-number
                                            v-model:value="formState.human_resource.total_employees"
                                            :placeholder="$t('def.input')"
                                            :min="0">
                                        </a-input-number>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <!-- 管理人数 -->
                                    <a-form-item :label="$t('supply-chain.number_of_managers')">
                                        <a-input-number
                                            v-model:value="formState.human_resource.manager_number"
                                            :placeholder="$t('def.input')"
                                            :min="0">
                                        </a-input-number>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 质量人数 -->
                                    <a-form-item :label="$t('supply-chain.mass_number')">
                                        <a-input-number
                                            v-model:value="formState.human_resource.mass_number"
                                            :placeholder="$t('def.input')"
                                            :min="0">
                                        </a-input-number>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <!-- 技术人数 -->
                                    <a-form-item :label="$t('supply-chain.skilled_personnel')">
                                        <a-input-number
                                            v-model:value="formState.human_resource.technician_number"
                                            :placeholder="$t('def.input')"
                                            :min="0">
                                        </a-input-number>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 技术工龄 -->
                                    <a-form-item :label="$t('supply-chain.technical_seniority')">
                                        <a-input-number
                                            v-model:value="formState.human_resource.technical_seniority"
                                            :placeholder="$t('def.input')"
                                            :min="0">
                                        </a-input-number>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                    <!-- 财务信息 -->
                    <a-row :gutter="24">
                        <a-col :span="3" class="title-area">
                            <div class="title-two">
                                {{ $t("supply-chain.financial_information") }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24" :span="21">
                                <a-col :span="24">
                                    <!-- 法律纠纷 -->
                                    <a-form-item :label="$t('supply-chain.legal_dispute')" name="flag_legal_dispute">
                                        <a-radio-group
                                            name="flag_legal_dispute"
                                            v-model:value="formState.financial_info.flag_legal_dispute">
                                            <a-radio
                                                :value="radio.value"
                                                v-for="radio in Core.Const.SUPPLAY.Legal_Dispute"
                                                :key="radio.value">
                                                {{ $t(radio.t) }}
                                            </a-radio>
                                        </a-radio-group>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        !returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker])
                                            ? 12
                                            : 0
                                    ">
                                    <!-- 操作工人月平均工资 -->
                                    <a-form-item :label="$t('supply-chain.average')">
                                        <a-input
                                            v-model:value="
                                                formState.financial_info.average_monthly_wage_of_operating_workers
                                            "
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                                <a-col
                                    :span="
                                        !returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker])
                                            ? 12
                                            : 0
                                    ">
                                    <!-- 管理职员人均年产值 -->
                                    <a-form-item :label="$t('supply-chain.per')">
                                        <a-input
                                            v-model:value="
                                                formState.financial_info
                                                    .per_capita_annual_output_value_of_management_staff
                                            "
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 账期要求 -->
                                    <a-form-item
                                        :label="$t('supply-chain.period_requirement')"
                                        name="period_requirement">
                                        <a-radio-group
                                            name="period_requirement"
                                            v-model:value="formState.financial_info.account_period_requirement">
                                            <a-radio
                                                :value="radio.value"
                                                v-for="radio in Core.Const.SUPPLAY.ACCOUNt_PERIOD_REQUIREMENT_LIST"
                                                :key="radio.value">
                                                {{ `${radio.value ? radio.value + $t(radio.unit) : $t(radio.t)}` }}
                                            </a-radio>
                                        </a-radio-group>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 发票类型 -->
                                    <a-form-item :label="$t('supply-chain.Invoice_type')" name="Invoice_type">
                                        <a-radio-group
                                            name="Invoice_type"
                                            v-model:value="formState.financial_info.invoice_type">
                                            <a-radio
                                                :value="radio.value"
                                                v-for="radio in Core.Const.SUPPLAY.INVOICE_TYPE"
                                                :key="radio.value">
                                                <span
                                                    :class="{
                                                        'middle-radio': radio.value === 1,
                                                    }">
                                                    {{ $t(radio.t) }}
                                                    <a-input
                                                        :maxlength="50"
                                                        v-model:value="formState.financial_info.invoice_range_value"
                                                        placeholder="范围值"
                                                        v-if="radio.value === 1" />
                                                </span>
                                            </a-radio>
                                        </a-radio-group>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>

                    <!-- 营业信息 -->
                    <a-row :gutter="24">
                        <a-col :span="3" class="title-area">
                            <div class="title-two">
                                {{ $t("supply-chain.business_information") }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 业务比重 -->
                                    <a-form-item
                                        :label="$t('supply-chain.proportion_of_business')"
                                        name="proportion_of_business">
                                        <a-input
                                            name="proportion_of_business"
                                            v-model:value="formState.business_info.proportion_of_business"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <!-- 近一年 二 三 -->
                            <a-row :gutter="24">
                                <a-col :span="8">
                                    <a-form-item label="近一年"> </a-form-item>
                                </a-col>
                                <a-col :span="8">
                                    <a-form-item label="近二年"> </a-form-item>
                                </a-col>
                                <a-col :span="8">
                                    <a-form-item label="近三年"> </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="8" v-for="(item, index) in 3">
                                    <!-- 销售额 -->
                                    <a-form-item :label="$t('supply-chain.sales_volume')" name="sales">
                                        <span name="sales">
                                            <a-input-number
                                                v-model:value="formState.business_info.list[index].sales"
                                                :placeholder="$t('def.input')"
                                                :min="0">
                                                <template #addonAfter>
                                                    <span class="l-w-h-style">{{
                                                        $t("supply-chain.ten_thousand_yuan")
                                                    }}</span>
                                                </template>
                                            </a-input-number>
                                        </span>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        !returnTypeBool(formState.type, [
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers,
                                        ])
                                            ? 8
                                            : 0
                                    "
                                    v-for="(item, index) in 3">
                                    <!-- 纳税额 -->
                                    <a-form-item :label="$t('supply-chain.tax_amount')" name="taxes_paid">
                                        <a-input-number
                                            name="taxes_paid"
                                            v-model:value="formState.business_info.list[index].taxes_paid"
                                            :placeholder="$t('def.input')"
                                            :min="0">
                                            <template #addonAfter>
                                                <span class="l-w-h-style">{{
                                                    $t("supply-chain.ten_thousand_yuan")
                                                }}</span>
                                            </template>
                                        </a-input-number>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        !returnTypeBool(formState.type, [
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers,
                                        ])
                                            ? 8
                                            : 0
                                    "
                                    v-for="(item, index) in 3">
                                    <!-- 利润率 -->
                                    <a-form-item :label="$t('supply-chain.profit_rate')" name="profit_margin">
                                        <a-input-number
                                            name="profit_margin"
                                            v-model:value="formState.business_info.list[index].profit_margin"
                                            :placeholder="$t('def.input')"
                                            :min="0">
                                            <template #addonAfter>
                                                <span class="l-w-h-style">%</span>
                                            </template>
                                        </a-input-number>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        !returnTypeBool(formState.type, [
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers,
                                        ])
                                            ? 8
                                            : 0
                                    "
                                    v-for="(item, index) in 3">
                                    <!-- 资产负债率 -->
                                    <a-form-item
                                        name="asset_liability_ratio"
                                        :label="$t('supply-chain.asset_liability_ratio')">
                                        <a-input-number
                                            name="asset_liability_ratio"
                                            v-model:value="formState.business_info.list[index].asset_liability_ratio"
                                            :placeholder="$t('def.input')"
                                            :min="0">
                                            <template #addonAfter>
                                                <span class="l-w-h-style">%</span>
                                            </template>
                                        </a-input-number>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        !returnTypeBool(formState.type, [
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers,
                                        ])
                                            ? 8
                                            : 0
                                    "
                                    v-for="(item, index) in 3">
                                    <!-- 现金流量比率 -->
                                    <a-form-item name="cash_flow_ratio" :label="$t('supply-chain.cash_flow_ratio')">
                                        <a-input-number
                                            name="cash_flow_ratio"
                                            v-model:value="formState.business_info.list[index].cash_flow_ratio"
                                            :placeholder="$t('def.input')"
                                            :min="0">
                                            <template #addonAfter>
                                                <span class="l-w-h-style">%</span>
                                            </template>
                                        </a-input-number>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>

                    <!-- 竞争对手 -->
                    <a-row :gutter="24">
                        <a-col
                            :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part]) ? 3 : 0"
                            class="title-area">
                            <div class="title-two">
                                {{ $t("supply-chain.competitor") }}
                            </div>
                        </a-col>
                        <a-col
                            :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part]) ? 21 : 0">
                            <div class="form-content-item-table">
                                <a-table
                                    :columns="competitor_analysis_column"
                                    :dataSource="formState.competitor_analysis"
                                    :scroll="{ x: true }"
                                    :row-key="(record) => record.id"
                                    :pagination="false"
                                    class="specific-table">
                                    <template #headerCell="{ title }">
                                        {{ $t(title) }}
                                    </template>
                                    <template #bodyCell="{ column, record, index }">
                                        <!-- 竞争对手序号 -->
                                        <template v-if="column.dataIndex === 'company_order'">
                                            {{ record.company_order }}
                                        </template>
                                        <template v-if="column.type === 'input'">
                                            <a-input
                                                v-model:value="record[column.dataIndex]"
                                                :placeholder="$t('def.input')" />
                                        </template>
                                        <template v-else-if="column.type === 'input-num'">
                                            <a-input-number
                                                v-model:value="record[column.dataIndex]"
                                                :placeholder="$t('def.input')"
                                                :min="0">
                                                <template #addonAfter v-if="column.unit">
                                                    <span class="l-w-h-style">{{ column.unit }}</span>
                                                </template>
                                            </a-input-number>
                                        </template>
                                        <template v-else-if="column.type === 'time'">
                                            <a-date-picker
                                                :placeholder="$t('def.select')"
                                                valueFormat="X"
                                                v-model:value="record[column.dataIndex]" />
                                        </template>
                                        <template v-else-if="column.dataIndex === 'operation'">
                                            <a-button
                                                type="link"
                                                v-if="index"
                                                @click="
                                                    handleDelete(
                                                        formState.competitor_analysis,
                                                        record,
                                                        '竞争对手',
                                                        'company_order'
                                                    )
                                                ">
                                                <i class="icon i_delete" />
                                                {{ $t("def.delete") }}
                                            </a-button>
                                        </template>
                                    </template>
                                </a-table>
                                <a-button
                                    class="spec-add"
                                    type="primary"
                                    ghost
                                    @click="
                                        handleAddSpecItem(
                                            formState.competitor_analysis,
                                            competitor_analysis_obj,
                                            '竞争对手',
                                            'company_order'
                                        )
                                    ">
                                    {{ $t("supply-chain.add_opponents") }}
                                </a-button>
                            </div>
                        </a-col>
                    </a-row>

                    <!-- 客户信息 -->
                    <a-row :gutter="24">
                        <a-col :span="3" class="title-area">
                            <div class="title-two" id="customer_information">
                                {{ $t("supply-chain.customer_information") }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <!-- 主要客户 -->
                            <div class="form-content-item-table">
                                <a-table
                                    :columns="customer_info_list_column"
                                    :dataSource="formState.customer_info"
                                    :scroll="{ x: true }"
                                    :row-key="(record) => record.id"
                                    :pagination="false"
                                    class="specific-table">
                                    <template #headerCell="{ title }">
                                        {{ $t(title) }}
                                    </template>
                                    <template #bodyCell="{ column, record, index }">
                                        <!-- 客户序号 -->
                                        <!-- <template
                                            v-if="column.dataIndex === 'customer_order'"
                                        >
                                            {{ record.customer_order }}
                                        </template>  -->
                                        <template v-if="column.type === 'input'">
                                            <!-- `${column.dataIndex}+${index}` -->
                                            <a-form-item :name="column.dataIndex">
                                                <a-input
                                                    :name="column.dataIndex"
                                                    v-model:value="record[column.dataIndex]"
                                                    :placeholder="$t('def.input')" />
                                            </a-form-item>
                                        </template>
                                        <template v-else-if="column.type === 'input-num'">
                                            <a-form-item :name="column.dataIndex">
                                                <a-input-number
                                                    :name="column.dataIndex"
                                                    v-model:value="record[column.dataIndex]"
                                                    :placeholder="$t('def.input')"
                                                    :min="0">
                                                    <template #addonAfter v-if="column.unit">
                                                        <span class="l-w-h-style">{{ column.unit }}</span>
                                                    </template>
                                                </a-input-number>
                                            </a-form-item>
                                        </template>
                                        <template v-else-if="column.type === 'time'">
                                            <a-form-item :name="column.dataIndex">
                                                <span :name="column.dataIndex">
                                                    <a-date-picker
                                                        :placeholder="$t('def.select')"
                                                        valueFormat="X"
                                                        picker="year"
                                                        v-model:value="record[column.dataIndex]" />
                                                </span>
                                            </a-form-item>
                                        </template>
                                        <template v-else-if="column.dataIndex === 'operation'">
                                            <a-button
                                                type="link"
                                                v-if="index"
                                                @click="
                                                    handleDelete(
                                                        formState.customer_info,
                                                        record,
                                                        '主要客户',
                                                        'customer_order'
                                                    )
                                                ">
                                                <i class="icon i_delete" />
                                                {{ $t("def.delete") }}
                                            </a-button>
                                        </template>
                                    </template>
                                </a-table>
                                <a-button
                                    class="spec-add"
                                    type="primary"
                                    ghost
                                    @click="
                                        handleAddSpecItem(
                                            formState.customer_info,
                                            customer_info_list_obj,
                                            '主要客户',
                                            'customer_order'
                                        )
                                    ">
                                    {{ $t("supply-chain.add_customers") }}
                                </a-button>
                            </div>
                        </a-col>
                    </a-row>

                    <!-- 技术信息 -->
                    <a-row :gutter="24">
                        <a-col
                            :span="
                                !returnTypeBool(formState.type, [
                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers,
                                ])
                                    ? 3
                                    : 0
                            "
                            class="title-area">
                            <div class="title-two">
                                {{ $t("supply-chain.Technical_information") }}
                            </div>
                        </a-col>
                        <a-col
                            :span="
                                !returnTypeBool(formState.type, [
                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers,
                                ])
                                    ? 21
                                    : 0
                            ">
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 相关专利 -->
                                    <a-form-item :label="$t('supply-chain.related_patent')">
                                        <a-input
                                            v-model:value="formState.technical_info.patent"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                                <a-col
                                    :span="
                                        returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part])
                                            ? 12
                                            : 0
                                    ">
                                    <!-- 研发中心 -->
                                    <a-form-item :label="$t('supply-chain.research_and_development_center')">
                                        <a-input
                                            v-model:value="formState.technical_info.RD_center"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part])
                                            ? 24
                                            : 0
                                    ">
                                    <!-- 研发合作机构 -->
                                    <a-form-item :label="$t('supply-chain.r_d_partner')">
                                        <a-input
                                            v-model:value="formState.technical_info.RD_partners"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        returnTypeBool(formState.type, [
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold,
                                        ])
                                            ? 24
                                            : 0
                                    ">
                                    <!-- 设计规范 -->
                                    <a-form-item :label="$t('supply-chain.design_specifications')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.technical_info.design_guides"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part])
                                            ? 24
                                            : 0
                                    ">
                                    <!-- 产品设计 -->
                                    <a-form-item :label="$t('supply-chain.product_design')">
                                        <a-checkbox-group
                                            v-model:value="formState.technical_info.product_design"
                                            :options="TECHNICAL_INFORMATION" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 过程设计 -->
                                    <a-form-item :label="$t('supply-chain.process_design')">
                                        <a-checkbox-group
                                            v-model:value="formState.technical_info.process_design"
                                            :options="PROCESS_DESIGN" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 过程验证 -->
                                    <a-form-item :label="$t('supply-chain.process_verification')">
                                        <a-checkbox-group
                                            v-model:value="formState.technical_info.process_validation"
                                            :options="PROCESS_VALIDATION" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold])
                                            ? 24
                                            : 0
                                    ">
                                    <!-- 模具轮廓 -->
                                    <a-form-item :label="$t('supply-chain.mold_profile')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.technical_info.mold_profile"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold])
                                            ? 24
                                            : 0
                                    ">
                                    <!-- 模具重量 -->
                                    <a-form-item :label="$t('supply-chain.mold_weight')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.technical_info.mold_weight"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold])
                                            ? 24
                                            : 0
                                    ">
                                    <!-- 模具品类 -->
                                    <a-form-item :label="$t('supply-chain.mold_category')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.technical_info.mold_category"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold])
                                            ? 24
                                            : 0
                                    ">
                                    <!-- 模具设计 -->
                                    <a-form-item :label="$t('supply-chain.mould_design')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.technical_info.mold_design"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold])
                                            ? 24
                                            : 0
                                    ">
                                    <!-- 模具制造 -->
                                    <a-form-item :label="$t('supply-chain.mold_manufacturing')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.technical_info.mold_manufacture"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold])
                                            ? 24
                                            : 0
                                    ">
                                    <!-- 模具验收 -->
                                    <a-form-item :label="$t('supply-chain.mold_acceptance')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.technical_info.mold_acceptance"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 设计软件 -->
                                    <a-form-item :label="$t('supply-chain.design_software')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.technical_info.design_software"
                                            placeholder="请输入"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 开发流程 -->
                                    <a-form-item :label="$t('supply-chain.development_process')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.technical_info.dev_process"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>

                    <!-- 质量信息 -->
                    <a-row :gutter="24">
                        <a-col
                            :span="
                                !returnTypeBool(formState.type, [
                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold,
                                ])
                                    ? 3
                                    : 0
                            "
                            class="title-area">
                            <div class="title-two">
                                {{ $t("supply-chain.quality_information") }}
                            </div>
                        </a-col>
                        <a-col
                            :span="
                                !returnTypeBool(formState.type, [
                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold,
                                ])
                                    ? 21
                                    : 0
                            ">
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 质量体系认证 -->
                                    <a-form-item :label="$t('supply-chain.quality_system_certification')">
                                        <a-input
                                            v-model:value="formState.quality_info.certification"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <!-- 环境体系认证 -->
                                    <a-form-item :label="$t('supply-chain.environmental_system_certification')">
                                        <a-input
                                            v-model:value="formState.quality_info.environmental_system_certification"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 质量合作机构 -->
                                    <a-form-item :label="$t('supply-chain.quality_cooperation_agency')">
                                        <a-input
                                            v-model:value="formState.quality_info.partners"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <!-- 认可实验室 -->
                                    <a-form-item :label="$t('supply-chain.accredited_laboratory')">
                                        <a-input
                                            v-model:value="formState.quality_info.accredited_laboratory"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 质控工具软件 -->
                                    <a-form-item :label="$t('supply-chain.quality_control_tool_software')">
                                        <a-input
                                            v-model:value="formState.quality_info.tool_software"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <!-- 计划体系认证 -->
                                    <a-form-item :label="$t('supply-chain.planning_system_certification')">
                                        <a-input
                                            v-model:value="formState.quality_info.system_certification"
                                            :placeholder="$t('supply-chain.please_enter')" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 市场PPM -->
                                    <a-form-item :label="$t('supply-chain.market_PPM')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.quality_info.PPM"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>

                    <!-- 产能产线 -->
                    <a-row :gutter="24">
                        <a-col
                            :span="
                                returnTypeBool(formState.type, [
                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,
                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                                ])
                                    ? 3
                                    : 0
                            "
                            class="title-area">
                            <div class="title-two">
                                {{ $t("supply-chain.capacity_line") }}
                            </div>
                        </a-col>
                        <a-col
                            :span="
                                returnTypeBool(formState.type, [
                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,
                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                                ])
                                    ? 21
                                    : 0
                            ">
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 关键自有工序 -->
                                    <a-form-item name="processes" :label="$t('supply-chain.key_owned_process')">
                                        <a-textarea
                                            name="processes"
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.produce_capacity.processes"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 智能自动化线 -->
                                    <a-form-item
                                        name="automation_line"
                                        :label="$t('supply-chain.intelligent_automation_line')">
                                        <a-textarea
                                            name="automation_line"
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.produce_capacity.automation_line"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 生产产能负荷 -->
                                    <a-form-item name="load" :label="$t('supply-chain.production_capacity_load')">
                                        <a-textarea
                                            name="load"
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.produce_capacity.load"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>

                    <!-- 外购管理 -->
                    <a-row :gutter="24">
                        <a-col
                            :span="
                                returnTypeBool(formState.type, [
                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,
                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                                ])
                                    ? 3
                                    : 0
                            "
                            class="title-area">
                            <div class="title-two">
                                {{ $t("supply-chain.qutsourcing_management") }}
                            </div>
                        </a-col>
                        <a-col
                            :span="
                                returnTypeBool(formState.type, [
                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,
                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                                ])
                                    ? 21
                                    : 0
                            ">
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 外购工艺 -->
                                    <a-form-item :label="$t('supply-chain.qutsourced_technology')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.outsourcing.technology"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 外购备件 -->
                                    <a-form-item :label="$t('supply-chain.qutsourced_spare_parts')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.outsourcing.parts"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 外购原料 -->
                                    <a-form-item :label="$t('supply-chain.purchased_raw_materials')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.outsourcing.material"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 外购制度 -->
                                    <a-form-item :label="$t('supply-chain.qutsourcing_system')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.outsourcing.system"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>

                    <!-- 指定信息 -->
                    <a-row :gutter="24">
                        <a-col
                            :span="
                                returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers])
                                    ? 3
                                    : 0
                            "
                            class="title-area">
                            <div class="title-two">
                                {{ $t("supply-chain.specify_information") }}
                            </div>
                        </a-col>
                        <a-col
                            :span="
                                returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers])
                                    ? 21
                                    : 0
                            ">
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 指定理由 -->
                                    <a-form-item name="reason" :label="$t('supply-chain.specify_reason')">
                                        <a-textarea
                                            name="reason"
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.specify_info.reason"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 指定零件 -->
                                    <a-form-item name="parts" :label="$t('supply-chain.specify_part')">
                                        <a-textarea
                                            name="parts"
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.specify_info.parts"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 指定协议 -->
                                    <a-form-item name="protocol" :label="$t('supply-chain.specified_protocol')">
                                        <a-textarea
                                            name="protocol"
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.specify_info.protocol"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 指定服务 -->
                                    <a-form-item name="service" :label="$t('supply-chain.specify_service')">
                                        <a-textarea
                                            name="service"
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.specify_info.service"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>

                    <!-- 服务信息 -->
                    <a-row :gutter="24">
                        <a-col
                            :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker]) ? 3 : 0"
                            class="title-area">
                            <div class="title-two">
                                {{ $t("supply-chain.service_information") }}
                            </div>
                        </a-col>
                        <a-col
                            :span="
                                returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker]) ? 21 : 0
                            ">
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 技术服务 -->
                                    <a-form-item :label="$t('supply-chain.technical_service')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.service_info.technical_services"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 质量服务 -->
                                    <a-form-item :label="$t('supply-chain.quality_service')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.service_info.quality_service"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 供应服务 -->
                                    <a-form-item :label="$t('supply-chain.supply_of_services')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.specify_info.supply_services"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </div>

        <!-- 设备信息 -->
        <div
            class="base-info content-area margin-t-20"
            v-if="!returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker])">
            <div class="title">
                {{ $t("supply-chain.device_information") }}
            </div>
            <!-- 关键生产设备 -->
            <div class="base-info-form">
                <a-form :rules="rules" ref="formRef3" :model="formState" labelAlign="right">
                    <a-row :gutter="24">
                        <a-col :span="3" class="title-area">
                            <div class="title-two">
                                {{ $t("supply-chain.key_production_equipment") }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <div class="form-content-item-table">
                                <a-table
                                    :columns="production_equipment_column"
                                    :dataSource="formState.production_equipment"
                                    :scroll="{ x: true }"
                                    :row-key="(record) => record.id"
                                    :pagination="false"
                                    class="specific-table">
                                    <template #headerCell="{ title }">
                                        {{ $t(title) }}
                                    </template>
                                    <template #bodyCell="{ column, record, index }">
                                        <template v-if="column.type === 'input'">
                                            <a-form-item :name="`production_${column.dataIndex}`">
                                                <a-input
                                                    :name="`production_${column.dataIndex}`"
                                                    v-model:value="record[column.dataIndex]"
                                                    :placeholder="$t('def.input')" />
                                            </a-form-item>
                                        </template>
                                        <template v-else-if="column.type === 'input-num'">
                                            <a-form-item :name="`production_${column.dataIndex}`">
                                                <a-input-number
                                                    :name="`production_${column.dataIndex}`"
                                                    v-model:value="record[column.dataIndex]"
                                                    :placeholder="$t('def.input')"
                                                    :min="0">
                                                    <template #addonAfter v-if="column.unit">
                                                        <span class="l-w-h-style">{{ column.unit }}</span>
                                                    </template>
                                                </a-input-number>
                                            </a-form-item>
                                        </template>
                                        <template v-else-if="column.type === 'time'">
                                            <a-form-item :name="`production_${column.dataIndex}`">
                                                <span :name="`production_${column.dataIndex}`">
                                                    <a-date-picker
                                                        :placeholder="$t('def.select')"
                                                        valueFormat="X"
                                                        v-model:value="record[column.dataIndex]" />
                                                </span>
                                            </a-form-item>
                                        </template>
                                        <template v-else-if="column.dataIndex === 'operation'">
                                            <a-button
                                                type="link"
                                                v-if="index"
                                                @click="handleDelete(formState.production_equipment, record)">
                                                <i class="icon i_delete" />
                                                {{ $t("def.delete") }}
                                            </a-button>
                                        </template>
                                    </template>
                                </a-table>
                                <a-button
                                    class="spec-add"
                                    type="primary"
                                    ghost
                                    @click="
                                        handleAddSpecItem(formState.production_equipment, production_equipment_obj)
                                    ">
                                    {{ $t("supply-chain.add_production_equipment") }}
                                </a-button>
                            </div>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <!-- 关键检测设备 -->
            <div class="base-info-form">
                <a-form name="custom-validation" :rules="rules" ref="formRef4" :model="formState" labelAlign="right">
                    <a-row :gutter="24">
                        <a-col :span="3" class="title-area">
                            <div class="title-two">
                                {{ $t("supply-chain.critical_detection_equipment") }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <div class="form-content-item-table">
                                <a-table
                                    :columns="detection_equipment_column"
                                    :dataSource="formState.detection_equipment"
                                    :scroll="{ x: true }"
                                    :row-key="(record) => record.id"
                                    :pagination="false"
                                    class="specific-table">
                                    <template #headerCell="{ title }">
                                        {{ $t(title) }}
                                    </template>
                                    <template #bodyCell="{ column, record, index }">
                                        <!-- 客户序号 -->
                                        <!-- <template
                                          v-if="column.dataIndex === 'customer_order'"
                                      >
                                          {{ record.customer_order }}
                                      </template>  -->
                                        <template v-if="column.type === 'input'">
                                            <a-form-item :name="`detection_${column.dataIndex}`">
                                                <a-input
                                                    :name="`detection_${column.dataIndex}`"
                                                    v-model:value="record[column.dataIndex]"
                                                    :placeholder="$t('def.input')" />
                                            </a-form-item>
                                        </template>
                                        <template v-else-if="column.type === 'input-num'">
                                            <a-form-item :name="`detection_${column.dataIndex}`">
                                                <a-input-number
                                                    :name="`detection_${column.dataIndex}`"
                                                    v-model:value="record[column.dataIndex]"
                                                    :placeholder="$t('def.input')"
                                                    :min="0">
                                                    <template #addonAfter v-if="column.unit">
                                                        <span class="l-w-h-style">{{ column.unit }}</span>
                                                    </template>
                                                </a-input-number>
                                            </a-form-item>
                                        </template>
                                        <template v-else-if="column.type === 'time'">
                                            <a-form-item :name="`detection_${column.dataIndex}`">
                                                <span :name="`detection_${column.dataIndex}`">
                                                    <a-date-picker
                                                        :placeholder="$t('def.select')"
                                                        valueFormat="X"
                                                        v-model:value="record[column.dataIndex]" />
                                                </span>
                                            </a-form-item>
                                        </template>
                                        <template v-else-if="column.dataIndex === 'operation'">
                                            <a-button
                                                type="link"
                                                v-if="index"
                                                @click="handleDelete(formState.detection_equipment, record)">
                                                <i class="icon i_delete" />
                                                {{ $t("def.delete") }}
                                            </a-button>
                                        </template>
                                    </template>
                                </a-table>
                                <a-button
                                    class="spec-add"
                                    type="primary"
                                    ghost
                                    @click="handleAddSpecItem(formState.detection_equipment, detection_equipment_obj)">
                                    {{ $t("supply-chain.add_detection_equipment") }}
                                </a-button>
                            </div>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </div>
        <!-- 补充信息 -->
        <div class="base-info content-area margin-t-20">
            <div class="title">
                {{ $t("supply-chain.supplementary_information") }}
            </div>
            <div class="base-info-form">
                <a-form name="custom-validation" :model="formState" :rules="rules" labelAlign="right">
                    <a-row :gutter="24">
                        <a-col :span="3" class="title-area">
                            <div class="title-two">
                                <!-- 其他优势说明 -->
                                {{ $t("supply-chain.other_advantages_description") }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <a-form-item :label="$t('supply-chain.other_advantages_description')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.additional_info"
                                            :placeholder="$t('supply-chain.please_enter')"
                                            autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, toRef, computed } from "vue";
import MyUpload from "@/components/MyUpload/index.vue";
import TimeSearch from "@/components/common/TimeSearch.vue";
import { message } from "ant-design-vue";
import Core from "@/core";
import MySvgIcon from "@/components/MySvgIcon/index.vue";
const formRef1 = ref(null);
const formRef2 = ref(null);
const formRef3 = ref(null);
const formRef4 = ref(null);
const TimeSearchRef = ref(null);
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
const $t = useI18n().t;
const $i18n = useI18n();
const $store = useStore();
const TECHNICAL_INFORMATION = computed(() => {
    let arr = [];
    Core.Const.SUPPLAY.TECHNICAL_INFORMATION.forEach((item) => {
        arr.push({
            label: $t(item.t),
            value: item.value,
        });
    });
    return arr;
});
const PROCESS_DESIGN = computed(() => {
    let arr = [];
    Core.Const.SUPPLAY.PROCESS_DESIGN.forEach((item) => {
        arr.push({
            label: $t(item.t),
            value: item.value,
        });
    });
    return arr;
});
const PROCESS_VALIDATION = computed(() => {
    let arr = [];
    Core.Const.SUPPLAY.PROCESS_VALIDATION.forEach((item) => {
        arr.push({
            label: $t(item.t),
            value: item.value,
        });
    });
    return arr;
});
// 表格添加对象 - 客户名称
const customer_info_list_obj = ref({
    customer_order: "",
    customer_name: "",
    sales_share: "",
    main_supply_part: "",
    begin_cooperation_time: "",
});
// 职位多选
const plainOptions = computed(() => {
    let arr = [];
    Core.Const.SUPPLAY.POSITION.forEach((item) => {
        arr.push({
            label: $t(item.label),
            value: item.value,
        });
    });
    return arr;
});
// 联系信息的table
const contact_info_column = computed(() => {
    let columns = [
        {
            id: 0,
            title: $t("supply-chain.position_identity"),
            key: "position",
            dataIndex: "position",
            align: "center",
            width: 90,
        }, // 职务
        // 姓名
        {
            id: 1,
            title: $t("supply-chain.name"),
            key: "name",
            dataIndex: "name",
            align: "center",
        }, // 姓名
        // 手机号
        {
            id: 3,
            title: $t("supply-chain.contact"),
            key: "phone",
            dataIndex: "phone",
            align: "center",
        }, // 手机号
        // 邮箱
        {
            id: 2,
            title: $t("supply-chain.mailbox"),
            key: "email",
            dataIndex: "email",
            align: "center",
        }, // 邮箱
    ];

    return columns;
});
const handleCheckBox = (checkedValue) => {
    // 清除
    formState.position = checkedValue;
    let arr = [];
    checkedValue.forEach((item) => {
        // 如果formState.contact_info里面有这个职位,就将这个职位的信息push到arr里面
        if (formState.contact_info.some((item2) => item2.position == item)) {
            arr.push(formState.contact_info.find((item2) => item2.position == item));
        } else {
            arr.push({
                position: item,
                name: "",
                phone: "",
                email: "",
                flag_wechat: false,
            });
        }
    });
    formState.contact_info = arr;
};
// 客户信息
const customer_info_list_column = ref([
    {
        title: "supply-chain.customer_serial_number",
        key: "customer_order",
        dataIndex: "customer_order",
        type: "text",
    }, // 客户序号
    {
        title: "supply-chain.customer_name",
        key: "customer_name",
        dataIndex: "customer_name",
        type: "input",
    }, // 客户名称
    {
        title: "supply-chain.Sales_share",
        key: "sales_share",
        dataIndex: "sales_share",
        unit: "%",
        type: "input-num",
    }, // 销售占比
    {
        title: "supply-chain.Main_supply_part",
        key: "main_supply_part",
        dataIndex: "main_supply_part",
        type: "input",
    }, // 主供零件
    {
        title: "supply-chain.Start_time",
        key: "begin_cooperation_time",
        dataIndex: "begin_cooperation_time",
        type: "time",
    }, // 开始合作时间
    { title: "supply-chain.operate", key: "delete", dataIndex: "operation" }, // 操作
]);
// 竞争对手
const competitor_analysis_obj = ref({
    customer_order: "",
    company_name: "",
    market_share: "",
    understand_evaluation: "",
});
const competitor_analysis_column = ref([
    {
        title: "supply-chain.company_serial_number",
        key: "company_order",
        dataIndex: "company_order",
        type: "text",
    }, // 公司序号
    {
        title: "supply-chain.company_name",
        key: "company_name",
        dataIndex: "company_name",
        type: "input",
    }, // 公司名称
    {
        title: "supply-chain.market_share",
        key: "market_share",
        dataIndex: "market_share",
        type: "input",
    }, // 市场份额
    {
        title: "supply-chain.understanding_evaluation",
        key: "understand_evaluation",
        dataIndex: "understand_evaluation",
        unit: "%",
        type: "input",
    }, // 了解评价
    { title: "supply-chain.operate", key: "delete", dataIndex: "operation" }, // 操作
]);

// 生产设备
const production_equipment_obj = ref({
    customer_order: undefined,
    customer_name: undefined,
    sales_share: undefined,
    main_supply_part: undefined,
    begin_cooperation_time: undefined,
});
const production_equipment_column = ref([
    {
        title: "supply-chain.Name_of_production_equipment",
        key: "name",
        dataIndex: "name",
        type: "input",
    }, // 生产设备名称
    {
        title: "supply-chain.Specification_and_model",
        key: "spec",
        dataIndex: "spec",
        type: "input",
    }, // 规格型号（含吨位）
    {
        title: "supply-chain.quantity",
        key: "quantity",
        dataIndex: "quantity",
        type: "input-num",
    }, // 数量
    {
        title: "supply-chain.Equipment_manufacturer",
        key: "manufacturer",
        dataIndex: "manufacturer",
        type: "input",
    }, // 设备制造商
    {
        title: "supply-chain.Purchase_period",
        key: "purchase_period",
        dataIndex: "purchase_period",
        type: "input-num",
    }, // 购置年限
    { title: "supply-chain.operate", key: "delete", dataIndex: "operation" }, // 操作
]);
// 检测设备
const detection_equipment_obj = ref({
    customer_order: undefined,
    name: undefined,
    Spec: undefined,
    quantity: undefined,
    manufacturer: undefined,
    accuracy_level: undefined,
});
const detection_equipment_column = ref([
    {
        title: "supply-chain.Name_of_detection_equipment",
        key: "name",
        dataIndex: "name",
        type: "input",
    }, // 检测设备名称
    {
        title: "supply-chain.Specification_text",
        key: "spec",
        dataIndex: "spec",
        type: "input",
    }, // 规格型号
    {
        title: "supply-chain.quantity",
        key: "quantity",
        dataIndex: "quantity",
        type: "input-num",
    }, // 数量
    {
        title: "supply-chain.Equipment_manufacturer",
        key: "manufacturer",
        dataIndex: "manufacturer",
        type: "input",
    }, // 设备制造商
    {
        title: "supply-chain.precision_grade",
        key: "purchase_period",
        dataIndex: "accuracy_level",
        type: "input",
    }, // 精度等级
    { title: "supply-chain.operate", key: "delete", dataIndex: "operation" }, // 操作
]);
// 表单对象
const formState = reactive({
    type: 1, //表格类型
    position: [4],
    company_name: "",
    contact_info: [
        {
            position: 4,
            name: "",
            phone: "",
            email: "",
            flag_wechat: false,
        },
    ], // 联系方式
    company_info: {}, // 公司概况
    agent_info: {
        // 代理公司概况

        agent_company: "", // 被代理公司
        agent_address: "", // 被代理地址
        agent_relationship: "", // 被代理关系
        flag_agent_warrant: "", // 是否有代理权证
        agent_effective_begin_time: "", // 代理有效开始时间
        agent_effective_end_time: "", // 代理有效结束时间
        agent_product: "", // 代理产品
        fixed_assets: "", // 固定资产
    },

    human_resource: {}, // 人力资源
    financial_info: {}, // 财务信息
    business_info: {
        // 营业信息(近几年)
        proportion_of_business: "",
        list: [
            {
                recent_year: "近1年",
                sales: "",
                taxes_paid: "",
                profit_margin: "",
                asset_liability_ratio: "",
                cash_flow_ratio: "",
            },
            {
                recent_year: "近2年",
                sales: "",
                taxes_paid: "",
                profit_margin: "",
                asset_liability_ratio: "",
                cash_flow_ratio: "",
            },
            {
                recent_year: "近3年",
                sales: "",
                taxes_paid: "",
                profit_margin: "",
                asset_liability_ratio: "",
                cash_flow_ratio: "",
            },
        ],
    },
    competitor_analysis: [
        // 竞争对手
        {
            company_order: "竞争对手1",
            company_name: "",
            market_share: "",
            understand_evaluation: "",
        },
    ],
    customer_info: [
        // 客户信息
        {
            customer_order: "主要客户1",
            customer_name: "",
            sales_share: "",
            main_supply_part: "",
            begin_cooperation_time: "",
        },
    ],
    technical_info: {
        // 技术信息

        patent: "", // 相关专利
        RD_center: "", // 研发中心
        RD_partners: "", // 研发合作机构
        design_guides: "", // 设计规范

        product_design: [], // 产品设计
        process_design: [], //过程设计
        process_validation: [], //过程验证

        design_software: "", // 设计软件
        dev_process: "", // 开发流程
        mold_profile: "", //模具轮廓
        mold_weight: "", //模具重量
        mold_category: "", //模具品类
        mold_design: "", //模具设计
        mold_manufacture: "", //模具制造
        mold_acceptance: "", //模具验收
        design_software: "", //设计软件
        dev_process: "", //开发流程
    },
    quality_info: {
        // 质量

        certification: "", // 质量体系认证
        partners: "", // 质量合作机构
        tool_software: "", // 质控工具软件
        PPM: "", // 市场PPM
        env_certification: "", // 环境体系认证
        accredited_laboratory: "", // 认可实验室
        system_certification: "", // 计划体系认证
    },

    produce_capacity: {
        // 产能产线

        processes: "", // 关键自有工序
        automation_line: "", // 智能自动化线
        load: "", // 生产产能负荷
    },
    // 外购管理
    outsourcing: {
        technology: "", // 外购工艺
        parts: "", // 外购备件
        material: "", // 外购原料
        system: "", // 外购制度
    },
    // 关键生产设备
    production_equipment: [
        {
            id: 1,
            name: undefined /* 生产设备名称 */,
            spec: undefined /* 规格型号（含吨位） */,
            quantity: undefined /* 数量 */,
            manufacturer: undefined /* 设备制造商 */,
            purchase_period: undefined /* 购置年限 */,
        },
    ],
    // 关键检测设备
    detection_equipment: [
        {
            id: 1,
            name: undefined,
            spec: undefined,
            quantity: undefined,
            manufacturer: undefined,
            accuracy_level: undefined,
        },
    ],
    // 指定信息
    specify_info: {
        reason: "", // 指定理由
        parts: "", // 指定零件
        protocol: "", // 指定协议
        service: "", // 指定服务
    },
    // 服务信息
    service_info: {
        technical_services: "", // 技术服务
        quality_service: "", // 质量服务
        supply_services: "", // 供应服务
    },
    // 补充信息
    additional_info: "",
});

// 查询当前校验的字段的父级,直到找到class为ant-form-item-control的元素的递归函数
const findParent = (el) => {
    // 查找到父级
    let parent = el.parentNode;
    let classNameArr = parent.className.split(" ");
    if (parent && !classNameArr.includes("ant-form-item")) {
        return findParent(parent);
    } else if (!parent && parent.parentNode) {
        return findParent(parent.parentNode);
    } else if (!parent && !parent.parentNode) {
        return "";
    } else {
        return parent.querySelector(".ant-form-item-label > label").innerText;
    }
};

let PositionVaild = async (_rule, value) => {
    if (formState.position.length == 0) {
        return Promise.reject($t("supply-chain.please_select_position"));
    }
    return Promise.resolve();
};
let contactInfoVaild = (_rule, value) => {
    // 如果只有一个数据,并且position为4,就不用校验
    if (formState.contact_info.length == 1 && formState.contact_info[0].position == 4) {
        return Promise.resolve();
    } else if (formState.contact_info.length == 1 && formState.contact_info[0].position != 4) {
        if (!formState.contact_info[0].name || !formState.contact_info[0].phone || !formState.contact_info[0].email) {
            return Promise.reject(false);
        }
    } else if (formState.contact_info.length > 1) {
        let arr = formState.contact_info.filter((item) => item.position != 4);
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if (!element.name || !element.phone || !element.email) {
                return Promise.reject(false);
            }
        }
    }
    return Promise.resolve();
};

let companyVaild = async (_rule, value) => {
    let dataBoo = false;
    if (!_rule.required) {
        return Promise.resolve();
    }
    switch (_rule.fullField) {
        case "company_name_name": // 公司名称
            if (!formState.company_info?.name) {
                dataBoo = true;
            }
            break;
        case "company_address": // 地址
            if (!formState.company_info?.address) {
                dataBoo = true;
            }
            break;
        case "legal_representative": // 法人代表
            if (!formState.company_info?.legal_person) {
                dataBoo = true;
            }
            break;

        // 营业信息
        case "proportion_of_business": // 业务比重
            if (!formState.business_info?.proportion_of_business) {
                dataBoo = true;
            }
            break;

        case "sales": // 销售额
            dataBoo = findItemIsNoneFromList("business_info", "sales");
            break;
        case "taxes_paid": // 纳税额
            dataBoo = findItemIsNoneFromList("business_info", "taxes_paid");
            break;
        case "profit_margin": // 利润率
            dataBoo = findItemIsNoneFromList("business_info", "profit_margin");
            break;
        case "asset_liability_ratio": // 资产负债率
            dataBoo = findItemIsNoneFromList("business_info", "asset_liability_ratio");
            break;
        case "cash_flow_ratio": // 现金流量比率
            dataBoo = findItemIsNoneFromList("business_info", "cash_flow_ratio");
            break;

        // 指定信息
        case "reason": // 指定理由
            dataBoo = findObjIsNoneFromList("specify_info", "reason");
            break;
        case "parts": // 指定零件
            dataBoo = findObjIsNoneFromList("specify_info", "parts");
            break;
        case "protocol": // 指定协议
            dataBoo = findObjIsNoneFromList("specify_info", "protocol");
            break;
        case "service": // 指定服务
            dataBoo = findObjIsNoneFromList("specify_info", "service");
            break;

        // 产能产线
        case "processes": // 关键自有工序
            dataBoo = findObjIsNoneFromList("produce_capacity", "processes");
            break;
        case "automation_line": // 智能自动化线
            dataBoo = findObjIsNoneFromList("produce_capacity", "automation_line");
            break;
        case "load": // 智能自动化线
            dataBoo = findObjIsNoneFromList("produce_capacity", "load");
            break;
    }
    return new Promise((resolve, reject) => {
        let el = document.querySelector(`[name="${_rule.fullField}"]`);
        if (el) {
            let parent = findParent(el);
            if (dataBoo) reject($t("supply-chain.please_enter") + parent);
            resolve();
        }
    });
};
// 是否-法律纠纷
let flagLegalDisputeValid = async (_rule, value) => {
    let dataBoo = false;
    if (!_rule.required) {
        return Promise.resolve();
    }
    switch (_rule.fullField) {
        case "flag_legal_dispute": // 法律纠纷
            if (!formState.financial_info?.flag_legal_dispute) {
                dataBoo = true;
            }
            break;

        case "date_establishment": //成立日期
            if (!formState.company_info?.established_time) {
                dataBoo = true;
            }
            break;
        case "period_requirement": // 账期要求
            if (!formState.financial_info?.account_period_requirement) {
                dataBoo = true;
            }
            break;
        case "Invoice_type": // 开具发票
            if (!formState.financial_info?.invoice_type) {
                dataBoo = true;
            }
            break;
        case "proxy_warrant": // 代理权证
            if (!formState.agent_info?.flag_agent_warrant && formState.type === 2) {
                dataBoo = true;
            }
            break;
        case "duration_of_agency": // 代理有效期间
            if (
                (!formState.agent_info?.agent_effective_begin_time ||
                    !formState.agent_info?.agent_effective_end_time) &&
                formState.type === 2
            ) {
                dataBoo = true;
            }
            break;
    }
    // if(dataBoo) return Promise.reject(
    //     $t("supply-chain.please_select") //请选择
    // );
    // return Promise.resolve();
    return new Promise((resolve, reject) => {
        let el = document.querySelector(`[name="${_rule.fullField}"]`);
        if (el) {
            let parent = findParent(el);
            if (dataBoo) reject($t("supply-chain.please_select") + parent);
            resolve();
        }
    });
};

// 辅助表格校验方法1 table
const findItemIsNoneWrite = (parObjkey, key) => {
    let boo = false;
    formState[parObjkey].forEach((item, index) => {
        if (!item[key]) boo = true;
    });
    return boo;
};
// 辅助表格校验方法2 list
const findItemIsNoneFromList = (parObjkey, key) => {
    let boo = false;
    formState[parObjkey]["list"].forEach((item, index) => {
        if (!item[key]) boo = true;
    });
    return boo;
};
// 辅助表格校验方法3 obj
const findObjIsNoneFromList = (parObjkey, key) => {
    let boo = false;
    if (!formState[parObjkey]?.[key]) boo = true;
    return boo;
};
// 表格校验
let tableVaild = async (_rule, value) => {
    let dataBoo = false;
    if (!_rule.required) {
        return Promise.resolve();
    }
    switch (_rule.fullField) {
        // 关键生产设备
        case "production_name": // 生产设备名称
            dataBoo = findItemIsNoneWrite("production_equipment", "name");
            break;
        case "production_spec": // 规格型号（含吨位）
            dataBoo = findItemIsNoneWrite("production_equipment", "spec");
            break;
        case "production_quantity": // 数量
            dataBoo = findItemIsNoneWrite("production_equipment", "quantity");
            break;
        case "production_manufacturer": // 设备制造商
            dataBoo = findItemIsNoneWrite("production_equipment", "manufacturer");
            break;
        case "production_purchase_period": // 购置年限
            dataBoo = findItemIsNoneWrite("production_equipment", "purchase_period");
            break;

        // 关键检测设备
        case "detection_name": // 检测设备名称
            dataBoo = findItemIsNoneWrite("detection_equipment", "name");
            break;
        case "detection_spec": // 规格型号
            dataBoo = findItemIsNoneWrite("detection_equipment", "spec");
            break;
        case "detection_quantity": // 数量
            dataBoo = findItemIsNoneWrite("detection_equipment", "quantity");
            break;
        case "detection_manufacturer": // 设备制造商
            dataBoo = findItemIsNoneWrite("detection_equipment", "manufacturer");
            break;
        case "detection_accuracy_level": // 精度等级
            dataBoo = findItemIsNoneWrite("detection_equipment", "accuracy_level");
            break;
    }
    return new Promise((resolve, reject) => {
        let el = document.querySelector(`[name="${_rule.fullField}"]`);
        if (el) {
            let parent = findParent(el);
            if (dataBoo) reject($t("supply-chain.please_enter") + parent);
            resolve();
        }
    });
};

let tableDataVaild = async (_rule, value) => {
    let dataBoo = false;
    if (!_rule.required) {
        return Promise.resolve();
    }
    // _rule.fullField : 是当前校验的字段
    switch (_rule.fullField) {
        case "customer_name": // 客户名称
            dataBoo = findItemIsNoneWrite("customer_info", "customer_name");
            break;
        case "sales_share": // 销售占比
            dataBoo = findItemIsNoneWrite("customer_info", "sales_share");
            break;
        case "main_supply_part": // 主供零件
            dataBoo = findItemIsNoneWrite("customer_info", "main_supply_part");
            break;
        case "begin_cooperation_time": // 开始合作时间
            dataBoo = findItemIsNoneFromList("business_info", "cash_flow_ratio");
            break;
    }
    return new Promise((resolve, reject) => {
        if (dataBoo) reject($t("supply-chain.please_fill_form"));
        resolve();
    });
};

// 当前类的校验
const rules = ref({});
// 五个类共有的校验集合
const rulesAll = ref({
    positon: [
        //职业
        {
            required: true,
            validator: PositionVaild,
            trigger: ["change", "blur"],
        },
    ],
    contact_info: [
        // 联系方式
        {
            required: true,
            validator: contactInfoVaild,
            trigger: ["change", "blur"],
        },
    ],
    // 公司名称
    company_name_name: [
        {
            required: true,
            validator: companyVaild,
            trigger: ["change", "blur"],
        },
    ],
    // 公司-详细地址
    company_address: [
        {
            required: true,
            validator: companyVaild,
            trigger: ["change", "blur"],
        },
    ],
    // 公司-成立日期
    date_establishment: [
        {
            required: true,
            validator: flagLegalDisputeValid,
            trigger: ["change", "blur"],
        },
    ],
    // 公司-法人代表
    legal_representative: [
        {
            required: true,
            validator: companyVaild,
            trigger: ["change", "blur"],
        },
    ],
    // 法律纠纷
    flag_legal_dispute: [
        {
            required: true,
            validator: flagLegalDisputeValid,
            trigger: ["change", "blur"],
        },
    ],
    // 账期要求
    period_requirement: [
        {
            required: true,
            validator: flagLegalDisputeValid,
            trigger: ["change", "blur"],
        },
    ],
    // 开具发票
    Invoice_type: [
        {
            required: true,
            validator: flagLegalDisputeValid,
            trigger: ["change", "blur"],
        },
    ],
});
// 五个类除共有的校验集合
const rulesOther = ref({
    // 代理产权
    proxy_warrant: [
        /* 代理权证 */
        {
            required: true,
            validator: flagLegalDisputeValid,
            trigger: ["change", "blur"],
        },
    ],
    duration_of_agency: [
        /* 代理有效期间 */
        {
            required: true,
            validator: flagLegalDisputeValid,
            trigger: ["change", "blur"],
        },
    ],

    // 营业信息
    proportion_of_business: [
        /* 业务比重 */
        {
            required: true,
            validator: companyVaild,
            trigger: ["change", "blur"],
        },
    ],
    sales: [
        /* 销售额 */
        {
            required: true,
            validator: companyVaild,
            trigger: ["change", "blur"],
        },
    ],
    taxes_paid: [
        /* 纳税额 */
        {
            required: true,
            validator: companyVaild,
            trigger: ["change", "blur"],
        },
    ],
    profit_margin: [
        /* 利润率 */
        {
            required: true,
            validator: companyVaild,
            trigger: ["change", "blur"],
        },
    ],
    asset_liability_ratio: [
        /* 资产负债率 */
        {
            required: true,
            validator: companyVaild,
            trigger: ["change", "blur"],
        },
    ],
    cash_flow_ratio: [
        /* 现金流量比率 */
        {
            required: true,
            validator: companyVaild,
            trigger: ["change", "blur"],
        },
    ],

    // 客户信息
    customer_name: [
        /* 客户名称 */
        {
            required: true,
            validator: tableDataVaild,
            trigger: ["change", "blur"],
        },
    ],
    sales_share: [
        /* 销售占比 */
        {
            required: true,
            validator: tableDataVaild,
            trigger: ["change", "blur"],
        },
    ],
    main_supply_part: [
        /* 主供零件 */
        {
            required: true,
            validator: tableDataVaild,
            trigger: ["change", "blur"],
        },
    ],
    begin_cooperation_time: [
        /* 开始合作时间 */
        {
            required: true,
            validator: tableDataVaild,
            trigger: ["change", "blur"],
        },
    ],

    // 关键生产设备
    production_name: [
        /* 生产设备名称 */
        {
            required: true,
            validator: tableVaild,
            trigger: ["change", "blur"],
        },
    ],
    production_spec: [
        /* 规格型号（含吨位） */
        {
            required: true,
            validator: tableVaild,
            trigger: ["change", "blur"],
        },
    ],
    production_quantity: [
        /* 数量 */
        {
            required: true,
            validator: tableVaild,
            trigger: ["change", "blur"],
        },
    ],
    production_manufacturer: [
        /* 设备制造商 */
        {
            required: true,
            validator: tableVaild,
            trigger: ["change", "blur"],
        },
    ],
    production_purchase_period: [
        /* 购置年限 */
        {
            required: true,
            validator: tableVaild,
            trigger: ["change", "blur"],
        },
    ],

    // 关键检测设备
    detection_name: [
        /* 检测设备名称 */
        {
            required: true,
            validator: tableVaild,
            trigger: ["change", "blur"],
        },
    ],
    detection_spec: [
        /* 规格型号 */
        {
            required: true,
            validator: tableVaild,
            trigger: ["change", "blur"],
        },
    ],
    detection_quantity: [
        /* 数量 */
        {
            required: true,
            validator: tableVaild,
            trigger: ["change", "blur"],
        },
    ],
    detection_manufacturer: [
        /* 设备制造商 */
        {
            required: true,
            validator: tableVaild,
            trigger: ["change", "blur"],
        },
    ],
    detection_accuracy_level: [
        /* 精度等级 */
        {
            required: true,
            validator: tableVaild,
            trigger: ["change", "blur"],
        },
    ],

    // 指定信息
    reason: [
        /* 指定理由 */
        {
            required: true,
            validator: companyVaild,
            trigger: ["change", "blur"],
        },
    ],
    parts: [
        /* 指定零件 */
        {
            required: true,
            validator: companyVaild,
            trigger: ["change", "blur"],
        },
    ],
    protocol: [
        /* 指定协议 */
        {
            required: true,
            validator: companyVaild,
            trigger: ["change", "blur"],
        },
    ],
    service: [
        /* 指定服务 */
        {
            required: true,
            validator: companyVaild,
            trigger: ["change", "blur"],
        },
    ],
    // 产能产线
    processes: [
        /* 关键自有工序 */
        {
            required: true,
            validator: companyVaild,
            trigger: ["change", "blur"],
        },
    ],
    automation_line: [
        /* 智能自动化线 */
        {
            required: true,
            validator: companyVaild,
            trigger: ["change", "blur"],
        },
    ],
    load: [
        /* 智能自动化线 */
        {
            required: true,
            validator: companyVaild,
            trigger: ["change", "blur"],
        },
    ],
});
// 草稿回显
const draftDataReview = () => {
    let draftData = $store.state.SUPPLY_CHAIN.supplyDraftChain;
    if (draftData?.form) {
        let type = typeof draftData.form;
        if (type === "string") {
            draftData.form = JSON.parse(draftData.form);
        } else {
            draftData.form = draftData.form;
        }
    } else {
        draftData = {};
    }
    // 判断是否为空对象
    if (Object.keys(draftData).length === 0) {
        console.log("空对象", "详情回显");
    } else {
        Object.keys(draftData).forEach((key) => {
            if (key === "form") {
                for (const iterator of Object.keys(draftData[key])) {
                    formState[iterator] = draftData[key][iterator]; //die9
                }
            } else {
                formState[key] = draftData[key];
            }
        });
    }
    setTimeout(() => {
        if (TimeSearchRef.value) {
            // 给timeSearch赋值
            TimeSearchRef.value.createTime = [
                formState.agent_info.agent_effective_begin_time,
                formState.agent_info.agent_effective_end_time,
            ];
        }
    });
};
// 判断哪些类型显示哪些模块
const returnTypeBool = (type, typeIncludes) => {
    let result = typeIncludes.includes(Number(type));
    return result;
};
// 代理有效期间
const handleTimeSearch = (params) => {
    formState.agent_info.agent_effective_begin_time = params.begin_time;
    formState.agent_info.agent_effective_end_time = params.end_time;
};
// 校验
const step1Vaild = () => {
    return new Promise(async (resolve, reject) => {
        formRef1.value && formRef1.value.clearValidate();
        formRef2.value && formRef2.value.clearValidate();
        formRef3.value && formRef3.value.clearValidate();
        formRef4.value && formRef4.value.clearValidate();
        const form1Promise = formRef1.value && formRef1.value.validate(); // 获取表单1的验证 Promise
        const form2Promise = formRef2.value && formRef2.value.validate(); // 获取表单2的验证 Promise
        const form3Promise = formRef3.value && formRef3.value.validate(); // 获取表单3的验证 Promise
        const form4Promise = formRef4.value && formRef4.value.validate(); // 获取表单4的验证 Promise
        Promise.all([form1Promise, form2Promise, form3Promise, form4Promise])
            .then(([res1, res2, res3, res4]) => {
                // 所有 Promise 都成功完成
                // 处理结果...
                if (res1 && res2 && res3 && res4) {
                    let data = $store.state.SUPPLY_CHAIN.supplyChain;
                    // 判断是否为空对象
                    if (Object.keys(data).length === 0) {
                        // 为空对象
                        data = {
                            type: formState.type,
                            position: formState.position,
                            company_name: formState.company_info?.name,
                            form: {
                                ...formState,
                            },
                        };
                    } else {
                        // 不为空对象
                        data = {
                            ...data,
                            type: formState.type,
                            position: formState.position,
                            company_name: formState.company_info?.name,
                            form: {
                                ...formState,
                            },
                        };
                    }
                    /* if(formState.type === Core.Const.SUPPLAY.SUPPLAY_TYPE[2].value || formState.type === Core.Const.SUPPLAY.SUPPLAY_TYPE[5].value){
                        
                    formState.customer_info.forEach((item)=>{
                        // 判断是否为空对象
                        if (Object.keys(item).length !== 0){
                            // 解析出来的数据
                            let data = item;
                            Object.keys(data ?? {}).forEach((key) => {
                                console.log('data[key]1111',data[key]);
                            });
                        }
                    }) 
                  }*/
                    // 保存数据
                    $store.dispatch("SUPPLY_CHAIN/setSupplyChain", data);
                    $store.dispatch("SUPPLY_CHAIN/setSupplyDraftChain", data);
                    resolve(true);
                }
            })
            .catch((err) => {
                // 至少有一个 Promise 失败
                // 处理错误...
                // 校验失败
                message.warning($t("supply-chain.please_complete_info"));
                const errorName = err?.errorFields?.[0]?.name?.[0] ?? undefined;
                if (!errorName) return;
                const errorDom = document.querySelector(`[name=${errorName}]`);
                // errorDom 为null 找不到对应的a-form-item的原因是：a-form-item的name属性值必须和a-input的name属性值一致
                errorDom.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "nearest",
                });
                reject(false);
            });
    });
};
// 保存草稿
const saveDraft1 = () => {
    // 获取数据
    // 判断是否为空对象
    // 为空对象
    let data = {
        type: formState.type,
        position: formState.position,
        company_name: formState.company_info?.name,
        form: {
            ...formState,
        },
    };
    // 保存数据
    $store.dispatch("SUPPLY_CHAIN/setSupplyDraftChain", data);
    // 提示
    message.success($t("supply-chain.save_successfully"));
};
// 回显数据
const reviewData = () => {
    draftDataReview();
};
// 删除某一项
const handleDelete = (list, data, title, key) => {
    Core.Util.confirm({
        title: $t("supply-chain.detele_data_sure"),
        content: $t("coc.coc_delete_confirm_content"),
        okText: $t("coc.coc_btn_comfirm"),
        cancelText: $t("coc.coc_btn_cancel"),
        onOk: () => {
            const index = list.findIndex((el) => el.id === data.id);

            if (index !== -1) {
                list.splice(index, 1);
            }
            // 如果存在名称变更
            if (title) {
                list.forEach((ele, ind) => {
                    ele[key] = title + (ind + 1);
                });
            }
        },
    });
};
const handleAddSpecItem = (list, obj, title, key) => {
    const id = list.length + 1;

    // 如果存在名称变更
    title ? (obj[key] = title + id) : "";

    list.push({ ...obj, id });
};
// 根据type 动态设置rules
const setRules = () => {
    let broker_v_list = [
        /* 代理类 */
        // 代理产权
        "proxy_warrant" /* 代理权证 */,
        "duration_of_agency" /* 代理有效期间 */,
        // 营业信息 business_info
        "proportion_of_business" /* 业务比重 */,
        "sales" /* 销售额 */,
        "taxes_paid" /* 纳税额 */,
        "profit_margin" /* 利润率 */,
        "asset_liability_ratio" /* 资产负债率 */,
        "cash_flow_ratio" /* 现金流量比率 */,
        // 客户信息 customer_info
        "customer_name" /* 客户名称 */,
        "sales_share" /* 销售占比 */,
        "main_supply_part" /* 主供零件 */,
        "begin_cooperation_time" /* 开始合作时间 */,
    ];
    let outsourcing_v_list = [
        /* 外协类 */

        // 营业信息 business_info
        "sales" /* 销售额 */,

        // 客户信息 customer_info
        "customer_name" /* 客户名称 */,
        "sales_share" /* 销售占比 */,
        "main_supply_part" /* 主供零件 */,
        "begin_cooperation_time" /* 开始合作时间 */,

        // 产能产线 produce_capacity
        "processes" /* 关键自有工序 */,
        "automation_line" /* 智能自动化线 */,
        "load" /* 生产产能负荷 */,

        // 关键生产设备 production_equipment
        "production_name" /* 生产设备名称 */,
        "production_spec" /* 规格型号（含吨位） */,
        "production_quantity" /* 数量 */,
        "production_manufacturer" /* 设备制造商 */,
        "production_purchase_period" /* 购置年限 */,

        // 关键检测设备 detection_equipment
        "detection_name" /* 生产设备名称 */,
        "detection_spec" /* 规格型号（含吨位） */,
        "detection_quantity" /* 数量 */,
        "detection_manufacturer" /* 设备制造商 */,
        "detection_accuracy_level" /* 精度等级 */,
    ];
    let mold_v_list = [
        /* 模具类 */
        // 关键生产设备 production_equipment
        "production_name" /* 生产设备名称 */,
        "production_spec" /* 规格型号（含吨位） */,
        "production_quantity" /* 数量 */,
        "production_manufacturer" /* 设备制造商 */,
        "production_purchase_period" /* 购置年限 */,
        // 关键检测设备 detection_equipment
        "detection_name" /* 生产设备名称 */,
        "detection_spec" /* 规格型号（含吨位） */,
        "detection_quantity" /* 数量 */,
        "detection_manufacturer" /* 设备制造商 */,
        "detection_accuracy_level" /* 精度等级 */,
    ];
    let customer_refers_v_list = [
        /* 客指类 */
        // 营业信息 business_info
        "sales" /* 销售额 */,
        // 客户信息 customer_info
        "customer_name" /* 客户名称 */,
        "sales_share" /* 销售占比 */,
        "main_supply_part" /* 主供零件 */,
        "begin_cooperation_time" /* 开始合作时间 */,
        // 指定信息 specify_info
        "reason" /* 指定理由 */,
        "parts" /* 指定零件 */,
        "protocol" /* 指定协议 */,
        "service" /* 指定服务 */,
    ];
    let obj = {};
    let otherR = Object.keys(rulesOther.value);
    switch (formState.type) {
        case Core.Const.SUPPLAY.SUPPLAY_TYPE[2].value:
            for (const iterator of otherR) {
                if (broker_v_list.includes(iterator)) {
                    obj[iterator] = rulesOther.value[iterator];
                }
            }
            break;
        case Core.Const.SUPPLAY.SUPPLAY_TYPE[3].value:
            for (const iterator of otherR) {
                if (outsourcing_v_list.includes(iterator)) {
                    obj[iterator] = rulesOther.value[iterator];
                }
            }
            break;
        case Core.Const.SUPPLAY.SUPPLAY_TYPE[4].value:
            for (const iterator of otherR) {
                if (mold_v_list.includes(iterator)) {
                    obj[iterator] = rulesOther.value[iterator];
                }
            }
            break;
        case Core.Const.SUPPLAY.SUPPLAY_TYPE[5].value:
            for (const iterator of otherR) {
                if (customer_refers_v_list.includes(iterator)) {
                    obj[iterator] = rulesOther.value[iterator];
                }
            }

            break;
    }
    rules.value = {
        ...rulesAll.value,
        ...obj,
    };
};
watch(
    () => $i18n.locale.value,
    (val) => {
        // 重新校验
        formRef1.value && formRef1.value.clearValidate();
        formRef2.value && formRef2.value.clearValidate();
        formRef3.value && formRef3.value.clearValidate();
        formRef4.value && formRef4.value.clearValidate();
        setRules();
    }
);
// );
// 监听类别变动
watch(
    () => formState.type,
    (newval, oldval) => {
        formRef1.value && formRef1.value.clearValidate();
        formRef2.value && formRef2.value.clearValidate();
        formRef3.value && formRef3.value.clearValidate();
        formRef4.value && formRef4.value.clearValidate();
        // 重置校验规则
        setRules();
    }
);
defineExpose({
    step1Vaild,
    saveDraft1,
    reviewData,
});
onMounted(() => {
    // 回显数据
    reviewData();
    // 重置校验规则
    setRules();
});
</script>

<style lang="less" scoped>
.material-list {
    display: flex;
    width: 100%;
    padding: 20px;
    padding-bottom: 0;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    border-radius: 6px 6px 0px 0px;
    background: #fff;
    justify-content: flex-start;
    .content-area {
        background: #f8fafc;
        padding: 20px;
        padding-bottom: 4px;
        .title {
            color: #1d2129;
            font-size: 18px;
            font-weight: 500;
        }
        .title-two {
            color: #1d2129;
            font-size: 16px;
            font-weight: 400;
        }
    }
    .base-info {
        width: 100%;
        .base-info-form {
            padding: 8px 10% 0 10%;
            .align-center {
                .fac();
            }
        }
        .flex-1 {
            flex: 1;
            display: flex;
            padding: 8px 0% 0 15%;
        }
    }
    .other-material {
        width: 100%;
        margin-top: 21px;
        .other-material-form {
            padding: 8px 32.44% 0 29.55%;
        }
    }
}
:deep(.ant-form-item-label > label) {
    color: #8090a6;
    font-size: 14px;
    font-weight: 400;
    margin-right: 8px;
    width: 132px;
    display: inline-block;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
:deep(.ant-form-item-label > label::after) {
    display: none;
}
/* :deep(.ant-form-item-label) {
  min-width: 90px;
  margin-right: 8px;
}
:deep(input.ant-input) {
  width: 386px;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.img-area) {
  .ant-col-offset-1 {
      margin-left: 1.9%;
  }
}
:deep(.ant-form-item-control-input-content) {
  // 清除flex：auto
  flex: none;
} */

.margin-t-20 {
    margin-top: 20px;
}
.top-type-box {
    border: 1px;
    min-height: 112px;
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    flex-wrap: wrap;

    .type-parts {
        min-width: 176px;
        height: 58.25px;
        flex-shrink: 0;
        text-align: center;
        margin-right: 20px;
        padding: 0 54px;
        line-height: 58.25px;
        font-weight: 600;
        cursor: pointer;
        .fcc();
        box-sizing: border-box;

        &:last-child {
            margin-right: 0;
        }

        .type-font {
            font-size: 16px;
            margin-left: 4px;
            color: #666;
            font-weight: 400;
        }

        .black-font {
            font-size: 16px;
            color: #666;
        }
        .white-font {
            font-size: 16px;
            color: #fff;
        }

        &.type-parts-change {
            &:hover {
                border: 1px solid #0061ff;
                .black-font {
                    color: #0061ff;
                }
            }
        }
    }
    .click-type {
        background-image: url("../../../assets/images/supply-chain/parts-bg.png");
        background-size: 100% 100%;
    }
    .border-type {
        border-radius: 4px;
        border: 1px solid #eaecf1;
        background: #fff;
    }
}
.m-l-4 {
    margin-left: 4px;
}
.color-w {
    color: white !important;
}

.top-box {
    display: flex;
    align-items: center;
    padding: 0px 20px;
}
:deep(.ant-input-number-group-wrapper) {
    width: 100%;
}
:deep(.ant-input-number) {
    width: 100%;
}
:deep(.middle-radio) {
    display: flex;
    align-items: center;
    .ant-input {
        width: 100px;
        margin-left: 6px;
    }
}
:deep(.ant-col .ant-form-item-control .ant-picker) {
    width: 100%;
}

@media (max-width: 1550px) {
    .flex-1 {
        padding: 8px 0 0 6% !important;
    }
}

.form-content-item-table {
    margin-left: 140px;
    :deep(.ant-form-item) {
        margin-bottom: 0px;
    }
    .specific-table-position {
        color: #1d2129;
        .position-label {
            min-width: 74px;
            padding: 6px 18px;
            border-radius: 4px;
            height: 32px;
            background: #f2f3f5;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            // 添加必填的标志
            &::before {
                content: "*";
                color: #ff4d4f;
                margin-right: 2px;
            }
        }
        .no-require {
            &::before {
                display: none;
            }
        }
        .phone-and-wechart {
            display: flex;
            align-items: center;
            .flag-wechat-area {
                margin-left: 8px;
                display: flex;
            }
        }
    }
}
:deep(.form-content-item) {
    .ant-form-item-label {
        .ant-form-item-required {
            &::before {
                display: none;
            }
        }
    }
}
:deep(.specific-table-position) {
    .ant-table-tbody {
        .no-require {
            .ant-table-cell {
                #custom-validation_contact_info {
                    border: 1px solid #eaecf2 !important;
                    // 清除所有的失败的样式,border box-shadow
                    &:focus,
                    &:hover {
                        border: 1px solid #eaecf2 !important;
                        box-shadow: none !important;
                    }
                }
            }
        }
        .require {
            .ant-table-cell {
                .require {
                    border: 1px solid #ff4d4f !important;
                    // 清除所有的失败的样式,border box-shadow
                    &:focus,
                    &:hover {
                        border: 1px solid #ff4d4f !important;
                        box-shadow: none !important;
                    }
                }
            }
        }
        .ant-table-row {
            .ant-table-cell {
                input {
                    border: 1px solid #eaecf2;
                    // 清除所有的失败的样式,border box-shadow
                    &:focus,
                    &:hover {
                        border: 1px solid #eaecf2;
                        box-shadow: none;
                    }
                }
            }
        }
    }
}

.spec-add {
    margin: 16px auto 40px;
}

.specific-table {
    border-radius: 4px;
    background: #fff;
}

:deep(.ant-table) {
    border: 1px solid #eaecf2;
    border-bottom: 0px solid #eaecf2;
}
:deep(.ant-input-number-group-addon) {
    background-color: #f2f2f2;
    color: #808fa6;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    border-color: #eaecf1;
    box-sizing: border-box;
}
:deep(.ant-input-number-group) {
    border-radius: 4px;
    border-color: #eaecf1;
    background: #fff;
    overflow: hidden;
}
:deep(#custom-validation_begin_cooperation_time) {
    border: none !important;
}
</style>
