<template>
    <div id="ItemDetail">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">商品详情</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')"  ><i class="icon i_edit"/>编辑</a-button>
                    <a-button type="primary" @click="handleDelete(this.id)"  ><i class="icon i_edit"/>删除</a-button>                
                </div>
            </div>
            <div class="gray-panel">
                <div class="panel-content">
                    <div class="content-top">
                        <div class="info-block-top">
                            <img :src="$Util.imageFilter(detail.logo ? detail.logo : '', 2)" />
                        </div>
                        <div class="info-block-top">
                            <p class="p1">商品名:{{detail.name}}</p>
                            <p class="p2">{{detail.price}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-container">
                <div class="info">
                    <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
                    <template #expandIcon ><i class="icon i_expan_l"/> </template>
                        <a-collapse-panel key="PurchaseInfo" header="详情信息" class="gray-collapse-panel">
                            <a-row class="panel-content info-container">
                                <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                                    <div class="info-item">
                                        <div class="key">商品编码</div>
                                        <div class="value">{{detail.code || '-'}}</div>
                                    </div>
                                    <!-- <div class="info-item">
                                        <div class="key">商品货号</div>
                                        <div class="value">{{detail.config || '-'}}</div>
                                    </div> -->
                                    <div class="info-item">
                                        <div class="key">商品分类</div>
                                        <div class="value">{{detail.category_id || '-'}}</div>
                                    </div>
                                    <!-- <div class="info-item">
                                        <div class="key">商品品牌</div>
                                        <div class="value">{{detail.brand || '-'}}</div>
                                    </div> -->
                                </a-col>
                                <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                                    <!-- <div class="info-item">
                                        <div class="key">商品条码：</div>
                                        <div class="value">{{detail.category_id || '-'}}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="key">生产商：</div>
                                        <div class="value">{{detail.category_id || '-'}}</div>
                                    </div> -->
                                    <div class="info-item">
                                        <div class="key">上架日期</div>
                                        <div class="value">{{$Util.timeFilter(detail.create_time) || '-'}}</div>
                                    </div>
                                    <!-- <div class="info-item">
                                        <div class="key">上架员工:</div>
                                        <div class="value">{{detail.name || '-'}}</div>
                                    </div> -->
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
            activeKey:0,
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        this.getItemDetail();
    },
    methods: {
        handleDelete(id){
            let _this = this;
            console.log("handleDelete id", id)
            this.$confirm({
                title: '确定要删除该商品吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.User.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete -> err", err);
                    })
                },
            });
        },
        routerChange(type, item = {}) {
            let routeUrl = ''
            let _this = this;
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/item/item-edit",
                        query: { id: this.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/item/item-detail",
                        query: { id: this.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'back':
                    this.$router.go(-1)
                    break;
            }
        },
        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {  // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        getItemDetail() {  // 获取 详情 数据
            this.loading = true;
            Core.Api.Item.detail({
                id: this.id
            }).then(res => {
                console.log("getDetailData res", res)
                this.detail = res;
            }).catch(err => {
                console.log('getDetailData err', err)
            }).finally(() => {
                this.loading = false;
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
                background: #F3F3F3;
                border-radius: 4px 4px 4px 4px;
            }
            .p1{
                height: 28px;
                font-size: 16px;
                color: rgba(0, 0, 0, 0.85);
                line-height: 28px;
            }
            .p2{
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
