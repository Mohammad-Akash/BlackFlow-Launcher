package com.blackflow.launcher.di

import android.content.Context
import androidx.room.Room
import com.blackflow.launcher.data.local.AppDatabase
import com.blackflow.launcher.data.local.dao.*
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideAppDatabase(@ApplicationContext context: Context): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "blackflow_launcher.db"
        ).fallbackToDestructiveMigration().build()
    }

    @Provides
    fun provideAppDao(database: AppDatabase): AppDao = database.appDao()

    @Provides
    fun provideWallpaperDao(database: AppDatabase): WallpaperDao = database.wallpaperDao()

    @Provides
    fun provideThemeDao(database: AppDatabase): ThemeDao = database.themeDao()
}
