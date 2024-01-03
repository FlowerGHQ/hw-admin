<template>
    <div class="list-container fittings">
        <div class="title-container">
            <div class="title-area">{{ $t("item-bom.title") }}</div>
        </div>
        <!-- search -->
        <div class="search">
            <SearchAll :options="searchList">
                
            </SearchAll>
        </div>
        <!-- table -->
        <div class="table-container">
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, computed, watch } from "vue";
import Core from "@/core";
import SearchAll from "@/components/common/SearchAll.vue"


onMounted(() => {
});
/* Fetch start*/

/* Fetch end*/

/* methods start*/

/* methods end*/

</script>

<style lang="less" scoped>
.fittings {
    width: 100%;
    .title {
        color: #1d2129;
        font-family: PingFang SC;
        font-size: 16px;
        margin-bottom: 10px;
    }
    .table-title {
        color: #1d2129;
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 500;
    }
}

.set-width {
    width: 100px;
}
</style>
