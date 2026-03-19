import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/userService";

function Settings() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then(data => setUser(data))
      .catch(err => console.log(err));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Settings</h2>

      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>User ID:</b> {user.id}</p>
    </div>
  );
}

export default Settings;