import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import WorkflowList from "./pages/WorkflowList";
import WorkflowEditor from "./pages/WorkflowEditor";
import CreateWorkflow from "./pages/CreateWorkflow";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen overflow-clip bg-gray-50">
        <Routes>
          <Route path="/" element={<WorkflowList />} />
          <Route path="/editor/:id" element={<WorkflowEditor />} />
          <Route path="/create" element={<CreateWorkflow />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
