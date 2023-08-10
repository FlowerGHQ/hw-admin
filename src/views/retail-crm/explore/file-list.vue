<template>
    <div id="file-list" class="list-container">
        <div style="width: 512px;border-right: 2px solid #F0F0F0;">
            <div class="title-container">
                <div class="title-area">{{ $t('f.file') }}</div>
            </div>

            <div style="padding: 0px 26px 20px 22px;flex: 1;min-height: 700px;">
                <div class="search-item">
                    <!-- 搜索门店 -->
                    <a-input :placeholder="$t('s.search_place')" v-model:value="searchName" @pressEnter="searchCity" />
                    <a-button type="primary" @click="searchCity">{{
                        $t("def.search_se")
                    }}
                    </a-button>
                </div>

                <div class="directory">
                    <div class="title">
                        {{ $t('retail.directory') }}
                    </div>
                    <a-button type="primary" ghost>{{ $t('retail.add_directory') }}</a-button>
                </div>


                <div class="file-explore-box">
                    <div class="explore-list" v-for="$1 in 20">

                    </div>

                </div>

            </div>
        </div>
        <div style="flex: 1;">
            <div class="title-container">
                <div class="title-area">{{ $t('n.content') }}</div>
                <div class="btns-area">
                    <a-button type="primary" ghost>{{ $t('retail.add_content') }}</a-button>
                </div>
            </div>

            <div class="">


            </div>



        </div>
    </div>
</template>

<script>

export default {

    name: "StoreList",
    data() {
        return {}
    },
    watch: {

    },
    computed: {

    },
    mounted() {

    },
    methods: {

    }

}
</script>

<style lang="less" scoped>
#file-list {
    display: flex;
}

.search-item {
    display: flex;
    border: 1px solid var(--color-border-2, #E5E6EB);
    border-radius: 2px;

    .ant-btn {
        border-radius: 2px;
    }
}

.ant-input {
    border: 1px #FFFFFF solid;
    border-radius: 2px 0px 0px 2px;
}

.directory {
    align-items: center;
    padding: 30px 0px 20px;
    .fj();

    .title {
        color: var(--color-text-1, #1D2129);
        font-family: PingFang SC;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
    }

}

.file-explore-box {
    height: 600px;
    overflow-y:auto;

    .explore-list {
        height: 50px;
        width: 100%;
        background-color: pink;
        margin-bottom: 10px;
    }
}
</style>