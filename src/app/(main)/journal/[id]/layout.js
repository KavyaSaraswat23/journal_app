import { ArrowBigLeftIcon, ArrowLeftIcon, MoveLeft } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense } from 'react'
import {BarLoader} from "react-spinners";
const JouranIdLayout = ({ children }) => {
  return (
    <div className=' mx-auto px-4 py-8 container'>
        <div className=''>
            <Link href='/dashboard' className='text-sm text-orange-600 hover:text-orange-700 cursor-pointer'>
                <ArrowLeftIcon /> Back to dashboard
            </Link>
        </div>
        <Suspense fallback={<BarLoader color='orange' width={"100%"} />}> 
          {children}
        </Suspense>
    </div>
  )
}

export default JouranIdLayout;
