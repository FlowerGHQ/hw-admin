<template>
    <div id="ReportEdit" class="edit-container" :class="$i18n.locale">
        <!-- <div class="title-container">
            <div class="title-area">{{ form.id ? $t('crm_oi.edit') : $t('crm_oi.save') }}</div>
        </div> -->
        <div class="form-block">
            <div class="form-content">
                <!-- 区域 -->
                <div class="form-item required">
                    <div class="key">{{ $t('operation.area') }}</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.area" name="radioGroup">
                            <a-radio value="1">全部区域</a-radio>
                            <a-radio value="2">全部区域</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <!-- 展示位置 -->
                <div class="form-item required">
                    <div class="key">{{ $t('operation.display_location') }}</div>
                    <div class="value">

                    </div>
                </div>
                <!-- 排序 -->
                <div class="form-item required">
                    <div class="key">{{ $t('operation.sort') }}</div>
                    <div class="value">
                        <a-input-number style="width: 100%;" :placeholder="$t('operation.sort_placeholder')"
                            id="inputNumber" v-model:value="form.sort" :min="1" :max="10" />
                    </div>
                </div>
                <!-- 公告标题 -->
                <div class="form-item required">
                    <div class="key">{{ $t('operation.report_title') }}</div>
                    <div class="value">
                        <a-input v-model:value="form.title" :placeholder="$t('operation.title_placeholder')" />
                    </div>
                </div>
                <!-- 公告内容 -->
                <div class="form-item required flex_start">
                    <div class="key">{{ $t('operation.report_content') }}</div>
                    <div class="value">

                    </div>
                </div>
                <!-- 图片 -->
                <div class="form-item required flex_start">
                    <div class="key">{{ $t('operation.pic') }}</div>
                    <div class="value">
                        <MyUpload name="add_attachments" v-model:value="form.pic_list" showTip :limit="1" :limitSize="2"
                            tipPosition="right">
                            <template #tip>
                                <div class="tips">
                                    <p>{{ $t('operation.pic_tip1') }}</p>
                                    <p>{{ $t('operation.pic_tip2') }}</p>
                                    <p>{{ $t('operation.pic_tip3') }}</p>
                                </div>
                            </template>
                        </MyUpload>
                    </div>
                </div>
                <!-- 添加附件 -->
                <div class="form-item flex_start">
                    <div class="key">{{ $t('operation.add_attachments') }}</div>
                    <div class="value">
                        <MyUpload name="add_attachments" :tip="'123\n123'" v-model:value="form.attachment_list" showTip
                            :limit="1" :limitSize="2" tipPosition="right">
                            <template #tip>
                                <div class="tips">
                                    <p>{{ $t('operation.attachments_tip1') }}</p>
                                    <p>{{ $t('operation.attachments_tip2') }}</p>
                                </div>
                            </template>
                        </MyUpload>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary" v-if="$auth('crm-order-income.save')">{{ $t('def.sure')
            }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost="">{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, getCurrentInstance } from 'vue';
import Core from '../../core';
import { useRouter, useRoute } from 'vue-router'

import MyUpload from "@/components/MyUpload/index.vue";

const { proxy } = getCurrentInstance();
const router = useRouter()
const route = useRoute()


onMounted(() => {
    form.id = Number(route.query.id) || 0

    if (form.id) {
        getReportDetail();
    }

})
/* state start*/
const loading = ref(false)
const detail = reactive({})
const form = reactive({
    id: '',
    area: '1',
    sort: '',
    title: '',
    pic_list: [],
    attachment_list: [],
})
/* state end*/

/* methods start*/
const routerChange = (type, item) => {
    switch (type) {
        case 'back':    // 详情
            let routeUrl = router.resolve({
                path: "/crm-order-income/order-income-list",
            })
            window.open(routeUrl.href, '_self')
            break;
    }
}
const getReportDetail = () => {
    loading.value = true;
    Core.Api.CRMReportIncome.detail({
        id: form.id,
    }).then(res => {
    }).catch(err => {
        console.log('getReportDetail err', err)
    }).finally(() => {
        loading.value = false;
    });
}
const handleSubmit = () => {
    let form = Core.Util.deepCopy(form)
    if (!form.order_id) {
        return proxy.$message.warning(proxy.$t('n.enter') + ":" + proxy.$t('crm_oi.belong_order'))
    }
    Core.Api.CRMReportIncome.save({
        ...form,
    }).then(() => {
        proxy.$message.success(proxy.$t('pop_up.save_success'))
        router.go(-1)
    }).catch(err => {
        console.log('handleSubmit err:', err)
    })
}
/* methods end*/

/* Fetch start*/

/* Fetch end*/
</script>

<style lang="less">
#ReportEdit {
    padding-top: 20px;

    .form-block {
        .form-content {
            margin: 0 auto;

            .form-item {
                .key {
                    text-align: right;
                    font-size: 14px;
                    margin-right: 8px;
                }

                .value {
                    .tips {
                        >p {
                            color: #666;
                            font-size: 14px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: normal;

                            &:nth-child(n + 2) {
                                margin-top: 5px;
                            }
                        }
                    }

                    .ant-input,
                    .ant-input-number {
                        font-size: 14px;
                    }

                    .upload-wrap {
                        margin-bottom: 0;

                        .ant-upload.ant-upload-select-picture-card {
                            margin-bottom: 0;
                        }
                    }
                }

                &.flex_start {
                    align-items: flex-start;
                }
            }
        }
    }
}
</style>
