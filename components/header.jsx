import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "@/styles/header.module.css";

const Header = ({ session, supabase }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isVisible = prevScrollPos > currentScrollPos;

      setPrevScrollPos(currentScrollPos);
      setVisible(isVisible);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

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

  const handleSearchClick = () => {
    setShowSearch(true);
    if (isMobile) {
      document.body.classList.add(styles.hiddenOverflow);
    }
  };

  const handleSearchClose = () => {
    setShowSearch(false);
    if (isMobile) {
      document.body.classList.remove(styles.hiddenOverflow);
    }
  };

  const handleSearchResultClick = () => {
    setShowSearch(false);
    setSearchQuery("");
    if (isMobile) {
      document.body.classList.remove(styles.hiddenOverflow);
    }
  };

  useEffect(() => {
    async function fetchSearchResults() {
      if (showSearch) {
        const { data, error } = await supabase
          .from("anime")
          .select("*")
          .ilike("title", `%${searchQuery}%`)
          .limit(10);

        if (error) {
          console.error(error);
        } else {
          setSearchResults(data);
        }
      }
    }

    fetchSearchResults();
  }, [showSearch, searchQuery]);

  return (
    <>
      {isMobile ? (
        <>
          {showSearch ? (
            <div className={styles.inner}>
              <form className={styles.search}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Пошук"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
                <button className={styles.button} onClick={handleSearchClose}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#343434"
                    className={styles.icon}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </form>
              {searchResults.length > 0 && (
                <div className={styles.results}>
                  {searchResults.map((result) => (
                    <Link
                      className={styles.result}
                      key={result.id}
                      href={`/anime/${result.id}/?menu=info`}
                      onClick={handleSearchResultClick}
                    >
                      <Image
                        className={styles.poster}
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/anime/${result.title}`}
                        alt={result.title}
                        width={75}
                        height={105}
                      />
                      <div className={styles.info}>
                        <p className={styles.title}>{result.title}</p>
                        <div className={styles.add}>
                          <span className={styles.type}>{result.type}</span>
                          <span className={styles.year}> {result.year}</span>
                          <span className={styles.status}>
                            {" "}
                            {result.status}
                          </span>
                        </div>
                        <div className={styles.genres}>
                          {result.genres?.map((genre) => (
                            <span className={styles.genre}>{genre}</span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <header
              className={`${styles.header} ${
                visible ? styles.visible : styles.hidden
              }`}
            >
              <div className="container">
                <div className={styles.wrapper}>
                  <nav className={styles.menu}>
                    <Link className={styles.button} href="/">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                        />
                      </svg>
                    </Link>
                    <Link className={styles.button} href="/anime">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                        />
                      </svg>
                    </Link>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={styles.button}
                        onClick={handleSearchClick}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                      </svg>
                    <Link className={styles.button} href="/calendar">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                        />
                      </svg>
                    </Link>
                    {session ? (
                      <Link className={styles.account} href="/profile">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </Link>
                    ) : (
                      <Link className={styles.account} href="/login">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </Link>
                    )}
                  </nav>
                </div>
              </div>
            </header>
          )}
        </>
      ) : (
        <header className={styles.header}>
          <div className="container">
            <div className={styles.wrapper}>
              <Link className={styles.logo} href="/">
                AniBest
              </Link>
              {showSearch ? (
                <div className={styles.inner}>
                  <form className={styles.search}>
                    <input
                      className={styles.input}
                      type="text"
                      placeholder="Пошук"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                    />
                    <button
                      className={styles.button}
                      onClick={handleSearchClose}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="#343434"
                        className={styles.icon}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </form>
                  {searchResults.length > 0 && (
                    <div className={styles.results}>
                      {searchResults.map((result) => (
                        <Link
                          className={styles.result}
                          key={result.id}
                          href={`/anime/${result.id}/?menu=info`}
                          onClick={handleSearchResultClick}
                        >
                          <Image
                            className={styles.poster}
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/anime/${result.title}`}
                            alt={result.title}
                            width={75}
                            height={105}
                          />
                          <div className={styles.info}>
                            <p className={styles.title}>{result.title}</p>
                            <div className={styles.add}>
                              <span className={styles.type}>{result.type}</span>
                              <span className={styles.year}>
                                {" "}
                                {result.year}
                              </span>
                              <span className={styles.status}>
                                {" "}
                                {result.status}
                              </span>
                            </div>
                            <div className={styles.genres}>
                              {result.genres?.map((genre) => (
                                <span className={styles.genre}>{genre}</span>
                              ))}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <nav className={styles.menu}>
                  <Link className={styles.link} href="/anime">
                    Catalog
                  </Link>
                  <span className={styles.link} onClick={handleSearchClick}>
                    Search
                  </span>
                  <Link className={styles.link} href="/calendar">
                    Calendar
                  </Link>
                </nav>
              )}
              {session ? (
                <Link className={styles.account} href="/profile">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </Link>
              ) : (
                <div className={styles.auth}>
                  <Link className={styles.login} href="/login">
                    Sign In
                  </Link>
                  <Link className={styles.register} href="/register">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
