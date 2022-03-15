<template>
    <div id="ReceiveInfo" class="config-item receive">
<!--        <div class="config-title">1.配送选项</div>-->
        <div class="config-content edit-mode" v-if="editMode">
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
            <div class="form-item required">
                <div class="key">收货地址</div>
                <div class="value">
                    <AddressCascader @select='handleAddressSelect' :default-address='[form.province, form.city, form.county]'/>
                </div>
            </div>
            <div class="form-item">
                <div class="key"></div>
                <div class="value">
                    <a-input v-model:value="form.address" placeholder="请输入详细地址"/>
                </div>
            </div>
            <div class="form-item">
                <div class="key">邮箱地址</div>
                <div class="value">
                    <a-input v-model:value="form.email" placeholder="请输入收货人邮箱"/>
                </div>
            </div>
            <div class="form-item btn">
                <div class="key"></div>
                <div class="value">
                    <a-button type="primary" @click="handleConfigSave">保存并继续</a-button>
                    <a-button type="link" @click="handleConfigCancel" v-if="receiveList.length">取消编辑</a-button>
                </div>
            </div>
        </div>
        <div class="config-content select-mode" v-else>
            <div class="select-item" :class="selectIndex === item.id ? 'active' : ''"
                 v-for="item of receiveList" :key='item.id' @click="handleConfigSelect(item)">
                <div class="info">
                    <i class="icon i_point"/>
                    <div class="desc">
                        <p>{{item.name}} {{item.phone}}</p>
                        <p>{{item.email}}</p>
                        <p>{{item.province}} {{item.city}} {{item.county}} {{item.address}}</p>
                    </div>
                </div>
                <div class="btn">
                    <a-button type="link" @click.stop="handleConfigEdit(item)">编辑</a-button>
                    <a-button type="link" @click.stop="handleConfigDelete(item)">删除</a-button>
                </div>
            </div>
            <div class="add">
                <a-button type="link" @click="handleConfigEdit()">添加新地址</a-button>
            </div>
            <a-button type="primary" class="orange" @click="handleCreateOrder()">下单</a-button>
        </div>
    </div>
</template>

<script>
import Core from "../../core";

export default {
    name: 'ReceiveInfo',
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            receiveList: [],
            selectIndex: '',

            countryList: Core.Const.COUNTRY_LIST,
            editMode: false,
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

        };
    },
    watch: {},
    mounted() {
        this.getReceiveList()
    },
    methods: {
        routerChange(type, item) {
            let routeUrl
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
                case 'order':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/purchase/purchase-order-list",
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
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

        // 切换到编辑状态
        handleConfigEdit(item) {
            console.log('handleConfigEdit item:', item)
            if (item) {
                this.form = Core.Util.deepCopy(item)
            } else {
                Object.assign(this.form, this.$options.data().form)
            }
            this.editMode = true
        },
        // 取消编辑
        handleConfigCancel() {
            this.editMode = false
            Object.assign(this.form, this.$options.data().form)
        },
        // 删除配置
        handleConfigDelete(item) {
            let _this = this
            this.$confirm({
                title: '确定要删除该配送选项吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Receive.delete({id: item.id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getReceiveList();
                    }).catch(err => {
                        console.log("handleConfigDelete err", err);
                    })
                },
            });
        },
        // 保存配置
        handleConfigSave() {
            let form = Core.Util.deepCopy(this.form)
            if (!form.name) {
                return this.$message.warning('请输入收货人姓名')
            }
            if (!form.phone) {
                return this.$message.warning('请输入收货人联系方式')
            }
            if (!form.province || !form.city || !form.county || !form.address) {
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

        // 选择配置
        handleConfigSelect(item) {
            this.selectIndex = item.id
        },
    }
};
</script>

<style lang="less" scoped>
#ReceiveInfo {
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
                    .value {
                        display: flex;
                        align-items: center;
                    }
                    .ant-btn-primary {
                        border-radius: 0;
                        height: 34px;
                    }
                }
            }
            &.select-mode {
                min-height: 428px;
                overflow: auto;
                .select-item {
                    .fsb();
                    cursor: pointer;
                    border-radius: 2px;
                    border: 1px solid #E5E8EB;
                    margin-bottom: 20px;
                    padding: 11px 20px;
                    box-sizing: border-box;
                    transition: border-color 0.3s ease;
                    .info {
                        width: calc(~'100% - 64px');
                        .fac();
                        .icon.i_point {
                            width: 30px;
                            box-sizing: border-box;
                            font-size: 16px;
                            padding-right: 16px;
                        }
                        .desc {
                            width: calc(~'100% - 30px');
                            font-size: 14px;
                            font-weight: 400;
                            p {
                                .ell();
                                color: #181818;
                                line-height: 20px;
                                + p {
                                    margin-top: 4px;
                                }
                            }
                        }
                    }
                    .btn {
                        width: 64px;
                        .fac(flex-end);
                    }
                    &.active {
                        border-color: @BC_P;
                        .icon.i_point {
                            color: @TC_P;
                        }
                    }
                }
                .add {
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 10px;
                }
            }
        }
    }

}
</style>