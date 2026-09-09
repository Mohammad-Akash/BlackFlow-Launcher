package com.blackflow.launcher.ui.wallpaper

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.blackflow.launcher.data.local.entities.WallpaperEntity
import com.blackflow.launcher.ui.theme.AmoledBlack
import com.blackflow.launcher.ui.theme.DarkSurfaceVariant
import com.blackflow.launcher.ui.theme.MutedGray
import com.blackflow.launcher.ui.theme.PureWhite

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WallpaperMarketplaceScreen(
    onClose: () -> Unit
) {
    var selectedTab by remember { mutableStateOf("AMOLED") }
    var selectedWallpaper by remember { mutableStateOf<WallpaperEntity?>(null) }

    val tabs = listOf(
        "FEATURED", "AMOLED", "ABSTRACT", "MINIMAL",
        "SPACE", "NATURE", "CARS", "ANIME", "DARK", "LIVE", "MY WALLPAPERS", "FAVORITES"
    )

    val sampleWallpapers = listOf(
        WallpaperEntity("w1", "Abyss Obsidian", "AMOLED", "", "", isFavorite = true),
        WallpaperEntity("w2", "Dark Matter Core", "AMOLED", "", ""),
        WallpaperEntity("w3", "Minimalist Monolith", "MINIMAL", "", ""),
        WallpaperEntity("w4", "Deep Horizon Pulsar", "SPACE", "", ""),
        WallpaperEntity("w5", "Vector Wireframe Grid", "ABSTRACT", "", ""),
        WallpaperEntity("w6", "Quantum Void 60FPS", "LIVE", "", isLiveWallpaper = true, liveEffectType = "PARTICLES")
    )

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
                .padding(horizontal = 18.dp)
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
                    text = "WALLPAPER HUB",
                    color = PureWhite,
                    fontSize = 17.sp,
                    fontWeight = FontWeight.SemiBold,
                    letterSpacing = 2.sp,
                    fontFamily = FontFamily.Monospace,
                    modifier = Modifier.padding(start = 8.dp)
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Tabs
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(tabs) { tab ->
                    val isSelected = selectedTab == tab
                    Box(
                        modifier = Modifier
                            .background(
                                if (isSelected) PureWhite else DarkSurfaceVariant,
                                shape = RoundedCornerShape(16.dp)
                            )
                            .clickable { selectedTab = tab }
                            .padding(horizontal = 14.dp, vertical = 7.dp)
                    ) {
                        Text(
                            text = tab,
                            color = if (isSelected) AmoledBlack else MutedGray,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Wallpapers Grid
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(14.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(sampleWallpapers) { wallpaper ->
                    Box(
                        modifier = Modifier
                            .height(240.dp)
                            .background(DarkSurfaceVariant, RoundedCornerShape(12.dp))
                            .clickable { selectedWallpaper = wallpaper }
                            .padding(12.dp),
                        contentAlignment = Alignment.BottomStart
                    ) {
                        Column {
                            if (wallpaper.isLiveWallpaper) {
                                Text(
                                    text = "LIVE 60FPS",
                                    color = PureWhite,
                                    fontSize = 10.sp,
                                    fontFamily = FontFamily.Monospace,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier
                                        .background(Color(0xFF00E5FF).copy(alpha = 0.3f), RoundedCornerShape(4.dp))
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                            }
                            Text(
                                text = wallpaper.title,
                                color = PureWhite,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Medium
                            )
                            Text(
                                text = wallpaper.category,
                                color = MutedGray,
                                fontSize = 11.sp,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                }
            }
        }

        // Full Screen Preview Dialog
        if (selectedWallpaper != null) {
            val wp = selectedWallpaper!!
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(AmoledBlack.copy(alpha = 0.95f))
                    .padding(24.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = wp.title,
                        color = PureWhite,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Light
                    )
                    Spacer(modifier = Modifier.height(24.dp))
                    Button(
                        onClick = { selectedWallpaper = null },
                        colors = ButtonDefaults.buttonColors(containerColor = PureWhite)
                    ) {
                        Text("SET AS HOME & LOCK SCREEN", color = AmoledBlack)
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    TextButton(onClick = { selectedWallpaper = null }) {
                        Text("CANCEL", color = MutedGray)
                    }
                }
            }
        }
    }
}
