-- Создание таблицы пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы доступных привычек (библиотека)
CREATE TABLE routine_templates (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    category VARCHAR(50) NOT NULL,
    emoji VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы пользовательских привычек
CREATE TABLE user_habits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    template_id INTEGER REFERENCES routine_templates(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    category VARCHAR(50) NOT NULL,
    streak INTEGER DEFAULT 0,
    last_completed_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы выполнения привычек
CREATE TABLE habit_completions (
    id SERIAL PRIMARY KEY,
    habit_id INTEGER REFERENCES user_habits(id),
    user_id INTEGER REFERENCES users(id),
    completion_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(habit_id, completion_date)
);

-- Создание индексов для оптимизации
CREATE INDEX idx_user_habits_user_id ON user_habits(user_id);
CREATE INDEX idx_habit_completions_user_id ON habit_completions(user_id);
CREATE INDEX idx_habit_completions_date ON habit_completions(completion_date);
CREATE INDEX idx_users_email ON users(email);