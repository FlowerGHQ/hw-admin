<template>
    <div id="NoticeDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">消息详情</div>
            <div class="btns-area">
                <a-button type="primary" ghost @click="routerChange('edit')"><i class="icon i_edit"/>编辑</a-button>
                <a-button type="danger" ghost @click="handleDelete()"><i class="icon i_delete"/>删除</a-button>
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content">
                <h1 class="title"> {{ detail.title }} </h1>
                <div class="desc-title">
                    <div class="key"><span v-html='detail.content'></span></div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import Core from '../../core';

export default {
    name: 'NoticeDetail',
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            //标签页
            notice_id: 0,
            detail: {
                id: '',
                title: '',
                type: 0,
                content: '',

            },
        };
    },
    watch: {},
    computed: {},
    created() {
        this.notice_id = Number(this.$route.query.id) || 0
        this.getNoticeDetail();
    },
    methods: {
        routerChange(type) {
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/notice/notice-edit",
                        query: {id: this.notice_id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'list':  // 列表
                    routeUrl = this.$router.resolve({
                        path: "/notice/notice-list",
                        query: {id: this.notice_id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'notice-detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/notice/notice-detail",
                        query: {id: this.detail.notice_id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;

            }
        },
        // 删除详情页
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该消息吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    console.log(_this.notice_id);
                    Core.Api.Notice.delete({id:_this.notice_id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.routerChange('list');
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        getNoticeDetail() {
            this.loading = true;
            Core.Api.Notice.detail({
                id: this.notice_id,
            }).then(res => {
                console.log('getNoticeDetail res', res)
                this.detail = res.detail
            }).catch(err => {
                console.log('getNoticeDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleStatusChange() {
            let _this = this;
            this.$confirm({
                title: `确定要${_this.detail.status ? '禁用' : '启用'}该门店吗？`,
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Store.updateStatus({id: _this.detail.id}).then(() => {
                        _this.$message.success(`${_this.detail.status ? '禁用' : '启用'}成功`);
                        _this.getStoreDetail();
                    }).catch(err => {
                        console.log("handleStatusChange err", err);
                    })
                },
            });
        }
    }
};
</script>

<style lang="less" scoped>
#NoticeDetail {
    .gray-panel {
        .title {
            font-size: 30px;
            text-align: center;
            margin-bottom: 20px;
        }
    }
}


</style>

