<template>
<div class="WaybillShow">
    <div class="main">
        <span>{{$Util.waybillCompanyFilter(detail.company_uid)}}({{detail.uid}})</span>
        <a-button type="link" @click="handleDetailShow">查看物流详情</a-button>
        <a-button type="link" v-if="canEdit" @click='handleUpdateShow'>修改物流信息</a-button>
    </div>
    <div class="desc">{{last.status}}</div>
    <div class="time">{{last.time}}</div>
    <template class="modal-container">
        <a-modal v-model:visible="detailShow" title="物流详情" class="waybill-show-modal">
            <div class="modal-content">
                <a-steps progress-dot direction="vertical">
                    <a-step v-for="(item,index) of list" :key="index" :title="item.time" :description="item.status" />
                </a-steps>
            </div>
            <template #footer>
                <a-button key="back" @click="detailShow = false">关闭</a-button>
            </template>
        </a-modal>
        <a-modal v-model:visible="updateShow" title="编辑验收备注" class="remark-detail-modal" :ok="updateWaybill">
            <div class="form-item">
                <div class="key">物流公司:</div>
                <div class="value">
                    <a-select v-model:value="companyUid" placeholder="请选择物流公司" >
                        <a-select-option v-for="(val,key) in companyMap" :key="key" :value="key" >{{val}}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item">
                <div class="key">物流单号:</div>
                <div class="value">
                    <a-input v-model:value="uid" placeholder="请输入物流单号"/>
                </div>
            </div>
            <template #footer>
                <a-button key="back" @click="updateShow = false">关闭</a-button>
                <a-button type="primary"  @click="updateWaybill">提交</a-button>
            </template>
        </a-modal>
    </template>
</div>
</template>

<script>
import Core from '../core'
const WAYBILL = Core.Const.WAYBILL
export default {
    name: 'WaybillShow',
    components: {},
    props: {
        detail: {
            type: Object,
            default: () => {return {}}
        },
        list: {
            type: Array,
            default: () => {return []}
        },
        canEdit: {
            type: Boolean,
            default: true,
        }
    },
    data() {
        return {
            companyMap: WAYBILL.COMPANY_MAP,
            detailShow: false,
            uid: "",
            companyUid: '',
            updateShow: false,

        }
    },
    watch: {},
    computed: {
        last() {
            return this.list[0] || {}
        }
    },
    created() {},
    mounted() {
        this.companyUid = this.detail.company_uid
        this.uid = this.detail.uid
    },
    methods: {
        handleDetailShow() {
            this.detailShow = true
        },
        handleUpdateShow() {
            this.updateShow = true
        },
        updateWaybill() {
            Core.Api.Waybill.update({
                id: this.detail.id,
                company_uid: this.companyUid,
                uid: this.uid,
            }).then(res =>{
                this.$emit('change')
                this.$message.success('修改成功')
                this.updateShow = false
            })

        },
    },
}
</script>

<style lang='less'>
.WaybillShow {
    .main {
        font-size: 12px;
        font-weight: 500;
        color: #3C3C3C;
        line-height: 20px;

        .ant-btn {
            height: 20px;
            font-size: 12px;
            margin-left: 8px;
        }
    }
    .desc, .time {
        font-size: 12px;
        font-weight: 400;
        color: #6C6C6C;
        line-height: 20px;
        margin: 6px 0;
    }
}
.waybill-show-modal {
    .ant-steps-item-container {
        .ant-steps-item-content {
            width: calc(~'100% - 30px');
        }
    }
}
</style>
