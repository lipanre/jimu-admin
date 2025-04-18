import { Method } from '~/packages/alova/src';
import { request } from '../request';

/// ///////////////////////////////////////// role start ////////////////////////////////

/** get role list */
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RoleList & Api.SystemManage.Role[]>({
    url: '/role',
    method: 'get',
    params
  });
}

/**
 * 获取角色首页列表
 * 
 * @param roleIds 角色id列表
 * @returns 角色首页列表
 */
export function fetchRoleHomes(roleIds: string[]) {
  return request<string[]>({
    url: '/role/home-list',
    method: 'get',
    params: {
      roleIds: roleIds.join(',')
    }
  })
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
  });
}

/**
 * 创建角色
 *
 * @param role 角色对象
 */
export function createRole(role: Pick<Api.SystemManage.Role, 'roleName' | 'roleCode' | 'roleDesc' | 'status'>) {
  return request<boolean>({
    url: '/role',
    method: 'post',
    data: role
  });
}

/**
 * 更新角色
 *
 * @param id 角色id
 * @param role 角色对象
 */
export function updateRole(
  id: string,
  role: Pick<Api.SystemManage.Role, 'roleName' | 'roleCode' | 'roleDesc' | 'status' | 'dataScope' | 'home'>
) {
  return request<boolean>({
    url: `/role/${id}`,
    method: 'put',
    data: role
  });
}

/**
 * 
 * @param id 角色id 
 * @param role 角色
 * @returns true - 成功 <br> false - 失败
 */
export function patchUpdateRole(id: string, role: Partial<Pick<Api.SystemManage.Role, 'roleName' | 'roleCode' | 'roleDesc' | 'status' | 'dataScope' | 'home'>>) {
  return request<boolean>({
    url: `/role/${id}`,
    method: 'patch',
    data: role
  })
}

/**
 * 删除角色列表
 *
 * @param roleIds 角色id列表
 */
export function deleteRole(...roleIds: string[]) {
  return request<boolean>({
    url: '/role',
    method: 'delete',
    data: [...roleIds]
  });
}

/**
 * 角色授权
 * 
 * @param roleId 角色id
 * @param permissionIds 权限id列表
 */
export function roleAuth(roleId: string, permissionIds: string[]) {
  return request<boolean>({
    url: `/role/auth/${roleId}`,
    method: 'post',
    data: permissionIds
  })
}

/**
 * 获取角色授权列表
 * 
 * @param roleId 角色id
 */
export function listRoleAuth(roleId: string) {
  return request<string[]>({
    url: `/role/auth/${roleId}`,
    method: 'get'
  })
}

/// ///////////////////////////////////////// role end ////////////////////////////////

/// ///////////////////////////////////////// menu start ////////////////////////////////

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

/** get menu list */
export function fetchAllMenu() {
  return request<Api.SystemManage.Menu[]>({
    url: '/menu',
    method: 'get',
  });
}

/** get all pages */
export function fetchGetAllPages() {
  return request<string[]>({
    url: '/menu/pages',
    method: 'get'
  });
}

/**
 * 创建菜单
 *
 * @param menu 菜单
 */
export function createMenu(menu: any) {
  return request<boolean>({
    url: '/menu',
    method: 'post',
    data: menu
  });
}

/**
 * 更新指定菜单
 *
 * @param id 菜单id
 * @param menu 菜单对象
 */
export function updateMenu(id: string, menu: Api.SystemManage.Menu) {
  return request<boolean>({
    url: `/menu/${id}`,
    method: 'put',
    data: menu
  });
}

/**
 * 获取指定菜单详情
 *
 * @param id 菜单id
 */
export function fetchMenuDetail(id: string) {
  return request<Api.SystemManage.Menu>({
    url: `/menu/${id}`,
    method: 'get'
  });
}

/**
 * 删除指定菜单
 *
 * @param menuIds 菜单id列表
 */
export function deleteMenu(...menuIds: string[]) {
  return request<boolean>({
    url: `/menu`,
    method: 'delete',
    data: [...menuIds]
  });
}

/** get menu tree */
export function fetchGetMenuTree() {
  return request<Api.SystemManage.MenuTree[]>({
    url: '/menu',
    method: 'get'
  });
}

/** get menu button tree */
export function fetchGetMenuButtonTree() {
  return request<Api.SystemManage.MenuTree[]>({
    url: '/menu/menu-button-tree',
    method: 'get'
  });
}

/// ///////////////////////////////////////// menu end ////////////////////////////////

/// ///////////////////////////////////////// dict start ////////////////////////////////

/**
 * 创建字典
 *
 * @param dto
 */
export const createDict = (dto: Pick<Api.SystemManage.Dict, 'code' | 'name' | 'description'> & { details: Api.SystemManage.DictDetail[] }) =>
  request<boolean>({
    url: '/dict',
    method: 'post',
    data: dto
  });

/**
 * 分页查询字典列表
 *
 * @param dto 字典dto
 */
export const pageDict = (dto: Api.SystemManage.DictSearchParams) =>
  request<Api.SystemManage.DictList>({
    url: '/dict',
    method: 'get',
    params: dto
  });

/**
 * 删除字典
 *
 * @param dictIds
 */
export const deleteDict = (dictIds: string[]) =>
  request<boolean>({
    url: '/dict',
    method: 'delete',
    data: [...dictIds]
  });

/**
 * 查询字典详情
 *
 * @param dictId 字典id
 */
export const getDictDetail = (dictId: string) =>
  request<Api.SystemManage.Dict & { details: Api.SystemManage.DictDetail[] }>({
    url: `/dict/${dictId}`,
    method: 'get'
  });

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
  });

/** 查询所有字典映射 */
export const allDictMapping = () =>
  request<Api.SystemManage.Dict[]>({
    url: '/dict/all',
    method: 'get'
  });

/// ///////////////////////////////////////// dict end ////////////////////////////////
/// ///////////////////////////////////////// dept start ////////////////////////////////
export const fetchDept = () =>
  request<Api.SystemManage.DeptList>({
    url: '/dept',
    method: 'get',
    params: {
      current: 1,
      size: -1
    }
  });

/**
 * 获取部门详情
 *
 * @param deptId 部门id
 */
export const fetchDeptDetail = (deptId: string) =>
  request<Api.SystemManage.Dept>({
    url: `/dept/${deptId}`,
    method: 'get'
  });

/**
 * 创建部门
 *
 * @param dept 部门
 */
export const createDept = (dept: Partial<Api.SystemManage.Dept>) =>
  request<boolean>({
    url: '/dept',
    method: 'post',
    data: dept
  });

/**
 * 更新部门
 *
 * @param deptId 部门id
 * @param dept 部门信息
 */
export const updateDept = (deptId: string, dept: Partial<Api.SystemManage.Dept>) =>
  request<boolean>({
    url: `/dept/${deptId}`,
    method: 'put',
    data: dept
  });

/**
 * 批量删除部门
 *
 * @param deptIds 部门id列表
 */
export const batchDeleteDept = (...deptIds: string[]) =>
  request<boolean>({
    url: '/dept',
    method: 'delete',
    data: [...deptIds]
  });

/**
 * 分页查询用户列表
 *
 * @param params
 * @returns
 */
export const fetchGetUserList = (params: Api.SystemManage.UserSearchParams) =>
  request<Api.SystemManage.UserList>({
    url: '/user',
    method: 'get',
    params
  });

/**
 * @param userId 用户id
 * @returns
 */
export const getUserDetail = (userId: string) =>
  request<Api.SystemManage.User>({
    url: `/user/${userId}`,
    method: 'get'
  });

/**
 * 批量删除用户列表
 *
 * @param userIds 用户id列表
 * @returns
 */
export const batchDeleteUser = (...userIds: string[]) =>
  request<boolean>({
    url: '/user',
    method: 'delete',
    data: [...userIds]
  });

/**
 * 更新用户信息
 *
 * @param userId 用户id
 * @param dto 用户dto
 * @returns
 */
export const updateUser = (userId: string, dto: Partial<Api.SystemManage.User>) =>
  request<boolean>({
    url: `/user/${userId}`,
    method: 'put',
    data: dto
  });

/**
 * 创建用户
 *
 * @param dto 用户dto
 * @returns true - 成功 <br> false - 失败
 */
export const createUser = (dto: Partial<Api.SystemManage.User>) =>
  request<boolean>({
    url: '/user',
    method: 'post',
    data: dto
  });
