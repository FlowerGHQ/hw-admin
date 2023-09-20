// table的hooks

import { ref, computed, onMounted, watch, getCurrentInstance } from "vue"
export const useTable = (props, emit) => {
    console.log("useTable", props, emit)
    let tableData = ref([])
    let currPage = ref(1)
    let pageSize = ref(20)
    let total = ref(0)
    // 获取全局$t方法
    const { ctx } = getCurrentInstance()
    const { $t } = ctx.$root
    const tableColumns = computed(() => {
        return [
            { title: $t("coc.coc_name"), dataIndex: "coc_name", key: "coc_name" },
            {
                title: $t("coc.coc_version"),
                dataIndex: "coc_version",
                key: "coc_version",
            },
            {
                title: $t("coc.coc_apply_vehicle"),
                dataIndex: "coc_apply_vehicle",
                key: "coc_apply_vehicle",
            },
            {
                title: $t("coc.coc_validity_date"),
                dataIndex: "coc_validity_date",
                key: "coc_validity_date",
            },
            {
                title: $t("coc.coc_create_date"),
                dataIndex: "coc_create_date",
                key: "coc_create_date",
            },
            {
                title: $t("coc.coc_operation"),
                dataIndex: "coc_operation",
                key: "coc_operation",
            },
        ]
    })
    const pageChange = (page) => {
        currPage.value = page
        getTableData()
    }
    const pageSizeChange = (current, size) => {
        pageSize.value = size
        currPage.value = 1
        getTableData()
    }
    const getTableData = () => {
        tableData.value = [
            {
                id: 0,
                coc_name: "COC模板1",
                coc_version: "1.0",
                coc_apply_vehicle: "汽车",
                coc_validity_date: ["2021-01-01 12:00", "2021-01-01 12:00"],
                coc_create_date: "2021-01-01",
            },
        ]
    }
    onMounted(() => {
        getTableData()
    })
    return {
        tableData,
        tableColumns,
        pageChange,
        pageSizeChange,
        currPage,
        pageSize,
        total,
    }
}