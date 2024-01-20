<template>
    <!-- 
        type(props)
            flag: 旗帜
            heart：爱心
            comment：评论
            share：爱心
            top：置顶
        使用示例
            <HeartItem type="flag" />
     -->
    <div class="heart-img cursor" :style="{padding }" @click="clickFn">
        
        <template v-if="type==='flag'">
            <svg-icon icon-class="flag" :class="{'heart-none': hover }"  :style="{fontSize: font}" />
            <svg-icon icon-class="flag_hover" class-name="heart-hover" :style="{fontSize: font}" v-if="hover"/>
        </template>
        <template v-if="type==='heart'">
            <svg-icon icon-class="heart" :class="{'heart-none': hover }"  :style="{fontSize: font}" />
            <svg-icon icon-class="heart_hover" class-name="heart-hover" :style="{fontSize: font}" v-if="hover" />
        </template>
        <template v-if="type==='comment'">
            <svg-icon icon-class="comment" :class="{'heart-none': hover }"  :style="{fontSize: font}" />
            <svg-icon icon-class="comment_hover" class-name="heart-hover" :style="{fontSize: font}" v-if="hover" />
        </template>
        <template v-if="type==='share'">
            <svg-icon icon-class="share" :class="{'heart-none': hover }"  :style="{fontSize: font}" />
            <svg-icon icon-class="share_hover" class-name="heart-hover" :style="{fontSize: font}" v-if="hover" />
        </template>
     
        <template v-if="type==='top'">
            <svg-icon icon-class="top" :class="{'heart-none': hover }"  :style="{fontSize: font}" />
            <svg-icon icon-class="top_hover" class-name="heart-hover" :style="{fontSize: font}" v-if="hover" />
        </template>     
        <template v-if="type==='heart_red'">
            <svg-icon icon-class="heart_red"  :style="{fontSize: font}" />
         </template>
    </div>
</template>

<script>
import SvgIcon from "@/components/MySvgIcon/index.vue";
export default {
    name: 'HeartItem',
    components: {
        SvgIcon
    },
    props: {
        // 边距
        padding: {
            type: String,
            default: '0px'
        },
        // 类型
        type: {
            type: String,
            default: 'top'
        },
       /*  borderBottom: {
            type: String,
            default: 'none'
        }, */
        isBottomNum: {
            type: Boolean,
            default: false
        },
        font: {
            type: String,
            default: '32px'
        },
        hover:{
            type: Boolean,
            default: true
        }
    },
    data() {
        return {}
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        clickFn() {
            this.$emit('click')
        }
    },
}
</script>
<style lang="less" scoped>

.heart-img {
        .flex(center, center, column);
        display: flex;
        flex-direction: column;
        .heart-hover {
            display: none ;
        }
        .heart-num {
            display: block;
        } 

    }
    .heart-img:hover {
        //  background: rebeccapurple;
        .heart-none {
            display: none;
        }
        .heart-hover {
            display: inline-block;
        }
    }

</style>
