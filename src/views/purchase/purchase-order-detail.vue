<template>
<div id="PurchaseOrderDetail">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('p.details')}}</div>
            <div class="btns-area" v-if="detail.status != STATUS.CANCEL && detail.status != STATUS.RE_REVISE && detail.status != STATUS.REVISE">
                <template v-if="$auth('ADMIN') && $auth('purchase-order.export')">
                    <!-- 暂时只有平台方 且订单已经发货 可以导出订单 -->
                    <!-- <a-button @click="handleExportInfo"><i class="icon i_download"/>{{ $t('p.export_purchase')}}</a-button>-->
                </template>
                <template v-if="!$auth('ADMIN') && $auth('purchase-order.export')">
                    <!-- 暂时只有平台方 且订单已经发货 可以导出订单 -->
                    <a-button @click="handleExportInfo">{{ $t('p.export_product_information')}}</a-button>
                </template>

                <template v-if="authOrg(detail.supply_org_id, detail.supply_org_type) && detail.status !== STATUS.REVISE_AUDIT">

                    <!-- <a-button type="primary" v-if="detail.payment_status !== PAYMENT_STATUS.PAY_ALL && $auth('purchase-order.collection')" @click="handleModalShow('payment')"><i class="icon i_received"/>{{ $t('p.confirm_payment')}}</a-button>-->
                    <!-- <a-button type="primary" v-if="detail.status === STATUS.WAIT_DELIVER && $auth('purchase-order.deliver') && (detail.type !== TYPE. || PAYMENT_STATUS.PAY_ALL)" @click="handleModalShow('deliver')" :disabled="exportDisabled"><i class="icon i_deliver"/>{{ $t('p.ship')}}</a-button>-->
                    <!-- <a-button type="primary" v-if="detail.status === STATUS.WAIT_DELIVER && $auth('purchase-order.deliver') && detail.type !== TYPE. && $auth('ADMIN')" @click="handleModalShow('transfer')"><i class="icon i_deliver"/>{{ $t('n.transferred')}}</a-button>-->
                    <a-button type="primary" v-if="(detail.status === STATUS.WAIT_DELIVER  || detail.status === STATUS.WAIT_TAKE_DELIVER) && $auth('purchase-order.deliver') " @click="handleModalShow('out_stock')" :disabled="exportDisabled"><i class="icon i_deliver"/>{{ $t('p.out_stock')}}</a-button>
                    <template v-if="detail.type === FLAG_ORDER_TYPE.PRE_SALES">
                        <a-button type="primary" v-if="detail.status === STATUS.WAIT_DELIVER && $auth('purchase-order.deliver') " @click="handleModalShow('transfer')"><i class="icon i_deliver"/>{{ $t('n.transferred')}}</a-button>
                    </template>
                    <a-button type="primary" ghost v-if="detail.type !== TYPE.GIVEAWAY && !giveOrderShow && $auth('purchase-order.give')"  @click="giveOrderShow = true">赠送订单</a-button>
                </template>
                <template v-if="authOrg(detail.org_id, detail.org_type) && detail.status !== STATUS.REVISE_AUDIT">
                    <a-button type="primary" ghost v-if="beforeDeliver && !itemEditShow && $auth('purchase-order.save')" @click="itemEditShow = true">更换商品</a-button>

                    <a-button type="primary" v-if="detail.status !== STATUS.CANCEL && detail.status !== STATUS.DEAL_SUCCESS && detail.payment_status !== PAYMENT_STATUS.PAY_ALL && $auth('purchase-order.collection')" @click="handleModalShow('payment')"><i class="icon i_received"/>{{ $t('p.payment')}}</a-button>
                    <!-- <a-button type="primary" v-if="detail.status === STATUS.WAIT_TAKE_DELIVER" @click="handleReceived()"><i class="icon i_goods"/>确认收货</a-button>-->
                    <!-- {{detail.status}}-->
                    <a-button type="primary" v-if="detail.status === STATUS.WAIT_PAY || (detail.payment_status !== PAYMENT_STATUS.WAIT_PAY && detail.WAIT_DELIVER)" @click="handleCancel()"><i class="icon i_close_c"/>{{ $t('def.cancel')}}</a-button>
                    <a-button type="primary" v-if="detail.status === STATUS.DEAL_SUCCESS" @click="routerChange('aftersales')" ghost><i class="icon i_edit"/>{{ $t('p.apply_for_after_sales')}}</a-button>
                </template>
                <template v-if="authOrg(detail.supply_org_id, detail.supply_org_type) && detail.status === STATUS.REVISE_AUDIT && $auth('purchase-order.audit')">
                    <AuditHandle
                                 btnType='primary' :api-list="['Purchase', 'reviseAudit']" :id="detail.id" @submit="getList"
                                 :s-pass="FLAG.YES" :s-refuse="FLAG.NO" no-refuse><i class="icon i_audit"/>{{ $t('n.audit') }}
                    </AuditHandle>
                </template>


            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content">
                <MySteps :stepsList='stepsList' :current='currStep'></MySteps>
            </div>
        </div>
        <div class="form-container">
            <EditItem v-if="giveOrderShow" :order-id='id' :detail='detail' type='GIVE_ORDER' @submit="getList" @cancel='giveOrderShow = false'></EditItem>

            <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
                <template #expandIcon ><i class="icon i_expan_l"/> </template>
                <!-- 商品信息 -->
                <a-collapse-panel key="ItemInfo" :header="$t('i.product_information')" class="gray-collapse-panel" v-show="!itemEditShow">
                    <div class="panel-content">
                            <a-table
                                :columns="itemColumns" :data-source="itemList" :scroll="{ x: true }"
                                :row-key="record => record.id" :loading='loading' :pagination='false'
                                :row-selection="rowSelection">
                            <template #bodyCell="{ column, text, record}">
                                <template v-if="column.dataIndex === 'item'">
                                    <div class="table-img">
                                        <a-image :width="30" :height="30" :src="$Util.imageFilter(text ? text.logo : '', 2)"/>
                                        <a-tooltip placement="top" :title='text'>
                                            <a-button type="link" @click="routerChange('detail', text)" style="margin-left: 6px;">
                                                {{ text ? lang =='zh' ? text.name : text.name_en : '-' }}
                                            </a-button>
                                        </a-tooltip>
                                    </div>
                                </template>
                                <template v-if="column.dataIndex === 'amount'">
                                    {{record.amount}}
                                </template>
                                <template v-if="column.dataIndex === 'deliver_amount'">
                                    <a-input-number v-model:value="record.deliver_amount" style="width: 120px;" :min="0" :precision="0" :disabled="record.disabled"/>
                                </template>
                                <template v-if="column.key === 'money'">
                                    {{$Util.priceUnitFilter(detail.currency)}} {{$Util.countFilter(text)}}
                                </template>
                                <template v-if="column.key === 'spec'">
                                    {{$Util.itemSpecFilter(text, $i18n.locale )}}
                                </template>
                            </template>
                            <template #summary>
                                <a-table-summary>
                                    <a-table-summary-row>
                                        <a-table-summary-cell :index="0" :col-span="4">{{ $t('p.total')}}</a-table-summary-cell>
                                        <a-table-summary-cell :index="1" :col-span="1">{{ $t('p.freight')}}:{{$Util.priceUnitFilter(detail.currency)}}{{$Util.countFilter(total.freight) || '0'}}</a-table-summary-cell>
                                        <a-table-summary-cell :index="1" :col-span="1">{{ $t('i.total_quantity') }}:{{total.amount}}</a-table-summary-cell>
                                        <a-table-summary-cell :index="4" :col-span="1">{{ $t('i.total_price')}}:{{$Util.priceUnitFilter(detail.currency)}} {{$Util.countFilter(total.price + (total.freight || 0))}}</a-table-summary-cell>
                                        <!-- <a-table-summary-cell :index="5" :col-span="1">总金额:{{$Util.priceUnitFilter(detail.currency)}} {{$Util.countFilter(total.charge)}}</a-table-summary-cell> -->
                                    </a-table-summary-row>
                                </a-table-summary>
                            </template>
                        </a-table>
                    </div>
                </a-collapse-panel>

                <EditItem v-if="itemEditShow" :order-id='id' :detail='detail' type='PURCHASE_ORDER' @submit="getList" @cancel='itemEditShow = false'></EditItem>


                <!-- 订单信息 -->
                <a-collapse-panel key="PurchaseInfo" :header="$t('p.order_information')" class="gray-collapse-panel">
                    <a-row class="panel-content info-container">
                        <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                            <div class="info-item">
                                <div class="key">{{ $t('p.order_number')}}</div>
                                <div class="value">{{detail.sn || '-'}}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">{{ $t('p.person')}}</div>
                                <div class="value">{{detail.user_name|| '-'}}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">{{ $t('p.order_time')}}</div>
                                <div class="value">{{$Util.timeFilter(detail.create_time) || '-'}}</div>
                            </div>
                        </a-col>
                        <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                            <div class="info-item">
                                <div class="key">{{ $t('n.contact')}}</div>
                                <div class="value" v-if="detail.receive_info != null">{{detail.receive_info.phone || '-'}}</div>
                                <div class="value" v-else>-</div>
                            </div>
                            <div class="info-item">
                                <div class="key">{{ $t('p.payment_terms')}}</div>
                                <div class="value">{{ DISTRIBUTOR.PAY_TIME_MAP[detail.pay_clause] || '-' }}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">{{ $t('p.remark')}}</div>
                                <div class="value">{{detail.remark || '-'}}</div>
                            </div>
                            <!-- <div class="info-item">
                                <div class="key">支付方式</div>
                                <div class="value">{{$Util.purchasePayMethodFilter(detail.pay_method) || '-'}}</div>
                            </div> -->
                        </a-col>
                        <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                            <div class="info-item" v-if="$auth('ADMIN', 'DISTRIBUTOR')">
                                <div class="key">{{ $t('p.shipping_port')}}</div>
                                <div class="value" >{{detail.port || '-'}}</div>
                            </div>
                            <div class="info-item" >
                                <div class="key">{{ $t('p.partial_shipments')}}</div>
                                <div class="value">{{$Util.purchaseTransferFilter(detail.flag_part_shipment, $i18n.locale)}}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">{{ $t('p.transshipment')}}</div>
                                <div class="value">{{$Util.purchaseTransferFilter(detail.flag_transfer, $i18n.locale)}}</div>
                            </div>
                        </a-col>
                    </a-row>
                </a-collapse-panel>

                <!-- 明细列表 -->
                <a-collapse-panel key="ItemInfo" :header="$t('p.payment_detail')" class="gray-collapse-panel">
                    <div class="panel-content">
                        <a-table :columns="payColumns" :data-source="payList" :scroll="{ x: true }"
                            :row-key="record => record.id" :pagination='false'>
                            <template #bodyCell="{ column, text, record }">
                                <template v-if="column.key === 'item'">
                                    {{ text || '-' }}
                                </template>
                                <template v-if="column.dataIndex === 'attachment'">
                                    <div class="table-img">
                                        <a-image-preview-group class="image-group">
                                            <a-image v-for="(path, index) in record.paths" :key="index" class="image" :width="55" :height="55" :src="$Util.imageFilter(path)" fallback='无'/>
                                        </a-image-preview-group>
                                    </div>
                                </template>

                                <template v-if="column.key === 'detail'">
                                    <div class="table-img">
                                        <a-image :width="24" :height="24" :src="$Util.imageFilter(record.path.includes('img') ? record.path : '', 4)" fallback='无'/>
                                        <a-tooltip placement="top" :title='text'>
                                            <p class="ell" style="max-width:120px;margin-left:12px;">{{text || '-'}}</p>
                                        </a-tooltip>
                                    </div>
                                </template>

                                <template v-if="column.dataIndex === 'type'">
                                    {{$Util.purchasePayMethodFilter(text)}}
                                </template>
                                <template v-if="column.key === 'status'">
                                    {{$Util.purchasePayStatusFilter(text, $i18n.locale)}}
                                </template>
                                <template v-if="column.key === 'money'">
                                    {{$Util.priceUnitFilter(detail.currency)}} {{$Util.countFilter(text)}}
                                </template>
                                <template v-if="column.key === 'time'">
                                    {{ $Util.timeFilter(text) }}
                                </template>
                                <template v-if="column.key === 'operation'">
                                    <a-button type='link' @click="handleDownload(record)"><i class="icon i_download"/>{{ $t('n.download') }}</a-button>
                                    <template v-if="authOrg(detail.supply_org_id, detail.supply_org_type)">
                                        <a-button type='link' v-if="record.status === PAY_STATUS.WAIT_TO_AUDIT" @click="handlePayAuditShow(record.id)">{{$t('p.audit')}}</a-button>
                                    </template>
                                    <template v-if="authOrg(detail.org_id, detail.org_type)">
                                        <a-button type='link' v-if="record.status === PAY_STATUS.WAIT_TO_AUDIT" @click="handlePayCancel(record.id)">{{$t('def.cancel')}}</a-button>
                                    </template>
                                </template>
                            </template>
                        </a-table>
                    </div>
                </a-collapse-panel>

                <!-- 发货记录 -->
                <DeliveryLogs :order-id='id' :detail='detail' :type="STOCK_TYPE.OUT" @submit="getList" ref="out_delivery"/>
                <!-- 收货记录 -->
                <DeliveryLogs :order-id='id' :detail='detail' :type="STOCK_TYPE.IN"  @submit="getList" ref="in_delivery"/>

                <!-- 上传附件 -->
                <AttachmentFile :target_id='id' :target_type='ATTACHMENT_TYPE.PURCHASE_ORDER' :detail='detail' @submit="getList" ref="AttachmentFile"/>

                <!-- 物流信息 -->
                <a-collapse-panel key="WaybillInfo" :header="$t('n.delivery_information')" class="gray-collapse-panel">
                    <a-row class="panel-content info-container">
                        <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                            <div class="info-item">
                                <div class="key">{{ $t('n.consignee')}}</div>
                                <div class="value" v-if="detail.receive_info !=null">{{detail.receive_info.name || '-'}}</div>
                                <div class="value" v-else>-</div>
                            </div>
                            <div class="info-item">
                                <div class="key">{{ $t('n.phone')}}</div>
                                <div class="value" v-if="detail.receive_info !=null">{{detail.receive_info.phone || '-'}}</div>
                                <div class="value" v-else>-</div>
                            </div>
                            <div class="info-item">
                                <div class="key">{{ $t('ad.shipping_address')}}</div>
                                <div class="value" v-if="detail.receive_info !=null">{{detail.receive_info.country + detail.receive_info.province + detail.receive_info.city + detail.receive_info.county + detail.receive_info.address || '-'}}</div>
                                <div class="value" v-else>-</div>
                            </div>
                        </a-col>
                        <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='12' class="info-block">
                            <div class="info-item" v-if="detail.org_type === USER_TYPE.AGENT || detail.org_type === USER_TYPE.STORE">
                                <div class="key">{{ $t('p.delivery_method')}}</div>
                                <div class="value" >{{$Util.purchaseWaybillFilter(detail.receive_type, $i18n.locale || '-')}}</div>
                            </div>
                            <div class="info-item" v-if="detail.org_type === USER_TYPE.DISTRIBUTOR">
                                <div class="key">{{ $t('p.delivery_method')}}</div>
                                <div class="value" >{{$Util.purchaseExpressFilter(detail.express_type, $i18n.locale || '-')}}</div>
                            </div>
                            <div class="info-item" v-if="detail.waybill">
                                <div class="key">{{ $t('p.shipment_number')}}</div>
                                <div class="value" >{{detail.waybill || '-'}}</div>
                            </div>
                            <!-- <div class="info-item">
                                <div class="key">物流信息</div>
                                <div class="value">
                                    <WaybillShow v-if="waybillInfo && showWaybill" @change="getWaybillDetail" :detail='waybill' :list='waybillInfo.list' :can-edit="$auth('ADMIN')" />
                                    <template v-else>暂无物流信息</template>
                                </div>
                            </div> -->
                        </a-col>
                    </a-row>
                </a-collapse-panel>
            </a-collapse>
        </div>
    </div>
    <template class="modal-container">
        <!-- 确认收款 -->
        <a-modal v-model:visible="paymentShow" :title="$t('p.confirm_payment')" @ok="handlePayment">
            <div class="modal-content">
                <!-- 国外暂无支付宝微信银行卡支付方式，先隐藏 -->
                <!-- 支付方式 -->
                <div class="form-item required">
                    <div class="key">{{$t('p.payment_method')}}</div>
                    <div class="value">
                        <a-select v-model:value="form.pay_method" :placeholder="$t('p.please_select_payment_method')">
                            <a-select-option v-for="pay of payMethodList" :key="pay.value" :value="pay.value">{{pay[$i18n.locale]}}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('ac.money') }}：</div>
                    <div class="value">
                        <a-input-number
                            v-model:value="form.payment"
                            style="width: 120px"
                            :min="0"
                            :max="((detail.freight||0)+detail.charge-detail.payment)/100"
                            :precision="2"
                            :prefix="`${$Util.priceUnitFilter(detail.currency)}`"
                            placeholder="0.00"
                        />
                        <!-- <span>{{$Util.priceUnitFilter(detail.currency)}}</span> -->
                    </div>
                </div>
                <div class="form-item img-upload">
                    <div class="key">{{ $t('p.attachment') }}</div>
                    <div class="value">
<!--                        <a-upload name="file" class="image-uploader"-->
<!--                            list-type="picture-card" accept='image/*'-->
<!--                            :file-list="upload.detailList" :action="upload.action"-->
<!--                            :headers="upload.headers" :data='upload.data'-->
<!--                            :before-upload="handleImgCheck"-->
<!--                            @change="handleDetailChange">-->
<!--                            <div class="image-inner" v-if="upload.detailList.length < 10">-->
<!--                                <i class="icon i_upload"/>-->
<!--                            </div>-->
<!--                        </a-upload>-->
                        <a-upload name="file" class="file-uploader"
                                  :file-list="upload.fileList" :action="upload.action"
                                  :headers="upload.headers" :data='upload.data'
                                  :before-upload="handleFileCheck"
                                  @change="handleFileChange">
                            <a-button type="primary" ghost class="file-upload-btn" v-if="upload.fileList.length < 1">
                                <i class="icon i_upload"/> {{ $t('f.choose') }}
                            </a-button>
                        </a-upload>
<!--                        <div class="tip">{{ $t('n.size') }}：800*800px</div>-->
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('p.remark') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.remark" :placeholder="$t('def.input')"/>
                    </div>
                </div>
          </div>
        </a-modal>
        <!-- 转单 -->
        <a-modal v-model:visible="transferShow" :title="$t('p.confirm_transfer')" :after-close="handleTransferClose">
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">{{ $t('n.distributor') }}：</div>
                    <div class="value">
                        <a-select v-model:value="editForm.distributor_id" :placeholder="$t('def.select')">
                            <a-select-option v-for="item of distributorList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                        </a-select>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="handleTransferSubmit" type="primary">{{ $t('def.sure') }}</a-button>
                <a-button @click="transferShow = false">{{ $t('def.cancel') }}</a-button>
            </template>
        </a-modal>
        <!-- 确认发货 -->
        <a-modal v-model:visible="outStockShow" :title="$t('p.shipping_confirmation')" @ok="handleOutStock">
            <div class="modal-content">
                <!-- <template v-if="$auth('ADMIN')">-->
                <!--     <div class="form-item required">-->
                <!--         <div class="key">{{$t('p.payment_terms')}}:</div>-->
                <!--         <div class="value">-->
                <!--             <a-select v-model:value="form.pay_clause" :placeholder="$t('def.select')">-->
                <!--                 <a-select-option v-for="(item,index) of paymentTimeList" :key="index" :value="item.value">{{ item.text }}</a-select-option>-->
                <!--             </a-select>-->
                <!--         </div>-->
                <!--     </div>-->
                <!-- </template>-->
                <div class="form-item required">
                    <div class="key">{{ $t('wa.warehouse') }}：</div>
                    <div class="value">
                        <a-select v-model:value="form.warehouse_id" :placeholder="$t('def.select')" :disabled="!!isProd">
                            <a-select-option v-for="item of warehouseList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('in.category') }}：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.target_type">
                            <a-radio v-for="item in COMMODITY_MAP" :key='item.key' :value='item.key'>{{ item[$i18n.locale] }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>

                <div class="form-item" >
                    <div class="key">{{$t('p.remark')}}:</div>
                    <div class="value">
                        <a-input v-model:value="form.remark" :placeholder="$t('def.input')"/>
                    </div>
                </div>
            </div>
        </a-modal>

        <!-- 支付审核 -->
        <a-modal v-model:visible="payAuditShow" :title="$t('p.confirm_transfer')" :after-close="handlePayAuditClose">
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">是否通过：</div>
                    <div class="value">
                        <a-radio-group v-model:value="payAuditForm.audit_result">
                            <a-radio :value="1">通过</a-radio>
                            <a-radio :value="2">不通过</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">备注：</div>
                    <div class="value">
                        <a-textarea v-model:value="payAuditForm.audit_remark" placeholder="填写备注" :auto-size="{ minRows: 3, maxRows: 6 }" :maxlength='200'/>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="handlePayAudit" type="primary">{{ $t('def.sure') }}</a-button>
                <a-button @click="handlePayAuditClose">{{ $t('def.cancel') }}</a-button>
            </template>
        </a-modal>
        <!-- &lt;!&ndash; 收货审核 &ndash;&gt;-->
        <!-- <a-modal v-model:visible="payAuditShow" :title="$t('p.confirm_transfer')" :after-close="handleTransferClose">-->
        <!--     <div class="modal-content">-->
        <!--         <div class="form-item required">-->
        <!--             <div class="key">是否通过：</div>-->
        <!--             <div class="value">-->
        <!--                 <a-radio-group v-model:value="payAuditForm.audit_result">-->
        <!--                     <a-radio :value="AUDIT_STATUS.FINANCE_PASS">通过</a-radio>-->
        <!--                     <a-radio :value="AUDIT_STATUS.AUDIT_REFUSE">不通过</a-radio>-->
        <!--                 </a-radio-group>-->
        <!--             </div>-->
        <!--         </div>-->
        <!--         <div class="form-item required">-->
        <!--             <div class="key">备注：</div>-->
        <!--             <div class="value">-->
        <!--                 <a-textarea v-model:value="payAuditForm.audit_remark" placeholder="填写备注" :auto-size="{ minRows: 3, maxRows: 6 }" :maxlength='200'/>-->
        <!--             </div>-->
        <!--         </div>-->
        <!--     </div>-->
        <!--     <template #footer>-->
        <!--         <a-button @click="handleTransferSubmit" type="primary">{{ $t('def.sure') }}</a-button>-->
        <!--         <a-button @click="transferShow = false">{{ $t('def.cancel') }}</a-button>-->
        <!--     </template>-->
        <!-- </a-modal>-->
    </template>
</div>
</template>

<script>
import Core from '../../core';
import PurchaseInfo from "./components/PurchaseInfo.vue"
import WaybillShow from "@/components/popup-btn/WaybillShow.vue"
import MySteps from "@/components/common/MySteps.vue"
import AttachmentFile from '@/components/panel/AttachmentFile.vue';
import DeliveryLogs from './components/DeliveryLogs.vue';
import AuditHandle from '@/components/popup-btn/AuditHandle.vue';

import EditItem from './components/EditItem.vue';


const PURCHASE = Core.Const.PURCHASE;
const DISTRIBUTOR = Core.Const.DISTRIBUTOR;
const WAYBILL = Core.Const.WAYBILL;

const FLAG = Core.Const.PURCHASE.FLAG;

const STATUS = Core.Const.PURCHASE.STATUS;
const PAY_TIME = Core.Const.DISTRIBUTOR.PAY_TIME;
const PAY_STATUS = Core.Const.PURCHASE.PAY_STATUS;
const FLAG_ORDER_TYPE = Core.Const.PURCHASE.FLAG_ORDER_TYPE;
const TYPE = Core.Const.PURCHASE.TYPE;

const PAYMENT_STATUS = Core.Const.PURCHASE.PAYMENT_STATUS;
const FLAG_PART_SHIPMENT_MAP = Core.Const.PURCHASE.FLAG_PART_SHIPMENT_MAP;
const FLAG_TRANSFER_MAP = Core.Const.PURCHASE.FLAG_TRANSFER_MAP;
const USER_TYPE = Core.Const.USER.TYPE;

export default {
    name: 'PurchaseOrderDetail',
    components: {
        EditItem,
        AttachmentFile,
        DeliveryLogs,
        WaybillShow,
        MySteps,
        AuditHandle,
    },
    props: {},
    data() {
        return {
            FLAG,
            TYPE,
            FLAG_ORDER_TYPE,
            STOCK_TYPE: Core.Const.STOCK_RECORD.TYPE,
            COMMODITY_MAP: Core.Const.STOCK_RECORD.COMMODITY_TYPE_MAP,
            ATTACHMENT_TYPE: Core.Const.ATTACHMENT.TARGET_TYPE,
            PAY_TIME,
            PAY_STATUS,
            AUDIT_STATUS: Core.Const.TRANSFER_ORDER.STATUS,
            STATUS,
            PAYMENT_STATUS,
            FLAG_PART_SHIPMENT_MAP,
            FLAG_TRANSFER_MAP,
            PURCHASE ,
            DISTRIBUTOR,
            WAYBILL,
            USER_TYPE,

            loginType: Core.Data.getLoginType(),
            loginOrgId: Core.Data.getOrgId(),
            loginOrgType: Core.Data.getOrgType(),


            warehouseList: [],
            // 加载
            loading: false,
            id: '',
            detail: {}, // 采购单详情
            activeKey: ['ItemInfo', 'PurchaseInfo', 'WaybillInfo'],

            stepsList: [
                {status: '100', zh: '支付', en: 'Payment'},
                {status: '200', zh: '发货', en: 'Deliver'},
                {status: '300', zh: '收货',en: 'Receipt'},
                {status: '400', zh: '交易完成',en: 'Transaction completed'},
            ],

            itemList: [], // 商品列表
            payList: [], // 收款明细列表
            total: {
                amount: 0,
                price: 0,
                charge: 0,
                freight: 0, // 运费
            },

            upload: { // 上传图片
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                coverList: [],
                detailList: [],
                fileList: [],
                headers: {
                    ContentType: false
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },

            waybill: {},
            waybillInfo: {},
            transferShow: false,
            paymentShow: false,

            payMethodList: PURCHASE.PAY_METHOD_LIST,
            paymentTimeList: DISTRIBUTOR.PAY_TIME_LIST,

            outStockShow: false,
            companyUidList: WAYBILL.COMPANY_LIST,
            courierTypeList: WAYBILL.COURIER_LIST,
            receiveTypeList: WAYBILL.RECEIPT_LIST,

            form: {
                express_type: undefined, // 快递方式
                waybill: '', // 物流单号
                port: '', // 发货港口
                receive_type: undefined, // 收货方式
                freight: '', // 运费
                pay_method: undefined, // 收款方式
                // pay_clause: undefined, // 支付条款
                remark: '', // 备注
                company_uid: undefined,
                waybill_uid: '', // 快递单号
                warehouse_id: '',
                target_type: '',
                payment: '', // 收款金额
            },
            editForm: {
                distributor_id: undefined,
            },
            payAuditShow: false,
            payAuditForm: {
                id: '',
                audit_result: '',
                audit_remark: '',
            },

            distributorList: [],
            exportDisabled: false, // 导出按钮禁用

            expandedRowKeys: [],
            expandIconColumnIndex: 0,
            selectedRowItemsAll: [],
            selectedRowKeys: [],
            selectedRowItems: [],

            itemEditShow: true, // 是否开启商品编辑
            giveOrderShow: false,
        };
    },
    watch: {},
    computed: {
        itemColumns() {
            let columns = [
                { title: this.$t('i.item'), dataIndex: 'item' },
                { title: this.$t('i.number'),dataIndex: ['item', "model"] },
                { title: this.$t('i.code'), dataIndex: ['item', "code"] },
                { title: this.$t('i.spec'), dataIndex: ['item', 'attr_list'], key: 'spec' },
                { title: this.$t('i.total_quantity'), dataIndex: 'amount'},
                { title: this.$t('i.residue_quantity'), dataIndex: 'residue_quantity'},
                { title: this.$t('i.deliver_amount'), dataIndex: 'deliver_amount', key: 'deliver_amount'},
                { title: this.$t('i.unit_price'), dataIndex: 'unit_price', key: 'money'},
                { title: this.$t('i.total_price'),dataIndex: 'price', key: 'money'},
            ]
            return columns

        },
        payColumns() {
            let columns = [
                { title: this.$t('p.attachment'), dataIndex: 'attachment' },
                { title: this.$t('p.payment_method'), dataIndex: 'type' },
                { title: this.$t('p.status'), dataIndex: 'status' ,key: 'status'},
                { title: this.$t('p.pay_amount'), dataIndex: 'price', key: 'money'},
                { title: this.$t('p.remark'), dataIndex: 'remark', key: 'item' },
                { title: this.$t('def.create_time'), dataIndex: 'create_time', key: 'time' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right'}
            ]
            return columns
        },
        currStep() {
            for (let i = 0; i < this.stepsList.length; i++) {
                const item = this.stepsList[i];
                if (this.detail.status == STATUS.CANCEL) {
                    this.stepsList= [
                        {status: '100', title: '取消'},
                    ]
                    return i
                }
                if (item.status == this.detail.status) {
                    return i
                }
            }
            return 0
        },
        showWaybill() {
            switch (this.detail.status) {
                case STATUS.CLOSE:
                case STATUS.WAIT_PAY:
                case STATUS.INIT:
                case STATUS.WAIT_DELIVER:
                    return false
            }
            return true
        },
        rowSelection() {
            return {
                type: this.radioMode ? 'radio' : 'checkbox',
                selectedRowKeys: this.selectedRowKeys,
                preserveSelectedRowKeys: true,
                onChange: (selectedRowKeys, selectedRows) => { // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys
                    // selectedRows.disabled = !selectedRows.disabled
                    this.selectedRowItemsAll.push(...selectedRows)
                    let selectedRowItems = []
                    selectedRowKeys.forEach(id => {
                        let element = this.selectedRowItemsAll.find(i => i.id == id)
                        selectedRowItems.push(element)
                    });
                    this.selectedRowItems = selectedRowItems
                    console.log('rowSelection this.selectedRowKeys:', this.selectedRowKeys,'selectedRowItems:', selectedRowItems)
                    this.$emit('submit', this.selectedRowKeys, this.selectedRowItems)
                },
                onSelect:(record, selected, selectedRows) => {
                    record.disabled = !record.disabled
                    if (record.disabled === false){
                        record.deliver_amount = record.residue_quantity
                    } else {
                        record.deliver_amount = 0
                    }
                },
                onSelectAll:(selected, selectedRows, changeRows) =>{
                    changeRows.forEach(it => {
                        it.disabled = !it.disabled
                        if (it.disabled === false){
                            it.deliver_amount = it.residue_quantity
                        } else {
                            it.deliver_amount = 0
                        }

                    })

                },
                // getCheckboxProps: record => ({
                //     disabled: (this.showStock && record.stock === 0) || this.disabledChecked.includes(record.id)
                // }),
            };
        },
        lang() {
            return this.$store.state.lang
        },

        beforeDeliver() {
            switch (this.detail.status) {
                case STATUS.INIT:
                case STATUS.WAIT_PAY:
                case STATUS.WAIT_DELIVER:
                case STATUS.ALL_TAKE_DELIVER:
                    return true;
                default:
                    return true;
            }
        },
    },
    mounted() {
        this.getList();

        this.getWarehouseList();
        // this.getWaybillDetail()
    },
    created() {
        this.id = Number(this.$route.query.id) || 0
    },
    methods: {
        getList(){
            this.itemEditShow = false
            this.giveOrderShow = false
            this.getPurchaseItemList();
            this.getPurchasePayList();
            this.getPurchaseInfo();
            this.$refs.in_delivery.getTableData();
            this.$refs.out_delivery.getTableData();
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list
            })
        },
        // 上传图片 start---
        // 校验图片
        handleImgCheck(file) {
            const isCanUpType = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
            if (!isCanUpType) {
                this.$message.warning('文件格式不正确');
            }
            const isLt10M = (file.size / 1024 / 1024) < 10;
            if (!isLt10M) {
                this.$message.warning('请上传小于10MB的图片');
            }
            return isCanUpType && isLt10M;
        },
        // 上传图片
        handleCoverChange({ file, fileList }) {
            console.log("handleCoverChange status:", file.status, "file:", file, "fileList: ", fileList)
            if (file.status == 'done') {
                if (file.response && file.response.code < 0) {
                    return this.$message.error(file.response.message)
                }
            }
            this.upload.coverList = fileList
        },
        handleDetailChange({ file, fileList }) {
            console.log("handleDetailChange status:", file.status, "file:", file, "fileList: ", fileList)
            if (file.status == 'done') {
                if (file.response && file.response.code < 0) {
                    return this.$message.error(file.response.message)
                }
            }
            this.upload.detailList = fileList
        },
        // 上传图片 end---
        // 上传前检查文件
        handleFileCheck(file) {
            console.log('handleFileCheck file.type', file.type)
            if (file.type.includes('image/')) {
                this.upload.data.type = 'img'
            } else if (file.type.includes('video/')) {
                this.upload.data.type = 'video'
            } else if (file.type.includes('audio/')) {
                this.upload.data.type = 'audio'
            } else {
                this.upload.data.type = 'file'
            }
            return true
        },
        // 上传文件
        handleFileChange({file, fileList}) {
            console.log("handleCoverChange status:", file.status, "file:", file)
            if (file.status == 'done') {
                if (file.response && file.response.code < 0) {
                    return this.$message.error(file.response.message)
                }
                this.form.path = file.response.data.filename
                this.form.type = this.form.path.split('.').pop()
                if (this.form.path){
                    this.submitDisabled = false
                }
            }
            this.upload.fileList = fileList
        },
        // 下载附件
        handleDownload(record) {
            console.log('handleDownload record:', record)
            let url = Core.Const.NET.FILE_URL_PREFIX + record.path
            window.open(url, '_self')
        },

        authOrg(orgId, orgType) {
            console.log('org',this.loginOrgId === orgId && this.loginOrgType === orgType)
            if (this.loginOrgId === orgId && this.loginOrgType === orgType) {
                return true
            } else{ return false }
        },
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'detail':        // 详情
                    routeUrl = this.$router.resolve({
                        path: this.$auth('ADMIN') ? "/item/item-detail" : '/purchase/item-display',
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'list':
                    routeUrl = this.$router.resolve({
                        path: '/item/purchase-order-list',
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'orderList':
                    routeUrl = this.$router.resolve({
                        path: '/purchase/purchase-order-self',
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'aftersales':
                    routeUrl = this.$router.resolve({
                        path: '/aftersales/aftersales-edit',
                        query: {
                            order_id: this.id,
                            order_sn: this.detail.sn,
                        }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        // 获取 采购单详情
        getPurchaseInfo() {
            Core.Api.Purchase.detail({
                id: this.id
            }).then(res => {
                this.detail = res.detail;
                if (this.detail.status === Core.Const.PURCHASE.STATUS.TAKE_DELIVER){
                    this.detail.status = Core.Const.PURCHASE.STATUS.WAIT_DELIVER
                }
                this.total.freight = res.detail.freight || 0;
                console.log('getPurchaseInfo res', res)
                this.step();
            }).catch(err => {
                console.log('getPurchaseInfo err', err)
            }).finally(() => {
            });
        },
        // 获取 采购单 商品列表
        getPurchaseItemList() {
            Core.Api.Purchase.itemList({
                order_id: this.id
            }).then(res => {
                let total_amount = 0,total_charge = 0,total_price = 0;
                res.list.forEach(it =>{
                    it.disabled = true
                    it.deliver_amount = 0
                    total_amount += it.amount
                    total_charge += it.charge
                    total_price += it.price
                    let element = it.item || {}
                    if (element.attr_list && element.attr_list.length) {
                        let str = element.attr_list.map(i => i.value).join(' ')
                        element.attr_str = str
                    }
                })
                this.itemList = res.list
                this.total.amount = total_amount
                this.total.charge = total_charge
                this.total.price  = total_price
            }).catch(err => {
                console.log('getPurchaseInfo err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 获取 采购单 payList列表
        getPurchasePayList() {
            Core.Api.Purchase.payList({
                target_id: this.id
            }).then(res => {
                res.list.forEach(it =>{
                    it.path = it.attachment.path.split(",")
                })
                this.payList = res.list
                console.log("this.payList", this.payList)
            }).catch(err => {
                console.log('getPurchaseInfo err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 获取 物流单信息
        getWaybillDetail() {
            Core.Api.Waybill.detailByTarget({
                target_id: this.id,
                target_type: Core.Const.WAYBILL.TARGET_TYPE.PURCHASE_ORDER,
                type: Core.Const.WAYBILL.TYPE.OUT,
            }).then(res => {
                console.log('getWaybillDetail:', res);
                this.waybill = res.detail
                this.getWaybillInfo(this.waybill.uid, this.waybill.company_uid)
                console.log('getWaybillDetail', this.waybill)
            }).catch(err => {
                console.log('getPurchaseInfo err', err)
            }).finally(() => {
            });
        },
        // 获取 物流单详情
        getWaybillInfo(uid, company_uid) {
            Core.Api.Waybill.queryLogistics({
                uid: uid,
                company_uid: company_uid,
            }).then(res => {
                console.log('getWaybillInfo:', res);
                this.waybillInfo = JSON.parse(res.waybill).result
                console.log('getWaybillInfo', this.waybillInfo)
            }).catch(err => {
                console.log('getPurchaseInfo err', err)
            }).finally(() => {
            });
        },

        // 弹出弹框
        handleModalShow(val) {
            Object.assign(this.form, this.$options.data().form)
            switch (val) {
                case "payment":
                    this.paymentShow = true
                    break;
                case "out_stock":
                    this.outStockShow = true
                    break;
                case "transfer":
                    this.transferShow = true
                    this.getDistributorListAll();
                    break;
            }
        },
        //获取分销商列表
        getDistributorListAll() {
            Core.Api.Distributor.listAll().then(res => {
                this.distributorList = res.list
            });
        },
        handleTransferClose() {
            this.transferShow = false
            Object.assign(this.editForm, this.$options.data().editForm)
        },
        handleTransferSubmit() {
            let _this = this
            this.$confirm({
                title: '确认转单吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    Core.Api.Purchase.transfer({
                        distributor_id: _this.editForm.distributor_id,
                        id: _this.id
                    }).then(res => {
                        _this.$message.success('转单成功')
                        _this.handleTransferClose()
                        _this.getPurchaseInfo()
                    }).catch(err => {
                        console.log('handleReceived err', err)
                    })
                },
            });
        },
        // 确认收款
        handlePayment() {
            let form = Core.Util.deepCopy(this.form)
            // if (this.upload.detailList.length) {
            //     let detailList = this.upload.detailList.map(item => {
            //         return item.short_path || item.response.data.filename
            //     })
            //     form.imgs = detailList.join(',')
            // }
            if (!form.pay_method) {
                return this.$message.warning('请选择收款方式')
            }
            if (!form.payment) {
                return this.$message.warning('请输入收款金额')
            }
            Core.Api.Purchase.payment({
                id: this.id,
                pay_method: form.pay_method,
                payment: form.payment * 100,
                imgs: form.path,
                img_type: form.type,
                remark: form.remark
            }).then(res => {
                this.$message.success('支付成功')
                this.getList()
                this.paymentShow = false
            }).catch(err => {
                console.log('getPurchaseInfo err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 确认出库
        handleOutStock() {
            console.log("rowSelection",this.selectedRowItems)
            let form = Core.Util.deepCopy(this.form);
            const param = {
                id: this.id,
                warehouse_id: form.warehouse_id,
                target_type: form.target_type,
                remark: form.remark,
            }
            let adminRequire = [
                { key: 'warehouse_id', msg: '请选择仓库' },
                { key: 'target_type', msg: '请选择类型' },
            ];

            for(let index in adminRequire) {
                let key = adminRequire[index].key
                if(!this.form[key]) {
                    return this.$message.warning(adminRequire[index].msg)
                } else {
                    param[key] = form[key];
                }
            }
            param['freight'] = Math.round(param['freight'] * 100)
            param['item_list'] = this.selectedRowItems
            Core.Api.Purchase.outStock(param).then(res => {
                this.$message.success('发货成功')
                this.outStockShow = false
                this.getWaybillDetail();
                this.getList()
            }).catch(err => {
                console.log('handleDeliver err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 确认发货
        handleDeliver() {
            console.log("rowSelection",this.selectedRowItems)
            let form = Core.Util.deepCopy(this.form);
            const param = {
                id: this.id,
                warehouse_id: form.warehouse_id,
                target_type: form.target_type,
                remark: form.remark,
            }
            let adminRequire = [
                { key: 'warehouse_id', msg: '请选择仓库' },
                { key: 'target_type', msg: '请选择类型' },
            ];

            if(this.$auth('ADMIN')) {
                adminRequire = [
                    { key: 'express_type', msg: '请选择快递方式' },
                    { key: 'port', msg: '请填写发货港口' },
                    { key: 'freight', msg: '请填写运费' },
                    // { key: 'pay_clause', msg: '请选择支付条款' },
                ]
                param['waybill'] = form['waybill'];
            } else if (this.$auth('DISTRIBUTOR')) {
                adminRequire = [
                    { key: 'receive_type', msg: '请选择收货方式' },
                    { key: 'freight', msg: '请填写运费' },
                ]
                param['waybill_uid'] = form['waybill_uid'];
            }
            for(let index in adminRequire) {
                let key = adminRequire[index].key
                if(!this.form[key]) {
                    return this.$message.warning(adminRequire[index].msg)
                } else {
                    param[key] = form[key];
                }
            }
            param['freight'] = Math.round(param['freight'] * 100)
            param['item_list'] = this.selectedRowItems
            Core.Api.Purchase.deliver(param).then(res => {
                this.$message.success('发货成功')
                this.outStockShow = false
                this.getWaybillDetail();
                this.getList()
            }).catch(err => {
                console.log('handleDeliver err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        // 确认收货
        handleReceived() {
            let _this = this
            this.$confirm({
                title: '确认已收到货物吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    Core.Api.Purchase.takeDeliver({
                        id: _this.id
                    }).then(res => {
                        _this.$message.success('收货成功')
                        _this.getPurchaseInfo()
                        _this.getList()
                    }).catch(err => {
                        console.log('handleReceived err', err)
                    })
                },
            });
        },
        // 取消采购
        handleCancel() {
            let _this = this
            this.$confirm({
                title: '确认要取消本次采购吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    Core.Api.Purchase.cancel({
                        id: _this.id
                    }).then(res => {
                        _this.$message.success(_this.$('pop_up.canceled'))
                        _this.routerChange('orderList')
                    }).catch(err => {
                        console.log('handleCancel err', err)
                    })
                },
            });
        },
        confirmExport() {
            let _this = this;
            this.$confirm({
                title: '确认要导出吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    _this.handleExportIn();
                }
            })
        },
        // 导出订单
        handleExportIn() {
            const params = {
                id: this.id, // 订单id
                currency: this.detail.currency, // 货币类型
            };

            this.exportDisabled = true;
            let exportUrl = Core.Api.Export.purchaseTemplateExport(params);
            console.log("handlePurchaseExport _exportUrl", exportUrl)
            window.open(exportUrl, '_blank')
            this.exportDisabled = false;
        },
        handleExportInfo() {
            const params = {
                id: this.id, // 订单id
                currency: this.detail.currency, // 货币类型
            };

            this.exportDisabled = true;
            let exportUrl = Core.Api.Export.purchaseOrderExport(params);
            console.log("handlePurchaseExport _exportUrl", exportUrl)
            window.open(exportUrl, '_blank')
            this.exportDisabled = false;
        },
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => { // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys
                    this.selectedRowItems = selectedRows
                    console.log('rowSelection onChange this.selectedRowKeys', this.selectedRowKeys);
                },
            };
        },
        step(){
            console.log("detail", this.detail)
            if (this.detail.pay_type == PAY_TIME.PAYMENT_TYPE_ALL_PAYMENT ||  this.detail.pay_type == PAY_TIME.PAYMENT_TYPE_DOWN_PAYMENT){
                this.stepsList = [
                    {status: '100', zh: '支付', en: 'Payment'},
                    {status: '200', zh: '发货', en: 'Deliver'},
                    {status: '300', zh: '收货',en: 'Receipt'},
                    {status: '400', zh: '交易完成',en: 'Transaction completed'},
                ]
            } else {
                this.stepsList = [
                    {status: '200', zh: '发货', en: 'Deliver'},
                    {status: '300', zh: '收货',en: 'Receipt'},
                    {status: '360', zh: '支付', en: 'Payment'},
                    {status: '400', zh: '交易完成',en: 'Transaction completed'},
                ]
            }
        },
        handlePayAuditShow(id){
            this.payAuditForm.id = id
            this.payAuditShow = true
        },
        handlePayAudit(){
            if(!this.payAuditForm.audit_result) {
                this.$message.warning('请选择审核结果')
                return
            }
            Core.Api.Purchase.payAudit(this.payAuditForm).then(res => {
                this.$message.success('审核成功')
                this.payAuditShow = false
                this.getList()
            })
        },
        handlePayAuditClose() {
            this.payAuditShow = false
            Object.assign(this.payAuditForm, this.$options.data().payAuditForm)
        },
        handlePayCancel(id){
            let _this = this
            this.$confirm({
                title: '确认取消吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    Core.Api.Purchase.delete({
                            id: id
                        }).then((res)=>{
                        _this.$message.success(_this.$('pop_up.canceled'));
                        _this.getList();
                    }).catch(err => {
                        console.log('handleReceived err', err)
                    })
                },
            });
        },

    }
};
</script>

<style lang="less">
// #PurchaseOrderDetail {}
</style>
