export interface AddCalendarItem {
   
    calendarId : number;
    calendarItemName:string | null;
    calendarItemDescription :string | null;
    location : string | null;
    date :  Date | null;
    startTime : Date  | null;
   endTime : Date  | null;
}
