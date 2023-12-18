import { ref, reactive } from "vue";

export default function useNumber() {
    const number = ref(0);
    const addNumber = () => {
        number.value++;
    };
	const resetNumber = () => {
		number.value = 0;
	};

	return {
		number,
		addNumber,
		resetNumber
	}
}
