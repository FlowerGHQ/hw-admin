<template>
    <div>
        <MyUpload
            :tip="$t('my_upload.uploadOne')"
            v-model:value="fileList"
            showTip
            :limit="1"
            :limitSize="2"
            tipPosition="bottom" />
        <MyUpload
            :tip="$t('my_upload.uploadNine')"
            v-model:value="fileList"
            showTip
            :limit="9"
            :limitSize="2"
            tipPosition="right" />
        <MyUpload
            :tip="$t('my_upload.uploadNine')"
            v-model:value="fileList"
            showTip
            :limit="9"
            :limitSize="2"
            tipPosition="bottom" />
    </div>
</template>

<script setup>
import MyUpload from "@/components/myUpload/index.vue";
</script>

<style lang="less" scoped></style>
