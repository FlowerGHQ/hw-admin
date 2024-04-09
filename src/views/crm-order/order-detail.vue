<template>
    <div id="OrderDetail" class="edit-container">
        <div class="title-container">
            <div class="title-area">
                {{ $t('oder_details.order_number_1') }} {{ detail.uid || '' }}（{{
                    lang === 'zh'
                        ? Core.Const.CRM_ORDER.SOURCE_TYPE[detail.source_type]?.zh
                        : Core.Const.CRM_ORDER.SOURCE_TYPE[detail.source_type]?.en
                }}）
            </div>
        </div>
        <div class="infomation">
            <a-row :gutter="16">
                <a-col :xs="24" :sm="24" :lg="12">
                    <div class="panel-content desc-container">
                        <a-row class="desc-detail">
                            <a-col :xs="24" :sm="12" :lg="12" class="detail-item">
                                <span class="key">{{ $t('crm_o.customer_name') }}：</span>
                                <router-link
                                    target="_blank"
                                    :to="{
                                        path: '/crm-customer/customer-detail',
                                        query: { id: detail.customer_id },
                                    }"
                                >
                                    {{ detail.customer_name || '-' }}
                                </router-link>
                            </a-col>
                            <a-col :xs="24" :sm="12" :lg="12" class="detail-item">
                                <span class="key">{{ $t('crm_o.phone') }}：</span>
                                <span class="value">{{ detail.customer_phone || '-' }}</span>
                            </a-col>
                            <!-- 下单名称 -->
                            <a-col :xs="24" :sm="12" :lg="12" class="detail-item">
                                <span class="key">{{ $t('crm_o.order_name') }}：</span>
                                <span class="value">{{ detail.buyer_signatory || '-' }}</span>
                            </a-col>
                            <a-col :xs="24" :sm="12" :lg="12" class="detail-item">
                                <span class="key">{{ $t('crm_o.email') }}：</span>
                                <span class="value">{{ detail.customer_email || '-' }}</span>
                            </a-col>
                            <a-col :xs="24" :sm="12" :lg="12" class="detail-item">
                                <span class="key">{{ $t('crm_o.city') }}：</span>
                                <span class="value">{{ detail.to_city || '-' }}</span>
                            </a-col>
                            <a-col :xs="24" :sm="12" :lg="12" class="detail-item">
                                <span class="key">{{ $t('crm_o.own_user_name') }}：</span>
                                <span class="value">{{ detail.own_user_name || '-' }}</span>
                            </a-col>
                            <a-col :xs="24" :sm="12" :lg="24" class="detail-item">
                                <span class="key">{{ $t('crm_o.address_details') }}：</span>
                                <span class="value">{{ detail.to_address || '-' }}</span>
                            </a-col>
                            <a-col :xs="24" :sm="24" :lg="24" class="detail-item">
                                <span class="key">{{ $t('sl.show') }}：</span>
                                <span class="value">
                                    <LabelList :targetId="id" :targetType="Core.Const.CRM_LABEL.CATEGORY.ORDER" />
                                </span>
                            </a-col>
                        </a-row>
                    </div>
                </a-col>
                <a-col :xs="24" :sm="24" :lg="12">
                    <div class="panel-content desc-container">
                        <a-row class="desc-detail">
                            <a-col :xs="24" :sm="12" :lg="12" class="detail-item">
                                <span class="key">{{ $t('crm_o.buy_car_type') }}：</span>
                                <span class="value">{{ detail.item_name || '-' }}</span>
                            </a-col>
                            <a-col :xs="24" :sm="12" :lg="12" class="detail-item">
                                <span class="key"> {{ $t('retail.order_amount') }}：</span>
                                <span class="value">{{ currency }} {{ detail.money ? detail.money / 100 : 0 }}</span>
                            </a-col>
                            <a-col :xs="24" :sm="12" :lg="12" class="detail-item">
                                <span class="key">{{ $t('retail.amount_paid') }}：</span>
                                <span class="value"
                                    >{{ currency }} {{ detail.paid_money ? detail.paid_money / 100 : 0 }}</span
                                >
                            </a-col>
                            <a-col :xs="24" :sm="12" :lg="12" class="detail-item">
                                <span class="key">{{ $t('crm_o.refunded_amount') }}：</span>
                                <span class="value"
                                    >{{ currency }} {{ detail.refunded ? detail.refunded / 100 : 0 }}</span
                                >
                            </a-col>
                            <a-col :xs="24" :sm="12" :lg="12" class="detail-item">
                                <span class="key">{{ $t('crm_o.wait_pay') }}：</span>
                                <span class="value"
                                    >{{ currency }} {{ detail.pending_money ? detail.pending_money / 100 : 0 }}</span
                                >
                            </a-col>
                            <a-col :xs="24" :sm="12" :lg="12" class="detail-item">
                                <span class="key">{{ $t('crm_o.paid_money_progress') }}：</span>
                                <span class="value">{{ detail.paid_money_progress || '-' }}</span>
                            </a-col>
                            <!-- 支付地址 -->
                            <a-col :xs="24" :sm="24" :lg="24" class="detail-item">
                                <span class="key">{{ $t('crm_o.pay_address') }}：</span>
                                <span>{{ detail.payAddress }}</span>
                                <a-button @click="addressEditModalShow" style="margin-left: 20px" type="link"
                                    >+ {{ $t('def.edit') }}</a-button
                                >
                            </a-col>
                        </a-row>
                    </div>
                </a-col>
            </a-row>
        </div>
        <a-row :gutter="16">
            <a-col :xs="24" :sm="24" :lg="16">
                <div class="tabs-container left-content">
                    <a-tabs v-model:activeKey="activeKey">
                        <!-- <a-tab-pane
              key="CustomerSituation"
              :tab="$t('crm_c.summary_information')">
              <CustomerSituation :detail="detail" />
            </a-tab-pane> -->
                        <a-tab-pane key="salesinfo" :tab="$t('crm_o.sales_info')">
                            <CRMItem
                                v-if="id > 0"
                                :detail="detail"
                                :sourceId="detail.id"
                                :currency="detail.currency"
                                :sourceType="Core.Const.CRM_ITEM_BIND.SOURCE_TYPE.ORDER"
                                ref="CRMItem"
                            />
                        </a-tab-pane>
                        <!-- <a-tab-pane key="RemittanceList" :tab="$t('crm_oi.list')">
              <CrmOrderIncome
                v-if="id > 0"
                :detail="detail"
                :orderId="detail.id"
                ref="CrmOrderIncome" />
            </a-tab-pane> -->
                        <a-tab-pane key="AttachmentsList" :tab="$t('n.attachment_list')">
                            <CRMAttachmentFile v-if="id > 0" :target_id="id" :target_type="CRM_ORDER_FILE" />
                        </a-tab-pane>
                        <a-tab-pane key="customerInfo" :tab="$t('crm_o.customer_detail')">
                            <CrmCustomerDetail
                                v-if="id > 0"
                                class="customerInfo_area"
                                :id="detail.customer_id"
                                ref="CrmCustomerDetail"
                            />
                        </a-tab-pane>
                        <a-tab-pane key="editInfo" :tab="$t('crm_o.editInfo')">
                            <CustomerSituation :detail="detail" />
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
            <a-col :xs="24" :sm="24" :lg="8">
                <div class="tabs-container right-content">
                    <a-tabs v-model:activeKey="tabActiveKey">
                        <a-tab-pane key="CustomerSituation" :tab="$t('crm_c.team_members')">
                            <Group
                                v-if="id > 0"
                                :targetId="id"
                                :targetType="Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.ORDER"
                                :detail="detail"
                                ref="Group"
                            />
                        </a-tab-pane>
                        <a-tab-pane key="InformationInfo" :tab="$t('crm_c.dynamic')">
                            <ActionRecord
                                v-if="id > 0"
                                :targetId="id"
                                :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.ORDER"
                                :detail="detail"
                                ref="ActionRecord"
                            />
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
        </a-row>
        <a-modal v-model:visible="batchShow" :title="$t('crm_b.distribute_bo')" :after-close="handleBatchClose">
            <div class="form-item required">
                <div class="key">{{ $t('crm_b.customer_name') }}：</div>
                <div class="value">
                    {{ detail.customer_name }}
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('crm_o.name') }}：</div>
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
                        @change="getUserData('')"
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
                        :placeholder="$t('def.input')"
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
        <a-modal
            v-model:visible="modalVisible"
            :title="$t('crm_o.pay_address_edit')"
            centered
            class="field-select-modal"
            :width="630"
            :after-close="addressEditModalClose"
        >
            <div class="modal-content">
                <!-- 街道 -->
                <div class="form-item">
                    <div class="key">{{ $t('crm_o.street') }}：</div>
                    <div class="value">
                        <a-input v-model:value="addressForm.address_line_1" :placeholder="$t(/*请输入*/ 'def.input')" />
                    </div>
                </div>
                <!-- 城市 -->
                <div class="form-item">
                    <div class="key">{{ $t('crm_o.city') }}：</div>
                    <div class="value">
                        <a-input v-model:value="addressForm.admin_area_2" :placeholder="$t(/*请输入*/ 'def.input')" />
                    </div>
                </div>
                <!-- 州 -->
                <div class="form-item">
                    <div class="key">{{ $t('crm_o.state') }}：</div>
                    <div class="value">
                        <a-input v-model:value="addressForm.admin_area_1" :placeholder="$t(/*请输入*/ 'def.input')" />
                    </div>
                </div>
                <!-- 邮编 -->
                <div class="form-item">
                    <div class="key">{{ $t('crm_o.postcode') }}：</div>
                    <div class="value">
                        <a-input v-model:value="addressForm.postal_code" :placeholder="$t(/*请输入*/ 'def.input')" />
                    </div>
                </div>
                <!-- 国家 -->
                <div class="form-item">
                    <div class="key">{{ $t('crm_o.country') }}：</div>
                    <div class="value">
                        <a-input v-model:value="addressForm.country_code" :placeholder="$t(/*请输入*/ 'def.input')" />
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button type="primary" @click="handleAddressEditConfirm">{{ $t(/*确定*/ 'def.ok') }}</a-button>
                <a-button @click="modalVisible = false">{{ $t(/*取消*/ 'def.cancel') }}</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../core';
import CustomerSituation from './components/CustomerSituation.vue';
import CRMAttachmentFile from '@/components/crm/panel/CRMAttachmentFile.vue';
import Group from '@/components/crm/panel/Group.vue';
import ActionRecord from '@/components/crm/panel/ActionRecord.vue';
import AuditHandle from '@/components/popup-btn/AuditHandle.vue';
import dayjs from 'dayjs';
import { get } from 'lodash';
import CRMItem from '@/components/crm/panel/CRMItem.vue';
import CrmOrderIncome from '@/components/crm/panel/CrmOrderIncome.vue';
import CrmCustomerDetail from '../../components/crm/panel/CrmCustomerDetail.vue';
import { UserOutlined } from '@ant-design/icons-vue';
import LabelList from '@/components/crm/common/LabelList.vue';
export default {
    name: 'OrderDetail',
    components: {
        Group,
        ActionRecord,
        CustomerSituation,
        CRMAttachmentFile,
        CRMItem,
        UserOutlined,
        AuditHandle,
        CrmOrderIncome,
        LabelList,
        CrmCustomerDetail,
    },
    props: {},
    data() {
        return {
            Core: Core,
            CRM_ORDER_FILE: Core.Const.ATTACHMENT.TARGET_TYPE.CRM_ORDER_FILE,

            TYPE_MAP: Core.Const.CRM_TRACK_RECORD.TYPE_MAP,
            INTENT_MAP: Core.Const.CRM_TRACK_RECORD.INTENT_MAP,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            user: Core.Data.getUser(),
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            detail: {},
            TrackRecordShow: false,
            trackRecordForm: {
                type: '',
                content: '',
                contact_order_id: '',
                track_time: undefined,
                intent: '',
                next_track_time: undefined,
            },

            upload: {
                // 上传图片
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                coverList: [],
                detailList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },
            fileUpload: {
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'file',
                },
            },
            activeKey: 'salesinfo',
            tabActiveKey: 'CustomerSituation',
            trackMemberDetail: undefined,
            batchForm: {
                own_user_id: '',
            },
            userData: [],
            batchShow: false,
            batchType: '',
            auditUserList: [],
            current: 0,
            audit: {
                id: '',
                audit_user_id: '',
                current_audit_process_id: '',
            },
            flag_message: false,
            audit_message: '',
            id: '',
            groupOptions: [],
            group_id: undefined,
            modalVisible: false,
            address: undefined,
            addressForm: {
                address_line_1: undefined, // 街道
                admin_area_2: undefined, // 城市、城镇、村庄
                admin_area_1: undefined, // 州、省
                postal_code: undefined, // 邮编
                country_code: undefined, // 国家区号
            },
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang;
        },
        currency() {
            return this.detail.currency === 'eur' ? '€' : '￥';
        },
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0;
        if (this.id) {
            this.getOrderDetail();
            this.getTargetByUserId();
        }
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/crm-order/order-edit',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'back': // 返回列表
                    routeUrl = this.$router.resolve({
                        path: '/crm-order/order-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'income': // 返回列表
                    routeUrl = this.$router.resolve({
                        path: '/crm-order-income/order-income-edit',
                        query: { order_id: this.detail.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        handleBatch(type) {
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
                case 'transfer':
                    Core.Api.CRMBo.transfer({
                        id: this.detail.id,
                        own_user_id: this.batchForm.own_user_id,
                    })
                        .then(() => {
                            this.$message.success(this.$t('pop_up.delete_success'));
                            this.getBoDetail();
                            this.handleBatchClose();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                    break;
            }
        },
        getOrderDetail() {
            this.loading = true;
            Core.Api.CRMOrder.detail({
                id: this.id,
            })
                .then(res => {
                    let d = res.detail;
                    this.detail = d;
                    this.detail.birthday = this.detail.birthday
                        ? dayjs.unix(this.detail.birthday).format('YYYY-MM-DD')
                        : undefined;
                    for (const key in this.form) {
                        this.form[key] = d[key];
                    }
                    this.defAddr = [d.province, d.city, d.county];
                    this.detail = d;
                    if (
                        !JSON.parse(this.detail.address)?.address_line_1 &&
                        !JSON.parse(this.detail.address)?.admin_area_2 &&
                        !JSON.parse(this.detail.address)?.admin_area_1 &&
                        !JSON.parse(this.detail.address)?.postal_code &&
                        !JSON.parse(this.detail.address)?.country_code
                    ) {
                        this.detail.payAddress = '-';
                    } else {
                        this.detail.payAddress = this.detail.address
                            ? `${JSON.parse(this.detail.address)?.address_line_1},${
                                  JSON.parse(this.detail.address)?.admin_area_2
                              },${JSON.parse(this.detail.address)?.admin_area_1} ${
                                  JSON.parse(this.detail.address)?.postal_code
                              },${JSON.parse(this.detail.address)?.country_code}`
                            : '-';
                    }
                    this.detail.payAddress = this.handleRemoveExtraCommas(this.detail.payAddress);
                    this.addressForm.address_line_1 = this.detail.address
                        ? JSON.parse(this.detail.address)?.address_line_1
                        : undefined;
                    this.addressForm.admin_area_2 = this.detail.address
                        ? JSON.parse(this.detail.address)?.admin_area_2
                        : undefined;
                    this.addressForm.admin_area_1 = this.detail.address
                        ? JSON.parse(this.detail.address)?.admin_area_1
                        : undefined;
                    this.addressForm.postal_code = this.detail.address
                        ? JSON.parse(this.detail.address)?.postal_code
                        : undefined;
                    this.addressForm.country_code = this.detail.address
                        ? JSON.parse(this.detail.address)?.country_code
                        : undefined;
                    this.auditUserList = res.detail.audit_user_list;
                    this.audit = Core.Util.deepCopy(this.$options.data().audit);
                    this.auditUserList.forEach(item => {
                        if (item.audit_status === Core.Const.CRM_AUDIT_PROCESS.AUDIT_STATUS.WAIT_AUDIT) {
                            this.current = item.audit_step;
                            this.audit = item;
                        }
                        if (item.audit_status === Core.Const.CRM_AUDIT_PROCESS.AUDIT_STATUS.REFUSE) {
                            this.flag_message = true;
                            this.audit_message = item.remark;
                        }
                    });
                    this.handleGroupTree();

                    // this.defArea = [d.continent || '', d.country || '']
                })
                .catch(err => {
                    console.log('getOrderDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleTrackRecordSubmit() {
            let form = Core.Util.deepCopy(this.trackRecordForm);
            let track_time = form.track_time;
            if (typeof track_time === 'string') {
                track_time = dayjs(form.track_time).unix();
            }
            let next_track_time = form.next_track_time;
            if (typeof next_track_time === 'string') {
                next_track_time = dayjs(form.next_track_time).unix();
            }
            Core.Api.CRMTrackRecord.save({
                target_id: this.detail.id,
                target_type: Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER,
                type: form.type,
                content: form.content,
                contact_order_id: form.contact_order_id,
                track_time: track_time,
                intent: form.intent,
                next_track_time: next_track_time,
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.handleTrackRecordClose();
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
        handleTrackRecordClose() {
            this.TrackRecordShow = false;
            Object.assign(this.trackRecordForm, this.$options.data().trackRecordForm);
        },
        // 校验图片
        handleImgCheck(file) {
            const isCanUpType = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type);
            if (!isCanUpType) {
                this.$message.warning(this.$t('n.file_incorrect'));
            }
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                this.$message.warning(this.$t('n.picture_smaller'));
            }

            // this.loadImage(TEST_IMAGE);
            // return false;
            return isCanUpType && isLt10M;
        },
        // 上传图片
        handleCoverChange({ file, fileList }) {
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message);
                }
                this.shortPath = get(fileList, '[0].response.data.filename', null);
                if (this.shortPath) {
                    this.form.img = this.shortPath;
                    // this.loadImage(this.detailImageUrl);
                }
            }
            this.upload.coverList = fileList;
        },
        // 上传文件
        handleFileChange({ file, fileList }) {
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message);
                }
                this.form.path = file.response.data.filename;
                this.form.type = this.form.path.split('.').pop();
                if (this.form.path) {
                    this.submitDisabled = false;
                }
            }
            this.upload.fileList = fileList;
        },
        // 添加商品
        handleAddorderShow(ids, items) {
            this.trackRecordForm.contact_order_id = items[0].id;
            this.trackRecordForm.contact_order_name = items[0].name;
        },
        // 删除 合同订单
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('crm_o.delete') + '？',
                okText: _this.$t('def.ok'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMOrder.delete({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.getTableData();
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
                target_type: Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.ORDER,
            }).then(res => {
                this.trackMemberDetail = res.detail;
            });
        },
        getUserData(query) {
            this.batchForm.own_user_id = undefined;
            this.loading = true;
            Core.Api.User.listGroup({
                name: query,
                org_type: Core.Const.LOGIN.ORG_TYPE.ADMIN,
                group_id: this.group_id,
            })
                .then(res => {
                    this.userData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleGroupTree() {
            Core.Api.CRMGroupMember.structureByUserGroup({
                group_id: this.detail.group_id,
            }).then(res => {
                this.groupOptions = res.list;
            });
        },
        addressEditModalShow() {
            this.modalVisible = true;
        },
        addressEditModalClose() {
            if (this.id) {
                this.getOrderDetail();
                this.getTargetByUserId();
            }
        },
        // 编辑支付地址
        handleAddressEditConfirm() {
            Core.Api.CRMOrder.saveAddress({
                id: this.id,
                ...this.addressForm,
            })
                .then(res => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.modalVisible = false;
                    this.$refs.ActionRecord.getCrmActionRecordTableData();
                })
                .catch(err => {
                    console.log('handleAddressEditConfirm err', err);
                });
        },
        // 去掉支付地址前后多余逗号的方法
        handleRemoveExtraCommas(v) {
            // 使用正则表达式替换连续逗号
            v = v.replace(/,+/g, ',');
            // 使用trim()方法去掉字符串首尾的逗号
            v = v.trim().replace(/^,|,$/g, '');
            return v;
        },
    },
};
</script>

<style lang="less">
.title-container {
    padding: 0;
}
.panel-content {
    border-radius: 6px;
    padding: 24px !important;
    .desc-detail {
        margin-top: 0 !important;
        padding: 0;
    }
}
.OrderDetail {
    .icon {
        font-size: 12px;
    }
}
.edit-container {
    background-color: transparent !important;
}
.gray-panel {
    background-color: transparent !important;
}
.ant-tabs {
    background-color: #fff;
    .ant-tabs-nav {
        padding-left: 20px;
        padding-top: 20px;
        margin-bottom: 20px !important;
        .ant-tabs-nav-wrap {
            .ant-tabs-nav-list {
                .ant-tabs-tab {
                    padding-bottom: 12px !important;
                }
            }
        }
    }
}
.infomation {
    padding: 16px 0;
}
.customerInfo_area {
    padding-left: 20px;
    .gray-panel {
        margin-left: 0;
        .panel-content {
            .desc-title {
                padding-left: 0;
            }
        }
    }
}
.right-content {
    height: 100%;
    padding-bottom: 20px;
    padding-left: 0;
    padding-right: 0;
    .ant-tabs {
        height: 100%;
    }
}
.left-content {
    padding-right: 0;
    padding-left: 0;
}

.desc-container .desc-detail .detail-item .key {
    width: auto;
    min-width: 80px;
}
.desc-container .desc-detail .detail-item .value {
    width: auto;
    flex: 1;
}
#Layout.en .detail-item .key {
    width: auto;
    min-width: 120px;
}
#Layout.en .detail-item .value {
    width: auto;
    flex: 1;
}
.ant-tabs {
    border-radius: 6px;
    overflow: hidden;
}
</style>
