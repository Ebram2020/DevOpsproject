import React from 'react';
import { Link } from 'react-router-dom';
import closeIcon from "../../assets/close-icon.png";
import homeIcon from "../../assets/home.png";
import addCatogeryIcon from "../../assets/plus.png";
import ownersIcon from "../../assets/users.png";
import activeIcon from "../../assets/active-user.png";


interface NavbarProps {
  isHidden?: boolean,
  closeNavbar: (bool:boolean)=> void
}

const Navbar: React.FC<NavbarProps> = (props) => {
  

  return (
    <div className={`bg-slate-100 xl:bg-white shadow-xl absolute top-[150px] xl:top-0 -translate-x-96 xl:translate-x-0 ${props.isHidden ? '-translate-x-96' : 'translate-x-0'} z-10 transition-transform min-h-[100%] w-[300px] flex flex-col gap-5`}>
      <div className='block xl:hidden'>
        <img onClick={() => { props.closeNavbar(true)}} className='w-6 h-6 absolute right-0 cursor-pointer' src={closeIcon} alt='close-icon' />
      </div>
      <div className='flex flex-col gap-5 font-bold cursor-pointer bg-slate-100 p-5 '>
        <Link to="/dashboard"><h1 className='mt-20 font-bold text-2xl p-2'>Dashboard</h1></Link>
        <Link className='flex gap-3' to="/dashboard"> <img className='w-6 h-6' src={homeIcon} alt="home-icon"/> Home</Link>
        <Link className='flex gap-3' to="/active-owners"> <img className='w-6 h-6' src={ownersIcon} alt="home-icon"/>Active Owners</Link>
        <Link className='flex gap-3' to="/unactive-owners"> <img className='w-6 h-6' src={activeIcon} alt="home-icon"/>UnActive Owners</Link>
        <Link className='flex gap-3' to="/active-players"> <img className='w-6 h-6' src={ownersIcon} alt="home-icon"/>All Players</Link>
        <Link className='flex gap-3' to="/playgrounds"> <img className='w-6 h-6' src={ownersIcon} alt="home-icon"/>All PlayGrounds</Link>
      </div>
      <div className='flex flex-col bg-slate-100 p-5 gap-3'>
        <h2 className='font-bold text-2xl'>Catogery</h2>
        <Link className='flex gap-3 font-bold text-md' to="/add-catogery"> <img className='w-5 h-5' src={addCatogeryIcon} alt="catogery-icon"/>Add catogery</Link>
        <Link className='flex gap-3 font-bold text-md' to="/catogeries"> <img className='w-5 h-5' src={addCatogeryIcon} alt="catogery-icon"/>View catogeries</Link>
      </div>
      <div className='flex gap-2 flex-col bg-slate-100 p-5'>
        <h2 className='font-bold text-2xl'>Banners</h2>
        <Link className='flex gap-3 font-bold text-md' to="/add-banner"> <img className='w-5 h-5' src={addCatogeryIcon} alt="catogery-icon"/>Add Banner</Link>
        <Link className='flex gap-3 font-bold text-md' to="/banners"> <img className='w-5 h-5' src={addCatogeryIcon} alt="catogery-icon"/>View Banners</Link>
      </div>
    </div>
  );
};

export default Navbar;
