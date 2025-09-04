# IBM watsonx.ai Tutorial Website

A modern, responsive tutorial website for IBM watsonx.ai, featuring a dark theme and left sidebar navigation similar to the watsonx data UI.

## Features

- Dark theme with IBM Carbon Design System-inspired styling
- Responsive design that works on desktop and mobile devices
- Interactive sidebar navigation
- Search functionality
- Animated cards and smooth transitions
- Clean and modern UI components

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (optional, for local development)

### Running Locally

1. Clone this repository:
   ```
   git clone https://github.com/your-username/watsonx-tutorials.git
   cd watsonx-tutorials
   ```

2. Open `index.html` in your web browser or use a local development server:
   ```
   # Using Python (if installed)
   python -m http.server 8000
   
   # Or using Node.js with http-server
   npx http-server
   ```

3. Open your browser and navigate to `http://localhost:8000`

## Project Structure

```
watsonx-tutorials/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   └── script.js       # JavaScript for interactivity
└── README.md           # This file
```

## Customization

### Colors

You can customize the color scheme by modifying the CSS variables in `css/style.css`:

```css
:root {
    --primary: #0f62fe;         /* IBM Blue 60 */
    --primary-hover: #0353e9;   /* IBM Blue 70 */
    --background: #161616;      /* Gray 90 */
    --surface: #262626;         /* Gray 80 */
    --text-primary: #f4f4f4;    /* Gray 10 */
    --text-secondary: #c6c6c6;  /* Gray 30 */
    --border-color: #393939;    /* Gray 70 */
}
```

### Adding New Tutorials

1. Add a new link to the sidebar in `index.html` under the appropriate section
2. Create a new HTML file for your tutorial content
3. Link to the new tutorial page from the sidebar

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [IBM Carbon Design System](https://www.carbondesignsystem.com/)
- [Font Awesome](https://fontawesome.com/) for icons
- [Google Fonts](https://fonts.google.com/) for typography
