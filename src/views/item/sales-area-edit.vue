<template>
    <div id="SalesAreaEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('ar.edit') : $t('ar.save') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('n.name') }}</div>
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.name_en') }}</div>
                    <div class="value">
                        <a-input v-model:value="form.name_en" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.area') }}:</div>
                    <div class="value">
                        <CountryCascaderTabMore v-model:value="areaList" :def-area='defArea' :code-list="codeList"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary" v-if="$auth('sales-area.save')">{{ $t('def.sure') }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost="">{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import CountryCascader from '@/components/common/CountryCascader.vue'
import CountryCascaderTabMore from '@/components/common/CountryCascaderTabMore.vue'
export default {
    name: 'SalesAreaEdit',
    components: {CountryCascader,CountryCascaderTabMore},
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            detail: {},
            form: {
                id: '',
                name: '',
                name_en: '',
            },
            areaList: [],
            defArea: [],
            area: {
                continent: '',
                continent_en: '',
                country: '',
                country_en: '',
                country_code: '',
            },
           // code-集合数组
           codeList: [] 
        };
    },
    watch: {},
    computed: {},

    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        if (this.form.id) {
            this.getSalesAreaDetail();
        }
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
            }
        },
        getSalesAreaDetail() {
            this.loading = true;
            Core.Api.SalesArea.detail({
                id: this.form.id,
            }).then(res => {
                let d = res.detail
                this.detail = d
                for (const key in this.form) {
                    this.form[key] = d[key]
                }
                for (const key in this.area) {
                    this.area[key] = d[key]
                }
                // this.defArea = [d.continent || '', d.country || '']
                // 城市code集合数组
                this.codeList = d.country_code.split(",");
                this.defArea = d.country.split(",");

            }).catch(err => {
                console.log('getSalesAreaDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            let area = Core.Util.deepCopy(this.area)
            if (this.areaList.length) {
                let arr = this.areaList;
                area = {
                    /* continent: this.areaList[0].name,
                    continent_en: this.areaList[0].name_en,
                     country: this.areaList[1].name,
                    country_en: this.areaList[1].name_en,
                    country_code: this.areaList[1].code, */
                    country : arr.map(obj => obj.name).join(","),
                    country_en : arr.map(obj => obj.name_en).join(","),
                    country_code : arr.map(obj => obj.code).join(","),
                }
            }
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter')+this.$t('n.name'))
            }
            if (!form.name_en) {      
                return this.$message.warning(this.$t('def.enter')+this.$t('n.name_en'))
            }
            if (!area.country) {
                return this.$message.warning(this.$t('def.enter')+this.$t('n.area'))
            }
            console.log('submit------------111',{ ...form, ...area });
            Core.Api.SalesArea.save({
                ...form,
                ...area
            }).then(() => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },

    }
};
</script>

<style lang="less" scoped>
// #SalesAreaEdit {}
</style>