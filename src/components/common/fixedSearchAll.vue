<template>
    <div>
        <div id="fixed-box" ref="fixBox" >
            <slot name = "search"></slot>
        </div>
        <div ref="tabBox">
            <slot name = "table">
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FixedSearchAll',
    props: {
        desc: {
            type: String,
            default: '暂无数据'
        },
    },
    data() {
        return {
            // simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
        }
    },
    mounted() {
        window.addEventListener('resize', this.handleResize)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.handleResize)
    },
    methods:{
        
        handleResize() {
            const width = this.$refs.tabBox.offsetWidth;
            const height = this.$refs.fixBox.offsetHeight;
            // this.fixedWidth = width + 'px';
            // this.fixedHeight = height + 'px';

            // 在这里处理宽高变化的逻辑
            // console.log('盒子宽度:', width, '盒子高度:', height);
            this.$emit('heightAndWidth' , {
                offsetWidth:  width + 'px',
                fixedHeight: height + 'px'
            })
        },
    },
}
</script>
<Style lang="less" scoped>

#fixed-box {
      position: fixed;
      z-index: 30;
      box-sizing: border-box;
      margin-left: 20px;
      background-color: #ffffff;

    }
    
</Style>