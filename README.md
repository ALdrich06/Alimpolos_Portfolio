# ICSA Portfolio

A modern, responsive portfolio website showcasing academic outputs and projects from the Institute of Computer Science and Automation (ICSA).

## Features

- **Modern UI Design**: Clean and professional interface with gradient backgrounds and smooth animations
- **Responsive Layout**: Fully responsive design that works on all devices
- **Subject Organization**: Outputs organized by subject areas
- **Interactive Elements**: Hover effects and smooth transitions
- **Easy to Customize**: Simple HTML structure for easy content updates

## Subjects Included

1. **Programming** - Web applications, algorithms, database design
2. **Web Development** - Responsive websites, e-commerce platforms, API development
3. **Data Science** - Data analysis, machine learning, visualization
4. **Software Engineering** - System design, agile project management, testing

## Technologies Used

- HTML5
- CSS3 (with Tailwind CSS)
- JavaScript
- Font Awesome Icons
- Google Fonts (Inter)

## How to Use

1. Open `index.html` in your web browser to view the portfolio
2. Customize the content by editing the HTML file
3. Add your own projects and outputs in each subject section
4. Update the skills section with your technical expertise

## Deployment to GitHub Pages

1. Create a new repository on GitHub
2. Push this project to your repository
3. Go to Settings > Pages
4. Select the branch (usually `main`) and root folder
5. Your portfolio will be live at `https://yourusername.github.io/repository-name`

## Customization Guide

### Adding New Subjects

Copy this template and add it to the subjects grid:

```html
<div class="bg-white rounded-2xl shadow-lg overflow-hidden card-hover animate-fade-in">
    <div class="subject-card p-6">
        <div class="flex items-center mb-4">
            <i class="fas fa-icon-name text-4xl text-purple-700 mr-4"></i>
            <h3 class="text-2xl font-bold text-gray-800">Subject Name</h3>
        </div>
    </div>
    <div class="p-6">
        <div class="space-y-4">
            <div class="output-item pl-4 py-3 rounded">
                <h4 class="font-semibold text-gray-800 mb-1">Output Title</h4>
                <p class="text-sm text-gray-600">Description</p>
                <span class="text-xs text-purple-600 font-medium">Completed: Date</span>
            </div>
        </div>
    </div>
</div>
```

### Changing Colors

The main color scheme uses purple gradients. To change:
- Primary gradient: `.gradient-bg` class
- Accent color: `#667eea` and `#764ba2`

## License

Free to use for educational purposes.

---

**ICSA - Institute of Computer Science and Automation**
