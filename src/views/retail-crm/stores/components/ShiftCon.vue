<template>
    <div>
        <div class="value">
            <a-button type="primary" v-if="$auth('customer.detail')" @click="addPopShow">{{
                $t('crm_st.add_len')
            }}</a-button>
        </div>
        <div>
            <ShfitItem />
        </div>
        <a-modal v-model:visible="isShow" :maskClosable="true" width="688px" height="612px" :closable="false">
            <template #title>
                <div class="header">
                    <div class="title">选择班次时间</div>
                    <a-button>前往新增模板</a-button>
                </div>
            </template>
            <a-radio-group v-model:value="value">
                <div class="con" v-for="(item, inde) in 5" :key="inde">
                    <a-radio :style="radioStyle" :value="inde">Option {{ inde }}</a-radio>
                    <ShfitItem />
                </div>
            </a-radio-group>
        </a-modal>
    </div>
</template>

<script>
import ShfitItem from './ShfitItem.vue';
export default {
    name: 'ShiftCon',
    data() {
        return {
            isShow: false,
            value: '',
        };
    },
    components: {
        ShfitItem,
    },
    watch: {},
    computed: {},
    mounted() {},
    methods: {
        addPopShow() {
            this.isShow = true;
        },
    },
};
</script>

<style lang="less" scoped>
.value {
    margin-bottom: 20px;
}

.header {
    width: 100%;
    .fcc(space-between);
}
</style>
