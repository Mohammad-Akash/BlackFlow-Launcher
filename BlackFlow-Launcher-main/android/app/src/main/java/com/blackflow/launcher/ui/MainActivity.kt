package com.blackflow.launcher.ui

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
import com.blackflow.launcher.ui.onboarding.OnboardingScreen
import com.blackflow.launcher.ui.settings.SettingsScreen
import com.blackflow.launcher.ui.theme.AmoledBlack
import com.blackflow.launcher.ui.theme.BlackFlowLauncherTheme
import com.blackflow.launcher.ui.themeeditor.ThemeEditorScreen
import com.blackflow.launcher.ui.wallpaper.WallpaperMarketplaceScreen
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    private val requestRoleLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { _ ->
        // Role result handled
    }

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
                        "onboarding" -> {
                            OnboardingScreen(
                                onSetDefaultLauncher = { requestDefaultLauncherRole() },
                                onFinishOnboarding = { currentScreen = "home" }
                            )
                        }
                        "home" -> {
                            HomeScreen(
                                onOpenDrawer = { currentScreen = "drawer" },
                                onOpenSettings = { currentScreen = "settings" },
                                onOpenWallpaperStore = { currentScreen = "wallpapers" },
                                onOpenThemeEditor = { currentScreen = "theme_editor" },
                                onLockScreen = { isLocked = true }
                            )
                        }
                        "drawer" -> {
                            AppDrawerScreen(
                                onClose = { currentScreen = "home" },
                                onOpenSettings = { currentScreen = "settings" }
                            )
                        }
                        "wallpapers" -> {
                            WallpaperMarketplaceScreen(
                                onClose = { currentScreen = "home" }
                            )
                        }
                        "theme_editor" -> {
                            ThemeEditorScreen(
                                onClose = { currentScreen = "home" }
                            )
                        }
                        "settings" -> {
                            SettingsScreen(
                                onClose = { currentScreen = "home" },
                                onRequestDefaultLauncher = { requestDefaultLauncherRole() }
                            )
                        }
                    }

                    // Secure lock screen overlay
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
        // Fallback for earlier Android versions or when role manager is unavailable
        val intent = Intent(Settings.ACTION_HOME_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        startActivity(intent)
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        // As a Home launcher, back press always returns to the primary home page
        // rather than exiting the application
    }
}
