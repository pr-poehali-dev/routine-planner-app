import json
import os
import hashlib
import jwt
import datetime
from typing import Dict, Any, Optional
import psycopg2

def escape_sql_string(value: str) -> str:
    '''Экранирование одинарных кавычек для SQL'''
    return value.replace("'", "''")

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Авторизация пользователей - регистрация, вход, проверка токенов
    Args: event - dict с httpMethod, body, headers
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response с JWT токеном или ошибкой
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    # CORS headers for all responses
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }
    
    try:
        # Получение переменных окружения
        database_url = os.environ.get('DATABASE_URL')
        jwt_secret = os.environ.get('JWT_SECRET')
        
        if not database_url or not jwt_secret:
            return {
                'statusCode': 500,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Server configuration error'})
            }
        
        # Подключение к базе данных
        conn = psycopg2.connect(database_url)
        try:
            cur = conn.cursor()
            
            if method == 'POST':
                body_data = json.loads(event.get('body', '{}'))
                action = body_data.get('action')
                
                if action == 'register':
                    return handle_register(cur, conn, body_data, jwt_secret, cors_headers)
                elif action == 'login':
                    return handle_login(cur, body_data, jwt_secret, cors_headers)
                elif action == 'verify':
                    return handle_verify_token(body_data, jwt_secret, cors_headers)
                elif action == 'reset_password':
                    return handle_reset_password(cur, conn, body_data, cors_headers)
                elif action == 'confirm_reset':
                    return handle_confirm_reset(cur, conn, body_data, cors_headers)
                
                return {
                    'statusCode': 400,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Invalid action'})
                }
            
            elif method == 'GET':
                # Проверка токена из заголовка Authorization
                auth_header = event.get('headers', {}).get('authorization', '')
                if not auth_header.startswith('Bearer '):
                    return {
                        'statusCode': 401,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Missing or invalid token'})
                    }
                
                token = auth_header[7:]  # Remove "Bearer " prefix
                
                try:
                    payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
                    user_id = payload.get('user_id')
                    
                    # Получение данных пользователя
                    cur.execute(f"SELECT id, email, username FROM t_p99956164_routine_planner_app.users WHERE id = {user_id}")
                    user = cur.fetchone()
                    
                    if not user:
                        return {
                            'statusCode': 401,
                            'headers': cors_headers,
                            'body': json.dumps({'error': 'User not found'})
                        }
                    
                    return {
                        'statusCode': 200,
                        'headers': cors_headers,
                        'body': json.dumps({
                            'user': {
                                'id': user[0],
                                'email': user[1],
                                'username': user[2]
                            }
                        })
                    }
                    
                except jwt.ExpiredSignatureError:
                    return {
                        'statusCode': 401,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Token expired'})
                    }
                except jwt.InvalidTokenError:
                    return {
                        'statusCode': 401,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Invalid token'})
                    }
            
            return {
                'statusCode': 405,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Method not allowed'})
            }
            
        finally:
            cur.close()
            conn.close()
                
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({'error': f'Server error: {str(e)}'})
        }

def handle_register(cur, conn, body_data: Dict[str, Any], jwt_secret: str, cors_headers: Dict[str, str]) -> Dict[str, Any]:
    '''Регистрация нового пользователя'''
    email = body_data.get('email', '').strip().lower()
    password = body_data.get('password', '')
    username = body_data.get('username', '').strip()
    
    if not email or not password or not username:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Email, password, and username are required'})
        }
    
    if len(password) < 6:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Password must be at least 6 characters long'})
        }
    
    # Проверка на существование пользователя по email
    cur.execute(f"SELECT id FROM t_p99956164_routine_planner_app.users WHERE email = '{escape_sql_string(email)}'")
    if cur.fetchone():
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Пользователь с таким email уже существует'})
        }
    
    # Проверка на существование пользователя по username
    cur.execute(f"SELECT id FROM t_p99956164_routine_planner_app.users WHERE username = '{escape_sql_string(username)}'")
    if cur.fetchone():
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Пользователь с таким именем уже существует'})
        }
    
    # Хеширование пароля
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    # Создание пользователя
    cur.execute(
        f"INSERT INTO t_p99956164_routine_planner_app.users (email, password_hash, username) VALUES ('{escape_sql_string(email)}', '{password_hash}', '{escape_sql_string(username)}') RETURNING id"
    )
    user_id = cur.fetchone()[0]
    conn.commit()
    
    # Создание JWT токена
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
    }
    token = jwt.encode(payload, jwt_secret, algorithm='HS256')
    
    return {
        'statusCode': 201,
        'headers': cors_headers,
        'body': json.dumps({
            'message': 'User registered successfully',
            'token': token,
            'user': {
                'id': user_id,
                'email': email,
                'username': username
            }
        })
    }

def handle_login(cur, body_data: Dict[str, Any], jwt_secret: str, cors_headers: Dict[str, str]) -> Dict[str, Any]:
    '''Вход пользователя по email или username'''
    login_field = body_data.get('email', '').strip()  # Теперь может быть email или username
    password = body_data.get('password', '')
    
    if not login_field or not password:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Логин и пароль обязательны'})
        }
    
    # Поиск пользователя по email или username
    # Проверяем есть ли @ в строке - если да, то это email
    if '@' in login_field:
        cur.execute(f"SELECT id, email, password_hash, username FROM t_p99956164_routine_planner_app.users WHERE email = '{escape_sql_string(login_field.lower())}'")
    else:
        cur.execute(f"SELECT id, email, password_hash, username FROM t_p99956164_routine_planner_app.users WHERE username = '{escape_sql_string(login_field)}'")
    
    user = cur.fetchone()
    
    if not user:
        return {
            'statusCode': 401,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Неверный логин или пароль'})
        }
    
    # Проверка пароля
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    if password_hash != user[2]:
        return {
            'statusCode': 401,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Неверный логин или пароль'})
        }
    
    # Создание JWT токена
    payload = {
        'user_id': user[0],
        'email': user[1],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
    }
    token = jwt.encode(payload, jwt_secret, algorithm='HS256')
    
    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user[0],
                'email': user[1],
                'username': user[3]
            }
        })
    }

def handle_verify_token(body_data: Dict[str, Any], jwt_secret: str, cors_headers: Dict[str, str]) -> Dict[str, Any]:
    '''Проверка валидности JWT токена'''
    token = body_data.get('token')
    
    if not token:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Token is required'})
        }
    
    try:
        payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': json.dumps({
                'valid': True,
                'user_id': payload.get('user_id'),
                'email': payload.get('email')
            })
        }
    except jwt.ExpiredSignatureError:
        return {
            'statusCode': 401,
            'headers': cors_headers,
            'body': json.dumps({'valid': False, 'error': 'Token expired'})
        }
    except jwt.InvalidTokenError:
        return {
            'statusCode': 401,
            'headers': cors_headers,
            'body': json.dumps({'valid': False, 'error': 'Invalid token'})
        }

def handle_reset_password(cur, conn, body_data: Dict[str, Any], cors_headers: Dict[str, str]) -> Dict[str, Any]:
    '''Запрос на восстановление пароля'''
    email = body_data.get('email', '').strip().lower()
    
    if not email:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Email обязателен'})
        }
    
    # Проверяем существует ли пользователь с таким email
    cur.execute(f"SELECT id, username FROM t_p99956164_routine_planner_app.users WHERE email = '{escape_sql_string(email)}'")
    user = cur.fetchone()
    
    if not user:
        # В целях безопасности не сообщаем, что пользователь не найден
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': json.dumps({'message': 'Если этот email зарегистрирован, вы получите код восстановления'})
        }
    
    # Генерируем 6-значный код восстановления
    import random
    reset_code = str(random.randint(100000, 999999))
    
    # Сохраняем код в БД (в реальном проекте код должен иметь срок действия)
    cur.execute(f"UPDATE t_p99956164_routine_planner_app.users SET reset_code = '{reset_code}' WHERE id = {user[0]}")
    conn.commit()
    
    # В реальном проекте здесь бы отправляли email с кодом
    # Для демонстрации просто возвращаем код (НЕ ДЕЛАЙТЕ ТАК В ПРОДАКШЕНЕ!)
    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({
            'message': 'Код восстановления отправлен на email',
            'demo_code': reset_code  # Только для демонстрации!
        })
    }

def handle_confirm_reset(cur, conn, body_data: Dict[str, Any], cors_headers: Dict[str, str]) -> Dict[str, Any]:
    '''Подтверждение восстановления пароля с кодом'''
    email = body_data.get('email', '').strip().lower()
    reset_code = body_data.get('reset_code', '').strip()
    new_password = body_data.get('new_password', '')
    
    if not email or not reset_code or not new_password:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Email, код восстановления и новый пароль обязательны'})
        }
    
    if len(new_password) < 6:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Пароль должен содержать минимум 6 символов'})
        }
    
    # Проверяем код восстановления
    cur.execute(f"SELECT id, username FROM t_p99956164_routine_planner_app.users WHERE email = '{escape_sql_string(email)}' AND reset_code = '{escape_sql_string(reset_code)}'")
    user = cur.fetchone()
    
    if not user:
        return {
            'statusCode': 401,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Неверный email или код восстановления'})
        }
    
    # Обновляем пароль и удаляем код восстановления
    password_hash = hashlib.sha256(new_password.encode()).hexdigest()
    cur.execute(f"UPDATE t_p99956164_routine_planner_app.users SET password_hash = '{password_hash}', reset_code = NULL WHERE id = {user[0]}")
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'message': 'Пароль успешно изменен'})
    }