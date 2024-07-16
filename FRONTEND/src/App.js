import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCallback, useState } from "react";
import Users from "./user/pages/users";
import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";

function App() {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token) => {
    setToken(token);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
  }, []);

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
