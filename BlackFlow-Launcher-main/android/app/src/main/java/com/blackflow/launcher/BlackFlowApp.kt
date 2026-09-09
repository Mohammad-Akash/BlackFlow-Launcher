package com.blackflow.launcher

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class BlackFlowApp : Application() {
    override fun onCreate() {
        super.onCreate()
    }
}
