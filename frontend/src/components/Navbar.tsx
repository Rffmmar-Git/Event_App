import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState } from "react";

function Navbar() {
  /* HOOKS */
  const navigate = useNavigate();
  const location = useLocation();

  /* STATES */
  const [open, setOpen] =
    useState(false);

  /* ACTIVE ROUTE */
  const isActive = (
    path: string
  ) => location.pathname === path;

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

          {/* INBOX */}
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
        </div>

        {/* CREATE EVENT BUTTON */}
        <button
          onClick={() =>
            navigate("/create")
          }
          className="hidden md:block bg-purple-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-purple-700 transition"
        >
          + Create Event
        </button>

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

          {/* HOME */}
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

          {/* EVENTS */}
          <button
            onClick={() => {
              navigate("/events");
              setOpen(false);
            }}
            className={`block w-full text-left ${
              isActive("/events")
                ? "font-bold text-purple-600"
                : ""
            }`}
          >
            Events
          </button>

          {/* TRANSACTIONS */}
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

          {/* INBOX */}
          <button
            onClick={() => {
              navigate("/inbox");
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

          {/* CREATE EVENT */}
          <button
            onClick={() => {
              navigate("/create");
              setOpen(false);
            }}
            className="w-full bg-purple-600 text-white py-2 rounded-full mt-2 hover:bg-purple-700 transition"
          >
            + Create Event
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;