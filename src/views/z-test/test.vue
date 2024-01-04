<template>
    <div id="SalesAreaList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t("ar.list") }}</div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col
                        :xs="24"
                        :sm="24"
                        :xl="8"
                        :xxl="6"
                        class="search-item">
                        <div class="key">{{ $t("n.name") }}:</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchParam.name"
                                @keydown.enter="search" />
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="search" type="primary">{{
                        $t("def.search")
                    }}</a-button>
                    <a-button @click="refreshTable">{{
                        $t("def.reset")
                    }}</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :loading="loading"
                    :row-key="(record) => record.id"
                    :pagination="false">
                    <template #bodyCell="{ column, text, record }">
                        <template
                            v-if="
                                column.dataIndex === 'name' &&
                                $auth('sales-area.detail')
                            ">
                            <a-tooltip placement="top" :title="text">
                                <a-button
                                    type="link"
                                    @click="routerChange('detail', record)"
                                    >{{ text }}</a-button
                                >
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'country'">
                            {{ text || "-" }}
                        </template>
                        <template v-if="column.key === 'name_en'">
                            {{ text || "-" }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button
                                type="link"
                                @click="routerChange('edit', record)"
                                v-if="$auth('sales-area.save')"
                                ><i class="icon i_edit" />{{
                                    $t("def.edit")
                                }}</a-button
                            >
                            <a-button
                                type="link"
                                @click="handleDelete(record.id)"
                                class="danger"
                                v-if="$auth('sales-area.delete')"
                                ><i class="icon i_delete" />{{
                                    $t("def.delete")
                                }}</a-button
                            >
                        </template>
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
                    :show-total="
                        (total) =>
                            $t('n.all_total') + ` ${pagination.total} ` + $t('in.total')
                    "
                    :hide-on-single-page="false"
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="onPageChange"
                    @showSizeChange="onSizeChange" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Core from "../../core";
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
// 使用useTable
import { useTable } from "@/hooks/useTable";
import { useI18n } from "vue-i18n";
const $t = useI18n().t;
const $i18n = useI18n();
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

const tableColumns = computed(() => {
    let columns = [
        { title: $t("n.name"), dataIndex: "name" },
        { title: $t("n.name_en"), dataIndex: "name_en", key: "name_en" },
        { title: $t("n.continent"), dataIndex: "continent", key: "" },
        { title: $t("n.country"), dataIndex: "country", key: "country" },
        { title: $t("def.operate"), key: "operation", fixed: "right" },
    ];
    if ($i18n.locale === "en") {
        columns.splice(2, 1, {
            title: $t("n.continent"),
            dataIndex: "continent_en",
            key: "country",
        });
        columns.splice(3, 1, {
            title: $t("n.country"),
            dataIndex: "country_en",
            key: "country",
        });
    }
    return columns;
});
</script>
