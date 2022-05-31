<template>
    <div id="DistributorEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('d.edit') : $t('d.new_distributor') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('d.name') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('n.enter')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('d.short_name') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.short_name" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.type') }}:</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.type">
                            <a-radio :value="TYPE.INTERNAL">{{ $t('d.internal') }}</a-radio>
                            <a-radio :value="TYPE.EXPORT">{{ $t('d.export') }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('d.company') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.company_name" :placeholder="$t('d.company_name')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('d.id') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.tax_no" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('d.port') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.receive_port" :placeholder="$t('d.receipt')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.contact') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.contact" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.phone') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.phone" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.email') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.email" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.country') }}:</div>
                    <div class="value">
                        <CountryCascader v-model:value="areaList" :def-area='defArea'/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('d.sales_area') }}:</div>
                    <div class="value">
                        <a-select v-model:value="form.sales_area_ids" mode="tags" :placeholder=" $t('def.select')">
                            <a-select-option v-for="(item,index) of salesList" :key="index" :value="item.id">{{ item.name }}</a-select-option>
                        </a-select>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary" v-if="$auth('distributor.save')">{{ $t('def.sure') }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost="">{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import CountryCascader from '@/components/common/CountryCascader.vue';

export default {
    name: 'DistributorEdit',
    components: {
        CountryCascader
    },
    props: {},
    data() {
        return {
            TYPE: Core.Const.DISTRIBUTOR.TYPE,
            // 加载
            loading: false,
            detail: {},
            salesList: [], // 销售区域

            form: {
                id: '',
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
            },

            areaList: [],
            defArea: [],
            area: {
                continent: '',
                country: '',
                country_en: '',
                country_code: '',
            },
        };
    },
    watch: {},
    computed: {},

    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        if (this.form.id) {
            this.getDistributorDetail();
        }
        this.getSalesAreaList()
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
            }
        },
        getDistributorDetail() {
            this.loading = true;
            console.log("id", this.form.id)
            Core.Api.Distributor.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getDistributorDetail res', res)
                let d = res.detail
                this.detail = d
                for (const key in this.form) {
                    this.form[key] = d[key]
                }
                for (const key in this.area) {
                    this.area[key] = d[key]
                }
                this.form.sales_area_ids = this.detail.sales_area_list ? this.detail.sales_area_list.map(i => i.id): []
                this.defArea = [d.continent || '', d.country || '']
            }).catch(err => {
                console.log('getDistributorDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getSalesAreaList() {
            Core.Api.SalesArea.list().then(res => {
                this.salesList = res.list
            });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            let area = Core.Util.deepCopy(this.area)
            if (this.areaList.length) {
                console.log('this.areaList:', this.areaList)
                area = {
                    continent: this.areaList[0].name,
                    country: this.areaList[1].name,
                    country_en: this.areaList[1].name_en,
                    country_code: this.areaList[1].code,
                }
            }
            const requireList = [
                { key: 'name', msg: this.$t('def.enter') },
                { key: 'short_name', msg: this.$t('def.enter') },
                { key: 'type', msg: this.$t('def.enter') },
                { key: 'company_name', msg: this.$t('def.enter') },
                { key: 'tax_no', msg: this.$t('def.enter') },
                { key: 'receive_port', msg: this.$t('def.enter') },
                { key: 'contact', msg: this.$t('def.enter') },
                { key: 'phone', msg: this.$t('def.enter') },
                { key: 'email', msg: this.$t('def.enter') },
                // { key: 'country', msg: this.$t('def.enter') },
                { key: 'sales_area_ids', msg: this.$t('def.enter') },
            ]
            for( let index in requireList) {
                if(!form[requireList[index].key]) {
                    return this.$message.warning(requireList[index].msg);
                }
            }
            if (!area.country) {
                return this.$message.warning(this.$t('def.enter'))
            }
            form.sales_area_ids = form.sales_area_ids.join(',')
            Core.Api.Distributor.save({
                ...form,
                ...area
            }).then(() => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        }
    }
};
</script>

<style lang="less" scoped>
// #DistributorEdit {}
</style>