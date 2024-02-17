<template>
    <div id="TimeConfig">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t(/*生效时间*/ 'wt.effective_time') }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="handleSubmit">{{ $t(/*保存*/ 'def.save') }}</a-button>
                </div>
            </div>
            <div class="time-form-container">
                <div class="form-item">
                    <div class="form-key">{{ $t(/*生效时间*/ 'wt.effective_time') }}：</div>
                    <div class="form-value">
                        <div class="value-text">
                            {{ $t(/*根据*/ 'wt.reason') }}
                        </div>
                        <a-select v-model:value="form.effect_time_type" :placeholder="$t('def.select')">
                            <a-select-option v-for="item of reasonList" :key="item.key" :value="item.value">{{
                                $i18n.locale === 'zh' ? item.name : item.name_en
                            }}</a-select-option>
                        </a-select>
                        <div class="value-text">
                            {{ $t(/*顺延*/ 'wt.postpone') }}
                        </div>
                        <a-input-number v-model:value="form.effect_time_day" :min="0" :precision="0" />
                        <div class="value-text">{{ $t(/*天后生效*/ 'wt.effect_days') }}。</div>
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
    components: {},
    props: {},
    data() {
        return {
            reasonList: [
                {
                    key: 1,
                    name: '发货时间',
                    name_en: 'Delivery Time',
                    value: 1,
                },
            ],
            form: {
                effect_time_type: 1,
                effect_time_day: undefined,
            },
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getDetail();
    },
    methods: {
        handleSubmit() {
            let _this = this;
            this.$confirm({
                title: _this.$t(/*确定要提交吗*/ 'pop_up.sure_audit'),
                okText: _this.$t('def.sure'),
                okType: 'primary',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    let params = Core.Util.deepCopy(_this.form);
                    Core.Api.Warranty.saveTime({
                        ...params,
                    })
                        .then(res => {
                            console.log('handleSubmit res', res);
                            _this.$message.success(_this.$t('pop_up.save_success'));
                            _this.getDetail();
                        })
                        .catch(err => {
                            console.log('handleSubmit err', err);
                        });
                },
            });
        },
        // 详情
        getDetail() {
            Core.Api.Warranty.getTimeDetail({
                effect_time_type: this.form.effect_time_type,
            })
                .then(res => {
                    console.log('getDetail res', res);
                    this.form.effect_time_day = res.effect_time_day;
                })
                .catch(err => {
                    console.log('getDetail err', err);
                });
        },
    },
};
</script>
<style lang="less" scoped>
#TimeConfig {
    .list-container {
        .time-form-container {
            width: 100%;
            height: calc(100vh - 57px);
            background-color: #ffffff;
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
