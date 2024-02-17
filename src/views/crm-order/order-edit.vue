<template>
    <div id="OrderEdit" class="edit-container" :class="$i18n.locale">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('crm_o.edit') : $t('crm_o.save') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.belone_customer') }}：</div>
                    <!-- 所属客户 -->
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
                            @change="handleCustomerChange"
                            allowClear
                            :disabled="bo_id !== '' || customer_id !== '' || form.id !== ''"
                        >
                            <a-select-option v-for="item in itemOptions" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_b.bo') }}：</div>
                    <!-- 商机 -->
                    <div class="value">
                        <a-select
                            v-model:value="form.bo_id"
                            show-search
                            :placeholder="$t('n.enter')"
                            :default-active-first-option="false"
                            :show-arrow="false"
                            :filter-option="false"
                            :not-found-content="null"
                            @change="getDetailItemList(form.bo_id, Core.Const.CRM_ITEM_BIND.SOURCE_TYPE.BO)"
                            @search="handleBoNameSearch"
                            :disabled="bo_id !== '' || customer_id !== '' || form.id !== ''"
                            allowClear
                        >
                            <a-select-option v-for="item in boOptions" :key="item.id" :value="item.id">
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
                    <div class="key">{{ $t('crm_o.name') }}：</div>
                    <!-- 合同名称 -->
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.signing_date') }}：</div>
                    <!-- 签约日期 -->
                    <div class="value">
                        <a-date-picker
                            v-model:value="form.date"
                            valueFormat="YYYY-MM-DD"
                            :placeholder="$t('crm_def.select_date')"
                        />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.seller_signatory') }}：</div>
                    <!-- 我方签约人 -->
                    <div class="value">
                        <a-input v-model:value="form.seller_signatory" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.contract_type') }}：</div>
                    <!-- 合同类型 -->
                    <div class="value">
                        <a-select v-model:value="form.type" :placeholder="$t('def.select')">
                            <a-select-option v-for="item of CRM_ORDER_TYPE" :key="item.value" :value="item.value">{{
                                lang === 'zh' ? item.zh : item.en
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.buyer_signatory') }}：</div>
                    <!-- 客户方签约人 -->
                    <div class="value">
                        <a-input v-model:value="form.buyer_signatory" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_o.remark') }}：</div>
                    <!-- 备注 -->
                    <div class="value">
                        <a-textarea
                            v-model:value="form.remark"
                            :placeholder="$t('def.input')"
                            :auto-size="{ minRows: 2, maxRows: 6 }"
                            :maxlength="500"
                        />
                    </div>
                </div>
                <!-- 附件上传及列表 -->
                <UploadFileWithList
                    :target_id="form.id"
                    :target_type="CRM_ORDER_FILE"
                    @getUploadData="getUploadData"
                    ref="UploadFile"
                />
            </div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('crm_o.sales_info') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item textarea block">
                    <!-- <div class="key">{{ $t('r.remark') }}</div> -->

                    <div class="fault-title">
                        <ItemSelect
                            @select="handleAddFailItem"
                            :disabled-checked="tableData.map(i => i.item_id)"
                            btn-type="primary"
                            :btn-text="$t('i.add')"
                            btn-class="fault-btn"
                            :disabled="!!form.currency"
                            v-if="$auth('repair-order.save')"
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
                                {{ moneyT }}
                                <a-input-number
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
                                    :max="100"
                                    :precision="2"
                                    placeholder="0.00"
                                    :placeholder="$t('def.input')"
                                    @change="checkDiscount(record, 'discount')"
                                />%
                            </template>

                            <template v-if="column.key === 'total_price'">
                                <!--                                $ <a-input-number v-model:value="record.total_price" style="width: 150px;"-->
                                <!--                                                :min="0" :precision="2" placeholder="请输入" @change="checkDiscount(record, 'total_price')"/>-->
                                {{ moneyT }}
                                {{ $Util.countFilter((record.price * record.amount * record.discount) / 100, 1) }}
                            </template>

                            <template v-if="column.dataIndex === 'operation'">
                                <a-button
                                    type="link"
                                    class="danger"
                                    @click="handleFailItemDelete(index)"
                                    v-if="$auth('crm-bo.save')"
                                    ><i class="icon i_delete" />{{ $t('def.remove') }}
                                </a-button>
                            </template>
                        </template>
                    </a-table>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_o.total_amount') }}：</div>
                    <div class="value">
                        <a-input-number
                            v-model:value="form.total_price"
                            :min="0"
                            :precision="2"
                            placeholder="0.00"
                            :disabled="moneyDisabled"
                            :placeholder="$t('def.input')"
                        />
                    </div>
                </div>
                <!-- <div class="form-item"> -->
                <!--     <div class="key">{{ $t('crm_o.whole_discount') }}：</div> -->
                <!--     <div class="value"> -->
                <!--         <a-input v-model:value="form.discount_rate" :placeholder="$t('def.input')"/> -->
                <!--     </div> -->
                <!-- </div> -->
                <div class="form-item">
                    <div class="key">{{ $t('crm_o.other_fee') }}：</div>
                    <div class="value">
                        <a-input-number
                            v-model:value="form.other_cost"
                            :min="0"
                            :precision="2"
                            placeholder="0.00"
                            :placeholder="$t('def.input')"
                        />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_o.discounted') }}：</div>
                    <div class="value">
                        <a-input-number
                            v-model:value="form.discount_amount"
                            :min="0"
                            :precision="2"
                            placeholder="0.00"
                            :placeholder="$t('def.input')"
                        />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.money') }}：</div>
                    <div class="value">
                        <!--  disabled -->
                        <a-input-number
                            v-model:value="contractAmount"
                            :min="0"
                            :precision="2"
                            placeholder="0.00"
                            :disabled="true"
                            :placeholder="$t('def.input')"
                        />
                    </div>
                </div>
                <div class="form-item required">
                    <div>{{ $t('crm_o.money_tip') }}</div>
                </div>

                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.approval_process') }}：</div>
                    <!--  disabled -->
                    <AuditUser
                        :def-audit-user-list="auditUserList"
                        :group-id="detail.group_id"
                        @list="handleAuditUserIdList"
                        :btn-text="$t('crm_o.add_reviewer')"
                    ></AuditUser>
                </div>
                <div class="form-item textarea">
                    <div class="key">{{ $t('sl.name') }}</div>
                    <div class="value">
                        <LabelSelect
                            :btnText="$t('sl.add')"
                            :category="Core.Const.CRM_LABEL.CATEGORY.ORDER"
                            color="blue"
                            add-customer-btn="true"
                            @select="handleAddLabelShow"
                            :disabled-checked="labelIdList"
                        />
                        <br />
                        <a-tag
                            v-for="(label, index) in labelList"
                            :key="index"
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
            <a-button @click="handleSubmit" type="primary" v-if="$auth('crm-order.save')">{{
                $t('def.sure')
            }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost="">{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';

import ChinaAddressCascader from '@/components/common/ChinaAddressCascader.vue';
import CountryCascader from '@/components/common/CountryCascader.vue';
import AddressCascader from '@/components/common/AddressCascader.vue';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';
import ItemTable from '@/components/table/ItemTable.vue';
import UploadFileWithList from '@/components/common/UploadFileWithList.vue';
import AuditUser from '@/components/crm/popup-btn/AuditUser.vue';
import LabelSelect from '@/components/crm/popup-btn/LabelSelect.vue';

import dayjs from 'dayjs';
import { UserOutlined } from '@ant-design/icons-vue';

export default {
    name: 'OrderEdit',
    components: {
        ChinaAddressCascader,
        CountryCascader,
        AddressCascader,
        ItemSelect,
        ItemTable,
        UploadFileWithList,
        UserOutlined,
        AuditUser,
        LabelSelect,
    },
    props: {},
    data() {
        return {
            Core,
            CRM_ORDER_FILE: Core.Const.ATTACHMENT.TARGET_TYPE.CRM_ORDER_FILE,
            // 加载
            loading: false,
            detail: {},
            form: {
                currency: undefined,
                bo_id: '',
                customer_id: '',
                name: '',
                date: '',
                seller_signatory: '',
                type: '',
                buyer_signatory: '',
                other_cost: '',
                discount_amount: '',

                remark: '',
                target_id: '',
                target_type: '',
                item_bind_list: [],
                attachment_list: [],
            },
            // defAddr: [],
            // areaList: [],
            // defArea: [],
            area: {
                country: '',
                country_en: '',
                province: '',
                province_en: '',
                city: '',
                city_en: '',
                county: '',
                county_en: '',
            },
            // areaMap: {},
            countryShow: false,

            tableData: [],
            CRM_ORDER_TYPE: Core.Const.CRM_ORDER.TYPE_MAP,
            itemOptions: [],
            boOptions: [],
            bo_id: '',
            customer_id: '',
            CRMCustomer: {},
            auditUserList: [],
            moneyDisabled: 'false',
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
            let tableColumns = [
                { title: 'n.name', dataIndex: 'name', key: 'item' },
                { title: 'i.code', dataIndex: 'code', key: 'item' },
                { title: 'i.unit_price', dataIndex: 'price' },
                { title: 'crm_b.discount_price', dataIndex: 'discount_price' },
                { title: 'i.amount', key: 'amount' },
                { title: 'crm_b.discount', key: 'discount' },
                { title: 'i.total_price', key: 'total_price' },
                { title: 'def.operate', dataIndex: 'operation' },
            ];
            return tableColumns;
        },
        contractAmount() {
            let amount =
                Number(this.form.total_price) + Number(this.form.other_cost) - Number(this.form.discount_amount);
            return amount || '';
        },
        // user_type() {
        //     return Core.Data.getUserType()
        // },
    },
    mounted() {
        this.form.id = Number(this.$route.query.id) || '';
        this.customer_id = Number(this.$route.query.customer_id) || '';
        this.form.customer_id = Number(this.$route.query.customer_id) || undefined;
        this.bo_id = Number(this.$route.query.bo_id) || '';
        this.form.bo_id = Number(this.$route.query.bo_id) || undefined;
        this.handleCustomerNameSearch();
        if (this.form.id) {
            this.getLabelList();
            this.getOrderDetail();
            this.getDetailItemList(this.form.id, Core.Const.CRM_ITEM_BIND.SOURCE_TYPE.ORDER);
        } else if (this.form.customer_id) {
            this.handleCustomerIdSearch('init');
        } else if (this.form.bo_id) {
            this.handleBoIdSearch();
            this.getDetailItemList(this.form.bo_id, Core.Const.CRM_ITEM_BIND.SOURCE_TYPE.BO);
        }
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
                        it.price = Core.Util.countFilter(it.price);
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
                    let routeUrl = this.$router.resolve({
                        path: '/crm-order/order-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getOrderDetail() {
            this.loading = true;
            Core.Api.CRMOrder.detail({
                id: this.form.id,
            })
                .then(({ detail }) => {
                    console.log('getOrderDetail res.detail', detail);
                    this.detail = detail;
                    this.detail.date = detail.date ? dayjs.unix(detail.date).format('YYYY-MM-DD') : undefined;
                    // for (const key in this.form) {
                    //     this.form[key] = this.detail[key]
                    // }
                    for (const key in this.form) {
                        if (detail[key] !== 0) {
                            this.form[key] = this.detail[key];
                        } else {
                            this.form[key] = undefined;
                        }
                    }

                    this.form.total_price = this.$Util.countFilter(this.form.total_price);
                    this.form.other_cost = this.$Util.countFilter(this.form.other_cost);
                    this.form.discount_amount = this.$Util.countFilter(this.form.discount_amount);

                    if (this.detail.target_type === Core.Const.CRM_ORDER.TARGET_TYPE.BO) {
                        this.form.bo_id = this.detail.target_id;
                        this.handleBoIdSearch();
                    }
                    let auditUserList = [];
                    detail.audit_user_list.forEach(item => {
                        let param = {
                            id: item.audit_user_id,
                            name: item.audit_user_name,
                        };
                        auditUserList.push(param);
                    });
                    this.auditUserList = auditUserList;
                    this.handleCustomerIdSearch('init');

                    // this.defAddr = [d.province, d.city, d.county]
                    // this.defArea = [d.continent || '', d.country || '']
                })
                .catch(err => {
                    console.log('getOrderDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // 提交
        handleSubmit() {
            this.$refs.UploadFile.getUploadData(); // 子组件拿值
            let form = Core.Util.deepCopy(this.form);
            let area = Core.Util.deepCopy(this.area);
            if (!form.customer_id) {
                return this.$message.warning(this.$t('n.enter') + ':' + this.$t('crm_o.belone_customer'));
            }
            if (!form.name) {
                return this.$message.warning(this.$t('n.enter') + ':' + this.$t('crm_o.name'));
            }
            if (!form.date) {
                return this.$message.warning(this.$t('n.choose') + ':' + this.$t('crm_o.signing_date'));
            }
            if (!form.seller_signatory) {
                return this.$message.warning(this.$t('n.enter') + ':' + this.$t('crm_o.seller_signatory'));
            }
            if (!form.type) {
                return this.$message.warning(this.$t('n.enter') + ':' + this.$t('crm_o.contract_type'));
            }
            if (!form.buyer_signatory) {
                return this.$message.warning(this.$t('n.enter') + ':' + this.$t('crm_o.buyer_signatory'));
            }
            // if (!form.remark) {
            //    return this.$message.warning(this.$t('n.enter')+":"+this.$t('crm_o.remark'))
            // }
            // if (!form.item_bind_list) {
            //     return this.$message.warning(this.$t('def.select'))
            // }
            // if (!form.total_price) {
            //     return this.$message.warning(this.$t('def.input'))
            // }
            // if (!form.discount_rate) {
            //     return this.$message.warning(this.$t('def.input'))
            // }
            // if (!form.other_cost) {
            //     return this.$message.warning(this.$t('def.input'))
            // }
            // if (!form.discount_amount) {
            //     return this.$message.warning(this.$t('def.input'))
            // }
            form.item_bind_list = this.$Util.deepCopy(this.tableData);
            form.item_bind_list.forEach(it => {
                it.price = it.price * 100;
            });
            form.total_price = this.form.total_price * 100;
            form.other_cost = this.form.other_cost * 100;
            form.discount_amount = this.form.discount_amount * 100;
            form.money = this.contractAmount * 100;
            form.date = form.date ? dayjs(form.date).unix() : 0; // 日期转时间戳

            if (this.form.bo_id !== '') {
                form.target_id = this.form.bo_id;
                form.target_type = Core.Const.CRM_ORDER.TARGET_TYPE.BO;
            } else {
                form.target_id = this.form.customer_id;
                form.target_type = Core.Const.CRM_ORDER.TARGET_TYPE.CUSTOMER;
            }
            let audit_user_id_list = [];
            this.auditUserList.forEach(it => {
                audit_user_id_list.push(it.id);
            });
            if (audit_user_id_list.length === 0) {
                return this.$message.warning(this.$t('def.enter'));
            }
            console.log('form', form);
            Core.Api.CRMOrder.save({
                ...form,
                currency: this.form.currency,
                money: this.contractAmount * 100,
                audit_user_id_list: audit_user_id_list,
                label_id_list: this.labelIdList,
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.routerChange('back');
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
        getUploadData(uploadData) {
            this.form.attachment_list = uploadData;
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
                element.remark = '';
            }
            console.log('handleAddFailItem items:', items);
            this.tableData.push(...items);
        },
        // 移除商品
        handleFailItemDelete(index, name) {
            this.tableData.splice(index, 1);
        },
        handleCustomerNameSearch(name) {
            Core.Api.CRMCustomer.list({ name: name, status: Core.Const.CRM_CUSTOMER.STATUS.CUSTOMER }).then(res => {
                this.itemOptions = res.list;
            });
        },
        handleCustomerChange() {
            this.auditUserList = [];
            this.handleCustomerIdSearch();
            this.boOptions = [];
            this.form.bo_id = '';
        },
        handleCustomerIdSearch(type) {
            Core.Api.CRMCustomer.detail({ id: this.form.customer_id }).then(res => {
                this.CRMCustomer = res.detail;
                this.detail.group_id = this.CRMCustomer.group_id;
                console.log('group_id', this.CRMCustomer.group_id);
                // this.handleCustomerNameSearch(res.name)
                if (type === 'init') {
                    this.handleCustomerNameSearch(res.name);
                }
            });
        },
        handleBoNameSearch() {
            Core.Api.CRMBo.list({ name: name, customer_id: this.form.customer_id }).then(res => {
                this.boOptions = res.list;
            });
            this.handleCustomerIdSearch();
        },
        handleBoIdSearch() {
            if (this.form.bo_id > 0) {
                Core.Api.CRMBo.detail({ id: this.form.bo_id }).then(res => {
                    console.log('res.customer_id', res.detail.customer_id);
                    this.form.customer_id = res.detail.customer_id;
                    let customer_name = res.detail.customer_name;
                    this.handleCustomerNameSearch(customer_name);
                    this.handleBoNameSearch(res.detail.name);
                    this.handleCustomerIdSearch();
                });
            }
        },
        getDetailItemList(source_id, source_type) {
            this.auditUserList = [];
            this.loading = true;
            Core.Api.CRMItemBind.list({
                source_id: source_id,
                source_type: source_type,
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
        handleAuditUserIdList(auditUserList) {
            console.log('auditUserList11111', auditUserList);
            if (auditUserList !== null) {
                this.auditUserList = auditUserList;
            } else {
                this.auditUserList = [];
            }
        },
        moneyCheck() {
            if (this.tableData.length > 0) {
                let total_price = 0;
                this.tableData.forEach(record => {
                    total_price += (record.price * record.amount * record.discount) / 100;
                });
                this.form.total_price = total_price;
                this.moneyDisabled = true;
            } else {
                this.moneyDisabled = false;
            }
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
                target_type: Core.Const.CRM_LABEL.CATEGORY.ORDER,
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
#OrderEdit {
    .customer-tag {
        margin-top: 10px;
    }
    .icon {
        font-size: 12px;
    }
    .block {
        display: block;
        padding: 0 20px;
    }
}
</style>
