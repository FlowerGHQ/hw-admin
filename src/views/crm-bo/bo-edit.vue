<template>
    <div id="CRMBoEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('c.edit') : $t('c.save') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('crm_b.customer_name') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.customer_name" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_b.name') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_b.money') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.money" :placeholder="$t('def.input')"/>
                    </div>
                </div>

                <div class="form-item required">
                    <div class="key">{{ $t('crm_b.status') }}：</div>
                    <div class="value">
                        <a-select v-model:value="form.status" :placeholder="$t('def.input')" >
                            <a-select-option v-for="item of CRM_LEVEL_MAP" :key="item.value" :value="item.value">{{lang === 'zh' ? item.zh: item.en}}</a-select-option>
                        </a-select>
                        <a-input v-model:value="form.status" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_b.estimated_deal_time') }}：</div>
                    <div class="value">
                        <a-date-picker v-model:value="form.estimated_deal_time" valueFormat='YYYY-MM-DD' :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_b.source') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.source" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item textarea">
                    <div class="key">{{ $t('r.remark') }}</div>
                    <div class="value">
                        <a-textarea v-model:value="form.remark" :placeholder="$t('r.enter_remark')"
                                    :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='500'/>
                        <span class="content-length">{{ form.remark }}/500</span>
                    </div>
                </div>
                <div class="form-item textarea">
                    <div class="key">{{ $t('r.remark') }}</div>

                        <div class="fault-title">
                            <ItemSelect @select="handleAddFailItem"
                                        :disabled-checked='tableData.map(i => i.id)'
                                        btn-type='primary' :btn-text="$t('i.add')" btn-class="fault-btn" v-if="$auth('repair-order.save')"/>
                        </div>
                        <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                                 :row-key="record => record.id" :pagination='false' size="small">
                            <template #headerCell="{title}">
                                {{ $t(title) }}
                            </template>
                            <template #bodyCell="{ column , record ,index, text}">
                                <template v-if="column.key === 'item'">
                                    {{ text || '-' }}
                                </template>
                                <template v-if="column.dataIndex === 'price'">
                                    $ {{ text || '-' }}
<!--                                    <a-input-number v-model:value="record.price" style="width: 82px;"-->
<!--                                                      :min="0" :precision="2" placeholder="请输入"/>-->
                                </template>
                                <template v-if="column.key === 'amount'">
                                    <a-input-number v-model:value="record.amount" style="width: 66px;"
                                                    :min="1" :precision="0" placeholder="请输入" /> {{ $t('in.item') }}
                                </template>
                                <template v-if="column.key === 'discount'">
                                    <a-input-number v-model:value="record.discount" style="width: 66px;"
                                                    :min="1" :max="100" :precision="0" placeholder="请输入" />%
                                </template>

                                <template v-if="column.key === 'total_price'">
                                    $ {{ $Util.countFilter(record.price * record.amount * record.discount / 100 , 1) }}
                                </template>

                                <template v-if="column.dataIndex === 'operation'">
                                    <a-button type="link" class="danger" @click="handleFailItemDelete(index)"><i class="icon i_delete"/>{{ $t('def.remove') }}</a-button>
                                </template>
                            </template>
                        </a-table>


                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary" v-if="$auth('customer.save')">{{ $t('def.sure') }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost="">{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';
import ChinaAddressCascader from '@/components/common/ChinaAddressCascader.vue'
import CountryCascader from '@/components/common/CountryCascader.vue'
import AddressCascader from '@/components/common/AddressCascader.vue';
import dayjs from "dayjs";

export default {
    name: 'CustomerEdit',
    components: { ItemSelect, ChinaAddressCascader, CountryCascader, AddressCascader},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            CRM_STATUS_MAP: Core.Const.CRM_CUSTOMER.TYPE_MAP,

            TYPE_MAP: 1,
            // 加载
            loading: false,
            detail: {},
            form: {
                id: '',
                type: '',
                name: '',
                phone: '',
                level: '',
                source: '',
                company_size: '',
                company_license_id:'',
                gender: '',
                birthday: '',
                industry: '',
                nationality: '',
                hobby: '',
                marital_status: '',
                income: '',
                remark: '',

                address: '',
            },
            defAddr: [],
            areaList: [],
            defArea: [],
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
            areaMap: {},
            countryShow: false,
            tableData: [],
            statusGroup: {},
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang
        },
        tableColumns() {
            let columns = [
                {title: 'n.name', dataIndex: 'name', key: 'item'},
                {title: 'i.code', dataIndex: 'code', key: 'item'},
                {title: 'i.unit_price', dataIndex: 'price'},
                {title: 'i.amount', key: 'amount'},
                {title: 'crm_b.discount', key: 'discount'},
                {title: 'i.total_price', key: 'total_price'},
                {title: 'def.operate', dataIndex: 'operation'},
            ]
            return columns
        },
    },
    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        if (this.form.id) {
            this.getCustomerDetail();
        }
        this.getStatusGroup()
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':    // 详情
                    let routeUrl = this.$router.resolve({
                        path: "/crm-customer/customer-list",
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        getCustomerDetail() {
            this.loading = true;
            Core.Api.CRMCustomer.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getCustomerDetail res', res)
                let d = res.detail
                this.detail = d
                this.detail.birthday = this.detail.birthday ? dayjs.unix(this.detail.birthday).format('YYYY-MM-DD') : undefined
                for (const key in this.form) {
                    this.form[key] = d[key]
                }
                this.defAddr = [d.province, d.city, d.county]

                // this.defArea = [d.continent || '', d.country || '']
            }).catch(err => {
                console.log('getCustomerDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            let area = Core.Util.deepCopy(this.area)
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.phone) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.type) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.level) {
                return this.$message.warning(this.$t('def.enter'))
            }
           /* if (!form.province || !form.city || !form.county || !form.address) {
                // return this.$message.warning('请完善客户地址')
            }*/
            form.birthday = form.birthday ? dayjs(form.birthday).unix() : 0 // 日期转时间戳

            console.log('form',this.form)
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
            Core.Api.CRMCustomer.save({
                ...form,
            }).then(() => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },

        handleAddressSelect(address = []) {
            this.form.province = address[0]
            this.form.city = address[1]
            this.form.county = address[2]
        },
        getCountry(data) {
            console.log('getCountry data',data)
            if (data.country == '中国' || data.country == 'China') {
                this.countryShow = true
            } else {
                this.countryShow = false
            }
            console.log('data.country',data.country)
            console.log('countryShow',this.countryShow)

        },
        getStatusGroup() {
            Core.Api.CrmBoStatusGroup.list({}).then((res) => {
                if (res.list.length > 0)
                this.statusGroup = JSON.parse(res.list[0])
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })

        },
        // 添加商品
        async handleAddFailItem(ids, items) {
            for (let i = 0; i < items.length; i++) {
                const element = items[i];
                element.amount = 1
                element.price = element.fob_usd/100
                element.discount = 100
            }
            console.log('handleAddFailItem items:', items)
            this.tableData.push(...items)
        },
        // 移除商品
        handleFailItemDelete(index, name) {
            this.tableData.splice(index, 1)
        },
    }
};
</script>

<style lang="less">
.CRMBoEdit {

    .icon {
        font-size: 12px;
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
