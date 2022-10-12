<template>
<div class="InformationInfo gray-panel no-margin">
    <div class="panel-content">
        <!-- <div class="search">
            <a-input-search v-model:value="searchKey" :placeholder="'搜索成员和标签'" @onSearch="clickSearch"/>
        </div> -->
        <!-- $Util.timeFormat(detail.create_time, 'YYYY/MM/DD') -->
        <div class="list" >
            <div  class="day-content" >
                <div class="day-item tag" >
                    <div class="tag-bg">今天</div>
                </div>
            </div>
        </div>

        <div class="list">
            <div class="day-content" v-for="(item, i) in recordTableData"  :key="i">
                <div class="day-item" >
                    <div class="panel">
                        <div class="top">
                            <span class="item-title">{{$Util.CRMActionRecordTypeMapFilter(item.type, $i18n.locale) || '-'  }}</span>
                            <span class="item-time"><i class="" style="color:blue"/>{{$Util.timeFilter(item.create_time) || '-'}}</span>
                        </div>
                        <div class="content">
                            <div class="line">{{ item.content }}</div>
<!--                            <div class="line grey">来自客户:{{ item.contact? item.contact.name : "-"}}</div>-->
                        </div>
                        <div class="foot">
                            <div class="line">操作人:{{ item.operator_name }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Core from '../../../core';
const USER_TYPE = Core.Const.USER.TYPE

export default {
    name: 'InformationInfo',
    components: {},
    props: {
        detail:{
            type: Object,
        },
        targetId: {
            type: Number,
            default: 0
        },
        targetType: {
            type: Number,
            default: 0
        },

    },
    data() {
        return {
            Core,
            searchType: [
                { name: '跟进记录', key: '1' },
                { name: '操作日志', key: '2' },
            ],
            TYPE: Core.Const.CRM_ACTION_RECORD.TYPE,
            activeType: '1',
            USER_TYPE,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 表格数据
            tableData: [],
            // 表格数据
            recordTableData: [],

            userId: '',
            userDetail: '',
            initLoading: false,

            searchKey: '',
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang
        },
    },
    mounted() {
        if (this.targetType == Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.ORDER){
            this.searchType = this.searchType.slice(1)
            this.activeType= '2'
        }

        this.getCrmActionRecordTableData();
    },
    methods: {
        changeTimeTitle(time) {
            let today = this.$Util.timeFormat(new Date().value() / 1000, 'YYYY/MM/DD');
            let day = this.$Util.timeFormat(time, 'YYYY/MM/DD');
            if(today === day) {
                return `今天 ${this.$Util.timeFormat(time, 'mm:ss')}`
            } else {
                return this.$Util.timeFormat(time, 'YYYY/MM/DD mm:ss')
            }
        },
        // 切换类型
        clickType(item) {
            this.activeType = item.key;
        },
        // 点击添加
        clickAdd() {},
        // 点击编辑
        clickEidt() {},
        // 点击搜索
        clickSearch(key) {
            console.log('click search >>', key);
        },
        pageChange(curr) {    // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {    // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        getCRMTrackRecordTableData() {    // 获取 跟进记录
            this.loading = true;
            Core.Api.CRMTrackRecord.list({
                target_id: this.targetId,
                target_type: this.targetType,
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res", res)
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getCrmActionRecordTableData() {    // 获取 表格 数据
            this.loading = true;
            Core.Api.CrmActionRecord.list({
                target_id: this.targetId,
                target_type: this.targetType,
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res", res)
                this.total = res.count;
                res.list.forEach(it =>{
                    it.content = this.actionParsing(it.type, it.content, it.operator_name)
                })
                console.log("getTableData res2", res)
                this.recordTableData = res.list;
            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        actionParsing(type, content, user) {
            if (content === ""){
                return ""
            }
            let item = JSON.parse(content)
            console.log("type", type)
            console.log("item", item)
            if(type >= 1000 && type < 2000) {
                switch (type) {
                    case this.TYPE.CREATE_CUSTOMER: return " 创建了该客户"; break;
                    case this.TYPE.DELETE_CUSTOMER: return " 将该客户删除了"; break;
                    case this.TYPE.OBTAIN_CUSTOMER: return " 领取了该客户"; break;
                    case this.TYPE.RETURN_POOL: return " 将该客户退回了公海"; break;
                    case this.TYPE.CREATE_ORDER_INCOME: return " 创建了新的回款单"; break;
                    case this.TYPE.DELETE_ORDER_INCOME: return " 删除了回款单"; break;
                    case this.TYPE.AUDIT_PASS: return "审核人 " + user +" 审核通过"; break;
                    case this.TYPE.AUDIT_REFUSE: return "审核人 " + user +" 审核未通过"; break;
                }
            } else if(type >= 2000 && type < 3000) {
                switch (type) {
                    case this.TYPE.DISTRIBUTE_CUSTOMER: return user + " 将客户分配给了: " + item.user_name; break;
                    case this.TYPE.CUSTOMER_TO_OTHERS: return user + " 将客户转交给了: " + item.user_name; break;
                    case this.TYPE.CREATE_BO: return user + " 创建了新的商机：" + item.bo_name; break;
                    case this.TYPE.DELETE_BO: return user + " 删除了商机：" + item.bo_name; break;
                    case this.TYPE.UPDATE_BO_STATUS: return user + " 更新了商机阶段："; break;
                    case this.TYPE.BO_TO_OTHERS: return user + " 将商机转交给了: " + item.user_name; break;
                    case this.TYPE.CREATE_ORDER: return user + " 创建了新的合同订单: " + item.order_name; break;
                    case this.TYPE.DELETE_ORDER: return user + " 删除了合同订单: " + item.order_name; break;
                    case this.TYPE.REFUND: return user + " 向客户退款: " + item.money + " 元"; break;
                    case this.TYPE.CANCEL_REFUND: return user + " 取消退款: " + item.money + " 元"; break;
                    case this.TYPE.CREATE_CONTACT: return user + " 创建了新的联系人: " + item.contact_name; break;
                    case this.TYPE.ADD_CONTACT: return user + " 添加了联系人: " + item.contact_name; break;
                    case this.TYPE.DELETE_CONTACT: return user + " 删除了联系人: " + item.contact_name; break;
                    case this.TYPE.ADD_MEMBER: return user + " 添加团队成员: " + item.user_name; break;
                    case this.TYPE.DELETE_MEMBER: return user + " 删除团队成员: " + item.user_name; break;
                    case this.TYPE.ADD_TRACK_RECORD: return user + " 添加了新的跟进记录"; break;
                    case this.TYPE.DELETE_TRACK_RECORD: return user + " 删除了跟进记录"; break;
                    case this.TYPE.ADD_LABEL: return user + " 添加了标签: " + item.label; break;
                    case this.TYPE.DELETE_LABEL: return user + " 删除了标签: " + item.label; break;
                }
            } else if(type >= 3000 && type < 4000) {
                item = item.content
                let con = ""
                item.forEach(it => {
                  con += "将 " + this.$t(it.key)+" 从【" + this.valueParsing(it.key, it.old_value) + "】更新为【" + this.valueParsing(it.key, it.new_value) + "】, "
                })
                return con
                // switch (type) {
                //     case this.TYPE.REVISE_CUSTOMER: return user + " 将客户分配给了 "; break;
                //     case this.TYPE.REVISE_CONTACT: return user + " 将客户分配给了 "; break;
                //     case this.TYPE.REVISE_TRACK_RECORD: return user + " 将客户分配给了 "; break;
                //     case this.TYPE.REVISE_BO: return user + " 将客户分配给了 "; break;
                //     case this.TYPE.REVISE_ORDER: return user + " 将客户分配给了 "; break;
                //     case this.TYPE.REVISE_ORDER_INCOME: return user + " 将客户分配给了 "; break;
                // }
            }
            //
            // switch (type) {
            //     //类型1 操作人领取了客户
            //         // return user + Core.Util.CRMActionRecordTypeMapFilter(type, this.lang)
            //
            //     //类型2 将商机转交给另一操作人
            //     case this.TYPE.DISTRIBUTE_CUSTOMER:
            //         return user + Core.Util.CRMActionRecordTypeMapFilter(type, this.lang) + item.user_name
            //
            //     //类型3 客户信息修改
            //     case this.TYPE.REVISE_CUSTOMER:
            //         item = item.content
            //         // console.log("con",item)
            //         let con = ""
            //         // for (let key of item.keys()){
            //         //     con += "将" + key + "从" + item[key].old_value + "改为" + item[key].new_value
            //         // }
            //         // for(let i=0; i < item.length; i++)
            //         // {
            //         //     con += "将" + item[i].key + "从" + item[i].old_value + "改为" + item[i].new_value
            //         //     console.log("con",item[i].key)
            //         // }
            //         item.forEach(it => {
            //             con += "将" + this.$t(it.key)+"从" + this.valueParsing(it.key, it.old_value) + "改为" + this.valueParsing(it.key, it.new_value) + ","
            //         })
            //         console.log("con", user + Core.Util.CRMActionRecordTypeMapFilter(type, this.lang) + con)
            //         return user + con
            // }
            return item
        },
        valueParsing(key, value) {
            switch (key) {
                case "crm_c.type" : return this.$Util.CRMCustomerTypeFilter(value, this.lang)
                case "crm_c.level" : return this.$Util.CRMCustomerLevelFilter(value, this.lang)
                case "crm_c.industry" : return this.$Util.CRMCustomerIndustryFilter(value, this.lang)
                case "crm_c.gender" : return this.$Util.CRMCustomerGenderFilter(value, this.lang)
                case "crm_c.marital_status" : return this.$Util.CRMCustomerMaritalStatusFilter(value, this.lang)
                case "crm_b.source" : return this.$Util.CRMBoSourceMapFilter(value, this.lang)
                case "crm_b.track_status" : return this.$Util.CRMTrackStatusMapFilter(value, this.lang)
                case "crm_b.lost_reason" : return this.$Util.CRMBoLostReasonFilter(value, this.lang)
                case "crm_o.type" : return this.$Util.CRMOrderTypeFilter(value, this.lang)
                case "crm_o.status" : return this.$Util.CRMOrderStatusFilter(value, this.lang)
                case "crm_oi.type" : return this.$Util.CRMOrderIncomeTypeFilter(value, this.lang)
                case "crm_oi.status" : return this.$Util.CRMOrderIncomeStatusFilter(value, this.lang)
                case "crm_oi.payment_type" : return this.$Util.CRMOrderIncomePaymentTypeFilter(value, this.lang)
                case "crm_r.type" : return this.$Util.CRMRefundRecordTypeMapFilter(value, this.lang)

            }
            return value
        }

    }
};
</script>

<style lang="less" scoped>
.InformationInfo {
    .table-container {
        margin-top: -10px;
    }

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
                content: "";
                position: absolute;
                // top: 5px;
                left: 0;
                width: 10px;
                height: 10px;
                border: 2px solid @BC_P;
                border-radius: 50%;
            }
            &:after {
                content: "";
                position: absolute;
                left: 4px;
                top: 14px;
                width: 1px;
                height: 100%;
                border-left: 2px solid #F8FAFC;
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
                    content: "";
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
                background-color: #F8FAFC;
                .top {
                    .flex(space-between, center, row);
                    .item-title {
                        font-size: 14px;
                        font-weight: bold;
                    }
                    .item-time {
                        font-size: 12px;
                        color: @TC_tip;
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
</style>
