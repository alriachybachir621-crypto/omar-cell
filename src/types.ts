export type Language = 'en' | 'ar';

export type ProductCondition = 'New' | 'Used';

export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  storageOptions?: string[];
  colors?: string[];
  condition: ProductCondition;
  images: string[];
  inStock: boolean;
  isNew: boolean;
  isSale: boolean;
  description?: string;
  descriptionAr?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameAr?: string;
  subtitle?: string;
  subtitleAr?: string;
  image?: string;
  order: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  icon: string;
  order: number;
}

export interface GalleryItem {
  id: string;
  image: string;
  caption?: string;
  captionAr?: string;
  order: number;
}

export interface ShopInfo {
  heroImages: string[];
  heroTitle?: string;
  heroTitleAr?: string;
  heroSubtitle?: string;
  heroSubtitleAr?: string;
  whatsappNumber: string;
  phoneDisplay: string;
  address: string;
  addressAr?: string;
  mapsEmbedUrl?: string;
  mapsLink?: string;
  hours?: string;
  hoursAr?: string;
  facebookUrl?: string;
  updatedAt: number;
}

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  nameAr?: string;
  brand: string;
  price: number;
  image: string;
  storage?: string;
  color?: string;
  condition: ProductCondition;
  quantity: number;
}
