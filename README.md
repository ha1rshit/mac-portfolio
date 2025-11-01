# 🍎 Harshit's macOS Portfolio

A fully functional macOS-inspired portfolio website built with pure HTML, CSS, and JavaScript.

## 👨‍💻 About

This is a portfolio website for **Harshit**, an **AI Product Manager**, featuring a complete macOS Big Sur interface experience in the browser.

## ✨ Features

### Complete macOS Experience
- 🚀 **Boot Screen** - Realistic Apple boot animation
- 🔐 **Login Screen** - Interactive login interface
- 🖥️ **Desktop** - Full macOS desktop with wallpaper
- 📱 **Menu Bar** - Live time, battery, WiFi icons
- 🌓 **Dark/Light Mode** - Toggle between themes
- 🔍 **Spotlight Search** - Quick app launcher (Cmd/Ctrl + Space)
- 🎛️ **Control Center** - Brightness and volume controls

### Interactive Applications
All apps are fully functional with their own windows:

1. **Finder** - File system browser
2. **Safari** - Web browser with social links
3. **Mail** - Contact form
4. **Notes** - Complete bio, skills, and experience
5. **Terminal** - Working command line interface
   - Commands: `help`, `about`, `skills`, `projects`, `contact`, `ls`, `pwd`, `clear`
6. **VS Code** - Code editor display
7. **GitHub** - GitHub profile showcase
8. **LinkedIn** - LinkedIn profile link
9. **Spotify** - Music player interface
10. **YouTube** - YouTube channel
11. **FaceTime** - Video call interface
12. **Weather** - Weather widget
13. **Trash** - Trash bin

### Window Management
- ✅ **Drag & Drop** - Move windows anywhere
- ✅ **Minimize** - Hide windows to dock
- ✅ **Maximize** - Full screen mode
- ✅ **Close** - Close application windows
- ✅ **Multi-window** - Open multiple apps simultaneously
- ✅ **Focus** - Click to bring window to front

### Dock Features
- 🎨 **Beautiful Design** - Glassmorphism effect
- 🔥 **Hover Effects** - Smooth animations
- 📌 **App Launcher** - Click to open apps
- 💡 **Tooltips** - Hover to see app names

## 🚀 Getting Started

### Quick Start

1. Open `index.html` in your web browser
2. Watch the boot animation
3. Press Enter or click Login (no password required)
4. Explore the desktop!

### Keyboard Shortcuts

- **Cmd/Ctrl + Space** - Open Spotlight Search
- **Cmd/Ctrl + W** - Close active window
- **Escape** - Close Spotlight/Control Center

## 🎨 Customization

### Personal Information

Edit the following in `js/script.js`:

- **User name and title** - Line 21 (login screen)
- **Bio and experience** - Search for "notes" app content
- **Social links** - Search for "safari" app content
- **Terminal responses** - Search for "terminal" commands
- **Contact email** - Search for "mail" app

### Styling

Edit `css/style.css` to customize:

- **Colors** - CSS variables at the top (`:root`)
- **Wallpaper** - Background images in `.desktop`
- **Fonts** - `font-family` properties
- **Animations** - Timing and effects

### Adding New Apps

1. Add dock item in `index.html`:
```html
<div class="dock-item" data-app="myapp" title="My App">
    <i class="fas fa-icon"></i>
</div>
```

2. Add app function in `js/script.js`:
```javascript
myapp: () => {
    createWindow('myapp', 'My App', `
        <h2>My App Content</h2>
    `, 600, 500);
}
```

## 📱 Responsive Design

The portfolio is optimized for desktop but includes responsive features for tablets and mobile devices.

## 🔧 Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling (Flexbox, Grid, Animations)
- **JavaScript (ES6+)** - Functionality
- **Font Awesome** - Icons

## 🌟 Features Highlights

### Design
- Glassmorphism effects
- Smooth animations
- Backdrop blur
- Gradient backgrounds
- Dark mode support

### Functionality
- Window management system
- Drag and drop
- State management
- Keyboard shortcuts
- Real-time clock
- Theme switching

## 📄 File Structure

```
harshu new/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # All styles
├── js/
│   └── script.js      # All functionality
└── README.md          # This file
```

## 🎯 Browser Support

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ IE11 (Limited support)

## 💡 Tips

1. **Best viewed in Chrome** for optimal performance
2. **Use fullscreen mode** for immersive experience
3. **Try keyboard shortcuts** for quick navigation
4. **Explore all apps** for complete portfolio
5. **Toggle dark mode** for different look

## 🔮 Future Enhancements

- [ ] Window resize handles
- [ ] More apps (Calendar, Photos, etc.)
- [ ] App Store
- [ ] Notification Center
- [ ] Multiple desktops
- [ ] Animated transitions
- [ ] Sound effects
- [ ] Mobile optimization

## 📞 Contact

**Harshit** - AI Product Manager
- 📧 Email: harshit@example.com
- 💼 LinkedIn: [linkedin.com/in/harshit](https://www.linkedin.com/in/harshit-praj/)
- 🐙 GitHub: [github.com/harshit](https://github.com/ha1rshit)

## 📜 License

MIT License - Feel free to use this template for your own portfolio!

## 🙏 Acknowledgments

- Inspired by macOS Big Sur design
- Icons from Font Awesome
- Built with ❤️ for modern web

---

**Made with ❤️ by Harshit | 2025**

🎉 Enjoy your macOS portfolio experience!
