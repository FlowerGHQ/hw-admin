<template>
    <div id="userEdit">
        <div class="white-container">
            <div class="title">
                <div>
                    创建用户
                </div>
                <div class="btn-group">
                    <a-button @click="routerChange('back')">取消</a-button>
                    <a-button @click="handleSubmit" type="primary">保存</a-button>
                </div>
            </div>
            <div class="head-title">
                基本信息
            </div>
            <div class="form-item-container">
                <div class="form-item required">
                    <div class="key">
                        用户名称：
                    </div>
                    <div class="value">
                        <a-input v-model:value="form.name" placeholder="请输入用户名称" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">
                        性别：
                    </div>
                    <div class="value">
                        <a-radio-group v-model:value="form.gender">
                            <a-radio :value="1">男</a-radio>
                            <a-radio :value="2">女</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">
                        手机号：
                    </div>
                    <div class="value">
                        <a-input @blur="phoneBlurCheck" v-model:value="form.phone" placeholder="请输入手机号码" />
                    </div>
                </div>
                <div class="form-item" v-if="phoneExistErrorFlag || phoneFormatErrorFlag">
                    <div class="key"></div>
                    <div class="red-tip">
                        {{ phoneExistErrorFlag ? phoneExistTip : phoneUnformat }}
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">
                        国家：
                    </div>
                    <div class="value">
                        <a-select v-model:value="form.country" placeholder="选择国家">
                            <a-select-option v-for="(item, key) in countryList" :key="key" :value="item.name">{{ item.name }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">
                        省市：
                    </div>
                    <div class="value">
                        <China2Address @search="handleCitySearch" :defArea="[form.province, form.city]" />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">
                        收件地址：
                    </div>
                    <div class="value">
                        <a-input v-model:value="form.address" placeholder="请填写收件地址" />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">
                        邮箱：
                    </div>
                    <div class="value">
                        <a-input v-model:value="form.email" placeholder="请输入邮箱" />
                    </div>
                </div>
                <div class="form-item" v-if="emailExistErrorFlag">
                    <div class="key"></div>
                    <div class="red-tip">
                        {{ emailExistTip }}
                    </div>
                </div>
            </div>
        </div>
        <div class="white-container">
            <div class="head-title">
                其他信息
            </div>
            <div class="form-item-container">
                <div class="form-item">
                    <div class="key">
                        意向度：
                    </div>
                    <div class="value">
                        <a-select v-model:value="form.intention" placeholder="请选择意向度">
                            <a-select-option v-for="(item, key) in intentionList" :key="key" :value="item.value">
                                {{ item.key }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">
                        意向车辆：
                    </div>
                    <div class="value">
                        <a-select v-model:value="form.intent_vehicle_model" placeholder="请选择意向车辆">
                            <a-select-option v-for="(item, key) in vehicleList" :key="key" :value="item.value">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item flex-start">
                    <div class="key">
                        标签：
                    </div>
                    <div class="value">
                        <template v-for="tagTypeList in form.label_group_list">
                            <div class="user-color-tag blue" v-for="tag in tagTypeList.label_list"
                                @click="handleDeleteTag(tag.label_bind_id)"
                                v-if="tagTypeList.type === tagMap.TAG || tagTypeList.type === tagMap.MODEL || tagTypeList.type === tagMap.CITY">
                                {{ tag.name || '-' }}
                                <!-- 删除图标 -->
                                <img src="../crm-staging/images/close-icon.png" alt="">
                            </div>
                        </template>
                        <div class="add-tag-btn" @click="handleAddTag">
                            <!-- 加号 -->
                            <img src="http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/93efd07260c8f47fe800d131b2f7c2aea8a9b225d99e82f7192441a84af68ee1.png"
                                alt="">
                            添加标签
                        </div>
                    </div>
                </div>
                <div class="form-item flex-start">
                    <div class="key">
                        关注点：
                    </div>
                    <div class="value">
                        <template v-for="tagTypeList in form.label_group_list">
                            <div class="user-color-tag green" v-for="focus in tagTypeList.label_list"
                                @click="handleDeleteTag(focus.label_bind_id)"
                                v-if="tagTypeList.type === tagMap.FOCUS">
                                {{ focus.name || '-' }}
                                <!-- 删除图标 -->
                                <img src="../crm-staging/images/close-icon.png" alt="">
                            </div>
                        </template>
                        <div class="add-tag-btn" @click="handleAddFocus">
                            <!-- 加号 -->
                            <img src="http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/93efd07260c8f47fe800d131b2f7c2aea8a9b225d99e82f7192441a84af68ee1.png"
                                alt="">
                            添加关注点
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <AddTag :isCreate="true" v-if="tagDrawerShow" :list="form.label_group_list" @finish="updateTagList"
            v-model:visible="tagDrawerShow" />
        <AddFocus :isCreate="true" v-if="focusDrawerShow" :list="form.label_group_list" @finish="updateFocusList"
            v-model:visible="focusDrawerShow" />
    </div>
</template>

<script>
import Core from '../../core';
import China2Address from "@/components/common/China2Address.vue";
import AddTag from "@/views/crm-staging/components/AddTag.vue";
import AddFocus from "@/views/crm-staging/components/AddFocus.vue";
export default {
    name: 'UserEdit',
    components: {
        China2Address,
        AddTag,
        AddFocus
    },
    data() {
        return {
            form: {
                name: undefined,
                gender: 1, // 1 男 2 女
                phone: undefined,
                country: '中国',
                province: undefined,
                city: undefined,
                address: undefined,
                email: undefined,
                intention: undefined, // 意向度
                intent_vehicle_model: undefined, // 意向车辆 1 SENMENTI0 2 SENMENTIX
                label_group_list: [
                    {
                        label_list: [
                            {
                                category: 0,
                                id: 1,
                                label_bind_id: 0,
                                name: "有摩托",
                                type: 3,
                                user_id: 0
                            },
                            {
                                category: 0,
                                id: 2,
                                label_bind_id: 0,
                                name: "2年骑行经验",
                                type: 3,
                                user_id: 0
                            },
                            {
                                category: 0,
                                id: 3,
                                label_bind_id: 0,
                                name: "2年骑行经验",
                                type: 3,
                                user_id: 0
                            },
                            {
                                category: 0,
                                id: 4,
                                label_bind_id: 0,
                                name: "2年骑行经验",
                                type: 3,
                                user_id: 0
                            },                            {
                                category: 0,
                                id: 4,
                                label_bind_id: 0,
                                name: "2年骑行经验",
                                type: 3,
                                user_id: 0
                            },                            {
                                category: 0,
                                id: 4,
                                label_bind_id: 0,
                                name: "2年骑行经验",
                                type: 3,
                                user_id: 0
                            },                            {
                                category: 0,
                                id: 4,
                                label_bind_id: 0,
                                name: "2年骑行经验",
                                type: 3,
                                user_id: 0
                            },
                        ],
                        type: 3
                    },
                    {
                        label_list: [
                            {
                                category: 0,
                                id: 1,
                                label_bind_id: 0,
                                name: "续航",
                                type: 4,
                                user_id: 0
                            },
                            {
                                category: 0,
                                id: 2,
                                label_bind_id: 0,
                                name: "质量",
                                type: 4,
                                user_id: 0
                            },
                            {
                                category: 0,
                                id: 3,
                                label_bind_id: 0,
                                name: "安全",
                                type: 4,
                                user_id: 0
                            },
                            {
                                category: 0,
                                id: 4,
                                label_bind_id: 0,
                                name: "安全",
                                type: 4,
                                user_id: 0
                            },
                        ],
                        type: 4
                    }
                ]
            },
            successIcon: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/66c031f28636bd85709313794f7e84eb47b5b49e6bbabd0b18df50ba6b44af88.png',
            phoneExistErrorFlag: false,
            phoneFormatErrorFlag: false,
            phoneExistTip: '该手机号已存在，请修改',
            phoneUnformat: '手机号格式错误',
            emailExistErrorFlag: false,
            emailExistTip: '该邮箱已存在，无法创建',
            countryList: [
                {
                    key: 1,
                    name: '中国'
                }
            ],
            vehicleList: [
                {
                    value: 1,
                    name: 'SENMENTI 0'
                },
                {
                    value: 2,
                    name: 'SENMENTI X'
                }
            ],
            intentionList: Core.Const.WORK_OPERATION.INTENTION.TYPE_LIST,
            tagMap: Core.Const.INTENTION.TAG_TYPE,
            tagDrawerShow: false,
            focusDrawerShow: false,
        };
    },
    computed: {

    },
    mounted() {

    },
    methods: {
        /*methods*/
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'edit':    // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/user-center/user-edit",
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'back':    // 取消返回
                    this.$router.go(-1);
                    break;
            }
        },
        // 手机号格式校验
        phoneBlurCheck() {
            if(!this.form.phone) {
                return this.phoneFormatErrorFlag = false
            }
            if(this.form.phone.length !== 11) {
                this.phoneFormatErrorFlag = true
            }
        },
        // 选择用车城市
        handleCitySearch(e) {
            this.form.province = e.province
            this.form.city = e.city
        },
        handleSubmit() {
            let _this = this;
            this.$confirm({
                title: '确认提交吗？',
                okText: '确定',
                okType: 'primary',
                cancelText: '取消',
                onOk() {

                },
            });
        },
        // 添加标签
        handleAddTag() {
            this.tagDrawerShow = true
        },
        // 添加关注点
        handleAddFocus() {
            this.focusDrawerShow = true
        },
        // 更新标签
        updateTagList(list) {
            console.log('list', list);
        },
        updateFocusList(list) {
            console.log('list', list);
        },
    }
};
</script>

<style lang="less" scoped>
#userEdit {
    .white-container {
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
        margin-bottom: 16px;
        border-radius: 6px;
        border: 1px solid #F2F3F5;
        background: #FFF;
        .title {
            width: 100%;
            display: flex;
            justify-content: space-between;
            color: #1D2129;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 24px;
            .btn-group {
                display: flex;
            }
        }
        .head-title {
            color: #1D2129;
            font-size: 16px;
            margin-bottom: 26px;
        }
        .form-item-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .form-item {
            width: 516px;
            &.flex-start {
                align-items: flex-start;
            }
            .key {
                width: 100px;
                color: #1D2129;
                text-align: right;
                font-size: 14px;
            }
            .key::before {
                opacity: 0;
                content: '*';
                color: @TC_required;
                padding-right: 2px;
            }

            &.required {
                // 必填标志
                .key::before {
                    opacity: 1;
                }
            }
            .value {
                display: flex;
                align-items: flex-start;
                flex-wrap: wrap;
                //width: 700px;
                .ant-input {
                    width: 400px;
                    height: 32px;
                    font-size: 14px;
                    color: #1D2129;
                }
                .ant-select {
                    width: 400px;
                    height: 32px;
                    font-size: 14px;
                    color: #1D2129;
                }
                .user-color-tag {
                    cursor: pointer;
                    padding: 2px 8px;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    margin-right: 8px;

                    >img {
                        width: 10px;
                        height: 10px;
                        margin-left: 3px;
                    }

                    &.blue {
                        background-color: #E6EFFF;
                        border-radius: 2px;
                        color: #3381FF;
                        margin-bottom: 12px;
                    }

                    &.green {
                        background-color: #E8FFEA;
                        border-radius: 2px;
                        color: #00B42A;
                        margin-bottom: 12px;
                    }
                }
                .add-tag-btn {
                    padding: 1px 8px;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #4E5969;
                    font-size: 12px;
                    border: 0.5px dashed#D9D9D9;
                    background: #FFF;
                    cursor: pointer;
                    margin-bottom: 12px;

                    >img {
                        width: 12px;
                        height: 12px;
                        margin-right: 2px;
                    }
                }
            }
            .red-tip {
                color: #F53F3F;
                font-size: 12px;
            }
        }


    }
}
</style>
