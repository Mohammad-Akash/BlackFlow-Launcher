# BlackFlow Launcher (Android / Jetpack Compose)

**BlackFlow Launcher** is a production-ready, ultra-minimalist AMOLED Black launcher for Android, built with Kotlin, Jetpack Compose, Material 3, Room, DataStore, and Hilt.

Inspired by premium monochrome phone ergonomics, BlackFlow transforms your device into an eye-safe, battery-saving (#000000 pure black pixels shut off completely on OLED screens) digital workspace.

---

## Key Features

1. **Pure AMOLED Black Home Screen (#000000)**: Zero backlight battery drain on OLED/AMOLED screens.
2. **Minimalist Monochrome Icon Engine**: Clean white outlined icons without distracting marketing badges or bright notification dots.
3. **High-Performance App Drawer**: Instant real-time app search, category sorting (System, Tools, Dev, Social, Media), fast alphabetical scrolling.
4. **Android Home Launcher Integration**: Uses modern Android `RoleManager.ROLE_HOME` (Android 10+) and standard Home intent filters.
5. **AmoledLiveWallpaperService**: Battery-friendly Canvas-rendered 60FPS moving particles, galaxy stars, and neon lines that shut off when obscured or sleeping.
6. **Coexisting Secure Lock Screen Overlay**: Futuristic digital clock, weather, fast charging indicator, and `androidx.biometric.BiometricPrompt` integration without bypassing Android's secure PIN/password system.
7. **Visual Theme Studio**: Customizable grid dimensions (3x5 to 5x7), clock styles (Minimal, Cyber Mono, Dual Line), icon styles, and exportable theme JSON.
8. **Offline-First Room Architecture**: 13 structured Room database entities with zero mandatory telemetry or external dependencies.

---

## Technical Stack

- **Language**: Kotlin 2.0+
- **UI Framework**: Jetpack Compose + Material 3 (100% declarative UI)
- **Dependency Injection**: Dagger Hilt
- **Local Persistence**: Room Database + Jetpack DataStore Preferences
- **System Services**: `PackageManager`, `WallpaperManager`, `WallpaperService`, `RoleManager`, `BiometricManager`
- **Target SDK**: Android 15 (API 35)
- **Minimum SDK**: Android 8.0 Oreo (API 26)

---

## How to Open in Android Studio

1. Open **Android Studio** (Ladybug / Iguana / Hedgehog or newer).
2. Select **Open** and select the `/android` directory.
3. Allow Gradle to sync dependencies (Room, Hilt, Compose, DataStore).
4. Connect an Android phone (with Developer Options & USB Debugging enabled) or start an Android Emulator.
5. Click **Run 'app'** (`Shift + F10`).
6. When prompted on the device, press the Home button and select **BlackFlow Launcher** as "Always".
