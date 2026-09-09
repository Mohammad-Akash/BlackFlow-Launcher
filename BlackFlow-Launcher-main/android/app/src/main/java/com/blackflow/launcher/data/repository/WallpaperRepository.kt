package com.blackflow.launcher.data.repository

import android.app.WallpaperManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Build
import com.blackflow.launcher.data.local.dao.WallpaperDao
import com.blackflow.launcher.data.local.entities.WallpaperEntity
import com.blackflow.launcher.service.AmoledLiveWallpaperService
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.withContext
import java.net.URL
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class WallpaperRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val wallpaperDao: WallpaperDao
) {
    private val wallpaperManager = WallpaperManager.getInstance(context)

    val sampleWallpapers = listOf(
        WallpaperEntity(
            id = "w_amoled_01",
            title = "Pure Abyss",
            category = "AMOLED",
            imageUrl = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200",
            thumbnailUrl = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400",
            isFavorite = true
        ),
        WallpaperEntity(
            id = "w_space_01",
            title = "Event Horizon",
            category = "SPACE",
            imageUrl = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200",
            thumbnailUrl = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=400"
        ),
        WallpaperEntity(
            id = "w_minimal_01",
            title = "Singularity Geometric",
            category = "MINIMAL",
            imageUrl = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200",
            thumbnailUrl = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400"
        ),
        WallpaperEntity(
            id = "w_live_01",
            title = "Quantum Particles 60FPS",
            category = "LIVE",
            imageUrl = "",
            thumbnailUrl = "",
            isLiveWallpaper = true,
            liveEffectType = "PARTICLES"
        ),
        WallpaperEntity(
            id = "w_live_02",
            title = "Deep Galaxy Stars",
            category = "LIVE",
            imageUrl = "",
            thumbnailUrl = "",
            isLiveWallpaper = true,
            liveEffectType = "GALAXY"
        ),
        WallpaperEntity(
            id = "w_live_03",
            title = "AMOLED Neon Grid",
            category = "LIVE",
            imageUrl = "",
            thumbnailUrl = "",
            isLiveWallpaper = true,
            liveEffectType = "NEON_LINES"
        )
    )

    fun getAllWallpapers(): Flow<List<WallpaperEntity>> = wallpaperDao.getAllWallpapers()

    suspend fun seedInitialWallpapers() {
        wallpaperDao.insertWallpapers(sampleWallpapers)
    }

    suspend fun setWallpaper(bitmap: Bitmap, setHome: Boolean, setLock: Boolean): Boolean = withContext(Dispatchers.IO) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                var flags = 0
                if (setHome) flags = flags or WallpaperManager.FLAG_SYSTEM
                if (setLock) flags = flags or WallpaperManager.FLAG_LOCK
                wallpaperManager.setBitmap(bitmap, null, true, flags)
            } else {
                wallpaperManager.setBitmap(bitmap)
            }
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    fun openLiveWallpaperPicker() {
        try {
            val intent = Intent(WallpaperManager.ACTION_CHANGE_LIVE_WALLPAPER).apply {
                putExtra(
                    WallpaperManager.EXTRA_LIVE_WALLPAPER_COMPONENT,
                    ComponentName(context, AmoledLiveWallpaperService::class.java)
                )
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            val fallback = Intent(WallpaperManager.ACTION_LIVE_WALLPAPER_CHOOSER).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(fallback)
        }
    }
}
