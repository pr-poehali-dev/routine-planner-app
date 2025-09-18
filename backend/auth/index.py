import json
import os
import hashlib
import jwt
import datetime
from typing import Dict, Any, Optional
import psycopg

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
        with psycopg.connect(database_url) as conn:
            with conn.cursor() as cur:
                
                if method == 'POST':
                    body_data = json.loads(event.get('body', '{}'))
                    action = body_data.get('action')
                    
                    if action == 'register':
                        return handle_register(cur, conn, body_data, jwt_secret, cors_headers)
                    elif action == 'login':
                        return handle_login(cur, body_data, jwt_secret, cors_headers)
                    elif action == 'verify':
                        return handle_verify_token(body_data, jwt_secret, cors_headers)
                    
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
                        cur.execute(f"SELECT id, email, username FROM users WHERE id = {user_id}")
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
    
    # Проверка на существование пользователя
    cur.execute(f"SELECT id FROM users WHERE email = '{escape_sql_string(email)}'")
    if cur.fetchone():
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'User with this email already exists'})
        }
    
    # Хеширование пароля
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    # Создание пользователя
    cur.execute(
        f"INSERT INTO users (email, password_hash, username) VALUES ('{escape_sql_string(email)}', '{password_hash}', '{escape_sql_string(username)}') RETURNING id"
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
    '''Вход пользователя'''
    email = body_data.get('email', '').strip().lower()
    password = body_data.get('password', '')
    
    if not email or not password:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Email and password are required'})
        }
    
    # Поиск пользователя
    cur.execute(f"SELECT id, email, password_hash, username FROM users WHERE email = '{escape_sql_string(email)}'")
    user = cur.fetchone()
    
    if not user:
        return {
            'statusCode': 401,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Invalid email or password'})
        }
    
    # Проверка пароля
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    if password_hash != user[2]:
        return {
            'statusCode': 401,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Invalid email or password'})
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