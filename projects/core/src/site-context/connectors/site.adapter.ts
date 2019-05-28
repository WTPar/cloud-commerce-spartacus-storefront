import { Observable } from 'rxjs';
import { Currency, Language } from '../../model/misc.model';
import { Country, CountryType, Region } from '../../model/address.model';

export abstract class SiteAdapter {
  /**
   * Abstract method used to load languages.
   */
  abstract loadLanguages(): Observable<Language[]>;

  /**
   * Abstract method used to load currencies.
   */
  abstract loadCurrencies(): Observable<Currency[]>;

  abstract loadCountries(type?: CountryType): Observable<Country[]>;

  abstract loadRegions(countryIsoCode: string): Observable<Region[]>;
}
