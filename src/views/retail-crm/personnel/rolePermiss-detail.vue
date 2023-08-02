<template>
    <div class="role-detail">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t("retail.create_identity") }}</div>
                <div class="btns-area">
                    <a-button @class="onSave" type="primary ">{{ $t("retail.save") }}</a-button>
                </div>
            </div>
            <!-- 基本信息 -->
            <div class="basic-n-t">
                <div class="subtitle">
                    {{ $t('retail.basic_information') }}
                </div>                
                <div class="form-content row-detail">
                        <div class="row-item required">
                            <div class="key-w key-form-86909C">{{ $t('retail.name') }}：</div>
                            <div class="value">
                                <a-input
                                    style="width: 400px;"
                                    :placeholder="$t('def.input')+$t('retail.name')"
                                    v-model:value="form.name"                                
                                />
                            </div>
                        </div>
                        <div class="row-item">
                            <div class="key-w key-form-86909C">{{ $t('retail.identity_note') }}：</div>
                            <div class="value">
                                <a-input
                                    style="width: 400px;"
                                    :placeholder="$t('def.input')"
                                    v-model:value="form.identity_remark"                                
                                />
                            </div>
                        </div>
                </div>                
            </div>
            <div class="permission-a-t">
                <div class="subtitle">
                    {{ $t('retail.permission_allocation') }}
                </div>
                <div class="permission-content">
                    <div class="content-item">
                        <a-checkbox class="all-select">全选</a-checkbox>
                        <div class="row-detail">
                            <div class="row-item m-L-40">
                                <div class="key rewrite-key">你好：</div>
                                <div class="value">
                                    <a-checkbox-group v-model:value="AuthorityList">
                                        <a-row>
                                            <a-col>                                    
                                                <a-checkbox value="A">你好</a-checkbox>
                                            </a-col>
                                            <a-col>
                                                <a-checkbox value="B">你好</a-checkbox>
                                            </a-col>
                                            <a-col>
                                                <a-checkbox value="C">你好</a-checkbox>
                                            </a-col>
                                        </a-row>          
                                    </a-checkbox-group>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

// form
const form = ref({
    name:undefined,
    identity_remark:undefined,
})
// 选择的权限
const AuthorityList = ref([])
// 权限数据计算属性
const orgType = computed(() => {
    return {

    }
})

// methods
// 保存按钮
const onSave = () => {}
</script>

<style lang="less" scoped>
.role-detail{   
    .basic-n-t{
        padding: 0 20px;
        // 表单
        .form-content{
            margin-left: 120px;
        }
    }
    .permission-a-t{        
        padding: 0 20px;
        padding-bottom: 20px;
        box-sizing: border-box;
        .permission-content{
            margin-left: 120px; 
            .content-item{
                margin-top: 20px;
                // 全部选择
                .all-select{
                    color: var(--brand-6, #0061FF);
                    font-family: PingFang SC;
                    font-size: 14px;    
                    font-weight: 600;
                }
                .rewrite-key{
                    color: var(--color-text-1, #1D2129);
                    font-family: PingFang SC;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: normal;
                }          
            }
        }
    }

    .subtitle{
        color: #1D2129;
        font-family: PingFang SC;
        font-size: 16px;    
        font-weight: 600;    
    }
}
.w-400{
    width: 400px;
}
.m-L-40{
    margin-left: 40px;
}
:deep(.ant-checkbox-wrapper){
    font-size: 14px;    
    font-weight: 400;   
}
</style>