import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);

  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assetType, setAssetType] = useState("PHOTO");
  const [visibility, setVisibility] = useState("PRIVATE");
  const [status, setStatus] = useState("DRAFT");
  const [ownerId, setOwnerId] = useState("");
  const [file, setFile] = useState(null);

  const loadUsers = () => {
    fetch("http://localhost:8080/api/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  };

  const loadAssets = () => {
    fetch("http://localhost:8080/api/assets")
      .then(res => res.json())
      .then(data => setAssets(data));
  };

  useEffect(() => {
    loadUsers();
    loadAssets();
  }, []);

  const createUser = () => {
    fetch("http://localhost:8080/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        email: userEmail
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to create user");
        }
        return res.json();
      })
      .then(() => {
        setUsername("");
        setUserEmail("");
        loadUsers();
      })
      .catch(err => console.error(err));
  };

  const createAsset = () => {
    fetch("http://localhost:8080/api/assets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        description: description,
        assetType: assetType,
        visibility: visibility,
        status: status,
        ownerId: Number(ownerId)
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to create asset");
        }
        return res.json();
      })
      .then(() => {
        setTitle("");
        setDescription("");
        setAssetType("PHOTO");
        setVisibility("PRIVATE");
        setStatus("DRAFT");
        setOwnerId("");
        loadAssets();
      })
      .catch(err => console.error(err));
  };

  const uploadFile = (assetId) => {

    if (!file) {
      alert("Select file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch(`http://localhost:8080/api/assets/${assetId}/upload`, {
      method: "POST",
      body: formData
    })
        .then(res => {
          if (!res.ok) {
            throw new Error("Upload failed");
          }
          return res.json();
        })
        .then(() => {
          setFile(null);
          loadAssets();
        })
        .catch(err => console.error(err));
  };

  const downloadFile = (assetId) => {
    window.open(`http://localhost:8080/api/assets/${assetId}/download`, "_blank");
  };

  return (
    <div className="container">
      <h1 className="title">Penumbra UI</h1>

      <div className="grid">
        <div className="card">
          <h2 className="section-title">Create User</h2>

          <div className="form">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
            />

            <input
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="email"
            />

            <button onClick={createUser}>Create User</button>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Create Asset</h2>

          <div className="form">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="title"
            />

            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="description"
            />

            <select value={assetType} onChange={(e) => setAssetType(e.target.value)}>
              <option value="PHOTO">PHOTO</option>
              <option value="ILLUSTRATION">ILLUSTRATION</option>
              <option value="VIDEO">VIDEO</option>
            </select>

            <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
              <option value="PRIVATE">PRIVATE</option>
              <option value="PUBLIC">PUBLIC</option>
            </select>

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="DRAFT">DRAFT</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>

            <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
              <option value="">Select owner</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.id} - {user.username}
                </option>
              ))}
            </select>

            <button onClick={createAsset}>Create Asset</button>
          </div>
        </div>

        <div className="card full-width">
          <h2 className="section-title">Users</h2>

          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card full-width">
          <h2 className="section-title">Assets</h2>

          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Owner</th>
                <th>Storage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id}>
                  <td>{asset.id}</td>
                  <td>{asset.title}</td>
                  <td>{asset.ownerUsername || "none"}</td>
                  <td>{asset.storageKey ? "uploaded" : "not uploaded"}</td>
                  <td>
                    <div className="actions">
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                      />

                      <button
                        className="secondary-button"
                        onClick={() => uploadFile(asset.id)}
                      >
                        Upload
                      </button>

                      {asset.storageKey && (
                        <button onClick={() => downloadFile(asset.id)}>
                          Download
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;