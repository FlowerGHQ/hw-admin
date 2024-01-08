<template>
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
                                        {{
                                            Core.Const.SUPPLAY.SUPPLAY_TYPE[item.value] ?
                                            $t(Core.Const.SUPPLAY.SUPPLAY_TYPE[item.value].t) : "-"
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
                  <a-row :gutter="24">
                      <a-col :span="3" class="title-area" >
                          <div class="title-two">
                              {{ $t("supply-chain.company_profile") }}
                          </div>
                      </a-col>
                      <a-col :span="21">
                          <a-row :gutter="24">
                              <!-- 公司名称 -->
                              <a-col :span="12">
                                  <a-form-item
                                      :label="$t('supply-chain.company_name')"
                                       name="company_name">
                                       <a-input name="company_name" v-model:value="formState.company_info.name" :placeholder="$t('supply-chain.please_enter')" />
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
                                  <a-form-item
                                      :label="
                                          $t(
                                              'supply-chain.date_establishment'
                                          )
                                      "
                                      name="date_establishment">
                                          <a-date-picker name="date_establishment"  valueFormat="YYYY-MM-DD"  v-model:value="formState.company_info.established_time" />
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
                                      name="detailed_address">
                                      <a-input name="detailed_address" v-model:value="formState.company_info.address" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="12">
                                  <!-- 公司性质 -->
                                  <a-form-item
                                      :label="$t('supply-chain.nature_of_company')"
                                      name="detailed_address">
                                     
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
                              <a-col :span="12">
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
                              <a-col :span="12">
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
                              <a-col :span="12">
                                  <!-- 母公司名称 -->
                                  <a-form-item
                                      :label="$t('supply-chain.parent_company_name')" >
                                      
                                      <a-input v-model:value="formState.company_info.parent_company_name" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                              <a-col :span="12">
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
                  <a-row :gutter="24">
                      <a-col :span="3" class="title-area">
                          <div class="title">
                              {{
                                  $t("supply-chain.human_resources")
                              }}
                          </div>
                      </a-col>
                      <a-col :span="21">
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
                          <div class="title">
                              {{
                                  $t(
                                      "supply-chain.financial_information"
                                  )
                              }}
                          </div>
                      </a-col>
                      <a-col :span="21">
                          <a-row :gutter="24">
                              <a-col :span="24">
                                  <!-- 法律纠纷 -->
                                  <a-form-item
                                      :label="
                                          $t(
                                              'supply-chain.legal_dispute'
                                          )
                                      " name="quality_system_certificate">
                                      
                                      <a-radio-group
                                                v-model:value="formState.financial_info.flag_legal_dispute"
                                            >
                                                <a-radio :value="radio.value" v-for="radio in Core.Const.SUPPLAY.Legal_Dispute" :key="radio.value" >
                                                      {{ $t( radio.t ) }}
                                                </a-radio>
                                            </a-radio-group>
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="12">
                                  <!-- 操作工人月平均工资 -->
                                  <a-form-item
                                      :label="$t('supply-chain.average')" >
                                      
                                      <a-input v-model:value="formState.financial_info.average_monthly_wage_of_operating_workers" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                              <a-col :span="12">
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
                          <div class="title">
                              {{
                                  $t(
                                      "supply-chain.financial_information"
                                  )
                              }}
                          </div>
                      </a-col>
                      <a-col :span="21">
                          <a-row :gutter="24">
                                  <a-col :span="12">
                                      <!-- 业务比重 -->
                                      <a-form-item
                                          :label="
                                              $t(
                                                  'supply-chain.proportion_of_business'
                                              )
                                          ">

                                          <a-input v-model:value="formState.business_info.proportion_of_business" :placeholder="$t('supply-chain.please_enter')" />

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
                                          >
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
                                      </a-form-item>
                                  </a-col>
                          </a-row>
                          <a-row :gutter="24">
                                  <a-col :span="8" v-for="(item,index) in 3">
                                    
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
                                  <a-col :span="8" v-for="(item,index) in 3">
                                    
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
                                  <a-col :span="8" v-for="(item,index) in 3">
                                    
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
                                  <a-col :span="8" v-for="(item,index) in 3">
                                    
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
                      <a-col :span="3" class="title-area">
                          <div class="title">
                              {{
                                  $t(
                                      "supply-chain.competitor"
                                  )
                              }}
                          </div>
                      </a-col>
                      <a-col :span="21">
                            
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
                          <div class="title">
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
                      <a-col :span="3" class="title-area">
                          <div class="title">
                              {{
                                  $t(
                                      "supply-chain.Technical_information"
                                  )
                              }}
                          </div>
                      </a-col>
                      <a-col :span="21">
                          <a-row :gutter="24">
                              <a-col :span="12">
                                <!-- 相关专利 -->
                                  <a-form-item
                                      :label="$t('supply-chain.related_patent')" >
                                      <a-input v-model:value="formState.technical_info.patent" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                              <a-col :span="12">
                                
                                  <!-- 研发中心 -->
                                  <a-form-item
                                      :label="$t('supply-chain.research_and_development_center')" >
                                      <a-input v-model:value="formState.technical_info.RD_center" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="24">
                                <!-- 研发合作机构 -->
                                  <a-form-item
                                      :label="$t('supply-chain.r_d_partner')" >
                                      <a-input v-model:value="formState.technical_info.RD_partners" :placeholder="$t('supply-chain.please_enter')" />
                                  </a-form-item>
                              </a-col>
                          </a-row>
                          <a-row :gutter="24">
                              <a-col :span="24">
                                
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
                      </a-col>
                  </a-row>
                  <!-- 质量信息 -->
                  <a-row :gutter="24">
                      <a-col :span="3" class="title-area">
                          <div class="title">
                              {{
                                  $t(
                                      "supply-chain.quality_information"
                                  )
                              }}
                          </div>
                      </a-col>
                      <a-col :span="21">
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
                      <a-col :span="3" class="title-area">
                          <div class="title">
                              {{
                                  $t(
                                      "supply-chain.capacity_line"
                                  )
                              }}
                          </div>
                      </a-col>
                      <a-col :span="21">
                        
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
                      <a-col :span="3" class="title-area">
                          <div class="title">
                              {{
                                  $t(
                                      "supply-chain.qutsourcing_management"
                                  )
                              }}
                          </div>
                      </a-col>
                      <a-col :span="21">
                        
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
              </a-form>
          </div>
      </div>
      <!-- 设备信息 -->
      <div class="base-info content-area margin-t-20">
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
                  ref="formRef4"
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
  { title: '精度等级', key: "purchase_period", dataIndex: "accuracy_level", type: 'input-num' }, // 精度等级
  { title: '操作', key: "delete", dataIndex: "operation" }, // 操作
])
 

// 表单对象
const formState = reactive({
    type: 1, //表格类型
    position: '',
    company_name: '',
    contact_info: {}, // 联系方式
    company_info: {}, // 公司概况
    // agent_info: {}, // 代理公司概况

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
    },                  // 营业信息(近几年)         
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
let RegisteredCapitalVaild = async (_rule, value) => {
  if (!value) {
      return Promise.reject(
          $t("supply-chain.please_enter_registered_capital")
      );
  }
  // 必须为数字
  if (!/^[0-9]*$/.test(value)) {
      return Promise.reject(
          $t("supply-chain.registered_capital_must_be_number")
      );
  }
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
  // 注册资本
  registered_capital: [
      {
          required: true,
          validator: RegisteredCapitalVaild,
          trigger: ["change", "blur"],
      },
  ],
  // 营业期限
  business_duration_type: [
      {
          required: true,
          validator: BusinessTermValid,
          trigger: ["change", "blur"],
      },
  ],
  account_name: [
      {
          required: true,
          validator: account_nameVaild,
          trigger: ["change", "blur"],
      },
  ],
  account_with_bank: [
      {
          required: true,
          validator: account_with_bankVaild,
          trigger: ["change", "blur"],
      },
  ],
  account_with_bank_number: [
      {
          required: true,
          validator: account_with_bank_numberVaild,
          trigger: ["change", "blur"],
      },
  ],
  bank_account: [
      {
          required: true,
          validator: bank_accountVaild,
          trigger: ["change", "blur"],
      },
  ],
});

// 草稿回显
const draftDataReview = () => {
  let draftData = $store.state.SUPPLY_CHAIN.supplyDraftChain;
  console.log('draftData',draftData);
  // 判断是否为空对象
  if (Object.keys(draftData).length === 0) {
      console.log('空对象','详情回显');
  } else {
      // 解析出来的数据
      let data = draftData;
      Object.keys(data ?? {}).forEach((key) => {
        if(key === 'form'){
         for (const iterator of  Object.keys(data[key])) {
            formState[iterator] = data[key][iterator]
         }
        }else {
          formState[key] = data[key];
        }
      });
  }
};
// 详情回显
const detailDataReview = () => {
  let detailData = $store.state.SUPPLY_CHAIN.supplyDetailsChain;
  // 判断是否为空对象
  if (Object.keys(detailData).length === 0) {
      console.log('空对象','详情回显');

  } else {
      // 解析出来的数据
      let data = detailData;
      Object.keys(data??{}).forEach((key) => {
        if(key === 'form'){
            for (const iterator of  Object.keys(data[key])) {
                formState[iterator] = data[key][iterator]
            }
        }else {
            formState[key] = data[key];
        }
      });
  }
};
// 校验
const step1Vaild = () => {
  return new Promise((resolve,reject)=>{
      formRef1.value.clearValidate();
      formRef1.value
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
                  $store.dispatch("SUPPLY_CHAIN/setSupplyChain", data);
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
          });
  })
};
// 保存草稿
const saveDraft1 = () => {
  // 获取数据
  let data = $store.state.SUPPLY_CHAIN.supplyDraftChain;
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
  if ($store.getters["SUPPLY_CHAIN/isSubmitEd"]) {
    $store.dispatch("SUPPLY_CHAIN/setSupplyDetailsChain", data)
  }
  // 保存数据
  $store.dispatch("SUPPLY_CHAIN/setSupplyDraftChain", data);

  // 提示
  message.success($t("supply-chain.save_successfully"));
};
// 回显数据
const reviewData = () => {
  // 判断是否已经提交过了
  let isSubmit = $store.getters["SUPPLY_CHAIN/isSubmitEd"];
  console.log("是否已经提交过了：", isSubmit);
  if (isSubmit) {
      // 已经提交过了
      detailDataReview();
  } else {
      // 没有提交过
      draftDataReview();
  }
};
// 删除某一项
const handleDelete = (list , data, title , key ) => {
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
defineExpose({
  step1Vaild,
  saveDraft1,
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
          font-weight: 600;
          margin-left: 4px;
          color:  #666;
          font-weight: 600;
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
    border: 1px solid #EAECF2;
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


:deep(.ant-input-number-group-addon) {
    background-color: #F2F2F2;
    color: #808FA6;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    border: 1px solid #EAECF1;
    box-sizing: border-box;
}
:deep(.ant-input-number-group) {
    border-radius: 4px;
    border: 1px solid #EAECF1;
    background: #FFF;
    overflow: hidden;
    
}
</style>
