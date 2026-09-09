package com.blackflow.launcher.ui.home

import android.os.Build
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.blackflow.launcher.domain.model.AppInfo
import com.blackflow.launcher.ui.theme.AmoledBlack
import com.blackflow.launcher.ui.theme.MutedGray
import com.blackflow.launcher.ui.theme.PureWhite
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun HomeScreen(
    homeViewModel: HomeViewModel = hiltViewModel(),
    onOpenDrawer: () -> Unit,
    onOpenSettings: () -> Unit,
    onOpenWallpaperStore: () -> Unit,
    onOpenThemeEditor: () -> Unit,
    onLockScreen: () -> Unit
) {
    val settings by homeViewModel.appSettings.collectAsState()
    val apps by homeViewModel.installedApps.collectAsState()
    var isEditMode by remember { mutableStateOf(false) }

    val currentTime = remember {
        val format = SimpleDateFormat("HH:mm", Locale.getDefault())
        format.format(Date())
    }
    val currentDate = remember {
        val format = SimpleDateFormat("EEE, d MMM", Locale.getDefault())
        format.format(Date()).uppercase()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(AmoledBlack)
            .statusBarsPadding()
            .navigationBarsPadding()
            .pointerInput(Unit) {
                detectTapGestures(
                    onDoubleTap = { onLockScreen() },
                    onLongPress = { isEditMode = !isEditMode }
                )
            }
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(28.dp))

            // Minimal Clock & Search bar header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column {
                    Text(
                        text = currentTime,
                        color = PureWhite,
                        fontSize = 54.sp,
                        fontWeight = FontWeight.ExtraLight,
                        letterSpacing = (-1.5).sp,
                        fontFamily = FontFamily.SansSerif
                    )
                    Text(
                        text = currentDate,
                        color = MutedGray,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        letterSpacing = 2.sp,
                        fontFamily = FontFamily.Monospace
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onOpenDrawer) {
                        Icon(
                            imageVector = Icons.Outlined.Search,
                            contentDescription = "Search",
                            tint = PureWhite,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    IconButton(onClick = onOpenSettings) {
                        Icon(
                            imageVector = Icons.Outlined.Settings,
                            contentDescription = "Settings",
                            tint = PureWhite,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(36.dp))

            // Grid of monochrome outlined application icons
            val gridColumns = settings.gridColumns.coerceIn(3, 6)
            LazyVerticalGrid(
                columns = GridCells.Fixed(gridColumns),
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(22.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(apps.take(settings.gridRows * gridColumns)) { app ->
                    MonochromeAppItem(
                        app = app,
                        showLabel = settings.showLabels,
                        onClick = { homeViewModel.launchApp(app.packageName) }
                    )
                }
            }

            // Quick Dock / Drawer indicator
            Box(
                modifier = Modifier
                    .padding(bottom = 12.dp)
                    .size(width = 44.dp, height = 4.dp)
                    .background(Color.White.copy(alpha = 0.35f), CircleShape)
                    .clickable { onOpenDrawer() }
            )
        }
    }
}

@Composable
fun MonochromeAppItem(
    app: AppInfo,
    showLabel: Boolean,
    onClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clickable(onClick = onClick)
            .padding(4.dp)
    ) {
        Box(
            modifier = Modifier
                .size(54.dp)
                .background(AmoledBlack, shape = CircleShape)
                .padding(2.dp),
            contentAlignment = Alignment.Center
        ) {
            // High contrast white stroke icon
            Icon(
                imageVector = Icons.Outlined.Apps,
                contentDescription = app.label,
                tint = PureWhite,
                modifier = Modifier.size(30.dp)
            )
        }

        if (showLabel) {
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = app.label,
                color = PureWhite.copy(alpha = 0.85f),
                fontSize = 11.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                textAlign = TextAlign.Center
            )
        }
    }
}
