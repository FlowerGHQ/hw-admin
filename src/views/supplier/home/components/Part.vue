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
                                <div class="key" v-if="$3.key">{{ $3.key }}</div>
                                <div class="value table-container no-mg" :class="{'on-line-value': $3?.online }" >
                                    <!--  name="pass" -->
                                    <a-form-item has-feedback>
                                        <template v-if="$3.type === 1">
                                            <a-input v-model:value="$3.value"  placeholder="请输入" autocomplete="off" />
                                        </template>
                                        <template v-else-if="$3.type === 1.1">
                                            <a-textarea :row="$3.row" :maxlength="$3.maxlength" v-model:value="$3.value"  placeholder="请输入" autocomplete="off" />
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
                                        <template v-else-if="$3.type === 2.1">
                                            <a-checkbox v-model:checked="$3.value">{{ $3.text }}</a-checkbox>
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
                                                    <template #bodyCell="{ column, record }">
                                                        <!-- 客户序号 -->
                                                        <template
                                                            v-if="column.dataIndex === 'customer_order'"
                                                        >
                                                            {{ record.customer_order }}
                                                        </template> 
                                                        <template
                                                            v-else-if="column.dataIndex === 'customer_name'"
                                                        >
                                                            <a-input 
                                                                v-model:value="record.customer_name"
                                                                :placeholder="$t('def.input')"
                                                            />
                                                        </template>
                                                        <template
                                                            v-else-if="column.dataIndex === 'sales_share'"
                                                        >
                                                            <!-- <a-input
                                                                v-model:value="record.sales_share"
                                                                :placeholder="$t('def.input')"
                                                            /> -->
                                                            
                                                            <a-input-number
                                                                v-model:value="record.sales_share"
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
                                                            v-else-if="column.dataIndex === 'main_supply_part'"
                                                        >
                                                            <a-input
                                                                v-model:value="record.main_supply_part"
                                                                :placeholder="$t('def.input')"
                                                            />
                                                        </template>
                                                        <template
                                                            v-else-if="column.dataIndex === 'begin_cooperation_time'"
                                                        >
                                                            
                                                        </template>
                                                        <template
                                                            v-else-if="column.dataIndex === 'operation'"
                                                        >
                                                           删除
                                                        </template>
                                                    </template>
                                                </a-table>
                                                <a-button
                                                    class="spec-add"
                                                    style="margin-top: 0px;"
                                                    type="primary"
                                                    ghost
                                                    @click="handleAddSpecItem"
                                                    ><i class="icon i_add" />{{
                                                        $t("i.add_specs")
                                                    }}
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
const dataSource = ref([
          {
            key: '1',
            name: '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号',
          },
          {
            key: '2',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号',
          },
        ])
const columns = ref([
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
          },
          {
            title: '住址',
            dataIndex: 'address',
            key: 'address',
          },
])

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
    }
</style>