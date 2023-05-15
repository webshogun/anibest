import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import styles from '@/styles/anime.module.css';

export async function getServerSideProps (contex) {
  const { id } = contex.query;
  const { data: anime } = await supabase.from('Anime').select('*').eq('id', parseInt(id)).single();
  const { data: characters } = await supabase.from('Characters').select('*').eq('animeId', parseInt(id));


  return {
    props: {
      anime,
      characters
    }
  }
}

const AnimePage = ({ anime, characters }) => {
  const router = useRouter();
  const { menu } = router.query;

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
              <img className={styles.poster} src={anime.poster} alt={anime.title} />
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