<template>
    <div id="DistributorEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">
                {{ form.id ? $t('d.edit') : $t('d.new_distributor') }}
            </div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('d.code') /*编码*/ }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.code" :placeholder="$t('n.enter')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('d.name') /*分销商名称*/ }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('n.enter')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('d.short_name') /*简称*/ }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.short_name" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('d.pay_type') /*付款方式*/ }}:</div>
                    <div class="value">
                        <a-select v-model:value="form.pay_type" :placeholder="$t('def.select_payment_term')">
                            <a-select-option
                                v-for="(val, key) in PAY_TIME_LIST"
                                :key="val['key']"
                                :value="val['key']"
                                >{{ val[$i18n.locale] }}</a-select-option
                            >
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('p.currency') /*货币*/ }}:</div>
                    <div class="value">
                        <a-select v-model:value="form.currency" :disabled="isDisabled" :placeholder="$t('def.input')">
                            <a-select-option v-for="(val, key) in monetaryList" :key="key" :value="key">{{
                                key
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.type') /*类型*/ }}:</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.type">
                            <a-radio :value="TYPE.INTERNAL">{{ $t('d.internal') }}</a-radio>
                            <a-radio :value="TYPE.EXPORT">{{ $t('d.export') }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <!-- 公司名称 -->
                <div class="form-item">
                    <div class="key">{{ $t('d.company') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.company_name" :placeholder="$t('d.company_name')" />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('d.id') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.tax_no" :placeholder="$t('def.input')" />
                    </div>
                </div>

                <div class="form-item">
                    <div class="key">{{ $t('d.port') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.receive_port" :placeholder="$t('d.receipt')" />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('n.contact') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.contact" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('n.phone') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.phone" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.email') /*邮箱*/ }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.email" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.country') /*国家*/ }}:</div>
                    <div class="value">
                        <CountryCascader v-model:value="areaList" :def-area="defArea" />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('n.pda') /*启用PDA*/ }}:</div>
                    <div class="value">
                        <div class="value">
                            <a-radio-group v-model:value="form.flag_stock_change_use_pda">
                                <a-radio :value="Core.Const.FLAG.YES">{{ $t('i.yes') }}</a-radio>
                                <a-radio :value="Core.Const.FLAG.NO">{{ $t('i.no') }}</a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('d.sales_area') /*销售区域*/ }}:</div>
                    <div class="value">
                        <a-select v-model:value="form.sales_area_ids" mode="multiple" :placeholder="$t('def.select')">
                            <a-select-option v-for="(item, index) of salesList" :key="index" :value="item.id">{{
                                $i18n.locale === 'zh' ? item.name : item.name_en
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary">{{
                $t('def.sure')
            }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost="">{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import CountryCascader from '@/components/common/CountryCascader.vue';
import Const from '../../core/const';

export default {
    name: 'DistributorEdit',
    components: {
        CountryCascader,
    },
    props: {},
    data() {
        return {
            Core,
            TYPE: Core.Const.DISTRIBUTOR.TYPE,
            PAY_TIME_LIST: Const.DISTRIBUTOR.PAY_TIME_LIST,
            // 加载
            loading: false,
            detail: {},
            salesList: [], // 销售区域

            form: {
                id: '',
                code: '',
                name: '',
                short_name: '',
                company_name: '',
                receive_port: '',
                tax_no: '',
                contact: '',
                phone: '',
                email: '',
                type: undefined,
                sales_area_ids: undefined,
                pay_type: undefined,
                currency: undefined,
                flag_stock_change_use_pda: Const.FLAG.YES,
            },

            areaList: [],
            defArea: [],
            monetaryList: Core.Const.ITEM.MONETARY_TYPE_MAP,
            area: {
                continent: '',
                continent_en: '',
                country: '',
                country_en: '',
                country_code: '',
            },
        };
    },
    watch: {},
    computed: {
        // 计算货币是否显示
        isDisabled() {
            return this.monetaryList[this.form.currency] || null;
        },
    },

    mounted() {
        this.form.id = Number(this.$route.query.id) || 0;
        if (this.form.id) {
            this.getDistributorDetail();
        }
        this.getSalesAreaList();
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1);
                    break;
            }
        },
        getDistributorDetail() {
            this.loading = true;
            console.log('id', this.form.id);
            Core.Api.Distributor.detailUpdate({
                id: this.form.id,
            })
                .then(res => {
                    console.log('getDistributorDetail res', res);
                    let d = res.detail;
                    this.detail = d;
                    for (const key in this.form) {
                        this.form[key] = d[key];
                    }
                    for (const key in this.area) {
                        this.area[key] = d[key];
                    }
                    this.form.sales_area_ids = this.detail.sales_area_list
                        ? this.detail.sales_area_list.map(i => i.id)
                        : [];
                    this.defArea = [d.continent || '', d.country || ''];
                })
                .catch(err => {
                    console.log('getDistributorDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getSalesAreaList() {
            Core.Api.SalesArea.list({ page: 0 }).then(res => {
                this.salesList = res.list;
            });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form);
            let area = Core.Util.deepCopy(this.area);

            const requireList = [
                { key: 'code', msg: this.$t('def.enter') + '(' + this.$t('d.code') + ')' }, // 编码
                { key: 'name', msg: this.$t('def.enter') + '(' + this.$t('d.name') + ')' }, // 分销商名称
                { key: 'short_name', msg: this.$t('def.enter') + '(' + this.$t('d.short_name') + ')' }, // 简称
                { key: 'pay_type', msg: this.$t('def.enter') + '(' + this.$t('d.pay_type') + ')' }, // 付款方式
                { key: 'currency', msg: this.$t('def.enter') + '(' + this.$t('p.currency') + ')' }, // 货币
                { key: 'type', msg: this.$t('def.enter') + '(' + this.$t('n.type') + ')' }, // 类型
                { key: 'email', msg: this.$t('def.enter') + '(' + this.$t('n.email') + ')' }, // 邮箱
                { key: 'sales_area_ids', msg: this.$t('def.enter') + '(' + this.$t('d.sales_area') + ')' }, // 销售区域
            ];
            for (let index in requireList) {
                if (!form[requireList[index].key]) {
                    return this.$message.warning(requireList[index].msg);
                }
            }

            // 国家的校验
            if (this.areaList.length) {
                area = {
                    continent: this.areaList[0].name,
                    continent_en: this.areaList[0].name_en,
                    country: this.areaList[1].name,
                    country_en: this.areaList[1].name_en,
                    country_code: this.areaList[1].code,
                };
            } else {
                this.$message.warning(this.$t('def.enter') + '(' + this.$t('n.country') + ')');
            }

            form.sales_area_ids = form.sales_area_ids.join(',');

            Core.Api.Distributor.save({
                ...form,
                ...area,
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.routerChange('back');
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
    },
};
</script>

<style lang="less" scoped>
// #DistributorEdit {}
</style>
