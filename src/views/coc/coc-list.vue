<template>
    <div>
        <div>COC管理后台【管理员】</div>
        <div>COC管理后台【业务】</div>
        <div>是否是超级管理员 {{ Core.Data.getManager() }}</div>
    </div>
</template>

<script setup>
    import Core from '../../core'
</script>

<style lang="less" scoped>

</style>