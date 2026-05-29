"use client";

import { useEffect, useState } from "react";
import { databases } from "../lib/appwrite";

export default function Page() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        console.log("FETCH EVENTS START");

        const res = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID!
        );

        console.log("EVENTS:", res);

        setEvents(res.documents);
      } catch (e) {
        console.log("ERROR:", e);
      }
    };

    load();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>APPWRITE EVENTS</h1>

      <pre>{JSON.stringify(events, null, 2)}</pre>
    </div>
  );
}
