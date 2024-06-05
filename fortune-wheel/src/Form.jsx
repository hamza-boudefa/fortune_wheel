// // src/App.js
// import React, { useState } from 'react';
// import './App.css';
// import FacebookLogin from 'react-facebook-login';
// import FortuneWheel from './FortuneWheel';

// function App() {
//   const [showWheel, setShowWheel] = useState(false);
//   const [message, setMessage] = useState('');

//   const handleLogin = (response) => {
//     console.log("Facebook login response:", response);
//     if (response.accessToken) {
//       checkIfUserLikedPage(response.accessToken);
//     } else {
//       console.error("Facebook login failed. Response:", response);
//       setMessage('Il semble que cette application ne soit pas disponible. Pour résoudre ce problème, veuillez contacter fortune.');
//     }
//   };

//   const checkIfUserLikedPage = (accessToken) => {
//     const pageId = '114020590462603'; // Replace with your Facebook page ID
//     fetch(`https://graph.facebook.com/me/likes/${pageId}?access_token=${accessToken}`)
//       .then(response => response.json())
//       .then(data => {
//         if (data.data && data.data.length > 0) {
//           setShowWheel(true);
//         } else {
//           setMessage('You must like our Facebook page to participate in the wheel of fortune.');
//         }
//       })
//       .catch(error => {
//         console.error('Error checking page like:', error);
//         setMessage('An error occurred while checking your page like status. Please try again.');
//       });
//   };

//   const handleFormSubmit = (event) => {
//     event.preventDefault();
//     const clientMicrocred = event.target.clientMicrocred.value;
//     if (clientMicrocred === 'yes') {
//       setShowWheel(true);
//     } else {
//       setMessage('Dommage, nous espérons que vous gagnerez dans un prochain jeu, Aidek Mabrouk');
//     }
//   };

//   const handleSpinEnd = (label) => {
//     setMessage(`Félicitations, vous avez gagné ${label}!`);
//   };

//   return (
//     <div className="container">
//       <h1>Tombola Spéciale Aid Al Adha</h1>
//       <form onSubmit={handleFormSubmit} className={showWheel || message ? 'hidden' : ''}>
//         <div>
//           <label htmlFor="firstName">Prénom:</label>
//           <input type="text" id="firstName" name="firstName" required />
//         </div>
//         <div>
//           <label htmlFor="lastName">Nom:</label>
//           <input type="text" id="lastName" name="lastName" required />
//         </div>
//         <div>
//           <label htmlFor="activity">Activité:</label>
//           <input type="text" id="activity" name="activity" required />
//         </div>
//         <div>
//           <label htmlFor="address">Adresse:</label>
//           <input type="text" id="address" name="address" required />
//         </div>
//         <div>
//           <label htmlFor="phone">N° de téléphone:</label>
//           <input type="tel" id="phone" name="phone" required />
//         </div>
//         <div>
//           <label htmlFor="clientMicrocred">Client Microcred:</label>
//           <select id="clientMicrocred" name="clientMicrocred" required>
//             <option value="yes">Oui</option>
//             <option value="no">Non</option>
//           </select>
//         </div>
//         <div>
//           <label htmlFor="cin">N° CIN:</label>
//           <input type="text" id="cin" name="cin" required />
//         </div>
//         <div>
//           <input type="checkbox" id="consentData" name="consentData" required />
//           <label htmlFor="consentData">Consentir à partager avec nous ses données personnelles sus citées</label>
//         </div>
//         <div>
//           <input type="checkbox" id="consentRules" name="consentRules" required />
//           <label htmlFor="consentRules">Consentir au règlement du jeu concours</label>
//         </div>
//         <FacebookLogin
//           appId="975298964177880"
//           autoLoad={false}
//           fields="name,email,picture"
//           scope="user_likes"
//           callback={handleLogin}
//           textButton="Login with Facebook"
//           cssClass="my-facebook-button-class"
//         />
//         <button type="submit">Participer</button> 
//       </form>
//       {showWheel && <FortuneWheel onSpinEnd={handleSpinEnd} />}
//       {message && <div id="message">{message}</div>}
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import './App.css';
import FacebookLogin from 'react-facebook-login';
import FortuneWheel from './FortuneWheel';
import gift from './gift.png';
import axios from 'axios';
import { environment } from './environment';

const instagramClientId = '1467940277144991';
const redirectUri = environment.frontURL;

function Form() {
  const [showWheel, setShowWheel] = useState(false);
  const [message, setMessage] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [facebookPostShared, setFacebookPostShared] = useState(false);
  const [userData, setUserData] = useState({});
const [postText, setPostText] = useState('')
const [pageId, setpageId] = useState('')
console.log(pageId)
  const post=async()=>{
try {
    const {data}=  await  axios.get(`${environment.apiURL}/getKeyword`)
setPostText(data.keywords)
} catch (error) {
    console.log(error)
}
  }
  const getId=async()=>{
try {
    const {data}=  await  axios.get(`${environment.apiURL}/getPageId`)
    setpageId(data.pageId)
} catch (error) {
    console.log(error)
}
  }
  useEffect(() => {
    post()
    getId()
    const referrer = document.referrer;
    if (referrer.includes('facebook.com')) {
      setReferralSource('facebook');
    } else if (referrer.includes('instagram.com')) {
      setReferralSource('instagram');
    }
    handleAuthRedirect();
  }, []);

  const handleAuthRedirect = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (referralSource === 'instagram' && code) {
      fetch(`${environment.apiURL}/instagram-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            checkIfUserFollowsInstagram(data.access_token);
          } else {
            setMessage('Instagram login failed. Please try again.');
          }
        })
        .catch((error) => {
          console.error('Error during Instagram login:', error);
          setMessage('An error occurred during Instagram login. Please try again.');
        });
    }
  };

  const checkIfUserFollowsInstagram = (accessToken) => {
    fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setShowWheel(true);
        } else {
          setMessage('You must follow our Instagram page to participate in the wheel of fortune.');
        }
      })
      .catch((error) => {
        console.error('Error checking Instagram follow status:', error);
        setMessage('An error occurred while checking your follow status. Please try again.');
      });
  };

  const handleFacebookLogin = (response) => {
    if (response.accessToken) {
      checkIfUserLikedPage(response.accessToken);
    } else {
      console.error('Facebook login failed. Response:', response);
      setMessage('Il semble que cette application ne soit pas disponible. Pour résoudre ce problème, veuillez contacter fortune.');
    }
  };

  const checkIfUserLikedPage = (accessToken) => {
    console.log(accessToken);
    const pageId = pageId;
    
    fetch(`https://graph.facebook.com/me/likes/${pageId}?access_token=${accessToken}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        if (data.data && data.data.length > 0) {
          checkIfUserSharedPost(accessToken);
        } else {
          setMessage('You must like our Facebook page to participate in the wheel of fortune.');
        }
      })
      .catch(error => {
        console.error('Error checking page like:', error);
        setMessage('An error occurred while checking your page like status. Please try again.');
      });
  };

  const checkIfUserSharedPost = (accessToken) => {
    const keywords=postText;
    fetch(`https://graph.facebook.com/me/feed?fields=message,description&access_token=${accessToken}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const sharedPost = data.data.find((post) => {
          console.log(post.description);
          const foundKeywords = keywords.split(' ').map((el) => post.description.includes(el));
          const isShared = foundKeywords.includes(true);
          return isShared;
        });

        if (sharedPost) {
          setFacebookPostShared(true);
          setShowWheel(true);
        } else {
          setMessage('You must share our Facebook post to participate in the wheel of fortune.');
        }
      })
      .catch((error) => {
        console.error('Error checking post share:', error);
        setMessage('An error occurred while checking your post share status. Please try again.');
      });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData.entries());
    setUserData(userData);

    if (userData.clientMicrocred === 'yes') {
      setShowWheel(true);
    } else {
      setMessage('Dommage, nous espérons que vous gagnerez dans un prochain jeu, Aidek Mabrouk');
    }
  };

  const handleSpinEnd = (label) => {
    setMessage(`Félicitations, vous avez gagné ${label}!`);
  };

  const handleLogin = () => {
    window.location.href = `https://api.instagram.com/oauth/authorize?client_id=${instagramClientId}&redirect_uri=${redirectUri}&scope=user_profile&response_type=code`;
  };

  return (
    <div className='main' id='main'>  
      <img src={gift} alt="" className='backgroundImg' />
      <img src={gift} alt="" className='backgroundImg1' />
      <img src={gift} alt="" className='backgroundImg2' />
      <img src={gift} alt="" className='backgroundImg3' />
      <img src={gift} alt="" className='backgroundImg4' />
      <img src={gift} alt="" className='backgroundImg5' />
      <div className="container">
        <img style={{width:"150px"}} src="https://upload.wikimedia.org/wikipedia/commons/5/59/Logo_Microcred_2014.png" alt="Microcred Logo" className="logo" />
        <h1 style={{color:'white',zIndex:"9", textShadow:'1px 1px 2px black'}}>Tombola Spéciale Aid Al Adha</h1>
        <form onSubmit={handleFormSubmit} className={showWheel || message ? 'hidden' : ''}>
          <div>
            <label htmlFor="firstName">Prénom:</label>
            <input type="text" id="firstName" name="firstName" required />
          </div>
          <div>
            <label htmlFor="lastName">Nom:</label>
            <input type="text" id="lastName" name="lastName" required />
          </div>
          <div>
            <label htmlFor="activity">Activité:</label>
            <input type="text" id="activity" name="activity" required />
          </div>
          <div>
            <label htmlFor="address">Adresse:</label>
            <input type="text" id="address" name="address" required />
          </div>
          <div>
            <label htmlFor="phone">N° de téléphone:</label>
            <input type="tel" id="phone" name="phone" required />
          </div>
          <div>
            <label htmlFor="clientMicrocred">Client Microcred:</label>
            <select id="clientMicrocred" name="clientMicrocred" required>
              <option value="yes">Oui</option>
              <option value="no">Non</option>
            </select>
          </div>
          <div>
            <label htmlFor="cin">N° CIN:</label>
            <input type="text" id="cin" name="cin" required />
          </div>
          <div>
            <input type="checkbox" id="consentData" name="consentData" required />
            <label htmlFor="consentData">Consentir à partager avec nous ses données personnelles sus citées</label>
          </div>
          <div>
            <input type="checkbox" id="consentRules" name="consentRules" required />
            <label htmlFor="consentRules">Consentir au règlement du jeu concours</label>
          </div>
          {referralSource === 'facebook' && (
            <>
              <FacebookLogin
                appId="975298964177880"
                autoLoad={true}
                fields="name,email,picture"
                scope="user_likes,user_posts"
                callback={handleFacebookLogin}
                textButton="Login with Facebook"
                cssClass="my-facebook-button-class"
              />
              {facebookPostShared && <button type="submit">Participer</button>}
            </>
          )}
          {referralSource === 'instagram' && (
            <button type="button" onClick={handleLogin} className="my-instagram-button-class">
              Login with Instagram
            </button>
          )}
          {!referralSource && (
            <button type="submit">Participer</button>
          )}
        </form>
        {showWheel && <FortuneWheel onSpinEnd={handleSpinEnd} userData={userData} />}
        {message && <div id="message">{message}</div>}
      </div>
    </div>
  );
}

export default Form;
