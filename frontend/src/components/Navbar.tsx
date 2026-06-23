import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  /* HOOKS */
  const navigate = useNavigate();
  const location = useLocation();

  const { logout } = useAuth();

  /* STATES */
  const [open, setOpen] =
    useState(false);

  const token =
    localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const isLoggedIn = !!token;

  const isOrganizer =
    user.role === "ORGANIZER";

  /* ACTIVE ROUTE */
  const isActive = (
    path: string
  ) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* LOGO */}
        <div
          onClick={() =>
            navigate("/")
          }
          className="text-xl font-bold text-purple-600 cursor-pointer"
        >
          EventHub
        </div>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-6 text-gray-600">
          {/* HOME */}
          <button
            onClick={() =>
              navigate("/")
            }
            className={`${
              isActive("/")
                ? "font-bold text-purple-600"
                : "hover:text-purple-600"
            }`}
          >
            Home
          </button>

          {/* EVENTS */}
          <button
            onClick={() =>
              navigate("/events")
            }
            className={`${
              isActive("/events")
                ? "font-bold text-purple-600"
                : "hover:text-purple-600"
            }`}
          >
            Events
          </button>

          {/* TRANSACTIONS */}
          {isLoggedIn && !isOrganizer &&(
            <button
              onClick={() =>
                navigate(
                  "/transactions"
                )
              }
              className={`${
                isActive(
                  "/transactions"
                )
                  ? "font-bold text-purple-600"
                  : "hover:text-purple-600"
              }`}
            >
              Transactions
            </button>
          )}

          {/* INBOX */}
          {isLoggedIn && !isOrganizer &&(
            <button
              onClick={() =>
                navigate("/inbox")
              }
              className={`${
                isActive("/inbox")
                  ? "font-bold text-purple-600"
                  : "hover:text-purple-600"
              }`}
            >
              Inbox
            </button>
          )}

          {/* MY EVENTS */}
          {isOrganizer && (
            <button
              onClick={() =>
                navigate(
                  "/my-events"
                )
              }
              className={`${
                isActive(
                  "/my-events"
                )
                  ? "font-bold text-purple-600"
                  : "hover:text-purple-600"
              }`}
            >
              My Events
            </button>
          )}

          {/* ORGANIZER TRANSACTIONS */}
          {isOrganizer && (
            <button
              onClick={() =>
                navigate(
                  "/organizer-transactions"
                )
              }
              className={`${
                isActive(
                  "/organizer-transactions"
                )
                  ? "font-bold text-purple-600"
                  : "hover:text-purple-600"
              }`}
            >
              Organizer Transactions
            </button>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() =>
                  navigate("/login")
                }
                className="font-medium hover:text-purple-600"
              >
                Login
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/register"
                  )
                }
                className="bg-purple-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-purple-700 transition"
              >
                Register
              </button>
            </>
          ) : (
            <>
              {isOrganizer && (
                <button
                  onClick={() =>
                    navigate(
                      "/create"
                    )
                  }
                  className="bg-purple-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-purple-700 transition"
                >
                  + Create Event
                </button>
              )}

              <button
                onClick={
                  handleLogout
                }
                className="border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-2xl"
          onClick={() =>
            setOpen(!open)
          }
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-6 pb-4 space-y-3 bg-white shadow">
          <button
            onClick={() => {
              navigate("/");
              setOpen(false);
            }}
            className={`block w-full text-left ${
              isActive("/")
                ? "font-bold text-purple-600"
                : ""
            }`}
          >
            Home
          </button>

          <button
            onClick={() => {
              navigate("/events");
              setOpen(false);
            }}
            className={`block w-full text-left ${
              isActive(
                "/events"
              )
                ? "font-bold text-purple-600"
                : ""
            }`}
          >
            Events
          </button>

          {isLoggedIn && !isOrganizer &&(
            <button
              onClick={() => {
                navigate(
                  "/transactions"
                );
                setOpen(false);
              }}
              className={`block w-full text-left ${
                isActive(
                  "/transactions"
                )
                  ? "font-bold text-purple-600"
                  : ""
              }`}
            >
              Transactions
            </button>
          )}

          {isLoggedIn && !isOrganizer &&(
            <button
              onClick={() => {
                navigate(
                  "/inbox"
                );
                setOpen(false);
              }}
              className={`block w-full text-left ${
                isActive("/inbox")
                  ? "font-bold text-purple-600"
                  : ""
              }`}
            >
              Inbox
            </button>
          )}

          {isOrganizer && (
            <button
              onClick={() => {
                navigate(
                  "/my-events"
                );
                setOpen(false);
              }}
              className={`block w-full text-left ${
                isActive(
                  "/my-events"
                )
                  ? "font-bold text-purple-600"
                  : ""
              }`}
            >
              My Events
            </button>
          )}

          {isOrganizer && (
            <button
              onClick={() => {
                navigate(
                  "/organizer-transactions"
                );
                setOpen(false);
              }}
              className={`block w-full text-left ${
                isActive(
                  "/organizer-transactions"
                )
                  ? "font-bold text-purple-600"
                  : ""
              }`}
            >
              Organizer Transactions
            </button>
          )}

          {!isLoggedIn ? (
            <>
              <button
                onClick={() => {
                  navigate("/login");
                  setOpen(false);
                }}
                className="block w-full text-left"
              >
                Login
              </button>

              <button
                onClick={() => {
                  navigate(
                    "/register"
                  );
                  setOpen(false);
                }}
                className="w-full bg-purple-600 text-white py-2 rounded-full"
              >
                Register
              </button>
            </>
          ) : (
            <>
              {isOrganizer && (
                <button
                  onClick={() => {
                    navigate(
                      "/create"
                    );
                    setOpen(false);
                  }}
                  className="w-full bg-purple-600 text-white py-2 rounded-full"
                >
                  + Create Event
                </button>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="w-full border border-gray-300 py-2 rounded-full"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;