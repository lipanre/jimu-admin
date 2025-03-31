import { useAuthStore } from "@/store/modules/auth";


interface Directive {
    name: string;
    directive: any;
}


const vPermission: Directive = {
    name: 'permission',
    directive: {
        mounted(el: HTMLElement, binding: any, vnode: any) {
            const authStore = useAuthStore()
            const { value } = binding
            
        }
    }
}