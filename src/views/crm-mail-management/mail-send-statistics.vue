<template>
    <div id="CustomerList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('crm_b.mail_title') }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('add-mail')" v-if="$auth('crm-bo.save')"><i class="icon i_add"/>{{ $t('crm_b.add') }}</a-button>
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                        <a-input-group compact>
                            <!-- <div class="key">{{ $t('crm_b.title') }}：</div> -->
                            <a-button>{{ $t('crm_b.title') }}</a-button>
                            <a-input :placeholder="$t('def.input')" v-model:value="searchForm.title" @keydown.enter='handleSearch'/>
                        </a-input-group>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }" :row-key="record => record.id" :pagination='false' @change="getTableData">
                    <template #headerCell="{title}">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text , record, index }">
                        <template v-if="column.key === 'xh'">
                            {{ index + (currPage - 1) * pageSize + 1 }}
                        </template>
                        <template v-if="column.key === 'title'">
                            <p class="ell" style="width: 200px;" :title="text">{{ text || '-' }}</p>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'schedule_time'">
                            {{ text ? $Util.timeFilter(text) : '不定时发送' }}
                        </template>
                        <template v-if="column.key === 'email_content'">
                            <p class="ell" style="width: 400px;" :title="text">{{ text || '-' }}</p>
                        </template>
                        <template v-if="column.key === 'send_count'">
                            <template v-if="text">
                                <a @click="routerChange('situation', { id: record.id })">{{ text }}</a>
                            </template>
                            <template v-else>
                                <span>-</span>
                            </template>
                        </template>
                        <template v-if="column.key === 'send_success_count'">
                            {{ text ? `${text}（${record.send_count ? (text / record.send_count).toFixed(2) : 100}%）` : '-' }}
                        </template>
                        <template v-if="column.key === 'click_count'">
                            {{ text ? `${text}（${record.send_count ? (text / record.send_count).toFixed(2) : 100}%）` : '-' }}
                        </template>

                        <template v-if="column.key === 'operation'">
                            <template v-if="record.send_status === 0 && record.schedule_time">
                                <a-button type="link" @click="deleteMail(record.id)"><img class="operation-icon" src="@images/crm-mail-management/delete.svg">{{ $t('n.delete') }}</a-button>
                                <a-button type="link" @click="routerChange('add-mail', { id: record.id })"><img class="operation-icon" src="@images/crm-mail-management/write.svg">{{ $t('n.edit') }}</a-button>
                            </template>
                            <template v-else-if="record.send_status === 0 && !record.schedule_time">
                                <a-button type="link" @click="sendMail(record.id)"><img class="operation-icon" src="@images/crm-mail-management/send.svg">{{ $t('crm_b.send') }}</a-button>
                                <a-button type="link" @click="routerChange('add-mail', { id: record.id })"><img class="operation-icon" src="@images/crm-mail-management/write.svg">{{ $t('n.edit') }}</a-button>
                            </template>
                            <template v-else-if="record.send_status === 1">
                                <a-button type="link" @click="viewMail(record)"><img class="operation-icon" src="@images/crm-mail-management/view.svg">{{ $t('crm_b.view') }}</a-button>
                            </template>
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <a-pagination
                    v-model:current="currPage"
                    :page-size='pageSize'
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                    :hide-on-single-page='false'
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
        </div>
        <a-modal v-model:visible="mailShow" width="1248px" :title="$t('crm_b.preview')" :footer="null" :after-close='handleMailClose'>
            <mailTemplete :mailData="mailData"></mailTemplete>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../core';
import mailTemplete from './components/mail-templete.vue';
export default {
    name: 'mailSendStatistics',
    components: {
        mailTemplete
    },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            searchForm: {
                title: '',
            },
            // 表格
            tableData: [],
            mailShow: false,
            mailMes: {},
            mailData: {
                'title': '🎄Scooting Into a Joyful Christmas with HORWIN: A Grateful Thank You🎁',                
                'address': 'Dear XXX',
                'email_content': "As the joyful season approaches, we want to take a moment to express our sincere gratitude for the incredible partnership we've built together throughout 2023. Your dedication and commitment have been instrumental in the success of HORWIN, and for that, we are truly thankful.🎉Looking Forward to 2024:In the spirit of shared success, we're excited to outline our expectations for the upcoming year:🤝Your Feedback Matters:Your insights have always been invaluable to us. We invite you to share your feedback, suggestions, or any thoughts you might have. Your input will continue to shape the future of HORWIN, ensuring that we grow together.🫧Connect with Us on Social Media:Stay in the loop with exclusive updates, behind-the-scenes glimpses, and exciting announcements by following us on our social media channels.Wishing You a Merry Christmas and Prosperous New Year! Cheers to a Scootacular Christmas and@RWIN Horwinning New Year!",
                'poster': 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                'qrcode': '',
            }
        };
    },
    watch: {
        searchForm:{
            deep:true,
            handler(oldValue,newValue) {
                if(oldValue === newValue){
                    this.currPage = 1
                    this.pageSize = 20
                }
            },
        }
    },
    computed: {
        tableColumns() {
            let columns = [
                {title: 'n.index', dataIndex: 'xh', key:'xh'},
                {title: 'crm_b.title', dataIndex: 'title', key:'title'},
                {title: 'd.create_time', dataIndex: 'create_time', key: 'time'},
                {title: 'crm_b.schedule_time', dataIndex: 'schedule_time', key: 'schedule_time'},
                {title: 'crm_b.mail_content', dataIndex: 'email_content', key: 'email_content'},
                {title: 'crm_b.push', dataIndex: 'send_count', key: 'send_count'},
                {title: 'crm_b.push_success', dataIndex: 'send_success_count', key: 'send_success_count'},
                {title: 'crm_b.click_mail', dataIndex: 'click_count', key: 'click_count'},
                {title: 'def.operate', key: 'operation', fixed: 'right'},
            ]
            return columns
        },
        lang() {
            return this.$store.state.lang
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        /* 接口 start */
        // 获取 表格 数据
        getTableData() {
            this.loading = true;
            Core.Api.MAIL_MANAGEMENT.list({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res:", res)
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 删除邮件
        deleteMail(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.MAIL_MANAGEMENT.delete({ id }).then(res => {
                        _this.$message.success(_this.$t('crm_b.delete_success'))
                        _this.getTableData();
                    }).catch(err => {
                        _this.$message.success(_this.$t('crm_b.delete_error'))
                    })
                },
            });
        },
        // 发送邮件
        sendMail(id) {
            // Core.Api.MAIL_MANAGEMENT.send({ id }).then(res => {
            //     this.$message.success(this.$t('crm_b.send_success'))
            //     this.getTableData();
            // }).catch(err => {
            //     this.$message.success(this.$t('crm_b.send_error'))
            // })
        },
        /* 接口 end */
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'add-mail':
                    routeUrl = this.$router.resolve({
                        path: "/mail-management/add-mail",
                        query: item
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'situation':
                    this.$router.push({
                        path: "/mail-management/mail-send-situation",
                        query: item
                    })
                    break;
            }
        },
        pageChange(page) {          
            // 页码改变
            this.currPage = page;
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            this.pageSize = size;
            this.getTableData();
        },
        handleSearch() {
            // 搜索
            this.pageChange(this.currPage);
        },
        handleSearchReset() {    // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.pageChange(1);
        },
        handleMailClose() {
            this.mailShow = false;
        },
        handleMailSubmit() {},
        // 预览邮件
        viewMail(record) {
            this.mailMes = record;
            this.mailShow = true;
        },
    }
};
</script>

<style lang="less" scoped>
// #CustomerList {}
.search-text{
    margin-left: 30px;
    color: #006EF9;
    cursor: pointer;
}
.nameStyle{
  color: #9000f0;
}
.search-item {
    .ant-btn {
        border-color: #EAECF2;
        pointer-events: none;
    }
    .ant-input {
        text-align: left;
    }
}
.ell {
    .ell();
}
.operation-icon {
    margin-right: 4px;
}
.btns {
    text-align: center;
}
:deep(.ant-table .ant-table-container .ant-table-content table tbody.ant-table-tbody tr.ant-table-row td.ant-table-cell) {
    padding: 10px 16px;
    font-size: 14px;
    color: #1D2129;
}
:deep(.ant-table .ant-table-container .ant-table-content table thead.ant-table-thead tr th.ant-table-cell) {
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #1D2129;
}
.ant-table .ant-table-container .ant-table-content table tbody.ant-table-tbody tr.ant-table-row td.ant-table-cell .ant-btn {
    font-size: 14px;
}
</style>
