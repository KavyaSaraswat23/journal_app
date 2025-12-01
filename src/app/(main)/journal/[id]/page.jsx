import { getJournalEntryById } from '@/app/api/journal';
import React from 'react'
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getMoodById } from '../../lib/mood';
import EditButton from '../components/EditButton';
import DeleteDialog from '../components/DeleteDialog';
const JournalEntryPage = async({params}) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const entry = await getJournalEntryById(id);
  console.log(entry.mood);
  const mood = await getMoodById(entry.mood);
  return (
    <>
      {entry.moodImageUrl && (
        <div className="relative h-48 md:h-64 w-full">
          <Image
            src={entry.moodImageUrl}
            alt="Mood visualization"
            className="object-contain"
            fill
            priority

          />
        </div>
      )}
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-5xl font-bold gradient-title">
                  {entry.title}
                </h1>
              </div>
              <p className="text-gray-500">
                {/* Created {format(new Date(entry.createdAt), "PPP")} */}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <EditButton entryId={id} />
              <DeleteDialog entryId={id} />
            </div>
          </div>

          {/* Tags Section */}
          <div className="flex flex-wrap gap-2">
            {entry.collection && (
              <Link href={`/collection/${entry.collection.id}`}>
                <Badge>Collection: {entry.collection.name}</Badge>
              </Link>
            )}
            <Badge
              variant="outline"
              style={{
                backgroundColor: `var(--${mood?.color}-50)`,
                color: `var(--${mood?.color}-700)`,
                borderColor: `var(--${mood?.color}-200)`,
              }}
            >
              Feeling {mood?.label}
            </Badge>
          </div>
        </div>

        <hr />

        {/* Content Section */}
        <div>
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-500 pt-4 border-t">
          {/* Last updated {format(new Date(entry.updatedAt), "PPP 'at' p")} */}
        </div>
      </div>
    </>
  )
}

export default JournalEntryPage
