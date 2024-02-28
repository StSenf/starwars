export interface SlingStudentListResponse {
  success: boolean;
  time: string;
  message: string;
  total_users: number;
  offset: number; // This specifies the number of records to skip before any records are retrieved. The default is 0.
  limit: number; // The number of users you want to return on a page. The default is 10
  users: SlingStudent[];
}

export interface SlingStudentDetailResponse {
  success: boolean;
  message: string;
  user: SlingStudent;
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

export interface SlingPostListResponse {
  success: boolean;
  message: string;
  total_blogs: number;
  offset: number; // This specifies the number of records to skip before any records are retrieved. The default is 0.
  limit: number; // The number of users you want to return on a page. The default is 10
  blogs: SlingPost[];
}

export interface SlingPostResponse {
  success: boolean;
  message: string;
  blog: SlingPost;
}

export interface SlingPost {
  id: number;
  title: string;
  description: string;
  photo_url: string;
  category: string;
  content_text: string;
  content_html: string;
  created_at: string;
  updated_at: string;
  user_id: number; // The id of the user who wrote the post.
}
