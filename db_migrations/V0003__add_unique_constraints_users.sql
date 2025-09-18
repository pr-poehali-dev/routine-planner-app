-- Добавление уникальных индексов для email и username
ALTER TABLE t_p99956164_routine_planner_app.users 
ADD CONSTRAINT users_email_unique UNIQUE (email);

ALTER TABLE t_p99956164_routine_planner_app.users 
ADD CONSTRAINT users_username_unique UNIQUE (username);