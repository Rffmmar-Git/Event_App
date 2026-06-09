import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
import TransactionHistory from "./pages/TransactionHistory";
import Inbox from "./pages/Inbox";
import ETicket from "./pages/ETicket";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetail />} />

      <Route path="/create" element={<CreateEvent />} />

      <Route
        path="/transactions"
        element={<TransactionHistory />}
      />

      <Route
        path="/inbox"
        element={<Inbox />}
      />

      <Route
        path="/eticket/:id"
        element={<ETicket />}
      />
    </Routes>
  );
}

export default App;