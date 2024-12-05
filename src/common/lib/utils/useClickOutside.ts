import {onMounted, onUnmounted} from "vue";

export const useClickOutside = (elementRef: any, callback: () => void) => {
    const handleClickOutside = (event: MouseEvent) => {
        if (elementRef.value && !elementRef.value.contains(event.target as Node)) {
            callback();
        }
    }

    onMounted(() => {
        document.addEventListener('mousedown', handleClickOutside);
    })

    onUnmounted(() => {
        document.addEventListener('mousedown', handleClickOutside);
    })

    return {
        removeEventListener: () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }
}