<template>
    <div class="payment_detail">
        <div class="panel-content">
            <a-table
                :columns="payColumns"
                :data-source="payList"
                :scroll="{ x: true }"
                :row-key="record => record.id"
                :pagination="channelPagination"
                @change="handleTableChange"
            >
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.key === 'item'">
                        {{ text || '-' }}
                    </template>

                    <template v-if="column.dataIndex === 'attachment'">
                        <div class="table-img">
                            <a-image-preview-group class="image-group">
                                <a-image
                                    style="cursor: pointer"
                                    v-for="(path, index) in record.path"
                                    :key="index"
                                    class="image"
                                    :width="55"
                                    :height="55"
                                    :src="$Util.imageFilter(path)"
                                    :fallback="$t('def.none')"
                                />
                            </a-image-preview-group>
                        </div>
                    </template>

                    <template v-if="column.key === 'detail'">
                        <div class="table-img">
                            <a-image
                                :width="24"
                                :height="24"
                                :src="$Util.imageFilter(record.path.includes('img') ? record.path : '', 4)"
                                :fallback="$t('def.none')"
                            />
                            <a-tooltip placement="top" :title="text">
                                <p class="ell" style="max-width: 120px; margin-left: 12px">
                                    {{ text || '-' }}
                                </p>
                            </a-tooltip>
                        </div>
                    </template>

                    <template v-if="column.dataIndex === 'type'">
                        {{ $Util.purchasePayMethodFilter(text, $i18n.locale) }}
                    </template>

                    <template v-if="column.key === 'status'">
                        {{ $Util.purchasePayStatusFilter(text, $i18n.locale) }}
                    </template>

                    <template v-if="column.key === 'money'">
                        {{ $Util.priceUnitFilter(order_detail.currency) }} {{ $Util.countFilter(text) }}
                    </template>

                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>

                    <template v-if="column.key === 'operation'">
                        <a-button type="link" @click="handleDownload(record)"
                            ><i class="icon i_download" />{{ $t('n.download') }}
                        </a-button>
                        <template v-if="authOrg(order_detail.supply_org_id, order_detail.supply_org_type)">
                            <a-button
                                v-if="record.status === PAY_STATUS.WAIT_TO_AUDIT"
                                type="link"
                                @click="handlePayAuditShow(record.id)"
                            >
                                {{ $t('p.audit') }}
                            </a-button>
                        </template>

                        <template v-if="authOrg(order_detail.org_id, order_detail.org_type)">
                            <a-button
                                type="link"
                                v-if="record.status === PAY_STATUS.WAIT_TO_AUDIT"
                                @click="handlePayCancel(record.id)"
                            >
                                {{ $t('def.cancel') }}
                            </a-button>
                        </template>
                    </template>
                </template>
            </a-table>
        </div>
    </div>
    <!-- 支付审核 -->
    <a-modal v-model:visible="payAuditShow" :title="$t('p.confirm_payment')" :after-close="handlePayAuditClose">
        <div class="modal-content">
            <div class="form-item required">
                <div class="key">{{ $t('p.whether_pass') }}：</div>
                <div class="value">
                    <a-radio-group v-model:value="payAuditForm.audit_result">
                        <a-radio :value="1">{{ $t('n.pass') }}</a-radio>
                        <a-radio :value="2">{{ $t('n.fail') }}</a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="form-item">
                <div class="key">{{ $t('def.remark') }}：</div>
                <div class="value">
                    <a-textarea
                        v-model:value="payAuditForm.audit_remark"
                        :placeholder="$t('p.enter_remark')"
                        :auto-size="{ minRows: 3, maxRows: 6 }"
                        :maxlength="200"
                    />
                </div>
            </div>
        </div>
        <template #footer>
            <a-button @click="handlePayAudit" type="primary">{{ $t('def.sure') }}</a-button>
            <a-button @click="handlePayAuditClose">{{ $t('def.cancel') }}</a-button>
        </template>
    </a-modal>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance, defineExpose } from 'vue';
import Core from '@/core';

const loginOrgId = Core.Data.getOrgId();
const loginOrgType = Core.Data.getOrgType();
const PAY_STATUS = Core.Const.PURCHASE.PAY_STATUS;

const { proxy } = getCurrentInstance();
const emits = defineEmits(['submit']);
const props = defineProps({
    target_id: {
        type: [Number, String],
    },
    // 订单详情
    order_detail: {
        type: Object,
    },
    // 订单编号
    sn: {
        type: String,
    },
});
/*== 计算属性 ==*/
const payColumns = computed(() => {
    let columns = [
        { title: proxy.$t('p.payment_voucher'), dataIndex: 'attachment', key: 'attachment' },
        { title: proxy.$t('p.payment_method'), dataIndex: 'type', key: 'type' },
        { title: proxy.$t('p.status'), dataIndex: 'status', key: 'status' },
        { title: proxy.$t('p.pay_amount'), dataIndex: 'price', key: 'money' },
        { title: proxy.$t('p.remark'), dataIndex: 'remark', key: 'item' },
        { title: proxy.$t('p.payment_time'), dataIndex: 'create_time', key: 'time' },
        { title: proxy.$t('def.operate'), key: 'operation', fixed: 'right' },
    ];
    return columns;
});
const loading = ref(false);
const payList = ref([]); // 收款明细列表
const payAuditForm = ref({
    id: '',
    audit_result: '',
    audit_remark: '',
}); // form 提交表单
const payAuditShow = ref(false); // model显隐
// 分页数据
const channelPagination = ref({
    current: 1,
    pageSizeOptions: ['20', '40', '60', '80', '100'],
    pageSize: 20,
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 是否可以改变 pageSize
    total: 0,
    showTotal: total => `${proxy.$t('p.total')} ${total} ${proxy.$t('p.strip')}`,
});

onMounted(() => {
    getPurchasePayList();
});
/*== FETCH start==*/
// 获取 采购单 payList列表
const getPurchasePayList = (params = {}) => {
    loading.value = true;
    Core.Api.Purchase.payList({
        target_id: props.target_id,
        page_size: channelPagination.value.pageSize,
        page: channelPagination.value.current,
        ...params,
    })
        .then(res => {
            channelPagination.value.total = res.count;
            res.list.forEach(it => {
                if (it.attachment !== null) {
                    it.path = it.attachment.path.split(',');
                } else {
                    it.path = '';
                }
            });
            payList.value = res.list;
        })
        .catch(err => {
            console.log('getPurchaseInfo err', err);
        })
        .finally(() => {
            loading.value = false;
        });
};
// 审核接口
const payAuditFetch = (params = {}) => {
    Core.Api.Purchase.payAudit({
        ...params,
    }).then(res => {
        proxy.$message.success(proxy.$t('pop_up.audited'));
        emits('submit');
        handlePayAuditClose();
        getPurchasePayList();
    });
};
/*== FETCH end==*/

/*== Methods start==*/
// 下载附件
const handleDownload = record => {
    // console.log('handleDownload record:', record)
    let url = Core.Const.NET.FILE_URL_PREFIX + record.path;
    window.open(url, '_self');
};

const authOrg = (orgId, orgType) => {
    if (loginOrgId === orgId && loginOrgType === orgType) {
        return true;
    } else {
        return false;
    }
};

// table操作审核操作
const handlePayAuditShow = value => {
    payAuditForm.value.id = value;
    payAuditShow.value = true;
};
// table操作取消按钮
const handlePayCancel = id => {
    proxy.$confirm({
        title: proxy.$t('p.determine_cancel'),
        okText: proxy.$t('def.sure'),
        cancelText: proxy.$t('def.cancel'),
        onOk() {
            Core.Api.Purchase.delete({
                id: id,
                sn: props.sn,
            })
                .then(res => {
                    proxy.$message.success(proxy.$t('pop_up.canceled'));
                    getPurchasePayList();
                })
                .catch(err => {
                    console.log('handleReceived err', err);
                });
        },
    });
};

// model确定按钮
const handlePayAudit = () => {
    if (!payAuditForm.value.audit_result) {
        proxy.$message.warning(proxy.$t('r.audit_result'));
        return;
    }
    payAuditFetch(payAuditForm.value);
};
// model取消按钮
const handlePayAuditClose = () => {
    payAuditShow.value = false;
    payAuditForm.value = {
        id: '',
        audit_result: '',
        audit_remark: '',
    };
};

// 分页事件
const handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...channelPagination.value };
    pager.current = pagination.current;
    if (pagination.pageSize !== channelPagination.value.pageSize) {
        pager.current = 1;
        pager.pageSize = pagination.pageSize;
    }
    channelPagination.value = pager;
    getPurchasePayList({
        page_size: channelPagination.value.pageSize,
        page: channelPagination.value.current,
    });
};
defineExpose({
    getPurchasePayList,
});
</script>

<style lang="less" scoped>
.payment_detail {
}
</style>
