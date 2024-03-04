<template>
    <!-- 导出结果展示 -->
    <div class="ExportResult">
        <p class="title">
            <img src="@images/item/success.png" alt="" />
            <span>{{ $t('i.parsing_completed') }}</span>
        </p>
        <p class="dis">
            {{ $t('i.analysis_total') }}
            <span class="success-text">{{ data.totalCode }}</span>
            {{ $t('i.strip_data') }}，{{ $t('i.success') }}
            <span class="success-text">{{ data.successCode }}</span>
            {{ $t('i.strip_data') }}，{{ $t('i.error') }}
            <span class="error-text">{{ data.errorCode }}</span>
            {{ $t('i.strip') }}，{{ $t('i.invalid_encoding') }}
            <span class="error-text">{{ data.invalidCode }}</span>
            {{ $t('i.strip') }}
        </p>
        <div class="code" v-if="data.errorCodeList.length > 0 || data.invalidCodeList.length > 0">
            <p class="code-title" v-if="data.errorCodeList.length > 0">
                <span class="code-title-l">{{ $t('i.failure_encoding') }}</span>
                <a-button type="default" @click="copyText('code-body')">
                    {{ $t('i.copy_encoding') }}
                </a-button>
            </p>
            <template v-if="data.errorCodeList.length > 0">
                <div class="code-body" id="code-body">
                    <div class="code-item" v-for="item in data.errorCodeList">
                        {{ item }}
                    </div>
                </div>
            </template>
            <p
                class="code-title"
                :class="data.errorCodeList.length > 0 ? 'border-top' : ''"
                v-if="data.invalidCodeList.length > 0"
            >
                <span class="code-title-l">{{ $t('i.invalid_encoding') }}</span>
                <a-button type="default" @click="copyText('code-body-invalid')">
                    {{ $t('i.copy_encoding') }}
                </a-button>
            </p>
            <template v-if="data.invalidCodeList.length > 0">
                <div class="code-body" id="code-body-invalid">
                    <div class="code-item" v-for="item in data.invalidCodeList">
                        {{ item }}
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import Core from '@/core';
import { ref, onMounted, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();
const props = defineProps({
    // v-model 绑定值
    data: {
        type: Object,
        default: () => {},
    },
});

onMounted(() => {});
const copyText = id => {
    try {
        Core.Util.Common.copyText(id);
        proxy.$message.success(proxy.$t('i.copy_success'));
    } catch {
        proxy.$message.error(proxy.$t('i.copy_failed'));
    }
};
</script>

<style lang="less" scoped>
.ExportResult {
    .title {
        .fcc(initial);
        font-size: 14px;
        color: #26ab54;
        line-height: 16px;
        img {
            width: 16px;
            height: 16px;
            margin-right: 4px;
        }
        margin-bottom: 6px;
    }
    .dis {
        background: #f8f8f8;
        padding: 4px 7px;
        border-radius: 4px;
        margin-bottom: 17px;
        font-size: 12px;
        color: #666666;
        .success-text {
            color: #26ab54;
        }
        .error-text {
            color: #f53f3f;
        }
    }
    .code {
        background: #ffffff;
        border: 1px solid #e2e2e2;
        border-radius: 4px;
        .border-top {
            border-top: 1px solid #e2e2e2;
        }
        .code-title {
            .fcc(space-between);
            background: #f2f3f5;
            padding: 8px 10px;
            .code-title-l {
                font-size: 14px;
                font-weight: 500;
                color: #1d2129;
                line-height: 16px;
            }
        }
        .code-body {
            padding: 10px;
            display: flex;
            flex-wrap: wrap;
            .code-item {
                padding: 3px 7.5px;
                background: #f2f3f5;
                border-radius: 4px;
                width: calc((100% - 16px) / 3);
                margin-right: 8px;
                font-size: 12px;
                color: #1d2129;
                line-height: 14px;
                text-align: center;
                &:nth-child(3n) {
                    margin-right: 0;
                }
                &:nth-child(n + 4) {
                    margin-top: 8px;
                }
            }
        }
        .empty {
            padding: 10px;
            width: 100%;
            .fcc();
        }
    }
    .btns {
        text-align: center;
    }
}
</style>
