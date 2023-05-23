import Card from '@/components/card';
import Image from 'next/image';
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

  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState(null)

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

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          return;
        }
        setNickname(userData?.username || '');
        setAvatar(userData?.avatar_url || '');
      }
    };

    fetchUserData();
  }, [user]);

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
            <Image className={styles.poster} src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatar}`} width={175} height={175} loading = 'lazy'  />
              <p>Hello, {nickname || user.email}!</p>
              <button onClick={() => signOut()}>Logout</button>
              {watchingAnime.length < 1 && plannedAnime.length < 1 && watchedAnime.length < 1 && abandonedAnime.length < 1 ? (
                <div>
                  <p>Empty</p>
                </div>
              ) : (
                <div>
                  <div>
                    {watchingAnime.length > 0 && (
                      <>
                        <h2 className={styles.heading}>Watching</h2>
                        <div className={styles.list}>
                          {watchingAnime.map((anime) => (
                            <Card key={anime.id} anime={anime} />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    {plannedAnime.length > 0 && (
                      <>
                        <h2 className={styles.heading}>Planned</h2>
                        <div className={styles.list}>
                          {plannedAnime.map((anime) => (
                            <Card key={anime.id} anime={anime} />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    {watchedAnime.length > 0 && (
                      <>
                        <h2 className={styles.heading}>Watched</h2>
                        <div className={styles.list}>
                          {watchedAnime.map((anime) => (
                            <Card key={anime.id} anime={anime} />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    {abandonedAnime.length > 0 && (
                      <>
                        <h2 className={styles.heading}>Abandoned</h2>
                        <div className={styles.list}>
                          {abandonedAnime.map((anime) => (
                            <Card key={anime.id} anime={anime} />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )} 
            </div>
          </div>
        </main>
      )}
    </>
   );
}
 
export default Profile;
