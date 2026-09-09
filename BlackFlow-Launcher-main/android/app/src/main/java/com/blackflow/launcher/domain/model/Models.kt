package com.blackflow.launcher.domain.model

import android.graphics.drawable.Drawable

data class AppInfo(
    val packageName: String,
    val activityName: String,
    val label: String,
    val icon: Drawable? = null,
    val isHidden: Boolean = false,
    val isFavorite: Boolean = false,
    val category: String = "TOOLS",
    val launchCount: Int = 0,
    val installTime: Long = 0L
)

enum class IconStyle {
    OUTLINE,
    FILLED_MONOCHROME,
    THIN_LINE,
    ROUNDED,
    MINIMAL
}

enum class ClockStyle {
    MINIMAL_DIGITAL,
    CYBER_MONO,
    DUAL_LINE,
    VERTICAL_DIGIT,
    MATRIX_CLOCK
}

enum class GestureAction {
    APP_DRAWER,
    NOTIFICATIONS,
    SEARCH,
    LOCK_SCREEN,
    OPEN_SETTINGS,
    TOGGLE_FLASHLIGHT,
    OPEN_WALLPAPER,
    PREVIOUS_PAGE,
    NEXT_PAGE
}

enum class LiveEffectType {
    PARTICLES,
    GALAXY,
    NEON_LINES,
    RAIN,
    STARS,
    FLUID_WAVE
}
