import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  CartService,
  PromotionResult,
  SaveForLaterService,
} from '@spartacus/core';
import { Item } from '../cart-item/cart-item.component';

@Component({
  selector: 'cx-cart-item-list',
  templateUrl: './cart-item-list.component.html',
})
export class CartItemListComponent implements OnInit, OnChanges {
  @Input()
  isReadOnly = false;

  @Input()
  hasHeader = true;

  @Input()
  items: Item[] = [];

  @Input()
  potentialProductPromotions: PromotionResult[] = [];

  @Input()
  cartIsLoading = false;

  @Input()
  enableSaveForLater = false;

  form: FormGroup = this.fb.group({});

  constructor(
    protected cartService: CartService,
    protected fb: FormBuilder,
    protected saveForLaterService: SaveForLaterService
  ) {}

  ngOnInit() {
    this.createOrUpdateFormgroupControls();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.items &&
      changes.items.currentValue &&
      changes.items.previousValue &&
      !changes.items.currentValue.every(e =>
        changes.items.previousValue.includes(e)
      )
    ) {
      this.createOrUpdateFormgroupControls();
    }
  }

  removeEntry(item: Item): void {
    this.cartService.removeEntry(item);
    delete this.form.controls[item.product.code];
  }

  updateEntry({
    item,
    updatedQuantity,
  }: {
    item: any;
    updatedQuantity: number;
  }): void {
    this.cartService.updateEntry(item.entryNumber, updatedQuantity);
  }

  saveItemForLater(item: Item): void {
    this.saveForLaterService.addEntry(item.product.code, item.quantity);
    this.removeEntry(item);
  }

  getPotentialProductPromotionsForItem(item: Item): PromotionResult[] {
    const entryPromotions: PromotionResult[] = [];
    if (
      this.potentialProductPromotions &&
      this.potentialProductPromotions.length > 0
    ) {
      for (const promotion of this.potentialProductPromotions) {
        if (
          promotion.description &&
          promotion.consumedEntries &&
          promotion.consumedEntries.length > 0
        ) {
          for (const consumedEntry of promotion.consumedEntries) {
            if (this.isConsumedByEntry(consumedEntry, item)) {
              entryPromotions.push(promotion);
            }
          }
        }
      }
    }
    return entryPromotions;
  }

  private createEntryFormGroup(entry): FormGroup {
    return this.fb.group({
      entryNumber: entry.entryNumber,
      quantity: entry.quantity,
    });
  }

  private isConsumedByEntry(consumedEntry: any, entry: any): boolean {
    const consumendEntryNumber = consumedEntry.orderEntryNumber;
    if (entry.entries && entry.entries.length > 0) {
      for (const subEntry of entry.entries) {
        if (subEntry.entryNumber === consumendEntryNumber) {
          return true;
        }
      }
      return false;
    } else {
      return consumendEntryNumber === entry.entryNumber;
    }
  }
  private createOrUpdateFormgroupControls() {
    this.items.forEach(item => {
      const { code } = item.product;
      if (!this.form.controls[code]) {
        this.form.setControl(code, this.createEntryFormGroup(item));
      } else {
        const entryForm = this.form.controls[code] as FormGroup;
        entryForm.controls.quantity.setValue(item.quantity);
      }
    });
  }
}