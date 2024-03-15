<template>
    <a-select
        v-model:value="value"
        show-search
        placeholder="Select a person"
        style="width: 200px"
        :options="options"
        option-filter-prop="label"
        :filter-option="filterOption"
        @change="handleChange"
    ></a-select>
</template>
<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
    setup() {        
        const options = ref([
            { value: '1', label: 'Jack' },
            { value: '2', label: 'Lucy' },
            { value: '3', label: 'Tom' },
            { value: '4', label: 'llll' },
            { value: '5', label: 'cll' },
        ]);
        const handleChange = value => {
            console.log(`selected ${value}`);
        };
        const handleBlur = () => {
            console.log('blur');
        };
        const handleFocus = () => {
            console.log('focus');
        };
        const filterOption = (input, option) => {
            console.log("input", input);
            console.log("option", option);
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        };
        return {                       
            filterOption,
            handleBlur,
            handleFocus,
            handleChange,
            options,
        };
    },
});
</script>
