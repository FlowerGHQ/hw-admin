<template>
    <div id="BomDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">BOM表详情</div>
            <div class="btns-area" v-if="$auth('ADMIN')">
                <EditBomModel @submit="getBomDetail" :ghost="true" :detail="detail">
                    <i class="icon i_edit" />编辑
                </EditBomModel>
                <a-button ghost danger @click="handleDelete()"
                    ><i class="icon i_delete" />删除</a-button
                >
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content desc-container">
                <div class="desc-title">
                    <div class="title-area">
                        <span class="title">{{ detail.name || '-' }}</span>
                    </div>
                </div>
                <a-row class="desc-detail">
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">对应商品：</span>
                        <span class="value">
                            <a-button type="link" @click="routerChange('item')" v-if="item && item.id">{{
                                item.name || '-'
                            }}</a-button>
                        </span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">版本号：</span>
                        <span class="value">{{ detail.version }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">创建时间：</span>
                        <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">更新时间：</span>
                        <span class="value">{{ $Util.timeFilter(detail.update_time) }}</span>
                    </a-col>
                </a-row>
            </div>
        </div>
        <div class="tabs-container">
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="BomItems" tab="BOM表明细">
                    <BomItems :bomId="bom_id" v-if="activeKey === 'BomItems'" />
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import EditBomModel from './components/EditBomModel.vue';
import BomItems from './components/BomItems.vue';

export default {
    name: 'BomDetail',
    components: {
        EditBomModel,
        BomItems,
    },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            // 详情
            bom_id: '',
            detail: {},
            item: {},
            //标签页
            activeKey: 'BomItems',

            // 上传
            upload: {
                action: Core.Const.NET.URL_POINT + '/admin/1/bom-item/import',
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'xlsx',
                    bom_id: '',
                    bom_name: '',
                },
            },
        };
    },
    watch: {},
    computed: {},
    created() {
        this.bom_id = Number(this.$route.query.id);
        this.getBomDetail();
    },
    methods: {
        routerChange(type) {
            let routeUrl = '';
            switch (type) {
                case 'item':
                    routeUrl = this.$router.resolve({
                        path: '/item/item-detail',
                        query: { id: this.item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'list':
                    routeUrl = this.$router.resolve({
                        path: '/manufacture/bom-list',
                        query: { id: this.item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
        getBomDetail() {
            this.loading = true;
            Core.Api.Bom.detail({
                id: this.bom_id,
            })
                .then(res => {
                    console.log('getBomDetail res', res);
                    let d = res.detail;
                    this.detail = d;
                    this.item = d.item ? d.item : {};
                    this.upload.data.bom_id = d.id;
                    this.upload.data.bom_name = d.name;
                })
                .catch(err => {
                    console.log('getBomDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 删除 零售商
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该Bom表吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    // console.log(this.agent_id);
                    Core.Api.Bom.delete({ id: _this.detail.id })
                        .then(() => {
                            _this.$message.success('删除成功');
                            _this.routerChange('list');
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },

        /* // 上传文件
        handleFileUpload({file, fileList}) {
            console.log("handleFileUpload status:", file.status, "file:", file)
            if (file.status == 'done') {
                let res = file.response
                if (res && res.code === 0) {
                    return this.$message.success('上传成功');
                } else {
                    return this.$message.error('上传失败:' + res.message)
                }
            }
            this.upload.fileList = fileList
        },*/
    },
};
</script>

<style lang="less" scoped>
// #BomDetail {}
</style>
