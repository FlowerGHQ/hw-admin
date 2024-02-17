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
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.name_en') }}</div>
                    <div class="value">
                        <a-input v-model:value="form.name_en" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.area') }}:</div>
                    <div class="value">
                        <MyCountryCascader v-model:value="areaList" @handleGetItem="handleGetItem" />
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary" v-if="$auth('sales-area.save')">{{
                $t('def.sure')
            }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost="">{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import MyCountryCascader from '@/components/MyCountryCascader/index.vue';
export default {
    name: 'SalesAreaEdit',
    components: { MyCountryCascader },
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
            // 地区
            areaList: [],
            area: {
                continent: '',
                continent_en: '',
                country: '',
                country_en: '',
                country_code: '',
            },
            // code-集合数组
            codeList: [],
        };
    },
    watch: {},
    computed: {},

    mounted() {
        this.form.id = Number(this.$route.query.id) || 0;
        if (this.form.id) {
            this.getSalesAreaDetail();
        }
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1);
                    break;
            }
        },
        getSalesAreaDetail() {
            this.loading = true;
            Core.Api.SalesArea.detail({
                id: this.form.id,
            })
                .then(res => {
                    console.log('详情-----------------------', res.detail);
                    let d = res.detail;
                    this.detail = d;
                    for (const key in this.form) {
                        this.form[key] = d[key];
                    }
                    for (const key in this.area) {
                        this.area[key] = d[key];
                    }
                    this.areaList = d.country.split(',');
                })
                .catch(err => {
                    console.log('getSalesAreaDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form);
            let area = Core.Util.deepCopy(this.area);
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter') + this.$t('n.name'));
            }
            if (!form.name_en) {
                return this.$message.warning(this.$t('def.enter') + this.$t('n.name_en'));
            }
            if (!area.country) {
                return this.$message.warning(this.$t('def.enter') + this.$t('n.area'));
            }
            Core.Api.SalesArea.save({
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
        handleGetItem(item) {
            this.area = {
                continent: item.map(obj => obj.parentName).join(','),
                continent_en: item.map(obj => obj.parentEnName).join(','),
                country: item.map(obj => obj.name).join(','),
                country_en: item.map(obj => obj.name_en).join(','),
                country_code: item.map(obj => obj.code).join(','),
            };
        },
    },
};
</script>

<style lang="less" scoped>
// #SalesAreaEdit {}
</style>
