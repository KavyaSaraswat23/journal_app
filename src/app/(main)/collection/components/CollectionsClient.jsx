"use client";

import { JournalFilters } from "../components/JournalFilter";
import DeleteCollectionDialog from "../components/DeleteCollection";

export default function CollectionClient({ entries, collection, collectionId }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between">
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold gradient-title">
            {collectionId === "unorganized"
              ? "Unorganized Entries"
              : collection?.name || "Collection"}
          </h1>
            {/* Delete Collections */}
          {collection && (
            <DeleteCollectionDialog
              collection={collection}
              entriesCount={entries.length}
            />
          )}
        </div>

        {collection?.description && (
          <h2 className="font-extralight pl-1">{collection?.description}</h2>
        )}
      </div>

      <JournalFilters entries={entries} />
    </div>
  );
}
