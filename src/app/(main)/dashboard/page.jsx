import { getCollections } from '@/app/api/collection'
import { getJournalEntry } from '@/app/api/journal';
import Collections from './components/Collections';
import MoodAnalytics from './components/MoodAnalytics';
import React from 'react'

const Dashboard = async () => {
  const collections = await getCollections();
  const entriesData = await getJournalEntry();
  const entriesByCollection = entriesData?.data.entries.reduce((acc, entry) => {
    const collectionId = entry.collectionId || 'unorganized';
    if (!acc[collectionId]) {
      acc[collectionId] = [];
    }
    acc[collectionId].push(entry);
    return acc
  }, {});

  // console.log(entriesByCollection, "entriesByCollection");
  return (
    <div className='container mx-auto px-4 py-8'>

      <div className="px-4 py-8 space-y-8">
        {/* Analytics Section */}
        <section className="space-y-4">
          <MoodAnalytics />
        </section>

        <Collections
          collections={collections}
          entriesByCollection={entriesByCollection}
        />
      </div>
    </div>
  );
};



export default Dashboard
