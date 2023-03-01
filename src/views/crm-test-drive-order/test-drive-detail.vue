<template>
    <div id="drivedetail">
        <div class="edit-container">
            <div class="title-container">
                <div class="title-area">{{$t('dis.order_detail')}}</div>              
            </div>
            <div class="gray-panel">
                <div class="panel-content desc-container">  
                    <a-row class="desc-detail">
                        <!-- 用户姓名： -->
                        <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                            <span class="key">{{$t('dis.user_name')}}：</span>
                            <span class="value">
                                123
                            </span>
                        </a-col>
                    </a-row>                       
                    <a-row class="desc-detail" style="margin-top: 8px;">                       
                        <!-- 手机号： -->
                        <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                            <span class="key">{{$t('n.phone')}}：</span>
                            <span class="value">
                                123
                            </span>
                        </a-col>
                        <!-- 邮箱： -->
                        <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                            <span class="key">{{$t('n.email')}}：</span>
                            <span class="value">
                                123
                            </span>
                        </a-col>
                        <!-- 用户级别： -->
                        <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                            <span class="key">{{$t('dis.user_level')}}：</span>
                            <span class="value">
                                123
                            </span>
                        </a-col>
                        <!-- 用户类型： -->
                        <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                            <span class="key">{{$t('dis.user_type')}}：</span>
                            <span class="value">
                                123
                            </span>
                        </a-col>
                        <!-- 负责人： -->
                        <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                            <span class="key">{{$t('dis.own_user_name')}}：</span>
                            <span class="value">
                                123
                            </span>
                        </a-col>
                        <!-- 前负责人： -->
                        <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                            <span class="key">{{$t('dis.before_user_name')}}：</span>
                            <span class="value">
                                123
                            </span>
                        </a-col>
                        <!-- 订单创建时间： -->
                        <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                            <span class="key">{{$t('dis.order_create_time')}}：</span> 
                            <span class="value">
                                123
                            </span>
                        </a-col>
                        <!-- 订单来源： -->
                        <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                            <span class="key">{{$t('dis.order_source')}}：</span>
                            <span class="value">
                                123
                            </span>
                        </a-col>
                        <!-- 试驾车型： -->
                        <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                            <span class="key">{{$t('dis.crm_dict_id')}}：</span>
                            <span class="value">
                                123
                            </span>
                        </a-col>
                        <!-- 标签展示： -->
                        <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                            <span class="key">{{$t('dis.label_show')}}：</span>
                            <span class="value">
                                123
                            </span>
                        </a-col>                                                                     
                    </a-row>      
                    <a-row class="desc-detail" style="margin-top: 8px;">
                        <!-- 门店邮件是否发送： -->
                        <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                            <span style="color: #8090a6;">{{$t('dis.store_is_send_mail')}}：</span>
                            <div>
                                <span style="color:#f31309">{{$t('dis.fail_send')}}</span> 
                                <a-button type="link" style="margin-left: 10px;">{{$t('dis.fagain_send')}}</a-button>
                            </div>
                        </a-col>
                        <!-- 用户邮件是否发送： -->
                        <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                            <span style="color: #8090a6;">{{$t('dis.user_is_send_mail')}}：</span>
                            <div>
                                {{$t('dis.been_sent')}}({{$t('dis.mail')}}: 1234)
                            </div>
                        </a-col>   
                    </a-row>  
                </div>
            </div>
        </div>

        <div class="edit-container">
            <div class="title-container">
                <div class="title-area">{{$t('dis.subscribe_store')}}</div>              
            </div>
            <div class="gray-panel">
                <div class="panel-content desc-container">                                         
                    <a-row class="desc-detail">                         
                        <!-- 门店名称 -->
                        <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                            <span class="key">{{$t('dis.store_name')}}：</span>
                            <span class="value">
                                123
                            </span>
                        </a-col>
                        <!-- 门店电话号 -->
                        <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                            <span class="key">{{$t('dis.store_phone')}}：</span>
                            <span class="value">
                                123
                            </span>
                        </a-col>
                        <!-- 门店邮箱 -->
                        <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                            <span class="key">{{$t('dis.store_email')}}：</span>
                            <span class="value">
                                123
                            </span>
                        </a-col>
                        <!-- 营业时间 -->
                        <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                            <span class="key">{{$t('dis.business_hours')}}：</span>
                            <span class="value">
                                123
                            </span>
                        </a-col>
                        <!-- 门店地址 -->
                        <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                            <span class="key">{{$t('dis.store_address')}}：</span>
                            <span class="value">
                                123
                            </span>
                        </a-col>
                        <!-- 门店官网 -->
                        <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                            <span class="key">{{$t('dis.store_website')}}：</span>
                            <span class="value">
                                123
                            </span>
                        </a-col>                                                                     
                    </a-row>                            
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { onMounted, ref } from 'vue'
    import { useRoute} from 'vue-router';
    const route = useRoute()

    const id = ref(null)
    onMounted(() => {
        id.value = route.query.id
        console.log("获取的详情id",id.value);
    })
</script>

<style lang="less" scoped>
#drivedetail{}
</style>