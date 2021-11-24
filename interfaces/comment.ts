export interface IComments {
  comments: IComment[];
}

export interface IComment {
  id:         number;
  event_id:   number;
  user_id:    number;
  user:       IUser;
  content:  string;
  created_at: string;
  updated_at: string;
}

export interface IUser {
  id:         number;
  name:       string;
  email:      string;
  avatar:     string;
  address:    number;
  created_at: string;
  updated_at: string;
}
