<template>
    <div class="material-list">
        <!-- 供应类型 -->
        <div class="base-info content-area top-box">
            <div class="title">{{ $t('supply-chain.type_supply') }}</div>
            <div class="base-info-form" style="flex: 1">
                <a-row :gutter="24">
                    <a-col :span="3" class="title-area align-center">
                        <div class="title-two"></div>
                    </a-col>
                    <a-col :span="21">
                        <div class="top-type-box">
                            <div
                                v-for="(item, index) in Core.Const.SUPPLAY.SUPPLAY_TYPE"
                                @click="onTypeChange(item)"
                                class="type-parts m-t-16"
                                :class="{
                                    'click-type': item.value === formState.type,
                                    'type-parts-change': item.value !== formState.type,
                                    'border-type': item.value !== formState.type,
                                }"
                            >
                                <MySvgIcon
                                    :icon-class="`white-${item.icon}`"
                                    :class="{
                                        'white-font': item.value === formState.type,
                                        'black-font': item.value !== formState.type,
                                    }"
                                />
                                <span
                                    class="m-l-4 type-font"
                                    :class="{
                                        'color-w': item.value === formState.type,
                                        'black-font': item.value !== formState.type,
                                    }"
                                >
                                    {{
                                        Core.Const.SUPPLAY.SUPPLAY_TYPE[item.value]
                                            ? $t(Core.Const.SUPPLAY.SUPPLAY_TYPE[item.value].t)
                                            : '-'
                                    }}
                                </span>
                            </div>
                        </div>
                    </a-col>
                </a-row>
            </div>
        </div>
        <!-- 联系方式 -->
        <div class="base-info content-area margin-t-20">
            <div class="title" id="contact_info">{{ $t('supply-chain.contact') }}</div>
            <div class="base-info-form">
                <a-form labelAlign="right">
                    <a-row :gutter="24">
                        <a-col :span="3" class="title-area">
                            <div class="title-two"></div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 职业 -->
                                    <a-form-item>
                                        <template #label>
                                            <span class="require-icon">{{ $t('supply-chain.Position') }}</span>
                                        </template>
                                        <a-checkbox-group
                                            @change="handleCheckBox"
                                            v-model:value="formState.position"
                                            name="positon"
                                            :options="plainOptions"
                                        />
                                        <template v-if="isFormStateRequired && !formState.position.length" #extra>
                                            <span class="tips">
                                                {{ $t('common.please_select') }}{{ $t('supply-chain.Position') }}
                                            </span>
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <!-- 姓名 联系人邮箱  联系方式 同步微信-->
                            <a-row v-if="formState.contact_info.length" :gutter="24">
                                <a-col :span="24">
                                    <a-form-item class="form-content-item">
                                        <div class="form-content-item-table">
                                            <a-table
                                                :columns="contact_info_column"
                                                :dataSource="formState.contact_info"
                                                :row-key="record => record.id"
                                                :pagination="false"
                                                class="specific-table-position"
                                            >
                                                <template #bodyCell="{ column, record, index }">
                                                    <template v-if="column.dataIndex === 'position'">
                                                        <div
                                                            :class="{
                                                                'position-label': true,
                                                                'no-require':
                                                                    record.position ===
                                                                    Core.Const.SUPPLAY.POSITION_MAP_STATUS
                                                                        .GENERAL_MANAGER,
                                                            }"
                                                        >
                                                            {{ $t(Core.Const.SUPPLAY.POSITION_MAP[record.position].t) }}
                                                        </div>
                                                    </template>
                                                    <template v-if="column.dataIndex === 'name'">
                                                        <a-input
                                                            :class="{
                                                                'require-change-red':
                                                                    record.position !==
                                                                        Core.Const.SUPPLAY.POSITION_MAP_STATUS
                                                                            .GENERAL_MANAGER &&
                                                                    isFormStateRequired &&
                                                                    !record.name,
                                                            }"
                                                            name="name"
                                                            v-model:value="record.name"
                                                            :placeholder="$t('common.please_enter')"
                                                        />
                                                    </template>
                                                    <template v-if="column.dataIndex === 'phone'">
                                                        <div class="phone-and-wechart">
                                                            <a-input
                                                                :class="{
                                                                    'require-change-red':
                                                                        record.position !==
                                                                            Core.Const.SUPPLAY.POSITION_MAP_STATUS
                                                                                .GENERAL_MANAGER &&
                                                                        isFormStateRequired &&
                                                                        !record.phone,
                                                                }"
                                                                name="phone"
                                                                class="phone-area"
                                                                v-model:value="record.phone"
                                                                :placeholder="$t('common.please_enter')"
                                                            />

                                                            <a-checkbox
                                                                class="flag-wechat-area"
                                                                v-model:checked="record.flag_wechat"
                                                            >
                                                                {{ $t('supply-chain.wechat_same_number') }}
                                                            </a-checkbox>
                                                        </div>
                                                    </template>
                                                    <template v-if="column.dataIndex === 'email'">
                                                        <a-input
                                                            :class="{
                                                                'require-change-red':
                                                                    record.position !==
                                                                        Core.Const.SUPPLAY.POSITION_MAP_STATUS
                                                                            .GENERAL_MANAGER &&
                                                                    isFormStateRequired &&
                                                                    !record.email,
                                                            }"
                                                            name="email"
                                                            v-model:value="record.email"
                                                            :placeholder="$t('common.please_enter')"
                                                        />
                                                    </template>
                                                </template>
                                            </a-table>
                                        </div>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </div>
        <!-- 基本信息 -->
        <div class="base-info content-area margin-t-20">
            <div class="title">{{ $t('supply-chain.basic_info') }}</div>
            <div class="base-info-form">
                <a-form labelAlign="right">
                    <!-- 公司概况 -->
                    <a-row :gutter="24">
                        <a-col :span="3" class="title-area">
                            <div class="title-two" id="company_info">
                                <!-- 公司概况 -->
                                {{ $t('supply-chain.company_profile') }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <!-- 公司名称 -->
                                <a-col :span="12">
                                    <a-form-item name="company_name_name">
                                        <template #label>
                                            <span class="require-icon">{{ $t('supply-chain.company_name') }}</span>
                                        </template>
                                        <a-input
                                            :class="{
                                                'require-change-red':
                                                    isFormStateRequired && !formState.company_info.name,
                                            }"
                                            name="company_name_name"
                                            v-model:value="formState.company_info.name"
                                            :placeholder="$t('common.please_enter')"
                                        />

                                        <template v-if="isFormStateRequired && !formState.company_info.name" #extra>
                                            <span class="tips"
                                                >{{ $t('common.please_enter')
                                                }}{{ $t('supply-chain.company_name') }}</span
                                            >
                                        </template>
                                    </a-form-item>
                                </a-col>
                                <!-- 公司网址 -->
                                <a-col :span="12">
                                    <a-form-item :label="$t('supply-chain.company_website')" name="company_website">
                                        <a-input
                                            name="company_website"
                                            v-model:value="formState.company_info.website_address"
                                            :placeholder="$t('common.please_enter')"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 成立日期 -->
                                    <a-form-item name="date_establishment">
                                        <template #label>
                                            <span class="require-icon">{{
                                                $t('supply-chain.date_establishment')
                                            }}</span>
                                        </template>
                                        <span name="date_establishment">
                                            <a-date-picker
                                                :class="{
                                                    'require-change-red':
                                                        isFormStateRequired && !formState.company_info.established_time,
                                                }"
                                                :placeholder="$t('def.select')"
                                                valueFormat="X"
                                                v-model:value="formState.company_info.established_time"
                                            />
                                        </span>
                                        <template
                                            v-if="isFormStateRequired && !formState.company_info.established_time"
                                            #extra
                                        >
                                            <span class="tips"
                                                >{{ $t('common.please_enter')
                                                }}{{ $t('supply-chain.date_establishment') }}</span
                                            >
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 固定资产 -->
                                    <a-form-item :label="$t('supply-chain.fixed_assets')">
                                        <a-input
                                            v-model:value="formState.company_info.fixed_assets"
                                            :placeholder="$t('common.please_enter')"
                                        />
                                    </a-form-item>
                                </a-col>
                                <!-- 法人代表 -->
                                <a-col :span="12">
                                    <a-form-item name="legal_representative">
                                        <template #label>
                                            <span class="require-icon">{{
                                                $t('supply-chain.legal_representative')
                                            }}</span>
                                        </template>
                                        <a-input
                                            :class="{
                                                'require-change-red':
                                                    isFormStateRequired && !formState.company_info.legal_person,
                                            }"
                                            name="legal_representative"
                                            v-model:value="formState.company_info.legal_person"
                                            :placeholder="$t('common.please_enter')"
                                        />
                                        <template
                                            v-if="isFormStateRequired && !formState.company_info.legal_person"
                                            #extra
                                        >
                                            <span class="tips"
                                                >{{ $t('common.please_enter')
                                                }}{{ $t('supply-chain.legal_representative') }}</span
                                            >
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 省市 -->
                                    <a-form-item name="province_city">
                                        <template #label>
                                            <span class="require-icon">{{ $t('supply-chain.province_city') }}</span>
                                        </template>
                                        <a-cascader
                                            v-model:value="formState.company_info.provinceAndCity"
                                            :options="chinaOptions"
                                            :placeholder="$t('common.please_select')"
                                            :class="{
                                                'require-change-red':
                                                    isFormStateRequired &&
                                                    !formState.company_info.provinceAndCity.length,
                                            }"
                                            :fieldNames="{ label: 'name', value: 'name', children: 'children' }"
                                        />
                                        <template v-if="isFormStateRequired && !formState.company_info.address" #extra>
                                            <span class="tips"
                                                >{{ $t('common.please_select')
                                                }}{{ $t('supply-chain.province_city') }}</span
                                            >
                                        </template>
                                    </a-form-item>
                                </a-col>
                                <!-- 详细地址 -->
                                <a-col :span="12">
                                    <a-form-item name="company_address">
                                        <template #label>
                                            <span class="require-icon">{{ $t('supply-chain.detailed_address') }}</span>
                                        </template>
                                        <a-input
                                            :class="{
                                                'require-change-red':
                                                    isFormStateRequired && !formState.company_info.address,
                                            }"
                                            name="company_address"
                                            v-model:value="formState.company_info.address"
                                            :placeholder="$t('common.please_enter')"
                                        />
                                        <template v-if="isFormStateRequired && !formState.company_info.address" #extra>
                                            <span class="tips"
                                                >{{ $t('common.please_enter')
                                                }}{{ $t('supply-chain.detailed_address') }}</span
                                            >
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 公司性质 -->
                                    <a-form-item :label="$t('supply-chain.nature_of_company')">
                                        <a-select
                                            v-model:value="formState.company_info.nature"
                                            :placeholder="$t('supply-chain.please_select')"
                                        >
                                            <a-select-option
                                                :value="item.value"
                                                v-for="item in Core.Const.SUPPLAY.NATURE"
                                            >
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
                                            :min="0"
                                        >
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
                                        isMember(formState.type, [
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers,
                                        ])
                                            ? 12
                                            : 0
                                    "
                                >
                                    <!-- 占地面积 -->
                                    <a-form-item :label="$t('supply-chain.floor_space')">
                                        <a-input-number
                                            v-model:value="formState.company_info.floor_area"
                                            :placeholder="$t('def.input')"
                                            :min="0"
                                        >
                                            <template #addonAfter>
                                                <span class="l-w-h-style">m²</span>
                                            </template>
                                        </a-input-number>
                                    </a-form-item>
                                </a-col>
                                <a-col
                                    :span="
                                        isMember(formState.type, [
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers,
                                        ])
                                            ? 12
                                            : 0
                                    "
                                >
                                    <!-- 建筑面积 -->
                                    <a-form-item :label="$t('supply-chain.floor_area')">
                                        <a-input-number
                                            v-model:value="formState.company_info.building_area"
                                            :placeholder="$t('def.input')"
                                            :min="0"
                                        >
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
                                        !isMember(formState.type, [
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold,
                                        ])
                                            ? 12
                                            : 0
                                    "
                                >
                                    <!-- 经营场所 -->
                                    <a-form-item :label="$t('supply-chain.establishments')">
                                        <a-input
                                            v-model:value="formState.company_info.premises"
                                            :placeholder="$t('common.please_enter')"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        isMember(formState.type, [
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers,
                                        ])
                                            ? 12
                                            : 0
                                    "
                                >
                                    <!-- 母公司名称 -->
                                    <a-form-item :label="$t('supply-chain.parent_company_name')">
                                        <a-input
                                            v-model:value="formState.company_info.parent_company_name"
                                            :placeholder="$t('common.please_enter')"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col
                                    :span="
                                        isMember(formState.type, [
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers,
                                        ])
                                            ? 12
                                            : 0
                                    "
                                >
                                    <!-- 母公司地址 -->
                                    <a-form-item :label="$t('supply-chain.Parent_company_address')">
                                        <a-input
                                            v-model:value="formState.company_info.parent_company_address"
                                            :placeholder="$t('common.please_enter')"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                    <!-- 代理信息 -->
                    <a-row
                        v-if="isMember(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker])"
                        :gutter="24"
                        class="m-t-40"
                    >
                        <a-col :span="3" class="title-area">
                            <div class="title-two" id="agent_info">
                                <!-- 代理信息 -->
                                {{ $t('supply-chain.agent_information') }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <!-- 被代理公司 -->
                                <a-col :span="12">
                                    <a-form-item :label="$t('supply-chain.agent_company')">
                                        <a-input
                                            v-model:value="formState.agent_info.agent_company"
                                            :placeholder="$t('common.please_enter')"
                                        />
                                    </a-form-item>
                                </a-col>
                                <!-- 被代理地址 -->
                                <a-col :span="12">
                                    <a-form-item :label="$t('supply-chain.proxy_address')" name="company_website">
                                        <a-input
                                            name="company_website"
                                            v-model:value="formState.agent_info.agent_address"
                                            :placeholder="$t('common.please_enter')"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 被代理关系 -->
                                    <a-form-item :label="$t('supply-chain.agency_relationship')">
                                        <a-input
                                            name="agent_relationship"
                                            v-model:value="formState.agent_info.agent_relationship"
                                            :placeholder="$t('common.please_enter')"
                                        />
                                    </a-form-item>
                                </a-col>

                                <a-col :span="12">
                                    <!-- 代理有效期间 -->
                                    <a-form-item name="duration_of_agency">
                                        <template #label>
                                            <span class="require-icon">{{
                                                $t('supply-chain.duration_of_agency')
                                            }}</span>
                                        </template>

                                        <span name="duration_of_agency">
                                            <TimeSearch
                                                :class="{
                                                    'require-change-red':
                                                        isFormStateRequired &&
                                                        !formState.agent_info.agent_effective_begin_time &&
                                                        !formState.agent_info.agent_effective_end_time,
                                                }"
                                                ref="TimeSearchRef"
                                                @search="handleTimeSearch"
                                                :defaultTime="false"
                                            />
                                        </span>

                                        <template
                                            v-if="
                                                isFormStateRequired &&
                                                !formState.agent_info.agent_effective_begin_time &&
                                                !formState.agent_info.agent_effective_end_time
                                            "
                                            #extra
                                        >
                                            <span class="tips"
                                                >{{ $t('common.please_enter')
                                                }}{{ $t('supply-chain.agency_relationship') }}</span
                                            >
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <!-- 是否有代理权证 代理权证 -->
                                <a-col :span="24">
                                    <a-form-item name="proxy_warrant">
                                        <template #label>
                                            <span class="require-icon">{{ $t('supply-chain.proxy_warrant') }}</span>
                                        </template>

                                        <a-radio-group
                                            name="proxy_warrant"
                                            v-model:value="formState.agent_info.flag_agent_warrant"
                                        >
                                            <a-radio
                                                :value="radio.value"
                                                v-for="radio in Core.Const.SUPPLAY.Legal_Dispute"
                                                :key="radio.value"
                                            >
                                                {{ $t(radio.t) }}
                                            </a-radio>
                                        </a-radio-group>

                                        <template
                                            v-if="isFormStateRequired && !formState.agent_info.flag_agent_warrant"
                                            #extra
                                        >
                                            <span class="tips"
                                                >{{ $t('common.please_enter')
                                                }}{{ $t('supply-chain.proxy_warrant') }}</span
                                            >
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 代理产品 -->
                                    <a-form-item :label="$t('supply-chain.agent_product')">
                                        <a-input
                                            v-model:value="formState.agent_info.agent_product"
                                            :placeholder="$t('common.please_enter')"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                    <!-- 人力资源 -->
                    <a-row
                        v-if="!isMember(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker])"
                        :gutter="24"
                        class="m-t-40"
                    >
                        <a-col :span="3" class="title-area">
                            <div class="title-two" id="human_resource">
                                {{ $t('supply-chain.human_resources') }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 员工总数 -->
                                    <a-form-item :label="$t('supply-chain.total_number_of_employees')">
                                        <a-input-number
                                            v-model:value="formState.human_resource.total_employees"
                                            :placeholder="$t('def.input')"
                                            :min="0"
                                        >
                                        </a-input-number>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <!-- 管理人数 -->
                                    <a-form-item :label="$t('supply-chain.number_of_managers')">
                                        <a-input-number
                                            v-model:value="formState.human_resource.manager_number"
                                            :placeholder="$t('def.input')"
                                            :min="0"
                                        >
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
                                            :min="0"
                                        >
                                        </a-input-number>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <!-- 技术人数 -->
                                    <a-form-item :label="$t('supply-chain.skilled_personnel')">
                                        <a-input-number
                                            v-model:value="formState.human_resource.technician_number"
                                            :placeholder="$t('def.input')"
                                            :min="0"
                                        >
                                        </a-input-number>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 技术工龄 -->
                                    <a-form-item
                                        :label="$t('supply-chain.technical_seniority')"
                                        class="technical_seniority"
                                    >
                                        <a-input
                                            v-model:value="formState.human_resource.technical_seniority"
                                            :placeholder="$t('def.input')"
                                            :maxlength="10"
                                        >
                                        </a-input>
                                        <span class="unit-addon">{{ $t('supply-chain.year') }}</span>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                    <!-- 财务信息 -->
                    <a-row :gutter="24" class="m-t-40">
                        <a-col :span="3" class="title-area">
                            <div class="title-two" id="financial_info">
                                {{ $t('supply-chain.financial_information') }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24" :span="21">
                                <a-col :span="24">
                                    <!-- 法律纠纷 -->
                                    <a-form-item name="flag_legal_dispute">
                                        <template #label>
                                            <span class="require-icon">{{ $t('supply-chain.legal_dispute') }}</span>
                                        </template>

                                        <a-radio-group
                                            name="flag_legal_dispute"
                                            v-model:value="formState.financial_info.flag_legal_dispute"
                                        >
                                            <a-radio
                                                :value="radio.value"
                                                v-for="radio in Core.Const.SUPPLAY.Legal_Dispute"
                                                :key="radio.value"
                                            >
                                                {{ $t(radio.t) }}
                                            </a-radio>
                                        </a-radio-group>

                                        <template
                                            v-if="isFormStateRequired && !formState.financial_info.flag_legal_dispute"
                                            #extra
                                        >
                                            <span class="tips"
                                                >{{ $t('common.please_enter')
                                                }}{{ $t('supply-chain.legal_dispute') }}</span
                                            >
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        !isMember(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker]) ? 12 : 0
                                    "
                                >
                                    <!-- 操作工人月平均工资 -->
                                    <a-form-item :label="$t('supply-chain.average')">
                                        <a-input
                                            v-model:value="
                                                formState.financial_info.average_monthly_wage_of_operating_workers
                                            "
                                            :placeholder="$t('common.please_enter')"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col
                                    :span="
                                        !isMember(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker]) ? 12 : 0
                                    "
                                >
                                    <!-- 管理职员人均年产值 -->
                                    <a-form-item :label="$t('supply-chain.per')">
                                        <a-input
                                            v-model:value="
                                                formState.financial_info
                                                    .per_capita_annual_output_value_of_management_staff
                                            "
                                            :placeholder="$t('common.please_enter')"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 账期要求 -->
                                    <a-form-item name="period_requirement">
                                        <template #label>
                                            <span class="require-icon">{{
                                                $t('supply-chain.period_requirement')
                                            }}</span>
                                        </template>

                                        <a-radio-group
                                            name="period_requirement"
                                            v-model:value="formState.financial_info.account_period_requirement"
                                        >
                                            <a-radio
                                                :value="radio.value"
                                                v-for="radio in Core.Const.SUPPLAY.ACCOUNt_PERIOD_REQUIREMENT_LIST"
                                                :key="radio.value"
                                            >
                                                {{ `${radio.value ? radio.value + $t(radio.unit) : $t(radio.t)}` }}
                                            </a-radio>
                                        </a-radio-group>

                                        <template
                                            v-if="
                                                isFormStateRequired &&
                                                !formState.financial_info.account_period_requirement
                                            "
                                            #extra
                                        >
                                            <span class="tips"
                                                >{{ $t('common.please_enter')
                                                }}{{ $t('supply-chain.period_requirement') }}</span
                                            >
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 发票类型 -->
                                    <a-form-item name="Invoice_type">
                                        <template #label>
                                            <span class="require-icon">{{ $t('supply-chain.Invoice_type') }}</span>
                                        </template>

                                        <a-radio-group
                                            name="Invoice_type"
                                            v-model:value="formState.financial_info.invoice_type"
                                        >
                                            <a-radio
                                                :value="radio.value"
                                                v-for="radio in Core.Const.SUPPLAY.INVOICE_TYPE"
                                                :key="radio.value"
                                            >
                                                <span v-if="radio.value === 1" class="middle-radio">
                                                    {{ $t(radio.t) }}
                                                    <a-input
                                                        :maxlength="50"
                                                        v-model:value="formState.financial_info.invoice_range_value"
                                                        placeholder="范围值"
                                                    />
                                                </span>
                                                <span v-else>{{ $t(radio.t) }}</span>
                                            </a-radio>
                                        </a-radio-group>

                                        <template
                                            v-if="isFormStateRequired && !formState.financial_info.invoice_type"
                                            #extra
                                        >
                                            <span class="tips"
                                                >{{ $t('common.please_enter')
                                                }}{{ $t('supply-chain.Invoice_type') }}</span
                                            >
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>

                    <!-- 营业信息 -->
                    <a-row :gutter="24" class="m-t-40">
                        <a-col :span="3" class="title-area">
                            <div class="title-two" id="business_info">
                                {{ $t('supply-chain.business_information') }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 业务比重 -->
                                    <a-form-item name="proportion_of_business">
                                        <template #label>
                                            <span
                                                :class="{
                                                    'require-icon': isMember(formState.type, [
                                                        Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                                    ]),
                                                }"
                                            >
                                                {{ $t('supply-chain.proportion_of_business') }}
                                            </span>
                                        </template>

                                        <a-input
                                            :class="{
                                                'require-change-red':
                                                    isMember(formState.type, [
                                                        Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                                    ]) &&
                                                    isFormStateRequired &&
                                                    !formState.business_info.proportion_of_business,
                                            }"
                                            name="proportion_of_business"
                                            v-model:value="formState.business_info.proportion_of_business"
                                            :placeholder="$t('common.please_enter')"
                                        />

                                        <template
                                            v-if="
                                                isMember(formState.type, [
                                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                                ]) &&
                                                isFormStateRequired &&
                                                !formState.business_info.proportion_of_business
                                            "
                                            #extra
                                        >
                                            <span class="tips"
                                                >{{ $t('common.please_enter')
                                                }}{{ $t('supply-chain.proportion_of_business') }}</span
                                            >
                                        </template>
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
                                    <a-form-item name="sales">
                                        <template #label>
                                            <span
                                                :class="{
                                                    'require-icon': !isMember(formState.type, [
                                                        Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,
                                                        Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold,
                                                    ]),
                                                }"
                                            >
                                                {{ $t('supply-chain.sales_volume') }}
                                            </span>
                                        </template>
                                        <span name="sales">
                                            <a-input-number
                                                :class="{
                                                    'require-change-red':
                                                        !isMember(formState.type, [
                                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,
                                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold,
                                                        ]) &&
                                                        isFormStateRequired &&
                                                        !formState.business_info.list[index].sales,
                                                }"
                                                v-model:value="formState.business_info.list[index].sales"
                                                :placeholder="$t('def.input')"
                                                :min="0"
                                            >
                                                <template #addonAfter>
                                                    <span class="l-w-h-style">
                                                        {{ $t('supply-chain.ten_thousand_yuan') }}
                                                    </span>
                                                </template>
                                            </a-input-number>
                                        </span>

                                        <template
                                            v-if="
                                                !isMember(formState.type, [
                                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,
                                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold,
                                                ]) &&
                                                isFormStateRequired &&
                                                !formState.business_info.list[index].sales
                                            "
                                            #extra
                                        >
                                            <span class="tips"
                                                >{{ $t('common.please_enter')
                                                }}{{ $t('supply-chain.sales_volume') }}</span
                                            >
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <template
                                v-if="!isMember(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers])"
                            >
                                <a-row :gutter="24">
                                    <a-col :span="8" v-for="(item, index) in 3">
                                        <!-- 纳税额 -->
                                        <a-form-item name="taxes_paid">
                                            <template #label>
                                                <span
                                                    :class="{
                                                        'require-icon': isMember(formState.type, [
                                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                                        ]),
                                                    }"
                                                >
                                                    {{ $t('supply-chain.tax_amount') }}
                                                </span>
                                            </template>

                                            <a-input-number
                                                :class="{
                                                    'require-change-red':
                                                        isMember(formState.type, [
                                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                                        ]) &&
                                                        isFormStateRequired &&
                                                        !formState.business_info.list[index].taxes_paid,
                                                }"
                                                name="taxes_paid"
                                                v-model:value="formState.business_info.list[index].taxes_paid"
                                                :placeholder="$t('def.input')"
                                                :min="0"
                                            >
                                                <template #addonAfter>
                                                    <span class="l-w-h-style">{{
                                                        $t('supply-chain.ten_thousand_yuan')
                                                    }}</span>
                                                </template>
                                            </a-input-number>

                                            <template
                                                v-if="
                                                    isMember(formState.type, [
                                                        Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                                    ]) &&
                                                    isFormStateRequired &&
                                                    !formState.business_info.list[index].taxes_paid
                                                "
                                                #extra
                                            >
                                                <span class="tips"
                                                    >{{ $t('common.please_enter')
                                                    }}{{ $t('supply-chain.tax_amount') }}</span
                                                >
                                            </template>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <a-row :gutter="24">
                                    <a-col :span="8" v-for="(item, index) in 3">
                                        <!-- 利润率 -->
                                        <a-form-item name="profit_margin">
                                            <template #label>
                                                <span
                                                    :class="{
                                                        'require-icon': isMember(formState.type, [
                                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                                        ]),
                                                    }"
                                                >
                                                    {{ $t('supply-chain.profit_rate') }}
                                                </span>
                                            </template>

                                            <a-input-number
                                                :class="{
                                                    'require-change-red':
                                                        isMember(formState.type, [
                                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                                        ]) &&
                                                        isFormStateRequired &&
                                                        !formState.business_info.list[index].profit_margin,
                                                }"
                                                name="profit_margin"
                                                v-model:value="formState.business_info.list[index].profit_margin"
                                                :placeholder="$t('def.input')"
                                                :min="0"
                                            >
                                                <template #addonAfter>
                                                    <span class="l-w-h-style">%</span>
                                                </template>
                                            </a-input-number>

                                            <template
                                                v-if="
                                                    isMember(formState.type, [
                                                        Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                                    ]) &&
                                                    isFormStateRequired &&
                                                    !formState.business_info.list[index].profit_margin
                                                "
                                                #extra
                                            >
                                                <span class="tips"
                                                    >{{ $t('common.please_enter')
                                                    }}{{ $t('supply-chain.profit_rate') }}</span
                                                >
                                            </template>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <a-row :gutter="24">
                                    <a-col :span="8" v-for="(item, index) in 3">
                                        <!-- 资产负债率 -->
                                        <a-form-item name="asset_liability_ratio">
                                            <template #label>
                                                <span
                                                    :class="{
                                                        'require-icon': isMember(formState.type, [
                                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                                        ]),
                                                    }"
                                                >
                                                    {{ $t('supply-chain.asset_liability_ratio') }}
                                                </span>
                                            </template>

                                            <a-input-number
                                                :class="{
                                                    'require-change-red':
                                                        isMember(formState.type, [
                                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                                        ]) &&
                                                        isFormStateRequired &&
                                                        !formState.business_info.list[index].asset_liability_ratio,
                                                }"
                                                name="asset_liability_ratio"
                                                v-model:value="
                                                    formState.business_info.list[index].asset_liability_ratio
                                                "
                                                :placeholder="$t('def.input')"
                                                :min="0"
                                            >
                                                <template #addonAfter>
                                                    <span class="l-w-h-style">%</span>
                                                </template>
                                            </a-input-number>

                                            <template
                                                v-if="
                                                    isMember(formState.type, [
                                                        Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                                    ]) &&
                                                    isFormStateRequired &&
                                                    !formState.business_info.list[index].asset_liability_ratio
                                                "
                                                #extra
                                            >
                                                <span class="tips"
                                                    >{{ $t('common.please_enter')
                                                    }}{{ $t('supply-chain.asset_liability_ratio') }}</span
                                                >
                                            </template>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <a-row :gutter="24">
                                    <a-col :span="8" v-for="(item, index) in 3">
                                        <!-- 现金流量比率 -->
                                        <a-form-item name="cash_flow_ratio">
                                            <template #label>
                                                <span
                                                    :class="{
                                                        'require-icon': isMember(formState.type, [
                                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                                        ]),
                                                    }"
                                                >
                                                    {{ $t('supply-chain.cash_flow_ratio') }}
                                                </span>
                                            </template>

                                            <a-input-number
                                                :class="{
                                                    'require-change-red':
                                                        isMember(formState.type, [
                                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                                        ]) &&
                                                        isFormStateRequired &&
                                                        !formState.business_info.list[index].cash_flow_ratio,
                                                }"
                                                name="cash_flow_ratio"
                                                v-model:value="formState.business_info.list[index].cash_flow_ratio"
                                                :placeholder="$t('def.input')"
                                                :min="0"
                                            >
                                                <template #addonAfter>
                                                    <span class="l-w-h-style">%</span>
                                                </template>
                                            </a-input-number>

                                            <template
                                                v-if="
                                                    isMember(formState.type, [
                                                        Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                                    ]) &&
                                                    isFormStateRequired &&
                                                    !formState.business_info.list[index].cash_flow_ratio
                                                "
                                                #extra
                                            >
                                                <span class="tips"
                                                    >{{ $t('common.please_enter')
                                                    }}{{ $t('supply-chain.cash_flow_ratio') }}</span
                                                >
                                            </template>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                            </template>
                        </a-col>
                    </a-row>

                    <!-- 竞争对手 -->
                    <a-row
                        v-if="isMember(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part])"
                        :gutter="24"
                        class="m-t-40"
                    >
                        <a-col :span="3" class="title-area">
                            <div class="title-two" id="competitor_analysis">
                                {{ $t('supply-chain.competitor') }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <div class="form-content-item-table">
                                <a-table
                                    :columns="competitor_analysis_column"
                                    :dataSource="formState.competitor_analysis"
                                    :scroll="{ x: true }"
                                    :row-key="record => record.id"
                                    :pagination="false"
                                    class="specific-table"
                                >
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
                                                :placeholder="$t('def.input')"
                                            />
                                        </template>
                                        <template v-else-if="column.type === 'input-num'">
                                            <a-input-number
                                                v-model:value="record[column.dataIndex]"
                                                :placeholder="$t('def.input')"
                                                :min="0"
                                            >
                                                <template #addonAfter v-if="column.unit">
                                                    <span class="l-w-h-style">{{ column.unit }}</span>
                                                </template>
                                            </a-input-number>
                                        </template>
                                        <template v-else-if="column.type === 'time'">
                                            <a-date-picker
                                                :placeholder="$t('def.select')"
                                                valueFormat="X"
                                                v-model:value="record[column.dataIndex]"
                                            />
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
                                                        'company_order',
                                                    )
                                                "
                                            >
                                                <i class="icon i_delete" />
                                                {{ $t('def.delete') }}
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
                                            'company_order',
                                        )
                                    "
                                >
                                    {{ $t('supply-chain.add_opponents') }}
                                </a-button>
                            </div>
                        </a-col>
                    </a-row>

                    <!-- 客户信息 -->
                    <a-row :gutter="24" class="m-t-40">
                        <a-col :span="3" class="title-area">
                            <div class="title-two" id="customer_info">
                                {{ $t('supply-chain.customer_information') }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <!-- 主要客户 -->
                            <div class="form-content-item-table">
                                <a-table
                                    :columns="customer_info_list_column"
                                    :dataSource="formState.customer_info"
                                    :scroll="{ x: true }"
                                    :row-key="record => record.id"
                                    :pagination="false"
                                    class="specific-table"
                                >
                                    <template #headerCell="{ title }">
                                        {{ $t(title) }}
                                    </template>
                                    <template #bodyCell="{ column, record, index }">
                                        <!-- 客户序号 -->
                                        <template v-if="column.dataIndex === 'customer_order'">
                                            <div class="information-customer-name m-l-4">
                                                <span
                                                    v-if="
                                                        isMember(formState.type, [
                                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers,
                                                        ])
                                                    "
                                                    class="information-customer-name-required"
                                                >
                                                    *
                                                </span>
                                                {{ record.customer_order }}
                                            </div>
                                        </template>
                                        <template v-if="column.type === 'input'">
                                            <a-form-item :name="column.dataIndex">
                                                <a-input
                                                    :class="{
                                                        'require-change-red':
                                                            isMember(formState.type, [
                                                                Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                                                Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers,
                                                            ]) &&
                                                            isFormStateRequired &&
                                                            !record[column.dataIndex],
                                                    }"
                                                    :name="column.dataIndex"
                                                    v-model:value="record[column.dataIndex]"
                                                    :placeholder="$t('def.input')"
                                                />
                                            </a-form-item>
                                        </template>
                                        <template v-else-if="column.type === 'input-num'">
                                            <a-form-item :name="column.dataIndex">
                                                <a-input-number
                                                    :class="{
                                                        'require-change-red':
                                                            isMember(formState.type, [
                                                                Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                                                Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers,
                                                            ]) &&
                                                            isFormStateRequired &&
                                                            !record[column.dataIndex],
                                                    }"
                                                    :name="column.dataIndex"
                                                    v-model:value="record[column.dataIndex]"
                                                    :placeholder="$t('def.input')"
                                                    :min="0"
                                                >
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
                                                        :class="{
                                                            'require-change-red':
                                                                isMember(formState.type, [
                                                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers,
                                                                ]) &&
                                                                isFormStateRequired &&
                                                                !record[column.dataIndex],
                                                        }"
                                                        :placeholder="$t('def.select')"
                                                        valueFormat="X"
                                                        picker="year"
                                                        v-model:value="record[column.dataIndex]"
                                                    />
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
                                                        'customer_order',
                                                    )
                                                "
                                            >
                                                <i class="icon i_delete" />
                                                {{ $t('def.delete') }}
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
                                            'customer_order',
                                        )
                                    "
                                >
                                    {{ $t('supply-chain.add_customers') }}
                                </a-button>
                            </div>
                        </a-col>
                    </a-row>

                    <!-- 技术信息 -->
                    <a-row
                        v-if="
                            !isMember(formState.type, [
                                Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers,
                            ])
                        "
                        :gutter="24"
                        class="m-t-40"
                    >
                        <a-col :span="3" class="title-area">
                            <div class="title-two" id="technical_info">
                                {{ $t('supply-chain.Technical_information') }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 相关专利 -->
                                    <a-form-item :label="$t('supply-chain.related_patent')">
                                        <a-input
                                            v-model:value="formState.technical_info.patent"
                                            :placeholder="$t('common.please_enter')"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col
                                    :span="
                                        isMember(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part]) ? 12 : 0
                                    "
                                >
                                    <!-- 研发中心 -->
                                    <a-form-item :label="$t('supply-chain.research_and_development_center')">
                                        <a-input
                                            v-model:value="formState.technical_info.RD_center"
                                            :placeholder="$t('common.please_enter')"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        isMember(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part]) ? 24 : 0
                                    "
                                >
                                    <!-- 研发合作机构 -->
                                    <a-form-item :label="$t('supply-chain.r_d_partner')">
                                        <a-input
                                            v-model:value="formState.technical_info.RD_partners"
                                            :placeholder="$t('common.please_enter')"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        isMember(formState.type, [
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold,
                                        ])
                                            ? 24
                                            : 0
                                    "
                                >
                                    <!-- 设计规范 -->
                                    <a-form-item :label="$t('supply-chain.design_specifications')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.technical_info.design_guides"
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        isMember(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part]) ? 24 : 0
                                    "
                                >
                                    <!-- 产品设计 -->
                                    <a-form-item :label="$t('supply-chain.product_design')">
                                        <a-checkbox-group
                                            v-model:value="formState.technical_info.product_design"
                                            :options="TECHNICAL_INFORMATION"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 过程设计 -->
                                    <a-form-item :label="$t('supply-chain.process_design')">
                                        <a-checkbox-group
                                            v-model:value="formState.technical_info.process_design"
                                            :options="PROCESS_DESIGN"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 过程验证 -->
                                    <a-form-item :label="$t('supply-chain.process_verification')">
                                        <a-checkbox-group
                                            v-model:value="formState.technical_info.process_validation"
                                            :options="PROCESS_VALIDATION"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        isMember(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold]) ? 24 : 0
                                    "
                                >
                                    <!-- 模具轮廓 -->
                                    <a-form-item :label="$t('supply-chain.mold_profile')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.technical_info.mold_profile"
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        isMember(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold]) ? 24 : 0
                                    "
                                >
                                    <!-- 模具重量 -->
                                    <a-form-item :label="$t('supply-chain.mold_weight')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.technical_info.mold_weight"
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        isMember(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold]) ? 24 : 0
                                    "
                                >
                                    <!-- 模具品类 -->
                                    <a-form-item :label="$t('supply-chain.mold_category')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.technical_info.mold_category"
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        isMember(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold]) ? 24 : 0
                                    "
                                >
                                    <!-- 模具设计 -->
                                    <a-form-item :label="$t('supply-chain.mould_design')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.technical_info.mold_design"
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        isMember(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold]) ? 24 : 0
                                    "
                                >
                                    <!-- 模具制造 -->
                                    <a-form-item :label="$t('supply-chain.mold_manufacturing')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.technical_info.mold_manufacture"
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col
                                    :span="
                                        isMember(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold]) ? 24 : 0
                                    "
                                >
                                    <!-- 模具验收 -->
                                    <a-form-item :label="$t('supply-chain.mold_acceptance')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.technical_info.mold_acceptance"
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />
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
                                            autocomplete="off"
                                        />
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
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>

                    <!-- 质量信息 -->
                    <a-row
                        v-if="
                            !isMember(formState.type, [
                                Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,
                                Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold,
                            ])
                        "
                        :gutter="24"
                        class="m-t-40"
                    >
                        <a-col :span="3" class="title-area">
                            <div class="title-two" id="quality_info">
                                {{ $t('supply-chain.quality_information') }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 质量体系认证 -->
                                    <a-form-item :label="$t('supply-chain.quality_system_certification')">
                                        <a-input
                                            v-model:value="formState.quality_info.certification"
                                            :placeholder="$t('common.please_enter')"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <!-- 环境体系认证 -->
                                    <a-form-item :label="$t('supply-chain.environmental_system_certification')">
                                        <a-input
                                            v-model:value="formState.quality_info.environmental_system_certification"
                                            :placeholder="$t('common.please_enter')"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 质量合作机构 -->
                                    <a-form-item :label="$t('supply-chain.quality_cooperation_agency')">
                                        <a-input
                                            v-model:value="formState.quality_info.partners"
                                            :placeholder="$t('common.please_enter')"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <!-- 认可实验室 -->
                                    <a-form-item :label="$t('supply-chain.accredited_laboratory')">
                                        <a-input
                                            v-model:value="formState.quality_info.accredited_laboratory"
                                            :placeholder="$t('common.please_enter')"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <!-- 质控工具软件 -->
                                    <a-form-item :label="$t('supply-chain.quality_control_tool_software')">
                                        <a-input
                                            v-model:value="formState.quality_info.tool_software"
                                            :placeholder="$t('common.please_enter')"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <!-- 计划体系认证 -->
                                    <a-form-item :label="$t('supply-chain.planning_system_certification')">
                                        <a-input
                                            v-model:value="formState.quality_info.system_certification"
                                            :placeholder="$t('common.please_enter')"
                                        />
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
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>

                    <!-- 产能产线 -->
                    <a-row
                        v-if="
                            isMember(formState.type, [
                                Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,
                                Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                            ])
                        "
                        :gutter="24"
                        class="m-t-40"
                    >
                        <a-col :span="3" class="title-area">
                            <div class="title-two" id="produce_capacity">
                                {{ $t('supply-chain.capacity_line') }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 关键自有工序 -->
                                    <a-form-item name="processes">
                                        <template #label>
                                            <span
                                                :class="{
                                                    'require-icon': isMember(formState.type, [
                                                        Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                                                    ]),
                                                }"
                                            >
                                                {{ $t('supply-chain.key_owned_process') }}
                                            </span>
                                        </template>

                                        <a-textarea
                                            :class="{
                                                'require-change-red':
                                                    isMember(formState.type, [
                                                        Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                                                    ]) &&
                                                    isFormStateRequired &&
                                                    !formState.produce_capacity.processes,
                                            }"
                                            name="processes"
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.produce_capacity.processes"
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />

                                        <template
                                            v-if="
                                                isMember(formState.type, [
                                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                                                ]) &&
                                                isFormStateRequired &&
                                                !formState.produce_capacity.processes
                                            "
                                            #extra
                                        >
                                            <span class="tips">
                                                {{ $t('common.please_enter')
                                                }}{{ $t('supply-chain.key_owned_process') }}
                                            </span>
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 智能自动化线 -->
                                    <a-form-item name="automation_line">
                                        <template #label>
                                            <span
                                                :class="{
                                                    'require-icon': isMember(formState.type, [
                                                        Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                                                    ]),
                                                }"
                                            >
                                                {{ $t('supply-chain.intelligent_automation_line') }}
                                            </span>
                                        </template>

                                        <a-textarea
                                            :class="{
                                                'require-change-red':
                                                    isMember(formState.type, [
                                                        Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                                                    ]) &&
                                                    isFormStateRequired &&
                                                    !formState.produce_capacity.automation_line,
                                            }"
                                            name="automation_line"
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.produce_capacity.automation_line"
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />

                                        <template
                                            v-if="
                                                isMember(formState.type, [
                                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                                                ]) &&
                                                isFormStateRequired &&
                                                !formState.produce_capacity.automation_line
                                            "
                                            #extra
                                        >
                                            <span class="tips">
                                                {{ $t('common.please_enter')
                                                }}{{ $t('supply-chain.intelligent_automation_line') }}
                                            </span>
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 生产产能负荷 -->
                                    <a-form-item name="load">
                                        <template #label>
                                            <span
                                                :class="{
                                                    'require-icon': isMember(formState.type, [
                                                        Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                                                    ]),
                                                }"
                                            >
                                                {{ $t('supply-chain.production_capacity_load') }}
                                            </span>
                                        </template>

                                        <a-textarea
                                            :class="{
                                                'require-change-red':
                                                    isMember(formState.type, [
                                                        Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                                                    ]) &&
                                                    isFormStateRequired &&
                                                    !formState.produce_capacity.load,
                                            }"
                                            name="load"
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.produce_capacity.load"
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />

                                        <template
                                            v-if="
                                                isMember(formState.type, [
                                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                                                ]) &&
                                                isFormStateRequired &&
                                                !formState.produce_capacity.load
                                            "
                                            #extra
                                        >
                                            <span class="tips">
                                                {{ $t('common.please_enter')
                                                }}{{ $t('supply-chain.production_capacity_load') }}
                                            </span>
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>

                    <!-- 外购管理 -->
                    <a-row
                        v-if="
                            isMember(formState.type, [
                                Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,
                                Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                            ])
                        "
                        :gutter="24"
                        class="m-t-40"
                    >
                        <a-col :span="3" class="title-area">
                            <div class="title-two" id="outsourcing">
                                {{ $t('supply-chain.qutsourcing_management') }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 外购工艺 -->
                                    <a-form-item :label="$t('supply-chain.qutsourced_technology')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.outsourcing.technology"
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />
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
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />
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
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />
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
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>

                    <!-- 指定信息 -->
                    <a-row
                        v-if="isMember(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers])"
                        :gutter="24"
                        class="m-t-40"
                    >
                        <a-col :span="3" class="title-area">
                            <div class="title-two" id="specify_info">
                                {{ $t('supply-chain.specify_information') }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 指定理由 -->
                                    <a-form-item name="reason">
                                        <template #label>
                                            <span class="require-icon">
                                                {{ $t('supply-chain.specify_reason') }}
                                            </span>
                                        </template>

                                        <a-textarea
                                            :class="{
                                                'require-change-red':
                                                    isFormStateRequired && !formState.specify_info.reason,
                                            }"
                                            name="reason"
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.specify_info.reason"
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />

                                        <template #extra>
                                            <span class="tips">
                                                {{ $t('common.please_enter') }}{{ $t('supply-chain.specify_reason') }}
                                            </span>
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 指定零件 -->
                                    <a-form-item name="parts">
                                        <template #label>
                                            <span class="require-icon">
                                                {{ $t('supply-chain.specify_part') }}
                                            </span>
                                        </template>

                                        <a-textarea
                                            :class="{
                                                'require-change-red':
                                                    isFormStateRequired && !formState.specify_info.parts,
                                            }"
                                            name="parts"
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.specify_info.parts"
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />

                                        <template #extra>
                                            <span class="tips">
                                                {{ $t('common.please_enter') }}{{ $t('supply-chain.specify_part') }}
                                            </span>
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 指定协议 -->
                                    <a-form-item name="protocol">
                                        <template #label>
                                            <span class="require-icon">
                                                {{ $t('supply-chain.specified_protocol') }}
                                            </span>
                                        </template>

                                        <a-textarea
                                            :class="{
                                                'require-change-red':
                                                    isFormStateRequired && !formState.specify_info.protocol,
                                            }"
                                            name="protocol"
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.specify_info.protocol"
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />

                                        <template #extra>
                                            <span class="tips">
                                                {{ $t('common.please_enter')
                                                }}{{ $t('supply-chain.specified_protocol') }}
                                            </span>
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 指定服务 -->
                                    <a-form-item name="service">
                                        <template #label>
                                            <span class="require-icon">
                                                {{ $t('supply-chain.specify_service') }}
                                            </span>
                                        </template>

                                        <a-textarea
                                            :class="{
                                                'require-change-red':
                                                    isFormStateRequired && !formState.specify_info.service,
                                            }"
                                            name="service"
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.specify_info.service"
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />

                                        <template #extra>
                                            <span class="tips">
                                                {{ $t('common.please_enter') }}{{ $t('supply-chain.specify_service') }}
                                            </span>
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>

                    <!-- 服务信息 -->
                    <a-row
                        v-if="isMember(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker])"
                        :gutter="24"
                        class="m-t-40"
                    >
                        <a-col :span="3" class="title-area">
                            <div class="title-two" id="service_info">
                                {{ $t('supply-chain.service_information') }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 技术服务 -->
                                    <a-form-item :label="$t('supply-chain.technical_service')">
                                        <a-textarea
                                            :row="6"
                                            :maxlength="2000"
                                            v-model:value="formState.service_info.technical_services"
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />
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
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />
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
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />
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
            v-if="!isMember(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker])"
        >
            <div class="title" id="production_equipment">
                {{ $t('supply-chain.device_information') }}
            </div>
            <!-- 关键生产设备 -->
            <div class="base-info-form">
                <a-form labelAlign="right">
                    <a-row :gutter="24">
                        <a-col :span="3" class="title-area">
                            <div
                                class="title-two"
                                :class="{
                                    'require-icon': isMember(formState.type, [
                                        Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                                        Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold,
                                    ]),
                                }"
                            >
                                {{ $t('supply-chain.key_production_equipment') }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <div class="form-content-item-table">
                                <a-table
                                    :columns="production_equipment_column"
                                    :dataSource="formState.production_equipment"
                                    :scroll="{ x: true }"
                                    :row-key="record => record.id"
                                    :pagination="false"
                                    class="specific-table"
                                >
                                    <template #headerCell="{ title }">
                                        {{ $t(title) }}
                                    </template>
                                    <template #bodyCell="{ column, record, index }">
                                        <template v-if="column.type === 'input'">
                                            <a-form-item :name="`production_${column.dataIndex}`">
                                                <a-input
                                                    :class="{
                                                        'require-change-red':
                                                            isMember(formState.type, [
                                                                Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                                                                Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold,
                                                            ]) &&
                                                            isFormStateRequired &&
                                                            !record[column.dataIndex],
                                                    }"
                                                    :name="`production_${column.dataIndex}`"
                                                    v-model:value="record[column.dataIndex]"
                                                    :placeholder="$t('def.input')"
                                                />
                                            </a-form-item>
                                        </template>
                                        <template v-else-if="column.type === 'input-num'">
                                            <a-form-item :name="`production_${column.dataIndex}`">
                                                <a-input-number
                                                    :class="{
                                                        'require-change-red':
                                                            isMember(formState.type, [
                                                                Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                                                                Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold,
                                                            ]) &&
                                                            isFormStateRequired &&
                                                            !record[column.dataIndex],
                                                    }"
                                                    :name="`production_${column.dataIndex}`"
                                                    v-model:value="record[column.dataIndex]"
                                                    :placeholder="$t('def.input')"
                                                    :min="0"
                                                >
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
                                                        :class="{
                                                            'require-change-red':
                                                                isMember(formState.type, [
                                                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing,
                                                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold,
                                                                ]) &&
                                                                isFormStateRequired &&
                                                                !record[column.dataIndex],
                                                        }"
                                                        :placeholder="$t('def.select')"
                                                        valueFormat="X"
                                                        v-model:value="record[column.dataIndex]"
                                                    />
                                                </span>
                                            </a-form-item>
                                        </template>
                                        <template v-else-if="column.dataIndex === 'operation'">
                                            <a-button
                                                type="link"
                                                v-if="index"
                                                @click="handleDelete(formState.production_equipment, record)"
                                            >
                                                <i class="icon i_delete" />
                                                {{ $t('def.delete') }}
                                            </a-button>
                                        </template>
                                    </template>
                                </a-table>
                                <a-button
                                    class="spec-add"
                                    type="primary"
                                    ghost
                                    @click="handleAddSpecItem(formState.production_equipment, production_equipment_obj)"
                                >
                                    {{ $t('supply-chain.add_production_equipment') }}
                                </a-button>
                            </div>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <!-- 关键检测设备 -->
            <div class="base-info-form m-t-40">
                <a-form name="custom-validation" labelAlign="right">
                    <a-row :gutter="24">
                        <a-col :span="3" class="title-area">
                            <div
                                class="title-two"
                                :class="{
                                    'require-icon': isMember(formState.type, [
                                        Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold,
                                    ]),
                                }"
                            >
                                {{ $t('supply-chain.critical_detection_equipment') }}
                            </div>
                        </a-col>
                        <a-col :span="21">
                            <div class="form-content-item-table">
                                <a-table
                                    :columns="detection_equipment_column"
                                    :dataSource="formState.detection_equipment"
                                    :scroll="{ x: true }"
                                    :row-key="record => record.id"
                                    :pagination="false"
                                    class="specific-table"
                                >
                                    <template #headerCell="{ title }">
                                        {{ $t(title) }}
                                    </template>
                                    <template #bodyCell="{ column, record, index }">
                                        <template v-if="column.type === 'input'">
                                            <a-form-item :name="`detection_${column.dataIndex}`">
                                                <a-input
                                                    :class="{
                                                        'require-change-red':
                                                            isMember(formState.type, [
                                                                Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold,
                                                            ]) &&
                                                            isFormStateRequired &&
                                                            !record[column.dataIndex],
                                                    }"
                                                    :name="`detection_${column.dataIndex}`"
                                                    v-model:value="record[column.dataIndex]"
                                                    :placeholder="$t('def.input')"
                                                />
                                            </a-form-item>
                                        </template>
                                        <template v-else-if="column.type === 'input-num'">
                                            <a-form-item :name="`detection_${column.dataIndex}`">
                                                <a-input-number
                                                    :class="{
                                                        'require-change-red':
                                                            isMember(formState.type, [
                                                                Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold,
                                                            ]) &&
                                                            isFormStateRequired &&
                                                            !record[column.dataIndex],
                                                    }"
                                                    :name="`detection_${column.dataIndex}`"
                                                    v-model:value="record[column.dataIndex]"
                                                    :placeholder="$t('def.input')"
                                                    :min="0"
                                                >
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
                                                        :class="{
                                                            'require-change-red':
                                                                isMember(formState.type, [
                                                                    Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold,
                                                                ]) &&
                                                                isFormStateRequired &&
                                                                !record[column.dataIndex],
                                                        }"
                                                        :placeholder="$t('def.select')"
                                                        valueFormat="X"
                                                        v-model:value="record[column.dataIndex]"
                                                    />
                                                </span>
                                            </a-form-item>
                                        </template>
                                        <template v-else-if="column.dataIndex === 'operation'">
                                            <a-button
                                                type="link"
                                                v-if="index"
                                                @click="handleDelete(formState.detection_equipment, record)"
                                            >
                                                <i class="icon i_delete" />
                                                {{ $t('def.delete') }}
                                            </a-button>
                                        </template>
                                    </template>
                                </a-table>
                                <a-button
                                    class="spec-add"
                                    type="primary"
                                    ghost
                                    @click="handleAddSpecItem(formState.detection_equipment, detection_equipment_obj)"
                                >
                                    {{ $t('supply-chain.add_detection_equipment') }}
                                </a-button>
                            </div>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </div>
        <!-- 补充信息 -->
        <div class="base-info content-area margin-t-20">
            <div class="title" id="additional_info">
                {{ $t('supply-chain.supplementary_information') }}
            </div>
            <div class="base-info-form">
                <a-form labelAlign="right">
                    <a-row :gutter="24">
                        <a-col :span="3" class="title-area">
                            <div class="title-two">
                                <!-- 其他优势说明 -->
                                {{ $t('supply-chain.other_advantages_description') }}
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
                                            :placeholder="$t('common.please_enter')"
                                            autocomplete="off"
                                        />
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
import { ref, reactive, watch, onMounted, toRef, computed } from 'vue';
import TimeSearch from '@/components/common/TimeSearch.vue';
import { message } from 'ant-design-vue';
import Core from '@/core';
import MySvgIcon from '@/components/MySvgIcon/index.vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import axios from 'axios';

// json
const chinaOptions = ref([]);

const $t = useI18n().t;
const $i18n = useI18n();
const $store = useStore();

const TimeSearchRef = ref(null);
const TECHNICAL_INFORMATION = computed(() => {
    let arr = [];
    Core.Const.SUPPLAY.TECHNICAL_INFORMATION.forEach(item => {
        arr.push({
            label: $t(item.t),
            value: item.value,
        });
    });
    return arr;
});
const PROCESS_DESIGN = computed(() => {
    let arr = [];
    Core.Const.SUPPLAY.PROCESS_DESIGN.forEach(item => {
        arr.push({
            label: $t(item.t),
            value: item.value,
        });
    });
    return arr;
});
const PROCESS_VALIDATION = computed(() => {
    let arr = [];
    Core.Const.SUPPLAY.PROCESS_VALIDATION.forEach(item => {
        arr.push({
            label: $t(item.t),
            value: item.value,
        });
    });
    return arr;
});

// 表格添加对象-客户名称
const customer_info_list_obj = ref({
    customer_order: '',
    customer_name: '',
    sales_share: '',
    main_supply_part: '',
    begin_cooperation_time: '',
});
// 职位多选
const plainOptions = computed(() => {
    let arr = [];
    Core.Const.SUPPLAY.POSITION.forEach(item => {
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
            title: $t('supply-chain.position_identity'),
            key: 'position',
            dataIndex: 'position',
            align: 'center',
            width: 90,
        }, // 职务
        // 姓名
        {
            id: 1,
            title: $t('supply-chain.name'),
            key: 'name',
            dataIndex: 'name',
            align: 'center',
        }, // 姓名
        // 手机号
        {
            id: 3,
            title: $t('supply-chain.contact'),
            key: 'phone',
            dataIndex: 'phone',
            align: 'center',
        }, // 手机号
        // 邮箱
        {
            id: 2,
            title: $t('supply-chain.mailbox'),
            key: 'email',
            dataIndex: 'email',
            align: 'center',
        }, // 邮箱
    ];

    return columns;
});
// 客户信息
const customer_info_list_column = ref([
    {
        title: 'supply-chain.customer_serial_number',
        key: 'customer_order',
        dataIndex: 'customer_order',
        type: 'text',
    }, // 客户序号
    {
        title: 'supply-chain.customer_name',
        key: 'customer_name',
        dataIndex: 'customer_name',
        type: 'input',
    }, // 客户名称
    {
        title: 'supply-chain.Sales_share',
        key: 'sales_share',
        dataIndex: 'sales_share',
        unit: '%',
        type: 'input-num',
        width: 120,
    }, // 销售占比
    {
        title: 'supply-chain.Main_supply_part',
        key: 'main_supply_part',
        dataIndex: 'main_supply_part',
        type: 'input',
    }, // 主供零件
    {
        title: 'supply-chain.Start_time',
        key: 'begin_cooperation_time',
        dataIndex: 'begin_cooperation_time',
        type: 'time',
    }, // 开始合作时间
    { title: 'supply-chain.operate', key: 'delete', dataIndex: 'operation' }, // 操作
]);

// 竞争对手
const competitor_analysis_obj = ref({
    customer_order: '',
    company_name: '',
    market_share: '',
    understand_evaluation: '',
});
const competitor_analysis_column = ref([
    {
        title: 'supply-chain.company_serial_number',
        key: 'company_order',
        dataIndex: 'company_order',
        type: 'text',
    }, // 公司序号
    {
        title: 'supply-chain.company_name',
        key: 'company_name',
        dataIndex: 'company_name',
        type: 'input',
    }, // 公司名称
    {
        title: 'supply-chain.market_share',
        key: 'market_share',
        dataIndex: 'market_share',
        type: 'input',
    }, // 市场份额
    {
        title: 'supply-chain.understanding_evaluation',
        key: 'understand_evaluation',
        dataIndex: 'understand_evaluation',
        unit: '%',
        type: 'input',
    }, // 了解评价
    { title: 'supply-chain.operate', key: 'delete', dataIndex: 'operation' }, // 操作
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
        title: 'supply-chain.Name_of_production_equipment',
        key: 'name',
        dataIndex: 'name',
        type: 'input',
    }, // 生产设备名称
    {
        title: 'supply-chain.Specification_and_model',
        key: 'spec',
        dataIndex: 'spec',
        type: 'input',
    }, // 规格型号（含吨位）
    {
        title: 'supply-chain.quantity',
        key: 'quantity',
        dataIndex: 'quantity',
        type: 'input-num',
    }, // 数量
    {
        title: 'supply-chain.Equipment_manufacturer',
        key: 'manufacturer',
        dataIndex: 'manufacturer',
        type: 'input',
    }, // 设备制造商
    {
        title: 'supply-chain.Purchase_period',
        key: 'purchase_period',
        dataIndex: 'purchase_period',
        type: 'input-num',
    }, // 购置年限
    { title: 'supply-chain.operate', key: 'delete', dataIndex: 'operation' }, // 操作
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
        title: 'supply-chain.Name_of_detection_equipment',
        key: 'name',
        dataIndex: 'name',
        type: 'input',
    }, // 检测设备名称
    {
        title: 'supply-chain.Specification_text',
        key: 'spec',
        dataIndex: 'spec',
        type: 'input',
    }, // 规格型号
    {
        title: 'supply-chain.quantity',
        key: 'quantity',
        dataIndex: 'quantity',
        type: 'input-num',
    }, // 数量
    {
        title: 'supply-chain.Equipment_manufacturer',
        key: 'manufacturer',
        dataIndex: 'manufacturer',
        type: 'input',
    }, // 设备制造商
    {
        title: 'supply-chain.precision_grade',
        key: 'purchase_period',
        dataIndex: 'accuracy_level',
        type: 'input',
    }, // 精度等级
    { title: 'supply-chain.operate', key: 'delete', dataIndex: 'operation' }, // 操作
]);

// 表单对象
const formState = reactive({
    type: 1, //表格类型
    position: [],
    // 联系方式
    contact_info: [
        // {
        //     position: 4,
        //     name: "",
        //     phone: "",
        //     email: "",
        //     flag_wechat: false,
        // },
    ],
    // 公司概况
    company_info: {
        name: '', // 名称
        website_address: '', // 网址
        address: '', // 详细地址
        established_time: '', // 成立时间
        registered_capital: '', // 注册资本
        fixed_assets: '', // 固定资产
        nature: '', // 性质
        legal_person: '', // 法人代表
        purchasing_radius: '', // 采购半径Km
        floor_area: '', // 占地面积m2
        building_area: '', // 建筑面积m2
        premises: '', // 经营场所
        parent_company_name: '', // 母公司名称
        parent_company_address: '', // 母公司地址
        // 省市区
        province: '',
        city: '',
        address: '',
        //回显的数组
        provinceAndCity: [],
    },
    // 代理公司概况
    agent_info: {
        agent_company: '', // 被代理公司
        agent_address: '', // 被代理地址
        agent_relationship: '', // 被代理关系
        flag_agent_warrant: '', // 是否有代理权证
        agent_effective_begin_time: '', // 代理有效开始时间
        agent_effective_end_time: '', // 代理有效结束时间
        agent_product: '', // 代理产品
        fixed_assets: '', // 固定资产
    },
    // 人力资源
    human_resource: {
        total_employees: '', // 员工总数
        manager_number: '', // 管理人数
        mass_number: '', // 质量人数
        technician_number: '', // 技术人数
        technical_seniority: '', // 技术工龄
    },
    // 财务信息
    financial_info: {
        flag_legal_dispute: '', // 是否有法律纠纷
        average_monthly_wage_of_operating_workers: '', // 操作工人 月平均工资
        per_capita_annual_output_value_of_management_staff: '', // 管理职员 人均年产值
        account_period_requirement: '', // 账期要求
        invoice_type: '', // 发票类型
        invoice_range_value: '', // 发票范围值
    },
    // 营业信息(近几年)
    business_info: {
        proportion_of_business: '',
        list: [
            {
                recent_year: '近1年',
                sales: '',
                taxes_paid: '',
                profit_margin: '',
                asset_liability_ratio: '',
                cash_flow_ratio: '',
            },
            {
                recent_year: '近2年',
                sales: '',
                taxes_paid: '',
                profit_margin: '',
                asset_liability_ratio: '',
                cash_flow_ratio: '',
            },
            {
                recent_year: '近3年',
                sales: '',
                taxes_paid: '',
                profit_margin: '',
                asset_liability_ratio: '',
                cash_flow_ratio: '',
            },
        ],
    },
    // 竞争对手
    competitor_analysis: [
        {
            company_order: '竞争对手1',
            company_name: '',
            market_share: '',
            understand_evaluation: '',
        },
    ],
    // 客户信息
    customer_info: [
        {
            customer_order: '主要客户1',
            customer_name: '',
            sales_share: '',
            main_supply_part: '',
            begin_cooperation_time: '',
        },
    ],
    // 技术信息
    technical_info: {
        patent: '', // 相关专利
        RD_center: '', // 研发中心
        RD_partners: '', // 研发合作机构
        design_guides: '', // 设计规范

        product_design: [], // 产品设计
        process_design: [], //过程设计
        process_validation: [], //过程验证

        design_software: '', // 设计软件
        dev_process: '', // 开发流程
        mold_profile: '', //模具轮廓
        mold_weight: '', //模具重量
        mold_category: '', //模具品类
        mold_design: '', //模具设计
        mold_manufacture: '', //模具制造
        mold_acceptance: '', //模具验收
        design_software: '', //设计软件
        dev_process: '', //开发流程
    },
    // 质量
    quality_info: {
        certification: '', // 质量体系认证
        partners: '', // 质量合作机构
        tool_software: '', // 质控工具软件
        PPM: '', // 市场PPM
        env_certification: '', // 环境体系认证
        accredited_laboratory: '', // 认可实验室
        system_certification: '', // 计划体系认证
    },

    // 产能产线
    produce_capacity: {
        processes: '', // 关键自有工序
        automation_line: '', // 智能自动化线
        load: '', // 生产产能负荷
    },
    // 外购管理
    outsourcing: {
        technology: '', // 外购工艺
        parts: '', // 外购备件
        material: '', // 外购原料
        system: '', // 外购制度
    },
    // 关键生产设备
    production_equipment: [
        {
            name: '' /* 生产设备名称 */,
            spec: '' /* 规格型号（含吨位） */,
            quantity: '' /* 数量 */,
            manufacturer: '' /* 设备制造商 */,
            purchase_period: '' /* 购置年限 */,
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
        reason: '', // 指定理由
        parts: '', // 指定零件
        protocol: '', // 指定协议
        service: '', // 指定服务
    },
    // 服务信息
    service_info: {
        technical_services: '', // 技术服务
        quality_service: '', // 质量服务
        supply_services: '', // 供应服务
    },
    // 补充信息
    additional_info: '',
});
const isFormStateRequired = ref(false);

/* methods start */
// 查询当前校验的字段的父级,直到找到class为ant-form-item-control的元素的递归函数
// const findParent = (el) => {
//     // 查找到父级
//     let parent = el.parentNode;
//     let classNameArr = parent.className.split(" ");
//     if (parent && !classNameArr.includes("ant-form-item")) {
//         return findParent(parent);
//     } else if (!parent && parent.parentNode) {
//         return findParent(parent.parentNode);
//     } else if (!parent && !parent.parentNode) {
//         return "";
//     } else {
//         return parent.querySelector(".ant-form-item-label > label").innerText;
//     }
// };
const handleCheckBox = checkedValue => {
    // 清除
    formState.position = checkedValue;
    let arr = [];
    checkedValue.forEach(item => {
        // 如果formState.contact_info里面有这个职位,就将这个职位的信息push到arr里面
        if (formState.contact_info.some(item2 => item2.position == item)) {
            arr.push(formState.contact_info.find(item2 => item2.position == item));
        } else {
            arr.push({
                position: item,
                name: '',
                phone: '',
                email: '',
                flag_wechat: false,
            });
        }
    });
    formState.contact_info = arr;
};

// 草稿回显
const draftDataReview = () => {
    let draftData = $store.state.SUPPLY_CHAIN.supplyDraftChain;
    if (draftData?.form) {
        let type = typeof draftData.form;
        if (type === 'string') {
            draftData.form = JSON.parse(draftData.form);
        } else {
            draftData.form = draftData.form;
        }
    } else {
        draftData = {};
    }
    // 判断是否为空对象
    if (Object.keys(draftData).length === 0) {
        console.log('空对象', '详情回显');
    } else {
        Object.keys(draftData).forEach(key => {
            if (key === 'form') {
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
const isMember = (type, typeIncludes) => {
    let result = typeIncludes.includes(Number(type));
    return result;
};

// 代理有效期间
const handleTimeSearch = params => {
    formState.agent_info.agent_effective_begin_time = params.begin_time;
    formState.agent_info.agent_effective_end_time = params.end_time;
};
// 校验
const step1Vaild = () => {
    let paramsRequired = paramsRequiredFilter();
    return new Promise((resolve, reject) => {
        // !paramsRequired.length 去掉校验
        if (true) {
            isFormStateRequired.value = false;
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
            console.log('baseInfo', data);
            // 保存数据
            $store.dispatch('SUPPLY_CHAIN/setSupplyChain', data);
            $store.dispatch('SUPPLY_CHAIN/setSupplyDraftChain', data);
            resolve(true);
        } else {
            isFormStateRequired.value = true;
            let tips = null;
            // console.log("tips msg", paramsRequired[0].split('.'));
            switch (paramsRequired[0].split('.')[0]) {
                case 'position':
                    tips = $t('supply-chain.please_complete_info') + '(' + $t('supply-chain.Position') + ')';
                    break;
                case 'contact_info':
                    tips = $t('supply-chain.please_complete_info') + '(' + $t('supply-chain.contact') + ')';
                    break;
                case 'company_info':
                    tips = $t('supply-chain.please_complete_info') + '(' + $t('supply-chain.company_profile') + ')';
                    break;
                case 'financial_info':
                    tips =
                        $t('supply-chain.please_complete_info') + '(' + $t('supply-chain.financial_information') + ')';
                    break;
                case 'business_info':
                    tips =
                        $t('supply-chain.please_complete_info') + '(' + $t('supply-chain.business_information') + ')';
                    break;
                case 'agent_info':
                    tips = $t('supply-chain.please_complete_info') + '(' + $t('supply-chain.agent_information') + ')';
                    break;
                case 'customer_info':
                    tips =
                        $t('supply-chain.please_complete_info') + '(' + $t('supply-chain.customer_information') + ')';
                    break;
                case 'produce_capacity':
                    tips = $t('supply-chain.please_complete_info') + '(' + $t('supply-chain.capacity_line') + ')';
                    break;
                case 'production_equipment':
                    tips =
                        $t('supply-chain.please_complete_info') +
                        '(' +
                        $t('supply-chain.key_production_equipment') +
                        ')';
                    break;
                case 'specify_info':
                    tips = $t('supply-chain.please_complete_info') + '(' + $t('supply-chain.specify_information') + ')';
                    break;
                default:
                    break;
            }
            console.log(paramsRequired[0].split('.')[0]);
            message.warning(tips);
            let name = paramsRequired[0].split('.')[0];
            if (name === 'position') {
                name = 'contact_info';
            }
            let errorDom = document.querySelector(`[id=${name}]`);
            errorDom.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest',
            });
            reject(false);
        }
    });
};
// 判断哪些参数是必填的
const paramsRequiredFilter = () => {
    const result = [];

    // 公有的
    const publicParams = {
        // 职位
        position: [],
        contact_info: [
            {
                position: null, // 职务：1.销售；2.质量；3.技术；4.总经理
                name: null, // 姓名
                email: null, // 邮箱
                phone: null, // 手机号
            },
        ],
        company_info: {
            name: null,
            address: null,
            established_time: null,
            legal_person: null,
        },
        financial_info: {
            flag_legal_dispute: null, // 是否有法律纠纷
            account_period_requirement: null, // 账期要求
            invoice_type: null, // 发票类型
            // invoice_range_value: "" // 发票范围值
        },
    };
    // 私有的
    let privateParams = {};

    switch (formState.type) {
        // 零件类
        // case Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part:

        //break;
        // 代理类
        case Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker:
            privateParams = {
                // 营业信息
                business_info: {
                    proportion_of_business: null, // 业务比重
                    list: [
                        {
                            sales: null, // 销售额
                            taxes_paid: null, // 纳税额
                            profit_margin: null, // 利润率
                            asset_liability_ratio: null, // 资产负债率
                            cash_flow_ratio: null, // 现金流量比率
                        },
                    ],
                },
                // 代理信息
                agent_info: {
                    flag_agent_warrant: null, // 是否有代理权证
                    agent_effective_begin_time: null, // 代理有效开始时间
                    agent_effective_end_time: null, // 代理有效结束时间
                },
                // 客户信息
                customer_info: [
                    {
                        customer_name: '客户名称',
                        sales_share: '销售占比',
                        main_supply_part: '主供零件',
                        begin_cooperation_time: '开始合作时间',
                    },
                ],
            };
            break;
        // 外协类
        case Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing:
            privateParams = {
                // 营业信息
                business_info: {
                    list: [
                        {
                            sales: null, // 销售额
                        },
                    ],
                },
                // 产能产线
                produce_capacity: {
                    processes: null, // 关键自有工序
                    automation_line: null, // 智能自动化线
                    load: null, // 生产产能负荷
                },
                // 关键生产设备
                production_equipment: [
                    {
                        name: null, // 生产设备名称
                        spec: null, // 规格型号
                        quantity: null, // 数量
                        manufacturer: null, // 设备制造商
                        purchase_period: null, // 购置年限
                    },
                ],
            };
            break;
        // 模具类
        case Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold:
            privateParams = {
                // 关键生产设备
                production_equipment: [
                    {
                        name: null, // 生产设备名称
                        spec: null, // 规格型号
                        quantity: null, // 数量
                        manufacturer: null, // 设备制造商
                        purchase_period: null, // 购置年限
                    },
                ],
                // 关键检测设备
                production_equipment: [
                    {
                        name: null, // 检测设备名称
                        Spec: null, // 规格型号
                        quantity: null, // 数量
                        manufacturer: null, // 设备制造商
                        accuracy_level: null, // 精度等级
                    },
                ],
            };
            break;
        // 客指类
        case Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers:
            privateParams = {
                // 客户信息
                customer_info: [
                    {
                        customer_name: '客户名称',
                        sales_share: '销售占比',
                        main_supply_part: '主供零件',
                        begin_cooperation_time: '开始合作时间',
                    },
                ],

                // 营业信息
                business_info: {
                    list: [
                        {
                            sales: null, // 销售额
                        },
                    ],
                },

                // 指定信息
                specify_info: {
                    reason: '', // 指定理由
                    parts: '', // 指定零件
                    protocol: '', // 指定协议
                    service: '', // 指定服务
                },
            };
            break;
    }

    // 必填的字段
    const requiredParams = {
        ...publicParams,
        ...privateParams,
    };

    for (const key in requiredParams) {
        let keys = requiredParams[key];

        if (keys instanceof Array) {
            console.log('数组', formState[key]);
            if (key === 'position') {
                formState[key].length ? null : result.push(`${key}`);
            } else {
                for (const el of formState[key]) {
                    if (Number(el.position) === Core.Const.SUPPLAY.POSITION_MAP_STATUS.GENERAL_MANAGER) {
                        // 职位总经理不需要校验
                        // console.log("职位总经理不需要校验");
                        continue;
                    }
                    // 这里是必填项的参数循环 判断数据里面哪些参数是必填的
                    for (const arrItem in keys[0]) {
                        if (!el[arrItem]) {
                            // console.log("1", `${key}.${arrItem}`, result.includes(`${key}.${arrItem}`));
                            if (!result.includes(`${key}.${arrItem}`)) {
                                // 结果里面存在了就不在添加
                                result.push(`${key}.${arrItem}`);
                            }
                        }
                    }
                }
            }
            // 判断 数组
        } else if (keys instanceof Object) {
            if (key === 'business_info') {
                // 特殊的 console.log("特殊的", formState[key]);
                formState[key].list.forEach(el => {
                    // 这里是必填项的参数循环 判断数据里面哪些参数是必填的
                    for (const arrItem in keys.list[0]) {
                        if (!el[arrItem]) {
                            // console.log("1", `${key}.${arrItem}`, result.includes(`${key}.${arrItem}`));
                            if (!result.includes(`${key}.${arrItem}`)) {
                                // 结果里面存在了就不在添加
                                result.push(`${key}.${arrItem}`);
                            }
                        }
                    }
                });
            } else {
                // 判断 是对象 [数组其实也是对象 所以先判断数组在判断对象]
                for (const item in keys) {
                    // console.log("值", formState[key][item]);
                    if (!formState[key][item]) {
                        // 值为空 插入结果中
                        result.push(`${key}.${item}`);
                    }
                }
            }
        } else if (typeof keys === 'string' || typeof keys === 'number' || typeof keys === 'boolean') {
            // | 字符串 | 数字 | 布尔
        }
    }
    console.log('返回的值', result);

    return result;
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
    $store.dispatch('SUPPLY_CHAIN/setSupplyDraftChain', data);
    // 提示
    message.success($t('supply-chain.save_successfully'));
};
// 回显数据
const reviewData = () => {
    draftDataReview();
};
// 删除某一项
const handleDelete = (list, data, title, key) => {
    Core.Util.confirm({
        title: $t('supply-chain.detele_data_sure'),
        content: $t('coc.coc_delete_confirm_content'),
        okText: $t('coc.coc_btn_comfirm'),
        cancelText: $t('coc.coc_btn_cancel'),
        onOk: () => {
            const index = list.findIndex(el => el.id === data.id);

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
    title ? (obj[key] = title + id) : '';

    list.push({ ...obj, id });
};

// 供应类型切换
const onTypeChange = item => {
    formState.type = item.value;
    isFormStateRequired.value = false;
};
// 获取china的地区数据
const getChinaArea = () => {
    let url = '/ext/China.json';
    axios.get(url).then(res => {
        console.log('china', res);
        chinaOptions.value = res.data;
    });
};

/* methods end */
defineExpose({
    step1Vaild,
    saveDraft1,
    reviewData,
});
onMounted(() => {
    // 回显数据
    reviewData();
    // 获取china的地区数据
    getChinaArea();
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
            padding: 8px 2% 0 5%;
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
    margin-left: 80px;

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
        background-image: url('../../../assets/images/supply-chain/parts-bg.png');
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

:deep(.ant-form-item) {
    margin-bottom: 16px;
}
:deep(.technical_seniority) {
    .ant-form-item-control {
        .ant-form-item-control-input {
            .ant-form-item-control-input-content {
                display: flex;
                align-items: center;
                height: 100%;
                .ant-input {
                    border-radius: 4px 0 0 4px !important;
                }
                .unit-addon {
                    background-color: #f2f2f2;
                    color: #808fa6;
                    text-align: center;
                    font-size: 14px;
                    border-color: #eaecf1;
                    box-sizing: border-box;
                    padding: 0 11px;
                    height: 100%;
                    border: 1px solid #d9d9d9;
                    display: flex;
                    align-items: center;
                    border-radius: 0 4px 4px 0;
                    border-left: none;
                }
            }
        }
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
                content: '*';
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
    // .ant-table-tbody {
    //     .no-require {
    //         .ant-table-cell {
    //             #custom-validation_contact_info {
    //                 border: 1px solid #eaecf2 !important;
    //                 // 清除所有的失败的样式,border box-shadow
    //                 &:focus,
    //                 &:hover {
    //                     border: 1px solid #eaecf2 !important;
    //                     box-shadow: none !important;
    //                 }
    //             }
    //         }
    //     }
    //     .require {
    //         .ant-table-cell {
    //             .require {
    //                 border: 1px solid #ff4d4f !important;
    //                 // 清除所有的失败的样式,border box-shadow
    //                 &:focus,
    //                 &:hover {
    //                     border: 1px solid #ff4d4f !important;
    //                     box-shadow: none !important;
    //                 }
    //             }
    //         }
    //     }
    //     .ant-table-row {
    //         .ant-table-cell {
    //             input {
    //                 border: 1px solid #eaecf2;
    //                 // 清除所有的失败的样式,border box-shadow
    //                 &:focus,
    //                 &:hover {
    //                     border: 1px solid #eaecf2;
    //                     box-shadow: none;
    //                 }
    //             }
    //         }
    //     }
    // }
}

.spec-add {
    margin-top: 16px;
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

.require-change-red {
    border: 1px solid #eb4141;
}

.require-icon {
    &::before {
        content: '*';
        color: #eb4141;
        vertical-align: middle;
        margin-right: 4px;
    }
}

.tips {
    font-size: 14px;
    font-weight: 400;
    color: #eb4141;
    margin-top: 4px;
    margin-left: 10px;
}

.information-customer-name {
    padding: 0 10px;
    height: 32px;
    line-height: 32px;
    background-color: #f2f3f5;
    text-align: center;
    display: inline-block;

    .information-customer-name-required {
        color: #eb4141;
        vertical-align: middle;
    }
}
</style>
