<template>
    <div id="CustomerDetail" class="edit-container">
        <div class="title-container">
            <div class="title-area">
                {{ $t('crm_c.detail') }}
                <!--  <a-tag v-if="$auth('ADMIN')" :color='detail.status ? "green" : "red"'>-->
                <!--      {{ detail.status ? $t('def.enable_ing') : $t('def.disable_ing') }}-->
                <!--  </a-tag>-->
            </div>
            <div class="btns-area">
                <template v-if="detail.status === STATUS.POOL">
                    <!-- 编辑 -->
                    <!-- <a-button @click="routerChange('edit')" v-if="$auth('crm-customer.save')">{{ $t('n.edit') }}</a-button> -->
                    <!-- <a-button @click="routerChange('edit')"
                        v-if="$auth('crm-customer.save') && (lang === 'en' || detail.country !== '中国')">{{
                            $t('n.edit')
                        }}</a-button> -->
                    <a-button @click="routerChange('edit')" v-if="$auth('crm-customer.save') && !isMoreCss">{{
                        $t('n.edit')
                    }}</a-button>
                    <!-- 领取 -->
                    <a-button type="primary" @click="handleObtain" v-if="$auth('crm-customer.obtain')">
                        {{ $t('crm_c.obtain') }}
                    </a-button>
                    <!-- 分配 -->
                    <a-button type="primary" @click="handleBatch('distribute')" v-if="$auth('crm-customer.distribute')">
                        {{ $t('crm_c.distribute') }}
                    </a-button>
                    <!-- 删除 -->
                    <a-button type="danger" @click="handleDelete" v-if="$auth('crm-customer.delete')">
                        {{ $t('crm_c.delete') }}
                    </a-button>
                </template>
                <template
                    v-if="
                        detail.status === STATUS.CUSTOMER &&
                        trackMemberDetail !== undefined &&
                        trackMemberDetail !== null &&
                        trackMemberDetail !== ''
                    "
                >
                    <template v-if="trackMemberDetail.type !== Core.Const.CRM_TRACK_MEMBER.TYPE.READ">
                        <!-- <a-button @click="routerChange('edit')" v-if="$auth('crm-customer.save')">
                            {{ $t('n.edit') }}
                        </a-button> -->
                    </template>
                    <template v-if="trackMemberDetail.type === Core.Const.CRM_TRACK_MEMBER.TYPE.OWN">
                        <!-- 移交 -->
                        <a-button type="primary" @click="handleBatch('transfer')" v-if="$auth('crm-customer.transfer')">
                            {{ $t('crm_c.transfer') }}
                        </a-button>
                        <!-- 退回 -->
                        <a-button type="danger" @click="handleReturnPool" v-if="$auth('crm-customer.return-pool')">
                            {{ $t('crm_c.return_pool') }}
                        </a-button>
                    </template>
                </template>
            </div>
        </div>
        <div class="gray-panel">
            <!-- 顶部添加基本信息（仅英文显示一个样式）detail.source_type === 5 || detail.source_type === 30 || detail.source_type === 31 || detail.country !== '中国' -->
            <template v-if="!isMoreCss">
                <div class="panel-content desc-container">
                    <div class="desc-title">
                        <div class="title-area">
                            <span class="title">{{ detail.name }}</span>
                        </div>
                    </div>
                    <a-row class="desc-detail">
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span class="key">{{ $t('n.phone') }}：</span>
                            <span class="value phone-hover">
                                {{ detail.phone?.includes(detail.phone_country_code) ? '' : detail.phone }}
                                {{ detail.phone }}
                                <a-button
                                    type="link"
                                    v-if="!detail.flag_eyes && detail.status !== STATUS.CUSTOMER"
                                    class="switch"
                                    @click="handleChecking()"
                                    ><i class="icon i_eyes"
                                /></a-button>
                            </span>
                        </a-col>
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span class="key">{{ $t('n.email') }}：</span>
                            <span class="value phone-hover">
                                {{ detail.email }}
                                <a-button
                                    type="link"
                                    v-if="!detail.flag_eyes && detail.status !== STATUS.CUSTOMER"
                                    class="switch"
                                    @click="handleChecking()"
                                    ><i class="icon i_eyes"
                                /></a-button>
                            </span>
                        </a-col>
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span class="key">{{ $t('crm_c.level') }}：</span>
                            <span class="value">{{
                                $Util.CRMCustomerLevelFilter(detail.level, $i18n.locale) || '-'
                            }}</span>
                        </a-col>
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span class="key">{{ $t('crm_c.type') }}：</span>
                            <span class="value">{{
                                $Util.CRMCustomerTypeFilter(detail.type, $i18n.locale) || '-'
                            }}</span>
                        </a-col>
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span class="key">{{ $t('crm_c.own_user_name') }}：</span>
                            <span class="value">{{ detail.own_user ? detail.own_user.name : '-' }}</span>
                        </a-col>
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span class="key">{{ $t('crm_c.pre_own_user') }}：</span>
                            <span class="value">{{ detail.pre_own_user_name }}</span>
                        </a-col>
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span class="key">{{ $t('n.time') }}：</span>
                            <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                        </a-col>
                        <!-- 订单来源 -->
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span class="key">{{ $t('dis.order_source') }}：</span>
                            <span class="value">
                                {{
                                    $Util.orderTestSourceType(detail.crm_test_drive_order?.channel, $i18n.locale) || '-'
                                }}
                            </span>
                        </a-col>
                        <!-- 试驾车型 -->
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span class="key">{{ $t('dis.crm_dict_id') }}：</span>
                            <span class="value">
                                {{ detail.crm_test_drive_order?.item_name || '-' }}
                            </span>
                        </a-col>
                        <!-- 标签展示 -->
                        <a-col :xs="24" :sm="24" :lg="24" class="detail-item">
                            <span class="key">{{ $t('sl.show') }}：</span>
                            <span class="value" style="overflow: initial; white-space: normal">
                                <LabelList :targetId="id" :targetType="Core.Const.CRM_LABEL.CATEGORY.CUSTOMER" />
                            </span>
                        </a-col>
                        <!-- 门店邮件是否发送 -->
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span style="color: #8b9aae">{{ $t('dis.store_is_send_mail') }}：</span>
                            <span>
                                <span v-if="!detail.crm_test_drive_order?.flag_mail_sent_store">-</span>
                                <!-- 1已发 2未发-->
                                <span v-else-if="detail.crm_test_drive_order?.flag_mail_sent_store == 1">
                                    {{ $t('dis.been_sent') }}
                                    <!-- ({{ $t('dis.mail') }}:1234) -->
                                </span>
                                <span v-else-if="detail.crm_test_drive_order?.flag_mail_sent_store == 2">
                                    <span style="color: #f31c12">{{ $t('dis.fail_send') }}</span>
                                    <a-button type="link" style="margin-left: 8px" @click="resetEmailEvent('store')">{{
                                        $t('dis.fagain_send')
                                    }}</a-button>
                                </span>
                            </span>
                        </a-col>
                        <!-- 用户邮件是否发送 -->
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span style="color: #8b9aae">{{ $t('dis.user_is_send_mail') }}：</span>
                            <span>
                                <span v-if="!detail.crm_test_drive_order?.flag_mail_sent_user">-</span>
                                <!-- 1已发 2未发 -->
                                <span v-else-if="detail.crm_test_drive_order?.flag_mail_sent_user == 1">
                                    {{ $t('dis.been_sent') }}
                                    <!-- ({{ $t('dis.mail') }}:1234) -->
                                </span>
                                <span v-else-if="detail.crm_test_drive_order?.flag_mail_sent_user == 2">
                                    <span style="color: #f31c12">{{ $t('dis.fail_send') }}</span>
                                    <a-button type="link" style="margin-left: 8px" @click="resetEmailEvent('user')">{{
                                        $t('dis.fagain_send')
                                    }}</a-button>
                                </span>
                            </span>
                        </a-col>
                        <a-col :xs="24" :sm="24" :lg="24" class="detail-item flex-align-start">
                            <span class="key">{{ $t('crm_c.leave_message') }}：</span>
                            <div v-if="detail.consult">
                                <div v-for="(item, index) in detail.consult" :key="index">
                                    {{ item.content || '-' }}
                                </div>
                            </div>
                            <div v-else>
                                -
                            </div>
                        </a-col>
                        <a-col :xs="24" :sm="24" :lg="24" class="detail-item">
                            <!-- <a-button type="primary" @click="routerChange('test-drive')" v-if="$auth('crm-customer.save')">{{ $t('crm_d.save') }}</a-button>
                            <template v-if="detail.status === STATUS.POOL">
                                <FollowUpShow :btnText="$t('crm_c.add_follow_records')" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER" @submit="getCRMTrackRecord" />
                                <CustomerAdd :btnText="$t('crm_c.add')" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER" :groupId="detail.group_id"  @select="getCRMContactList" />
                                <a-button @click="routerChange('edit')" v-if="$auth('crm-customer.save')">{{ $t('n.edit') }}</a-button>
                                <a-button type="primary" @click="handleObtain" v-if="$auth('crm-customer.obtain')">{{ $t('crm_c.obtain') }}</a-button>
                                <a-button type="primary" @click="handleBatch('distribute')" v-if="$auth('crm-customer.distribute')">{{ $t('crm_c.distribute') }}</a-button>
                                <a-button type="danger" @click="handleDelete" v-if="$auth('crm-customer.delete')">{{ $t('crm_c.delete') }}</a-button>
                            </template>
                            <template v-if="detail.status === STATUS.CUSTOMER &&  trackMemberDetail!== undefined  &&  trackMemberDetail!== null  &&  trackMemberDetail!== ''">
                                <template v-if="trackMemberDetail.type !== Core.Const.CRM_TRACK_MEMBER.TYPE.READ">
                                    <FollowUpShow :btnText="$t('crm_c.add_follow_records')" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER" @submit="getCRMTrackRecord"/>
                                    <a-button @click="routerChange('edit')" v-if="$auth('crm-customer.save')">{{ $t('n.edit') }}</a-button>
                                    <a-button @click="routerChange('bo-save')" v-if="$auth('crm-bo.save')">{{$t('crm_b.save')}}</a-button>
                                    <a-button @click="routerChange('order-save')" v-if="$auth('crm-order.save')">{{ $t('crm_o.save') }}</a-button>
                                    <CustomerAdd :btnText="$t('crm_c.add')"  :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER" :groupId="detail.group_id" @select="getCRMContactList" :addCustomerBtn="true"/>
                                </template>
                                <template v-if="trackMemberDetail.type === Core.Const.CRM_TRACK_MEMBER.TYPE.OWN">
                                    <a-button type="primary" @click="handleBatch('transfer')" v-if="$auth('crm-customer.transfer')">{{ $t('crm_c.transfer') }}</a-button>
                                    <a-button type="danger" @click="handleReturnPool" v-if="$auth('crm-customer.return-pool')">{{ $t('crm_c.return_pool') }}</a-button>
                                </template>
                            </template> -->
                        </a-col>
                    </a-row>
                </div>
                <!-- 预约门店 -->
                <div class="panel-content desc-container">
                    <div class="desc-title">
                        <div class="title-area">
                            <span class="title">{{ $t('dis.subscribe_store') }}</span>
                        </div>
                    </div>
                    <a-row class="desc-detail">
                        <!-- 门店名称 -->
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span class="key">{{ $t('dis.store_name') }}：</span>
                            <span class="value">
                                {{ storeDetail.name || '-' }}
                            </span>
                        </a-col>
                        <!-- 门店手机号 -->
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span class="key">{{ $t('dis.store_phone') }}：</span>
                            <span class="value">
                                {{ storeDetail.contact_phone || '-' }}
                            </span>
                        </a-col>
                        <!-- 门店邮箱 -->
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span class="key">{{ $t('dis.store_email') }}：</span>
                            <span class="value">
                                {{ storeDetail.contact_email || '-' }}
                            </span>
                        </a-col>
                        <!-- 营业时间 -->
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span class="key">{{ $t('dis.business_hours') }}：</span>
                            <span class="value">
                                <span v-if="storeDetail.business_time">
                                    {{ $t('dis.morning') }}: {{ storeDetail.business_time?.time.morning.begin }} -
                                    {{ storeDetail.business_time?.time.morning.end }}
                                    {{ $t('dis.afternoon') }}: {{ storeDetail.business_time?.time.afternoon.begin }} -
                                    {{ storeDetail.business_time?.time.morning.end }}
                                </span>
                                <span v-else> - </span>
                            </span>
                        </a-col>
                        <!-- 门店地址 -->
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span class="key">{{ $t('dis.store_address') }}：</span>
                            <span class="value">
                                {{ storeDetail.address || '-' }}
                            </span>
                        </a-col>
                        <!-- 门店官网 -->
                        <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                            <span class="key">{{ $t('dis.store_website') }}：</span>
                            <span class="value">
                                <a :href="storeDetail.official_website">{{ storeDetail.official_website || '-' }} </a>
                            </span>
                        </a-col>
                    </a-row>
                </div>
            </template>
            <template v-else>
                <!-- 中国详情显示 #labels 这 -->
                <div class="desc-zh-container">
                    <!-- 信息块 -->
                    <template v-for="($1, index1) in msg" :key="index">
                        <div class="desc-zh-title">
                            <div class="title-area">
                                <span class="title">{{ $t($1.title) }}</span>
                            </div>
                        </div>

                        <a-row class="desc-zh-detail">
                            <a-col
                                :xs="24"
                                :sm="12"
                                :lg="8"
                                class="detail-item input-box"
                                v-for="($2, index2) in $1.list"
                            >
                                <span class="key">{{ $2.key }}:</span>
                                <div class="value">
                                    <!--  
                                        type 
                                        三种类型 
                                        0 默认显示  
                                        1 输入框input  
                                        2 意向车型
                                        2.1 是否下拉选择 
                                        2.2 用车城市(区域)  
                                        2.3 性别
                                        2.4 骑行经验                    
                                        3下拉选择加能搜索的  
                                        4(意向度)点击弹窗的  
                                        5(其他驾驶工具)一个地方有两个输入框的 
                                     -->
                                    <template v-if="$2.type == 0">
                                        <div :class="[$2.value == 'phone' ? 'phone-hover' : '']" class="content-one">
                                            <span
                                                style="width: 80px; display: inline-block"
                                                v-if="$2.value == 'source_type'"
                                            >
                                                {{
                                                    Landing_Page[msgForm[$2.value]]
                                                        ? Landing_Page[msgForm[$2.value]][$i18n.locale] +
                                                          '-' +
                                                          Landing_Page[msgForm[$2.value]]['country'] +
                                                          Landing_Page[msgForm[$2.value]]['key']
                                                        : $Util.CRMCustomerSourceTypeFilter(
                                                              msgForm[$2.value],
                                                              $i18n.locale,
                                                          )
                                                }}
                                            </span>

                                            <span style="min-width: 80px; display: inline-block" v-else>{{
                                                msgForm[$2.value]
                                            }}</span>
                                            <template v-if="$2.value == 'phone'">
                                                <a-button
                                                    type="link"
                                                    v-if="!detail.flag_eyes && detail.status !== STATUS.CUSTOMER"
                                                    class="switch"
                                                    @click="handleChecking()"
                                                    ><i class="icon i_eyes"
                                                /></a-button>

                                                <CustomerSelect
                                                    :radioMode="true"
                                                    :phone="msgForm[$2.value]"
                                                    :check-mode="false"
                                                    :select-customer="true"
                                                    btn-class="select-item-btn"
                                                    btnType="link"
                                                    :btnText="$t('crm_c.rechecking')"
                                                >
                                                    {{ $t('crm_c.rechecking') }}
                                                </CustomerSelect>
                                            </template>
                                        </div>
                                    </template>
                                    <!-- 时间 -->
                                    <template v-if="$2.type == 0.1">
                                        <span class="content-one">{{ $Util.timeFilter(detail.create_time) }}</span>
                                    </template>
                                    <template v-else-if="$2.type == 0.2">
                                        <div class="content-one">
                                            <a-tag
                                                class="customer-tag"
                                                v-for="(item, index) in detail.label_list"
                                                :key="index"
                                                color="blue"
                                                >{{ lang === 'zh' ? item.label : item.label_en }}</a-tag
                                            >
                                        </div>
                                    </template>

                                    <template v-else-if="$2.type == 1">
                                        <a-input
                                            v-model:value="msgForm[$2.value]"
                                            style="width: 80%; font-size: 14px"
                                            :placeholder="$t('crm_c.be_added')"
                                            @blur="msgChange($2.value)"
                                            @pressEnter="msgChange($2.value)"
                                        />
                                    </template>
                                    <!-- 意向车型 -->
                                    <template
                                        v-else-if="
                                            $2.type == 2 &&
                                            (msgForm['source_type'] === 1 || msgForm['source_type'] === 4)
                                        "
                                    >
                                        <div class="select-box">
                                            <!-- {{msgForm[$2.value]}}{{ msg[index1].list[index2].onFocus }} -->
                                            <span
                                                class="none-content no-select-tab"
                                                v-if="
                                                    (msgForm[$2.value] == undefined || !msgForm[$2.value]) &&
                                                    !msg[index1].list[index2].onFocus
                                                "
                                                >{{ $t('crm_c.be_added') }}</span
                                            >
                                            <span
                                                class="select-value no-select-tab"
                                                v-else-if="!msg[index1].list[index2].onFocus"
                                            >
                                                {{ $Util.CRMVehicleTypeFilter(msgForm[$2.value], $i18n.locale) }}
                                            </span>
                                            <a-select
                                                :class="[msg[index1].list[index2].onFocus ? '' : 'select-tab']"
                                                v-model:value="msgForm[$2.value]"
                                                style="width: 80%"
                                                @focus="selectFocus($2.value)"
                                                @blur="msgChange($2.value)"
                                                :placeholder="$t('crm_c.be_added')"
                                            >
                                                <a-select-option
                                                    v-for="item in VehicleType"
                                                    :key="item.key"
                                                    :value="item.key"
                                                >
                                                    {{ lang === 'zh' ? item.zh : item.en }}
                                                </a-select-option>
                                            </a-select>
                                        </div>
                                    </template>
                                    <template
                                        v-else-if="
                                            $2.type == 2 &&
                                            (msgForm['source_type'] === 2 ||
                                                msgForm['source_type'] === 3 ||
                                                msgForm['source_type'] === 5 ||
                                                msgForm['source_type'] === 30 ||
                                                msgForm['source_type'] === 31)
                                        "
                                    >
                                        <span>{{ detail.crm_test_drive_order?.item_name || '-' }}</span>
                                    </template>
                                    <!-- 是否下拉选择框 -->
                                    <template v-else-if="$2.type == 2.1">
                                        <div class="select-box">
                                            <span
                                                class="none-content no-select-tab"
                                                v-if="
                                                    (msgForm[$2.value] == undefined || !msgForm[$2.value]) &&
                                                    !msg[index1].list[index2].onFocus
                                                "
                                                >{{ $t('crm_c.be_added') }}</span
                                            >
                                            <span
                                                class="select-value no-select-tab"
                                                v-else-if="!msg[index1].list[index2].onFocus"
                                            >
                                                {{
                                                    $Util.CRMTestDriveMotoExpMapFilter(msgForm[$2.value], $i18n.locale)
                                                }}
                                            </span>
                                            <a-select
                                                style="width: 80%"
                                                v-model:value="msgForm[$2.value]"
                                                :class="[msg[index1].list[index2].onFocus ? '' : 'select-tab']"
                                                @focus="selectFocus($2.value)"
                                                @blur="msgChange($2.value)"
                                                :placeholder="$t('crm_c.be_added')"
                                            >
                                                <a-select-option
                                                    v-for="item in MOTO_EXP_MAP"
                                                    :key="item.key"
                                                    :value="item.value"
                                                >
                                                    {{ lang === 'zh' ? item.zh : item.en }}
                                                </a-select-option>
                                            </a-select>
                                        </div>
                                    </template>
                                    <!-- 用车城市 -->
                                    <template v-else-if="$2.type == 2.2">
                                        <div class="select-box">
                                            <span
                                                class="none-content no-select-tab"
                                                v-if="
                                                    defAddrString === '' &&
                                                    detail.country === '' &&
                                                    !msg[index1].list[index2].onFocus
                                                "
                                                >{{ $t('crm_c.be_added') }}</span
                                            >
                                            <span
                                                class="select-value no-select-tab"
                                                v-if="!msg[index1].list[index2].onFocus"
                                            >
                                                {{ defAddrString || detail.country }}
                                            </span>
                                            <!-- ===''?'':msgForm['country'] <a-tree-select :class="[msg[index1].list[index2].onFocus ? '' : 'select-tab']"
                                                v-model:value="msgForm[$2.value]" style="width: 80%;"
                                                :tree-data="useCarOptions" :placeholder="$t('crm_c.be_added')"
                                                @focus="selectFocus($2.value)" tree-default-expand-all
                                                @blur="msgChange($2.value)" /> -->
                                            <ChinaAddressCascader
                                                style="width: 80%"
                                                @focus="selectFocus($2.value)"
                                                @blur="msgChange($2.value)"
                                                :on-select="true"
                                                :class="[msg[index1].list[index2].onFocus ? '' : 'select-tab']"
                                                @select="handleAddressSelect"
                                                :default-address="defAddr"
                                            />
                                        </div>
                                    </template>
                                    <!-- 性别 -->

                                    <template v-else-if="$2.type == 2.3">
                                        <div class="select-box">
                                            <span
                                                class="none-content no-select-tab"
                                                v-if="
                                                    (msgForm[$2.value] == undefined || !msgForm[$2.value]) &&
                                                    !msg[index1].list[index2].onFocus
                                                "
                                                >{{ $t('crm_c.be_added') }}</span
                                            >
                                            <span
                                                class="select-value no-select-tab"
                                                v-else-if="!msg[index1].list[index2].onFocus"
                                                >{{ $Util.CRMOrderSexFilter(msgForm[$2.value], $i18n.locale) }}</span
                                            >
                                            <a-select
                                                :class="[msg[index1].list[index2].onFocus ? '' : 'select-tab']"
                                                v-model:value="msgForm[$2.value]"
                                                style="width: 80%"
                                                @focus="selectFocus($2.value)"
                                                :placeholder="$t('crm_c.be_added')"
                                                @blur="msgChange($2.value)"
                                            >
                                                <a-select-option v-for="item in SEX" :key="item.key" :value="item.key">
                                                    {{ lang === 'zh' ? item.zh : item.en }}
                                                </a-select-option>
                                            </a-select>
                                        </div>
                                    </template>
                                    <!-- 骑行经验 -->
                                    <template v-else-if="$2.type == 2.4">
                                        <div class="select-box">
                                            <span
                                                class="none-content no-select-tab"
                                                v-if="
                                                    (msgForm[$2.value] == undefined || !msgForm[$2.value]) &&
                                                    !msg[index1].list[index2].onFocus
                                                "
                                                >{{ $t('crm_c.be_added') }}</span
                                            >
                                            <span
                                                class="select-value no-select-tab"
                                                v-else-if="!msg[index1].list[index2].onFocus"
                                                >{{ $Util.CRMRidingFilter(msgForm[$2.value], $i18n.locale) }}</span
                                            >
                                            <a-select
                                                :class="[msg[index1].list[index2].onFocus ? '' : 'select-tab']"
                                                v-model:value="msgForm[$2.value]"
                                                style="width: 80%"
                                                :placeholder="$t('crm_c.be_added')"
                                                @focus="selectFocus($2.value)"
                                                @blur="msgChange($2.value)"
                                            >
                                                <a-select-option
                                                    v-for="item in RidingExperience"
                                                    :key="item.key"
                                                    :value="item.key"
                                                >
                                                    {{ lang === 'zh' ? item.zh : item.en }}
                                                </a-select-option>
                                            </a-select>
                                        </div>
                                    </template>
                                    <!-- 行业 -->
                                    <template v-else-if="$2.type == 3">
                                        <div class="select-box">
                                            <span
                                                class="none-content no-select-tab"
                                                v-if="
                                                    (msgForm[$2.value] == undefined || !msgForm[$2.value]) &&
                                                    !msg[index1].list[index2].onFocus
                                                "
                                                >{{ $t('crm_c.be_added') }}</span
                                            >
                                            <span
                                                class="select-value no-select-tab"
                                                v-else-if="!msg[index1].list[index2].onFocus"
                                                >{{
                                                    $Util.CRMCustomerIndustryFilter(msgForm[$2.value], $i18n.locale)
                                                }}</span
                                            >
                                            <a-select
                                                :class="[msg[index1].list[index2].onFocus ? '' : 'select-tab']"
                                                v-model:value="msgForm[$2.value]"
                                                :placeholder="$t('crm_c.be_added')"
                                                style="width: 80%"
                                                @focus="selectFocus($2.value)"
                                                @blur="msgChange($2.value)"
                                            >
                                                <a-select-option
                                                    v-for="item of CRM_INDUSTRY_MAP"
                                                    :key="item.value"
                                                    :value="item.value"
                                                >
                                                    {{ lang === 'zh' ? item.zh : item.en }}
                                                </a-select-option>
                                            </a-select>
                                        </div>
                                    </template>
                                    <!-- 意向程度 -->
                                    <template v-else-if="$2.type == 4">
                                        <div class="intent cursor content-one" @click="intentEvent">
                                            <img
                                                class="img-hot"
                                                src="../../assets/images/intent/Vector.png"
                                                v-if="msgForm[$2.value] == 40"
                                                alt=""
                                            />
                                            <span style="margin-left: 3px; width: 120px; display: block">
                                                <span>
                                                    {{ $Util.CRMOrderIntentFilter(msgForm[$2.value], $i18n.locale) }}
                                                </span>
                                                <span class="none-content">{{
                                                    msgForm[$2.value] == undefined || msgForm[$2.value] == ''
                                                        ? $t('crm_c.be_added')
                                                        : ''
                                                }}</span>
                                            </span>
                                            <span class="text">编辑</span>
                                        </div>
                                    </template>

                                    <!-- 其他驾驶工具-->
                                    <template v-else-if="$2.type == 5">
                                        <div class="select-box" style="display: flex; align-items: center">
                                            <span
                                                class="none-content no-select-tab"
                                                v-if="
                                                    (msgForm[$2.value] == undefined || !msgForm[$2.value]) &&
                                                    !msg[index1].list[index2].onFocus
                                                "
                                                >{{ $t('crm_c.choose_class') }}</span
                                            >
                                            <span
                                                class="select-value no-select-tab"
                                                v-else-if="!msg[index1].list[index2].onFocus"
                                            >
                                                {{ msgForm[$2.value] }}</span
                                            >
                                            <a-select
                                                @focus="selectFocus($2.value)"
                                                :class="[msg[index1].list[index2].onFocus ? '' : 'select-tab']"
                                                :placeholder="$t('crm_c.choose_class')"
                                                style="width: 40%"
                                                v-model:value="msgForm[$2.value + '1']"
                                                @blur="msgChange($2.value)"
                                            >
                                                <a-select-option
                                                    v-for="item in otherTool"
                                                    :key="item.zh"
                                                    :value="item.zh"
                                                >
                                                    {{ lang === 'zh' ? item.zh : item.en }}
                                                </a-select-option>
                                            </a-select>
                                            <a-input
                                                :class="[msg[index1].list[index2].onFocus ? '' : 'select-tab']"
                                                v-model:value="msg[index1].list[index2].value2"
                                                @focus="selectFocus($2.value)"
                                                style="width: 40%; margin-left: 10px"
                                                :placeholder="$t('crm_c.output')"
                                                @blur="msgChange($2.value)"
                                                @pressEnter="msgChange($2.value)"
                                            />
                                        </div>
                                    </template>
                                </div>
                            </a-col>
                        </a-row>
                    </template>

                    <div class="desc-zh-title">
                        <div class="title-area">
                            <span class="title">购车关注点</span>
                        </div>
                    </div>
                    <div class="tabBox">
                        <AddTab
                            :tabList="carTrackList"
                            :targetListStr="tabData[0].value"
                            @addStr="addCarTrackStr"
                            @delStr="deleteCarTrackStr"
                            :keyValue="tabData[0].key"
                        />
                    </div>

                    <div class="desc-zh-title">
                        <div class="title-area">
                            <span class="title">购车习惯</span>
                        </div>
                    </div>

                    <div class="tabBox">
                        <AddTab
                            :tabList="carHabitsList"
                            :targetListStr="tabData[1].value"
                            @addStr="addCarTrackStr"
                            @delStr="deleteCarTrackStr"
                            :keyValue="tabData[1].key"
                        />
                    </div>

                    <div class="desc-zh-title">
                        <div class="title-area">
                            <span class="title">购车顾虑</span>
                        </div>
                    </div>

                    <div class="tabBox">
                        <AddTab
                            :tabList="carConcensList"
                            :targetListStr="tabData[2].value"
                            @addStr="addCarTrackStr"
                            @delStr="deleteCarTrackStr"
                            :keyValue="tabData[2].key"
                        />
                    </div>
                </div>
            </template>
        </div>

        <a-row>
            <a-col :xs="24" :sm="24" :lg="16">
                <div class="tabs-container">
                    <a-tabs v-model:activeKey="activeKey">
                        <!-- 跟进记录 tab -->
                        <a-tab-pane key="TrackRecord" :tab="$t('crm_t.track_record')">
                            <CRMTrackRecord
                                :targetId="id"
                                :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER"
                                :detail="detail"
                                ref="CRMTrackRecord"
                            >
                                <FollowUpShow
                                    :btnText="$t('crm_c.add_follow_records')"
                                    :targetId="detail.id"
                                    :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER"
                                    :isMoreCss="isMoreCss"
                                    :groupId="detail.group_id"
                                    @submit="getCRMTrackRecord"
                                />
                            </CRMTrackRecord>
                        </a-tab-pane>
                        <!-- 资料 tab -->
                        <a-tab-pane key="CustomerSituation" :tab="$t('crm_c.summary_information')">
                            <CustomerSituation :detail="detail" />
                        </a-tab-pane>
                        <!-- 试驾单列表 tab -->
                        <a-tab-pane key="TestDriveList" :tab="$t('crm_d.list')">
                            <CRMTestDrive v-if="id > 0" :detail="detail" :customerId="detail.id" ref="CRMTestDrive">
                                <a-button
                                    type="primary"
                                    @click="routerChange('test-drive')"
                                    v-if="$auth('crm-customer.save')"
                                    >{{ $t('crm_d.save') }}</a-button
                                >
                            </CRMTestDrive>
                        </a-tab-pane>
                        <!-- 联系人 tab -->
                        <a-tab-pane key="ContacPerson" :tab="$t('crm_t.contact_customer')">
                            <CRMContact
                                v-if="id > 0"
                                :detail="detail"
                                :targetId="detail.id"
                                :targetType="Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.CUSTOMER"
                                :flagOWN="
                                    trackMemberDetail != null
                                        ? trackMemberDetail.type === Core.Const.CRM_TRACK_MEMBER.TYPE.OWN
                                        : false
                                "
                                ref="CRMContact"
                            >
                                <CustomerAdd
                                    :btnText="$t('crm_c.add')"
                                    :targetId="detail.id"
                                    :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER"
                                    :groupId="detail.group_id"
                                    @select="getCRMContactList"
                                />
                            </CRMContact>
                        </a-tab-pane>
                        <!-- 商机 tab -->
                        <a-tab-pane key="Opportunity" :tab="$t('crm_b.new_bo')">
                            <CRMBo v-if="id > 0" :detail="detail" :customerId="detail.id" ref="CRMBo">
                                <a-button type="primary" @click="routerChange('add-crm-bo')" v-if="$auth('crm-bo.save')"
                                    ><i class="icon i_add" />{{ $t('crm_b.save') }}</a-button
                                >
                            </CRMBo>
                        </a-tab-pane>
                        <!-- 合同 -->
                        <a-tab-pane key="ContractList" :tab="$t('crm_o.list')">
                            <CRMOrder v-if="id > 0" :detail="detail" :customerId="detail.id" ref="CRMOrder">
                                <a-button
                                    type="primary"
                                    @click="routerChange('add-order')"
                                    v-if="$auth('crm-order.save')"
                                    ><i class="icon i_add" />{{ $t('crm_o.save') }}</a-button
                                >
                            </CRMOrder>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
            <a-col :xs="24" :sm="24" :lg="8">
                <div class="tabs-container">
                    <a-tabs v-model:activeKey="tabActiveKey">
                        <a-tab-pane
                            key="CustomerSituation"
                            :tab="$t('crm_c.team_members')"
                            v-if="detail.status !== Core.Const.CRM_CUSTOMER.STATUS.POOL"
                        >
                            <Group
                                v-if="id > 0"
                                :targetId="id"
                                :targetType="Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.CUSTOMER"
                                :detail="detail"
                                ref="Group"
                            />
                        </a-tab-pane>
                        <a-tab-pane key="InformationInfo" :tab="$t('crm_c.dynamic')">
                            <ActionRecord
                                v-if="id > 0"
                                :targetId="id"
                                :key="componentKey"
                                :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER"
                                :detail="detail"
                                ref="ActionRecord"
                            />
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
        </a-row>

        <a-modal v-model:visible="batchShow" :title="$t('crm_c.distribute_customer')" :after-close="handleBatchClose">
            <div class="form-item required">
                <div class="key">{{ $t('crm_b.customer_name') }}：</div>
                <div class="value">
                    {{ detail.name }}
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('crm_group.name') }}：</div>
                <div class="value">
                    <a-tree-select
                        class="CategoryTreeSelect"
                        v-model:value="group_id"
                        :placeholder="$t('def.select')"
                        :dropdown-style="{ maxHeight: '412px', overflow: 'auto' }"
                        :tree-data="groupOptions"
                        @blur="getUserData('')"
                        tree-default-expand-all
                    />
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('crm_b.own_user_name') }}：</div>
                <div class="value">
                    <a-select
                        v-model:value="batchForm.own_user_id"
                        show-search
                        :placeholder="$t('def.select') + $t('crm_b.own_user_name')"
                        :default-active-first-option="false"
                        :show-arrow="false"
                        :filter-option="false"
                        :not-found-content="null"
                        @search="getUserData"
                        :disabled="!group_id"
                    >
                        <a-select-option v-for="item in userData" :key="item.id" :value="item.id">
                            {{ item.account ? item.account.name : '-' }}
                        </a-select-option>
                    </a-select>
                </div>
            </div>
            <template #footer>
                <a-button @click="handleBatchSubmit" type="primary">{{ $t('def.ok') }}</a-button>
                <a-button @click="handleBatchClose">{{ $t('def.cancel') }}</a-button>
            </template>
        </a-modal>

        <a-modal v-model:visible="intentVisible" title="意向度修改" @ok="handleOk">
            <a-row class="model-intent">
                <a-col :md="24" class="intent-input">
                    <span class="key">调整为:</span>
                    <span class="value">
                        <a-select v-model:value="intentionName" style="width: 100%">
                            <a-select-option v-for="item in INTENTION" :key="item.key" :value="item.key">
                                {{ lang === 'zh' ? item.zh : item.en }}
                            </a-select-option>
                        </a-select>
                    </span>
                </a-col>
                <a-col :md="24" class="intent-input" :class="{ required: intentionName == '10' }">
                    <span class="key">调整理由:</span>
                    <span class="value">
                        <a-input v-model:value="intentSea" placeholder="输入理由" />
                    </span>
                </a-col>
            </a-row>
        </a-modal>
        <a-spin :spinning="loading" class="loading-incontent" v-if="loading" tip="Loading"></a-spin>
    </div>
</template>

<script>
import Core from '../../core';
import CustomerSituation from './components/CustomerSituation.vue';

import CRMBo from '@/components/crm/panel/CRMBo.vue';
import CRMContact from '@/components/crm/panel/CRMContact.vue';
import CRMOrder from '@/components/crm/panel/CRMOrder.vue';
import CRMTrackRecord from '@/components/crm/panel/CRMTrackRecord.vue';
import CRMTestDrive from '@/components/crm/panel/CRMTestDrive.vue';

import Group from '@/components/crm/panel/Group.vue';
import ActionRecord from '@/components/crm/panel/ActionRecord.vue';

import CustomerAdd from '@/components/crm/popup-btn/CustomerAdd.vue';
import FollowUpShow from '@/components/crm/popup-btn/FollowUpShow.vue';

import LabelList from '@/components/crm/common/LabelList.vue';
import AddTab from '@/components/crm/common/AddTab.vue';

import CustomerSelect from '@/components/crm/popup-btn/CustomerSelect.vue';
import ChinaAddressCascader from '@/components/common/ChinaAddressCascader.vue';
import data from '../../core/data';

export default {
    name: 'CustomerEdit',
    components: {
        ChinaAddressCascader,
        CustomerAdd,
        FollowUpShow,
        CRMContact,
        CRMBo,
        CRMTrackRecord,
        Group,
        CRMOrder,
        ActionRecord,
        CustomerSituation,
        LabelList,
        CRMTestDrive,
        AddTab,
        CustomerSelect,
    },
    props: {},
    data() {
        return {
            Core,
            MOTO_EXP_MAP: Core.Const.CRM_TEST_DRIVE.MOTO_EXP_MAP, // 是否
            INTENTION: Core.Const.CRM_ORDER.INTENTION, // 意向程度
            INTENTION_STATUS: Core.Const.CRM_ORDER.INTENTION_STATUS, // 意向程度
            SEX: Core.Const.CRM_ORDER.SEX, // 性别
            CRM_INDUSTRY_MAP: Core.Const.CRM_CUSTOMER.INDUSTRY_MAP, // 行业
            RidingExperience: Core.Const.CRM_ORDER.RidingExperience, // 骑行经验
            VehicleType: Core.Const.CRM_ORDER.VehicleType, // 骑行经验
            otherTool: Core.Const.CRM_ORDER.otherTool, // 其他驾驶工具
            TYPE_MAP: Core.Const.CRM_TRACK_RECORD.TYPE_MAP,
            INTENT_MAP: Core.Const.CRM_TRACK_RECORD.INTENT_MAP,
            STATUS: Core.Const.CRM_CUSTOMER.STATUS,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            // 意向度
            CHINA_INTENT: Core.Const.CRM_TRACK_RECORD.CHINA_INTENT,
            // 购车关注点
            carTrackList: Core.Const.CRM_TRACK_RECORD.CAR_BUYING_CONCERNS,
            // 购车习惯
            carHabitsList: Core.Const.CRM_TRACK_RECORD.BUY_HABITS,
            // 购车顾虑
            carConcensList: Core.Const.CRM_TRACK_RECORD.BUY_CONCERNS,
            Landing_Page: Core.Const.CRM_CUSTOMER.Landing_Page, // 落地页

            // 意向度编辑-弹窗
            intenPop: false,
            confirmLoading: false,
            // 意向度-值
            intention: '',
            intentionSea: '',
            gender: '',
            // crm-customer/save

            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            activeKey: 'TrackRecord',
            tabActiveKey: 'CustomerSituation',
            detail: {
                crm_test_drive_order: null,
            },
            batchForm: {
                own_user_id: '',
            },
            batchShow: false,
            userData: [],
            trackMemberDetail: undefined,
            groupOptions: [],
            group_id: undefined,
            id: '',
            storeDetail: {}, // 门店详情
            isFocus: false,
            msgForm: {
                // 基本信息
                name: '',
                phone: undefined,
                intention: undefined,
                gender: undefined,
                industry: undefined,
                pre_order_car_type: undefined,
                create_time: undefined,
                // 用车信息
                group_id: undefined,
                // group_id_name: undefined,
                moto_owner: undefined,
                moto_model: undefined,
                driver_license: undefined,
                ride_exp: undefined,
                other_brand_model: undefined,
                other_brand_model1: undefined,
                source_type: undefined,
                // 其他信息
                flag_kol: undefined,
                flag_seek_cooperation: undefined,

                car_purchase_focus: undefined,
                car_purchase_habit: undefined,
                car_purchase_concern: undefined,

                // 地址-仅中国
                // country:undefined,
                province: '',
                city: '',
                county: '',
            },
            // 意向度编辑数据双向绑定
            intentionName: '',
            // 区域组件（中国）--值
            defAddr: [],
            msg: [
                /* 
                    type 
                    三种类型 
                    0 默认显示  
                    1输入框input  
                    2  意向车型
                    2.1 是否下拉选择 
                    2.2 用车城市(区域)  
                    2.3 性别
                    2.4 骑行经验                    
                    3下拉选择加能搜索的  
                    4(意向度)点击弹窗的  
                    5(其他驾驶工具)一个地方有两个输入框的 
                */
                {
                    title: '基本信息',
                    list: [
                        { key: '名称', value: 'name', type: 1, onFocus: undefined },
                        { key: '电话', value: 'phone', type: 0, onFocus: undefined },
                        { key: '意向度', value: 'intention', type: 4, onFocus: undefined },
                        { key: '性别', value: 'gender', type: 2.3, onFocus: false },
                        { key: '行业', value: 'industry', type: 3, onFocus: false },
                        { key: '来源', value: 'source_type', type: 0, onFocus: false },
                        {
                            key: '创建时间',
                            value: 'create_time',
                            type: 0.1,
                            onFocus: undefined,
                        },
                        {
                            key: '意向车型',
                            value: 'pre_order_car_type',
                            type: 2,
                            onFocus: false,
                        },
                        { key: '状态', value: 'tab_type', type: 0.2, onFocus: undefined },
                    ],
                },
                {
                    title: '用车信息',
                    list: [
                        { key: '用车城市', value: 'group_id', type: 2.2, onFocus: false },
                        {
                            key: '是否有摩托车',
                            value: 'moto_owner',
                            type: 2.1,
                            onFocus: false,
                        },
                        {
                            key: '摩托车型号',
                            value: 'moto_model',
                            type: 1,
                            onFocus: undefined,
                        },
                        {
                            key: '是否有驾照',
                            value: 'driver_license',
                            type: 2.1,
                            onFocus: false,
                        },
                        { key: '骑行经验', value: 'ride_exp', type: 2.4, onFocus: false },
                        {
                            key: '其他驾驶工具',
                            value: 'other_brand_model',
                            value1: '',
                            value2: '',
                            type: 5,
                            onFocus: false,
                        },
                    ],
                },

                {
                    title: '其他信息',
                    list: [
                        { key: '是否是KOL', value: 'flag_kol', type: 2.1, onFocus: false },
                        {
                            key: '是否寻求合作',
                            value: 'flag_seek_cooperation',
                            type: 2.1,
                            onFocus: false,
                        },
                    ],
                },
            ],

            tabData: [
                {
                    strText: '购车关注点:',
                    value: '',
                    name: 'car_purchase_focus',
                    request: 'portrait', // 请求方式 三种  还有无请求（不允许更改）
                    key: 'car_purchase_focus',
                },
                {
                    strText: ' 购车习惯:',
                    value: '',
                    name: 'car_purchase_habit',
                    request: 'portrait', // 请求方式 三种  还有无请求（不允许更改）
                    key: 'car_purchase_habit',
                },
                {
                    strText: '购车顾虑:',
                    value: '',
                    name: 'car_purchase_concern',
                    request: 'portrait', // 请求方式 三种  还有无请求（不允许更改）
                    key: 'car_purchase_concern',
                },
            ],

            // #labels 标签定位
            intentVisible: false, // 意向程度model显示隐藏
            useCarOptions: [], // 用车城市
            // 意向程度 -理由
            intentSea: '',
            // key--动态组件
            componentKey: 0,
            // keyvalue-当前点击的
            keyValue: '',
            // 用车城市中文
            // cityUseCar: ''
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang;
        },
        // 判断新旧样式--显示
        isMoreCss() {
            let { country, source_type } = this.detail;
            if (source_type === 5 || source_type === 31 || source_type === 30 || country !== '中国') {
                return false;
            } else {
                return true;
            }
        },

        // 查找当前标签的onFocus
        /*    findBooOnFocusByValue() {
               this.msg.forEach(($1, index) => {
                   let val;
                   $1.list.forEach(($2, ind) => {
                       if ($2.value == this.keyValue) {
                           console.log('this.msg[index].list[ind]this.msg[index].list[ind]', this.msg[index].list[ind], $2, $2.onFocus);
                           return $2.onFocus;
                       }
                   })
               })
           }, */

        // cityUseCar() {
        //     this.useCarOptions.forEach((item, index) => {

        //     })
        // }

        // address--defAddr
        defAddrString() {
            var str = '';
            this.defAddr.forEach((item, index) => {
                if (item !== '') {
                    if (index < 1) str += item;
                    if (index > 0) str += '/' + item;
                }
            });
            return str;
        },
    },
    created() {
        this.id = Number(this.$route.query.id) || 0;
    },
    mounted() {
        if (this.id) {
            this.getCustomerDetail();
            this.getTargetByUserId();
        }
        if (Number(this.$route.query.store_id)) {
            this.storeFetch();
            // this.storeFetch()
        }
        // 用车城市
        this.GroupTreeFetch();
    },
    methods: {
        handleAddressSelect(address = []) {
            this.defAddr = Core.Util.deepCopy(address);
            console.log('handleAddressSelect', address, 'this.defAddr', this.defAddr);
            this.msgForm.province = address[0] ? address[0] : '';
            this.msgForm.city = address[1] ? address[1] : '';
            this.msgForm.county = address[2] ? address[2] : '';
        },
        // 刷新动态组件
        forceRerender() {
            this.componentKey += 1;
        },

        // 搜索框点击获取焦点事件
        selectFocus(value) {
            this.keyValue = value;
            this.msg.forEach(($1, index) => {
                $1.list.forEach(($2, ind) => {
                    if ($2.value == value) {
                        $2.onFocus = true;
                    }
                });
            });
            // this.findBooOnFocusByValue(value)
        },

        // 添加-购车关注点
        addCarTrackStr(data) {
            this.tabData.forEach((item, index) => {
                if (data.key == item.key) {
                    let arr = (item.value && item.value.split(',')) || [];

                    if (arr.indexOf(data.value) === -1) {
                        arr.push(data.value);
                    } else {
                        this.$message.warning('您已添加该标签'); //回退
                        return;
                    }
                    item.value = arr.join(',');
                    this.msgForm[data.key] = item.value;
                    this.msgChange(data.key);
                }
            });
        },
        // 删除购车关注点
        deleteCarTrackStr(data) {
            this.tabData.forEach((item, index) => {
                if (data.key == item.key) {
                    let arr = (item.value && item.value.split(',')) || [];
                    let num = arr.indexOf(data.value);
                    if (num !== -1) {
                        arr.splice(num, 1);
                    } else {
                        return;
                    }
                    item.value = arr.join(',');
                    // 调接口
                    this.msgForm[data.key] = item.value;
                    this.msgChange(data.key);
                }
            });
        },

        /* Fetch start*/
        // 门店详情
        storeFetch(params = {}) {
            Core.Api.Store.detail({
                id: Number(this.$route.query.store_id),
                ...params,
            })
                .then(res => {
                    console.log('获取门店详情', res);
                    this.storeDetail = res.detail;
                    this.storeDetail.business_time = JSON.parse(this.storeDetail.business_time);
                    console.log('测试', this.storeDetail);
                })
                .catch(err => {
                    console.log('获取门店列表失败', err);
                });
        },
        // 用车城市接口
        GroupTreeFetch() {
            Core.Api.CRMGroupMember.structureByUser().then(res => {
                this.useCarOptions = res.list;
                console.log('cityUseCar----this.useCarOptions', this.useCarOptions);
            });
        },

        // 保存crm-customer-portrait接口
        savePortrait(params) {
            Core.Api.CRMCustomerPortrait.save({ ...params })
                .then(res => {
                    console.log('rescrm-customer-portrait------res', res);
                    this.forceRerender();
                })
                .catch(err => {
                    console.log('rescrm-customer-portrait------err', err);
                });
        },
        // 保存意向程度修改
        saveIntent(params) {
            // 无意向-调整理由为必填
            if (params.intention == '10' && !this.intentSea) {
                return this.$message.warning('请填写调整理由！');
            }
            Core.Api.CRMTrackRecord.save({
                ...params,
            })
                .then(res => {
                    console.log('saveIntent--res', res);
                    this.msgForm.intention = Core.Util.deepCopy(this.intentionName);
                    this.intentVisible = false;
                    this.forceRerender();
                })
                .catch(err => {
                    console.log('saveIntent---err', err);
                });
        },

        // crm-customer
        saveCustomer(params) {
            Core.Api.CRMCustomer.save({ ...params })
                .then(res => {
                    console.log('saveCustomer------res', res);
                    this.forceRerender();
                })
                .catch(err => {
                    console.log('saveCustomer------err', err);
                });
        },
        /* Fetch end*/

        routerChange(type, item) {
            let routeUrl = '';
            switch (type) {
                case 'back': // 返回
                    routeUrl = this.$router.resolve({
                        path: '/crm-customer/customer-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'edit': // 修改
                    routeUrl = this.$router.resolve({
                        path: '/crm-customer/customer-edit',
                        query: { id: this.detail.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'bo-save': // 修改
                    routeUrl = this.$router.resolve({
                        path: '/crm-bo/bo-edit',
                        query: { customer_id: this.detail.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'order-save': // 修改
                    routeUrl = this.$router.resolve({
                        path: '/crm-order/order-edit',
                        query: { customer_id: this.detail.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'test-drive': // 新建试驾单
                    routeUrl = this.$router.resolve({
                        path: '/crm-test-drive-order/test-drive-edit',
                        query: { customer_id: this.detail.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'add-crm-bo': // 修改
                    routeUrl = this.$router.resolve({
                        path: '/crm-bo/bo-edit',
                        query: { customer_id: this.detail.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'add-order': // 修改
                    routeUrl = this.$router.resolve({
                        path: '/crm-order/order-edit',
                        query: { customer_id: this.detail.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getCustomerDetail() {
            this.loading = true;
            Core.Api.CRMCustomer.detail({
                id: this.id,
            })
                .then(res => {
                    console.log('getCustomerDetail res', res);
                    let d = res.detail;
                    this.detail = d;
                    this.detail.birthday = this.detail.birthday
                        ? dayjs.unix(this.detail.birthday).format('YYYY-MM-DD')
                        : undefined;
                    for (const key in this.form) {
                        this.form[key] = d[key];
                    }
                    this.defAddr = [d.province, d.city, d.county];

                    this.msgForm.province = Core.Util.deepCopy(this.defAddr[0]);
                    this.msgForm.city = Core.Util.deepCopy(this.defAddr[1]);
                    this.msgForm.county = Core.Util.deepCopy(this.defAddr[2]);
                    if (this.detail.status === Core.Const.CRM_CUSTOMER.STATUS.POOL) {
                        this.tabActiveKey = 'InformationInfo';
                    }
                    this.handleGroupTree();
                    this.setDetailPortraitToList(this.detail, this.tabData);

                    // this.defArea = [d.continent || '', d.country || '']
                })
                .catch(err => {
                    console.log('getCustomerDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // 另外的对象// 给数组赋值
        setDetailPortraitToList(dataObj, arrData) {
            // 信息
            console.log('输入', dataObj);
            let obj = {
                ...dataObj,
                ...dataObj['crm_customer_portrait'],
            };
            for (let item in this.msgForm) {
                if (obj[item] == 0) {
                    // 让其能显示待补充的字段
                    this.msgForm[item] = undefined;
                } else {
                    this.msgForm[item] = obj[item];
                }
            }
            this.intentionName = Core.Util.deepCopy(this.msgForm.intention);
            let otharr = obj['other_brand_model'].split('-');
            this.msgForm['other_brand_model1'] = otharr[0];
            this.msg[1].list[5].value2 = otharr[1];

            // 获取城市名称
            // this.getCityName();
            // 购车关注点之下的
            arrData.forEach((item, index) => {
                if (dataObj['crm_customer_portrait'] || dataObj['crm_customer_portrait'][item.key]) {
                    arrData[index].value = dataObj['crm_customer_portrait'][item.key];
                }
            });

            console.log('arrData', arrData, this.msgForm.intention);
        },
        // 获取城市名称
        /*        getCityName() {
                   Core.Api.CRMGroup.detail({ id: this.msgForm['group_id'] }).then(res => {
                       console.log('res============', res);
                       this.msgForm['group_id_name'] = res.detail?.name
                   }).catch(err => {
                       console.log('err============', err);
       
                   })
               }, */
        // 添加商品
        handleAddCustomerShow(ids, items) {
            Core.Api.CrmContactBind.batchSave({
                target_id: this.detail.id,
                target_type: Core.Const.CRM_CONTACT_BIND.TARGET_TYPE.CUSTOMER,
                contact_customer_ids: ids,
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.delete_success'));
                })
                .catch(err => {
                    console.log('handleDelete err', err);
                });
        },
        getCRMContactList() {
            this.$refs.CRMContact.getTableData();
        },
        handleBatch(type) {
            this.getUserData();
            this.batchShow = true;
            this.batchType = type;
        },
        handleBatchClose() {
            this.batchShow = false;
            this.batchType = '';
        },
        handleBatchSubmit() {
            if (!this.batchForm.own_user_id) {
                return this.$message.warning(this.$t('crm_c.select'));
            }
            switch (this.batchType) {
                case 'distribute':
                    Core.Api.CRMCustomer.distribute({
                        id: this.detail.id,
                        own_user_id: this.batchForm.own_user_id,
                    })
                        .then(() => {
                            this.$message.success(this.$t('crm_c.distribute_success'));
                            this.getCustomerDetail();
                            this.getTargetByUserId();
                            this.handleBatchClose();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                    break;
                case 'transfer':
                    Core.Api.CRMCustomer.transfer({
                        id: this.detail.id,
                        own_user_id: this.batchForm.own_user_id,
                    })
                        .then(() => {
                            this.$message.success(this.$t('crm_c.transfer_success'));
                            this.getCustomerDetail();
                            this.getTargetByUserId();
                            this.handleBatchClose();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                    break;
            }
        },
        getUserData(query) {
            this.batchForm.own_user_id = undefined;
            this.loading = true;
            Core.Api.User.listGroup({
                group_id: this.group_id,
                name: query,
                org_type: Core.Const.LOGIN.ORG_TYPE.ADMIN,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.userData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleDelete() {
            let _this = this;
            this.$confirm({
                title: this.$t('pop_up.sure_delete'),
                okText: this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMCustomer.delete({ id: _this.detail.id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));

                            _this.routerChange('back');
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
        handleObtain() {
            let _this = this;
            this.$confirm({
                title: this.$t('crm_c.sure_obtain'),
                okText: this.$t('def.sure'),
                okType: 'primary',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMCustomer.obtain({ id: _this.detail.id })
                        .then(() => {
                            _this.$message.success(_this.$t('crm_c.obtain_success'));
                            _this.getCustomerDetail();
                            _this.getTargetByUserId();
                            _this.handleBatchClose();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
        handleReturnPool() {
            let _this = this;
            this.$confirm({
                title: this.$t('crm_c.sure_return_pool'),
                okText: this.$t('def.sure'),
                okType: 'primary',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMCustomer.returnPool({ id: _this.detail.id })
                        .then(() => {
                            _this.$message.success(_this.$t('crm_c.return_pool_success'));
                            _this.getCustomerDetail();
                            _this.getTargetByUserId();
                            _this.handleBatchClose();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
        getTargetByUserId() {
            Core.Api.CRMTrackMember.getTargetByUserId({
                target_id: this.id,
                target_type: Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.CUSTOMER,
            }).then(res => {
                this.trackMemberDetail = res.detail;
                // console.log("trackMemberDetail", this.trackMemberDetail);
            });
        },
        getCRMTrackRecord() {
            this.$refs.CRMTrackRecord.getTableData();
        },
        getCrmActionRecordTableData() {
            this.$refs.TrackRecord.getCrmActionRecordTableData();
        },
        handleGroupTree() {
            Core.Api.CRMGroupMember.structureByUserGroup({
                group_id: this.detail.group_id,
            }).then(res => {
                this.groupOptions = res.list;
                console.log(res);
            });
        },
        handleChecking() {
            Core.Api.CRMCustomer.checking({
                id: this.detail.id,
            }).then(res => {
                this.detail.phone = res.detail.phone;
                this.msgForm.phone = res.detail.phone;
                this.detail.email = res.detail.email;
                this.detail.flag_eyes = true;
                console.log(res);
            });
        },
        // 重新发送
        resetEmailEvent(type) {
            // 用户
            if (type == 'user') {
                Core.Api.CRMTESTDRIVE.userEmail({
                    id: this.detail.crm_test_drive_order.id,
                })
                    .then(res => {
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else if (type == 'store') {
                Core.Api.CRMTESTDRIVE.storeEmail({
                    id: this.detail.crm_test_drive_order.id,
                })
                    .then(res => {
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        },

        // 意向程度
        intentEvent() {
            this.intentVisible = true;
        },
        // 意向程度 点击确定
        handleOk() {
            // target_type:1客户  商机 2
            let par = {
                intention: this.intentionName,
                content: this.intentSea,
                target_type: this.detail.type,
                target_id: this.detail.id,
            };
            this.saveIntent(par);
            // this.intentVisible = false;
        },

        // 信息提交
        msgChange(type) {
            let cusParms = {
                id: this.detail.id,
                [`${type}`]: this.msgForm[type],
                status: this.detail.status,
            };
            let porParms = {
                id: this.detail.crm_customer_portrait?.id,
                [`${type}`]: this.msgForm[type],
            };
            let group_id_par = {
                id: this.detail.id,
                province: this.msgForm['province'],
                city: this.msgForm['city'],
                county: this.msgForm['county'],
                status: this.detail.status,
            };

            this.msg.forEach(($1, index) => {
                $1.list.forEach($2 => {
                    $2.onFocus = false;
                });
            });
            if (type == 'other_brand_model') {
                if (
                    this.msg[1].list[5].value2 ||
                    (this.msgForm[type + '1'] !== undefined && this.msgForm[type + '1'])
                ) {
                    if (!this.msg[1].list[5].value2) {
                        this.msg[1].list[5].value2 = '未填写品牌';
                    }
                    if (!this.msgForm[type + '1']) {
                        this.msgForm[type + '1'] = '未选择车型';
                    }
                    this.msgForm[type] = this.msgForm[type + '1'] + '-' + this.msg[1].list[5].value2;
                    var othParms = {
                        id: this.detail.crm_customer_portrait?.id,
                        [`${type}`]: this.msgForm[type],
                    };
                } else {
                    return;
                }
            }

            switch (type) {
                case 'name':
                    this.saveCustomer(cusParms);
                    break;
                // 性别
                case 'gender':
                    this.saveCustomer(cusParms);
                    break;
                // 行业
                case 'industry':
                    this.saveCustomer(cusParms);
                    break;
                // 意向车型
                case 'pre_order_car_type':
                    this.savePortrait(porParms);
                    break;
                // 用车城市
                case 'group_id':
                    this.saveCustomer(group_id_par);
                    console.log('group_id_par', group_id_par);
                    break;
                // 是否有摩托车
                case 'moto_owner':
                    this.savePortrait(porParms);
                    break;
                // 摩托车型号
                case 'moto_model':
                    this.savePortrait(porParms);
                    break;
                // 是否有驾照
                case 'driver_license':
                    this.savePortrait(porParms);
                    break;
                // 骑行经验
                case 'ride_exp':
                    this.savePortrait(porParms);

                    break;
                // 其他驾驶工具
                case 'other_brand_model':
                    this.savePortrait(othParms);
                    break;
                // 是否是KOL
                case 'flag_kol':
                    this.savePortrait(porParms);

                    break;
                // 是否寻求合作
                case 'flag_seek_cooperation':
                    this.savePortrait(porParms);

                    break;
                // 购车关注点
                case 'car_purchase_focus':
                    this.savePortrait(porParms);

                    break;
                // 购车习惯
                case 'car_purchase_habit':
                    this.savePortrait(porParms);

                    break;
                // 购车顾虑
                case 'car_purchase_concern':
                    this.savePortrait(porParms);

                    break;
            }
        },
    },
};
</script>

<style lang="less">
#CustomerDetail {
    .icon {
        font-size: 12px;
    }

    .i_eyes {
        font-size: 12px;
    }

    .content-one {
        padding-left: 12px;
    }

    .phone-hover {
        .switch {
            opacity: 0;
        }

        &:hover {
            .switch {
                opacity: 1;
            }
        }
    }
    .gray-panel {
        .desc-container {
            .desc-detail {
                .detail-item {
                    span {
                        height: auto !important;
                        min-height: 22px !important;
                    }
                    &.flex-align-start {
                        align-items: flex-start;
                    }
                }
            }
        }
    }
}

.loading-fullscreen,
.loading-incontent {
    background-color: rgba(255, 255, 255, 0.8);
}

// 意向程度样式
.intent {
    display: flex;
    align-items: center;
}
// 意向度弹窗
.model-intent {
    .intent-input {
        display: flex;
        align-items: center;
        margin-top: 10px;

        .key {
            width: 100px;
        }

        .value {
            width: calc(100% - 100px);
        }

        .key::before {
            opacity: 0;
            content: '*';
            color: @TC_required;
            padding-right: 2px;
        }

        &.required {
            // 必填标志
            .key::before {
                opacity: 1;
            }
        }
    }
}

.ant-input {
    font-size: 14px;
}

input.ant-input {
    font-size: 14px;
}

.img-hot {
    height: 16px;
    width: 16px;
    margin-right: 10px;
}
</style>
