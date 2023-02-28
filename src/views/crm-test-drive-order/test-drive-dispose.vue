<template>
    <div class="dispose">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('dis.test_dispose') }}</div>                
            </div>          
            <div class="tabs">            
                <a-tabs v-model:activeKey="activeKey">
                    <a-tab-pane key="1" :tab="$t('dis.vehicle_dispose')">
                        <vehicleDispose v-if="activeKey == 1"/>
                    </a-tab-pane>
                    <a-tab-pane key="2" :tab="$t('dis.mail_dispose')">
                        <mailDispose v-if="activeKey == 2"/>
                    </a-tab-pane>                    
                </a-tabs>
            </div>
        </div>    
        
    </div>
</template>

<script setup>
    import mailDispose from './components/mail-dispose.vue'
    import vehicleDispose from './components/vehicle-dispose.vue'
    import {ref} from 'vue'
    const activeKey = ref('1')
</script>

<style lang="less" scoped>
.dispose{
    .tabs{
        padding: 16px 20px;
    }
}
</style>