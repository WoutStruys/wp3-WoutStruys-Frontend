import { Routes } from './routeTypes.d'
export default [
  {
    path: '/',
    component: () => import('../layouts/Main.vue'),
    children: [
      {
        component: () => import('../pages/Index.vue'),
        name: Routes.INDEX,
        path: '',
      },
      {
        component: () => import('../pages/Tasks.vue'),
        name: Routes.TASKS,
        path: '/tasks',
      },
      {
        component: () => import('../pages/Users.vue'),
        name: Routes.USERS,
        path: '/users',
      },
      {
        component: () => import('../pages/LogOut.vue'),
        name: Routes.LOGOUT,
        path: '/logout',
      },
      {
        component: () => import('../pages/Login.vue'),
        name: Routes.LOGIN,
        path: '/login',
      },
    ],
  },
]
