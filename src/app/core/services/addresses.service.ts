import { inject, Injectable } from '@angular/core';
import { Address } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AddressesService {
  private readonly api = inject(ApiService);
  list() {
    return this.api.get<Address[]>('/addresses');
  }
  create(data: Partial<Address>) {
    return this.api.post<Address>('/addresses', data);
  }
  update(id: number, data: Partial<Address>) {
    return this.api.patch<Address>(`/addresses/${id}`, data);
  }
  remove(id: number) {
    return this.api.delete<void>(`/addresses/${id}`);
  }
}
