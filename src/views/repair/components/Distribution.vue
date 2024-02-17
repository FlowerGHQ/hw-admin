<template>
    <div class="Distribution">
        <div class="gray-panel info">
            <div class="panel-title">
                <div class="left"><span>工单负责人分配</span></div>
            </div>
            <div class="panel-content">
                <!-- 维修人员 -->
                <div class="form-content">
                    <div class="form-item required spitem">
                        <div class="key">工单负责人</div>
                        <div class="value">
                            <a-select v-model:value="form.repair_user_id" placeholder="请选择工单负责人">
                                <a-select-option v-for="item of staffList" :key="item.id" :value="item.id">{{
                                    item.account.name
                                }}</a-select-option>
                            </a-select>
                        </div>
                        <div class="sp">
                            <a-button type="link" @click="routerChange('staff')">新建维修工</a-button>
                            <a-button type="link" @click="getStaffList('refresh')">刷新</a-button>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">计划时间</div>
                        <div class="value">
                            <a-date-picker v-model:value="form.plan_time" valueFormat="YYYY-MM-DD HH:mm:ss" />
                        </div>
                    </div>
                    <div class="form-item textarea">
                        <div class="key">维修备注</div>
                        <div class="value">
                            <a-textarea
                                v-model:value="form.repair_message"
                                placeholder="请输入维修备注"
                                :auto-size="{ minRows: 2, maxRows: 2 }"
                                :maxlength="500"
                            />
                            <span class="content-length">{{ form.repair_message.length }}/500</span>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key"></div>
                        <div class="value">
                            <a-button @click="handleSubmit" type="primary" style="border-radius: 2px"
                                >确认分配</a-button
                            >
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-btns"></div>
        </div>
    </div>
</template>

<script>
import Core from '../../../core';
import dayjs from 'dayjs';
export default {
    name: 'CheckResult',
    components: {},
    props: {
        id: {
            type: Number,
        },
        detail: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            activeKey: ['affirm', 'change'],
            staffList: [], // 用户列表
            form: {
                id: '',

                repair_user_id: undefined, // 工单负责人
                plan_time: undefined, // 计划时间
                // finish_time: undefined, // 完成时间
                repair_message: '', // 处理信息、工单备注
            },
        };
    },
    watch: {},
    computed: {},
    mounted() {
        console.log(this.failTotle);
        this.getStaffList();
        this.form.id = this.id;
    },
    methods: {
        // 页面跳转
        routerChange(type, item) {
            let routeUrl;
            switch (type) {
                case 'staff': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/system/user-edit',
                        query: {
                            org_id: Core.Data.getOrgId(),
                            org_type: Core.Data.getOrgType(),
                            type: Core.Const.USER.TYPE.WORKER,
                        },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },

        // 获取 用户列表
        getStaffList(val) {
            console.log(Core.Data.getUser().org_type);
            Core.Api.User.list({
                page: 0,
                type: Core.Const.USER.TYPE.WORKER,
                org_id: Core.Data.getOrgId(),
                org_type: Core.Data.getOrgType(),
            }).then(res => {
                this.staffList = res.list;
                if (val == 'refresh') {
                    this.$message.success(this.$t('pop_up.flash'));
                }
            });
        },

        // 表单提交
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form);

            form.plan_time = form.plan_time ? dayjs(form.plan_time).unix() : 0;
            // form.finish_time = form.finish_time ? dayjs(form.finish_time).unix() : 0
            console.log('handleSubmit form:', form);
            if (!form.repair_user_id) {
                return this.$message.warning('请选择工单负责人');
            }
            Core.Api.Repair.hand(form)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.$emit('submit');
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
    },
};
</script>

<style lang="less">
.Distribution {
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
