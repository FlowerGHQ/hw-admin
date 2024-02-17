<template>
    <div class="status-panel">
        <div class="intention-status">
            {{ intentionType }}
        </div>
        <div class="intention-stairs">
            <img :src="getImageByStatus(status)" alt="" />
        </div>
    </div>
</template>

<script>
import Core from '../../../core';
const IMG_MAP = Core.Const.INTENTION.IMG_MAP;
const TYPE_MAP = Core.Const.INTENTION.TYPE_MAP;
export default {
    name: 'IntentionStairs',
    props: {
        /* 
            status 四种状态
                10：无意向
                20：有意向
                30：高意向
                40：Hot
            根据后端定义静态数值在Const.INTENTION.TYPE_MAP 灵活修改映射关系
        */
        status: {
            type: Number,
            default: 10,
        },
    },
    data() {
        return {
            Core,
            IMG_MAP,
        };
    },
    computed: {
        intentionType() {
            return Core.Util.intentionTypeFilter(this.status, 'key');
        },
    },
    methods: {
        getImageByStatus(status) {
            try {
                return IMG_MAP[TYPE_MAP[status].img_url];
            } catch (error) {
                return false;
            }
        },
    },
};
</script>
<style lang="less" scoped>
.status-panel {
    .intention-status {
        color: #faad14;
        font-size: 10px;
        text-align: right;
    }

    .intention-stairs {
        display: flex;
        justify-content: flex-end;
        margin-top: 2px;

        > img {
            width: 40px;
            height: 6px;
        }
    }
}
</style>
