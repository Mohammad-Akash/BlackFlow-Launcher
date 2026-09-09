package com.blackflow.launcher.ui.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.blackflow.launcher.ui.theme.AmoledBlack
import com.blackflow.launcher.ui.theme.DarkSurfaceVariant
import com.blackflow.launcher.ui.theme.MutedGray
import com.blackflow.launcher.ui.theme.PureWhite

@Composable
fun SettingsScreen(
    onClose: () -> Unit,
    onRequestDefaultLauncher: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(AmoledBlack)
            .statusBarsPadding()
            .navigationBarsPadding()
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp)
        ) {
            Spacer(modifier = Modifier.height(14.dp))

            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onClose) {
                    Icon(
                        imageVector = Icons.Outlined.ArrowBack,
                        contentDescription = "Back",
                        tint = PureWhite
                    )
                }
                Text(
                    text = "SETTINGS",
                    color = PureWhite,
                    fontSize = 17.sp,
                    fontWeight = FontWeight.SemiBold,
                    letterSpacing = 2.sp,
                    fontFamily = FontFamily.Monospace,
                    modifier = Modifier.padding(start = 8.dp)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                item {
                    SettingsActionItem(
                        icon = Icons.Outlined.Home,
                        title = "Set as Default Launcher",
                        subtitle = "Request system Home role (Android 10+ / 14 / 15)",
                        onClick = onRequestDefaultLauncher
                    )
                }

                item {
                    SettingsCategoryHeader("APPEARANCE")
                    SettingsItem(Icons.Outlined.Palette, "Theme & Accent", "AMOLED Obsidian #000000")
                    SettingsItem(Icons.Outlined.GridView, "Desktop Grid", "4 x 6 (Optimized)")
                    SettingsItem(Icons.Outlined.TextFields, "Icon Labels", "Disabled (Ultra-Minimal)")
                    SettingsItem(Icons.Outlined.Speed, "Refresh Rate", "120Hz Smooth Display")
                }

                item {
                    SettingsCategoryHeader("GESTURES")
                    SettingsItem(Icons.Outlined.SwipeUp, "Swipe Up", "Open App Drawer")
                    SettingsItem(Icons.Outlined.SwipeDown, "Swipe Down", "Notifications & Search")
                    SettingsItem(Icons.Outlined.TouchApp, "Double Tap", "Lock Screen (Biometric)")
                    SettingsItem(Icons.Outlined.Pinch, "Pinch In/Out", "Launcher Settings")
                }

                item {
                    SettingsCategoryHeader("SYSTEM & ABOUT")
                    SettingsItem(Icons.Outlined.Info, "BlackFlow Launcher", "v1.0.0 (Production Build)")
                    SettingsItem(Icons.Outlined.Security, "Privacy & Offline Mode", "100% Offline • No Telemetry")
                    SettingsItem(Icons.Outlined.Code, "Open Source Licenses", "Apache 2.0")
                }
            }
        }
    }
}

@Composable
fun SettingsCategoryHeader(title: String) {
    Text(
        text = title,
        color = MutedGray,
        fontSize = 11.sp,
        fontWeight = FontWeight.Bold,
        letterSpacing = 2.sp,
        fontFamily = FontFamily.Monospace,
        modifier = Modifier.padding(top = 18.dp, bottom = 8.dp)
    )
}

@Composable
fun SettingsItem(
    icon: ImageVector,
    title: String,
    subtitle: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { }
            .padding(vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = title,
            tint = PureWhite,
            modifier = Modifier.size(22.dp)
        )
        Spacer(modifier = Modifier.width(16.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(text = title, color = PureWhite, fontSize = 14.sp)
            Text(text = subtitle, color = MutedGray, fontSize = 12.sp)
        }
    }
}

@Composable
fun SettingsActionItem(
    icon: ImageVector,
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(DarkSurfaceVariant, androidx.compose.foundation.shape.RoundedCornerShape(12.dp))
            .clickable(onClick = onClick)
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = title,
            tint = PureWhite,
            modifier = Modifier.size(24.dp)
        )
        Spacer(modifier = Modifier.width(16.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(text = title, color = PureWhite, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
            Text(text = subtitle, color = MutedGray, fontSize = 12.sp)
        }
        Icon(
            imageVector = Icons.Outlined.ChevronRight,
            contentDescription = "Go",
            tint = MutedGray,
            modifier = Modifier.size(20.dp)
        )
    }
}
