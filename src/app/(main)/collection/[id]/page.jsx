// "use client"
import { getJournalEntry } from "@/app/api/journal";
import { getCollections } from "@/app/api/collection";
import CollectionClient from "../components/CollectionsClient";

export default async function CollectionPage({ params }) {
  const collectionId = params.id;

  const entries = await getJournalEntry({ collectionId });

  if (!entries?.data?.entries) {
    return <div>No entries found</div>;
  }
  const collections =
    collectionId !== "unorganized" ? await getCollections() : null;

  const collection = collections?.find((c) => c.id === collectionId);

  return (
    <CollectionClient
      entries={entries.data.entries}
      collection={collection}
      collectionId={collectionId}
    />
  );
}
