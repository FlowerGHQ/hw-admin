<template>
<div id="AgentEdit" class="edit-container">
    <div class="title-container"><div class="title-area">{{ form.id ? $t('a.edit') : $t('a.new_retailer') }}</div></div>
    <div class="form-block">
        <div class="form-title"><div class="title">{{ $t('n.information') }}</div></div>
        <div class="form-content">
            <div class="form-item" v-if="$auth('ADMIN') && !form.id">
                <div class="key">{{ $t('n.distributor') }}</div>
                <div class="value">
<!--                    <a-select v-model:value="form.distributor_id" :placeholder="$t('search.select_distributor')">-->
<!--                        <a-select-option v-for="distributor of distributorList" :key="distributor.id" :value="distributor.id">{{ distributor.name }}</a-select-option>-->
<!--                    </a-select>-->
                    <a-tree-select
                        v-model:value="form.parent_id"
                        show-search
                        style="width: 100%"
                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                        placeholder="Please select"
                        allow-clear
                        treeDefaultExpandAll
                        :tree-data="treeData"
                        :placeholder="$t('def.select')"
                    >
                        <template #title="{ value: value, id, name }">
                            {{name }}
                        </template>
                    </a-tree-select>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('n.name') }}:</div>
                <div class="value">
                    <a-input v-model:value="form.name" :placeholder="$t('def.input')"/>
                </div>
            </div>

            <div class="form-item required">
                <div class="key">{{ $t('d.short_name') }}:</div>
                <div class="value">
                    <a-input v-model:value="form.short_name" :placeholder="$t('def.input')"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('d.pay_type') }}:</div>
                <div class="value">
                    <a-select v-model:value="form.pay_type" placeholder="请选择整车付款期限及方式">
                        <a-select-option  v-for="item in PAY_TIME_LIST" :key="item.value" :value="item.value">{{ item.text }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('n.contact') }}:</div>
                <div class="value">
                    <a-input v-model:value="form.contact_name" :placeholder="$t('def.input')"/>
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
        </div>
    </div>
    <div class="form-btns">
        <a-button @click="handleSubmit" type="primary" v-if="$auth('agent.save')">{{ $t('def.sure') }}</a-button>
        <a-button @click="routerChange('back')" type="primary" ghost="">{{ $t('def.cancel') }}</a-button>
    </div>
</div>
</template>

<script>
import Core from '../../core';
import CountryCascader from '@/components/common/CountryCascader.vue'

export default {
    name: 'AgentEdit',
    components: {CountryCascader},
    props: {},
    data() {
        return {
            PAY_TIME_LIST: Core.Const.DISTRIBUTOR.PAY_TIME_LIST,
            // 加载
            loading: false,
            distributorList: [],
            detail: {},
            form: {
                id: '',
                parent_id: '',
                name: '',
                short_name: '',
                contact_name: '',
                phone: '',
                email: '',
                country: undefined,
                continent: undefined,
                distributor_id: undefined,
            },
            treeData: [],
            areaList: [],
            defArea: [],
            value: '',
            area: {
                continent: '',
                country: '',
                country_en: '',
                country_code: '',
            }
        };
    },
    watch: {},
    computed: {},

    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        this.form.distributor_id = Number(this.$route.query.distributor_id) || undefined
        if (this.form.id) {
            this.getAgentDetail();
        }
        if (this.$auth('ADMIN')) {
            this.getDistributorList();
        } else if (this.$auth('DISTRIBUTOR')) {
            this.form.distributor_id = Core.Data.getOrgId()
        }
        this.getAgentListPath()
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
            }
        },
        getAgentDetail() {
            this.loading = true;
            console.log("id",this.form.id)
            Core.Api.Agent.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getAgentDetail res', res)
                let d = res.detail
                this.detail = d
                for (const key in this.form) {
                    this.form[key] = d[key]
                }
                for (const key in this.area) {
                    this.area[key] = d[key]
                }
                this.defArea = [d.continent || '', d.country || '']
            }).catch(err => {
                console.log('getAgentDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getDistributorList() {
            Core.Api.Distributor.listAll().then(res => {
                this.distributorList = res.list
            })
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
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.short_name) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.phone) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.email) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!area.country) {
                return this.$message.warning(this.$t('def.enter'))
            }
            Core.Api.Agent.save({
                ...form,
                ...area
            }).then(() => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
        getAgentListPath() {
            Core.Api.Agent.listPath({

            }).then((res) => {
                this.treeData = res.list
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
    }
};
</script>

<style lang="less" scoped>
// #AgentEdit {}
</style>
