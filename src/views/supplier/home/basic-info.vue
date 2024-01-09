<template>
    <!-- 
        1.零件类

        职务
        姓名
        电话
        电子邮箱

        公司名称
        详细地址
        成立日期
        注册资本
        法人代表

        占地面积
        账期要求
        开具发票
        
        2.代理类

        职务
        姓名
        电话
        电子邮箱

        公司名称
        详细地址
        成立日期
        注册资本
        法人代表
        
        法律纠纷111111
        占地面积000000
        账期要求
        开具发票

        业务比重111111
        销售额*11111
        纳税额*111111
        利润率*111111
        资产负债率*111111
        现金流量比率*111111

        客户信息111111

        3.外协类

        职务
        姓名
        电话
        电子邮箱

        公司名称
        详细地址
        成立日期
        注册资本
        法人代表

        法律纠纷*111111111
        占地面积000000
        账期要求
        开具发票

        销售额*1111111
        产能产线: all 111111

        4.模具类

        职务
        姓名
        电话
        电子邮箱

        公司名称
        详细地址
        成立日期
        注册资本
        法人代表

        法律纠纷1111111
        占地面积00000
        账期要求
        开具发票
        
        关键生产设备**11111111
        关键检测设备**11111111


        5.客指类

        职务
        姓名
        电话
        电子邮箱

        公司名称
        详细地址
        成立日期
        注册资本
        法人代表

        法律纠纷1111111
        占地面积00000
        账期要求
        开具发票


        销售额*111111
        指定信息11111
     -->
  <div class="material-list">
      <div class="base-info content-area top-box">
          <div class="title">{{ $t("supply-chain.type_supply") }}</div>
          <div class="base-info-form flex-1" >
              <a-row :gutter="24" style="flex: 1;">
                  <a-col :span="2" class="title-area align-center">
                      <div class="title-two">
                      </div>
                  </a-col>
                  <a-col :span="22" >
                        <div class="top-type-box" >
                            <div class="type-parts" :class="{ 'click-type': item.value === formState.type, 'border-type':  item.value !== formState.type }" v-for="(item,index) in Core.Const.SUPPLAY.SUPPLAY_TYPE"  @click="formState.type = item.value">
                                <MySvgIcon :icon-class="`white-${item.icon}`" v-if="item.value === formState.type" class="white-font" />
                                <MySvgIcon :icon-class="`black-${item.icon}`" class="black-font" v-else /> 
                                <span class="m-l-4 type-font" :class="{ 'color-w' : item.value === formState.type }">
                                    {{ Core.Const.SUPPLAY.SUPPLAY_TYPE[item.value] ? $t(Core.Const.SUPPLAY.SUPPLAY_TYPE[item.value].t) : "-" }}
                                </span>
                            </div>
                        </div>
                  </a-col>
              </a-row>
          </div>
      </div>
      <div class="base-info content-area margin-t-20">
          <div class="title">{{ $t("supply-chain.contact") }}</div>
          <div class="base-info-form" >
              <a-form
                  ref="formRef1"
                  name="custom-validation"
                  :model="formState"
                  :rules="rules"
                  labelAlign="right">
                  <a-row :gutter="24">
                      <a-col :span="3" class="title-area" >
                          <div class="title-two">
                          </div>
                      </a-col>
                      <a-col :span="21">
                          <a-row :gutter="24">
                              <a-col :span="24">
                                  <!-- 职业 -->
                                  <a-form-item
                                      :label="
                                          $t(
                                              'supply-chain.Position'
                                          ) 
                                      "
                                      name="positon"
                                      >
                                      <a-radio-group
                                                v-model:value="formState.position"
                                                name = "positon"
                                            >
                                                <a-radio :value="radio.value" v-for="radio in Core.Const.SUPPLAY.POSITION" :key="radio.value" >{{ $t(radio.t) }}</a-radio>
                                      </a-radio-group>
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="12">
                                  <!-- 姓名 -->
                                  <a-form-item :label="$t('supply-chain.name')" name="contact_name">
                                      <a-input :maxlength="7" name="contact_name" v-model:value="formState.contact_info.name" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                              <a-col :span="12">
                                  <!-- 联系人邮箱 -->
                                  <a-form-item
                                      :label="$t('supply-chain.mailbox')"
                                      name="contact_email">
                                      
                                      <a-input name="contact_email" v-model:value="formState.contact_info.email" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="12">
                                  <!-- 联系方式 -->
                                  <a-form-item
                                      :label="$t('supply-chain.contact')"
                                      name="contact_flag_phone">
                                      
                                      <a-input name="contact_flag_phone" v-model:value="formState.contact_info.phone" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                              <a-col :span="12">
                                  <!-- 同步微信 -->
                                  <a-form-item>
                                      <a-checkbox  v-model:checked="formState.contact_info.flag_wechat">{{ $t('supply-chain.wechat_same_number') }}</a-checkbox>
                                      
                                  </a-form-item>
                              </a-col>
                          </a-row>
                      </a-col>
                  </a-row>
              </a-form>
          </div>
      </div>
      <div class="base-info content-area margin-t-20">
          <div class="title">{{ $t("supply-chain.basic_info") }}</div>
          <div class="base-info-form" >
              <a-form
                  ref="formRef2"
                  name="custom-validation"
                  :model="formState"
                  :rules="rules"
                  labelAlign="right">
                  <!-- 公司概况 -->
                  <a-row :gutter="24">
                      <a-col :span="3" class="title-area" >
                          <div class="title-two">
                              <!-- 公司概况 -->
                              {{ $t("supply-chain.company_profile") }}
                          </div>
                      </a-col>
                      <a-col :span="21">
                          <a-row :gutter="24">
                              <!-- 公司名称 -->
                              <a-col :span="12">
                                  <a-form-item
                                      :label="$t('supply-chain.company_name')"
                                       name="company_name_name">
                                       <a-input name="company_name_name" v-model:value="formState.company_info.name" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                              <!-- 公司网址 -->
                              <a-col :span="12">
                                  <a-form-item
                                      :label="$t('supply-chain.company_website')"
                                       name="company_website">
                                       <a-input name="company_website" v-model:value="formState.company_info.website_address" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="12">
                                  <!-- 成立日期 -->
                                  <a-form-item :label="$t('supply-chain.date_establishment')" name="date_establishment">
                                    <span name="date_establishment">
                                        <a-date-picker  valueFormat="YYYY-MM-DD"  v-model:value="formState.company_info.established_time" />
                                    </span>
                                  </a-form-item>
                              </a-col>
                              <!-- 法人代表 -->
                              <a-col :span="12">
                                  <a-form-item
                                      :label="$t('supply-chain.legal_representative')"
                                       name="legal_representative">
                                       <a-input name="legal_representative" v-model:value="formState.company_info.legal_person" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="24">
                                  <!-- 详细地址 -->
                                  <a-form-item
                                      :label="$t('supply-chain.detailed_address')"
                                      name="company_address">
                                      <a-input name="company_address" v-model:value="formState.company_info.address" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="12">
                                  <!-- 公司性质 -->
                                  <a-form-item
                                      :label="$t('supply-chain.nature_of_company')"
                                      >
                                     
                                    <a-select v-model:value="formState.company_info.nature" :placeholder="$t('supply-chain.please_select')">
                                      <a-select-option :value="item.value" v-for="item in Core.Const.SUPPLAY.NATURE"> {{ $t(item.t) }}</a-select-option>
                                    </a-select>
                                  </a-form-item>
                              </a-col>
                              <a-col :span="12">
                                  <!-- 采购半径 -->
                                  <a-form-item
                                      :label="$t('supply-chain.purchasing_radius')"
                                      >
                                      
                                      <a-input-number
                                                v-model:value="formState.company_info.purchasing_radius"
                                                :placeholder="$t('def.input')"
                                                :min="0"
                                                :max="1000000000"
                                            >
                                                <template #addonAfter>
                                                    <span class="l-w-h-style">KM</span>
                                                </template>
                                      </a-input-number>
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          
                          <a-row :gutter="24">
                              <a-col  :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part, Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers]) ? 12 : 0">
                                  <!-- 占地面积 -->
                                  <a-form-item
                                      :label="$t('supply-chain.floor_space')" >
                                      <a-input-number
                                                v-model:value="formState.company_info.floor_area"
                                                :placeholder="$t('def.input')"
                                                :min="0"
                                                :max="1000000000"
                                            >
                                                <template #addonAfter>
                                                    <span class="l-w-h-style">m²</span>
                                                </template>
                                      </a-input-number>
                                  </a-form-item>
                              </a-col>
                              <a-col :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers]) ? 12 : 0">
                                  <!-- 建筑面积 -->
                                  <a-form-item
                                      :label="$t('supply-chain.floor_area')"
                                      >
                                      
                                      <a-input-number
                                                v-model:value="formState.company_info.building_area"
                                                :placeholder="$t('def.input')"
                                                :min="0"
                                                :max="1000000000"
                                            >
                                                <template #addonAfter>
                                                    <span class="l-w-h-style">m²</span>
                                                </template>
                                      </a-input-number>
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col  :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers]) ? 12 : 0">
                                  <!-- 母公司名称 -->
                                  <a-form-item
                                      :label="$t('supply-chain.parent_company_name')" >
                                      
                                      <a-input v-model:value="formState.company_info.parent_company_name" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                              <a-col  :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part,Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers]) ? 12 : 0">
                                  <!-- 母公司地址 -->
                                  <a-form-item
                                      :label="$t('supply-chain.Parent_company_address')"
                                      >
                                     
                                      <a-input v-model:value="formState.company_info.parent_company_address" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                          </a-row>
                      </a-col>
                  </a-row>

                  <!-- 代理公司概况 -->
                  <a-row :gutter="24">
                      <a-col :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker]) ? 3 : 0" class="title-area" >
                          <div class="title-two">
                              <!-- 代理信息 -->
                              {{ $t("supply-chain.agent_information") }}
                          </div>
                      </a-col>
                      <a-col :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker]) ? 21 : 0">
                          <a-row :gutter="24">
                              <!-- 被代理公司 -->
                              <a-col :span="12">
                                  <a-form-item
                                      :label="$t('supply-chain.agent_company')"
                                        >
                                       <a-input v-model:value="formState.agent_info.agent_company" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                              <!-- 被代理地址 -->
                              <a-col :span="12">
                                  <a-form-item
                                      :label="$t('supply-chain.proxy_address')"
                                       name="company_website">
                                       <a-input name="company_website" v-model:value="formState.agent_info.agent_address" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="12">
                                  <!-- 被代理关系 -->
                                  <a-form-item
                                      :label="
                                          $t(
                                              'supply-chain.agency_relationship'
                                          )
                                      " >
                                          <a-date-picker  valueFormat="YYYY-MM-DD"  v-model:value="formState.agent_info.agent_relationship" />
                                  </a-form-item>
                              </a-col>
                              
                              <a-col :span="12">
                                  <!-- 代理有效期间 -->
                                  <a-form-item
                                      :label="$t('supply-chain.duration_of_agency')"
                                      name="duration_of_agency"
                                      >
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
                                  <a-form-item
                                      :label="$t('supply-chain.proxy_warrant')" name="proxy_warrant">
                                      <a-radio-group
                                                name="proxy_warrant"
                                                v-model:value="formState.agent_info.flag_agent_warrant"
                                            >
                                        <a-radio :value="radio.value" v-for="radio in Core.Const.SUPPLAY.Legal_Dispute" :key="radio.value" >
                                                {{  $t(radio.t)  }}
                                        </a-radio>
                                    </a-radio-group>

                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="24">
                                  <!-- 代理产品 -->
                                  <a-form-item
                                      :label="$t('supply-chain.agent_product')">
                                      <a-input v-model:value="formState.agent_info.agent_product" :placeholder="$t('supply-chain.please_enter')" /> 
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          
                      </a-col>
                  </a-row>
                  <a-row :gutter="24" >
                      <a-col :span="!returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker]) ? 3 : 0" class="title-area">
                          <div class="title-two">
                              {{
                                  $t("supply-chain.human_resources")
                              }}
                          </div>
                      </a-col>
                      <a-col :span="!returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker]) ? 21 : 0">
                          <a-row :gutter="24">
                              <a-col :span="12">                            
                                  <!-- 员工总数 -->
                                  <a-form-item
                                      :label="$t('supply-chain.total_number_of_employees')">
                                      <a-input-number
                                                v-model:value="formState.human_resource.total_employees"
                                                :placeholder="$t('def.input')"
                                                :min="0"
                                                :max="1000000000"
                                            >
                                      </a-input-number>
                                  </a-form-item>
                              </a-col>
                              <a-col :span="12">
                                  <!-- 管理人数 -->
                                  <a-form-item
                                      :label="
                                          $t('supply-chain.number_of_managers')
                                      ">
                                      <a-input-number
                                                v-model:value="formState.human_resource.manager_number"
                                                :placeholder="$t('def.input')"
                                                :min="0"
                                                :max="1000000000"
                                            >
                                      </a-input-number>
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="12">
                                  <!-- 质量人数 -->
                                  <a-form-item
                                      :label="$t('supply-chain.mass_number')">
                                      <a-input-number
                                                v-model:value="formState.human_resource.mass_number"
                                                :placeholder="$t('def.input')"
                                                :min="0"
                                                :max="1000000000"
                                            >
                                      </a-input-number>
                                  </a-form-item>
                              </a-col>
                              <a-col :span="12">
                                  <!-- 技术人数 -->
                                  <a-form-item
                                      :label="$t('supply-chain.skilled_personnel')">
                                      <a-input-number
                                                v-model:value="formState.human_resource.technician_number"
                                                :placeholder="$t('def.input')"
                                                :min="0"
                                                :max="1000000000"
                                            >
                                      </a-input-number>
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="12">
                                  <!-- 技术工龄 -->
                                  <a-form-item
                                      :label="$t('supply-chain.technical_seniority')">
                                      <a-input-number
                                                v-model:value="formState.human_resource.technical_seniority"
                                                :placeholder="$t('def.input')"
                                                :min="0"
                                                :max="1000000000"
                                            >
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
                              {{
                                  $t(
                                      "supply-chain.financial_information"
                                  )
                              }}
                          </div>
                      </a-col>
                      <a-col  :span="21">
                          <a-row :gutter="24" :span="21">
                              <a-col :span="24">
                                  <!-- 法律纠纷 -->
                                  <a-form-item 
                                      :label="$t('supply-chain.legal_dispute')" name="flag_legal_dispute">
                                      <a-radio-group name="flag_legal_dispute" v-model:value="formState.financial_info.flag_legal_dispute"
                                            >
                                                <a-radio :value="radio.value" v-for="radio in Core.Const.SUPPLAY.Legal_Dispute" :key="radio.value" >
                                                      {{ $t( radio.t ) }}
                                                </a-radio>
                                            </a-radio-group>
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="!returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker]) ? 12 : 0">
                                  <!-- 操作工人月平均工资 -->
                                  <a-form-item
                                      :label="$t('supply-chain.average')" >
                                      
                                      <a-input v-model:value="formState.financial_info.average_monthly_wage_of_operating_workers" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                              <a-col :span="!returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker]) ? 12 : 0">
                                  <!-- 管理职员人均年产值 -->
                                  <a-form-item
                                      :label="$t('supply-chain.per')"
                                      >
                                      <a-input v-model:value="formState.financial_info.per_capita_annual_output_value_of_management_staff" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="24">
                                  <!-- 账期要求 -->
                                  <a-form-item
                                      :label="
                                          $t(
                                              'supply-chain.period_requirement'
                                          )
                                      " name="period_requirement">
                                      
                                      <a-radio-group
                                                name="period_requirement"
                                                v-model:value="formState.financial_info.account_period_requirement"
                                            >
                                                <a-radio :value="radio.value" v-for="radio in Core.Const.SUPPLAY.ACCOUNt_PERIOD_REQUIREMENT_LIST" :key="radio.value" >
                                                      {{ `${ radio.value ? radio.value + $t(radio.unit): $t(radio.t) }` }}
                                                </a-radio>
                                            </a-radio-group>
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="24">
                                  <!-- 发票类型 -->
                                  <a-form-item
                                      :label="
                                          $t(
                                              'supply-chain.Invoice_type'
                                          )
                                      " name="Invoice_type">
                                      
                                      <a-radio-group
                                                name="Invoice_type"
                                                v-model:value="formState.financial_info.invoice_type"
                                            >
                                                <a-radio :value="radio.value" v-for="radio in Core.Const.SUPPLAY.INVOICE_TYPE" :key="radio.value" >
                                                  <span :class="{'middle-radio': radio.value === 1}">

                                                      {{  $t(radio.t) }}
                                                      <a-input :maxlength="50" v-model:value="formState.financial_info.invoice_range_value" placeholder="范围值" v-if="radio.value === 1" />
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
                              {{
                                  $t(
                                      "supply-chain.business_information"
                                  )
                              }}
                          </div>
                      </a-col>
                      <a-col :span="21">
                          <a-row :gutter="24">
                                  <a-col :span="12">
                                      <!-- 业务比重 -->
                                      <a-form-item
                                          :label="$t('supply-chain.proportion_of_business')
                                          " name="proportion_of_business">
                                          <a-input name="proportion_of_business" v-model:value="formState.business_info.proportion_of_business" :placeholder="$t('supply-chain.please_enter')" />
                                      </a-form-item>
                                  </a-col>
                          </a-row>
                          <!-- 近一年 二 三 -->
                          <a-row :gutter="24">
                                  <a-col :span="8">
                                      <a-form-item
                                          label="近1年"
                                          >
                                      </a-form-item>
                                  </a-col>
                                  <a-col :span="8">
                                      <a-form-item
                                          label="近2年"
                                          >
                                      </a-form-item>
                                  </a-col>
                                  <a-col :span="8">
                                    <a-form-item
                                          label="近3年"
                                          >
                                      </a-form-item>
                                  </a-col>
                          </a-row>
                          <a-row :gutter="24" >
                                  <a-col :span="8" v-for="(item,index) in 3">
                                    
                                      <!-- 销售额 -->
                                      <a-form-item
                                          :label="$t('supply-chain.sales_volume')"
                                          name="sales"
                                          >
                                          <span name="sales">
                                                <a-input-number
                                                            v-model:value="formState.business_info.list[index].sales"
                                                            :placeholder="$t('def.input')"
                                                            :min="0"
                                                            :max="1000000000"
                                                        >
                                                            <template #addonAfter>
                                                                <span class="l-w-h-style">万元</span>
                                                            </template>
                                                </a-input-number>
                                          </span>
                                      </a-form-item>
                                  </a-col>
                          </a-row>
                          <a-row :gutter="24">
                                  <a-col  :span="!returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers]) ? 8 : 0" v-for="(item,index) in 3">
                                    
                                      <!-- 纳税额 -->
                                      <a-form-item
                                          :label="$t('supply-chain.tax_amount')"
                                          >
                                          
                                          <a-input-number
                                                    v-model:value="formState.business_info.list[index].taxes_paid"
                                                    :placeholder="$t('def.input')"
                                                    :min="0"
                                                    :max="1000000000"
                                                >
                                                    <template #addonAfter>
                                                        <span class="l-w-h-style">万元</span>
                                                    </template>
                                          </a-input-number>
                                      </a-form-item>
                                  </a-col>
                          </a-row>
                          <a-row :gutter="24">
                                  <a-col :span="!returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers]) ? 8 : 0" v-for="(item,index) in 3">
                                    
                                      <!-- 利润率 -->
                                      <a-form-item
                                          :label="$t('supply-chain.profit_rate')"
                                          >
                                          
                                          <a-input-number
                                                    v-model:value="formState.business_info.list[index].profit_margin"
                                                    :placeholder="$t('def.input')"
                                                    :min="0"
                                                    :max="1000000000"
                                                >
                                                    <template #addonAfter>
                                                        <span class="l-w-h-style">%</span>
                                                    </template>
                                          </a-input-number>
                                      </a-form-item>
                                  </a-col>
                          </a-row>
                          <a-row :gutter="24">
                                  <a-col  :span="!returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers]) ? 8 : 0" v-for="(item,index) in 3">
                                    
                                      <!-- 资产负债率 -->
                                      <a-form-item
                                          :label="$t('supply-chain.asset_liability_ratio')"
                                          >
                                          
                                          <a-input-number
                                                    v-model:value="formState.business_info.list[index].asset_liability_ratio"
                                                    :placeholder="$t('def.input')"
                                                    :min="0"
                                                    :max="1000000000"
                                                >
                                                    <template #addonAfter>
                                                        <span class="l-w-h-style">%</span>
                                                    </template>
                                          </a-input-number>
                                      </a-form-item>
                                  </a-col>
                          </a-row>
                          <a-row :gutter="24">
                                  <a-col  :span="!returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers]) ? 8 : 0" v-for="(item,index) in 3">
                                    
                                      <!-- 现金流量比率 -->
                                      <a-form-item
                                          :label="$t('supply-chain.cash_flow_ratio')"
                                          >
                                          
                                          <a-input-number
                                                    v-model:value="formState.business_info.list[index].cash_flow_ratio"
                                                    :placeholder="$t('def.input')"
                                                    :min="0"
                                                    :max="1000000000"
                                                >
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
                      <a-col :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part]) ? 3 : 0" class="title-area">
                          <div class="title-two">
                              {{
                                  $t(
                                      "supply-chain.competitor"
                                  )
                              }}
                          </div>
                      </a-col>
                      <a-col :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part]) ? 21 : 0">
                            
                        <div class="form-content-item-table" >
                            <a-table
                                :columns="competitor_analysis_column"
                                :dataSource="formState.competitor_analysis"
                                :scroll="{ x: true }"
                                :row-key="(record) => record.id"
                                :pagination="false"
                                class="specific-table"
                            >
                                  <template #bodyCell="{ column, record, index }">
                                      <!-- 客户序号 -->
                                      <template
                                          v-if="column.dataIndex === 'company_order'"
                                      >
                                          {{ record.company_order }}
                                      </template> 
                                      <template
                                          v-if="column.type === 'input'"
                                      >
                                          <a-input 
                                              v-model:value="record[column.dataIndex]"
                                              :placeholder="$t('def.input')"
                                          />
                                      </template>
                                      <template
                                          v-else-if="column.type === 'input-num'"
                                      >
                                          <a-input-number
                                              v-model:value="record[column.dataIndex]"
                                              :placeholder="$t('def.input')"
                                              :min="0"
                                              :max="1000000000"
                                          >
                                              <template #addonAfter v-if="column.unit">
                                                  <span class="l-w-h-style">{{ column.unit }}</span>
                                              </template>
                                          </a-input-number>
                                      </template>
                                      <template
                                          v-else-if="column.type === 'time'"
                                      >
                                          <a-date-picker valueFormat="YYYY-MM-DD"  v-model:value="record[column.dataIndex]" />
                                      </template>
                                      <template
                                          v-else-if="column.dataIndex === 'operation'"
                                      >
                                          <a-button
                                              type="link"
                                              v-if="index"
                                              @click="handleDelete(formState.competitor_analysis ,record ,'竞争对手' ,'company_order')"
                                              >
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
                                  @click="handleAddSpecItem(formState.competitor_analysis ,competitor_analysis_obj ,'竞争对手' ,'company_order')"
                                  >
                                  添加对手
                              </a-button
                              >
                          </div>
                      </a-col>
                  </a-row>

                  <!-- 客户信息 -->
                  <a-row :gutter="24">
                      <a-col :span="3" class="title-area">
                          <div class="title-two" id="customer_information"> 
                              {{
                                  $t(
                                      "supply-chain.customer_information"
                                  )
                              }}
                          </div>
                      </a-col>
                      <a-col :span="21">
                            <!-- 主要客户 -->
                            <div class="form-content-item-table" >
                                <a-table
                                :columns="customer_info_list_column"
                                :dataSource="formState.customer_info"
                                :scroll="{ x: true }"
                                :row-key="(record) => record.id"
                                :pagination="false"
                                class="specific-table"
                            >
                                    <template #bodyCell="{ column, record, index }">
                                        <!-- 客户序号 -->
                                        <!-- <template
                                            v-if="column.dataIndex === 'customer_order'"
                                        >
                                            {{ record.customer_order }}
                                        </template>  -->
                                        <template
                                            v-if="column.type === 'input'"
                                        >
                                            <a-input 
                                                v-model:value="record[column.dataIndex]"
                                                :placeholder="$t('def.input')"
                                            />
                                        </template>
                                        <template
                                            v-else-if="column.type === 'input-num'"
                                        >
                                            <a-input-number
                                                v-model:value="record[column.dataIndex]"
                                                :placeholder="$t('def.input')"
                                                :min="0"
                                                :max="1000000000"
                                            >
                                                <template #addonAfter v-if="column.unit">
                                                    <span class="l-w-h-style">{{ column.unit }}</span>
                                                </template>
                                            </a-input-number>
                                        </template>
                                        <template
                                            v-else-if="column.type === 'time'"
                                        >
                                            <a-date-picker valueFormat="YYYY-MM-DD"  v-model:value="record[column.dataIndex]" />
                                        </template>
                                        <template
                                            v-else-if="column.dataIndex === 'operation'"
                                        >
                                            <a-button
                                                type="link"
                                                v-if="index"
                                                @click="handleDelete(formState.customer_info ,record , '主要客户','customer_order')"
                                                >
                                                <i class="icon i_delete" />
                                                    {{
                                                        $t("def.delete")
                                                    }}
                                                </a-button
                                            >
                                        </template>
                                    </template>
                                </a-table>
                                <a-button
                                    class="spec-add"
                                    type="primary"
                                    ghost
                                    @click="handleAddSpecItem(formState.customer_info ,customer_info_list_obj ,'主要客户' ,'customer_order')"
                                    >
                                    添加客户
                                </a-button
                                >
                            </div>
                      </a-col>
                  </a-row>
                  
                  <!-- 技术信息 -->
                  <a-row :gutter="24">
                      <a-col :span="!returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers]) ? 3 : 0" class="title-area">
                          <div class="title-two">
                              {{
                                  $t(
                                      "supply-chain.Technical_information"
                                  )
                              }}
                          </div>
                      </a-col>
                      <a-col :span="!returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker,Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers]) ? 21 : 0">
                          <a-row :gutter="24">
                              <a-col :span="12">
                                <!-- 相关专利 -->
                                  <a-form-item
                                      :label="$t('supply-chain.related_patent')" >
                                      <a-input v-model:value="formState.technical_info.patent" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                              <a-col :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part]) ? 12 : 0">
                                
                                  <!-- 研发中心 -->
                                  <a-form-item
                                      :label="$t('supply-chain.research_and_development_center')" >
                                      <a-input v-model:value="formState.technical_info.RD_center" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part]) ? 24 : 0">
                                <!-- 研发合作机构 -->
                                  <a-form-item
                                      :label="$t('supply-chain.r_d_partner')" >
                                      <a-input v-model:value="formState.technical_info.RD_partners" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part]) ? 24 : 0">
                                
                                  <!-- 产品设计 -->
                                  <a-form-item 
                                      :label="$t('supply-chain.product_design')">
                                      <a-checkbox-group v-model:value="formState.technical_info.product_design" :options="Core.Const.SUPPLAY.TECHNICAL_INFORMATION" />

                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="24">
                                
                                  <!-- 过程设计 -->
                                  <a-form-item 
                                      :label="$t('supply-chain.process_design')">
                                      <a-checkbox-group v-model:value="formState.technical_info.process_design" :options="Core.Const.SUPPLAY.PROCESS_DESIGN" />

                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="24">
                                
                                  <!-- 过程验证 -->
                                  <a-form-item 
                                      :label="$t('supply-chain.process_verification')">
                                      <a-checkbox-group v-model:value="formState.technical_info.process_validation" :options="Core.Const.SUPPLAY.PROCESS_VALIDATION" />

                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="24">
                                
                                  <!-- 设计软件 -->
                                  <a-form-item 
                                      :label="$t('supply-chain.design_software')">
                                      <a-textarea :row="6" :maxlength="2000" v-model:value="formState.technical_info.design_software"  placeholder="请输入" autocomplete="off" />

                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="24">
                                
                                  <!-- 开发流程 -->
                                  <a-form-item 
                                      :label="$t('supply-chain.development_process')">
                                      <a-textarea :row="6" :maxlength="2000" v-model:value="formState.technical_info.dev_process"  :placeholder="$t('supply-chain.please_enter')" autocomplete="off" />
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col  :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part, Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold]) ? 24 : 0" >
                                
                                  <!-- 设计规范 -->
                                  <a-form-item 
                                      :label="$t('supply-chain.design_specifications')">
                                      <a-textarea :row="6" :maxlength="2000" v-model:value="formState.technical_info.design_guides"  :placeholder="$t('supply-chain.please_enter')" autocomplete="off" />
                                  </a-form-item>
                              </a-col>
                          </a-row>
                      </a-col>
                  </a-row>
                  <!-- 质量信息 -->
                  <a-row :gutter="24">
                      <a-col :span="!returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker, Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold]) ? 3 : 0"  class="title-area">
                          <div class="title-two">
                              {{
                                  $t(
                                      "supply-chain.quality_information"
                                  )
                              }}
                          </div>
                      </a-col>
                      <a-col :span="!returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker, Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Mold]) ? 21 : 0" >
                          <a-row :gutter="24">
                                  <a-col :span="12">
                                    <!-- 质量体系认证 -->
                                      <a-form-item
                                          :label="$t('supply-chain.quality_system_certification')" >
                                          <a-input v-model:value="formState.quality_info.certification" :placeholder="$t('supply-chain.please_enter')" />
                                      </a-form-item>
                                  </a-col>
                                  <a-col :span="12">
                                    
                                      <!-- 环境体系认证 -->
                                      <a-form-item
                                          :label="$t('supply-chain.environmental_system_certification')" >
                                          <a-input v-model:value="formState.quality_info.environmental_system_certification" :placeholder="$t('supply-chain.please_enter')" />
                                      </a-form-item>
                                  </a-col>
                            </a-row>
                          <a-row :gutter="24">
                                  <a-col :span="12">
                                    <!-- 质控工具软件 -->
                                      <a-form-item
                                          :label="$t('supply-chain.quality_control_tool_software')" >
                                          <a-input v-model:value="formState.quality_info.tool_software" :placeholder="$t('supply-chain.please_enter')" />
                                      </a-form-item>
                                  </a-col>
                                  <a-col :span="12">
                                    
                                      <!-- 计划体系认证 -->
                                      <a-form-item
                                          :label="$t('supply-chain.planning_system_certification')" >
                                          <a-input v-model:value="formState.quality_info.system_certification" :placeholder="$t('supply-chain.please_enter')" />
                                      </a-form-item>
                                  </a-col>
                            </a-row>
                          <a-row :gutter="24">
                                  <a-col :span="24">
                                    <!-- 市场PPM -->
                                      <a-form-item
                                          :label="$t('supply-chain.market_PPM')" >
                                          <a-textarea :row="6" :maxlength="2000" v-model:value="formState.quality_info.PPM"  :placeholder="$t('supply-chain.please_enter')"  autocomplete="off" />

                                      </a-form-item>
                                  </a-col>
                            </a-row>
                      </a-col>
                  </a-row>
                  <!-- 产能产线 -->
                  <a-row :gutter="24">
                      <a-col  :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part, Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing]) ? 3 : 0" class="title-area">
                          <div class="title-two">
                              {{
                                  $t(
                                      "supply-chain.capacity_line"
                                  )
                              }}
                          </div>
                      </a-col>
                      <a-col  :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part, Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing]) ? 21 : 0">
                        
                          <a-row :gutter="24">
                                <a-col :span="24">
                                  <!-- 关键自有工序 -->
                                    <a-form-item
                                        :label="$t('supply-chain.key_owned_process')" >
                                          
                                        <a-textarea :row="6" :maxlength="2000" v-model:value="formState.produce_capacity.processes"  :placeholder="$t('supply-chain.please_enter')" autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                          </a-row>
                          <a-row :gutter="24">
                                <a-col :span="24">
                                  
                                    <!-- 智能自动化线 -->
                                    <a-form-item
                                        :label="$t('supply-chain.intelligent_automation_line')" >
                                          <a-textarea :row="6" :maxlength="2000" v-model:value="formState.produce_capacity.automation_line"  :placeholder="$t('supply-chain.please_enter')" autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                          </a-row>
                          <a-row :gutter="24">
                                <a-col :span="24">
                                  
                                    <!-- 生产产能负荷 -->
                                    <a-form-item
                                        :label="$t('supply-chain.production_capacity_load')" >
                                          <a-textarea :row="6" :maxlength="2000" v-model:value="formState.produce_capacity.load"  :placeholder="$t('supply-chain.please_enter')" autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                          </a-row>
                      </a-col>
                  </a-row>
                  <!-- 外购管理 -->
                  <a-row :gutter="24">
                      <a-col :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part, Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing]) ? 3 : 0" class="title-area">
                          <div class="title-two">
                              {{
                                  $t(
                                      "supply-chain.qutsourcing_management"
                                  )
                              }}
                          </div>
                      </a-col>
                      <a-col :span="returnTypeBool (formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Part, Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Outsourcing]) ? 21 : 0" >
                        
                        <a-row :gutter="24">
                                <a-col :span="24">
                                  
                                    <!-- 外购工艺 -->
                                    <a-form-item
                                        :label="$t('supply-chain.qutsourced_technology')" >
                                          <a-textarea :row="6" :maxlength="2000" v-model:value="formState.outsourcing.technology"  :placeholder="$t('supply-chain.please_enter')" autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                          </a-row>
                            <a-row :gutter="24">
                                    <a-col :span="24">
                                      
                                        <!-- 外购备件 -->
                                        <a-form-item
                                            :label="$t('supply-chain.qutsourced_spare_parts')" >
                                              <a-textarea :row="6" :maxlength="2000" v-model:value="formState.outsourcing.parts"  :placeholder="$t('supply-chain.please_enter')" autocomplete="off" />
                                        </a-form-item>
                                    </a-col>
                              </a-row>
                        
                              <a-row :gutter="24">
                                      <a-col :span="24">
                                        
                                          <!-- 外购原料 -->
                                          <a-form-item
                                              :label="$t('supply-chain.purchased_raw_materials')" >
                                                <a-textarea :row="6" :maxlength="2000" v-model:value="formState.outsourcing.material"  :placeholder="$t('supply-chain.please_enter')" autocomplete="off" />
                                          </a-form-item>
                                      </a-col>
                                </a-row>
                              <a-row :gutter="24">
                                      <a-col :span="24">
                                        
                                          <!-- 外购制度 -->
                                          <a-form-item
                                              :label="$t('supply-chain.qutsourcing_system')" >
                                                <a-textarea :row="6" :maxlength="2000" v-model:value="formState.outsourcing.system"  :placeholder="$t('supply-chain.please_enter')" autocomplete="off" />
                                          </a-form-item>
                                      </a-col>
                                </a-row>
                      </a-col>
                  </a-row>

                  <!-- 指定信息 -->
                  <a-row :gutter="24">
                      <a-col :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers]) ? 3 : 0" class="title-area">
                          <div class="title-two">
                              {{
                                  $t(
                                      "supply-chain.specify_information"
                                  )
                              }}
                          </div>
                      </a-col>
                      <a-col  :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.CustomerRefers]) ? 21 : 0" >
                        
                        <a-row :gutter="24">
                                <a-col :span="24">
                                  
                                    <!-- 指定理由 -->
                                    <a-form-item
                                        :label="$t('supply-chain.specify_reason')" >
                                          <a-textarea :row="6" :maxlength="2000" v-model:value="formState.specify_info.reason"  :placeholder="$t('supply-chain.please_enter')" autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                          </a-row>
                            <a-row :gutter="24">
                                    <a-col :span="24">
                                      
                                        <!-- 指定零件 -->
                                        <a-form-item
                                            :label="$t('supply-chain.specify_part')" >
                                              <a-textarea :row="6" :maxlength="2000" v-model:value="formState.specify_info.parts"  :placeholder="$t('supply-chain.please_enter')" autocomplete="off" />
                                        </a-form-item>
                                    </a-col>
                              </a-row>
                        
                              <a-row :gutter="24">
                                      <a-col :span="24">
                                        
                                          <!-- 指定协议 -->
                                          <a-form-item
                                              :label="$t('supply-chain.specified_protocol')" >
                                                <a-textarea :row="6" :maxlength="2000" v-model:value="formState.specify_info.protocol"  :placeholder="$t('supply-chain.please_enter')" autocomplete="off" />
                                          </a-form-item>
                                      </a-col>
                                </a-row>
                              <a-row :gutter="24">
                                      <a-col :span="24">
                                        
                                          <!-- 指定服务 -->
                                          <a-form-item
                                              :label="$t('supply-chain.specify_service')" >
                                                <a-textarea :row="6" :maxlength="2000" v-model:value="formState.specify_info.service"  :placeholder="$t('supply-chain.please_enter')" autocomplete="off" />
                                          </a-form-item>
                                      </a-col>
                                </a-row>
                      </a-col>
                  </a-row>

                  <!-- 服务信息 -->
                  <a-row :gutter="24">
                      <a-col :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker]) ? 3 : 0" class="title-area">
                          <div class="title-two">
                              {{
                                  $t(
                                      "supply-chain.service_information"
                                  )
                              }}
                          </div>
                      </a-col>
                      <a-col  :span="returnTypeBool(formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker]) ? 21 : 0" >
                        
                        <a-row :gutter="24">
                                <a-col :span="24">
                                    <!-- 技术服务 -->
                                    <a-form-item
                                        :label="$t('supply-chain.technical_service')" >
                                          <a-textarea :row="6" :maxlength="2000" v-model:value="formState.service_info.technical_services"  :placeholder="$t('supply-chain.please_enter')" autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                          </a-row>
                        <a-row :gutter="24">
                                <a-col :span="24">
                                    
                                    <!-- 质量服务 -->
                                    <a-form-item
                                        :label="$t('supply-chain.quality_service')" >
                                            <a-textarea :row="6" :maxlength="2000" v-model:value="formState.service_info.quality_service"  :placeholder="$t('supply-chain.please_enter')" autocomplete="off" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                    <a-col :span="24">
                                    
                                        <!-- 供应服务 -->
                                        <a-form-item
                                            :label="$t('supply-chain.supply_of_services')" >
                                            <a-textarea :row="6" :maxlength="2000" v-model:value="formState.specify_info.supply_services"  :placeholder="$t('supply-chain.please_enter')" autocomplete="off" />
                                        </a-form-item>
                                    </a-col>
                            </a-row>
                      </a-col>
                  </a-row>

              </a-form>
          </div>
      </div>
      
      <!-- 设备信息 -->
      <div class="base-info content-area margin-t-20"  v-if="!returnTypeBool (formState.type, [Core.Const.SUPPLAY.SUPPLAY_TYPE_MAP.Broker])">
          <div class="title">
              {{ $t("supply-chain.device_information") }}
          </div>
          <!-- 关键生产设备 -->
          <div class="base-info-form">
              <a-form
                  name="custom-validation"
                  :rules="rules"
                  labelAlign="right">
                  <a-row :gutter="24">
                      <a-col :span="3" class="title-area">
                          <div class="title-two">
                              {{
                                  $t(
                                      "supply-chain.key_production_equipment"
                                  )
                              }}
                          </div>
                      </a-col>
                      <a-col :span="21">

                          <div class="form-content-item-table" >
                            <a-table
                                :columns="production_equipment_column"
                                :dataSource="formState.production_equipment"
                                :scroll="{ x: true }"
                                :row-key="(record) => record.id"
                                :pagination="false"
                                class="specific-table"
                            >
                                  <template #bodyCell="{ column, record, index }">
                                      <!-- 客户序号 -->
                                      <!-- <template
                                          v-if="column.dataIndex === 'customer_order'"
                                      >
                                          {{ record.customer_order }}
                                      </template>  -->
                                      <template
                                          v-if="column.type === 'input'"
                                      >
                                          <a-input 
                                              v-model:value="record[column.dataIndex]"
                                              :placeholder="$t('def.input')"
                                          />
                                      </template>
                                      <template
                                          v-else-if="column.type === 'input-num'"
                                      >
                                          <a-input-number
                                              v-model:value="record[column.dataIndex]"
                                              :placeholder="$t('def.input')"
                                              :min="0"
                                              :max="1000000000"
                                          >
                                              <template #addonAfter v-if="column.unit">
                                                  <span class="l-w-h-style">{{ column.unit }}</span>
                                              </template>
                                          </a-input-number>
                                      </template>
                                      <template
                                          v-else-if="column.type === 'time'"
                                      >
                                          <a-date-picker valueFormat="YYYY-MM-DD"  v-model:value="record[column.dataIndex]" />
                                      </template>
                                      <template
                                          v-else-if="column.dataIndex === 'operation'"
                                      >
                                          <a-button
                                              type="link"
                                              v-if="index"
                                              @click="handleDelete(formState.production_equipment ,record)"
                                              >
                                              <i class="icon i_delete" />
                                                  {{
                                                      $t("def.delete")
                                                  }}
                                              </a-button
                                          >
                                      </template>
                                  </template>
                              </a-table>
                              <a-button
                                  class="spec-add"
                                  type="primary"
                                  ghost
                                  @click="handleAddSpecItem(formState.production_equipment ,production_equipment_obj)"
                                  >
                                  添加生产设备
                              </a-button
                              >
                          </div>
                      </a-col>
                  </a-row>
              </a-form>
          </div>
          <!-- 关键检测设备 -->
          <div class="base-info-form">
              <a-form
                  name="custom-validation"
                  :rules="rules"
                  labelAlign="right">
                  <a-row :gutter="24">
                      <a-col :span="3" class="title-area">
                          <div class="title-two">
                              {{
                                  $t(
                                      "supply-chain.critical_detection_equipment"
                                  )
                              }}
                          </div>
                      </a-col>
                      <a-col :span="21">

                          <div class="form-content-item-table" >
                            <a-table
                                :columns="detection_equipment_column"
                                :dataSource="formState.detection_equipment"
                                :scroll="{ x: true }"
                                :row-key="(record) => record.id"
                                :pagination="false"
                                class="specific-table"
                            >
                                  <template #bodyCell="{ column, record, index }">
                                      <!-- 客户序号 -->
                                      <!-- <template
                                          v-if="column.dataIndex === 'customer_order'"
                                      >
                                          {{ record.customer_order }}
                                      </template>  -->
                                      <template
                                          v-if="column.type === 'input'"
                                      >
                                          <a-input 
                                              v-model:value="record[column.dataIndex]"
                                              :placeholder="$t('def.input')"
                                          />
                                      </template>
                                      <template
                                          v-else-if="column.type === 'input-num'"
                                      >
                                          <a-input-number
                                              v-model:value="record[column.dataIndex]"
                                              :placeholder="$t('def.input')"
                                              :min="0"
                                              :max="1000000000"
                                          >
                                              <template #addonAfter v-if="column.unit">
                                                  <span class="l-w-h-style">{{ column.unit }}</span>
                                              </template>
                                          </a-input-number>
                                      </template>
                                      <template
                                          v-else-if="column.type === 'time'"
                                      >
                                          <a-date-picker valueFormat="YYYY-MM-DD"  v-model:value="record[column.dataIndex]" />
                                      </template>
                                      <template
                                          v-else-if="column.dataIndex === 'operation'"
                                      >
                                          <a-button
                                              type="link"
                                              v-if="index"
                                              @click="handleDelete(formState.detection_equipment ,record)"
                                              >
                                              <i class="icon i_delete" />
                                                  {{
                                                      $t("def.delete")
                                                  }}
                                           </a-button
                                          >
                                      </template>
                                  </template>
                              </a-table>
                              <a-button
                                  class="spec-add"
                                  type="primary"
                                  ghost
                                  @click="handleAddSpecItem(formState.detection_equipment ,detection_equipment_obj)"
                                  >
                                  添加检测设备
                              </a-button
                              >
                          </div>
                      </a-col>
                  </a-row>
              </a-form>


          </div>
      </div>
      <!-- 补充信息 -->
      <div class="base-info content-area margin-t-20">
          <div class="title">{{ $t("supply-chain.supplementary_information") }}</div>
          <div class="base-info-form" >
              <a-form
                  ref="formRef3"
                  name="custom-validation"
                  :model="formState"
                  :rules="rules"
                  labelAlign="right">
                  <a-row :gutter="24">
                      <a-col :span="3" class="title-area" >
                          <div class="title-two">
                              <!-- 其他优势说明 -->
                              {{ $t("supply-chain.other_advantages_description") }}
                          </div>
                      </a-col>
                      <a-col :span="21">
                          <a-row :gutter="24">
                              <a-col :span="24">
                                  <a-form-item
                                      :label="$t('supply-chain.other_advantages_description')" >
                                      
                                      <a-textarea :row="6" :maxlength="2000" v-model:value="formState.additional_info"  :placeholder="$t('supply-chain.please_enter')" autocomplete="off" />
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
import { ref, reactive, watch, onMounted, toRef } from "vue";
import MyUpload from "@/components/MyUpload/index.vue";
import TimeSearch from "@/components/common/TimeSearch.vue";
import { message } from "ant-design-vue";
import Core from "@/core";
import MySvgIcon from "@/components/MySvgIcon/index.vue";
const formRef1 = ref(null);
const formRef2 = ref(null);
const formRef3 = ref(null);
const TimeSearchRef = ref(null);
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
const $t = useI18n().t;
const $i18n = useI18n();
const $store = useStore();
// 表格添加对象 - 客户名称
const customer_info_list_obj = ref({
    customer_order:'',
    customer_name: "",
    sales_share: "",
    main_supply_part: "",
    begin_cooperation_time: "",
})
const customer_info_list_column = ref([
  
    { title: '客户序号', key: "customer_order", dataIndex: "customer_order", type: 'text' }, // 客户序号
    { title: '客户名称', key: "customer_name", dataIndex: "customer_name", type: 'input' }, // 客户名称
    { title: '销售占比', key: "sales_share", dataIndex: "sales_share", unit: '%', type: 'input-num' }, // 销售占比
    { title: '主供零件', key: "main_supply_part", dataIndex: "main_supply_part", type: 'input' }, // 主供零件
    { title: '开始合作时间', key: "begin_cooperation_time", dataIndex: "begin_cooperation_time", type: 'time' }, // 开始合作时间
    { title: '操作', key: "delete", dataIndex: "operation" }, // 操作
])
// 竞争对手
const competitor_analysis_obj = ref({
    customer_order:'',
    company_name:'',
    market_share: "",
    understand_evaluation: "",
})
const competitor_analysis_column = ref([
  
    { title: '公司序号', key: "company_order", dataIndex: "company_order", type: 'text' }, // 公司序号
    { title: '公司名称', key: "company_name", dataIndex: "company_name", type: 'input' }, // 公司名称
    { title: '市场份额', key: "market_share", dataIndex: "market_share", type: 'input' }, // 市场份额
    { title: '了解评价', key: "understand_evaluation", dataIndex: "understand_evaluation", unit: '%', type: 'input' }, // 了解评价
    { title: '操作', key: "delete", dataIndex: "operation" }, // 操作
])

// 生产设备
const production_equipment_obj = ref({
    customer_order: undefined,
    customer_name: undefined,
    sales_share: undefined,
    main_supply_part: undefined,
    begin_cooperation_time: undefined,
})
const production_equipment_column = ref([
  
  { title: '生产设备名称', key: "name", dataIndex: "name", type: 'input' }, // 生产设备名称
  { title: '规格型号（含吨位）', key: "spec", dataIndex: "spec", type: 'input'  }, // 规格型号（含吨位）
  { title: '数量', key: "quantity", dataIndex: "quantity", type: 'input-num' }, // 数量
  { title: '设备制造商', key: "manufacturer", dataIndex: "manufacturer", type: 'input' }, // 设备制造商
  { title: '购置年限', key: "purchase_period", dataIndex: "purchase_period", type: 'input-num' }, // 购置年限
  { title: '操作', key: "delete", dataIndex: "operation" }, // 操作
])
 

// 检测设备
const detection_equipment_obj = ref({
    
    customer_order: undefined,
    name: undefined,
    Spec: undefined,
    quantity: undefined,
    manufacturer: undefined,
    accuracy_level: undefined,
})
const detection_equipment_column = ref([
 
  
  { title: '检测设备名称', key: "name", dataIndex: "name", type: 'input' }, // 检测设备名称
  { title: '规格型号', key: "spec", dataIndex: "spec", type: 'input'  }, // 规格型号
  { title: '数量', key: "quantity", dataIndex: "quantity", type: 'input-num' }, // 数量
  { title: '设备制造商', key: "manufacturer", dataIndex: "manufacturer", type: 'input' }, // 设备制造商
  { title: '精度等级', key: "purchase_period", dataIndex: "accuracy_level", type: 'input' }, // 精度等级
  { title: '操作', key: "delete", dataIndex: "operation" }, // 操作
])
 

// 表单对象
const formState = reactive({
    type: 1, //表格类型
    position: '',
    company_name: '',
    contact_info: {}, // 联系方式
    company_info: {}, // 公司概况
    agent_info: {// 代理公司概况

        agent_company: "",   // 被代理公司
        agent_address: "",  // 被代理地址
        agent_relationship: "",  // 被代理关系
        flag_agent_warrant: "",  // 是否有代理权证
        agent_effective_begin_time: "",  // 代理有效开始时间
        agent_effective_end_time: "",  // 代理有效结束时间
        agent_product: "",  // 代理产品

    }, 

    human_resource: {}, // 人力资源
    financial_info: {}, // 财务信息
    business_info: {
      proportion_of_business: '',
      list: [
          {
              recent_year: "近1年",
              sales: "",
              taxes_paid: "",
              profit_margin: "",
              asset_liability_ratio: "",
              cash_flow_ratio: ""
          },
          {
              recent_year: "近2年",
              sales: "",
              taxes_paid: "",
              profit_margin: "",
              asset_liability_ratio: "",
              cash_flow_ratio: ""
          },
          {
              recent_year: "近3年",
              sales: "",
              taxes_paid: "",
              profit_margin: "",
              asset_liability_ratio: "",
              cash_flow_ratio: ""
          },
          
      ],
    },                        // 营业信息(近几年)         
    competitor_analysis: [    // 竞争对手
        {
            company_order:'竞争对手1',
            company_name: "",
            market_share: "",
            understand_evaluation: "",
        }
    ],
    customer_info: [    // 客户信息
        {
            customer_order:'主要客户1',
            customer_name: "",
            sales_share: "",
            main_supply_part: "",
            begin_cooperation_time: "",
        }
    ],            
    technical_info: {   // 技术信息
      
        patent: "",   // 相关专利
        RD_center: "",// 研发中心
        RD_partners: "",// 研发合作机构
        design_guides: "",   // 设计规范

        product_design: [], // 产品设计
        process_design: [],    //过程设计
        process_validation: [], //过程验证

        design_software: "",// 设计软件
        dev_process: "", // 开发流程
    },
    quality_info: {  // 质量
        
        certification: "",// 质量体系认证
        partners: "", // 质量合作机构
        tool_software: "", // 质控工具软件
        PPM: "",          // 市场PPM
        env_certification: "", // 环境体系认证
        accredited_laboratory: "",  // 认可实验室
        system_certification: "" // 计划体系认证
    },

    produce_capacity: {  // 产能产线
        
        processes: "",// 关键自有工序
        automation_line: "", // 智能自动化线
        load: "", // 生产产能负荷
    },
    // 外购管理
    outsourcing: { 
        
      technology: "",// 外购工艺
      parts: "", // 外购备件
      material: "", // 外购原料
      system: "", // 外购制度
    },
    // 生产设备
    production_equipment: [
      
        {
            id: 1,
            name: undefined,
            spec: undefined,
            quantity: undefined,
            manufacturer: undefined,
            purchase_period: undefined,
        }
    ],
    // 检测设备
    detection_equipment: [
      
        {
            id: 1,
            name: undefined,
            spec: undefined,
            quantity: undefined,
            manufacturer: undefined,
            accuracy_level: undefined,
        }
    ],
    // 指定信息
	specify_info: {
		reason: "", // 指定理由
		parts: "",  // 指定零件
		protocol: "",// 指定协议
		service: ""// 指定服务
	},
    // 服务信息
	service_info: {
		technical_services: "", // 技术服务
		quality_service: "",    // 质量服务
		supply_services: "",    // 供应服务
	},
    // 补充信息
    additional_info: "",
});
let PositionVaild = async (_rule, value) => {
    if (!formState.position) {
        return Promise.reject(
            $t("supply-chain.please_select_position")
        );
    }
    if (formState.postion == 4) {
        /* formState.begin_business_time = "";
        formState.end_business_time = ""; */
       // 去除校验 
    }
    return Promise.resolve(); 
}

let NameVaild = async(_rule, value) => {
    let dataBoo = false;
    if(!_rule.required) {
        return Promise.resolve();
    }
    switch(_rule.fullField){
        case 'contact_name': 
            if (!formState.contact_info?.name) {
                dataBoo = true;
            }
            break;
        case 'contact_email':
            if (!formState.contact_info?.email) {
                dataBoo = true;
            }
            break;
        case 'contact_flag_phone':
            if (!formState.contact_info?.phone) {
                dataBoo = true;
            }
            break;
    }
    if(dataBoo) return Promise.reject(
        $t("supply-chain.please_enter")
    );
    return Promise.resolve();
}
let BusinessTermValid = async (_rule, value) => {
  if (formState.business_duration_type == 2) {
      if (!formState.begin_business_time || !formState.end_business_time) {
          return Promise.reject(
              $t("supply-chain.please_select_business_term")
          );
      }
  }
  if (formState.business_duration_type == 1) {
      formState.begin_business_time = "";
      formState.end_business_time = "";
  }
  return Promise.resolve();
};

let companyVaild = async (_rule, value) => {
    let dataBoo = false;
    if(!_rule.required) {
        return Promise.resolve();
    }
    switch(_rule.fullField){
        case 'company_name_name': // 公司名称
            if (!formState.company_info?.name) {
                dataBoo = true;
            }
            break;
        case 'company_address':     // 地址
            if (!formState.company_info?.address) {
                dataBoo = true;
            }
            break;
        case 'legal_representative':        // 法人代表
            if (!formState.company_info?.legal_person) {
                dataBoo = true;
            }
            break;
        case 'proportion_of_business':        // 业务比重
            if (!formState.business_info?.proportion_of_business) {
                dataBoo = true;
            }
            break;
        case 'sales':        // 销售额
            formState.business_info?.list.forEach((item)=>{
                if (!item.sales) {
                    dataBoo = true;
                    return;
                }
            })
            break;
            
    }
    if(dataBoo) return Promise.reject(
        $t("supply-chain.please_enter")
    );
    return Promise.resolve();
};
// 是否-法律纠纷
let flagLegalDisputeValid =  async (_rule, value) => {
  /* if (!value) {
      return Promise.reject($t("supply-chain.please_enter_account_name"));
  }
  return Promise.resolve(); */
  
  let dataBoo = false;
    if(!_rule.required) {
        return Promise.resolve();
    }
    switch(_rule.fullField){
        case 'flag_legal_dispute': // 法律纠纷
            if (!formState.financial_info?.flag_legal_dispute) {
                dataBoo = true;
            }
            break;
            
        case 'date_establishment': //成立日期
            if(!formState.company_info?.established_time){
                dataBoo = true;
            }
            break; 
        case 'period_requirement':  // 账期要求
            if (!formState.financial_info?.account_period_requirement) {
                dataBoo = true;
            }
            break;
        case 'Invoice_type': // 开具发票
            if (!formState.financial_info?.invoice_type) {
                dataBoo = true;
            }
            break;
        case 'proxy_warrant': // 代理权证
            if ((!formState.agent_info?.flag_agent_warrant)&&formState.type===2) {
                dataBoo = true;
            }
            break;
        case 'duration_of_agency': // 代理有效期间
            if ((!formState.agent_info?.agent_effective_begin_time || !formState.agent_info?.agent_effective_end_time)&&formState.type===2) {
                dataBoo = true;
            }
            break;
            
    }
    if(dataBoo) return Promise.reject(
        $t("supply-chain.please_select") //请选择
    );
    return Promise.resolve();
};



let account_nameVaild = async (_rule, value) => {
  if (!value) {
      return Promise.reject($t("supply-chain.please_enter_account_name"));
  }
  return Promise.resolve();
};
let account_with_bankVaild = async (_rule, value) => {
  if (!value) {
      return Promise.reject($t("supply-chain.please_enter_bank_of_deposit"));
  }
  return Promise.resolve();
};
let account_with_bank_numberVaild = async (_rule, value) => {
  if (!value) {
      return Promise.reject($t("supply-chain.please_enter_bank_number"));
  }
  return Promise.resolve();
};
let bank_accountVaild = async (_rule, value) => {
  if (!value) {
      return Promise.reject($t("supply-chain.please_enter_bank_account"));
  }
  // 必须为数字
  if (!/^[0-9]*$/.test(value)) {
      return Promise.reject($t("supply-chain.bank_number_must_be_number"));
  }
  return Promise.resolve();
};
const rules = ref({
  positon: [//职业

      {
          required: true,
          validator: PositionVaild,
          trigger: ["change", "blur"],
      },
  ],
  contact_name: [// 姓名
    
      {
          required: true,
          validator: NameVaild,
          trigger: ["change", "blur"],
      },
  ],
  contact_email: [// 邮箱
    
      {
          required: true,
          validator: NameVaild,
          trigger: ["change", "blur"],
      },
  ],
  contact_flag_phone: [// 手机号
    
      {
          required: true,
          validator: NameVaild,
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
  // 代理权证
  proxy_warrant: [
      {
          required: true,
          validator: flagLegalDisputeValid,
          trigger: ["change", "blur"],
      },
  ],
 // 代理有效期间
 duration_of_agency: [
    {
        required: true,
        validator: flagLegalDisputeValid,
        trigger: ["change", "blur"],
    },
  ],
//  业务比重
  proportion_of_business: [
      {
          required: true,
          validator: companyVaild,
          trigger: ["change", "blur"],
      },
  ],
//  销售额
sales: [
      {
          required: true,
          validator: companyVaild,
          trigger: ["change", "blur"],
      },
  ],
//   客户信息
/*   customer_info_list_column: [

    {
          required: true,
          validator: companyVaild,
          trigger: ["change", "blur"],
      },
  ], */

});

// 草稿回显
const draftDataReview = () => {
  let draftData = $store.state.SUPPLY_CHAIN.supplyDraftChain;
  if(draftData?.form){
        let type = typeof(draftData.form);
        if(type === 'string') {
            draftData.form = JSON.parse(draftData.form);
        }else{
            draftData.form = draftData.form;
        }
  }else{
    draftData.form = {}
  }
  console.log('draftData------------------------------------------------',draftData);
  // 判断是否为空对象
  if (Object.keys(draftData).length === 0) {
      console.log('空对象','详情回显');
  } else {
        Object.keys(draftData).forEach((key) => {
            if(key === 'form'){
                for (const iterator of  Object.keys(draftData[key])) {
                    formState[iterator] = draftData[key][iterator] //die9
                }
            }else {
                formState[key] = draftData[key];
            }
        });
      
  }
  console.log('formState---------------------------',formState);
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
    let result = typeIncludes.includes(Number(type))   
    return result
}
// 代理有效期间
const handleTimeSearch = (params) => {
    formState.agent_info.agent_effective_begin_time = params.begin_time;
    formState.agent_info.agent_effective_end_time = params.end_time;
};
// 校验
const step1Vaild = () => {
  return new Promise(async (resolve,reject)=>{
      formRef1.value.clearValidate();
      formRef2.value.clearValidate();
      formRef3.value.clearValidate();
      const form1Promise = formRef1.value.validate(); // 获取表单1的验证 Promise  
      const form2Promise = formRef2.value.validate(); // 获取表单2的验证 Promise  
      const form3Promise = formRef3.value.validate(); // 获取表单2的验证 Promise  

      Promise.all([form1Promise, form2Promise, form3Promise]).then(([res1, res2, res3]) => {  
            // 所有 Promise 都成功完成  
            // 处理结果...  
            if (res1 && res2 && res3) {
                let data = $store.state.SUPPLY_CHAIN.supplyChain;
                  // 判断是否为空对象
                  if (Object.keys(data).length === 0) {
                      // 为空对象
                      data = {
                          type: formState.type,
                          position: formState.position,
                          company_name: formState.company_info?.name,
                          form: {
                            ...formState
                          }
                      };
                  } else {
                      // 不为空对象
                      data = {
                        ...data,
                        type: formState.type,
                        position: formState.position,
                        company_name: formState.company_info?.name,
                        form: {
                          ...formState
                        }
                      }
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
                  $store.dispatch('SUPPLY_CHAIN/setSupplyDraftChain',data);
                  resolve(true)
            }
        }).catch(err => {  
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
              reject(false)
        });
            //   await Promise.all([form1Promise, form2Promise, form3Promise]); // 同时等待两个表单验证完成  
     
      /* formRef1.value
          .validate()
          .then((res) => {
              if (res) {
                  let data = $store.state.SUPPLY_CHAIN.supplyChain;
                  // 判断是否为空对象
                  if (Object.keys(data).length === 0) {
                      // 为空对象
                      data = {
                          type: formState.type,
                          position: formState.position,
                          company_name: formState.company_info?.name,
                          form: {
                            ...formState
                          }
                      };
                  } else {
                      // 不为空对象
                      data = {
                        ...data,
                        type: formState.type,
                        position: formState.position,
                        company_name: formState.company_info?.name,
                        form: {
                          ...formState
                        }
                      }
                  }
                  // 保存数据
                  $store.commit("SUPPLY_CHAIN/setSupplyChain", data);
                  $store.commit('SUPPLY_CHAIN/setSupplyDraftChain',data);
                  resolve(true)
              }
          })
          .catch((err) => {
              // 校验失败
              message.warning($t("supply-chain.please_complete_info"));
              const errorName = err?.errorFields[0]?.name[0] ?? undefined;
              if (!errorName) return;
              const errorDom = document.querySelector(`[name=${errorName}]`);
              // errorDom 为null 找不到对应的a-form-item的原因是：a-form-item的name属性值必须和a-input的name属性值一致
              errorDom.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                  inline: "nearest",
              });
              reject(false)
          }); */
  })
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
            ...formState
        }
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
const handleDelete = (list , data, title , key ) => {
    
	Core.Util.confirm({
		title: $t("supply-chain.detele_data_sure"),
		content: $t("coc.coc_delete_confirm_content"),
		okText: $t("coc.coc_btn_comfirm"),
		cancelText: $t("coc.coc_btn_cancel"),
		onOk: () => {

            const index = list.findIndex(
                (el) => el.id === data.id
            );

            if (index !== -1) {
                list.splice(index, 1);
            }
            // 如果存在名称变更
            if(title) {
                list.forEach((ele,ind) => {
                    ele[key] = title + (ind+1);
                });  
            }
		},
        
	})
   
}
const handleAddSpecItem = (list ,obj ,title , key ) => {
    
    const id = list.length + 1;

    // 如果存在名称变更
    title ? obj[key] = title + id : ''

    list.push({...obj,id})
}
watch(
  () => $i18n.locale.value,
  (val) => {
      // 重新校验
      if (formRef1.value) {
          formRef1.value.clearValidate();
      }
  }
);
// 职业勾选变动
watch(
  () => formState.position,
  (val) => {
      
    let boo = true;
    if(formState.position === Core.Const.SUPPLAY.POSITION[4].value) boo = false;
    rules.value.contact_name[0].required = boo;
    rules.value.contact_email[0].required = boo;
    rules.value.contact_flag_phone[0].required = boo;
  }
);
watch(()=>formState.type ,
    (newval,oldval)=>{

        if(newval === Core.Const.SUPPLAY.SUPPLAY_TYPE[2].value){
            // 业务比重
            rules.value.proportion_of_business[0].required = true;
            // 代理有效期间
            rules.value.duration_of_agency[0].required = true;
            rules.value.proxy_warrant[0].required = true;

        }else if(newval === Core.Const.SUPPLAY.SUPPLAY_TYPE[3].value){
            // 销售额
            rules.value.sales[0].required = true;
        }else if(newval === Core.Const.SUPPLAY.SUPPLAY_TYPE[4].value){

            
        }else if(newval === Core.Const.SUPPLAY.SUPPLAY_TYPE[5].value){
            // 销售额
            rules.value.sales[0].required = true;

        }else{
            // 业务比重
            rules.value.proportion_of_business[0].required = false;
            rules.value.sales[0].required = false;
            // 代理有效期间
            rules.value.proxy_warrant[0].required = false;
            rules.value.duration_of_agency[0].required = false;
        }
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
          color: #1D2129;
          font-size: 18px;
          font-weight: 500;
      }
      .title-two {
        color: #1D2129;
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


.margin-t-20  {
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

        width: 176px;
        height: 58.25px;
        flex-shrink: 0;
        text-align: center;
        margin-right: 20px;
        line-height: 58.25px;
        cursor: pointer;
        .fcc();
        box-sizing: border-box;

      .type-font {
          font-size: 16px;
          margin-left: 4px;
          color:  #666;
          font-weight: 400;
      }
    }
    .click-type {
      
        background-image: url("../../../assets/images/supply-chain/parts-bg.png");
        background-size: 100% 100%;
    }
    .border-type {
        border-radius: 4px;
        border: 1px solid #EAECF1;
        background: #FFF;
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
:deep(.middle-radio){
    display: flex;
    align-items: center;
    .ant-input {

        width: 100px;
        margin-left: 6px;
    }
}
:deep(.ant-col .ant-form-item-control .ant-picker) {
    width: 100%
}

@media (max-width: 1550px) {

    .flex-1 {
          padding: 8px 0% 0 6% !important;
      }
}

.spec-add {
    margin: 16px auto 40px;
}

.specific-table {
    border-radius: 4px;
    background: #FFF;
}
.black-font {
    font-size: 16px;
    color: #666;
}
.white-font {
    font-size: 16px;
    color: #FFF;
}

:deep(.ant-table) {
    border: 1px solid #EAECF2;
    border-bottom: 0px solid #EAECF2;
}
:deep(.ant-input-number-group-addon) {
    background-color: #F2F2F2;
    color: #808FA6;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    border-color: #EAECF1;
    box-sizing: border-box;
}
:deep(.ant-input-number-group) {
    border-radius: 4px;
    border-color: #EAECF1;
    background: #FFF;
    overflow: hidden;
    
}
</style>
