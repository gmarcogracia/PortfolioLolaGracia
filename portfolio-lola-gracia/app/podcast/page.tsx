'use client';

import {
  Card,
  Image as MantineImage,
  Text,
  Group,
  SimpleGrid,
  CardSection,
  Loader,
  Center,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import './styles/styles.css';
import Image from 'next/image';
import IconoSpotify from '../resources/img/IconoSpotify32.png';

type CardData = {
  bigImage: string;
  mediumImage: string;
  smallImage: string;
  title: string;
  description: string;
  link: string;
};
type Episodio = {

  audio_preview_url: string,
  description :string
  duration_ms :number //No se usa pero para que tengan los mismos parametros que en la llamada
  explicit:boolean,
  external_urls:any
  href:string,
  html_description:string,
   id:string,
  images :Array<any>,
  is_externally_hosted:boolean,
  is_playable:boolean,
  language:string,
  languages:Array<string>,
  name:string
  release_date:string,
  release_date_precision:string,
  type:string,
  uri:string
}

export default function Gallery() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}podcasts/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const podcastContent = await response.json();
        const episodes = podcastContent.arrayEpisodios;
        
        const newCards: CardData[] = episodes
          .filter((ep:Episodio) => ep && ep.images && ep.images.length >= 3)
          .map((episode: Episodio) => ({
            bigImage: episode.images[0].url,
            mediumImage: episode.images[1].url,
            smallImage: episode.images[2].url,
            title: episode.name ?? 'Sin título',
            description:
              episode.description?.length > 250
                ? episode.description.substring(0, 250) + '...'
                : episode.description ?? 'Sin descripción',
            link: episode.external_urls?.spotify ?? '#',
          }));

        setCards(newCards);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  if (loading) {
    return (
      <Center style={{ height: '100vh', background: 'linear-gradient(to right,rgb(227, 180, 23), #000000)' }}>
        <Loader size="xl" color="green" />
      </Center>
    );
  }

  return (
    <div
      style={{
        background: 'linear-gradient(to right,rgb(249, 211, 89),rgba(223, 174, 13, 0.94))',
        minHeight: '100vh',
        padding: '2rem',
      }}
    >
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {cards.map((card, i) => (
          <Card
            key={i}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            maw="390px"
            style={{ backgroundColor: '#000', color: 'white' }}
          >
            <CardSection style={{ height: '65%' }}>
              <MantineImage
                className="podcastThumbnail"
                src={card.bigImage}
                height={'90%'}
                width={'100%'}
                alt={card.title}
                fallbackSrc=""
              />
            </CardSection>

            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500} c="white">
                {card.title}
              </Text>
            </Group>

            <Text size="sm" c="gray">
              {card.description}
            </Text>

            <CardSection
              style={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '15px',
              }}
            >
              <a
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  border: '1px solid #1DB954',
                  backgroundColor: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={IconoSpotify}
                  alt="Spotify"
                  width={35}
                  height={35}
                  style={{ objectFit: 'contain' }}
                />
              </a>
            </CardSection>
          </Card>
        ))}
      </SimpleGrid>
    </div>
  );
}
