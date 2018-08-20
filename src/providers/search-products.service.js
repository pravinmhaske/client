import {AutoCompleteService} from 'ionic2-auto-complete';
import { Http } from '@angular/http';
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map'
import {APP_CONFIG} from '../app/config/app.config';
import {IAppConfig} from '../app/config/iapp.config';

@Injectable()
export class SearchProductService implements AutoCompleteService {
  request$: EventEmitter<any>;
  private headers;
  labelAttribute = "name";
  private localhost;
  private endpoints;
  constructor(private http:Http, @Inject(APP_CONFIG) private appConfig: IAppConfig) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.request$ = new EventEmitter();
    this.localhost = this.appConfig.endpoints.localhost;
    this.endpoints = this.appConfig.endpoints;
  }
  getResults(keyword:string) {
    return this.http.get("https://restcountries.eu/rest/v1/name/"+keyword)
      .map(
        result =>
        {
          return result.json()
            .filter(item => item.name.toLowerCase().startsWith(keyword.toLowerCase()) )
        });
  }
}