import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function MainLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />

      <div className="main-container">
        <Sidebar />
        <main className="content-wrapper">
          {children}
        </main>
      </div>

      <footer className="app-footer">
        <p>© 2026 TrainPulse Enterprise Railway System. All rights reserved. | Indian Railways Operations Control Platform</p>
      </footer>
    </div>
  );
}

export default MainLayout;