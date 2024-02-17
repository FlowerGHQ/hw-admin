<template>
    <div class="shift">
        <div class="shift-box" v-for="item in list" :key="item.id">
            <div class="type wei">{{ item.type }}</div>
            <div>{{ item.time }}</div>
            <div :class="[item.open ? 'type open' : 'open']">
                {{ item.open ? $t('crm_st.enabled') : $t('crm_st.no_enabled') }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'StoreList',
    data() {
        return {};
    },
    components: {},
    watch: {},
    computed: {
        list() {
            let arr = [
                {
                    id: 1,
                    type: '早',
                    time: '8:00 - 9:30',
                    open: false,
                },
                {
                    id: 2,
                    type: '上',
                    time: '8:00 - 9:30',
                    open: false,
                },
                {
                    id: 3,
                    type: '中',
                    time: '8:00 - 9:30',
                    open: false,
                },
                {
                    id: 4,
                    type: '下',
                    time: '8:00 - 9:30',
                    open: false,
                },
                {
                    id: 5,
                    type: '晚',
                    time: '8:00 - 9:30',
                    open: false,
                },
            ];
            return arr;
        },
    },
    mounted() {},
    methods: {},
};
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
        border-top: 6px solid var(--color-waring-6, #ff7d00);
        background: var(--color-waring-1, #fff7e8);

        .type {
            color: #ff7d00;
        }
    }

    .shift-box:nth-child(2) {
        border-top: 6px solid var(--brand-6, #0061ff);
        background: var(--brand-1, #e6efff);

        .type {
            color: #0061ff;
        }
    }

    .shift-box:nth-child(3) {
        border-top: 6px solid var(--color-success-6, #00b42a);
        background: var(--color-success-1, #e8ffea);

        .type {
            color: #00b42a;
        }
    }

    .shift-box:nth-child(4) {
        border-top: 6px solid var(--color-gold-6, #f7ba1e);
        background: var(--color-gold-1, #fffce8);

        .type {
            color: #f7ba1e;
        }
    }

    .shift-box:nth-child(5) {
        border-top: 6px solid var(--color-text-2, #4e5969);
        background: var(--color-fill-2, #f2f3f5);

        .type {
            color: #4e5969;
        }
    }

    .open {
        color: var(--color-text-3, #86909c);
        font-family: PingFang SC;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
    }
}
</style>
