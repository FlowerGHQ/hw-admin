<template>
    <div id="InvoiceEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('in.edit') : $t('in.save') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('wa.warehouse') }}：</div>
                    <div class="value">
                        <a-select
                            v-model:value="form.warehouse_id"
                            :placeholder="$t('def.select')"
                            :disabled="!!isProd"
                        >
                            <a-select-option v-for="item of warehouseList" :key="item.id" :value="item.id">{{
                                item.name
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.type') }}：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.type">
                            <a-radio v-for="item in typeMap" :key="item.key" :value="item.key">{{
                                item[$i18n.locale]
                            }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('in.category') }}：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.target_type">
                            <a-radio v-for="item in targetMap" :key="item.key" :value="item.key">{{
                                item[$i18n.locale]
                            }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required" v-if="$auth('ADMIN')">
                    <div class="key">{{ $t('n.source') }}：</div>
                    <div class="value">
                        <a-select
                            v-model:value="form.source_type"
                            :placeholder="$t('def.select')"
                            @change="handleSelectChange"
                        >
                            <a-select-option v-for="item of sourceTypeAdminMap" :key="item.key" :value="item.key">{{
                                item[$i18n.locale]
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required" v-if="!$auth('ADMIN')">
                    <div class="key">{{ $t('n.source') }}：</div>
                    <div class="value">
                        <a-select
                            v-model:value="form.source_type"
                            :placeholder="$t('def.select')"
                            @change="handleSelectChange"
                        >
                            <a-select-option v-for="item of sourceTypeMap" :key="item.key" :value="item.key">{{
                                item[$i18n.locale]
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required" v-if="needUid">
                    <div class="key" v-if="$auth('ADMIN')">
                        {{
                            $i18n.locale === 'zh'
                                ? sourceTypeAdminMap[form.source_type].zh
                                : sourceTypeAdminMap[form.source_type].en
                        }}号：
                    </div>
                    <div class="key" v-if="!$auth('ADMIN')">{{ $t('in.order_number') }}：</div>
                    <div class="value">
                        <a-input
                            v-if="$auth('ADMIN')"
                            v-model:value="sourceUid"
                            :placeholder="`请输入相关的${(sourceTypeAdminMap[form.source_type].zh, $i18n.locale)}号`"
                            @blur="handleSelectBlur()"
                        >
                            <template #suffix>
                                <span v-if="isExist == 1"><i class="icon suffix i_confirm" /></span>
                                <span v-else-if="isExist == 2"><i class="icon suffix i_close_c" /></span>
                            </template>
                        </a-input>
                        <a-input
                            v-if="!$auth('ADMIN')"
                            v-model:value="sourceUid"
                            :placeholder="$t('def.input')"
                            @blur="handleSelectBlur()"
                        >
                            <template #suffix>
                                <span v-if="isExist == 1"><i class="icon suffix i_confirm" /></span>
                                <span v-else-if="isExist == 2"><i class="icon suffix i_close_c" /></span>
                            </template>
                        </a-input>
                    </div>
                </div>
                <!--            <div class="form-item required" v-if="form.source_type == SOURCE_TYPE.PURCHASE">
                <div class="key">到港时间</div>
                <div class="value">
                    <a-date-picker v-model:value="form.arrival_time" valueFormat='YYYY-MM-DD HH:mm:ss' :show-time="defaultTime" placeholder="请选择到港时间">
                        <template #suffixIcon><i class="icon i_calendar"/></template>
                    </a-date-picker>
                </div>
            </div>-->
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary" v-if="$auth('invoice.save')">{{ $t('def.sure') }}</a-button>
            <a-button @click="routerChange('list')" type="primary" ghost>{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import dayjs from 'dayjs';

const SOURCE_TYPE = Core.Const.STOCK_RECORD.SOURCE_TYPE;

export default {
    name: 'InvoiceEdit',
    components: {},
    props: {},
    data() {
        return {
            SOURCE_TYPE,
            // 加载
            loading: false,
            detail: {},

            warehouseList: [],
            typeMap: Core.Const.STOCK_RECORD.TYPE_MAP, // 类型
            COMMODITY_TYPE: Core.Const.STOCK_RECORD.COMMODITY_TYPE, //类目
            targetMap: Core.Const.STOCK_RECORD.COMMODITY_TYPE_MAP, //类目
            sourceTypeAdminMap: Core.Const.STOCK_RECORD.SOURCE_TYPE_ADMIN_MAP, //平台方的来源
            sourceTypeMap: Core.Const.STOCK_RECORD.SOURCE_TYPE_MAP, //经销商的来源
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            form: {
                id: '',
                type: '',
                target_type: Core.Const.STOCK_RECORD.COMMODITY_TYPE.ITEM,
                warehouse_id: undefined,
                source_type: undefined,
                source_id: '',
            },
            isProd: '',
            sourceUid: '',
            isExist: '',
        };
    },
    watch: {},
    computed: {
        needUid() {
            let val = Number(this.form.source_type);
            switch (val) {
                case SOURCE_TYPE.PRODUCTION:
                case SOURCE_TYPE.PURCHASE:
                case SOURCE_TYPE.AFTER_SALES:
                case SOURCE_TYPE.TRANSFER:
                case SOURCE_TYPE.REPAIR:
                case SOURCE_TYPE.MATERIAL_PURCHASE:
                case SOURCE_TYPE.WAREHOUSE_TRANSFER:
                    return true;
                default:
                    return false;
            }
        },
    },
    created() {
        let source = this.$route.query.source;
        if (source) {
            this.setInvoiceSource(JSON.parse(source));
        }

        this.form.id = Number(this.$route.query.id) || 0;
        if (this.form.id) {
            this.getInvoiceDetail();
        }

        this.getWarehouseList();
    },
    mounted() {},
    methods: {
        routerChange(type, item = {}) {
            console.log('routerChange item:', item);
            let routeUrl = '';
            switch (type) {
                case 'list': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/invoice-list',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/invoice-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list;
            });
        },
        getInvoiceDetail() {
            this.loading = true;
            Core.Api.Invoice.detail({
                id: this.form.id,
            })
                .then(res => {
                    console.log('getInvoiceDetail res', res);
                    this.detail = res.detail;
                })
                .catch(err => {
                    console.log('getInvoiceDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form);
            form.arrival_time = form.arrival_time ? dayjs(form.arrival_time).unix() : 0; // 日期转时间戳
            if (this.$auth('ADMIN')) {
                if (!form.warehouse_id) {
                    return this.$message.warning(this.$t('e.select_warehouse'));
                }
                if (!form.type) {
                    return this.$message.warning(this.$t('in.select_outbound_type'));
                }
                // if (!form.target_type) {
                //     return this.$message.warning('请选择类目')
                // }
                if (!form.source_type) {
                    return this.$message.warning(this.$t('in.select_source'));
                }
                if (this.needUid && !this.sourceUid) {
                    return this.$message.warning(`请输入相关的${this.sourceTypeAdminMap[form.source_type].text}单号`);
                }
                if (this.needUid && !form.source_id) {
                    return this.$message.warning(`请输入正确的${this.sourceTypeAdminMap[form.source_type].text}单号`);
                }
            }
            if (!this.$auth('ADMIN')) {
                if (!form.warehouse_id) {
                    return this.$message.warning(this.$t('def.enter'));
                }
                if (!form.type) {
                    return this.$message.warning(this.$t('def.enter'));
                }
                // if (!form.target_type) {
                //     return this.$message.warning(this.$t('def.enter'))
                // }
                if (!form.source_type) {
                    return this.$message.warning(this.$t('def.enter'));
                }
                if (this.needUid && !this.sourceUid) {
                    return this.$message.warning(this.$t('in.order_a'));
                }
                if (this.needUid && !form.source_id) {
                    return this.$message.warning(this.$t('in.order'));
                }
            }
            Core.Api.Invoice.save(form)
                .then(res => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.routerChange('detail', res.detail);
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
        // 验证输入的单号是否存在
        handleSelectBlur() {
            if (!this.sourceUid) {
                return (this.isExist = '');
            }
            let api = [];
            let key = 'uid';
            let parme = {};
            switch (Number(this.form.source_type)) {
                case SOURCE_TYPE.PRODUCTION:
                    api = ['ProductionOrder', 'detailByUid'];
                    break;
                case SOURCE_TYPE.PURCHASE:
                    api = ['Purchase', 'detailBySn'];
                    key = 'sn';
                    break;
                case SOURCE_TYPE.AFTER_SALES:
                    api = ['Purchase', 'detailBySn'];
                    key = 'sn';
                    break;
                case SOURCE_TYPE.TRANSFER:
                    api = ['Transfer', 'detailByUid'];
                    break;
                case SOURCE_TYPE.REPAIR:
                    api = ['Repair', 'detailByUid'];
                    break;
                case SOURCE_TYPE.MATERIAL_PURCHASE:
                    api = ['MaterialPurchase', 'detailByUid'];
                    key = 'sn';
                    break;
                case SOURCE_TYPE.WAREHOUSE_TRANSFER:
                    api = ['WarehouseTransfer', 'detailByUid'];
                    key = 'sn';
                    break;
            }
            parme[key] = this.sourceUid;
            Core.Api[api[0]]
                [api[1]](parme)
                .then(res => {
                    console.log('handleSelectBlur res', res);
                    if (
                        this.form.source_type == SOURCE_TYPE.MATERIAL_PURCHASE ||
                        this.form.source_type == SOURCE_TYPE.WAREHOUSE_TRANSFER
                    ) {
                        this.isExist = !res ? 2 : 1;
                        this.form.source_id = res.id;
                    } else {
                        this.isExist = res.detail == null ? 2 : 1;
                        this.form.source_id = res.detail.id;
                    }
                })
                .catch(err => {
                    console.log('handleSelectBlur err', err);
                })
                .finally(() => {});
        },
        setInvoiceSource(source) {
            console.log('setInvoiceSource source:', source);
            let form = source.form;
            for (const key in form) {
                this.form[key] = form[key];
            }
            this.form.warehouse_id = Number(this.form.warehouse_id) || '';
            this.sourceUid = source.sourceUid;
            if (this.form.source_type === SOURCE_TYPE.PRODUCTION) {
                this.isProd = true;
            }
        },
        handleSelectChange(val) {
            console.log('handleSelectChange', val);
            this.sourceUid = '';
            this.isExist = '';
        },
    },
};
</script>

<style lang="less" scoped>
// #InvoiceEdit {}
</style>
