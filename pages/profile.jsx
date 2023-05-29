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

  console.log(watchingAnime)

  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState(null)

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  useEffect(() => {
    const fetchViewedAnime = async () => {
      if (user) {
        try {
          const { data, error } = await supabase.rpc('fetchuseranimestatus', { userid: user.id });
  
          if (error) {
            console.error('Error fetching anime:', error);
          } else {
            const { watched, watching, planned, abandoned } = data[0];
            setWatchedAnime(watched || []);
            setWatchingAnime(watching || []);
            setPlannedAnime(planned || []);
            setAbandonedAnime(abandoned || []);
          }
        } catch (error) {
          console.error('Error fetching anime:', error);
        }
      }
    };
  
    fetchViewedAnime();
  }, [user]);

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
      {user !== null && (
        <main>
          <div className='container'>
            <div className={styles.wrapper}>
            <Image className={styles.poster} src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatar}`} alt={avatar} width={175} height={175} loading = 'lazy'  />
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
