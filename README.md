# FOSSEE Workshop Booking – UI/UX Enhancement

## Overview
This project improves the user interface and user experience of the
FOSSEE workshop booking portal while keeping the original Django
backend structure intact. The redesign focuses on modern UI,
responsiveness, accessibility, performance, and SEO improvements.

---

## Design Principles

The redesign followed several UI/UX design principles:

• **Visual Hierarchy** – Important information such as statistics and filters
are clearly highlighted.

• **Consistency** – Buttons, typography, and layout patterns were kept
consistent across pages.

• **Minimalism** – Unnecessary visual clutter was removed to improve
readability.

• **User Flow** – Navigation and filtering were simplified so users can
find workshop statistics quickly.

---

## Responsiveness

The interface was redesigned with a **mobile-first approach**, since the
portal is expected to be accessed primarily by students on mobile devices.

Responsive techniques used:

• Flexible layout structures  
• Responsive typography  
• Adaptive tables and filters  
• Media queries for smaller screens

This ensures usability across:

• Mobile devices  
• Tablets  
• Desktop screens

---

## React Integration

React was introduced to implement **interactive data visualization**
components such as workshop statistics charts.

Using React allows:

• Dynamic rendering of charts  
• Better performance for interactive elements  
• Separation of UI components

Charts were implemented using **react-chartjs-2**.

---

## Performance Improvements

The redesign improves performance by:

• Reducing unnecessary DOM elements  
• Optimizing layout structure  
• Using lightweight UI styling  
• Minimizing unused CSS

---

## Accessibility Improvements

Accessibility enhancements include:

• Semantic HTML structure  
• Proper form labels  
• Accessible navigation elements  
• Improved color contrast for readability

---

## SEO Improvements

SEO improvements were implemented using:

• Meta description tags  
• Keyword metadata  
• Responsive viewport configuration  
• Meaningful page titles

These changes improve search engine discoverability.

---

## Setup Instructions

1. Clone the repository
git clone <your-repo-link>


2. Install Python dependencies


pip install -r requirements.txt


3. Run migrations


python manage.py migrate


4. Run the server


python manage.py runserver


Then open:


http://127.0.0.1:8000

## Screenshots


![Before Home](ScreenShots/before_home.png)

![Before Statistics](ScreenShots/before_statistics.png)

---

## After Redesign

![After Home](ScreenShots/after_home.png)

![After Statistics](ScreenShots/after_statistics.png)
![After Graph](ScreenShots/after_graph.png)