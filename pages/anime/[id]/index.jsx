import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import styles from "@/styles/page.module.css";

const AnimePage = ({ anime, id, supabase, session }) => {
  const {
    title,
    average,
    type,
    status,
    series,
    release_date,
    time,
    studio,
    description,
    genres,
    status_result,
    rating_result,
  } = anime;

  const router = useRouter();
  const { menu } = router.query;
  
  const [open, setOpen] = useState(false);
  const [listButtonLabel, setListButtonLabel] = useState("Add to list");
  const [ratings, setRatings] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const date = new Date(anime.release_date);
  const year = date.getFullYear();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const activeMenuItem = (menuItem) => {
    return menu === menuItem ? styles.active : "";
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
    const fetchData = async () => {
      if (id && session && session.user) {
        const favoritesResponse = await supabase
          .from("favorites")
          .select("*")
          .eq("anime_id", parseInt(id))
          .eq("user_id", session.user.id)
          .single();

        if (favoritesResponse.data) {
          const { status, evaluation } = favoritesResponse.data;
          setListButtonLabel(status);
          setRatings(evaluation);
        }
      }
    };

    fetchData();
  }, [id, session]);

  const updateAnimeStatus = async (status) => {
    const { data: existingRecord } = await supabase
      .from("favorites")
      .select("*")
      .eq("anime_id", id)
      .eq("user_id", session.user.id)
      .single();

    if (existingRecord === null) {
      const { error: insertError } = await supabase
        .from("favorites")
        .insert([{ user_id: session.user.id, anime_id: id, status }]);

      setListButtonLabel(status);
    } else {
      const { error: updateError } = await supabase
        .from("favorites")
        .update({ status })
        .eq("id", existingRecord.id);

      setListButtonLabel(status);
    }
    setOpen(false);
  };

  const deleteAnimeStatus = async () => {
    const { data: existingRecord, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("anime_id", id)
      .eq("user_id", session.user.id)
      .single();

    if (existingRecord) {
      const { error: deleteFavoritesError } = await supabase
        .from("favorites")
        .delete()
        .eq("id", existingRecord.id);

      setListButtonLabel("Add to list");
    }

    setOpen(false);
  };

  const updateUserRating = async (rating) => {
    if (!session || !id || rating === null) {
      return;
    }

    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("anime_id", id)
      .eq("user_id", session.user.id);

    if (data.length > 0) {
      const ratingId = data[0].id;

      const { data: updatedData, error: updateError } = await supabase
        .from("favorites")
        .update({ evaluation: rating })
        .eq("id", ratingId);
    } else {
      const { data: createdData, error: createError } = await supabase
        .from("favorites")
        .insert([
          { anime_id: id, user_id: session.user.id, evaluation: rating },
        ]);
    }
    setRatings(rating);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main>
        <div className="container">
          <div className={styles.wrapper}>
            {isMobile ? (
              <>
                <div className={styles.image}>
                  <Image
                    className={styles.poster}
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/anime/${anime.title}`}
                    alt={anime.title}
                    width={250}
                    height={355}
                    priority={true}
                  />
                </div>
                <div className={styles.content}>
                  <h1 className={styles.title}>{title}</h1>
                  <div className={styles.add}>
                    <div className={styles.average}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#C1FF3D"
                        className={styles.icon}
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{average}</span>
                    </div>
                    <span className={styles.year}>{year}</span>
                  </div>
                  <nav className={styles.menu}>
                    <Link
                      className={activeMenuItem("info")}
                      href={`/anime/[id]/?menu=info`}
                      as={`/anime/${id}/?menu=info`}
                    >
                      Information
                    </Link>
                    <Link
                      className={activeMenuItem("episodes")}
                      href={`/anime/[id]/?menu=episodes`}
                      as={`/anime/${id}/?menu=episodes`}
                    >
                      Series
                    </Link>
                    <Link
                      className={activeMenuItem("characters")}
                      href={`/anime/[id]/?menu=characters`}
                      as={`/anime/${id}/?menu=characters`}
                    >
                      Characters
                    </Link>
                    <Link
                      className={activeMenuItem("authors")}
                      href={`/anime/[id]/?menu=authors`}
                      as={`/anime/${id}/?menu=authors`}
                    >
                      Authors
                    </Link>
                  </nav>
                  {menu === "info" && (
                    <>
                      <ul className={styles.info}>
                        <li className={styles.item}>
                          Type:{" "}
                          <Link
                            className={styles.link}
                            href={`/anime?type=${type}`}
                            as={`/anime?type=${type}`}
                          >
                            {type}
                          </Link>
                        </li>
                        <li className={styles.item}>
                          Status:{" "}
                          <Link
                            className={styles.link}
                            href={`/anime?status=${status}`}
                            as={`/anime?status=${status}`}
                          >
                            {status}
                          </Link>
                        </li>
                        <li className={styles.item}>
                          Series: <span className={styles.link}>{series}</span>
                        </li>
                        <li className={styles.item}>
                          Year: <span className={styles.link}>{year}</span>
                        </li>
                        <li className={styles.item}>
                          Time: <span className={styles.link}>{time}m</span>
                        </li>
                        <li className={styles.item}>
                          Studio:{" "}
                          <Link
                            className={styles.link}
                            href={`/studio/${studio}`}
                            as={`/studio/${studio}`}
                          >
                            {studio}
                          </Link>
                        </li>
                      </ul>
                      <p className={styles.desc}>{description}</p>
                      <div className={styles.genres}>
                        {genres?.map((genre) => (
                          <Link
                            className={styles.genre}
                            href={`/anime?genre=${genre}`}
                            as={`/anime?genre=${genre}`}
                            key={genre}
                          >
                            {genre}
                          </Link>
                        ))}
                      </div>
                      <div className={styles.rating}>
                        <h3 className={styles.heading}>On people's lists</h3>
                        <div className={styles.table}>
                          {status_result.map((item) => (
                            <div className={styles.row} key={item.status}>
                              <div className={styles.status}>
                                <span>{item.status}</span>
                              </div>
                              <div className={styles.bar}>
                                <div
                                  className={styles.result}
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                              </div>
                              <span className={styles.percentage}>
                                {item.percentage}%
                              </span>
                              <span className={styles.count}>{item.votes}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className={styles.rating}>
                        <h3 className={styles.heading}>User ratings</h3>
                        <div className={styles.table}>
                          {rating_result.map((item) => (
                            <div key={item.evaluation} className={styles.row}>
                              <span className={styles.status}>
                                {item.evaluation}
                              </span>
                              <div>
                                <div className={styles.bar}>
                                  <div
                                    className={styles.result}
                                    style={{ width: `${item.percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                              <span className={styles.percentage}>
                                {item.percentage}%
                              </span>
                              <span className={styles.count}>{item.votes}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className={styles.sidebar}>
                  <Image
                    className={styles.poster}
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/anime/${title}`}
                    alt={title}
                    width={250}
                    height={355}
                    priority={true}
                  />
                  <button
                    className={styles.toggle}
                    onClick={() => setOpen(!open)}
                  >
                    {listButtonLabel}
                  </button>
                  {open && (
                    <div className={styles.dropdown}>
                      {listButtonLabel !== "planned" && (
                        <button
                          className={styles.state}
                          onClick={() => updateAnimeStatus("planned")}
                        >
                          Planned
                        </button>
                      )}
                      {listButtonLabel !== "watched" && (
                        <button
                          className={styles.state}
                          onClick={() => updateAnimeStatus("watched")}
                        >
                          Watched
                        </button>
                      )}
                      {listButtonLabel !== "watching" && (
                        <button
                          className={styles.state}
                          onClick={() => updateAnimeStatus("watching")}
                        >
                          Watching
                        </button>
                      )}
                      {listButtonLabel !== "abandoned" && (
                        <button
                          className={styles.state}
                          onClick={() => updateAnimeStatus("abandoned")}
                        >
                          Abandoned
                        </button>
                      )}
                      {listButtonLabel !== "Add to list" && (
                        <button
                          className={styles.delete}
                          onClick={deleteAnimeStatus}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                  <div className={styles.stars}>
                    {listButtonLabel !== "Add to list" && (
                      <>
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            className={`${styles.star} ${
                              isFilled(value) ? styles.filled : ""
                            }`}
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
                      Type:{" "}
                      <Link
                        className={styles.link}
                        href={`/anime?type=${type}`}
                        as={`/anime?type=${type}`}
                      >
                        {type}
                      </Link>
                    </li>
                    <li className={styles.item}>
                      Status:{" "}
                      <Link
                        className={styles.link}
                        href={`/anime?status=${status}`}
                        as={`/anime?status=${status}`}
                      >
                        {status}
                      </Link>
                    </li>
                    <li className={styles.item}>
                      Series: <span className={styles.link}>{series}</span>
                    </li>
                    <li className={styles.item}>
                      Year: <span className={styles.link}>{year}</span>
                    </li>
                    <li className={styles.item}>
                      Time: <span className={styles.link}>{time}m</span>
                    </li>
                    <li className={styles.item}>
                      Studio:{" "}
                      <Link
                        className={styles.link}
                        href={`/studio/${studio}`}
                        as={`/studio/${studio}`}
                      >
                        {studio}
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className={styles.content}>
                  <div className={styles.header}>
                    <h1 className={styles.title}>{title}</h1>
                    <div className={styles.average}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#C1FF3D"
                        className={styles.icon}
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{average}</span>
                    </div>
                  </div>
                  <div className={styles.tabs}>
                    <nav className={styles.menu}>
                      <Link
                        className={activeMenuItem("info")}
                        href={`/anime/[id]/?menu=info`}
                        as={`/anime/${id}/?menu=info`}
                      >
                        Information
                      </Link>
                      <Link
                        className={activeMenuItem("episodes")}
                        href={`/anime/[id]/?menu=episodes`}
                        as={`/anime/${id}/?menu=episodes`}
                      >
                        Series
                      </Link>
                      <Link
                        className={activeMenuItem("characters")}
                        href={`/anime/[id]/?menu=characters`}
                        as={`/anime/${id}/?menu=characters`}
                      >
                        Characters
                      </Link>
                      <Link
                        className={activeMenuItem("authors")}
                        href={`/anime/[id]/?menu=authors`}
                        as={`/anime/${id}/?menu=authors`}
                      >
                        Authors
                      </Link>
                    </nav>
                    {menu === "info" && (
                      <>
                        <p className={styles.desc}>{description}</p>
                        <div className={styles.genres}>
                          {genres?.map((genre) => (
                            <Link
                              className={styles.genre}
                              href={`/anime?genre=${genre}`}
                              as={`/anime?genre=${genre}`}
                              key={genre}
                            >
                              {genre}
                            </Link>
                          ))}
                        </div>
                        <div className={styles.ratings}>
                          <div className={styles.rating}>
                            <h3 className={styles.heading}>
                              On people's lists
                            </h3>
                            <div className={styles.table}>
                              {status_result.map((item) => (
                                <div className={styles.row} key={item.status}>
                                  <div className={styles.status}>
                                    <span>{item.status}</span>
                                  </div>
                                  <div className={styles.bar}>
                                    <div
                                      className={styles.result}
                                      style={{ width: `${item.percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className={styles.percentage}>
                                    {item.percentage}%
                                  </span>
                                  <span className={styles.count}>
                                    {item.votes}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className={styles.rating}>
                            <h3 className={styles.heading}>User ratings</h3>
                            <div className={styles.table}>
                              {rating_result.map((item) => (
                                <div
                                  key={item.evaluation}
                                  className={styles.row}
                                >
                                  <span className={styles.status}>
                                    {item.evaluation}
                                  </span>
                                  <div>
                                    <div className={styles.bar}>
                                      <div
                                        className={styles.result}
                                        style={{ width: `${item.percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  <span className={styles.percentage}>
                                    {item.percentage}%
                                  </span>
                                  <span className={styles.count}>
                                    {item.votes}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.query;
  const [animeRes, charactersRes] = await Promise.all([
    supabase.from("anime").select("*").eq("id", parseInt(id)).single(),
    supabase.from("characters").select("*").eq("anime_id", parseInt(id)),
  ]);

  const anime = animeRes.data;
  const characters = charactersRes.data;

  console.log(anime.release_date);

  return {
    props: {
      id,
      anime,
      characters,
    },
  };
}

export default AnimePage;
