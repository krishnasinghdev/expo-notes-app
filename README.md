# React Native (Expo) Notes App

A responsive Notes App built with React Native and Expo.

This project demonstrates modern React Native fundamentals including responsive layouts, theming, note management, orientation handling, and clean mobile UI patterns.

---

# Features

## Notes List

- Display all notes using `FlatList`
- Each note card shows:
  - Title
  - Content preview
  - Created/updated date
- Search notes using `TextInput`
- Pressable note cards to open and edit notes
- Floating Action Button (FAB) to create a new note
- Empty state UI when no notes are found

---

## Note Editor

- Create new notes
- Edit existing notes
- `TextInput` for note title
- Multiline `TextInput` for note content
- `KeyboardAvoidingView` to prevent keyboard overlap
- `ImageBackground` header section
- Save and Back actions using `Pressable`
- Confirmation alert before discarding changes

---

## Theming

- Automatic theme detection using `useColorScheme`
- Manual dark/light mode toggle using `Switch`
- Dynamic colors for:
  - Background
  - Cards
  - Inputs
  - Typography
  - Borders

---

## Responsive Design

Implemented using `useWindowDimensions`.

Features include:
- Tablet vs mobile layouts
- Responsive spacing
- Responsive typography
- Responsive Floating Action Buttons
- Landscape mode support
- Two-column layout for tablets

---

## Orientation Support

Implemented using:

```bash
expo-screen-orientation
```

Features:
- Toggle between portrait and landscape mode
- Responsive editor layout adjustments
- Optimized landscape editing experience

---

# React Native APIs & Concepts Used

## Core Components

- `FlatList`
- `Text`
- `TextInput`
- `View`
- `Pressable`
- `ImageBackground`
- `KeyboardAvoidingView`
- `Switch`
- `StatusBar`
- `ScrollView`

---

## React Hooks

- `useState`
- `useMemo`

---

## React Native Hooks

- `useColorScheme`
- `useWindowDimensions`

---

## Styling

All styling is implemented using:

```tsx
StyleSheet.create()
```

Additionally:
- `StyleSheet.compose`
- `StyleSheet.flatten`

were used as required.

---

# UI Features

- Modern card-based notes layout
- Floating action buttons
- Press feedback animations
- Responsive spacing system
- Clean typography hierarchy
- Dark mode support
- Landscape-aware editor

---

# Project Structure

```txt
HomeScreen
 ├── Notes List View
 │    ├── Search Input
 │    ├── FlatList
 │    ├── Note Cards
 │    └── Floating Action Buttons
 │
 └── Editor View
      ├── Image Header
      ├── Title Input
      ├── Content Input
      └── Action Buttons
```

### This video demonstrates the core functionality of the Notes App.

[![Watch the demo](https://img.shields.io/badge/Watch-Demo-blue)](https://ik.imagekit.io/fxwlz5gms/users/demo.mp4)