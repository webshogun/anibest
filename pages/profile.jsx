import Card from '@/components/card';
import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import styles from '@/styles/profile.module.css'

const Profile = () => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [watchedAnime, setWatchedAnime] = useState([]);
  const [plannedAnime, setPlannedAnime] = useState([]);
  const [watchingAnime, setWatchingAnime] = useState([]);
  const [abandonedAnime, setAbandonedAnime] = useState([]);

  async function signOut() {
    await supabase.auth.signOut();
  }

  useEffect(() => {
    const fetchViewedAnime = async () => {
      if (user) {
        const { data: watchingData, error: watchingError } = await supabase.from('Favorites').select('animeId').eq('userId', user.id).eq('status', 'watching');

        if (watchingError) {
          console.error('Error fetching watching anime:', watchingError);
          return;
        }

        if (watchingData.length > 0) {
          const watchingAnimeIds = watchingData.map((row) => row.animeId);
          const { data: watchingAnimeData, error: watchingAnimeError } = await supabase.from('Anime').select('*').in('id', watchingAnimeIds);

          if (watchingAnimeError) {
            console.error('Error fetching watching anime details:', watchingAnimeError);
          } else {
            setWatchingAnime(watchingAnimeData);
          }
        } else {
          setWatchingAnime([]);
        }

        const { data: plannedData, error: plannedError } = await supabase.from('Favorites').select('animeId').eq('userId', user.id).eq('status', 'planned');

        if (plannedError) {
          console.error('Error fetching watching anime:', plannedError);
          return;
        }

        if (plannedData.length > 0) {
          const plannedAnimeIds = plannedData.map((row) => row.animeId);
          const { data: plannedAnimeData, error: plannedAnimeError } = await supabase.from('Anime').select('*').in('id', plannedAnimeIds);

          if (plannedAnimeError) {
            console.error('Error fetching watching anime details:', plannedAnimeError);
          } else {
            setPlannedAnime(plannedAnimeData);
          }
        } else {
          setPlannedAnime([]);
        }

        const { data: watchedData, error: watchedError } = await supabase.from('Favorites').select('animeId').eq('userId', user.id).eq('status', 'watched');

        if (watchedError) {
          console.error('Error fetching watched anime:', watchedError);
          return;
        }

        if (watchedData.length > 0) {
          const watchedAnimeIds = watchedData.map((row) => row.animeId);
          const { data: watchedAnimeData, error: watchedAnimeError } = await supabase.from('Anime').select('*').in('id', watchedAnimeIds);

          if (watchedAnimeError) {
            console.error('Error fetching watched anime details:', watchedAnimeError);
          } else {
            setWatchedAnime(watchedAnimeData);
          }
        } else {
          setWatchedAnime([]);
        }

        const { data: abandonedData, error: abandonedError } = await supabase.from('Favorites').select('animeId').eq('userId', user.id).eq('status', 'abandoned');

        if (abandonedError) {
          console.error('Error fetching abandoned anime:', abandonedError);
          return;
        }

        if (abandonedData.length > 0) {
          const abandonedAnimeIds = abandonedData.map((row) => row.animeId);
          const { data: abandonedAnimeData, error: abandonedAnimeError } = await supabase.from('Anime').select('*').in('id', abandonedAnimeIds);

          if (abandonedAnimeError) {
            console.error('Error fetching abandoned anime details:', abandonedAnimeError);
          } else {
            setAbandonedAnime(abandonedAnimeData);
          }
        } else {
          setAbandonedAnime([]);
        }
      }
    };

    fetchViewedAnime();
  }, [user]);

  const handleRedirect = () => {
    router.push('/login');
  };

  return ( 
    <>
      {user === null ? (
        <main>
          <div className='container'>
            <div className={styles.wrapper}>
              <button onClick={handleRedirect}>Login</button>
            </div>
          </div>
        </main>
      ) : (
        <main>
          <div className='container'>
            <div className={styles.wrapper}>
              <p>Hello, {user.email}!</p>
              <button onClick={() => signOut()}>Logout</button>
              <div>
                <h2 className={styles.heading}>Watching</h2>
                {watchingAnime.length > 0 ? (
                  <div className={styles.list}>
                    {watchingAnime.map((anime) => (
                      <Card key={anime.id} anime={anime} />
                    ))}
                  </div>
                ) : (
                  <p>No anime currently being watched.</p>
                )}
              </div>
              <div>
                <h2 className={styles.heading}>Planned</h2>
                {plannedAnime.length > 0 ? (
                  <div className={styles.list}>
                    {plannedAnime.map((anime) => (
                      <Card key={anime.id} anime={anime} />
                    ))}
                  </div>
                ) : (
                  <p>No anime currently being watched.</p>
                )}
              </div>
              <div>
                <h2 className={styles.heading}>Watched</h2>
                {watchedAnime.length > 0 ? (
                  <div className={styles.list}>
                    {watchedAnime.map((anime) => (
                      <Card key={anime.id} anime={anime} />
                    ))}
                  </div>
                ) : (
                  <p>No watched anime found.</p>
                )}
              </div>
              <div>
                <h2 className={styles.heading}>Abandoned</h2>
                {abandonedAnime.length > 0 ? (
                  <div className={styles.list}>
                    {abandonedAnime.map((anime) => (
                      <Card key={anime.id} anime={anime} />
                    ))}
                  </div>
                ) : (
                  <p>No abandoned anime found.</p>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </>
   );
}
 
export default Profile;
