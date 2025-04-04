import { useAppStore } from "@/store/modules/app";
import { useAuthStore } from "@/store/modules/auth";
import { ObjectDirective } from "vue";


export const permission: ObjectDirective = {

    mounted(el, binding) {
        const authStore = useAuthStore()
        if (!authStore.isOrdinaryUser()) return 

        const { value, arg = 'button' } = binding.value

        // 根据角色来进行权限控制
        if (arg === 'role') {
            // 如果根据角色来进行角色控制，需要传递一个数组
            const userRoles = authStore.userInfo.roles
            if (value) {
                for (const role in [...value]) {
                    if (userRoles?.includes(role)) {
                        return;
                    }
                }
            }
            el.remove()
            return;
        }

        if (arg === 'button') {
            // 更具菜单权限来进行权限控制
            // 如果根据按钮进行权限控制，只需要传递一个字符串
            const userButtons = authStore.userInfo.buttons
            if (userButtons?.includes(value)) {
                return;
            }
            el.remove()
        }
    }
}