<template>
    <div id="user-detail">
        <div class="user-panel">
            <img class="avatar" src="../images/avatar.png" alt="">
            <div class="user-info-container">
                <div class="user-info-item">
                    <div class="user-name">
                        {{ detail.name || '-' }}
                    </div>
                    <div class="user-name-key">
                        用户昵称
                    </div>
                    <div class="info-loss-tag">
                        信息缺失
                    </div>
                    <intentionStairs :status="detail.intention" />
                </div>
                <div class="user-info-item">
                    <img class="user-icon" src="../images/user-icon.png" alt="">
                    <div class="user-info-text">
                        {{ detail.gender === 1 ? '男' : '女' }} · {{ detail.age || '-' }}岁 · {{
                            $Util.timeFilter(detail.birthday, 3) }}
                    </div>
                    <img class="user-icon" src="../images/user-email.png" alt="">
                    <div class="user-info-text">
                        {{ detail.email || '-' }}
                    </div>
                    <img class="user-icon" src="../images/user-phone.png" alt="">
                    <div class="user-info-text">
                        {{ detail.phone || '-' }}
                    </div>
                </div>
                <div class="user-info-item">
                    <div class="user-info-key">
                        意向车辆：
                    </div>
                    <div class="user-info-value w">
                        {{ $Util.intentionCarTypeFilter(detail.intent_vehicle_model) || '-' }}
                    </div>
                    <div class="user-info-key ml200">
                        注册时间：
                    </div>
                    <div class="user-info-value w">
                        {{ $Util.timeFilter(detail.create_time) || '-' }}
                    </div>
                </div>
                <div class="user-info-item">
                    <div class="user-info-key">
                        来源：
                    </div>
                    <div class="user-info-value w">
                        {{ $Util.intentionSourceTypeFilter(detail.source_type) || '-' }}
                    </div>
                    <div class="user-info-key ml200">
                        省市：
                    </div>
                    <div class="user-info-value w">
                        <span v-if="detail.province && detail.city">{{ detail.province }}{{ detail.city }}</span>
                        <span v-else>待补充</span>
                    </div>
                </div>
                <div class="user-info-item">
                    <div class="user-info-key">
                        收件地址：
                    </div>
                    <div class="user-info-value">
                        {{ detail.address || '-' }}
                    </div>
                </div>
                <div class="user-info-item tag">
                    <div class="user-info-key">
                        标签：
                    </div>
                    <div class="user-tag-value">
                        <template v-for="tagTypeList in detail.label_group_list">
                            <div class="user-color-tag blue" v-for="tag in tagTypeList.label_list"
                                @click="handleDeleteTag(tag.label_bind_id)"
                                v-if="tagTypeList.type === Core.Const.INTENTION.TAG_TYPE.TAG || tagTypeList.type === Core.Const.INTENTION.TAG_TYPE.MODEL || tagTypeList.type === Core.Const.INTENTION.TAG_TYPE.CITY">
                                {{ tag.name || '-' }}
                                <!-- 删除图标 -->
                                <img src="http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/9065c4d3d3a46fd8b21e00e62cab3152b8f56135be321a0437e4de6f31ca1b18.png"
                                    alt="">
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
                <div class="user-info-item tag">
                    <div class="user-info-key">
                        关注点：
                    </div>
                    <div class="user-tag-value">
                        <template v-for="tagTypeList in detail.label_group_list">
                            <div class="user-color-tag green" v-for="focus in tagTypeList.label_list"
                                @click="handleDeleteTag(focus.label_bind_id)"
                                v-if="tagTypeList.type === Core.Const.INTENTION.TAG_TYPE.FOCUS">
                                {{ focus.name || '-' }}
                                <!-- 删除图标 -->
                                <img src="http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/a6ecd3603b897901e64f1413c45561ac6b070e29f1948f306440f9779f7186e7.png"
                                    alt="">
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
        <AddTag :addTagShow="false" />
    </div>
</template>
    
<script>
import Core from '../../../core';
import intentionStairs from './IntentionStairs.vue';
import AddTag from './AddTag.vue'
export default {
    name: 'UserDetail',
    components: {
        intentionStairs,
        AddTag
    },
    props: {
        id: {
            type: Number
        },
    },
    data() {
        return {
            Core,
            detail: {
                name: '赵女士',
                intention: 20,
                gender: 2,
                age: 25,
                birthday: 1695092197,
                email: '1******4@163.com',
                phone: '155 4521 5742',
                intent_vehicle_model: 1,
                create_time: 1695092197,
                source_type: 1,
                province: '吉林省',
                city: '吉林市',
                address: '江苏省常州市天宁区福祥街道上河郡小区12栋一单元1602号',
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
                ],
            },
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        // 删除标签或关注点
        handleDeleteTag(id) {
            this.$confirm({
                title: '确定删除该标签吗',
                okText: '确定',
                okType: 'primary',
                cancelText: '取消',
                onOk() {

                },
            });
        },
        // 添加标签
        handleAddTag() {

        },
        // 添加关注点
        handleAddFocus() {

        },
        // 获取用户详情
        getUserDetail() {
            
        }
    }
};
</script>
    
<style scoped lang="less">
#user-detail {
    width: 838px;
    padding: 20px;
    box-sizing: border-box;
    background: #FFF;

    .user-panel {
        width: 100%;
        display: flex;

        .avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
        }

        .user-info-container {
            margin-left: 12px;

            .user-info-item {
                display: flex;
                align-items: center;
                margin-bottom: 12px;

                &.tag {
                    align-items: flex-start;
                    margin-bottom: 0;
                }

                .user-name {
                    color: #1D2129;
                    font-size: 16px;
                    font-weight: 600;
                    margin-right: 12px;
                }

                .user-name-key {
                    color: #4E5969;
                    font-size: 13px;
                    font-weight: 400;
                    margin-right: 12px;
                }

                .info-loss-tag {
                    padding: 2px 8px;
                    box-sizing: border-box;
                    border-radius: 3px;
                    border: 1px solid rgba(245, 63, 63, 0.30);
                    background: #FFF;
                    color: #F53F3F;
                    font-size: 12px;
                    margin-right: 12px;
                }

                .user-icon {
                    width: 16px;
                    height: 16px;
                    margin-right: 10px;
                }

                .user-info-text {
                    color: #1D2129;
                    font-size: 14px;
                    font-weight: 400;
                    margin-right: 14px;
                }

                .user-info-key {
                    color: #86909C;
                    text-align: right;
                    font-size: 14px;
                    width: 70px;
                    margin-right: 10px;

                    &.ml200 {
                        margin-left: 120px;
                    }
                }

                .user-info-value {
                    color: #1D2129;
                    font-size: 14px;

                    &.w {
                        width: 139px;
                    }
                }

                .user-tag-value {
                    // width: 100%;
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    width: 500px;
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
            }
        }
    }

}
</style>
    