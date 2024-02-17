<template>
    <a-modal
        v-model:visible="isShow"
        :title="isMan ? $t('crm_st.add_man') : $t('crm_st.add_peo')"
        @Ok="handleOk"
        :okText="$t('def.save')"
        @cancel="handleCancel"
    >
        <div class="box-model" @scroll="handleScroll">
            <a-input
                v-model:value="userName"
                :placeholder="$t('retail.search_personnel_name')"
                @blur="inputEvent"
                @pressEnter="inputEvent"
            >
                <template #prefix>
                    <search-outlined :style="{ fontSize: '16px' }" />
                </template>
                <template #suffix>
                    <a-tooltip title="Extra information">
                        <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
                    </a-tooltip>
                </template>
            </a-input>
            <!-- 选好的人员 -->
            <div class="tag-box" v-if="!isMan">
                <template v-for="(item, index) in selectList" :key="index">
                    <a-tag color="processing">
                        <img class="tag-box-img" :src="item.avatar" alt="" />
                        <span>{{ item.name }}</span>
                        <span class="cha" @click="onClose(item, index)">×</span>
                    </a-tag>
                </template>
            </div>

            <!-- 飞书的人员 -->
            <div class="per-box">
                <div class="person" v-for="(item, index) in fsListComput" :key="index">
                    <div class="left">
                        <img class="img" :src="item.avatar" />
                    </div>
                    <div class="middle">
                        <div>{{ item.name }}</div>
                        <div class="department-style">
                            <span v-for="($1, index) in item.department_list" :key="$1.id" class="department-item">
                                <span class="text">{{ $1.name }}</span>
                                <span v-if="item.department_list.length - 1 != index" class="v-line">|</span>
                            </span>
                        </div>
                    </div>

                    <div class="right">
                        <span v-if="item.isTick" class="tick-img">
                            <img class="img" src="~@/assets/images/retail/tick.png" alt="" />
                        </span>
                        <span v-else class="add cursor" @click="onAdd(item)">{{ $t('retail.increase') }}</span>
                    </div>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script>
import Core from '../../../core';
import { SearchOutlined } from '@ant-design/icons-vue';

export default {
    name: 'addStorePeo',
    components: {
        SearchOutlined,
    },
    props: {
        isShow: {
            type: Boolean,
            default: false,
        },
        isMan: {
            // 是否是店长
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            pagination: {
                page_size: 10,
                page: 1,
                total: 0,
                total_page: 0,
            },
            userName: '',
            // 人员列表
            fsList: [],
            // 选中的人员
            selectList: [],
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang;
        },
        fsListComput() {
            let result = [];
            result = this.fsList.map($1 => {
                const bool = this.selectList.find($2 => {
                    return $2.id == $1.id;
                });
                if (bool) {
                    $1.isTick = true;
                } else {
                    $1.isTick = false;
                }
                return {
                    ...$1,
                };
            });
            // console.log("fsListComput", result);
            return result.filter(el => !el.select);
        },
    },
    mounted() {
        this.userListFetch();
    },
    methods: {
        handleOk() {
            console.log('this.selectList', this.selectList);
            const selectFilter = this.selectList.map(el => {
                return el.id;
            });
            console.log('selectFilter 过滤出来的', selectFilter, this.selectList);
            if (this.isMan) {
                // console.log('保存店长',this.selectList);
                let arr = [];
                arr = this.selectList.map($1 => {
                    return {
                        ...$1,
                        user_name: $1.name,
                        status: $1.store_user_status,
                        user_phone: $1.phone,
                        type: $1.store_user_type,
                    };
                });
                this.$emit('save', arr);
                // this.userListFetch() // 更新列表
            } else {
                /*  Core.Api.RETAIL.addStoreUser({
                     ...params
                 }).then(res => {
                     // proxy.$message.success(proxy.$t('pop_up.save_success'))
                     this.handleCancel()
                     // this.userListFetch() // 更新列表
                     console.log("保存人员成功", res);
                 }).catch(err => {
                     console.log("保存人员失败", err);
                 }) */
                this.$emit('save', selectFilter);
            }
            this.handleCancel();
            // this.saveFetch({ outer_user_id_list: selectFilter })
        },
        handleCancel() {
            this.$emit('Cancel', false);
        },

        // 人员list
        userListFetch(params = {}, isSearch = false) {
            // Core.Api.CRMCustomer.list 测试接口
            Core.Api.RETAIL.personList({
                key: this.userName,
                page_size: this.pagination.page_size,
                page: this.pagination.page,
                ...params,
            })
                .then(res => {
                    this.pagination.total = res.count;
                    this.pagination.total_page = Math.ceil(this.pagination.total / this.pagination.page_size);

                    // 是否是搜索的
                    if (isSearch) {
                        this.fsList = [];
                    }

                    this.fsList = this.fsList.concat(res.list);
                    console.log('获取人员list', res, this.fsList);
                })
                .catch(err => {
                    console.log('获取人员list err', err);
                });
        },
        // 监听滚轮事件
        handleScroll(e) {
            const element = e.target;
            if (element.scrollTop + element.clientHeight >= element.scrollHeight - 1) {
                console.log('滑到底部');
                this.pagination.page++;
                this.userListFetch({ page: this.pagination.page });
            }
        },
        onClose(item, index) {
            this.selectList.splice(index, 1);
        },
        onAdd(item) {
            if (this.isMan) {
                this.selectList.length < 1 ? this.selectList.push(item) : (this.selectList = [item]);
            } else {
                this.selectList.push(item);
            }
        },
        // 输入框失去焦点/回车/点击
        inputEvent() {
            this.userListFetch({ page: 1 }, true);
        },
    },
};
</script>

<style lang="less" scoped>
.tag-box {
    margin-top: 20px;

    .ant-tag-processing {
        color: var(--color-text-1, #1d2129);
        border-radius: 24px;
        border: none;
        height: 28px;
        background-color: var(--color-fill-2, #f2f3f5);
        padding-left: 2px;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 28px;
        vertical-align: top;
        display: inline-flex;
        align-items: center;
        margin-bottom: 12px;

        .cha:hover {
            background-color: #ffffff;
            color: #006ef9;
            border-radius: 50%;
        }
    }

    .tab-uncheck .ant-tag-processing {
        border: #edf2f5 0.5px solid;
        border-radius: 4px;
        height: 28px;
        background: #edf2f5;
        color: #1e2023;

        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 28px;
        vertical-align: top;
        margin-top: 0px;
    }

    .cha {
        background-color: var(--color-fill-2, #f2f3f5);
        height: 16px;
        width: 16px;
        font-size: 16px;
        display: inline-block;
        line-height: 16px;
        text-align: center;
        font-weight: 800;
        border-radius: 50%;
        margin-left: 4px;
        color: rgba(201, 205, 212, 1);
        cursor: pointer;
    }

    .tag-name {
        display: inline-block;
        background-color: red;
        color: #ffffff;
        border-radius: 50%;
        height: 24px;
        width: 24px;
        margin-right: 5px;
        padding: 0px 2px;
        font-size: 10px;
    }

    .tag-box-img {
        width: 24px;
        height: 24px;
        object-fit: cover;
        border-radius: 50%;
        margin-right: 4px;
    }
}

.per-box {
    width: 100%;

    .person {
        display: flex;
        height: 56px;
        padding: 8px 0px;
        box-sizing: border-box;
        margin-top: 12px;

        .left {
            .img {
                width: 40px;
                height: 40px;
                object-fit: cover;
                border-radius: 50%;
            }
        }

        .middle {
            display: flex;
            flex: 1;
            flex-direction: column;
            box-sizing: border-box;
            justify-content: space-between;
            padding: 0px 12px;

            .department-style {
                .department-item {
                    font-family: PingFang SC;
                    font-size: 12px;
                    font-weight: 400;

                    .text {
                        color: var(--color-text-3, #86909c);
                    }

                    .v-line {
                        margin: 0 5px;
                        color: #f0f0f0;
                    }
                }
            }
        }

        .right {
            line-height: 40px;

            .add {
                height: 30px;
                width: 36px;
                line-height: 30px;
                text-align: center;
                display: inline-block;
                background-color: var(--color-fill-2, #f2f3f5);
                font-size: 14px;
                border-radius: 2px;
                color: var(--brand-6, #0061ff);
            }

            .img {
                display: inline-block;
                width: 24px;
                height: 24px;
            }
        }
    }
}

.box-model {
    max-height: 360px;
    overflow: auto;
    padding: 0px 10px;
}

.box-model::-webkit-scrollbar {
    width: 4px;
}

.box-model::-webkit-scrollbar-thumb {
    background-color: #d9d9d9;
}
</style>
