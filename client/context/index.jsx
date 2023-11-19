import React, { useContext, createContext } from "react"
import { Navbar, Sidebar } from "../components"
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react"
import { ethers } from "ethers"
import { EditionMetadataWithOwnerOutputSchema } from "@thirdweb-dev/sdk"

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract("0xdd472fbEd6BEB59690D362bea6487783508fE9cd")
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  )

  const address = useAddress()
  const connect = useMetamask()

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address, // owner
          form.title, // title
          form.description, // description
          form.target,
          new Date(form.deadline).getTime(), // deadline,
          form.image,
        ],
      })

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const getCampaigns = async () => {
    const campaigns = await contract.call("getCampaigns")

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      image: campaign.image,
      pId: i,
    }))

    console.log(parsedCampaings)

    return parsedCampaings
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns()

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === address
    )

    return filteredCampaigns
  }

  const donate = async (pId, amount) => {
    const data = await contract.call("donateToCampaign", [pId], {
      value: ethers.utils.parseEther(amount),
    })

    return data
  }

  const getDonations = async (pId) => {
    const donations = await contract.call("getDonators", [pId])
    const numberOfDonations = donations[0].length

    const parsedDonations = []

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      })
    }

    return parsedDonations
  }

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
        <div className="sm:flex hidden mr-10 relative">
          <Sidebar />
        </div>
        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5 ">
          <Navbar />
          {children}
        </div>
      </div>
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)
