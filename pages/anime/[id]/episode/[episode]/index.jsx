import { supabase } from "@/lib/supabase";
import Link from "next/link";
import styles from "@/styles/player.module.css";
import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const Player = ({ anime, episode }) => {
  const videoRef = useRef(null);
  const previousEpisode = episode.id - 1;
  const nextEpisode = episode.id + 1;

  useEffect(() => {
    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(episode.link);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = episode.link;
    }
  }, []);

  return (
    <>
      <main>
        <div className="container">
          <div className={styles.wrapper}>
            <div>
              <div className={styles.header}>
                <h3>
                  {anime.title} {episode.id} episode
                </h3>
                <h4>{episode.name}</h4>
              </div>
              <video className={styles.player} ref={videoRef} controls />
              <div className={styles.inner}>
                {previousEpisode >= 1 && (
                  <Link
                    href={`/anime/[id]/episode/${previousEpisode}`}
                    as={`/anime/${anime.id}/episode/${previousEpisode}`}
                    className={styles.button}
                  >
                    {previousEpisode} episode
                  </Link>
                )}
                <Link
                  href={`/anime/[id]?menu=episodes`}
                  as={`/anime/${anime.id}?menu=episodes`}
                  className={`${styles.button} ${styles.center}`}
                >
                  All series
                </Link>
                {nextEpisode <= anime.episodes.length && (
                  <Link
                    href={`/anime/[id]/episode/${nextEpisode}`}
                    as={`/anime/${anime.id}/episode/${nextEpisode}`}
                    className={styles.button}
                  >
                    {nextEpisode} episode
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps(context) {
  const { id, episode } = context.query;

  const { data: anime, error: animeError } = await supabase
    .from("anime")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  const selectedEpisode = anime.episodes.find(
    (ep) => ep.id === parseInt(episode)
  );

  return {
    props: {
      anime,
      episode: selectedEpisode,
    },
  };
}

export default Player;
