import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '@/styles/anime.module.css';
import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';

const AnimePage = () => {
  const router = useRouter();
  const { menu, id } = router.query;
  const user = useUser();
  const supabase = useSupabaseClient();
  const [anime, setAnimes] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [open, setOpen] = useState(false)
  
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const { data: animeData } = await supabase.from('Anime').select('*').eq('id', parseInt(id)).single();
        const { data: charactersData } = await supabase.from('Characters').select('*').eq('animeId', parseInt(id));

        setAnimes(animeData);
        setCharacters(charactersData);
      }
    };

    fetchData();
  }, [id]);

  const toggleDropdown = () => {
    setOpen(!open);
  };

  const updateAnimeStatus = async (status) => {
    const { data: existingRecord, error: existingError } = await supabase.from('Favorites').select('*').eq('animeId', anime.id).eq('userId', user.id).single();
  
    console.log(existingRecord)

    if (existingError) {
      console.error('Error fetching existing record:', existingError);
    }

    if (existingRecord === null) {
      const { error: insertError } = await supabase
        .from('Favorites')
        .insert([{ userId: user.id, animeId: anime.id, status }]);
  
      if (insertError) {
        console.error('Error creating new record:', insertError);
      } else {
        console.log('New anime record created successfully!');
      }
    } else {
      const { error: updateError } = await supabase
        .from('Favorites')
        .update({ status })
        .eq('id', existingRecord.id);
  
      if (updateError) {
        console.error('Error updating anime status:', updateError);
      } else {
        console.log('Anime status updated successfully!');
      }
    }
  
    
  };
  
  const activeMenuItem = (menuItem) => {
    return menu === menuItem ? styles.active : '';
  };
  
  return ( 
    <>
      <Head>
        <title>{anime.title}</title>
      </Head>
      <main className=''>
        <div className='container'>
          <div className={styles.wrapper}>
            <div className={styles.left}>
              <Image className={styles.poster} src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Posters/${anime.poster}`} alt={anime.title} width={250} height={355} />
              <button className={styles.toggle} onClick={toggleDropdown}>Add to list</button>
              {open && (
                <div className={styles.dropdown}>
                  <button className={styles.status} onClick={() => updateAnimeStatus('planned')}>Planned</button>
                  <button className={styles.status} onClick={() => updateAnimeStatus('watched')}>Watched</button>
                  <button className={styles.status} onClick={() => updateAnimeStatus('watching')}>Watching</button>
                  <button className={styles.status} onClick={() => updateAnimeStatus('abandoned')}>Abandoned</button>
                </div>
              )}
              <ul className={styles.info}>
                <li className={styles.item}>Type: <Link className={styles.link} href={`/anime?type=${anime.type}`} as={`/anime?type=${anime.type}`}>{anime.type}</Link></li>
                <li className={styles.item}>Status: <Link className={styles.link} href={`/anime?status=${anime.status}`} as={`/anime?status=${anime.status}`}>{anime.status}</Link></li>
                <li className={styles.item}>Series: <span className={styles.link}>{anime.series}</span></li>
                <li className={styles.item}>Year: <span className={styles.link}>{anime.year}</span></li>
                <li className={styles.item}>Time: <span className={styles.link}>{anime.time}m</span></li>
                <li className={styles.item}>Studio: <span className={styles.link}>{anime.studio}</span></li>
              </ul>
            </div>
            <div className={styles.right}>
              <div className={styles.header}>
                <h1 className={styles.title}>{anime.title}</h1>
              </div>
              <div className={styles.main}>
                <div className={styles.menu}>
                  <Link className={activeMenuItem('info')} href={`/anime/${anime.id}/?menu=info`} as={`/anime/${anime.id}/?menu=info`}>
                    Information
                  </Link>
                  <Link className={activeMenuItem('episodes')} href={`/anime/${anime.id}/?menu=episodes`} as={`/anime/${anime.id}/?menu=episodes`}>
                    Series
                  </Link>
                  <Link className={activeMenuItem('characters')} href={`/anime/${anime.id}/?menu=characters`} as={`/anime/${anime.id}/?menu=characters`}>
                    Characters 
                  </Link>
                  <Link className={activeMenuItem('authors')} href={`/anime/${anime.id}/?menu=authors`} as={`/anime/${anime.id}/?menu=authors`}>
                    Authors
                  </Link>
                </div>
                <div className={styles.line}></div>
                {menu === 'info' && (
                  <>
                    <p className={styles.desc}>{anime.description}</p>
                    <div className={styles.genres}>
                      {anime.genres?.map((genre) => (
                        <Link className={styles.genre} href={`/anime?genre=${genre}`} as={`/anime?genre=${genre}`} key={genre}>{genre}</Link>
                      ))}
                    </div>
                  </>
                )}
                {menu === 'characters' && (
                  <>
                    <h2 className={styles.heading}>Main characters</h2>
                    <div className={styles.inner}>
                      {characters.map((character) => {
                        if (character.type === 'main') {
                          return (
                            <Link href={`/character/[id]`} as={`/character/${character.id}`} key={character.id}>
                              <img className={styles.image} src={character.poster} alt={character.name} />
                              <p className={styles.name}>{character.name}</p>
                            </Link>
                          );
                        }
                      })}
                    </div>
                    <h2 className={styles.heading}>Minor characters</h2>
                    <div className={styles.inner}>
                      {characters.map((character) => {
                        if (character.type === 'Другорядний герой') {
                          return (
                            <Link href={`/character/[id]`} as={`/character/${character.id}`} key={character.id}>
                              <img src={character.poster} alt={character.name} />
                              <p>{character.name}</p>
                            </Link>
                          );
                        }
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
   );
}
 
export default AnimePage;