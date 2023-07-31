import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Login } from "./components";
import Wrapper from "./wrapper";
import Project from './components/project';
import Pharmacy from './components/project/pharmacy';
import Pill from './components/project/pill';
import Position from './components/position';
import Plan from "./components/project/plan";

function ProtectedRoute({
  redirectPath = '/login',
  children,
}: any) {
  if (!localStorage.getItem('access')) {
    return <Navigate to={redirectPath} replace />
  };

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path="position">
          <Route index element={
            <ProtectedRoute>
              <Wrapper>
                <Position />
              </Wrapper>
            </ProtectedRoute>
          } />
        </Route>
        {/* <Route path="project">
          <Route index element={
            <ProtectedRoute>
              <Wrapper>
                <Project />
              </Wrapper>
            </ProtectedRoute>
          } />
        </Route> */}
        <Route path="project">
          <Route path="pharmacy" element={
            <ProtectedRoute>
              <Wrapper>
                <Pharmacy />
              </Wrapper>
            </ProtectedRoute>
          } />
          <Route path="pill" element={
            <ProtectedRoute>
              <Wrapper>
                <Pill />
              </Wrapper>
            </ProtectedRoute>
          } />
          <Route path="plan" element={
            <ProtectedRoute>
              <Wrapper>
                <Plan />
              </Wrapper>
            </ProtectedRoute>
          } />
        </Route>
        {/* <Route path="pharmacy">
          <Route index element={
            <ProtectedRoute>
              <Wrapper>
                <Pharmacy />
              </Wrapper>
            </ProtectedRoute>
          } />
          </Route> */}
        <Route
          path="*"
          element={
            <Wrapper>
              <main>
                <p>There's nothing here!</p>
              </main>
            </Wrapper>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;