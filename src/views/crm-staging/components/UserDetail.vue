<template>
    <div id="user-detail">
        <div class="user-panel">
            <img class="avatar" src="../images/avatar.png" alt="">
            <div class="user-info-container">
            <div class="user-info-item">
                <div class="user-name">
                    {{ detail.name || '-' }}
                </div>
                <div class="user-name-key">
                    用户昵称
                </div>
                <div class="info-loss-tag">
                    信息缺失
                </div>
                <intentionStairs :status="detail.intention" />
            </div>
        </div>
        </div> 
    </div>
</template>
    
<script>
import Core from '../../../core';
import intentionStairs from './intention-stairs.vue';
export default {
    name: 'UserDetail',
    components: {
        intentionStairs
    },
    props: {},
    data() { 
        return {
            detail: {
                name: '赵女士',    
                intention: 20,
            }
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {

    }
};
</script>
    
<style scoped lang="less">
#user-detail {
    width: 838px;
    height: 258px;
    padding: 20px;
    box-sizing: border-box;
    background:#FFF;
    .user-panel {
        width: 100%;
        display: flex;
        .avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
        }
        .user-info-container {
            margin-left: 12px;
            .user-info-item {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                .user-name {
                    color:#1D2129;
                    font-size: 16px;
                    font-weight: 600;
                    margin-right: 12px;
                }
                .user-name-key {
                    color: #4E5969;
                    font-size: 13px;
                    font-weight: 400;
                    margin-right: 12px;
                }
                .info-loss-tag {
                    padding: 2px 8px;
                    box-sizing: border-box;
                    border-radius: 3px;
                    border: 1px solid rgba(245, 63, 63, 0.30);
                    background: #FFF;
                    color:#F53F3F;
                    font-size: 12px;
                    margin-right: 12px;
                }
            }
        }
    }
}
</style>
    