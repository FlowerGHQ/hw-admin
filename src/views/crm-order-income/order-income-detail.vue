<template>
    <div id="OrderDetail" class="edit-container">
        <div class="title-container">
            <div class="title-area">
                {{ $t('crm_oi.detail') }}
            </div>
            <div class="btns-area">
                <AuditHandle
                    v-if="user.id === audit.audit_user_id"
                    btnType="primary"
                    :api-list="['CRMOrderIncome', 'audit']"
                    :id="detail.id"
                    @submit="getOrderDetail"
                    :s-pass="Core.Const.FLAG.YES"
                    :s-refuse="Core.Const.FLAG.NO"
                    :current-audit-process-id="detail.current_audit_process_id"
                    no-refuse
                    ><i class="icon i_audit" />{{ $t('n.audit') }}
                </AuditHandle>
                <span
                    v-if="
                        trackMemberDetail != null
                            ? trackMemberDetail.type !== Core.Const.CRM_TRACK_MEMBER.TYPE.READ
                            : false
                    "
                >
                    <a-button @click="routerChange('edit', detail)">{{ $t('def.edit') }}</a-button>
                    <a-button @click="handleDelete(detail.id)">{{ $t('def.delete') }}</a-button>
                </span>
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content desc-container">
                <div class="desc-title">
                    <div class="title-area">
                        <span class="title">{{ detail.name }}</span>
                    </div>
                </div>
                <a-row class="desc-detail">
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('crm_oi.order') }}：</span>
                        <span class="value">
                            {{ detail.order ? detail.order.name || '-' : '-' }}
                            <!-- <template v-if="$auth('crm-order.detail')">
                                <a-button type="link" @click="routerChange('detail-order', detail)">
                                    {{ detail.order ? detail.order.name || '-' : '-' }}
                                </a-button>
                            </template>
                            <template v-else>
                                {{ detail.order ? detail.order.name || '-' : '-' }}
                            </template> -->
                        </span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('crm_oi.status') }}：</span>
                        <span class="value">{{ $Util.CRMOrderIncomeStatusFilter(detail.status) || '-' }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('crm_oi.money') }}：</span>
                        <span class="value">{{ $Util.countFilter(detail.money) + '元' }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('crm_oi.date') }}：</span>
                        <span class="value">{{ $Util.timeFilter(detail.date, 3) || '-' }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('crm_oi.own_user_name') }}：</span>
                        <span class="value">{{ detail.own_user_name || '-' }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('crm_refund.refunded') }}：</span>
                        <span class="value">{{ $Util.countFilter(detail.refunded) + '元' }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="24" :lg="24" class="detail-item">
                        <span class="key">{{ $t('sl.show') }}：</span>
                        <span class="value">
                            <LabelList :targetId="id" :targetType="Core.Const.CRM_LABEL.CATEGORY.ORDER_INCOME" />
                        </span>
                    </a-col>
                </a-row>
                <a-row class="desc-detail">
                    <a-col :xs="24" :sm="24" :lg="24" class="detail-item" v-if="flag_message">
                        <span class="key">{{ $t('crm_oi.error') }}：</span>
                        <span class="value">{{ audit_message || '-' }}</span>
                    </a-col>
                    <a-steps :current="current">
                        <a-step v-for="(item, index) in auditUserList">
                            <template #icon>
                                <user-outlined />
                            </template>
                            <template #title>
                                {{ item.audit_user_name }}
                            </template>
                            <template #status>
                                {{ item.audit_step }}
                            </template>
                        </a-step>
                    </a-steps>
                </a-row>
            </div>
        </div>

        <a-row>
            <a-col :xs="24" :sm="24" :lg="16">
                <div class="tabs-container">
                    <a-tabs v-model:activeKey="activeKey">
                        <a-tab-pane key="CustomerSituation" :tab="$t('crm_c.summary_information')">
                            <CustomerSituation :detail="detail" />
                        </a-tab-pane>
                        <a-tab-pane key="RefundRecord" :tab="$t('crm_refund.refund_record')">
                            <CrmRefundRecord
                                v-if="detail.id > 0"
                                :detail="detail"
                                :orderIncomeId="detail.id"
                                ref="CrmRefundRecord"
                            >
                                <a-button type="primary" @click="handleRefundShow">{{
                                    $t('crm_refund.refund')
                                }}</a-button>
                            </CrmRefundRecord>
                        </a-tab-pane>
                        <a-tab-pane key="InformationInfo" :tab="$t('n.attachment_list')">
                            <CRMAttachmentFile
                                v-if="detail.id > 0"
                                :target_id="id"
                                :target_type="CRM_ORDER_INCOME_FILE"
                            />
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
            <a-col :xs="24" :sm="24" :lg="8">
                <div class="tabs-container">
                    <a-tabs v-model:activeKey="tabActiveKey">
                        <a-tab-pane key="InformationInfo" :tab="$t('crm_c.dynamic')">
                            <ActionRecord
                                v-if="detail.id > 0"
                                :targetId="id"
                                :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.ORDER_INCOME"
                                :detail="detail"
                                ref="ActionRecord"
                            />
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
        </a-row>
        <a-modal v-model:visible="refundShow" :title="$t('crm_refund.save')" :after-close="handleRefundClose">
            <div class="form-item required">
                <div class="key">{{ $t('crm_oi.uid') }}：</div>
                <div class="value">
                    {{ detail.uid }}
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('crm_refund.type') }}：</div>
                <div class="value">
                    <a-select v-model:value="refundForm.type" :placeholder="$t('def.input')">
                        <a-select-option v-for="item of CRM_REFUND_TYPE_MAP" :key="item.value" :value="item.value">{{
                            lang === 'zh' ? item.zh : item.en
                        }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('crm_refund.money') }}：</div>
                <div class="value">
                    <a-input v-model:value="refundForm.money" :placeholder="$t('def.input')" />
                </div>
            </div>
            <div class="form-item textarea">
                <div class="key">{{ $t('crm_refund.remark') }}</div>
                <div class="value">
                    <a-textarea
                        v-model:value="refundForm.remark"
                        :placeholder="$t('def.input')"
                        :auto-size="{ minRows: 2, maxRows: 6 }"
                        :maxlength="500"
                    />
                    <span class="content-length"
                        >{{ refundForm.remark != undefined ? refundForm.remark.length : 0 }}/500</span
                    >
                </div>
            </div>

            <template #footer>
                <a-button @click="handleRefundSubmit" type="primary">{{ $t('def.ok') }}</a-button>
                <a-button @click="handleRefundClose">{{ $t('def.cancel') }}</a-button>
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

import CrmRefundRecord from '@/components/crm/panel/CrmRefundRecord.vue';
import { UserOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import { get } from 'lodash';
import LabelList from '@/components/crm/common/LabelList.vue';

export default {
    name: 'OrderDetail',
    components: {
        Group,
        CustomerSituation,
        CRMAttachmentFile,
        ActionRecord,
        AuditHandle,
        UserOutlined,
        CrmRefundRecord,
        LabelList,
    },
    props: {},
    data() {
        return {
            Core,
            CRM_ORDER_INCOME_FILE: Core.Const.ATTACHMENT.TARGET_TYPE.CRM_ORDER_INCOME_FILE,

            TYPE_MAP: Core.Const.CRM_TRACK_RECORD.TYPE_MAP,
            CRM_REFUND_TYPE_MAP: Core.Const.CRM_REFUND_RECORD.TYPE_MAP,
            INTENT_MAP: Core.Const.CRM_TRACK_RECORD.INTENT_MAP,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            user: Core.Data.getUser(),
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            detail: {},
            TrackRecordShow: false,
            trackMemberDetail: undefined,
            trackRecordForm: {
                type: '',
                content: '',
                contact_order_id: '',
                track_time: undefined,
                intent: '',
                next_track_time: undefined,
            },
            activeKey: 'CustomerSituation',
            tabActiveKey: 'InformationInfo',
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
            auditUserList: [],
            current: 0,
            audit: {
                id: '',
                audit_user_id: '',
                current_audit_process_id: '',
            },
            flag_message: false,
            audit_message: '',
            refundShow: false,
            refundForm: {
                type: '',
                money: '',
                remark: '',
            },
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0;
        if (this.id) {
            this.getOrderDetail();
        }
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/crm-order-income/order-income-edit',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'back': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/crm-order-income/order-income-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail-order': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/crm-order/order-detail',
                        query: { id: item.order_id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getOrderDetail() {
            this.loading = true;
            Core.Api.CRMOrderIncome.detail({
                id: this.id,
            })
                .then(res => {
                    console.log('getOrderDetail res', res);
                    let d = res.detail;
                    this.detail = d;
                    this.detail.birthday = this.detail.birthday
                        ? dayjs.unix(this.detail.birthday).format('YYYY-MM-DD')
                        : undefined;
                    for (const key in this.form) {
                        this.form[key] = d[key];
                    }
                    this.defAddr = [d.province, d.city, d.county];
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
                    this.getTargetByUserId();
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
            console.log('handleCoverChange status:', file.status, 'file:', file);
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
                title: _this.$t('crm_oi.delete') + '？',
                okText: _this.$t('def.ok'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMOrderIncome.delete({ id })
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
        handleRefundShow() {
            this.refundShow = true;
        },
        handleRefundClose() {
            this.refundShow = false;
            Object.assign(this.refundForm, this.$options.data().refundForm);
        },
        handleRefundSubmit() {
            Core.Api.CRMRefundRecord.save({
                order_income_id: this.detail.id,
                type: this.refundForm.type,
                money: this.refundForm.money * 100,
                remark: this.refundForm.remark,
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.handleRefundClose();
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
        getTargetByUserId() {
            Core.Api.CRMTrackMember.getTargetByUserId({
                target_id: this.detail.order_id,
                target_type: Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.ORDER,
            }).then(res => {
                this.trackMemberDetail = res.detail;
                console.log('trackMemberDetail', this.trackMemberDetail);
            });
        },
    },
};
</script>

<style lang="less">
.OrderDetail {
    .icon {
        font-size: 12px;
    }
}
</style>
