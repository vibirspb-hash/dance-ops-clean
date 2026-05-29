"use client";

import { useEffect, useState } from "react";
import { databases } from "../lib/appwrite";

type EventItem = {
  $id: string;
  title: string;
  time: string;
  place: string;
  team: string;
};

export default function Page() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID!
        );

        // ⚠️ FIX TYPE ISSUE
        setEvents(res.documents as unknown as EventItem[]);
      } catch (e) {
        console.log("ERROR:", e);
      }
    };

    fetchData();
  }, []);

  const parseTime = (t: string) => {
    if (!t) return 9999;
    const normalized = t.replace(/[^0-9.]/g, ".").split(".")[0];
    return parseFloat(normalized) || 9999;
  };

  const firstTeam = events
    .filter((e) => e.team === "first")
    .sort((a, b) => parseTime(a.time) - parseTime(b.time));

  const secondTeam = events
    .filter((e) => e.team === "second")
    .sort((a, b) => parseTime(a.time) - parseTime(b.time));

  const Card = ({ e }: { e: EventItem }) => (
    <div
      style={{
        padding: 12,
        marginBottom: 10,
        borderRadius: 12,
        border: "1px solid #e5e5e5",
        background: "white",
      }}
    >
      <div style={{ fontWeight: 700 }}>{e.time}</div>
      <div>{e.title}</div>
      <div style={{ fontSize: 12, opacity: 0.6 }}>{e.place}</div>
    </div>
  );

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", background: "#f6f6f6", minHeight: "100vh" }}>
      <h1>EVENTS OPS CRM</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <h2>FIRST TEAM</h2>
          {firstTeam.map((e) => (
            <Card key={e.$id} e={e} />
          ))}
        </div>

        <div>
          <h2>SECOND TEAM</h2>
          {secondTeam.map((e) => (
            <Card key={e.$id} e={e} />
          ))}
        </div>
      </div>
    </div>
  );
}
