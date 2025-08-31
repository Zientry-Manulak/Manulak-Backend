export interface ILogin {
  username: string;
  password: string;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IUserPayload {
  id: string;
  username: string;
  role: string;
  company_id: string;
}

export interface IAuthResponse {
  tokens: IAuthTokens;
  user: IUserPayload;
}