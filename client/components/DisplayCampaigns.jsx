import React from 'react';

import { useRouter } from 'next/router';
import { v4 as uuidv4 } from "uuid";
import FundCard from './FundCard';
import { loader } from '../public/assets';
import Image from 'next/image';


const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const router = useRouter();

  const handleNavigate = (campaign) => {
    router.push({
      pathname: `/campaign-details/${campaign.title}`,
      query: campaign
    })

    // router.push(`/campaign-details/${campaign.title}`, { state: campaign })
  }
  
  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">{title} ({campaigns.length})</h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <Image src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any campigns yet
          </p>
        )}

        {!isLoading && campaigns.length > 0 && campaigns.map((campaign) => <FundCard 
          key={uuidv4()}
          {...campaign}
          handleClick={() => handleNavigate(campaign)}
        />)}
      </div>
    </div>
  )
}

export default DisplayCampaigns