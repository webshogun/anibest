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

  const [anime, setAnime] = useState([]);
  const [characters, setCharacters] = useState([]);

  const [open, setOpen] = useState(false);

  const [listButtonLabel, setListButtonLabel] = useState('Add to list');
  const [statusCount, setStatusCount] = useState(0);
  const [ratingCount, setRatingCount] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(null);

  const handleMouseEnter = (rating) => {
    setHoveredRating(rating);
  };

  const handleMouseLeave = () => {
    setHoveredRating(null);
  };

  const isFilled = (rating) => {
    return rating <= hoveredRating;
  };

  const activeMenuItem = (menuItem) => {
    return menu === menuItem ? styles.active : '';
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const { data: anime } = await supabase
          .from('anime')
          .select('*')
          .eq('id', parseInt(id))
          .single();
        
        const { data: characters } = await supabase
          .from('characters')
          .select('*')
          .eq('anime_id', parseInt(id));

        setAnime(anime);
        setCharacters(characters);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const checkExistingRecord = async () => {
      if (user && anime.id) {
        const { data: existingRecord } = await supabase.from('favorites').select('*').eq('anime_id', anime.id).eq('user_id', user.id).single();

        if (existingRecord) {
          setListButtonLabel(existingRecord.status);
        }
      }
    };

    checkExistingRecord();
  }, [user, anime.id]);

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
    const { data: existingRecord } = await supabase.from('favorites').select('*').eq('anime_id', anime.id).eq('user_id', user.id).single();

    if (existingRecord) {
      const { error: deleteError } = await supabase.from('favorites').delete().eq('id', existingRecord.id);

      if (deleteError) {
        console.error('Error deleting anime status:', deleteError);
      } else {
        console.log('Anime status deleted successfully!');
        setListButtonLabel('Add to list');
      }
    }
    setOpen(false);
  };

  useEffect(() => {
    const getDataCounts = async () => {
      const ratingList = ['5', '4', '3', '2', '1'];
      const ratingCounts = {};
  
      for (const rating of ratingList) {
        const { data, error } = await supabase
          .from('rating')
          .select('*')
          .eq('anime_id', anime.id)
          .eq('evaluation', rating);
  
        if (error) {
          console.error(`Error fetching ${rating} count:`, error);
          return;
        }
  
        const count = data.length > 0 ? data.length : 0;
        ratingCounts[rating] = count;
      }
  
      setRatingCount(ratingCounts);
  
      const statusList = ['watched', 'watching', 'planned', 'abandoned'];
      const statusCounts = {};
  
      for (const status of statusList) {
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('anime_id', anime.id)
          .eq('status', status);
  
        if (error) {
          console.error(`Error fetching ${status} count:`, error);
          return;
        }
  
        const count = data.length > 0 ? data.length : 0;
        statusCounts[status] = count;
      }
  
      setStatusCount(statusCounts);
    };
  
    getDataCounts();
  }, [anime.id]);
  
  useEffect(() => {
    const checkExistingRecord = async () => {
      if (user && anime.id) {
        const { data: existingRecord, error: existingError } = await supabase.from('favorites').select('*').eq('anime_id', anime.id).eq('user_id', user.id).single();

        if (existingError) {
          console.error('Error fetching existing record:', existingError);
        }

        if (existingRecord) {
          setListButtonLabel(existingRecord.status);
        }
      }
    };

    checkExistingRecord();
  }, [user, anime.id]);

  const updateUserRating = async (rating) => {
    if (!user || !anime.id || rating === null) {
      return;
    }

    const { data, error } = await supabase
      .from('rating')
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
        .from('rating')
        .update({ evaluation: rating })
        .eq('id', ratingId);

      if (updateError) {
        console.error('Error updating rating:', updateError);
        return;
      }

      console.log('Rating updated successfully:', updatedData);
    } else {
      const { data: createdData, error: createError } = await supabase
        .from('rating')
        .insert([{ anime_id: anime.id, user_id: user.id, evaluation: rating }]);

      if (createError) {
        console.error('Error creating rating:', createError);
        return;
      }

      console.log('Rating created successfully:', createdData);
    }
  };

  const calculatePercentageCounts = (counts) => {
    const totalCount = Object.values(counts).reduce((total, count) => total + count, 0);
  
    const percentageCounts = Object.entries(counts).reduce((percentages, [status, count]) => {
      const percentage = (count / totalCount) * 100;
      const formattedPercentage = isNaN(percentage) ? 0 : percentage.toFixed(0);
      percentages[status] = {
        count,
        percentage: formattedPercentage,
      };
      return percentages;
    }, {});
  
    return percentageCounts;
  };

  const calculateAverageRating = (ratingCounts) => {
    const totalWeightedRating = Object.entries(ratingCounts).reduce((total, [rating, count]) => {
      const weight = parseInt(rating);
      const weightedRating = weight * count;
      return total + weightedRating;
    }, 0);
  
    const totalRatingCount = Object.values(ratingCounts).reduce((total, count) => total + count, 0);
  
    const averageRating = totalRatingCount !== 0 ? totalWeightedRating / totalRatingCount : 0;
    return averageRating.toFixed(1);
  };  

  const percentageCounts = calculatePercentageCounts(statusCount)
  const rating = calculatePercentageCounts(ratingCount);
  const averageRating = calculateAverageRating(ratingCount);

  return (
    <>
      <Head>
        <title>{anime.title}</title>
      </Head>
      <main className="">
        <div className="container">
          <div className={styles.wrapper}>
            <div className={styles.left}>
              <Image className={styles.poster} src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Posters/${anime.poster}`} alt={anime.title} width={250} height={355} />
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
                <button
                  className={`${styles.star} ${isFilled(1) ? styles.filled : ''}`}
                  onMouseEnter={() => handleMouseEnter(1)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => updateUserRating(1)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </button>
                <button
                  className={`${styles.star} ${isFilled(2) ? styles.filled : ''}`}
                  onMouseEnter={() => handleMouseEnter(2)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => updateUserRating(2)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </button>
                <button
                  className={`${styles.star} ${isFilled(3) ? styles.filled : ''}`}
                  onMouseEnter={() => handleMouseEnter(3)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => updateUserRating(3)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </button>
                <button
                  className={`${styles.star} ${isFilled(4) ? styles.filled : ''}`}
                  onMouseEnter={() => handleMouseEnter(4)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => updateUserRating(4)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </button>
                <button
                  className={`${styles.star} ${isFilled(5) ? styles.filled : ''}`}
                  onMouseEnter={() => handleMouseEnter(5)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => updateUserRating(5)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </button>
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
                  Studio: <span className={styles.link}>{anime.studio}</span>
                </li>
              </ul>
            </div>
            <div className={styles.right}>
              <div className={styles.header}>
                <h1 className={styles.title}>{anime.title}</h1>
                <span>{averageRating}</span>
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
                        {Object.entries(percentageCounts).map(([status, { count, percentage }]) => (
                          <div key={status} className={styles.row}>
                          <div className={styles.text}>
                            <span>{status}</span>
                          </div>
                          <div className={styles.bar}>
                            <div className={styles.result} style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span className={styles.percentage}>{percentage}%</span>
                          <span className={styles.count}>{count}</span>
                        </div>
                        ))}
                      </div>
                      <div className={styles.rating}>
                        {Object.entries(rating).map(([status, { count, percentage }]) => (
                          <div key={status} className={styles.row}>
                          <div className={styles.text}>
                            <span>{status}</span>
                          </div>
                          <div className={styles.bar}>
                            <div className={styles.result} style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span className={styles.percentage}>{percentage}%</span>
                          <span className={styles.count}>{count}</span>
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
};

export default AnimePage;
