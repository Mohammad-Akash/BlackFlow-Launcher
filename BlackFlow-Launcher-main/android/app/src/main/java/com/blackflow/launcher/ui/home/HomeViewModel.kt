package com.blackflow.launcher.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.blackflow.launcher.data.local.entities.AppSettingsEntity
import com.blackflow.launcher.data.repository.AppRepository
import com.blackflow.launcher.domain.model.AppInfo
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val appRepository: AppRepository
) : ViewModel() {

    val appSettings: StateFlow<AppSettingsEntity> = appRepository.getAppSettings()
        .map { it ?: AppSettingsEntity() }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), AppSettingsEntity())

    val installedApps: StateFlow<List<AppInfo>> = appRepository.getInstalledApps()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun launchApp(packageName: String): Boolean {
        return appRepository.launchApp(packageName)
    }

    fun updateGrid(rows: Int, cols: Int) {
        viewModelScope.launch {
            val current = appSettings.value
            appRepository.saveAppSettings(current.copy(gridRows = rows, gridColumns = cols))
        }
    }

    fun toggleLabels(show: Boolean) {
        viewModelScope.launch {
            val current = appSettings.value
            appRepository.saveAppSettings(current.copy(showLabels = show))
        }
    }
}
