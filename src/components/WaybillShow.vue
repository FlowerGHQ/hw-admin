<template>
<div class="WaybillShow">
    <div class="main">
        <span>{{$Util.waybillCompanyFilter(detail.companyUid)}}({{detail.uid}})</span>
        <a-button type="link" @click="handleDetailShow">查看物流详情</a-button>
        <a-button type="link" v-if="canEdit" @click='handleUpdateShow'>修改物流信息</a-button>
    </div>
    <div class="desc">{{last.status}}</div>
    <div class="time">{{last.time}}</div>
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
                <a-select v-model:visible="companyUid" placeholder="请选择物流公司" show-search option-filter-prop="children">
                    <a-select-option v-for="(val,key) in companyMap" :key="key" :value="key" >{{val}}</a-select-option>
                </a-select>
            </div>
        </div>
        <div class="form-item">
            <div class="key">物流单号:</div>
            <div class="value">
                <a-input v-model="sn" placeholder="请输入物流单号"/>
            </div>
        </div>

    </a-modal>
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
            sn: "",
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
        this.companyUid = this.detail.companyUid
        this.sn = this.detail.sn
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
                sn: this.sn,
            }).then(res =>{
                this.$emit('change', 'WaybillShow')
                this.updateShow = false
            })

        },
    },
}
</script>

<style lang='less'>
.WaybillShow {
    .main {
        font-size: 14px;
        font-weight: 500;
        color: #3C3C3C;
        line-height: 20px;

        .ant-btn {
            height: 20px;
        }
    }
    .desc, .time {
        font-size: 14px;
        font-weight: 400;
        color: #6C6C6C;
        line-height: 20px;
        margin: 8px 0 9px;
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
