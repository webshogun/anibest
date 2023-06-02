import React, { useEffect, useState } from "react";
import Head from "next/head";
import Card from "@/components/card";
import styles from "@/styles/calendar.module.css";

const Calendar = ({ supabase }) => {
  const [animeData, setAnimeData] = useState([]);
  const currentDate = new Date();
  const days = [];

  const options = { weekday: "long" };

  useEffect(() => {
    fetchAnimeData();
  }, []);

  const fetchAnimeData = async () => {
    const { data, error } = await supabase
      .from("anime")
      .select("*")
      .order("release_day");

    if (error) {
      console.error("Error fetching anime data:", error.message);
    } else {
      setAnimeData(data);
    }
  };

  for (let i = 0; i < 7; i++) {
    const nextDate = new Date();
    nextDate.setDate(currentDate.getDate() + i);
    const dayName = nextDate.toLocaleDateString(undefined, options);
    days.push(dayName);
  }

  const getAnimeForDay = (day) => {
    const animeForDay = animeData.filter((anime) => anime.release_day === day);

    if (animeForDay.length === 0) {
      return <p>No anime for this day</p>;
    }

    return animeForDay.map((anime) => <Card key={anime.id} anime={anime} />);
  };

  return (
    <>
      <Head>
        <title>Calendar</title>
      </Head>
      <main>
        <div className="container">
          <div className={styles.wrapper}>
            {days.map((day, index) => (
              <div key={index}>
                <h2 className={styles.heading}>{day}</h2>
                <div className={styles.list}>
                  {getAnimeForDay(day)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Calendar;
