import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        subItems: [
            {
                id: 3,
                label: 'MENUITEMS.DASHBOARDS.LIST.DEFAULT',
                link: '/',
                parentId: 2
            },
        ]
    },
    {
        id: 8,
        isLayout: true
    },
    {
        id: 9,
        label: 'MENUITEMS.APPS.TEXT',
        isTitle: true
    },
    {
        id: 12,
        label: 'MENUITEMS.EMPLOYEES.TEXT',
        icon: 'bx-file',
        link: '/employees',
    },
    {
        id: 12,
        label: 'MENUITEMS.CUSTOMERS.TEXT',
        icon: 'bx-file',
        link: '/customers',
    },
    {
        id: 12,
        label: 'MENUITEMS.CREATEORDER.TEXT',
        icon: 'bx-file',
        link: '/createorder',
    },
    {
        id: 12,
        label: 'MENUITEMS.ORDERS.TEXT',
        icon: 'bx-file',
        link: '/orders',
    },
    {
        id: 12,
        label: 'MENUITEMS.EXPENDITURE.TEXT',
        icon: 'bx-file',
        link: '/expenditures',
    },
    {
        id: 12,
        label: 'MENUITEMS.REPORTS.TEXT',
        icon: 'bx-file',
        link: '/reports',
    },
    {
        id: 13,
        label: 'MENUITEMS.SETTINGS.TEXT',
        icon: 'bx-store',
        subItems: [
            {
                id: 14,
                label: 'MENUITEMS.SETTINGS.LIST.CLOTHESCATEGORIES',
                link: '/clothescategories',
                parentId: 13
            },
            {
                id: 14,
                label: 'MENUITEMS.SETTINGS.LIST.EXPENDITURECATEGORIES',
                link: '/expenditurecategories',
                parentId: 13
            },
            {
                id: 14,
                label: 'MENUITEMS.SETTINGS.LIST.SERVICESCATEGORIES',
                link: '/servicescategories',
                parentId: 13
            },
            {
                id: 15,
                label: 'MENUITEMS.SETTINGS.LIST.STATUS',
                link: '/status',
                parentId: 13
            }
        ]
    },
    {
        id: 13,
        label: 'MENUITEMS.USERS.TEXT',
        icon: 'bx-store',
        subItems: [
            {
                id: 14,
                label: 'MENUITEMS.USERS.LIST.ADDUSER',
                link: '/users',
                parentId: 13
            },
            {
                id: 15,
                label: 'MENUITEMS.USERS.LIST.USERROLES',
                link: '/userroles',
                parentId: 13
            },
            {
                id: 15,
                label: 'MENUITEMS.USERS.LIST.USERGROUPS',
                link: '/usergroups',
                parentId: 13
            }
        ]
    }
];

