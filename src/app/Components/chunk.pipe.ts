import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'chunk'
})
export class ChunkPipe implements PipeTransform {
  transform(array: any[], chunkSize: number): any[] {
    if (!array) return [];
   
    const calendarDays: any[][] = [];
    let weekDays: any[] = [];
 
    array.forEach((day: any, index: number) => {
      weekDays.push(day);


      if ((index + 1) % chunkSize === 0) {
        calendarDays.push(weekDays);
        weekDays = [];
      }
    });
   
    if (weekDays.length > 0) {
      calendarDays.push(weekDays);
    }
   
    return calendarDays;
  }
}
