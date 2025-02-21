document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app"); // Main container for SPA

    // Define templates for different pages
    const templates = {
        signIn: `
            <div class="main">
                <div class="border-up">
                    <img class="logo" src="images/Pongify_logo.png">
                    <h2>WELCOME</h2>
                    <p>Login with your 42 Network account or use your own email and password</p>
                </div>
                <div class="border-bottom">
                    <form id="sign-in-form">
                        <input type="text" class="brd" id="sign-in-username" placeholder="Username"><br>
                        <input type="password" class="brd" id="sign-in-password" placeholder="Password">
                        <p class="error-msg" style="color: red;"></p>
                        <button class="btn" type="submit">Login</button>
                    </form>
                    <button class="btn2" id="sign-in-network"><img src="images/42.png">Network</button>
                    <a href="#" id="go-to-sign-up">Create Account</a>
                </div>
            </div>
        `,
        signUp: `
            <div class="main">
                <div class="border-up">
                    <img class="logo" src="images/Pongify_logo.png">
                    <h2>WELCOME</h2>
                    <p>Sign up with your 42 Network account or create a new account</p>
                </div>
                <div class="border-bottom">
                    <form id="sign-up-form">
                        <input id="sign-up-username" type="text" class="brd" placeholder="Username">
                        <input id="sign-up-email" type="email" class="brd" placeholder="Email">
                        <input id="sign-up-password" type="password" class="brd" placeholder="Password">
                        <input id="sign-up-first-name" type="text" class="brd" placeholder="First name">
                        <input id="sign-up-last-name" type="text" class="brd" placeholder="Last name">
                        <button class="btn" type="submit">Sign Up</button>
                    </form>
                    <button class="btn2" id="sign-up-network"><img src="images/42.png">Network</button>
                </div>
            </div>
        `,
        dashboard: `
            <div class="header">
                <img class="logo" src="images/Pongify_logo.png">
                <div class="test">
                    <a href="#" data-page="home" class="active">HOME</a>
                    <a href="#" data-page="profile">PROFILE</a>
                    <a href="#" data-page="game">GAME</a>
                    <a href="#" data-page="tournament">TOURNAMENT</a>
                    <a href="#" data-page="chat">CHAT</a>
                    <a href="#" data-page="settings">SETTINGS</a>
                </div>
            </div>
            <div id="content"></div>
        `,
        home: `
            <div class="play_local">
                <div class="btn">
                    <button type="button">Play Local Game</button>
                </div>
                <img class="f_img" src="dashboard img/full_button.png">
            </div>
            <div class="btn2">
                <button type="button">Play Online Game</button>
            </div>
            <img class="f_img" src="dashboard img/full_buton_2.png">
            <div>
                <button class="f_img_l" id="add-friends-btn" type="button">Add Friends</button>
                <div id="search-bar-container" style="display: none;">
                    <input class="search_bar" type="text" id="search-bar" placeholder="Search friends...">
                </div>
                <button class="f_img_l2" id="friends-btn" type="button">Friends</button>
                <img class="f_img_last" src="dashboard img/FREINDLIST_041332.png">
            </div>
        `,
        profile: `
            <div class="profile-container">
                <div class="profile-info">
                    <img class="profile-border" src="profile imgs/main_profile_window.png" alt="Profile Border">
                    <img id="profile-img" class="profile-img" src="profile imgs/placeholder.png" alt="Profile Image">
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
        game: `<h2>Game Page</h2>`,
        tournament: `<h2>Tournament Page</h2>`,
        chat: `<h2>Chat Page</h2>`,
        settings: `<h2>Settings Page</h2>`,
    };

    // Load a page into the app container
    function loadPage(page) {
        app.innerHTML = templates[page];
        initializePage(page);
    }

    // Handle form submissions and navigation
    function initializePage(page) {
        if (page === "signIn") {
            document.getElementById("sign-in-form").addEventListener("submit", handleSignIn);
            document.getElementById("sign-in-network").addEventListener("click", handle42Login);
            document.getElementById("go-to-sign-up").addEventListener("click", () => loadPage("signUp"));
        } else if (page === "signUp") {
            document.getElementById("sign-up-form").addEventListener("submit", handleSignUp);
            document.getElementById("sign-up-network").addEventListener("click", handle42Login);
        } else if (page === "dashboard") {
            loadPageContent("home"); // Default page
            document.querySelectorAll(".test a").forEach((link) => {
                link.addEventListener("click", (e) => {
                    e.preventDefault();
                    const page = link.getAttribute("data-page");
                    loadPageContent(page);
                });
            });
        }
    }

    function loadPageContent(page) {
        const content = document.getElementById("content");
        content.innerHTML = templates[page];
        if (page === "profile") loadProfileInfo(); // Load profile-specific data
    }

    async function handleSignUp(event) {
        event.preventDefault();
        const formData = {
            username: document.getElementById("sign-up-username").value,
            email: document.getElementById("sign-up-email").value,
            password: document.getElementById("sign-up-password").value,
            first_name: document.getElementById("sign-up-first-name").value,
            last_name: document.getElementById("sign-up-last-name").value,
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                loadPage("signIn");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function handleSignIn(event) {
        event.preventDefault();
        const username = document.getElementById("sign-in-username").value;
        const password = document.getElementById("sign-in-password").value;

        try {
            const response = await fetch("http://127.0.0.1:8000/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("authToken", data.access);
                loadPage("dashboard");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    function handle42Login() {
        window.location.href = "http://127.0.0.1:8000/42_login/";
    }

    async function loadProfileInfo() {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
            const response = await fetch("http://127.0.0.1:8000/profile/update/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                document.getElementById("profile-img").src = data.image?.link || "profile imgs/placeholder.png";
                document.getElementById("profile-username").innerText = data.login || "Unknown User";
            }
        } catch (error) {
            console.error("Error fetching profile info:", error);
        }
    }

    // Start with the sign-in page
    function loadCSS(fileName) {
        // Remove any existing dynamic CSS link
        const existingLink = document.getElementById('dynamic-css');
        if (existingLink) {
            existingLink.remove();
        }
    
        // Create a new link element for the new CSS file
        const link = document.createElement('link');
        link.id = 'dynamic-css';
        link.rel = 'stylesheet';
        link.href = fileName;
        document.head.appendChild(link);
    }
    
    // Example: Modify the navigation routing logic to load the appropriate CSS
    function renderPage(route) {
        switch (route) {
            case '/sign-in':
                document.getElementById('app').innerHTML = pages.signIn;
                loadCSS('style2.css');
                break;
            case '/sign-up':
                document.getElementById('app').innerHTML = pages.signUp;
                loadCSS('sign-up-page.css');
                break;
            case '/home':
                document.getElementById('app').innerHTML = pages.home;
                loadCSS('dashboard.css');
                break;
            // Add other cases as necessary
            default:
                document.getElementById('app').innerHTML = pages.signIn; // Default to sign-in
                loadCSS('style2.css');
                break;
        }
    }
    
    loadPage("signIn");
});
