<template>
    <div id="CRMBoEdit" class="edit-container" :class="$i18n.locale">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('crm_b.edit') : $t('crm_b.save') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content key150">
                <div class="form-item required">
                    <div class="key">{{ $t('crm_b.customer_name') }}：</div>
                    <div class="value">
                        <a-select
                            v-model:value="form.customer_id"
                            show-search
                            :placeholder="$t('n.enter')"
                            :default-active-first-option="false"
                            :show-arrow="false"
                            :filter-option="false"
                            :not-found-content="null"
                            @search="handleCustomerNameSearch"
                            @change="handleCustomerIdSearch"
                            allowClear
                            :disabled="customer_id !== '' || form.id !== ''"
                        >
                            <a-select-option v-for="item in itemOptions" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_c.phone') }}：</div>
                    <div class="value">
                        {{ CRMCustomer.phone }}
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_c.level') }}：</div>
                    <div class="value">
                        {{ $Util.CRMCustomerLevelFilter(CRMCustomer.level, $i18n.locale) || '-' }}
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_c.type') }}：</div>
                    <div class="value">
                        {{ $Util.CRMCustomerTypeFilter(CRMCustomer.type, $i18n.locale) || '-' }}
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_b.name') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item textarea">
                    <div class="key">{{ $t('crm_b.select_item') }}</div>
                    <div class="value">
                        <div class="form-item file-upload">
                            <ItemSelect
                                @select="handleAddFailItem"
                                :disabled-checked="tableData.map(i => i.item_id)"
                                :disabled="!!form.currency"
                                btn-type="primary"
                                :btn-text="$t('crm_b.interested_models')"
                                btn-class="fault-btn"
                            />
                            <a-select
                                v-model:value="form.currency"
                                style="width: 120px; margin-left: 20px"
                                @change="moneyChange"
                                :placeholder="$t('def.select')"
                            >
                                <a-select-option v-for="item of MoneyTypeList" :key="item.value">{{
                                    lang === 'zh' ? item.zh : item.en
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </div>
                </div>
                <div class="form-item table-container no-mg">
                    <a-table
                        :columns="tableColumns"
                        :data-source="tableData"
                        :scroll="{ x: true }"
                        :row-key="record => record.id"
                        :pagination="false"
                        size="small"
                    >
                        <template #headerCell="{ title }">
                            {{ $t(title) }}
                        </template>
                        <template #bodyCell="{ column, record, index, text }">
                            <template v-if="column.key === 'item'">
                                {{ text || '-' }}
                            </template>
                            <template v-if="column.dataIndex === 'price'">
                                {{ moneyT }} {{ text || '-' }}
                                <!--                                    <a-input-number v-model:value="record.price" style="width: 82px;"-->
                                <!--                                                      :min="0" :precision="2" placeholder="请输入"/>-->
                            </template>
                            <template v-if="column.dataIndex === 'discount_price'">
                                {{ moneyT
                                }}<a-input-number
                                    v-model:value="record.discount_price"
                                    :min="0"
                                    :precision="2"
                                    placeholder="0.00"
                                    :placeholder="$t('def.input')"
                                    @change="checkDiscount(record, 'discount_price')"
                                />
                                <!--                                 <a-input-number v-model:value="record.discount_price" style="width: 150px;"-->
                                <!--                                                :min="0.00"  :precision="2" placeholder="请输入" @change="checkDiscount(record, 'discount_price')"/>-->
                            </template>
                            <template v-if="column.key === 'amount'">
                                <a-input-number
                                    v-model:value="record.amount"
                                    style="width: 66px"
                                    :min="1"
                                    :precision="0"
                                    placeholder="请输入"
                                    @change="checkDiscount(record, 'amount')"
                                />
                                {{ $t('in.item') }}
                            </template>
                            <template v-if="column.key === 'discount'">
                                <a-input-number
                                    v-model:value="record.discount"
                                    :min="0"
                                    :precision="2"
                                    :max="100"
                                    placeholder="0.00"
                                    :placeholder="$t('def.input')"
                                    @change="checkDiscount(record, 'discount')"
                                />%
                            </template>

                            <template v-if="column.key === 'total_price'">
                                {{ moneyT }}
                                {{ $Util.countFilter((record.price * record.amount * record.discount) / 100, 1) }}
                            </template>

                            <template v-if="column.dataIndex === 'operation'">
                                <a-button type="link" class="danger" @click="handleFailItemDelete(index)"
                                    ><i class="icon i_delete" />{{ $t('def.remove') }}
                                </a-button>
                            </template>
                        </template>
                    </a-table>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_b.money') }}：</div>
                    <div class="value form-item-value">
                        <a-input-number
                            v-model:value="form.money"
                            :min="0"
                            :precision="2"
                            placeholder="0.00"
                            :disabled="moneyDisabled"
                            :placeholder="$t('def.input')"
                        />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_b.status') }}：</div>
                    <div class="value">
                        <a-select v-model:value="form.status" :placeholder="$t('def.input')">
                            <a-select-option v-for="(item, index) of groupStatusTableData" :key="index" :value="index">
                                {{ lang === 'zh' ? item.zh : item.en }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_b.estimated_deal_time') }}：</div>
                    <div class="value">
                        <a-date-picker
                            v-model:value="form.estimated_deal_time"
                            valueFormat="YYYY-MM-DD"
                            :placeholder="$t('def.input')"
                        />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_b.source') }}：</div>
                    <div class="value">
                        <a-select v-model:value="form.source" :placeholder="$t('def.input')">
                            <a-select-option v-for="item of CRM_SOURCE_MAP" :key="item.value" :value="item.value">
                                {{ lang === 'zh' ? item.zh : item.en }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item textarea">
                    <div class="key">{{ $t('crm_b.remark') }}</div>
                    <div class="value">
                        <a-textarea
                            v-model:value="form.remark"
                            :placeholder="$t('def.input')"
                            :auto-size="{ minRows: 2, maxRows: 6 }"
                            :maxlength="500"
                        />
                        <span class="content-length">{{ form.remark }}/500</span>
                    </div>
                </div>
                <div class="form-item textarea">
                    <div class="key">{{ $t('sl.name') }}</div>
                    <div class="value">
                        <LabelSelect
                            :btnText="$t('sl.add')"
                            :category="Core.Const.CRM_LABEL.CATEGORY.BO"
                            add-customer-btn="true"
                            @select="handleAddLabelShow"
                            :disabled-checked="labelIdList"
                        />
                        <br />
                        <a-tag
                            v-for="(label, index) in labelList"
                            color="blue"
                            closable
                            @close="handleDeleteLabel(index)"
                            class="customer-tag"
                        >
                            <template #closeIcon><i class="icon i_m_error"></i></template>
                            {{ lang === 'zh' ? label.label : label.label_en }}
                        </a-tag>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit('order')" type="primary">{{
                $t('crm_o.create_order')
            }}</a-button>
            <a-button @click="handleSubmit('back')" type="primary">{{
                $t('def.sure')
            }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost="">{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';
import dayjs from 'dayjs';
import LabelSelect from '@/components/crm/popup-btn/LabelSelect.vue';

export default {
    name: 'CustomerEdit',
    components: { ItemSelect, LabelSelect },
    props: {},
    data() {
        return {
            Core,
            loginType: Core.Data.getLoginType(),
            CRM_SOURCE_MAP: Core.Const.CRM_BO.SOURCE_MAP,

            // 加载
            loading: false,
            detail: {},
            customer_id: '',
            form: {
                id: '',
                currency: undefined,
                customer_id: '',
                customer_name: '',
                name: '',
                money: '',
                bo_status_group_id: 1,
                status: '',
                estimated_deal_time: '',
                source: '',
                remark: '',
            },
            CRMCustomer: {},
            tableData: [],
            groupStatusTableData: [],
            moneyDisabled: false,
            itemOptions: [],
            labelList: [],
            labelIdList: [],
            MoneyTypeList: Core.Const.MONEYTYPE.TYPE_MAP,
        };
    },
    watch: {
        tableData: {
            deep: true,
            immediate: true,
            handler(n) {
                this.moneyCheck();
                // this.imgs = n
            },
        },
    },
    computed: {
        lang() {
            return this.$store.state.lang;
        },
        moneyT() {
            switch (this.form.currency) {
                case 'usd':
                    return '$';
                    break;
                case 'eur':
                    return '€';
                    break;
            }
        },
        tableColumns() {
            let columns = [
                { title: 'n.name', dataIndex: 'name', key: 'item' },
                { title: 'i.code', dataIndex: 'code', key: 'item' },
                { title: 'i.unit_price', dataIndex: 'price' },
                { title: 'crm_b.discount_price', dataIndex: 'discount_price' },
                { title: 'i.amount', key: 'amount' },
                { title: 'crm_b.discount', key: 'discount' },
                { title: 'i.total_price', key: 'total_price' },
                { title: 'def.operate', dataIndex: 'operation' },
            ];
            return columns;
        },
    },
    mounted() {
        this.form.id = Number(this.$route.query.id) || '';
        this.customer_id = Number(this.$route.query.customer_id) || '';
        this.form.customer_id = Number(this.$route.query.customer_id) || undefined;
        this.handleCustomerNameSearch();
        if (this.form.id) {
            this.getLabelList();
            this.getBoDetail();
            this.getBoDetailItemList();
        } else if (this.form.customer_id) {
            this.handleCustomerIdSearch('init');
        }
        this.getGroupStatusDetail();
    },
    methods: {
        moneyChange() {
            //货币切换
            Core.Api.MoneyChange.switch({
                currency: this.form.currency,
                item_bind_list: this.tableData,
            })
                .then(res => {
                    res.list.forEach(it => {
                        it.name = it.item_name;
                        it.code = it.item_code;
                        it.price = it.price / 100;
                        it.discount_price = it.discount_price / 100;
                    });
                    this.tableData = res.list;
                    console.log(this.form.currency, this.tableData);
                })
                .catch(err => {
                    console.log(err);
                });
        },
        routerChange(type, item) {
            switch (type) {
                case 'back': // 详情
                    this.$router.go(-1);
                    break;
                case 'order':
                    let routeUrl = this.$router.resolve({
                        path: '/crm-order/order-edit',
                        query: {
                            bo_id: this.form.id,
                        },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getBoDetail() {
            this.loading = true;
            Core.Api.CRMBo.detail({
                id: this.form.id,
            })
                .then(res => {
                    console.log('getCustomerDetail res', res);
                    let d = res.detail;
                    this.detail = d;
                    this.detail.estimated_deal_time = this.detail.estimated_deal_time
                        ? dayjs.unix(this.detail.estimated_deal_time).format('YYYY-MM-DD')
                        : undefined;
                    this.handleCustomerNameSearch(this.detail.customer_name);

                    for (const key in this.form) {
                        if (d[key] !== 0) {
                            this.form[key] = d[key];
                        } else {
                            this.form[key] = undefined;
                        }
                    }
                    this.form.money = this.$Util.countFilter(this.form.money);
                    this.handleCustomerIdSearch();
                })
                .catch(err => {
                    console.log('getCustomerDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getBoDetailItemList() {
            this.loading = true;
            Core.Api.CRMItemBind.list({
                source_id: this.form.id,
                source_type: Core.Const.CRM_ITEM_BIND.SOURCE_TYPE.BO,
            })
                .then(res => {
                    res.list.forEach(it => {
                        it.price = Core.Util.countFilter(it.price);
                        it.discount_price = (it.price * it.discount) / 100;
                    });
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getCustomerDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleSubmit(router = 'back') {
            let form = Core.Util.deepCopy(this.form);
            if (!form.customer_id) {
                return this.$message.warning(this.$t('n.enter') + ':' + this.$t('crm_b.customer_name'));
            }
            if (!form.name) {
                return this.$message.warning(this.$t('n.enter') + ':' + this.$t('crm_b.name'));
            }
            if (!form.money) {
                return this.$message.warning(this.$t('n.choose') + ':' + this.$t('crm_b.money'));
            }
            if (form.status === '' || form.status === undefined) {
                return this.$message.warning(this.$t('n.enter') + ':' + this.$t('crm_b.status'));
            }
            if (!form.estimated_deal_time) {
                return this.$message.warning(this.$t('n.enter') + ':' + this.$t('crm_b.estimated_deal_time'));
            }

            form.estimated_deal_time = form.estimated_deal_time ? dayjs(form.estimated_deal_time).unix() : 0; // 日期转时间戳

            console.log('form', this.form);
            // if (!Core.Util.isEmptyObj(this.defAddr)) {
            //     console.log('areaMap2222',this.defAddr)
            //     area.country = this.defAddr.country
            //     area.city = this.defAddr.city
            //     if (this.defAddr.province) {
            //         area.province = this.defAddr.province
            //     }
            //     if (this.defAddr.county) {
            //         area.county = this.defAddr.county
            //     }
            //     console.log('area1234556',area)
            // }
            form.item_bind_list = this.$Util.deepCopy(this.tableData);
            form.item_bind_list.forEach(it => {
                it.price = it.price * 100;
            });
            form.money = this.form.money * 100;

            Core.Api.CRMBo.save({
                ...form,
                money: this.form.money * 100,
                // item_bind_list: this.tableData,
                label_id_list: this.labelIdList,
            })
                .then(res => {
                    this.form.id = res.detail.id;
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.routerChange(router);
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },

        // 添加商品
        async handleAddFailItem(ids, items) {
            for (let i = 0; i < items.length; i++) {
                const element = items[i];
                switch (this.form.currency) {
                    case 'usd':
                        element.price = element.fob_usd / 100;
                        break;
                    case 'eur':
                        element.price = element.fob_eur / 100;
                        break;
                }
                element.item_id = element.id;
                element.id = 0;
                element.amount = 1;
                element.discount = 100;
                element.discount_price = element.price;
                element.total_price = (element.price / 100) * element.amount;
            }
            console.log('handleAddFailItem items:', items);
            this.tableData.push(...items);
        },
        // 移除商品
        handleFailItemDelete(index, name) {
            this.tableData.splice(index, 1);
        },
        getGroupStatusDetail() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.CRMBoStatusGroup.detail({
                id: 1,
            })
                .then(res => {
                    this.groupStatusTableData = JSON.parse(res.detail.status_list);
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        moneyCheck() {
            if (this.tableData.length > 0) {
                let total_price = 0;
                this.tableData.forEach(record => {
                    total_price += (record.price * record.amount * record.discount) / 100;
                });
                this.form.money = total_price;
                this.moneyDisabled = true;
            } else {
                this.moneyDisabled = false;
            }
        },
        handleCustomerNameSearch(name) {
            Core.Api.CRMCustomer.list({ name: name, status: Core.Const.CRM_CUSTOMER.STATUS.CUSTOMER }).then(res => {
                this.itemOptions = res.list;
            });
        },
        handleCustomerIdSearch(type) {
            Core.Api.CRMCustomer.detail({ id: this.form.customer_id }).then(res => {
                this.CRMCustomer = res.detail;
                console.log('res', res);
                if (type === 'init') {
                    this.handleCustomerNameSearch(res.name);
                }
            });
        },
        checkDiscount(item, type) {
            switch (type) {
                case 'discount_price':
                    item.discount = ((1.0 * item.discount_price) / item.price) * 100;
                    break;
                case 'amount':
                    break;
                case 'discount':
                    item.discount_price = (1.0 * item.price * item.discount) / 100;
                    break;
                case 'total_price':
                    item.discount = ((1.0 * item.total_price) / item.price / item.amount) * 100;
                    item.discount_price = (1.0 * item.price * item.discount) / 100;
                    break;
            }
            item.total_price = (1.0 * item.amount * item.discount * item.price) / 100;
        },
        handleAddLabelShow(ids, items) {
            console.log('items', items);
            let labelList = Core.Util.deepCopy(this.labelList);
            items.forEach(it => {
                labelList.push(it);
                this.labelIdList.push(it.id);
            });
            this.labelList = labelList;

            console.log('items', this.labelList);
        },
        // 添加商品
        handleDeleteLabel(index) {
            this.labelIdList.splice(index, 1);
            this.labelList.splice(index, 1);
        },
        getLabelList() {
            Core.Api.CRMLabelBind.list({
                target_id: this.form.id,
                target_type: Core.Const.CRM_LABEL.CATEGORY.BO,
            }).then(res => {
                let labelList = [];
                res.list.forEach(it => {
                    labelList.push({
                        id: it.label_id,
                        name: it.label,
                        name_en: it.label_en,
                    });
                    this.labelIdList.push(it.id);
                });
                this.labelList = labelList;
            });
        },
    },
};
</script>

<style lang="less">
#CRMBoEdit {
    .icon {
        font-size: 12px;
    }
    .customer-tag {
        margin-top: 10px;
    }
    .form-item {
        .key {
            width: 96px;
        }
        .value {
            width: calc(100% - 96px);
        }
    }

    .fault-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 13px;

        .fault-name {
            font-weight: 500;
            font-size: 12px;
            line-height: 22px;
            color: rgba(0, 0, 0, 0.85);
        }

        .fault-btn {
            border-radius: 2px;
            height: 32px;
        }
    }
}
</style>
