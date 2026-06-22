import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
import TransactionHistory from "./pages/TransactionHistory";
import Inbox from "./pages/Inbox";
import ETicket from "./pages/ETicket";
import MyEvents from "./pages/MyEvents";
import ProtectedRoute from "./routes/ProtectedRoute";
import OrganizerRoute from "./routes/OrganizerRoute";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/register" element={<Register />} />

      <Route path="/login" element={<Login />} />

      <Route path="/" element={<Home />} />

      <Route path="/events" element={<Events />} />

      <Route path="/events/:id" element={<EventDetail />} />

      {/* ORGANIZER ONLY */}
      <Route
        path="/create"
        element={
          <OrganizerRoute>
            <CreateEvent />
          </OrganizerRoute>
        }
      />

      <Route
        path="/my-events"
        element={
          <OrganizerRoute>
            <MyEvents />
          </OrganizerRoute>
        }
      />

      {/* LOGGED IN USERS ONLY */}
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <TransactionHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inbox"
        element={
          <ProtectedRoute>
            <Inbox />
          </ProtectedRoute>
        }
      />

      <Route
        path="/eticket/:id"
        element={
          <ProtectedRoute>
            <ETicket />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;