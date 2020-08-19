import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'weekday' })

export class WeekdayPipe implements PipeTransform {
    transform(value): string {
        let result: string = "";
        switch (value.toLowerCase()) {
            case 'monday':
                result = '星期一'
                break;
            case 'tuesday':
                result = '星期二'
                break;
            case 'wednesday':
                result = '星期三'
                break;
            case 'thursday':
                result = '星期四'
                break;
            case 'friday':
                result = '星期五'
                break;
            case 'saturday':
                result = '星期六'
                break;
            case 'sunday':
                result = '星期日'
                break;
            default:
                result = value
                break;
        }
        return result;
    }
}