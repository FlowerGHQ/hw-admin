<template>
    <div id="SalesAreaEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? '编辑区域' : '新建区域' }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title">基本信息</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">名称</div>
                    <div class="value">
                        <a-input v-model:value="form.name" placeholder="请输入区域名称"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">区域:</div>
                    <div class="value">
                        <CountryCascader v-model:value="areaList" :def-area='defArea'/>
                    </div>
                </div>
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
import CountryCascader from '@/components/common/CountryCascader.vue'
export default {
    name: 'SalesAreaEdit',
    components: {CountryCascader},
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            detail: {},
            form: {
                id: '',
                name: '',
            },
            areaList: [],
            defArea: [],
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
                this.defArea = [d.continent || '', d.country || '']
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
                console.log('this.areaList:', this.areaList)
                area = {
                    continent: this.areaList[0].name,
                    country: this.areaList[1].name,
                    country_en: this.areaList[1].name_en,
                    country_code: this.areaList[1].code,
                }
            }
            if (!form.name) {
                return this.$message.warning('请输入区域名称')
            }
            if (!area.country) {
                return this.$message.warning('请选择大洲/国家')
            }
            Core.Api.SalesArea.save({
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
// #SalesAreaEdit {}
</style>