# Ant Open Source Developer Annual Report

Share your small and beautiful open source memory with the community.

## Overview

This project hosts the front-end code of Ant open source developers' annual report generation tool. We use this report to reflect the digital memory with the community and share beautiful coding memories with the community.

## Features

- 📊 **Contribution Statistics**: View your commits, pull requests, and issues throughout the year
- 🌟 **Year Highlights**: Celebrate your most impactful contributions and achievements
- 🤝 **Community Impact**: See how your work has helped the open source community
- 🎨 **Beautiful Visuals**: Share your coding journey with stunning visual reports
- 📤 **Easy Sharing**: Share your annual report with the community

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/antgroup/antoss-dev-report.git
cd antoss-dev-report
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will open in your default browser at `http://localhost:8080`.

### Building for Production

To build the application for production:
```bash
npm run build
```

The static files are ready for deployment as-is.

## Usage

1. **Enter Your Information**: Provide your GitHub username, select the year, and optionally specify your organization
2. **Generate Report**: Click the "Generate Report" button to create your annual report
3. **View Your Statistics**: Review your contribution stats, highlights, and community impact
4. **Share**: Use the share button to share your report with the community

## Project Structure

```
antoss-dev-report/
├── index.html      # Main HTML entry point
├── styles.css      # Application styles
├── app.js          # Application logic
├── package.json    # Project dependencies and scripts
├── README.md       # Project documentation
└── LICENSE         # MIT License
```

## Technology Stack

- **HTML5**: Semantic markup for the application structure
- **CSS3**: Modern styling with flexbox and grid layouts
- **JavaScript (ES6+)**: Interactive functionality and report generation
- **http-server**: Local development server

## Contributing

We welcome contributions from the community! Please feel free to submit issues, fork the repository, and create pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## About

Developed by Ant Group to help open source developers celebrate and share their annual contributions with the community.

---

**Note**: This is a front-end demonstration tool. For production use with real GitHub data, you would need to integrate with the GitHub API.
