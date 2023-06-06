import React, { useEffect, useState } from "react";
import Head from "next/head";
import Card from "@/components/card";
import styles from "@/styles/calendar.module.css";

const Calendar = ({ supabase }) => {
  const currentDate = new Date();
  const days = [];

  const options = { weekday: "long" };

  for (let i = 0; i < 7; i++) {
    const nextDate = new Date();
    nextDate.setDate(currentDate.getDate() + i);
    const dayName = nextDate.toLocaleDateString(undefined, options);
    days.push(dayName);
  }

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
                {index === 0 ? (
                  <h3 className={styles.heading}>Today</h3>
                ) : (
                  <h2 className={styles.heading}>{day}</h2>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Calendar;
