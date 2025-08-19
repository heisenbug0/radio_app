interface FilterPropertyProps {
  propCategory: string;
  propType?: string;
  propLocation?: string;
  minPrice: string;
  maxPrice: string;
  posted: string;
}

interface ProfileProps {
  profileImage: File | null;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  aboutMe: string;
  facebook: string;
  instagram: string;
  pinterest: string;
  twitter: string;
  latitude: string;
  longitude: string;
  notification: string;
  firebase_id: string;
  fcm_id: string;
}

interface LoginProps {
  type: string;
  firebase_id: string;
}

interface FirebaseAccessProps {
  email: string;
  password: string;
}

interface RegisterProps {
  firebase_id: string;
  type: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  profile: File | null;
}

interface RegFormProps {
  name: string;
  email: string;
  mobile: string;
  address?: string;
  password: string;
  latitude: string;
  longitude: string;
}

interface RegFormSubmitProps {
  firebase_id: string;
  type: string;
  email: string;
  name: string;
  mobile: string;
  address: string;
  longitude: string;
  latitude: string;
}
interface UserProps {
  id: number;
  name: string;
  firebase_id: string;
  email: string;
  mobile: string;
  profile: string;
  address: string;
  fcm_id: string;
  logintype: string;
  isActive: number;
  notification: number;
  subscription: number;
  created_at: Date;
  updated_at: Date;
  about_me: string;
  facebook_id: string;
  twiiter_id: string;
  instagram_id: string;
  pintrest_id: string;
  latitude: string;
  longitude: string;
  customertotalpost: number;
}

interface GlobalContent {
  loadingStatus: boolean;
  setLoadingStatus: (status: boolean) => void;
}
interface SearchContextProps {
  queries: SearchProps;
  setQueries: (queries: SearchProps) => void;
}

interface OutdoorFacilitiesProps {
  id: number;
  name: string;
  image: string;
  created_at: Date;
  updated_at: Date;
}

interface GalleryProps {
  id: number;
  image: string;
  image_url: string;
}
interface AssignedFacProps {
  id: number;
  property_id: number;
  facility_id: number;
  distance: number;
  created_at: Date;
  updated_at: Date;
  name: string;
  image: string;
}
interface ParametersProps {
  id: number;
  name: string;
  type_of_parameter: string;
  type_values: string;
  image: string;
  value?: string;
}

interface CategoryProps {
  id: number;
  category: string;
  image: string;
}
interface PropertyProps {
  customer_name: string;
  email: string;
  mobile: string;
  profile: string;
  id: number;
  title: string;
  slug: string;
  price: number;
  category: CategoryProps;
  description: string;
  address: string;
  client_address: string;
  propery_type: string;
  title_image: string;
  title_image_hash: string;
  threeD_image: string;
  post_created: string;
  gallery: GalleryProps[];
  total_view: number;
  status: number;
  state: string;
  city: string;
  country: string;
  latitude: any;
  longitude: any;
  added_by: number;
  video_link: string;
  assign_facilities: AssignedFacProps[];
  inquiry: boolean;
  promoted: boolean;
  is_favourite: number;
  is_interested: number;
  favourite_users: any[];
  interested_users: any[];
  total_interested_users: number;
  total_favourite_users: number;
  advertisement: any[];
  parameters: ParametersProps[];
}

interface AllCategoriesProps {
  id: number;
  category: string;
  image: string;
  icon: string;
  parameter_types: {
    parameters: ParametersProps[];
  };
  properties_count: number;
}

interface CityProps {
  City: string;
  Count: number;
  image: string;
}

interface ArticleProps {
  id: number;
  image: string;
  title: string;
  description: string;
  category_id: string;
  created_at: Date;
  category: {
    id: number;
    category: string;
  };
}

interface PackageDetailsProps {
  id: number;
  name: string;
  duration: number;
  price: number;
  status: number;
  property_limit: number;
  advertisement_limit: number;
  created_at: Date;
  start_date: Date;
  end_date: Date;
  updated_at: Date;
  is_active: number;
}

interface CreateAdsProps {
  type: string;
  property_id: number;
  package_id: number;
}

interface SearchProps {
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  priceRange: string;
  searchInput: string;
  postedSince: string;
  propType: string;
  city: string;
  state: string;
  country: string;
}

interface NotificationProps {
  id: number;
  title: string;
  message: string;
  image: string;
  type: number;
  send_type: number;
  customers_id: string;
  propertys_id: number;
  created_at: Date;
  created: string;
}

interface TransactionProps {
  id: number;
  transaction_id: string;
  amount: number;
  payment_gateway: string;
  package_id: number;
  customer_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface CustomerProps {
  id: number;
  name: string;
  firebase_id: string;
  email: string;
  mobile: string;
  username: string;
  profile: string;
  address: string;
  fcm_id: string;
  logintype: string;
  isActive: number;
  notification: number;
  subscription: number;
  created_at: Date;
  updated_at: Date;
  about_me: string;
  facebook_id: string;
  twiiter_id: string;
  instagram_id: string;
  pintrest_id: string;
  latitude: string;
  longitude: string;
  customertotalpost: number;
}
interface RealtorsProps {
  agent: number;
  Count: number;
  customer: CustomerProps[];
}

interface ReelProps {
  id?: number;
  slug?: string;
  views?: number;
  title: string;
  property_id: string;
  description: string;
  video_link: string;
  public_id: string;
  user_id: number;
  is_admin: boolean;
}

interface UploadResult {
  id: string;
  batchId: string;
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: Date;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  asset_folder: string;
  display_name: string;
  original_filename: string;
  path: string;
  thumbnail_url: string;
}

interface ListReelsProps {
  id: number;
  title: string;
  description: string;
  views: number;
  video_link: string;
  property_id: number;
  user: {
    id: number;
    image: string;
    name: string;
  };
}
