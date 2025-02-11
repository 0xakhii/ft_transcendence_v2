// document.addEventListener("DOMContentLoaded", () => {
//     const links = document.querySelectorAll(".test a"); // Navigation links
//     const content = document.getElementById("content"); // Middle section for dynamic content

//     // Define content for each section
//     const pages = {
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
//                 <button class="f_img_l" type="button" onclick="location.href='game.html';">Add Friends</button>
//                 <button class="f_img_l2" type="button" onclick="location.href='game.html';">Friends</button>
//                 <img class="f_img_last" src="dashboard img/FREINDLIST_041332.png">
//             </div>
//         `,
//         profile: `
//             <div class="profile">
//                 <h2>Your Profile</h2>
//                 <p>Manage your profile information here.</p>
//             </div>
//         `,
//         game: `
//             <div class="game">
//                 <h2>Game Page</h2>
//                 <p>Play exciting games here!</p>
//             </div>
//         `,
//         tournament: `
//             <div class="tournament">
//                 <h2>Tournaments</h2>
//                 <p>Join or create tournaments to compete!</p>
//             </div>
//         `,
//         chat: `
//             <div class="chat">
//                 <h2>Chat with Friends</h2>
//                 <p>Connect with friends here.</p>
//             </div>
//         `,
//         settings: `
//             <div class="settings">
//                 <h2>Settings</h2>
//                 <p>Adjust your preferences here.</p>
//             </div>
//         `,
//     };

//     // Add click event listeners to navigation links
//     links.forEach((link) => {
//         link.addEventListener("click", (e) => {
//             e.preventDefault(); // Prevent default link behavior
//             const page = link.textContent.trim().toLowerCase(); // Convert link text to lowercase and trim whitespace
//             if (pages[page]) {
//                 content.innerHTML = pages[page]; // Load the corresponding content
//             } else {
//                 content.innerHTML = "<h2>Page Not Found</h2>"; // Handle undefined pages
//             }
//         });
//     });

//     // Load default (Home) content
//     content.innerHTML = pages.home;
// });



//////////////////////



// document.addEventListener("DOMContentLoaded", () => {
//     const links = document.querySelectorAll(".test a"); // Navigation links
//     const content = document.getElementById("content"); // Middle section for dynamic content

//     // Define content for each section
//     const pages = {
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
//                 <div  id="search-bar-container" >
//                     <input class="search_bar" type="text" id="search-bar" placeholder="Search friends..." >
//                 </div>
                
//                 <!-- Friends Button -->
//                 <button class="f_img_l2" id="friends-btn" type="button">Friends</button>
//                 <img class="f_img_last" src="dashboard img/FREINDLIST_041332.png">

//             </div>
//         `,
//         profile: `
//             <div class="profile">
//                 <h2>Your Profile</h2>
//                 <p>Manage your profile information here.</p>
//             </div>
//         `,
//         game: `
//             <div class="game">
//                 <h2>Game Page</h2>
//                 <p>Play exciting games here!</p>
//             </div>
//         `,
//         tournament: `
//             <div class="tournament">
//                 <h2>Tournaments</h2>
//                 <p>Join or create tournaments to compete!</p>
//             </div>
//         `,
//         chat: `
//             <div class="chat">
//                 <h2>Chat with Friends</h2>
//                 <p>Connect with friends here.</p>
//             </div>
//         `,
//         settings: `
//             <div class="settings">
//                 <h2>Settings</h2>
//                 <p>Adjust your preferences here.</p>
//             </div>
//         `,
//     };


//     function setActiveLink(target) {
//         links.forEach(link => link.classList.remove("active")); // Remove active class from all links
//         target.classList.add("active"); // Add active class to the clicked link
//     }
//     // Add click event listeners to navigation links
//     links.forEach((link) => {
//         link.addEventListener("click", (e) => {
//             e.preventDefault(); // Prevent default link behavior
//             // const page = link.textContent.trim().toLowerCase();
            
//             const page = link.getAttribute("data-page");
//             if (pages[page]) {
//                 content.innerHTML = pages[page];
//                 setActiveLink(link); // Load the corresponding content

//                 // Reinitialize home functionalities if on the home page
//                 if (page === "home") {
//                     initializeHomeFunctionality();
//                 }
//             } else {
//                 content.innerHTML = "<h2>Page Not Found</h2>"; // Handle undefined pages
//             }
//         });
//     });

//     // Load default (Home) content
//     content.innerHTML = pages.home;
//     initializeHomeFunctionality(); // Initialize Add Friends and Friends functionalities on load

//     // Function to initialize the "Add Friends" and "Friends" functionalities
//     function initializeHomeFunctionality() {
//         const addFriendsButton = document.getElementById("add-friends-btn");
//         const friendsButton = document.getElementById("friends-btn");
//         const searchBarContainer = document.getElementById("search-bar-container");

//         // Add Friends Button: Toggle search bar visibility
//         if (addFriendsButton && searchBarContainer) {
//             addFriendsButton.addEventListener("click", () => {
//                 if (searchBarContainer.style.display === "none") {
//                     searchBarContainer.style.display = "block";
//                 } else {
//                     searchBarContainer.style.display = "none";
//                 }
//             });
//         }

//         // Friends Button: Placeholder functionality
//         if (friendsButton) {
//             friendsButton.addEventListener("click", () => {
//                 alert("Fetching your friends from the backend...");
//             });
//         }
//     }
// });



///////////////////////////////////////////////////////////////////////////////////////////

///this one working good

document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".test a"); // Navigation links
    const content = document.getElementById("content"); // Middle section for dynamic content

    // Define content for each section
    const pages = {
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
            <link rel="stylesheet" href="profile.css">
                <div class="profile-container">
                  <div class="profile-info">
                    <!-- Profile border image -->
                    <img class="profile-border" src="profile imgs/main_profile_window.png" alt="Profile Border">
                    <!-- User profile image inside the border -->
                    <img id="profile-img" class="profile-img" src="profile imgs/placeholder.png" alt="Profile Image">
                    <!-- Username below the profile image -->
                    <h2 id="profile-username">Username</h2>
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
        `,
        tournament: `
            <div class="tournament">
                <h2>Tournaments</h2>
                <p>Join or create tournaments to compete!</p>
            </div>
        `,
        chat: `
            <div class="chat">
                <h2>Chat with Friends</h2>
                <p>Connect with friends here.</p>
            </div>
        `,
        settings: `
            <div class="settings">
                <h2>Settings</h2>
                <p>Adjust your preferences here.</p>
            </div>
        `,
    };

    // Function to check if the user is authenticated
    function isAuthenticated() {
        const token = localStorage.getItem("authToken");
        return token && token.length > 0; // Check if token exists and is not empty
        console.log(token);
    }

    // Function to redirect unauthenticated users to the login page
    function checkAuthentication() 
    {
        if (!isAuthenticated()) 
        {
            window.location.href = "/sign-in-page.html"; // Redirect to login page
        }
    }

    // if (token == true)
    //         window.location.href = "/dashboard.html";
    // Run authentication check on page load
    checkAuthentication();

    function setActiveLink(target) {
        links.forEach(link => link.classList.remove("active")); // Remove active class from all links
        target.classList.add("active"); // Add active class to the clicked link
    }
    
    // Add click event listeners to navigation links
    links.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Prevent default link behavior
            
            const page = link.getAttribute("data-page");
            if (pages[page]) {
                content.innerHTML = pages[page];
                setActiveLink(link); // Load the corresponding content

                // Reinitialize home functionalities if on the home page
                if (page === "home") {
                    initializeHomeFunctionality();
                }
            } else {
                content.innerHTML = "<h2>Page Not Found</h2>"; // Handle undefined pages
            }
        });
    });

    // Load default (Home) content
    content.innerHTML = pages.home;
    initializeHomeFunctionality(); // Initialize Add Friends and Friends functionalities on load

    // Function to initialize the "Add Friends" and "Friends" functionalities
    function initializeHomeFunctionality() {
        const addFriendsButton = document.getElementById("add-friends-btn");
        const friendsButton = document.getElementById("friends-btn");
        const searchBarContainer = document.getElementById("search-bar-container");

        // Add Friends Button: Toggle search bar visibility
        if (addFriendsButton && searchBarContainer) {
            addFriendsButton.addEventListener("click", () => {
                if (searchBarContainer.style.display === "none") {
                    searchBarContainer.style.display = "block";
                } else {
                    searchBarContainer.style.display = "none";
                }
            });
        }

        // Friends Button: Placeholder functionality
        if (friendsButton) {
            friendsButton.addEventListener("click", () => {
                alert("Fetching your friends from the backend...");
            });
        }
    }
    // async function loadProfileInfo() {
    //     try {
    //         const token = localStorage.getItem('authToken');
    //         if (!token) {
    //             console.error('No auth token found.');
    //             return;
    //         }

    //         const response = await fetch('http://127.0.0.1:8000/profile/update/', {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });

    //         if (response.ok) {
    //             const data = await response.json();
    //             console.log('Profile data received:', data);

    //             const username = data.login || 'Unknown User';
    //             let avatarUrl = 'default-avatar.png';
    //             if (data.image) {
    //                 avatarUrl = data.image.link || (data.image.versions && data.image.versions.medium) || 'default-avatar.png';
    //             }

    //             document.getElementById('profile-img').src = avatarUrl;
    //             document.getElementById('profile-username').innerText = username;
    //         } else {
    //             console.error('Error fetching profile info:', response.status);
    //         }
    //     } catch (error) {
    //         console.error('Error during profile info fetch:', error);
    //     }
    // }
});


/////////////////////////////////////

// document.addEventListener("DOMContentLoaded", () => {
//     const links = document.querySelectorAll(".test a"); // Navigation links
//     const content = document.getElementById("content"); // Middle section for dynamic content

//     // Define content for each section
//     const pages = {
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
//                 <div class="profile-container">
//                   <div class="profile-info">
//                     <!-- Profile border image -->
//                     <img class="profile-border" src="profile imgs/main_profile_window.png" alt="Profile Border">
//                     <!-- User profile image inside the border -->
//                     <img id="profile-img" class="profile-img" src="profile imgs/placeholder.png" alt="Profile Image">
//                     <!-- Username below the profile image -->
//                     <h2 id="profile-username">Username</h2>
//                   </div>
//                   <div class="profile-stats">
//                     <img class="stats-border wins" src="profile imgs/level_and_wins_window.png" alt="Wins">
//                     <img class="stats-border level" src="profile imgs/level_and_wins_window.png" alt="Level">
//                   </div>
//                   <div class="match-history">
//                     <img class="match-history-border" src="profile imgs/match_history_window.png" alt="Match History">
//                   </div>
//                 </div>
//         `,
//         game: `
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
//         `,
//         tournament: `
//             <div class="tournament">
//                 <h2>Tournaments</h2>
//                 <p>Join or create tournaments to compete!</p>
//             </div>
//         `,
//         chat: `
//             <div class="chat">
//                 <h2>Chat with Friends</h2>
//                 <p>Connect with friends here.</p>
//             </div>
//         `,
//         settings: `
//             <div class="settings">
//                 <h2>Settings</h2>
//                 <p>Adjust your preferences here.</p>
//             </div>
//         `,
//     };

//     // Function to check if the user is authenticated
//     function isAuthenticated() {
//         const token = localStorage.getItem("authToken");
//         return token && token.length > 0; // Check if token exists and is not empty
//     }

//     // Redirect unauthenticated users to the login page
//     function checkAuthentication() {
//         if (!isAuthenticated()) {
//             window.location.href = "/sign-in-page.html"; // Redirect to login page
//         }
//     }

//     // Run authentication check on page load
//     checkAuthentication();

//     function setActiveLink(target) {
//         links.forEach(link => link.classList.remove("active")); // Remove active class from all links
//         target.classList.add("active"); // Add active class to the clicked link
//     }

//     // Add click event listeners to navigation links
//     links.forEach((link) => {
//         link.addEventListener("click", (e) => {
//             e.preventDefault(); // Prevent default link behavior
            
//             const page = link.getAttribute("data-page");
//             if (pages[page]) {
//                 content.innerHTML = pages[page];
//                 setActiveLink(link); // Load the corresponding content

//                 // Reinitialize home functionalities if on the home page
//                 if (page === "home") {
//                     initializeHomeFunctionality();
//                 } else if (page === "profile") {
//                     loadProfileInfo(); // Load profile data dynamically
//                 }
//             } else {
//                 content.innerHTML = "<h2>Page Not Found</h2>"; // Handle undefined pages
//             }
//         });
//     });

//     // Load default (Home) content
//     content.innerHTML = pages.home;
//     initializeHomeFunctionality(); // Initialize Add Friends and Friends functionalities on load

//     // Function to initialize the "Add Friends" and "Friends" functionalities
//     function initializeHomeFunctionality() {
//         const addFriendsButton = document.getElementById("add-friends-btn");
//         const friendsButton = document.getElementById("friends-btn");
//         const searchBarContainer = document.getElementById("search-bar-container");

//         // Add Friends Button: Toggle search bar visibility
//         if (addFriendsButton && searchBarContainer) {
//             addFriendsButton.addEventListener("click", () => {
//                 searchBarContainer.style.display = searchBarContainer.style.display === "none" ? "block" : "none";
//             });
//         }

//         // Friends Button: Placeholder functionality
//         if (friendsButton) {
//             friendsButton.addEventListener("click", () => {
//                 alert("Fetching your friends from the backend...");
//             });
//         }
//     }

//     // Function to load user profile info dynamically
//     async function loadProfileInfo() {
//         try {
//             const token = localStorage.getItem('authToken');
//             if (!token) {
//                 console.error('No auth token found.');
//                 return;
//             }

//             const response = await fetch('http://127.0.0.1:8000/profile/update/', {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 }
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 console.log('Profile data received:', data);

//                 const username = data.login || 'Unknown User';
//                 let avatarUrl = 'default-avatar.png';
//                 if (data.image) {
//                     avatarUrl = data.image.link || (data.image.versions && data.image.versions.medium) || 'default-avatar.png';
//                 }

//                 document.getElementById('profile-img').src = avatarUrl;
//                 document.getElementById('profile-username').innerText = username;
//             } else {
//                 console.error('Error fetching profile info:', response.status);
//             }
//         } catch (error) {
//             console.error('Error during profile info fetch:', error);
//         }
//     }
// });
function setupSignIn() {
    const loginForm = document.getElementById('login-form');
    const goToSignUp = document.getElementById('go-to-sign-up');
    const errorMsg = document.querySelector('.error-msg');

    goToSignUp.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('#/sign-up');
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.querySelector('input[placeholder="Username"]').value.trim();
        const password = document.querySelector('input[placeholder="Password"]').value.trim();

        // Clear any previous error message
        errorMsg.style.display = 'none';
        errorMsg.textContent = '';

        if (!username || !password) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = 'Username and password are required!';
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                localStorage.setItem('authToken', data.access); // Store the token
                navigateTo('#/dashboard'); // Navigate to the dashboard
            } else {
                const errorData = await response.json();
                console.error('Login failed:', errorData);
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
