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
            {{ msgList }}
            <div class="form-block-box" v-for="($1,ind1) in msgList" :key="ind1+'$'">
                <div class="title-form"><!-- {{ $t("supply-chain.type_supply") }} --> {{ $1.titleOne }}</div>
                <div class="list-one">
                    <div class="form-block" style="margin: 0;" v-for="($2, ind2) in $1.listOne">
                        
                        <div class="form-title">
                            <div class="title">
                                {{ $2.title }}
                            </div>
                        </div>
                        <div class="form-content" style="display: flex;flex-wrap: wrap;">
                            <div class="form-item" :class="{ 'required': $3.required ,'on-line': $3?.online ,'on-warp-line': !$3?.online}" v-for="($3, ind3) in $2.list" >
                                <div class="key" v-if="$3.key">{{ $3.key }}</div>
                                <div class="value" :class="{'on-line-value': $3?.online }" >
                                    <!--  name="pass" -->
                                    <a-form-item has-feedback>
                                        <template v-if="$3.type === 1">
                                            <a-input v-model:value="$3.value"  placeholder="请输入" autocomplete="off" />
                                        </template>
                                        <template v-else-if="$3.type === 2">
                                            <a-radio-group
                                                v-model:value="$3.value"
                                            >
                                                <a-radio :value="radio.value" v-for="radio in $3.radioList" :key="radio.value" >
                                                    <span :class="{'middle-radio': radio?.isInput}">
                                                        {{ radio.name }}     
                                                        <a-input :maxlength="50" v-model:value="radio.inputValue" placeholder="范围值" v-if="radio?.isInput" />
                                                    </span>
                                                </a-radio>
                                            </a-radio-group>
                                        </template>
                                        <template v-else-if="$3.type === 2.3">
                                            <a-checkbox v-model:checked="$3.value">{{ $3.text }}</a-checkbox>
                                        </template>
                                        <template v-else-if="$3.type === 3">
                                            <a-input-number
                                                v-model:value="$3.value"
                                                :placeholder="$t('def.input')"
                                                :min="0"
                                                :max="1000000000"
                                            >
                                                <template #addonAfter v-if="$3.unit">
                                                    <span class="l-w-h-style">{{ $3.unit }}</span>
                                                </template>
                                            </a-input-number>
                                        </template>

                                        <template v-else-if="$3.type === 6">
                                            <div class="form-content-item-column" >
                                                <div class="item-column-block-box" :key="$4.title" v-for="$4 in $3.objList" >
                                                    <div class="item-column-title-box">
                                                        <div class="title">
                                                            {{ $4.title }}
                                                        </div>
                                                    </div>
                                                    <div class="item-column-block"  v-for="$5 in $4.list" :key="$5+'$'" >
                                                        <div class="item-column-title">
                                                            {{ $5.key }}
                                                        </div>
                                                        <div class="item-column-value">
                                                            <a-input-number
                                                                v-model:value="$5.value"
                                                                :placeholder="$t('def.input')"
                                                                :min="0"
                                                                :max="1000000000"
                                                            >
                                                                <template #addonAfter v-if="$5.unit">
                                                                    <span class="l-w-h-style">{{ $5.unit }}</span>
                                                                </template>
                                                            </a-input-number>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <a-input placeholder="请输入" autocomplete="off" />
                                        </template>
                                    </a-form-item>
                                </div>

                            </div>

                            <!-- <div class="form-item">
                                <div class="key">{{ $t("i.mode") }}</div>
                                <div class="value">
                                    
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
        :deep(.middle-radio){
            display: flex;
            align-items: center;
            .ant-input {

                width: 100px;
                margin-left: 6px;
            }
        }
    }
</style>