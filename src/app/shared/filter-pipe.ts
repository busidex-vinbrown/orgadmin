import {Pipe} from '@angular/core';

// # Filter Array of Objects
@Pipe({ name: 'filter' })
export class FilterPipe {
    transform(value, args) {
        if (!args[0]) {
            return value;
        } else if (value) {
            return value.filter(item => {
                for (let key in item) {
                    //if ((typeof item[key] === 'string' || item[key] instanceof String) &&
                    if(key === 'Name' &&
                        (item[key].toLowerCase().indexOf(args.toLowerCase()) !== -1)) {
                        return true;
                    }
                }
            });
        }
    }
}
