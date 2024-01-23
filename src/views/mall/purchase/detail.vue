<template>
    <div id="index">
        <div class="detail-pc">
            <section id="article">
                <div class="container" id="container-pc">
                    <!-- 文章主图 -->
                    <div class="container-img">
                        <img :src='detail?.img' alt='' />
                    </div>
                    <div class="begin-time" v-if="isActivity">{{ $Util.timeFilter(detail?.activity_join_begin_time,6) }}-{{ $Util.timeFilter(detail?.activity_join_end_time,6) }}</div>
                    <div class="begin-time" v-else>{{ $Util.timeFilter(detail?.create_time,6) }}</div>
                    <div class="begin-title">{{ detail?.topic }}</div>
                    <div class="content-formatter" v-html="detail?.content"></div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Core from '@/core';
import MyButton from '@/components/common/MyButton.vue';
import SvgIcon from "@/components/MySvgIcon/index.vue";

export default {
    components: {
        MyButton, SvgIcon
    },
    data() {
        return {
            Core, 
            id: '',
            isActivity:false,
            innerWidth: window.innerWidth,
            // formattedContent: html.content||'',
            detail:'',
            // pc-固定操作栏
            screenWidth: 0,
            innerHeight: window.innerHeight,
            // 部分浏览器的底部有部分距离-（手机端存在底部被覆盖情况）
            windowHeightNew: 0,
            windowWidthNew: 0,
        };
    },
    computed: {},
    watch: {},
    mounted() {        
        this.id = this.$route.query.id;
        if (this.id) {
            this.getDetailById();
        }
    },
    methods: {
        getDetailById() {
            let fullUrl = `https://app-api.horwincloud.com/client/1/community-post/detail`;
            axios({
                method: 'post',
                url: fullUrl,
                data: { id: this.id },
            }).then(res => {
                res = res.data.data
                this.detail = res;
                if(res.type===7) this.isActivity = true;
            }).catch(err => {
                console.log(err)
            })
        },
    },
};
</script>
 
<style scoped lang="less">
    #index {
        background: rgb(253, 253, 254);
    }
    
    // pc-端
    .detail-pc {
        width: 1080px;
        padding: 80px 0;
        margin: 0px auto;
        .container {
            width: 100%;
            padding: 0;
            .container-img {
                position: relative;
                :deep(img) {
                    display: block;
                    width: 100% !important;
                    height: 608px;
                    object-fit: cover;
                    // object-position: top;
                }
                .operate-box {
                    max-width: 80px;
                    box-sizing: border-box;
                    .hot-click {
                        padding: 8px;
                        cursor: pointer;
                    }
                    position: fixed;
                    display: flex;
                    padding: 8px 12px;
                    flex-direction: column;
                    align-items: center;
                    background: #FFF; 
                    border: 1px solid #DADADA;
                    top: calc(48px + var(--header-h-pc));
                    z-index: 10;
                    .border-bottom-box {
                        background: #E7E7E7;
                        width: 40px;
                        height: 0.5px;
                        margin: 16px 0px;
                    }
                    .num-box {
                        color:  #333;
                        text-align: center;
                        font-size: 16px;
                        font-weight: 400;
                        // letter-spacing: 0.8px;
                        
                    }
                }
            }
            .begin-time {

                color: #666;
                margin-top:24px;
                font-size: 20px;
                font-weight: 400;
                line-height: 150%;
                // letter-spacing: 2px;
                
            }
            .begin-title {
                color: #333;
                margin-top:16px;
                font-size: 38px;
                font-style: normal;
                font-weight: 700;
                line-height: 150%;
                // letter-spacing: 0px;

            }
            .content-formatter {
                font-family: Montserrat !important;
                text-align: left !important;

                :deep(img) {
                    display: block;
                    width: 100% !important;
                }
                :deep(p) {
                    font-family: Montserrat !important;
                    text-align: left !important;
                    font-size: 20px !important;
                    color:  #333 !important;
                    margin-bottom: 1em;
                }
                :deep(div) {
                    font-family: Montserrat !important;
                    text-align: left !important;
                    font-size: 20px !important;
                    color:  #333 !important;

                }
            }
        }

        
        #article {
            width: 100%;
            .flex(center, center, column);
        }
        #view {
            .flex(center, center, column);
            width: 100%;
        }
        .comment {
            width: 1080px;
             padding: 0;  
             padding-bottom: 80px;
             margin-top: 16px;

             &-title {
                
                color: #000;
                text-align: justify;
                font-size: 28px;
                font-weight: 700;
                line-height: 150%; /* 36px */
                padding: 14px 0px;
                border-bottom: #EEE 4px solid;

             }
             &-List {
                padding: 35px 0px 0px;
                .fj();
                &-one-avatar {
                    width: 64px;
                    height: 64px;
                    flex-shrink: 0;
                    border-radius: 50%;
                    margin-right: 24px;
                }
                &-two-avatar {
                    width: 52px;
                    height: 52px;
                    flex-shrink: 0;
                    border-radius: 50%;
                    margin-right: 24px;
                    margin-top: 6px;
                }
                &-one-content {
                    flex: 1;
                }
                &-text {
                    color:  #333;
                    /* 社区/文章详情/正文 */
                    font-size: 20px;
                    font-weight: 400;
                    line-height: 150%; /* 30px */
                    // letter-spacing: 0.8px;
                    padding: 9px 187px 0 0px;
                    white-space: pre-wrap;
                    display: inline-block;
                    }
                &-top {
                    .fsb();
                    &-name {
                        .flex(@j: space-between,@direction: column);
                        span:nth-child(1){
                            color:  #666;
                            font-size: 22px;
                            font-weight: 500;
                            line-height: 150%; 
                            // letter-spacing: 0.88px;
                            font-weight: 700;
                            .fsb();
                        }
                        span:nth-child(2){
                            color: #999;
                            font-size: 20px;
                            font-weight: 400;
                            line-height: 150%; /* 30px */
                            // letter-spacing: 2px;
                            
                        }
                    }
                    &-button {
                        // background: blue;
                        .fac(@j: flex-end);

                    }
                    .heart-one-box {
                        .fjc();
                        cursor: pointer;
                    }
                   
                } 
                .comments-one-top-box {
                    margin-top: 30px;
                    .button-one-box {
                        .flex(@j:flex-end);
                        width: 100%;
                        padding-top: 24px;
                    }
                }
                &-children{
                    padding: 18px 0px 24px;
                    width: 100%;
                    .fj();

                    &-text {
                        color:  #333;
                        /* 社区/文章详情/正文 */
                        font-size: 20px;
                        font-weight: 400;
                        line-height: 150%; /* 30px */
                        // letter-spacing: 0.8px;
                        padding: 9px 187px 0 0px;
                        white-space: pre-wrap;
                        display: inline-block;
                            }
                }
             }

             .without-commit {
                color: #999;
                text-align: center;
                /* web社区/文章详情/正文 */
                font-size: 20px;
                font-style: normal;
                font-weight: 400;
                line-height: 150%; /* 30px */
                // letter-spacing: 0.8px;
                margin-top: 80px;
             }
        }
        .heart-num {
            display: block;
            width: 58px;
            text-align: right;
            margin-right: 8px;
            font-size: 20px;
            color:  #333;
        } 
        .ant-input {
            padding: 16px 48px;
            resize: none !important;
            color: #333;
            text-align: justify;
            /* 社区/文章详情/正文 */
            font-size: 20px;
            font-style: normal;
            font-weight: 400;
            line-height: 150%; /* 30px */
            // letter-spacing: 0.8px;
            height: 64px;
            border-radius: 0;

            &::placeholder {
                color: #333-grey;
                font-size: 20px;
            }
            :deep(&:hover) {
                border-color: #333-grey;
                box-shadow: none;
                background: initial;
            }
            &:deep(:focus),
            &:deep(:focus-visible) {
                border-color: #333-grey;
                box-shadow: none;
            }
        }

        .pc-more-button {

            display: inline-flex;
            padding: 12px 16px 12px 24px;
            align-items: center;
            font-size: 16px;
            gap: 2px;
            border: 1px solid #999;
            margin-left: 76px;
        }

        .map-address {
            height: 87px;
            padding: 8px 16px;
            box-sizing: border-box;
            .place {
                color: #333;
                text-align: justify;
                font-size: 24px;
                font-weight: 700;
                line-height: 150%; /* 36px */
            }
            .address {
                color: #666;
                text-align: justify;
                font-size: 24px;
                font-weight: 400;
                line-height: 150%; /* 36px */
                // letter-spacing: 0.96px;
            }
        }

    }
    .color-offical {
        color: #C6F !important;
    }
    .margin-top-24 {
        margin-top: 24px;
    }
   
    .bell {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .absolute-input {
        position: absolute;
    }

</style>
