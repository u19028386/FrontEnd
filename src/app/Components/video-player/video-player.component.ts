import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit{
  videoUrl: string | undefined;


  constructor(
    private route: ActivatedRoute,
    private helpService: HelpService,
    private ngToastService: NgToastService // Inject NgToastService
  ) {}


  ngOnInit(): void {
    const helpId = this.route.snapshot.paramMap.get('helpId');
    if (helpId) {
      this.helpService.StreamVideo(+helpId).subscribe(
        videoBlob => {
          const blobUrl = URL.createObjectURL(videoBlob);
          this.videoUrl = blobUrl;
        },
        error => {
          console.error('Error loading video:', error);
          this.ngToastService.error({
            detail: 'Failed to load video. Please try again.',
            summary: 'Video Loading Error',
            duration: 5000
          });
        }
      );
    }
  }


  public getVideoMimeType(url: string | undefined): string {
    if (!url) {
      return 'video/mp4'; // Default MIME type
    }


    const extension = this.getFileExtension(url);
    return this.getMimeTypeFromExtension(extension);
  }


  private getFileExtension(fileName: string): string {
    return fileName.substr(fileName.lastIndexOf('.')).toLowerCase();
  }


  private getMimeTypeFromExtension(extension: string): string {
    switch (extension) {
      case '.mp4':
        return 'video/mp4';
      case '.avi':
        return 'video/x-msvideo';
      case '.mkv':
        return 'video/webm'; // MKV can be treated as WebM
      default:
        return 'video/mp4'; // Default to mp4
    }
  }


}
