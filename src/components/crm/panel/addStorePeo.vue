<template>
    <a-button type="primary" v-if="$auth('customer.detail')" @click="addMan">
        <slot>{{ $t('crm_st.add_man') }}</slot>
    </a-button>
    <template v-if="isShow">

        <a-modal v-model:visible="isShow" :title="$t('crm_st.add_peo')" open="isModalOpen" onOk="handleOk"
            onCancel="handleCancel" :okText="$t('def.save')">
            <div class="box-model">
                <a-input v-model:value="userName" placeholder="Basic usage">
                    <template #prefix>
                        <search-outlined :style="{ fontSize: '16px' }" />
                    </template>
                    <template #suffix>
                        <a-tooltip title="Extra information">
                            <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
                        </a-tooltip>
                    </template>
                </a-input>
                <div style="margin: 20px 0px;" class="tag-box">
                    <a-tag color="processing" v-for="item in 10">
                        <span class="tag-name">鹏程</span>
                        李鹏程
                        <!-- <close-circle-filled class="tab-close" @click="popTabClick(item, false)" /> -->
                        <span class="cha">×</span>
                    </a-tag>
                </div>

                <div class="per-box">
                    <div class="person" v-for="item in 20">
                        <div class="left">
                            鹏程
                        </div>
                        <div class="middle">
                            <span>李鹏程</span>
                            <span>杭州研发中心 | 杭州研发中心 | 杭州研发中心</span>
                        </div>

                        <div class="right">
                            <span class="add">添加</span>
                            <span>

                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </a-modal>

    </template>
</template>

<script>

import Core from '../../../core';
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons-vue';

export default {
    name: 'addStorePeo',
    components: {
        SearchOutlined,
        CloseCircleFilled,
    },
    props: {
        orderId: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            isShow: false
        }
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang
        }
    },
    mounted() {

    },
    methods: {
        isModalOpen() {

        },
        handleOk() {

        },
        handleCancel() {

        },

        addMan() {
            this.isShow = true;
            console.log('addMan---------', this.isShow);
        }
    }
}

</script>

<style lang="less" scoped>
.tag-box {
    margin: 0px 0px 28px;
    // .fac();

    .ant-tag-processing {
        color: var(--color-text-1, #1D2129);
        border-radius: 24px;
        border: none;
        height: 28px;
        background-color: var(--color-fill-2, #F2F3F5);
        padding-left: 2px;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 28px;
        vertical-align: top;
        display: inline-flex;
        align-items: center;
        margin-bottom: 12px;

        .cha:hover {
            background-color: #FFFFFF;
            color: #006EF9;
            border-radius: 50%;
        }

    }

    .tab-uncheck .ant-tag-processing {
        border: #EDF2F5 0.5px solid;
        border-radius: 4px;
        height: 28px;
        background: #EDF2F5;
        color: #1E2023;


        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 28px;
        vertical-align: top;
        margin-top: 0px;

    }

    .cha {
        background-color: var(--color-fill-2, #F2F3F5);
        height: 16px;
        width: 16px;
        font-size: 16px;
        display: inline-block;
        line-height: 16px;
        text-align: center;
        font-weight: 800;
        border-radius: 50%;
        margin-left: 4px;
        color: rgba(201, 205, 212, 1);
        cursor: pointer;
    }

    .tag-name {
        display: inline-block;
        background-color: red;
        color: #FFFFFF;
        border-radius: 50%;
        height: 24px;
        width: 24px;
        margin-right: 5px;
        padding: 0px 2px;
        font-size: 10px;
    }


}

.per-box {
    width: 100%;

    .person {
        display: flex;
        height: 56px;
        padding: 8px 0px;
        box-sizing: border-box;
        margin-top: 12px;

        .left {

            width: 40px;
            height: 40px;
            background-color: blue;
            color: #FFFFFF;
            font-size: 14px;
            border-radius: 50%;
            text-align: center;
            line-height: 40px;

        }

        .middle {
            display: flex;
            flex: 1;
            flex-direction: column;
            box-sizing: border-box;
            justify-content: space-between;
            padding: 0px 12px;

            & span:nth-child(1) {
                color: var(--color-text-1, #1D2129);
                font-family: PingFang SC;
                font-size: 14px;
                font-style: normal;
                font-weight: 600;
                line-height: normal;
            }

            & span:nth-child(2) {
                color: var(--color-text-3, #86909C);
                font-family: PingFang SC;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
            }
        }

        .right {
            line-height: 40px;

            .add {
                height: 30px;
                width: 36px;
                line-height: 30px;
                text-align: center;
                display: inline-block;
                background-color: var(--color-fill-2, #F2F3F5);
                font-size: 14px;
                border-radius: 2px;
                color: var(--brand-6, #0061FF);
            }
        }
    }
}

.box-model {
    max-height: 360px;
    overflow: auto;
    padding: 0px 10px;
}

.box-model::-webkit-scrollbar {
    width: 4px;
}

.box-model::-webkit-scrollbar-thumb {
    background-color: #d9d9d9;
}
</style>