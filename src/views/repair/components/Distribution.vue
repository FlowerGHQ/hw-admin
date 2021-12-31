<template>

<div class="CheckResult">
    <div class="gray-panel info">
        <div class="panel-title">
            <div class="left">
                <span>工单负责人分配</span>
            </div>
        </div>
    <div class="panel-content" > <!-- 维修人员 -->
        <div class="form-content">
            <div class="form-item required spitem">
                <div class="key">工单负责人</div>
                <div class="value">
                    <a-select v-model:value="form.repair_user_id" placeholder="请选择工单负责人">
                        <a-select-option v-for="item of staffList" :key="item.id" :value="item.id">{{item.account.name}}</a-select-option>
                    </a-select>
                </div>
                <div class="sp">
                    <a-button type="link" @click="routerChange('staff')">新建员工</a-button>
                    <a-button type="link" @click="getStaffList('refresh')">刷新</a-button>
                </div>
            </div>
            <div class="form-item">
                <div class="key">计划时间</div>
                <div class="value">
                    <a-date-picker v-model:value="form.plan_time" valueFormat='YYYY-MM-DD HH:mm:ss'/>
                </div>
            </div>
            <!--            <div class="form-item">-->
            <!--                <div class="key">完成时间</div>-->
            <!--                <div class="value">-->
            <!--                    <a-date-picker v-model:value="form.finish_time" valueFormat='YYYY-MM-DD HH:mm:ss'/>-->
            <!--                </div>-->
            <!--            </div>-->
            <div class="form-item textarea">
                <div class="key">维修备注</div>
                <div class="value">
                    <a-textarea v-model:value="form.repair_message" placeholder="请输入维修备注" :auto-size="{ minRows: 2, maxRows: 2 }" :maxlength='500'/>
                    <span class="content-length">{{form.repair_message.length}}/500</span>
                </div>
            </div>
            <div class="form-item">
                <div class="key"></div>
                <div class="value">
                    <a-button @click="handleSubmit" type="primary">确定</a-button>
                </div>
            </div>

        </div>
    </div>
    <div class="form-btns">
    </div>
    </div>
</div>
</template>

<script>
import Core from '../../../core';
import ItemSelect from '@/components/ItemSelect.vue';
import dayjs from "dayjs";
const REPAIR = Core.Const.REPAIR
export default {
    name: 'CheckResult',
    components: {
        ItemSelect
    },
    props: {
        id: {
            type: Number,
        },
        detail: {
            type: Object,
            default: () => {return {}}
        },
        faultList: {
            type: Array,
            default: () => {return []}
        },
        failList: {
            type: Array,
            default: () => {return []}
        },
        exchangeList: {
            type: Array,
            default: () => {return []}
        },
        failTotle: {
            type: Number,
        },
        exchangeTotle: {
            type: Number,
        }
    },
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            activeKey: ['affirm', 'change'],
            // faultMap: Core.Const.REPAIR.FAULT_OPTIONS_MAP,
            staffList: [], // 员工列表
            REPAIR,
            form: {
                id: '',

                repair_user_id: undefined, // 工单负责人
                plan_time: undefined, // 计划时间
                // finish_time: undefined, // 完成时间
                repair_message: "", // 处理信息、工单备注
                priority: 0, // 紧急程度

                /*
                "fail_remark": "string",
                "item_code": "string",
                "item_id": 0,
                "operate_time": 0,
                "operator_id": 0,
                "parent_id": 0,
                "parent_type": 0,
                "results": 0,
                */
            },
            // faultList: [],
            //
            // failList: [],
            // exchangeList: [],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        console.log(this.failTotle)
        this.getStaffList()
        this.form.id = this.id
        // this.getRepairDetail();
        // this.getRepairItemList();
        // this.getRepairFaultList()
    },
    methods: {

        // 页面跳转
        routerChange(type, item) {
            let routeUrl
            let WORKER = Core.Const.USER.TYPE.WORKER
            switch (type) {
                case 'staff':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/user/user-edit",
                        query: { type: WORKER}
                    })

                    window.open(routeUrl.href, '_blank')
                    break;
            }
        },

        // 获取 员工列表
        getStaffList(val) {
            console.log(Core.Data.getUser().org_type)
            Core.Api.User.list({
                page: 0,
                type: Core.Const.USER.TYPE.WORKER,
                org_id: Core.Data.getOrgId(),
                org_type: Core.Data.getOrgType(),
            }).then(res => {
                this.staffList = res.list
                if (val == 'refresh'){
                    this.$message.success('刷新成功')
                }
            });
        },
       /* // 获取工单详情
        getRepairDetail() {
            this.loading = true;
            Core.Api.Repair.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getRepairDetail res', res)
                this.detail = res
                this.form.id = res.id
                for (const key in this.form) {
                    this.form[key] = res[key]
                }
                this.form.customer_id = this.form.customer_id || undefined
                this.form.repair_user_id = this.form.repair_user_id || undefined
                this.form.plan_time = this.form.plan_time ? dayjs.unix(this.form.plan_time).format('YYYY-MM-DD HH:mm:ss') : undefined
                // this.form.finish_time = this.form.finish_time ? dayjs.unix(this.form.finish_time).format('YYYY-MM-DD HH:mm:ss') : undefined
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },*/

        // 表单提交
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)

            form.plan_time = form.plan_time ? dayjs(form.plan_time).unix() : 0
            // form.finish_time = form.finish_time ? dayjs(form.finish_time).unix() : 0
            console.log('handleSubmit form:', form)
            if (!form.repair_user_id) {
                this.$message.warning('请选择工单负责人')
                return 0
            }

            Core.Api.Repair.hand(form).then(() => {
                this.$message.success('保存成功')
                this.$emit('submit')

            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
    }
};
</script>

<style lang="less">
.CheckResult {
    .panel-content.change {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .ant-table-wrapper {
            width: calc(~'50% - 10px');
        }
    }
    .form-content {
        width: 500px;
        padding-left: 40px;
    }
    .spitem {
        position: relative;

    .sp {
        position: absolute;
        font-size: 12px;
        margin-left: 14px;
        left: 100%;
        .fcc();
        .ant-btn {
            font-size: 12px;
        }
    }
}
}

</style>
