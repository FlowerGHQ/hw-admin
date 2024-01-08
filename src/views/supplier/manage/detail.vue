<template>
    <div class="supply-detail">
        <div class="back"></div>
        <!-- 基本信息 -->
        <div class="base-message">
            <div class="msg-header">
                <span class="m-l-4">{{ $t('supply-chain.basic_info') }}</span>
            </div>
            <!-- 供应类型 -->
            <div class="supply-type bg-color m-t-16">
                <div class="title">{{ $t('supply-chain.type_supply') }}</div>
                <div class="btn-type-parts">
                    <MySvgIcon icon-class="parts-icon" />
                    <span class="m-l-4">
                        {{
                            Core.Const.SUPPLAY.SUPPLAY_TYPE[msgDetail.type] ?
                            $t(Core.Const.SUPPLAY.SUPPLAY_TYPE[msgDetail.type].t) : "-"
                        }}
                    </span>
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
                            <div class="search-col m-t-0 required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.Position') }}</div>
                                <div class="value m-l-8">
                                    <a-radio :checked="true">
                                        {{
                                            Core.Const.SUPPLAY.POSITION[msgDetail.position]?.t
                                                ? $t(Core.Const.SUPPLAY.POSITION[msgDetail.position]?.t)
                                                : "-"
                                        }}
                                    </a-radio>
                                </div>
                            </div>
                        </div>
                        <!-- 姓名 -->
                        <div class="level-search-row">
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.name') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.contact_info?.name || "-" }}
                                    </div>
                                </div>
                            </div>
                            <!-- 邮箱 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.mailbox') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.contact_info?.email || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 联系方式 -->
                        <div class="level-search-row">
                            <div class="search-col w-50-percentage required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.contact') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.contact_info?.phone || "-" }}
                                    </div>
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
                                    <div class="customer-input">
                                        {{ msgDetail?.company_info?.name || "-" }}
                                    </div>
                                </div>
                            </div>
                            <!-- 公司网址 -->
                            <div class="search-col m-t-0">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.company_website') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.company_info?.website_address || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 成立日期 -->
                            <div class="search-col w-50-percentage required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.date_establishment') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.company_info?.established_time || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 详细地址 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.detailed_address') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.company_info?.address || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 公司性质 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.nature_of_company') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{
                                            Core.Const.SUPPLAY.NATURE[msgDetail?.company_info?.nature]?.t
                                                ? $t(Core.Const.SUPPLAY.NATURE[msgDetail?.company_info?.nature]?.t)
                                                : "-"
                                        }}
                                    </div>
                                </div>
                            </div>
                            <!-- 法人代表 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.legal_representative') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.company_info?.legal_person || "-" }}
                                    </div>
                                </div>
                            </div>                            
                        </div>
                        <div class="level-search-row">
                            <!-- 采购半径 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.purchasing_radius') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.company_info?.purchasing_radius || "-" }}
                                        <div class="unit">KM</div>
                                    </div>
                                </div>
                            </div>
                            <!-- 占地面积 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.floor_space') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.company_info?.floor_area || "-" }}
                                        <div class="unit">m²</div>
                                    </div>
                                </div>
                            </div>                           
                        </div>
                        <div class="level-search-row">
                             <!-- 建筑面积 -->
                             <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.floor_area') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.company_info?.building_area || "-" }}
                                        <div class="unit">m²</div>
                                    </div>
                                </div>
                            </div>
                            <!-- 母公司名称 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.parent_company_name') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.company_info?.parent_company_name || "-" }}
                                    </div>
                                </div>
                            </div>                      
                        </div>
                        <div class="level-search-row">
                            <!-- 母公司地址 -->
                            <div class="search-col w-50-percentage">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.Parent_company_address') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.company_info?.parent_company_address || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 代理信息 -->
                <div 
                    class="information-container-form m-t-40" 
                    v-if="returnTypeBool(msgDetail.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker])"
                >
                    <div class="sub-title">{{ $t('supply-chain.agent_information') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                             <!-- 被代理公司 -->
                             <div class="search-col m-t-0">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.agent_company') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.agent_info?.agent_company || "-" }}
                                    </div>
                                </div>
                            </div>                             
                            <!-- 被代理地址 -->
                            <div class="search-col m-t-0">
                               <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.proxy_address') }}</div>
                               <div class="value m-l-8">
                                    <div class="customer-input">
                                       {{ msgDetail?.agent_info?.agent_address || "-" }}
                                    </div>
                               </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 被代理关系 -->
                            <div class="search-col w-50-percentage">
                               <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.agency_relationship') }}</div>
                               <div class="value m-l-8">
                                    <div class="customer-input">
                                       {{ msgDetail?.agent_info?.agent_relationship || "-" }}
                                    </div>
                               </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 代理权证* -->
                            <div class="search-col required">
                               <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.proxy_warrant') }}</div>
                               <div class="value m-l-8">                                   
                                    <a-radio :checked="true">
                                        {{
                                            Core.Const.SUPPLAY.Legal_Dispute[msgDetail.agent_info?.flag_agent_warrant] ?
                                            $t(Core.Const.SUPPLAY.Legal_Dispute[msgDetail.agent_info?.flag_agent_warrant].t) : ""
                                        }}
                                    </a-radio>
                               </div>
                            </div>
                            <!-- 代理有效期间* -->
                            <div class="search-col required">
                               <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.duration_of_agency') }}</div>
                               <div class="value m-l-8">
                                    <div class="agency-time">
                                        {{
                                            msgDetail?.agent_info?.agent_effective_begin_time
                                                ? $Util.timeFilter(
                                                    msgDetail?.agent_info?.agent_effective_begin_time
                                                )
                                                : ""
                                        }}
                                        -
                                        {{
                                            msgDetail?.agent_info?.agent_effective_end_time
                                                ? $Util.timeFilter(msgDetail?.agent_info?.agent_effective_end_time)
                                                : ""
                                        }}
                                    </div>
                               </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 代理产品 -->
                            <div class="search-col w-50-percentage">
                               <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.agent_product') }}</div>
                               <div class="value m-l-8">
                                    <div class="customer-input">
                                      {{ msgDetail?.agent_info?.agent_product || "-" }}
                                    </div>
                               </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 人力资源 -->
                <div 
                    class="information-container-form m-t-40" 
                    v-if="!returnTypeBool(msgDetail.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker])"
                >
                    <div class="sub-title">{{ $t('supply-chain.human_resources') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 员工总数 -->
                            <div class="search-col m-t-0">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.total_number_of_employees') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.human_resource?.total_employees || "-" }}
                                    </div>
                                </div>
                            </div>
                            <!-- 管理人数 -->
                            <div class="search-col m-t-0">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.number_of_managers') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.human_resource?.manager_number || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 质量人数 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.mass_number') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.human_resource?.mass_number || "-" }}
                                    </div>
                                </div>
                            </div>
                            <!-- 技术人数 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.skilled_personnel') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.human_resource?.technician_number || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 技术工龄 -->
                            <div class="search-col w-50-percentage">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.technical_seniority') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.human_resource?.technical_seniority || "-" }}
                                    </div>
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
                                    <a-radio :checked="true">
                                        {{
                                            Core.Const.SUPPLAY.Legal_Dispute[msgDetail.financial_info?.flag_legal_dispute] ?
                                            $t(Core.Const.SUPPLAY.Legal_Dispute[msgDetail.financial_info?.flag_legal_dispute].t) : ""
                                        }}
                                    </a-radio>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 操作工人月平均工资 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.average') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.financial_info?.average_monthly_wage_of_operating_workers || "-" }}
                                    </div>
                                </div>
                            </div>
                            <!-- 管理职员人均年产值 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.per') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{
                                            msgDetail.financial_info
                                                ?.per_capita_annual_output_value_of_management_staff || "-"
                                        }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 账期要求 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.period_requirement') }}</div>
                                <div class="value m-l-8">
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
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 发票类型 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.Invoice_type') }}</div>
                                <div class="value m-l-8">
                                    <a-radio :checked="true">
                                        <span>
                                            {{
                                                Core.Const.SUPPLAY.INVOICE_TYPE[msgDetail.financial_info?.invoice_type] ?
                                                $t(Core.Const.SUPPLAY.INVOICE_TYPE[msgDetail.financial_info?.invoice_type].t) : "-"
                                            }}
                                        </span>
                                        <span class="invoice-range">
                                            {{ msgDetail.financial_info?.invoice_range_value || "-" }}
                                        </span>
                                    </a-radio>
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
                                    <div class="customer-input">
                                        {{ msgDetail.business_info?.proportion_of_business || "-" }}
                                    </div>
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
                                        <div class="search-col">
                                            <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.sales_volume') }}</div>
                                            <div class="value m-l-8">
                                                <div class="customer-input">
                                                    {{ item?.sales || "-" }}
                                                    <div class="unit">万元</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="level-search-row">
                                        <!-- 纳税额 -->
                                        <div class="search-col">
                                            <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.tax_amount') }}</div>
                                            <div class="value m-l-8">
                                                <div class="customer-input">
                                                    {{ item?.taxes_paid || "-" }}
                                                    <div class="unit">万元</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="level-search-row">
                                        <!-- 利润率 -->
                                        <div class="search-col">
                                            <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.profit_rate') }}</div>
                                            <div class="value m-l-8">
                                                <div class="customer-input">
                                                    {{ item?.profit_margin || "-" }}
                                                    <div class="unit">%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="level-search-row">
                                        <!-- 资产负债率 -->
                                        <div class="search-col">
                                            <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.asset_liability_ratio') }}</div>
                                            <div class="value m-l-8">
                                                <div class="customer-input">
                                                    {{ item?.asset_liability_ratio || "-" }}
                                                    <div class="unit">%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="level-search-row">
                                        <!-- 现金流量比率 -->
                                        <div class="search-col">
                                            <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.cash_flow_ratio') }}</div>
                                            <div class="value m-l-8">
                                                <div class="customer-input">
                                                    {{ item?.cash_flow_ratio || "-" }}
                                                    <div class="unit">%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <!-- 竞争对手 -->
                <div 
                    class="information-container-form m-t-40"
                    v-if="returnTypeBool(msgDetail.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part])"
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
                                        :data-source="msgDetail.competitor_analysis || []" 
                                        :pagination="false"
                                    >
                                        <template #bodyCell="{ column, text, record, index }">
                                            <!-- 公司名称 -->
                                            <template v-if="column.key === 'company_name'">
                                                {{ text }}
                                            </template>
                                            <!-- 市场份额 -->
                                            <template v-if="column.key === 'market_share'">
                                                {{ text }}
                                            </template>
                                            <!-- 了解评价 -->
                                            <template v-if="column.key === 'understand_evaluation'">
                                                {{ text }}
                                            </template>
                                        </template>
                                    </a-table>
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
                                        :data-source="msgDetail.customer_info || []"
                                        :pagination="false"
                                    >
                                        <template #bodyCell="{ column, text, record, index }">                                            
                                            <template v-if="column.key === 'customer_name'">
                                                {{ text }}
                                            </template>
                                            <template v-if="column.key === 'sales_share'">
                                                {{ text }}
                                            </template>
                                            <template v-if="column.key === 'main_supply_part'">
                                                {{ text }}
                                            </template>
                                            <template v-if="column.key === 'begin_cooperation_time'">
                                                {{ text  }}
                                            </template>
                                        </template>
                                    </a-table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 服务信息 -->
                <div 
                    class="information-container-form m-t-40"
                    v-if="returnTypeBool(msgDetail.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker])"
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
                                    <div class="customer-input">
                                        {{ msgDetail.service_info?.technical_services || "-" }}
                                    </div>
                                </div>
                            </div>
                            <!-- 质量服务 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">
                                    {{ $t('supply-chain.quality_service') }}
                                </div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.service_info?.quality_service || "-" }}
                                    </div>
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
                                    <div class="customer-input">
                                        {{ msgDetail.service_info?.supply_services || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 技术信息 -->
                <div 
                    class="information-container-form m-t-40"
                    v-if="!returnTypeBool(msgDetail.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers])"
                >
                    <div class="sub-title">{{ $t('supply-chain.Technical_information') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 研发中心 -->
                            <div 
                                class="search-col m-t-0 w-50-percentage"
                                v-if="!returnTypeBool(msgDetail.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing, Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold])"
                            >
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.research_and_development_center') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.technical_info?.RD_center || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 相关专利 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.related_patent') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.technical_info?.patent || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div 
                            class="level-search-row"
                            v-if="!returnTypeBool(msgDetail.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing, Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold])"
                        >
                            <!-- 研发合作机构 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.r_d_partner') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.technical_info?.RD_partners || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row" v-if="!returnTypeBool(msgDetail.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing])">
                            <!-- 产品设计 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.product_design') }}</div>
                                <div class="value m-l-8 d-fl">                            
                                    <template v-for="(item, index) in msgDetail.technical_info?.product_design" :key="index">                                    
                                        <a-checkbox :checked="true">
                                            {{
                                                Core.Const.SUPPLAY.TECHNICAL_INFORMATION_OBJECT[item] ?
                                                $t(Core.Const.SUPPLAY.TECHNICAL_INFORMATION_OBJECT[item].t) : "-"
                                            }}
                                        </a-checkbox>
                                    </template>
                                    <sapn v-if="!msgDetail.technical_info?.product_design?.length">
                                        {{ $t('supply-chain.not_selected') }}
                                    </sapn>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 过程设计 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.process_design') }}</div>
                                <div class="value m-l-8 d-fl">
                                    <template v-for="(item, index) in msgDetail.technical_info?.process_design" :key="index">                                    
                                        <a-checkbox :checked="true">
                                            {{
                                                Core.Const.SUPPLAY.PROCESS_DESIGN_OBJECT[item] ?
                                                $t(Core.Const.SUPPLAY.PROCESS_DESIGN_OBJECT[item].t) : "-"
                                            }}
                                        </a-checkbox>
                                    </template>
                                    <sapn v-if="!msgDetail.technical_info?.process_design?.length">
                                        {{ $t('supply-chain.not_selected') }}
                                    </sapn>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 过程验证 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.process_verification') }}</div>
                                <div class="value m-l-8 d-fl">
                                    <template v-for="(item, index) in msgDetail.technical_info?.process_validation" :key="index">                                    
                                        <a-checkbox :checked="true">
                                            {{
                                                Core.Const.SUPPLAY.PROCESS_VALIDATION_OBJECT[item] ?
                                                $t(Core.Const.SUPPLAY.PROCESS_VALIDATION_OBJECT[item].t) : "-"
                                            }}
                                        </a-checkbox>
                                    </template>
                                    <sapn v-if="!msgDetail.technical_info?.process_design?.length">
                                        {{ $t('supply-chain.not_selected') }}
                                    </sapn>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 设计软件 -->
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.design_software') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input h-64">
                                        {{ msgDetail.technical_info?.design_software || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 开发流程 -->
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.development_process') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input h-64">
                                        {{ msgDetail.technical_info?.dev_process || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 质量信息 -->
                <div 
                    class="information-container-form m-t-40"
                    v-if="!returnTypeBool(msgDetail.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold])"
                >
                    <div class="sub-title">{{ $t('supply-chain.quality_information') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 质量体系认证 -->
                            <div class="search-col m-t-0">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.quality_system_certification') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.quality_info?.certification || "-" }}
                                    </div>
                                </div>
                            </div>
                            <!-- 环境体系认证 -->
                            <div class="search-col m-t-0">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.environmental_system_certification') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.quality_info?.env_certification || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 质量合作机构 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.quality_cooperation_agency') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.quality_info?.partners || "-" }}
                                    </div>
                                </div>
                            </div>
                            <!-- 认可实验室 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.accredited_laboratory') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.quality_info?.accredited_laboratory || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 质控工具软件 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.quality_control_tool_software') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.quality_info?.tool_software || "-" }}
                                    </div>
                                </div>
                            </div>
                            <!-- 计划体系认证 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.planning_system_certification') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.quality_info?.system_certification || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 市场PPM -->
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.market_PPM') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input h-64">
                                        {{ msgDetail.quality_info?.PPM || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 指定信息 -->
                <div 
                    class="information-container-form m-t-40"
                    v-if="returnTypeBool(msgDetail.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers])"
                >                    
                    <div class="sub-title">{{ $t('supply-chain.specify_information') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 指定协议* -->
                            <div class="search-col m-t-0">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.specified_protocol') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.specify_info?.protocol || "-" }}
                                    </div>
                                </div>
                            </div>
                            <!-- 指定零件* -->
                            <div class="search-col m-t-0">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.specify_part') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.specify_info?.parts || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 指定服务* -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.specify_service') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.specify_info?.service || "-" }}
                                    </div>
                                </div>
                            </div>                          
                        </div>
                        <div class="level-search-row">
                            <!-- 指定理由* -->
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.specify_reason') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input h-64">
                                        {{ msgDetail.specify_info?.reason || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 产能产线 -->
                <div 
                    class="information-container-form m-t-40"
                    v-if="returnTypeBool(msgDetail.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing])"
                >
                    <div class="sub-title">{{ $t('supply-chain.capacity_line') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 关键自有工序 -->
                            <div class="search-col m-t-0 align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.key_owned_process') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input h-64">
                                        {{ msgDetail.produce_capacity?.processes || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 智能自动化线 -->
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.intelligent_automation_line') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input h-64">
                                        {{ msgDetail.produce_capacity?.automation_line || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 生产产能负荷 -->
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.production_capacity_load') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input h-64">
                                        {{ msgDetail.produce_capacity?.load || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 外购管理 -->
                <div 
                    class="information-container-form m-t-40"
                    v-if="returnTypeBool(msgDetail.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing])"
                >
                    <div class="sub-title">{{ $t('supply-chain.qutsourcing_management') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 外购工艺 -->
                            <div class="search-col m-t-0 align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.qutsourced_technology') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input h-64">
                                        {{ msgDetail.outsourcing?.technology || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 外购备件 -->
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.qutsourced_spare_parts') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input h-64">
                                        {{ msgDetail.outsourcing?.parts || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 外购原料 -->
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.purchased_raw_materials') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input h-64">
                                        {{ msgDetail.outsourcing?.material || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 外购制度 -->
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.qutsourcing_system') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input h-64">
                                        {{ msgDetail.outsourcing?.system || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 设备信息 -->
            <div 
                class="equipment-information bg-color m-t-16"
                v-if="!returnTypeBool(msgDetail.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker])"
            >
                <div class="title">{{ $t('supply-chain.device_information') }}</div>
                <!-- 关键生产设备 -->
                <div class="information-container-form">
                    <div class="sub-title">{{ $t('supply-chain.key_production_equipment') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <div class="search-col m-t-0">
                                <div class="key w-130 t-a-r text-color"></div>
                                <div class="value m-l-8">
                                    <a-table
                                        :columns="deviceProductionColumns"
                                        :data-source="msgDetail.production_equipment || []"
                                        :pagination="false"
                                    ></a-table>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>
                <!-- 关键检测设备 -->
                <div class="information-container-form m-t-40">
                    <div class="sub-title">{{ $t('supply-chain.critical_detection_equipment') }}</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <div class="search-col m-t-0">
                                <div class="key w-130 t-a-r text-color"></div>
                                <div class="value m-l-8">
                                    <a-table
                                        :columns="deviceDetectionColumns"
                                        :data-source="msgDetail.detection_equipment || []"
                                        :pagination="false"
                                    ></a-table>
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
                                    <div class="customer-input h-64">
                                        {{ msgDetail.additional_info || "-" }}
                                    </div>
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
                            <div class="search-col m-t-0 align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.business_license_photos') }}</div>
                                <div class="value m-l-8">
                                    <template
                                        v-for="(item, index) in msgDetail.confirmatory_material?.business_license_photo"
                                        :key="index"
                                    >
                                        <img
                                            class="materials-img"
                                            :class="{ 'm-l-16': index > 0 }"
                                            :src="Core.Const.NET.FILE_URL_PREFIX + item"
                                            alt=""
                                        />
                                    </template>
                                    <sapn v-if="!msgDetail.confirmatory_material?.business_license_photo?.length">
                                        {{ $t('supply-chain.not_uploaded') }}
                                    </sapn>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 注册资本 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.registered_capital') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.confirmatory_material?.registered_capital || "-" }}
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">法定代表人</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">缺少字段</div>
                                </div>
                            </div> -->
                        </div>
                        <div class="level-search-row">
                            <!-- 营业期限 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.business_term') }}</div>
                                <div class="value m-l-8" style="display: flex; align-items: center">
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
                                                      msgDetail?.confirmatory_material?.begin_business_time
                                                  )
                                                : ""
                                        }}
                                        -
                                        {{
                                            msgDetail?.confirmatory_material?.end_business_time
                                                ? $Util.timeFilter(msgDetail?.confirmatory_material?.end_business_time)
                                                : ""
                                        }}
                                    </div>
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
                                    <div class="customer-input">
                                        {{ msgDetail?.confirmatory_material?.account_name || "-" }}
                                    </div>
                                </div>
                            </div>
                            <!-- 开户行 -->
                            <div class="search-col m-t-0 required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.bank_of_deposit') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.confirmatory_material?.account_with_bank || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 开户行号 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.bank_number') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.confirmatory_material?.account_with_bank_number || "-" }}
                                    </div>
                                </div>
                            </div>
                            <!-- 银行账号 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.bank_account') }}</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.confirmatory_material?.bank_account || "-" }}
                                    </div>
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
                                    <template
                                        v-for="(item, index) in msgDetail.confirmatory_material?.quality_system_certificate"
                                        :key="index"
                                    >
                                        <img
                                            class="materials-img"
                                            :class="{ 'm-l-16': index > 0 }"
                                            :src="Core.Const.NET.FILE_URL_PREFIX + item"
                                            alt=""
                                        />
                                    </template>
                                    <sapn v-if="!msgDetail.confirmatory_material?.quality_system_certificate?.length">
                                        {{ $t('supply-chain.not_uploaded') }}
                                    </sapn>
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
                                    <template
                                        v-for="(item, index) in msgDetail.confirmatory_material?.account_opening_bank_license"
                                        :key="index"
                                    >
                                        <img
                                            class="materials-img"
                                            :class="{ 'm-l-16': index > 0 }"
                                            :src="Core.Const.NET.FILE_URL_PREFIX + item"
                                            alt=""
                                        />
                                    </template>
                                    <sapn v-if="!msgDetail.confirmatory_material?.account_opening_bank_license?.length">
                                        {{ $t('supply-chain.not_uploaded') }}
                                    </sapn>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 环评证书 -->
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.environmental_assessment_certificate') }}</div>
                                <div class="value m-l-8">
                                    <template
                                        v-for="(item, index) in msgDetail.confirmatory_material?.eia_certificate"
                                        :key="index"
                                    >
                                        <img
                                            class="materials-img"
                                            :class="{ 'm-l-16': index > 0 }"
                                            :src="Core.Const.NET.FILE_URL_PREFIX + item"
                                            alt=""
                                        />
                                    </template>
                                    <sapn v-if="!msgDetail.confirmatory_material?.eia_certificate?.length">
                                        {{ $t('supply-chain.not_uploaded') }}
                                    </sapn>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 环保报告 -->
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">{{ $t('supply-chain.environmental_protection_report') }}</div>
                                <div class="value m-l-8">
                                    <template
                                        v-for="(item, index) in msgDetail.confirmatory_material?.environmental_report"
                                        :key="index"
                                    >
                                        <img
                                            class="materials-img"
                                            :class="{ 'm-l-16': index > 0 }"
                                            :src="Core.Const.NET.FILE_URL_PREFIX + item"
                                            alt=""
                                        />
                                    </template>
                                    <sapn v-if="!msgDetail.confirmatory_material?.environmental_report?.length">
                                        {{ $t('supply-chain.not_uploaded') }}
                                    </sapn>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance } from "vue";
import { useRoute } from "vue-router";
import Core from "@/core";
import MySvgIcon from "@/components/MySvgIcon/index.vue";

const route = useRoute();
const msgDetail = ref({});
const { proxy } = getCurrentInstance()

// 关键设备
const deviceProductionColumns = computed(() => {
    let columns = [
        { title: proxy.$t('supply-chain.Name_of_production_equipment'), dataIndex: "name", key: "name" },
        { title: proxy.$t('supply-chain.Specification_and_model'), dataIndex: "spec", key: "spec" },
        { title: proxy.$t('supply-chain.quantity'), dataIndex: "quantity", key: "quantity" },
        { title: proxy.$t('supply-chain.Equipment_manufacturer'), dataIndex: "manufacturer", key: "manufacturer" },
        { title: proxy.$t('supply-chain.Purchase_period'), dataIndex: "purchase_period", key: "purchase_period" },
    ];
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
    return columns;
});
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

            let businessLicensePhoto = msgDetail.value.confirmatory_material?.business_license_photo
            let qualitySystemCertificate = msgDetail.value.confirmatory_material?.quality_system_certificate
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
            // console.log("过滤数据", msgDetail.value);
            // msgDetail.value.type = 5
         
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
/* methods end*/
</script>

<style lang="less" scoped>
.supply-detail {
    padding: 20px;
    box-sizing: border-box;
    border-radius: 6px;
    background: #fff;

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
    }
    .back {}
    // 基本信息
    .base-message {
        // 供应类型
        .supply-type {
            height: 112px;
            display: flex;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
            .btn-type-parts {
                width: 176px;
                height: 52px;
                line-height: 52px;
                background-image: url("../../../assets/images/supply-chain/parts-bg.png");
                background-size: 100%;
                text-align: center;
                color: #fff;
                font-size: 16px;
                font-weight: 600;
                margin-left: 20%;
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
        .contact-information,
        .basic-information,
        .equipment-information,
        .supplementary-information {
            padding: 20px;
            box-sizing: border-box;
            .information-container-form {
                display: flex;
                .sub-title {
                    width: 20%;
                    text-align: right;
                    color: #1d2129;
                    font-size: 16px;
                    font-weight: 400;
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
                    width: 20%;
                    text-align: right;
                    color: #1d2129;
                    font-size: 16px;
                    font-weight: 400;
                }
                .information-form {
                    margin-left: 50px;
                    width: 80%;

                    .materials-img {
                        width: 80px;
                        height: 80px;
                        border-radius: 4px;
                        border: 1px solid #d9d9d9;
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
}

.m-t-0 {
    margin-top: 0;
}
.m-l-4 {
    margin-left: 4px;
}
.m-l-8 {
    margin-left: 8px;
}
.m-l-16 {
    margin-left: 16px;
}
.m-t-16 {
    margin-top: 16px;
}
.m-t-30 {
    margin-top: 30px;
}
.m-t-40 {
    margin-top: 40px;
}

.w-50-percentage {
    width: 50%;
}
.w-80 {
    min-width: 80px;
}
.w-130 {
    min-width: 130px;
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

:deep(.ant-table-wrapper) {
    border: 1px solid #EAECF2; 
}
</style>
