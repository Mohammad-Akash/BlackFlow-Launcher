import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  FileCode,
  Download,
  Copy,
  Check,
  FolderTree,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Terminal
} from 'lucide-react';

interface AndroidFileItem {
  path: string;
  name: string;
  language: string;
  content: string;
}

export const AndroidProjectExplorer: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState('android/app/src/main/java/com/blackflow/launcher/ui/MainActivity.kt');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const files: AndroidFileItem[] = [
    {
      path: 'android/app/src/main/java/com/blackflow/launcher/ui/MainActivity.kt',
      name: 'MainActivity.kt',
      language: 'kotlin',
      content: `package com.blackflow.launcher.ui

import android.app.role.RoleManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.core.view.WindowCompat
import com.blackflow.launcher.ui.drawer.AppDrawerScreen
import com.blackflow.launcher.ui.home.HomeScreen
import com.blackflow.launcher.ui.lockscreen.LockScreenOverlay
import com.blackflow.launcher.ui.settings.SettingsScreen
import com.blackflow.launcher.ui.theme.AmoledBlack
import com.blackflow.launcher.ui.theme.BlackFlowLauncherTheme
import com.blackflow.launcher.ui.wallpaper.WallpaperMarketplaceScreen
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    private val requestRoleLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { _ -> /* Handle role callback */ }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        WindowCompat.setDecorFitsSystemWindows(window, false)

        setContent {
            BlackFlowLauncherTheme {
                var currentScreen by remember { mutableStateOf("home") }
                var isLocked by remember { mutableStateOf(false) }

                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(AmoledBlack)
                ) {
                    when (currentScreen) {
                        "home" -> HomeScreen(
                            onOpenDrawer = { currentScreen = "drawer" },
                            onOpenSettings = { currentScreen = "settings" },
                            onOpenWallpaperStore = { currentScreen = "wallpapers" },
                            onLockScreen = { isLocked = true }
                        )
                        "drawer" -> AppDrawerScreen(onClose = { currentScreen = "home" })
                        "wallpapers" -> WallpaperMarketplaceScreen(onClose = { currentScreen = "home" })
                        "settings" -> SettingsScreen(
                            onClose = { currentScreen = "home" },
                            onRequestDefaultLauncher = { requestDefaultLauncherRole() }
                        )
                    }

                    if (isLocked) {
                        LockScreenOverlay(
                            onUnlock = { isLocked = false },
                            activity = this@MainActivity
                        )
                    }
                }
            }
        }
    }

    fun requestDefaultLauncherRole() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val roleManager = getSystemService(Context.ROLE_SERVICE) as? RoleManager
            if (roleManager?.isRoleAvailable(RoleManager.ROLE_HOME) == true &&
                !roleManager.isRoleHeld(RoleManager.ROLE_HOME)
            ) {
                val intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_HOME)
                requestRoleLauncher.launch(intent)
                return
            }
        }
        val intent = Intent(Settings.ACTION_HOME_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        startActivity(intent)
    }
}`
    },
    {
      path: 'android/app/src/main/java/com/blackflow/launcher/service/AmoledLiveWallpaperService.kt',
      name: 'AmoledLiveWallpaperService.kt',
      language: 'kotlin',
      content: `package com.blackflow.launcher.service

import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.os.Handler
import android.os.Looper
import android.service.wallpaper.WallpaperService
import android.view.SurfaceHolder
import kotlin.random.Random

/**
 * High-performance 60FPS Canvas WallpaperService.
 * Shuts off pixel draw completely when device is asleep or covered.
 */
class AmoledLiveWallpaperService : WallpaperService() {

    override fun onCreateEngine(): Engine = AmoledEngine()

    inner class AmoledEngine : Engine() {
        private val handler = Handler(Looper.getMainLooper())
        private var visible = false
        private val fps = 60
        private val frameDuration = 1000L / fps
        private val particles = ArrayList<Particle>()
        private var width = 1080f
        private var height = 2400f

        private val backgroundPaint = Paint().apply {
            color = Color.BLACK
            style = Paint.Style.FILL
        }

        private val particlePaint = Paint().apply {
            color = Color.WHITE
            style = Paint.Style.FILL
            isAntiAlias = true
        }

        private val drawRunnable = object : Runnable {
            override fun run() {
                drawFrame()
                if (visible) handler.postDelayed(this, frameDuration)
            }
        }

        override fun onVisibilityChanged(v: Boolean) {
            visible = v
            if (v) handler.post(drawRunnable) else handler.removeCallbacks(drawRunnable)
        }

        private fun drawFrame() {
            val holder = surfaceHolder ?: return
            var canvas: Canvas? = null
            try {
                canvas = holder.lockCanvas()
                if (canvas != null) {
                    canvas.drawRect(0f, 0f, width, height, backgroundPaint)
                    for (p in particles) {
                        p.x += p.vx
                        p.y += p.vy
                        if (p.x < 0) p.x = width
                        if (p.x > width) p.x = 0f
                        if (p.y < 0) p.y = height
                        if (p.y > height) p.y = 0f
                        canvas.drawCircle(p.x, p.y, p.radius, particlePaint)
                    }
                }
            } finally {
                if (canvas != null) holder.unlockCanvasAndPost(canvas)
            }
        }
    }

    private data class Particle(var x: Float, var y: Float, var vx: Float, var vy: Float, val radius: Float)
}`
    },
    {
      path: 'android/app/src/main/AndroidManifest.xml',
      name: 'AndroidManifest.xml',
      language: 'xml',
      content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.SET_WALLPAPER" />
    <uses-permission android:name="android.permission.SET_WALLPAPER_HINTS" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />
    <uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" />

    <application
        android:name=".BlackFlowApp"
        android:label="BlackFlow Launcher"
        android:theme="@style/Theme.BlackFlowLauncher.NoActionBar">

        <!-- Android Home/Launcher Entry Point -->
        <activity
            android:name=".ui.MainActivity"
            android:exported="true"
            android:launchMode="singleTask">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.HOME" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- AMOLED Live Wallpaper Service -->
        <service
            android:name=".service.AmoledLiveWallpaperService"
            android:permission="android.permission.BIND_WALLPAPER"
            android:exported="true">
            <intent-filter>
                <action android:name="android.service.wallpaper.WallpaperService" />
            </intent-filter>
            <meta-data
                android:name="android.service.wallpaper"
                android:resource="@xml/wallpaper" />
        </service>
    </application>
</manifest>`
    },
    {
      path: 'android/app/src/main/java/com/blackflow/launcher/data/local/AppDatabase.kt',
      name: 'AppDatabase.kt',
      language: 'kotlin',
      content: `package com.blackflow.launcher.data.local

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
}`
    },
    {
      path: 'android/app/src/main/java/com/blackflow/launcher/data/repository/AppRepository.kt',
      name: 'AppRepository.kt',
      language: 'kotlin',
      content: `package com.blackflow.launcher.data.repository

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ResolveInfo
import com.blackflow.launcher.data.local.dao.AppDao
import com.blackflow.launcher.domain.model.AppInfo
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
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
        val resolveInfos = packageManager.queryIntentActivities(intent, 0)
        val apps = resolveInfos.map { resolveInfo ->
            AppInfo(
                packageName = resolveInfo.activityInfo.packageName,
                activityName = resolveInfo.activityInfo.name,
                label = resolveInfo.loadLabel(packageManager).toString(),
                icon = resolveInfo.loadIcon(packageManager)
            )
        }.sortedBy { it.label.lowercase() }
        emit(apps)
    }

    fun launchApp(packageName: String): Boolean {
        val launchIntent = packageManager.getLaunchIntentForPackage(packageName) ?: return false
        launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(launchIntent)
        return true
    }
}`
    },
    {
      path: 'android/app/build.gradle.kts',
      name: 'app/build.gradle.kts',
      language: 'kotlin',
      content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.hilt)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.blackflow.launcher"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.blackflow.launcher"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.hilt.navigation.compose)
    implementation(libs.androidx.datastore.preferences)
    implementation(libs.androidx.biometric)
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)
    implementation(libs.hilt.android)
    ksp(libs.hilt.compiler)
    implementation(libs.coil.compose)
}`
    },
    {
      path: 'android/README.md',
      name: 'README.md',
      language: 'markdown',
      content: `# BlackFlow Launcher (Android Studio Setup)

1. Open Android Studio (Ladybug / Iguana or newer).
2. Select "Open Project" and choose the \`android\` directory.
3. Allow Gradle to sync.
4. Run on an Android device or emulator with Shift + F10.
5. Set as default home launcher when prompted.`
    }
  ];

  const currentFile = files.find((f) => f.path === selectedFilePath) || files[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('BlackFlowLauncher-Android');

      // Add project files
      files.forEach((f) => {
        folder?.file(f.path.replace('android/', ''), f.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'BlackFlowLauncher-Android-Project.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error bundling project ZIP.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="w-full h-full bg-neutral-950 text-white flex flex-col md:flex-row overflow-hidden border border-neutral-850 rounded-2xl">
      {/* File Tree Sidebar */}
      <div className="w-full md:w-72 bg-neutral-950 border-r border-neutral-850 flex flex-col">
        <div className="p-4 border-b border-neutral-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderTree size={16} className="text-white" />
            <span className="text-xs font-mono font-bold tracking-wider">PROJECT FILES</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400">
            KOTLIN / COMPOSE
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs font-mono">
          {files.map((file) => {
            const isSelected = file.path === selectedFilePath;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFilePath(file.path)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 transition-colors ${
                  isSelected
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <FileCode size={14} className={isSelected ? 'text-white' : 'text-neutral-500'} />
                <span className="truncate">{file.name}</span>
              </button>
            );
          })}
        </div>

        {/* Download ZIP button */}
        <div className="p-3 border-t border-neutral-850">
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="w-full py-2.5 px-3 bg-white text-black font-semibold text-xs font-mono tracking-wider rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
          >
            <Download size={14} />
            <span>{isZipping ? 'PACKAGING ZIP...' : 'EXPORT PROJECT (.ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="flex-1 flex flex-col bg-[#000000] overflow-hidden">
        <div className="h-12 border-b border-neutral-850 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-300 truncate">
            <span className="text-neutral-500">path:</span>
            <span>{currentFile.path}</span>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-neutral-400 hover:text-white bg-neutral-900 rounded-md transition-colors"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <pre className="text-xs font-mono text-neutral-300 leading-relaxed whitespace-pre font-light">
            <code>{currentFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
