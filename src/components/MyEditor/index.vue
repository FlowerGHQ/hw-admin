<template>
    <div class="editor-container">
        <QuillEditor
            class="editor-area"
            ref="quillRef"
            v-model:content="content"
            :readOnly="readOnly"
            :options="myOptions"
            contentType="html"
            @update:content="setValue()" />
        <span class="SizeTiShi">{{ TiLength }} / {{ maxLength }}</span>
    </div>
</template>

<script setup>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import * as Quill from 'quill'
// 拖拽上传
import { ImageDrop } from 'quill-image-drop-module'
// 调整上传图片大小
// import ImageResize from 'quill-image-resize-module'
import 'quill-image-resize-module/image-resize.min.js';

// 注册事件
Quill.register('modules/imageDrop', ImageDrop)
// Quill.register('modules/imageResize', ImageResize)
import { ref, watch, reactive, toRaw, nextTick, getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();
//withDefaults 是一个辅助函数，用于将默认值与传递的值合并
const props = defineProps({
    modelValue: {
        type: String,
        default: null,
    }, // 双向绑定值的默认值
    readOnly: {
        type: Boolean,
        default: false,
    },
    placeholder: {
        type: String,
        default: "请输入内容...",
    },
    modules: {
        type: Object,
        default: () => {
            return {
                toolbar: [
                    [{ list: "bullet" }],
                ],
            }
        }
    }
});
const emit = defineEmits(["update:modelValue"]);

const { placeholder, modules } = props;
const content = ref("");
const quillRef = ref(null);
const myOptions = reactive({
    modules,
    placeholder,
});
const maxLength = ref(2000)
const TiLength = ref(0)

const setValue = () => {
    const text = toRaw(quillRef.value).getHTML() !== '<p><br></p>' ? toRaw(quillRef.value).getHTML() : '';
    emit("update:modelValue", text);
    TiLength.value = quillRef.value.getText().length - 1
    if(TiLength.value > maxLength.value){
        proxy.$message.warning(proxy.$t('operation.with') + maxLength.value + proxy.$t('operation.char'))
        nextTick(() => {
            quillRef.value.setText(quillRef.value.getText().slice(0, maxLength.value))
        })
    }
};
watch(
    () => props.modelValue,
    (val) => {
        console.log(val);
        if ((val != null || val != "" || val != "<p><br></p>") &&val) {
            content.value = val;
            if(quillRef.value) {
                nextTick(() =>{
                TiLength.value = quillRef.value.getText().length - 1;// 设置字数
                })
            }
        }
        else {
            content.value = "";
            // 清空
            quillRef.value && toRaw(quillRef.value).setContents("");
        }
    },
    {
        deep: true,
        immediate: true,
    }
);
</script>

<style lang="less" scoped>
.editor-container {
    position: relative;
    .SizeTiShi {
        color: #4E5969;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        position: absolute;
        bottom: 10px;
        right: 10px;
        z-index: 9;
    }
}
</style>
