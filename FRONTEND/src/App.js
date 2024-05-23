import { BrowserRouter, Routes, Route } from "react-router-dom";

import Users from "./user/pages/users";
import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";

function App() {
  return (
    <BrowserRouter>
      <MainNavigation />
      <main>
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="places/new" element={<NewPlace />} />
          <Route path="/:userId/places" element={<UserPlaces/>} />
          <Route path="*" element={<Users />} />
          {/* In case we are providing the randon path which does not exist Users component will be loaded */}
          <Route path="/places/:placeId" element={<UpdatePlace />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
