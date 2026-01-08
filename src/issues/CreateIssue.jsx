import { useEffect, useState, useMemo } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";

function CreateIssue() {
  const MAX_TITLE = 100;
  const MAX_DESC = 1000;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [assignedTo, setAssignedTo] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' | 'error'
  const [existingIssues, setExistingIssues] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOverride, setConfirmOverride] = useState(false);

  // Fetch existing issues once
  useEffect(() => {
    const fetchIssues = async () => {
      const snapshot = await getDocs(collection(db, "issues"));
      const issues = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setExistingIssues(issues);
    };

    fetchIssues();
  }, []);

  const stopWords = ["for", "the", "is", "to", "and", "a", "of", "in", "on", "with", "issue"];

  const parseWords = (text) =>
    text
      .toLowerCase()
      .split(/\s+/)
      .map((w) => w.replace(/[^a-z0-9]/g, ""))
      .filter((w) => w && !stopWords.includes(w));

  const getSimilarMatches = (newTitle) => {
    const newWords = parseWords(newTitle);
    if (!newWords.length) return [];
    return existingIssues.filter((issue) => {
      const existingWords = parseWords(issue.title || "");
      const common = newWords.filter((w) => existingWords.includes(w));
      return common.length >= 2;
    });
  };

  const similarMatches = useMemo(() => getSimilarMatches(title), [title, existingIssues]);

  const validate = () => {
    const errors = {};
    if (title.trim().length < 5) errors.title = "Title should be at least 5 characters.";
    if (title.length > MAX_TITLE) errors.title = `Title must be <= ${MAX_TITLE} characters.`;
    if (description.trim().length < 10) errors.description = "Please add more detail to the description.";
    if (description.length > MAX_DESC) errors.description = `Description must be <= ${MAX_DESC} characters.`;
    return errors;
  };

  const errors = validate();
  const isFormValid = Object.keys(errors).length === 0 && title.trim() && description.trim() && (!similarMatches.length || confirmOverride);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (similarMatches.length && !confirmOverride) {
      setMessage("Similar issues found; please confirm to create anyway.");
      setMessageType("error");
      return;
    }

    if (!isFormValid) {
      setMessage("Fix validation errors before submitting.");
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "issues"), {
        title,
        description,
        priority,
        status: "Open",
        assignedTo,
        createdBy: auth.currentUser?.email || "anonymous",
        createdAt: serverTimestamp(),
      });

      setMessage("Issue created successfully ✅");
      setMessageType("success");

      setTitle("");
      setDescription("");
      setPriority("Low");
      setAssignedTo("");
      setConfirmOverride(false);

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3500);
    } catch (error) {
      setMessage("Error creating issue ❌");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-issue-card" aria-live="polite">
      <h3>Create Issue</h3>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <label className="field-label" htmlFor="title">
            Title <span className="char-count">{title.length}/{MAX_TITLE}</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="Short, descriptive title"
            value={title}
            maxLength={MAX_TITLE}
            onChange={(e) => setTitle(e.target.value)}
            aria-describedby="title-desc"
            required
          />
          <div id="title-desc" className="hint">{errors.title || "Keep it short and descriptive."}</div>
        </div>

        <div className="form-row">
          <label className="field-label" htmlFor="description">
            Description <span className="char-count">{description.length}/{MAX_DESC}</span>
          </label>
          <textarea
            id="description"
            placeholder="Describe steps to reproduce, expected vs actual behaviour, screenshots, logs..."
            value={description}
            maxLength={MAX_DESC}
            onChange={(e) => setDescription(e.target.value)}
            aria-describedby="desc-desc"
            rows={6}
            required
          />
          <div id="desc-desc" className="hint">{errors.description || "Include enough detail so someone else can reproduce the issue."}</div>
        </div>

        <div className="form-row">
          <label className="field-label" htmlFor="priority">Priority</label>
          <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className="form-row">
          <label className="field-label" htmlFor="assignedTo">Assigned To</label>
          <input
            id="assignedTo"
            type="text"
            placeholder="Email or team member name (optional)"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />
        </div>

        {similarMatches.length > 0 && (
          <div className="similar-box" role="alert" aria-live="assertive">
            <strong>Similar issues found ({similarMatches.length})</strong>
            <ul>
              {similarMatches.slice(0, 5).map((m) => (
                <li key={m.id}>{m.title} <span className="hint">— {m.description?.slice(0,120)}</span></li>
              ))}
            </ul>

            <label style={{display: "block", marginTop: 8}}>
              <input
                type="checkbox"
                checked={confirmOverride}
                onChange={(e) => setConfirmOverride(e.target.checked)}
              /> I understand and want to create a new issue anyway
            </label>
          </div>
        )}

        <div className="button-row">
          <button type="submit" disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Issue"}
          </button>
          <button type="button" onClick={() => { setTitle(""); setDescription(""); setPriority("Low"); setAssignedTo(""); setConfirmOverride(false); setMessage(""); setMessageType(""); }}>
            Reset
          </button>
        </div>
      </form>

      {message && (
        <div className={messageType === "success" ? "message-success" : "message-error"} role="status">
          {message}
        </div>
      )}
    </div>
  );
}

export default CreateIssue;
