import os
import json
import requests

def handler(request):
    api_url = os.getenv('REACT_APP_API_URL')
    try:
        response = requests.get(api_url)
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
