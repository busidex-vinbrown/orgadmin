import {Pipe, PipeTransform} from '@angular/core';

// # Filter Array of Objects
@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
    transform(value, args) {
        if (!args[0]) {
            return value;
        } else if (value) {
            return value.filter(item => {
                for (let key in item) {
                    if (typeof item[key] === 'string' || item[key] instanceof String){
                        if ((key.toLowerCase() === 'name' || key.toLowerCase() === 'companyname') &&
                            (item[key].toLowerCase().indexOf(args.toLowerCase()) === 0)) {
                            return true;
                        }
                    }
                }
            });
        }
    }
}
