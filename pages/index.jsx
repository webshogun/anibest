import { memo } from "react";
import { supabase } from "@/lib/supabase";
import Card from "@/components/card";
import styles from "@/styles/home.module.css";

const MemoizedCard = memo(Card);

const Home = ({ animes }) => {
  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.wrapper}>
          <h2 className={styles.heading}>Anime</h2>
          <div className={styles.list}>
            {animes.map((anime) => (
              <MemoizedCard key={anime.id} anime={anime} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export async function getServerSideProps() {
  const { data: animes } = await supabase
    .rpc("get_animes_with_ratings")
    .select("id, title, type, year");

  return {
    props: {
      animes,
    },
  };
}

export default Home;
