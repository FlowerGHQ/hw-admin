<template>
    <div class="PageHeader">
        <a-breadcrumb separator="/" class="breadcrumb" v-if="levelList.length">
            <a-breadcrumb-item v-for="(item, index) in levelList" :key="item.path" class="breadcrumb-item">
                <span v-if="index == levelList.length - 1">{{ item.meta.title }}</span>
                <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
            </a-breadcrumb-item>
        </a-breadcrumb>
    </div>
</template>

<script>
export default {
    components: {},
    props: {},
    data() {
        return {
            firstLevel: {},
            levelList: null,
        };
    },
    watch: {
        $route(route) {
            console.log('route', route);
            this.getBreadcrumb();
        },
    },
    computed: {},
    created() {
        this.getBreadcrumb();
    },
    methods: {
        getBreadcrumb() {
            let matched = this.$route.matched.filter(item => item.meta && item.meta.title);
            this.firstLevel = matched.splice(0, 1)[0];
            let levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
            for (let i = 0; i < levelList.length; i++) {
                if (levelList[i + 1] && levelList[i].meta.title === levelList[i + 1].meta.title) {
                    levelList.splice(i + 1, 1);
                }
            }
            let lastLevel = levelList[levelList.length - 1];
            if (lastLevel && lastLevel.meta && lastLevel.meta.parent) {
                let list = {
                    path: lastLevel.meta.parent,
                    meta: {
                        title: lastLevel.meta.title.split('详情')[0] + '列表',
                        auth: '',
                    },
                };
                // levelList.splice(levelList.length - 1, 0, list)å
            }

            this.levelList = levelList;
        },
        handleLink(item) {
            const { redirect, path } = item;
            this.$router.push(path);
        },
    },
};
</script>

<style lang="less">
.PageHeader {
    .fac();
    height: 38px;
    background: #f6f8fa;
    .breadcrumb {
        .fac();
        height: 100%;
        border-left: 1px solid @BC_T;
        padding-left: 24px;
        .breadcrumb-item {
            span {
                color: @TC_N;
                cursor: default;
            }
            a {
                color: @TC_N;
                &:hover {
                    color: @TC_P;
                }
            }
        }
    }
}
</style>
