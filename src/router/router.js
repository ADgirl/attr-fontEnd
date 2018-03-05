import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: () => import('@/views/form/article-publish/preview.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { 
            path: 'home', 
            title: {i18n: 'home'}, 
            name: 'home_index', 
            // component: () => import('@/views/my-components/image-editor/image-editor.vue') 
            component: () => import('@/views/attendance/attr-chart/attr-chart.vue')
        },
        { 
            path: 'ownspace', 
            title: '个人中心', 
            name: 'ownspace_index', 
            component: () => import('@/views/own-space/own-space.vue') 
        },
        { 
            path: 'order/:order_id', 
            title: '订单详情', 
            name: 'order-info', 
            component: () => import('@/views/advanced-router/component/order-info.vue') 
        }, // 用于展示动态路由
        { 
            path: 'shopping', 
            title: '购物详情', 
            name: 'shopping', 
            component: () => import('@/views/advanced-router/component/shopping-info.vue') 
        }, // 用于展示带参路由
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/attendance',
        icon: 'social-buffer',
        name: 'attendance',
        title: '考勤统计',
        component: Main,
        children: [
            {
                path: 'attr-rate',
                icon: 'ios-pie',
                name: 'attr-rate',
                title: '员工出勤率',
                // component: () => import('@/views/my-components/image-editor/image-editor.vue')
                component: () => import('@/views/attendance/attr-chart/attr-chart.vue')
            },
            {
                path: 'attr-table',
                icon: 'ios-grid-view',
                name: 'attr-table',
                title: '员工出勤表',
                // component: () => import('@/views/my-components/draggable-list/draggable-list.vue')
                component: () => import('@/views/attendance/attr-table/attr-table.vue')
            }
        ]
    },
    {
        path: '/manager',
        icon: 'android-checkbox',
        name: 'manager',
        title: '信息管理',
        component: Main,
        children: [
            { 
                path: 'managerPeople', 
                title: '员工管理', 
                name: 'manager-people', 
                icon: 'ios-people', 
                // component: () => import('@/views/tables/dragable-table.vue')
                component: () => import('@/views/manager-users/manager-user.vue') 
            },
            { 
                path: 'ownspace', 
                title: '个人中心', 
                name: 'ownspace_index', 
                icon:'ios-person',
                component: () => import('@/views/own-space/own-space.vue') 
            },
            { 
                path: 'resetPassword', 
                title: '密码修改', 
                name: 'reset-password', 
                icon: 'compose', 
                component: () => import('@/views/journal/my-password/my-password.vue') 
            }
        ]
    },
    {
        path: '/international',
        icon: 'earth',
        title: {i18n: 'international'},
        name: 'international',
        component: Main,
        children: [
            { path: 'index', title: {i18n: 'international'}, name: 'international_index', component: () => import('@/views/international/international.vue') }
        ]
    },
    {
        path: '/test',
        icon: 'ios-infinite',
        name: 'advanced-router',
        title: '测试页面',
        component: Main,
        children: [
            { 
                path: 'mutative-router', 
                title: '动态路由', 
                name: 'mutative-router', 
                icon: 'link', 
                component: () => import('@/views/advanced-router/mutative-router.vue') 
            },
            { 
                path: 'argument-page', 
                title: '带参页面', 
                name: 'argument-page', 
                icon: 'android-send', 
                component: () => import('@/views/advanced-router/argument-page.vue') 
            },
            { 
                path: 'exportableTable', 
                title: '表格导出数据', 
                name: 'exportable-table', 
                icon: 'code-download', 
                component: () => import('@/views/tables/exportable-table.vue') 
            },
            { 
                path: 'table2image', 
                title: '表格转图片', 
                name: 'table-to-image', 
                icon: 'images', 
                component: () => import('@/views/tables/table-to-image.vue') 
            },
            {
                path: 'area-linkage',
                icon: 'ios-more',
                name: 'area-linkage',
                title: '城市级联',
                component: () => import('@/views/my-components/area-linkage/area-linkage.vue')
            },
            {
                path: 'file-upload',
                icon: 'android-upload',
                name: 'file-upload',
                title: '文件上传',
                component: () => import('@/views/my-components/file-upload/file-upload.vue')
            },
            { 
                path: 'index', 
                title: '权限管理', 
                name: 'access_index', 
                component: () => import('@/views/access/access.vue') 
            },
            { 
                path: 'index', 
                title: '权限测试页', 
                name: 'accesstest_index', 
                access: 0, 
                component: () => import('@/views/access/access-test.vue') 
            },
            { 
                path: 'home_old', 
                title: {i18n: 'home'}, 
                name: 'home_old', 
                component: () => import('@/views/home/home.vue') 
            },
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
