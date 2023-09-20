// table的hooks

import { ref, computed, onMounted, watch, getCurrentInstance } from "vue"
export const useTable = (columnsList) => {
    let tableData = ref([])
    let currPage = ref(1)
    let pageSize = ref(20)
    let total = ref(0)
    // 获取全局$t方法
    const { ctx } = getCurrentInstance()
    const { $t } = ctx.$root
    const tableColumns = computed(() => {
        return columnsList
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