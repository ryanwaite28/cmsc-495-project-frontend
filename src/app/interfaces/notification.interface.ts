import { PlainObject } from "./plain-object.interface";

export interface INotification {
  id: number;
  event: string;
  target_type: string;
  target_id: number;
  message?: string;
  read: boolean;
  date_created: string;
  from?: PlainObject;
  to?: PlainObject;
}