<template>
    <div id="MaterialsList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">物料列表</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新建生产单</a-button>
                </div>
            </div>

            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                         :row-key="record => record.id" :pagination='false' @change="handleTableChange">
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.key === 'detail'">
                            <div class="table-img">
                                <a-image :width="30" :height="30" :src="$Util.imageFilter(record.logo)" fallback='无'/>
                                <a-tooltip placement="top" :title='text'>
                                    <a-button type="link" @click="routerChange('detail', record)" style="margin-left: 6px;">
                                        {{ text || '-' }}
                                    </a-button>
                                </a-tooltip>
                            </div>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'flag_receive_transfer'">
                            <a-switch v-if="$auth('ADMIN')" :checked="!!record.flag_receive_transfer"
                                      checked-children="是" un-checked-children="否" @click="handleTransferChange(record)"/>
                            <div v-else class="status status-bg status-tag" :class="text ? 'green' : 'red'">
                                {{ text ? '接受' : '不接受' }}
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="text ? 'green' : 'red'">
                                {{ text ? '启用中' : '已禁用' }}
                            </div>
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type='link' @click="routerChange('detail', record)"><i class="icon i_detail"/> 详情</a-button>
                            <a-button type="link" @click="routerChange('edit',record)"><i class="icon i_edit"/> 修改</a-button>
                            <a-button type='link' @click="handleStatusChange(record)" :class="record.status ? 'danger' : ''">
                                <template v-if="record.status"><i class="icon i_forbidden"/>禁用</template>
                                <template v-else><i class="icon i_enable"/>启用</template>
                            </a-button>
                        </template>
                    </template>
                </a-table>
            </div>

            <div class="paging-container">
                <a-pagination
                    v-model:current="currPage"
                    :page-size='pageSize'
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => `共${total}条`"
                    :hide-on-single-page='false'
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
        </div>


    </div>
</template>

<script>
import Core from '../../core';
export default {
    components: {},
    props: {},
    data() {
        return {
            // 分页
            current: 1,
            pageSize: 20,
            total: 0,
        }
    },
    watch: {},
    computed: {},
    mounted() {
        this.getList()
    },
    methods: {
        getList() {
            Core.Api.ProductionOrder.list({
                page: this.current,
                pageSize: this.pageSize,
            })
        },
        routerChange(type) {
            switch(type) {
                case edit: {}; break
            }
        }
    },
}
</script>

<style lang='less' scoped>
#MaterialsCategory {

}
</style>
