import { Routes, Route } from "react-router-dom";

export function App() {
  return (
    <Routes>
      <Route index element={<div>hello</div>} />
    </Routes>
  );
}
