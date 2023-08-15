<template>
    <div class="personnel-detail" >
        <div class="d-top">
            <div class="header">
                <div class="title">
                    {{ $t("retail.personnel_detail")}} 
                </div>
                <div class="btn">
                    <a-button type="primary" @click="onBtn">{{ $t('retail.save') }}</a-button>
                </div>
            </div>
            <div class="container">
                <div class="d-img">
                    <img class="img" :src="fill_out.avatar" alt="">
                </div>
                <div class="d-content">
                    <a-row class="all-msg">
                          <div class="user-msg">
                            <span>{{ fill_out.name }}</span>
                            <span class="use">  
                                <template v-if="fill_out.gender == Core.Const.CRM_ORDER.SEX_MAP.male">
                                    <img class="img" src="../../../assets//images/retail/male.png" alt="">
                                </template>
                                <template v-else-if="fill_out.gender == Core.Const.CRM_ORDER.SEX_MAP.female">
                                    <img class="img" src="../../../assets//images/retail/female.png" alt="">
                                </template>
                                <span>{{ fill_out.age }}</span>
                            </span>
                            <span class="job">                                
                                {{ fill_out.status? Core.Const.RETAIL.Working_condition[fill_out.status][$i18n.locale] : '-' }}
                            </span>
                            <span class="job-number">
                                <span>ID：</span>
                                <span class="number">{{ fill_out.id }}</span>
                            </span>
                          </div>
                    </a-row>
                    <a-row class="row-detail">
                        <!-- 手机号码 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item m-t-16">
                            <div class="key key-form-86909C">{{ $t("retail.phone1")}} ：</div>
                            <div class="value">
                                {{ fill_out.phone }}
                            </div>                          
                        </a-col>
                        <!-- 邮箱 可改-->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                            <div class="key key-form-86909C">{{ $t("retail.email")}}：</div>
                            <div class="value">
                                <a-input
                                    v-model:value="fill_out.email" 
                                    :placeholder="$t('def.select')"                                                                       
                                    />
                            </div>
                        </a-col>
                        <!-- 性别 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                            <span class="key key-form-86909C">{{$t('retail.sex')}}：</span>
                            <span class="value">
                                <a-radio-group
                                    v-model:value="fill_out.gender" 
                                    :placeholder="$t('def.select')"                                    
                                    >
                                    <a-radio v-for="item in Core.Const.CRM_ORDER.SEX" :value="item.key">
                                        {{ item[$i18n.locale] }}
                                    </a-radio>
                                </a-radio-group>
                            </span>
                        </a-col>
                        <!-- 年龄 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                            <span class="key key-form-86909C">{{$t('retail.age')}}：</span>
                            <span class="value">
                                <a-input v-model:value="fill_out.age" :placeholder="$t('def.select')"/>
                            </span>
                        </a-col>                        
                        <!-- 工号 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                            <span class="key key-form-86909C">{{$t('retail.job_number')}}：</span>
                            <span class="value">
                                {{ fill_out.employee_no }}
                            </span>
                        </a-col>
                        <!-- 部门 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                            <span class="key key-form-86909C">{{$t('retail.section')}}：</span>
                            <span class="value">
                                <template v-for="(item,index) in fill_out.department_list" :key="item.id">
                                    <span>{{ item.name }}</span>
                                    <span class="m-L-R" v-if="fill_out.department_list.length - 1 !== index">|</span>
                                </template>
                            </span>                                        
                        </a-col>  
                        <!-- 入职时间 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                            <span class="key key-form-86909C">{{$t('retail.on_borard_time')}}：</span>
                            <span class="value">
                                {{ $Util.timeFilter(fill_out.join_time, 3) }}
                            </span>
                        </a-col>
                        <!-- 工服尺寸 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                            <span class="key key-form-86909C">{{$t('retail.workwear_size')}}：</span>
                            <span class="value">
                                <a-select v-model:value="fill_out.work_wear_size"  class="select-w">
                                    <a-select-option 
                                        v-for="item in Core.Const.RETAIL.Outfit_Size" 
                                        :key="item.key" 
                                        :value="item.value"
                                        >
                                        {{ item.value }}
                                    </a-select-option>
                                </a-select>
                            </span>
                        </a-col>                    
                    </a-row>
                </div>
            </div>
        </div>
        <!-- 人员归属 -->
        <template v-for="(item, index) in fill_out.store_user_list" :key="item.id">
            <div class="d-center m-t-16">
                <div class="title">
                    {{ $t("retail.personnel_attribution")}}{{ index + 1 }}
                </div>
                <div class="container">
                    <a-row class="row-detail">
                        <!-- 工作状态 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item m-t-16">
                            <span class="key key-form-86909C">{{ $t("retail.working_condition")}}：</span>
                            <span class="value">
                                <a-select v-model:value="item.status" class="select-w">
                                    <a-select-option 
                                        v-for="(item,index) in Core.Const.RETAIL.Working_condition" 
                                        :key="index"
                                        :value="item.key"
                                        :disabled="item.key === 3"
                                        >
                                        {{ item[$i18n.locale] }}
                                    </a-select-option>
                                </a-select>
                            </span>                          
                        </a-col>
                        <!-- 上岗时间 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                            <span class="key key-form-86909C">{{ $t("retail.start_date")}}：</span>
                            <span class="value">                                
                                {{ $Util.timeFilter(item.join_time, 3) }}
                            </span>
                        </a-col>
                        <!-- 职务 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                            <span class="key key-form-86909C">{{$t('retail.job')}}：</span>
                            <span class="value">
                                <a-select v-model:value="item.type" class="select-w">
                                    <a-select-option 
                                        v-for="item in Core.Const.RETAIL.Job" 
                                        :value="item.key" 
                                        :key="item.key"                                       
                                        >
                                        {{ item[$i18n.locale] }}
                                    </a-select-option>
                                </a-select>
                            </span>
                        </a-col>
                        <!-- 所属大区 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                            <span class="key key-form-86909C">{{$t('retail.subregion')}}：</span>
                            <span class="value">                                
                                <a-select 
                                    v-model:value="item.group_id" 
                                    class="select-w" 
                                    @change="allChange('group_id', item)"
                                >
                                    <a-select-option 
                                        v-for="item of regionsList" 
                                        :key="item.id"
                                        :value="item.id"
                                    >
                                        {{ item.name}}
                                    </a-select-option>                            
                                </a-select>
                            </span>
                        </a-col>
                        <!-- 所属城市 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                            <span class="key key-form-86909C">{{$t('retail.home_city')}}：</span>
                            <span class="value">
                                <a-select 
                                    v-model:value="item.city" 
                                    class="select-w"
                                    :placeholder="$t('retail.p_s_region')"
                                    @select="allChange('city', item)"
                                    >
                                    <a-select-option 
                                        v-for="$1 in item.cityList"                                         
                                        :value="$1.city"
                                    >
                                        {{ $1.city}}
                                    </a-select-option>
                                </a-select>
                            </span>
                        </a-col>
                        <!-- 所属门店 -->
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6"  class="row-item m-t-16">
                            <span class="key key-form-86909C">{{$t('retail.affiliated_store')}}：</span>
                            <span class="value">
                                <a-select v-model:value="item.store_id" class="select-w">
                                    <a-select-option
                                        v-for="item of storeList"
                                        :key="item.id"
                                        :value="item.id"
                                        >
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </span>                                        
                        </a-col>                      
                    </a-row>
                </div>
            </div>
        </template>
        <div class="d-bottom m-t-16">
            <div class="title">
                {{ $t("retail.role_authority")}} 
            </div> 
            <div class="search">
                <a-row class="row-detail">
                    <!-- 角色1: -->
                    <template v-for="($1,index) in fill_out.role_id_list" :key="index">                
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                            <span class="key">{{ $t("retail.role")}}{{ index + 1 }}：</span>
                            <span class="value">
                                <a-select 
                                    v-model:value="$1.id" 
                                    class="select-w-9" 
                                    :placeholder="$t('def.select')"
                                    @change="allChange('role')"
                                    >
                                    <a-select-option v-for="$2 in roleList" :value="$2.id">
                                        {{ $2.name }}
                                    </a-select-option>
                                </a-select>
                                <span class="delete-icon" @click="deleterole(index)"><i class="icon i_delete" /></span>
                            </span>                    
                        </a-col>
                    </template>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="row-item">
                        <a-button type="primary" ghost @click="addrole">{{ $t("retail.add_a_role")}}</a-button>                   
                    </a-col>                    
                </a-row>
               
            </div>        
        </div>
    </div>
</template>

<script setup>
import Core from "@/core";
import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";

const route = useRoute()
const router = useRouter()
// 数据
const fill_out = ref({
    status: undefined, // 最外面状态
    id: undefined, // 用户id
    name: undefined, // 名称
    phone: undefined, // 手机号
    email: undefined, // 邮箱
    gender: undefined, // 性别
    age: undefined, // 年龄
    avatar: undefined, // 头像
    department_list: [], // 部门信息
    employee_no: undefined, // 员工工号
    join_time: undefined, // 入职时间
    work_wear_size: undefined, // 尺码
    working_condition: undefined, // 工作状态
    job_time: undefined, // 上岗时间
    role_list:[], // 关联角色 
    role_id_list: [], // 角色保存的ids   
    store_user_list:[], // 人员归属              
})  // 保存的shi

// 角色权限下拉选择框
const roleList = ref([]) 

const regionsList = ref([]) // 所属区域
const storeList = ref([])  // 门店list

onMounted(async() => {    
    try {
        await getRegionsDataFetch()   
    } catch (error) {
        console.log("获取详情接口失败", error);
    } 
    getStoreDataFetch()
    personDetailFetch()
    getRoleData()
})

const {proxy} = getCurrentInstance()
/* Fetch start*/
// 获取详情接口(新创建的时候不执行这个)
const personDetailFetch = (params = {}) => {    
    return new Promise((resolve,reject) => {
        Core.Api.RETAIL.personDetail({
            id: route.query?.id || undefined,
            ...params
        }).then((res) => {
            resolve()
            // console.log("获取详情接口 success", res);
            fill_out.value = res
            // role_id_list(回显是用 [{id: 1}, {id: 2}])  // 但在保存接口的时候传的是role_id_list:[1,2,3]
            // 这样搞是后端返回详情数据是{}  保存接口又是需要[]  而且渲染的时候[1,2,3]不能直接赋值个:value
            fill_out.value.role_id_list = [...new Set(fill_out.value.role_list.map(el => {
                return {id: el.id}
            } ))]
            Reflect.deleteProperty(fill_out.value, 'role_list')

            if(fill_out.value.store_user_list.length == 0){
                // 默认需要给个人归属有个填信息
                fill_out.value.store_user_list = [{}]
            }else{
                fill_out.value.store_user_list.forEach($1 => {
                    // 为了让 placeholder 显示
                    if($1.city == ""){
                        $1.city = undefined
                    }                   
                    const result = regionsList.value.find($2 => {
                        return $2.id == $1.group_id
                    })
                    $1.cityList = result?.city_list || []
                });
            }

            console.log("fill_out.value", fill_out.value);
        }).catch((err) => {
            reject()
            console.log("获取详情接口 err", err);
        })
    })
}
// 更新创建接口
const personUpdateFetch = (params = {}) => { 
    Core.Api.RETAIL.personUpdate({
        id: fill_out.value.id,
        ...params
    }).then((res) => {
        proxy.$message.success(proxy.$t('pop_up.save_success'))
        personDetailFetch()
        // console.log("更新创建接口 success", res);
    })
    .catch((err) => {
        console.log("更新创建接口 err:", err);
    })
}
// 获得所属区域
const getRegionsDataFetch = (params = {}) => {
    return new Promise((resolve,reject) => {
        Core.Api.RETAIL.regionsList({...params}).then((res) => {
            resolve()   
            console.log("获得所属区域 success", res);
            regionsList.value = res.list;    
        }).catch((err) => {
            reject()
            console.log("获得所属区域 err", err);
        })
    })
}
// 门店list
const getStoreDataFetch = (params = {}) => {
    Core.Api.RETAIL.storeList({...params}).then((res) => {
        // console.log("门店list success", res);
        storeList.value = res.list;
    }).catch((err) => {
        console.log("门店list err", err);
    })
}
// 获取角色list数据
const getRoleData = (params = {}) => {
    Core.Api.Authority.roleList({...params}).then((res) => {
        // console.log("获取角色 success", res);
        roleList.value = res.list
    }).catch((err) => {
        console.log("获取角色 err", err);
    })
}
/* Fetch end*/

/* methods start*/
// 角色权限 //
const addrole = () => {    
    fill_out.value.role_id_list.push({})
}
const deleterole = (index) => {    
    fill_out.value.role_id_list.splice(index,1)
}
// 角色权限 //

// 改动所有的事件
const allChange = (type, item) => { 
    console.log("输出", item);   
    switch(type){
        case 'group_id':            
            const result = regionsList.value.find(el => {
                return el.id == item.group_id
            })   
            console.log("result",result);
            item.cityList = result?.city_list || []
            getStoreDataFetch({group_id: item.group_id})
            break;
        case 'city':            
            getStoreDataFetch({group_id: item.group_id, city: item.city})
            break;
        case 'role': 
            console.log("role");
            let arr = fill_out.value.role_id_list
            fill_out.value.role_id_list = [...new Set(arr.map(item => item.id))]
            break;
    }    
}
// 保存按钮
const onBtn = () => {    
    console.log("最后结果 fill_out.value", fill_out.value);
    personUpdateFetch(fill_out.value)
}
</script>

<style lang="less" scoped>
.personnel-detail{
    width: 100%;    
    height: 100%;
    font-family: PingFang SC;
    display: flex;
    flex-direction: column;

    .header{
        display: flex;
        justify-content: space-between;
        .title{
            color: var(--color-text-5, #1D2129);            
            font-size: 18px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            margin-bottom: 16px;
        }  
        .btn{

        }     
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

.m-L-R{
    margin: 0 5px;
}

.delete-icon{
    margin-left: 10px;
}

</style>