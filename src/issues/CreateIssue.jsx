import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";

function CreateIssue() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [assignedTo, setAssignedTo] = useState("");
  const [message, setMessage] = useState("");
  const [existingIssues, setExistingIssues] = useState([]);

  // 🔹 Fetch existing issues once
  useEffect(() => {
    const fetchIssues = async () => {
      const snapshot = await getDocs(collection(db, "issues"));
      const issues = snapshot.docs.map((doc) => doc.data());
      setExistingIssues(issues);
    };

    fetchIssues();
  }, []);

  // 🔹 Simple similarity check
  const isSimilarIssue = (newTitle) => {
    const stopWords = ["for", "the", "is", "to", "and", "a", "of", "in"];
    const newWords = newTitle
  .toLowerCase()
  .split(" ")
  .filter(word => !stopWords.includes(word));


    return existingIssues.some((issue) => {
      const existingWords = issue.title
  .toLowerCase()
  .split(" ")
  .filter(word => !stopWords.includes(word));

      const commonWords = newWords.filter((word) =>
        existingWords.includes(word)
      );
      return commonWords.length >= 2;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // 🔥 Similar issue detection
    if (isSimilarIssue(title)) {
      const confirmCreate = window.confirm(
        "Similar issues already exist. Are you sure you want to create a new one?"
      );
      if (!confirmCreate) return;
    }

    try {
      await addDoc(collection(db, "issues"), {
        title,
        description,
        priority,
        status: "Open",
        assignedTo,
        createdBy: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });

      setMessage("Issue created successfully ✅");

      setTitle("");
      setDescription("");
      setPriority("Low");
      setAssignedTo("");
    } catch (error) {
      setMessage("Error creating issue ❌");
    }
  };

  return (
    <div>
      <h3>Create Issue</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br />

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <br />

        <input
          type="text"
          placeholder="Assigned To (email or name)"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        />
        <br />

        <button type="submit">Create Issue</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateIssue;
