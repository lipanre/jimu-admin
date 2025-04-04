import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { defineStore } from 'pinia';
import { useLoading } from '@sa/hooks';
import { SetupStoreId } from '@/enum';
import { useRouterPush } from '@/hooks/common/router';
import { fetchGetUserInfo, fetchLogin } from '@/service/api';
import { localStg } from '@/utils/storage';
import { $t } from '@/locales';
import { useRouteStore } from '../route';
import { useTabStore } from '../tab';
import { clearAuthStorage, getToken } from './shared';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const route = useRoute();
  const routeStore = useRouteStore();
  const tabStore = useTabStore();
  const { toLogin, redirectFromLogin } = useRouterPush(false);
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  const token = ref(getToken());

  const userInfo: Api.Auth.UserInfo = reactive({
    id: '',
    userName: '',
    roles: [],
    buttons: [],
    admin: null,
    superAdmin: null,
  });

  /** is super role in static route */
  const isAdmin = computed(() => {
    return userInfo.admin;
  });

  /* 判断是否是超级管理员 */
  const isSuperAdmin = computed(() => {
    return userInfo.superAdmin;
  })

  /** Is login */
  const isLogin = computed(() => Boolean(token.value));

  /** Reset auth store */
  async function resetStore() {
    const authStore = useAuthStore();

    clearAuthStorage();

    authStore.$reset();

    if (!route.meta.constant) {
      await toLogin();
    }

    tabStore.cacheTabs();
    routeStore.resetStore();
  }

  /**
   * Login
   *
   * @param userName User name
   * @param password Password
   * @param [redirect=true] Whether to redirect after login. Default is `true`
   */
  async function login(userName: string, password: string, redirect = true) {
    startLoading();

    const { data: loginToken, error } = await fetchLogin(userName, password);

    if (!error) {
      const pass = await loginByToken(loginToken);

      if (pass) {
        await redirectFromLogin(redirect);

        window.$notification?.success({
          title: $t('page.login.common.loginSuccess'),
          content: $t('page.login.common.welcomeBack', { userName: userInfo.userName }),
          duration: 4500
        });
      }
    } else {
      resetStore();
    }

    endLoading();
  }

  async function logout() {
    startLoading();


    endLoading();
  }

  async function loginByToken(loginToken: Api.Auth.LoginToken) {
    // 1. stored in the localStorage, the later requests need it in headers
    localStg.set('accessToken', loginToken.accessToken);
    localStg.set('refreshToken', loginToken.refreshToken);
    localStg.set('expireTime', loginToken.expireTime)
    localStg.set('header', loginToken.header)

    // 2. get user info
    const pass = await getUserInfo();

    if (pass) {
      token.value = loginToken.accessToken;

      return true;
    }

    return false;
  }

  async function getUserInfo() {
    const { data: info, error } = await fetchGetUserInfo();

    if (!error) {
      // update store
      Object.assign(userInfo, info);
      return true;
    }
    return false;
  }

  async function initUserInfo() {
    const hasToken = getToken();

    if (hasToken) {
      const pass = await getUserInfo();

      if (!pass) {
        resetStore();
      }
    }
  }

  /**
   * 判断是否是普通用户
   * @returns 是否是普通用户
   */
  function isOrdinaryUser() {
    return !isAdmin.value && !isSuperAdmin.value
  }

  /**
   * 判断指定角色编码是否是管理员
   * 
   * @param roleCode 角色编码
   * @returns true - 是管理员角色 <br> false - 不是管理员角色
   */
  function isAdminRole(roleCode: string) {
    const { VITE_ADMIN_ROLE } = import.meta.env;
    return VITE_ADMIN_ROLE === roleCode
  }

  /**
   * 判断指定角色编码是否是超级管理员
   * 
   * @param roleCode 角色编码
   * @returns true - 是超级管理员角色 <br> false - 不是超级管理员角色
   */
  function isSuperAdminRole(roleCode: string) {
    const { VITE_SUPER_ADMIN_ROLE } = import.meta.env;
    return VITE_SUPER_ADMIN_ROLE === roleCode
  }

  return {
    token,
    userInfo,
    isAdmin,
    isSuperAdmin,
    isLogin,
    loginLoading,
    resetStore,
    login,
    initUserInfo,
    isOrdinaryUser,
    isAdminRole,
    isSuperAdminRole,
  };
});
