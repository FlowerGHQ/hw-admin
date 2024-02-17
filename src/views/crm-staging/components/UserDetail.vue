<!--<template>-->
<!--    <div id="user-detail">-->
<!--        <div class="user-panel">-->
<!--            <div class="avatar-wrap">-->
<!--                <img class="avatar" :src="detail.avatar ? detail.avatar : defaultAvatar" alt="">-->
<!--                <div class="real-name-wrap" v-if="false">-->
<!--                    <img src="../images/real-name-icon.png" alt="">-->
<!--                    已实名-->
<!--                </div>-->
<!--                <div class="info-loss-tag" v-if="!detail.province || !detail.city">-->
<!--                    信息缺失-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="user-info-container">-->
<!--                <div class="user-info-item">-->
<!--                    <div class="user-info-block required">-->
<!--                        <div class="user-info-key">-->
<!--                            用户名称：-->
<!--                        </div>-->
<!--                        <div class="user-info-value" v-if="!isNameEditing" @mouseover="isNameEditing = true">-->
<!--                            {{ detail.name || '-' }}-->
<!--                        </div>-->
<!--                        <div class="user-info-value" v-else>-->
<!--                            <a-input ref="nameInputRef" @mouseover="isNameEditing = true" v-model:value="detail.name" @mouseleave="leaveInput('name')" @blur="inputBlur('name')" />-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <div class="user-info-block">-->
<!--                        <div class="user-info-key">-->
<!--                            意向度：-->
<!--                        </div>-->
<!--                        <div class="user-info-value">-->
<!--                            {{ Core.Util.intentionTypeFilter(detail.intention, 'key') || '-' }}-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="user-info-item">-->
<!--                    <div class="user-info-block required">-->
<!--                        <div class="user-info-key">-->
<!--                            生日：-->
<!--                        </div>-->
<!--                        <div class="user-info-value">-->
<!--                            {{ detail.birthday || '-' }}-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <div class="user-info-block">-->
<!--                        <div class="user-info-key">-->
<!--                            手机号：-->
<!--                        </div>-->
<!--                        <div class="user-info-value">-->
<!--                            {{ detail.phone || '-' }}-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="user-info-item">-->
<!--                    <div class="user-info-block required">-->
<!--                        <div class="user-info-key">-->
<!--                            邮箱：-->
<!--                        </div>-->
<!--                        <div class="user-info-value">-->
<!--                            {{ detail.email || '-' }}-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <div class="user-info-block">-->
<!--                        <div class="user-info-key">-->
<!--                            省市：-->
<!--                        </div>-->
<!--                        <div class="user-info-value">-->
<!--                            <span v-if="detail.province && detail.city">{{ detail.province }}{{ detail.city }}</span>-->
<!--                            <span v-else>待补充</span>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="user-info-item">-->
<!--                    <div class="user-info-block required">-->
<!--                        <div class="user-info-key">-->
<!--                            意向车辆：-->
<!--                        </div>-->
<!--                        <div class="user-info-value">-->
<!--                            {{ $Util.intentionCarTypeFilter(detail.intent_vehicle_model) || '-' }}-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <div class="user-info-block">-->
<!--                        <div class="user-info-key">-->
<!--                            注册时间：-->
<!--                        </div>-->
<!--                        <div class="user-info-value">-->
<!--                            {{ $Util.timeFilter(detail.create_time) || '-' }}-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="user-info-item">-->
<!--                    <div class="user-info-block required">-->
<!--                        <div class="user-info-key">-->
<!--                            收件地址：-->
<!--                        </div>-->
<!--                        <div class="user-info-value">-->
<!--                            {{ detail.address || '-' }}-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="user-info-item">-->
<!--                    <div class="user-info-block">-->
<!--                        <div class="user-info-key">-->
<!--                            标签：-->
<!--                        </div>-->
<!--                        <div class="user-tag-value">-->
<!--                            <template v-for="tagTypeList in detail.label_group_list">-->
<!--                                <div class="user-color-tag blue" v-for="tag in tagTypeList.label_list"-->
<!--                                    @click="handleDeleteTag(tag.label_bind_id)"-->
<!--                                    v-if="tagTypeList.type === Core.Const.INTENTION.TAG_TYPE.TAG || tagTypeList.type === Core.Const.INTENTION.TAG_TYPE.MODEL || tagTypeList.type === Core.Const.INTENTION.TAG_TYPE.CITY">-->
<!--                                    {{ tag.name || '-' }}-->
<!--                                    &lt;!&ndash; 删除图标 &ndash;&gt;-->
<!--                                    <img src="../images/blue-close-icon.png" alt="">-->
<!--                                </div>-->
<!--                            </template>-->
<!--                            <div class="add-tag-btn" @click="handleAddTag">-->
<!--                                &lt;!&ndash; 加号 &ndash;&gt;-->
<!--                                <img src="http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/93efd07260c8f47fe800d131b2f7c2aea8a9b225d99e82f7192441a84af68ee1.png"-->
<!--                                    alt="">-->
<!--                                添加标签-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="user-info-item">-->
<!--                    <div class="user-info-block">-->
<!--                        <div class="user-info-key">-->
<!--                            关注点：-->
<!--                        </div>-->
<!--                        <div class="user-tag-value">-->
<!--                            <template v-for="tagTypeList in detail.label_group_list">-->
<!--                                <div class="user-color-tag green" v-for="focus in tagTypeList.label_list"-->
<!--                                    @click="handleDeleteTag(focus.label_bind_id)"-->
<!--                                    v-if="tagTypeList.type === Core.Const.INTENTION.TAG_TYPE.FOCUS">-->
<!--                                    {{ focus.name || '-' }}-->
<!--                                    &lt;!&ndash; 删除图标 &ndash;&gt;-->
<!--                                    <img src="../images/green-close-icon.png" alt="">-->
<!--                                </div>-->
<!--                            </template>-->
<!--                            <div class="add-tag-btn" @click="handleAddFocus">-->
<!--                                &lt;!&ndash; 加号 &ndash;&gt;-->
<!--                                <img src="http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/93efd07260c8f47fe800d131b2f7c2aea8a9b225d99e82f7192441a84af68ee1.png"-->
<!--                                    alt="">-->
<!--                                添加关注点-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
<!--        <AddTag v-if="tagDrawerShow" :id="id" :list="detail.label_group_list" @submit="getUserDetail" @updateLabel="updateLabel"-->
<!--            v-model:visible="tagDrawerShow" />-->
<!--        <AddFocus v-if="focusDrawerShow" :id="id" :list="detail.label_group_list" @submit="getUserDetail" @updateLabel="updateLabel"-->
<!--            v-model:visible="focusDrawerShow" />-->
<!--    </div>-->
<!--</template>-->
<!--    -->
<!--<script>-->
<!--import Core from '../../../core';-->
<!--import intentionStairs from './intention-stairs.vue';-->
<!--import AddTag from './AddTag.vue'-->
<!--import AddFocus from './AddFocus.vue';-->
<!--import dayjs from "dayjs";-->
<!--export default {-->
<!--    name: 'UserDetail',-->
<!--    components: {-->
<!--        intentionStairs,-->
<!--        AddTag,-->
<!--        AddFocus,-->
<!--    },-->
<!--    props: {-->
<!--        id: {-->
<!--            type: Number-->
<!--        },-->
<!--    },-->
<!--    data() {-->
<!--        return {-->
<!--            Core,-->
<!--            detail: {-->
<!--                name: '',-->
<!--                avatar: '',-->
<!--                intention: 10,-->
<!--                gender: 1,-->
<!--                age: 0,-->
<!--                birthday: 0,-->
<!--                email: '',-->
<!--                phone: '',-->
<!--                intent_vehicle_model: 1,-->
<!--                create_time: 0,-->
<!--                source_type: 0,-->
<!--                province: '',-->
<!--                city: '',-->
<!--                address: '',-->
<!--                label_group_list: [],-->
<!--            },-->
<!--            tagDrawerShow: false,-->
<!--            focusDrawerShow: false,-->
<!--            defaultAvatar: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/57e4ee29250de0dc640a764068f55d697327d7b29ccd4bfe8c460dd838e20a75.png',-->
<!--            isNameEditing: false,-->
<!--        };-->
<!--    },-->
<!--    computed: {-->
<!--        lang() {-->
<!--            return this.$store.state.lang-->
<!--        }-->
<!--    },-->
<!--    mounted() {-->
<!--    },-->
<!--    methods: {-->
<!--        getData() {-->
<!--            this.getUserDetail()-->
<!--        },-->
<!--        // 删除标签或关注点-->
<!--        handleDeleteTag(id) {-->
<!--            let _this = this;-->
<!--            this.$confirm({-->
<!--                title: '确定删除该标签吗',-->
<!--                okText: '确定',-->
<!--                okType: 'primary',-->
<!--                cancelText: '取消',-->
<!--                onOk() {-->
<!--                    Core.Api.CustomService.deleteLabel({-->
<!--                        id: id-->
<!--                    }).then(res => {-->
<!--                        Core.Logger.log('handleDeleteTag res', res)-->
<!--                        _this.$message.success('删除成功！')-->
<!--                        _this.getUserDetail();-->
<!--                        _this.$emit('updateLabel');-->
<!--                    })-->
<!--                },-->
<!--            });-->
<!--        },-->
<!--        // 添加标签-->
<!--        handleAddTag() {-->
<!--            this.tagDrawerShow = true-->
<!--        },-->
<!--        // 添加关注点-->
<!--        handleAddFocus() {-->
<!--            this.focusDrawerShow = true-->
<!--        },-->
<!--        // 获取用户详情-->
<!--        getUserDetail() {-->
<!--            if (!this.id) return-->
<!--            Core.Api.CustomService.detail({-->
<!--                id: this.id-->
<!--                // id: 3074-->
<!--            }).then(res => {-->
<!--                Core.Logger.log('getUserDetail res', res)-->
<!--                this.detail = res-->
<!--            }).catch(err => {-->
<!--                Core.Logger.log('getUserDetail err', err)-->
<!--            })-->
<!--        },-->
<!--        updateLabel() {-->
<!--            this.$emit('updateLabel');-->
<!--        },-->
<!--        inputBlur(type) {-->
<!--            switch (type) {-->
<!--                case 'name':-->
<!--                    this.isNameEditing = false-->
<!--                    break;-->
<!--            }-->
<!--        },-->
<!--        leaveInput(type) {-->
<!--            switch (type) {-->
<!--                case 'name':-->
<!--                    this.isNameEditing = false;-->
<!--                    break;-->
<!--            }-->
<!--        }-->
<!--    }-->
<!--};-->
<!--</script>-->
<!--    -->
<!--<style scoped lang="less">-->
<!--#user-detail {-->
<!--    // width: 838px;-->
<!--    padding: 20px 20px 8px 20px;-->
<!--    box-sizing: border-box;-->
<!--    background: #FFF;-->

<!--    .user-panel {-->
<!--        width: 100%;-->
<!--        display: flex;-->
<!--        align-items: flex-start;-->
<!--        .avatar-wrap {-->
<!--            position: relative;-->
<!--            .real-name-wrap {-->
<!--                position: absolute;-->
<!--                top: 64px;-->
<!--                left: 4px;-->
<!--                height: 21px;-->
<!--                border-radius: 30px;-->
<!--                border: 1px solid rgba(0, 180, 42, 0.30);-->
<!--                background: #E8FFEA;-->
<!--                padding: 2px 8px;-->
<!--                box-sizing: border-box;-->
<!--                display: flex;-->
<!--                justify-content: center;-->
<!--                align-items: center;-->
<!--                color:#00B42A;-->
<!--                font-size: 12px;-->
<!--                >img {-->
<!--                    width: 16px;-->
<!--                    height: 16px;-->
<!--                    margin-right: 4px;-->
<!--                }-->
<!--            }-->
<!--            .info-loss-tag {-->
<!--                position: absolute;-->
<!--                top: 90px;-->
<!--                left: 7px;-->
<!--                padding: 2px 8px;-->
<!--                box-sizing: border-box;-->
<!--                border-radius: 3px;-->
<!--                border: 1px solid rgba(245, 63, 63, 0.30);-->
<!--                background: #FFF;-->
<!--                color: #F53F3F;-->
<!--                font-size: 12px;-->
<!--            }-->
<!--        }-->
<!--        .avatar {-->
<!--            width: 80px;-->
<!--            height: 80px;-->
<!--            border-radius: 50%;-->
<!--        }-->

<!--        .user-info-container {-->
<!--            margin-left: 12px;-->

<!--            .user-info-item {-->
<!--                display: flex;-->
<!--                align-items: center;-->
<!--                margin-bottom: 16px;-->
<!--                .user-info-block {-->
<!--                    display: flex;-->
<!--                    align-items: center;-->
<!--                    margin-right: 142px;-->
<!--                    .user-info-key::before {-->
<!--                        opacity: 0;-->
<!--                        content: '*';-->
<!--                        color: #EB4141;-->
<!--                        padding-right: 2px;-->
<!--                    }-->
<!--                    &.required {-->
<!--                        // 必填标志-->
<!--                        .user-info-key::before {-->
<!--                            opacity: 1;-->
<!--                        }-->
<!--                    }-->
<!--                    .user-info-key {-->
<!--                        width: 100px;-->
<!--                        color: #1D2129;-->
<!--                        font-size: 14px;-->
<!--                        text-align: right;-->
<!--                    }-->
<!--                    .user-info-value {-->
<!--                        width: 144px;-->
<!--                        height: 32px;-->
<!--                        line-height: 32px;-->
<!--                        color: #1D2129;-->
<!--                        font-size: 14px;-->
<!--                    }-->
<!--                }-->

<!--                .user-tag-value {-->
<!--                    display: flex;-->
<!--                    align-items: center;-->
<!--                    flex-wrap: wrap;-->
<!--                }-->

<!--                .add-tag-btn {-->
<!--                    padding: 1px 8px;-->
<!--                    box-sizing: border-box;-->
<!--                    display: flex;-->
<!--                    justify-content: center;-->
<!--                    align-items: center;-->
<!--                    color: #4E5969;-->
<!--                    font-size: 12px;-->
<!--                    border: 0.5px dashed #D9D9D9;-->
<!--                    background: #FFF;-->
<!--                    cursor: pointer;-->
<!--                    //margin-bottom: 12px;-->

<!--                    >img {-->
<!--                        width: 12px;-->
<!--                        height: 12px;-->
<!--                        margin-right: 2px;-->
<!--                    }-->
<!--                }-->

<!--                .user-color-tag {-->
<!--                    cursor: pointer;-->
<!--                    padding: 2px 8px;-->
<!--                    box-sizing: border-box;-->
<!--                    display: flex;-->
<!--                    align-items: center;-->
<!--                    justify-content: center;-->
<!--                    font-size: 12px;-->
<!--                    margin-right: 8px;-->

<!--                    >img {-->
<!--                        width: 10px;-->
<!--                        height: 10px;-->
<!--                        margin-left: 3px;-->
<!--                    }-->

<!--                    &.blue {-->
<!--                        background-color: #E6EFFF;-->
<!--                        border-radius: 2px;-->
<!--                        color: #3381FF;-->
<!--                    }-->

<!--                    &.green {-->
<!--                        background-color: #E8FFEA;-->
<!--                        border-radius: 2px;-->
<!--                        color: #00B42A;-->
<!--                    }-->
<!--                }-->
<!--                //.user-info-value {-->
<!--                //    color: #1D2129;-->
<!--                //    font-size: 14px;-->
<!--                //-->
<!--                //    &.w {-->
<!--                //        width: 139px;-->
<!--                //    }-->
<!--                //}-->

<!--            }-->
<!--        }-->
<!--    }-->

<!--}-->
<!--</style>-->
<!-- -->
<template>
    <div id="user-detail">
        <div class="user-panel">
            <div class="avatar-wrap">
                <img class="avatar" :src="detail.avatar ? detail.avatar : defaultAvatar" alt="" />
                <div class="real-name-wrap" v-if="false">
                    <img src="../images/real-name-icon.png" alt="" />
                    已实名
                </div>
            </div>
            <div class="user-info-container">
                <div class="user-info-item">
                    <div class="user-name">
                        {{ detail.name || '-' }}
                    </div>
                    <div class="user-name-key">用户昵称</div>
                    <div class="info-loss-tag" v-if="!detail.province || !detail.city">信息缺失</div>
                    <intentionStairs :status="detail.intention" />
                </div>
                <div class="user-info-item">
                    <img class="user-icon" src="../images/user-icon.png" alt="" />
                    <div class="user-info-text">
                        <span v-if="detail.gender === 1">男</span>
                        <span v-else-if="detail.gender === 2">女</span>
                        <span v-else>-</span>
                        · {{ detail.age || '-' }}岁 ·
                        {{ $Util.timeFilter(detail.birthday, 3) }}
                    </div>
                    <img class="user-icon" src="../images/email.png" alt="" />
                    <div class="user-info-text">
                        {{ detail.email || '-' }}
                    </div>
                    <img class="user-icon" src="../images/phone.png" alt="" />
                    <div class="user-info-text">
                        {{ detail.phone || '-' }}
                    </div>
                </div>
                <div class="user-info-item">
                    <div class="user-info-key">意向车辆：</div>
                    <div class="user-info-value w">
                        {{ $Util.intentionCarTypeFilter(detail.intent_vehicle_model) || '-' }}
                    </div>
                    <div class="user-info-key ml200">注册时间：</div>
                    <div class="user-info-value w">
                        {{ $Util.timeFilter(detail.create_time) || '-' }}
                    </div>
                </div>
                <div class="user-info-item">
                    <div class="user-info-key">来源：</div>
                    <div class="user-info-value w">
                        {{ $Util.intentionSourceTypeFilter(detail.source_type) || '-' }}
                    </div>
                    <div class="user-info-key ml200">省市：</div>
                    <div class="user-info-value w">
                        <span v-if="detail.province && detail.city">{{ detail.province }}{{ detail.city }}</span>
                        <span v-else>待补充</span>
                    </div>
                </div>
                <div class="user-info-item">
                    <div class="user-info-key">收件地址：</div>
                    <div class="user-info-value">
                        {{ detail.address || '-' }}
                    </div>
                </div>
                <div class="user-info-item tag">
                    <div class="user-info-key">标签：</div>
                    <div class="user-tag-value">
                        <template v-for="tagTypeList in detail.label_group_list">
                            <div
                                class="user-color-tag blue"
                                v-for="tag in tagTypeList.label_list"
                                @click="handleDeleteTag(tag.label_bind_id)"
                                v-if="
                                    tagTypeList.type === Core.Const.INTENTION.TAG_TYPE.TAG ||
                                    tagTypeList.type === Core.Const.INTENTION.TAG_TYPE.MODEL ||
                                    tagTypeList.type === Core.Const.INTENTION.TAG_TYPE.CITY
                                "
                            >
                                {{ tag.name || '-' }}
                                <!-- 删除图标 -->
                                <img src="../images/blue-close-icon.png" alt="" />
                            </div>
                        </template>
                        <div class="add-tag-btn" @click="handleAddTag">
                            <!-- 加号 -->
                            <img
                                src="http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/93efd07260c8f47fe800d131b2f7c2aea8a9b225d99e82f7192441a84af68ee1.png"
                                alt=""
                            />
                            添加标签
                        </div>
                    </div>
                </div>
                <div class="user-info-item tag">
                    <div class="user-info-key">关注点：</div>
                    <div class="user-tag-value">
                        <template v-for="tagTypeList in detail.label_group_list">
                            <div
                                class="user-color-tag green"
                                v-for="focus in tagTypeList.label_list"
                                @click="handleDeleteTag(focus.label_bind_id)"
                                v-if="tagTypeList.type === Core.Const.INTENTION.TAG_TYPE.FOCUS"
                            >
                                {{ focus.name || '-' }}
                                <!-- 删除图标 -->
                                <img src="../images/green-close-icon.png" alt="" />
                            </div>
                        </template>
                        <div class="add-tag-btn" @click="handleAddFocus">
                            <!-- 加号 -->
                            <img
                                src="http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/93efd07260c8f47fe800d131b2f7c2aea8a9b225d99e82f7192441a84af68ee1.png"
                                alt=""
                            />
                            添加关注点
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <AddTag
            v-if="tagDrawerShow"
            :id="id"
            :list="detail.label_group_list"
            @submit="getUserDetail"
            @updateLabel="updateLabel"
            v-model:visible="tagDrawerShow"
        />
        <AddFocus
            v-if="focusDrawerShow"
            :id="id"
            :list="detail.label_group_list"
            @submit="getUserDetail"
            @updateLabel="updateLabel"
            v-model:visible="focusDrawerShow"
        />
    </div>
</template>

<script>
import Core from '../../../core';
import intentionStairs from './intention-stairs.vue';
import AddTag from './AddTag.vue';
import AddFocus from './AddFocus.vue';
export default {
    name: 'UserDetail',
    components: {
        intentionStairs,
        AddTag,
        AddFocus,
    },
    props: {
        id: {
            type: Number,
        },
    },
    data() {
        return {
            Core,
            detail: {
                name: '',
                avatar: '',
                intention: 10,
                gender: 1,
                age: 0,
                birthday: 0,
                email: '',
                phone: '',
                intent_vehicle_model: 1,
                create_time: 0,
                source_type: 0,
                province: '',
                city: '',
                address: '',
                label_group_list: [],
            },
            tagDrawerShow: false,
            focusDrawerShow: false,
            defaultAvatar:
                'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/57e4ee29250de0dc640a764068f55d697327d7b29ccd4bfe8c460dd838e20a75.png',
        };
    },
    computed: {
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {},
    methods: {
        getData() {
            this.getUserDetail();
        },
        // 删除标签或关注点
        handleDeleteTag(id) {
            let _this = this;
            this.$confirm({
                title: '确定删除该标签吗',
                okText: '确定',
                okType: 'primary',
                cancelText: '取消',
                onOk() {
                    Core.Api.CustomService.deleteLabel({
                        id: id,
                    }).then(res => {
                        Core.Logger.log('handleDeleteTag res', res);
                        _this.$message.success('删除成功！');
                        _this.getUserDetail();
                        _this.$emit('updateLabel');
                    });
                },
            });
        },
        // 添加标签
        handleAddTag() {
            this.tagDrawerShow = true;
        },
        // 添加关注点
        handleAddFocus() {
            this.focusDrawerShow = true;
        },
        // 获取用户详情
        getUserDetail() {
            if (!this.id) return;
            Core.Api.CustomService.detail({
                id: this.id,
                // id: 3074
            })
                .then(res => {
                    Core.Logger.log('getUserDetail res', res);
                    this.detail = res;
                })
                .catch(err => {
                    Core.Logger.log('getUserDetail err', err);
                });
        },
        updateLabel() {
            this.$emit('updateLabel');
        },
    },
};
</script>

<style scoped lang="less">
#user-detail {
    // width: 838px;
    padding: 20px 20px 8px 20px;
    box-sizing: border-box;
    background: #fff;

    .user-panel {
        width: 100%;
        display: flex;
        .avatar-wrap {
            position: relative;
            .real-name-wrap {
                position: absolute;
                top: 64px;
                left: 4px;
                height: 21px;
                border-radius: 30px;
                border: 1px solid rgba(0, 180, 42, 0.3);
                background: #e8ffea;
                padding: 2px 8px;
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #00b42a;
                font-size: 12px;
                > img {
                    width: 16px;
                    height: 16px;
                    margin-right: 4px;
                }
            }
        }
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
                    color: #1d2129;
                    font-size: 16px;
                    font-weight: 600;
                    margin-right: 12px;
                }

                .user-name-key {
                    color: #4e5969;
                    font-size: 13px;
                    font-weight: 400;
                    margin-right: 12px;
                }

                .info-loss-tag {
                    padding: 2px 8px;
                    box-sizing: border-box;
                    border-radius: 3px;
                    border: 1px solid rgba(245, 63, 63, 0.3);
                    background: #fff;
                    color: #f53f3f;
                    font-size: 12px;
                    margin-right: 12px;
                }

                .user-icon {
                    width: 16px;
                    height: 16px;
                    margin-right: 10px;
                }

                .user-info-text {
                    color: #1d2129;
                    font-size: 14px;
                    font-weight: 400;
                    margin-right: 14px;
                }

                .user-info-key {
                    color: #86909c;
                    text-align: right;
                    font-size: 14px;
                    width: 70px;
                    margin-right: 10px;

                    &.ml200 {
                        margin-left: 120px;
                    }
                }

                .user-info-value {
                    color: #1d2129;
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
                    // width: 500px;
                }

                .add-tag-btn {
                    padding: 1px 8px;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #4e5969;
                    font-size: 12px;
                    border: 0.5px dashed #d9d9d9;
                    background: #fff;
                    cursor: pointer;
                    margin-bottom: 12px;

                    > img {
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

                    > img {
                        width: 10px;
                        height: 10px;
                        margin-left: 3px;
                    }

                    &.blue {
                        background-color: #e6efff;
                        border-radius: 2px;
                        color: #3381ff;
                        margin-bottom: 12px;
                    }

                    &.green {
                        background-color: #e8ffea;
                        border-radius: 2px;
                        color: #00b42a;
                        margin-bottom: 12px;
                    }
                }
            }
        }
    }
}
</style>
