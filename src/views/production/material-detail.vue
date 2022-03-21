<template>
    <div id="ItemDetail">
        <div class="list-container">
            <a-spin :spinning="loading" class='loading-incontent' v-if="loading"></a-spin>
            <div class="title-container">
                <div class="title-area">物料详情</div>
                <div class="btns-area">
                    <a-button type="primary" ghost @click="routerChange('edit')"><i class="icon i_edit"/>编辑</a-button>
                </div>
            </div>
            <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
                <template #expandIcon><i class="icon i_expan_l"/></template>
                <a-collapse-panel key="ItemInfo" header="详情信息" class="gray-collapse-panel">
                    <a-row class="panel-content info-container">
                        <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                            <div class="info-item">
                                <div class="key">物料名称</div>
                                <div class="value">{{ detail.name || '-' }}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">物料分类</div>
                                <div class="value">{{ categoryName }}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">物料编码</div>
                                <div class="value">{{ detail.code || '-' }}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">物料包装</div>
                                <div class="value">{{ detail.物料包装 || '-' }}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">规格</div>
                                <div class="value">{{ detail.spec || '-' }}</div>
                            </div>
                            <div class="info-item">
                                <div class="key">供应商编码</div>
                                <div class="value">{{ detail.supplier_code || '-' }}</div>
                            </div>
                        </a-col>
                    </a-row>
                </a-collapse-panel>
            </a-collapse>
        </div>
    </div>
</template>

<script>
import Core from '../../core';

export default {
    name: 'RepairDetail',
    components: {},
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            id: '',
            detail: {}, // 详情
            categoryName: '-',

            activeKey: ['ItemInfo']
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        this.getMaterialDetail();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/production/material-edit",
                        query: {id: this.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        // 获取 物料详情
        getMaterialDetail() {
            this.loading = true;
            Core.Api.Material.detail({id: this.id})
                .then(res => {
                    console.log('Material.detail res', res)
                    this.detail = res
                    this.getCategoryName(res.category_id)
                })
                .finally(() => {
                    this.loading = false
                })
        },
        getCategoryName(id) {
            Core.Api.MaterialCategory.detail({id})
                .then(res => {
                    this.categoryName = res.detail.name
                })
        }
    }
};
</script>

<style lang="less" scoped>
// #ItemDetail {}
</style>
