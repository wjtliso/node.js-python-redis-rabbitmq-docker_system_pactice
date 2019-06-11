FROM python:3.7

WORKDIR /app
COPY app /app

RUN pip install pika Pillow redis pytest

CMD ["python", "-u", "worker.py"]