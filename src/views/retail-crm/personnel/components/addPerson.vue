<template>
    <a-modal v-model:visible="isShow" :title="$t('crm_st.add_peo')" @cancel="handleCancel">
        <div class="box-model" @scroll="handleScroll">
            <a-input
                v-model:value="userName"
                :placeholder="$t('retail.search_personnel_name')"
                @pressEnter="inputEvent"
            >
                <template #prefix>
                    <search-outlined class="search-icon-style" @click="inputEvent" />
                </template>
            </a-input>
            <!-- 选好的人员 -->
            <div class="tag-box">
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
        <template #footer>
            <a-button @click="handleCancel">{{ $t('def.cancel') }}</a-button>
            <a-button @click="handleOk" type="primary">{{ $t('def.ok') }}</a-button>
        </template>
    </a-modal>
</template>

<script setup>
import Core from '@/core';
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons-vue';
import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue';

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
});

const emits = defineEmits(['update:isShow', 'update']);

const userName = ref(undefined); // 搜索用户名称
const selectList = ref([]); // 选中的人员数组
const fsList = ref([]);
const pagination = reactive({
    page_size: 10,
    page: 1,
    total: 0,
    total_page: 0,
});
// 飞书的人员计算属性
const fsListComput = computed(() => {
    let result = [];
    result = fsList.value.map($1 => {
        const bool = selectList.value.find($2 => {
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
});

onMounted(() => {
    userListFetch();
});

const { proxy } = getCurrentInstance();
/* fetch start*/
// 人员list
const userListFetch = (params = {}, isSearch = false) => {
    // Core.Api.CRMCustomer.list 测试接口
    Core.Api.RETAIL.externalList({
        key: userName.value,
        page_size: pagination.page_size,
        page: pagination.page,
        ...params,
    })
        .then(res => {
            pagination.total = res.count;
            pagination.total_page = Math.ceil(pagination.total / pagination.page_size);

            // 是否是搜索的
            if (isSearch) {
                fsList.value = [];
            }

            fsList.value = fsList.value.concat(res.list);
            console.log('获取人员list', res, fsList.value);

            if (res.list.length == 0) {
                return proxy.$message.warning(proxy.$t('当前搜索人员不存在'));
            } // 当前搜索人员不存在

            // 过滤掉已经选中的数据
            const arr_le = fsList.value.filter(el => {
                return !el.select;
            });
            if (!isSearch || !userName.value) {
                // 搜索调用接口的
                if (arr_le.length < 5) {
                    pagination.page++;
                    userListFetch({ page: pagination.page, page_size: pagination.page_size });
                }
            } else {
                // 搜索人员的时候如果为空就提示
                if (arr_le.length == 0) {
                    proxy.$message.warning(proxy.$t('retail.add_Tips'));
                }
            }
        })
        .catch(err => {
            console.log('获取人员list err', err);
        });
};
// 保存接口
const saveFetch = (params = {}) => {
    Core.Api.RETAIL.addPerson({
        ...params,
    })
        .then(res => {
            proxy.$message.success(proxy.$t('pop_up.save_success'));
            handleCancel();
            emits('update'); // 更新外部
            console.log('保存成功', res);
        })
        .catch(err => {
            console.log('保存失败', err);
        });
};
/* fetch end*/

// methods
// tag close 删除
const onClose = (item, index) => {
    selectList.value.splice(index, 1);
};

// 添加
const onAdd = item => {
    selectList.value.push(item);
};
// 确定
const handleOk = () => {
    // console.log("selectList.value", selectList.value);

    const selectFilter = selectList.value.map(el => {
        return el.id;
    });
    console.log('selectFilter 过滤出来的', selectFilter);
    saveFetch({ outer_user_id_list: selectFilter });
};
// 取消
const handleCancel = () => {
    console.log('点击的东西');
    emits('update:isShow', false);
};
// 输入框失去焦点/回车/点击
const inputEvent = () => {
    userListFetch({ page: 1 }, true);
};
// 监听滚轮事件
const handleScroll = e => {
    const element = e.target;
    if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
        // console.log('滑到底部');
        if (pagination.page <= pagination.total_page) {
            pagination.page++;
            userListFetch({ page: pagination.page });
        }
    }
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
    .search-icon-style {
        font-size: 16px;
    }
}

.box-model::-webkit-scrollbar {
    width: 4px;
}

.box-model::-webkit-scrollbar-thumb {
    background-color: #d9d9d9;
}
</style>
