<template>
    <div id="formModel">
        <!-- 基础输入框 -->
        <template v-if="type === 'Basic'">
            <div :class="unValid ? 'web-key orange' : 'web-key'" v-if="formKey">
                {{ formKey }}
            </div>
            <div :class="lastBool ? 'web-value mb24' : 'web-value'">
                <input
                    @focus="handleInputFocus"
                    @blur="handleInputBlur"
                    :value="internalValue"
                    :placeholder="placeholder"
                    :class="inputClassName"
                    type="text"
                    @input="updateValue"
                    @keydown.enter="keydownEnter"
                    ref="inputRef"
                />
            </div>
        </template>
        <!-- 密码输入框 -->
        <template v-if="type === 'Password'">
            <div :class="unValid ? 'web-key orange' : 'web-key'" v-if="formKey">
                {{ formKey }}
            </div>
            <div :class="lastBool ? 'web-value mb24' : 'web-value'">
                <input
                    @focus="handleInputFocus"
                    @blur="handleInputBlur"
                    :value="internalValue"
                    :placeholder="placeholder"
                    :class="inputClassName"
                    type="password"
                    @input="updateValue"
                    @keydown.enter="keydownEnter"
                    ref="inputRef"
                />
            </div>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            // 输入框的值
            type: String,
            default: '',
        },
        type: {
            // 表单类型
            type: String,
            default: 'Basic',
        },
        placeholder: {
            // 输入框占位符
            type: String,
            default: 'Please Enter',
        },
        formKey: {
            // label
            type: String,
            required: false,
        },
        unValid: {
            // 通用验证判断
            type: Boolean,
            default: false,
        },
        lastBool: {
            // 是否为最后一项 样式不同
            type: Boolean,
            default: false,
        },
        isGetDef: {
            // 是否需要获取默认值
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            inputStatus: 'not-enter', // 输入框状态 not-enter: 未输入未聚焦 be-entering: 输入中且聚焦 entered: 已输入内容 未聚焦 err-enter: 输入有错误
            internalValue: this.value,
            phoneInputStatus: 'not-enter',
            areaCodeInputStatus: 'not-enter',
            stateInputStatus: 'not-enter',
            final_code: null,
            phone_country_code: undefined,
            defArea: '',
            areaMap: {},
            area: {
                country: '',
                city: '',
                province: '',
            },
            state: undefined,
            stateOptions: [],
        };
    },
    computed: {
        inputClassName() {
            if (this.inputStatus === 'not-enter' && !this.internalValue && !this.unValid) {
                return 'web-input not-enter';
            } else if (this.unValid) {
                return 'web-input err-enter';
            } else if (this.inputStatus === 'be-entering') {
                return 'web-input be-entering';
            } else if (this.internalValue) {
                return 'web-input entered';
            }
        },
    },
    mounted() {},
    methods: {
        handleInputFocus() {
            this.inputStatus = 'be-entering';
            this.$emit('handleValid');
        },
        handleInputBlur() {
            if (this.value) {
                this.inputStatus = 'entered';
                this.$emit('handleValid');
            } else {
                this.inputStatus = 'not-enter';
                this.$emit('handleValid');
            }
        },
        updateValue(event) {
            this.internalValue = event.target.value;
            // this.$emit('update', this.internalValue);
        },
        // 按下 enter 触发
        keydownEnter() {
            this.$emit('keydownEnter');
        },
        focus() {
            this.$refs['inputRef'].focus();
        },
    },
};
</script>

<style lang="less">
#formModel {
    .selection {
        margin-right: 10px;
        margin-top: 1px;
        &.be-entering {
            border-bottom: 1px solid #eee;
            caret-color: #c6f;
        }
        &.not-enter {
            border-bottom: 1px solid #eee;
        }
        &.err-enter {
            border-bottom: 1px solid #ff0000;
            &::-webkit-input-placeholder {
                color: #ff0000;
            }
        }
        .ant-select-selection {
            border: none !important;
            background-color: transparent !important;
        }

        .ant-select {
            color: #333333;
        }

        .ant-select-selection__rendered {
            margin-left: 0;
            color: #333333;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            // letter-spacing: 0.72px;
            line-height: 36px;
        }

        .ant-select-focused .ant-select-selection {
            box-shadow: none;
        }

        .ant-select-selection {
            box-shadow: none;
        }

        .ant-select-selection:focus {
            box-shadow: none;
            border-bottom: 1px solid #bfbfbf;
        }

        .ant-select-selection:active {
            box-shadow: none;
            border-bottom: 1px solid #bfbfbf;
        }

        .ant-select-open {
            box-shadow: none;
        }

        .ant-select-selection {
            box-shadow: none;
        }
        .ant-select-arrow {
            top: 55%;
            right: 8px;
        }
    }
    .state-selection {
        // margin-right: 10px;
        // margin-top: 1px;
        width: 100%;
        &.be-entering {
            border-bottom: 1px solid #eee;
            caret-color: #c6f;
        }
        &.not-enter {
            border-bottom: 1px solid #eee;
        }
        &.err-enter {
            border-bottom: 1px solid #ff0000;
            &::-webkit-input-placeholder {
                color: #ff0000;
            }
        }
        .ant-select-selection {
            border: none !important;
            background-color: transparent !important;
        }

        .ant-select {
            color: #333333;
            width: 100%;
        }

        .ant-select-selection__rendered {
            margin-left: 0;
            color: #333333;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            // line-height: 36px;
        }

        .ant-select-focused .ant-select-selection {
            box-shadow: none;
        }

        .ant-select-selection {
            box-shadow: none;
        }

        .ant-select-selection:focus {
            box-shadow: none;
            border-bottom: 1px solid #bfbfbf;
        }

        .ant-select-selection:active {
            box-shadow: none;
            border-bottom: 1px solid #bfbfbf;
        }

        .ant-select-open {
            box-shadow: none;
        }

        .ant-select-selection {
            box-shadow: none;
        }
        .ant-select-arrow {
            top: 55%;
            right: 8px;
        }
    }

    .web-key {
        color: #333;
        font-size: 18px;
        font-style: normal;
        font-weight: 400;
        // letter-spacing: 0.72px;
        line-height: 150%;
        margin-bottom: 4px;
        &.orange {
            color: #ff0000;
        }
    }
    .web-value {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        position: relative;
        &.mb24 {
            margin-bottom: 24px !important;
        }
        input::-webkit-input-placeholder {
            /* 修改placeholder颜色  */
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 150%; /* 21px */
            // letter-spacing: 0.56px;
            color: #bfbfbf;
        }
        /* 解决浏览器自带input:-internal-autofill-selected背景色样式问题 */
        input {
            box-shadow: inset 0 0 0 1000px white !important;
        }

        .web-input {
            outline: none;
            width: 100%;
            padding: 15px 0;
            box-sizing: border-box;
            font-weight: 400;
            font-style: normal;
            // letter-spacing: 0.56px;

            &.not-enter {
                border-bottom: 1px solid #eee;
                font-weight: 400;
            }

            &.be-entering {
                border-bottom: 1px solid #bfbfbf;
                color: #333;
                font-weight: 400;
                caret-color: #c6f;
            }

            &.entered {
                border-bottom: 1px solid #eee;
                color: #333;
                font-weight: 400;
            }

            &.err-enter {
                border-bottom: 1px solid #ff0000;
                font-weight: 400;
                &::-webkit-input-placeholder {
                    color: #ff0000;
                }
            }
        }
        .address-cascader {
            width: 100%;
        }
    }
    @media (max-width: 750px) {
        .web-key {
            font-size: 16px;
            // letter-spacing: 0.56px;
            margin-bottom: 2px;
        }
        .web-value {
            &.mb24 {
                margin-bottom: 20px !important;
            }

            input::-webkit-input-placeholder {
                /* 修改placeholder颜色  */
                font-size: 12px;
                // letter-spacing: 0.48px;
            }

            .web-input {
                padding: 4px 0;
                // letter-spacing: 0.48px;
                font-size: 12px;
                &.phone {
                    margin-top: 6px;
                }
            }
        }
        .selection {
            height: 32px;
            margin-right: 10px;
            // margin-top: 1px;
            &.be-entering {
                border-bottom: 1px solid #eee;
                caret-color: #c6f;
            }
            &.not-enter {
                border-bottom: 1px solid #eee;
            }
            &.err-enter {
                border-bottom: 1px solid #ff0000;
                &::-webkit-input-placeholder {
                    color: #ff0000;
                }
            }
            .ant-select-selection {
                border: none !important;
                background-color: transparent !important;
            }

            .ant-select {
                color: #333333;
            }

            .ant-select-selection__rendered {
                margin-left: 0;
                color: #333333;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                // letter-spacing: 0.72px;
                line-height: 36px;
            }

            .ant-select-focused .ant-select-selection {
                box-shadow: none;
            }

            .ant-select-selection {
                box-shadow: none;
            }

            .ant-select-selection:focus {
                box-shadow: none;
                border-bottom: 1px solid #bfbfbf;
            }

            .ant-select-selection:active {
                box-shadow: none;
                border-bottom: 1px solid #bfbfbf;
            }

            .ant-select-open {
                box-shadow: none;
            }

            .ant-select-selection {
                box-shadow: none;
            }
            .ant-select-arrow {
                top: 55%;
                right: 8px;
            }
        }
    }
}
</style>
