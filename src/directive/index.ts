import { App } from "vue";
import { permission } from "@/directive/permission";


export const setupDirective = (app: App) => {
    app.directive("permission", permission);
};