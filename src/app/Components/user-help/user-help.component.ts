import { Component, OnInit } from '@angular/core';
import { HelpService } from 'src/app/services/help.service';
import { Help } from 'src/app/shared/help';
import { HelpType } from 'src/app/shared/helpType';
import { HelpTypeService } from 'src/app/services/help-type.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, combineLatest, map, of } from 'rxjs';


@Component({
  selector: 'app-user-help',
  templateUrl: './user-help.component.html',
  styleUrls: ['./user-help.component.css']
})
export class UserHelpComponent implements OnInit {
  helps: Help[] = [];
  helpTypes: HelpType[] = [];
  searchQuery: string = '';
  isSearchCriteriaEmpty: boolean = false;
  isNoHelpsFound: boolean = false;
  isTableVisible: boolean = true; // Flag to control table visibility


  constructor(
    private helpService: HelpService,
    private helpTypeService: HelpTypeService,
    private router: Router,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) {}






  ngOnInit(): void {
    // Fetch both helps and help types using combineLatest
    combineLatest([this.getHelps(), this.getHelpTypes()]).subscribe(([helps, helpTypes]) => {
      this.helps = helps.map(help => ({
        ...help,
        helpTypeName: this.getHelpTypeName(help.helpTypeId, helpTypes),
      }));
      this.helpTypes = helpTypes; // Store the help types
    });
  }
 






 playVideo(helpId: number): void {
  console.log('playVideo function called with helpId:', helpId); // Add this line
  this.router.navigate(['/video-player', helpId], { relativeTo: this.route });
}




// Add this method to your component
isVideo(fileName: string | undefined): boolean {
  if (!fileName) {
    return false;
  }


  const videoExtensions = ['.mp4'];
  const extension = fileName.substring(fileName.lastIndexOf('.'));
  return videoExtensions.includes(extension.toLowerCase());
}






  getHelps(): Observable<Help[]> {
    return this.helpService.GetAllHelp();
  }


  getHelpTypes(): Observable<HelpType[]> {
    return this.helpTypeService.GetAllHelpType().pipe(catchError(() => of([])));
  }


  getHelpTypeName(helpTypeId: number, helpTypes: HelpType[]): string {
    const foundType = helpTypes.find(type => type.helpTypeId === helpTypeId);
    return foundType ? foundType.helpTypeName : 'Unknown';
  }


  downloadHelp(help: Help): void {
    // Implement the functionality to download the help here
    this.helpService.DownloadHelp(help.helpId).subscribe((data: any) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = help.fileName || 'helpfile.bin';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }


  searchHelps(): void {
    this.isSearchCriteriaEmpty = this.searchQuery.trim() === '';
    this.isNoHelpsFound = false;
    this.isTableVisible = true; // Reset table visibility flag
 
    if (this.isSearchCriteriaEmpty) {
      // Display a message that the search criteria is empty
      this.getHelpsAndTypes();
    } else {
      // If the search query is not empty, filter helps based on the query
      const lowerCaseQuery = this.searchQuery.trim().toLowerCase();
      const filteredHelps = this.helps.filter(
        help => help.helpName.toLowerCase().includes(lowerCaseQuery) ||
                help.helpDescription.toLowerCase().includes(lowerCaseQuery)
      );
 
      if (filteredHelps.length === 0) {
        // Display a message that no helps are found for the search criteria
        this.isNoHelpsFound = true;
        this.isTableVisible = false;
      } else {
        this.helps = filteredHelps;
        this.isNoHelpsFound = false;
        this.isTableVisible = true;
      }
    }
  }


  private getHelpsAndTypes(): void {
    this.getHelps().subscribe(helps => {
      this.helps = helps.map(help => ({
        ...help,
        helpTypeName: this.getHelpTypeName(help.helpTypeId, this.helpTypes),
      }));
    });
  }
}
