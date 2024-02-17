import { createApp } from 'vue';
const app = createApp();

class MyDirective {
    constructor(app) {
        this.app = app;
    }

    default() {
        // 清楚空格
        this.app.directive('trim-space', {
            beforeMount(el, binding) {
                el.addEventListener('input', function () {
                    const trimmedValue = el.value.trim();
                    if (binding.value) {
                        binding.value = trimmedValue;
                    } else {
                        el.value = trimmedValue;
                    }
                });
            },
        });

        this.app.directive('focus', {
            mounted(el, binding) {
                el.focus();
            },
        });
    }
}

export default MyDirective;
