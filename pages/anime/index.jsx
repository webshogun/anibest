import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo, useState, useEffect } from "react";
import Card from "@/components/card";
import { supabase } from "@/lib/supabase";
import styles from "@/styles/catalog.module.css";

const Catalog = ({ animes }) => {
  const router = useRouter();
  const { type = "", status = "", genre = "" } = router.query;
  const [isMobile, setIsMobile] = useState(false);

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

  function generateFilterSection(title, options, filterType) {
    return (
      <>
        <h2 className={styles.heading}>{title}</h2>
        {options.map((option) => (
          <label className={styles.item} key={option}>
            <input
              type="checkbox"
              checked={selectedFilters[filterType] === option}
              onChange={(e) =>
                updateFilter(filterType, e.target.checked ? option : "")
              }
            />
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </label>
        ))}
      </>
    );
  }

  const selectedFilters = useMemo(
    () => ({
      type,
      status,
      genre,
    }),
    [type, status, genre]
  );

  const updateFilter = (filter, value) => {
    const filters = { ...selectedFilters, [filter]: value };
    const query = Object.entries(filters)
      .filter(([, value]) => Boolean(value))
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
    router.push(`/anime${query ? `?${query}` : ""}`);
  };

  const filteredAnime = useMemo(() => {
    return animes.filter(({ type, status, genres }) => {
      return Object.entries(selectedFilters).reduce((acc, [key, value]) => {
        if (value && key !== "genre" && key !== "status") {
          return acc && type === value;
        } else if (value && key === "genre") {
          return acc && genres?.includes(value);
        } else if (value && key === "status") {
          return acc && status?.includes(value);
        } else {
          return acc;
        }
      }, true);
    });
  }, [animes, selectedFilters]);

  return (
    <>
      <Head>
        <title>Catalog</title>
      </Head>
      <main className="">
        <div className="container">
          <div className={styles.wrapper}>
            {isMobile ? (
              <>
                <div className={styles.filter}>
                  {generateFilterSection(
                    "Type",
                    ["TV Series", "Film", "OVA"],
                    "type"
                  )}
                  {generateFilterSection(
                    "Status",
                    ["completed", "ongoing"],
                    "status"
                  )}
                  {generateFilterSection(
                    "Genre",
                    [
                      "Action",
                      "Adventure",
                      "Comedy",
                      "Drama",
                      "Fantasy",
                      "Horror",
                      "Romance",
                      "Sci-Fi",
                      "Sports",
                      "Superhero",
                    ],
                    "genre"
                  )}
                </div>
                <div className={styles.main}>
                  <div className={styles.list}>
                    {filteredAnime.map((anime) => (
                      <Card key={anime.id} anime={anime} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.main}>
                  <div className={styles.list}>
                    {filteredAnime.map((anime) => (
                      <Card key={anime.id} anime={anime} />
                    ))}
                  </div>
                </div>
                <div className={styles.filter}>
                  {generateFilterSection(
                    "Type",
                    ["TV Series", "Film", "OVA"],
                    "type"
                  )}
                  {generateFilterSection(
                    "Status",
                    ["completed", "ongoing"],
                    "status"
                  )}
                  {generateFilterSection(
                    "Genre",
                    [
                      "Action",
                      "Adventure",
                      "Comedy",
                      "Drama",
                      "Fantasy",
                      "Horror",
                      "Romance",
                      "Sci-Fi",
                      "Sports",
                      "School",
                    ],
                    "genre"
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps() {
  const { data: animes } = await supabase
    .rpc("get_animes_with_ratings")
    .select("id, title, type, release_date, status, genres");

  return {
    props: {
      animes,
    },
  };
}

export default Catalog;
