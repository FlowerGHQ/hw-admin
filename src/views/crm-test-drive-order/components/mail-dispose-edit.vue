<template>
    <div class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ true ? $t('dis.new_mail'):$t('dis.edit_mail') }}</div>
        </div>
        <!-- 编辑 -->
        <div class="form-block">       
            <div class="form-title">
                <div class="title"></div>
            </div>               
            <div class="form-content">
                 <!-- 收件人： -->
                <div class="form-item">
                    <div class="key form-key">{{$t('dis.receiver')}}：</div>
                    <div class="value">                        
                        <a-select placeholder="">
                            <a-select-option value="jack">Jack</a-select-option>
                            <a-select-option value="lucy">Lucy</a-select-option>                           
                        </a-select>
                    </div>
                </div>
                <!-- 使用语言： -->
                <div class="form-item">
                    <div class="key form-key">{{$t('dis.use_language')}}</div>
                    <div class="value">                        
                        <a-select placeholder="">
                            <a-select-option value="jack">Jack</a-select-option>
                            <a-select-option value="lucy">Lucy</a-select-option>                           
                        </a-select>
                    </div>
                </div>
                <!-- 邮箱用途： -->
                <div class="form-item">
                    <div class="key form-key">{{$t('dis.mailbox_purpose')}}</div>
                    <div class="value">
                        <a-select placeholder="">
                            <a-select-option value="jack">Jack</a-select-option>
                            <a-select-option value="lucy">Lucy</a-select-option>                           
                        </a-select>
                    </div>
                </div>
                <!-- 回访时间 -->
                <div class="form-item">
                    <div class="key form-key">{{$t('dis.visit_time')}}：</div>
                    <div class="value">
                        <a-input style="width: 120px;"  /> {{$t('dis.hour_after')}}
                    </div>
                </div>
                <!-- 回访问卷： -->
                <div class="form-item">
                    <div class="key form-key">{{$t('dis.visit_questionnaire')}}：</div>
                    <div class="value">
                        <a-input placeholder="请填写问卷ID"  />
                    </div>
                </div>
                <!-- 邮件标题： -->
                <div class="form-item">
                    <div class="key form-key">{{$t('dis.mail_title')}}：</div>
                    <div class="value">
                        <a-input placeholder="请填写邮件标题" />
                    </div>
                </div>
                <!-- 邮件内容： -->
                <div class="form-item">
                    <div class="key form-key">{{$t('dis.mail_content')}}：</div>
                    <div class="value">                        
                    </div>
                </div>
                <!-- 插入动态内容： -->
                <div class="form-item">
                    <div class="key form-key">{{$t('dis.insert_dynamic_content')}}：</div>
                    <div class="value">  
                        <a-button type="link">#用户#</a-button>
                    </div>
                </div>
            </div>
           
        </div>
        <div class="form-btns">
            <!-- 保存 -->
            <a-button type="primary" @click="handleSubmit">{{ $t('def.save') }}</a-button>
            <a-button type="primary" ghost @click="routerChange('back')">{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';

const {proxy} = getCurrentInstance();
const router = useRouter()



/* methods */
// 路由跳转
const routerChange = (type, item = {}) => {
   switch(type) {
       case 'edit': {
           let routeUrl = router.resolve({
               path: "",
            //    query: { id: item.id }
           })
           window.open(routeUrl.href, '_self')
       }; break
   }
}
</script>

<style lang="less" scoped>
.form-key{
    width: 100px !important;
}
</style>