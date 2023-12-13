<template>
    <div class="fittings-three">
        <div class="upload">
            <BomUpload />
        </div>
        <div class="table-container"></div>
    </div>
</template>

<script setup>
import BomUpload from "./BomUpLoad.vue";

</script>

<style lang="less" scoped>
.fittings-three {
    .upload {
        width: 100%;
        min-height: 158px;
        border: 1px solid  #E2E2E2;
        padding: 23px 20px;
    }
    .table-container {
        
    }
}
</style>