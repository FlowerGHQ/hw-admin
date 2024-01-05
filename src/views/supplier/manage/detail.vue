<template>
    <div class="supply-detail">
        <div class="back"></div>
        <!-- 基本信息 -->
        <div class="base-message">
            <div class="msg-header">
                <span class="m-l-4">基本信息</span>
            </div>
            <!-- 供应类型 -->
            <div class="supply-type bg-color m-t-16">
                <div class="title">供应类型</div>
                <div class="btn-type-parts">
                    <MySvgIcon icon-class="parts-icon" />
                    <span class="m-l-4">零件类</span>
                </div>
            </div>
            <!-- 联系方式 -->
            <div class="contact-information bg-color m-t-16">
                <div class="title">联系方式</div>
                <div class="contact-container">
                    <!-- 职位 -->
                    <div class="level-search-row">
                        <div class="search-col required">
                            <div class="key w-130 t-a-r text-color">职位</div>
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
                            <div class="key w-130 t-a-r text-color">姓名</div>
                            <div class="value m-l-8">
                                <div class="customer-input">
                                    {{ msgDetail.contact_info?.name || "-" }}
                                </div>
                            </div>
                        </div>
                        <!-- 邮箱 -->
                        <div class="search-col required">
                            <div class="key w-130 t-a-r text-color">邮箱</div>
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
                            <div class="key w-130 t-a-r text-color">联系方式</div>
                            <div class="value m-l-8">
                                <div class="customer-input">
                                    {{ msgDetail.contact_info?.phone || "-" }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 基本信息 -->
            <div class="basic-information bg-color m-t-16">
                <div class="title">基本信息</div>
                <!-- 公司概况 -->
                <div class="information-container-form">
                    <div class="sub-title">公司概况</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 公司名称 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">公司名称</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.company_info?.name || "-" }}
                                    </div>
                                </div>
                            </div>
                            <!-- 公司网址 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">公司网址</div>
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
                                <div class="key w-130 t-a-r text-color">成立日期</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{
                                            msgDetail?.company_info?.established_time
                                                ? $Util.timeFilter(msgDetail?.company_info?.established_time)
                                                : "-"
                                        }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 详细地址 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">详细地址</div>
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
                                <div class="key w-130 t-a-r text-color">公司性质</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.company_info?.nature || "-" }}
                                    </div>
                                </div>
                            </div>
                            <div class="search-col">
                                <!-- 采购半径 -->
                                <div class="key w-130 t-a-r text-color">采购半径</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.company_info?.purchasing_radius || "-" }}
                                        <div class="unit">KM</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 占地面积 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">占地面积</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.company_info?.floor_area || "-" }}
                                        <div class="unit">m²</div>
                                    </div>
                                </div>
                            </div>
                            <div class="search-col">
                                <!-- 建筑面积 -->
                                <div class="key w-130 t-a-r text-color">建筑面积</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.company_info?.building_area || "-" }}
                                        <div class="unit">m²</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <div class="search-col">
                                <!-- 母公司名称 -->
                                <div class="key w-130 t-a-r text-color">母公司名称</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.company_info?.parent_company_name || "-" }}
                                    </div>
                                </div>
                            </div>
                            <div class="search-col">
                                <!-- 母公司地址 -->
                                <div class="key w-130 t-a-r text-color">母公司地址</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.company_info?.parent_company_address || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 人力资源 -->
                <div class="information-container-form m-t-40">
                    <div class="sub-title">人力资源</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 员工总数 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">员工总数</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.human_resource?.total_employees || "-" }}
                                    </div>
                                </div>
                            </div>
                            <!-- 管理人数 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">管理人数</div>
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
                                <div class="key w-130 t-a-r text-color">质量人数</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.human_resource?.mass_number || "-" }}
                                    </div>
                                </div>
                            </div>
                            <!-- 技术人数 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">技术人数</div>
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
                                <div class="key w-130 t-a-r text-color">技术工龄</div>
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
                    <div class="sub-title">财务信息</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 法律纠纷 -->
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">法律纠纷</div>
                                <div class="value m-l-8">
                                    <a-radio :checked="true">
                                        {{
                                            msgDetail.financial_info?.average_monthly_wage_of_operating_workers
                                                ? "无"
                                                : "有"
                                        }}
                                    </a-radio>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 操作工人月平均工资 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">操作工人月平均工资</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.financial_info?.average_monthly_wage_of_operating_workers || "-" }}
                                    </div>
                                </div>
                            </div>
                            <!-- 管理职员人均年产值 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">管理职员人均年产值</div>
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
                                <div class="key w-130 t-a-r text-color">账期要求</div>
                                <div class="value m-l-8">
                                    <a-radio :checked="true">
                                        <!-- {{ msgDetail.financial_info?.account_period_requirement || "-" }} -->
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
                                                $t(Core.Const.SUPPLAY.ACCOUNt_PERIOD_REQUIREMENT[msgDetail.financial_info?.account_period_requiremen].unit) : ""
                                            }}
                                        </template>
                                    </a-radio>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <!-- 发票类型 -->
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">发票类型</div>
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
                    <div class="sub-title">营业信息</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <!-- 业务比重 -->
                            <div class="search-col w-50-percentage required">
                                <div class="key w-130 t-a-r text-color">业务比重</div>
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
                                        <div class="search-col">
                                            <div class="key w-130 t-a-r text-color">销售额</div>
                                            <div class="value m-l-8">
                                                <div class="customer-input">
                                                    {{ item?.sales || "-" }}
                                                    <div class="unit">万元</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="level-search-row">
                                        <div class="search-col">
                                            <div class="key w-130 t-a-r text-color">纳税额</div>
                                            <div class="value m-l-8">
                                                <div class="customer-input">
                                                    {{ item?.taxes_paid || "-" }}
                                                    <div class="unit">万元</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="level-search-row">
                                        <div class="search-col">
                                            <div class="key w-130 t-a-r text-color">利润率</div>
                                            <div class="value m-l-8">
                                                <div class="customer-input">
                                                    {{ item?.profit_margin || "-" }}
                                                    <div class="unit">%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="level-search-row">
                                        <div class="search-col">
                                            <div class="key w-130 t-a-r text-color">资产负债率</div>
                                            <div class="value m-l-8">
                                                <div class="customer-input">
                                                    {{ item?.asset_liability_ratio || "-" }}
                                                    <div class="unit">%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="level-search-row">
                                        <div class="search-col">
                                            <div class="key w-130 t-a-r text-color">现金流量比率</div>
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
                <div class="information-container-form m-t-40">
                    <div class="sub-title">竞争对手</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">竞争对手信息</div>
                                <div class="value m-l-8" style="width: 70%">
                                    <a-table
                                        :columns="competitionColumns"
                                        :data-source="msgDetail.competitor_analysis"
                                        :pagination="false"
                                    >
                                        <template #bodyCell="{ column, text, record, index }">
                                            <!-- 公司名称 -->
                                            <template v-if="column.key === 'company_name'"> </template>
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
                    <div class="sub-title">客户信息</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">主要客户</div>
                                <div class="value m-l-8" style="width: 70%">
                                    <a-table
                                        :columns="customerInfoColumns"
                                        :data-source="msgDetail.customer_info"
                                        :pagination="false"
                                    >
                                        <template #bodyCell="{ column, text, record, index }">
                                            <!-- 序号 -->
                                            <template v-if="column.key === 'index'">
                                                <div class="customerInfoColumns-index">主要客户{{ index + 1 }}</div>
                                            </template>
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
                                                {{ text ? $Util.timeFilter(text, 3) : "-" }}
                                            </template>
                                        </template>
                                    </a-table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 技术信息 -->
                <div class="information-container-form m-t-40">
                    <div class="sub-title">技术信息</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <div class="search-col w-50-percentage">
                                <div class="key w-130 t-a-r text-color">相关专利</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.technical_info?.patent || "-" }}
                                    </div>
                                </div>
                            </div>
                            <div class="search-col w-50-percentage">
                                <div class="key w-130 t-a-r text-color">研发中心</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.technical_info?.RD_center || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">研发合作机构</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.technical_info?.RD_partners || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">产品设计</div>
                                <div class="value m-l-8">
                                    <a-radio :checked="true">
                                        {{
                                            Core.Const.SUPPLAY.TECHNICAL_INFORMATION_OBJECT[msgDetail.technical_info?.product_design] ?
                                            $t(Core.Const.SUPPLAY.TECHNICAL_INFORMATION_OBJECT[msgDetail.technical_info?.product_design].t) : "-"
                                        }}
                                    </a-radio>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">过程设计</div>
                                <div class="value m-l-8">
                                    <a-radio :checked="true">                                        
                                        {{
                                            Core.Const.SUPPLAY.TECHNICAL_INFORMATION_OBJECT[msgDetail.technical_info?.process_design] ?
                                            $t(Core.Const.SUPPLAY.TECHNICAL_INFORMATION_OBJECT[msgDetail.technical_info?.process_design].t) : "-"
                                        }}
                                    </a-radio>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">过程验证</div>
                                <div class="value m-l-8">
                                    <a-radio :checked="true">                                        
                                        {{
                                            Core.Const.SUPPLAY.TECHNICAL_INFORMATION_OBJECT[msgDetail.technical_info?.process_validation] ?
                                            $t(Core.Const.SUPPLAY.TECHNICAL_INFORMATION_OBJECT[msgDetail.technical_info?.process_validation].t) : "-"
                                        }}
                                    </a-radio>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">设计软件</div>
                                <div class="value m-l-8">
                                    <div class="customer-input h-64">
                                        {{ msgDetail.technical_info?.design_software || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">开发流程</div>
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
                <div class="information-container-form m-t-40">
                    <div class="sub-title">质量信息</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">质量体系认证</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.quality_info?.certification || "-" }}
                                    </div>
                                </div>
                            </div>
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">环境体系认证</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.quality_info?.env_certification || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">质量合作机构</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.quality_info?.partners || "-" }}
                                    </div>
                                </div>
                            </div>
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">认可实验室</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.quality_info?.accredited_laboratory || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">质控工具软件</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.quality_info?.tool_software || "-" }}
                                    </div>
                                </div>
                            </div>
                            <div class="search-col">
                                <div class="key w-130 t-a-r text-color">计划体系认证</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail.quality_info?.system_certification || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">市场PPM</div>
                                <div class="value m-l-8">
                                    <div class="customer-input h-64">
                                        {{ msgDetail.quality_info?.PPM || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 产能产线 -->
                <div class="information-container-form m-t-40">
                    <div class="sub-title">产能产线</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">关键自有工序</div>
                                <div class="value m-l-8">
                                    <div class="customer-input h-64">
                                        {{ msgDetail.produce_capacity?.processes || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">智能自动化线</div>
                                <div class="value m-l-8">
                                    <div class="customer-input h-64">
                                        {{ msgDetail.produce_capacity?.automation_line || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">生产产能负荷</div>
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
                <div class="information-container-form m-t-40">
                    <div class="sub-title">外购管理</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">外购工艺</div>
                                <div class="value m-l-8">
                                    <div class="customer-input h-64">
                                        {{ msgDetail.outsourcing?.technology || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">外购备件</div>
                                <div class="value m-l-8">
                                    <div class="customer-input h-64">
                                        {{ msgDetail.outsourcing?.parts || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">外购原料</div>
                                <div class="value m-l-8">
                                    <div class="customer-input h-64">
                                        {{ msgDetail.outsourcing?.material || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">外购制度</div>
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
            <div class="equipment-information bg-color m-t-16">
                <div class="title">设备信息</div>
                <div class="information-container-form">
                    <div class="sub-title">关键生产设备</div>
                    <div class="information-form">
                        <a-table
                            :columns="deviceColumns"
                            :data-source="msgDetail.production_equipment"
                            :pagination="false"
                        ></a-table>
                    </div>
                </div>
                <div class="information-container-form m-t-40">
                    <div class="sub-title">关键检测设备</div>
                    <div class="information-form">
                        <a-table
                            :columns="deviceColumns"
                            :data-source="msgDetail.production_equipment"
                            :pagination="false"
                        ></a-table>
                    </div>
                </div>
            </div>
            <!-- 补充信息 -->
            <div class="supplementary-information bg-color m-t-16">
                <div class="title">补充信息</div>
                <div class="information-container-form">
                    <div class="sub-title"></div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">其他优势说明</div>
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
                <span class="m-l-4">材料清单</span>
            </div>
            <!-- 基本信息 -->
            <div class="materials-basic-information bg-color m-t-16">
                <div class="title">基本信息</div>
                <div class="information-container-form">
                    <div class="sub-title">营业执照照片</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">营业执照照片</div>
                                <div class="value m-l-8">
                                    <template
                                        v-for="(item, index) in [
                                            msgDetail.confirmatory_material?.business_license_photo,
                                            msgDetail.confirmatory_material?.business_license_photo,
                                        ]"
                                        :key="index"
                                    >
                                        <img
                                            class="materials-img"
                                            :class="{ 'm-l-16': index > 0 }"
                                            :src="item"
                                            alt=""
                                        />
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">注册资本</div>
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
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">营业期限</div>
                                <div class="value m-l-8" style="display: flex; align-items: center">
                                    <a-radio :checked="true">                                         
                                        {{
                                            Core.Const.SUPPLAY.BUSINESS_TERM[msgDetail.confirmatory_material?.business_duration_type] ?
                                            $t(Core.Const.SUPPLAY.BUSINESS_TERM[msgDetail.confirmatory_material?.business_duration_type].t) : "-"
                                        }}
                                    </a-radio>
                                    <div class="bussiness-time">
                                        {{
                                            msgDetail?.confirmatory_material?.begin_business_time
                                                ? $Util.timeFilter(
                                                      msgDetail?.confirmatory_material?.begin_business_time
                                                  )
                                                : "-"
                                        }}
                                        -
                                        {{
                                            msgDetail?.confirmatory_material?.end_business_time
                                                ? $Util.timeFilter(msgDetail?.confirmatory_material?.end_business_time)
                                                : "-"
                                        }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="information-container-form m-t-40">
                    <div class="sub-title">银行开票资料</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">开户名</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.confirmatory_material?.account_name || "-" }}
                                    </div>
                                </div>
                            </div>
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">开户行</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.confirmatory_material?.account_with_bank || "-" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">开户行号</div>
                                <div class="value m-l-8">
                                    <div class="customer-input">
                                        {{ msgDetail?.confirmatory_material?.account_with_bank_number || "-" }}
                                    </div>
                                </div>
                            </div>
                            <div class="search-col required">
                                <div class="key w-130 t-a-r text-color">银行账号</div>
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
                    <div class="sub-title">质量体系证书</div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">质量体系证书</div>
                                <div class="value m-l-8">
                                    <template
                                        v-for="(item, index) in [
                                            msgDetail.confirmatory_material?.quality_system_certificate,
                                            msgDetail.confirmatory_material?.quality_system_certificate,
                                        ]"
                                        :key="index"
                                    >
                                        <img
                                            class="materials-img"
                                            :class="{ 'm-l-16': index > 0 }"
                                            :src="item"
                                            alt=""
                                        />
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 其他证实性材料 -->
            <div class="other-materials bg-color m-t-16">
                <div class="title">其他证实性材料</div>
                <div class="information-container-form m-t-40">
                    <div class="sub-title"></div>
                    <div class="information-form">
                        <div class="level-search-row">
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">开户行许可证</div>
                                <div class="value m-l-8">
                                    <template
                                        v-for="(item, index) in [
                                            msgDetail.confirmatory_material?.account_opening_bank_license,
                                            msgDetail.confirmatory_material?.account_opening_bank_license,
                                        ]"
                                        :key="index"
                                    >
                                        <img
                                            class="materials-img"
                                            :class="{ 'm-l-16': index > 0 }"
                                            :src="item"
                                            alt=""
                                        />
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">环评证书</div>
                                <div class="value m-l-8">
                                    <template
                                        v-for="(item, index) in [
                                            msgDetail.confirmatory_material?.eia_certificate,
                                            msgDetail.confirmatory_material?.eia_certificate,
                                        ]"
                                        :key="index"
                                    >
                                        <img
                                            class="materials-img"
                                            :class="{ 'm-l-16': index > 0 }"
                                            :src="item"
                                            alt=""
                                        />
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="level-search-row">
                            <div class="search-col align-flex-start">
                                <div class="key w-130 t-a-r text-color">环保报告</div>
                                <div class="value m-l-8">
                                    <template
                                        v-for="(item, index) in [
                                            msgDetail.confirmatory_material?.environmental_report,
                                            msgDetail.confirmatory_material?.environmental_report,
                                        ]"
                                        :key="index"
                                    >
                                        <img
                                            class="materials-img"
                                            :class="{ 'm-l-16': index > 0 }"
                                            :src="item"
                                            alt=""
                                        />
                                    </template>
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
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import Core from "@/core";
import MySvgIcon from "@/components/MySvgIcon/index.vue";

const route = useRoute();
const msgDetail = ref({});

// 关键设备和关键检测设备
const deviceColumns = computed(() => {
    let columns = [
        { title: "生产设备名称", dataIndex: "name", key: "name" },
        { title: "规格型号", dataIndex: "spec", key: "spec" },
        { title: "数量", dataIndex: "quantity", key: "quantity" },
        { title: "设备制造商", dataIndex: "manufacturer", key: "manufacturer" },
        { title: "购置年限", dataIndex: "purchase_period", key: "purchase_period" },
    ];
    return columns;
});
// 竞争对手信息
const competitionColumns = computed(() => {
    let columns = [
        { title: "公司名称", dataIndex: "company_name", key: "company_name" },
        { title: "市场份额", dataIndex: "market_share", key: "market_share" },
        { title: "了解评价", dataIndex: "understand_evaluation", key: "understand_evaluation" },
    ];
    return columns;
});
// 客户信息
const customerInfoColumns = computed(() => {
    let columns = [
        { title: "客户序号", dataIndex: "index", key: "index" },
        { title: "客户名称", dataIndex: "customer_name", key: "customer_name" },
        { title: "销售占比", dataIndex: "sales_share", key: "sales_share" },
        { title: "主供零件", dataIndex: "main_supply_part", key: "main_supply_part" },
        { title: "开始合作时间", dataIndex: "begin_cooperation_time", key: "begin_cooperation_time" },
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
        })
        .catch((err) => {
            console.log("getPhoneCodeFetchs err", err);
        });
}
/* Fetch end*/
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
    .back {
    }
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
                margin-left: 20%;
                background-image: url("../../../assets/images/supply-chain/parts-bg.png");
                background-size: 100%;
                text-align: center;
                color: #fff;
                font-size: 16px;
                font-weight: 600;
            }
        }
        // 联系方式
        .contact-information {
            padding: 20px;
            box-sizing: border-box;

            .contact-container {
                margin-left: 20%;
            }
        }
        .basic-information,
        .equipment-information,
        .supplementary-information {
            padding: 20px;
            box-sizing: border-box;
        }
        // 基本信息
        .basic-information {
            .information-container-form {
                display: flex;
                .sub-title {
                    width: 20%;
                    padding-top: 15px;
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

            .customerInfoColumns-index {
                width: 95px;
                height: 32px;
                line-height: 32px;
                background-color: #f2f3f5;
                color: #666;
                font-size: 14px;
                font-weight: 400;
                text-align: center;
            }

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
        }
        // 设备信息
        .equipment-information,
        .supplementary-information {
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
        // 补充信息
        .supplementary-information {
        }
    }
    // 材料清单
    .materials-message {
        .materials-basic-information,
        .other-materials {
            padding: 20px;
            box-sizing: border-box;
        }
        .materials-basic-information,
        .other-materials {
            .information-container-form {
                display: flex;
                .sub-title {
                    width: 20%;
                    padding-top: 15px;
                    text-align: right;
                    color: #1d2129;
                    font-size: 16px;
                    font-weight: 400;
                }
                .information-form {
                    width: 80%;

                    .materials-img {
                        width: 80px;
                        height: 80px;
                        border-radius: 4px;
                    }
                }
            }
        }
        .materials-basic-information {
            .bussiness-time {
                border-radius: 4px;
                border: 1px solid #eaecf2;
                background: #f3f6f9;
                width: 236px;
                height: 32px;
                line-height: 32px;
                text-align: center;

                color: #1d2129;
                font-size: 14px;
                font-weight: 400;
            }
        }
    }

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
</style>
