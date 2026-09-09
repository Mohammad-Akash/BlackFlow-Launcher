package com.blackflow.launcher.ui.themeeditor

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.blackflow.launcher.ui.theme.AmoledBlack
import com.blackflow.launcher.ui.theme.DarkSurfaceVariant
import com.blackflow.launcher.ui.theme.MutedGray
import com.blackflow.launcher.ui.theme.PureWhite

@Composable
fun ThemeEditorScreen(
    onClose: () -> Unit
) {
    var selectedSection by remember { mutableStateOf("ICONS") }
    var iconStyle by remember { mutableStateOf("OUTLINE") }
    var clockStyle by remember { mutableStateOf("MINIMAL_DIGITAL") }
    var labelVisibility by remember { mutableStateOf(false) }

    val sections = listOf(
        "HOME SCREEN", "LOCK SCREEN", "ICONS", "WALLPAPER",
        "CLOCK", "WIDGETS", "FONTS", "GESTURES"
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
                .padding(horizontal = 20.dp)
        ) {
            Spacer(modifier = Modifier.height(14.dp))

            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onClose) {
                        Icon(
                            imageVector = Icons.Outlined.ArrowBack,
                            contentDescription = "Back",
                            tint = PureWhite
                        )
                    }
                    Text(
                        text = "THEME STUDIO",
                        color = PureWhite,
                        fontSize = 17.sp,
                        fontWeight = FontWeight.SemiBold,
                        letterSpacing = 2.sp,
                        fontFamily = FontFamily.Monospace
                    )
                }

                TextButton(onClick = { /* Export/Save JSON */ }) {
                    Text("SAVE", color = PureWhite, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Interactive Editor Controls
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                item {
                    Text(
                        text = "ICON ENGINE STYLE",
                        color = MutedGray,
                        fontSize = 12.sp,
                        letterSpacing = 1.5.sp,
                        fontFamily = FontFamily.Monospace
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    listOf("OUTLINE (AMOLED DEFAULT)", "FILLED MONOCHROME", "THIN LINE VECTOR", "ROUNDED MINIMAL").forEach { style ->
                        val isSelected = iconStyle == style
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                                .background(if (isSelected) DarkSurfaceVariant else AmoledBlack, RoundedCornerShape(8.dp))
                                .clickable { iconStyle = style }
                                .padding(14.dp)
                        ) {
                            Text(
                                text = style,
                                color = if (isSelected) PureWhite else MutedGray,
                                fontSize = 13.sp,
                                fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
                            )
                        }
                    }
                }

                item {
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "FUTURISTIC CLOCK STYLE",
                        color = MutedGray,
                        fontSize = 12.sp,
                        letterSpacing = 1.5.sp,
                        fontFamily = FontFamily.Monospace
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    listOf("MINIMAL DIGITAL (HH:MM)", "CYBER MONOSPACE", "DUAL LINE VERTICAL", "MATRIX GLYPH").forEach { style ->
                        val isSelected = clockStyle == style
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                                .background(if (isSelected) DarkSurfaceVariant else AmoledBlack, RoundedCornerShape(8.dp))
                                .clickable { clockStyle = style }
                                .padding(14.dp)
                        ) {
                            Text(
                                text = style,
                                color = if (isSelected) PureWhite else MutedGray,
                                fontSize = 13.sp,
                                fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
                            )
                        }
                    }
                }

                item {
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = onClose,
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = PureWhite)
                    ) {
                        Text("APPLY THEME TO SYSTEM", color = AmoledBlack, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
