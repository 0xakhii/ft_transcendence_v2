let allUsers = [];
let lastRequestTime = 0;
let flag = 0
import { PongGame, setCurrentGame } from "./three";
// document.addEventListener("DOMContentLoaded", () => {
//     const pages = {
//         signIn: `
//             <div class="main">
//                 <div class="border-up">
//                     <img class="logo" src="images/Pongify_logo.png">
//                     <h2>WELCOME</h2>
//                     <p>Login with your 42 Network account or use your own email and password</p>
//                 </div>
//                 <div class="border-bottom">
//                     <form id="login-form">
//                         <input id="login-username" type="text" class="brd" placeholder="Username"><br>
//                         <input id="login-password" type="password" class="brd" placeholder="Password">
//                         <p class="error-msg" style="color: red;"></p>
//                         <button class="btn" type="submit">Login</button>
//                     </form>
//                     <button class="btn2"><img src="images/42.png">Network</button>
//                     <a href="#" id="go-to-sign-up">Create Account</a>
//                 </div>
//             </div>
//         `,
//         signUp: `
//             <div class="main">
//                 <div class="border-up">
//                     <img class="logo" src="images/Pongify_logo.png">
//                     <h2>WELCOME</h2>
//                     <p>Login with your 42 Network account or use your own email and password</p>
//                 </div>
//                 <div class="border-bottom">
//                     <form id="signup-form">
//                         <input id="username" type="text" class="brd" placeholder="Username">
//                         <input id="email" type="email" class="brd" placeholder="Email">
//                         <input id="password" type="password" class="brd" placeholder="Password">
//                         <input id="first_name" type="text" class="brd" placeholder="First name">
//                         <input id="last_name" type="text" class="brd" placeholder="Last name">
//                         <button class="btn" type="submit">Sign Up</button>
//                     </form>
//                     <button class="btn2"><img src="images/42.png">Network</button>
//                 </div>
//             </div>
//         `,
//         dashboard: `
//             <div class="main">
//                 <div class="header">
//                     <img class="logo" src="images/Pongify_logo.png" >
//                     <div class="test">
//                         <a href="#" data-page="home" class="active">HOME</a>
//                         <a href="#" data-page="profile">PROFILE</a>
//                         <a href="#" data-page="game">GAME</a>
//                         <a href="#" data-page="tournament">TOURNAMENT</a>
//                         <a href="#" data-page="chat">CHAT</a>
//                         <a href="#" data-page="settings">SETTINGS</a>
//                     </div>
//                 </div>
//             </div>
//         `,
//         profile: `
//             <link rel="stylesheet" href="profile.css">
//             <div class="profile-container">
//                 <div class="profile-info">
//                     <img class="profile-border" src="profile imgs/main_profile_window.png" alt="Profile Border">
//                     <img id="profile-img" class="profile-img" src="profile imgs/placeholder.png" alt="Profile Image">
//                     <h2 id="profile-username">Username</h2>
//                 </div>
//                 <div class="profile-stats">
//                     <img class="stats-border wins" src="profile imgs/level_and_wins_window.png" alt="Wins">
//                     <img class="stats-border level" src="profile imgs/level_and_wins_window.png" alt="Level">
//                 </div>
//                 <div class="match-history">
//                     <img class="match-history-border" src="profile imgs/match_history_window.png" alt="Match History">
//                 </div>
//             </div>
//         `,
//     };

//     function loadCSS(fileName) {
//         const existingLink = document.getElementById('dynamic-css');
//         if (existingLink) existingLink.remove();

//         const link = document.createElement('link');
//         link.id = 'dynamic-css';
//         link.rel = 'stylesheet';
//         link.href = fileName;
//         document.head.appendChild(link);
//     }

//     function navigateTo(route) {
//         window.location.hash = route; // Use hash-based routing
//         renderPage(route);
//     }

//     function renderPage(route) {
//         const app = document.getElementById('app');
//         switch (route) {
//             case '#/sign-in':
//                 app.innerHTML = pages.signIn;
//                 loadCSS('style2.css');
//                 setupSignIn();
//                 break;
//             case '#/sign-up':
//                 app.innerHTML = pages.signUp;
//                 loadCSS('sign-up-page.css');
//                 setupSignUp();
//                 break;
//             case '#/dashboard':
//                 app.innerHTML = pages.home;
//                 loadCSS('dashboard.css');
//                 break;
//             case '#/profile':
//                 app.innerHTML = pages.profile;
//                 loadCSS('profile.css');
//                 loadProfileInfo();
//                 break;
//             default:
//                 app.innerHTML = pages.signIn;
//                 loadCSS('style2.css');
//                 setupSignIn();
//                 break;
//         }
//     }

//     // Initialize page based on hash
//     // window.addEventListener('hashchange', () => {
//     // renderPage(window.location.hash);
//     // function navigateTo(route) {
//     //     window.history.pushState({}, '', route);
//     //     renderPage(route);
//     // }

//     function setupSignIn() {
//         const loginForm = document.getElementById('login-form');
//         const goToSignUp = document.getElementById('go-to-sign-up');
//         const errorMsg = document.querySelector('.error-msg');

//         goToSignUp.addEventListener('click', (e) => {
//             e.preventDefault();
//             navigateTo('/sign-up');
//         });

//         loginForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             // const username = document.getElementById('login-username').value.trim();
//             // const password = document.getElementById('login-password').value.trim();

//             // errorMsg.textContent = '';
//             // if (!username || !password) {
//             //     errorMsg.textContent = 'Username and password are required!';
//             //     return;
//             // }

//             // try {
//             //     const response = await fetch('http://127.0.0.1:8000/login/', {
//             //         method: 'POST',
//             //         headers: { 'Content-Type': 'application/json' },
//             //         body: JSON.stringify({ username, password }),
//                 // });
//             const username = document.querySelector('input[placeholder="Username"]').value.trim();
//             const password = document.querySelector('input[placeholder="Password"]').value.trim();
//             const errorMsg = document.querySelector('.error-msg');

//             // Clear any previous error message
//             errorMsg.style.display = 'none';
//             errorMsg.textContent = '';

//             if (!username || !password) {
//                 errorMsg.style.display = 'block';
//                 errorMsg.textContent = 'Username and password are required!';
//                 return;
//             }

//             try {
//                 const response = await fetch('http://127.0.0.1:8000/login/', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ username, password }),
//                 });


//                 if (response.ok) 
//                 {
//                     const data = await response.json();
//                     localStorage.setItem('authToken', data.access);
//                     navigateTo('/dashboard');
//                 } else {
//                     const errorData = await response.json();
//                     errorMsg.textContent = errorData.error || 'Invalid username or password';
//                 }
//             } catch (error) {
//                 console.error('Error during login:', error);
//                 errorMsg.textContent = 'Something went wrong. Please try again later.';
//             }
//         });
//     }

//     function setupSignUp() {
//         const signupForm = document.getElementById('signup-form');
//         signupForm.addEventListener('submit', async (e) => {
//             e.preventDefault();

//             const username = document.getElementById('username').value.trim();
//             const email = document.getElementById('email').value.trim();
//             const password = document.getElementById('password').value.trim();
//             const firstName = document.getElementById('first_name').value.trim();
//             const lastName = document.getElementById('last_name').value.trim();

//             try {
//                 const response = await fetch('http://127.0.0.1:8000/register/', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ username, email, password, first_name: firstName, last_name: lastName }),
//                 });

//                 if (response.ok) {
//                     navigateTo('/sign-in');
//                 } else {
//                     const errorData = await response.json();
//                     alert(errorData.error || 'Sign-up failed');
//                 }
//             } catch (error) {
//                 console.error('Error during sign-up:', error);
//                 alert('An error occurred. Please try again.');
//             }
//         });
//     }

//     async function loadProfileInfo() {
//         try {
//             const token = localStorage.getItem('authToken');
//             if (!token) return;

//             const response = await fetch('http://127.0.0.1:8000/profile/update/', {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 document.getElementById('profile-img').src = data.image?.link || 'default-avatar.png';
//                 document.getElementById('profile-username').innerText = data.login || 'Unknown User';
//             }
//         } catch (error) {
//             console.error('Error loading profile info:', error);
//         }
//     }

//     // window.onpopstate = () => renderPage(window.location.pathname);
//     renderPage(window.location.pathname);
//     renderPage(window.location.hash || '#/sign-in');
// });




//////////////////////////////////////////////////////////////////////////////////////////////////




// document.addEventListener("DOMContentLoaded", () => {
//     const pages = {
//         signIn: `
//             <div class="main">
//                 <div class="border-up">
//                     <img class="logo" src="images/Pongify_logo.png">
//                     <h2>WELCOME</h2>
//                     <p>Login with your 42 Network account or use your own email and password</p>
//                 </div>
//                 <div class="border-bottom">
//                     <form id="login-form">
//                         <input id="login-username" type="text" class="brd" placeholder="Username"><br>
//                         <input id="login-password" type="password" class="brd" placeholder="Password">
//                         <p class="error-msg" style="color: red;"></p>
//                         <button class="btn" type="submit">Login</button>
//                     </form>
//                     <button class="btn2"><img src="images/42.png">Network</button>
//                     <a href="#" id="go-to-sign-up">Create Account</a>
//                 </div>
//             </div>
//         `,
//         signUp: `
//             <div class="main">
//                 <div class="border-up">
//                     <img class="logo" src="images/Pongify_logo.png">
//                     <h2>WELCOME</h2>
//                     <p>Login with your 42 Network account or use your own email and password</p>
//                 </div>
//                 <div class="border-bottom">
//                     <form id="signup-form">
//                         <input id="username" type="text" class="brd" placeholder="Username">
//                         <input id="email" type="email" class="brd" placeholder="Email">
//                         <input id="password" type="password" class="brd" placeholder="Password">
//                         <input id="first_name" type="text" class="brd" placeholder="First name">
//                         <input id="last_name" type="text" class="brd" placeholder="Last name">
//                         <button class="btn" type="submit">Sign Up</button>
//                     </form>
//                     <button class="btn2"><img src="images/42.png">Network</button>
//                 </div>
//             </div>
//         `,
//         dashboard: `
//             <div class="main">
//                 <div class="header">
//                     <img class="logo" src="images/Pongify_logo.png" >
//                     <div class="test">
//                         <a href="#" data-page="home" class="active">HOME</a>
//                         <a href="#" data-page="profile">PROFILE</a>
//                         <a href="#" data-page="game">GAME</a>
//                         <a href="#" data-page="tournament">TOURNAMENT</a>
//                         <a href="#" data-page="chat">CHAT</a>
//                         <a href="#" data-page="settings">SETTINGS</a>
//                     </div>
//                 </div>
//             </div>
//         `,
//         profile: `
//             <link rel="stylesheet" href="profile.css">
//             <div class="profile-container">
//                 <div class="profile-info">
//                     <img class="profile-border" src="profile imgs/main_profile_window.png" alt="Profile Border">
//                     <img id="profile-img" class="profile-img" src="profile imgs/placeholder.png" alt="Profile Image">
//                     <h2 id="profile-username">Username</h2>
//                 </div>
//                 <div class="profile-stats">
//                     <img class="stats-border wins" src="profile imgs/level_and_wins_window.png" alt="Wins">
//                     <img class="stats-border level" src="profile imgs/level_and_wins_window.png" alt="Level">
//                 </div>
//                 <div class="match-history">
//                     <img class="match-history-border" src="profile imgs/match_history_window.png" alt="Match History">
//                 </div>
//             </div>
//         `,
//     };

//     function loadCSS(fileName) {
//         const existingLink = document.getElementById('dynamic-css');
//         if (existingLink) existingLink.remove();

//         const link = document.createElement('link');
//         link.id = 'dynamic-css';
//         link.rel = 'stylesheet';
//         link.href = fileName;
//         document.head.appendChild(link);
//     }

//     function navigateTo(route) {
//         window.history.pushState({}, '', route); // This will change the URL
//         renderPage(route); // Call renderPage after changing the URL
//     }

//     function renderPage(route) {
//         const app = document.getElementById('app');
//         switch (route) {
//             case '#/sign-in':
//                 app.innerHTML = pages.signIn;
//                 loadCSS('style2.css');
//                 setupSignIn();
//                 break;
//             case '#/sign-up':
//                 app.innerHTML = pages.signUp;
//                 loadCSS('sign-up-page.css');
//                 setupSignUp();
//                 break;
//             case '#/dashboard':
//                 app.innerHTML = pages.dashboard;
//                 loadCSS('dashboard.css');
//                 break;
//             case '#/profile':
//                 app.innerHTML = pages.profile;
//                 loadCSS('profile.css');
//                 loadProfileInfo();
//                 break;
//             default:
//                 app.innerHTML = pages.signIn;
//                 loadCSS('style2.css');
//                 setupSignIn();
//                 break;
//         }
//     }

//     function setupSignIn() {
//         const loginForm = document.getElementById('login-form');
//         const goToSignUp = document.getElementById('go-to-sign-up');
//         const errorMsg = document.querySelector('.error-msg');

//         goToSignUp.addEventListener('click', (e) => {
//             e.preventDefault();
//             navigateTo('#/sign-up');
//         });

//         loginForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             const username = document.querySelector('input[placeholder="Username"]').value.trim();
//             const password = document.querySelector('input[placeholder="Password"]').value.trim();
//             const errorMsg = document.querySelector('.error-msg');

//             // Clear any previous error message
//             errorMsg.style.display = 'none';
//             errorMsg.textContent = '';

//             if (!username || !password) {
//                 errorMsg.style.display = 'block';
//                 errorMsg.textContent = 'Username and password are required!';
//                 return;
//             }

//             try {
//                 const response = await fetch('http://127.0.0.1:8000/login/', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ username, password }),
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     localStorage.setItem('authToken', data.access);
//                     navigateTo('#/dashboard');
//                 } else {
//                     const errorData = await response.json();
//                     errorMsg.textContent = errorData.error || 'Invalid username or password';
//                 }
//             } catch (error) {
//                 console.error('Error during login:', error);
//                 errorMsg.textContent = 'Something went wrong. Please try again later.';
//             }
//         });
//     }

//     function setupSignUp() {
//         const signupForm = document.getElementById('signup-form');
//         signupForm.addEventListener('submit', async (e) => {
//             e.preventDefault();

//             const username = document.getElementById('username').value.trim();
//             const email = document.getElementById('email').value.trim();
//             const password = document.getElementById('password').value.trim();
//             const firstName = document.getElementById('first_name').value.trim();
//             const lastName = document.getElementById('last_name').value.trim();

//             try {
//                 const response = await fetch('http://127.0.0.1:8000/register/', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ username, email, password, first_name: firstName, last_name: lastName }),
//                 });

//                 if (response.ok) {
//                     navigateTo('#/sign-in');
//                 } else {
//                     const errorData = await response.json();
//                     alert(errorData.error || 'Sign-up failed');
//                 }
//             } catch (error) {
//                 console.error('Error during sign-up:', error);
//                 alert('An error occurred. Please try again.');
//             }
//         });
//     }

//     async function loadProfileInfo() {
//         try {
//             const token = localStorage.getItem('authToken');
//             if (!token) return;

//             const response = await fetch('http://127.0.0.1:8000/profile/update/', {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 document.getElementById('profile-img').src = data.image?.link || 'default-avatar.png';
//                 document.getElementById('profile-username').innerText = data.login || 'Unknown User';
//             }
//         } catch (error) {
//             console.error('Error loading profile info:', error);
//         }
//     }

//     window.addEventListener('popstate', () => {
//         renderPage(window.location.hash);
//     });

//     // Load the initial page
//     renderPage(window.location.hash || '#/sign-in');
// });

///////////////////////////////////////////

// document.addEventListener("DOMContentLoaded", () => {
//     const pages = {
//         signIn: `
//             <div class="main">
//                 <div class="border-up">
//                     <img class="logo" src="images/Pongify_logo.png">
//                     <h2>WELCOME</h2>
//                     <p>Login with your 42 Network account or use your own email and password</p>
//                 </div>
//                 <div class="border-bottom">
//                     <form id="login-form">
//                         <input id="login-username" type="text" class="brd" placeholder="Username"><br>
//                         <input id="login-password" type="password" class="brd" placeholder="Password">
//                         <p class="error-msg" style="color: red;"></p>
//                         <button class="btn" type="submit">Login</button>
//                     </form>
//                     <button class="btn2"><img src="images/42.png">Network</button>
//                     <a href="#" id="go-to-sign-up">Create Account</a>
//                 </div>
//             </div>
//         `,
//         signUp: `
//             <div class="main">
//                 <div class="border-up">
//                     <img class="logo" src="images/Pongify_logo.png">
//                     <h2>WELCOME</h2>
//                     <p>Login with your 42 Network account or use your own email and password</p>
//                 </div>
//                 <div class="border-bottom">
//                     <form id="signup-form">
//                         <input id="username" type="text" class="brd" placeholder="Username">
//                         <input id="email" type="email" class="brd" placeholder="Email">
//                         <input id="password" type="password" class="brd" placeholder="Password">
//                         <input id="first_name" type="text" class="brd" placeholder="First name">
//                         <input id="last_name" type="text" class="brd" placeholder="Last name">
//                         <button class="btn" type="submit">Sign Up</button>
//                     </form>
//                     <button class="btn2"><img src="images/42.png">Network</button>
//                 </div>
//             </div>
//         `,
//         dashboard: `
//             <div class="main">
//                 <div class="header">
//                     <img class="logo" src="images/Pongify_logo.png" >
//                     <div class="test">
//                         <a href="#" data-page="home" class="active">HOME</a>
//                         <a href="#" data-page="profile">PROFILE</a>
//                         <a href="#" data-page="game">GAME</a>
//                         <a href="#" data-page="tournament">TOURNAMENT</a>
//                         <a href="#" data-page="chat">CHAT</a>
//                         <a href="#" data-page="settings">SETTINGS</a>
//                     </div>
//                 </div>
//             </div>
//         `,
//         home: `
//             <div class="play_local">
//                 <div class="btn">
//                     <button type="button" onclick="location.href='game.html';">Play Local Game</button>
//                 </div>
//                 <img class="f_img" src="dashboard img/full_button.png">
//             </div>
//             <div class="btn2">
//                 <button type="button" onclick="location.href='game.html';">Play Online Game</button>
//             </div>
//             <img class="f_img" src="dashboard img/full_buton_2.png">
//             <div>
//                 <!-- Add Friends Button -->
//                 <button class="f_img_l" id="add-friends-btn" type="button">Add Friends</button>
//                 <!-- Search Bar (Initially Hidden) -->
//                 <div id="search-bar-container" style="display: none;">
//                     <input class="search_bar" type="text" id="search-bar" placeholder="Search friends...">
//                 </div>
//                 <!-- Friends Button -->
//                 <button class="f_img_l2" id="friends-btn" type="button">Friends</button>
//                 <img class="f_img_last" src="dashboard img/FREINDLIST_041332.png">
//             </div>
//         `,
//         profile: `
//             <link rel="stylesheet" href="profile.css">
//             <div class="profile-container">
//                 <div class="profile-info">
//                     <img class="profile-border" src="profile imgs/main_profile_window.png" alt="Profile Border">
//                     <img id="profile-img" class="profile-img" src="profile imgs/placeholder.png" alt="Profile Image">
//                     <h2 id="profile-username">Username</h2>
//                 </div>
//                 <div class="profile-stats">
//                     <img class="stats-border wins" src="profile imgs/level_and_wins_window.png" alt="Wins">
//                     <img class="stats-border level" src="profile imgs/level_and_wins_window.png" alt="Level">
//                 </div>
//                 <div class="match-history">
//                     <img class="match-history-border" src="profile imgs/match_history_window.png" alt="Match History">
//                 </div>
//             </div>
//         `,
//     };

//     function loadCSS(fileName) {
//         const existingLink = document.getElementById('dynamic-css');
//         if (existingLink) existingLink.remove();

//         const link = document.createElement('link');
//         link.id = 'dynamic-css';
//         link.rel = 'stylesheet';
//         link.href = fileName;
//         document.head.appendChild(link);
//     }

//     function navigateTo(route) {
//         window.history.pushState({}, '', route); // This will change the URL
//         renderPage(route); // Call renderPage after changing the URL
//     }

//     function renderPage(route) {
//         const app = document.getElementById('app');

//         switch (route) {
//             case '#/sign-in':
//                 app.innerHTML = pages.signIn;
//                 loadCSS('style2.css');
//                 setupSignIn();
//                 break;
//             case '#/sign-up':
//                 app.innerHTML = pages.signUp;
//                 loadCSS('sign-up-page.css');
//                 setupSignUp();
//                 break;
//             case '#/dashboard':
//                 app.innerHTML = pages.dashboard;
//                 loadCSS('dashboard.css');
//                 break;
//             case '#/home':
//                 content.innerHTML = pages.home; // Only content section
//                 loadCSS('dashboard.css');
//                 break;
//             case '#/profile':
//                 content.innerHTML = pages.profile; // Only content section
//                 loadCSS('profile.css');
//                 loadProfileInfo();
//                 break;
//             default:
//                 app.innerHTML = pages.signIn;
//                 loadCSS('style2.css');
//                 setupSignIn();
//                 break;
//         }
//     }

//     function setupSignIn() {
//         const loginForm = document.getElementById('login-form');
//         const goToSignUp = document.getElementById('go-to-sign-up');
//         const errorMsg = document.querySelector('.error-msg');

//         goToSignUp.addEventListener('click', (e) => {
//             e.preventDefault();
//             navigateTo('#/sign-up');
//         });

//         loginForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             const username = document.querySelector('input[placeholder="Username"]').value.trim();
//             const password = document.querySelector('input[placeholder="Password"]').value.trim();
//             const errorMsg = document.querySelector('.error-msg');

//             // Clear any previous error message
//             errorMsg.style.display = 'none';
//             errorMsg.textContent = '';

//             if (!username || !password) {
//                 errorMsg.style.display = 'block';
//                 errorMsg.textContent = 'Username and password are required!';
//                 return;
//             }

//             try {
//                 const response = await fetch('http://127.0.0.1:8000/login/', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ username, password }),
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     localStorage.setItem('authToken', data.access);
//                     navigateTo('#/dashboard');
//                 } else {
//                     const errorData = await response.json();
//                     errorMsg.textContent = errorData.error || 'Invalid username or password';
//                 }
//             } catch (error) {
//                 console.error('Error during login:', error);
//                 errorMsg.textContent = 'Something went wrong. Please try again later.';
//             }
//         });
//     }

//     function setupSignUp() {
//         const signupForm = document.getElementById('signup-form');
//         signupForm.addEventListener('submit', async (e) => {
//             e.preventDefault();

//             const username = document.getElementById('username').value.trim();
//             const email = document.getElementById('email').value.trim();
//             const password = document.getElementById('password').value.trim();
//             const firstName = document.getElementById('first_name').value.trim();
//             const lastName = document.getElementById('last_name').value.trim();

//             try {
//                 const response = await fetch('http://127.0.0.1:8000/register/', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ username, email, password, first_name: firstName, last_name: lastName }),
//                 });

//                 if (response.ok) {
//                     navigateTo('#/sign-in');
//                 } else {
//                     const errorData = await response.json();
//                     alert(errorData.error || 'Sign-up failed');
//                 }
//             } catch (error) {
//                 console.error('Error during sign-up:', error);
//                 alert('An error occurred. Please try again.');
//             }
//         });
//     }

//     async function loadProfileInfo() {
//         try {
//             const token = localStorage.getItem('authToken');
//             if (!token) return;

//             const response = await fetch('http://127.0.0.1:8000/profile/update/', {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 document.getElementById('profile-img').src = data.image?.link || 'default-avatar.png';
//                 document.getElementById('profile-username').innerText = data.login || 'Unknown User';
//             }
//         } catch (error) {
//             console.error('Error loading profile info:', error);
//         }
//     }

//     window.addEventListener('popstate', () => {
//         renderPage(window.location.hash);
//     });

//     // Load the initial page
//     renderPage(window.location.hash || '#/sign-in');
// });


document.addEventListener("DOMContentLoaded", () => {
    const pages = {
        signIn: `
            <div class="main">
                <div class="border-up">
                    <img class="logo" src="images/Pongify_logo.png">
                    <h2>WELCOME</h2>
                    <p>Login with your 42 Network account or use your own email and password</p>
                </div>
                <div class="border-bottom">
                    <form id="login-form">
                        <input id="login-username" type="text" class="brd" placeholder="Username"><br>
                        <input id="login-password" type="password" class="brd" placeholder="Password">
                        <p class="error-msg" style="color: red;"></p>
                        <button class="btn" type="submit">Login</button>
                    </form>
                    <button class="btn2"><img src="images/42.png">Network</button>
                    <a href="#" id="go-to-sign-up">Create Account</a>
                </div>
            </div>
        `,
        signUp: `
            <div class="main">
                <div class="border-up">
                    <img class="logo" src="images/Pongify_logo.png">
                    <h2>WELCOME</h2>
                    <p>Login with your 42 Network account or use your own email and password</p>
                </div>
                <div class="border-bottom">
                    <form id="signup-form">
                        <input id="username" type="text" class="brd" placeholder="Username">
                        <input id="email" type="email" class="brd" placeholder="Email">
                        <input id="password" type="password" class="brd" placeholder="Password">
                        <input id="first_name" type="text" class="brd" placeholder="First name">
                        <input id="last_name" type="text" class="brd" placeholder="Last name">
                        <button class="btn" type="submit">Sign Up</button>
                    </form>
                    <button class="btn2"><img src="images/42.png">Network</button>
                </div>
            </div>
        `,
        dashboard: `
            <div class="main">
                <div class="header">
                    <img class="logo" src="images/Pongify_logo.png">
                    <div class="test">
                        <a href="#/dashboard" data-page="home" class="active">HOME</a>
                        <a href="#/profile" data-page="profile">PROFILE</a>
                        <a href="#/game" data-page="game">GAME</a>
                        <a href="" data-page="tournament">TOURNAMENT</a>
                        <a id="chat" href="#/chat" data-page="chat">CHAT</a>
                        <button id="signout-btn" type="button">Sign Out</button>
                    </div>
                </div>
                <div class="middle">
                    <div class="paragraph">
                        <h2>Classic Pong Modern Twist.</h2>
                        <p>"Pongify" is a reimagined version of the classic Pong game, bringing a 
                        fresh and engaging multiplayer experience. Compete with friends, join tournaments, 
                        and relive the nostalgia with enhanced graphics and smooth gameplay.</p>
                        <button class="start-playing-btn" id="startplay" >Start Playing</button>
                    </div>
                    <div>
                        <div class="friend-requests-container">
                            <h2 id="no-friend" style="display: block;">No friend requests found</h2>
                            <div id="friend-requests-list"></div>
                        </div>

                        <!-- Add Friends Button -->
                        <button class="f_img_l" id="add-friends-btn" type="button">Add Friends</button>
                        <!-- Search Bar (Initially Hidden) -->
                        <div id="search-bar-container" style="display: none;">
                            <input class="search_bar" type="text" id="search-bar" placeholder="Search friends...">
                            <div id="user-list-container"></div>
                        </div>
                        
                        <!-- Friends Button -->
                        <button class="f_img_l2" id="friends-btn" type="button">Friends</button>
                        <img class="f_img_last" src="dashboard img/FREINDLIST_041332.png">
                    </div>
                </div>
            </div>
        `,
        home: `
            <div class="play_local">
                <div class="btn">
                    <button type="button" onclick="location.href='game.html';">Play Local Game</button>
                </div>
                <img class="f_img" src="dashboard img/full_button.png">
            </div>
            <div class="btn2">
                <button type="button" onclick="location.href='game.html';">Play Online Game</button>
            </div>
            <img class="f_img" src="dashboard img/full_buton_2.png">
            <div>
                <!-- Add Friends Button -->
                <button class="f_img_l" id="add-friends-btn" type="button">Add Friends</button>
                <!-- Search Bar (Initially Hidden) -->
                <div id="search-bar-container" style="display: none;">
                    <input class="search_bar" type="text" id="search-bar" placeholder="Search friends...">
                </div>
                
                <!-- Friends Button -->
                <button class="f_img_l2" id="friends-btn" type="button">Friends</button>
                <img class="f_img_last" src="dashboard img/FREINDLIST_041332.png">
            </div>
        `,
        profile: `
            <div class="main">
                <div class="header">
                    <img class="logo" src="images/Pongify_logo.png">
                    <div class="test">
                        <a href="#/dashboard" data-page="home">HOME</a>
                        <a href="#/profile" data-page="profile" class="active">PROFILE</a>
                        <a href="#/game" data-page="game">GAME</a>
                        <a href="" data-page="tournament">TOURNAMENT</a>
                        <a id="chat" href="#/chat" data-page="chat">CHAT</a>
                        <button id="signout-btn" type="button">Sign Out</button>
                    </div>
                </div>
            <div class="profile-container">
                <div class="profile-info">
                    <img class="profile-border" src="profile imgs/main_profile_window.png">
                    <img class="p_img" id="profile-img" class="profile-img" src="profile images/luffy_snipper.jpg">
                    <h2 class="p_username" id="profile-username" class="profile-username">Username</h2>
                    <button class="edit_p" id="edit-p-btn" type="button">Edit Profile</button>
                    
                </div>
                <div class="profile-stats">
                    <img class="stats-border wins" src="profile imgs/level_and_wins_window.png" alt="Wins">
                    <img class="stats-border level" src="profile imgs/level_and_wins_window.png" alt="Level">
                </div>
                <div class="match-history">
                    <img class="match-history-border" src="profile imgs/match_history_window.png" alt="Match History">
                </div>
            </div>
        `,
        game: `
            <div class="main">
                <div class="header">
                    <img class="logo" src="images/Pongify_logo.png">
                    <div class="test">
                        <a href="#/dashboard" data-page="home">HOME</a>
                        <a href="#/profile" data-page="profile">PROFILE</a>
                        <a href="#/game" data-page="game" class="active">GAME</a>
                        <a href="" data-page="tournament">TOURNAMENT</a>
                        <a href="#/chat" data-page="chat">CHAT</a>
                        <a href="" data-page="settings">SETTINGS</a>
                    </div>
                </div>
                <div class="btn">
                    <button type="button" class="local-mode-btn">Play Local Game</button>
                    <img class="f_img" src="dashboard img/full_button.png">
                </div>
                <div class="btn2">
                    <button type="button" class="multiplayer-mode-btn">Play Online Game</button>
                    <img class="f_img" src="dashboard img/full_buton_2.png">
                </div>
            </div>
        `,
        game_v2: `
            <div class="main">
                <div class="header">
                    <img class="logo" src="images/Pongify_logo.png">
                    <div class="test">
                        <a href="#/dashboard" data-page="home">HOME</a>
                        <a href="#/profile" data-page="profile">PROFILE</a>
                        <a href="#/game" data-page="game" class="active">GAME</a>
                        <a href="" data-page="tournament">TOURNAMENT</a>
                        <a href="#/chat" data-page="chat">CHAT</a>
                        <a href="" data-page="settings">SETTINGS</a>
                    </div>
                </div>
            </div>
        `,
        chat: `
    <div class="main">
        <div class="header">
            <img class="logo" src="images/Pongify_logo.png">
            <div class="test">
                <a href="#/dashboard" data-page="home">HOME</a>
                <a href="#/profile" data-page="profile">PROFILE</a>
                <a href="#/game" data-page="game">GAME</a>
                <a href="" data-page="tournament">TOURNAMENT</a>
                <a id="chat" href="#/chat" data-page="chat" class="active">CHAT</a>
                <button id="signout-btn" type="button">Sign Out</button>
            </div>
            <div id="current-user" data-username="{{ request.user.username }}" data-user-id="{{ request.user.id }}"></div>
        </div>
        <div class="border">
            <div class="app-container">
                <div class="user-list" id="chat-friend-list">
                    <!-- Friend list will be dynamically populated here -->
                </div>
                <div class="chat-panel">
                    <div class="chat-header" id="chat-header">
                        Select a friend to start chatting
                    </div>
                    <div class="chat-messages" id="chat-messages">
                        <!-- Messages will be displayed here -->
                    </div>
                    <div class="chat-input-container">
                        <input type="text" class="chat-input" id="chat-input" placeholder="Type a message...">
                        <div class="btn-container">
                            <button id="emoji-toggle-btn" class="emoji-toggle-btn">
                                <img class="emoji" src="https://icons.iconarchive.com/icons/designbolts/emoji/512/Emoji-Blank-icon.png" alt="">
                            </button>
                        </div>                    
                        <div id="emojiPicker" class="emoji-picker">
                            <span onclick="addEmoji('😀')" class="emoji">😀</span>
                            <span onclick="addEmoji('😂')" class="emoji">😂</span>
                            <span onclick="addEmoji('❤️')" class="emoji">❤️</span>
                            <span onclick="addEmoji('🎉')" class="emoji">🎉</span>
                            <span onclick="addEmoji('😎')" class="emoji">😎</span>
                            <span onclick="addEmoji('😅')" class="emoji">😅</span>
                            <span onclick="addEmoji('😍')" class="emoji">😍</span>
                            <span onclick="addEmoji('🔥')" class="emoji">🔥</span>
                            <span onclick="addEmoji('🤔')" class="emoji">🤔</span>
                            <span onclick="addEmoji('🙌')" class="emoji">🙌</span>
                            <span onclick="addEmoji('🌟')" class="emoji">🌟</span>
                            <span onclick="addEmoji('🥳')" class="emoji">🥳</span>
                            <span onclick="addEmoji('🍆')" class="emoji">🍆</span>
                            <span onclick="addEmoji('🔥')" class="emoji">🔥</span>
                            <span onclick="addEmoji('💩')" class="emoji">💩</span>
                        </div>
                        <button id="send-btn" class="send-btn">Send</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    };
    
    // const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    // const token = urlParams.get('access_token');
    // localStorage.setItem("authToken", token);

    // const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    // const token = urlParams.get('access_token');
    // const user_id = urlParams.get('user_id');

    // const logedauth = localStorage.getItem("authToken");
    // console.log("Access token before:", logedauth);

    // if (token) {
    //     localStorage.setItem("authToken", token);
    // }
    // if (user_id) {
    //     localStorage.setItem("user_id", user_id);
    // }

    let token;
    let user_id;
    
    const hash = window.location.hash;
    console.log("Hash:", hash);
    if (hash.includes('?'))
    {
      const urlParams = new URLSearchParams(hash.split('?')[1]);
      token = urlParams.get('access_token');
      user_id = urlParams.get('user_id');
    
      if (token) {
        localStorage.setItem("authToken", token);
        navigateTo('#/dashboard');
        console.log("Access token from URL:", token);
      }
      if (user_id) {
        localStorage.setItem("user_id", user_id);
        console.log("User ID from URL:", user_id);
      }
    } else {
      token = localStorage.getItem("authToken");
      user_id = localStorage.getItem("user_id");
      console.log("No query parameters found. Using token from localStorage:", token);
    }
    // console.log("Access token from 42 Network:", token);
    // console.log("User ID from 42 Network:", user_id);
    // const token = localStorage.getItem("authToken");
    
    // console.log("Access token before:", token);

    if (token)
    {
        const currentHash = window.location.hash;
        // if (currentHash.startsWith("#/sign-in"))
        // {
        //     navigateTo('#/dashboard');
        // }
        navigateTo(currentHash);
    }
    // const currentHash = window.location.hash;
    // console.log("Current hash:", currentHash);
    // if (token && currentHash.startsWith("#/sign-in")) {
    //     // Optionally, set a flag so that this redirect only happens once
    //     if (!localStorage.getItem("hasRedirected")) {
    //         localStorage.setItem("hasRedirected", "true");
    //         navigateTo('#/dashboard');
    //     }
    // }
    // console.log(urlParams)
    console.log("Access token from 42 Network:", token);
    function preloadStylesheet(url) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
    }

    function loadCSS(fileName) {
        const existingLink = document.getElementById('dynamic-css');
        if (existingLink) existingLink.remove();

        const link = document.createElement('link');
        link.id = 'dynamic-css';
        link.rel = 'stylesheet';
        link.href = fileName;
        document.head.appendChild(link);
    }

    function navigateTo(route) {
        window.history.pushState({}, '', route); // This will change the URL
        renderPage(route); // Call renderPage after changing the URL
    }

    function setupSignOut() {
      const signOutBtn = document.getElementById("signout-btn");
      if (signOutBtn) {
        signOutBtn.addEventListener("click", () => {
          // Remove stored tokens and user data
          localStorage.removeItem("authToken");
          localStorage.removeItem("user_id");
          localStorage.removeItem("hasRedirected"); // if used
          token = "";
          user_id = "";

          console.log(localStorage.getItem("authToken"));
          console.log(localStorage.getItem("user_id"));
          console.log(localStorage.getItem("hasRedirected"));
          // Optionally, you can clear all localStorage data if that's acceptable:
          localStorage.clear();

          // Redirect to the sign-in page
          navigateTo('#/sign-in');
        });
      }
    }

    function setupDashboard() {
        const startplaybutton = document.getElementById("startplay");
        if (startplaybutton) {
            startplaybutton.addEventListener('click', () => {
                console.log("Start Playing button clicked!");
                navigateTo('#/game');
            });
        } else {
            console.error("Startplay button not found after rendering dashboard!");
        }
    }

    function setupchat() {
        const startplaybutton = document.getElementById("chat");
        if (startplaybutton) {
            startplaybutton.addEventListener('click', () => {
                console.log("Start Playing button clicked!");
                navigateTo('#/chat');
                fetchAndDisplayFriends();
            });
        } else {
            console.error("Startplay button not found after rendering dashboard!");
        }
    }
    function renderPage(route) {
        const app = document.getElementById('app');
        // const contentArea = document.getElementById('content-area');

        switch (route) {
            case '#/sign-in':
                // window.location.hash = '#/sign-in';
                app.innerHTML = pages.signIn;
                loadCSS('style2.css');
                setupSignIn();
                break;
            case '#/sign-up':
                // window.location.hash = '#/sign-up';
                app.innerHTML = pages.signUp;
                loadCSS('sign-up-page.css');
                setupSignUp();
                break;
            case '#/dashboard':
                // window.location.hash = '#/dashboard';
                app.innerHTML = pages.dashboard;
                loadCSS('dashboard.css');
                initializeHomeFunctionality();
                loadPendingFriendRequests();
                setupDashboard();
                // loadProfileInfo();
                setupSignOut();
                break;
            case '#/home':
                app.innerHTML = pages.home;
                break;
            case '#/profile':
                // window.location.hash = '#/profile';
                app.innerHTML = pages.profile;
                loadCSS('profile.css');
                loadProfileInfo();
                initializeProfileEdit();
                setupSignOut();
                break;
            case '#/game':
                window.location.hash = '#/game';
                app.innerHTML = pages.game;
                loadCSS('styleGame.css');

                document.querySelector('.multiplayer-mode-btn').addEventListener('click', () => {
                    app.innerHTML = pages.game_v2;
                    setCurrentGame(new PongGame('multiplayer'));
                });
                
                document.querySelector('.local-mode-btn').addEventListener('click', () => {
                    app.innerHTML = pages.game_v2;
                    setCurrentGame(new PongGame('local'));
                });
                break;
            case '#/chat':
                window.location.hash = '#/chat';
                app.innerHTML = pages.chat;
                loadCSS('chat.css');
                initializechatFunctionality();
                setupSignOut();
                break;
            default:
                app.innerHTML = pages.signIn;
                loadCSS('style2.css');
                setupSignIn();
                break;
            }
        }
        
        function setupSignIn() 
        {
        const loginForm = document.getElementById('login-form');
        const goToSignUp = document.getElementById('go-to-sign-up');
        const errorMsg = document.querySelector('.error-msg');
        const btn2 = document.querySelector('.btn2');

        goToSignUp.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('#/sign-up');
        });


        if (btn2) 
        {
            console.log(token);
            btn2.addEventListener('click', async () => {
                try {
                    window.location.href = 'http://127.0.0.1:8000/42_login/';
                    const params = new URLSearchParams(window.location.search);
                    const token = params.get('access_token');
                    if (token) {
                        localStorage.setItem('authToken', token);
                        console.log("Access token stored in localStorage:", token);
                        window.history.replaceState({}, document.title, window.location.pathname);
                    } else {
                        console.log("No access token found in URL.");
                    }
                } catch (error) {
                    console.error('Error during 42 Network login:', error);
                    alert('An error occurred. Please try again.');
                }
            });
        }

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.querySelector('input[placeholder="Username"]').value.trim();
            const password = document.querySelector('input[placeholder="Password"]').value.trim();
            const errorMsg = document.querySelector('.error-msg');
            
            // Clear any previous error message
            errorMsg.style.display = 'none';
            errorMsg.textContent = '';
            
            if (!username || !password) {
                errorMsg.style.display = 'block';
                errorMsg.textContent = 'Username and password are required!';
                return;
            }
            
            try {
                console.log('Sending payload:', { username, password });
                const response = await fetch('http://127.0.0.1:8000/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) 
                {
                    const result = await response.json();
                    console.log("result : ", result);
                    localStorage.setItem('authToken', result.data.access);
                    localStorage.setItem('user_id', result.data.user_id);
                    navigateTo('#/dashboard');
                }
                else 
                {
                    const errorData = await response.json();
                    errorMsg.style.display = 'block';
                    errorMsg.textContent = errorData.error || 'Invalid username or password';
                }
            } catch (error) {
                console.error('Error during login:', error);
                errorMsg.style.display = 'block';
                errorMsg.textContent = 'Something went wrong. Please try again later.';
            }
        });
    }

    function setupSignUp() 
    {
        const signupForm = document.getElementById('signup-form');
        const btn2 = document.querySelector('.btn2');

        if(btn2)
        {
            btn2.addEventListener('click', async () => {
                try {
                    // Redirect the user to the 42 login endpoint
                    window.location.href = 'http://127.0.0.1:8000/42_login/';
            
                    // Check for the access token in the URL after redirect
                    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
                    const token = urlParams.get('access_token');
                    // console.log(urlParams)
                    console.log("Access token from 42 Network:", token); 
                    if (token)
                    {
                        // Save token to localStorage
                        localStorage.setItem('authToken', token);
                        console.log("Access token stored in localStorage:", token);
            
                        // Optionally remove query parameters to clean the URL
                        window.history.replaceState({}, document.title, window.location.pathname);
                        // navigateTo('#/dashboard'); 

                        //working here...
                    }
                    else 
                    {
                        console.log("No access token found in URL.");
                    }
                } catch (error) {
                    console.error('Error during 42 Network login:', error);
                    alert('An error occurred. Please try again.');
                }
            });
        }
        
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // const username = document.getElementById('username').value.trim();
            // const email = document.getElementById('email').value.trim();
            // const password = document.getElementById('password').value.trim();
            // const first_name = document.getElementById('first_name').value.trim();
            // const last_name = document.getElementById('last_name').value.trim();
            const formData = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                first_name: document.getElementById('first_name').value,
                last_name: document.getElementById('last_name').value
            };
            // console.log(formData);

            // console.log('Sending payload:', { username, email, password, first_name, last_name });
            try {
                const response = await fetch('http://127.0.0.1:8000/register/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    navigateTo('#/sign-in');
                } else {
                    const errorData = await response.json();
                    alert(errorData.error || 'Sign-up failed');
                }
            } catch (error) {
                console.error('Error during sign-up:', error);
                alert('An error occurred. Please try again.');
            }
        });
        
    }
    localStorage.setItem("authToken", token);
    console.log("Token set in localStorage:", localStorage.getItem("authToken"));
    
    async function loadProfileInfo() {
        try {
            const access_token = localStorage.getItem('authToken');
            if (!access_token) {
                console.log("No access token found in localStorage.", {access_token});
                return;
            }
            const response = await fetch('http://127.0.0.1:8000/profile/', {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('Response Headers:', response);
            console.log("GET Response Status:", response.status);
    
            if (response.ok) {
                const result = await response.json();
                console.log("GET Profile Data:", result);
                const profileData = result.data?.attributes || {};
                const avatarUrl = profileData.avatar || 'images/default-avatar.png';
                const username = profileData.username || 'Unknown User';
                console.log("Avatar URL:", avatarUrl);
                console.log("Username:", username);
    
                const profileImg = document.getElementById('profile-img');
                if (avatarUrl.startsWith("https://"))
                {
                    profileImg.src = avatarUrl;
                    document.getElementById('profile-username').innerText = username;
                    profileImg.onload = () => console.log("Image loaded successfully");
                    profileImg.onerror = () => console.error("Image failed to load:", avatarUrl);
                }
                else
                {
                    profileImg.src = `http://127.0.0.1:8000${avatarUrl}?t=${new Date().getTime()}`; // Use absolute URL
                    profileImg.onload = () => console.log("Image loaded successfully");
                    profileImg.onerror = () => console.error("Image failed to load:", avatarUrl);
                    document.getElementById('profile-username').innerText = username;
                }
            } else {
                console.error("GET Error:", await response.json());
                document.getElementById('profile-img').src = 'images/default-avatar.png';
                document.getElementById('profile-username').innerText = 'Unknown User';
            }
        } catch (error) {
            console.error('Error loading profile info:', error);
            document.getElementById('profile-img').src = 'images/default-avatar.png';
            document.getElementById('profile-username').innerText = 'Unknown User';
        }
    }

    // async function loadProfileInfo() {
    //     try {

    //         const access_token = localStorage.getItem('authToken');
    //         // if (!token) return;
    //         if (!access_token) 
    //         {
    //             console.log("No access token found in localStorage." , {access_token});
    //             return;
    //         }
    //         const response = await fetch('http://127.0.0.1:8000/profile/', {
    //             method: 'GET',
    //             headers: {
    //                 "Authorization": `Bearer ${access_token}`,
    //                 'Content-Type': 'application/json',
    //                 // 'Accept': 'application/vnd.api+json',
    //             },
    //         });
    //         console.log('Response Headers:', response);
            
    //         if (response.ok)
    //         {
    //             console.log("ALOOOOOc")
    //             // const data = await response.json();
    //             const result = await response.json();
    //             const profileData = result.data.attributes;
    //             console.log(result)
    //             // document.getElementById('profile-img').src = data.image?.link || 'default-avatar.png';
    //             // document.getElementById('profile-username').innerText = data.login || 'Unknown User';
    //             document.getElementById('profile-img').src = profileData.avatar || 'default-avatar.png';
    //             document.getElementById('profile-username').innerText = profileData.username || 'Unknown User';
    //         }
    //     } catch (error) {
    //         console.error('Error loading profile info:', error);
    //     }
    // }
    
    // function initializeHomeFunctionality() {
    //     const addFriendsButton = document.getElementById("add-friends-btn");
    //     const friendsButton = document.getElementById("friends-btn");
    //     const searchBarContainer = document.getElementById("search-bar-container");

    //     // Add Friends Button: Toggle search bar visibility
    //     if (addFriendsButton && searchBarContainer) {
    //         addFriendsButton.addEventListener("click", () => {
    //             if (searchBarContainer.style.display === "none") {
    //                 searchBarContainer.style.display = "block";
    //             } else {
    //                 searchBarContainer.style.display = "none";
    //             }
    //         });
    //     }

    //     // Friends Button: Placeholder functionality
    //     if (friendsButton) {
    //         friendsButton.addEventListener("click", () => {
    //             alert("Fetching your friends from the backend...");
    //         });
    //     }
    // }

    // function displayUserSearchResults(users) {
    //     // Create (or select) a container for search results
    //     let resultsContainer = document.getElementById("friend-search-results");
    //     if (!resultsContainer) {
    //       resultsContainer = document.createElement("div");
    //       resultsContainer.id = "friend-search-results";
    //       const searchBarContainer = document.getElementById("search-bar-container");
    //       searchBarContainer.appendChild(resultsContainer);
    //     }
    //     resultsContainer.innerHTML = ""; // Clear previous results
      
    //     users.forEach(user => {
    //       const userDiv = document.createElement("div");
    //       userDiv.classList.add("user-result");
    //       userDiv.textContent = user.username;
          
    //       const inviteButton = document.createElement("button");
    //       inviteButton.textContent = "Invite";
    //       inviteButton.addEventListener("click", async () => {
    //         try {
    //           // Send a friend request using the backend endpoint
    //           const response = await fetch(`http://127.0.0.1:8000/friends/send/${user.id}/`, {
        //             method: "POST",
        //             headers: {
    //               "Content-Type": "application/json",
    //               // Include Authorization if required:
    //               "Authorization": `Bearer ${localStorage.getItem("authToken")}`
    //             }
    //           });
    //           if (response.ok) {
        //             alert(`Friend request sent to ${user.username}`);
    //           } else {
    //             const errorData = await response.json();
    //             alert(errorData.error || "Failed to send friend request");
    //           }
    //         } catch (error) {
    //           console.error("Error sending friend request:", error);
    //         }
    //       });
          
    //       userDiv.appendChild(inviteButton);
    //       resultsContainer.appendChild(userDiv);
    //     });
    //   }
      
    //   function displayFriendsList(friends) {
    //     // Create (or select) a container for the friends list
    //     let friendsContainer = document.getElementById("friends-list-container");
    //     if (!friendsContainer) {
    //       friendsContainer = document.createElement("div");
    //       friendsContainer.id = "friends-list-container";
    //       document.body.appendChild(friendsContainer);
    //     }
    //     friendsContainer.innerHTML = ""; // Clear previous list
    //     friendsContainer.style.display = "block"; // Make sure it is visible
      
    //     friends.forEach(friend => {
    //       const friendDiv = document.createElement("div");
    //       friendDiv.classList.add("friend-item");
    //       friendDiv.textContent = friend.username;
    //       friendsContainer.appendChild(friendDiv);
    //     });
    //   }

    //   function initializeHomeFunctionality() {
        //     const addFriendsButton = document.getElementById("add-friends-btn");
    //     const friendsButton = document.getElementById("friends-btn");
    //     const searchBarContainer = document.getElementById("search-bar-container");
    //     const searchInput = document.getElementById("search-bar");
      
    //     // Toggle the search bar when Add Friends is clicked
    //     if (addFriendsButton && searchBarContainer) {
    //       addFriendsButton.addEventListener("click", () => {
    //         if (searchBarContainer.style.display === "none" || searchBarContainer.style.display === "") {
        //           searchBarContainer.style.display = "block";
    //         } else {
        //           searchBarContainer.style.display = "none";
        //         }
    //       });
    //     }
      
    //     // When the user types in the search bar, fetch matching users
    //     if (searchInput) {
    //       searchInput.addEventListener("keyup", async (e) => {
    //         const query = searchInput.value.trim();
    //         if (!query) {
        //           // Clear results if input is empty
    //           const resultsContainer = document.getElementById("friend-search-results");
    //           if (resultsContainer) resultsContainer.innerHTML = "";
    //           return;
    //         }
    //         try {
    //           // Assuming your UserListView endpoint supports search via query parameter "search"
    //           const response = await fetch(`http://127.0.0.1:8000/users/`, {
    //             method: "GET",
    //             headers: {
    //               "Content-Type": "application/json",
    //             //   "Authorization": `Bearer ${localStorage.getItem("authToken")}`
    //               // Include Authorization if required:
    //             }
    //           });
    //           if (response.ok) {
    //             const users = await response.json();
    //             // Depending on your backend, users might be wrapped in a "data" property (JSON:API)
    //             const userList = users.data ? users.data.attributes : users;
    //             displayUserSearchResults(userList);
    //           } else {
    //             console.error("Failed to fetch user search results. Status:", response.status);
    //           }
    //         } catch (error) {
    //           console.error("Error fetching user search results:", error);
    //         }
    //       });
    //     }
      
    //     // When the Friends button is clicked, fetch the friend list
    //     if (friendsButton) {
    //       friendsButton.addEventListener("click", async () => {
    //         const user_id = localStorage.getItem("user_id");
    //         if (!user_id) {
    //           alert("User ID not found. Please sign in again.");
    //           return;
    //         }
    //         try {
    //           const response = await fetch(`http://127.0.0.1:8000/friends/list/`, {
    //             method: "POST",
    //             headers: {
    //               "Content-Type": "application/json",
    //               // Include Authorization if required:
    //               "Authorization": `Bearer ${localStorage.getItem("authToken")}`
    //             },
    //           });
    //           if (response.ok) {
    //             const friends = await response.json();
    //             displayFriendsList(friends);
    //           } else {
    //             alert("Failed to fetch friend list.");
    //           }
    //         } catch (error) {
    //           console.error("Error fetching friend list:", error);
    //         }
    //       });
    //     }
    //   }
    
    // function initializeHomeFunctionality() {
    //     const addFriendsButton = document.getElementById("add-friends-btn");
    //     const friendsButton = document.getElementById("friends-btn");
    //     const searchBarContainer = document.getElementById("search-bar-container");
    //     const searchInput = document.getElementById("search-bar");
      
    //     // Toggle the search bar when Add Friends is clicked
    //     if (addFriendsButton && searchBarContainer) {
    //       addFriendsButton.addEventListener("click", async () => {
    //         if (searchBarContainer.style.display === "none" || searchBarContainer.style.display === "") {
    //           searchBarContainer.style.display = "block";
    //           fetchAndDisplayUsers();
    //         //   await fetchAndDisplayUsers(); // Fetch all users when the search bar is shown
    //         } else {
    //           searchBarContainer.style.display = "none";
    //         }
    //       });
    //     }
    
    //     // When the user types in the search bar, fetch matching users
    //     if (searchInput) {
    //       searchInput.addEventListener("keyup", async () => {
    //         const query = searchInput.value.trim();
    //         if (!query) {
    //           // If input is empty, show all users again
    //           await fetchAndDisplayUsers();
    //         } else {
    //           await searchAndDisplayUsers(query);
    //         }
    //       });
    //     }
      
    //     // When the Friends button is clicked, fetch the friend list
    //     if (friendsButton) {
    //       friendsButton.addEventListener("click", async () => {
        //         const userId = localStorage.getItem("user_id");
    //         if (!userId) {
    //           alert("User ID not found. Please sign in again.");
    //           return;
    //         }
    //         try {
    //           const response = await fetch(`http://127.0.0.1:8000/friends/list/`, {
    //             method: "GET",
    //             headers: {
    //               "Content-Type": "application/json",
    //               "Authorization": `Bearer ${localStorage.getItem("authToken")}`, // Include Authorization if required
    //             },
    //           });
    //           if (response.ok) {
    //             const friends = await response.json();
    //             displayFriendsList(friends);
    //           } else {
        //             alert("Failed to fetch friend list.");
    //           }
    //         } catch (error) {
    //           console.error("Error fetching friend list:", error);
    //         }
    //       });
    //     }
    //   }
      
    //   async function fetchAndDisplayUsers() {
    //     try {
    //         const response = await fetch("http://127.0.0.1:8000/users/", {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${localStorage.getItem("authToken")}`
    //             }
    //         });
        
    //         if (!response.ok) {
    //             console.error("Failed to fetch users. Status:", response.status);
    //             return;
    //         }
        
    //         const users = await response.json();
        
    //         // Check the structure of the response
    //         if (Array.isArray(users)) {
    //             displayUserSearchResults(users); // If response is an array
    //         } else if (users.data) {
    //             displayUserSearchResults(users.data); // If response contains `data` key
    //         } else {
        //             console.error("Unexpected response format:", users);
        //         }
        //     } catch (error) {
    //         console.error("Error fetching all users:", error);
    //     }
    // }
      
    //   async function searchAndDisplayUsers(query) {
    //     try {
    //       const response = await fetch(`http://127.0.0.1:8000/users/?search=${query}`, {
    //         method: "GET",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       });
    //       if (response.ok) {
    //         const users = await response.json();
    //         displayUserSearchResults(users);
    //       } else {
    //         console.error("Failed to fetch search results. Status:", response.status);
    //       }
    //     } catch (error) {
    //       console.error("Error fetching search results:", error);
    //     }
    //   }
      
    //   function displayUserSearchResults(users) {
    //     let resultsContainer = document.getElementById("friend-search-results");
    //     if (!resultsContainer) {
    //       resultsContainer = document.createElement("div");
    //       resultsContainer.id = "friend-search-results";
    //       const searchBarContainer = document.getElementById("search-bar-container");
    //       searchBarContainer.appendChild(resultsContainer);
    //     }
    //     resultsContainer.innerHTML = ""; // Clear previous results
      
    //     users.forEach((user) => {
    //       const userDiv = document.createElement("div");
    //       userDiv.classList.add("user-result");
    //       userDiv.textContent = user.username;
      
    //       const inviteButton = document.createElement("button");
    //       inviteButton.textContent = "Invite";
    //       inviteButton.addEventListener("click", async () => {
    //         try {
    //           const response = await fetch(`http://127.0.0.1:8000/friends/send/${user.id}/`, {
    //             method: "POST",
    //             headers: {
    //               "Content-Type": "application/json",
    //               "Authorization": `Bearer ${localStorage.getItem("authToken")}`, // Include Authorization if required
    //             },
    //           });
    //           if (response.ok) {
    //             alert(`Friend request sent to ${user.username}`);
    //           } else {
    //             const errorData = await response.json();
    //             alert(errorData.error || "Failed to send friend request");
    //           }
    //         } catch (error) {
    //           console.error("Error sending friend request:", error);
    //         }
    //       });
      
    //       userDiv.appendChild(inviteButton);
    //       resultsContainer.appendChild(userDiv);
    //     });
    //   }
      
    //   function displayFriendsList(friends) {
    //     let friendsContainer = document.getElementById("friends-list-container");
    //     if (!friendsContainer) {
    //       friendsContainer = document.createElement("div");
    //       friendsContainer.id = "friends-list-container";
    //       document.body.appendChild(friendsContainer);
    //     }
    //     friendsContainer.innerHTML = ""; // Clear previous list
    //     friendsContainer.style.display = "block"; // Make sure it is visible
      
    //     friends.forEach((friend) => {
    //       const friendDiv = document.createElement("div");
    //       friendDiv.classList.add("friend-item");
    //       friendDiv.textContent = friend.username;
    //       friendsContainer.appendChild(friendDiv);
    //     });
    //   }
      
    // async function initializeHomeFunctionality() {
    //     const addFriendsButton = document.getElementById("add-friends-btn");
    //     const friendsButton = document.getElementById("friends-btn");
    //     const searchBarContainer = document.getElementById("search-bar-container");
    //     const searchInput = document.getElementById("search-bar");
    //     const friendsRequestButton = document.getElementById("friends-request-btn");
    //     const friendsListContainer = document.getElementById("friends-list-container");
      
    //     // 1. Toggle the search bar when Add Friends is clicked
    //     if (addFriendsButton && searchBarContainer) {
    //       addFriendsButton.addEventListener("click", () => {
    //         friendsListContainer.style.display = "none";
    //         if (searchBarContainer.style.display === "none" || searchBarContainer.style.display === "" ) 
    //         {
    //           searchBarContainer.style.display = "block";
    //           fetchAndDisplayUsers(); // Fetch and display all users initially
    //         } else {
    //           searchBarContainer.style.display = "none";
    //         }
    //       });
    //     }
        
    //     if (friendsButton)
    //         {
    //             friendsButton.addEventListener("click", async () => {
    //             searchBarContainer.style.display = "none";
    //             if (friendsListContainer.style.display === "none" || friendsListContainer.style.display === "") 
    //             {
    //                 friendsListContainer.style.display = "block";
    //                 // fetchAndDisplayFriends();
    //             }
    //             else
    //             {
    //                 friendsListContainer.style.display = "none";
    //             }
    //         });
    //     }
    //     if (searchInput) {
    //         searchInput.addEventListener("keyup", async () => {
    //             const query = searchInput.value.trim();
    //             if (!query) {
    //                 // If input is empty, show all users (limited to 5)
    //                 fetchAndDisplayUsers();
    //             } else {
    //                 await searchAndDisplayUsers(query);
    //             }
    //         });
    //     }
        
          
    // async function initializeHomeFunctionality() {
    //     const addFriendsButton = document.getElementById("add-friends-btn");
    //     const friendsButton = document.getElementById("friends-btn");
    //     const searchBarContainer = document.getElementById("search-bar-container");
    //     const searchInput = document.getElementById("search-bar");
      
    //     // Toggle the search bar when Add Friends is clicked
    //     if (addFriendsButton && searchBarContainer) {
    //       addFriendsButton.addEventListener("click", () => {
    //         // Hide the friend list if it’s open
    //         const existingFriendList = document.getElementById("dynamic-friend-list");
    //         if (existingFriendList) existingFriendList.remove();
    //         if (searchBarContainer.style.display === "none" || searchBarContainer.style.display === "") {
    //           searchBarContainer.style.display = "block";
    //           fetchAndDisplayUsers();
    //         } else {
    //           searchBarContainer.style.display = "none";
    //         }
    //       });
    //     }
      
    //     // Toggle the friend list when Friends is clicked
    //     if (friendsButton) {
    //       friendsButton.addEventListener("click", () => {
    //         searchBarContainer.style.display = "none"; // Hide search bar if open
    //         fetchAndDisplayFriends(friendsButton); // Fetch and toggle friend list
    //       });
    //     }
      
    //     if (searchInput) {
    //       searchInput.addEventListener("keyup", async () => {
    //         const query = searchInput.value.trim();
    //         if (!query) {
    //           fetchAndDisplayUsers();
    //         } else {
    //           await searchAndDisplayUsers(query);
    //         }
    //       });
    //     }
    //   }

    async function initializeHomeFunctionality() {
        const addFriendsButton = document.getElementById("add-friends-btn");
        const friendsButton = document.getElementById("friends-btn");
        const searchBarContainer = document.getElementById("search-bar-container");
        const searchInput = document.getElementById("search-bar");
        const friendRequestsContainer = document.querySelector(".friend-requests-container");
    
        // Function to hide all sections except the one being shown
        function hideAllExcept(exceptElement) {
            const elementsToHide = [
                searchBarContainer,
                friendRequestsContainer,
                document.getElementById("dynamic-friend-list")
            ];
            elementsToHide.forEach(element => {
                if (element && element !== exceptElement) {
                    if (element.id === "dynamic-friend-list" && element) {
                        element.remove(); // Remove dynamic friend list if it exists
                    } else {
                        element.style.display = "none"; // Hide other containers
                    }
                }
            });
        }
    
        // Function to restore pending requests as default
        function showPendingRequests() {
            hideAllExcept(friendRequestsContainer);
            friendRequestsContainer.style.display = "block";
            loadPendingFriendRequests(); // Refresh the list
        }
    
        // Load pending requests on initial dashboard load
        if (friendRequestsContainer) {
            friendRequestsContainer.style.display = "block";
            loadPendingFriendRequests();
        }
    
        // Add Friends Button: Toggle search bar, default to pending requests when off
        if (addFriendsButton && searchBarContainer) {
            addFriendsButton.addEventListener("click", () => {
                if (searchBarContainer.style.display === "none" || searchBarContainer.style.display === "") {
                    hideAllExcept(searchBarContainer);
                    searchBarContainer.style.display = "block";
                    fetchAndDisplayUsers();
                } else {
                    searchBarContainer.style.display = "none";
                    showPendingRequests(); // Restore pending requests when hiding search bar
                }
            });
        }
    
        // Friends Button: Toggle friend list, default to pending requests when off
        if (friendsButton) {
            friendsButton.addEventListener("click", () => {
                const existingFriendList = document.getElementById("dynamic-friend-list");
                if (!existingFriendList) {
                    hideAllExcept(null);
                    fetchAndDisplayFriends(friendsButton);
                } else {
                    existingFriendList.remove();
                    showPendingRequests(); // Restore pending requests when hiding friend list
                }
            });
        }
    
        // Search Input: Keep search bar visible while typing
        if (searchInput) {
            searchInput.addEventListener("keyup", async () => {
                const query = searchInput.value.trim();
                if (!query) {
                    fetchAndDisplayUsers();
                } else {
                    await searchAndDisplayUsers(query);
                }
            });
        }
    }
        // 2. Listen for typing in the search bar
        // if (searchInput) {
        //   searchInput.addEventListener("keyup", async () => {
        //     const query = searchInput.value.trim();
        //     if (!query) {
        //       // If input is empty, show all users again
        //       fetchAndDisplayUsers();
        //     } else {
        //       searchAndDisplayUsers(query);
        //     }
        //   });
        // }
      
        // 3. Friends button: fetch and display friend list
        // if (friendsButton) {
        //   friendsButton.addEventListener("click", async () => {
        //     const user_id = localStorage.getItem("user_id");
        //     if (!user_id) {
        //       alert("User ID not found. Please sign in again.");
        //       return;
        //     }
        //     try {
        //       const response = await fetch(`http://127.0.0.1:8000/friends/list/`, {
        //         method: "GET",
        //         headers: {
        //           "Content-Type": "application/json",
        //           "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        //         }
        //       });
        //       if (response.ok) {
        //         const friends = await response.json();
        //         // displayFriendsList(friends);
        //       } else {
        //         alert("Failed to fetch friend list.");
        //       }
        //     } catch (error) {
        //       console.error("Error fetching friend list:", error);
        //     }
        //   });
        // }
    //   }
      
      // Display the friend list in a separate container or modal
    //   function displayFriendsList(friends) {
    //     let friendsContainer = document.getElementById("friends-list-container");
    //     if (!friendsContainer) {
    //       friendsContainer = document.createElement("div");
    //       friendsContainer.id = "friends-list-container";
    //       document.body.appendChild(friendsContainer);
    //     }
    //     friendsContainer.innerHTML = ""; // Clear previous list
    //     friendsContainer.style.display = "block"; // Make sure it is visible
    
    //     friends.forEach((friend) => {
    //       const friendDiv = document.createElement("div");
    //       friendDiv.classList.add("friend-item");
    //       friendDiv.textContent = friend.username;
    //       console.log(friend.username);
    //       friendsContainer.appendChild(friendDiv);
    //     });
    //   }
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          // Pick a random index from 0 to i
          const j = Math.floor(Math.random() * (i + 1));
          // Swap elements array[i] and array[j]
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }

      // Fetch and display ALL users
    //   async function fetchAndDisplayUsers() {
    //     try {
    //       const response = await fetch("http://127.0.0.1:8000/users/", {
    //         method: "GET",
    //         headers: {
    //           "Content-Type": "application/json",
    //           // Include Authorization if your endpoint requires a token:
    //           "Authorization": `Bearer ${localStorage.getItem("authToken")}`
    //         }
    //       });
      
    //       if (!response.ok) {
    //         console.error("Failed to fetch users. Status:", response.status);
    //         return;
    //       }
      
    //       // Parse the JSON
    //       const data = await response.json();
    //       console.log("API Response:", data);
    //     //   const userslist = data.data;
      
    //       // If your backend returns an array directly, or something like { data: [...] }
    //       let userList = [];
    //     if (data.data && Array.isArray(data.data)) {
    //         userList = data.data.map(item => Object.assign({}, item.attributes, { id: item.id }));
    //       } else {
    //         console.error("Unexpected response format:", data);
    //         return;
    //       }
          
    //           // Filter out the current user (if user_id exists in localStorage)
    //         const currentUserId = localStorage.getItem("user_id");
    //         if (currentUserId) {
    //           userList = userList.filter(user => parseInt(user.id) !== parseInt(currentUserId));
    //         }
    
    //         shuffleArray(userList);
    //       // Limit to first 5 users
    //       const limitedUsers = userList.slice(0, 6);
      
    //       // Display them in the #user-list-container
    //       const container = document.getElementById("user-list-container");
    //       if (!container) {
    //         console.error("No container found with id='user-list-container'");
    //         return;
    //       }
    //       container.innerHTML = ""; // Clear previous content
      
    //       limitedUsers.forEach(user => {
        //         // Create a row
    //         const userRow = document.createElement("div");
    //         userRow.classList.add("user-row");
            
    //         console.log("users : " ,user);
    //         // Avatar image
    //         const avatarImg = document.createElement("img");
    //         // If your backend returns a field like 'avatar_url', adjust accordingly:
    //         avatarImg.src = user.avatar || "images/default-avatar.png";
    //         avatarImg.alt = user.username || "User Avatar";
    
    //         console.log("avatar 1: " ,avatarImg.src);
    //         console.log("avatar 2: " ,user.avatar);
    //         // Username
    //         const usernameSpan = document.createElement("span");
    //         usernameSpan.classList.add("username");
    //         usernameSpan.textContent = user.username || "Unknown";

    //         console.log("username 1: " ,usernameSpan.textContent);
    //         console.log("username 2: " ,user.username);
      
    //         userRow.appendChild(avatarImg);
    //         userRow.appendChild(usernameSpan);
    //         container.appendChild(userRow);
    //       });
      
    //     } catch (error) {
    //       console.error("Error fetching users:", error);
    //     }
    //   }

    async function sendFriendRequest(receiverId) {
        try {
            console.log("Sending friend request to user ID:", receiverId);
            console.log("Token:", localStorage.getItem("authToken"));
            const response = await fetch(`http://127.0.0.1:8000/friends/send/${receiverId}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${JSON.stringify(errorData)}`);
                alert(`Error: ${errorData.message || "Failed to send friend request"}`);
                return;
            }

            const data = await response.json();
            alert(`Success: ${data.message || "Friend request sent successfully!"}`);
        } catch (error) {
            console.error("Error sending friend request:", error);
            alert("An unexpected error occurred.");
        }
    }

    // Add these helper functions after `loadPendingFriendRequests`
async function acceptFriendRequest(requestId) {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://127.0.0.1:8000/friends/accept/${requestId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        alert("Friend request accepted!");
        // Reload the friend requests to update the UI
        loadPendingFriendRequests();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to accept friend request");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("An error occurred while accepting the friend request.");
    }
  }
  
  async function rejectFriendRequest(requestId) {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://127.0.0.1:8000/friends/reject/${requestId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        alert("Friend request rejected!");
        // Reload the friend requests to update the UI
        loadPendingFriendRequests();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to reject friend request");
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      alert("An error occurred while rejecting the friend request.");
    }
  }
  
  // Replace your existing `loadPendingFriendRequests` function with this:
    async function loadPendingFriendRequests() {
      try {
        const response = await fetch("http://127.0.0.1:8000/friends/pending/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
      
        if (!response.ok) {
          console.error("Failed to fetch pending friend requests. Status:", response.status);
          return;
        }
      
        const data = await response.json();
        console.log("Pending friend requests API response:", data);
      
        let pendingList = [];
        if (data.data && Array.isArray(data.data)) {
          pendingList = data.data.map(item => Object.assign({}, item.attributes, { id: item.id }));
        } else {
          console.error("Unexpected response format for pending friend requests:", data);
          return;
        }
      
        const noFriendElem = document.getElementById("no-friend");
        const friendRequestsList = document.getElementById("friend-requests-list");
        friendRequestsList.innerHTML = "";
      
        if (pendingList.length === 0) {
            noFriendElem.style.display = "block"; // Show "No friend requests found"
            friendRequestsList.style.display = "none"; // Hide list container
        } else {
            noFriendElem.style.display = "none"; // Hide message
            friendRequestsList.style.display = "block"; // Show list
            pendingList.forEach(request => {
                const requestDiv = document.createElement("div");
                requestDiv.classList.add("friend-request-item");
            
            // Avatar image
            const avatarImg = document.createElement("img");
            //check for img intra url
            if(request.sender_avatar.startsWith("https://"))
            {
                avatarImg.src = request.sender_avatar || "images/default-avatar.png";
                avatarImg.alt = request.sender_username || "User Avatar";
                avatarImg.classList.add("user-avatar");
            }
            else
            {
                avatarImg.src = `http://127.0.0.1:8000${request.sender_avatar}` || "images/default-avatar.png";
                console.log("avatar 1: " ,avatarImg.src);
                avatarImg.alt = request.sender_username || "User Avatar";
                avatarImg.classList.add("user-avatar");
            }
            // Username
            const usernameSpan = document.createElement("span");
            usernameSpan.classList.add("username");
            usernameSpan.textContent = request.sender_username || "Unknown";
            
            // Accept button
            const acceptButton = document.createElement("button");
            acceptButton.textContent = "Accept";
            acceptButton.classList.add("accept-button");
            acceptButton.addEventListener("click", () => acceptFriendRequest(request.id));
            
            // Reject button
            const rejectButton = document.createElement("button");
            rejectButton.textContent = "Reject";
            rejectButton.classList.add("reject-button");
            rejectButton.addEventListener("click", () => rejectFriendRequest(request.id));
            
            // Append elements to the request div
            requestDiv.appendChild(avatarImg);
            requestDiv.appendChild(usernameSpan);
            requestDiv.appendChild(acceptButton);
            requestDiv.appendChild(rejectButton);
            
            // Append the request div to the list container
            friendRequestsList.appendChild(requestDiv);
          });
        }
      } catch (error) {
        console.error("Error loading pending friend requests:", error);
      }
    }

    async function fetchAndDisplayFriends(friendsButton) {
        try {

            console.log("authToken: ", localStorage.getItem("authToken"));
          const response = await fetch("http://127.0.0.1:8000/friends/list/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            },
          });
      
          if (!response.ok) {
            console.error("Failed to fetch friend list. Status:", response.status);
            return;
          }
      
          const data = await response.json();
          console.log("Friend list API response:", data);
      
          let friendList = [];
          if (data.data && Array.isArray(data.data)) {
            friendList = data.data.map(item => Object.assign({}, item.attributes, { id: item.id }));
          } else {
            console.error("Unexpected response format for friend list:", data);
            return;
          }
      
          // Check if the friend list container already exists
          let friendListContainer = document.getElementById("dynamic-friend-list");
          if (friendListContainer) {
            friendListContainer.remove(); // Remove it if it exists to toggle off
            return;
          }
      
          // Create a new container for the friend list
          friendListContainer = document.createElement("div");
          friendListContainer.id = "dynamic-friend-list";
          friendListContainer.classList.add("friend-list-container");
      
          if (friendList.length === 0)
          {
            let noFriendsMessage = document.createElement("h2"); // Create a new paragraph element
            noFriendsMessage.textContent = "No friends found.";
            noFriendsMessage.classList.add("no-friends-message"); // Add styling class
            friendListContainer.appendChild(noFriendsMessage);
          } else {
            friendList.forEach(friend => {
              const friendDiv = document.createElement("div");
              friendDiv.classList.add("friend-item");
      
              // Avatar image
              const avatarImg = document.createElement("img");
            if (friend.avatar.startsWith("https://"))
            {
                avatarImg.src = friend.avatar || "images/default-avatar.png";
                avatarImg.alt = friend.username || "Friend Avatar";
                avatarImg.classList.add("friend-avatar");
            }
            else
            {
              avatarImg.src = `http://127.0.0.1:8000${friend.avatar}` || "images/default-avatar.png";
              avatarImg.alt = friend.username || "Friend Avatar";
              avatarImg.classList.add("friend-avatar");
            }
              // Username
              const usernameSpan = document.createElement("span");
              usernameSpan.classList.add("friend-username");
              usernameSpan.textContent = friend.username || "Unknown";

                      //             // Add Remove Button
              const removeButton = document.createElement("button");
              removeButton.textContent = "Remove";
              removeButton.classList.add("remove-friend-btn");
              removeButton.addEventListener("click", () => removeFriend(friend.username, friendListContainer));
      
              friendDiv.appendChild(avatarImg);
              friendDiv.appendChild(usernameSpan);
              friendDiv.appendChild(removeButton);
              friendListContainer.appendChild(friendDiv);
            });
          }
      
          // Insert the container right after the Friends button
          friendsButton.insertAdjacentElement("afterend", friendListContainer);
        } catch (error) {
          console.error("Error fetching friend list:", error);
        }
      }

        // async function fetchAndDisplayFriends(buttonElement) {
        //     try {
        //         const response = await fetch("http://127.0.0.1:8000/friends/list/", {
        //             method: "GET",
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        //             },
        //         });
        //         if (!response.ok) throw new Error("Failed to fetch friend list");

        //         const data = await response.json();
        //         let friendList = data.map(item => ({
        //             id: item.id,
        //             username: item.username,
        //             avatar: item.avatar || "images/default-avatar.png"
        //         }));

        //         const friendListDiv = document.createElement("div");
        //         friendListDiv.id = "dynamic-friend-list";
        //         friendListDiv.className = "friend-list-container";

        //         friendList.forEach(friend => {
        //             const friendDiv = document.createElement("div");
        //             friendDiv.classList.add("friend-item");

        //             const avatarImg = document.createElement("img");
        //             avatarImg.src = friend.avatar.startsWith("https://") 
        //                 ? friend.avatar 
        //                 : `http://127.0.0.1:8000${friend.avatar}`;
        //             avatarImg.alt = friend.username || "Friend Avatar";
        //             avatarImg.classList.add("user-avatar");

        //             const usernameSpan = document.createElement("span");
        //             usernameSpan.classList.add("username");
        //             usernameSpan.textContent = friend.username || "Unknown";

        //             // Add Remove Button
        //             const removeButton = document.createElement("button");
        //             removeButton.textContent = "Remove";
        //             removeButton.classList.add("remove-friend-btn");
        //             removeButton.addEventListener("click", () => removeFriend(friend.username, friendListDiv));

        //             friendDiv.appendChild(avatarImg);
        //             friendDiv.appendChild(usernameSpan);
        //             friendDiv.appendChild(removeButton);
        //             friendListDiv.appendChild(friendDiv);
        //         });

        //         buttonElement.insertAdjacentElement('afterend', friendListDiv);
        //     } catch (error) {
        //         console.error("Error fetching friends:", error);
        //     }
        // }

        async function removeFriend(username, friendListDiv) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/friends/remove/${username}/`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
    
                if (response.ok) {
                    console.log(`Friend ${username} removed successfully`);
                    friendListDiv.remove(); // Remove current list
                    fetchAndDisplayFriends(friendsButton); // Refresh friend list
                    
                } else {
                    const errorData = await response.json();
                    console.error("Failed to remove friend:", errorData);
                    alert(errorData.error || "Failed to remove friend");
                }
            } catch (error) {
                console.error("Error removing friend:", error);
                alert("Error removing friend. Please try again.");
            }
        }

      async function  fetchAndDisplayFriendschat() {
        try {
            const response = await fetch("http://127.0.0.1:8000/friends/list/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
    
            if (!response.ok) {
                console.error("Failed to fetch friend list. Status:", response.status);
                return;
            }
    
            const data = await response.json();
            console.log("Friend list API response:", data);
    
            let friendList = [];
            if (data.data && Array.isArray(data.data)) {
                friendList = data.data.map(item => Object.assign({}, item.attributes, { id: item.id }));
            } else {
                console.error("Unexpected response format for friend list:", data);
                return;
            }
    
            const friendListContainer = document.getElementById("chat-friend-list");
            if (!friendListContainer) {
                console.error("Chat friend list container not found.");
                return;
            }
    
            friendListContainer.innerHTML = ""; // Clear previous content
    
            if (friendList.length === 0) {
                const noFriendsMessage = document.createElement("div");
                noFriendsMessage.classList.add("no-friends");
                noFriendsMessage.textContent = "No friends found.";
                friendListContainer.appendChild(noFriendsMessage);
            } else {
                friendList.forEach(friend => {
                    const friendDiv = document.createElement("div");
                    friendDiv.classList.add("user");
                    friendDiv.setAttribute("data-friend-id", friend.id);
                    friendDiv.setAttribute("data-friend-name", friend.username);
                    friendDiv.addEventListener("click", () => switchConversation(friend.username));
    
                    const iconDiv = document.createElement("div");
                    iconDiv.classList.add("icon");
                    const avatarImg = document.createElement("img");
                    if (friend.avatar.startsWith("https://")) {
                        avatarImg.src = friend.avatar || "images/default-avatar.png";
                    } else {
                        avatarImg.src = `http://127.0.0.1:8000${friend.avatar}` || "images/default-avatar.png";
                    }
                    avatarImg.alt = friend.username || "Friend Avatar";
                    iconDiv.appendChild(avatarImg);
    
                    const nameDiv = document.createElement("div");
                    nameDiv.textContent = friend.username || "Unknown";
    
                    friendDiv.appendChild(iconDiv);
                    friendDiv.appendChild(nameDiv);
                    friendListContainer.appendChild(friendDiv);
                });
            }
        } catch (error) {
            console.error("Error fetching friend list:", error);
        }
    }
    // async function loadPendingFriendRequests() {
    //     try {
    //       const response = await fetch("http://127.0.0.1:8000/friends/pending/", {
    //         method: "GET",
    //         headers: {
    //           "Content-Type": "application/json",
    //           "Authorization": `Bearer ${localStorage.getItem("authToken")}`
    //         }
    //       });
            //this one working rememebr it//////////
    //       if (!response.ok) {
    //         console.error("Failed to fetch pending friend requests. Status:", response.status);
    //         return;
    //       }
      
    //       const data = await response.json();
    //       console.log("Pending friend requests API response:", data);
          
    //       // Map the JSON:API response: data.data is an array of friend requests,
    //       // and each item has an "attributes" property.
    //       let pendingList = [];
    //       if (data.data && Array.isArray(data.data)) {
    //         pendingList = data.data.map(item => Object.assign({}, item.attributes, { id: item.id }));
    //       } else {
    //         console.error("Unexpected response format for pending friend requests:", data);
    //         return;
    //       }
      
    //       const noFriendElem = document.getElementById("no-friend");
    //       const friendRequestsList = document.getElementById("friend-requests-list");
    //     //   const searchBarContainer = document.getElementById("search-bar-container");
    //     //   const addFriendsButton = document.getElementById("add-friends-btn");
    //       friendRequestsList.innerHTML = "";
      
    //       if (pendingList.length === 0)
    //       {
    //         noFriendElem.style.display = "block";
    //       }
    //       else
    //       {
    //         noFriendElem.style.display = "none";
    //         pendingList.forEach(request => {
    //           // Create a container for each request
    //           const requestDiv = document.createElement("div");
    //           requestDiv.classList.add("friend-request-item");
              
    //           // Create an image for the sender's avatar
    //           const avatarImg = document.createElement("img");
    //           avatarImg.src = request.sender_avatar || "images/default-avatar.png";
    //           avatarImg.alt = request.sender_username || "User Avatar";
    //           avatarImg.classList.add("user-avatar");
      
    //           // Create a span for the sender's username
    //           const usernameSpan = document.createElement("span");
    //           usernameSpan.classList.add("username");
    //           usernameSpan.textContent = request.sender_username || "Unknown";
      
    //           // Append avatar and username to the request div
    //           requestDiv.appendChild(avatarImg);
    //           requestDiv.appendChild(usernameSpan);
      
    //           // Append the request div to the list container
    //           friendRequestsList.appendChild(requestDiv);
    //         });
    //       }
    //     } catch (error) {
    //       console.error("Error loading pending friend requests:", error);
    //     }
    //   }
      
    // async function loadPendingFriendRequests() {
    //     try {
    //         const response = await fetch("http://127.0.0.1:8000/friends/pending/", {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
    //             },
    //         });
    
    //         if (!response.ok) {
    //             console.error("Failed to fetch pending friend requests.");
    //             return;
    //         }
    
    //         const data = await response.json();
    
    //         // Get the container elements
    //         const noFriendRequestsMessage = document.getElementById("no-friend");
    //         const friendRequestsList = document.getElementById("friend-requests-list");
    
    //         // Clear the friend requests list
    //         friendRequestsList.innerHTML = "";
    
    //         if (data.length === 0) {
    //             // Show the "No friend requests found" message if no requests
    //             noFriendRequestsMessage.style.display = "block";
    //         } else {
    //             // Hide the "No friend requests found" message if requests exist
    //             noFriendRequestsMessage.style.display = "none";
    
    //             // Render each friend request
    //             data.data.forEach((request) => {
    //                 const requestElement = document.createElement("div");
    //                 requestElement.classList.add("friend-request");
    
    //                 // Display sender information and actions
    //                 requestElement.innerHTML = `
    //                     <p>${request.sender.username} has sent you a friend request.</p>
    //                 `;
    
    //                 friendRequestsList.appendChild(requestElement);
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Error loading pending friend requests:", error);
    //     }
    // }

    function displayUserSearchResults(users) {
        const resultsContainer = document.getElementById("user-list-container");
        if (!resultsContainer) return;
      
        resultsContainer.innerHTML = ""; // Clear previous results
      
        users.forEach((user) => {
          const userDiv = document.createElement("div");
          userDiv.classList.add("user-row");
      
          // Create avatar image element
          const avatarImg = document.createElement("img");
        //   avatarImg.src = user.avatar || "images/default-avatar.png";
        if (user.avatar.startsWith("https://"))
        {
            avatarImg.src = user.avatar || "images/default-avatar.png";
            avatarImg.alt = user.username || "User Avatar";
            avatarImg.classList.add("user-avatar");
        }
        else
        {
            avatarImg.src = `http://127.0.0.1:8000${user.avatar}` || "images/default-avatar.png";
            console.log("avatar 1: " ,avatarImg.src);
            avatarImg.alt = user.username || "User Avatar";
        //   avatarImg.classList.add("user-avatar");
        }
        
          // Create username element
          const usernameSpan = document.createElement("span");
          usernameSpan.classList.add("username");
          usernameSpan.textContent = user.username || "Unknown";

            // Create Invite Button
          const inviteButton = document.createElement("button");
          inviteButton.textContent = "Invite";
          inviteButton.classList.add("invite-button");
          inviteButton.onclick = () => sendFriendRequest(user.id); // Attach click event
      
        // Append elements to the user row
          userDiv.appendChild(avatarImg);
          userDiv.appendChild(usernameSpan);
          userDiv.appendChild(inviteButton);
      
          // Append the user row to the results container
          resultsContainer.appendChild(userDiv);
        });
      }

    async function fetchAndDisplayUsers() {
        try {
            const response = await fetch("http://127.0.0.1:8000/users/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
          });
      
          if (!response.ok) {
            console.error("Failed to fetch users. Status:", response.status);
            return;
          }
      
          const data = await response.json();
          let userList = [];
          if (data.data && Array.isArray(data.data)) {
            // Map each item to include its attributes plus its id
            userList = data.data.map(item => Object.assign({}, item.attributes, { id: item.id }));
          } else {
            console.error("Unexpected response format:", data);
            return;
          }
      
          // Exclude the current user (if user_id is stored)
          const currentUserId = localStorage.getItem("user_id");
          console.log("Current User ID:", currentUserId);
          if (currentUserId) {
            userList = userList.filter(user => parseInt(user.id) !== parseInt(currentUserId));
          }
      
          // Save the full list globally
          allUsers = userList;
          shuffleArray(userList);

          // Display only the first 5 users
          const limitedUsers = userList.slice(0, 6);
          displayUserSearchResults(limitedUsers);
        } catch (error) {
          console.error("Error fetching all users:", error);
        }
      }

      async function searchAndDisplayUsers(query) {
        // If allUsers isn't loaded yet, fetch it first
        if (!allUsers.length) {
          await fetchAndDisplayUsers();
        }
        // Filter allUsers by username (case-insensitive)
        const filteredUsers = allUsers.filter(user =>
          user.username.toLowerCase().includes(query.toLowerCase())
        );
        // Limit the results to 5
        // const limitedFiltered = filteredUsers.slice(0, 5);
        displayUserSearchResults(filteredUsers);
      }

      // Fetch and display users matching a search query
    //   async function searchAndDisplayUsers(query) {
    //     try {
    //       const response = await fetch(`http://127.0.0.1:8000/users/?search=${query}`, {
    //         method: "GET",
    //         headers: {
    //           "Content-Type": "application/json",
    //           "Authorization": `Bearer ${localStorage.getItem("authToken")}`
    //         }
    //       });
    //       if (response.ok) {
    //         const users = await response.json();
    //         const userList = Array.isArray(users) ? users : users.data || [];
    //         displayUserSearchResults(userList);
    //       } else {
    //         console.error("Failed to fetch search results. Status:", response.status);
    //       }
    //     } catch (error) {
    //       console.error("Error fetching search results:", error);
    //     }
    //   }
      
      // Display the fetched users with avatar + username + invite button
    //   function displayUserSearchResults(users) {
    //     let resultsContainer = document.getElementById("friend-search-results");
    //     if (!resultsContainer) return;
      
    //     resultsContainer.innerHTML = ""; // Clear previous results
      
    //     users.forEach((user) => {
    //       const userDiv = document.createElement("div");
    //       userDiv.classList.add("user-result");
      
    //       // If your backend returns an 'avatar_url' or 'avatar' field, use it. Otherwise, use a default image.
    //       const avatarImg = document.createElement("img");
    //       avatarImg.src = user.avatar_url || "images/default-avatar.png";
    //       avatarImg.alt = user.username;
    //       avatarImg.classList.add("user-avatar");
      
    //       const usernameSpan = document.createElement("span");
    //       usernameSpan.textContent = user.username;
    //       usernameSpan.classList.add("username");
      
    //       const inviteButton = document.createElement("button");
    //       inviteButton.textContent = "Invite";
    //       inviteButton.addEventListener("click", async () => {
    //         try {
    //           const response = await fetch(`http://127.0.0.1:8000/friends/send/${user.id}/`, {
    //             method: "POST",
    //             headers: {
    //               "Content-Type": "application/json",
    //               "Authorization": `Bearer ${localStorage.getItem("authToken")}`
    //             }
    //           });
    //           if (response.ok) {
    //             alert(`Friend request sent to ${user.username}`);
    //           } else {
    //             const errorData = await response.json();
    //             alert(errorData.error || "Failed to send friend request");
    //           }
    //         } catch (error) {
    //           console.error("Error sending friend request:", error);
    //         }
    //       });
      
    //       userDiv.appendChild(avatarImg);
    //       userDiv.appendChild(usernameSpan);
    //       userDiv.appendChild(inviteButton);
      
    //       resultsContainer.appendChild(userDiv);
    //     });
    //   }
      
      

    ////////////////////////////edit profile/////////////////////////////


    function initializeProfileEdit() {
        const editProfileButton = document.getElementById('edit-p-btn');
        if (editProfileButton) {
            editProfileButton.addEventListener('click', openEditProfileModal);
        }
    }
    
    function openEditProfileModal() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'edit-profile-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '1000';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';
    
        // Create modal container
        const modal = document.createElement('div');
        modal.id = 'edit-profile-modal';
        modal.style.backgroundColor = '#fff';
        modal.style.padding = '25px';
        modal.style.borderRadius = '12px';
        modal.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        modal.style.width = '350px';
        modal.style.maxWidth = '90%';
        modal.style.fontFamily = "'Poppins', sans-serif";
        modal.style.transform = 'scale(0.9)';
        modal.style.opacity = '0';
        modal.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    
        // Title
        const title = document.createElement('h3');
        title.innerText = 'Edit Profile';
        title.style.margin = '0 0 20px';
        title.style.fontSize = '24px';
        title.style.color = '#333';
        title.style.textAlign = 'center';
    
        // Form container
        const form = document.createElement('form');
        form.id = 'edit-profile-form';
    
        // Username input
        const usernameLabel = document.createElement('label');
        usernameLabel.innerText = 'Username';
        usernameLabel.style.display = 'block';
        usernameLabel.style.marginBottom = '5px';
        usernameLabel.style.fontSize = '14px';
        usernameLabel.style.color = '#555';
    
        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.id = 'edit-username';
        usernameInput.value = document.getElementById('profile-username').innerText || '';
        usernameInput.style.width = '100%';
        usernameInput.style.padding = '10px';
        usernameInput.style.marginBottom = '15px';
        usernameInput.style.border = '1px solid #ddd';
        usernameInput.style.borderRadius = '6px';
        usernameInput.style.fontSize = '16px';
        usernameInput.style.boxSizing = 'border-box';
        usernameInput.style.transition = 'border-color 0.3s ease';
    
        // Avatar preview
        const avatarPreviewLabel = document.createElement('label');
        avatarPreviewLabel.innerText = 'Current Avatar';
        avatarPreviewLabel.style.display = 'block';
        avatarPreviewLabel.style.marginBottom = '10px';
        avatarPreviewLabel.style.fontSize = '14px';
        avatarPreviewLabel.style.color = '#555';
    
        const avatarPreview = document.createElement('img');
        avatarPreview.id = 'avatar-preview';
        avatarPreview.src = document.getElementById('profile-img').src || 'images/default-avatar.png';
        avatarPreview.style.width = '100px';
        avatarPreview.style.height = '100px';
        avatarPreview.style.borderRadius = '50%';
        avatarPreview.style.objectFit = 'cover';
        avatarPreview.style.marginBottom = '15px';
        avatarPreview.style.display = 'block';
        avatarPreview.style.marginLeft = 'auto';
        avatarPreview.style.marginRight = 'auto';
    
        // Avatar file input
        const avatarLabel = document.createElement('label');
        avatarLabel.innerText = 'Upload New Avatar';
        avatarLabel.style.display = 'block';
        avatarLabel.style.marginBottom = '5px';
        avatarLabel.style.fontSize = '14px';
        avatarLabel.style.color = '#555';
    
        const avatarInput = document.createElement('input');
        avatarInput.type = 'file';
        avatarInput.id = 'edit-avatar';
        avatarInput.accept = 'image/*'; // Restrict to images
        avatarInput.style.width = '100%';
        avatarInput.style.padding = '5px';
        avatarInput.style.marginBottom = '20px';
        avatarInput.style.fontSize = '14px';
    
        // Buttons container
        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.display = 'flex';
        buttonsDiv.style.justifyContent = 'space-between';
    
        const saveButton = document.createElement('button');
        saveButton.innerText = 'Save';
        saveButton.type = 'button';
        saveButton.style.padding = '10px 20px';
        saveButton.style.backgroundColor = '#28a745';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '6px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.fontSize = '16px';
        saveButton.style.transition = 'background-color 0.3s ease';
    
        const cancelButton = document.createElement('button');
        cancelButton.innerText = 'Cancel';
        cancelButton.type = 'button';
        cancelButton.style.padding = '10px 20px';
        cancelButton.style.backgroundColor = '#dc3545';
        cancelButton.style.color = 'white';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '6px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.style.fontSize = '16px';
        cancelButton.style.transition = 'background-color 0.3s ease';
    
        // Append elements
        form.appendChild(usernameLabel);
        form.appendChild(usernameInput);
        form.appendChild(avatarPreviewLabel);
        form.appendChild(avatarPreview);
        form.appendChild(avatarLabel);
        form.appendChild(avatarInput);
        buttonsDiv.appendChild(saveButton);
        buttonsDiv.appendChild(cancelButton);
        form.appendChild(buttonsDiv);
        modal.appendChild(title);
        modal.appendChild(form);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    
        // Animation trigger
        setTimeout(() => {
            overlay.style.opacity = '1';
            modal.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        }, 10);
    
        // Input hover/focus effects
        usernameInput.addEventListener('focus', () => {
            usernameInput.style.borderColor = '#28a745';
        });
        usernameInput.addEventListener('blur', () => {
            usernameInput.style.borderColor = '#ddd';
        });
    
        // Preview avatar when file is selected
        avatarInput.addEventListener('change', () => {
            const file = avatarInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    avatarPreview.src = e.target.result; // Live preview
                };
                reader.readAsDataURL(file);
            }
        });
    
        // Button hover effects
        saveButton.addEventListener('mouseover', () => {
            saveButton.style.backgroundColor = '#218838';
        });
        saveButton.addEventListener('mouseout', () => {
            saveButton.style.backgroundColor = '#28a745';
        });
        cancelButton.addEventListener('mouseover', () => {
            cancelButton.style.backgroundColor = '#c82333';
        });
        cancelButton.addEventListener('mouseout', () => {
            cancelButton.style.backgroundColor = '#dc3545';
        });
    
        // Cancel: Fade out and remove
        cancelButton.addEventListener('click', () => {
            overlay.style.opacity = '0';
            modal.style.opacity = '0';
            modal.style.transform = 'scale(0.9)';
            setTimeout(() => document.body.removeChild(overlay), 300);
        });
    
        // Save: Upload file and update profile
        saveButton.addEventListener('click', async () => {
            const newUsername = usernameInput.value.trim();
            console.log("New username:", newUsername);
            const file = avatarInput.files[0];
        
            if (!newUsername) {
                usernameInput.value = document.getElementById('profile-username').innerText;
                return;
            }
        
            try {
                const token = localStorage.getItem('authToken');
                const formData = new FormData();
                formData.append('username', newUsername); // Match backend field
                if (file) {
                    formData.append('avatar', file);
                }
        
                const response = await fetch('http://127.0.0.1:8000/profile/update/', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
        
                console.log("Response status:", response.status);
                const result = await response.json();
                console.log("PUT Response Data:", result);
        
                if (response.ok) {
                    // Update username
                    document.getElementById('profile-username').innerText = newUsername;
        
                    // Update avatar if uploaded, using backend URL, not avatarPreview.src
                    // if (file) {
                    //     const newAvatarUrl = result.profile?.avatar || 'images/default-avatar.png';
                    //     console.log("New avatar URL from backend:", newAvatarUrl);
                    //     const profileImg = document.getElementById('profile-img');
                    //     profileImg.src = `http://127.0.0.1:8000${newAvatarUrl}?t=${new Date().getTime()}`; // Force reload with base URL
                    //     profileImg.onload = () => console.log("Image loaded successfully");
                    //     profileImg.onerror = () => console.error("Image failed to load:", newAvatarUrl);
                    // }
                    loadProfileInfo();
                    alert("Profile updated successfully!");
                    // Sync with backend
                }
                else
                {
                    console.error("Server error:", result);
                    alert("Failed to update profile: " + JSON.stringify(result));
                }
            } catch (error) {
                console.error("Error updating profile:", error);
                alert("Error updating profile. Please try again.");
            }
        
            overlay.style.opacity = '0';
            modal.style.opacity = '0';
            modal.style.transform = 'scale(0.9)';
            setTimeout(() => document.body.removeChild(overlay), 300);
        });
        // saveButton.addEventListener('click', async () => {
        //     const newUsername = usernameInput.value.trim();
        //     console.log("new user: ", newUsername);
        //     const file = avatarInput.files[0]; // Get the file from the input
        
        //     // If no new username, keep the existing one
        //     if (!newUsername) {
        //         usernameInput.value = document.getElementById('profile-username').innerText;
        //         return;
        //     }
        
        //     try {
        //         const token = localStorage.getItem('authToken'); // Get the token from localStorage
        //         const formData = new FormData();
        
        //         // Append the username to the FormData
        //         formData.append('username', newUsername);
        
        //         // If a file (avatar) is selected, append it to the FormData
        //         if (file) {
        //             formData.append('avatar', file); // Ensure the name matches the backend expected field name
        //         }
        
        //         // Make the PUT request to the backend with the FormData in the body
        //         const response = await fetch('http://127.0.0.1:8000/profile/update/', {
        //             method: 'PUT',
        //             headers: {
        //                 'Authorization': `Bearer ${token}`,  // Include the Bearer token
        //                 // Do not set 'Content-Type' here, let the browser handle it automatically
        //             },
        //             body: formData,  // Send the FormData as the body of the request
        //         });
        
        //         console.log("Response status:", response.status); // Log the response status
        //         const result = await response.json(); // Parse the response as JSON
        //         console.log("Backend response:", result); // Log the result from the backend
        
        //         if (response.ok) {
        //             // Check if the backend returns the avatar URL correctly
        //             if (result.data && result.data.profile && result.data.profile.attributes && result.data.profile.attributes.avatar) {
        //                 const avatarUrl = result.data.profile.attributes.avatar;  // Extract the full avatar URL
        //                 console.log("Updated avatar URL:", avatarUrl);  // Log for debugging
        
        //                 // Update the profile image with the new avatar URL
        //                 const avatarImg = document.getElementById('profile-img');
        //                 avatarImg.src = avatarUrl;  // Update the profile image source
        
        //                 // If needed, also update the avatar preview in the modal
        //                 const avatarPreview = document.getElementById('avatar-preview');
        //                 avatarPreview.src = avatarUrl;
        //             }
        
        //             // You can also update the username if needed
        //             const profileUsername = document.getElementById('profile-username');
        //             profileUsername.innerText = newUsername;
        
        //             loadProfileInfo();  // Optionally refresh the profile data from backend
        
        //         } else {
        //             console.error("Server error:", result);
        //             alert("Failed to update profile: " + JSON.stringify(result));
        //         }
        //     } catch (error) {
        //         console.error("Error updating profile:", error);
        //         alert("Error updating profile. Please try again.");
        //     }
        
        //     // Hide the modal after updating
        //     overlay.style.opacity = '0';
        //     modal.style.opacity = '0';
        //     modal.style.transform = 'scale(0.9)';
        //     setTimeout(() => document.body.removeChild(overlay), 300);
        // });
        
                
    }
    // function initializeProfileEdit() {
    //     const editProfileButton = document.getElementById('edit-p-btn');
    //     if (editProfileButton) {
    //         editProfileButton.addEventListener('click', openEditProfileModal);
    //     }
    // }
    
    // function openEditProfileModal() {
    //     // Create overlay
    //     const overlay = document.createElement('div');
    //     overlay.id = 'edit-profile-overlay';
    //     overlay.style.position = 'fixed';
    //     overlay.style.top = '0';
    //     overlay.style.left = '0';
    //     overlay.style.width = '100%';
    //     overlay.style.height = '100%';
    //     overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'; // Slightly darker overlay
    //     overlay.style.display = 'flex';
    //     overlay.style.alignItems = 'center';
    //     overlay.style.justifyContent = 'center';
    //     overlay.style.zIndex = '1000';
    //     overlay.style.opacity = '0';
    //     overlay.style.transition = 'opacity 0.3s ease'; // Fade-in/out animation
    
    //     // Create modal container
    //     const modal = document.createElement('div');
    //     modal.id = 'edit-profile-modal';
    //     modal.style.backgroundColor = '#fff';
    //     modal.style.padding = '25px';
    //     modal.style.borderRadius = '12px';
    //     modal.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'; // Soft shadow
    //     modal.style.width = '350px';
    //     modal.style.maxWidth = '90%';
    //     modal.style.fontFamily = "'Poppins', sans-serif";
    //     modal.style.transform = 'scale(0.9)'; // Start slightly smaller for animation
    //     modal.style.opacity = '0';
    //     modal.style.transition = 'transform 0.3s ease, opacity 0.3s ease'; // Scale and fade animation
    
    //     // Title
    //     const title = document.createElement('h3');
    //     title.innerText = 'Edit Profile';
    //     title.style.margin = '0 0 20px';
    //     title.style.fontSize = '24px';
    //     title.style.color = '#333';
    //     title.style.textAlign = 'center';
    
    //     // Form container
    //     const form = document.createElement('form');
    //     form.id = 'edit-profile-form';
    
    //     // Username input
    //     const usernameLabel = document.createElement('label');
    //     usernameLabel.innerText = 'Username';
    //     usernameLabel.style.display = 'block';
    //     usernameLabel.style.marginBottom = '5px';
    //     usernameLabel.style.fontSize = '14px';
    //     usernameLabel.style.color = '#555';
    
    //     const usernameInput = document.createElement('input');
    //     usernameInput.type = 'text';
    //     usernameInput.id = 'edit-username';
    //     usernameInput.value = document.getElementById('profile-username').innerText || '';
    //     usernameInput.style.width = '100%';
    //     usernameInput.style.padding = '10px';
    //     usernameInput.style.marginBottom = '15px';
    //     usernameInput.style.border = '1px solid #ddd';
    //     usernameInput.style.borderRadius = '6px';
    //     usernameInput.style.fontSize = '16px';
    //     usernameInput.style.boxSizing = 'border-box';
    //     usernameInput.style.transition = 'border-color 0.3s ease';
    
    //     // Avatar URL input
    //     const avatarLabel = document.createElement('label');
    //     avatarLabel.innerText = 'Avatar URL';
    //     avatarLabel.style.display = 'block';
    //     avatarLabel.style.marginBottom = '5px';
    //     avatarLabel.style.fontSize = '14px';
    //     avatarLabel.style.color = '#555';
    
    //     const avatarInput = document.createElement('input');
    //     avatarInput.type = 'text';
    //     avatarInput.id = 'edit-avatar';
    //     avatarInput.value = document.getElementById('profile-img').src || '';
    //     avatarInput.style.width = '100%';
    //     avatarInput.style.padding = '10px';
    //     avatarInput.style.marginBottom = '20px';
    //     avatarInput.style.border = '1px solid #ddd';
    //     avatarInput.style.borderRadius = '6px';
    //     avatarInput.style.fontSize = '16px';
    //     avatarInput.style.boxSizing = 'border-box';
    //     avatarInput.style.transition = 'border-color 0.3s ease';
    
    //     // Buttons container
    //     const buttonsDiv = document.createElement('div');
    //     buttonsDiv.style.display = 'flex';
    //     buttonsDiv.style.justifyContent = 'space-between';
    
    //     const saveButton = document.createElement('button');
    //     saveButton.innerText = 'Save';
    //     saveButton.type = 'button'; // Prevent form submission
    //     saveButton.style.padding = '10px 20px';
    //     saveButton.style.backgroundColor = '#28a745';
    //     saveButton.style.color = 'white';
    //     saveButton.style.border = 'none';
    //     saveButton.style.borderRadius = '6px';
    //     saveButton.style.cursor = 'pointer';
    //     saveButton.style.fontSize = '16px';
    //     saveButton.style.transition = 'background-color 0.3s ease';
    
    //     const cancelButton = document.createElement('button');
    //     cancelButton.innerText = 'Cancel';
    //     cancelButton.type = 'button';
    //     cancelButton.style.padding = '10px 20px';
    //     cancelButton.style.backgroundColor = '#dc3545';
    //     cancelButton.style.color = 'white';
    //     cancelButton.style.border = 'none';
    //     cancelButton.style.borderRadius = '6px';
    //     cancelButton.style.cursor = 'pointer';
    //     cancelButton.style.fontSize = '16px';
    //     cancelButton.style.transition = 'background-color 0.3s ease';
    
    //     // Append elements
    //     form.appendChild(usernameLabel);
    //     form.appendChild(usernameInput);
    //     form.appendChild(avatarLabel);
    //     form.appendChild(avatarInput);
    //     buttonsDiv.appendChild(saveButton);
    //     buttonsDiv.appendChild(cancelButton);
    //     form.appendChild(buttonsDiv);
    //     modal.appendChild(title);
    //     modal.appendChild(form);
    //     overlay.appendChild(modal);
    //     document.body.appendChild(overlay);
    
    //     // Animation trigger (after appending to DOM)
    //     setTimeout(() => {
    //         overlay.style.opacity = '1';
    //         modal.style.opacity = '1';
    //         modal.style.transform = 'scale(1)';
    //     }, 10);
    
    //     // Input hover/focus effects
    //     [usernameInput, avatarInput].forEach(input => {
    //         input.addEventListener('focus', () => {
    //             input.style.borderColor = '#28a745';
    //         });
    //         input.addEventListener('blur', () => {
    //             input.style.borderColor = '#ddd';
    //         });
    //     });
    
    //     // Button hover effects
    //     saveButton.addEventListener('mouseover', () => {
    //         saveButton.style.backgroundColor = '#218838';
    //     });
    //     saveButton.addEventListener('mouseout', () => {
    //         saveButton.style.backgroundColor = '#28a745';
    //     });
    //     cancelButton.addEventListener('mouseover', () => {
    //         cancelButton.style.backgroundColor = '#c82333';
    //     });
    //     cancelButton.addEventListener('mouseout', () => {
    //         cancelButton.style.backgroundColor = '#dc3545';
    //     });
    
    //     // Cancel: Fade out and remove
    //     cancelButton.addEventListener('click', () => {
    //         overlay.style.opacity = '0';
    //         modal.style.opacity = '0';
    //         modal.style.transform = 'scale(0.9)';
    //         setTimeout(() => document.body.removeChild(overlay), 300); // Match transition duration
    //     });
    
    //     // Save: Update profile and close
    //     saveButton.addEventListener('click', async () => {
    //         const newUsername = usernameInput.value.trim();
    //         const newAvatar = avatarInput.value.trim();
    
    //         if (!newUsername) {
    //             usernameInput.value = document.getElementById('profile-username').innerText;
    //             return;
    //         }
    
    //         try {
    //             const token = localStorage.getItem('authToken');
    //             const response = await fetch('http://127.0.0.1:8000/profile/update/', {
    //                 method: 'PUT',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${token}`
    //                 },
    //                 body: JSON.stringify({
    //                     user: { username: newUsername },
    //                     avatar: newAvatar || undefined // Send avatar only if provided
    //                 })
    //             });
    
    //             if (response.ok) {
    //                 const result = await response.json();
    //                 document.getElementById('profile-username').innerText = newUsername;
    //                 if (newAvatar) document.getElementById('profile-img').src = newAvatar;
    //                 alert("Profile updated successfully!");
    //             } else {
    //                 const errorData = await response.json();
    //                 console.error("Update error:", errorData);
    //                 alert("Failed to update profile: " + JSON.stringify(errorData));
    //             }
    //         } catch (error) {
    //             console.error("Error updating profile:", error);
    //             alert("Error updating profile. Please try again.");
    //         }
    
    //         overlay.style.opacity = '0';
    //         modal.style.opacity = '0';
    //         modal.style.transform = 'scale(0.9)';
    //         setTimeout(() => document.body.removeChild(overlay), 300);
    //     });
    
    //     // Close on overlay click (outside modal)
    //     overlay.addEventListener('click', (e) => {
    //         if (e.target === overlay) {
    //             overlay.style.opacity = '0';
    //             modal.style.opacity = '0';
    //             modal.style.transform = 'scale(0.9)';
    //             setTimeout(() => document.body.removeChild(overlay), 300);
    //         }
    //     });
    // }
    // function initializeProfileEdit() {
    //     const editProfileButton = document.getElementById('edit-p-btn');
    //     if (editProfileButton) {
    //       editProfileButton.addEventListener('click', openEditProfileModal);
    //     }
    //   }
      

    // function openEditProfileModal() {
    //     // Create modal overlay
    //     const modal = document.createElement('div');
    //     modal.id = 'edit-profile-modal';
    //     modal.style.position = 'fixed';
    //     modal.style.top = '0';
    //     modal.style.left = '0';
    //     modal.style.width = '100%';
    //     modal.style.height = '100%';
    //     modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    //     modal.style.display = 'flex';
    //     modal.style.alignItems = 'center';
    //     modal.style.justifyContent = 'center';
    //     modal.style.zIndex = '1000';
      
    //     // Create modal content container
    //     const modalContent = document.createElement('div');
    //     modalContent.style.backgroundColor = '#fff';
    //     modalContent.style.padding = '20px';
    //     modalContent.style.borderRadius = '8px';
    //     modalContent.style.minWidth = '300px';
    //     modalContent.style.textAlign = 'center';
      
    //     // Create form elements
    //     const title = document.createElement('h3');
    //     title.innerText = 'Edit Profile';
      
    //     // Username input
    //     const usernameLabel = document.createElement('label');
    //     usernameLabel.innerText = 'Username: ';
    //     const usernameInput = document.createElement('input');
    //     usernameInput.type = 'text';
    //     usernameInput.id = 'edit-username';
    //     // Prefill with current username
    //     const currentUsername = document.getElementById('profile-username').innerText || '';
    //     usernameInput.value = currentUsername;
    //     usernameInput.style.marginBottom = '10px';
    //     usernameInput.style.display = 'block';
        
    //     // Avatar input
    //     const avatarLabel = document.createElement('label');
    //     avatarLabel.innerText = 'Avatar URL: ';
    //     const avatarInput = document.createElement('input');
    //     avatarInput.type = 'text';
    //     avatarInput.id = 'edit-avatar';
    //     // Prefill with current avatar source
    //     const currentAvatar = document.getElementById('profile-img').src || '';
    //     avatarInput.value = currentAvatar;
    //     avatarInput.style.marginBottom = '10px';
    //     avatarInput.style.display = 'block';
      
    //     // Save and Cancel buttons
    //     const saveButton = document.createElement('button');
    //     saveButton.innerText = 'Save';
    //     saveButton.style.marginRight = '10px';
    //     const cancelButton = document.createElement('button');
    //     cancelButton.innerText = 'Cancel';
      
    //     // Append elements to modal content
    //     modalContent.appendChild(title);
    //     modalContent.appendChild(usernameLabel);
    //     modalContent.appendChild(usernameInput);
    //     modalContent.appendChild(avatarLabel);
    //     modalContent.appendChild(avatarInput);
    //     modalContent.appendChild(saveButton);
    //     modalContent.appendChild(cancelButton);
        
    //     modal.appendChild(modalContent);
    //     document.body.appendChild(modal);
      
    //     // Event listener for Cancel button: remove the modal
    //     cancelButton.addEventListener('click', () => {
    //       document.body.removeChild(modal);
    //     });
      
    //     // Event listener for Save button: update the profile
    //     saveButton.addEventListener('click', async () => {
    //       const newUsername = usernameInput.value.trim();
    //       if (!newUsername) {
    //         //leave the same value if the input is empty
    //         usernameInput.value = document.getElementById('profile-username').innerText;
    //         return;
    //       }
    //       const newAvatar = avatarInput.value.trim();
      
    //       // Optionally validate your input here
      
    //       try {
    //         const token = localStorage.getItem('authToken');
    //         const response = await fetch('http://127.0.0.1:8000/profile/update/', {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`
    //             },
    //             body: JSON.stringify({
    //                 user: { username: newUsername }
    //                 // avatar: newAvatar  // Omit for testing
    //             })
    //         });
        
    //         if (response.ok) {
    //             const result = await response.json();
    //             document.getElementById('profile-username').innerText = newUsername;
    //             alert("Profile updated successfully!");
    //         } else {
    //             const errorData = await response.json();
    //             console.error("Update error:", errorData);
    //             alert("Failed to update profile: " + JSON.stringify(errorData));
    //         }
    //     } catch (error) {
    //         console.error("Error updating profile:", error);
    //         alert("Error updating profile. Please try again.");
    //     }
    //     document.body.removeChild(modal); // Remove modal after update
    //     });
    //   }
      
      /////////////////////////////chat////////////////////////////////////
      
      document.querySelectorAll('.user').forEach(userElem => {
          userElem.addEventListener('click', () => {
              const userId = userElem.getAttribute('data-user-id');
              // Call your switchConversation function with the user ID or name
              switchConversation(userId);
          });
      });
      
      async function initializechatFunctionality() {
        const sendButton = document.getElementById('send-btn');
        const chatInput = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');
        const emojiPicker = document.getElementById('emojiPicker');
        const emojiToggleButton = document.getElementById('emoji-toggle-btn');
        const chatHeader = document.getElementById('chat-header');
    
        let sender;
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error("No auth token found");
            const response = await fetch('http://127.0.0.1:8000/profile/', {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error(`Profile fetch failed: ${response.status}`);
            const data = await response.json();
            sender = data.data?.attributes?.username || 'guest';
            console.log("Current user fetched:", sender);
        } catch (error) {
            console.error("Error fetching current user:", error);
            sender = 'guest';
        }
    
        let receiver = null;
        let chatSocket = null;
        let messageQueue = [];
        const conversations = JSON.parse(localStorage.getItem('conversations')) || {};
    
        await fetchAndDisplayFriendschat();
        loadChatHistory();
    
        function connectWebSocket() {
            if (!receiver || !sender) {
                console.error("Receiver or sender not set. Cannot connect WebSocket.");
                return;
            }
            const users = [sender, receiver].sort();
            const url = `ws://127.0.0.1:8000/ws/chat/${users[0]}/${users[1]}/`;
            console.log("Attempting to connect to WebSocket:", url);
    
            if (chatSocket && chatSocket.url === url && chatSocket.readyState === WebSocket.OPEN) {
                console.log("WebSocket already connected to this URL.");
                return;
            }
    
            if (chatSocket) {
                chatSocket.close(1000, "New connection starting");
                console.log("Closed previous WebSocket.");
            }
    
            chatSocket = new WebSocket(url);
    
            chatSocket.onopen = function() {
                console.log("WebSocket connected successfully.");
                while (messageQueue.length > 0) {
                    const message = messageQueue.shift();
                    chatSocket.send(JSON.stringify({ "message": message }));
                }
            };
    
            chatSocket.onmessage = function(e) {
                const data = JSON.parse(e.data);
                console.log("Received data:", data);
                if (data.message) {
                    const timestamp = new Date().toLocaleTimeString();
                    const messageSender = data.sender === sender ? 'sender' : 'receiver';
                    console.log(`Message from ${data.sender} to ${receiver}, displayed as ${messageSender}`);
                    if (!conversations[receiver]) conversations[receiver] = [];
                    const exists = conversations[receiver].some(msg => 
                        msg.text === data.message && msg.time === timestamp && msg.type === messageSender
                    );
                    if (!exists) {
                        conversations[receiver].push({ text: data.message, type: messageSender, time: timestamp });
                        localStorage.setItem('conversations', JSON.stringify(conversations));
                        displayMessage(data.message, messageSender, timestamp, data.sender);
                    }
                }
            };
    
            chatSocket.onerror = function(error) {
                console.error("WebSocket connection failed:", error);
            };
    
            chatSocket.onclose = function(event) {
                console.log("WebSocket closed. Code:", event.code, "Reason:", event.reason);
                if (event.code !== 1000) {
                    setTimeout(connectWebSocket, 2000);
                }
            };
        }
    
        function sendMessage() {
            const userMessage = chatInput.value.trim();
            if (!userMessage || !receiver || !chatSocket) {
                console.warn("Cannot send message. Missing:", { userMessage, receiver, chatSocket });
                return;
            }
    
            const timestamp = new Date().toLocaleTimeString();
            if (!conversations[receiver]) conversations[receiver] = [];
            conversations[receiver].push({ text: userMessage, type: 'sender', time: timestamp });
            localStorage.setItem('conversations', JSON.stringify(conversations));
            console.log(`Sending message from ${sender} to ${receiver}: ${userMessage}`);
            displayMessage(userMessage, 'sender', timestamp, sender);
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
    
            if (chatSocket.readyState === WebSocket.OPEN) {
                chatSocket.send(JSON.stringify({ "message": userMessage }));
            } else {
                messageQueue.push(userMessage);
                console.log("WebSocket not open. Message queued:", userMessage);
            }
        }
    
        function displayMessage(message, senderType, timestamp, senderName) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', `${senderType}-message`);
    
            const senderSpan = document.createElement('span');
            senderSpan.classList.add('message-sender');
            senderSpan.textContent = senderType === 'sender' ? 'You' : senderName;
    
            const messageText = document.createElement('span');
            messageText.classList.add('message-text');
            messageText.textContent = message;
    
            const timeSpan = document.createElement('span');
            timeSpan.classList.add('message-time');
            timeSpan.textContent = timestamp;
    
            messageDiv.appendChild(senderSpan);
            messageDiv.appendChild(messageText);
            messageDiv.appendChild(timeSpan);
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    
        function loadChatHistory() {
            chatMessages.innerHTML = '';
            if (conversations[receiver]) {
                conversations[receiver].forEach(({ text, type, time }) => {
                    const senderName = type === 'sender' ? sender : receiver;
                    displayMessage(text, type, time, senderName);
                });
            }
        }
    
        function switchConversation(newReceiver) {
            if (receiver === newReceiver) return;
            const friendList = Array.from(document.querySelectorAll("#chat-friend-list .user"))
                .map(div => div.getAttribute("data-friend-name"));
            if (!friendList.includes(newReceiver)) {
                console.warn(`${newReceiver} is not a friend. Cannot start chat.`);
                return;
            }
            receiver = newReceiver;
            chatHeader.textContent = `Chat with ${receiver}`;
            connectWebSocket();
            loadChatHistory();
        }
    
        emojiToggleButton.addEventListener('click', () => {
            emojiPicker.style.display = emojiPicker.style.display === 'block' ? 'none' : 'block';
        });
    
        sendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                sendMessage();
                event.preventDefault();
            }
        });
    
        window.switchConversation = switchConversation;
    
        function makeRequest() {
            const now = Date.now();
            if (now - lastRequestTime > 10000) {
                if (flag === 0) {
                    flag = 1;
                }
                connectWebSocket();
                lastRequestTime = now;
            }
        }
    }
    
    
    
      ///////////////////////////////////////////chat////////////////////////////////////

    // function openEditProfileModal() {
    //     // Create overlay
    //     const overlay = document.createElement('div');
    //     overlay.id = 'edit-profile-overlay';
        
    //     // Create modal container
    //     const modal = document.createElement('div');
    //     modal.id = 'edit-profile-modal';
        
    //     // Add content (header, form, buttons)
    //     const title = document.createElement('h3');
    //     title.innerText = 'Edit Profile';
      
    //     // Create the form
    //     const form = document.createElement('form');
    //     form.id = 'edit-profile-form';
        
    //     // Username input
    //     const usernameInput = document.createElement('input');
    //     usernameInput.type = 'text';
    //     usernameInput.id = 'edit-username';
    //     usernameInput.placeholder = 'Type your new username...';
    //     // Prefill with current username
    //     const currentUsername = document.getElementById('profile-username')?.innerText || '';
    //     usernameInput.value = currentUsername;
      
    //     // File input for avatar
    //     const avatarFileInput = document.createElement('input');
    //     avatarFileInput.type = 'file';
    //     avatarFileInput.id = 'edit-avatar';
    //     // If you want to restrict to images only:
    //     // avatarFileInput.accept = 'image/*';
      
    //     // Buttons container
    //     const buttonsDiv = document.createElement('div');
    //     buttonsDiv.classList.add('modal-buttons');
      
    //     const cancelButton = document.createElement('button');
    //     cancelButton.innerText = 'Cancel';
    //     cancelButton.classList.add('cancel-button');
      
    //     const saveButton = document.createElement('button');
    //     saveButton.innerText = 'Save';
    //     saveButton.classList.add('save-button');
      
    //     // Append inputs and buttons to form
    //     form.appendChild(usernameInput);
    //     form.appendChild(avatarFileInput);
    //     buttonsDiv.appendChild(cancelButton);
    //     buttonsDiv.appendChild(saveButton);
    //     form.appendChild(buttonsDiv);
    
    //     // Append everything to modal
    //     modal.appendChild(title);
    //     modal.appendChild(form);
    
    //     // Append modal to overlay
    //     overlay.appendChild(modal);
      
    //     // Add overlay to body
    //     document.body.appendChild(overlay);
      
    //     // Cancel button closes the modal
    //     cancelButton.addEventListener('click', () => {
    //       document.body.removeChild(overlay);
    //     });
      
    //     // Save button logic
    //     saveButton.addEventListener('click', async (e) => {
    //       e.preventDefault(); // Prevent form submission from reloading page
    
    //       const newUsername = usernameInput.value.trim();
    //       const file = avatarFileInput.files[0]; // The uploaded file
      
    //       try {
    //         const token = localStorage.getItem('authToken');
    //         if (!token) {
    //           alert('No auth token found. Please log in again.');
    //           return;
    //         }
      
    //         // Prepare form data for multipart upload
    //         const formData = new FormData();
    //         // If the user updated username, we can handle it as JSON or form data.
    //         // For your serializer: user.username => user: {username: ...}
    //         formData.append('user.username', newUsername);
      
    //         // If a file is selected, append it
    //         if (file) {
    //           formData.append('avatar', file);
    //         }
      
    //         const response = await fetch('http://127.0.0.1:8000/profile/update/', {
    //           method: 'PUT',
    //           headers: {
    //             'Authorization': `Bearer ${token}`
    //             // Don't set Content-Type here; fetch will set it automatically for FormData
    //           },
    //           body: formData
    //         });
      
    //         if (response.ok) {
    //           const result = await response.json();
    //           // Update the UI with the new username, if any
    //           document.getElementById('profile-username').innerText = newUsername;
    
    //           // If you want to update the avatar preview, you need the new avatar URL from result
    //           // For instance, if result.profile.avatar is the new URL:
    //           // document.getElementById('profile-img').src = result.profile.avatar;
    
    //           alert('Profile updated successfully!');
    //         } else {
        //           const errorData = await response.json();
    //           console.error('Update error:', errorData);
    //           alert(errorData.error || 'Failed to update profile.');
    //         }
    //       } catch (error) {
    //         console.error('Error updating profile:', error);
    //         alert('Error updating profile. Please try again.');
    //       }
      
    //       // Remove the modal after finishing
    //       document.body.removeChild(overlay);
    //     });
    //   }
      
    //////////////////////////edit profile/////////////////////////////
      
    // Load the initial page
    preloadStylesheet('dashboard.css'); // Dashboard CSS
    preloadStylesheet('profile.css'); // Profile page CSS
    // preloadStylesheet('styleGame.css'); // Game page CSS (if applicable)
    loadCSS('chat.css'); // Load the dashboard CSS

    window.addEventListener('popstate', () => {
        renderPage(window.location.hash);
    });
    renderPage(window.location.hash || '#/sign-in');
});
