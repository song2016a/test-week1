
# Blueprint: Lotto Luck - Enhanced Features

## 1. Project Overview

This project aims to transform a simple "Lotto Number Generator" tool into a high-quality, feature-rich website optimized for Google AdSense approval and user engagement. The focus is on providing unique value to visitors through comprehensive lottery information, building trust, and ensuring a professional user experience.

## 2. Core Features & Design Philosophy

### a. Site Structure & Navigation
- **Header:** A clean and prominent header containing the site title and navigation.
- **Navigation Bar:** An intuitive navigation menu with links to Home, Blog, About Us, and Contact.
- **Footer:** A comprehensive footer with links to Privacy Policy and Terms of Service.

### b. Content Strategy
- **Homepage:** The homepage is the central hub, featuring not just the number generator but a suite of tools and information to engage users.
- **High-Quality Blog:** A dedicated blog with original articles on lottery strategies, stories, and psychology to demonstrate expertise.
- **Trust-Building Pages:** "About Us," "Contact," and "Privacy Policy" pages to build credibility.

### c. Visual Design
- **Aesthetics:** A modern, clean, and visually balanced layout.
- **Responsiveness:** A fully responsive design for all devices.
- **Consistency:** A consistent design language across all pages.

## 3. Current Implementation Plan: Homepage Enhancement

The following features will be added to the homepage (`index.html`) to make it more dynamic and valuable for users.

1.  **Lotto Draw Information Block:**
    *   **Current Draw Number:** Display the upcoming lottery draw number (e.g., "제 1131회"). This will be calculated based on the current date.
    *   **Draw Countdown:** A real-time countdown timer showing the days, hours, minutes, and seconds remaining until the next draw (every Saturday at 8:45 PM KST).
    *   **Previous Draw's Winning Numbers:** Display the winning numbers from the last draw for easy reference.

2.  **Upgraded Lotto Number Generator:**
    *   **Generate 5 Sets:** Modify the generator to produce five unique sets of 6 numbers with a single click, providing users with more options.
    *   The UI will be updated to display these five sets clearly.

3.  **Lotto Number Statistics Section:**
    *   **Winning Frequency Chart:** Add a new section displaying the winning frequency of each of the 45 lottery numbers over the past year.
    *   This will be visualized as a simple bar chart to provide users with statistical insights. (Note: This will use placeholder data for now, as a live API is out of scope).

4.  **Implementation Steps:**
    *   **Phase 1: `index.html` Structure:** Add the new HTML elements for the draw information block, the 5-set generator, and the statistics chart.
    *   **Phase 2: `main.js` Logic:**
        *   Implement the logic to calculate the current draw number.
        *   Create the countdown timer functionality.
        *   Update the number generation function to create 5 sets.
        *   Create and display the statistics chart from placeholder data.
    *   **Phase 3: `style.css` Styling:** Apply styles to all new elements to ensure they are visually appealing, consistent with the site's design, and responsive.
