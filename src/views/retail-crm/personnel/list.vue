<template>
    <div id="personnel">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('retail.personnel_list') }}</div>
            </div>
            <div class="search">
                <a-row class="row-detail">
                    <!-- 搜索人员 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                        <div class="key">{{ $t('retail.searcher') }}：</div>
                        <div class="value">
                            <a-input :placeholder="$t('retail.person_or_name')" v-model:value="searchForm.key" />
                        </div>
                    </a-col>
                    <!-- 工作状态 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                        <div class="key">{{ $t('retail.working_condition') }}：</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.store_user_status"
                                :placeholder="$t('def.select')"
                                class="select-w"
                            >
                                <a-select-option
                                    v-for="(item, key) in Core.Const.RETAIL.Working_condition"
                                    :key="item.key"
                                    :value="item.key"
                                    :disabled="item.key === 3"
                                >
                                    {{ item[$i18n.locale] }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <!-- 职务 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                        <div class="key">{{ $t('retail.job') }}：</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.store_user_type"
                                :placeholder="$t('def.select')"
                                class="select-w"
                            >
                                <a-select-option v-for="item in Core.Const.RETAIL.Job" :value="item.key">
                                    {{ item[$i18n.locale] }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <template v-if="show">
                        <!-- 所属大区 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                            <div class="key">{{ $t('retail.subregion') }}：</div>
                            <div class="value">
                                <a-select
                                    class="select-w"
                                    v-model:value="searchForm.group_id"
                                    :placeholder="$t('def.select')"
                                    @select="allChange('group_id')"
                                    allowClear
                                >
                                    <a-select-option v-for="item of regionsList" :key="item.id" :value="item.id">
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </div>
                        </a-col>
                        <!-- 所属城市 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                            <div class="key">{{ $t('retail.home_city') }}：</div>
                            <div class="value">
                                <a-select
                                    class="select-w"
                                    v-model:value="searchForm.city"
                                    :placeholder="$t('retail.p_s_region')"
                                    allowClear
                                    @select="allChange('city')"
                                >
                                    <a-select-option v-for="item of cityList" :key="item.city" :value="item.city">
                                        {{ item.city }}
                                    </a-select-option>
                                </a-select>
                            </div>
                        </a-col>
                        <!-- 所属门店 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                            <div class="key">{{ $t('retail.affiliated_store') }}：</div>
                            <div class="value">
                                <a-select
                                    class="select-w"
                                    v-model:value="searchForm.store_id"
                                    :placeholder="$t('def.select')"
                                    allowClear
                                >
                                    <a-select-option v-for="item of storeList" :key="item.id" :value="item.id">
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </div>
                        </a-col>
                    </template>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item" @click="moreSearch">
                        <span class="key option-text">
                            <span class="allow-icon">{{ show ? $t('search.stow') : $t('retail.more_screening') }}</span>
                            <i v-if="!show" class="icon i_xialajiantouxiao"></i>
                            <i v-else class="icon i_shouqijiantouxiao"></i>
                        </span>
                    </a-col>
                </a-row>
            </div>
            <div class="table-container">
                <div class="btns">
                    <div class="btn-left">
                        <!-- 添加人员 -->
                        <a-button type="primary" @click="addPerson">
                            <i class="icon i_add" />
                            {{ $t('retail.add_personnel') }}
                        </a-button>
                    </div>
                    <div class="btn-right">
                        <a-button @click="handleSearchReset">
                            {{ $t('def.reset') }}
                        </a-button>
                        <a-button @click="handleSearch" type="primary">
                            {{ $t('def.search') }}
                        </a-button>
                    </div>
                </div>
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="channelPagination"
                    @change="handleTableChange"
                >
                    <template #headerCell="{ title }">
                        <span class="title-style">
                            {{ $t(title) }}
                        </span>
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <!-- 名称 -->
                        <template v-if="column.key === 'name'">
                            <img v-if="record.avatar" class="avatar-style" :src="record.avatar" alt="" />
                            <span class="user-name">{{ text }}</span>
                            <span>{{ record.employee_no }}</span>
                        </template>
                        <!-- 添加人员 -->
                        <template v-if="column.key === 'create_user_name'">
                            <img
                                v-if="record.create_user_avatar"
                                class="avatar-style"
                                :src="record.create_user_avatar"
                            />
                            <span class="user-name">{{ text || '-' }}</span>
                            <span>{{ record.create_employee_no }}</span>
                        </template>
                        <!-- 工作状态 -->
                        <template v-if="column.key === 'store_user_status'">
                            {{
                                Core.Const.RETAIL.Working_condition[text]
                                    ? Core.Const.RETAIL.Working_condition[text][$i18n.locale]
                                    : '-'
                            }}
                        </template>
                        <!-- 所属区域 -->
                        <template v-if="column.key === 'group_name'">
                            {{ text }}{{ record.city ? '-' : '' }}{{ record.city || '-' }}
                        </template>
                        <!-- 所属门店 -->
                        <template v-if="column.key === 'store_name'">
                            {{ text || '-' }}
                        </template>
                        <!-- 职务 -->
                        <template v-if="column.key === 'store_user_type'">
                            {{ Core.Const.RETAIL.Job[text] ? Core.Const.RETAIL.Job[text][$i18n.locale] : '-' }}
                        </template>
                        <!-- 时间统一转换 -->
                        <template v-if="column.key === 'join_time'">
                            {{ $Util.timeFilter(text, 3) }}
                        </template>
                        <template v-if="column.key === 'create_time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <!-- $auth页面按钮显示与否 具体可以看i18n 文件中authority的配置 -->
                            <!-- v-if="$auth('crm-user.detail')" -->
                            <a-button type="link" @click="routerChange('detail', record)">
                                {{ $t('retail.view') }}
                            </a-button>
                            <!-- v-if="$auth('crm-user.save')" -->
                            <a-button type="link" @click="routerChange('edit', record)">
                                {{ $t('retail.edit') }}
                            </a-button>
                            <!-- v-if="$auth('crm-user.delete')" -->
                            <a-popconfirm
                                :ok-text="$t('retail.confirm')"
                                :cancel-text="$t('retail.cancel')"
                                @confirm="routerChange('delete', record)"
                            >
                                <template #title>
                                    <span>{{ $t('retail.confirm_delete_person') }}</span>
                                    <span class="name-employeeno">{{ record.name }}</span>
                                    <span class="name-employeeno">{{ record.employee_no }}</span>
                                </template>
                                <a-button type="link" danger>
                                    {{ $t('retail.delete') }}
                                </a-button>
                            </a-popconfirm>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
        <addPersonComponent v-if="isShow" v-model:isShow="isShow" @update="onUpdate" />
    </div>
</template>

<script setup>
import Core from '@/core';
import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import addPersonComponent from './components/addPerson.vue';

const show = ref(false); // 更多收起
const loading = ref(false); // 加载
const searchForm = ref({
    key: undefined, //搜索名称/手机号
    store_user_status: undefined, //工作状态
    store_user_type: undefined, //职务
    group_id: undefined, //所属大区id
    group_city: undefined, //所属城市
    store_id: undefined, //所属门店
});
// 添加人员弹窗
const isShow = ref(false);

const regionsList = ref([]); // 所属区域
const cityList = ref([]); // 城市list
const storeList = ref([]); // 门店list
const tableData = ref([]);
const channelPagination = ref({
    current: 1,
    pageSizeOptions: ['20', '40', '60', '80', '100'],
    pageSize: 20,
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 是否可以改变 pageSize
    total: 0,
    showTotal: total => `${proxy.$t('n.all_total')} ${total} ${proxy.$t('in.total')}`,
}); // 分页配置

onMounted(() => {
    getTableDataFetch();
    getRegionsDataFetch();
    getStoreDataFetch();
});
const { proxy } = getCurrentInstance();
const router = useRouter();

/* 计算属性 */
const tableColumns = computed(() => {
    let columns = [
        {
            title: 'retail.name',
            dataIndex: 'name',
            key: 'name',
        },
        // 工作状态
        {
            title: 'retail.working_condition',
            dataIndex: 'store_user_status',
            key: 'store_user_status',
        },
        {
            title: 'retail.phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        // 职务
        {
            title: 'retail.job',
            dataIndex: 'store_user_type',
            key: 'store_user_type',
        },
        // 所属区域
        {
            title: 'retail.area',
            dataIndex: 'group_name',
            key: 'group_name',
        },
        // 所属门店
        {
            title: 'retail.affiliated_store',
            dataIndex: 'store_name',
            key: 'store_name',
        },
        // 绑定线索数
        {
            title: 'retail.number_of_bound_threads',
            dataIndex: 'clue_count',
            key: 'clue_count',
        },
        // 上岗时间
        {
            title: 'retail.start_date',
            dataIndex: 'join_time',
            key: 'join_time',
        },
        // 添加人员
        {
            title: 'retail.add_personnel',
            dataIndex: 'create_user_name',
            key: 'create_user_name',
        },
        // 添加时间
        {
            title: 'retail.add_time',
            dataIndex: 'create_time',
            key: 'create_time',
        },
        { title: 'retail.operate', key: 'operation', fixed: 'right' },
    ];

    // 判断权限有这个权限之一就显示
    if (proxy.$auth('crm-user.detail', 'crm-user.save', 'crm-user.delete')) {
        columns.push({ title: 'retail.operate', key: 'operation', fixed: 'right' });
    }

    return columns;
});

/* 接口 start*/
// table接口
const getTableDataFetch = (params = {}) => {
    loading.value = true;
    Core.Api.RETAIL.personList({
        page_size: channelPagination.pageSize,
        page: channelPagination.current,
        ...params,
    })
        .then(res => {
            channelPagination.value.total = res.count;
            console.log('table数据接口', res);
            tableData.value = res.list;
        })
        .catch(err => {
            console.log('getTableData err:', err);
        })
        .finally(() => {
            loading.value = false;
        });
};
// 删除
const deleteTableRowFetch = (params = {}) => {
    Core.Api.RETAIL.deletePersonList({
        ...params,
    })
        .then(res => {
            getTableDataFetch({ page: 1 });
            proxy.$message.success(proxy.$t('retail.delete_success'));
        })
        .catch(err => {
            proxy.$message.success(proxy.$t('retail.delete_error'));
        });
};
// 获得所属区域
const getRegionsDataFetch = (params = {}) => {
    Core.Api.RETAIL.regionsList({ ...params })
        .then(res => {
            // console.log("获得所属区域 sucess", res);
            regionsList.value = res.list;
        })
        .catch(err => {
            console.log('获得所属区域 err', err);
        });
};
// 门店list
const getStoreDataFetch = (params = {}) => {
    Core.Api.RETAIL.storeList({ ...params })
        .then(res => {
            // console.log("门店list sucess", res);
            storeList.value = res.list;
        })
        .catch(err => {
            console.log('门店list err', err);
        });
};
/* 接口 end*/
/* methods */
// 条件初始化
const init = () => {
    regionsList.value = [];
    cityList.value = [];
    storeList.value = [];
    searchForm.value = {};
    getTableDataFetch({ page: 1 });
    getRegionsDataFetch();
    getStoreDataFetch();
};
const routerChange = (type, item = {}) => {
    let routeUrl = '';
    switch (type) {
        case 'detail': // 详情
            routeUrl = router.resolve({
                path: '/retail-personnel/personnel-detail',
                query: { type: 'detail', id: item.id },
            });
            window.open(routeUrl.href, '_blank');
            break;
        case 'edit': // 编辑
            routeUrl = router.resolve({
                path: '/retail-personnel/personnel-detail',
                query: { type: 'edit', id: item.id },
            });
            window.open(routeUrl.href, '_blank');
            break;
        case 'delete': // 删除
            deleteTableRowFetch({ id: item.id });
            break;
    }
};
// 收起更多按钮
const moreSearch = () => {
    show.value = !show.value;
};
// 查询按钮
const handleSearch = () => {
    console.log('searchForm', searchForm.value);
    getTableDataFetch({
        page: 1,
        ...searchForm.value,
    });
};
// 重置按钮
const handleSearchReset = () => {
    init();
};

// 添加人员
const addPerson = () => {
    isShow.value = true;
};

// 添加组件更新
const onUpdate = () => {
    getTableDataFetch({ page: 1 });
};
// 所属大区 select
const allChange = (type, item = {}) => {
    switch (type) {
        case 'group_id':
            const result = regionsList.value.find(el => {
                return el.id == searchForm.value.group_id;
            });
            // console.log("输出结果", result);
            cityList.value = result?.city_list || [];
            getStoreDataFetch({ group_id: searchForm.value.group_id });
            break;
        case 'city':
            getStoreDataFetch({ group_id: searchForm.value.group_id, city: searchForm.value.city });
            break;
    }
};
// 分页事件
const handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...channelPagination.value };
    pager.current = pagination.current;
    if (pagination.pageSize !== channelPagination.value.pageSize) {
        pager.current = 1;
        pager.pageSize = pagination.pageSize;
    }
    channelPagination.value = pager;
    getTableDataFetch({
        page_size: channelPagination.value.pageSize,
        page: channelPagination.value.current,
    });
};
</script>

<style lang="less" scoped>
.btns {
    .fcc(space-between);
    margin-bottom: 20px;
    .btn-left {
        .left-btn-style {
            background-color: #94bfff;
            color: #ffffff;
        }
    }
    .btn-right {
    }
}

.avatar-style {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 8px;
}
.user-name {
    margin-right: 8px;
}

.title-style {
    color: var(--color-text-5, #1d2129);
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 500;
}
.name-employeeno {
    font-weight: 600;
    color: #1d2129;
    margin-left: 10px;
}
</style>
