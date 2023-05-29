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

  const [animeData, setAnimeData] = useState({
    anime: [],
    characters: [],
    average: 0,
  });
  
  const [open, setOpen] = useState(false);
  const [listButtonLabel, setListButtonLabel] = useState('Add to list');
  const [ratings, setRatings] = useState(null);
  const [status, setStatus] = useState([]);
  const [rating, setRating] = useState([]);
  const [hoveredRating, setHoveredRating] = useState(null);

  const activeMenuItem = (menuItem) => {
    return menu === menuItem ? styles.active : '';
  };

  const handleMouseEnter = (rating) => {
    setHoveredRating(rating);
  };

  const handleMouseLeave = () => {
    setHoveredRating(null);
  };

  const isFilled = (rating) => {
    return rating <= (hoveredRating || ratings);
  };
  
  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const [animeResponse, charactersResponse, ratingResponse] = await Promise.all([
          supabase.from('anime').select('*').eq('id', parseInt(id)).single(),
          supabase.from('characters').select('*').eq('anime_id', parseInt(id)),
          supabase.rpc('get_average_rating', { anime_id: id }),
        ]);
  
        const animeData = animeResponse.data;
        const charactersData = charactersResponse.data;
        const ratingData = ratingResponse.data;
  
        if (animeData) {
          setAnimeData({ anime: animeData, characters: charactersData, average: ratingData });
        }
      } catch (error) {
        console.error('Error fetching anime data:', error);
      }
    };
  
    const fetchData = async () => {
      try {
        if (id && user) {
          const favoritesResponse = await supabase
            .from('favorites')
            .select('*')
            .eq('anime_id', parseInt(id))
            .eq('user_id', user.id)
            .single();
  
          if (favoritesResponse.data) {
            const { status, evaluation } = favoritesResponse.data;
            setListButtonLabel(status);
            setRatings(evaluation);
          }
        }
  
        const [statusResponse, ratingResponse] = await Promise.all([
          supabase.rpc('get_anime_status', { anime_id: id }),
          supabase.rpc('get_anime_rating', { anime_id: id }),
        ]);
  
        const { data: status, error: statusError } = statusResponse;
        if (statusError) {
          throw statusError;
        }
        setStatus(status);
  
        const { data: rating, error: ratingError } = ratingResponse;
        if (ratingError) {
          throw ratingError;
        }
        setRating(rating);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchAnimeData();
    fetchData();
  }, [id, user]);
  
  
  const updateAnimeStatus = async (status) => {
    const { data: existingRecord } = await supabase.from('favorites').select('*').eq('anime_id', anime.id).eq('user_id', user.id).single();

    if (existingRecord === null) {
      const { error: insertError } = await supabase.from('favorites').insert([{ user_id: user.id, anime_id: anime.id, status }]);

      if (insertError) {
        console.error('Error creating new record:', insertError);
      } else {
        console.log('New anime record created successfully!');
        setListButtonLabel(status);
      }
    } else {
      const { error: updateError } = await supabase.from('favorites').update({ status }).eq('id', existingRecord.id);

      if (updateError) {
        console.error('Error updating anime status:', updateError);
      } else {
        console.log('Anime status updated successfully!');
        setListButtonLabel(status);
      }
    }
    setOpen(false);
  };

  const deleteAnimeStatus = async () => {
    const { data: existingRecord, error } = await supabase.from('favorites').select('*').eq('anime_id', anime.id).eq('user_id', user.id).single();
  
  if (error) {
    console.error('Error retrieving existing record:', recordError);
  } else {
    if (existingRecord) {
      const { error: deleteFavoritesError } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existingRecord.id);
  
      if (deleteFavoritesError) {
        console.error('Error deleting anime status:', deleteFavoritesError);
      } else {
        console.log('Anime status deleted successfully!');
        setListButtonLabel('Add to list');
      }
    }
  }
  
    setOpen(false);
  };

  const updateUserRating = async (rating) => {
    if (!user || !anime.id || rating === null) {
      return;
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('anime_id', anime.id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error checking existing rating:', error);
      return;
    }

    if (data.length > 0) {
      const ratingId = data[0].id;

      const { data: updatedData, error: updateError } = await supabase
        .from('favorites')
        .update({ evaluation: rating })
        .eq('id', ratingId);

      if (updateError) {
        console.error('Error updating rating:', updateError);
        return;
      }

      console.log('Rating updated successfully:', rating);
    } else {
      const { data: createdData, error: createError } = await supabase
        .from('favorites')
        .insert([{ anime_id: anime.id, user_id: user.id, evaluation: rating }]);

      if (createError) {
        console.error('Error creating rating:', createError);
        return;
      }

      console.log('Rating created successfully:', createdData);
    }
    setRatings(rating)
  };

  const { anime, characters, average } = animeData;
  
  return (
    <>
      <Head>
        <title>{anime.title}</title>
      </Head>
      <main className="">
        <div className="container">
          {animeData.anime && (
            <div className={styles.wrapper}>
              <div className={styles.left}>
                <Image className={styles.poster} src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/anime/${anime.title}`} alt={anime.title} width={250} height={355} priority={true} />
                <button className={styles.toggle} onClick={() => setOpen(!open)}>
                  {listButtonLabel}
                </button>
                {open && (
                  <div className={styles.dropdown}>
                    {listButtonLabel !== 'planned' && (
                      <button className={styles.status} onClick={() => updateAnimeStatus('planned')}>Planned</button>
                    )}
                    {listButtonLabel !== 'watched' && (
                      <button className={styles.status} onClick={() => updateAnimeStatus('watched')}>Watched</button>
                    )}
                    {listButtonLabel !== 'watching' && (
                      <button className={styles.status} onClick={() => updateAnimeStatus('watching')}>Watching</button>
                    )}
                    {listButtonLabel !== 'abandoned' && (
                      <button className={styles.status} onClick={() => updateAnimeStatus('abandoned')}>Abandoned</button>
                    )}
                    {listButtonLabel !== 'Add to list' && (
                      <button className={styles.delete} onClick={deleteAnimeStatus}>Delete</button>
                    )}
                  </div>
                )}
                <div className={styles.stars}>
                  {listButtonLabel !== 'Add to list' && (
                    <>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          className={`${styles.star} ${isFilled(value) ? styles.filled : ''}`}
                          onMouseEnter={() => handleMouseEnter(value)}
                          onMouseLeave={handleMouseLeave}
                          onClick={() => updateUserRating(value)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                            />
                          </svg>
                        </button>
                      ))}
                    </>
                  )}
                </div>
                <ul className={styles.info}>
                  <li className={styles.item}>
                    Type: <Link className={styles.link} href={`/anime?type=${anime.type}`} as={`/anime?type=${anime.type}`}>
                      {anime.type}
                    </Link>
                  </li>
                  <li className={styles.item}>
                    Status: <Link className={styles.link} href={`/anime?status=${anime.status}`} as={`/anime?status=${anime.status}`}>
                      {anime.status}
                    </Link>
                  </li>
                  <li className={styles.item}>
                    Series: <span className={styles.link}>{anime.series}</span>
                  </li>
                  <li className={styles.item}>
                    Year: <span className={styles.link}>{anime.year}</span>
                  </li>
                  <li className={styles.item}>
                    Time: <span className={styles.link}>{anime.time}m</span>
                  </li>
                  <li className={styles.item}>
                    Studio: <Link className={styles.link} href={`/studio/${anime.studio}`} as={`/studio/${anime.studio}`}>{anime.studio}</Link>
                  </li>
                </ul>
              </div>
              <div className={styles.right}>
                <div className={styles.header}>
                  <h1 className={styles.title}>{anime.title}</h1>
                  <span>{average}</span>
                </div>
                <div className={styles.main}>
                  <div className={styles.menu}>
                    <Link className={activeMenuItem('info')} href={`/anime/${anime.id}/?menu=info`} as={`/anime/${anime.id}/?menu=info`}>Information</Link>
                    <Link className={activeMenuItem('episodes')} href={`/anime/${anime.id}/?menu=episodes`} as={`/anime/${anime.id}/?menu=episodes`}>Series</Link>
                    <Link className={activeMenuItem('characters')} href={`/anime/${anime.id}/?menu=characters`} as={`/anime/${anime.id}/?menu=characters`}>Characters</Link>
                    <Link className={activeMenuItem('authors')} href={`/anime/${anime.id}/?menu=authors`} as={`/anime/${anime.id}/?menu=authors`}>Authors</Link>
                  </div>
                  <div className={styles.line}></div>
                  {menu === 'info' && (
                    <>
                      <p className={styles.desc}>{anime.description}</p>
                      <div className={styles.genres}>
                        {anime.genres?.map((genre) => (
                          <Link className={styles.genre} href={`/anime?genre=${genre}`} as={`/anime?genre=${genre}`} key={genre}>
                            {genre}
                          </Link>
                        ))}
                      </div>
                      <div className={styles.ratings}>
                        <div className={styles.rating}>
                          {status.map((item) => (
                            <div key={item.status} className={styles.row}>
                              <div className={styles.text}>
                                <span>{item.status}</span>
                              </div>
                              <div className={styles.bar}>
                                <div className={styles.result} style={{ width: `${item.percentage}%` }}></div>
                              </div>
                              <span className={styles.percentage}>{item.percentage}%</span>
                              <span className={styles.count}>{item.votes}</span>
                            </div>
                          ))}
                        </div>
                        <div className={styles.rating}>
                          {rating.map((item) => (
                            <div key={item.evaluation} className={styles.row}>
                              <div className={styles.text}>
                                <span>{item.evaluation}</span>
                              </div>
                              <div className={styles.bar}>
                                <div className={styles.result} style={{ width: `${item.percentage}%` }}></div>
                              </div>
                              <span className={styles.percentage}>{item.percentage}%</span>
                              <span className={styles.count}>{item.votes}</span>
                            </div>
                          ))}
                        </div> 
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
                                <Image className={styles.poster} src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/characters/${character.poster}`} alt={anime.title} width={250} height={355} priority={true} />
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
          )}
        </div>
      </main>
    </>
  );
};

export default AnimePage;
