import { Permissions } from "../enums/role.enum.js";

export const RolePermissions = {
  OWNER: [
    Permissions.CREATE_WORKSPACE,
    Permissions.DELETE_WORKSPACE,
    Permissions.EDIT_WORKSPACE,
    Permissions.CHANGE_WORKSPACE_SETTINGS,

    Permissions.ADD_MEMBER,
    Permissions.CHANGE_MEMBER_ROLE,
    Permissions.REMOVE_MEMBER,

    Permissions.CREATE_PROJECT,
    Permissions.EDIT_PROJECT,
    Permissions.DELETE_PROJECT,

    Permissions.CREATE_TASK,
    Permissions.EDIT_TASK,
    Permissions.DELETE_TASK,
    Permissions.CHANGE_TASK_STATUS,
    Permissions.SET_TASK_PRIORITY,
    Permissions.EDIT_TASK_PRIORITY,
    Permissions.ASSIGN_TASK,
    Permissions.COMMENT_ON_TASK,

    Permissions.VIEW_ONLY,
  ],

  ADMIN: [
    Permissions.ADD_MEMBER,
    Permissions.CHANGE_MEMBER_ROLE,
    Permissions.REMOVE_MEMBER,

    Permissions.CREATE_PROJECT,
    Permissions.EDIT_PROJECT,
    Permissions.DELETE_PROJECT,

    Permissions.CREATE_TASK,
    Permissions.EDIT_TASK,
    Permissions.DELETE_TASK,
    Permissions.CHANGE_TASK_STATUS,
    Permissions.SET_TASK_PRIORITY,
    Permissions.EDIT_TASK_PRIORITY,
    Permissions.ASSIGN_TASK,
    Permissions.COMMENT_ON_TASK,

    Permissions.VIEW_ONLY,
  ],

  MEMBER: [
    Permissions.CREATE_TASK,
    Permissions.EDIT_TASK,
    Permissions.DELETE_TASK,
    Permissions.CHANGE_TASK_STATUS,
    Permissions.ASSIGN_TASK,
    Permissions.COMMENT_ON_TASK,

    Permissions.VIEW_ONLY,
  ],

  VIEWER: [Permissions.VIEW_ONLY],
};
