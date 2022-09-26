<template>
<div class="InformationInfo gray-panel no-margin">
    <div class="panel-content">
        <div class="title">
            <div class="tab" :class="{'active': activeType === item.key}" v-for="(item, i) in searchType" :key="i" @click="clickType(item)">
                {{ item.name }}
            </div>
        </div>
        <!-- <div class="search">
            <a-input-search v-model:value="searchKey" :placeholder="'搜索成员和标签'" @onSearch="clickSearch"/>
        </div> -->
        <!-- $Util.timeFormat(detail.create_time, 'YYYY/MM/DD') -->
        <div class="list" v-if="activeType === '1'" >
            <div  class="day-content" >
                <div class="day-item tag" >
                    <div class="tag-bg">今天</div>
                </div>
            </div>
        </div>

        <div class="list" v-if="activeType === '1'"  v-for="(item, i) in tableData" :key="i">
            <div  class="day-content" >
<!--                <div class="day-item tag" v-if="i === 0">-->
<!--                    <div class="tag-bg">今天</div>-->
<!--                </div>-->
                <div class="day-item">
                    <div class="panel">
                        <div class="top">
                            <span class="item-title">{{$Util.CRMTrackRecordFilter(item.type, $i18n.locale) || '-'  }}</span>
                            <span class="item-time"><i class="" style="color:blue"/>{{$Util.timeFilter(item.create_time) || '-'}}</span>
                        </div>
                        <div class="content">
                            <div class="line">{{ item.content }}</div>
                            <div class="line grey">{{$t('crm_r.from_customer')}}:{{ item.contact? item.contact.name : "-"}}</div>
                        </div>
                        <div class="foot">
                            <div class="line">{{$t('n.operator')}}:{{ item.create_user_name }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="list" v-if="activeType === '2'">
            <div class="day-content" v-for="(item, i) in recordTableData"  :key="i">
                <div class="day-item tag" v-if="i === 0">
                    <div class="tag-bg">今天</div>
                </div>
                <div class="day-item" >
                    <div class="panel">
                        <div class="top">
                            <span class="item-title">{{$Util.CRMTrackRecordFilter(item.type, $i18n.locale) || '-'  }}</span>
                            <span class="item-time"><i class="" style="color:blue"/>{{$Util.timeFilter(item.create_time) || '-'}}</span>
                        </div>
                        <div class="content">
                            <div class="line">{{ item.content }}</div>
                            <div class="line grey">来自客户:{{ item.contact? item.contact.name : "-"}}</div>
                        </div>
                        <div class="foot">
                            <div class="line">操作人:{{ item.create_user_name }}</div>
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
import br from "../../../../dist/assets/invoice-detail2.6547b016";
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
            searchType: [
                { name: '跟进记录', key: '1' },
                { name: '操作日志', key: '2' },
            ],
            TYPE: Core.CRM_ACTION_RECORD.TYPE,
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
        }
    },
    mounted() {
        this.getCRMTrackRecordTableData();
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
                this.recordTableData = res.list;
            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        actionParsing(type, content, user) {
            let item = JSON.parse(content)
            switch (type) {
                //类型1 操作人领取了客户
                case TYPE.CREATE_CUSTOMER:
                case TYPE.DELETE_CUSTOMER:
                    return user + Core.Util.CRMActionRecordTypeMapFilter(type, this.lang)
                //类型2 将商机转交给另一操作人
                case TYPE.BO_TO_OTHERS:
                    return user + Core.Util.CRMActionRecordTypeMapFilter(type, this.lang) + item.value
                //类型3 客户信息修改
                case TYPE.REVISE_CUSTOMER:
                    let con = ""
                    item.forEach(it => {
                        con += "将" + $t(it.key)+"从" + it.old_value + "改为" + it.new_value
                    })
                    return user + Core.Util.CRMActionRecordTypeMapFilter(type, this.lang) + con
            }
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
                    height: 20px;
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
