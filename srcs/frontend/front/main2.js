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
                        <a href="" data-page="chat">CHAT</a>
                        <a href="" data-page="settings">SETTINGS</a>
                    </div>
                </div>
                <div class="middle">
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
                        <a href="#/chat" data-page="chat">CHAT</a>
                        <a href="" data-page="settings">SETTINGS</a>
                    </div>
                </div>
            <div class="profile-container">
                <div class="profile-info">
                    <img class="profile-border" src="profile imgs/main_profile_window.png">
                    <img id="profile-img" class="profile-img" src="profile images/placeholder.png">
                    <h2 id="profile-username" class="profile-username">Username</h2>
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
            </div>
        `,
    };
    
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const token = urlParams.get('access_token');
    localStorage.setItem("authToken", token);
    if (token){

        navigateTo('#/dashboard');
    }
    
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

    function renderPage(route) {
        const app = document.getElementById('app');
        // const contentArea = document.getElementById('content-area');

        switch (route) {
            case '#/sign-in':
                app.innerHTML = pages.signIn;
                loadCSS('style2.css');
                setupSignIn();
                break;
            case '#/sign-up':
                app.innerHTML = pages.signUp;
                loadCSS('sign-up-page.css');
                setupSignUp();
                break;
            case '#/dashboard':
                app.innerHTML = pages.dashboard;
                loadCSS('dashboard.css');
                break;
            case '#/home':
                app.innerHTML = pages.home;
                break;
            case '#/profile':
                app.innerHTML = pages.profile;
                loadCSS('profile.css');
                loadProfileInfo();
                break;
            case '#/game':
                app.innerHTML = pages.game;
                loadCSS('game.css');
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
                    const data = await response.json();
                    localStorage.setItem('authToken', data.access);
                    navigateTo('#/dashboard');
                    // renderPage('#/dashboard');
                }
                else 
                {
                    const errorData = await response.json();
                    errorMsg.textContent = errorData.error || 'Invalid username or password';
                }
            } catch (error) {
                console.error('Error during login:', error);
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

            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const firstName = document.getElementById('first_name').value.trim();
            const lastName = document.getElementById('last_name').value.trim();

            try {
                const response = await fetch('http://127.0.0.1:8000/register/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password, first_name: firstName, last_name: lastName }),
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

    async function loadProfileInfo() {
        try {
            // const token = localStorage.getItem('authToken');
            if (!token) return;

            const response = await fetch('http://127.0.0.1:8000/profile/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (response.ok)
            {
                console.log(token);
                const data = await response.json();
                document.getElementById('profile-img').src = data.image?.link || 'default-avatar.png';
                document.getElementById('profile-username').innerText = data.login || 'Unknown User';
            }
        } catch (error) {
            console.error('Error loading profile info:', error);
        }
    }

    // Load the initial page
    preloadStylesheet('dashboard.css'); // Dashboard CSS
    preloadStylesheet('profile.css'); // Profile page CSS
    preloadStylesheet('game.css'); // Game page CSS (if applicable)

    window.addEventListener('popstate', () => {
        renderPage(window.location.hash);
    });
    renderPage(window.location.hash || '#/sign-in');
});
