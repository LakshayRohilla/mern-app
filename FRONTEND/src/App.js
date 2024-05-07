import { BrowserRouter, Routes, Route } from "react-router-dom";

import Users from "./user/pages/users";
import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";

function App() {
  return (
    <BrowserRouter>
      <MainNavigation />
      <main>
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="places/new" element={<NewPlace />} />
          <Route path="*" element={<Users />} />
          {/* In case we are providing the randon path which does not exist Users component will be loaded */}
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
