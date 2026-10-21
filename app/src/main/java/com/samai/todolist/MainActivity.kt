package com.samai.todolist

import android.app.Activity
import android.os.Bundle
import android.graphics.Color
import android.view.Gravity
import android.widget.*
import android.content.Context
import org.json.JSONArray

class MainActivity : Activity() {
    private val tasks = mutableListOf<String>()
    private lateinit var list: LinearLayout
    private lateinit var input: EditText
    private val prefs by lazy { getSharedPreferences("todo", Context.MODE_PRIVATE) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        tasks.clear()
        val saved = prefs.getString("tasks", "[]") ?: "[]"
        val array = JSONArray(saved)
        for (i in 0 until array.length()) tasks.add(array.getString(i))

        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL; setPadding(24, 28, 24, 24)
            setBackgroundColor(Color.rgb(245, 248, 252))
        }
        root.addView(TextView(this).apply {
            text = "My To-Do List"; textSize = 26f; setTextColor(Color.rgb(30, 65, 120))
            gravity = Gravity.CENTER; setPadding(0, 0, 0, 18)
        })
        input = EditText(this).apply { hint = "Enter a task"; textSize = 16f }
        root.addView(input)
        root.addView(Button(this).apply {
            text = "Add Task"
            setOnClickListener {
                val value = input.text.toString().trim()
                if (value.isNotEmpty()) { tasks.add(value); input.text.clear(); saveTasks(); renderTasks() }
                else Toast.makeText(this@MainActivity, "Please enter a task", Toast.LENGTH_SHORT).show()
            }
        })
        root.addView(TextView(this).apply { text = "Tap a task to mark it complete. Use ✕ to delete."; textSize = 13f; setPadding(0, 10, 0, 10) })
        val scroll = ScrollView(this)
        list = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        scroll.addView(list)
        root.addView(scroll, LinearLayout.LayoutParams(-1, 0, 1f))
        setContentView(root)
        renderTasks()
    }

    private fun renderTasks() {
        list.removeAllViews()
        tasks.forEachIndexed { index, task ->
            val row = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL; gravity = Gravity.CENTER_VERTICAL }
            val text = TextView(this).apply {
                this.text = task; textSize = 17f; setPadding(8, 14, 8, 14)
                setTextColor(Color.DKGRAY)
                setOnClickListener {
                    this.text = "✓ $task"
                    setTextColor(Color.GRAY)
                }
            }
            row.addView(text, LinearLayout.LayoutParams(0, -2, 1f))
            row.addView(Button(this).apply {
                text = "✕"
                setOnClickListener { tasks.removeAt(index); saveTasks(); renderTasks() }
            })
            list.addView(row)
        }
        if (tasks.isEmpty()) list.addView(TextView(this).apply { text = "No tasks yet. Add your first task!"; textSize = 16f; setPadding(8, 20, 8, 20) })
    }

    private fun saveTasks() {
        val array = JSONArray()
        tasks.forEach { array.put(it) }
        prefs.edit().putString("tasks", array.toString()).apply()
    }
}