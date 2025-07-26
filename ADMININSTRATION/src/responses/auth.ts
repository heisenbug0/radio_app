import { IUser } from "@/types";
import { BaseResponse } from "./base";

export interface LoginResponse extends BaseResponse {}

export interface OtpLoginResponse extends BaseResponse {
  data: {
    data: IUser;
    token: string;
  };
}
