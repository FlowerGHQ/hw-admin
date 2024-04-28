<template>
    <div id="InvoiceEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('target.edit') : $t('target.save') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title"></div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('target.time_field') }}：</div>
                    <div class="value" v-if="type !== 'detail'">
                        <a-date-picker 
                            @change="datePickerChange" 
                            v-model:value="time" 
                            valueFormat="YYYY-MM"
                            :show-time="defaultTime" 
                            picker="month" 
                            :placeholder="$t('def.select')"
                        />
                    </div>
                    <div class="value" v-else>
                        {{ $Util.timeFilter(time, 7) || '-' }}
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('target.section') }}：</div>
                    <div class="value" v-if="type !== 'detail'">
                        <a-select v-model:value="form.target_id" :placeholder="$t('def.select')">
                            <a-select-option v-for="item of Core.Const.TARGET.SECTION_TYPE" :key="item.key"
                                :value="item.value">
                                {{ item[$i18n.locale] }}
                            </a-select-option>
                        </a-select>
                    </div>
                    <div class="value" v-else>
                        {{ $Util.saleTargetSectionFilter(form.target_id) || '-' }}
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('target.sales_target') }}{{ $t('target.vehicle_unit') }}：</div>
                    <div class="value" v-if="type !== 'detail'">
                        <a-input v-model:value="form.target_sale_count" :placeholder="$t('def.input')" />
                    </div>
                    <div class="value" v-else>
                        {{ form.target_sale_count || '-' }}
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('target.amount_target') }}(￥)：</div>
                    <div class="value" v-if="type !== 'detail'">
                        <a-input v-model:value="form.target_sale_money" :placeholder="$t('def.input')" />
                    </div>
                    <div class="value" v-else>
                        {{ form.target_sale_money || '-' }}
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button v-if="type !== 'detail'" @click="handleSubmit" type="primary">{{ $t('def.sure') }}</a-button>
            <a-button @click="routerChange('list')" type="primary" ghost>{{ type === 'detail' ? $t('target.back') : $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import Core from '../../core';
export default {
    name: 'Detail',
    components: {
    },
    props: {},
    data() {
        return {
            Core,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            form: {
                id: '',
                year: undefined,
                month: undefined,
                target_id: undefined, // 部门
                target_sale_count: undefined, // 销售数量目标
                target_sale_money: undefined, // 销售金额目标
                target_type: Core.Const.TARGET.TARGET_TYPE_MAP.OPERATION_CENTER,
            },
            time: undefined,
            type: 'add',
        };
    },
    watch: {},
    computed: {

    },
    created() {
        this.form.id = Number(this.$route.query.id) || 0;
        this.type = this.$route.query.type || 'add';
        if (this.form.id && this.type !== 'add') {
            this.getTargetDetail();
        }
    },
    mounted() { },
    methods: {
        routerChange(type) {
            let routeUrl = '';
            switch (type) {
                case 'list': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/sale-target-management/index',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getTargetDetail() {
            Core.Api.SaleTarget.detail({
                id: this.form.id,
            })
                .then(res => {
                    console.log('getTargetDetail res', res);
                    this.form = res.detail;
                    if (this.type === 'detail') {
                        this.time = dayjs(`${String(res.detail.year)}-${String(res.detail.month)}`).unix();
                    } else {
                        this.time = Core.Util.timeFormat(dayjs(`${String(res.detail.year)}-${String(res.detail.month)}`).unix(), 'YYYY-MM')
                    }
                    this.form.target_sale_money = Core.Util.countFilter(res.detail.target_sale_money)
                })
                .catch(err => {
                    console.log('getTargetDetail err', err);
                })
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form);
            if (!form.year) {
                return this.$message.warning(this.$t('target.tip_time'));   
            }
            if (!form.month) {
                return this.$message.warning(this.$t('target.tip_time'));   
            }
            if (!form.target_id) {
                return this.$message.warning(this.$t('target.tip_department'));   
            }
            if (!form.target_sale_count) {
                return this.$message.warning(this.$t('target.tip_vehicle_target'));   
            }
            if (!form.target_sale_money) {
                return this.$message.warning(this.$t('target.tip_money_target'));   
            }
            form.target_sale_money = form.target_sale_money * 100
            Core.Api.SaleTarget.save(form)
                .then(res => {
                    console.log('handleSubmit res', res);
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.routerChange('list');
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
        datePickerChange(e) {
            let timeObj = this.extractYearAndMonth(e)
            this.form.year = timeObj.year
            this.form.month = timeObj.month
        },
        extractYearAndMonth(dateString) {
            let yearMonthArray = dateString.split('-');
            let year = parseInt(yearMonthArray[0]);
            let month = parseInt(yearMonthArray[1]);

            return {
                year: year,
                month: month
            };
        }
    },
};
</script>

<style lang="less" scoped>
.edit-container .form-block .form-item .key {
    width: 130px;
    margin-right: 20px;
}
</style>
