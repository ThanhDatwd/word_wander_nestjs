export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export enum Permission {
  CREATE_USER = 'create_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  VIEW_USER = 'view_user',
  ALL = 'all',
}
export enum LOGIN_MODE {
  EMAIL = 'email',
  PHONE_NUMBER = 'phone_number',
  USERNAME = 'username',
}

export const ERR_CODE = {
  USER_NOT_FOUND: 'USER_NOT_FOUND'.toLowerCase(),
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'.toLowerCase(),
  INVALID_LOGIN_MODE: 'INVALID_LOGIN_MODE'.toLowerCase(),
  UNAUTHORIZED: 'UNAUTHORIZED'.toLowerCase(),
};

export enum HEADER_KEY {
  CAPTCHA_TOKEN = 'X-Captcha-Token',
  LOG_ID = 'X-Trace-Id',
}

export const APP_ACTION = {
  HANDLE_EXCEPTION: 'HANDLE_EXCEPTION'.toLowerCase(),
};
export const INJECTION_TOKEN = {
  REDIS_PUBLISHER: Symbol.for('REDIS_PUBLISHER'),
  AUDIT_SERVICE: Symbol.for('AUDIT_SERVICE'),
  HTTP_SERVICE: Symbol.for('HTTP_SERVICE'),
  REDIS_SERVICE: Symbol.for('REDIS_SERVICE'),
  DELAYED_TASK_REGISTRY: Symbol.for('DELAYED_TASK_REGISTRY'),
};
