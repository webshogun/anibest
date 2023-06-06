import Card from "@/components/card";
import { useState, useEffect } from "react";
import Head from 'next/head';
import { useRouter } from "next/router";
import styles from "@/styles/profile.module.css";

const Profile = ({ session, supabase }) => {
  const router = useRouter();

  const [watchedAnime, setWatchedAnime] = useState([]);
  const [plannedAnime, setPlannedAnime] = useState([]);
  const [watchingAnime, setWatchingAnime] = useState([]);
  const [abandonedAnime, setAbandonedAnime] = useState([]);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  useEffect(() => {
    const fetchViewedAnime = async () => {
      if (session) {
        try {
          const { data, error } = await supabase.rpc("fetchuseranimestatus", {
            userid: session.user.id,
          });

          if (error) {
            console.error("Error fetching anime:", error);
          } else {
            const { watched, watching, planned, abandoned } = data[0];
            setWatchedAnime(watched || []);
            setWatchingAnime(watching || []);
            setPlannedAnime(planned || []);
            setAbandonedAnime(abandoned || []);
          }
        } catch (error) {
          console.error("Error fetching anime:", error);
        }
      }
    };

    fetchViewedAnime();
  }, [session]);

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      {session !== null && (
        <main>
          <div className="container">
            <div className={styles.wrapper}>
              <p>Hello, {session.user.email}!</p>
              <button onClick={() => signOut()}>Logout</button>
              {watchingAnime.length < 1 &&
              plannedAnime.length < 1 &&
              watchedAnime.length < 1 &&
              abandonedAnime.length < 1 ? (
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
};

export default Profile;
