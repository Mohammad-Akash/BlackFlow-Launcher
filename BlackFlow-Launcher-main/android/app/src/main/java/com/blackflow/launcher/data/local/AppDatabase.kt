package com.blackflow.launcher.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.blackflow.launcher.data.local.dao.*
import com.blackflow.launcher.data.local.entities.*

@Database(
    entities = [
        AppSettingsEntity::class,
        HomeScreenItemEntity::class,
        HomeScreenPageEntity::class,
        ThemeEntity::class,
        WallpaperEntity::class,
        DownloadedWallpaperEntity::class,
        FavoriteWallpaperEntity::class,
        IconPackEntity::class,
        WidgetSettingsEntity::class,
        LockScreenSettingsEntity::class,
        GestureSettingsEntity::class,
        UserThemeEntity::class,
        AppCategoryEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun appDao(): AppDao
    abstract fun wallpaperDao(): WallpaperDao
    abstract fun themeDao(): ThemeDao
}
