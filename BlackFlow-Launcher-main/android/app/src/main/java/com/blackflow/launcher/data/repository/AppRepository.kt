package com.blackflow.launcher.data.repository

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ResolveInfo
import com.blackflow.launcher.data.local.dao.AppDao
import com.blackflow.launcher.data.local.entities.AppSettingsEntity
import com.blackflow.launcher.domain.model.AppInfo
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AppRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val appDao: AppDao
) {
    private val packageManager: PackageManager = context.packageManager

    fun getInstalledApps(): Flow<List<AppInfo>> = flow {
        val intent = Intent(Intent.ACTION_MAIN, null).apply {
            addCategory(Intent.CATEGORY_LAUNCHER)
        }
        val resolveInfos: List<ResolveInfo> = packageManager.queryIntentActivities(intent, 0)
        val apps = resolveInfos.map { resolveInfo ->
            val pkg = resolveInfo.activityInfo.packageName
            val act = resolveInfo.activityInfo.name
            val label = resolveInfo.loadLabel(packageManager).toString()
            val icon = resolveInfo.loadIcon(packageManager)
            
            val category = when {
                pkg.contains("camera") || pkg.contains("gallery") || pkg.contains("media") || pkg.contains("photos") -> "MEDIA"
                pkg.contains("message") || pkg.contains("dialer") || pkg.contains("contacts") || pkg.contains("whatsapp") || pkg.contains("telegram") -> "SOCIAL"
                pkg.contains("chrome") || pkg.contains("browser") || pkg.contains("firefox") -> "WEB"
                pkg.contains("settings") || pkg.contains("calculator") || pkg.contains("clock") || pkg.contains("calendar") -> "SYSTEM"
                pkg.contains("git") || pkg.contains("term") || pkg.contains("dev") || pkg.contains("code") -> "DEVELOPER"
                else -> "TOOLS"
            }

            AppInfo(
                packageName = pkg,
                activityName = act,
                label = label,
                icon = icon,
                category = category
            )
        }.sortedBy { it.label.lowercase() }
        emit(apps)
    }.flowOn(Dispatchers.IO)

    fun launchApp(packageName: String, activityName: String? = null): Boolean {
        return try {
            val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
            if (launchIntent != null) {
                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(launchIntent)
                true
            } else false
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    fun getAppSettings(): Flow<AppSettingsEntity?> = appDao.getAppSettings()

    suspend fun saveAppSettings(settings: AppSettingsEntity) = appDao.saveAppSettings(settings)
}
