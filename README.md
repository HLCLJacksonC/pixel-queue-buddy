# Pixel Queue Buddy

# PixelQueue Product Spec

## 1. Product Name

**PixelQueue**

A cute pixel-art computer vision app that estimates café queue length and wait time from an uploaded image.

---

## 2. One-Sentence Pitch

PixelQueue turns a real café queue photo into a cute pixel-style queue visualization, showing how many people are waiting and how long the wait might be.

---

## 3. Goal

Build a small hackathon demo that shows how computer vision can analyze a real-world queue and convert it into a fun, readable, pixel-art interface.

The app should feel like a tiny game UI, not a serious enterprise dashboard.

---

## 4. Core User Story

As a café customer or café operator, I want to upload a photo of a line so that I can quickly understand:

- how many people are in the queue

- how long the estimated wait is

- how busy the café is

- what product people may be waiting for

---

## 5. MVP Scope

The MVP should support:

1. Uploading a café queue image

2. Sending the image to a FastAPI backend

3. Detecting people in the image

4. Counting the number of people

5. Estimating wait time based on product type

6. Returning structured JSON to the frontend

7. Rendering the result as a cute pixel-art queue

---

## 6. Non-Goals

Do not build these in the first version:

- user accounts

- database

- real-time surveillance camera integration

- advanced queue tracking

- payment system

- mobile app

- model training from scratch

- complex admin dashboard

---

## 7. Tech Stack

### Frontend

- React

- Vite

- TypeScript

- Tailwind CSS

### Backend

- Python

- FastAPI

- OpenCV

- YOLO or another pretrained person detection model

### Optional

- OpenAI or DeepSeek API for generating a cute natural-language summary

- Sample image collection for testing

---

## 8. App Pages

### Main Page

The app can be a single-page app.

It should include:

- PixelQueue title

- short tagline

- image upload area

- product selector

- analyze button

- result panel

- pixel queue visualization

- optional original image preview

---

## 9. Product Selector

The user should be able to choose what the line is for.

Initial product options:

- Coffee

- Boba

- Sandwich

- Pastry

- Custom

Each product type has a default average service time.

Example values:

```ts

const PRODUCT_SERVICE_TIMES = {

  coffee: 120,

  boba: 180,

  sandwich: 90,

  pastry: 60,

  custom: 120

};

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cf62dda9-c239-4cd1-87a6-b9294e6bdab6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
