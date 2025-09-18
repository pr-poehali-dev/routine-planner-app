import json
import os
from typing import Dict, Any, List
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление привычками - получение списка доступных привычек из БД
    Args: event - dict с httpMethod, queryStringParameters
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response со списком привычек из базы данных
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
        
        if not database_url:
            return {
                'statusCode': 500,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Database configuration error'})
            }
        
        # Подключение к базе данных
        conn = psycopg2.connect(database_url)
        try:
            cur = conn.cursor()
            
            if method == 'GET':
                # Получение всех привычек из базы данных
                cur.execute("""
                    SELECT id, title, description, image_url, category, emoji
                    FROM t_p99956164_routine_planner_app.routine_templates 
                    ORDER BY id
                """)
                
                rows = cur.fetchall()
                
                # Преобразование в формат для фронтенда
                habits = []
                for row in rows:
                    habit = {
                        'id': row[0],
                        'title': row[1].strip() if row[1] else '',
                        'description': row[2].strip() if row[2] else '',
                        'image': row[3] if row[3] else '',
                        'category': row[4] if row[4] else 'wellness',
                        'emoji': row[5] if row[5] else '⭐'
                    }
                    habits.append(habit)
                
                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({
                        'habits': habits,
                        'total': len(habits)
                    })
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