<template>
    <div id="ItemDetail">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">商品详情</div>
                <div class="btns-area">
                    <a-button type="primary" ghost @click="routerChange('edit')"><i class="icon i_edit"/>编辑</a-button>
                    <a-button danger @click="handleDelete()"><i class="icon i_delete"/>删除</a-button>
                </div>
            </div>
            <div class="gray-panel">
                <div class="panel-content">
                    <div class="content-top">
                        <div class="info-block-top">
                            <img :src="$Util.imageFilter(detail.logo ? detail.logo : '', 2)" />
                        </div>
                        <div class="info-block-top">
                            <p class="name">商品名:{{detail.name}}</p>
                            <p class="price">￥{{$Util.countFilter(detail.price)}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-container">
                <div class="info">
                    <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
                        <template #expandIcon ><i class="icon i_expan_l"/> </template>
                        <a-collapse-panel key="itemInfo" header="详情信息" class="gray-collapse-panel">
                            <a-row class="panel-content info-container">
                                <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                                    <div class="info-item">
                                        <div class="key">商品编码</div>
                                        <div class="value">{{detail.code || '-'}}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="key">商品分类</div>
                                        <div class="value">{{detail.category ? detail.category.name : '-'}}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="key">标准售价</div>
                                        <div class="value">￥{{$Util.countFilter(detail.price)}}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="key">批发价格</div>
                                        <div class="value">￥{{$Util.countFilter(detail.original_price)}}</div>
                                    </div>
                                </a-col>
                                <a-col :xs='24' :sm='24' :lg='12' :xl='16' :xxl='18' class="info-block">
                                    <template v-for="(item, index) of config" :key="index">
                                        <a-col :xs='24' :sm='24' :lg='12' :xl='12' :xxl='8' class="info-item"
                                            :class="item.type" v-if="item.value">
                                            <div class="key">{{item.name}}</div>
                                            <div class="value" v-if="item.type == 'rich_text'" v-html='item.value'></div>
                                            <div class="value" v-else>{{item.value || '-'}}</div>
                                        </a-col>
                                    </template>
                                </a-col>
                            </a-row>
                        </a-collapse-panel>
                    </a-collapse>
                </div>
            </div>
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
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            id: '',
            detail: {}, // 采购单详情
            config: [],

            activeKey: ['itemInfo'],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        this.getItemDetail();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/item/item-edit",
                        query: { id: this.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                    break;
                case 'back':
                    this.$router.go(-1)
                    break;
            }
        },
        getItemDetail() {  // 获取 详情 数据
            this.loading = true;
            Core.Api.Item.detail({
                id: this.id
            }).then(res => {
                console.log("getDetailData res", res)
                this.detail = res;
                try { this.config = JSON.parse(res.config) } catch (err) { this.config = [] }
            }).catch(err => {
                console.log('getDetailData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleDelete(){
            let _this = this;
            this.$confirm({
                title: '确定要删除该商品吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Item.delete({id: _this.id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.routerChange('back');
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
    }
};
</script>

<style lang="less" scoped>
#ItemDetail {
    .content-top {
        padding-bottom: 0 20px;
        display: flex;
        .info-block-top{
            padding-right: 20px;
            img {
                width: 120px;
                height: 120px;
                object-fit: cover;
                background: #F3F3F3;
                border-radius: 4px 4px 4px 4px;
            }
            .name {
                height: 28px;
                font-size: 16px;
                color: rgba(0, 0, 0, 0.85);
                line-height: 28px;
            }
            .price {
                height: 20px;
                font-size: 14px;
                font-weight: 500;
                color: #F4752E;
                line-height: 20px;
                padding-top: 20px;
            }
        }
    }
}

</style>
