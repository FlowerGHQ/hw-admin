<template>
    <div class="shift">
        <div class="shift-box" v-for="item in list" :key="item.id">
            <div class="type wei">{{ item.type }}</div>
            <div>{{ item.time }}</div>
            <div :class="[item.open ? 'type open' : 'open']">{{ item.open ? $t('crm_st.enabled') : $t('crm_st.no_enabled')
            }}</div>
        </div>
    </div>
</template>

<script>
export default {

    name: "StoreList",
    data() {
        return {}
    },
    components: {
    },
    watch: {

    },
    computed: {
        list() {
            let arr = [{
                id:1,
                type: '早',
                time: '8:00 - 9:30',
                open: false,

            }, {
                id:2,
                type: '上',
                time: '8:00 - 9:30',
                open: false,

            }, {
                id:3,
                type: '中',
                time: '8:00 - 9:30',
                open: false,

            }, {
                id:4,
                type: '下',
                time: '8:00 - 9:30',
                open: false,

            }, {
                id:5,
                type: '晚',
                time: '8:00 - 9:30',
                open: false,

            }]
            return arr;
        }
    },
    mounted() {

    },
    methods: {

    }

}
</script>

<style lang="less" scoped>
.shift {

    display: flex;

    .shift-box {
        width: 120px;
        height: 120px;
        margin-right: 16px;
        padding: 12px 0px;
        box-sizing: border-box;
        .flex(space-around);

        .type {

            text-align: center;
            font-family: PingFang SC;
            font-size: 16px;
            font-style: normal;
            line-height: normal;
        }

        .wei {
            font-weight: 600;
        }
    }

    .shift-box:nth-child(1) {
        border-top: 6px solid var(--color-waring-6, #FF7D00);
        background: var(--color-waring-1, #FFF7E8);

        .type {
            color: #FF7D00;
        }
    }

    .shift-box:nth-child(2) {
        border-top: 6px solid var(--brand-6, #0061FF);
        background: var(--brand-1, #E6EFFF);

        .type {
            color: #0061FF;
        }
    }

    .shift-box:nth-child(3) {
        border-top: 6px solid var(--color-success-6, #00B42A);
        background: var(--color-success-1, #E8FFEA);

        .type {
            color: #00B42A;
        }
    }

    .shift-box:nth-child(4) {
        border-top: 6px solid var(--color-gold-6, #F7BA1E);
        background: var(--color-gold-1, #FFFCE8);

        .type {
            color: #F7BA1E;
        }
    }

    .shift-box:nth-child(5) {
        border-top: 6px solid var(--color-text-2, #4E5969);
        background: var(--color-fill-2, #F2F3F5);

        .type {
            color: #4E5969;
        }
    }

    .open {
        color: var(--color-text-3, #86909C);
        font-family: PingFang SC;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
    }

}
</style>