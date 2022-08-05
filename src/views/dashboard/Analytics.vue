<template>
<div id="Analytics">
    <div class="header">
        <div class="banner-header">
            <img src="../../assets/images/default_banner-one.png" class="banner-bg">
            <p class="banner-title">Welcome！ HORWIN B2B Shop</p>
            <a-input v-model:value="value" placeholder="Basic usage" class="banner-search" allowClear="true" maxlength="99" @pressEnter="hadleSearch">
                <template #prefix>
                    <search-outlined class="search" @click="hadleSearch"/>
                </template>
                <template #suffix>
                    <arrow-right-outlined class="arrow" @click="hadleSearch"/>
                </template>
            </a-input>
        </div>
        <div class="banner-cards">
            <div class="banner-card" v-for="i in 3">
                <img src="../../assets/images/default_banner-two.png" class="card-bg">
                <p class="title">Content content</p>
                <p class="info">VEHICLE</p>
                <arrow-right-outlined type="user" class="arrow"/>
            </div>
        </div>
        <div class="message card">
            <div class="title">Pending <a-badge :count="unread.org + unread.master" class="badge"/></div>
            <div class="content">
                <div class="message-card" v-for="list in unread.list" :class=" !!list.has_read ? 'green' : 'red' ">
                    <div class="message-content">
                        <p>
                            <span class="text">{{list.content}}</span>
                            <span>{{list.title}}</span>
                        </p>
                        <p>{{list.title}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>

import Core from '../../core';
import { SearchOutlined, ArrowRightOutlined } from '@ant-design/icons-vue';
export default {
    name: 'Analytics',
    components: {
        SearchOutlined,
        ArrowRightOutlined
    },
    data() {
        return {
            unread: {
                master: '',
                org: '',
                list: []
            },
            // 搜索内容
            value: ''
        }
    },
    mounted() {
        this.getUnreadCount()
    },
    methods: {
        getUnreadCount() {    // 获取 未读消息数 数据
            let CATEGORY = Core.Const.NOTICE.CATEGORY
            Core.Api.Notice.list({
                category: CATEGORY.ORG
            }).then(res => {
                console.log('getUnreadCount res: ORG', res)
                this.unread.org = res.un_count;
            }).catch(err => {
                console.log('getUnreadCount err', err)
            })
            Core.Api.Notice.list({
                category: CATEGORY.MASTER
            }).then(res => {
                console.log('getUnreadCount res: MASTER', res)
                this.unread.master = res.un_count;
                this.unread.list = res.list;
            }).catch(err => {
                console.log('getUnreadCount err', err)
            })
        },
        hadleSearch() {
            if(this.value.length) {
                console.log(this.value)
                // 请求数据
            } else {
                this.$message.error('请输入搜索内容');
            }
        }
    }
}
</script>
<style lang="less" scoped>
#Analytics {
    padding: 22px;
    .header {
        width: 100%;
        .banner-header {
            width: 100%;
            position: relative;
            border-radius: 10px;
            overflow: hidden;
            .banner-bg {
                width: 100%;
            }
            .banner-title {
                position: absolute;
                top: 20%;
                left: 50%;
                transform: translateX(-50%);
                font-size: 24px;
                font-family: Inter-Bold, Inter;
                font-weight: bold;
                color:  @white;
                width: 100%;
                text-align: center;
                .ell()
            }
            .banner-search {
                width: 50%;
                height: 54px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
            }
        }
        .banner-cards {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-top: 26px;
            .banner-card {
                width: 32%;
                border-radius: 8px;
                overflow: hidden;
                position: relative;
                .card-bg {
                    width: 100%;
                }
                > p {
                    position: absolute;
                    width: calc(100 - 20%);
                    .ell()
                }
                .title {
                    top: 10%;
                    left: 5%;
                    font-size: @fz_lg;
                    font-family: Inter-Bold, Inter;
                    font-weight: bold;
                    color: @white;
                    opacity: .8;
                }
                .info {
                    top: 20%;
                    left: 5%;
                    font-size: 24px;
                    font-family: Inter-Bold, Inter;
                    font-weight: bold;
                    color: @white;
                }
                .arrow {
                    position: absolute;
                    bottom: 10%;
                    right: 6%;
                    color: @white;
                    font-size: @fz_25;
                }
            }
        }
        .message {
            margin-top: 26px;
            .title {
                font-size: @fz_bs;
                font-family: Inter-Bold, Inter;
                font-weight: bold;
                color: #323C4D;
                .badge {
                    margin-left: 10px;
                }
            }
            .content {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                .message-card {
                    width: 500px;
                    padding: 19px 69px 19px 10px;
                    margin-top: 13px;
                    border-radius: 12px;
                    box-sizing: border-box;
                    .message-content {
                        border-left-width: 3px;
                        border-left-style: solid;
                        padding-left: 20px;
                        font-size: @fz_bs;
                        .text {
                            margin-right: 10px;
                            font-weight: 500;
                        }
                        p {
                            .ell()
                        }
                    }
                }
            }
        }
    }
}
.green {
    .text {
        color: #367AFF;
    }
    > div {
        border-left-color: #367AFF;
    }
    background: linear-gradient(94deg, rgba(54, 122, 255, .3) 0%, rgba(54,122,255,0) 40%);
}
.red {
    .text {
        color: #FF0000;
    }
    > div {
        border-left-color: #FF0000;
    }
    background: linear-gradient(90deg, rgba(255,0,0,.3) 0%, rgba(255,0,0,0) 40%);
}
:deep(.ant-badge-count) {
    background-color: rgba(255, 204, 215, 1);
    color: rgba(255, 17, 66, 1);
}
.card {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    padding: 30px;
}
.banner-search {
    border: none;
    background-color: rgba(255, 255, 255, .26);
    padding: 4px 30px;
    border-radius: 33px;
}
:deep(.ant-input) {
    background-color: transparent;
    font-size: @fz_bs;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: @white;
    padding-left: 15px !important;
    &::placeholder {
        font-size: @fz_bs;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: @white;
    }
}
:deep(.ant-input-clear-icon) {
    font-size: 20px;
    margin-right: 20px;
    color: #fff;
    opacity: .6;
    &:hover {
        color: #fff;
        opacity: 1;
    }
}
.search {
    font-size: @fz_20;
    color: @white;
}
.arrow {
    font-size: @fz_20;
    color: @white;
}
</style>