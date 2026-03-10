import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import zhCN from 'date-fns/locale/zh-CN';

// API配置
const API_BASE_URL = 'http://localhost:18796/api';

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [loading, setLoading] = useState(false);

  // 获取日历网格
  const getCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  };

  // 获取某日任务
  const getTasksForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(task => task.date === dateStr);
  };

  // 加载任务
  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      const data = await response.json();
      if (data.tasks) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.log('API不可用，使用本地存储');
    }
    setLoading(false);
  };

  // 保存任务
  const saveTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDesc,
      date: format(selectedDate, 'yyyy-MM-dd'),
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setModalVisible(false);

    // 尝试同步到API
    try {
      await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
    } catch (error) {
      console.log('本地保存成功');
    }
  };

  // 完成任务
  const toggleTaskComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // 删除任务
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const calendarDays = getCalendarDays();
  const selectedTasks = getTasksForDate(selectedDate);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => setCurrentDate(subMonths(currentDate, 1))}>
        <Ionicons name="chevron-back" size={28} color="#4ecca3" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>
        {format(currentDate, 'yyyy年 MMMM', { locale: zhCN })}
      </Text>
      <TouchableOpacity onPress={() => setCurrentDate(addMonths(currentDate, 1))}>
        <Ionicons name="chevron-forward" size={28} color="#4ecca3" />
      </TouchableOpacity>
    </View>
  );

  const renderDays = () => {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return (
      <View style={styles.daysRow}>
        {days.map((day, index) => (
          <Text key={index} style={styles.dayText}>{day}</Text>
        ))}
      </View>
    );
  };

  const renderCells = () => (
    <View style={styles.cellsContainer}>
      {calendarDays.map((day, index) => {
        const isSelected = isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());
        const isCurrentMonth = isSameMonth(day, currentDate);
        const dayTasks = getTasksForDate(day);
        const hasTask = dayTasks.length > 0;

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.cell,
              isSelected && styles.selectedCell,
              isToday && styles.todayCell,
              !isCurrentMonth && styles.otherMonthCell
            ]}
            onPress={() => setSelectedDate(day)}
          >
            <Text style={[
              styles.cellText,
              isSelected && styles.selectedCellText,
              isToday && styles.todayCellText,
              !isCurrentMonth && styles.otherMonthText
            ]}>
              {format(day, 'd')}
            </Text>
            {hasTask && <View style={styles.taskDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderTaskList = () => (
    <View style={styles.taskList}>
      <Text style={styles.taskListTitle}>
        {format(selectedDate, 'MM月dd日')} 任务
      </Text>
      {selectedTasks.length === 0 ? (
        <Text style={styles.emptyText}>暂无任务</Text>
      ) : (
        selectedTasks.map(task => (
          <View key={task.id} style={styles.taskItem}>
            <TouchableOpacity 
              style={styles.taskCheck}
              onPress={() => toggleTaskComplete(task.id)}
            >
              <Ionicons 
                name={task.completed ? "checkbox" : "square-outline"} 
                size={24} 
                color={task.completed ? "#4ecca3" : "#666"} 
              />
            </TouchableOpacity>
            <View style={styles.taskContent}>
              <Text style={[
                styles.taskTitle,
                task.completed && styles.completedTask
              ]}>
                {task.title}
              </Text>
              {task.description && (
                <Text style={styles.taskDesc}>{task.description}</Text>
              )}
            </View>
            <TouchableOpacity 
              style={styles.deleteBtn}
              onPress={() => deleteTask(task.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#ff4757" />
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.titleBar}>
        <Text style={styles.appTitle}>📅 OpenClaw Calendar</Text>
        <Text style={styles.subtitle}>任务日历同步</Text>
      </View>

      <View style={styles.calendar}>
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </View>

      {renderTaskList()}

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>添加新任务</Text>
            <Text style={styles.modalDate}>
              {format(selectedDate, 'yyyy年MM月dd日')}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="任务标题"
              placeholderTextColor="#666"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="任务描述（可选）"
              placeholderTextColor="#666"
              value={newTaskDesc}
              onChangeText={setNewTaskDesc}
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={saveTask}
              >
                <Text style={styles.saveBtnText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  titleBar: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#16213e',
    borderBottomWidth: 1,
    borderBottomColor: '#4ecca3',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ecca3',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  calendar: {
    backgroundColor: '#16213e',
    paddingHorizontal: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  daysRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayText: {
    flex: 1,
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  cellsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCell: {
    backgroundColor: '#4ecca3',
    borderRadius: 20,
  },
  todayCell: {
    borderWidth: 2,
    borderColor: '#45b7d1',
    borderRadius: 20,
  },
  otherMonthCell: {
    opacity: 0.3,
  },
  cellText: {
    fontSize: 16,
    color: '#fff',
  },
  selectedCellText: {
    color: '#1a1a2e',
    fontWeight: 'bold',
  },
  todayCellText: {
    color: '#45b7d1',
  },
  otherMonthText: {
    color: '#666',
  },
  taskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ecca3',
    position: 'absolute',
    bottom: 8,
  },
  taskList: {
    flex: 1,
    padding: 20,
  },
  taskListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  taskCheck: {
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  taskDesc: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  deleteBtn: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4ecca3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#4ecca3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 25,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4ecca3',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalDate: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  modalBtn: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#333',
    marginRight: 10,
  },
  saveBtn: {
    backgroundColor: '#4ecca3',
    marginLeft: 10,
  },
  cancelBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtnText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '600',
  },
});
