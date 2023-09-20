<template>
    <div>
        <div>COC管理后台【管理员】</div>
        <div>COC管理后台【业务】</div>
        <div>是否是超级管理员 {{ Core.Data.getManager() }}</div>
        <div>是否为平台方（管理员账号下管理员与业务员）{{ Core.Data.getLoginType() }}</div>

        <!-- 判断是平台方还是分销商 -->
        <component :is="adminComponent"></component>
    </div>
</template>

<script setup>
    import Core from "../../core";
    import { computed, ref } from "vue";
    import distributorCocList from "./components/distributor-coc-list.vue"; // 分销商
    import platformCocList from "./components/platform-coc-list.vue"; // 平台方普通用户
    import platformSuperList from "./components/platform-super-list.vue"; // 超级管理员

    const adminComponent = computed(() => {
        if (Core.Data.getLoginType() === Core.Const.USER.TYPE.DISTRIBUTOR) {
			// 判断其是否是分销商
            return distributorCocList;
        } else if (Core.Data.getLoginType() === Core.Const.USER.TYPE.ADMIN) {
			// 判断其是平台方的普通用户还是超级管理员      
			return Core.Data.getManager() ? platformSuperList : platformCocList
        } else {
            return null;
        }
    });
</script>

<style lang="less" scoped></style>
