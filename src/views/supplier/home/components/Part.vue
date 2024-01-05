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
                                <div class="key" v-if="!($3.type === 6)">{{ $3.key }}</div>
                                <div class="value table-container no-mg" :class="{'on-line-value': $3?.online }" >
                                    <!--  name="pass" -->
                                    <a-form-item has-feedback>

                                        <!-- 输入框input  -->
                                        <template v-if="$3.type === 1">
                                            <a-input v-model:value="$3.value"  placeholder="请输入" autocomplete="off" />
                                        </template>
                                        <!-- textarea -->
                                        <template v-else-if="$3.type === 1.1">
                                            <a-textarea :row="$3.row" :maxlength="$3.maxlength" v-model:value="$3.value"  placeholder="请输入" autocomplete="off" />
                                        </template>
                                        <!-- 单选 -->
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
                                        <!--  多选 -->
                                        <template v-else-if="$3.type === 2.1">
                                            <a-checkbox-group v-model:value="$3.value" :options="$3.optionList" />
                                        </template>
                                        <!-- 单个checkbox选择 -->
                                        <template v-else-if="$3.type === 2.3">
                                            <a-checkbox v-model:checked="$3.value">{{ $3.text }}</a-checkbox>
                                        </template>
                                        <!-- 数字单位 -->
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

                                        <!-- 时间 -->
                                        <template v-else-if="$3.type === 4">
                                            <a-date-picker valueFormat="YYYY-MM-DD"  v-model:value="$3.value" />
                                        </template>
                                        <!-- 列-表 -->
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
                                        <!-- 表格 -->
                                        <template v-else-if="$3.type === 7">
                                            <div class="form-content-item-table" >
                                                <a-table
                                                    :columns="$3.obj.columnsList"
                                                    :dataSource="$3.obj.dataSourse"
                                                    :scroll="{ x: true }"
                                                    :row-key="(record) => record.id"
                                                    :pagination="false"
                                                    class="specific-table"
                                                >
                                                    <template #bodyCell="{ column, record, index }">
                                                        <!-- 客户序号 -->
                                                        <!-- <template
                                                            v-if="column.dataIndex === 'customer_order'"
                                                        >
                                                            {{ record.customer_order }}
                                                        </template>  -->
                                                        <template
                                                            v-if="column.type === 'input'"
                                                        >
                                                            <a-input 
                                                                v-model:value="record[column.dataIndex]"
                                                                :placeholder="$t('def.input')"
                                                            />
                                                        </template>
                                                        <template
                                                            v-else-if="column.type === 'input-num'"
                                                        >
                                                            <a-input-number
                                                                v-model:value="record[column.dataIndex]"
                                                                :placeholder="$t('def.input')"
                                                                :min="0"
                                                                :max="1000000000"
                                                            >
                                                                <template #addonAfter v-if="column.unit">
                                                                    <span class="l-w-h-style">{{ column.unit }}</span>
                                                                </template>
                                                            </a-input-number>
                                                        </template>
                                                        <template
                                                            v-else-if="column.type === 'time'"
                                                        >
                                                            <a-date-picker valueFormat="YYYY-MM-DD"  v-model:value="record[column.dataIndex]" />
                                                        </template>
                                                        <template
                                                            v-else-if="column.dataIndex === 'operation'"
                                                        >
                                                            <a-button
                                                                type="link"
                                                                v-if="index"
                                                                @click="handleDelete($3.obj.dataSourse ,record ,$3.title_add_text)"
                                                                >
                                                                <i class="icon i_delete" />
                                                                    {{
                                                                        $t("def.delete")
                                                                    }}
                                                                </a-button
                                                            >
                                                        </template>
                                                    </template>
                                                </a-table>
                                                <a-button
                                                    class="spec-add"
                                                    style="margin-top: 0px;"
                                                    type="primary"
                                                    ghost
                                                    @click="handleAddSpecItem($3.obj.dataSourse ,$3.objItem ,$3.title_add_text)"
                                                    >
                                                    {{ $3.buttonText }}
                                                </a-button
                                                >
                                            </div>
                                        </template>
                                        <template v-else>
                                            <a-input placeholder="请输入" autocomplete="off" />
                                        </template>
                                    </a-form-item>
                                </div>

                            </div>

                        </div>
                        
                    </div>
                </div>  
            </div>
    </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref, getCurrentInstance, computed, reactive, inject, watch } from 'vue';
import Core from "@/core";
import dayjs from "dayjs";

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

// 删除某一项
const handleDelete = (list , data, title) => {
    const index = list.findIndex(
        (el) => el.id === data.id
    );

    if (index !== -1) {
        list.splice(index, 1);
    }
    // 如果存在名称变更
    if(title) {
        list.forEach((ele,ind) => {
            ele.customer_order = '主要客户' + (ind+1);
        });  
    }
}
const handleAddSpecItem = (list ,obj ,title) => {
    
    const id = list.length + 1;

    // 如果存在名称变更
    title ? obj.customer_order = title + id : ''

    list.push({...obj,id})
}
const getMsgList = () => {
    return msgList.value
}
defineExpose({
    getMsgList
})
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

        
    .specific-table {
        margin-bottom: 16px;
        th {
            background-color: #fff;
            height: 60px;
            font-size: 14px;
        }
        td{
            height: 60px;
        }
        .ant-input-number,
        .ant-select:not(.ant-input-number + .ant-select) {
            width: 120px;
        }
        .code {
            min-width: 150px;
        }
        .ant-table-container .ant-table-content {
            &::-webkit-scrollbar {
                width: 2px;
                height: 6px;
                &-thumb {
                    border-radius: 6px;
                    background-color: rgba(0, 110, 249, 0.2);
                    &:hover {
                        background: rgba(0, 110, 249, 0.5);
                    }
                }
                &-track {
                    /*滚动条内部轨道*/
                    background: #f8fafc;
                }
            }
        }

        .spce-add-pic {
            width: auto !important;
            padding: 7px;
            border-radius: 4px;
        }
 
        :deep(.ant-upload-list) {
            display: none;
        }

        .imgList-box {
            
            .img-pic {
                width: 36px;
                height: 36px;
                border-radius: 4px;
                cursor: pointer;
                object-fit:cover;

            }
 
            .close-pic {
                width: 14px;
                height: 14px;
                flex-shrink: 0;
                cursor: pointer;
                margin-left: 8px;
            }
        }
    }

        .spec-add {
            cursor: pointer;
        }
    }
</style>