import { Category } from './category.model';

export interface ProductImage {
  productImageId?: number;
  url: string;
  altText?: string | null;
  displayOrder?: number;
  isPrimary?: boolean;
}

export interface Tag {
  tagId: number;
  name: string;
  slug: string;
}

export interface Product {
  productId: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  status?: 'active' | 'archived';
  images: ProductImage[];
  tags: Tag[];
  category: Category;
  categoryId?: number;
  uselessnessLevel: number;
  regretRisk: number;
  questionableUtility: number;
  impressProbability: number;
  isFeatured: boolean;
  related?: Product[];
  createdAt?: string;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  tag?: string;
  featured?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const FALLBACK_IMAGE = 'https://placehold.co/600x450/161625/00e68a?text=RLS';

export function primaryImage(product?: Pick<Product, 'images'> | null): string {
  const images = product?.images ?? [];
  const preferred = images.find((img) => img.isPrimary) ?? images[0];
  return preferred?.url || FALLBACK_IMAGE;
}

export function imageUrls(product?: Pick<Product, 'images'> | null): string[] {
  return (product?.images ?? []).map((img) => img.url);
}
