import { ref, reactive, onMounted, computed, toRefs, onBeforeMount } from 'vue';
import _ from 'lodash';
import { init } from 'echarts';

/**
 * @description table 页面表格操作方法封装
 * @param {Function} request 请求方法 这里我使用的自己基于axios封装的类似await-to-js库
 * @param {Object} initParam 获取数据初始化参数(非必传，默认为{})
 * @param {Boolean} isPageAble 是否有分页(非必传，默认为true)
 * @param {Boolean} immediate 是否立即触发 (非必传，默认为true)
 * @param {Function} dataCallBack 对后台返回的数据进行处理的方法(非必传)
 * @param {Number} minPageShowCount 最小显示页码选择器条数
 * */
export function useTable({
    request,
    initParam,
    isPageAble = true,
    immediate = true,
    dataCallBack,
    minPageShowCount = 10,
}) {
    //初始页面
    const INITIAL_PAGE_PARAMS = {
        // 当前页数
        current: 1,
        // 每页显示条数
        size: 10,
        // 总条数
        total: 0,
    };
    const state = reactive({
        tableData: [],
        //分页数据
        pagination: {
            ...INITIAL_PAGE_PARAMS,
        },
        // 查询参数(只包括查询)
        searchParam: {},
        // 初始化默认的查询参数
        searchInitParam: {},
        // 总参数(包含分页和查询参数)
        totalParam: {},
        // 是否加载中
        loading: false,
        // 接口返回的所有内容
        responseData: null,
    });
    //这里传入后台需要的页码数据 字段名自行定义即可
    const pageParam = computed(() => ({
        page: state.pagination.current,
        page_size: state.pagination.size,
    }));
    //是否展示分页器
    const isPaginationVisible = computed(() => {
        return isPageAble && state.pagination.total > minPageShowCount;
    });
    //获取数据
    const getTableData = async () => {
        console.log('getTableData', initParam);
        Object.assign(state.totalParam, isPageAble ? pageParam.value : {}, initParam);
        initParam && (state.searchInitParam = initParam);
        state.loading = true;
        // const [error, res] = await request(state.totalParam)
        console.log('state.totalParam', state.totalParam);
        try {
            const res = await request(state.totalParam);
            state.tableData = res.list;
            state.responseData = res;
            try {
                dataCallBack && (state.tableData = dataCallBack(res));
            } catch (error) {
                console.error(error, 'Format error');
            }
            state.loading = false;
            isPageAble && updatePagination({ total: res.count });
        } catch (error) {
            console.error(error, 'Request error');
            state.loading = false;
        }
    };
    if (immediate)
        onBeforeMount(async () => {
            await getTableData();
        });

    const updatePagination = pagination => {
        Object.assign(state.pagination, pagination);
    };

    const updatedTotalParam = () => {
        state.totalParam = {};
        // 处理查询参数，可以给查询参数加自定义前缀操作
        let currentSearchParam = {};
        // 防止手动清空输入框携带参数（这里可以自定义查询参数前缀）
        for (let key in state.searchParam) {
            // * 某些情况下参数为 false/0 也应该携带参数
            if (Reflect.has(state.searchParam, key)) {
                currentSearchParam[key] = state.searchParam[key];
            }
        }
        Object.assign(state.totalParam, currentSearchParam, isPageAble ? pageParam.value : {});
    };
    const resetParams = () => {
        state.searchParam = _.cloneDeep(state.searchInitParam); // 重置查询参数
        state.pagination = _.cloneDeep(INITIAL_PAGE_PARAMS); // 重置分页参数
        state.totalParam = _.cloneDeep({}); // 重置总参数
        Object.assign(state.totalParam, state.searchParam, isPageAble ? pageParam.value : {});
    };
    const refreshTable = () => {
        resetParams();
        getTableData();
    };
    const search = () => {
        state.pagination.current = 1;
        updatedTotalParam();
        getTableData();
    };
    const onSizeChange = (page, pageSize) => {
        state.pagination.current = 1;
        state.pagination.size = pageSize;
        getTableData();
    };
    const onPageChange = (current, size) => {
        state.pagination.current = current;
        state.pagination.size = size;
        getTableData();
    };
    return {
        ...toRefs(state),
        isPaginationVisible,
        refreshTable,
        search,
        onSizeChange,
        onPageChange,
        getTableData,
    };
}

/**
 * @description Demo
    <template>
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t("item-bom.title") }}</div>
            </div>
            <!-- search -->
            <div class="search">
                <SearchAll :options="searchList"> </SearchAll>
            </div>
            <!-- table -->
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :loading="loading"
                    :row-key="(record) => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, text, record }">
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <a-pagination
                    v-model:current="pagination.current"
                    :page-size="pagination.size"
                    :total="pagination.total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="(total) => $t('n.all_total') + ` ${pagination.total} ` + $t('in.total')"
                    :hide-on-single-page="false"
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="onPageChange"
                    @showSizeChange="onSizeChange"
                />
            </div>
        </div>
    </template>

    <script setup>
    import { onMounted, ref, getCurrentInstance, computed, watch } from "vue";
    import Core from "@/core";
    import SearchAll from "@/components/common/SearchAll.vue";
    import { useTable } from '@/hooks/useTable'
    import { useI18n } from "vue-i18n";

    const $t = useI18n().t;

    const tableColumns = computed(() => {
        let columns = [
            { title: $t("n.name"), dataIndex: "name" },
            { title: $t("n.name_en"), dataIndex: "name_en", key: "name_en" },
            { title: $t("n.continent"), dataIndex: "continent", key: "" },
            { title: $t("n.country"), dataIndex: "country", key: "country" },
            { title: $t("def.operate"), key: "operation", fixed: "right" },
        ];
        return columns;
    });

    onMounted(() => {});
    const request = Core.Api.SalesArea.list;
    const {
        loading,
        tableData,
        pagination,
        search,
        onSizeChange,
        refreshTable,
        onPageChange,
        searchParam,
    } = useTable({ request });
    </script>
*/
