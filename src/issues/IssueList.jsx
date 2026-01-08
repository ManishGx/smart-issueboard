import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

function IssueList() {
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => {
    const q = query(
      collection(db, "issues"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const issueData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIssues(issueData);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (issueId, currentStatus, newStatus) => {
    // 🚫 Rule: Open → Done is not allowed
    if (currentStatus === "Open" && newStatus === "Done") {
      alert(
        "You cannot move an issue directly from Open to Done. Please move it to In Progress first 🙂"
      );
      return;
    }

    try {
      const issueRef = doc(db, "issues", issueId);
      await updateDoc(issueRef, {
        status: newStatus,
      });
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const statusMatch =
      statusFilter === "All" || issue.status === statusFilter;
    const priorityMatch =
      priorityFilter === "All" || issue.priority === priorityFilter;

    return statusMatch && priorityMatch;
  });

  return (
    <div>
      <h3>Issues</h3>

      {/* Filters */}
      <div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <ul>
        {filteredIssues.map((issue) => (
          <li key={issue.id} style={{ marginBottom: "15px" }}>
            <strong>{issue.title}</strong>
            <br />
            {issue.description}
            <br />
            Priority: {issue.priority}
            <br />

            Status:
            <select
              value={issue.status}
              onChange={(e) =>
                handleStatusChange(
                  issue.id,
                  issue.status,
                  e.target.value
                )
              }
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>

            <br />
            Assigned To: {issue.assignedTo || "Unassigned"}
            <br />
            Created By: {issue.createdBy}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IssueList;
