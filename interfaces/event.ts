export interface IEvent {
  event_detail:    IEventDetail;
  created_by_user: IUser;
}

export interface IUser {
  id:      number;
  name:    string;
  email:   string;
  avatar:  string;
  address: number;
  events:  null;
}

export interface IEventDetail {
  id:              number;
  title:           string;
  content:         string;
  created_by:      number;
  start_time:      string;
  end_time:        string;
  location:        number;
  detail_location: string;
  created_at:      string;
  updated_at:      string;
  event_images:    IEventImage[];
  users:           IUser[];
}

export interface IEventImage {
  id:         number;
  event_id:   number;
  image_url:  string;
  created_at: string;
  updated_at: string;
}
