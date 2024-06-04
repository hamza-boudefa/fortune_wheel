import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UsersList.css';


function UsersList() {
  const [users, setUsers] = useState([]);
  const [randomUser, setRandomUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:3000/get_users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const pickRandomUser = () => {
    const eligibleUsers = users.filter(user => user.clientMicrocred !== 'no');
    if (eligibleUsers.length === 0) {
      alert('No eligible users to pick from.');
      return;
    }
    const randomIndex = Math.floor(Math.random() * eligibleUsers.length);
    setRandomUser(eligibleUsers[randomIndex]);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setShowPopup(true);
    }, 2000);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
{loading &&     <span class="loader"></span>
}
<div style={{display:'flex',justifyContent:'center'}} >
<button onClick={pickRandomUser}>Tirage</button>

</div>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>address</th>
            <th>clientMicrocred</th>
            <th>cin</th>
            <th>activity</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.phone}</td>
              <td>{user.address}</td>
              <td>{user.clientMicrocred}</td>
              <td>{user.cin}</td>
              <td>{user.activity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>&times;</span>
            <div className="user-card">
              <h2>felicitations!</h2>
              <p><strong>Prenom:</strong> {randomUser.firstName}</p>
              <p><strong>Nom:</strong> {randomUser.lastName}</p>
              <p><strong>CIN:</strong> {randomUser.cin}</p>
              <p><strong>Tel:</strong> {randomUser.phone}</p>
              <p>a gagné le tirage au sort!</p>
            </div>
             </div>
        </div>
      )}
    </div>
  );
}

export default UsersList;
