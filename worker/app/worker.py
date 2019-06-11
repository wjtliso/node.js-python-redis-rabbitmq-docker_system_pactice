import pika
import json
import io
from PIL import Image, ImageFilter
import redis
import os
import domain.thumbnail as thumbnail

REDIS_HOST = os.environ['REDIS_HOST']
REDIS_PORT = os.environ['REDIS_PORT']
RABBITMQ_HOST = os.environ['RABBITMQ_HOST']
SAVE_PATH = os.environ['SAVE_PATH']
QUEUE_NAME = os.environ['QUEUE_NAME']

def process_image(ch, method, properties, body):
    msg = json.loads(body.decode('utf-8'))
    print(" [x] Received image %s" % msg['image_id'])
    print(" [ ] Begin to process the image")
    save_path =  SAVE_PATH + "/" + msg['image_id'] + ".png"
    file_body = bytearray(msg['image_content']['data'])
    try:
        image = Image.open(io.BytesIO(file_body))
        resized_image = resize_image(image)
        resized_image.save(save_path, quality = 100)
        redis_db.set(msg['image_id'], save_path)
        print(" [x] Done")
    except:
        print(" [ ] Error! Something wrong when process the image %s" % msg['image_id'])
        save_error_file(msg['image_id'], msg['image_name'], file_body)
    finally:
        ch.basic_ack(delivery_tag = method.delivery_tag)

def save_error_file(file_id, file_name, file_body):
    path = SAVE_PATH + "/" + file_id + "|" + file_name
    with open(path, "wb") as f:
        f.write(file_body)
    print(" [x] Save error file: %s" % path)

def resize_image(image):
    width, height = image.size
    return image.resize(thumbnail.get_new_size_of_image(width, height), resample = Image.BICUBIC)


connection = pika.BlockingConnection (
    pika.ConnectionParameters(
        host = RABBITMQ_HOST, 
        connection_attempts = 20,
        retry_delay = 20    
    )
)
print("***************************")
print("* Connectted the rabbitmq *")
print("***************************")
channel = connection.channel()
redis_db = redis.Redis(host = REDIS_HOST, port = int(REDIS_PORT), db = 0)
channel.queue_declare(queue = QUEUE_NAME, durable = True)
print(' [*] Waiting for messages. To exit press CTRL+C')
channel.basic_qos(prefetch_count = 1)
channel.basic_consume(queue = QUEUE_NAME, on_message_callback = process_image)
channel.start_consuming()