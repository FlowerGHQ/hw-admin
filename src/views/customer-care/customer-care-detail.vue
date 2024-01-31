<template>
    <div class="customer-care-detail">
        <!-- 基本信息 -->
        <div class="base-msg">
            <div class="d-f-a-b">
                <div class="base-msg-left d-f-a">
                    <div class="sn no-white-space">{{ $t('customer-care.inquiry_number') }} {{ customerCareDetail.uid }}</div>
                    <div class="no-white-space m-r-8 color-4E5969">{{ $t('customer-care.customer') }}:</div>
                    <div class="color-4E5969">{{ customerCareDetail.submit_user_name || "-" }}/{{ customerCareDetail.country || "-" }}</div>
                </div>
                <div
                    class="base-msg-right status-style"
                    :class="[
                        $Util.Common.returnClassName(customerCareDetail.status, [
                            {
                                status: Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.EQUALTREATMENT,
                                className: 'wait',
                            },
                            {
                                status: Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.INPROCESS,
                                className: 'deal',
                            },
                            {
                                status: Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED,
                                className: 'success',
                            },
                        ]),
                    ]"
                >
                    <MySvgIcon
                        :icon-class="
                            $Util.Common.returnClassName(customerCareDetail.status, [
                                {
                                    status: Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.EQUALTREATMENT,
                                    className: 'customer-care-wait',
                                },
                                {
                                    status: Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.INPROCESS,
                                    className: 'customer-care-deal',
                                },
                                {
                                    status: Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED,
                                    className: 'customer-care-success',
                                },
                            ])
                        "
                    />
                    <span class="m-l-4">                        
                        {{ $t($Util.Common.returnTranslation(customerCareDetail.status, Core.Const.CUSTOMER_CARE.ORDER_STATUS)) }}
                    </span>
                </div>
            </div>
            <!-- 详细信息 -->
            <div class="detail-msg">
                <div class="msg-title">{{ $t('customer-care.detailed_information') }}</div>
                <div class="msg-content m-t-20">
                    <!-- 问询类型 -->
                    <div class="type-style">
                        <div class="col d-f-a">
                            <div class="key m-r-16">{{ $t('customer-care.inquiry_type') }}</div>
                            <div
                                class="value inquiry-category-style"
                                :class="[
                                    $Util.Common.returnClassName(customerCareDetail.type, [
                                        {
                                            status: Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.MALFUNCTION,
                                            className: 'color-0061FF',
                                        },
                                        {
                                            status: Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.CONSULTATION,
                                            className: 'color-FF7D00',
                                        },
                                        {
                                            status: Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.BATTERY,
                                            className: 'color-00B42A',
                                        },
                                    ]),
                                ]"
                            >                               
                                {{ $t($Util.Common.returnTranslation(customerCareDetail.type, Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE)) }}
                            </div>
                        </div>
                        <div class="col">                            
                            <div class="key m-r-16">{{ $t('common.create_time')/*创建时间*/ }}</div>
                            <div class="value">
                                {{ $Util.timeFilter(customerCareDetail.create_time, 2) }}
                            </div>
                        </div>
                        <div 
                            class="col" 
                            v-if="!$Util.Common.returnTypeBool(customerCareDetail.type, [Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.CONSULTATION])"
                        >
                            <div class="key m-r-16">{{ $t('customer-care.failure_time') /*故障时间*/ }}</div>
                            <div class="value">
                                {{ $Util.timeFilter(customerCareDetail.fault_time, 2) }}
                            </div>
                        </div>
                        <div class="col">
                            <div class="key m-r-16">{{ $t('common.vehicle_model') /*车型*/}}</div>
                            <div class="value">
                                {{ $i18n.locale === "en" ? customerCareDetail.category?.name_en || "-" : customerCareDetail.category?.name || "-" }}
                            </div>
                        </div>
                        <div 
                            class="col" 
                            v-if="$Util.Common.returnTypeBool(customerCareDetail.type, [Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.CONSULTATION])"
                        >
                            <div class="key m-r-16">{{ $t('customer-care.mileage') /*公里数*/ }}</div>
                            <div class="value">                                
                                {{ customerCareDetail.mileage || '0' }}km
                            </div>
                        </div>
                    </div>

                    <!-- 车架号与公里数 -->
                    <div 
                        v-if="$Util.Common.returnTypeBool(customerCareDetail.type, [Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.MALFUNCTION])" 
                        class="vehicle-no-style m-t-20"
                    >
                        <div class="col">
                            <div class="key m-r-16 no-white-space m-r-8 m-t-8">{{ $t('common.vehicle_no') }}、{{ $t('customer-care.mileage') }}</div>
                            <div class="value d-f-a">
                                <div v-for="(item, index) in customerCareDetail.vehicle_list" :key="index" class="vehicle-item m-r-8 m-t-8">
                                    {{ item.vehicle_uid }}({{ item.mileage }}km)
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 问题描述 -->
                    <div class="problem-description-style m-t-20">
                        <div class="col">
                            <div class="key m-r-16">{{ $t('customer-care.problem_description') }}</div>
                            <div class="value">
                                {{ customerCareDetail.description }}
                            </div>
                        </div>
                    </div>

                    <!-- 附件 -->
                    <div class="attachment-style m-t-20">
                        <div class="col">
                            <div class="key m-r-16">{{ $t("customer-care.attachment") }}</div>
                            <div class="value d-f-a cursor">
                                <template v-for="(item, index) in customerCareDetail.attachment_list" :key="index">
                                    <template v-if="/(image\/|png|jpg|jpeg)/.test(item.type)">
                                        <img
                                            :class="{ 'm-l-16': index > 0 }"
                                            class="attachment-img"
                                            :src="item.path"
                                            alt=""
                                            @click="onViewImage(item)"
                                        />
                                    </template>
                                    <template v-else-if="/video\/+/.test(item.type)">
                                        <!-- 视频 -->
                                        <div
                                            class="video-container"
                                            :class="{ 'm-l-16': index > 0 }"
                                            @click="
                                                onViewImage({
                                                    type: 'video/*',
                                                    path: item.path,
                                                })
                                            "
                                        >
                                            <MySvgIcon class="video-icon" icon-class="video-icon" />
                                            <div class="time">{{ item.duration || "-" }}{{ item.duration ? "s" : "" }}</div>
                                            <div class="bottom-mask">{{ item.name }}</div>
                                        </div>
                                    </template>
                                </template>
                                <template v-if="customerCareDetail.attachment_list.length === 0">
                                    <span class="custom-not-uploaded">{{ $t('supply-chain.not_uploaded') }}</span>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 按钮 -->
            <div v-if="Number(customerCareDetail.status) !== Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED" class="detail-btn m-t-20">
                <a-button @click="onBtn('msg-edit')">
                    {{ msgVisible ? $t('customer-care.cancel_message') : $t('customer-care.edit_information') }}
                </a-button>
            </div>
        </div>

        <!-- 问询单归类 -->
        <div class="inquiry-classification m-t-16">
            <template v-if="isDistributerAdmin">
                <div class="inquiry-classification-title">{{ $t('customer-care.inquiry_list_classification') }}</div>

                <!-- 归类 -->
                <div class="inquiry-classification-item m-t-16 m-b-30">
                    <div class="inquiry-classification-key m-t-4">{{ $t('customer-care.classify') }}</div>
                    <div
                        class="inquiry-classification-value"
                        :class="{
                            'm-t-4': $Util.Common.returnTypeBool(customerCareDetail.status, [
                                Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED /*订单状态(已解决)*/,
                            ]),
                        }"
                    >
                        <template
                            v-if="
                                !$Util.Common.returnTypeBool(customerCareDetail.status, [
                                    Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED /*订单状态(已解决)*/,
                                ])
                            "
                        >
                            <a-radio-group v-model:value="customerCareDetail.purpose">
                                <a-radio v-for="(item, index) in Core.Const.CUSTOMER_CARE.SORTING_TYPE_THREE" :value="item.value">
                                    {{ $t(item.t) }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </a-radio>
                            </a-radio-group>
                        </template>
                        <template v-else>
                            <span>                                
                                {{ $t($Util.Common.returnTranslation(customerCareDetail.purpose, Core.Const.CUSTOMER_CARE.SORTING_TYPE_THREE)) }}
                            </span>
                        </template>
                        <br />
                        <!-- 上面选中索赔出现 -->
                        <template v-if="Number(customerCareDetail.purpose) === Core.Const.CUSTOMER_CARE.SORTING_TYPE_THREE_MAP.CLAIMCOMPENSATION">
                            <a-radio-group
                                v-if="
                                    !$Util.Common.returnTypeBool(customerCareDetail.status, [
                                        Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED /*订单状态(已解决)*/,
                                    ])
                                "
                                v-model:value="customerCareDetail.claim_type"
                            >
                                <a-radio v-for="(item, index) in Core.Const.CUSTOMER_CARE.SORTING_TYPE_TWO" :value="item.value">
                                    {{ $t(item.t) }}
                                </a-radio>
                            </a-radio-group>

                            <!-- 善意索赔 和 开箱损 -->
                            <div
                                v-if="
                                    !$Util.Common.returnTypeBool(customerCareDetail.claim_type, [
                                        Core.Const.CUSTOMER_CARE.SORTING_TYPE_TWO_MAP.GENERALCLAIM,
                                        0,
                                    ])
                                "
                                class="good-faith-claims p-10 m-t-8"
                            >
                                <div class="good-faith-claims-title">                                
                                    {{ $t($Util.Common.returnTranslation(customerCareDetail.claim_type, Core.Const.CUSTOMER_CARE.SORTING_TYPE_TWO)) }}
                                </div>
                                <div class="good-faith-claims-time">
                                    <template
                                        v-if="
                                            $Util.Common.returnTypeBool(customerCareDetail.claim_type, [
                                                Core.Const.CUSTOMER_CARE.SORTING_TYPE_TWO_MAP.BONAFIDECLAIM /*善意索赔*/,
                                            ])
                                        "
                                    >
                                        <span class="time-name m-r-8">{{ $t('customer-care.delivery_date') }}</span>
                                        <template
                                            v-if="
                                                !$Util.Common.returnTypeBool(customerCareDetail.status, [
                                                    Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED /*订单状态(已解决)*/,
                                                ])
                                            "
                                        >
                                            <a-date-picker class="w-224 m-r-16" v-model:value="customerCareDetail.delivery_time" />
                                            <a-radio-group v-model:value="customerCareDetail.insurance_status">
                                                <a-radio v-for="(item, index) in Core.Const.CUSTOMER_CARE.GOOD_FAITH" :value="item.value">
                                                    {{ $t(item.t) }}
                                                </a-radio>
                                            </a-radio-group>
                                        </template>
                                        <template v-else>
                                            <span>{{ dayjs(customerCareDetail.delivery_time).format("YYYY-MM-DD HH:mm") }}</span>
                                            <span class="m-l-4">                                                
                                                {{ $t($Util.Common.returnTranslation(customerCareDetail.insurance_status, Core.Const.CUSTOMER_CARE.GOOD_FAITH)) }}
                                            </span>
                                        </template>
                                    </template>
                                    <template
                                        v-else-if="
                                            $Util.Common.returnTypeBool(customerCareDetail.claim_type, [
                                                Core.Const.CUSTOMER_CARE.SORTING_TYPE_TWO_MAP.UNPACKINGDAMAGE /*开箱损*/,
                                            ])
                                        "
                                    >
                                        <span class="time-name m-r-8">{{ $t('customer-care.order_number') }}</span>
                                        <template
                                            v-if="
                                                !$Util.Common.returnTypeBool(customerCareDetail.status, [
                                                    Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED /*订单状态(已解决)*/,
                                                ])
                                            "
                                        >
                                            <a-input
                                                class="w-224"
                                                v-model:value="customerCareDetail.order_sn"
                                                :placeholder="$t('common.please_enter') + $t('common.vehicle_no')"
                                            />
                                        </template>
                                        <template> ({{ customerCareDetail.order_sn }}) </template>
                                    </template>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- 部件 -->
                <div class="inquiry-classification-item">
                    <div class="inquiry-classification-key">{{ $t('customer-care.parts') }}</div>
                    <div class="inquiry-classification-value">
                        <ItemSelect
                            v-if="
                                !$Util.Common.returnTypeBool(customerCareDetail.status, [
                                    Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED,
                                ]) /*订单状态(已解决)*/
                            "
                            btnType="default"
                            :btnText="$t('i.select_item')"
                            btnClass="item-select-btn"
                            :disabled-checked="partDisabledChecked"
                            @select="onHandlePartSelectItem"
                        />
                        <a-table
                            class="m-t-8"
                            :columns="partsColumns"
                            :data-source="customerCareDetail.part_list"
                            :pagination="false"
                            :scroll="{ x: true }"
                        >
                            <template #bodyCell="{ column, text, record }">
                                <!-- 名称 -->
                                <template v-if="column.key === 'name'">
                                    {{ $i18n.locale === "en" ? record?.name_en || "-" : record?.name + "等" || "-" }}
                                </template>
                                <!-- 类型 -->
                                <template v-if="column.key === 'type'">                                    
                                    {{ $t($Util.Common.returnTranslation(text, Core.Const.CUSTOMER_CARE.PART_STATUS)) }}
                                </template>
                                <!-- 数量 -->
                                <template v-if="column.key === 'amount'">
                                    <template
                                        v-if="
                                            !$Util.Common.returnTypeBool(customerCareDetail.status, [
                                                Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED /*订单状态(已解决)*/,
                                            ])
                                        "
                                    >
                                        <a-input-number 
                                            v-model:value="record.amount" 
                                            defaultValue="1" 
                                            :placeholder="$t('common.please_enter')" 
                                            min="0"
                                            max="9999999"
                                        />
                                    </template>
                                </template>
                            </template>
                        </a-table>
                    </div>
                </div>

                <!-- 故障分类 -->
                <div
                    v-if="
                        !$Util.Common.returnTypeBool(customerCareDetail.type, [Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.CONSULTATION /*咨询*/])
                    "
                    class="inquiry-classification-item m-t-30"
                >
                    <div
                        class="inquiry-classification-key"
                        :class="{
                            'm-t-4': $Util.Common.returnTypeBool(customerCareDetail.type, [
                                Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.BATTERY /*电池*/,
                            ]),
                        }"
                    >
                        {{ $t("customer-care.fault_classification") }}
                    </div>
                    <div class="inquiry-classification-value">
                        <template
                            v-if="
                                $Util.Common.returnTypeBool(customerCareDetail.type, [
                                    Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.MALFUNCTION /*故障*/,
                                ])
                            "
                        >
                            <a-table :columns="faultColumns" :data-source="customerCareDetail.vehicle_list" :pagination="false" :scroll="{ x: true }">
                                <template #bodyCell="{ column, text, record }">
                                    <!-- 故障类型 -->
                                    <template v-if="column.key === 'fault_type'">
                                        <template
                                            v-if="
                                                !$Util.Common.returnTypeBool(customerCareDetail.status, [
                                                    Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED,
                                                ]) /*订单状态(已解决)*/
                                            "
                                        >
                                            <a-radio-group v-model:value="record.fault_type">
                                                <template v-for="(item, index) in Core.Const.CUSTOMER_CARE.FAULT_TYPE" :key="index">
                                                    <a-radio v-if="item.value !== -1" :value="item.value">
                                                        {{ $t(item.t) }}
                                                    </a-radio>
                                                </template>
                                            </a-radio-group>
                                        </template>
                                        <template v-else>                                            
                                            {{ $t($Util.Common.returnTranslation(text, Core.Const.CUSTOMER_CARE.FAULT_TYPE)) }}
                                        </template>
                                    </template>
                                </template>
                            </a-table>
                        </template>
                        <template
                            v-else-if="
                                $Util.Common.returnTypeBool(customerCareDetail.type, [
                                    Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.BATTERY /*电池*/,
                                ])
                            "
                        >
                            <template
                                v-if="
                                    !$Util.Common.returnTypeBool(customerCareDetail.status, [
                                        Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED,
                                    ]) /*订单状态(已解决)*/
                                "
                            >
                                <a-radio-group v-model:value="customerCareDetail.fault_type">
                                    <template v-for="(item, index) in Core.Const.CUSTOMER_CARE.FAULT_TYPE" :key="index">
                                        <a-radio v-if="item.value !== -1" :value="item.value">
                                            {{ $t(item.t) }}
                                        </a-radio>
                                    </template>
                                </a-radio-group>
                            </template>
                            <template v-else>                                
                                {{ $t($Util.Common.returnTranslation(customerCareDetail.status, Core.Const.CUSTOMER_CARE.FAULT_TYPE)) }}
                            </template>
                        </template>
                    </div>
                </div>
            </template>

            <!-- 沟通过程 -->
            <div id="inquiry-classification-item" class="inquiry-classification-item" :class="{ 'm-t-30': isDistributerAdmin }">
                <div class="inquiry-classification-key">
                    {{ isDistributerAdmin ? $t("customer-care.communication_process") : $t("customer-care.leave_message") }}
                </div>
                <div class="inquiry-classification-value">
                    <div class="communication-process p-10">
                        <template v-for="(item, index) in comment_list" :key="index">
                            <!-- 其他回复 -->

                            <div
                                v-if="
                                    isDistributerAdmin
                                        ? Number(item.org_type) === Core.Const.USER.TYPE.DISTRIBUTOR
                                        : Number(item.org_type) === Core.Const.USER.TYPE.ADMIN
                                "
                                class="communication-process-other-reply m-t-30"
                            >
                                <div class="other-reply-platform-top">
                                    <div class="other-reply-platform-avatar m-r-8">
                                        <MySvgIcon icon-class="default-avater" />
                                    </div>
                                    <div class="other-reply-platform-name">
                                        <div class="name">
                                            {{ isDistributerAdmin ? $t("customer-care.distributor_message") : $t("customer-care.admin_message") }}
                                        </div>
                                        <div class="time">
                                            {{ $Util.timeFilter(item.create_time) }}
                                        </div>
                                    </div>
                                </div>
                                <div class="other-reply-platform-bottom">
                                    <div v-if="item.content" class="speech-skill p-10 m-t-10">
                                        <span>{{ item.content }}</span>
                                    </div>
                                    <div v-if="item.file.length > 0" class="reply-platform-attachment m-t-4 p-10">
                                        <div class="reply-platform-attachment-title">{{ $t("customer-care.attachment") }}:</div>
                                        <div class="reply-platform-attachment-img m-t d-f-a cursor">
                                            <template v-for="(itemPath, index) in item.file" :key="index">
                                                <template v-if="/(image\/|png|jpg|jpeg)/.test(itemPath.type)">
                                                    <img
                                                        :class="{ 'm-l-16': index > 0 }"
                                                        class="attachment-img"
                                                        :src="itemPath.path"
                                                        alt=""
                                                        @click="
                                                            onViewImage({
                                                                ...itemPath,
                                                                file: item.file,
                                                            })
                                                        "
                                                    />
                                                </template>
                                                <template v-else-if="/video\/+/.test(itemPath.type)">
                                                    <!-- 视频 -->
                                                    <div
                                                        class="video-container"
                                                        :class="{ 'm-l-16': index > 0 }"
                                                        @click="
                                                            onViewImage({
                                                                type: 'video/*',
                                                                path: itemPath.path,
                                                            })
                                                        "
                                                    >
                                                        <MySvgIcon class="video-icon" icon-class="video-icon" />
                                                        <div class="time">2:32s</div>
                                                        <div class="bottom-mask">{{ item.name }}</div>
                                                    </div>
                                                </template>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 我的回复 -->
                            <div
                                v-if="
                                    isDistributerAdmin
                                        ? Number(item.org_type) === Core.Const.USER.TYPE.ADMIN
                                        : Number(item.org_type) === Core.Const.USER.TYPE.DISTRIBUTOR
                                "
                                class="communication-process-my-reply m-t-30"
                            >
                                <div class="my-reply-platform-top">
                                    <div class="my-reply-platform-name m-r-8">
                                        <div class="name">{{ $t("customer-care.my_reply") }}</div>
                                        <div class="time">{{ $Util.timeFilter(item.create_time) }}</div>
                                    </div>
                                    <div class="my-reply-platform-avatar">
                                        <MySvgIcon icon-class="my-avater" />
                                    </div>
                                </div>
                                <div class="my-reply-platform-bottom">
                                    <div v-if="item.content" class="speech-skill p-10 m-t-10">
                                        <span>{{ item.content }}</span>
                                    </div>
                                    <div v-if="item.file.length > 0" class="reply-platform-attachment m-t-4 p-10">
                                        <div class="reply-platform-attachment-title">{{ $t("customer-care.attachment") }}:</div>
                                        <div class="reply-platform-attachment-img m-t d-f-a">
                                            <template v-for="(itemPath, index) in item.file" :key="index">
                                                <template v-if="/(image\/|png|jpg|jpeg)/.test(itemPath.type)">
                                                    <img
                                                        :class="{ 'm-l-16': index > 0 }"
                                                        class="attachment-img"
                                                        :src="itemPath.path"
                                                        alt=""
                                                        @click="
                                                            onViewImage({
                                                                ...itemPath,
                                                                file: item.file,
                                                            })
                                                        "
                                                    />
                                                </template>
                                                <template v-else-if="/video\/+/.test(itemPath.type)">
                                                    <!-- 视频 -->
                                                    <div
                                                        class="video-container"
                                                        :class="{ 'm-l-16': index > 0 }"
                                                        @click="
                                                            onViewImage({
                                                                type: 'video/*',
                                                                path: itemPath.path,
                                                            })
                                                        "
                                                    >
                                                        <MySvgIcon class="video-icon" icon-class="video-icon" />
                                                        <div class="time">2:32s</div>
                                                        <div class="bottom-mask">{{ item.name }}</div>
                                                    </div>
                                                </template>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <template
                            v-if="
                                !$Util.Common.returnTypeBool(customerCareDetail.status, [
                                    Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED /*订单状态(已解决)*/,
                                ])
                            "
                        >
                            <!-- 输入框 -->
                            <div class="m-t-20">
                                <a-textarea
                                    v-model:value="customerCareDetail.content"
                                    :placeholder="$t('common.please_enter') + $t('customer-care.leave_message')"
                                    allow-clear
                                    showCount
                                    :auto-size="{ minRows: 3, maxRows: 13 }"
                                    :maxlength="2000"
                                />
                            </div>

                            <!-- 添加附件 -->
                            <div class="add-attachment m-t-10">
                                <div class="add-attachment-title">{{ $t("customer-care.add_attachment") }}</div>
                                <div class="add-attachment-upload m-t-4">
                                    <MyUploads
                                        v-model:fileList="uploadOptions.fileData"
                                        :options="{
                                            maxCount: 3,
                                        }"
                                        @change="handleDetailChange"
                                        @preview="handlePreview"
                                        @remove="handleRemove"
                                    >
                                    </MyUploads>

                                    <div class="add-attachment-tip m-l-10">
                                        <div>{{ $t("customer-care.tip1") }}</div>
                                        <div>{{ $t("customer-care.tip2") }}</div>
                                        <div>{{ $t("customer-care.tip4") }}</div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="!isDistributerAdmin" class="send-btn">
                                <a-button @click="onBtn('sending')" type="primary">
                                    {{ $t("common.sending") /*发送*/ }}
                                </a-button>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <div
                v-if="
                    !$Util.Common.returnTypeBool(customerCareDetail.status, [Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED /*订单状态(已解决)*/])
                "
                class="submit-btn"
                :style="{ 'border-top': isDistributerAdmin ? '1px solid #f2f3f5' : '0px' }"
            >
                <div v-if="isDistributerAdmin">
                    <a-button @click="onBtn('inquiry-classification-cancel')">{{ $t("common.cancel") /*取消*/ }}</a-button>
                    <a-button @click="onBtn('inquiry-classification-sumbit')" type="primary">{{ $t("common.submit") /*提交*/ }}</a-button>
                </div>
                <div class="problem-tips" @click="onBtn('exclamation-point')">
                    <a-tooltip placement="topRight">
                        <template #title> {{ $t("customer-care.deal_tips") }} </template>
                        <div class="cursor">
                            <span class="m-r-4">{{ $t("customer-care.problem_solved") }}</span>
                            <MySvgIcon icon-class="exclamation-point" />
                        </div>
                    </a-tooltip>
                </div>
            </div>
        </div>

        <!-- v-if="isClose" -->
        <MyPreviewImageVideo v-model:isClose="isClose" :type="uploadOptions.previewType" :previewData="uploadOptions.previewImageVideo">
        </MyPreviewImageVideo>

        <!-- 编辑信息弹窗 -->
        <a-modal
            v-model:visible="msgVisible"
            :title="$t('customer-care.editing_data')"
            width="800px"
            :destroyOnClose="true"
            @ok="onBtn('msg-sumbit')"
            @cancel="onBtn('msg-cancel')"
        >
            <customerCareEdit ref="customeCareEdit" :isDetailEnter="true"></customerCareEdit>
            <template #footer>
                <div v-if="!isDetailEnter" class="model-footer-btn">
                    <a-button @click="onBtn('msg-cancel')">{{ $t("def.cancel") }}</a-button>
                    <a-button @click="onBtn('msg-sumbit')" type="primary">
                        {{ $t("def.sure") }}
                    </a-button>
                </div>
            </template>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance, watch, onMounted } from "vue";
import MySvgIcon from "@/components/MySvgIcon/index.vue";
import Core from "@/core";
import { useRouter, useRoute } from "vue-router";
import dayjs from "dayjs";
import MyPreviewImageVideo from "./components/MyPreviewImageVideo.vue";
import customerCareEdit from "./customer-care-edit.vue";
import ItemSelect from "@/components/popup-btn/ItemSelect.vue";
import { message } from "ant-design-vue";
import MyUploads from "./components/MyUploads.vue";

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const customerCareDetail = ref({
    uid: undefined,
    submit_user_name: undefined,
    country: undefined,
    type: undefined, // 问询单类型 1故障 2咨询 3电池
    status: undefined, // 订单状态(已解决)
    create_time: undefined, // 创建时间"1705667810"
    fault_time: undefined, // 故障时间"1705667810"
    category: {
        // name: "你好啊",
        // name_en: "hello World",
    }, // 车型
    vehicle_list: [
        // {
        //     vehicle_uid: "12312414214124",
        //     mileage: 20,
        //     fault_type: 1,
        // },
        // {
        //     vehicle_uid: undefined, // "12312414214124"
        //     mileage: undefined, // 20
        //     fault_type: undefined, // 2
        // },
    ], // 车架信息
    description: undefined, // "你好安徽发撒撒发哈是否撒谎"
    attachment_list: [],

    // 问询单归类底下的东西
    purpose: undefined,
    claim_type: undefined, // 索赔状态
    // 零件
    part_list: [
        // {
        //     amount: 10,
        //     type: 1,
        //     code: "111",
        //     name: "你哈送",
        //     name_en: "Heoolw",
        // }
    ],
    insurance_status: undefined, // 保险状态 1.保内 2.保外 3.其他
    delivery_time: undefined, // 发货日期
    order_sn: undefined, // 订单号
    fault_type: undefined, // 故障类型 1.失效，2.异响，3.划伤，4.燃烧，5.事故

    // 评论提交的参数
    content: "",
});

// 评论list的参数
const comment_list = ref([
    // {
    //     org_type: 10, //类型：10：平台方；15：分销商
    //     content: "11111", //内容
    //     file: "", //附件
    // }
]);

const isDistributerAdmin = ref(false); // 根据路由判断其是用在分销商(false) 还是平台方(true)
const isClose = ref(false); // 预览组件

// 上传预览和详情预览参数
const uploadOptions = ref({
    previewType: "image", // 上传的类型
    fileData: [], // 提交的数据
    previewImageVideo: [], // 预览照片和预览视频
});

const msgVisible = ref(false); // 基本信息弹窗
const partDisabledChecked = ref([]); // 部件不可选择的

/* computed start */
const partsColumns = computed(() => {
    const result = [
        { title: proxy.$t("common.name"), dataIndex: "name", key: "name" }, // 名称
        { title: proxy.$t("common.product_code"), dataIndex: "code", key: "code" }, // 商品编码
        { title: proxy.$t("common.type"), dataIndex: "type", key: "type" }, // 类型
        { title: proxy.$t("common.quantity"), dataIndex: "amount", key: "amount" }, // 数量
    ];
    return result;
});
const faultColumns = computed(() => {
    const result = [
        { title: proxy.$t("common.vehicle_no"), dataIndex: "vehicle_uid", key: "vehicle_uid" }, // 车架号
        { title: proxy.$t("customer-care.fault_classification"), dataIndex: "fault_type", key: "fault_type" }, // 故障分类
    ];
    return result;
});
/* computed end */

/* fetch start */
// 详情接口
const getDetailFetch = (params = {}) => {
    const obj = {
        id: route.query?.id,
        ...params,
    };
    Core.Api.inquiry_sheet
        .detail(obj)
        .then(async (res) => {
            console.log("详情接口 success", res.detail);
            customerCareDetail.value = res.detail;

            customerCareDetail.value.delivery_time = customerCareDetail.value.delivery_time ? dayjs.unix(res.detail?.delivery_time) : undefined; // 回显时间转换格式

            try {
                await getVideoTime(res.detail.attachment_list);
            } catch (error) {
                console.log("error", error);
            }

            customerCareDetail.value.attachment_list = res.detail.attachment_list.map((el) => {
                // console.log(el.name);
                // console.log(el.name.slice(0, 3));
                // console.log(el.name.slice(-5));
                return {
                    id: el.id,
                    name: el.name.length <= 10 ? el.name : `${ el.name.slice(0, 3) }...${ el.name.slice(-4) }`,
                    type: el.type,
                    path: Core.Const.NET.OSS_POINT + el.path,
                    duration: el.duration,
                };
            });
            console.log("最后的数据", customerCareDetail.value);

            partDisabledChecked.value = [];
            customerCareDetail.value.part_list = res.detail?.part_list.map((el) => {
                partDisabledChecked.value.push(el.item_id);
                return {
                    id: el.id || 0,
                    item_id: el.item_id,
                    type: el.type,
                    code: el.item?.code,
                    name: el.item?.name,
                    name_en: el.item?.name_en,
                    amount: el.amount,
                };
            });
        })
        .catch((err) => {
            console.log("详情接口 err", err);
        });
};
// 归类接口
const getSortingTypeFetch = (params = {}) => {
    return new Promise((resolve, reject) => {
        const obj = {
            id: route.query?.id,
            purpose: customerCareDetail.value.purpose,
            ...params,
        };

        if (Number(customerCareDetail.value.purpose) === Core.Const.CUSTOMER_CARE.SORTING_TYPE_THREE_MAP.CLAIMCOMPENSATION /*索赔*/) {
            obj["claim_type"] = customerCareDetail.value.claim_type;

            if (Number(customerCareDetail.value.claim_type) === Core.Const.CUSTOMER_CARE.SORTING_TYPE_TWO_MAP.BONAFIDECLAIM /*善意索赔*/) {
                obj["delivery_time"] = dayjs(customerCareDetail.value.delivery_time).unix();
                obj["insurance_status"] = customerCareDetail.value.insurance_status;
            } else if (Number(customerCareDetail.value.claim_type) === Core.Const.CUSTOMER_CARE.SORTING_TYPE_TWO_MAP.UNPACKINGDAMAGE /*开箱损*/) {
                obj["order_sn"] = customerCareDetail.value.order_sn;
            }
        }

        if (Number(customerCareDetail.value.type) === Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.BATTERY) {
            obj["fault_type"] = customerCareDetail.value.fault_type; // 电池类下的故障分类
        } else {
            obj["vehicle_list"] = customerCareDetail.value.vehicle_list; // 咨询和故障类下的故障分类
        }

        console.log("参数", obj);

        Core.Api.inquiry_sheet
            .sortingType(obj)
            .then((res) => {
                console.log("归类接口 success", res);
                resolve(res);
            })
            .catch((err) => {
                console.log("归类接口 err", err);
                resolve(err);
            });
    });
};
// 零件接口
const getBindPartFetch = (params = {}) => {
    return new Promise((resolve, reject) => {
        const obj = {
            id: route.query?.id,
            part_list: customerCareDetail.value.part_list, // 零件
            ...params,
        };
        Core.Api.inquiry_sheet
            .bindPart(obj)
            .then((res) => {
                console.log("零件接口 success", res);
                resolve(res);
            })
            .catch((err) => {
                console.log("零件接口 err", err);
                reject(err);
            });
    });
};
// 问询单标记解决接口
const markResolvedFetch = (params = {}) => {
    const obj = {
        id: route.query?.id,
        ...params,
    };
    Core.Api.inquiry_sheet
        .markResolved(obj)
        .then((res) => {
            console.log("问询单标记解决接口 success", res.list);
            message.success(proxy.$t("common.sucesss"));
            getDetailFetch();
        })
        .catch((err) => {
            console.log("问询单标记解决接口 err", err);
        });
};
// 评论接口list
const getCommentListFetch = (params = {}) => {
    const obj = {
        target_id: route.query?.id,
        target_type: 1, // 问询单
        ...params,
    };
    Core.Api.inquiry_sheet
        .commentList(obj)
        .then((res) => {
            console.log("评论接口", res);
            comment_list.value = res.list.map((el) => {
                return {
                    ...el,
                    file: el.file
                        ? JSON.parse(el.file).map((fileEl) => {
                              return {
                                  ...fileEl,
                                  path: Core.Const.NET.FILE_URL_PREFIX + fileEl.path,
                              };
                          })
                        : [],
                };
            });
        })
        .catch((err) => {
            console.log("问询单标记解决接口 err", err);
        });
};
// 新增评论接口
const saveCommentFetch = (params = {}) => {
    return new Promise((resolve, reject) => {
        const obj = {
            target_id: route.query?.id, //问询单id
            target_type: 1, //类型：1.问询单
            // content: "11111", //内容
            // file: "", //附件
            ...params,
        };
        Core.Api.inquiry_sheet
            .saveComment(obj)
            .then((res) => {
                console.log("新增评论接口 success", res);
                resolve(res);
            })
            .catch((err) => {
                console.log("新增评论接口 err", err);
                reject(err);
            });
    });
};
/* fetch end */

/* methods start */
// 查看视频(图片)
const onViewImage = (item) => {
    console.log("item", item);
    uploadOptions.value.previewImageVideo = [];

    if (/video\/+/.test(item.type)) {
        // 视频都是单个的
        uploadOptions.value.previewType = "video";
        uploadOptions.value.previewImageVideo = [item.path];
    } else {
        uploadOptions.value.previewType = "image";
        if (item.file?.length > 0) {
            // 留言下的附件
            item.file.forEach((el) => {
                if (/(image\/|png|jpg|jpeg)/.test(el.type)) {
                    if (el.name === item.name) {
                        // 让预览的那张图片在第一张
                        uploadOptions.value.previewImageVideo.unshift(el.path);
                    } else {
                        uploadOptions.value.previewImageVideo.push(el.path);
                    }
                }
            });
        } else {
            // 这个是详情信息的查看(照片需要判断其点击的哪个先展示哪个)[照片是多个的]
            customerCareDetail.value.attachment_list.forEach((el) => {
                if (/(image\/|png|jpg|jpeg)/.test(el.type)) {
                    if (Number(el.id) === Number(item.id)) {
                        // 让预览的那张图片在第一张
                        uploadOptions.value.previewImageVideo.unshift(el.path);
                    } else {
                        uploadOptions.value.previewImageVideo.push(el.path);
                    }
                }
            });
        }
    }
    console.log("previewImageVideo", uploadOptions.value.previewImageVideo);
    isClose.value = true;
};
// 按钮事件
const customeCareEdit = ref(null);
const onBtn = (type) => {
    console.log("点击", type);
    switch (type) {
        case "msg-edit":
            msgVisible.value = !msgVisible.value;
            break;
        case "msg-sumbit":
            console.log("确定按钮", customeCareEdit.value);
            customeCareEdit.value?.handleSubmit().then((res) => {
                msgVisible.value = false;
                getDetailFetch();
            });
            break;
        case "msg-cancel":
            msgVisible.value = false;
            break;
        case "inquiry-classification-cancel":
            if (!isDistributerAdmin.value) {
                router.push({
                    path: "/inquiry-management/list",
                });
            } else {
                // 平台方
                router.push({
                    path: "/inquiry-management/list",
                });
            }
            break;
        case "inquiry-classification-sumbit":
            let inquiryFile = uploadOptions.value.fileData.map((el) => {
                return {
                    name: el.name, // 附件名称
                    path: el.response?.data?.filename, // 附件url
                    type: el.type, // 附件类型
                };
            });
            let saveCommentParams = {
                file: inquiryFile.length > 0 ? JSON.stringify(inquiryFile) : undefined,
                content: customerCareDetail.value.content.trim(),
            };

            let promiseAll = [getBindPartFetch(), getSortingTypeFetch()];
            if (saveCommentParams.file || saveCommentParams.content) {
                // 判断留言接口是否写了数据
                promiseAll = [getBindPartFetch(), getSortingTypeFetch(), saveCommentFetch(saveCommentParams)];
            }

            // 提交事件
            Promise.all(promiseAll)
                .then((res) => {
                    console.log(res);
                    message.success(proxy.$t("common.sucesss"));
                    getDetailFetch();
                    getCommentListFetch();
                    customerCareDetail.value.content = undefined;
                    uploadOptions.value.fileData = [];
                })
                .catch((err) => {
                    console.log(err);
                    message.success(err.message || "common.fail");
                });
            break;
        case "exclamation-point":
            // 问题已解决按钮
            proxy.$confirm({
                title: proxy.$t("customer-care.mark_resolved_tips"),
                okText: proxy.$t("common.sure"),
                cancelText: proxy.$t("common.cancel"),
                okType: "danger",
                onOk() {
                    markResolvedFetch();
                },
            });
            break;
        case "sending":
            // 发送按钮(分销商才有)
            let sendingFile = uploadOptions.value.fileData.map((el) => {
                return {
                    name: el.name, // 附件名称
                    path: el.response?.data?.filename, // 附件url
                    type: el.type, // 附件类型
                };
            });

            let saveComment = {
                file: sendingFile.length > 0 ? JSON.stringify(sendingFile) : undefined,
                content: customerCareDetail.value.content.trim(),
            };

            if (saveComment.file || saveComment.content) {
                saveCommentFetch(saveComment)
                    .then((res) => {
                        message.success(proxy.$t("common.sucesss"));
                        getCommentListFetch();
                        customerCareDetail.value.content = undefined;
                        uploadOptions.value.fileData = [];
                    })
                    .catch((err) => {
                        console.log("saveCommentFetch_err", err);
                    });
            } else {
                message.success(proxy.$t("customer-care.no_content"));
            }

            break;
    }
};

// 部件的组件事件
const onHandlePartSelectItem = (ids, items) => {
    console.log("handleSelectItem ids:", ids, "items:", items);

    items.forEach((parentEl) => {
        const findIndexItem = customerCareDetail.value.part_list.findIndex((chidrenId) => Number(parentEl.id) === Number(chidrenId.id));

        let data = {
            id: 0,
            item_id: parentEl.id,
            type: parentEl.type,
            code: parentEl?.code,
            name: parentEl?.name,
            name_en: parentEl?.name_en,
            amount: 1,
        };
        if (findIndexItem === -1) {
            customerCareDetail.value.part_list.push(data);
            partDisabledChecked.value.push(parentEl.id);
        }
    });
};

// 上传组件事件
const handleDetailChange = ({ file, fileList }) => {
    console.log("输出文件", file, fileList);
    if (file.status === "done") {
        // 上传成功
        if (file.response.code === 0) {
            uploadOptions.value.fileData = fileList;
        } else {
            // 上传失败
            message.error(file.response.msg);
        }
    } else if (file.status === "error") {
        message.error(proxy.$t("common.upload_fail"));
    }
};
const handlePreview = ({ file, fileList }) => {
    console.log("预览", file, fileList);

    if (/^video\/+/.test(file.type)) {
        uploadOptions.value.previewImageVideo = [];
        uploadOptions.value.previewType = "video";
        uploadOptions.value.previewImageVideo.push(Core.Util.imageFilter(file.response?.data?.filename, 4));
        isClose.value = true;
        return;
    }

    uploadOptions.value.previewType = "image";
    uploadOptions.value.previewImageVideo = [];
    fileList.forEach((el) => {
        // console.log("输出的东西", el.response);
        if (el.response) {
            if (/(image\/|png|jpg|jpeg)/.test(el.type)) {
                if (file.uid === el.uid) {
                    // 让预览的哪张图片在第一张
                    uploadOptions.value.previewImageVideo.unshift(Core.Util.imageFilter(file.response?.data?.filename, 1));
                } else {
                    uploadOptions.value.previewImageVideo.push(Core.Util.imageFilter(file.response?.data?.filename, 1));
                }
            }
        }
    });
    console.log("结果", uploadOptions.value.previewImageVideo);
    isClose.value = true;
};
const handleRemove = ({ file, fileList }) => {
    console.log("删除", fileList);
};
// 获取视频的时长
const getVideoTime = (data) => {    
    return new Promise((resolve, reject) => {
        const arrs = data.map((el) => {
            if (/^video\/+/.test(el.type)) {
                return videoItemPromise(Core.Const.NET.OSS_POINT + el.path).then((res) => {
                    el.duration = res;
                }).then(err => {
                    console.error("哪个视频出错", err);
                })
            }
        });

        // 所有的promise对象完成了走 resolve
        Promise.all(arrs)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
};
const videoItemPromise = (src) => {
    const video = document.createElement("video");
    video.src = src;

    return new Promise((resolve, reject) => {
        video.addEventListener("loadeddata", function () {
            resolve(video.duration.toFixed(2));
        });

        video.addEventListener("error", function () {
            reject(src);
        });
        // 加载视频的元数据
        video.load();
        video.remove();
    });
};
/* methods end */

watch(
    () => router.currentRoute.value,
    (newValue, oldValue) => {
        console.log("newValue", newValue);
        if (newValue.matched[0].path === "/customer-care") {
            // 分销商的客户关怀
            isDistributerAdmin.value = false;
        } else if (newValue.matched[0].path === "/inquiry-management") {
            // 平台方
            isDistributerAdmin.value = true;
        }
    },
    {
        deep: true,
        immediate: true,
    }
);

onMounted(() => {
    getDetailFetch();
    getCommentListFetch();
    if (route.query?.leave) {
        let errorDom = document.querySelector("#inquiry-classification-item");
        errorDom.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
        });
    }
});
</script>

<style lang="less" scoped>
.customer-care-detail {
    .base-msg {
        background-color: #fff;
        padding: 20px;
        box-sizing: border-box;
        .base-msg-left {
        }
        .base-msg-right {
            font-size: 20px;
            font-weight: 400;
        }
        .sn {
            color: #1d2129;
            font-size: 18px;
            font-weight: 500;
            margin-right: 20px;
        }

        .detail-msg {
            .msg-title {
                color: #1d2129;
                font-size: 18px;
                font-weight: 400;
            }

            .msg-content {
                padding-right: 40px;
                box-sizing: border-box;

                .type-style,
                .vehicle-no-style,
                .problem-description-style,
                .attachment-style {
                    display: flex;
                    justify-content: space-between;

                    .col {
                        display: flex;

                        .key {
                            color: #1d2129;
                            font-size: 14px;
                            font-weight: 400;
                            width: 100px;
                            text-align: right;
                        }
                        .value {
                            color: #1d2129;
                            font-size: 14px;
                            font-weight: 400;

                            .attachment-img {
                                width: 80px;
                                height: 80px;
                                border-radius: 4px;
                                border: 1px solid #d9d9d9;
                                object-fit: cover;
                            }
                        }
                    }
                }

                .type-style {
                    display: flex;
                    align-items: center;
                }
                .vehicle-no-style {
                    .vehicle-item {
                        border-radius: 4px;
                        background: #f2f3f5;
                        padding: 0 4px;
                        box-sizing: border-box;
                        color: #1D2129;
                        font-size: 14px;
                        font-weight: 400;
                    }
                }
                .problem-description-style {
                }
                .attachment-style {
                }
            }
        }

        .detail-btn {
            width: 100%;
            text-align: center;
        }

        .color-4E5969 {
            color: #4E5969;
            font-size: 16px;
            font-weight: 400;
        }
    }

    .inquiry-classification {
        background-color: #fff;
        padding: 20px;
        box-sizing: border-box;

        .inquiry-classification-title {
            color: #1d2129;
            font-size: 18px;
            font-weight: 400;
        }

        .inquiry-classification-item {
            display: flex;
            // align-items: center;
            .inquiry-classification-key {
                color: #1d2129;
                font-size: 14px;
                font-weight: 400;
                width: 100px;
                text-align: right;
                margin-right: 16px;
            }
            .inquiry-classification-value {
                color: #1d2129;
                font-size: 14px;
                font-weight: 400;
                width: 100%;

                .good-faith-claims {
                    background-color: #f7f8fa;
                    .good-faith-claims-title {
                        color: #1d2129;
                        font-size: 14px;
                        font-weight: 500;
                    }

                    .good-faith-claims-time {
                        display: flex;
                        align-items: center;

                        .time-name {
                            color: #1d2129;
                            font-size: 14px;
                            font-weight: 400;
                            white-space: nowrap;
                        }
                    }
                }
            }
        }

        // 沟通过程 || 留言
        .communication-process {
            background-color: #f7f8fa;
            // min-height: 559px;

            .communication-process-other-reply,
            .communication-process-my-reply {
                .reply-platform-attachment {
                    background-color: #fff;
                    .reply-platform-attachment-title {
                        color: #1d2129;
                        font-size: 14px;
                        font-weight: 400;
                    }
                    .reply-platform-attachment-img {
                        .attachment-img {
                            width: 80px;
                            height: 80px;
                            border-radius: 4px;
                            border: 1px solid #d9d9d9;
                            object-fit: cover;
                        }
                    }
                }
            }

            .communication-process-other-reply {
                .other-reply-platform-top {
                    display: flex;
                    .other-reply-platform-avatar {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 36px;
                    }
                    .other-reply-platform-name {
                        .name {
                            color: #1d2129;
                            font-size: 14px;
                            font-weight: 400;
                        }
                        .time {
                            color: #86909c;
                            font-size: 12px;
                            font-weight: 400;
                        }
                    }
                }

                .other-reply-platform-bottom {
                    display: inline-block;
                    .speech-skill {
                        border-radius: 4px;
                        background-color: #fff;
                        color: #1d2129;
                        font-size: 14px;
                        font-weight: 400;
                    }
                }
            }
            .communication-process-my-reply {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                .my-reply-platform-top {
                    display: flex;
                    .my-reply-platform-avatar {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 36px;
                    }
                    .my-reply-platform-name {
                        text-align: right;
                        .name {
                            color: #1d2129;
                            font-size: 14px;
                            font-weight: 400;
                        }
                        .time {
                            color: #86909c;
                            font-size: 12px;
                            font-weight: 400;
                        }
                    }
                }

                .my-reply-platform-bottom {
                    display: inline-block;
                    .speech-skill {
                        border-radius: 4px;
                        background-color: #66a0ff;
                        color: #fff;
                        font-size: 14px;
                        font-weight: 400;
                    }
                }
            }

            .add-attachment {
                .add-attachment-title {
                    color: #1d2129;
                    font-size: 14px;
                    font-weight: 400;
                }

                .add-attachment-upload {
                    display: flex;
                    align-items: center;
                }

                .add-attachment-tip {
                    color: #666;
                    font-size: 14px;
                    font-weight: 400;
                }
            }

            .send-btn {
                width: 100%;
                display: flex;
                justify-content: flex-end;
            }
        }

        // 按钮
        .submit-btn {
            margin-top: 20px;
            padding-top: 18px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            .problem-tips {
                position: absolute;
                right: 0;
                font-size: 14px;
                font-weight: 400;
                color: #1d2129;
                border-radius: 4px;
                border: 1px solid #e5e6eb;
                background: #fff;
                padding: 4px 8px;                
            }
        }
    }
}

// 订单类别
.status-style {
    box-sizing: border-box;
    border-radius: 4px;
    padding: 8px 16px;
    box-sizing: border-box;

    &.deal {
        background: rgba(0, 97, 255, 0.1);
        color: #0061ff;
    }
    &.wait {
        background: rgba(255, 125, 0, 0.05);
        color: #ff7d00;
    }
    &.success {
        background: rgba(38, 171, 84, 0.05);
        color: #00b42a;
    }
}

// 问询类别
.inquiry-category-style {
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    padding: 4px 13px;
    box-sizing: border-box;
    .flex();
    &.color-FF7D00 {
        background: rgba(255, 125, 0, 0.1);
        color: #ff7d00 !important;
    }
    &.color-0061FF {
        background: rgba(0, 97, 255, 0.1);
        color: #0061ff !important;
    }
    &.color-00B42A {
        background: rgba(38, 171, 84, 0.1);
        color: #00b42a !important;
    }
}

.model-footer-btn {
    width: 100%;
    display: flex;
    justify-content: center;
}

// 视频样式
.video-container {
    width: 80px;
    height: 80px;
    background-color: #e9edf4;
    border-radius: 4px;
    position: relative;

    .video-icon {
        width: 32px;
        height: 23px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 16px;
    }

    .time {
        color: v#4E5969;
        font-size: 10px;
        font-weight: 400;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 38px;
    }

    .bottom-mask {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 22px;
        line-height: 22px;
        border-radius: 0px 0px 4px 4px;
        background: rgba(29, 33, 41, 0.6);
        color: #fff;
        font-size: 10px;
        font-weight: 400;
        text-align: center;
    }
}

.d-f-a {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}
.d-f-a-b {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.no-white-space {
    white-space: nowrap;
}

.w-224 {
    width: 224px;
}
.custom-not-uploaded {
    color: #666;
}
</style>
