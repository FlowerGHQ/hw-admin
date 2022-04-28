<template>
    <div id="DistributorEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? '编辑分销商' : '新建分销商' }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title">基本信息</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">分销商名:</div>
                    <div class="value">
                        <a-input v-model:value="form.name" placeholder="请输入分销商名字"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">简称:</div>
                    <div class="value">
                        <a-input v-model:value="form.short_name" placeholder="请输入简称"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">分销商类型:</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.type">
                            <a-radio :value="TYPE.INTERNAL">国内</a-radio>
                            <a-radio :value="TYPE.EXPORT">出口</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">公司名称:</div>
                    <div class="value">
                        <a-input v-model:value="form.company_name" placeholder="请输入分销商公司名称"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">税号:</div>
                    <div class="value">
                        <a-input v-model:value="form.tax_no" placeholder="请输入税号"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">收货港口:</div>
                    <div class="value">
                        <a-input v-model:value="form.receive_port" placeholder="请输入收货港口"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">联系人:</div>
                    <div class="value">
                        <a-input v-model:value="form.contact" placeholder="请输入分销商联系人"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">手机号:</div>
                    <div class="value">
                        <a-input v-model:value="form.phone" placeholder="请输入分销商手机号"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">邮箱:</div>
                    <div class="value">
                        <a-input v-model:value="form.email" placeholder="请输入分销商邮箱"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">国家:</div>
                    <div class="value">
                        <CountryCascader v-model:value="areaList" :def-area='defArea'/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">销售区域</div>
                    <div class="value">
                        <a-select v-model:value="form.sales_area_ids" mode="tags" placeholder="请选择销售区域">
                            <a-select-option v-for="(item,index) of salesList" :key="index" :value="item.id">{{ item.name }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <!-- <div class="form-item required">
                    <div class="key">支付条款:</div>
                    <div class="value">
                        <a-select v-model:value="form.pay_type" placeholder="请选择支付条款">
                            <a-select-option v-for="(item,index) of paymentTimeList" :key="index" :value="item.value">{{ item.text }}</a-select-option>
                        </a-select>
                    </div>
                </div> -->
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary">确定</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost="">取消</a-button>
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
            paymentTimeList: Core.Const.DISTRIBUTOR.PAY_TIME_LIST,
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
                { key: 'name', msg: '请输入分销商名' },
                { key: 'short_name', msg: '请输入简称' },
                { key: 'type', msg: '请选择分销商类型' },
                { key: 'company_name', msg: '请输入分销公司名称' },
                { key: 'tax_no', msg: '请输入税号' },
                { key: 'receive_port', msg: '请输入收货港口' },
                { key: 'contact', msg: '请输入联系人' },
                { key: 'phone', msg: '请输入联系人手机号' },
                { key: 'email', msg: '请输入分销商邮箱' },
                // { key: 'country', msg: '请选择分销商国家' },
                { key: 'sales_area_ids', msg: '请选择销售区域' },
            ]
            for( let index in requireList) {
                if(!form[requireList[index].key]) {
                    return this.$message.warning(requireList[index].msg);
                }
            }
            // if (!form.name) {
            //     return this.$message.warning('请输入分销商名')
            // }
            // if (!form.short_name) {
            //     return this.$message.warning('请输入简称')
            // }
            // if (!form.short_name) {
            //     return this.$message.warning('请输入简称')
            // }
            // if (!form.contact) {
            //     return this.$message.warning('请输入联系人')
            // }
            // if (!form.phone) {
            //     return this.$message.warning('请输入联系人手机号')
            // }
            // if (!form.email) {
            //     return this.$message.warning('请输入分销商邮箱')
            // }
            if (!area.country) {
                return this.$message.warning('请选择分销商国家')
            }
            // if (!form.sales_area_ids) {
            //     return this.$message.warning('请选择销售区域')
            // }
            form.sales_area_ids = form.sales_area_ids.join(',')
            Core.Api.Distributor.save({
                ...form,
                ...area
            }).then(() => {
                this.$message.success('保存成功')
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