import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/navbar/navbar.com";
import Nav from "../components/nav/nav.comp";
import humbrgerBar from "../assets/menu-icon.png";
import DisplayNumbers from "../components/numberCart/number-cart";
import OwnerBasicInfo from "../components/owners/owner-basicinfo.comp";
import PlayGroundView from "../components/owners/playgrounds-view.comp";
import Feedback from "../components/owners/clients-feedback.comp";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { OwnersContext } from "../context/ownersContext";

interface PlayGround {
    stadiumId: string;
    name: string;
    pricePerHour: number;
    location: string;
    description: string;
    minHoursReservation: number;
    openTimes: { dayOfWeek: number; startTime: string; endTime: string }[];
    approvalStatus: boolean
}

interface Owner {
  id: string;
  userName: string;
  email: string;
  profilePictureUrl: string;
  proofOfIdentityUrl: string
  wallet: number;
  rate: number;
  reviews: [];
}

const OwnerDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [playgrounds, setPlayGround] = useState<PlayGround[]>([]);
  const [loading, setLoading] = useState(true);
  const [navbarIsHidden, setNavbarIsHidden] = useState(true);
  const { fetchOwners } = useContext(OwnersContext);
  const navigate = useNavigate();

  const navbarDisplayHandle = (bool: boolean) => {
    setNavbarIsHidden(bool);
  };


  useEffect(() => {
    fetchOwners();
  }, [fetchOwners]);

  useEffect(() => {
    const fetchOwnerDetails = async () => {
      try {
        const [ownerResponse, playgroundsResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/Owner/${id}`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/Owner/GetStadiums/${id}`)
        ]);

        if (ownerResponse.status === 200) {
          setOwner(ownerResponse.data);
        } else {
          toast.error('Failed to load owner details');
        }

        if (playgroundsResponse.status === 200) {
          setPlayGround(playgroundsResponse.data);
        } else {
          toast.error('Failed to load the playgrounds');
        }
      } catch (error: any) {
        toast.error('Error fetching owner details: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerDetails();
  }, [id]);

 const deleteHandle = async (id: string) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/Owner/Delete/${id}`);

      if (res.status === 200) {
        toast.success('The Owner deleted successfully');
        navigate(-1)
      } else {
        throw new Error("The Owner isn't deleted, try again");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!owner) {
    return <div>No owner found</div>;
  }

  return (
    <div className="flex gap-5 w-[100vw] min-h-[100vh] relative">
      <div className="w-8 h-8 ml-5 absolute mt-10 cursor-pointer xl:hidden">
        <img onClick={() => { navbarDisplayHandle(false) }} src={humbrgerBar} alt="humbBar" />
      </div>
      <Navbar closeNavbar={navbarDisplayHandle} isHidden={navbarIsHidden} />
      <div className="w-[100%] xl:w-[72%] 2xl:w-[78%] min-h-[100%] flex flex-col xl:absolute xl:right-10">
        <Nav />
        <div className="flex flex-col gap-20 w-[100%] p-10 bg-slate-100 absolute top-[150px]">
          <div className="flex gap-5 mt-10">
            <DisplayNumbers title="Revenue" number={owner.wallet} sign="$" />
          </div>
          <OwnerBasicInfo
            username={owner.userName}
            email={owner.email}
            avatar={owner.profilePictureUrl}
            proofOfIdentityUrl={owner.proofOfIdentityUrl}
          />
          <PlayGroundView playgrounds={playgrounds} />
          <Feedback reviews={owner.reviews} rate={owner.rate} />
          <div>
            <button className="px-8 py-3 text-white rounded bg-red-500 hover:bg-red-600 font-bold" onClick={()=>deleteHandle(owner.id)}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDetailsPage;
