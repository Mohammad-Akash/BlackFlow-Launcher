package com.blackflow.launcher.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "app_settings")
data class AppSettingsEntity(
    @PrimaryKey val id: Int = 1,
    val gridRows: Int = 6,
    val gridColumns: Int = 4,
    val iconSizeDp: Int = 56,
    val iconSpacingDp: Int = 12,
    val showLabels: Boolean = false,
    val labelFont: String = "Inter Light",
    val iconOpacity: Float = 1.0f,
    val clockStyle: String = "MINIMAL_DIGITAL",
    val dateStyle: String = "ISO_FUTURISTIC",
    val iconStyle: String = "WHITE_OUTLINE",
    val animationsEnabled: Boolean = true,
    val highRefreshRate120Hz: Boolean = true,
    val defaultHomePageIndex: Int = 0,
    val isFirstLaunch: Boolean = true
)

@Entity(tableName = "home_screen_items")
data class HomeScreenItemEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val pageIndex: Int,
    val row: Int,
    val column: Int,
    val itemType: String, // "APP", "FOLDER", "WIDGET"
    val packageName: String,
    val activityName: String = "",
    val customLabel: String = "",
    val folderId: Long? = null,
    val customIconRes: String = ""
)

@Entity(tableName = "home_screen_pages")
data class HomeScreenPageEntity(
    @PrimaryKey val pageIndex: Int,
    val isDefault: Boolean = false,
    val pageTitle: String = ""
)

@Entity(tableName = "themes")
data class ThemeEntity(
    @PrimaryKey val id: String,
    val name: String,
    val description: String,
    val author: String = "BlackFlow Team",
    val previewImage: String,
    val wallpaperId: String,
    val iconPackId: String,
    val clockStyle: String,
    val lockScreenStyle: String,
    val homeLayout: String,
    val isPremium: Boolean = false,
    val isFavorite: Boolean = false,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "wallpapers")
data class WallpaperEntity(
    @PrimaryKey val id: String,
    val title: String,
    val category: String, // "AMOLED", "ABSTRACT", "MINIMAL", "SPACE", "NATURE", "CARS", "ANIME", "DARK", "LIVE"
    val imageUrl: String,
    val thumbnailUrl: String,
    val isFavorite: Boolean = false,
    val isDownloaded: Boolean = false,
    val localPath: String? = null,
    val isLiveWallpaper: Boolean = false,
    val liveEffectType: String? = null // "PARTICLES", "GALAXY", "NEON_LINES", "RAIN", "STARS"
)

@Entity(tableName = "downloaded_wallpapers")
data class DownloadedWallpaperEntity(
    @PrimaryKey val wallpaperId: String,
    val localUri: String,
    val downloadedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "favorite_wallpapers")
data class FavoriteWallpaperEntity(
    @PrimaryKey val wallpaperId: String,
    val addedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "icon_packs")
data class IconPackEntity(
    @PrimaryKey val id: String,
    val name: String,
    val author: String,
    val style: String, // "OUTLINE", "FILLED_MONOCHROME", "THIN_LINE", "ROUNDED", "MINIMAL"
    val isDownloaded: Boolean = true
)

@Entity(tableName = "widget_settings")
data class WidgetSettingsEntity(
    @PrimaryKey val id: String,
    val widgetType: String, // "CLOCK", "WEATHER", "BATTERY", "SEARCH", "CRYPTO"
    val positionRow: Int,
    val positionCol: Int,
    val spanX: Int = 4,
    val spanY: Int = 2,
    val opacity: Float = 0.9f
)

@Entity(tableName = "lock_screen_settings")
data class LockScreenSettingsEntity(
    @PrimaryKey val id: Int = 1,
    val enabled: Boolean = true,
    val clockPosition: String = "CENTER", // "TOP", "CENTER", "LEFT"
    val clockSizeSp: Int = 64,
    val clockFont: String = "Space Grotesk",
    val clockStyle: String = "FUTURISTIC_DIGITAL",
    val dateFormat: String = "EEE, MMM d",
    val showBatteryPercent: Boolean = true,
    val showWeather: Boolean = true,
    val notificationStyle: String = "MINIMAL_BADGE",
    val wallpaperBlurLevel: Float = 0f,
    val textOpacity: Float = 0.95f,
    val alwaysOnDisplayEnabled: Boolean = false,
    val biometricEnabled: Boolean = true
)

@Entity(tableName = "gesture_settings")
data class GestureSettingsEntity(
    @PrimaryKey val gestureType: String, // "SWIPE_UP", "SWIPE_DOWN", "SWIPE_LEFT", "SWIPE_RIGHT", "DOUBLE_TAP", "TWO_FINGER_SWIPE", "PINCH"
    val assignedAction: String // "APP_DRAWER", "NOTIFICATIONS", "SEARCH", "LOCK_SCREEN", "OPEN_APP", "OPEN_SETTINGS", "TOGGLE_FLASHLIGHT", "OPEN_WALLPAPER"
)

@Entity(tableName = "user_themes")
data class UserThemeEntity(
    @PrimaryKey val id: String,
    val name: String,
    val jsonConfig: String,
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "app_categories")
data class AppCategoryEntity(
    @PrimaryKey val categoryId: String,
    val name: String,
    val iconName: String,
    val sortOrder: Int
)
