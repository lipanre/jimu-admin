import { request } from '../request';

/**
 * get all roles
 *
 * these roles are all enabled
 */
export function fetchGetAllRoles() {
  // return request<Api.SystemManage.AllRole[]>({
  //   url: '/systemManage/getAllRoles',
  //   method: 'get'
  // });
  return { error: '', data: [{ roleName: '管理员', roleCode: 'admin' }] };
}

/** get menu list */
export function fetchGetMenuList() {
  return request<Api.SystemManage.MenuList>({
    url: '/menu',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: -1
    }
  });
}

/** get all pages */
export function fetchGetAllPages() {
  return request<string[]>({
    url: '/system-manager/pages',
    method: 'get'
  });
}

/** get menu tree */
export function fetchGetMenuTree() {
  return request<Api.SystemManage.MenuTree[]>({
    url: '/systemManage/getMenuTree',
    method: 'get'
  });
}

/**
 * 创建菜单
 *
 * @param menu 菜单
 */
export function createMenu(menu: any) {
  return request<Boolean>({
    url: "/menu",
    method: "post",
    data: menu
  })
}
