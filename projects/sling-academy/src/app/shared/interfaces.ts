export interface SlingStudentResponse {
  success: boolean;
  time: string;
  message: string;
  total_users: number;
  offset: number; // This specifies the number of records to skip before any records are retrieved. The default is 0.
  limit: number; // The number of users you want to return on a page. The default is 10
  users: SlingStudent[];
}
export interface SlingStudent {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude: number;
  latitude: number;
  job: string;
  profile_picture: string;
}
