-- Добавление поля для кода восстановления пароля
ALTER TABLE t_p99956164_routine_planner_app.users 
ADD COLUMN reset_code VARCHAR(10) NULL;