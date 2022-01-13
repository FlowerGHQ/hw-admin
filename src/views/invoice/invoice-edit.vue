<template>
    <div id="InvoiceEdit" class="edit-container">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">工单详情</div>
            </div>
            <div class="gray-panel info">
                <div class="panel-title">
                    <div class="left">
                        <span>工单编号</span> {{ detail.uid }}
                    </div>
                </div>
                <div class="panel-content">
                    <div class="info-item">
                        <div class="key">工单帐类</div>
                        <div class="value">{{ $Util.repairServiceFilter(detail.service_type || '-') }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">创建人</div>
                        <div class="value">{{ detail.user_name || '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">相关客户</div>
                        <div class="value">{{ detail.customer_name || '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">优先级</div>
                        <div class="value">{{ $Util.repairPriorityFilter(detail.priority) }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">创建时间</div>
                        <div class="value">{{ $Util.timeFilter(detail.create_time) || '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">计划时间</div>
                        <div class="value">{{ $Util.timeFilter(detail.plan_time) || '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">实施时间</div>
                        <div class="value">{{ $Util.timeFilter(detail.finish_time) || '-' }}</div>
                    </div>
                    <div class="info-item" v-if="detail.audit_message != ''">
                        <div class="key">未通过原因</div>
                        <div class="value">{{ detail.audit_message || '-' }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../core';

export default {
    name: 'InvoiceEdit',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            detail: {},
            typeList: Core.Const.STOCK_RECORD.PRODUCT_TYPE,
            form: {
                id: '',
                name: '',
                province: '',
                city: '',
                county: '',
                address: '',
                type: '',
            },
        };
    },
    watch: {},
    computed: {},

    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        this.getINvoiceDetail();
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
            }
        },
        // getINvoiceDetail() {
        //     this.loading = true;
        //     Core.Api.Invoice.detail({
        //         id: this.form.id,
        //     }).then(res => {
        //         console.log('getInvoiceDetail res', res)
        //         this.detail = res.detail
        //         for (const key in this.form) {
        //             this.form[key] = res.detail[key]
        //         }
        //     }).catch(err => {
        //         console.log('getInvoiceDetail err', err)
        //     }).finally(() => {
        //         this.loading = false;
        //     });
        // },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            if (!form.name) {
                return this.$message.warning('请输入仓库名称')
            }
            if (!form.address) {
                return this.$message.warning('请输入仓库地址')
            }
            Core.Api.Invoice.save(form).then(() => {
                this.$message.success('保存成功')
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },

        handleAddressSelect(address = []) {
            this.form.province = address[0]
            this.form.city = address[1]
            this.form.county = address[2]
        },
    }
};
</script>
<style lang="less">
#InvoiceEdit {
    .gray-panel.info {
        .left {
            font-size: 12px;
            color: #465670;

            span {
                color: #A5ACB8;
            }
        }

        .right {
            .fcc();
            font-size: 12px;

            .staff {
                color: rgba(0, 0, 0, 0.85);
                margin-right: 12px;
                font-weight: 500;
            }

            .status {
                .fcc();

                .i_point {
                    margin-right: 6px;
                }
            }
        }

        .panel-content {
            .fsb(flex-start);
            padding-bottom: 15px;
        }

        .info-item {
            flex: 1;
            font-size: 12px;

            .key {
                color: #8090A6;
            }

            .value {
                margin-top: 10px;
                color: #363D42;
            }
        }
    }

    .panel-content.affirm {
        .title {
            color: #DD5D5D;
            margin-bottom: 24px;

            i.icon {
                margin-right: 12px;
            }
        }

        .fault_select {
            width: 100%;
            padding-left: 12px;

            .ant-checkbox-wrapper {
                width: 25%;
                margin-left: 0;
                margin-bottom: 18px;
            }
        }
    }

    .steps-container {
        padding: 0 20px;
        margin-bottom: 20px;
    }
}
</style>
