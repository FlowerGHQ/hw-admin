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
            <a-table :columns="columns" :data-source="data">
                <template #bodyCell="{ column, record }">
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, computed, watch } from "vue";
import Core from "@/core";
import SearchAll from "@/components/common/SearchAll.vue";

onMounted(() => {});
/* Fetch start*/

/* Fetch end*/

/* methods start*/

/* methods end*/
</script>

<style lang="less" scoped></style>
