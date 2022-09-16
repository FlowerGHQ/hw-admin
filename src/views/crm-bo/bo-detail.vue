<template>
    <div id="CustomerEdit" class="edit-container">
        <div class="title-container">
                <div class="title-area">{{  $t('crm_b.detail')  }}
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content desc-container">
                <div class="desc-title">
                    <div class="title-area">
                        <span class="title">{{ detail.name }}</span>
                    </div>
                </div>
                <a-row class="desc-detail">
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('crm_b.customer_name') }}：</span>
                        <span class="value">{{detail.customer_name}}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('crm_b.money') }}：</span>
                        <span class="value">{{detail.money}}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('crm_b.estimated_deal_time') }}：</span>
                        <span class="value">{{$Util.timeFilter(detail.estimated_deal_time)}}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('crm_b.customer_name') }}：</span>
                        <span class="value">{{detail.customer_name}}</span>
                    </a-col>

                    <a-col :xs='24' :sm='24' :lg='24' class='detail-item'>
                        <FollowUpShow :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.BO"/>
                        <a-button @click="routerChange('edit')">编辑</a-button>
                        <CustomerSelect @select="handleAddCustomerShow" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.BO" :addCustomerBtn="true"/>
                        <a-button>新建订单</a-button>
                        <a-button>移交</a-button>
                        <a-button>删除</a-button>
                    </a-col>
                </a-row>
                <div class="panel-content">
                    <MySteps :stepsList='groupStatusTableData' :current='detail.status'></MySteps>
                </div>
            </div>
        </div>
        <a-row >
            <a-col :xs='24' :sm='24' :lg='16' >
                <div class="tabs-container">
                    <a-tabs v-model:activeKey="activeKey">
                        <a-tab-pane key="CustomerSituation" :tab="$t('crm_c.summary_information')">
                            <CustomerSituation :detail="detail"/>
                        </a-tab-pane>
                        <a-tab-pane key="InformationInfo" :tab="$t('crm_c.related')">
                            <Contact :detail="detail"/>
                            <Bo :detail="detail"/>
                            <Bo :detail="detail"/>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
            <a-col :xs='24' :sm='24' :lg='8' >
                <div class="tabs-container">
                    <a-tabs v-model:activeKey="activeKey">
                        <a-tab-pane key="CustomerSituation" :tab="$t('d.manage_employees')">
                            <TrackRecord :detail="detail"/>
                        </a-tab-pane>
                        <a-tab-pane key="InformationInfo" :tab="$t('d.manage_employees')">
                            <TrackRecord :detail="detail"/>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import Core from '../../core';
import Contact from './components/Contact.vue';
import CustomerSituation from './components/CustomerSituation.vue';
import Bo from './components/Bo.vue';
import TrackRecord from './components/TrackRecord.vue';
import FollowUpShow from '@/components/crm/popup-btn/FollowUpShow.vue';
import CustomerAdd from '@/components/crm/popup-btn/CustomerAdd.vue';
import CustomerSelect from '@/components/crm/popup-btn/CustomerSelect.vue';
import MySteps from "@/components/common/MySteps.vue"
import dayjs from "dayjs";
import {get} from "lodash";

export default {
    name: 'CustomerEdit',
    components: { FollowUpShow, CustomerAdd, CustomerSelect, MySteps, Contact, Bo, TrackRecord, CustomerSituation},
    props: {},
    data() {
        return {
            Core,
            TYPE_MAP: Core.Const.CRM_TRACK_RECORD.TYPE_MAP,
            INTENT_MAP: Core.Const.CRM_TRACK_RECORD.INTENT_MAP,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,

            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            detail: {},
            TrackRecordShow: false,
            trackRecordForm: {
                type: '',
                content: "",
                contact_customer_id: '',
                track_time: undefined,
                intent: "",
                next_track_time: undefined,
            },

            upload: { // 上传图片
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                coverList: [],
                detailList: [],
                headers: {
                    ContentType: false
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },
            fileUpload: {
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                fileList: [],
                headers: {
                    ContentType: false
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'file',
                },
            },
            groupStatusTableData: [],
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang
        }
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        if (this.id) {
            this.getBoDetail();
        }
        this.getGroupStatusDetail()
    },
    methods: {
        routerChange(type, item) {
            let routeUrl = ""
            switch (type) {
                case 'back':    // 返回
                    routeUrl = this.$router.resolve({
                        path: "/crm-customer/customer-list",
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'edit':  // 修改
                    routeUrl = this.$router.resolve({
                        path: "/crm-bo/bo-edit",
                        query: { id: this.detail.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        getBoDetail() {
            this.loading = true;
            Core.Api.CRMBo.detail({
                id: this.id,
            }).then(res => {
                console.log('getCustomerDetail res', res)
                let d = res.detail
                this.detail = d
                this.detail.birthday = this.detail.birthday ? dayjs.unix(this.detail.birthday).format('YYYY-MM-DD') : undefined
                for (const key in this.form) {
                    this.form[key] = d[key]
                }
                this.defAddr = [d.province, d.city, d.county]

                // this.defArea = [d.continent || '', d.country || '']
            }).catch(err => {
                console.log('getCustomerDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 添加联系人
        handleAddCustomerShow(ids, items) {

        },
        getGroupStatusDetail() {    // 获取 表格 数据
            this.loading = true;
            Core.Api.CRMBoStatusGroup.detail({
                id: 1,
            }).then(res => {
                this.groupStatusTableData = JSON.parse(res.detail.status_list)
            }).catch(err => {
                console.log('getTableData err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },
    }
};
</script>

<style lang="less">
.CustomerEdit {

    .icon {
        font-size: 12px;
    }
}
</style>
