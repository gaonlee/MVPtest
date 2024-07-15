import os
import json
import requests

def handler(request):
    api_url = os.getenv('REACT_APP_API_URL')
    if not api_url:
        return {
            'statusCode': 500,
            'body': json.dumps('API URL is not defined in environment variables.')
        }
    try:
        response = requests.get(api_url + '/data')
        data = response.json()
        return {
            'statusCode': 200,
            'body': json.dumps(data)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }
