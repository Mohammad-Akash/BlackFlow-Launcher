package com.blackflow.launcher.data.local.dao

import androidx.room.*
import com.blackflow.launcher.data.local.entities.*
import kotlinx.coroutines.flow.Flow

@Dao
interface AppDao {
    @Query("SELECT * FROM app_settings WHERE id = 1 LIMIT 1")
    fun getAppSettings(): Flow<AppSettingsEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveAppSettings(settings: AppSettingsEntity)

    @Query("SELECT * FROM home_screen_items ORDER BY pageIndex, row, column")
    fun getAllHomeScreenItems(): Flow<List<HomeScreenItemEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertHomeScreenItem(item: HomeScreenItemEntity): Long

    @Delete
    suspend fun deleteHomeScreenItem(item: HomeScreenItemEntity)

    @Query("DELETE FROM home_screen_items WHERE id = :id")
    suspend fun deleteHomeScreenItemById(id: Long)

    @Query("SELECT * FROM home_screen_pages ORDER BY pageIndex ASC")
    fun getPages(): Flow<List<HomeScreenPageEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPage(page: HomeScreenPageEntity)

    @Query("SELECT * FROM gesture_settings")
    fun getAllGestures(): Flow<List<GestureSettingsEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun setGesture(gesture: GestureSettingsEntity)

    @Query("SELECT * FROM lock_screen_settings WHERE id = 1 LIMIT 1")
    fun getLockScreenSettings(): Flow<LockScreenSettingsEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveLockScreenSettings(settings: LockScreenSettingsEntity)
}

@Dao
interface WallpaperDao {
    @Query("SELECT * FROM wallpapers ORDER BY title ASC")
    fun getAllWallpapers(): Flow<List<WallpaperEntity>>

    @Query("SELECT * FROM wallpapers WHERE category = :category")
    fun getWallpapersByCategory(category: String): Flow<List<WallpaperEntity>>

    @Query("SELECT * FROM wallpapers WHERE isFavorite = 1")
    fun getFavoriteWallpapers(): Flow<List<WallpaperEntity>>

    @Query("SELECT * FROM wallpapers WHERE isDownloaded = 1")
    fun getDownloadedWallpapers(): Flow<List<WallpaperEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWallpapers(wallpapers: List<WallpaperEntity>)

    @Query("UPDATE wallpapers SET isFavorite = :isFav WHERE id = :id")
    suspend fun updateFavorite(id: String, isFav: Boolean)

    @Query("UPDATE wallpapers SET isDownloaded = :isDownloaded, localPath = :localPath WHERE id = :id")
    suspend fun updateDownloadStatus(id: String, isDownloaded: Boolean, localPath: String?)
}

@Dao
interface ThemeDao {
    @Query("SELECT * FROM themes ORDER BY createdAt DESC")
    fun getAllThemes(): Flow<List<ThemeEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertThemes(themes: List<ThemeEntity>)

    @Query("SELECT * FROM user_themes ORDER BY createdAt DESC")
    fun getUserThemes(): Flow<List<UserThemeEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUserTheme(userTheme: UserThemeEntity)
}
