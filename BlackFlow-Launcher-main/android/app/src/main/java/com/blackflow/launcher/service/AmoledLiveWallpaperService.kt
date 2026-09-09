package com.blackflow.launcher.service

import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.os.Handler
import android.os.Looper
import android.service.wallpaper.WallpaperService
import android.view.SurfaceHolder
import kotlin.random.Random

class AmoledLiveWallpaperService : WallpaperService() {

    override fun onCreateEngine(): Engine {
        return AmoledEngine()
    }

    inner class AmoledEngine : Engine() {
        private val handler = Handler(Looper.getMainLooper())
        private var visible = false
        private val fps = 60
        private val frameDuration = 1000L / fps

        // Particle system
        private val particleCount = 45
        private val particles = ArrayList<Particle>()
        private var width = 1080f
        private var height = 2400f

        private val backgroundPaint = Paint().apply {
            color = Color.BLACK // Pure AMOLED #000000
            style = Paint.Style.FILL
        }

        private val particlePaint = Paint().apply {
            color = Color.WHITE
            style = Paint.Style.FILL
            isAntiAlias = true
        }

        private val linePaint = Paint().apply {
            color = Color.argb(40, 255, 255, 255)
            strokeWidth = 1.2f
            style = Paint.Style.STROKE
            isAntiAlias = true
        }

        private val drawRunnable = object : Runnable {
            override fun run() {
                drawFrame()
                if (visible) {
                    handler.postDelayed(this, frameDuration)
                }
            }
        }

        override fun onSurfaceChanged(holder: SurfaceHolder?, format: Int, w: Int, h: Int) {
            super.onSurfaceChanged(holder, format, w, h)
            width = w.toFloat()
            height = h.toFloat()
            initParticles()
        }

        override fun onVisibilityChanged(v: Boolean) {
            visible = v
            if (v) {
                handler.post(drawRunnable)
            } else {
                handler.removeCallbacks(drawRunnable)
            }
        }

        override fun onDestroy() {
            super.onDestroy()
            handler.removeCallbacks(drawRunnable)
        }

        private fun initParticles() {
            particles.clear()
            for (i in 0 until particleCount) {
                particles.add(
                    Particle(
                        x = Random.nextFloat() * width,
                        y = Random.nextFloat() * height,
                        vx = (Random.nextFloat() - 0.5f) * 1.5f,
                        vy = (Random.nextFloat() - 0.5f) * 1.5f,
                        radius = Random.nextFloat() * 2.2f + 1.2f,
                        alpha = Random.nextInt(70, 220)
                    )
                )
            }
        }

        private fun drawFrame() {
            val holder = surfaceHolder ?: return
            var canvas: Canvas? = null
            try {
                canvas = holder.lockCanvas()
                if (canvas != null) {
                    // 1. Draw pure black AMOLED background
                    canvas.drawRect(0f, 0f, width, height, backgroundPaint)

                    // 2. Update and draw particles & subtle constellation lines
                    for (i in particles.indices) {
                        val p = particles[i]
                        p.x += p.vx
                        p.y += p.vy

                        // Wrap edges
                        if (p.x < 0) p.x = width
                        if (p.x > width) p.x = 0f
                        if (p.y < 0) p.y = height
                        if (p.y > height) p.y = 0f

                        particlePaint.color = Color.argb(p.alpha, 255, 255, 255)
                        canvas.drawCircle(p.x, p.y, p.radius, particlePaint)

                        // Connect close particles with delicate lines
                        for (j in i + 1 until particles.size) {
                            val p2 = particles[j]
                            val dx = p.x - p2.x
                            val dy = p.y - p2.y
                            val dist = Math.sqrt((dx * dx + dy * dy).toDouble()).toFloat()
                            if (dist < 150f) {
                                val lineAlpha = ((1f - dist / 150f) * 55).toInt()
                                linePaint.color = Color.argb(lineAlpha, 255, 255, 255)
                                canvas.drawLine(p.x, p.y, p2.x, p2.y, linePaint)
                            }
                        }
                    }
                }
            } finally {
                if (canvas != null) {
                    holder.unlockCanvasAndPost(canvas)
                }
            }
        }
    }

    private data class Particle(
        var x: Float,
        var y: Float,
        var vx: Float,
        var vy: Float,
        val radius: Float,
        val alpha: Int
    )
}
