<template>
    <div id="TimeConfig">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t(/*生效时间*/'wt.effective_time') }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="handleSubmit">{{ $t(/*保存*/'def.save') }}</a-button>
                </div>
            </div>
            <div class="time-form-container">
                <div class="form-item">
                    <div class="form-key">
                        {{ $t(/*生效时间*/'wt.effective_time') }}：
                    </div>
                    <div class="form-value">
                        <div class="value-text">
                            {{ $t(/*根据*/'wt.reason') }}
                        </div>
                        <a-select v-model:value="form.type" :placeholder="$t('def.select')">
                            <a-select-option v-for="item of reasonList" :key="item.key" :value="item.value">{{ $i18n.locale
                                === 'zh' ? item.name : item.name_en }}</a-select-option>
                        </a-select>
                        <div class="value-text">
                            {{ $t(/*顺延*/'wt.postpone') }}
                        </div>
                        <a-input-number v-model:value="form.day" :min="0" :precision="0" />
                        <div class="value-text">
                            {{ $t(/*天后生效*/'wt.effect_days') }}。
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
export default {
    name: 'TimeConfig',
    components: {

    },
    props: {},
    data() {
        return {
            reasonList: [
                {
                    key: 1,
                    name: '发货时间',
                    name_en: 'Delivery Time',
                    value: 1
                }
            ],
            form: {
                type: 1,
                day: undefined
            }
        };
    },
    watch: {

    },
    computed: {

    },
    mounted() {

    },
    methods: {
        handleSubmit() {
            let _this = this;
            this.$confirm({
                title: _this.$t(/*确定要提交吗*/'pop_up.sure_audit'),
                okText: _this.$t('def.sure'),
                okType: 'primary',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    console.log("提交");
                },
            });
        }
    }
};
</script>
<style lang="less" scoped>
#TimeConfig {
    .list-container {
        .time-form-container {
            width: 100%;
            height: calc(100vh - 57px);
            background-color: #FFFFFF;
            padding: 20px 40px;
            box-sizing: border-box;

            .form-item {
                display: flex;
                align-items: center;

                .form-key {
                    font-size: 14px;
                }

                .form-value {
                    font-size: 14px;
                    display: flex;
                    align-items: center;

                    .value-text {
                        margin: 0 10px;
                    }
                }
            }

            .btn-area {
                width: 100%;
                padding: 20px 100px;
                box-sizing: border-box;
            }
        }
    }
}
</style>
