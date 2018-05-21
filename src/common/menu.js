import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '系统管理',
    icon: 'dashboard',
    path: 'system',
    children: [
      {
        name: '用户管理',
        path: 'user',
      },
      {
        name: '角色管理',
        path: 'role',
      },
      {
        name: '权限管理',
        path: 'permission',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
      {
        name: '字典管理',
        path: 'dictype'
      }
    ],
  },

];

function formatter(data, parentPath = '/admin/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
