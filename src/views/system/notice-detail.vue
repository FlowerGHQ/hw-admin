<template>
    <div id="NoticeDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('no.detail') }}</div>
            <div class="btns-area" v-if="$auth('ADMIN')">
                <a-button type="primary" ghost @click="routerChange('edit')"
                    ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                >
                <a-button type="danger" ghost @click="handleDelete()"
                    ><i class="icon i_delete" />{{ $t('def.delete') }}</a-button
                >
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content">
                <h1 class="title">{{ detail.title }}</h1>
                <div class="desc-title">
                    <div class="key"><span v-html="detail.content"></span></div>
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
        this.notice_id = Number(this.$route.query.id) || 0;
        this.getNoticeDetail();
    },
    methods: {
        routerChange(type) {
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/system/notice-edit',
                        query: { id: this.notice_id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'list': // 列表
                    routeUrl = this.$router.resolve({
                        path: '/system/notice-list',
                        query: { id: this.notice_id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getNoticeDetail() {
            this.loading = true;
            Core.Api.Notice.detail({
                id: this.notice_id,
            })
                .then(res => {
                    console.log('getNoticeDetail res', res);
                    this.detail = res.detail;
                })
                .catch(err => {
                    console.log('getNoticeDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // 删除消息
        handleDelete() {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Notice.delete({ id: _this.notice_id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.routerChange('list');
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
    },
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
