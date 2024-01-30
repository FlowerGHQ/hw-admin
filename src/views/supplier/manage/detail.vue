<template>
    <div class="supply-detail">
        <div v-if="false" class="back m-b-20 cursor" @click="onBack">
            <MySvgIcon icon-class="supply-m-d-arrow-left" />
            <span>供应商资料查看/编辑</span>
        </div>
        <!-- 基本信息 -->
        <div class="base-message">
            <div class="msg-header">
                <span class="m-l-4">{{ $t('supply-chain.basic_info') }}</span>
            </div>
            <!-- 供应类型 -->
            <div class="supply-type bg-color m-t-16">
                <div class="title">{{ $t('supply-chain.type_supply') }}</div>
                <div class="information-container-form" style="flex: 1">
                    <div style="width: 10%"></div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <div class="search-col m-t-0">
                                <div class="key w-130 t-a-r text-color"></div>
                                <div class="value">
                                    <template v-if="!isEdit">                                    
                                        <div class="btn-type-parts">
                                            <MySvgIcon icon-class="parts-icon" />
                                            <span class="m-l-4">
                                                {{
                                                    Core.Const.SUPPLAY.SUPPLAY_TYPE[msgDetail.type] ?
                                                    $t(Core.Const.SUPPLAY.SUPPLAY_TYPE[msgDetail.type].t) : "-"
                                                }}
                                            </span>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="edit-type">
                                            <div 
                                                v-for="(item, index) in Core.Const.SUPPLAY.SUPPLAY_TYPE" 
                                                :key="index"
                                                class="edit-type-item cursor m-t-16 m-r-20"
                                                :class="{
                                                    'edit-type-item-select': Number(item.value) === Number(parameters.type),
                                                    'edit-type-item-change': Number(item.value) !== Number(parameters.type),                                                    
                                                }"
                                                @click="onSelectType(item.value)"
                                            >
                                                
                                                <MySvgIcon 
                                                    :icon-class="`white-${item.icon}`"                                                     
                                                    :class="{
                                                        'white-font': Number(item.value) === Number(parameters.type),
                                                        'black-font': Number(item.value) !== Number(parameters.type),
                                                    }"
                                                />
                                                <span
                                                    class="m-l-4"
                                                    :class="{
                                                        'black-font': Number(item.value) !== Number(parameters.type),
                                                    }"
                                                >
                                                    {{ $t(item.t) }}
                                                </span>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                
            </div>
            <!-- 联系方式 -->
            <div class="contact-information bg-color m-t-16">
                <div class="title">{{ $t('supply-chain.contact') }}</div>
                <div class="information-container-form">
                    <div class="sub-title"></div>
                    <div class="information-form">
                        <!-- 职位 -->
                        <div class="level-search-row">
                            <div class="search-col m-t-0 required align-flex-start">
                                <div 
                                    class="key w-130 t-a-r text-color"
                                    :class="{ 'm-t-4': isEdit }"
                                >
                                    {{ $t('supply-chain.Position') }}
                                </div>
                                <div class="value m-l-8">
                                    <template v-if="!isEdit">
                                        <div class="d-fl" :class="{ 'm-t-4': msgDetail.position?.length }">
                                            <a-checkbox v-for="item in msgDetail.position" :checked="true">
                                                {{
                                                    Core.Const.SUPPLAY.POSITION_MAP[item]?.t
                                                        ? $t(Core.Const.SUPPLAY.POSITION_MAP[item]?.t)
                                                        : "-"
                                                }}
                                            </a-checkbox>
                                            <span v-if="!msgDetail.position?.length" class="custom-not-uploaded">
                                                {{ $t('supply-chain.no_content') }}
                                            </span>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <a-checkbox-group 
                                            v-model:value="parameters.position" 
                                            name="checkboxgroup" 
                                            :options="plainOptions(Core.Const.SUPPLAY.POSITION)"
                                            @change="onPosition"
                                        />
                                    </template>
                                    <a-table
                                        v-if="parameters.contact_info.length"
                                        class="m-t-8"
                                        :columns="contactInformation"
                                        :data-source="parameters.contact_info || []" 
                                        :pagination="false"
                                    >
                                        <template #bodyCell="{ column, text, record, index }">
                                            <!-- 职位身份 -->
                                            <template v-if="column.key === 'position'">
                                                <div class="information-customer-name w-100">
                                                    <span v-if="text !== Core.Const.SUPPLAY.POSITION_MAP_STATUS.GENERAL_MANAGER" class="information-customer-name-required">*</span>
                                                    <span class="m-l-4">
                                                        {{
                                                            Core.Const.SUPPLAY.POSITION_MAP[text]?.t
                                                                ? $t(Core.Const.SUPPLAY.POSITION_MAP[text]?.t)
                                                                : "-"
                                                        }}
                                                    </span>
                                                </div>
                                            </template>
                                            <!-- 姓名 -->
                                            <template v-if="column.key === 'name'">
                                                <a-input
                                                    :class="{ 'customer-input': !isEdit }"
                                                    v-model:value="record.name"
                                                    :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                    :disabled="!isEdit"
                                                />
                                            </template>
                                            <!-- 联系方式 -->
                                            <template v-if="column.key === 'phone'">
                                                <div class="d-fl">
                                                    <a-input
                                                        :class="{ 'customer-input': !isEdit }"
                                                        v-model:value="record.phone"
                                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                        :disabled="!isEdit"
                                                    />
                                                    <a-checkbox 
                                                        class="m-l-8" 
                                                        v-model:checked="record.flag_wechat"
                                                        :disabled="!isEdit"
                                                    >
                                                        {{ $t('supply-chain.wechat_same_number') }}
                                                    </a-checkbox>
                                                </div>
                                            </template>
                                            <!-- 邮箱 -->
                                            <template v-if="column.key === 'email'">
                                                <a-input
                                                    :class="{ 'customer-input': !isEdit }"
                                                    v-model:value="record.email"
                                                    :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                    :disabled="!isEdit"
                                                />
                                            </template>                                            
                                        </template>
                                    </a-table>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            <!-- 基本信息 -->
            <div class="basic-information bg-color m-t-16">
                <div class="title">{{ $t('supply-chain.basic_info') }}</div>
                <!-- 公司概况 -->
                <div class="information-container-form">
                    <div class="sub-title">{{ $t('supply-chain.company_profile') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 公司名称 -->
                            <div class="search-col m-t-0  required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.company_name') }}</div>
                                <div class="value m-l-8">
                                     <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.company_info.name"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                        />
                                </div>
                            </div>
                            <!-- 公司网址 -->
                            <div class="search-col m-t-0">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.company_website') }}</div>
                                <div class="value m-l-8">                                    
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.company_info.website_address"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                        />
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 成立日期 -->
                            <div class="search-col w-50-percentage required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.date_establishment') }}</div>
                                <div class="value m-l-8">
                                    <template v-if="!isEdit">                                
                                        <div class="customer-input">
                                            <span v-if="msgDetail?.company_info?.established_time">
                                                {{ $Util.timeFilter(msgDetail?.company_info?.established_time, 3) }}
                                            </span>
                                            <span v-else class="custom-please-enter">
                                                {{ $t('common.please_enter') }}
                                            </span>  
                                        </div>
                                    </template>
                                    <template v-else>
                                        <a-date-picker
                                            class="w-100"
                                            v-model:value="parameters.company_info.established_time"
                                            @change="(event) => handleTimeSearch(event, 'date_establishment')"
                                        />                                            
                                    </template>
                                </div>
                            </div>
                            <!-- 固定资产 -->
                            <div class="search-col w-50-percentage">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.fixed_assets') }}</div>
                                <div class="value m-l-8">
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.company_info.fixed_assets"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 详细地址 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.detailed_address') }}</div>
                                <div class="value m-l-8">
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.company_info.address"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                        />
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 公司性质 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.nature_of_company') }}</div>
                                <div class="value m-l-8">
                                    <template v-if="!isEdit">
                                        <div class="customer-input">
                                            <span v-if="Core.Const.SUPPLAY.NATURE[msgDetail?.company_info?.nature]?.t">                                            
                                                {{ $t(Core.Const.SUPPLAY.NATURE[msgDetail?.company_info?.nature]?.t) }}
                                            </span>
                                            <span v-else class="custom-please-enter">
                                                {{ $t('supply-chain.no_content') }}
                                            </span>                                            
                                        </div>
                                    </template>
                                    <template v-else>
                                        <a-select 
                                            class="w-100" 
                                            v-model:value="parameters.company_info.nature" 
                                            :placeholder="$t('supply-chain.please_select')"
                                        >
                                            <a-select-option :value="item.value" v-for="item in Core.Const.SUPPLAY.NATURE"> 
                                                {{ $t(item.t) }}
                                            </a-select-option>
                                        </a-select>
                                    </template>
                                </div>
                            </div>
                            <!-- 法人代表 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.legal_representative') }}</div>
                                <div class="value m-l-8">
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.company_info.legal_person"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                        />
                                </div>
                            </div>                            
                        </div>
                        <div class="level-search-row">
                            <!-- 采购半径 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.purchasing_radius') }}</div>
                                <div class="value m-l-8">
                                    <a-input-number
                                        class="w-100 customer-input-number-change"
                                        :class="{ 'customer-input-number': !isEdit }"
                                        v-model:value="parameters.company_info.purchasing_radius"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                        :min="0"
                                        :max="1000000000"
                                    >
                                        <template #addonAfter>
                                            <span class="unit">KM</span>
                                        </template>
                                    </a-input-number>
                                </div>
                            </div>
                            <!-- 占地面积 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.floor_space') }}</div>
                                <div class="value m-l-8">
                                    <a-input-number
                                        class="w-100 customer-input-number-change"
                                        :class="{ 'customer-input-number': !isEdit }"
                                        v-model:value="parameters.company_info.floor_area"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                        :min="0"
                                        :max="1000000000"
                                    >
                                        <template #addonAfter>
                                            <span class="unit">m²</span>
                                        </template>
                                    </a-input-number>
                                </div>
                            </div>                           
                        </div>
                        <div class="level-search-row">
                             <!-- 建筑面积 -->
                             <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.floor_area') }}</div>
                                <div class="value m-l-8">
                                    <a-input-number
                                        class="w-100 customer-input-number-change"
                                        :class="{ 'customer-input-number': !isEdit }"
                                        v-model:value="parameters.company_info.building_area"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')"
                                        :disabled="!isEdit"
                                        :min="0"
                                        :max="1000000000"
                                    >
                                        <template #addonAfter>
                                            <span class="unit">m²</span>
                                        </template>
                                    </a-input-number>
                                </div>
                            </div>
                            
                            <!-- 经营场所 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.establishments') }}</div>
                                <div class="value m-l-8">                                    
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.company_info.premises"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>  
                        </div>
                        <div class="level-search-row">
                            <!-- 母公司名称 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.parent_company_name') }}</div>
                                <div class="value m-l-8">                                    
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.company_info.parent_company_name"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>  
                            <!-- 母公司地址 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.Parent_company_address') }}</div>
                                <div class="value m-l-8">                                   
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.company_info.parent_company_address"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 代理信息 -->
                <div 
                    class="information-container-form m-t-40" 
                    v-if="returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker])"
                    >
                    <div class="sub-title">{{ $t('supply-chain.agent_information') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                             <!-- 被代理公司 -->
                             <div class="search-col m-t-0">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.agent_company') }}</div>
                                <div class="value m-l-8">                                    
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.agent_info.agent_company"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>                             
                            <!-- 被代理地址 -->
                            <div class="search-col m-t-0">
                               <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.proxy_address') }}</div>
                               <div class="value m-l-8">
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.agent_info.agent_address"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                               </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 被代理关系 -->
                            <div class="search-col w-50-percentage">
                               <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.agency_relationship') }}</div>
                               <div class="value m-l-8">
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.agent_info.agent_relationship"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                               </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 代理权证* -->
                            <div class="search-col required">
                               <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.proxy_warrant') }}</div>
                               <div class="value m-l-8">
                                    <template v-if="!isEdit">
                                        <a-radio :checked="true">
                                            {{
                                                Core.Const.SUPPLAY.Legal_Dispute[msgDetail.agent_info?.flag_agent_warrant] ?
                                                $t(Core.Const.SUPPLAY.Legal_Dispute[msgDetail.agent_info?.flag_agent_warrant].t) : ""
                                            }}
                                        </a-radio>
                                    </template>
                                    <template v-else>
                                        <a-radio-group v-model:value="parameters.financial_info.flag_agent_warrant">
                                            <a-radio 
                                                v-for="(item, index) in Core.Const.SUPPLAY.Legal_Dispute"
                                                :key="index"
                                                :value="item.value"
                                            >
                                                {{ $t(item.t) }}
                                            </a-radio>                                           
                                        </a-radio-group>
                                    </template>
                               </div>
                            </div>
                            <!-- 代理有效期间* -->
                            <div class="search-col required">
                               <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.duration_of_agency') }}</div>
                               <div class="value m-l-8">
                                    <template v-if="!isEdit">
                                        <div class="agency-time">
                                            {{
                                                msgDetail?.agent_info?.agent_effective_begin_time
                                                    ? $Util.timeFilter(
                                                        msgDetail?.agent_info?.agent_effective_begin_time,3
                                                    )
                                                    : ""
                                            }}
                                            -
                                            {{
                                                msgDetail?.agent_info?.agent_effective_end_time
                                                    ? $Util.timeFilter(msgDetail?.agent_info?.agent_effective_end_time, 3)
                                                    : ""
                                            }}
                                        </div>
                                    </template>
                                    <template v-else>
                                        <TimeSearch
                                            class="w-100"
                                            ref="TimeDurationOfAgency"
                                            :value="[
                                                parameters.agent_info.agent_effective_begin_time,
                                                parameters.agent_info.agent_effective_end_time
                                            ]"
                                            @search="(event) => handleTimeSearch(event, 'agent_info')"
                                            :defaultTime="false" />
                                    </template>
                               </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 代理产品 -->
                            <div class="search-col w-50-percentage">
                               <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.agent_product') }}</div>
                               <div class="value m-l-8">
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.agent_info.agent_product"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                               </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 人力资源 -->
                <div 
                    class="information-container-form m-t-40" 
                    v-if="!returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker])"
                >
                    <div class="sub-title">{{ $t('supply-chain.human_resources') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 员工总数 -->
                            <div class="search-col m-t-0">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.total_number_of_employees') }}</div>
                                <div class="value m-l-8">                                    
                                    <a-input-number
                                        class="w-100 p-l-0"
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.human_resource.total_employees"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                            <!-- 管理人数 -->
                            <div class="search-col m-t-0">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.number_of_managers') }}</div>
                                <div class="value m-l-8">
                                    <a-input-number
                                        class="w-100 p-l-0"
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.human_resource.manager_number"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 质量人数 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.mass_number') }}</div>
                                <div class="value m-l-8">
                                    <a-input-number
                                        class="w-100 p-l-0"
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.human_resource.mass_number"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                            <!-- 技术人数 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.skilled_personnel') }}</div>
                                <div class="value m-l-8">                                   
                                    <a-input-number
                                        class="w-100 p-l-0"
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.human_resource.technician_number"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 技术工龄 -->
                            <div class="search-col w-50-percentage">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.technical_seniority') }}</div>
                                <div class="value m-l-8">                                    
                                    <a-input-number
                                        class="w-100 p-l-0"
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.human_resource.technical_seniority"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 财务信息 -->
                <div class="information-container-form m-t-40">
                    <div class="sub-title">{{ $t('supply-chain.financial_information') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 法律纠纷 -->
                            <div class="search-col m-t-0 required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.legal_dispute') }}</div>
                                <div class="value m-l-8">
                                    <template v-if="!isEdit">
                                        <a-radio :checked="true">
                                            {{
                                                Core.Const.SUPPLAY.Legal_Dispute[msgDetail.financial_info?.flag_legal_dispute] ?
                                                $t(Core.Const.SUPPLAY.Legal_Dispute[msgDetail.financial_info?.flag_legal_dispute].t) : ""
                                            }}
                                        </a-radio>
                                    </template>
                                    <template v-else>
                                        <a-radio-group v-model:value="parameters.financial_info.flag_legal_dispute">
                                            <a-radio 
                                                v-for="(item, index) in Core.Const.SUPPLAY.Legal_Dispute"
                                                :key="index"
                                                :value="item.value"
                                            >
                                                {{ $t(item.t) }}
                                            </a-radio>                                           
                                        </a-radio-group>
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 操作工人月平均工资 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.average') }}</div>
                                <div class="value m-l-8">                                   
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.financial_info.average_monthly_wage_of_operating_workers"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                            <!-- 管理职员人均年产值 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.per') }}</div>
                                <div class="value m-l-8">                                   
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.financial_info.per_capita_annual_output_value_of_management_staff"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 账期要求 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.period_requirement') }}</div>
                                <div class="value m-l-8">

                                    <template v-if="!isEdit">
                                        <a-radio :checked="true">                                        
                                            <template v-if="Number(msgDetail.financial_info?.account_period_requirement) === 0">                                            
                                                {{ 
                                                    $t(Core.Const.SUPPLAY.ACCOUNt_PERIOD_REQUIREMENT[0].t)
                                                }}
                                            </template>
                                            <template v-else>
                                                {{ 
                                                    Core.Const.SUPPLAY.ACCOUNt_PERIOD_REQUIREMENT[msgDetail.financial_info?.account_period_requirement] ?
                                                    Core.Const.SUPPLAY.ACCOUNt_PERIOD_REQUIREMENT[msgDetail.financial_info?.account_period_requirement].value : "-"
                                                }}
                                                {{ 
                                                    Core.Const.SUPPLAY.ACCOUNt_PERIOD_REQUIREMENT[msgDetail.financial_info?.account_period_requirement] ?
                                                    $t(Core.Const.SUPPLAY.ACCOUNt_PERIOD_REQUIREMENT[msgDetail.financial_info?.account_period_requirement]?.unit) : ""
                                                }}
                                            </template>
                                        </a-radio>
                                    </template>
                                    <template v-else>
                                        <a-radio-group v-model:value="parameters.financial_info.account_period_requirement">
                                            <a-radio 
                                                v-for="(item, index) in Core.Const.SUPPLAY.ACCOUNt_PERIOD_REQUIREMENT_LIST"
                                                :key="index"
                                                :value="item.value"
                                            >
                                                <template v-if="Number(item.value) !== 0">
                                                    {{ item.value }}{{ $t(item.unit) }}
                                                </template>
                                                <template v-else>
                                                    {{ $t(item.t) }}
                                                </template>                                                
                                            </a-radio>                                           
                                        </a-radio-group>
                                    </template>                                    
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 发票类型 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.Invoice_type') }}</div>
                                <div class="value m-l-8">
                                    <template v-if="!isEdit">
                                        <a-radio :checked="true">                                        
                                            <div class="d-fl-a">
                                                <span class="no-white-space m-r-4">
                                                    {{
                                                        Core.Const.SUPPLAY.INVOICE_TYPE[msgDetail.financial_info?.invoice_type] ?
                                                        $t(Core.Const.SUPPLAY.INVOICE_TYPE[msgDetail.financial_info?.invoice_type].t) : "-"
                                                    }}
                                                </span>
                                                <a-input
                                                    class="invoice-range"
                                                    v-model:value="parameters.financial_info.invoice_range_value"
                                                    :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                    :disabled="!isEdit"
                                                />
                                            </div>
                                        </a-radio>
                                    </template>
                                    <template v-else>
                                        <a-radio-group v-model:value="parameters.financial_info.invoice_type">
                                            <a-radio 
                                                v-for="(item, index) in Core.Const.SUPPLAY.INVOICE_TYPE"
                                                :key="index"
                                                :value="item.value"
                                            >
                                                <template v-if="Number(item.value) === 1">
                                                    <div class="d-fl-a">
                                                        <span class="no-white-space m-r-4">
                                                            {{ $t(item.t) }}
                                                        </span>
                                                        <a-input
                                                            v-model:value="parameters.financial_info.invoice_range_value"
                                                            :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                            :disabled="!isEdit"
                                                        />
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    {{ $t(item.t) }}
                                                </template>
                                            </a-radio>                                           
                                        </a-radio-group>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 营业信息 -->
                <div class="information-container-form m-t-40">
                    <div class="sub-title">{{ $t('supply-chain.business_information') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 业务比重 -->
                            <div class="search-col w-50-percentage m-t-0">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.proportion_of_business') }}</div>
                                <div class="value m-l-8">                                    
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.business_info.proportion_of_business"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="proportion-of-list">                            
                            <template v-for="(item, index) in msgDetail.business_info?.list" :key="index">
                                    <div class="proportion-of-item">
                                        <div class="level-search-row">
                                            <div class="search-col">
                                                <div class="key w-130 t-a-r text-color proportion-of-item-title">
                                                    {{ item?.recent_year || "-" }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="level-search-row">
                                            <!-- 销售额 -->
                                            <div 
                                                class="search-col"
                                                :class="{ 'required': !returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part, Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold]) }"
                                            >
                                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.sales_volume') }}</div>
                                                <div class="value m-l-8">
                                                    <a-input-number
                                                        class="w-100 customer-input-number-change"
                                                        :class="{ 'customer-input-number': !isEdit }"
                                                        v-model:value="item.sales"
                                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                        :disabled="!isEdit"
                                                        :min="0"
                                                        :max="1000000000"
                                                    >
                                                        <template #addonAfter>
                                                            <span class="unit">{{ $t('supply-chain.ten_thousand_yuan') }}</span>
                                                        </template>
                                                    </a-input-number>
                                                </div>
                                            </div>
                                        </div>
                                        <template v-if="!returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers])">
                                            <div class="level-search-row">
                                                <!-- 纳税额 -->
                                                <div 
                                                    class="search-col"
                                                    :class="{ 'required': returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker]) }"
                                                >
                                                    <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.tax_amount') }}</div>
                                                    <div class="value m-l-8">
                                                        <a-input-number
                                                            class="w-100 customer-input-number-change"
                                                            :class="{ 'customer-input-number': !isEdit }"
                                                            v-model:value="item.taxes_paid"
                                                            :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                            :disabled="!isEdit"
                                                            :min="0"
                                                            :max="1000000000"
                                                        >
                                                            <template #addonAfter>
                                                                <span class="unit">{{ $t('supply-chain.ten_thousand_yuan') }}</span>
                                                            </template>
                                                        </a-input-number>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="level-search-row">
                                                <!-- 利润率 -->
                                                <div 
                                                    class="search-col"
                                                    :class="{ 'required': returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker]) }"
                                                >
                                                    <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.profit_rate') }}</div>
                                                    <div class="value m-l-8">
                                                        <a-input-number
                                                            class="w-100 customer-input-number-change"
                                                            :class="{ 'customer-input-number': !isEdit }"
                                                            v-model:value="item.profit_margin"
                                                            :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                            :disabled="!isEdit"
                                                            :min="0"
                                                            :max="1000000000"
                                                        >
                                                            <template #addonAfter>
                                                                <span class="unit">%</span>
                                                            </template>
                                                        </a-input-number>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="level-search-row">
                                                <!-- 资产负债率 -->
                                                <div 
                                                    class="search-col"
                                                    :class="{ 'required': returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker]) }"
                                                >
                                                    <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.asset_liability_ratio') }}</div>
                                                    <div class="value m-l-8">
                                                        <a-input-number
                                                            class="w-100 customer-input-number-change"
                                                            :class="{ 'customer-input-number': !isEdit }"
                                                            v-model:value="item.asset_liability_ratio"
                                                            :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                            :disabled="!isEdit"
                                                            :min="0"
                                                            :max="1000000000"
                                                        >
                                                            <template #addonAfter>
                                                                <span class="unit">%</span>
                                                            </template>
                                                        </a-input-number>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="level-search-row">
                                                <!-- 现金流量比率 -->
                                                <div 
                                                    class="search-col"
                                                    :class="{ 'required': returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker]) }"
                                                >
                                                    <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.cash_flow_ratio') }}</div>
                                                    <div class="value m-l-8">
                                                        <a-input-number
                                                            class="w-100 customer-input-number-change"
                                                            :class="{ 'customer-input-number': !isEdit }"
                                                            v-model:value="item.cash_flow_ratio"
                                                            :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                            :disabled="!isEdit"
                                                            :min="0"
                                                            :max="1000000000"
                                                        >
                                                            <template #addonAfter>
                                                                <span class="unit">%</span>
                                                            </template>
                                                        </a-input-number>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                            </template>                           
                        </div>
                    </div>
                </div>
                <!-- 竞争对手 -->
                <div 
                    class="information-container-form m-t-40"
                    v-if="returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part])"
                >
                    <div class="sub-title">{{ $t('supply-chain.competitor') }}</div>
                    <div class="information-form">
                        <!-- 竞争对手信息 -->
                        <div class="level-search-row">
                            <div class="search-col m-t-0 align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.competitor_information') }}</div>
                                <div class="value m-l-8" style="width: 70%">
                                    <a-table
                                        :columns="competitionColumns"
                                        :data-source="parameters.competitor_analysis || []" 
                                        :pagination="false"
                                    >
                                        <template #bodyCell="{ column, text, record, index }">
                                            <template v-if="column.key === 'company_order'">
                                                <div class="information-customer-name">
                                                    {{ $t('supply-chain.competitor') }}{{ index + 1  }}
                                                </div>
                                            </template>
                                            <!-- 公司名称 -->
                                            <template v-if="column.key === 'company_name'">
                                                <a-input
                                                    :class="{ 'customer-input': !isEdit }"
                                                    v-model:value="record.company_name"
                                                    :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                    :disabled="!isEdit"
                                                />
                                            </template>
                                            <!-- 市场份额 -->
                                            <template v-if="column.key === 'market_share'">
                                                <a-input
                                                    :class="{ 'customer-input': !isEdit }"
                                                    v-model:value="record.market_share"
                                                    :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                    :disabled="!isEdit"
                                                />
                                            </template>
                                            <!-- 了解评价 -->
                                            <template v-if="column.key === 'understand_evaluation'">
                                                <a-input
                                                    :class="{ 'customer-input': !isEdit }"
                                                    v-model:value="record.understand_evaluation"
                                                    :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                    :disabled="!isEdit"
                                                />
                                            </template>
                                            <!-- 操作 -->
                                            <template v-if="column.key === 'operations' && isEdit">
                                                <a-button v-if="index !== 0" type="link" @click="onDeleate('competitor_delete', record, index)">
                                                    <i class="icon i_delete" />
                                                    {{ $t("def.delete") }}
                                                </a-button>
                                            </template>
                                        </template>
                                    </a-table>
                                    <a-button
                                        v-if="isEdit"
                                        class="m-t-16"
                                        type="primary"
                                        ghost
                                        @click="onAddBtn('competitor')"
                                    >
                                        {{ $t('supply-chain.add_opponents') }}
                                    </a-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 客户信息 -->
                <div class="information-container-form m-t-40">
                    <div class="sub-title">{{ $t('supply-chain.customer_information') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <div class="search-col m-t-0 align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.major_customer') }}</div>
                                <div class="value m-l-8" style="width: 70%">
                                    <a-table
                                        :columns="customerInfoColumns"
                                        :data-source="parameters.customer_info || []"
                                        :pagination="false"
                                    >
                                        <template #bodyCell="{ column, text, record, index }">                                            
                                            <template v-if="column.key === 'customer_order'">
                                                <div class="information-customer-name m-l-4">
                                                    <span v-if="returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker, Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers])" class="information-customer-name-required">*</span>
                                                    {{ $t('supply-chain.major_customer') }}{{ index + 1  }}
                                                </div>
                                            </template>
                                            <template v-if="column.key === 'customer_name'">
                                                <a-input
                                                    :class="{ 'customer-input': !isEdit }"
                                                    v-model:value="record.customer_name"
                                                    :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                    :disabled="!isEdit"
                                                />                                             
                                            </template>
                                            <template v-if="column.key === 'sales_share'">
                                                <a-input-number
                                                        class="w-100 customer-input-number-change"
                                                        :class="{ 'customer-input-number': !isEdit }"
                                                        v-model:value="record.sales_share"
                                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')"
                                                        :disabled="!isEdit"
                                                        :min="0"
                                                        :max="1000000000"
                                                    >
                                                        <template #addonAfter>
                                                            <span class="unit">%</span>
                                                        </template>
                                                    </a-input-number>
                                            </template>
                                            <template v-if="column.key === 'main_supply_part'">
                                                <a-input
                                                    :class="{ 'customer-input': !isEdit }"
                                                    v-model:value="record.main_supply_part"
                                                    :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                    :disabled="!isEdit"
                                                />  
                                            </template>
                                            <!-- 开始合作时间 -->
                                            <template v-if="column.key === 'begin_cooperation_time'">                                               
                                                <a-date-picker
                                                    class="w-100"
                                                    v-model:value="record.begin_cooperation_time"
                                                    @change="(event) => handleTimeSearch(event, 'begin_cooperation_time')"
                                                    :disabled="!isEdit"
                                                />  
                                            </template>
                                            <!-- 操作 -->
                                            <template v-if="column.key === 'operations' && isEdit">
                                                <a-button v-if="index !== 0" type="link" @click="onDeleate('customer_information_delete', record, index)">
                                                    <i class="icon i_delete" />
                                                    {{ $t("def.delete") }}
                                                </a-button>
                                            </template>
                                        </template>
                                    </a-table>
                                    <a-button
                                        v-if="isEdit"
                                        class="m-t-16"
                                        type="primary"
                                        ghost
                                        @click="onAddBtn('customer_information')"
                                    >
                                        {{ $t('supply-chain.add_customers') }}
                                    </a-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 服务信息 -->
                <div 
                    class="information-container-form m-t-40"
                    v-if="returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker])"
                >
                    <div class="sub-title">{{ $t('supply-chain.service_information') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 技术服务 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">
                                    {{ $t('supply-chain.technical_service') }}
                                </div>
                                <div class="value m-l-8">                                    
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.service_info.technical_services"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                            <!-- 质量服务 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">
                                    {{ $t('supply-chain.quality_service') }}
                                </div>
                                <div class="value m-l-8">
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.service_info.quality_service"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 供应服务 -->
                            <div class="search-col w-50-percentage">
                                <div class="key w-130 t-a-r text-color">
                                    {{ $t('supply-chain.supply_of_services') }}
                                </div>
                                <div class="value m-l-8">
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.service_info.supply_services"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')"
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 技术信息 -->
                <div 
                    class="information-container-form m-t-40"
                    v-if="!returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers])"
                >
                    <div class="sub-title">{{ $t('supply-chain.Technical_information') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 研发中心 -->
                            <div 
                                class="search-col m-t-0 w-50-percentage"
                                v-if="!returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing, Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold])"
                            >
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.research_and_development_center') }}</div>
                                <div class="value m-l-8">                                    
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.technical_info.RD_center"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 相关专利 -->
                            <div class="search-col" :class="{ 'm-t-0': returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing, Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold]) }">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.related_patent') }}</div>
                                <div class="value m-l-8">
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.technical_info.patent"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div 
                            class="level-search-row"
                            v-if="!returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing, Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold])"
                        >
                            <!-- 研发合作机构 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.r_d_partner') }}</div>
                                <div class="value m-l-8">                                    
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.technical_info.RD_partners"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row" v-if="!returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing, Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold])">
                            <!-- 产品设计 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.product_design') }}</div>
                                <div class="value m-l-8 d-fl">                                                                
                                    <template v-if="!isEdit">
                                        <template v-for="(item, index) in msgDetail.technical_info?.product_design" :key="index">                                    
                                            <a-checkbox :checked="true">
                                                {{
                                                    Core.Const.SUPPLAY.TECHNICAL_INFORMATION_OBJECT[item] ?
                                                    $t(Core.Const.SUPPLAY.TECHNICAL_INFORMATION_OBJECT[item].t) : "-"
                                                }}
                                            </a-checkbox>
                                        </template>
                                        <sapn class="custom-not-uploaded" v-if="!msgDetail.technical_info?.product_design?.length">
                                            {{ $t('supply-chain.not_selected') }}
                                        </sapn>
                                    </template>
                                    <template v-else>
                                        <a-checkbox-group 
                                            v-model:value="parameters.technical_info.product_design" 
                                            name="productDesign" 
                                            :options="plainOptions(Core.Const.SUPPLAY.TECHNICAL_INFORMATION_OBJECT)" 
                                        />                                       
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row" v-if="!returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold])">
                            <!-- 过程设计 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.process_design') }}</div>
                                <div class="value m-l-8 d-fl">                                    
                                    <template v-if="!isEdit">
                                        <template v-for="(item, index) in msgDetail.technical_info?.process_design" :key="index">                                    
                                            <a-checkbox :checked="true">
                                                {{
                                                    Core.Const.SUPPLAY.PROCESS_DESIGN_OBJECT[item] ?
                                                    $t(Core.Const.SUPPLAY.PROCESS_DESIGN_OBJECT[item].t) : "-"
                                                }}
                                            </a-checkbox>
                                        </template>
                                        <sapn class="custom-not-uploaded" v-if="!msgDetail.technical_info?.process_design?.length">
                                            {{ $t('supply-chain.not_selected') }}
                                        </sapn>
                                    </template>
                                    <template v-else>
                                        <a-checkbox-group 
                                            v-model:value="parameters.technical_info.process_design" 
                                            name="productDesign" 
                                            :options="plainOptions(Core.Const.SUPPLAY.PROCESS_DESIGN_OBJECT)" 
                                        />                                          
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row" v-if="!returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold])">
                            <!-- 过程验证 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.process_verification') }}</div>
                                <div class="value m-l-8 d-fl">                                   
                                    <template v-if="!isEdit">
                                        <template v-for="(item, index) in msgDetail.technical_info?.process_validation" :key="index">                                    
                                            <a-checkbox :checked="true">
                                                {{
                                                    Core.Const.SUPPLAY.PROCESS_VALIDATION_OBJECT[item] ?
                                                    $t(Core.Const.SUPPLAY.PROCESS_VALIDATION_OBJECT[item].t) : "-"
                                                }}
                                            </a-checkbox>
                                        </template>
                                        <sapn class="custom-not-uploaded" v-if="!msgDetail.technical_info?.process_validation?.length">
                                            {{ $t('supply-chain.not_selected') }}
                                        </sapn>
                                    </template>
                                    <template v-else>
                                        <a-checkbox-group 
                                            v-model:value="parameters.technical_info.process_validation" 
                                            name="productDesign" 
                                            :options="plainOptions(Core.Const.SUPPLAY.PROCESS_VALIDATION_OBJECT)" 
                                        />
                                    </template>
                                </div>
                            </div>
                        </div>
                        <template v-if="returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold])">
                            <!-- 设计规范 -->
                            <div class="level-search-row">
                                <div class="search-col">
                                    <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.design_specifications') }}</div>
                                    <div class="value m-l-8">                                   
                                        <a-input
                                            :class="{ 'customer-input': !isEdit }"
                                            v-model:value="parameters.technical_info.design_software"
                                            :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                            :disabled="!isEdit"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="level-search-row">
                                <!-- 模具轮廓 -->
                                <div class="search-col">
                                    <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.mold_profile') }}</div>
                                    <div class="value m-l-8">                                   
                                        <a-input
                                            :class="{ 'customer-input': !isEdit }"
                                            v-model:value="parameters.technical_info.mold_profile"
                                            :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                            :disabled="!isEdit"
                                        />
                                    </div>
                                </div>
                                <!-- 模具重量 -->
                                <div class="search-col">
                                    <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.mold_weight') }}</div>
                                    <div class="value m-l-8">
                                        <a-input-number
                                            class="w-100 customer-input-number-change"
                                            :class="{ 'customer-input-number': !isEdit }"
                                            v-model:value="parameters.technical_info.mold_weight"
                                            :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                            :disabled="!isEdit"
                                            :min="0"
                                            :max="1000000000"
                                        >
                                            <template #addonAfter>
                                                <span class="unit">KG</span>
                                            </template>
                                        </a-input-number>
                                    </div>
                                </div>
                            </div>
                            <div class="level-search-row">
                                <!-- 模具品类 -->
                                <div class="search-col">
                                    <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.mold_category') }}</div>
                                    <div class="value m-l-8">                                   
                                        <a-input
                                            :class="{ 'customer-input': !isEdit }"
                                            v-model:value="parameters.technical_info.mold_category"
                                            :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                            :disabled="!isEdit"
                                        />
                                    </div>
                                </div>
                                <!-- 模具设计 -->
                                <div class="search-col">
                                    <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.mould_design') }}</div>
                                    <div class="value m-l-8">                                   
                                        <a-input
                                            :class="{ 'customer-input': !isEdit }"
                                            v-model:value="parameters.technical_info.mold_design"
                                            :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                            :disabled="!isEdit"
                                        />
                                    </div>
                                </div>
                            </div>
                            <!-- 模具制造 -->
                            <div class="level-search-row">
                                <div class="search-col">
                                    <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.mold_manufacturing') }}</div>
                                    <div class="value m-l-8">                                   
                                        <a-input
                                            :class="{ 'customer-input': !isEdit }"
                                            v-model:value="parameters.technical_info.mold_manufacture"
                                            :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                            :disabled="!isEdit"
                                        />
                                    </div>
                                </div>
                                <!-- 模具验收 -->
                                <div class="search-col">
                                    <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.mold_acceptance') }}</div>
                                    <div class="value m-l-8">                                   
                                        <a-input
                                            :class="{ 'customer-input': !isEdit }"
                                            v-model:value="parameters.technical_info.mold_acceptance"
                                            :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                            :disabled="!isEdit"
                                        />
                                    </div>
                                </div>
                            </div>
                        </template>
                        <div class="level-search-row">
                            <!-- 设计软件 -->
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.design_software') }}</div>
                                <div class="value m-l-8">                                   
                                    <a-textarea
                                        :class="{ 'customer-input': !isEdit, 'h-64': true }"
                                        v-model:value="parameters.technical_info.design_software"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 开发流程 -->
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.development_process') }}</div>
                                <div class="value m-l-8">
                                    <a-textarea
                                        :class="{ 'customer-input': !isEdit, 'h-64': true }"
                                        v-model:value="parameters.technical_info.dev_process"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 质量信息 -->
                <div 
                    class="information-container-form m-t-40"
                    v-if="!returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold])"
                >
                    <div class="sub-title">{{ $t('supply-chain.quality_information') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 质量体系认证 -->
                            <div class="search-col m-t-0">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.quality_system_certification') }}</div>
                                <div class="value m-l-8">
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.quality_info.certification"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                            <!-- 环境体系认证 -->
                            <div class="search-col m-t-0">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.environmental_system_certification') }}</div>
                                <div class="value m-l-8">                                    
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.quality_info.env_certification"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 质量合作机构 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.quality_cooperation_agency') }}</div>
                                <div class="value m-l-8">                                    
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.quality_info.partners"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                            <!-- 认可实验室 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.accredited_laboratory') }}</div>
                                <div class="value m-l-8">                                    
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.quality_info.accredited_laboratory"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 质控工具软件 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.quality_control_tool_software') }}</div>
                                <div class="value m-l-8">                                    
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.quality_info.tool_software"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                            <!-- 计划体系认证 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.planning_system_certification') }}</div>
                                <div class="value m-l-8">
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.quality_info.system_certification"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 市场PPM -->
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.market_PPM') }}</div>
                                <div class="value m-l-8">
                                    <a-textarea
                                        :class="{ 'customer-input': !isEdit, 'h-64': true }"
                                        v-model:value="parameters.quality_info.PPM"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 指定信息 -->
                <div 
                    class="information-container-form m-t-40"
                    v-if="returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers])"
                >
                    <div class="sub-title">{{ $t('supply-chain.specify_information') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 指定协议* -->
                            <div class="search-col m-t-0 required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.specified_protocol') }}</div>
                                <div class="value m-l-8">                                    
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.specify_info.protocol"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                            <!-- 指定零件* -->
                            <div class="search-col m-t-0 required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.specify_part') }}</div>
                                <div class="value m-l-8">
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.specify_info.parts"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 指定服务* -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.specify_service') }}</div>
                                <div class="value m-l-8">
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.specify_info.service"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>                          
                        </div>
                        <div class="level-search-row">
                            <!-- 指定理由* -->
                            <div class="search-col align-flex-start required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.specify_reason') }}</div>
                                <div class="value m-l-8">                                    
                                    <a-textarea
                                        :class="{ 'customer-input': !isEdit, 'h-64': true }"
                                        v-model:value="parameters.specify_info.reason"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 产能产线 -->
                <div 
                    class="information-container-form m-t-40"
                    v-if="returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing])"
                >
                    <div class="sub-title">{{ $t('supply-chain.capacity_line') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 关键自有工序 -->
                            <div 
                                class="search-col m-t-0 align-flex-start"
                                :class="{ 'required': returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing]) }"
                            >
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.key_owned_process') }}</div>
                                <div class="value m-l-8">                                    
                                    <a-textarea
                                        :class="{ 'customer-input': !isEdit, 'h-64': true }"
                                        v-model:value="parameters.produce_capacity.processes"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 智能自动化线 -->
                            <div 
                                class="search-col align-flex-start"
                                :class="{ 'required': returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing]) }"
                            >
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.intelligent_automation_line') }}</div>
                                <div class="value m-l-8">                                    
                                    <a-textarea
                                        :class="{ 'customer-input': !isEdit, 'h-64': true }"
                                        v-model:value="parameters.produce_capacity.automation_line"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 生产产能负荷 -->
                            <div 
                                class="search-col align-flex-start"
                                :class="{ 'required': returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing]) }"
                            >
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.production_capacity_load') }}</div>
                                <div class="value m-l-8">
                                    <a-textarea
                                        :class="{ 'customer-input': !isEdit, 'h-64': true }"
                                        v-model:value="parameters.produce_capacity.load"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 外购管理 -->
                <div 
                    class="information-container-form m-t-40"
                    v-if="returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing])"
                >
                    <div class="sub-title">{{ $t('supply-chain.qutsourcing_management') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 外购工艺 -->
                            <div class="search-col m-t-0 align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.qutsourced_technology') }}</div>
                                <div class="value m-l-8">                                    
                                    <a-textarea
                                        :class="{ 'customer-input': !isEdit, 'h-64': true }"
                                        v-model:value="parameters.outsourcing.technology"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 外购备件 -->
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.qutsourced_spare_parts') }}</div>
                                <div class="value m-l-8">                                    
                                    <a-textarea
                                        :class="{ 'customer-input': !isEdit, 'h-64': true }"
                                        v-model:value="parameters.outsourcing.parts"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 外购原料 -->
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.purchased_raw_materials') }}</div>
                                <div class="value m-l-8">
                                    <a-textarea
                                        :class="{ 'customer-input': !isEdit, 'h-64': true }"
                                        v-model:value="parameters.outsourcing.material"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 外购制度 -->
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.qutsourcing_system') }}</div>
                                <div class="value m-l-8">
                                    <a-textarea
                                        :class="{ 'customer-input': !isEdit, 'h-64': true }"
                                        v-model:value="parameters.outsourcing.system"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 设备信息 -->
            <div 
                class="equipment-information bg-color m-t-16"
                v-if="!returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker])"
            >
                <div class="title">{{ $t('supply-chain.device_information') }}</div>
                <!-- 关键生产设备 -->
                <div class="information-container-form">
                    <div 
                        class="sub-title"
                        :class="{ 'sub-title-required': returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing, Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold]) }"
                    >
                        {{ $t('supply-chain.key_production_equipment') }}
                    </div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <div class="search-col m-t-0">
                                <div class="key w-130 t-a-r text-color"></div>
                                <div class="value m-l-8">
                                    <a-table
                                        :columns="deviceProductionColumns"
                                        :data-source="parameters.production_equipment || []"
                                        :pagination="false"
                                    >
                                        <template #bodyCell="{ column, text, record, index }">                                            
                                            <template v-if="column.key === 'name'">
                                                <a-input
                                                    :class="{ 'customer-input': !isEdit }"
                                                    v-model:value="record.name"
                                                    :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                    :disabled="!isEdit"
                                                />   
                                            </template>
                                            <template v-if="column.key === 'spec'">
                                                <a-input
                                                    :class="{ 'customer-input': !isEdit }"
                                                    v-model:value="record.spec"
                                                    :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                    :disabled="!isEdit"
                                                />  
                                            </template>
                                            <template v-if="column.key === 'quantity'">
                                                <a-input
                                                    :class="{ 'customer-input': !isEdit }"
                                                    v-model:value="record.quantity"
                                                    :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                    :disabled="!isEdit"
                                                />  
                                            </template>
                                            <template v-if="column.key === 'manufacturer'">
                                                <a-input
                                                    :class="{ 'customer-input': !isEdit }"
                                                    v-model:value="record.manufacturer"
                                                    :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                    :disabled="!isEdit"
                                                />  
                                            </template>
                                            <template v-if="column.key === 'purchase_period'">
                                                <a-input
                                                    :class="{ 'customer-input': !isEdit }"
                                                    v-model:value="record.purchase_period"
                                                    :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                    :disabled="!isEdit"
                                                />  
                                            </template>
                                            <!-- 操作 -->
                                            <template v-if="column.key === 'operations' && isEdit">
                                                <a-button v-if="index !== 0" type="link" @click="onDeleate('key_production_equipment', record, index)">
                                                    <i class="icon i_delete" />
                                                    {{ $t("def.delete") }}
                                                </a-button>
                                            </template>
                                        </template>
                                    </a-table>
                                    <a-button
                                        v-if="isEdit"
                                        class="m-t-16"
                                        type="primary"
                                        ghost
                                        @click="onAddBtn('key_production_equipment')"
                                    >
                                        {{ $t('supply-chain.add_production_equipment') }}
                                    </a-button>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>
                <!-- 关键检测设备 -->
                <div class="information-container-form m-t-40">
                    <div 
                        class="sub-title"
                        :class="{ 'sub-title-required': returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold]) }"
                    >
                        {{ $t('supply-chain.critical_detection_equipment') }}
                    </div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <div class="search-col m-t-0">
                                <div class="key w-130 t-a-r text-color"></div>
                                <div class="value m-l-8">
                                    <a-table
                                        :columns="deviceDetectionColumns"
                                        :data-source="parameters.detection_equipment || []"
                                        :pagination="false"
                                    >
                                        <template #bodyCell="{ column, text, record, index }">                                            
                                            <template v-if="column.key === 'name'">
                                                <a-input
                                                    :class="{ 'customer-input': !isEdit }"
                                                    v-model:value="record.name"
                                                    :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                    :disabled="!isEdit"
                                                />                                               
                                            </template>
                                            <template v-if="column.key === 'spec'">
                                                <a-input
                                                    :class="{ 'customer-input': !isEdit }"
                                                    v-model:value="record.spec"
                                                    :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                                    :disabled="!isEdit"
                                                />                                               
                                            </template>
                                            <template v-if="column.key === 'quantity'">
                                                <a-input
                                                    :class="{ 'customer-input': !isEdit }"
                                                    v-model:value="record.quantity"
                                                    :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')"
                                                    :disabled="!isEdit"
                                                /> 
                                            </template>
                                            <template v-if="column.key === 'manufacturer'">
                                                <a-input
                                                    :class="{ 'customer-input': !isEdit }"
                                                    v-model:value="record.manufacturer"
                                                    :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')"
                                                    :disabled="!isEdit"
                                                /> 
                                            </template>
                                            <template v-if="column.key === 'accuracy_level'">
                                                <a-input
                                                    :class="{ 'customer-input': !isEdit }"
                                                    v-model:value="record.accuracy_level"
                                                    :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')"
                                                    :disabled="!isEdit"
                                                /> 
                                            </template>
                                            <!-- 操作 -->
                                            <template v-if="column.key === 'operations' && isEdit">
                                                <a-button v-if="index !== 0" type="link" @click="onDeleate('critical_detection_equipment', record, index)">
                                                    <i class="icon i_delete" />
                                                    {{ $t("def.delete") }}
                                                </a-button>
                                            </template>
                                        </template>
                                    </a-table>
                                    <a-button
                                        v-if="isEdit"
                                        class="m-t-16"
                                        type="primary"
                                        ghost
                                        @click="onAddBtn('critical_detection_equipment')"
                                    >
                                        {{ $t('supply-chain.add_detection_equipment') }}
                                    </a-button>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
            <!-- 补充信息 -->
            <div class="supplementary-information bg-color m-t-16">
                <div class="title">{{ $t('supply-chain.supplementary_information') }}</div>
                <div class="information-container-form">
                    <div class="sub-title"></div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 其他优势说明 -->
                            <div class="search-col m-t-0 align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.other_advantages_description') }}</div>
                                <div class="value m-l-8">                                  
                                    <a-textarea
                                        :class="{ 'customer-input': !isEdit, 'h-64': true }"
                                        v-model:value="parameters.additional_info"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')"
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 材料清单 -->
        <div class="materials-message m-t-30">
            <div class="msg-header">
                <span class="m-l-4">{{ $t('supply-chain.material_list') }}</span>
            </div>
            <!-- 基本信息 -->
            <div class="materials-basic-information bg-color m-t-16">
                <div class="title">{{ $t('supply-chain.basic_info') }}</div>
                <div class="information-container-form">
                    <div class="sub-title">{{ $t('supply-chain.business_license_photos') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 营业执照照片 -->
                            <div class="search-col m-t-0 align-flex-start required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.business_license_photos') }}</div>
                                <div class="value m-l-8">
                                    <template v-if="!isEdit">
                                        <template
                                            v-for="(item, index) in msgDetail.confirmatory_material?.business_license_photo"
                                            :key="index"
                                        >
                                            <img
                                                class="materials-img"
                                                :class="{ 'm-l-16': index > 0 }"
                                                :src="Core.Const.NET.FILE_URL_PREFIX + item"
                                                @click="handlePreview(Core.Const.NET.FILE_URL_PREFIX + item)"
                                                alt=""
                                            />
                                        </template>
                                        <sapn class="custom-not-uploaded" v-if="!msgDetail.confirmatory_material?.business_license_photo?.length">
                                            {{ $t('supply-chain.not_uploaded') }}
                                        </sapn>
                                    </template>
                                    <template v-else>
                                        <MyUpload
                                            name="business_license_photo"
                                            :tip="$t('supply-chain.upload_photos')"
                                            v-model:value="parameters.confirmatory_material.business_license_photo"
                                            showTip
                                            :limit="1"
                                            :limitSize="2"
                                            tipPosition="right"
                                        />
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 注册资本 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.registered_capital') }}</div>
                                <div class="value m-l-8">
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.confirmatory_material.registered_capital"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>                            
                        </div>
                        <div class="level-search-row">
                            <!-- 营业期限 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.business_term') }}</div>
                                <div class="value m-l-8" style="display: flex; align-items: center">
                                    <template v-if="!isEdit">
                                        <a-radio :checked="true">                                         
                                            {{
                                                Core.Const.SUPPLAY.BUSINESS_TERM[msgDetail.confirmatory_material?.business_duration_type] ?
                                                $t(Core.Const.SUPPLAY.BUSINESS_TERM[msgDetail.confirmatory_material?.business_duration_type].t) : "-"
                                            }}
                                        </a-radio>
                                        <div 
                                            class="bussiness-time" 
                                            v-if="Number(msgDetail.confirmatory_material?.business_duration_type) === Core.Const.SUPPLAY.BUSINESS_TERM_MAP.short_term_validity">
                                            {{
                                                msgDetail?.confirmatory_material?.begin_business_time
                                                    ? $Util.timeFilter(
                                                          msgDetail?.confirmatory_material?.begin_business_time, 3
                                                      )
                                                    : ""
                                            }}
                                            -
                                            {{
                                                msgDetail?.confirmatory_material?.end_business_time
                                                    ? $Util.timeFilter(msgDetail?.confirmatory_material?.end_business_time, 3)
                                                    : ""
                                            }}
                                        </div>
                                    </template>
                                    <template v-else>
                                        <a-radio-group v-model:value="parameters.confirmatory_material.business_duration_type">
                                            <a-radio 
                                                v-for="(item, index) in Core.Const.SUPPLAY.BUSINESS_TERM"
                                                :key="index"
                                                :value="item.value"
                                            >                                               
                                                {{ $t(item.t) }}
                                                <template v-if="Number(item.value) === 2">
                                                    <TimeSearch
                                                        class="m-l-4"
                                                        v-if="Number(parameters.confirmatory_material.business_duration_type) === 2"
                                                        :value="[
                                                            parameters.confirmatory_material.begin_business_time,
                                                            parameters.confirmatory_material.end_business_time
                                                        ]"
                                                        ref="TimeBusinessTerm"
                                                        @search="(event) => handleTimeSearch(event, 'business_term')"
                                                        :defaultTime="false"
                                                    />
                                                </template>
                                            </a-radio>                                           
                                        </a-radio-group>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="information-container-form m-t-40">
                    <!-- 银行开票资料 -->
                    <div class="sub-title">{{ $t('supply-chain.bank_billing_information') }}</div>
                    <div class="information-form">
                        <!-- 开户名 -->
                        <div class="level-search-row">
                            <div class="search-col m-t-0 required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.account_name') }}</div>
                                <div class="value m-l-8">
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.confirmatory_material.account_name"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                            <!-- 开户行 -->
                            <div class="search-col m-t-0 required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.bank_of_deposit') }}</div>
                                <div class="value m-l-8">
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.confirmatory_material.account_with_bank"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 开户行号 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.bank_number') }}</div>
                                <div class="value m-l-8">
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.confirmatory_material.account_with_bank_number"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                            <!-- 银行账号 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.bank_account') }}</div>
                                <div class="value m-l-8">
                                    <a-input
                                        :class="{ 'customer-input': !isEdit }"
                                        v-model:value="parameters.confirmatory_material.bank_account"
                                        :placeholder="isEdit ? $t('common.please_enter') : $t('supply-chain.no_content')" 
                                        :disabled="!isEdit"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="information-container-form m-t-40">
                    <div class="sub-title">{{ $t('supply-chain.quality_system_certificate') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 质量体系证书 -->
                            <div class="search-col m-t-0 align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.quality_system_certificate') }}</div>
                                <div class="value m-l-8">                                   
                                    <template v-if="!isEdit">
                                        <template
                                            v-for="(item, index) in msgDetail.confirmatory_material?.quality_system_certificate"
                                            :key="index"
                                        >
                                            <img
                                                class="materials-img"
                                                :class="{ 'm-l-16': index > 0 }"
                                                :src="Core.Const.NET.FILE_URL_PREFIX + item"
                                                @click="handlePreview(Core.Const.NET.FILE_URL_PREFIX + item)"
                                                alt=""
                                            />
                                        </template>
                                        <sapn class="custom-not-uploaded" v-if="!msgDetail.confirmatory_material?.quality_system_certificate?.length">
                                            {{ $t('supply-chain.not_uploaded') }}
                                        </sapn>
                                    </template>
                                    <template v-else>
                                        <MyUpload
                                            name="quality_system_certificate"
                                            :tip="$t('supply-chain.please_upload')"
                                            v-model:value="parameters.confirmatory_material.quality_system_certificate"
                                            showTip
                                            :limit="9"
                                            :limitSize="2"
                                            tipPosition="bottom" />
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div 
                            class="level-search-row"
                            v-if="returnTypeBool(parameters.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker])"
                        >
                            <!-- 代理证书 -->
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.proxy_certificate') }}</div>
                                <div class="value m-l-8">                                   
                                    <template v-if="!isEdit">
                                        <template
                                            v-for="(item, index) in msgDetail.confirmatory_material?.proxy_certificate"
                                            :key="index"
                                        >
                                            <img
                                                class="materials-img"
                                                :class="{ 'm-l-16': index > 0 }"
                                                :src="Core.Const.NET.FILE_URL_PREFIX + item"
                                                @click="handlePreview(Core.Const.NET.FILE_URL_PREFIX + item)"
                                                alt=""
                                            />
                                        </template>
                                        <sapn v-if="!msgDetail.confirmatory_material?.proxy_certificate?.length">
                                            {{ $t('supply-chain.not_uploaded') }}
                                        </sapn>
                                    </template>
                                    <template v-else>
                                        <MyUpload
                                            name="proxy_certificate"
                                            :tip="$t('supply-chain.please_upload')"
                                            v-model:value="parameters.confirmatory_material.proxy_certificate"
                                            showTip
                                            :limit="9"
                                            :limitSize="2"
                                            tipPosition="bottom" />
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 其他证实性材料 -->
            <div class="other-materials bg-color m-t-16">
                <div class="title">{{ $t('supply-chain.other_proving_materials') }}</div>
                <div class="information-container-form">
                    <div class="sub-title"></div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 开户行许可证 -->
                            <div class="search-col m-t-0 align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.bank_account_license') }}</div>
                                <div class="value m-l-8">                                    
                                    <template v-if="!isEdit">
                                        <template
                                            v-for="(item, index) in msgDetail.confirmatory_material?.account_opening_bank_license"
                                            :key="index"
                                        >
                                            <img
                                                class="materials-img"
                                                :class="{ 'm-l-16': index > 0 }"
                                                :src="Core.Const.NET.FILE_URL_PREFIX + item"
                                                @click="handlePreview(Core.Const.NET.FILE_URL_PREFIX + item)"
                                                alt=""
                                            />
                                        </template>
                                        <sapn class="custom-not-uploaded" v-if="!msgDetail.confirmatory_material?.account_opening_bank_license?.length">
                                            {{ $t('supply-chain.not_uploaded') }}
                                        </sapn>
                                    </template>
                                    <template v-else>
                                        <MyUpload
                                            name="account_opening_bank_license"
                                            :tip="$t('supply-chain.please_upload')"
                                            v-model:value="parameters.confirmatory_material.account_opening_bank_license"
                                            showTip
                                            :limit="9"
                                            :limitSize="2"
                                            tipPosition="bottom" />
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 环评证书 -->
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.environmental_assessment_certificate') }}</div>
                                <div class="value m-l-8">                                    
                                    <template v-if="!isEdit">
                                        <template
                                            v-for="(item, index) in msgDetail.confirmatory_material?.eia_certificate"
                                            :key="index"
                                        >
                                            <img
                                                class="materials-img"
                                                :class="{ 'm-l-16': index > 0 }"
                                                :src="Core.Const.NET.FILE_URL_PREFIX + item"
                                                @click="handlePreview(Core.Const.NET.FILE_URL_PREFIX + item)"
                                                alt=""
                                            />
                                        </template>
                                        <sapn class="custom-not-uploaded" v-if="!msgDetail.confirmatory_material?.eia_certificate?.length">
                                            {{ $t('supply-chain.not_uploaded') }}
                                        </sapn>
                                    </template>
                                    <template v-else>
                                        <MyUpload
                                            name="eia_certificate"
                                            :tip="$t('supply-chain.please_upload')"
                                            v-model:value="parameters.confirmatory_material.eia_certificate"
                                            showTip
                                            :limit="9"
                                            :limitSize="2"
                                            tipPosition="bottom" />
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 环保报告 -->
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.environmental_protection_report') }}</div>
                                <div class="value m-l-8">                                    
                                    <template v-if="!isEdit">
                                        <template
                                            v-for="(item, index) in msgDetail.confirmatory_material?.environmental_report"
                                            :key="index"
                                        >
                                            <img
                                                class="materials-img"
                                                :class="{ 'm-l-16': index > 0 }"
                                                :src="Core.Const.NET.FILE_URL_PREFIX + item"
                                                @click="handlePreview(Core.Const.NET.FILE_URL_PREFIX + item)"
                                                alt=""
                                            />
                                        </template>
                                        <sapn class="custom-not-uploaded" v-if="!msgDetail.confirmatory_material?.environmental_report?.length">
                                            {{ $t('supply-chain.not_uploaded') }}
                                        </sapn>
                                    </template>
                                    <template v-else>
                                        <MyUpload
                                            name="environmental_report"
                                            :tip="$t('supply-chain.please_upload')"
                                            v-model:value="parameters.confirmatory_material.environmental_report"
                                            showTip
                                            :limit="9"
                                            :limitSize="2"
                                            tipPosition="bottom" />
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <a-modal width="800px" :visible="previewVisible" title="" :footer="null" @cancel="handleCancel">
            <img alt="" style="width: 100%" :src="previewImage" />
        </a-modal>

        <div class="suction-bottom">
            <template v-if="!isEdit">            
                <a-button @click="onSuction('edit')">{{ $t('supply-chain.editing_data') }}</a-button>
            </template>
            <template v-else>
                <a-button @click="onSuction('cancel-edit')">{{ $t('supply-chain.cancel_editing') }}</a-button>
                <a-button type="primary" @click="onSuction('add')">{{ $t('supply-chain.submit_materials') }}</a-button>
            </template>
        </div>


        <MyMask :isClose="isClose" @close="onPingPongMaskClose">
            <div class="mask-center">
                <div class="title">{{ $t('supply-chain.mask_tips1') }}</div>
                <div class="sub-title">{{ $t('supply-chain.mask_tips2') }}</div>
                <div class="line"></div>
                <div class="btn">
                    <a-button @click="onSuction('continue_fill')">{{ $t('supply-chain.continue_fill') }}</a-button>
                    <a-button type="primary" @click="onSuction('submit_exit')">{{ $t('supply-chain.submit_exit') }}</a-button>
                </div>
            </div>
        </MyMask>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import Core from "@/core";
import MySvgIcon from "@/components/MySvgIcon/index.vue";
import TimeSearch from "@/components/common/TimeSearch.vue";
import MyMask from "@/components/horwin/based-on-dom/MyMask.vue";
import MyUpload from "@/components/MyUpload/index.vue";
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();
const msgDetail = ref({});
const { proxy } = getCurrentInstance()

// 预览显影
const previewVisible = ref(false)
const previewImage = ref("")

// 联系方式
const contactInformation = computed(() => {
    let columns = [
        { title: proxy.$t('supply-chain.position_identity'), dataIndex: "position", key: "position" },
        { title: proxy.$t('supply-chain.name'), dataIndex: "name", key: "name" },
        { title: proxy.$t('supply-chain.contact'), dataIndex: "phone", key: "phone" },
        { title: proxy.$t('supply-chain.mailbox'), dataIndex: "email", key: "email" },        
    ];

    return columns;
});

// 关键生产设备
const deviceProductionColumns = computed(() => {
    let columns = [
        { title: proxy.$t('supply-chain.Name_of_production_equipment'), dataIndex: "name", key: "name" },
        { title: proxy.$t('supply-chain.Specification_and_model'), dataIndex: "spec", key: "spec" },
        { title: proxy.$t('supply-chain.quantity'), dataIndex: "quantity", key: "quantity" },
        { title: proxy.$t('supply-chain.Equipment_manufacturer'), dataIndex: "manufacturer", key: "manufacturer" },
        { title: proxy.$t('supply-chain.Purchase_period'), dataIndex: "purchase_period", key: "purchase_period" },
    ];

    if (isEdit) {
        columns.push(
            { title: proxy.$t('common.operations'),  key: "operations" },
        )
    }

    return columns;
});
// 关键检测设备
const deviceDetectionColumns = computed(() => {
    let columns = [
        { title: proxy.$t('supply-chain.Name_of_production_equipment'), dataIndex: "name", key: "name" },
        { title: proxy.$t('supply-chain.Specification_and_model'), dataIndex: "spec", key: "spec" },
        { title: proxy.$t('supply-chain.quantity'), dataIndex: "quantity", key: "quantity" },
        { title: proxy.$t('supply-chain.Equipment_manufacturer'), dataIndex: "manufacturer", key: "manufacturer" },
        { title: proxy.$t('supply-chain.precision_grade'), dataIndex: "accuracy_level", key: "accuracy_level" },
    ];

    if (isEdit) {
        columns.push(
            { title: proxy.$t('common.operations'),  key: "operations" },
        )
    }

    return columns;
});
// 竞争对手信息
const competitionColumns = computed(() => {
    let columns = [
        { title: proxy.$t('supply-chain.serial_number'), dataIndex: "company_order", key: "company_order" },
        { title: proxy.$t('supply-chain.company_name'), dataIndex: "company_name", key: "company_name" },
        { title: proxy.$t('supply-chain.market_share'), dataIndex: "market_share", key: "market_share" },
        { title: proxy.$t('supply-chain.understanding_evaluation'), dataIndex: "understand_evaluation", key: "understand_evaluation" },
        
    ];

    if (isEdit) {
        columns.push(
            { title: proxy.$t('common.operations'),  key: "operations" },
        )
    }
    return columns;
});
// 客户信息
const customerInfoColumns = computed(() => {
    let columns = [
        { title: proxy.$t('supply-chain.customer_serial_number'), dataIndex: "customer_order", key: "customer_order" },
        { title: proxy.$t('supply-chain.customer_name'), dataIndex: "customer_name", key: "customer_name" },
        { title: proxy.$t('supply-chain.Sales_share'), dataIndex: "sales_share", key: "sales_share" },
        { title: proxy.$t('supply-chain.Main_supply_part'), dataIndex: "main_supply_part", key: "main_supply_part" },
        { title: proxy.$t('supply-chain.Start_time'), dataIndex: "begin_cooperation_time", key: "begin_cooperation_time" },       
    ];

    if (isEdit) {
        columns.push(
            { title: proxy.$t('common.operations'),  key: "operations" },
        )
    }

    return columns;
});

const TimeBusinessTerm = ref(null) // 营业期限
const TimeDurationOfAgency = ref(null) // 代理有效期间
const isClose = ref(false) // MyMask 显影
const isEdit = ref(route.query?.flag_edit)
const parameters = ref({
    type: "",
    // 联系方式
    contact_info: [
        // {
        //     "position": "职务：1.销售；2.质量；3.技术；4.总经理",
        //     "name": "姓名",
        //     "email": "邮箱",
        //     "phone": "手机号",
        //     "flag_wechat": "是否同微信号"
        // }
    ],
    // 公司概况
    company_info: {
        name: "", // 名称
		website_address: "", // 网址
		address: "", // 详细地址
		established_time: "", // 成立时间
		registered_capital: "", // 注册资本
		fixed_assets: "", // 固定资产
		nature: "", // 性质
		legal_person: "", // 法人代表
		purchasing_radius: "", // 采购半径Km
		floor_area: "", // 占地面积m2
		building_area: "", // 建筑面积m2
		premises: "", // 经营场所
		parent_company_name: "", // 母公司名称
		parent_company_address: "", // 母公司地址
    },
    // 代理信息
    agent_info: {
		agent_company: "", // 被代理公司
		agent_address: "", // 被代理地址
		agent_relationship: "", // 被代理关系
		flag_agent_warrant: "", // 是否有代理权证
		agent_effective_begin_time: "", // 代理有效开始时间
		agent_effective_end_time: "", // 代理有效结束时间
		agent_product: "", // 代理产品
	},
    // 人力资源
    human_resource: {
		total_employees: "", // 员工总数
		manager_number: "", // 管理人数
		mass_number: "", // 质量人数
		technician_number: "", // 技术人数
		technical_seniority: "", // 技术工龄
    },
    // 财务信息
    financial_info: {
		flag_legal_dispute: "", // 是否有法律纠纷
		average_monthly_wage_of_operating_workers: "", // 操作工人 月平均工资
		per_capita_annual_output_value_of_management_staff: "", // 管理职员 人均年产值
		account_period_requirement: "", // 账期要求
		invoice_type: "", // 发票类型
		invoice_range_value: "", // 发票范围值	
    },
    // 营业信息
    business_info: {
		proportion_of_business: "", // 业务比重
		list: []
	},
    // 对手信息
    competitor_analysis: [
        // {
        //     "company_name": "企业名称",
        //     "market_share": "市场份额",
        //     "understand_evaluation": "了解评价"
        // }
    ],
    // 客户信息
    customer_info: [
        // {
        //     "customer_name": "客户名称",
        //     "sales_share": "销售占比",
        //     "main_supply_part": "主供零件",
        //     "begin_cooperation_time": "开始合作时间"
        // }
    ],
    // 相关专利
    technical_info: {
		patent: "", // 相关专利
		RD_center: "", // 研发中心
		RD_partners: "", // 研发合作机构
		design_guides: "", // 设计规范
		product_design: "", // 产品设计: 独立设计,共同设计,转化设计,委外设计
		process_design: "", // 过程设计: 模具设计,检具设计,工装设计,辅具设计
		process_validation: "", // 过程验证: 模具验收,检具验收,工装维护,产品鉴定
		mold_profile: "", // 模具轮廓
		mold_weight: "", // 模具重量
		mold_category: "", // 模具品类
		mold_design: "", // 模具设计
		mold_manufacture: "", // 模具制造
		mold_acceptance: "", // 模具验收
		design_software: "", // 设计软件
		dev_process: "", // 开发流程	
    },
    // 质量信息
    quality_info: {
		certification: "", // 质量体系认证
		partners: "", // 质量合作机构
		tool_software: "", // 质控工具软件
		PPM: "", // 市场PPM
		env_certification: "", // 环境体系认证
		accredited_laboratory: "", // 认可实验室
		system_certification: "", // 计划体系认证
	},
    // 产能产线
    produce_capacity: {
        processes: "",
        automation_line: "",
        load: ""
    },
    // 外购管理
    outsourcing: {
        technology: "", // 外购工艺
        parts: "", // 外购备件
        material: "", // 外购原料
        system: "", // 外购制度
     },
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
    // 关键生产设备
    production_equipment: [
        // {
        //     "name": "生产设备名称",
        //     "spec": "规格型号",
        //     "quantity": "数量",
        //     "manufacturer": "设备制造商",
        //     "purchase_period": "购置年限"
	    // }
    ],
    // 关键检测设备
	detection_equipment: [
        // {
        //     "name": "检测设备名称",
        //     "Spec": "规格型号",
        //     "quantity": "数量",
        //     "manufacturer": "设备制造商",
        //     "accuracy_level": "精度等级"
        // }
    ],
    // 材料清单基本信息
    confirmatory_material: {
		business_license_photo: "", // 营业执照照片
		registered_capital: "", // 注册资本({{ $t('supply-chain.ten_thousand_yuan') }})
		legal_person: "", // 法人代表
		business_duration_type: "", // 营业期限类型：1.长期有效，2.短期有效
		begin_business_time: "", // 营业开始时间
		end_business_time: "", // 营业结束时间
		account_name: "", // 开户名
		account_with_bank: "", // 开户行
		account_with_bank_number: "", // 开户行行号
		bank_account: "", // 银行账号
		quality_system_certificate: "", // 质量体系证书
		proxy_certificate: "", // 代理证书
		account_opening_bank_license: "", // 开户行许可证
		eia_certificate: "", // 环评证书
		environmental_report: "", // 环保报告
	},   

    additional_info: ""
})  // 一堆信息判断参数

onMounted(() => {
    getDetail({
        id: route.query.id,
    });
});

/* Fetch start*/
function getDetail(params = {}) {
    let obj = {
        ...params,
    };

    Core.Api.SUPPLY.adminDetail(obj)
        .then((res) => {
            console.log("getPhoneCodeFetchs res", res);
            msgDetail.value = res.detail?.form ? JSON.parse(res.detail?.form) : {};

            // 回显数据
            for (const key in msgDetail.value) {
                let keys = msgDetail.value[key]
                // console.log("key",key,  msgDetail.value[key], msgDetail.value[key] instanceof String);
                // console.log(typeof keys);
                // console.log(key, keys instanceof Array);

                if (keys instanceof Array) {
                    // console.log("数组", parameters.value[key]);
                    // 判断 数组
                    parameters.value[key] = keys

                    if (key === 'customer_info') {
                        // 开始合作时间
                        parameters.value[key].forEach((el) => {
                            // 标准格式
                            el.begin_cooperation_time = el.begin_cooperation_time ? dayjs.unix(el.begin_cooperation_time) : null
                        })
                    }

                } else if (keys instanceof Object) {
                    // 判断 是对象 [数组其实也是对象 所以先判断数组在判断对象]
                    for (const item in parameters.value[key]) {
                        // 存在在添加
                        if (parameters.value[key].hasOwnProperty(item)) {
                            parameters.value[key][item] = keys[item] || ""
                        }
                    }

                    if (key === 'company_info') {
                        // 成立日期(过滤一下)
                        // console.log("parameters.value[key].established_time", parameters.value[key].established_time);
                        parameters.value[key].established_time = parameters.value[key].established_time ? dayjs.unix(parameters.value[key].established_time) : null
                    }

                } else if (typeof keys === "string" || typeof keys === "number" || typeof keys === "boolean") {
                    // | 字符串 | 数字 | 布尔
                    console.log("kkk", key, keys);
                    parameters.value[key] = keys
                }
            }

            let businessLicensePhoto = msgDetail.value.confirmatory_material?.business_license_photo
            let qualitySystemCertificate = msgDetail.value.confirmatory_material?.quality_system_certificate
            let proxyCertificate = msgDetail.value.confirmatory_material?.proxy_certificate
            let accountOpeningBankLicense = msgDetail.value.confirmatory_material?.account_opening_bank_license
            let eiaCertificate = msgDetail.value.confirmatory_material?.eia_certificate
            let environmentalReport = msgDetail.value.confirmatory_material?.environmental_report

            // 营业执照照片
            if (businessLicensePhoto) {
                msgDetail.value.confirmatory_material.business_license_photo = businessLicensePhoto.split(",")
            }
            // 质量体系证书
            if (qualitySystemCertificate) {
                msgDetail.value.confirmatory_material.quality_system_certificate = qualitySystemCertificate.split(",")
            }
            // 代理证书
            if (proxyCertificate) {
                msgDetail.value.confirmatory_material.proxy_certificate = proxyCertificate.split(",")
                // console.log("代理证书", msgDetail.value.confirmatory_material.proxy_certificate);
            }
            // 开户行许可证
            if (accountOpeningBankLicense) {
                msgDetail.value.confirmatory_material.account_opening_bank_license = accountOpeningBankLicense.split(",")
            }
            // 环评证书
            if (eiaCertificate) {
                msgDetail.value.confirmatory_material.eia_certificate = eiaCertificate.split(",")
            }
            // 环保报告
            if (environmentalReport) {
                msgDetail.value.confirmatory_material.environmental_report = environmentalReport.split(",")
            }          
            
            // msgDetail.value.type = 1

            console.log("输出的", parameters.value);
        })
        .catch((err) => {
            console.log("getPhoneCodeFetchs err", err);
        });
}
// 保存接口
const saveDetail = (params = {}) => {
    let obj = {
        ...params,
    };

    Core.Api.SUPPLY.adminAdd(obj)
        .then((res) => {
            console.log("成功", res);
            proxy.$message.success(proxy.$t('common.successfully_saved'));
            router.push({
                path: '/supply-manage/list',
            })
        })
        .catch((err) => {
            console.log("getPhoneCodeFetchs err", err);
        });
}
/* Fetch end*/

/* methods start*/
// 判断哪些类型显示哪些模块
const returnTypeBool = (type, typeIncludes) => {
    let result = typeIncludes.includes(Number(type))
    return result
}
// 预览照片
const handlePreview = (url) => {
    previewVisible.value = true
    previewImage.value = url
}
// 预览关闭
const handleCancel = () => {
    previewVisible.value = false
    previewImage.value = null
}

// 营业期限时间选择器
const handleTimeSearch = (params, type, recordItem) => {
    console.log("时间组件", params);
    switch (type) {
        case "business_term":
            console.log("营业期限", params);
            parameters.value.confirmatory_material.begin_business_time = params.begin_time
            parameters.value.confirmatory_material.end_business_time = params.end_time
            break;    
        case "date_establishment":
            console.log("sss", dayjs(parameters.value.company_info.established_time).format('DD/MM/YYYY'));
            // 成立日期
            // parameters.value.company_info.established_time = dayjs(params).unix()
            break;    
        case "agent_info":
            // 代理有效期间
            parameters.value.agent_info.agent_effective_begin_time = params.begin_time
            parameters.value.agent_info.agent_effective_end_time = params.end_time
            break;    
        case "begin_cooperation_time":
            // 开始合作时间
            // recordItem = dayjs(params).unix()
            // console.log(dayjs(params).unix());
            // console.log("recordItem",params, recordItem);
            break;    
        default:
            break;
    }  
};

// 供应类型选择
const onSelectType = (type) => {
    parameters.value.type = Number(type)
}
// 底部按钮
const onSuction = (type) => {
    switch (type) {
        case 'edit':
            isEdit.value = true            
            break;
        case 'cancel-edit':
            isEdit.value = false
            break;
        case 'add':
            const form = Core.Util.deepCopy(parameters.value)           
            for (const key in form) {
                switch (key) {
                    case 'company_info':                        
                        // 成立日期(过滤一下)
                        form[key].established_time = dayjs(parameters.value[key].established_time).unix()
                        break;
                    case 'customer_info':
                        // 开始合作时间(过滤一下)
                        form[key].forEach((el, index) => {
                            // 标准格式
                            el.begin_cooperation_time = dayjs(parameters.value[key][index].begin_cooperation_time).unix()
                        })
                        break;
                
                    default:
                        break;
                }
            }
            console.log("提交数据 from", form);

            saveDetail({
                id: route.query.id,
                type: form.type,
                company_name: form.company_info.name,
                form: JSON.stringify(form)
            })

            break;
        case 'continue_fill':
            onPingPongMaskClose()
            break;
        case 'submit_exit':
            onSuction('add')
            break;

        default:
            break;
    }
}

// 表格添加数据
const onAddBtn = (type) => {
    switch (type) {
        case 'competitor':
            // 添加对手
            parameters.value.competitor_analysis.push(
                {
                    company_name: "",
                    market_share: "",
                    understand_evaluation: "",
                }
            )
            console.log("添加对手", parameters.value.competitor_analysis);
            break;
        case 'customer_information':
            // 添加客户
            parameters.value.customer_info.push(
                {
                    customer_name: "",
                    sales_share: "",
                    main_supply_part: "",
                    begin_cooperation_time: "",
                }
            )
            break;
        case 'key_production_equipment':
            // 添加生产设备
            parameters.value.production_equipment.push(
                {
                    name: "",
                    spec: "",
                    quantity: "",
                    manufacturer: "",
                    purchase_period: ""
                }
            )
            break;
        case 'critical_detection_equipment':
            // 添加关键检测设备
            parameters.value.detection_equipment.push(
                {
                    name: "",
                    Spec: "",
                    quantity: "",
                    manufacturer: "",
                    accuracy_level: "",
                }
            )
            break;
    
        default:
            break;
    }
}
// 表格删除数据
const onDeleate = (type, record, index) => {
    console.log("type", type, "record", record, "index", index);
    switch (type) {
        case 'competitor_delete':
            // 对手删除
            parameters.value.competitor_analysis.splice(index, 1)
            console.log("对手删除", parameters.value.competitor_analysis);
            break;
        case 'customer_information_delete':
            // 客户删除
            parameters.value.customer_info.splice(index, 1)
            console.log("关键检测设备删除", parameters.value.competitor_analysis);
            break;
        case 'key_production_equipment':
            // 生产设备删除
            parameters.value.production_equipment.splice(index, 1)  
            console.log("关键检测设备删除", parameters.value.competitor_analysis);
            break;
        case 'critical_detection_equipment':
            // 关键检测设备删除
            parameters.value.detection_equipment.splice(index, 1)   
            console.log("关键检测设备删除", parameters.value.competitor_analysis);         
            break;
    
        default:
            break;
    }
}
// 职位多选等过滤数据 Core.Const.SUPPLAY.POSITION
const plainOptions = (data) => {
    let arr = []

    for (const key in data) {
        arr.push({
            label: proxy.$t(data[key].label),
            value: data[key].value
        })
    }

    return arr
}
// 职位选择change
const onPosition = (arr) => {
    console.log("e", arr);

    // 删除不在 arr 中的元素
    parameters.value.contact_info = parameters.value.contact_info.filter(el => arr.includes(el.position));

    // 添加缺失的元素
    arr.forEach(el => {
        if (!parameters.value.contact_info.some(item => item.position === el)) {
            parameters.value.contact_info.push({
                position: el,
                name: "",
                email: "",
                phone: "",
                flag_wechat: false
            });
        }
    });
    
    console.log("职位选择change", parameters.value.contact_info);
}
// 打开遮罩框
const onPingPongMaskClose = () => {
    isClose.value = false
}
// 返回按钮
const onBack = () => {
    if (isEdit.value) {
        isClose.value = true
    } else {
        router.back()
    }
}

/* methods end*/
</script>

<style lang="less" scoped>
.supply-detail {
    padding: 20px;
    box-sizing: border-box;
    border-radius: 6px;
    background: #fff;
    position: relative;
    padding-bottom: 100px;

    .bg-color {
        border-radius: 6px;
        background: rgba(248, 250, 252, 0.8);

        .title {
            color: #1d2129;
            font-size: 18px;
            font-weight: 500;
        }

        .text-color {
            color: #8090a6;
            font-size: 14px;
            font-weight: 400;
        }

        .customer-input {
            padding-left: 8px;
            box-sizing: border-box;
            color: #1d2129;
            font-size: 14px;
            font-weight: 400;
            min-height: 32px;
            line-height: 32px;
            border-radius: 4px;
            border: 1px solid #eaecf1;
            background: linear-gradient(0deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%), #eef2f6;
            position: relative;
            cursor: initial;
            .unit {
                position: absolute;
                top: 0;
                right: 0;
                width: 36px;
                height: 100%;
                background-color: #f2f2f2;
                text-align: center;

                color: #808fa6;
                font-size: 14px;
                font-weight: 400;
                border-left: 1px solid #eaecf1;
            }
        }
        .customer-input-number {
            position: relative;
            
            :deep(.ant-input-number) {
                color: #1d2129;
                font-size: 14px;
                font-weight: 400;
                cursor: initial;
                background: linear-gradient(0deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%), #eef2f6;
            }
            :deep(.ant-input-number-input-wrap > .ant-input-number-input) {
                cursor: initial;
            }
        }
        .customer-input-number-change {

            :deep(.ant-input-number-group-addon) {
                min-width: 36px;
                background-color: #F2F2F2;
                color: #808fa6;
                font-size: 14px;
                font-weight: 400;
                border-left: 1px solid #F2F2F2;
            }
        }
    }
    .back {
        color: #1D2129;
        font-size: 18px;
        font-weight: 600;
    }
    // 基本信息
    .base-message {
        // 供应类型
        .supply-type {
            min-height: 112px;
            position: relative;
            display: flex;
            align-items: center;

            .position-t-56 {
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                transform: translateY(-50%);
            }
            .btn-type-parts {
                width: 176px;
                height: 52px;
                line-height: 52px;
                background-image: url("../../../assets/images/supply-chain/parts-bg.png");
                background-size: 100%;
                background-repeat:no-repeat;
                text-align: center;
                color: #fff;
                font-size: 16px;
                font-weight: 500;
            }

            .edit-type {
                display: flex;
                flex-wrap: wrap;
                .edit-type-item {
                    width: 176px;
                    height: 52px;
                    line-height: 52px;
                    text-align: center;
                    color: #666;
                    font-size: 16px;
                    font-weight: 500;
                    border-radius: 4px;
                    border: 1px solid #EAECF1;
                    background: #FFF;
                    box-sizing: content-box;
                    &.edit-type-item-select {
                        background-image: url("../../../assets/images/supply-chain/parts-bg.png");
                        background-size: 100% 100%;
                        background-repeat: no-repeat;
                        color: #FFF;
                    }
                    .black-font {
                        color: #666;
                    }
                    .white-font {
                        color: #FFF;
                    }

                    &.edit-type-item-change {
                        &:hover {
                            border: 1px solid #0061FF;
                            .black-font {
                                color: #0061FF;
                            }
                        }
                    }
                }

            }

        }
        // 联系方式
        .contact-information {}               
        // 基本信息
        .basic-information {
            .proportion-of-list {
                display: flex;
                .proportion-of-item {
                    width: 50%;

                    .proportion-of-item-title {
                        color: #8090a6;
                        font-size: 16px;
                        font-weight: 500;
                    }
                }
            }
            .invoice-range {
                margin-left: 6px;
                height: 32px;
                padding: 8px 12px;
                box-sizing: border-box;
                border-radius: 4px;
                border: 1px solid #EAECF2;
                background: linear-gradient(0deg, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.30) 100%), #EEF2F6;
            }
            // 代理信息用到
            .agency-time {
                border-radius: 4px;
                border: 1px solid #eaecf2;
                background: #f3f6f9;                
                height: 32px;
                line-height: 32px;
                text-align: center;
                padding: 0 10px;
                box-sizing: border-box;

                color: #1d2129;
                font-size: 14px;
                font-weight: 400;
            }
        }
        // 设备信息
        .equipment-information {}
        // 补充信息
        .supplementary-information {
        }

        // 联系方式 | 基本信息 | 设备信息 | 补充信息 公共样式  
        .supply-type,
        .contact-information,
        .basic-information,
        .equipment-information,
        .supplementary-information {
            padding: 20px;
            box-sizing: border-box;
            .information-container-form {
                display: flex;
                .sub-title {
                    width: 15%;
                    text-align: right;
                    color: #1d2129;
                    font-size: 16px;
                    font-weight: 400;

                    &.sub-title-required {
                       &::before {
                            content: "*";
                            color: #EB4141;                        
                            vertical-align: middle;
                       }
                    }
                }
                .information-form {
                    margin-left: 50px;
                    width: 80%;
                }
            }
        }
    }
    // 材料清单
    .materials-message {
        // 基本信息
        .materials-basic-information {
            .bussiness-time {
                border-radius: 4px;
                border: 1px solid #eaecf2;
                background: #f3f6f9;                
                height: 32px;
                line-height: 32px;
                text-align: center;
                padding: 0 10px;
                box-sizing: border-box;

                color: #1d2129;
                font-size: 14px;
                font-weight: 400;
            }
        }
        // 其他证实性材料
        .other-materials {
            
        }
           
        .materials-basic-information,
        .other-materials {
            padding: 20px;
            box-sizing: border-box;
            .information-container-form {
                display: flex;
                .sub-title {
                    width: 15%;
                    text-align: right;
                    color: #1d2129;
                    font-size: 16px;
                    font-weight: 400;

                    &.sub-title-required {
                        &::before {
                            content: "*";
                            color: #EB4141;
                            vertical-align: middle;
                        }
                    }
                }
                .information-form {
                    margin-left: 50px;
                    width: 80%;

                    .materials-img {
                        width: 80px;
                        height: 80px;
                        border-radius: 4px;
                        border: 1px solid #d9d9d9;
                        object-fit: cover;
                    }
                }
            }
        }       
    }

    // 基本信息, 材料清单 的 header
    .msg-header {
        width: 100%;
        height: 32px;
        border-radius: 4px;
        background: rgba(0, 97, 255, 0.1);
        color: #1d2129;
        font-size: 18px;
        font-weight: 500;
        display: flex;
        align-items: center;
        padding-left: 10px;
        box-sizing: border-box;
        &::before {
            content: "";
            display: inline-block;
            border: 2px solid #0061ff;
            height: 13px;
        }
    }

    // 编辑资料
    .suction-bottom {
        width: calc(100% - 232px);
        position: fixed;
        bottom: 0;
        right: 16px;
        border-top: 1px solid #EAECF1;
        background: #FFF;
        text-align: center;
        padding: 18px 0px;
        box-sizing: border-box;
    }
}

.w-50-percentage {
    width: 50%;
}
.w-80 {
    min-width: 80px;
}
.w-130 {
    min-width: 130px;
    max-width: 130px;
}
.h-64 {
    min-height: 64px !important;
}
.t-a-r {
    text-align: right;
}

.align-flex-start {
    align-items: flex-start;
}
.d-fl {
    display: flex;
}
.d-fl-a {
    display: flex;
    align-items: center;
}

:deep(.ant-table-wrapper) {
    border: 1px solid #EAECF2; 
    border-bottom: 0px;

}


.information-customer-name {
    padding: 0 10px;
    height: 32px;
    line-height: 32px;
    background-color: #F2F3F5;
    text-align: center;
    display: inline-block;

    .information-customer-name-required {    
        color: #EB4141;                
        vertical-align: middle;
    }
}
.w-100 {
    width: 100%
}
.no-white-space {
    white-space: nowrap;
}

.mask-center {    
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    font-family: Montserrat;
    padding: 32px 24px;
    box-sizing: border-box;

    .title {
        color: #1D2129;
        text-align: center;
        font-size: 18px;
        font-weight: 600;
    }
    .sub-title {
        color: #1D2129;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        margin-top: 34px;
    }
    .line {
        margin-top: 32px;
        margin-bottom: 18px;
        border-top: 1px solid #F2F3F5;
    }
    .btn {
        display: flex;
        justify-content: center;
    }
}

.custom-please-enter {
    color: #c7bfbf;
    margin-left: 4px;
}
.custom-not-uploaded {
    color: #666;
}
</style>
