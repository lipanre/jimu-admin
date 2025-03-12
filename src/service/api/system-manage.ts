import { request } from '../request';


//////////////////////////////////////////// role start ////////////////////////////////

/** get role list */
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RoleList>({
    url: '/role',
    method: 'get',
    params
  });
}

/**
 * 获取所有角色列表
 *
 * @param params
 */
export function fetchGetAllRoleList(params?: Pick<Api.SystemManage.Role, 'roleName' | 'roleCode' | 'status'>) {
  return request<Api.SystemManage.Role[]>({
    url: '/role',
    method: 'get',
    params
  });
}

/**
 * 获取角色详情
 *
 * @param id 角色id
 */
export function fetchGetRoleDetail(id: string) {
  return request<Api.SystemManage.Role>({
    url: `/role/${id}`,
    method: 'get'
  })
}

/**
 * 创建角色
 *
 * @param role 角色对象
 */
export function createRole(role: Pick<Api.SystemManage.Role, 'roleName' | 'roleCode' | 'roleDesc' | 'status'>) {
  return request<Boolean>({
    url: "/role",
    method: 'post',
    data: role
  })
}

/**
 * 更新角色
 *
 * @param id 角色id
 * @param role 角色对象
 */
export function updateRole(id: string, role: Pick<Api.SystemManage.Role, 'roleName' | 'roleCode' | 'roleDesc' | 'status'>) {
  return request<Boolean>({
    url: `/role/${id}`,
    method: 'put',
    data: role
  })
}

/**
 * 删除角色列表
 *
 * @param roleIds 角色id列表
 */
export function deleteRole(...roleIds: string[]) {
  return request<Boolean>({
    url: '/role',
    method: 'delete',
    data: [...roleIds]
  })
}

//////////////////////////////////////////// role end ////////////////////////////////


//////////////////////////////////////////// menu start ////////////////////////////////


/** get menu list */
export function fetchGetMenuList() {
  return request<Api.SystemManage.MenuList>({
    url: '/menu',
    method: 'get',
    params: {
      current: 1,
      size: -1
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



//////////////////////////////////////////// dict start ////////////////////////////////

/**
 * 创建字典
 *
 * @param dto
 */
export const createDict = (dto: Api.SystemManage.Dict) =>
  request<boolean>({
    url: '/dict',
    method: 'post',
    data: dto
  })

/**
 * 分页查询字典列表
 *
 * @param dto 字典dto
 */
export const pageDict = (dto: Partial<Api.SystemManage.Dict>) =>
  request<Api.SystemManage.PageDict>({
    url: "/dict",
    method: 'get',
    params: dto
  })

/**
 * 删除字典
 *
 * @param dictIds
 */
export const deleteDict = (dictIds: string[]) =>
  request<boolean>({
    url: "/dict",
    method: 'delete',
    data: [...dictIds]
  })

/**
 * 查询字典详情
 *
 * @param dictId 字典id
 */
export const getDictDetail = (dictId: string) =>
  request<Api.SystemManage.Dict & {details: Api.SystemManage.DictDetail[]}>({
    url: `/dict/${dictId}`,
    method: 'get',
  })

/**
 * 更新字典
 *
 * @param dictId 字典id
 * @param dto 字典dto
 */
export const updateDict = (dictId: string, dto: Partial<Api.SystemManage.Dict>) =>
  request<boolean>({
    url: `/dict/${dictId}`,
    method: 'put',
    data: dto
  })


//////////////////////////////////////////// dict end ////////////////////////////////


