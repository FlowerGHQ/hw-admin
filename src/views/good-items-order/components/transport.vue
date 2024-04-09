<template>
    <a-button type="link" class="fill-track" @click="isShow">{{ $t('item_order.see_detail') }}</a-button>
    <!-- 填写快递编号 -->
    <a-modal
        v-model:visible="refundVisible"
        title="运输中详情"
        @cancel="refundHandleCancel"
        @ok="refundHandleOk"
        :width="600"
        :footer="null"
    >
        <div class="title">{{ wayillobj?.company }}:{{ wayillobj?.uid }}</div>
        <div class="content">
            <div class="record-box" v-for="(item, index) in talk" :key="item.id">
                <div class="head-record">
                    <span class="time"
                        ><!-- 12:13:14 2023.12.12 -->
                        {{ item.time }}</span
                    >
                    <span
                        class="icon-record"
                        :class="{ 'color-click': item.type === 'moment', 'color-top': item.type === 'Sign' }"
                    >
                        {{ item.type === 'Sign' ? '收' : '' }}
                        <!-- <img v-if="index===1" class="color-img" :src="getTestActiveSrc('car')"/> -->
                    </span>
                    <span
                        class="line"
                        :class="{ 'del-bot': index === 0, 'line-last': index === talk?.length - 1 }"
                    ></span>
                    <span class="peo-record">{{ item.sub_title }}</span>
                </div>
                <div class="body-record" :class="{ 'border-left': index + 1 < talk?.length }"></div>
            </div>
        </div>
        <!-- <template #footer> -->
        <!-- <a-button @click="refundHandleCancel"> {{ $t(/* 取消 */'def.cancel') }} </a-button> -->
        <!-- <a-button type="primary" @click="refundHandleOk" :disabled="isFooterDisabled" > {{  $t(/* 确定 */'def.ok')  }} </a-button> -->
        <!-- </template> -->
    </a-modal>
</template>

<script setup>
import Core from '@/core';
import TimeSearch from '@/components/common/TimeSearch.vue';
import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const testActiveModules = import.meta.glob('../../../assets/images/good-items/*.png', { eager: true });
// const womanImg =  import.meta.glob("../../assets/images/test-drive/*.png");
const props = defineProps({
    wayillobj: {
        type: Object,
    },
});
/* 使用图片的方法 */
const getTestActiveSrc = name => {
    const path = `../../../assets/images/good-items/${name}.png`;
    return testActiveModules[path].default;
};

const refundVisible = ref(false);
const list = ref([
    { title: '收件人', value: 'name', key: 'name' },
    { title: '省', value: 'province', key: 'province' },
    { title: '市', value: 'city', key: 'city' },
    { title: '详细地址', value: 'address', key: 'address' },
]);
const refundHandleOk = () => {
    refundVisible.value = false;
};
const refundHandleCancel = () => {
    refundVisible.value = false;
};

const isShow = () => {
    refundVisible.value = true;
};

const isFooterDisabled = ref(false);
const talk = ref([
    {
        id: 1,
        type: 'past',
        title: '已开票',
        name: '李',
        time: '10:30:48',
        sub_title: '常州市，离开【常州市丽华北路揽投部】，下一站【常州市邮区中心局邮件处理中心】',
    },
    {
        id: 2,
        type: 'Sign',
        title: '已签收',
        name: '李',
        time: '10:30:48',
        sub_title: '常州市，离开【常州市丽华北路揽投部】，下一站【常州市邮区中心局邮件处理中心】',
    },
    {
        id: 3,
        type: 'past',
        title: '派送中',
        name: '李',
        time: '10:30:48',
        sub_title: '常州市，离开【常州市丽华北路揽投部】，下一站【常州市邮区中心局邮件处理中心】',
    },
    {
        id: 4,
        type: 'moment',
        title: '派送中',
        name: '李开智',
        time: '10:30:48',
        sub_title: '常州市，离开【常州市丽华北路揽投部】，下一站【常州市邮区中心局邮件处理中心】',
    },
    {
        id: 5,
        type: 'past',
        title: '派送中',
        name: '李开智',
        time: '10:30:48',
        sub_title: '常州市，离开【常州市丽华北路揽投部】，下一站【常州市邮区中心局邮件处理中心】',
    },
]);
</script>

<style lang="less" scoped>
.fill-track {
    margin-left: 10px;
}
.title {
    color: var(--color-text-1, #1d2129);
    font-size: 16px;
    font-weight: 600;
    line-height: 24px; /* 150% */
}

.content {
    margin-top: 16px;
    .record-box {
        width: 100%;
        .head-record {
            position: relative;
            display: flex;
            align-items: center;
            color: #86909c;
            .line {
                position: absolute;
                height: 100%;
                top: 0;
                left: 108px;
                z-index: 10;
                border-left: #e5e6eb solid 1px;
            }
            .line-last {
                height: 50%;
            }
            .del-bot {
                top: 50%;
                height: 50%;
            }
            .icon-record {
                position: relative;
                display: inline-block;
                width: 8px;
                height: 8px;
                flex-shrink: 0;
                border-radius: 50%;
                margin: 6px 0px 6px 8px;
                background: #c9cdd4;
                z-index: 30;
            }
            .color-top {
                position: relative;
                display: inline-block;
                width: 28px;
                height: 28px;
                flex-shrink: 0;
                border-radius: 50%;
                margin: 6px 0px 6px 8px;
                background: #c9cdd4;
                z-index: 30;
                margin-left: 0px;
                text-align: center;
                line-height: 28px;
                color: #fff;
            }
            .color-img {
                width: 28px;
                height: 28px;
                vertical-align: top;
            }
            .color-click {
                background: blue;
            }
            .time {
                width: 80px;
                white-space: wrap;
                margin-left: 16px;
            }
            .peo-record {
                width: 440px;
                white-space: wrap;
                padding-left: 16px;
            }
        }

        .body-record {
            min-height: 48px;
            margin-left: 108px;
            .con-record {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                min-height: 76px;
                background: #f7f8fa;
                box-sizing: border-box;
                font-size: 14px;
                padding: 14px 12px 12px;
            }
        }
        .border-left {
            border-left: #e5e6eb solid 1px;
        }
    }
}
</style>
