<template>
    <div>
        <div class="tab-box">
            <a-tag class="tag" color="processing" v-for="(item, index) in tabStrList" v-if="tabStrList.length">
                {{ item }}
                <close-circle-filled @click="popTabClick(item, false)" />
            </a-tag>

            <img class="square" @click="addPop" src="../../../assets//images/intent/addtab.png" alt="" />

            <div class="add-tab" v-if="addPopBoo">
                <div class="input-tab">
                    <a-input
                        v-model:value="inputValue"
                        placeholder="输入创建标签"
                        :max-length="25"
                        style="width: 120px; margin-bottom: 10px"
                        @pressEnter="pressEnter"
                    />
                    <div class="input-tabname" v-if="formatValue" @click="pressEnter">
                        创建标签&nbsp;&nbsp; <span class="span-tab-name">{{ formatValue }}</span>
                    </div>

                    <div style="height: 10px" v-if="formatValue"></div>
                </div>

                <div
                    class="list-tab"
                    :class="{ 'tab-uncheck': tabStrList.indexOf(item) == -1 }"
                    v-for="(item, index) in tabList"
                >
                    <a-tag
                        class="tag-list-all"
                        color="processing"
                        @click="popTabClick(item, tabStrList.indexOf(item) == -1)"
                    >
                        {{ item }}
                    </a-tag>
                </div>
            </div>
        </div>
        <div class="mask-layer" @click="addPop" v-if="addPopBoo"></div>
    </div>
</template>

<script>
import Core from '../../../core';
import { CloseCircleFilled } from '@ant-design/icons-vue';

export default {
    name: 'LabelList',
    components: { CloseCircleFilled },
    props: {
        detail: {
            type: Object,
        },
        // 传入的字符串
        targetListStr: {
            type: String,
            default: '',
        },
        // 标签固定列表（不可增删）
        tabList: {
            type: Array,
            default: [],
        },
        keyValue: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            Core,
            // 表格数据
            tableData: [],
            // 是否显示弹窗
            addPopBoo: false,
            // 输入内容
            inputValue: '',
        };
    },
    watch: {
        targetId: {
            deep: true,
            immediate: true,
            handler() {
                this.getLabelList();
            },
        },
    },
    computed: {
        // 提示内容
        formatValue() {
            return this.inputValue;
        },
        tabStrList() {
            return (this.targetListStr && this.targetListStr.split(',')) || [];
        },
    },
    mounted() {
        this.getLabelList();
    },
    methods: {
        getLabelList() {
            Core.Api.CRMLabelBind.list({
                target_id: this.targetId,
                target_type: this.targetType,
            }).then(res => {
                this.tableData = res.list;
            });
        },

        handleAddLabelShow(ids, items) {
            Core.Api.CRMLabelBind.saveList({
                target_id: this.targetId,
                target_type: this.targetType,
                label_ids: ids,
            }).then(res => {
                this.getLabelList();
            });
        },

        addPop() {
            this.addPopBoo = !this.addPopBoo;
        },
        // formatNumber(value) {
        //     value += '';
        //     const list = value.split('.');
        //     const prefix = list[0].charAt(0) === '-' ? '-' : '';
        //     let num = prefix ? list[0].slice(1) : list[0];
        //     let result = '';

        //     while (num.length > 3) {
        //         result = `,${num.slice(-3)}${result}`;
        //         num = num.slice(0, num.length - 3);
        //     }

        //     if (num) {
        //         result = num + result;
        //     }

        //     return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
        // },

        pressEnter() {
            this.$emit('addStr', { value: this.inputValue.trim().replace(/,/g, ''), key: this.keyValue });
            this.inputValue = '';
        },
        // 点击弹窗标签 boo是true  则添加 否则删除
        popTabClick(item, boo) {
            if (boo) {
                this.$emit('addStr', { value: item, key: this.keyValue });
            } else {
                this.$emit('delStr', { value: item, key: this.keyValue });
            }
        },
    },
};
</script>

<style lang="less" scoped>
.tab-box {
    position: relative;
    padding-top: 10px;

    .tag {
        margin-top: 10px;
    }

    // 添加标签盒子
    .square {
        height: 28px;
        width: 28px;
        color: #006ef9;
        font-size: 28px;
        vertical-align: bottom;
        margin-left: 6px;
        border-radius: 4px;
        margin-top: 10px;
        cursor: pointer;
    }

    // 添加标签弹窗盒子
    .add-tab {
        position: absolute;
        margin-left: 12px;
        margin-top: -5px;
        min-width: 102px;
        max-height: 350px;
        background: #ffffff;
        box-shadow:
            0px 3px 14px 2px rgba(0, 0, 0, 0.05),
            0px 8px 10px 1px rgba(0, 0, 0, 0.06),
            0px 5px 5px -3px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        z-index: 30;
        display: inline-block;
        box-sizing: border-box;
        padding: 10px 9px;
        overflow-y: scroll;

        &::-webkit-scrollbar {
            display: none;
        }

        // display: none;
        .numeric-input {
            position: absolute;
            top: 0;
        }

        // .numeric-input .ant-tooltip-inner {
        //     position: absolute;

        //     min-width: 32px;
        //     min-height: 37px;
        // }

        // .numeric-input .numeric-input-title {
        //     position: absolute;
        //     font-size: 14px;
        // }

        // 输入框标签名称备注
        .input-tabname {
            cursor: pointer;
            min-width: 112px;
            max-width: 120px;
            background: #edeeee;
            border-radius: 3px;
            padding: 8px 4px 5px;

            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
            line-height: 17px;
            min-height: 26px;

            .span-tab-name {
                font-weight: 600;
                font-size: 10px;
                line-height: 17px;
                color: #363d42;
            }
        }

        // 所有标签竖排
        .list-tab {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding-left: 14px;
            box-sizing: border-box;

            .tag-list-all {
                margin-bottom: 10px;
                margin-top: 0px;
                cursor: pointer;
            }
        }
    }
}

// 遮罩层
.mask-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    z-index: 20;
    // background-color: rgba(255, 255, 0, 0.6);
}

// .customer-tag {
//     margin-right: 8px;
// }
</style>
