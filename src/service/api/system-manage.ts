import { request } from '../request';


//////////////////////////////////////////// role start ////////////////////////////////

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

/** get role list */
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RoleList>({
    url: '/role',
    method: 'get',
    params
  });
}

//////////////////////////////////////////// role end ////////////////////////////////


//////////////////////////////////////////// menu start ////////////////////////////////


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

/**
 * 更新指定菜单
 *
 * @param id 菜单id
 * @param menu 菜单对象
 */
export function updateMenu(id: string, menu: Api.SystemManage.Menu) {
  return request<Boolean>({
    url: `/menu/${id}`,
    method: "put",
    data: menu
  })
}

/**
 * 获取指定菜单详情
 *
 * @param id 菜单id
 */
export function fetchMenuDetail(id: string) {
  return request<Api.SystemManage.Menu>(
    {
      url: `/menu/${id}`,
      method: 'get'
    }
  )
}

/**
 * 删除指定菜单
 *
 * @param menuIds 菜单id列表
 */
export function deleteMenu(...menuIds: string[]) {
  return request<Boolean>({
    url: `/menu`,
    method: "delete",
    data: [...menuIds]
  })
}

/** get menu tree */
export function fetchGetMenuTree() {
  return request<Api.SystemManage.MenuTree[]>({
    url: '/menu',
    method: 'get',
  });
}


//////////////////////////////////////////// menu end ////////////////////////////////
