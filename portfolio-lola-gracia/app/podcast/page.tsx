// components/Gallery.tsx


import {
  Card,
  Image,
  Text,
  Group,
  SimpleGrid,
  CardSection,
} from '@mantine/core';
import  './styles/styles.css';
// import IconoSpotify from '../resources/img/iconoSpotify.svg'
import IconoSpotify from '../resources/img/iconoSpotify.svg';
import Link from 'next/link';


type CardData = {
  bigImage: string;
  mediumImage: string;
  smallImage:string;
  title: string;
  description: string;
  link:string;
};

const cards: CardData [] = [];

export default async function Gallery() {
  const cards: CardData [] = [];
   const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}podcasts/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      //TODO EL MUNDO PUEDE VER LOS PODCASTS  ASI QUE NO SE LE PASA NINGUN TOKEN NI NADA PORQUE ES INNECESARIO
      //EL TOKEN DE SPOTIFY SE OBTIENE Y SE MANDA DESDE EL BACK
   
    });

const podcastContent = await response.json();
const episodes = podcastContent.arrayEpisodios;

var num = 0;
episodes.forEach((episode: {
  external_urls: any; images: any[]; name: string; description: string; 
}) => {
  if(episode){
 cards.push({
     bigImage: episode.images[0].url,
  mediumImage: episode.images[1].url,
  smallImage: episode.images[2].url,
    title:episode.name,
    description:episode.description.length>250 ? episode.description.substring(0,250)+"..." :episode.description,
  link:episode.external_urls.spotify
  
})
  }else{

  }
  console.log(num);

 num++

  
});
console.log(podcastContent)
console.log(episodes.length, cards.length);

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
      {cards.map((card, i) => (
        <Card key={i} shadow="sm" padding="lg" radius="md" withBorder maw="390px">
          <CardSection  style={{height:'65%' }} >
            <Image className='podcastThumbnail' src={card.bigImage}  height={'90%'}  width={'100%'} alt={card.title}  />
          </CardSection>
          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>{card.title}</Text>
          </Group>
          <Text size="sm" c="dimmed">
            {
            card.description
            }
          </Text>
          <CardSection  style={{height:'65%' }} >
            <a href={card.link}>
        <IconoSpotify ></IconoSpotify>
        </a>
    
          </CardSection>
        </Card>
      ))}
    </SimpleGrid>
  );
}
