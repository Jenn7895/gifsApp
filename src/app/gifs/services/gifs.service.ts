import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey : string = 'wkeaeMU8bwW17ThzdCrljv5mctpRnMs6';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public  resultados: Gif[] = [];

  get historial(){
    return [...this._historial];
  }

  constructor ( private http: HttpClient ) {
    /* Este servicio de Gifs Service no importa cuántos lugares lo use, porque este constructor sólo se va ejecutar una vez. Porque los servicios trabaja como si fueran un singleton.
    Este es es lugar ideal para cargar el LOCAL Storage, ya que sólo se va a ejecutar una vez.
    */
  
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];

    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    /* GETITEM: Va retornar un string o null. Si el objeto(historial), no existe en el LOCAL Storage, esto va a retornar un null y puede darnos un problema. */

    // if(localStorage.getItem('historial') ){
    //   this._historial = JSON.parse( localStorage.getItem('historial')! );
      /* JSON.PARSE: Es el caso opuesto del STRINGIFY va a tomar un objeto serealizado mediante el STRINGIFY y lo va a retornar a lo que era originalmente. PERO OJO, puede ser sólo dos cosas o un objeto literal, o un arreglo, o strings o primitivos.
      Si grabamos una instancia de una clase, la clase va a regresar a su forma de un objeto*/
    //}

  }

  buscarGifs ( query: string = '' ) {
    
    query = query.trim().toLocaleLowerCase();
    if( !this._historial.includes( query ) ) {
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10);

      localStorage.setItem( 'historial', JSON.stringify( this._historial ) );
      /* LOCAL STORAGE : No podemos grabar objetos, pero si tenemos otro objeto que está en el ambiente global de JavaScript llammado el JSON. 
      EL JSON: tiene un método interesante llamado STRINGIFY: el cual puede tomar cualquier objeto y lo convierte a un string  */
    }

    const params = new HttpParams()
          .set('api_key', this.apiKey)
          .set('limit', '10')
          .set('q', query );


    //SUBSCRIBE : parecido al then. Se va a ejecutar cuando tengamos la resolución del GET
    //ECMAScript v6 poner una propiedad en un objeto cuyo nombre, o sea cuya llave sea igual al valor de una variable que tengamos definida, es REDUNDANTE { params: params } = { params }
    
    this.http.get<SearchGifsResponse>(`${ this.servicioUrl}/search`, { params })
    .subscribe ( ( resp ) => { 
      this.resultados = resp.data;

      localStorage.setItem( 'resultados', JSON.stringify( this.resultados ) );
    });
    /*  La ventaja de utilizar el módulo que ya viene propio en Angular del HTTP nos ofrece muchas cosas interesantes, entre ellas es que estas peticiones http son o retornan OBSERVABLES(propios de rxjs). Al retornar observables yo puedo añadir funcionalidades a la hora de hacer la petición, puedo mapear la respuesta, puedo concatenar otras cosas, puedo hacer una gran cantidad de manipulaciones en esta petición. Esto incluye también poder disparar otra petición simultáneamente, pues son muchas cosas por las cuales es conviente que trabajemos con el módulo HTTP en lugar del simple fetch API que ya viene en JavaScript. */
    

    
    
  }
}
