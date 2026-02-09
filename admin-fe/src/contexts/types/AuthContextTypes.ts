export type AuthResponseType = {
  success: boolean,
  message: string,
  data: {
    accessToken: string,
    roles: string[],
    username: string,
  }
}

export type AuthContextType = {
  authResponse:  AuthResponseType | null,
  login: (email: string, password: string) => Promise<boolean>,
  refreshToken: () => Promise<AuthResponseType | null>,
  logout: () => Promise<void>
  loading: boolean;
}
