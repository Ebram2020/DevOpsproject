import Dashboard from './pages/home';
import Login from './components/login/login';
import OwnersDidpaly from './pages/owners';
import UsersActivation from './pages/users-activation';
import OwnerDetailsPage from './pages/owner-details';
import PlayersDisplay from './pages/players';
import PlayerDetails from './pages/player-details';
import PlaygroundDetails from './pages/playground-details';
import AddCatogeryPage from './pages/add-catogery-page';
import ViewCatogeryPage from './pages/catogeries';
import AddBannerPage from './pages/add-banner-page';
import ViewBannerPage from './pages/banners';
import PlaygroundPage from './pages/playgrounds.pages';


export const routers = [
  {
    path: '/',
    element: <Login/>,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/active-owners',
    element: <OwnersDidpaly />,
  },
  {
    path: "/unactive-owners",
    element: <UsersActivation />,
  },
  {
    path: "/active-players",
    element: <PlayersDisplay />,
  },
  {
    path: "/player/:id",
    element: <PlayerDetails/>,
  },
  {
    path: "/owner/:id",
    element: <OwnerDetailsPage />,
  },
  {
    path: "/playground/:stadiumId",
    element: <PlaygroundDetails/>
  },
  {
    path: "/add-catogery",
    element: <AddCatogeryPage/>
  },
  {
    path: "/catogeries",
    element: <ViewCatogeryPage/>
  },
  {
    path: "/add-banner",
    element: <AddBannerPage/>
  },
  {
    path: "/banners",
    element: <ViewBannerPage/>
  },
  {
    path: "/playgrounds",
    element: <PlaygroundPage/>
  },
  {
    path: "*",
    element: <h2 className='text-center text-blue-600 text-2xl'>Page Not Found</h2>
  }
]
