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
    method: 'get'
  });
}

/** get all pages */
export function fetchGetAllPages() {
  return request<string[]>({
    url: '/systemManage/getAllPages',
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
