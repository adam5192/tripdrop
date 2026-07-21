# TripDrop

A trip planning and tracking web app for organizing your travels. Create trips, log your favourite activities with ratings and categories, search for real places, and see everything come together as pins on an interactive map.

Live demo: https://tripdrop.adammokdad.com/


## Features

- Plan & track trips — create trips with destinations and dates, then log the activities you did on each one
- Place search — search for real restaurants, attractions, and landmarks, scoped to your trip's country, and drop them as pins with one click
- Interactive map — every activity with a location appears as a pin on a Leaflet map that automatically frames your stops
- Rate & categorize — tag activities by type (food, attraction, hike, etc.) and give them star ratings
- Filter — filter activities by type; the list and map update together
- Full editing — inline edit any activity, with confirmation modals for deletions
- Accounts & sync — works fully offline using local storage, or sign in (email or Google) to sync trips to the cloud
- Local-to-cloud migration — sign in and choose to upload trips you created while signed out


## Tech Stack

- Vanilla JavaScript (ES modules, OOP, async/await) — no framework
- Vite — build tooling and dev server
- Supabase — authentication (email + Google OAuth) and PostgreSQL database with row-level security
- Leaflet — interactive maps with OpenStreetMap / Carto tiles
- Nominatim — geocoding and place search
- Netlify — hosting and continuous deployment


## Architecture

The app follows a model–view–controller structure:

- Models (Trip, Activity) — plain classes holding data and behavior
- Views (DashboardView, TripView, MapView, AuthView, ModalView, FormView) — each owns a slice of the UI and its DOM rendering
- Controller (App) — coordinates the views, holds application state, and routes user actions
- Storage layer (store.js) — a dual-mode router that reads and writes to either local storage (anonymous) or Supabase (signed in), so the rest of the app uses one consistent interface regardless of auth state


## Running Locally

Clone and install:

    git clone https://github.com/adam5192/tripdrop.git
    cd tripdrop
    npm install

Add your Supabase credentials in a .env file in the project root:

    VITE_SUPABASE_URL=your-supabase-project-url
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

Start the dev server:

    npm run dev

The app runs without Supabase credentials too — it just falls back to local-storage-only mode with no sign-in.


## What I Learned

This started as a way to reinforce JavaScript fundamentals and grew into a full-stack application. Along the way I worked through:

- Structuring a vanilla JS app with ES modules and clean separation of concerns
- Managing async data flow, loading states, and error handling
- Integrating third-party APIs (geocoding, maps) and handling rate limits with debouncing
- Building authentication with email and OAuth, including the redirect-flow edge cases
- Designing a database schema with row-level security
- Bridging two storage backends behind a single interface
