<template>
<div id="ItemSettle" class="list-container">
    <div class="title-area">结算</div>
    <div class="config-list">
        <div class="config-item receive">
            <div class="config-title">1.配送选项</div>
            <div class="config-content edit-mode" v-if="editMode || true">
                <div class="form-item required">
                    <div class="key">姓名</div>
                    <div class="value">
                        <a-input v-model:value="form.name" placeholder="请输入收货人姓名"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">手机号码</div>
                    <div class="value">
                        <a-input v-model:value="form.phone" placeholder="请输入收货人手机号码"/>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">国家/地区</div>
                    <div class="value">
                        <a-select placeholder="请选择国家" v-model:value="form.country" show-search option-filter-prop="children" allow-clear>
                            <a-select-option v-for="(item,index) of countryList" :key="index" :value="item.name">{{item.name}}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">大致地址</div>
                    <div class="value">
                        <AddressCascader @change='handleAddressSelect' :default-address='[form.province, form.city, form.county]'/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">详细地址</div>
                    <div class="value">
                        <a-input v-model:value="form.address" placeholder="请输入详细地址"/>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">邮箱地址</div>
                    <div class="value">
                        <a-input v-model:value="form.mail" placeholder="请输入收货人邮箱"/>
                    </div>
                </div>
                <div class="form-item btn">
                    <div class="key"></div>
                    <div class="value">
                        <a-button type="primary" @click="handleConfigSave">保存并继续</a-button>
                    </div>
                </div>
            </div>
            <div class="config-content select-mode" v-else>
                <div class="select-item" v-for="item of receiveList" :key='item.id'>
                    <div class="info">
                        <i class="icon i_point"/>
                        <div class="desc">
                            <p>{{}}</p>
                        </div>
                    </div>
                    <div class="btn"></div>
                </div>
            </div>
        </div>
        <div class="config-item pay">
            <div class="config-title">2.付款</div>
            <!-- <div class="config-content"></div> -->
        </div>
    </div>
    <div class="item-list"></div>
</div>
</template>

<script>
import Core from '../../core';
import AddressCascader from '../../components/common/AddressCascader.vue'
export default {
    name: 'ItemSettle',
    components: { AddressCascader },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            receiveList: [],
            selectIndex: '',

            countryList: Core.Const.COUNTRY_LIST,
            form: {
                name: '',
                phone: '',
                country: undefined,
                province: '',
                city: '',
                county: '',
                address: '',
                email: '',
            },

            editMode: false,
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getReceiveList()
    },
    methods: {
        // 获取已保存的 地址信息列表
        getReceiveList() {
            Core.Api.Receive.list().then(res => {
                console.log('res:', res)
                this.receiveList = res.list
                this.editMode = res.list.length ? false : true
            })
        },
        handleAddressSelect(address = []) {
            this.form.province = address[0]
            this.form.city = address[1]
            this.form.county = address[2]
        },
        handleConfigSave() {
            let form = Core.Util.deepCopy(this.form)
            if (!form.name) {
                return this.$message.warning('请输入收货人姓名')
            }
            if (!form.phone) {
                return this.$message.warning('请输入收货人联系方式')
            }
            if (!form.address) {
                return this.$message.warning('请输入收货地址')
            }
            this.loading = true
            Core.Api.Receive.save(form).then(() => {
                this.$message.success('保存成功')
                this.getReceiveList();
            }).finally(() => {
                this.loading = false
            })
        },
    }
};
</script>

<style lang="less" scoped>
#ItemSettle {
    padding: 60px 105px 150px;
    display: flex;
    flex-wrap: wrap;
    .title-area {
        font-size: 24px;
        font-weight: 500;
        color: #111111;
        line-height: 28px;
        text-align: center;
        width: 100%;
        padding-bottom: 30px;
    }
    .config-list {
        width: 70%;
        box-sizing: border-box;
        padding-right: 40px;
        .config-item {
            + .config-item {
                margin-top: 30px;
            }
            .config-title {
                height: 56px;
                line-height: 56px;
                background: #F7F8FA;
                border-radius: 4px 4px 0px 0px;
                font-size: 20px;
                font-weight: 500;
                color: #252526;
                padding-left: 34px;
            }
            .config-content {
                box-sizing: border-box;
                padding: 32px 34px 30px;
                border: 1px solid #E6EAEE;
                &.edit-mode {
                    .form-item.btn {
                        margin-top: 30px;
                        .ant-btn {
                            border-radius: 0;
                            height: 34px;
                        }
                    }
                }
                &.select-mode {
                    min-height: 428px;
                    overflow: auto;
                    .select-item {

                    }
                }
            }
        }

    }
    .item-list {
        width: 30%;
    }
}
</style>