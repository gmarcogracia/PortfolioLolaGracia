import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PodcastsService {
  
    constructor (private configService:ConfigService){

    }
    // async fetchPodcasts() {
    //     curl
    //     const podcasts = await fetch({
    //         method:'POST',
    //         U
    //     })
    // }

async  fetchPodcasts(): Promise<any> {
  const accessToken = await this.getSpotifyAccessToken();
  const showId = this.configService.get("PROFILES_ID")

  const response = await fetch(`https://api.spotify.com/v1/shows/${showId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener el podcast: ${response.statusText}`);
  }

  const podcast = await response.json();
  const retornable = {'nombre':podcast.name,
    'descripcionPodcast':podcast.html_description, 
    'urlGeneral':podcast.external_urls.spotify,
    'images':podcast.images, //Es la misma imagen pero a tamaños distintos para diseño responsive
    'total':podcast.episodes.total,
    'arrayEpisodios':podcast.episodes.items


}
  return retornable;
}


async  getSpotifyAccessToken() {
  const clientId = this.configService.get('SPOTIFY_CLIENT_ID');
  const clientSecret = this.configService.getOrThrow('SPOTIFY_CLIENT_SECRET');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  const data = await response.json();

  return data.access_token;
}
}
