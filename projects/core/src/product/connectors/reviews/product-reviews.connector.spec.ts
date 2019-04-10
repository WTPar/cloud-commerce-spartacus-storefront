import { TestBed } from '@angular/core/testing';

import { ProductReviewsConnector } from './product-reviews.connector';
import { ProductReviewsAdapter } from './product-reviews.adapter';
import { of } from 'rxjs';
import createSpy = jasmine.createSpy;

class MockProductReviewsAdapter implements ProductReviewsAdapter {
  loadList = createSpy('ProductReviewsAdapter.loadList').and.callFake(code =>
    of('product' + code)
  );
  post = createSpy('ProductReviewsAdapter.post').and.returnValue(of(''));
}

describe('ProductReviewsConnector', () => {
  let service: ProductReviewsConnector;
  let adapter: ProductReviewsAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ProductReviewsAdapter, useClass: MockProductReviewsAdapter },
      ],
    });

    service = TestBed.get(ProductReviewsConnector);
    adapter = TestBed.get(ProductReviewsAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getList', () => {
    it('should call adapter', () => {
      let result;
      service.getList('333').subscribe(res => (result = res));
      expect(result).toBe('product333');
      expect(adapter.loadList).toHaveBeenCalledWith('333', undefined);
    });
  });

  describe('add', () => {
    it('should call adapter', () => {
      service.add('333', 'review').subscribe();
      expect(adapter.post).toHaveBeenCalledWith('333', 'review');
    });
  });
});