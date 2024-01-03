<template>
    <div id="part">
        <!-- <div class="form-block">
                <div class="title-form">{{ $t("supply-chain.type_supply") }}</div>
                <div class="form-title">
                    <div class="title">{{ $t("supply-chain.contact") }}</div>
                </div>
                <div class="form-content">
                    <div class="form-item required">
                        <div
                            class="key"
                        >
                            {{ $t("n.name") }}
                        </div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                :maxlength="50"
                            />
                        </div>
                    </div>
                    <div class="form-item required">
                        <div
                            class="key"
                        >
                            {{ $t("n.name_en") }}
                        </div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                :maxlength="50"
                            />
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">{{ $t("d.color") }}</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                            />
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">{{ $t("d.color_en") }}</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                            />
                        </div>
                    </div>
                </div>
            </div>  -->  
            <div class="form-block-box" v-for="($1,ind1) in msgList" :key="ind1+'$'">
                <div class="title-form">{{ $t("supply-chain.type_supply") }}</div>
                <div class="list-one">
                    <div class="form-block" style="margin: 0;" v-for="($2, ind2) in $1.listOne">
                        
                        <div class="form-title">
                            <div  class="title">
                                {{ $t("supply-chain.contact") }}
                            </div>
                        </div>
                        <div class="form-content" >
                            <div class="form-item" v-for="($3, ind3) in $2.list">
                                <div class="key">{{ $t("i.mode") }}</div>
                                <div class="value" >
                                    <a-form-item has-feedback name="pass">
                                        <a-input type="password" autocomplete="off" />
                                    </a-form-item>
                                </div>
                            </div>
                            <!-- <div class="form-item">
                                <div class="key">{{ $t("i.mode") }}</div>
                                <div class="value">
                                    <a-form-item has-feedback name="pass">
                                        <a-input  type="password" autocomplete="off" />
                                    </a-form-item>
                                </div>
                            </div>
                            <div class="form-item">
                                <div class="key">{{ $t("i.mode") }}</div>
                                <div class="value" >
                                    <a-form-item has-feedback  name="checkPass">
                                        <a-input  type="password" autocomplete="off" />
                                    </a-form-item>
                                </div>
                            </div>
                            <div class="form-item">
                                <div class="key">{{ $t("i.mode") }}</div>
                                <div class="value" >
                                    <a-form-item has-feedback  name="age">
                                        <a-input-number />
                                    </a-form-item>
                                </div>
                            </div> -->

                        </div>
                        
                    </div>
                </div>  
            </div>
    </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref, getCurrentInstance, computed, reactive, inject, watch } from 'vue';
import Core from "@/core";
const msgList = ref([])
const props = defineProps({  
    // v-model 绑定值  
    msg: {
        type: Object,
        default: () => {} 
    }, 
})

// 监听弹窗关闭-更改父组件prop弹窗显隐值
watch(
    () => props.msg,
    (newValue, oldValue) => {
        /* bomId.value = newValue?.version_id;
        flagNew.value = newValue?.flag_new;
        versionName.value = newValue?.version_name;
        if(newValue && Object.keys(newValue)){
            refresh();
        } */
        console.log('msg----1', newValue, oldValue);
        msgList.value = Core.Util.deepCopy(newValue)
    },
    { deep:true, immediate: true }  
)


</script>
<style lang="less" scoped>
    #part {

    }      
</style>