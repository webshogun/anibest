import { memo } from "react";
import Head from "next/head";
import Card from "@/components/card";
import { supabase } from "@/lib/supabase";
import styles from "@/styles/home.module.css";

const MemoizedCard = memo(Card);

const Home = ({ ongoing }) => {
  return (
    <>
      <Head>
        <title>AniBest</title>
      </Head>
      <main className={styles.main}>
        <div className="container">
          <div className={styles.wrapper}>
            <h2 className={styles.heading}>Now on screens</h2>
            <div className={styles.list}>
              {ongoing.map((anime) => (
                <MemoizedCard key={anime.id} anime={anime} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps() {
  const { data: ongoing } = await supabase
    .rpc("get_animes_with_ratings")
    .select("id, title, type, release_date, status")
    .eq("status", "ongoing")
    .limit(6);

  return {
    props: {
      ongoing,
    },
  };
}

export default Home;
