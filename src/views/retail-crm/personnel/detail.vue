<template>
    <div class="personnel-detail" >
        <div class="d-top">
            <div class="title">
                {{ $t("retail.personnel_list")}} 
            </div>
            <div class="container">            
                <div class="d-img">
                    <img class="img" src="https://img0.baidu.com/it/u=2220978215,658189084&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=768" alt="">
                </div>
                <div class="d-content">
                    <a-row class="all-msg">
                          <div class="user-msg">
                            <span>赵女士</span>
                            <span class="use">
                                <img class="img" src="../../../assets//images/retail/female.png" alt="">
                                <span>25</span>
                            </span>
                            <span class="job">在职</span>
                            <span class="job-number">
                                <span>ID:</span>
                                <span class="number">1234</span>
                            </span>
                          </div>
                    </a-row>
                    <a-row class="row-detail">
                        <!-- 手机号码 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item m-t-16">
                            <div class="key">{{ $t("retail.phone1")}} ：</div>
                            <div class="value">
                                {{ fill_out.phone }}
                            </div>                          
                        </a-col>
                        <!-- 邮箱 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                            <div class="key">{{ $t("retail.email")}}：</div>
                            <div class="value">
                                <a-input v-model:value="fill_out.email" :placeholder="$t('def.select')"/>
                            </div>
                        </a-col>
                        <!-- 性别 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                            <span class="key">{{$t('retail.sex')}}：</span>
                            <span class="value">
                                <a-radio-group v-model:value="fill_out.sex" :placeholder="$t('def.select')">                                    
                                    <a-radio v-for="item in Core.Const.CRM_ORDER.SEX" :value="item.key">
                                        {{ item[$i18n.locale] }}
                                    </a-radio>
                                </a-radio-group>
                            </span>
                        </a-col>
                        <!-- 年龄 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                            <span class="key">{{$t('retail.age')}}：</span>
                            <span class="value">
                                <a-input v-model:value="fill_out.age" :placeholder="$t('def.select')"/>
                            </span>
                        </a-col>                        
                        <!-- 工号 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                            <span class="key">{{$t('retail.job_number')}}：</span>
                            <span class="value">
                                写死
                            </span>
                        </a-col>
                        <!-- 部门 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                            <span class="key">{{$t('retail.section')}}：</span>
                            <span class="value">
                                写死
                            </span>                                        
                        </a-col>  
                        <!-- 入职时间 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                            <span class="key">{{$t('retail.on_borard_time')}}：</span>
                            <span class="value">
                                写死
                            </span>
                        </a-col>
                        <!-- 工服尺寸 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                            <span class="key">{{$t('retail.workwear_size')}}：</span>
                            <span class="value">
                                <a-select v-model:value="fill_out.size" class="select-w">
                                    <a-select-option v-for="item in Core.Const.RETAIL.Outfit_Size" :value="item.key">
                                        {{ item.value }}
                                    </a-select-option>
                                </a-select>
                            </span>
                        </a-col>                    
                    </a-row>
                </div>
            </div>
        </div>
        <div class="d-center m-t-16">
            <div class="title">
                {{ $t("retail.personnel_list")}} 
            </div>
            <div class="container">
                <a-row class="row-detail">
                    <!-- 工作状态 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item m-t-16">
                        <span class="key">{{ $t("retail.working_condition")}}：</span>
                        <span class="value">
                            <a-select v-model:value="fill_out.size" class="select-w">
                                <a-select-option v-for="item in Core.Const.RETAIL.Working_condition" :value="item.key">
                                    {{ item[$i18n.locale] }}
                                </a-select-option>
                            </a-select>
                        </span>                          
                    </a-col>
                    <!-- 上岗时间 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                        <span class="key">{{ $t("retail.start_date")}}：</span>
                        <span class="value">
                            你好
                        </span>
                    </a-col>
                    <!-- 职务 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                        <span class="key">{{$t('retail.job')}}：</span>
                        <span class="value">
                            <a-select v-model:value="fill_out.size" class="select-w">
                                <a-select-option v-for="item in Core.Const.RETAIL.Job" :value="item.key">
                                    {{ item[$i18n.locale] }}
                                </a-select-option>
                            </a-select>
                        </span>
                    </a-col>
                    <!-- 所属大区 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                        <span class="key">{{$t('retail.subregion')}}：</span>
                        <span class="value">
                            你好
                        </span>
                    </a-col>
                    <!-- 所属城市 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                        <span class="key">{{$t('retail.home_city')}}：</span>
                        <span class="value">
                            你好
                        </span>
                    </a-col>
                    <!-- 所属门店 -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                        <span class="key">{{$t('retail.affiliated_store')}}：</span>
                        <span class="value">
                            你好
                        </span>                                        
                    </a-col>                      
                </a-row>
            </div>
        </div>
        <div class="d-bottom m-t-16">
            <div class="title">
                {{ $t("retail.role_authority")}} 
            </div> 
            <div class="search">
                <a-row class="search-row">
                    <!-- 角色1: -->
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-col">
                        <span class="key">{{ $t("retail.role")}}：</span>
                        <span class="value">
                            <a-select
                                class="i-s-w"                              
                                :placeholder="$t('def.select')"
                            >
                            </a-select>
                            <span class="delete-icon"><i class="icon i_delete" /></span>
                        </span>                    
                    </a-col>                    
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-col">                        
                        <a-button type="primary" ghost>{{ $t("retail.add_a_role")}}</a-button>                        
                    </a-col>
                </a-row>
            </div>        
        </div>
    </div>
</template>

<script setup>
import Core from "@/core";
import { computed, onMounted, reactive, ref } from 'vue';

// 数据
const fill_out = reactive({
    phone:'1837029', // 手机号
    email:'', // 邮箱
    sex: 1, // 性别
    age: undefined, // 年龄
    size: undefined, // 尺码
})

onMounted(() => {

})
/* Fetch start*/
const updateFetch = (params = {}) => {    
}
/* Fetch end*/

/* methods start*/
// 查看原因
const viewReson = (id) => {
    refundVisible.value = true
    if(id == 2){
        isFooterDisabled.value = true
    }else {
        isFooterDisabled.value = false
    }
}

</script>

<style lang="less" scoped>
.personnel-detail{
    width: 100%;    
    height: 100%;
    font-family: PingFang SC;
     
    .title{
        color: var(--color-text-5, #1D2129);            
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        margin-bottom: 16px;
    }       

    .d-top{
        width: 100%;
        padding: 20px;        
        box-sizing: border-box;        
        border-radius: 6px;
        border: 1px solid #E7E9F0;
        background: #FFF;        
        .container{
            width: 100%;
            display: flex;           
            .d-img{
                margin-right: 20px;
                width: 100px;
                height: 100px;            
                .img{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                }
            }
            .d-content{
                width: calc(100% - 100px);
                .all-msg{
                    .fcc(space-between);
                    .user-msg{
                        display: flex;
                        align-items: center;
                        color: #1D2129;                        
                        font-size: 16px;                        
                        font-weight: 600;                        
                        .use{
                            display: flex;
                            align-items: center;
                            color: #0061FF;                            
                            font-size: 14px;                            
                            font-weight: 400;     
                            margin-left: 8px;
                            .img{
                                width: 16px;
                                height: 16px;
                                margin-right: 6px;
                            }
                        }                        
                    }
                    .job{
                        display: inline-block;                        
                        padding: 0px 4px; 
                        border-radius: 2px;
                        background: #00B42A;
                        color: #FFF;
                        font-size: 12px;                        
                        font-weight: 400;
                        margin-left: 8px;                                                                     
                    }
                    .job-number{
                        display: inline-block;                        
                        padding: 0px 4px; 
                        border-radius: 2px;
                        background: #F2F3F5;
                        color: #86909C;
                        font-size: 12px;                        
                        font-weight: 400;
                        margin-left: 8px;
                        .number{
                            color: #1D2129;
                        }
                    }
                }               
            }
        }
    }
    .d-center{
        width: 100%;
        padding: 20px;        
        box-sizing: border-box;        
        border-radius: 6px;
        border: 1px solid #E7E9F0;
        background: #FFF;    
    }
    .d-bottom{
        width: 100%;   
        height: 100%;       
        padding: 20px;        
        box-sizing: border-box;        
        border-radius: 6px;
        border: 1px solid #E7E9F0;
        background: #FFF;
    }
}

.row-detail{
    .row-item{ 
        width: 100%;      
        display: flex;
        align-items: center;                 
        font-size: 14px;        
        font-weight: 400;        
        .key{            
            color: #86909C;   
            white-space: nowrap;
        }
        .value{   
            width: 100%;
            color: #1D2129;
            padding-right: 20px;
        }
    }
    .select-w{
        width: 100%;
    }
}

.m-t-16{
    margin-top: 16px;
}
.m-b-16{
    margin-bottom: 16px;
}
.m-L-40{
    margin-left: 40px;
}
.i-s-w{
    width: 90%;
}

.delete-icon{
    margin-left: 10px;
}
</style>