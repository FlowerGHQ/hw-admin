<template>
    <div id="FsLogin">
        <div class="header">
            <img src="@images/mall/login/logo.png" class="logo" @click="router.replace('/login')" />
            <div class="header-user">
                <a-avatar
                    class="user-avatar"
                    :size="32"
                    :style="{ backgroundColor: color, verticalAlign: 'middle' }"
                    :gap="gap"
                >
                    {{ message.name }}
                </a-avatar>
                <span class="user-name">{{ message.name }}</span>
            </div>
        </div>
        <div class="container">
            <template v-if="type === 1">
                <div class="img-permission">
                    <img src="@images/mall/login/permission.png" alt="" />
                </div>
                <p class="title">{{ $t('mall.no_permission') }}</p>
            </template>
            <template v-if="type === 2">
                <div class="img-hi">
                    <img src="@images/mall/login/hi.png" alt="" />
                </div>
                <p class="title">{{ $t('mall.welcome_BOS') }}</p>
                <div class="user">
                    <div class="label">
                        <img src="@images/mall/login/info.png" alt="" />
                        <span class="text">{{ $t('mall.need_permission') }}</span>
                    </div>
                    <div class="user-content">
                        <a-avatar
                            class="user-avatar"
                            :size="42"
                            :style="{ backgroundColor: color, verticalAlign: 'middle' }"
                            :gap="gap"
                        >
                            {{ message.name }}
                        </a-avatar>
                        <div class="mes">
                            <span class="user-name">{{ message.name }}</span>
                            <span class="user-employee">{{ `${$t('u.employee_no')}：${message.employee_no}` }}</span>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import Core from '@/core';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const user = Core.Data.getUser() || {};
const type = ref(null); // 1: 飞书扫码登录-组织外部员工；2：飞书扫码登录-组织内部员工
const message = JSON.parse(route.query.message) || {};
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
const color = ref(colorList[Math.floor(Math.random() * colorList.length)]);
const GapList = [4, 3, 2, 1];
const gap = ref(GapList[0]);
switch (Number(route.query.code)) {
    //1108：获取飞书用户信息失败；1109：飞书用户没有绑定；2103：未开通权限
    case 1108:
        type.value = 1;
        break;
    case 1109:
        type.value = 2;
        break;
    case 2103:
        type.value = 2;
        break;

    default:
        router.replace('/login');
        break;
}
const props = defineProps({
    list: {
        type: Array,
        default: [],
    },
});
</script>
<style lang="less" scoped>
#FsLogin {
    background: #f6f7f9;
    padding: 100px 20px 20px 20px;
    position: relative;
    .header {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 80px;
        background: #fff;
        padding-right: 20px;
        .flex(space-between, center, row);
        .logo {
            height: 80px;
            cursor: pointer;
        }
        .header-user {
            .fcc();
            height: 40px;
            border-radius: 20px;
            padding: 4px 10px 4px 4px;
            background: #f7f8fa;
            .user-name {
                margin-left: 6px;
                font-size: 16px;
                font-weight: 600;
                line-height: 22px;
                color: #1d2129;
            }
        }
    }
    .container {
        height: calc(100vh - 120px);
        width: 100%;
        background: #fff;
        .flex(center, center);
        .img-permission {
            width: 40px;
            height: 40px;
            > img {
                width: 100%;
                height: 100%;
            }
        }
        .img-hi {
            width: 50px;
            height: 50px;
            > img {
                width: 100%;
                height: 100%;
            }
        }
        .title {
            margin-top: 10px;
            font-size: 18px;
            font-weight: 500;
        }
        .user {
            margin-top: 30px;
            .label {
                .fcc();
                padding: 4px 10px;
                background: rgba(255, 125, 0, 0.1);
                border-radius: 4px;
                > img {
                    width: 16px;
                    height: 16px;
                }
                .text {
                    font-size: 14px;
                    line-height: 20px;
                    color: #ff7d00;
                    margin-left: 4px;
                }
            }
            .user-content {
                margin-top: 8px;
                border: 1px solid #eaecf1;
                padding: 10px;
                border-radius: 4px;
                .flex(initial, initial, row);
                .mes {
                    .flex(initial, initial);
                    margin-left: 8px;
                    .user-name {
                        font-size: 14px;
                        line-height: 20px;
                        color: #1d2129;
                    }
                    .user-employee {
                        margin-top: 4px;
                        font-size: 12px;
                        line-height: 17px;
                        color: #4e5969;
                    }
                }
            }
        }
    }
}
</style>
