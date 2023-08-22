import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Login } from "./components";
import Wrapper from "./wrapper";
import Project from "./components/project";
import Pharmacy from "./components/project/pharmacy";
import AdminPharmacy from "./components/admin/pharmacy/users";
import Pill from "./components/project/pill";
import Position from "./components/position";
import Plan from "./components/project/plan";
import { me } from "./components/login/request";

import CompanyUsers from "./components/admin/company/users";
import DirectorUsers from "./components/admin/director/users";
import CreateCompanyUser from "./components/admin/company/users/create";
import { useAppSelector } from "./hooks";
import { userSelector } from "./reducer/user";
import CreatePharmacyUser from "./components/admin/pharmacy/users/create";
import CreateGroupOwnerUser from "./components/admin/director/users/create";
import SingleCompanyUser from "./components/admin/company/users/single";
import EditCompanyUser from "./components/admin/company/users/edit";
import SinglePharmacyUser from "./components/admin/pharmacy/users/single";
import EditPharmacyUser from "./components/admin/pharmacy/users/edit";
import SingleDirectorUser from "./components/admin/director/users/single";
import EditSingleDirectorUser from "./components/admin/director/users/edit";
import CompanySetting from "./components/admin/company/setting";
import ClassificationCreate from "./components/admin/company/setting/create";
import SingleClassification from './components/admin/company/setting/edit';
import Rate from './components/admin/pharmacy/rates';
import RateUpdate from './components/admin/pharmacy/rates/edit';
import RateCreate from './components/admin/pharmacy/rates/create';
import Coefficient from './components/admin/director/coefficient';
import CoefficientCreate from './components/admin/director/coefficient/create';
import CoefficientUpdate from './components/admin/director/coefficient/edit';

function ProtectedRoute({ redirectPath = "/login", children }: any) {
  if (!localStorage.getItem("access")) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

function App() {
  const me = useAppSelector((state) => state.user);

  const [tempMe, setTempMe] = useState({
    username: "",
    user: {
      is_manager: false,
      is_company: false,
    },
  });

  useEffect(() => {
    setTempMe(me);
  }, [me]);

  const displayRoute = () => {
    if (tempMe.user.is_manager || localStorage.getItem("user") === "admin") {
      return (
        <>
          <Route path="company">
            <Route path="user">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <CompanyUsers />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="create"
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <CreateCompanyUser />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id/offers"
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <SingleCompanyUser />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id/edit"
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <EditCompanyUser />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="setting">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <CompanySetting />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="create"
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <ClassificationCreate />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id"
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <SingleClassification />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
          <Route path="admin-pharmacy">
            <Route path="user">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <AdminPharmacy />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="create"
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <CreatePharmacyUser />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id/pharmacy"
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <SinglePharmacyUser />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id/edit"
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <EditPharmacyUser />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="rate">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <Rate />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="create"
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <RateCreate />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id"
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <RateUpdate />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
          <Route path="pharmacy-ceo">
            <Route path="user">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <DirectorUsers />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="create"
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <CreateGroupOwnerUser />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id/drugstore-group-owners"
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <SingleDirectorUser />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id/edit"
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <EditSingleDirectorUser />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="coefficient">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <Coefficient />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="create"
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <CoefficientCreate />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id"
                element={
                  <ProtectedRoute>
                    <Wrapper>
                      <CoefficientUpdate />
                    </Wrapper>
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
        </>
      );
    } else {
      return (
        <>
          <Route path="position">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Wrapper>
                    <Position />
                  </Wrapper>
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="project">
            <Route
              path="pharmacy"
              element={
                <ProtectedRoute>
                  <Wrapper>
                    <Pharmacy />
                  </Wrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="pill"
              element={
                <ProtectedRoute>
                  <Wrapper>
                    <Pill />
                  </Wrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="plan"
              element={
                <ProtectedRoute>
                  <Wrapper>
                    <Plan />
                  </Wrapper>
                </ProtectedRoute>
              }
            />
          </Route>
        </>
      );
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        {/* <Route path="position">
          <Route
            index
            element={
              <ProtectedRoute>
                <Wrapper>
                  <Position />
                </Wrapper>
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="project">
          <Route
            path="pharmacy"
            element={
              <ProtectedRoute>
                <Wrapper>
                  <Pharmacy />
                </Wrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="pill"
            element={
              <ProtectedRoute>
                <Wrapper>
                  <Pill />
                </Wrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="plan"
            element={
              <ProtectedRoute>
                <Wrapper>
                  <Plan />
                </Wrapper>
              </ProtectedRoute>
            }
          />
        </Route> */}
        {displayRoute()}
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
