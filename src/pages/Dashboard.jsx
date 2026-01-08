import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import CreateIssue from "../issues/CreateIssue";
import IssueList from "../issues/IssueList";

function Dashboard() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <p>
        Logged in as: <strong>{user?.email}</strong>
      </p>

      <button onClick={handleLogout}>Logout</button>

      <hr />

      <CreateIssue />

      <hr />

      <IssueList />
    </div>
  );
}

export default Dashboard;
