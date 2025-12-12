// Annual Report Generation Application
document.addEventListener('DOMContentLoaded', function() {
    const reportForm = document.getElementById('reportForm');
    const reportSection = document.getElementById('reportSection');
    const reportContent = document.getElementById('reportContent');
    const shareBtn = document.getElementById('shareBtn');

    // Handle form submission
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        generateReport();
    });

    // Handle share button
    shareBtn.addEventListener('click', function() {
        shareReport();
    });

    // Generate the annual report
    function generateReport() {
        const username = document.getElementById('username').value;
        const year = document.getElementById('year').value;
        const organization = document.getElementById('organization').value;

        // Show loading state
        reportContent.innerHTML = '<div class="loading"></div><p>Generating your annual report...</p>';
        reportSection.style.display = 'block';

        // Simulate API call with setTimeout
        setTimeout(() => {
            const report = createReportContent(username, year, organization);
            reportContent.innerHTML = report;
            
            // Scroll to report
            reportSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1500);
    }

    // Create report content (mock data)
    function createReportContent(username, year, organization) {
        const mockData = generateMockData(username, year, organization);
        
        return `
            <div class="report-header">
                <h2>🎊 ${username}'s ${year} Annual Report</h2>
                ${organization ? `<p class="org-badge">Organization: ${organization}</p>` : ''}
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <h4>Total Contributions</h4>
                    <div class="stat-value">${mockData.totalContributions}</div>
                    <div class="stat-label">commits, PRs, and issues</div>
                </div>

                <div class="stat-card">
                    <h4>Repositories Contributed</h4>
                    <div class="stat-value">${mockData.repositories}</div>
                    <div class="stat-label">open source projects</div>
                </div>

                <div class="stat-card">
                    <h4>Pull Requests</h4>
                    <div class="stat-value">${mockData.pullRequests}</div>
                    <div class="stat-label">merged into projects</div>
                </div>

                <div class="stat-card">
                    <h4>Code Reviews</h4>
                    <div class="stat-value">${mockData.codeReviews}</div>
                    <div class="stat-label">reviews provided</div>
                </div>
            </div>

            <div class="highlights-section">
                <h4>🌟 Year Highlights</h4>
                <ul class="highlights-list">
                    ${mockData.highlights.map(h => `<li>${h}</li>`).join('')}
                </ul>
            </div>

            <div class="language-stats">
                <h4>💻 Top Languages</h4>
                <div class="language-bars">
                    ${mockData.languages.map(lang => `
                        <div class="language-bar">
                            <span class="lang-name">${lang.name}</span>
                            <div class="bar-container">
                                <div class="bar-fill" style="width: ${lang.percentage}%"></div>
                            </div>
                            <span class="lang-percentage">${lang.percentage}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="impact-section">
                <h4>🎯 Community Impact</h4>
                <p>Your contributions have made a significant impact on the open source community. 
                   You've helped improve code quality, fixed bugs, and supported fellow developers 
                   throughout ${year}. Thank you for being an amazing member of the community!</p>
            </div>
        `;
    }

    // Generate mock data for demonstration
    function generateMockData(username, year, organization) {
        const baseValue = username.length * year.length;
        
        return {
            totalContributions: Math.floor(baseValue * 15 + 320),
            repositories: Math.floor(baseValue * 0.5 + 12),
            pullRequests: Math.floor(baseValue * 2 + 45),
            codeReviews: Math.floor(baseValue * 1.5 + 38),
            highlights: [
                `Contributed to ${organization || 'multiple'} open source projects`,
                `Most active month: ${getRandomMonth()}`,
                `Longest contribution streak: ${Math.floor(baseValue * 0.8 + 15)} days`,
                `Helped resolve ${Math.floor(baseValue * 1.2 + 28)} issues`,
                `Added ${Math.floor(baseValue * 150 + 5000)} lines of meaningful code`
            ],
            languages: [
                { name: 'TypeScript', percentage: 45 },
                { name: 'JavaScript', percentage: 30 },
                { name: 'Python', percentage: 15 },
                { name: 'Other', percentage: 10 }
            ]
        };
    }

    // Get random month for highlights
    function getRandomMonth() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return months[Math.floor(Math.random() * months.length)];
    }

    // Share report functionality
    function shareReport() {
        const username = document.getElementById('username').value;
        const year = document.getElementById('year').value;
        const shareText = `Check out my ${year} annual open source report! #AntOSS #OpenSource`;
        
        // Try to use Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: `${username}'s ${year} Annual Report`,
                text: shareText,
                url: window.location.href
            }).catch(err => console.log('Error sharing:', err));
        } else {
            // Fallback: copy to clipboard
            const tempInput = document.createElement('input');
            tempInput.value = shareText + ' ' + window.location.href;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            // Show feedback
            alert('Report link copied to clipboard! Share it with your community.');
        }
    }
});

// Add additional styles dynamically
const style = document.createElement('style');
style.textContent = `
    .report-header {
        text-align: center;
        margin-bottom: 32px;
        padding-bottom: 24px;
        border-bottom: 2px solid var(--border-color);
    }

    .report-header h2 {
        font-size: 2rem;
        color: var(--primary-color);
        margin-bottom: 12px;
    }

    .org-badge {
        display: inline-block;
        background: var(--primary-color);
        color: white;
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 500;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 32px;
    }

    .highlights-section,
    .language-stats,
    .impact-section {
        margin: 32px 0;
        padding: 24px;
        background: white;
        border-radius: 8px;
        box-shadow: var(--shadow);
    }

    .highlights-list {
        list-style: none;
        padding: 0;
        margin: 16px 0;
    }

    .highlights-list li {
        padding: 12px 16px;
        margin: 8px 0;
        background: var(--bg-secondary);
        border-radius: 6px;
        border-left: 4px solid var(--secondary-color);
    }

    .language-bars {
        margin-top: 16px;
    }

    .language-bar {
        display: flex;
        align-items: center;
        margin: 16px 0;
        gap: 12px;
    }

    .lang-name {
        min-width: 100px;
        font-weight: 500;
    }

    .bar-container {
        flex: 1;
        height: 24px;
        background: var(--bg-secondary);
        border-radius: 12px;
        overflow: hidden;
    }

    .bar-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        transition: width 1s ease;
    }

    .lang-percentage {
        min-width: 40px;
        text-align: right;
        font-weight: 600;
        color: var(--primary-color);
    }

    .impact-section p {
        line-height: 1.8;
        color: var(--text-secondary);
    }
`;
document.head.appendChild(style);
