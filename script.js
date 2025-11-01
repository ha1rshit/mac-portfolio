// State Management
let zIndexCounter = 100;
let activeWindows = new Map();
let isDarkMode = false;

// Boot Sequence
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('boot-screen').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
    }, 2500);
});

// Login
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');

passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
});

loginBtn.addEventListener('click', login);

function login() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('desktop').classList.remove('hidden');
    updateTime();
    setInterval(updateTime, 1000);
}

// Time Update
function updateTime() {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
    document.getElementById('current-time').textContent = now.toLocaleString('en-US', options);
}

// Theme Toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('#theme-toggle i');
    icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
});

// Spotlight Search
const spotlightBtn = document.getElementById('spotlight-btn');
const spotlight = document.getElementById('spotlight');
const spotlightInput = document.getElementById('spotlight-input');
const spotlightResults = document.getElementById('spotlight-results');

spotlightBtn.addEventListener('click', toggleSpotlight);

document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === ' ') {
        e.preventDefault();
        toggleSpotlight();
    }
    if (e.key === 'Escape' && !spotlight.classList.contains('hidden')) {
        toggleSpotlight();
    }
});

spotlight.addEventListener('click', (e) => {
    if (e.target === spotlight) toggleSpotlight();
});

function toggleSpotlight() {
    spotlight.classList.toggle('hidden');
    if (!spotlight.classList.contains('hidden')) {
        spotlightInput.focus();
        spotlightInput.value = '';
        spotlightResults.innerHTML = '';
    }
}

spotlightInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (!query) {
        spotlightResults.innerHTML = '';
        return;
    }
    
    const apps = [
        { name: 'Finder', icon: 'fas fa-smile', app: 'finder' },
        { name: 'Safari', icon: 'fas fa-compass', app: 'safari' },
        { name: 'Mail', icon: 'fas fa-envelope', app: 'mail' },
        { name: 'Notes', icon: 'fas fa-sticky-note', app: 'notes' },
        { name: 'Terminal', icon: 'fas fa-terminal', app: 'terminal' },
        { name: 'VS Code', icon: 'fas fa-code', app: 'vscode' },
        { name: 'GitHub', icon: 'fab fa-github', app: 'github' },
        { name: 'LinkedIn', icon: 'fab fa-linkedin', app: 'linkedin' },
        { name: 'Spotify', icon: 'fab fa-spotify', app: 'spotify' },
        { name: 'YouTube', icon: 'fab fa-youtube', app: 'youtube' },
        { name: 'FaceTime', icon: 'fas fa-video', app: 'facetime' },
        { name: 'Weather', icon: 'fas fa-cloud-sun', app: 'weather' }
    ];
    
    const results = apps.filter(app => app.name.toLowerCase().includes(query));
    
    spotlightResults.innerHTML = results.map(app => `
        <div class="spotlight-result-item" onclick="openApp('${app.app}'); toggleSpotlight();">
            <i class="${app.icon}"></i>
            <span>${app.name}</span>
        </div>
    `).join('');
});

// Control Center
const controlCenterBtn = document.getElementById('control-center-btn');
const controlCenter = document.getElementById('control-center');

controlCenterBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    controlCenter.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
    if (!controlCenter.contains(e.target) && e.target !== controlCenterBtn) {
        controlCenter.classList.add('hidden');
    }
});

// Brightness Control
const brightnessSlider = document.getElementById('brightness-slider');
const brightnessValue = document.getElementById('brightness-value');

brightnessSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    brightnessValue.textContent = `${value}%`;
    document.getElementById('desktop').style.filter = `brightness(${value}%)`;
});

// Volume Control
const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.getElementById('volume-value');

volumeSlider.addEventListener('input', (e) => {
    volumeValue.textContent = `${e.target.value}%`;
});

// Dock Items
document.querySelectorAll('.dock-item').forEach(item => {
    item.addEventListener('click', () => {
        const app = item.dataset.app;
        if (app) openApp(app);
    });
});

// Window Management
function createWindow(appName, title, content, width = 800, height = 600) {
    // Check if window already exists
    if (activeWindows.has(appName)) {
        const existingWindow = activeWindows.get(appName);
        existingWindow.classList.remove('minimized');
        bringToFront(existingWindow);
        return;
    }
    
    const windowId = `window-${appName}-${Date.now()}`;
    const windowEl = document.createElement('div');
    windowEl.className = 'window';
    windowEl.id = windowId;
    windowEl.style.width = `${width}px`;
    windowEl.style.height = `${height}px`;
    windowEl.style.left = `${Math.random() * 200 + 100}px`;
    windowEl.style.top = `${Math.random() * 100 + 50}px`;
    windowEl.style.zIndex = ++zIndexCounter;
    
    windowEl.innerHTML = `
        <div class="window-header">
            <div class="window-controls">
                <div class="window-control close" onclick="closeWindow('${windowId}', '${appName}')"></div>
                <div class="window-control minimize" onclick="minimizeWindow('${windowId}')"></div>
                <div class="window-control maximize" onclick="maximizeWindow('${windowId}')"></div>
            </div>
            <div class="window-title">${title}</div>
            <div style="width: 52px;"></div>
        </div>
        <div class="window-content">
            ${content}
        </div>
    `;
    
    document.getElementById('windows-container').appendChild(windowEl);
    activeWindows.set(appName, windowEl);
    
    // Make window draggable
    makeDraggable(windowEl);
    
    // Click to bring to front
    windowEl.addEventListener('mousedown', () => bringToFront(windowEl));
    
    // Update active app name
    document.getElementById('active-app-name').textContent = title;
    
    return windowEl;
}

function closeWindow(windowId, appName) {
    const windowEl = document.getElementById(windowId);
    if (windowEl) {
        windowEl.remove();
        activeWindows.delete(appName);
    }
}

function minimizeWindow(windowId) {
    const windowEl = document.getElementById(windowId);
    if (windowEl) {
        windowEl.classList.add('minimized');
    }
}

function maximizeWindow(windowId) {
    const windowEl = document.getElementById(windowId);
    if (windowEl) {
        if (windowEl.dataset.maximized === 'true') {
            windowEl.style.width = windowEl.dataset.originalWidth;
            windowEl.style.height = windowEl.dataset.originalHeight;
            windowEl.style.left = windowEl.dataset.originalLeft;
            windowEl.style.top = windowEl.dataset.originalTop;
            windowEl.dataset.maximized = 'false';
        } else {
            windowEl.dataset.originalWidth = windowEl.style.width;
            windowEl.dataset.originalHeight = windowEl.style.height;
            windowEl.dataset.originalLeft = windowEl.style.left;
            windowEl.dataset.originalTop = windowEl.style.top;
            windowEl.style.width = 'calc(100vw - 20px)';
            windowEl.style.height = 'calc(100vh - 118px)';
            windowEl.style.left = '10px';
            windowEl.style.top = '38px';
            windowEl.dataset.maximized = 'true';
        }
    }
}

function bringToFront(windowEl) {
    windowEl.style.zIndex = ++zIndexCounter;
    const title = windowEl.querySelector('.window-title').textContent;
    document.getElementById('active-app-name').textContent = title;
}

function makeDraggable(windowEl) {
    const header = windowEl.querySelector('.window-header');
    let isDragging = false;
    let currentX, currentY, initialX, initialY;
    
    header.addEventListener('mousedown', dragStart);
    
    function dragStart(e) {
        if (e.target.classList.contains('window-control')) return;
        
        initialX = e.clientX - windowEl.offsetLeft;
        initialY = e.clientY - windowEl.offsetTop;
        
        isDragging = true;
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        windowEl.style.left = `${currentX}px`;
        windowEl.style.top = `${currentY}px`;
    }
    
    function dragEnd() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', dragEnd);
    }
}

// App Contents
function openApp(appName) {
    const apps = {
        finder: () => {
            createWindow('finder', 'Finder', `
                <h2>🗂️ Finder</h2>
                <p>File system browser coming soon...</p>
            `, 700, 500);
        },
        
        safari: () => {
            const win = createWindow('safari', 'Safari', `
                <div class="browser-content">
                    <div class="browser-bar">
                        <i class="fas fa-arrow-left browser-nav-btn" id="safari-back" title="Back"></i>
                        <i class="fas fa-arrow-right browser-nav-btn" id="safari-forward" title="Forward"></i>
                        <i class="fas fa-redo browser-nav-btn" id="safari-reload" title="Reload"></i>
                        <input type="text" id="safari-url-bar" placeholder="Search or enter website URL" value="https://www.google.com">
                        <button id="safari-go-btn" class="browser-go-btn">Go</button>
                    </div>
                    <iframe id="safari-iframe" class="browser-iframe" src="https://www.google.com" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
                </div>
            `, 1000, 700);
            
            // Add event listeners after window is created
            setTimeout(() => {
                const urlBar = document.getElementById('safari-url-bar');
                const iframe = document.getElementById('safari-iframe');
                const goBtn = document.getElementById('safari-go-btn');
                const backBtn = document.getElementById('safari-back');
                const forwardBtn = document.getElementById('safari-forward');
                const reloadBtn = document.getElementById('safari-reload');
                
                function loadURL() {
                    let url = urlBar.value.trim();
                    if (!url) return;
                    
                    // Add protocol if missing
                    if (!url.startsWith('http://') && !url.startsWith('https://')) {
                        // Check if it's a search query or URL
                        if (url.includes('.') && !url.includes(' ')) {
                            url = 'https://' + url;
                        } else {
                            // Use as Google search
                            url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
                        }
                    }
                    
                    iframe.src = url;
                    urlBar.value = url;
                }
                
                // Go button
                goBtn.addEventListener('click', loadURL);
                
                // Enter key in URL bar
                urlBar.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') loadURL();
                });
                
                // Back button
                backBtn.addEventListener('click', () => {
                    try {
                        iframe.contentWindow.history.back();
                    } catch(e) {
                        console.log('Cannot go back');
                    }
                });
                
                // Forward button
                forwardBtn.addEventListener('click', () => {
                    try {
                        iframe.contentWindow.history.forward();
                    } catch(e) {
                        console.log('Cannot go forward');
                    }
                });
                
                // Reload button
                reloadBtn.addEventListener('click', () => {
                    iframe.src = iframe.src;
                });
                
                // Update URL bar when iframe loads (for same-origin only)
                iframe.addEventListener('load', () => {
                    try {
                        urlBar.value = iframe.contentWindow.location.href;
                    } catch(e) {
                        // Cross-origin, can't access
                    }
                });
            }, 100);
        },
        
        mail: () => {
            createWindow('mail', 'Mail', `
                <h2>📧 Get in Touch</h2>
                <div class="mail-compose">
                    <input type="email" placeholder="Your email" value="harshit@example.com" readonly>
                    <input type="text" placeholder="Subject">
                    <textarea placeholder="Write your message here..."></textarea>
                    <button onclick="alert('Message sent! (Demo only)')">Send Message</button>
                </div>
            `, 600, 500);
        },
        
        notes: () => {
            createWindow('notes', 'Notes', `
                <div class="notes-content">
                    <h1>👋 Hi, I'm Harshit</h1>
                    <h2>AI Product Manager</h2>
                    
                    <p>I'm a passionate AI Product Manager with expertise in building innovative products that leverage artificial intelligence and machine learning.</p>
                    
                    <h2>🎯 Core Skills</h2>
                    <ul>
                        <li><strong>Product Strategy:</strong> Vision, roadmap planning, and execution</li>
                        <li><strong>AI/ML:</strong> Deep understanding of AI technologies and applications</li>
                        <li><strong>User Research:</strong> Data-driven insights and user-centered design</li>
                        <li><strong>Team Leadership:</strong> Cross-functional collaboration and stakeholder management</li>
                        <li><strong>Technical Acumen:</strong> Python, SQL, API design, cloud platforms</li>
                    </ul>
                    
                    <h2>💼 Experience</h2>
                    <p><strong>Senior AI Product Manager</strong> - Tech Company (2022-Present)</p>
                    <ul>
                        <li>Led development of AI-powered recommendation engine serving 10M+ users</li>
                        <li>Increased user engagement by 45% through personalization features</li>
                        <li>Managed team of 15 engineers and designers</li>
                    </ul>
                    
                    <p><strong>Product Manager</strong> - Startup Inc. (2020-2022)</p>
                    <ul>
                        <li>Launched 3 successful AI products from 0 to 1</li>
                        <li>Achieved Product-Market Fit in 6 months</li>
                        <li>Secured $2M in additional funding</li>
                    </ul>
                    
                    <h2>🎓 Education</h2>
                    <p>MBA - Business School | B.Tech in Computer Science</p>
                    
                    <h2>🚀 Current Focus</h2>
                    <p>Working on next-generation AI products that democratize access to AI technology and empower creators worldwide.</p>
                </div>
            `, 700, 600);
        },
        
        terminal: () => {
            const win = createWindow('terminal', 'Terminal', `
                <div class="terminal-content" id="terminal-output">
                    <div class="terminal-line">Last login: ${new Date().toLocaleString()}</div>
                    <div class="terminal-line">harshit@macbook ~ %</div>
                    <div class="terminal-input">
                        <span>harshit@macbook ~ %</span>
                        <input type="text" id="terminal-input-field" autofocus>
                    </div>
                </div>
            `, 700, 500);
            
            setTimeout(() => {
                const terminalInput = document.getElementById('terminal-input-field');
                if (terminalInput) {
                    terminalInput.focus();
                    terminalInput.addEventListener('keypress', handleTerminalCommand);
                }
            }, 100);
        },
        
        vscode: () => {
            createWindow('vscode', 'VS Code', `
                <div style="font-family: 'Courier New', monospace; background: #1e1e1e; color: #d4d4d4; padding: 20px; height: 100%;">
                    <div style="color: #6a9955;">// Welcome to Harshit's Code Editor</div>
                    <div style="color: #569cd6;">const</div> <span style="color: #9cdcfe;">greeting</span> = <span style="color: #ce9178;">"Hello, World!"</span>;
                    <br><br>
                    <div style="color: #569cd6;">function</div> <span style="color: #dcdcaa;">buildAmazingProducts</span>() {
                    <div style="margin-left: 20px;">
                        <div style="color: #569cd6;">return</div> {
                        <div style="margin-left: 20px;">
                            <span style="color: #9cdcfe;">innovation</span>: <span style="color: #ce9178;">'high'</span>,<br>
                            <span style="color: #9cdcfe;">userImpact</span>: <span style="color: #ce9178;">'maximum'</span>,<br>
                            <span style="color: #9cdcfe;">technology</span>: <span style="color: #ce9178;">'cutting-edge'</span>
                        </div>
                        };
                    </div>
                    }
                    <br><br>
                    <div style="color: #6a9955;">// Current Projects:</div>
                    <div style="color: #6a9955;">// - AI-Powered Analytics Platform</div>
                    <div style="color: #6a9955;">// - Smart Recommendation Engine</div>
                    <div style="color: #6a9955;">// - Voice AI Assistant</div>
                </div>
            `, 800, 600);
        },
        
        github: () => {
            createWindow('github', 'GitHub', `
                <div style="text-align: center; padding: 40px;">
                    <i class="fab fa-github" style="font-size: 80px; color: #333;"></i>
                    <h2 style="margin: 20px 0;">Harshit's GitHub</h2>
                    <p>Check out my open source projects and contributions</p>
                    <a href="https://github.com/harshit" target="_blank" style="display: inline-block; margin-top: 20px; padding: 12px 30px; background: #333; color: #fff; text-decoration: none; border-radius: 8px;">
                        Visit GitHub Profile
                    </a>
                    <div style="margin-top: 40px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center;">
                        <div>
                            <h3 style="font-size: 32px; color: var(--accent);">150+</h3>
                            <p>Repositories</p>
                        </div>
                        <div>
                            <h3 style="font-size: 32px; color: var(--accent);">2.5k+</h3>
                            <p>Contributions</p>
                        </div>
                        <div>
                            <h3 style="font-size: 32px; color: var(--accent);">500+</h3>
                            <p>Stars</p>
                        </div>
                    </div>
                </div>
            `, 600, 500);
        },
        
        linkedin: () => {
            createWindow('linkedin', 'LinkedIn', `
                <div style="text-align: center; padding: 40px;">
                    <i class="fab fa-linkedin" style="font-size: 80px; color: #0077b5;"></i>
                    <h2 style="margin: 20px 0;">Connect on LinkedIn</h2>
                    <p>Let's connect and collaborate on exciting projects!</p>
                    <a href="https://linkedin.com/in/harshit" target="_blank" style="display: inline-block; margin-top: 20px; padding: 12px 30px; background: #0077b5; color: #fff; text-decoration: none; border-radius: 8px;">
                        View LinkedIn Profile
                    </a>
                    <div style="margin-top: 40px;">
                        <h3>Professional Highlights</h3>
                        <ul style="text-align: left; max-width: 400px; margin: 20px auto;">
                            <li>AI Product Management Expert</li>
                            <li>10+ Years Experience</li>
                            <li>Multiple Successful Product Launches</li>
                            <li>Thought Leader in AI/ML</li>
                        </ul>
                    </div>
                </div>
            `, 600, 500);
        },
        
        spotify: () => {
            createWindow('spotify', 'Spotify', `
                <div style="background: linear-gradient(135deg, #1db954 0%, #191414 100%); color: #fff; padding: 40px; text-align: center; height: 100%;">
                    <i class="fab fa-spotify" style="font-size: 80px;"></i>
                    <h2 style="margin: 20px 0;">Now Playing</h2>
                    <div style="margin: 30px 0;">
                        <h3 style="font-size: 24px;">Coding Focus Mix</h3>
                        <p style="opacity: 0.8;">Lo-fi beats for productive work sessions</p>
                    </div>
                    <div style="margin: 40px 0;">
                        <i class="fas fa-backward" style="font-size: 24px; margin: 0 15px; cursor: pointer;"></i>
                        <i class="fas fa-play-circle" style="font-size: 48px; margin: 0 15px; cursor: pointer;"></i>
                        <i class="fas fa-forward" style="font-size: 24px; margin: 0 15px; cursor: pointer;"></i>
                    </div>
                    <div style="margin-top: 20px;">
                        <input type="range" style="width: 80%;" value="45">
                    </div>
                </div>
            `, 500, 600);
        },
        
        youtube: () => {
            createWindow('youtube', 'YouTube', `
                <div style="text-align: center; padding: 40px;">
                    <i class="fab fa-youtube" style="font-size: 80px; color: #ff0000;"></i>
                    <h2 style="margin: 20px 0;">Harshit's Channel</h2>
                    <p>Product Management & AI Tutorials</p>
                    <a href="https://youtube.com/@harshit" target="_blank" style="display: inline-block; margin-top: 20px; padding: 12px 30px; background: #ff0000; color: #fff; text-decoration: none; border-radius: 8px;">
                        Subscribe to Channel
                    </a>
                    <div style="margin-top: 40px;">
                        <h3>Latest Videos</h3>
                        <ul style="text-align: left; max-width: 400px; margin: 20px auto;">
                            <li>🎥 How to Build AI Products</li>
                            <li>🎥 Product Management Fundamentals</li>
                            <li>🎥 AI/ML for Product Managers</li>
                            <li>🎥 Career Growth in Tech</li>
                        </ul>
                    </div>
                </div>
            `, 600, 550);
        },
        
        facetime: () => {
            createWindow('facetime', 'FaceTime', `
                <div style="background: #000; color: #fff; text-align: center; padding: 60px; height: 100%;">
                    <i class="fas fa-video" style="font-size: 80px; color: #0f0;"></i>
                    <h2 style="margin: 30px 0;">Video Call</h2>
                    <p style="opacity: 0.8; margin-bottom: 30px;">Camera access not available in demo</p>
                    <div style="margin-top: 40px;">
                        <button style="padding: 15px 30px; background: #0f0; color: #000; border: none; border-radius: 50px; cursor: pointer; font-size: 16px; margin: 0 10px;">
                            <i class="fas fa-phone"></i> Call
                        </button>
                        <button style="padding: 15px 30px; background: #f00; color: #fff; border: none; border-radius: 50px; cursor: pointer; font-size: 16px; margin: 0 10px;">
                            <i class="fas fa-phone-slash"></i> End
                        </button>
                    </div>
                </div>
            `, 600, 500);
        },
        
        weather: () => {
            createWindow('weather', 'Weather', `
                <div class="weather-widget">
                    <div class="weather-icon">
                        <i class="fas fa-cloud-sun" style="color: #ffa500;"></i>
                    </div>
                    <div class="weather-temp">24°C</div>
                    <div class="weather-desc">Partly Cloudy</div>
                    <p>San Francisco, CA</p>
                    <div class="weather-details">
                        <div class="weather-detail">
                            <i class="fas fa-wind"></i>
                            <p>Wind</p>
                            <strong>12 km/h</strong>
                        </div>
                        <div class="weather-detail">
                            <i class="fas fa-tint"></i>
                            <p>Humidity</p>
                            <strong>65%</strong>
                        </div>
                        <div class="weather-detail">
                            <i class="fas fa-eye"></i>
                            <p>Visibility</p>
                            <strong>10 km</strong>
                        </div>
                    </div>
                </div>
            `, 500, 600);
        },
        
        trash: () => {
            createWindow('trash', 'Trash', `
                <div style="text-align: center; padding: 60px;">
                    <i class="fas fa-trash" style="font-size: 80px; opacity: 0.5;"></i>
                    <h2 style="margin: 20px 0;">Trash is Empty</h2>
                    <p style="opacity: 0.7;">Deleted files will appear here</p>
                </div>
            `, 500, 400);
        }
    };
    
    if (apps[appName]) {
        apps[appName]();
    }
}

// Terminal Commands
function handleTerminalCommand(e) {
    if (e.key === 'Enter') {
        const input = e.target;
        const command = input.value.trim();
        const output = document.getElementById('terminal-output');
        
        // Display command
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.textContent = `harshit@macbook ~ % ${command}`;
        output.insertBefore(commandLine, output.querySelector('.terminal-input'));
        
        // Process command
        const response = document.createElement('div');
        response.className = 'terminal-line';
        
        const commands = {
            'help': 'Available commands: help, about, skills, projects, contact, clear, ls, pwd',
            'about': 'Harshit - AI Product Manager with 10+ years of experience building innovative AI-powered products.',
            'skills': 'Product Strategy | AI/ML | User Research | Team Leadership | Python | SQL | API Design',
            'projects': 'Current: AI Analytics Platform, Smart Recommendations, Voice Assistant',
            'contact': 'Email: harshit@example.com | LinkedIn: /in/harshit | GitHub: @harshit',
            'ls': 'Documents  Downloads  Pictures  Projects  Work',
            'pwd': '/Users/harshit',
            'clear': 'CLEAR'
        };
        
        if (command === 'clear') {
            output.innerHTML = `
                <div class="terminal-line">harshit@macbook ~ %</div>
                <div class="terminal-input">
                    <span>harshit@macbook ~ %</span>
                    <input type="text" id="terminal-input-field" autofocus>
                </div>
            `;
            const newInput = document.getElementById('terminal-input-field');
            newInput.addEventListener('keypress', handleTerminalCommand);
            newInput.focus();
            return;
        }
        
        response.textContent = commands[command] || `Command not found: ${command}. Type 'help' for available commands.`;
        output.insertBefore(response, output.querySelector('.terminal-input'));
        
        input.value = '';
        
        // Scroll to bottom
        output.parentElement.scrollTop = output.parentElement.scrollHeight;
    }
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + W to close active window
    if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
        e.preventDefault();
        const activeWindow = document.querySelector('.window:not(.minimized)');
        if (activeWindow) {
            const appName = Array.from(activeWindows.entries())
                .find(([key, value]) => value === activeWindow)?.[0];
            if (appName) {
                closeWindow(activeWindow.id, appName);
            }
        }
    }
});

console.log('%c🎉 Welcome to Harshit\'s macOS Portfolio!', 'font-size: 20px; color: #007aff; font-weight: bold;');
console.log('%c✨ Built with HTML, CSS, and JavaScript', 'font-size: 14px; color: #333;');
console.log('%c🚀 Fully functional macOS experience in your browser!', 'font-size: 14px; color: #27c93f;');
