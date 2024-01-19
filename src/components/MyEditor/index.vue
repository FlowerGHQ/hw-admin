<template>
    <div id="border">
        <div class="editor-area">
            <!-- 工具栏 -->
            <Toolbar class="tool-bar-area" :editor="editor" :defaultConfig="toolbarConfig" />
            <!-- 编辑器 -->
            <Editor
                class="editor-content-area"
                :defaultConfig="editorConfig"
                v-model:html="html"
                @onChange="onChange"
                @onCreated="onCreated" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Boot, Editor, Toolbar } from "@wangeditor/editor-for-vue";
import formulaModule from "@wangeditor/plugin-formula";
import axios from "axios";

Boot.registerModule(formulaModule);

const props = defineProps({
    editorContent: {
        type: String,
        required: true,
    },
});

const { editorContent } = props;

const editor = ref(null);
const html = ref(editorContent);
const toolbarConfig = ref({});

const editorConfig = ref({
    placeholder: "请输入内容...",
    MENU_CONF: {
        uploadImage: {
            customUpload: (file) => {
                uploadFile(file, 1);
            },
        },
        uploadVideo: {
            customUpload: (file) => {
                uploadFile(file, 2);
            },
        },
    },
    hoverbarKeys: {
        formula: {
            menuKeys: ["editFormula"],
        },
    },
});

async function uploadFile(file, type) {
    // 模拟上传文件，实际情况下这里应该是一个上传到OSS或接口的函数
    const response = await axios.post("/upload", { file, type });
    const data = response.data;

    if (type === 1) {
        // 图片上传
        html.value += `<img src="${data.imgUrl}" />`;
    } else if (type === 2) {
        // 视频上传
        html.value += `<div data-w-e-type="video" data-w-e-is-void><video controls="true" poster="${data.imgUrl}"><source src="${data.videoUrl}" type="video/mp4"/></video></div>`;
    }
}

function onCreated(editorInstance) {
    editor.value = editorInstance;
}

function onChange(editorInstance) {
    const newHtml = editorInstance.getHtml();
    emit("update:html", newHtml);
}

onMounted(() => {
    // 如果需要模拟异步渲染编辑器，可以在这里使用setTimeout
});

onBeforeUnmount(() => {
    if (editor.value) {
        editor.value.destroy();
    }
});
</script>

<style>
/* 导入WangEditor的CSS样式，注意路径可能需要调整 */
@import "@wangeditor/editor/dist/css/style.css";

#border {
    position: relative;
    z-index: 999;
    .editor-area {
        border: 1px solid #ccc;
        margin-top: 10px;
        .tool-bar-area {
            border-bottom: 1px solid #ccc;
        }
        .editor-content-area {
            height: 400px;
            overflow-y: hidden;
            position: relative;
            z-index: 0;
        }
    }
}
</style>
