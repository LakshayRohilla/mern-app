import { BrowserRouter, Routes, Route } from "react-router-dom";
import Users from "./user/pages/users";
import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from './shared/hooks/auth-hook';

function App() {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="places/new" element={<NewPlace />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="*" element={<Users />} />
        {/* In case we are providing the randon path which does not exist Users component will be loaded */}
        <Route path="/places/:placeId" element={<UpdatePlace />} />
        {/* <Route path="/auth" element={<Auth />} /> */}
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        {/* <Route path="places/new" element={<NewPlace />} /> */}
        <Route path="/:userId/places" element={<UserPlaces />} />
        {/* <Route path="*" element={<Users />} /> */}
        {/* In case we are providing the randon path which does not exist Users component will be loaded */}
        {/* <Route path="/places/:placeId" element={<UpdatePlace />} /> */}
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Auth />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>
          {/* <Routes> */}
          {/* <Route path="/" element={<Users />} /> */}
          {/* <Route path="places/new" element={<NewPlace />} /> */}
          {/* <Route path="/:userId/places" element={<UserPlaces />} /> */}
          {/* <Route path="*" element={<Users />} /> */}
          {/* In case we are providing the randon path which does not exist Users component will be loaded */}
          {/* <Route path="/places/:placeId" element={<UpdatePlace />} /> */}
          {/* <Route path="/auth" element={<Auth />} /> */}
          {/* </Routes> */}
          {routes}
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
