<template>
    <div id="PurchaseOrderDetail">
        <!-- 采购订单详情 -->
        <div class="list-container">
            <div class="title-container">
                <div class="title-area" style="font-weight: 600">{{ $t('p.details') }}</div>
                <!--
                    (订单状态和订单类型) => 售前订单,售后订单 有按钮 & 
                    订单状态(等待审核 待支付 待生产 生产中)
                    ||
                    订单取消状态(待审核)
                    需要按钮

                    兼顾老数据 老数据不需要按钮  只有 TT和OA 全款支付 显示
                -->
                <div
                    class="btns-area"
                    v-if="
                        ($Util.Common.isMember(detail.type, [
                            FLAG_ORDER_TYPE.PRE_SALES,
                            FLAG_ORDER_TYPE.AFTER_SALES,
                        ]) &&
                            $Util.Common.isMember(detail.status, [
                                STATUS.WAIT_AUDIT,
                                STATUS.WAIT_PAY,
                                STATUS.WAIT_PRODUCED,
                                STATUS.IN_PRODUCTION,
                            ]) &&
                            $Util.Common.isMember(detail.pay_type, [
                                PAY_TIME.TT,
                                PAY_TIME.OA,
                                PAY_TIME.PAYMENT_TYPE_ALL_PAYMENT,
                            ])) ||
                        $Util.Common.isMember(detail.cancel_status, [AUDIT_CANCEL_STATUS.WAITING_FOR_APPROVAL])
                    "
                >
                    <!-- 
                        平台方 => 订单状态(待支付,待生产,生产中) --- 订单取消状态(待审核)
                        分销商 => 订单状态(待生产,生产中) --- 订单取消状态(待审核) 
                    -->
                    <template v-if="MoreActions()">
                        <a-dropdown placement="bottomRight">
                            <template #overlay>
                                <a-menu>
                                    <template v-if="$auth('purchase-order.export')">
                                        <!-- 暂时只有平台方 且订单已经发货 可以导出订单 -->
                                        <a-menu-item key="0">
                                            <!-- 导出PI -->
                                            <div @click="handleExportIn">
                                                {{ $t('p.export_purchase') }}
                                            </div>
                                        </a-menu-item>
                                        <!-- 修改PI -->
                                        <!-- <a-button @click="handleUpdatePI"><i class="icon i_edit" />{{ $t('p.update_PI') }}</a-button> -->
                                        <!-- <a-menu-item key="1">
                                            <div @click="handleUpdatePI">
                                                {{ $t('p.update_PI') }}
                                            </div>
                                        </a-menu-item> -->
                                    </template>

                                    <!-- 暂时只有平台方 且订单已经发货 可以导出订单 -->
                                    <!-- 导出商品信息 -->
                                    <!-- <template v-if="$auth('purchase-order.export')">
                                        <a-menu-item key="3">
                                            <div @click="handleExportInfo">
                                                {{ $t('p.export_product_information') }}
                                            </div>
                                        </a-menu-item>
                                    </template> -->
                                    <!-- <a-button @click="handleExportInfo">{{ $t('p.export_product_information') }}</a-button> -->

                                    <!-- 暂时只有平台方 且订单已经发货 可以导出订单 -->
                                    <!-- 以供应商报表方式导出 -->
                                    <!-- <template
                                        v-if="
                                            authOrg(detail.supply_org_id, detail.supply_org_type) &&
                                            detail.status !== STATUS.REVISE_AUDIT
                                        "
                                    >
                                        <a-menu-item key="3">
                                            <div v-if="$auth('ADMIN')" @click="handleExport">
                                                {{ $t('def.export_as_supplier_report') }}
                                            </div>
                                        </a-menu-item>
                                    </template> -->
                                </a-menu>
                            </template>
                            <a-button>
                                {{ $t('def.more_operations') }}
                                <DownOutlined />
                            </a-button>
                        </a-dropdown>
                    </template>

                    <template
                        v-if="
                            authOrg(detail.supply_org_id, detail.supply_org_type) &&
                            detail.status !== STATUS.REVISE_AUDIT
                        "
                    >
                        <!-- 出库 -->
                        <template v-if="!outStockBtnShow">
                            <a-button
                                v-if="
                                    (detail.status === STATUS.WAIT_DELIVER ||
                                        detail.status === STATUS.WAIT_TAKE_DELIVER) &&
                                    $auth('purchase-order.deliver')
                                "
                                type="primary"
                                @click="handleModalShow('out_stock')"
                                :disabled="exportDisabled"
                            >
                                <i class="icon i_deliver" />{{ $t('p.out_stock') }}
                            </a-button>
                        </template>
                    </template>

                    <!-- 赠送订单 => 平台方 & (等待审核 待支付 待生产)可见 & 查看赠送订单是否有数据有数据不显示 & 权限控制 -->
                    <a-button
                        v-if="
                            $Util.Common.isMember(loginType, [USER_TYPE.ADMIN]) &
                                $Util.Common.isMember(detail.status, [
                                    STATUS.WAIT_AUDIT,
                                    STATUS.WAIT_PAY,
                                    STATUS.WAIT_PRODUCED,
                                ]) &&
                            !giveOrderShow &&
                            $auth('purchase-order.give')
                        "
                        type="primary"
                        ghost
                        @click="handleGiveOrder"
                    >
                        {{ $t('p.give_order') }}
                    </a-button>

                    <!-- 更换商品 平台方(等待审核)可见 && 分销不可见 -->
                    <a-button
                        v-if="
                            $Util.Common.isMember(loginType, [USER_TYPE.ADMIN]) &&
                            $Util.Common.isMember(detail.status, [STATUS.WAIT_AUDIT])
                        "
                        type="primary"
                        ghost
                        @click="itemEditShow = true"
                    >
                        {{ $t('p.change_item') }}
                    </a-button>

                    <!-- 取消 仅分销商(可见) | 订单状态(等待审核 二次确认框 非审核状态 填写原因弹窗) -->
                    <a-button
                        v-if="
                            $Util.Common.isMember(loginType, [USER_TYPE.DISTRIBUTOR]) &&
                            $Util.Common.isMember(detail.status, [
                                STATUS.WAIT_AUDIT,
                                STATUS.WAIT_PAY,
                                STATUS.WAIT_PRODUCED,
                                STATUS.IN_PRODUCTION,
                            ])
                        "
                        :disabled="
                            $Util.Common.isMember(detail.cancel_status, [
                                AUDIT_CANCEL_STATUS.WAITING_FOR_APPROVAL,
                            ])
                        "
                        type="primary"
                        @click="
                            $Util.Common.isMember(detail.status, [STATUS.WAIT_AUDIT])
                                ? handleCancel()
                                : onCancelReason()
                        "
                    >
                        <i class="icon i_close_c" />{{ $t('def.cancel') }}
                        <!-- 目前仅展示待审核 -->
                        <span
                            v-if="
                                $Util.Common.isMember(detail.cancel_status, [
                                    AUDIT_CANCEL_STATUS.WAITING_FOR_APPROVAL,
                                ])
                            "
                            >({{ $t('distributor-detail.under_review') }})</span
                        >
                    </a-button>

                    <!-- 取消记录 按钮 => 仅分销商(可见) & 待支付 待生产 生产中 显示 & 取消记录是否有数据 -->
                    <a-button
                        v-if="
                            $Util.Common.isMember(loginType, [USER_TYPE.DISTRIBUTOR]) &&
                            $Util.Common.isMember(detail.status, [
                                STATUS.WAIT_PAY,
                                STATUS.WAIT_PRODUCED,
                                STATUS.IN_PRODUCTION,
                            ]) &&
                            isCancelRecord
                        "
                        type="primary"
                        @click="onCancelRecord"
                    >
                        {{ $t('distributor-detail.cancel_record') }}
                    </a-button>

                    <!-- 付款 分销商可见 & 订单状态(等待审核不显示) & 支付状态(待支付, 部分支付) & 权限-->
                    <a-button
                        v-if="
                            $Util.Common.isMember(loginType, [USER_TYPE.DISTRIBUTOR]) &&
                            !$Util.Common.isMember(detail.status, [STATUS.WAIT_AUDIT]) &&
                            $Util.Common.isMember(detail.payment_status, [
                                PAYMENT_STATUS.WAIT_PAY,
                                PAYMENT_STATUS.PAYING,
                            ]) &&
                            $auth('purchase-order.collection')
                        "
                        type="primary"
                        @click="routerChange('payment')"
                    >
                        <i class="icon i_received" />{{ $t('p.payment') }}
                    </a-button>

                    <!-- 审核按钮 => 平台方可见 & 等待审核状态可见 & 权限控制 -->
                    <template
                        v-if="
                            $Util.Common.isMember(loginType, [USER_TYPE.ADMIN]) &&
                            $Util.Common.isMember(detail.status, [STATUS.WAIT_AUDIT]) &&
                            $auth('purchase-order.audit')
                        "
                    >
                        <a-button type="primary" @click="handleModalShow('createAuditShow')">
                            <i class="icon i_audit" />{{ $t('p.create_audit') }}
                        </a-button>
                    </template>

                    <!-- 申请售后 目前不需要显示 -->
                    <template v-if="false">
                        <a-button type="primary" @click="routerChange('aftersales')" ghost>
                            <i class="icon i_edit" />{{ $t('p.apply_for_after_sales') }}
                        </a-button>
                    </template>
                </div>
            </div>
            <!-- 步骤条 -->
            <div class="gray-panel">
                <div class="panel-content">
                    <MySteps
                        :stepsList="stepsList"
                        :current="currStep"
                        :status="detail.status"
                        :payment_status="detail.payment_status"
                    >
                    </MySteps>
                </div>
            </div>
            <!-- 商品信息 -->
            <div class="list-container">
                <EditItem
                    key="purchase"
                    ref="purchaseOrderRef"
                    :order-id="id"
                    :detail="detail"
                    :isPurchaseOrderBtn="itemEditShow"
                    type="PURCHASE_ORDER"
                    @submit="getList"
                    @cancel="itemEditShow = false"
                >
                </EditItem>
            </div>
        </div>

        <!-- 赠送订单 -->
        <div v-if="giveOrderShow" class="gift-order" style="margin-bottom: 20px">
            <EditItem
                key="gift"
                :order-id="id"
                :is-first="firstEnter"
                :detail="detail"
                :btnText="$t('distributor.add_gift')"
                type="GIVE_ORDER"
                :isGiftOrderBtn="giveOrderShow"
                @submit="getList"
            >
            </EditItem>
        </div>

        <!-- 订单详情 -->
        <div class="list-container3">
            <div class="title-container">
                <div class="title-area" style="font-weight: 600">{{ $t('dis.order_detail') }}</div>
            </div>
            <a-row>
                <!-- 订单信息 -->
                <a-col :xs="24" :sm="24" :lg="12" :xl="12" class="info-block">
                    <div class="info-title">{{ $t('p.order_information') }}</div>
                    <!-- 订单编号 -->
                    <div class="info-item">
                        <div class="key">{{ $t('p.order_number') }}:</div>
                        <div class="value">
                            {{ detail.sn || '-' }}
                        </div>
                    </div>
                    <!-- 下单时间 -->
                    <div class="info-item">
                        <div class="key">{{ $t('p.order_time') }}:</div>
                        <div class="value">
                            {{ $Util.timeFilter(detail.create_time) || '-' }}
                        </div>
                    </div>
                    <!-- 付款方式 -->
                    <div class="info-item">
                        <div class="key">{{ $t('p.payment_terms') }}:</div>
                        <div class="value">
                            {{ $Util.payTypeFilter(detail.pay_type, $i18n.locale) || '-' }}
                        </div>
                    </div>
                    <!-- 是否分批发货 -->
                    <div class="info-item">
                        <div class="key">{{ $t('p.partial_shipments') }}:</div>
                        <div class="value">
                            {{ $Util.purchaseTransferFilter(detail.flag_part_shipment, $i18n.locale) }}
                        </div>
                    </div>
                    <!-- 是否转运 -->
                    <div class="info-item">
                        <div class="key">{{ $t('p.transshipment') }}:</div>
                        <div class="value">
                            {{ $Util.purchaseTransferFilter(detail.flag_transfer, $i18n.locale) }}
                        </div>
                    </div>
                    <!-- 备注信息 -->
                    <div class="info-item">
                        <div class="key">{{ $t('p.remark') }}:</div>
                        <div class="value">
                            {{ detail.remark || '-' }}
                        </div>
                    </div>
                </a-col>
                <!-- 买家信息 -->
                <a-col :xs="24" :sm="24" :lg="12" :xl="12" class="info-block">
                    <div class="info-title">{{ $t('p.delivery_information') }}</div>
                    <div>
                        <!-- 客户姓名 -->
                        <div class="info-item">
                            <div class="key">{{ $t('p.person') }}</div>
                            <!-- <div class="value">{{ detail.user_name || '-' }}</div> -->
                            <div class="value">{{ detail?.receive_info?.name || '-' }}</div>
                        </div>
                        <!-- 联系方式 -->
                        <div class="info-item">
                            <div class="key">{{ $t('p.contact') }}</div>
                            <div class="value">{{ detail?.receive_info?.phone || '-' }}</div>
                        </div>
                        <!-- 收货地址 -->
                        <div class="info-item">
                            <div class="key">{{ $t('ad.shipping_address') }}:</div>
                            <div class="value" v-if="detail.receive_info != null">
                                <a-tooltip>
                                    <template #title>{{
                                        this.$i18n.locale === 'zh'
                                            ? detail.receive_info.country +
                                                  detail.receive_info.province +
                                                  detail.receive_info.city +
                                                  detail.receive_info.county +
                                                  detail.receive_info.address || '-'
                                            : detail.receive_info.countryEn +
                                                  detail.receive_info.provinceEn +
                                                  detail.receive_info.cityEn +
                                                  detail.receive_info.county +
                                                  detail.receive_info.address || '-'
                                    }}</template>
                                    <div class="one-spils" style="width: 250px">
                                        {{
                                            this.$i18n.locale === 'zh'
                                                ? detail.receive_info.country +
                                                      detail.receive_info.province +
                                                      detail.receive_info.city +
                                                      detail.receive_info.county +
                                                      detail.receive_info.address || '-'
                                                : detail.receive_info.countryEn +
                                                      detail.receive_info.provinceEn +
                                                      detail.receive_info.cityEn +
                                                      detail.receive_info.county +
                                                      detail.receive_info.address || '-'
                                        }}
                                    </div>
                                </a-tooltip>
                            </div>
                            <div class="value" v-else>-</div>
                        </div>
                        <!-- 打托 -->
                        <div class="info-item">
                            <div class="key">{{ $t('p.playing_tricks') }}</div>
                            <div class="value">
                                {{ $Util.purchaseTransferFilter(detail.flag_pallet, $i18n.locale) || '-' }}
                            </div>
                        </div>
                        <!-- 期望交期 -->
                        <div class="info-item">
                            <div class="key">{{ $t('p.expected_delivery_time') }}</div>
                            <div class="value">{{ $Util.timeFilter(detail.deliver_time_expected) || '-' }}</div>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>

        <!-- 船期及运费 -->
        <div class="list-container3">
            <div class="title-container d-f-j">
                <div class="title-area" style="font-weight: 600">{{ $t('distributor.shipping_freight') }}</div>
                <div class="btn-area d-f-a">
                    <!-- 仅拒绝展示 -->
                    <div
                        v-if="$Util.Common.isMember(detail.freight_status, [FREIGHT_STATUS.REJECTED])"
                        class="m-r-10 status"
                        :class="$Util.Common.returenValue(FREIGHT_STATUS_MAP_FILTER, detail.freight_status, 'color')"
                    >
                        {{ detail.freight_audit_record?.remark }}
                    </div>                    
                    <!-- 分销商(待填写)不展示 -->
                    <div
                        class="status status-bg freight-status-style"
                        :class="$Util.Common.returenValue(FREIGHT_STATUS_MAP_FILTER, detail.freight_status, 'color')"
                    >
                        {{ $t($Util.Common.returnTranslation(detail.freight_status, FREIGHT_STATUS_MAP_FILTER)) }}
                    </div>
                </div>
            </div>
            <a-row>
                <a-col :xs="24" :sm="24" :lg="12" :xl="12" class="info-block">
                    <!-- 预计船期 仅平台方 &  运费状态 待确定、已拒绝状态支持(可修改) -->
                    <div class="info-item">
                        <div class="key">{{ $t('p.estimated_shipping_data') }}:</div>
                        <div class="value d-f-a">
                            <a-button
                                v-if="
                                    user_type &&
                                    $Util.Common.isMember(detail.freight_status, [
                                        FREIGHT_STATUS.TO_BE_FILLED_IN,
                                        FREIGHT_STATUS.TO_BE_CONFIRMED,
                                        FREIGHT_STATUS.REJECTED,
                                    ])
                                "
                                class="m-l-8"
                                type="link"
                                @click="onModify"
                            >
                                {{
                                    $Util.timeFilter(detail?.freight_audit_record?.content?.shipping_time_estimated, 3)
                                }}
                            </a-button>
                            <span v-else>
                                {{
                                    $Util.timeFilter(detail?.freight_audit_record?.content?.shipping_time_estimated, 3)
                                }}
                            </span>
                        </div>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="24" :lg="12" :xl="12" class="info-block">
                    <!-- 运费 仅平台方 &  运费状态 待确定、已拒绝状态支持(可修改)-->
                    <div class="info-item">
                        <div class="key">{{ $t('p.freight') }}:</div>
                        <div class="value d-f-a">
                            <a-button
                                v-if="
                                    user_type &&
                                    $Util.Common.isMember(detail.freight_status, [
                                        FREIGHT_STATUS.TO_BE_FILLED_IN,
                                        FREIGHT_STATUS.TO_BE_CONFIRMED,
                                        FREIGHT_STATUS.REJECTED,
                                    ])
                                "
                                class="m-l-8"
                                type="link"
                                @click="onModify"
                            >
                                <span>{{ $Util.priceUnitFilter(detail?.currency) }}</span>
                                <span>{{ $Util.countFilter(detail?.freight_audit_record?.content?.freight) }}</span>
                            </a-button>
                            <span v-else>
                                <span>{{ $Util.priceUnitFilter(detail.currency) }}</span>
                                <span>{{ $Util.countFilter(detail?.freight_audit_record?.content?.freight) }}</span>
                            </span>
                        </div>
                    </div>
                </a-col>
            </a-row>
            <!-- 分销商显示 分销商 & 待确定 可见-->
            <div
                v-if="
                    $Util.Common.isMember(loginType, [USER_TYPE.DISTRIBUTOR]) &&
                    $Util.Common.isMember(detail.freight_status, [FREIGHT_STATUS.TO_BE_CONFIRMED])
                "
                class="all-btn"
            >
                <a-button type="primary" @click="onConfirmFreight">{{ $t('distributor.confirm_freight') }}</a-button>
            </div>
        </div>

        <!-- 付款明细、发货记录、收货记录、合同、操作记录 -->
        <div v-if="!$auth('purchase-order.supply-detail')" class="list-container list-container2">
            <div class="title-container">
                <div class="title-area" style="font-size: 14px">
                    <eosTabs v-model:activeKey="activeValue" :tabsList="nameList" @handlechange="tableChange">
                    </eosTabs>
                </div>
                <div class="btns-area">
                    <div v-if="activeValue == 'AttachmentFile'">
                        <a-button type="primary" @click="attachmentEvent">{{ $t('n.upload_attachment') }}</a-button>
                    </div>
                </div>
            </div>
            <div class="container-body">
                <!-- 付款记录-->
                <template v-if="activeValue == 'payment_detail'">
                    <paymentList :target_id="id" :order_detail="detail" :sn="detail.sn" />
                </template>
                <!-- displayIn 这个变量是为了区分是收货记录和发货记录 因为现在收货记录和发货记录展示的信息基本相同 但是收货记录不需要展示收货明细 -->
                <!-- 发货记录 -->
                <template v-if="activeValue == 'delivery_record'">
                    <DeliveryLogs
                        :order-id="id"
                        :detail="detail"
                        :type="STOCK_TYPE.OUT"
                        :displayIn="true"
                        @submit="getList"
                    />
                </template>
                <!-- displayIn 这个变量是为了区分是收货记录和发货记录 因为现在收货记录和发货记录展示的信息基本相同 但是收货记录不需要展示收货明细 -->
                <!-- 收货记录 -->
                <template v-if="activeValue == 'receiving_record'">
                    <DeliveryLogs
                        :order-id="id"
                        :detail="detail"
                        :type="STOCK_TYPE.OUT"
                        :displayIn="false"
                        @submit="getList"
                    />
                </template>

                <!-- 收货明细 -->
                <template v-if="activeValue == 'receiving_detail'">
                    <receivingDetails :target_id="id" :order_detail="detail" :sn="detail.sn" />
                </template>

                <!-- 上传附件(合同信息) -->
                <template v-if="activeValue == 'AttachmentFile'">
                    <AttachmentFile
                        ref="attachment"
                        :target_id="id"
                        :target_type="ATTACHMENT_TYPE.PURCHASE_ORDER"
                        :detail="detail"
                        @submit="getList"
                    />
                </template>

                <!-- 操作记录 -->
                <template v-if="activeValue == 'ActionLog'">
                    <ActionLog
                        :id="id"
                        :detail="detail"
                        :sourceType="Core.Const.ACTION_LOG.SOURCE_TYPE.PURCHASE_ORDER"
                    />
                </template>
                <!-- 证书列表 -->
                <template v-if="activeValue == 'cocList'">
                    <CoCList :cocProps="cocProps" />
                </template>
            </div>
        </div>

        <template class="modal-container">
            <!-- 确认发货 -->
            <a-modal v-model:visible="outStockShow" :title="$t('p.shipping_confirmation')" @ok="handleOutStock">
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">{{ $t('wa.warehouse') }}：</div>
                        <div class="value">
                            <a-select
                                v-model:value="form.warehouse_id"
                                :placeholder="$t('def.select')"
                                :disabled="!!isProd"
                            >
                                <a-select-option v-for="item of warehouseList" :key="item.id" :value="item.id">{{
                                    item.name
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">{{ $t('p.remark') }}:</div>
                        <div class="value">
                            <a-input v-model:value="form.remark" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                </div>
            </a-modal>
            <!-- 订单审核 -->
            <a-modal
                v-model:visible="createAuditShow"
                :title="$t('p.create_audit')"
                @ok="handleCreateAudit"
                @cancel="handleCancelAudit"
            >
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">{{ $t('n.result_a') }}:</div>
                        <div class="value">
                            <a-radio-group v-model:value="form.audit_result">
                                <a-radio :value="1">{{ $t('n.pass') }}</a-radio>
                                <a-radio :value="2">{{ $t('n.fail') }}</a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">{{ $t('p.remark') }}:</div>
                        <div class="value">
                            <a-input v-model:value="form.remark" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                </div>
            </a-modal>
            <!-- 修改PI -->
            <a-modal v-model:visible="PIShow" :title="$t('p.update_PI')" @ok="UpdatePI">
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">{{ $t('p.shipping_port') }}:</div>
                        <div class="value">
                            <a-input v-model:value="form.port" :placeholder="$t('def.input')" />
                        </div>
                    </div>

                    <div class="form-item" v-if="detail.status === Core.Const.PURCHASE.STATUS.WAIT_AUDIT">
                        <div class="key">{{ $t('p.freight') }}:</div>
                        <div class="value">
                            <a-input-number
                                v-model:value="form.freight"
                                placeholder="0.00"
                                style="width: 120px"
                                :min="0.0"
                                :precision="2"
                                :prefix="`${$Util.priceUnitFilter(detail.currency)}`"
                            />
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">{{ $t('p.remark') }}:</div>
                        <div class="value">
                            <a-input v-model:value="form.remark" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                </div>
            </a-modal>
        </template>

        <!-- 预计船期及运费 -->
        <ShippingFreight
            v-if="freightVisible"
            :detailRecord="detailRecord"
            v-model:visible="freightVisible"
            :title="$t('distributor.expected_shipping_freight')"
            @ok="onUpdateTable"
        >
        </ShippingFreight>

        <!-- 确认运费弹窗 -->
        <ConfirmFreight
            :detailRecord="detailRecord"
            v-model:visible="confirmFreightVisible"
            :title="$t('distributor.shipping_freight')"
            @ok="onUpdateTable"
        ></ConfirmFreight>

        <!-- 取消操作记录查看 -->
        <CancelOperation
            v-if="operationVisible"
            v-model:visible="operationVisible"
            :title="$t('distributor-detail.cancel_record')"
            :id="id"
        ></CancelOperation>

        <!-- 取消二次弹窗填写原因 -->
        <CheckModal :visible="cancelVisible" :title="$t('distributor-detail.cancel_order')">
            <template #content>
                <div class="content">
                    <div class="content-text m-b-10">{{ $t('distributor-detail.cancel_order_tips1') }}</div>
                    <a-textarea
                        v-model:value="cancelParams.remark"
                        :placeholder="$t('distributor-detail.cancel_order_tips2')"
                        show-count
                        :maxlength="1000"
                    />
                </div>
            </template>
            <template #footer>
                <div class="footer">
                    <a-button @click="onCheckModalCancel">{{ $t('common.cancel') }}</a-button>
                    <a-button type="primary" @click="onCheckModalOK">{{ $t('common.confirm') }}</a-button>
                </div>
            </template>
        </CheckModal>
    </div>
</template>
<script>
import Core from '../../core';
import MySteps from './components/MySteps.vue';
import AttachmentFile from './components/AttachmentFile.vue';
import DeliveryLogs from './components/DeliveryLogs.vue';
import ActionLog from './components/ActionLog.vue';
import paymentList from './components/paymentList.vue';
import receivingDetails from './components/receivingDetails.vue';
import WaybillShow from '@/components/popup-btn/WaybillShow.vue';
import eosTabs from '@/components/common/eos-tabs.vue';
import EditItem from './components/EditItem.vue';
import { DownOutlined } from '@ant-design/icons-vue';
import CoCList from '@/views/coc/certificate-list.vue';
import ShippingFreight from './components/ShippingFreightModel.vue';
import ConfirmFreight from './components/ConfirmFreightModel.vue';
import CancelOperation from './components/CancelOperation.vue';
import CheckModal from '@/components/horwin/based-on-ant/CheckModal.vue';

const PURCHASE = Core.Const.PURCHASE;
const DISTRIBUTOR = Core.Const.DISTRIBUTOR;
const WAYBILL = Core.Const.WAYBILL;
const FLAG = Core.Const.PURCHASE.FLAG;
const STATUS = Core.Const.PURCHASE.STATUS;
const PAY_TIME = Core.Const.DISTRIBUTOR.PAY_TIME;
const PAY_STATUS = Core.Const.PURCHASE.PAY_STATUS;
const FLAG_ORDER_TYPE = Core.Const.PURCHASE.FLAG_ORDER_TYPE;
const TYPE = Core.Const.PURCHASE.TYPE;
const PARENT_TYPE = Core.Const.PURCHASE.PARENT_TYPE;
const PAYMENT_STATUS = Core.Const.PURCHASE.PAYMENT_STATUS;
const FLAG_PART_SHIPMENT_MAP = Core.Const.PURCHASE.FLAG_PART_SHIPMENT_MAP;
const FLAG_TRANSFER_MAP = Core.Const.PURCHASE.FLAG_TRANSFER_MAP;
const USER_TYPE = Core.Const.USER.TYPE;
const FREIGHT_STATUS_MAP = Core.Const.DISTRIBUTOR.FREIGHT_STATUS_MAP;
const FREIGHT_STATUS = Core.Const.DISTRIBUTOR.FREIGHT_STATUS;
const AUDIT_CANCEL_STATUS = Core.Const.DISTRIBUTOR.AUDIT_CANCEL_STATUS;

export default {
    name: 'PurchaseOrderDetail',
    components: {
        EditItem,
        AttachmentFile,
        DeliveryLogs,
        WaybillShow,
        MySteps,
        ActionLog,
        eosTabs,
        paymentList,
        receivingDetails,
        DownOutlined,
        CoCList,
        ShippingFreight,
        ConfirmFreight,
        CancelOperation,
        CheckModal,
    },
    data() {
        return {
            Core,
            FLAG,
            TYPE,
            AUDIT_CANCEL_STATUS,
            FREIGHT_STATUS_MAP_FILTER: {},
            FREIGHT_STATUS,
            PARENT_TYPE,
            FLAG_ORDER_TYPE,
            STOCK_TYPE: Core.Const.STOCK_RECORD.TYPE,
            COMMODITY: Core.Const.STOCK_RECORD.COMMODITY_TYPE,
            COMMODITY_MAP: Core.Const.STOCK_RECORD.COMMODITY_TYPE_MAP,
            ATTACHMENT_TYPE: Core.Const.ATTACHMENT.TARGET_TYPE,
            PAY_TIME,
            PAY_STATUS,
            AUDIT_STATUS: Core.Const.TRANSFER_ORDER.STATUS,
            STATUS,
            PAYMENT_STATUS,
            FLAG_PART_SHIPMENT_MAP,
            FLAG_TRANSFER_MAP,
            PURCHASE,
            DISTRIBUTOR,
            WAYBILL,
            USER_TYPE,
            loginType: Core.Data.getLoginType(),
            userType: Core.Data.getUserType(),
            loginOrgId: Core.Data.getOrgId(),
            loginOrgType: Core.Data.getOrgType(),
            warehouseList: [],
            // 加载
            loading: false,
            id: '',
            detail: {}, // 采购单详情
            activeKey: ['ItemInfo', 'PayInfo', 'PurchaseInfo', 'WaybillInfo'],
            stepsList: [
                { status: '100', zh: '支付', en: 'Payment' },
                { status: '200', zh: '发货', en: 'Deliver' },
                { status: '300', zh: '收货', en: 'Receipt' },
                { status: '400', zh: '交易完成', en: 'Transaction completed' },
            ],
            itemList: [], // 商品列表
            total: {
                amount: 0,
                price: 0,
                charge: 0,
                freight: 0, // 运费
            },
            upload: {
                // 上传图片
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                coverList: [],
                detailList: [],
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },
            waybill: {},
            waybillInfo: {},
            payMethodList: PURCHASE.PAY_METHOD_LIST,
            paymentTimeList: DISTRIBUTOR.PAY_TIME_LIST,
            outStockShow: false, // 确认发货 model 显隐
            companyUidList: WAYBILL.COMPANY_LIST,
            courierTypeList: WAYBILL.COURIER_LIST,
            receiveTypeList: WAYBILL.RECEIPT_LIST,
            form: {
                express_type: undefined, // 快递方式
                waybill: '', // 物流单号
                port: '', // 发货港口
                receive_type: undefined, // 收货方式
                freight: '', // 运费
                // pay_clause: undefined, // 支付条款
                remark: '', // 备注
                company_uid: undefined,
                waybill_uid: '', // 快递单号
                warehouse_id: '',
                audit_result: '',
                target_type: Core.Const.STOCK_RECORD.COMMODITY_TYPE.ITEM,
            },
            editForm: {
                distributor_id: undefined,
            },
            distributorList: [],
            exportDisabled: false, // 导出按钮禁用
            expandedRowKeys: [],
            expandIconColumnIndex: 0,
            selectedRowItemsAll: [],
            selectedRowKeys: [],
            selectedRowItems: [],
            itemEditShow: false, // 是否开启商品编辑
            giveOrderShow: false, // 赠送订单按钮 显隐
            createAuditShow: false, // 订单审核 model 显隐
            PIShow: false, // 修改pi model 显隐
            activeValue: 'payment_detail', // nameList的value
            outStockBtnShow: false, // 商品剩余数量为0 就不展示出库按钮
            cocProps: {},
            freightVisible: false, // 船期及运费model
            confirmFreightVisible: false, // 船期及运费确认model
            cancelVisible: false, // 船期及运费确认model
            cancelParams: {
                remark: undefined,
            },
            operationVisible: false, // 船期及运费确认model
            detailRecord: {}, // 给 ShippingFreight | ConfirmFreight 数据
            isCancelRecord: false, // 是否显示取消记录按钮
            isShippingConfirmVisible: false,
        };
    },
    computed: {
        itemColumns() {
            let columns = [
                { title: this.$t('i.item'), dataIndex: 'item' }, // 商品
                // { title: this.$t('i.number'), dataIndex: ['item', "model"] },  // 商品品号
                { title: this.$t('i.code'), dataIndex: ['item', 'code'] }, // 商品编码
                { title: this.$t('i.spec'), dataIndex: ['item', 'attr_list'], key: 'spec' }, // 规格
                { title: this.$t('i.total_quantity'), dataIndex: 'amount' }, // 总数量
                { title: this.$t('i.residue_quantity'), dataIndex: 'residue_quantity' }, // 待发货数量
                { title: this.$t('i.deliver_amount'), dataIndex: 'deliver_amount', key: 'deliver_amount' }, // 发货数量
                // { title: this.$t('i.remark'), dataIndex: "remark", key: 'remark' }, // 备注
            ];
            if (!this.$auth('purchase-order.supply-detail')) {
                columns.push(
                    { title: this.$t('i.unit_price'), dataIndex: 'unit_price', key: 'unit_price' }, // 单价
                    { title: this.$t('i.total_price'), dataIndex: 'price', key: 'price' }, // 总价
                );
            }
            return columns;
        },
        currStep() {
            // console.log("现在的状态", this.detail.status);
            for (let i = 0; i < this.stepsList.length; i++) {
                const item = this.stepsList[i];
                switch (this.detail.status) {
                    case STATUS.CANCEL:
                        this.stepsList = [{ status: '100', zh: '取消', en: 'Canceled' }];
                        break;
                    case STATUS.RE_REVISE:
                        this.stepsList = [{ status: '100', zh: '已修改关闭', en: 'Modified closed' }];
                        break;
                    case STATUS.CANCEL:
                }
                if (this.detail.status == STATUS.CANCEL) {
                    this.stepsList = [{ status: '100', zh: '取消' }];
                    return i;
                }
                if (item.status == this.detail.status) {
                    return i;
                }
            }
            return 0;
        },
        showWaybill() {
            switch (this.detail.status) {
                case STATUS.CLOSE:
                case STATUS.WAIT_PAY:
                case STATUS.INIT:
                case STATUS.WAIT_DELIVER:
                    return false;
            }
            return true;
        },
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                    // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys;
                    this.selectedRowItemsAll.push(...selectedRows);
                    let selectedRowItems = [];
                    selectedRowKeys.forEach(id => {
                        let element = this.selectedRowItemsAll.find(i => i.id == id);
                        selectedRowItems.push(element);
                    });
                    this.selectedRowItems = selectedRowItems;
                    // 这句不知何用
                    this.$emit('submit', this.selectedRowKeys, this.selectedRowItems);
                },
            };
        },
        lang() {
            return this.$store.state.lang;
        },
        beforeDeliver() {
            switch (this.detail.type) {
                case TYPE.GIVEAWAY:
                case TYPE.PRE_SALES:
                case TYPE.AFTER_SALES:
                    if (this.detail.type === PARENT_TYPE.MIX) {
                        return false;
                    }
            }
            switch (this.detail.status) {
                case STATUS.INIT:
                case STATUS.WAIT_PAY:
                case STATUS.WAIT_DELIVER:
                case STATUS.SPLIT:
                    return true;
                default:
                    return false;
            }
        },
        // tabs切换
        nameList() {
            let arr = [
                {
                    weight: 1,
                    key: 'payment_detail',
                    value: `${this.$t('p.payment_record')}`,
                    permission: ['DISTRIBUTOR', 'ADMIN'],
                }, // 付款记录
                { weight: 2, key: 'delivery_record', value: `${this.$t('p.delivery_record')}`, permission: ['ADMIN'] }, // 发货记录
                {
                    weight: 3,
                    key: 'receiving_record',
                    value: `${this.$t('p.receiving_record')}`,
                    permission: ['DISTRIBUTOR', 'ADMIN'],
                }, // 收货记录
                {
                    weight: 3,
                    key: 'receiving_detail',
                    value: `${this.$t('p.take_delivery_detail')}`,
                    permission: ['DISTRIBUTOR'],
                }, // 收货明细
                {
                    weight: 4,
                    key: 'AttachmentFile',
                    value: `${this.$t('n.attachment')}`,
                    permission: ['DISTRIBUTOR', 'ADMIN'],
                }, // 附件信息
                { weight: 5, key: 'ActionLog', value: `${this.$t('p.record')}`, permission: ['ADMIN'] }, // 操作记录
                {
                    weight: 6,
                    key: 'cocList',
                    value: `${this.$t('certificate-list.coc_certificate_list')}`,
                    permission: ['DISTRIBUTOR', 'ADMIN'],
                },
            ];
            let filteredArr = arr.filter(obj => obj.permission.includes(this.userType));
            return filteredArr.sort((a, b) => a.weight - b.weight);
        },
        // 权限(平台方还是分销商等)
        user_type() {
            let arr = [Core.Const.LOGIN.TYPE.ADMIN]; // 平台方
            return arr.includes(Core.Data.getLoginType());
        },
    },
    mounted() {
        this.getList(); // 获取列表
        this.getWarehouseList(); // 获取仓库列表
        this.getGiveawayListFetch(); // 获取赠品列表
        this.getCancelRecordFetch(); // 取消记录接口(用来判断 取消记录显影)

        if (this.$Util.Common.isMember(this.loginType, [USER_TYPE.DISTRIBUTOR])) {
            // 分销商
            for (const key in FREIGHT_STATUS_MAP) {
                if (FREIGHT_STATUS_MAP[key].key !== FREIGHT_STATUS.TO_BE_FILLED_IN) {
                    this.FREIGHT_STATUS_MAP_FILTER[key] = FREIGHT_STATUS_MAP[key]
                }
            }            
        } else if (this.$Util.Common.isMember(this.loginType, [USER_TYPE.ADMIN])) {
            // 平台方
            this.FREIGHT_STATUS_MAP_FILTER = FREIGHT_STATUS_MAP
        }
        console.log("输出的啊", this.FREIGHT_STATUS_MAP_FILTER, this.detail.freight_status);
    },
    created() {
        this.id = Number(this.$route.query.id) || 0;
        this.isShippingConfirmVisible = this.$route.query.type || false;
    },
    methods: {
        tableChange(val) {
            let distributor = this.userType == 'ADMIN' ? false : true;
            if (val === 'cocList') {
                this.cocProps = {
                    id: Number(this.$route.query.id) || 0,
                    isDistributor: distributor,
                    order_number: this.detail.sn,
                    isOther: true,
                };
            }
        },
        /*== FETCH start==*/

        // 获取 采购单订单信息
        getPurchaseInfo() {
            Core.Api.Purchase.detail({
                id: this.id,
            })
                .then(res => {
                    this.detail = res.detail;

                    this.detail.freight_audit_record = {
                        ...this.detail?.freight_audit_record,
                        content: this.detail?.freight_audit_record?.content
                            ? JSON.parse(this.detail?.freight_audit_record?.content)
                            : {},
                    };

                    if (this.detail.status === Core.Const.PURCHASE.STATUS.TAKE_DELIVER) {
                        this.detail.status = Core.Const.PURCHASE.STATUS.WAIT_DELIVER;
                    }
                    this.total.freight = res.detail.freight || 0;
                    this.step();
                    if (this.isShippingConfirmVisible) {
                        this.onConfirmFreight();
                    }
                })
                .catch(err => {
                    console.log('getPurchaseInfo err', err);
                });
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list;
            });
        },
        // 获取赠品信息列表

        // 获取 采购单 赠品列表 控制按钮的显示隐藏
        getGiveawayListFetch() {
            this.loading = true;
            Core.Api.Purchase.giveawayList({
                order_id: this.$route.query.id,
            })
                .then(res => {
                    if (res?.list && res.list.length > 0) {
                        this.giveOrderShow = true;
                    } else {
                        this.giveOrderShow = false;
                    }
                })
                .catch(err => {
                    console.log('getGiveawayList err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        getList() {
            this.itemEditShow = false;
            this.getPurchaseInfo(); // 获取订单信息
        },

        //
        getWaybillDetail() {
            Core.Api.Waybill.detailByTarget({
                target_id: this.id,
                target_type: Core.Const.WAYBILL.TARGET_TYPE.PURCHASE_ORDER,
                type: Core.Const.WAYBILL.TYPE.OUT,
            })
                .then(res => {
                    this.waybill = res.detail;
                    this.getWaybillInfo(this.waybill.uid, this.waybill.company_uid);
                })
                .catch(err => {
                    console.log('getWaybillDetail err', err);
                })
                .finally(() => {});
        },
        //
        getWaybillInfo(uid, company_uid) {
            Core.Api.Waybill.queryLogistics({
                uid: uid,
                company_uid: company_uid,
            })
                .then(res => {
                    this.waybillInfo = JSON.parse(res.waybill).result;
                })
                .catch(err => {
                    console.log('getWaybillInfo err', err);
                })
                .finally(() => {});
        },

        // 订单审核fetch
        createAuditFetch(params = {}) {
            Core.Api.Purchase.createAudit({
                id: this.id,
                ...params,
            })
                .then(res => {
                    this.$message.success(this.$t('pop_up.audited'));
                    this.getList();
                    this.handleCancelAudit();
                })
                .catch(err => {
                    console.log('订单审核fetch', err);
                });
        },

        // 取消接口
        cancelFetch(params = {}) {
            let obj = {
                id: this.id,
                ...params,
            };
            return new Promise((resolve, reject) => {
                Core.Api.Purchase.cancel(obj)
                    .then(res => {
                        this.$message.success(this.$t('pop_up.canceled'));
                        this.routerChange('orderList');
                        resolve();
                    })
                    .catch(err => {
                        console.log('handleCancel err', err);
                        reject();
                    });
            });
        },
        // 取消记录接口
        getCancelRecordFetch(params = {}) {
            let obj = {
                order_id: this.id,
                ...params,
            };
            Core.Api.CancelOrderList.list(obj)
                .then(res => {
                    console.log('取消记录接口', res);
                    this.isCancelRecord = res.list.length ? true : false;
                })
                .catch(err => {
                    console.log('handleCancel err', err);
                });
        },

        /*== FETCH end==*/

        /*== header options start ==*/

        // 导出PI
        handleExportIn() {
            const params = {
                id: this.id, // 订单id
                currency: this.detail.currency, // 货币类型
                id_type: 0,
                language: this.$i18n.locale === 'en' ? 1 : 0,
            };

            this.exportDisabled = true;
            let exportUrl = Core.Api.Export.purchaseTemplateExport(params);
            window.open(exportUrl, '_blank');
            this.exportDisabled = false;
        },
        // 修改PI
        handleUpdatePI() {
            this.form.freight = Core.Util.countFilter(this.detail.freight);
            this.form.port = this.detail.port;
            this.form.remark = this.detail.remark;
            this.PIShow = true;
        },
        // 导出商品信息
        handleExportInfo() {
            const params = {
                id: this.id, // 订单id
                currency: this.detail.currency, // 货币类型
                language: this.$i18n.locale === 'en' ? 1 : 0,
            };

            this.exportDisabled = true;
            let exportUrl = Core.Api.Export.purchaseOrderExport(params);
            window.open(exportUrl, '_blank');
            this.exportDisabled = false;
        },
        // 以供应商报表方式导出
        handleExport() {
            let _this = this;
            this.$confirm({
                title: _this.$t('p.sure_export'),
                okText: _this.$t('def.sure'),
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    _this.handleExportAccessoriesOrder();
                },
            });
        },
        // 取消采购(二次弹窗确认)
        handleCancel() {
            let _this = this;
            this.$confirm({
                title: _this.$t('p.sure_cancel'),
                okText: _this.$t('def.sure'),
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    _this.cancelFetch();
                },
            });
        },
        // 取消采购弹窗填写原因
        onCancelReason() {
            console.log('取消采购弹窗填写原因');
            this.cancelVisible = true;
        },

        /*== header options end ==*/

        // 弹出弹框
        handleModalShow(val) {
            switch (val) {
                case 'out_stock':
                    // 出库
                    this.outStockShow = true;
                    break;
                case 'createAuditShow':
                    // 订单审核
                    this.createAuditShow = true;
                    break;
            }
        },

        /*== model 事件 start ==*/

        // 修改pi model的事件
        UpdatePI() {
            let form = Core.Util.deepCopy(this.form);
            const param = {
                id: form.id,
                freight: form.freight,
                remark: form.remark,
            };
            let adminRequire = [];

            if (this.$auth('ADMIN')) {
                adminRequire = [{ key: 'port', msg: this.$t('p.enter_harbor') }];
            }
            for (let index in adminRequire) {
                let key = adminRequire[index].key;
                if (!this.form[key]) {
                    return this.$message.warning(adminRequire[index].msg);
                } else {
                    param[key] = form[key];
                }
            }
            param.freight = Math.round(param.freight * 100) || 0;
            Core.Api.Purchase.updatePI({
                ...param,
                id: this.id,
            })
                .then(res => {
                    this.$message.success(this.$t('p.modify_success'));
                    this.PIShow = false;
                    this.getPurchaseInfo();
                    this.getList();
                })
                .catch(err => {
                    console.log('handleDeliver err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 确认出库
        handleOutStock() {
            let form = Core.Util.deepCopy(this.form);
            const param = {
                id: this.id,
                warehouse_id: form.warehouse_id,
                target_type: this.COMMODITY.ITEM,
                remark: form.remark,
            };
            let adminRequire = [
                { key: 'warehouse_id', msg: this.$t('e.select_warehouse') },
                { key: 'target_type', msg: this.$t('p.choose_type') },
            ];

            for (let index in adminRequire) {
                let key = adminRequire[index].key;
                if (!this.form[key]) {
                    return this.$message.warning(adminRequire[index].msg);
                } else {
                    param[key] = form[key];
                }
            }
            param['freight'] = Math.round(param['freight'] * 100);
            param['item_list'] = this.selectedRowItems;
            Core.Api.Purchase.outStock(param)
                .then(res => {
                    this.$message.success(this.$t('p.shipped'));
                    this.outStockShow = false;
                    this.getWaybillDetail();
                    this.getList();
                })
                .catch(err => {
                    console.log('handleDelivers err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 订单审核
        handleCreateAudit() {
            let formObj = {
                audit_result: this.form.audit_result,
                remark: this.form.remark,
            };
            // 通过是否
            if (!formObj.audit_result) {
                this.$message.warning(this.$t('r.audit_result'));
                return;
            }

            let item_list = [];
            // 选中的商品信息表格有数据的话进行
            if (this.$refs.purchaseOrderRef.tableData.length) {
                this.$refs.purchaseOrderRef.tableData.forEach(el => {
                    console.log('测试实施', el);
                    item_list.push({
                        item_id: el.id,
                        amount: el.amount,
                        price: this.$Util.countFilter(el.price, 100, 2, true),
                        item_code: el.item_code,
                        unit_price: el.unit_price,
                        charge: el.charge,
                        amount: el.amount,
                    });
                });
            }
            // console.log("formObj", formObj);
            // 不管怎么审核都提交
            this.createAuditFetch({
                ...Core.Util.searchFilter(formObj),
                item_list,
            });
        },
        // 订单取消
        handleCancelAudit() {
            this.createAuditShow = false;
            this.form.audit_result = undefined;
            this.form.remark = undefined;
        },
        /*== model 事件  end ==*/

        // 上传前检查文件
        /*== 确认收款model start ==*/

        authOrg(orgId, orgType) {
            if (this.loginOrgId === orgId && this.loginOrgType === orgType) {
                return true;
            } else {
                return false;
            }
        },
        // 路由跳转
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'list':
                    routeUrl = this.$router.resolve({
                        path: '/item/purchase-order-list',
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'orderList':
                    routeUrl = this.$router.resolve({
                        path: '/purchase/purchase-order-self',
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'aftersales':
                    // 申请售后
                    routeUrl = this.$router.resolve({
                        path: '/aftersales/aftersales-edit',
                        query: {
                            order_id: this.id,
                            order_sn: this.detail.sn,
                        },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'payment':
                    // 付款
                    routeUrl = this.$router.resolve({
                        path: '/mall/pending-payment',
                        query: {
                            id: this.id,
                        },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        // 步骤条
        step() {
            if (
                this.detail.pay_type == PAY_TIME.PAYMENT_TYPE_ALL_PAYMENT ||
                this.detail.pay_type == PAY_TIME.PAYMENT_TYPE_DOWN_PAYMENT
            ) {
                this.stepsList = [
                    { status: '100', zh: '支付', en: 'Payment' },
                    { status: '200', zh: '发货', en: 'Deliver' },
                    { status: '300', zh: '收货', en: 'Receipt' },
                    { status: '400', zh: '交易完成', en: 'Transaction completed' },
                ];
                // 售后订单 售前订单 显示
                if (
                    this.detail.type === Core.Const.PURCHASE.TYPE.AFTER_SALES ||
                    this.detail.type === Core.Const.PURCHASE.TYPE.PRE_SALES
                ) {
                    this.stepsList = [
                        { status: '60', zh: '审核', en: 'Audit' },
                        { status: '100', zh: '支付', en: 'Payment' },
                        { status: '200', zh: '发货', en: 'Deliver' },
                        { status: '300', zh: '收货', en: 'Receipt' },
                        { status: '400', zh: '交易完成', en: 'Transaction completed' },
                    ];
                }
            } else {
                this.stepsList = [
                    { status: '200', zh: '发货', en: 'Deliver' },
                    { status: '300', zh: '收货', en: 'Receipt' },
                    { status: '360', zh: '支付', en: 'Payment' },
                    { status: '400', zh: '交易完成', en: 'Transaction completed' },
                ];
            }
        },
        // 订单导出
        handleExportAccessoriesOrder() {
            this.exportDisabled = true;
            let exportUrl = Core.Api.Export.exportAccessoriesOrder({
                id: this.detail.id,
                language: this.$i18n.locale === 'en' ? 1 : 0,
            });
            // console.log("handleRepairExport _exportUrl", exportUrl)
            window.open(exportUrl, '_blank');
            this.exportDisabled = false;
        },
        // 合同上传ref事件
        attachmentEvent() {
            this.$refs.attachment.handleModalShow();
        },
        // 赠送订单事件
        handleGiveOrder() {
            // 传参type为1时做该订单已取消的提示
            this.giveOrderShow = true;
        },

        // 船期及运费(修改)
        onModify() {
            this.freightVisible = true;
            this.detailRecord = {
                id: this.detail.id,
                currency: this.detail.currency,
                freight_audit_record_id: this.detail.freight_audit_record_id,
                freight: this.detail?.freight_audit_record?.content?.freight,
                shipping_time_estimated: this.detail?.freight_audit_record?.content?.shipping_time_estimated,
            };
        },

        // 确认运费
        onConfirmFreight() {
            this.confirmFreightVisible = true;
            this.detailRecord = {
                id: this.detail.id,
                freight_status: this.detail.freight_status,
                freight_audit_record_id: this.detail.freight_audit_record_id,
                shipping_time_estimated: this.detail?.freight_audit_record?.content?.shipping_time_estimated,
                freight: this.detail?.freight_audit_record?.content?.freight,
            };
        },

        // 取消二次弹窗填写原因
        onCheckModalCancel() {
            this.cancelVisible = false;
            this.cancelParams.remark = undefined;
        },
        onCheckModalOK() {
            console.log('点击确定 onCheckModalOK', this.cancelParams);
            this.cancelFetch({ remark: this.cancelParams.remark }).then(() => {
                this.onCheckModalCancel();
            });
        },

        // 取消记录按钮
        onCancelRecord() {
            this.operationVisible = true;
        },

        // 预计船期及运费 确认运费 返回
        onUpdateTable() {
            this.getPurchaseInfo();
        },

        // 更多操作权限
        MoreActions() {
            // 平台方 => 订单状态(待支付,待生产,生产中) || 订单取消状态(待审核)
            // 分销商 => 订单状态(待生产,生产中) || 订单取消状态(待审核)
            if (this.$Util.Common.isMember(this.loginType, [USER_TYPE.ADMIN])) {
                return (
                    this.$Util.Common.isMember(this.detail.status, [
                        STATUS.WAIT_PAY,
                        STATUS.WAIT_PRODUCED,
                        STATUS.IN_PRODUCTION,
                    ]) ||
                    this.$Util.Common.isMember(this.detail.cancel_status, [
                        AUDIT_CANCEL_STATUS.WAITING_FOR_APPROVAL,
                    ])
                );
            } else if (this.$Util.Common.isMember(this.loginType, [USER_TYPE.DISTRIBUTOR])) {
                return (
                    this.$Util.Common.isMember(this.detail.status, [STATUS.IN_PRODUCTION]) ||
                    this.$Util.Common.isMember(this.detail.cancel_status, [
                        AUDIT_CANCEL_STATUS.WAITING_FOR_APPROVAL,
                    ])
                );
            }
        },
    },
};
</script>

<style lang="less" scoped>
#PurchaseOrderDetail {
    .list-container {
        margin-bottom: 20px;

        .title-container {
            display: flex;
            justify-content: flex-start;

            .title-area {
                margin-right: 32px;
            }

            .center-info {
                flex: 1;

                .header-info {
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 20px;
                    color: #252526;
                    margin-right: 16px;
                }
            }
        }

        .gray-panel {
            margin-top: 8px;
            border: 1px solid #e6eaee;
            border-radius: 6px;
            background: none;
            padding: 0;
            height: 100px;

            .panel-content {
            }
        }

        .title-container {
            display: flex;
            justify-content: space-between;

            .title-area2 {
                font-weight: 500;
                font-size: 16px;
                line-height: 22px;
                color: rgba(0, 0, 0, 0.85);
            }
        }

        // .header-tab{
        //     width: 50%;
        //     background: #F5F5F5;
        //     border: 1px solid #EFEFEF;
        //     border-radius: 2px;
        //     display: flex;
        // }
    }

    .list-container2 {
        .container-body {
            padding: 0 20px;
        }
    }

    .list-container3 {
        background: #ffffff;
        border-radius: 6px;
        margin: 0 8px 20px 8px;
        padding: 20px;
        box-sizing: border-box;

        .title-container {
            display: flex;
            justify-content: flex-start;
            padding: 0;
            margin-bottom: 16px;

            .title-area {
                margin-right: 32px;
            }

            .center-info {
                flex: 1;

                .header-info {
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 20px;
                    color: #252526;
                    margin-right: 16px;
                }
            }
        }

        .info-title {
            font-weight: 500;
            font-size: 16px;
            line-height: 22px;
            color: rgba(0, 0, 0, 0.85);
            margin-bottom: 16px;
        }

        .info-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;

            .key {
                width: 100px;
                font-size: 14px;
                line-height: 22px;
                color: rgba(0, 0, 0, 0.4);
            }

            .value {
                margin-left: 10px;
                width: 140px;
                font-size: 14px;
                line-height: 22px;
            }
        }

        .all-btn {
            display: flex;
            justify-content: center;
            border-top: 1px solid #eaecf1;
            padding-top: 18px;
            margin-top: 30px;
        }
    }
}

.d-f-a {
    display: flex;
    align-items: center;
}

.d-f-j {
    display: flex;
    justify-content: space-between !important;
}

.content {
    .content-title {
        background: #1d2129;
        font-size: 14px;
        font-weight: 400;
    }
}

.freight-status-style {
    padding: 5px 12px;
    box-sizing: border-box;
}
</style>
