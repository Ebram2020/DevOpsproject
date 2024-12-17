import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routers } from "./route";
import { OwnersProvider } from "./context/ownersContext";
import { Toaster } from "react-hot-toast";
import { AdminProvider } from "./context/adminContext";
import { PlayersProvider } from "./context/playersContext";
import { FeedbackProvider } from "./context/FeedbackContext";


const Router = createBrowserRouter(routers)

function App() {

  console.log("from the react app");
  return (
    <>
     <AdminProvider>
     <OwnersProvider>
     <PlayersProvider>
      <FeedbackProvider>
      <Toaster/>
      <RouterProvider router={Router} />
      </FeedbackProvider>
        </PlayersProvider>
      </OwnersProvider>
     </AdminProvider>
     
    </>
  )
}

export default App
