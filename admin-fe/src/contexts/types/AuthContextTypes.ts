export type Role = "ADMIN" | "SUPER_ADMIN";

export type AuthResponseType = {
  success: boolean,
  message: string,
  data: {
    accessToken: string,
    role: Role,
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
