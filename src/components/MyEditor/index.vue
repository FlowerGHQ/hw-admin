<template>
    <QuillEditor
        class="editor-area"
        ref="quillRef"
        v-model:content="content"
        :readOnly="readOnly"
        :options="myOptions"
        contentType="html"
        @update:content="setValue()" />
</template>

<script setup>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { ref, watch, reactive, toRaw } from "vue";
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
});
const emit = defineEmits(["update:modelValue"]);

const { placeholder } = props;
const content = ref("");
const quillRef = ref(null);
const myOptions = reactive({
    modules: {
        toolbar: [
            [{ list: "bullet" }],
        ],
    },
    placeholder,
});

const setValue = () => {
    const text = toRaw(quillRef.value).getHTML();
    emit("update:modelValue", text);
};
watch(
    () => props.modelValue,
    (val) => {

        console.log(val,'-----------');
        if ((val != null || val != "" || val != "<p><br></p>") &&val) {
            console.log(1);
            content.value = val;
        }  else {
            console.log(2);
            content.value = "";
            toRaw(quillRef.value).setContents(""); // 清空编辑器
        }
    },
    {
        immediate: true,
        deep: true,
    }
);
</script>

<style lang="less" scoped></style>
