import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Product, ProductQuery, Tag } from '../models/product.model';
import { Category } from '../models/category.model';
import { Paginated } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly api = inject(ApiService);
  list(query: ProductQuery = {}) {
    return this.api.get<Paginated<Product>>('/products', { ...query });
  }
  getBySlug(slug: string) {
    return this.api.get<Product>(`/products/${slug}`);
  }
  categories() {
    return this.api.get<Category[]>('/categories');
  }
  tags() {
    return this.api.get<Tag[]>('/tags');
  }
}
