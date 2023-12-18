import { ref, reactive,onMounted } from "vue";

export default function useNumber(props) {
    const number = ref(0); // data
	const {type} = props
    const addNumber = () => { // method
        number.value++;
    };
	const resetNumber = () => {
		number.value = 0;
	};
	onMounted(()=>{
		console.log('mounted')
	})
	return {
		number,
		addNumber,
		resetNumber,
		props,
		type
	}
}
