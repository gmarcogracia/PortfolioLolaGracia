import { Controller, Get } from '@nestjs/common';
import { PodcastsService } from './podcasts.service';

@Controller('podcasts')
export class PodcastsController {

 constructor(private podcastService: PodcastsService){

    }

@Get('/')
async getPodcasts(){
return this.podcastService.fetchPodcasts()
}

}