<template>
    <a-sub-menu :key="menuInfo.key" @select="onSelect">
        <template #icon><MailOutlined /></template>
        <template #title>{{ menuInfo[$Util.regionalUnitMoney().name_index] }}</template>
        <div v-for="item in menuInfo.children" :key="item.key">
            <template v-if="!item.children || item.children.length === 0">
                <a-menu-item :key="item.key" class="no-child-item" :title="item[lang === 'zh' ? 'name' : 'name_en']">
                    {{ item[lang === 'zh' ? 'name' : 'name_en'] }}
                </a-menu-item>
            </template>
            <template v-else>
                <MenuSub :menu-info="item" :key="item.key" />
            </template>
        </div>
    </a-sub-menu>
</template>

<script setup>
import MenuSub from '@/components/Menu/Sub.vue';
import { MailOutlined } from '@ant-design/icons-vue';
import { computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const emit = defineEmits(['select']);
const props = defineProps({
    menuInfo: {
        type: Object,
        required: true,
    },
});

const onSelect = ({ key }) => {
    emit('select', key);
};
const lang = computed(() => {
    return store.state.lang;
});
</script>

<style lang="less" scoped></style>
