import { memo, useState, useEffect } from "react";
import Head from 'next/head';
import { useRouter } from "next/router";
import Card from "@/components/card";
import styles from "@/styles/home.module.css";

const MemoizedCard = memo(Card);

const Studio = ({supabase}) => {
  const router = useRouter();
  const { id } = router.query;
  const [animes, setAnimes] = useState([]);


  useEffect(() => {
    async function fetchAnimeByStudio() {
      const { data, error } = await supabase
        .from("anime")
        .select("*")
        .eq("studio", id);

      if (error) {
        console.error(error);
      } else {
        setAnimes(data);
      }
    }

    if (id !== undefined) {
      fetchAnimeByStudio();
    }
  }, [id]);

  return (
    <>
      <Head>
        <title>{id}</title>
      </Head>
      <main className={styles.main}>
        <div className="container">
          <div className={styles.wrapper}>
            <h2 className={styles.heading}>{id}</h2>
            <div className={styles.list}>
              {animes.map((anime) => (
                <MemoizedCard key={anime.id} anime={anime} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Studio;
