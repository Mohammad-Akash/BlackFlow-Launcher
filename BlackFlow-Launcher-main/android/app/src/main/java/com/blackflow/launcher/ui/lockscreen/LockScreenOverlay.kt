package com.blackflow.launcher.ui.lockscreen

import androidx.biometric.BiometricPrompt
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.draggable
import androidx.compose.foundation.gestures.rememberDraggableState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import com.blackflow.launcher.ui.theme.AmoledBlack
import com.blackflow.launcher.ui.theme.DarkSurfaceVariant
import com.blackflow.launcher.ui.theme.MutedGray
import com.blackflow.launcher.ui.theme.PureWhite
import java.text.SimpleDateFormat
import java.util.*
import kotlin.math.roundToInt

@Composable
fun LockScreenOverlay(
    onUnlock: () -> Unit,
    activity: Any? = null
) {
    var offsetY by remember { mutableStateOf(0f) }
    val maxDragDistance = -300f

    val timeString = remember {
        SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date())
    }
    val dateString = remember {
        SimpleDateFormat("EEEE, MMMM d", Locale.getDefault()).format(Date()).uppercase()
    }

    // Biometric prompt trigger if running on Android device
    fun triggerBiometric() {
        if (activity is FragmentActivity) {
            val executor = ContextCompat.getMainExecutor(activity)
            val biometricPrompt = BiometricPrompt(
                activity,
                executor,
                object : BiometricPrompt.AuthenticationCallback() {
                    override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                        onUnlock()
                    }
                }
            )
            val promptInfo = BiometricPrompt.PromptInfo.Builder()
                .setTitle("BlackFlow AMOLED Security")
                .setSubtitle("Authenticate to unlock launcher")
                .setNegativeButtonText("Use PIN")
                .build()
            try {
                biometricPrompt.authenticate(promptInfo)
            } catch (e: Exception) {
                // If biometric hardware unavailable, unlock directly
                onUnlock()
            }
        } else {
            onUnlock()
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .offset { IntOffset(0, offsetY.roundToInt()) }
            .draggable(
                state = rememberDraggableState { delta ->
                    val newOffset = offsetY + delta
                    if (newOffset <= 0f) {
                        offsetY = newOffset
                        if (offsetY < maxDragDistance) {
                            onUnlock()
                        }
                    }
                },
                orientation = Orientation.Vertical,
                onDragStopped = {
                    if (offsetY >= maxDragDistance) {
                        offsetY = 0f
                    }
                }
            )
            .background(AmoledBlack)
            .statusBarsPadding()
            .navigationBarsPadding()
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Top Status / Battery
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Outlined.CloudQueue,
                        contentDescription = "Weather",
                        tint = MutedGray,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "21°C Clear",
                        color = MutedGray,
                        fontSize = 12.sp,
                        fontFamily = FontFamily.Monospace
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Outlined.BatteryChargingFull,
                        contentDescription = "Battery",
                        tint = PureWhite,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "88% • Fast Charging",
                        color = PureWhite,
                        fontSize = 12.sp,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }

            // Big Futuristic Clock
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = timeString,
                    color = PureWhite,
                    fontSize = 82.sp,
                    fontWeight = FontWeight.ExtraLight,
                    letterSpacing = (-3).sp,
                    fontFamily = FontFamily.SansSerif
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = dateString,
                    color = MutedGray,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Normal,
                    letterSpacing = 2.sp,
                    fontFamily = FontFamily.Monospace
                )
            }

            // Notification Sample Card
            Box(
                modifier = Modifier
                    .fillMaxWidth(0.9f)
                    .background(DarkSurfaceVariant, RoundedCornerShape(14.dp))
                    .padding(horizontal = 16.dp, vertical = 12.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Outlined.MarkChatUnread,
                        contentDescription = "Notification",
                        tint = PureWhite,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "BlackFlow Kernel",
                            color = PureWhite,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            text = "AMOLED Black System Optimization Active (60/120Hz)",
                            color = MutedGray,
                            fontSize = 11.sp
                        )
                    }
                }
            }

            // Bottom Biometric / Swipe Unlock
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.padding(bottom = 16.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(60.dp)
                        .background(Color.White.copy(alpha = 0.08f), CircleShape)
                        .clickable { triggerBiometric() },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Outlined.Fingerprint,
                        contentDescription = "Fingerprint",
                        tint = PureWhite,
                        modifier = Modifier.size(32.dp)
                    )
                }
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "SWIPE UP TO UNLOCK",
                    color = MutedGray,
                    fontSize = 11.sp,
                    letterSpacing = 3.sp,
                    fontFamily = FontFamily.Monospace
                )
            }
        }
    }
}
