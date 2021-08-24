import { AlertTypes } from "../enums/alert-types.enum";

export interface IAlert {
  type: AlertTypes;
  message: string;
}
