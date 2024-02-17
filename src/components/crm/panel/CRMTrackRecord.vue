<template>
    <div class="CRMTrackRecord gray-panel no-margin">
        <div class="panel-title">
            <div class="title" v-if="$i18n.locale === 'en'">{{ $t('crm_t.track_record') }}</div>
            <div class="left-wrap" v-if="$i18n.locale === 'zh'">
                <div class="left-block">
                    <div>用户活跃时间：</div>
                    <div>{{ tableData.length ? $Util.timeFilter(tableData[0]?.create_time) : '-' }}</div>
                </div>
                <div class="left-block ml64">
                    <div>跟进次数：</div>
                    <div>{{ total || '0' }}次</div>
                </div>
            </div>
            <slot></slot>
        </div>
        <div class="panel-content">
            <div>
                <SimpleImageEmpty :desc="$t('crm_t.track_record_null')" v-if="!tableData.length" />
                <div class="list" v-for="(item, i) in tableData" :key="i" v-if="tableData.length">
                    <div class="day-content">
                        <!--                <div class="day-item tag" v-if="i === 0">-->
                        <!--                    <div class="tag-bg">今天</div>-->
                        <!--                </div>-->
                        <div class="day-item">
                            <div class="panel">
                                <div class="top">
                                    <span class="item-title">{{
                                        $Util.CRMTrackRecordFilter(item.type, $i18n.locale) || '-'
                                    }}</span>
                                    <span class="item-time" v-if="item.create_user_id === user.id">
                                        <FollowUpShow
                                            ref="followUp"
                                            btnType="link"
                                            :targetId="targetId"
                                            :targetType="targetType"
                                            :detail="item"
                                            @submit="getTableData"
                                            ><i class="icon i_edit"
                                        /></FollowUpShow>
                                        <a class="button" @click="handleDelete(item.id)"><i class="icon i_delete" /></a>
                                    </span>
                                </div>
                                <a-row>
                                    <a-col :xs="24" :sm="24" :lg="12" :xl="12" :xxl="12">
                                        <div class="content">
                                            <div class="line grey">{{ $t('crm_t.content') }}:</div>
                                            <div class="line">{{ item.content }}</div>
                                        </div>
                                    </a-col>
                                    <a-col :xs="24" :sm="24" :lg="12" :xl="12" :xxl="12" v-if="item.intent">
                                        <!-- 意向程度 -->
                                        <div class="content">
                                            <div class="line grey">{{ $t('crm_t.intent') }}:</div>
                                            <div class="line">
                                                {{ $Util.CRMTrackRecordIntentFilter(item.intent, lang, DEGREE_INTENT) }}
                                            </div>
                                        </div>
                                    </a-col>
                                </a-row>
                                <a-row>
                                    <a-col
                                        :xs="24"
                                        :sm="24"
                                        :lg="12"
                                        :xl="12"
                                        :xxl="12"
                                        v-if="item.contact != undefined"
                                    >
                                        <div class="content">
                                            <div class="line grey">{{ $t('crm_t.contact_customer') }}:</div>
                                            <div class="line">{{ item.contact ? item.contact.name : '-' }}</div>
                                        </div>
                                    </a-col>
                                    <a-col
                                        :xs="24"
                                        :sm="24"
                                        :lg="12"
                                        :xl="12"
                                        :xxl="12"
                                        v-if="item.next_track_time != 0"
                                    >
                                        <div class="content">
                                            <div class="line grey">{{ $t('crm_t.next_track_time') }}:</div>
                                            <div class="line">{{ $Util.timeFilter(item.next_track_time) }}</div>
                                        </div>
                                    </a-col>
                                    <!-- 意向度 -->
                                    <a-col :xs="24" :sm="24" :lg="12" :xl="12" :xxl="12">
                                        <div class="content">
                                            <div class="line grey">{{ $t('crm_c.intentionality') }}:</div>
                                            <div class="line">
                                                {{ $Util.CRMTrackChinaIntentFilter(item.intention) || '-' }}
                                            </div>
                                        </div>
                                    </a-col>
                                </a-row>
                                <a-row>
                                    <a-col
                                        :xs="24"
                                        :sm="24"
                                        :lg="12"
                                        :xl="12"
                                        :xxl="12"
                                        v-if="item.next_track_plan != ''"
                                    >
                                        <div class="content">
                                            <div class="line grey">{{ $t('crm_t.next_track_plan') }}:</div>
                                            <div class="line">{{ item.next_track_plan }}</div>
                                        </div>
                                    </a-col>
                                </a-row>
                                <div class="content">
                                    <div class="line grey" v-if="item.image_attachment_list != ''">
                                        {{ $t('crm_t.images') }}:
                                    </div>
                                    <div class="line">
                                        <a-image
                                            v-for="it in item.image_attachment_list"
                                            class="image"
                                            :src="$Util.imageFilter(it.path)"
                                            :fallback="$t('def.none')"
                                        />
                                    </div>
                                </div>
                                <div class="content">
                                    <div class="line grey" v-if="item.file_attachment_list != ''">
                                        {{ $t('crm_t.file') }}:
                                    </div>
                                    <div class="line">
                                        <div class="list" v-for="i in item.file_attachment_list">
                                            <a @click="handleDownload(i)">{{ i.name }}</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="foot" v-if="item.create_user_name != undefined">
                                    <div class="line">{{ $t('crm_t.operator') }}:{{ item.create_user_name }}</div>
                                    <div class="content">
                                        <!--                                    {{$t('crm_t.operator')}}:{{ item.create_user_name }}-->
                                        <div class="line grey">{{ $Util.timeFilter(item.create_time) || '-' }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="paging-container" v-if="tableData.length">
                    <a-pagination
                        v-model:current="currPage"
                        :page-size="pageSize"
                        :total="total"
                        show-quick-jumper
                        show-size-changer
                        show-less-items
                        :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                        :hide-on-single-page="false"
                        :pageSizeOptions="['10', '20', '30', '40']"
                        @change="pageChange"
                        @showSizeChange="pageSizeChange"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../../core';
import FollowUpShow from '@/components/crm/popup-btn/FollowUpShow.vue';
import SimpleImageEmpty from '@/components/common/SimpleImageEmpty.vue';

export default {
    name: 'CRMTrackRecord',
    components: { FollowUpShow, SimpleImageEmpty },
    props: {
        detail: {
            type: Object,
        },
        targetId: {
            type: Number,
            default: 0,
        },
        targetType: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            DEGREE_INTENT: Core.Const.CRM_TRACK_RECORD.DEGREE_INTENT, // 意向程度list
            loginType: Core.Data.getLoginType(),
            user: Core.Data.getUser(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 表格数据
            tableData: [],
            trackMemberShow: false,

            userId: '',
            userDetail: '',
            groupStatusTableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: 'crm_t.name', dataIndex: 'name', key: 'detail', sorter: true },
                { title: 'crm_t.content', dataIndex: 'content', key: 'detail', sorter: true },
                { title: 'crm_r.from_customer', dataIndex: 'create_user_name', key: 'detail', sorter: true },
                { title: 'n.operator', dataIndex: 'create_user_name', key: 'detail', sorter: true },

                { title: 'def.operate', key: 'operation', fixed: 'right' },
            ];
            return columns;
        },
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'detail': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/crm-bo/bo-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/crm-bo/bo-edit',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            console.log('pageSizeChange size:', size);
            this.pageSize = size;
            this.getTableData();
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.CRMTrackRecord.list({
                target_id: this.targetId,
                target_type: this.targetType,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.total = res.count;
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMTrackRecord.delete({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete -> err', err);
                        });
                },
            });
        },
        // 下载附件
        handleDownload(record) {
            console.log('handleDownload record:', record);
            let url = Core.Const.NET.FILE_URL_PREFIX + record.path;
            window.open(url, '_self');
        },
        // 父组件调用刷新数据
        onUpdate() {},
    },
};
</script>

<style lang="less" scoped>
.CRMTrackRecord {
    .table-container {
        margin-top: -10px;
    }
    .ant-image-img {
        width: 50px;
    }
    .panel-content {
        .title {
            position: relative;
            width: 100%;
            font-size: 14px;
            margin-bottom: 20px;
            .tab {
                margin-left: 10px;
                padding-right: 10px;
                display: inline-block;
                color: @TC_tip;
                border-right: 1px solid @TC_tip;
                cursor: pointer;
                &:hover {
                    color: @TC_P;
                }
                &:first-child {
                    margin-left: 0;
                }
                &:last-child {
                    border-right: none;
                }
            }
            .active {
                color: @TC_P;
            }
        }
        .list {
            .day-content {
                position: relative;
                width: 100%;
            }
            .day-item {
                position: relative;
                box-sizing: border-box;
                padding-left: 20px;
                margin-bottom: 15px;
                // border: 1px solid red;
                &:before {
                    content: '';
                    position: absolute;
                    // top: 5px;
                    left: 0;
                    width: 10px;
                    height: 10px;
                    border: 2px solid @BC_P;
                    border-radius: 50%;
                }
                &:after {
                    content: '';
                    position: absolute;
                    left: 4px;
                    top: 14px;
                    width: 1px;
                    height: 100%;
                    border-left: 2px solid #f8fafc;
                }
                .tag-bg {
                    position: relative;
                    display: inline-block;
                    margin-left: 12px;
                    padding-right: 8px;
                    height: 20px;
                    line-height: 20px;
                    background-color: @BC_P;
                    color: @TC_L;
                    font-size: 12px;
                    &:before {
                        content: '';
                        position: absolute;
                        left: -10px;
                        width: 0;
                        height: 0;
                        border-top: 10px solid transparent;
                        border-right: 10px solid @BC_P;
                        border-bottom: 10px solid transparent;
                    }
                }
                .panel {
                    padding: 12px;
                    width: 100%;
                    background-color: #f8fafc;
                    .top {
                        .flex(space-between, center, row);
                        .item-title {
                            font-size: 14px;
                            font-weight: bold;
                        }
                        .item-time {
                            font-size: 12px;
                            color: @TC_tip;
                            a {
                                padding-right: 5px;
                            }
                        }
                    }
                    .content {
                        margin-top: 6px;
                    }
                    .foot {
                        text-align: right;
                    }
                    .line {
                        line-height: 20px;
                        font-size: 12px;
                        word-wrap: break-word;
                        word-break: normal;
                    }
                    .grey {
                        color: @TC_tip;
                    }
                }
            }
            .tag {
                &:before {
                    top: 6px;
                    background-color: @BC_P;
                }
                &:after {
                    top: 20px;
                    height: calc(100% - 6px);
                }
            }
        }
    }
    .left-wrap {
        display: flex;
    }
    .left-block {
        display: flex;
        flex-direction: column;
        color: #828282;
        font-size: 12px;
        margin-left: 5px;
        &.ml64 {
            margin-left: 64px;
        }
    }
}
</style>
