<template>
    <div id="OrderEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('crm_o.edit') : $t('crm_o.save') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.belone_customer') }}：</div> <!-- 所属客户 -->
                    <div class="value">
                        {{bo_id}}
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
                            <a-select-option v-for=" item in itemOptions" :key="item.id" :value="item.id">
                                {{item.name}}
                            </a-select-option>
                        </a-select>

                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_b.name') }}：</div> <!-- 所属客户 -->
                    <div class="value">
                        <a-select
                            v-model:value="form.bo_id"
                            show-search
                            :placeholder="$t('n.enter')"
                            :default-active-first-option="false"
                            :show-arrow="false"
                            :filter-option="false"
                            :not-found-content="null"
                            @search="handleBoNameSearch"
                            :disabled="bo_id !== ''|| customer_id !== '' || form.id !== ''"
                            allowClear
                        >
                            <a-select-option v-for=" item in boOptions" :key="item.id" :value="item.id">
                                {{item.name}}
                            </a-select-option>
                        </a-select>

                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_c.phone') }}：</div>
                    <div class="value">
                        {{CRMCustomer.phone}}
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_c.level') }}：</div>
                    <div class="value">
                        {{$Util.CRMCustomerLevelFilter(CRMCustomer.level, $i18n.locale) || '-'}}
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_c.type') }}：</div>
                    <div class="value">
                        {{ $Util.CRMCustomerTypeFilter(CRMCustomer.type, $i18n.locale) || '-'  }}
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.contract_no') }}：</div> <!-- 合同编号 -->
                    <div class="value">
                        <a-input v-model:value="form.uid" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.name') }}：</div> <!-- 合同名称 -->
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.signing_date') }}：</div> <!-- 签约日期 -->
                    <div class="value">
                        <a-date-picker v-model:value="form.date" valueFormat='YYYY-MM-DD' placeholder="选择日期"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.seller_signatory') }}：</div> <!-- 我方签约人 -->
                    <div class="value">
                        <a-input v-model:value="form.seller_signatory" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.contract_type') }}：</div> <!-- 合同类型 -->
                    <div class="value">
                        <a-select v-model:value="form.type" :placeholder="$t('def.select')" >
                            <a-select-option v-for="item of CRM_ORDER_TYPE" :key="item.value" :value="item.value">{{lang === 'zh' ? item.zh: item.en}}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.buyer_signatory') }}：</div> <!-- 客户方签约人 -->
                    <div class="value">
                        <a-input v-model:value="form.buyer_signatory" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.remark') }}：</div> <!-- 备注 -->
                    <div class="value">
                        <a-textarea v-model:value="form.remark" :placeholder="$t('def.input')"
                                    :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='500'/>
                    </div>
                </div>
                <!-- 附件上传及列表 -->
                <UploadFileWithList :target_id="form.id" :target_type="CRM_ORDER_FILE" @getUploadData="getUploadData" ref='UploadFile'/>
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
                        <ItemSelect @select="handleAddFailItem"
                                    :disabled-checked='tableData.map(i => i.item_id)'
                                    btn-type='primary' :btn-text="$t('i.add')" btn-class="fault-btn"
                                    v-if="$auth('repair-order.save')"/>
                    </div>
                    <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                             :row-key="record => record.id" :pagination='false' size="small">
                        <template #headerCell="{title}">
                            {{ $t(title) }}
                        </template>
                        <template #bodyCell="{ column , record , index, text}">
                            <template v-if="column.key === 'item'">
                                {{ text || '-' }}
                            </template>
                            <template v-if="column.dataIndex === 'price'">
                                $ {{ text || '-' }}
                                <!-- <a-input-number v-model:value="record.price" style="width: 82px;"-->
                                <!-- :min="0" :precision="2" placeholder="请输入"/>-->
                            </template>
                            <template v-if="column.key === 'amount'">
                                <a-input-number v-model:value="record.amount" style="width: 66px;"
                                                :min="1" :precision="0" placeholder="请输入"/>
                                {{ $t('in.item') }}
                            </template>
                            <template v-if="column.key === 'discount'">
                                <a-input-number v-model:value="record.discount" style="width: 66px;"
                                                :min="1" :max="100" :precision="0" placeholder="请输入"/>
                                %
                            </template>
                            <template v-if="column.key === 'total_price'">
                                $ {{ $Util.countFilter(record.price * record.amount * record.discount / 100, 1) }}
                            </template>

                            <template v-if="column.dataIndex === 'operation'">
                                <a-button type="link" class="danger" @click="handleFailItemDelete(index)" v-if="$auth('crm-order.delete')"><i
                                    class="icon i_delete"/>{{ $t('def.remove') }}
                                </a-button>
                            </template>
                            <template v-if="column.key === 'remark'">
                                <a-input v-model:value="record.remark" :placeholder="$t('def.input')"/>
                            </template>
                        </template>
                    </a-table>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_o.total_amount') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.total_price" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_o.whole_discount') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.discount_rate" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_o.other_fee') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.other_cost" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_o.discounted') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.discount_amount" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.money') }}：</div>
                    <div class="value">
                        <!--  disabled -->
                        <a-input :value="contractAmount" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div>{{ $t('crm_o.money_tip') }}</div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary" v-if="$auth('crm-order.save')">{{ $t('def.sure') }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost="">{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';

import ChinaAddressCascader from '@/components/common/ChinaAddressCascader.vue'
import CountryCascader from '@/components/common/CountryCascader.vue'
import AddressCascader from '@/components/common/AddressCascader.vue';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';
import ItemTable from '@/components/table/ItemTable.vue'
import UploadFileWithList from '@/components/common/UploadFileWithList.vue'
import dayjs from "dayjs";

export default {
    name: 'OrderEdit',
    components: { ChinaAddressCascader, CountryCascader, AddressCascader, ItemSelect, ItemTable, UploadFileWithList },
    props: {},
    data() {
        return {
            CRM_ORDER_FILE: Core.Const.ATTACHMENT.TARGET_TYPE.CRM_ORDER_FILE,
            // 加载
            loading: false,
            detail: {},
            form: {
                bo_id: '',
                customer_id: '',
                uid: '',
                name: '',
                date: '',
                seller_signatory: '',
                type: '',
                buyer_signatory: '',
                remark:'',
                source_id: '',
                source_type: '',
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

        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang
        },
        tableColumns() {
            let tableColumns = [
                {title: 'def.operate', dataIndex: 'operation', key: 'operation' },
                {title: "crm_o.choose_product", dataIndex: 'name', key: 'item'},
                {title: 'crm_o.price_list', dataIndex: 'price', key: 'price' },
                {title: 'crm_o.unit_price', dataIndex: 'price', key: 'price' },
                {title: 'i.amount', dataIndex: 'amount', key: 'item' },
                {title: 'crm_b.discount', dataIndex: 'discount', key: 'item' },
                {title: 'i.total_price', dataIndex: 'price', key: 'price' },
                {title: 'i.remark', dataIndex: 'remark', key: 'remark' },
            ]
            return tableColumns
        },
        contractAmount() {
            let amount = Number(this.form.total_price * this.form.discount_rate) + Number(this.form.other_cost) - Number(this.form.discount_amount)
            return amount || ''
        },
        // user_type() {
        //     return Core.Data.getUserType()
        // },
    },
    mounted() {
        this.form.id = Number(this.$route.query.id) || undefined
        this.customer_id = Number(this.$route.query.customer_id) || ""
        this.form.customer_id = Number(this.$route.query.customer_id) || undefined
        this.bo_id = Number(this.$route.query.bo_id) || ""
        this.form.bo_id = Number(this.$route.query.bo_id) || undefined
        if (this.form.id) {
            this.getOrderDetail();
        } else if (this.form.customer_id){
            this.handleCustomerIdSearch('init');
        } else if (this.form.bo_id){
            this.handleBoIdSearch();
        }
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':    // 详情
                    let routeUrl = this.$router.resolve({
                        path: "/crm-order/order-list",
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        getOrderDetail() {
            this.loading = true;
            Core.Api.CRMOrder.detail({
                id: this.form.id,
            }).then(({detail}) => {
                console.log('getOrderDetail res.detail', detail)
                this.detail = detail
                this.detail.date = detail.date ? dayjs.unix(detail.date).format('YYYY-MM-DD') : undefined
                for (const key in this.form) {
                    this.form[key] = this.detail[key]
                }
                if (this.detail.source_type === Core.Const.CRM_ORDER.SOURCE_TYPE.BO){
                    this.form.bo_id = this.detail.source_id
                    this.handleBoIdSearch();
                }
                this.handleCustomerIdSearch();

                // this.defAddr = [d.province, d.city, d.county]
                // this.defArea = [d.continent || '', d.country || '']
            }).catch(err => {
                console.log('getOrderDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 提交
        handleSubmit() {
            this.$refs.UploadFile.getUploadData() // 子组件拿值
            let form = Core.Util.deepCopy(this.form)
            let area = Core.Util.deepCopy(this.area)
            if (!form.customer_id) {
                return this.$message.warning(this.$t('def.input'))
            }
            if (!form.uid) {
                return this.$message.warning(this.$t('def.input'))
            }
            if (!form.name) {
                return this.$message.warning(this.$t('def.input'))
            }
            if (!form.date) {
                return this.$message.warning(this.$t('def.select'))
            }
            if (!form.seller_signatory) {
                return this.$message.warning(this.$t('def.input'))
            }
            if (!form.type) {
                return this.$message.warning(this.$t('def.select'))
            }
            if (!form.buyer_signatory) {
                return this.$message.warning(this.$t('def.input'))
            }
            if (!form.remark) {
                return this.$message.warning(this.$t('def.input'))
            }
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
            form.date = form.date ? dayjs(form.date).unix() : 0 // 日期转时间戳
            form.item_bind_list = this.tableData
            if ( this.form.bo_id !== ""){
                form.source_id = this.form.bo_id
                form.source_type = Core.Const.CRM_ORDER.SOURCE_TYPE.BO
            } else {
                form.source_id = this.form.customer_id
                form.source_type = Core.Const.CRM_ORDER.SOURCE_TYPE.CUSTOMER
            }


            console.log('form',form)
            Core.Api.CRMOrder.save({
                ...form,
            }).then(() => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
        getUploadData(uploadData) {
            this.form.attachment_list = uploadData
        },

        // 添加商品
        async handleAddFailItem(ids, items) {
            for (let i = 0; i < items.length; i++) {
                const element = items[i];
                element.item_id = element.id
                element.id = 0
                element.amount = 1
                element.price = element.fob_usd / 100
                element.discount = 100
                element.remark = ''
            }
            console.log('handleAddFailItem items:', items)
            this.tableData.push(...items)
        },
        // 移除商品
        handleFailItemDelete(index, name) {
            this.tableData.splice(index, 1)
        },
        handleCustomerNameSearch(name){
            Core.Api.CRMCustomer.list({name: name, status: Core.Const.CRM_CUSTOMER.STATUS.CUSTOMER}).then(res => {
                this.itemOptions = res.list

            })
        },
        handleCustomerChange(){
            this.handleCustomerIdSearch()
            this.boOptions = [];
            this.form.bo_id = '';
        },
        handleCustomerIdSearch(type){
            Core.Api.CRMCustomer.detail({id: this.form.customer_id}).then(res => {
                this.CRMCustomer = res.detail
                // this.handleCustomerNameSearch(res.name)
                if (type === 'init'){
                    this.handleCustomerNameSearch(res.name)
                }
            })
        },
        handleBoNameSearch(){
            Core.Api.CRMBo.list({name: name,customer_id: this.form.customer_id}).then(res => {
                this.boOptions = res.list
            })
            this.handleCustomerIdSearch()
        },
        handleBoIdSearch(){
            Core.Api.CRMBo.detail({id: this.form.bo_id}).then(res => {
                console.log("res.customer_id",res.detail.customer_id)
                this.form.customer_id = res.detail.customer_id
                let customer_name = res.detail.customer_name
                this.handleCustomerNameSearch(customer_name)
                this.handleBoNameSearch(res.detail.name)
                this.handleCustomerIdSearch()
            })
        },
    }
};
</script>

<style lang="less">
.OrderEdit {

    .icon {
        font-size: 12px;
    }
}
.block {
    display: block;
    padding: 0 20px;
}
</style>
