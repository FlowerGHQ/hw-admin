

import { ref, toRefs, onMounted, watch, getCurrentInstance, toRaw, reactive } from "vue"


/**
 * @description: 这是封装提取的table的公共逻辑
 * @param {*} request 请求数据的方法
 * @param {*} searchForm 搜索表单的数据
 * @return {*} 返回的是table的数据,分页的数据,loading的状态,搜索表单的数据,分页的方法,请求数据的方法
 */
export const useTable = ({request,searchForm}) => {
    let tableData = ref([])
    let pagination = reactive({
        page: 1,
        page_size: 20,
        total: 0
    })
    let loading = ref(false)
    let searchFormRef = searchForm

    const pageChange = (page) => {
        pagination.page = page
        getTableData()
    }
    const pageSizeChange = (current, size) => {
        pagination.page = current
        pagination.page_size = size
        getTableData()
    }
    const getTableData = () => {
        loading.value = true
        const { page, page_size, total } = pagination
        // 将请求参数组合
        let param = {
            page,
            page_size,
            ...searchFormRef
        }
        //   请求数据
        request(param).then(res => {
            let { total } = toRefs(pagination)
            tableData.value = res.list
            total.value = res.count
            loading.value = false
        })
    }
    onMounted(() => {
        getTableData()
    })
    return {
        tableData,
        pageChange,
        pageSizeChange,
        getTableData,
        pagination,
        loading
    }
}